from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import Payment
from tickets.models import Ticket
import stripe
import json
import os
from django.conf import settings
import paypalrestsdk
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

# Configure Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

# Configure PayPal
paypalrestsdk.configure({
    "mode": "sandbox",  # Change to "live" for production
    "client_id": settings.PAYPAL_CLIENT_ID,
    "client_secret": settings.PAYPAL_SECRET
})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment(request):
    try:
        ticket_id = request.data.get('ticket_id')
        ticket = get_object_or_404(Ticket, id=ticket_id, user=request.user)
        
        # Create PayPal payment
        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "transactions": [{
                "amount": {
                    "total": str(ticket.final_price),
                    "currency": "USD"
                },
                "description": f"Ticket purchase for {ticket.event.title}"
            }],
            "redirect_urls": {
                "return_url": f"{settings.FRONTEND_URL}/payment/success",
                "cancel_url": f"{settings.FRONTEND_URL}/payment/cancel"
            }
        })

        if payment.create():
            # Create payment record in database
            db_payment = Payment.objects.create(
                user=request.user,
                ticket=ticket,
                amount=ticket.final_price,
                payment_method='paypal',
                transaction_id=payment.id
            )

            # Get approval URL
            approval_url = next(link.href for link in payment.links if link.rel == 'approval_url')
            return Response({
                'approval_url': approval_url,
                'payment_id': db_payment.id
            })
        else:
            return Response({
                'error': payment.error
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def execute_payment(request):
    try:
        payment_id = request.data.get('payment_id')
        paypal_payment_id = request.data.get('paypal_payment_id')
        payer_id = request.data.get('payer_id')
        
        payment = get_object_or_404(Payment, id=payment_id, user=request.user)
        
        # Execute PayPal payment
        paypal_payment = paypalrestsdk.Payment.find(paypal_payment_id)
        if paypal_payment.execute({"payer_id": payer_id}):
            payment.status = 'COMPLETED'
            payment.save()
            
            # Update ticket status
            ticket = payment.ticket
            ticket.status = 'PAID'
            ticket.save()
            
            return Response({
                'status': 'Payment completed',
                'ticket': {
                    'id': ticket.id,
                    'status': ticket.status,
                    'event_title': ticket.event.title,
                    'ticket_type': ticket.ticket_type.name,
                    'final_price': float(ticket.final_price)
                }
            })
        else:
            payment.status = 'FAILED'
            payment.save()
            return Response({
                'error': 'PayPal payment failed'
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@require_POST
@api_view(['POST'])
@permission_classes([AllowAny])
def stripe_webhook_view(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return HttpResponse(status=400)

    # Handle the event
    if event.type == 'payment_intent.succeeded':
        payment_intent = event.data.object
        # Update ticket status
        try:
            payment = Payment.objects.get(payment_intent_id=payment_intent.id)
            ticket = payment.ticket
            ticket.status = 'PAID'
            ticket.save()
            
            payment.status = 'COMPLETED'
            payment.save()
        except Payment.DoesNotExist:
            return HttpResponse(status=404)
            
    elif event.type == 'payment_intent.payment_failed':
        payment_intent = event.data.object
        try:
            payment = Payment.objects.get(payment_intent_id=payment_intent.id)
            ticket = payment.ticket
            ticket.status = 'PAYMENT_FAILED'
            ticket.save()
            
            payment.status = 'FAILED'
            payment.save()
        except Payment.DoesNotExist:
            return HttpResponse(status=404)

    return HttpResponse(status=200)
