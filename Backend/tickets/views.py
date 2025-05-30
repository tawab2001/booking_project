from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import Ticket, TicketType
from .serializers import TicketSerializer, TicketTypeSerializer
import uuid
from django.db import transaction

# Create your views here.

class TicketTypeViewSet(viewsets.ModelViewSet):
    queryset = TicketType.objects.all()
    serializer_class = TicketTypeSerializer
    permission_classes = [AllowAny]  # Allow anyone to view ticket types

    def get_queryset(self):
        queryset = TicketType.objects.all()
        event_id = self.request.query_params.get('event', None)
        if event_id is not None:
            queryset = queryset.filter(event_id=event_id)
        return queryset

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='book-tickets')
    def book_tickets(self, request):
        try:
            with transaction.atomic():
                event_id = request.data.get('event')
                ticket_type_id = request.data.get('ticket_type')
                quantity = int(request.data.get('quantity', 1))
                payment_method = request.data.get('payment_method')

                ticket_type = get_object_or_404(TicketType, id=ticket_type_id)

                # Validate quantity
                if quantity > ticket_type.max_per_person:
                    return Response(
                        {'error': f'Maximum {ticket_type.max_per_person} tickets allowed per person'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if quantity > ticket_type.available_quantity:
                    return Response(
                        {'error': 'Not enough tickets available'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Create tickets
                tickets = []
                for _ in range(quantity):
                    ticket = Ticket.objects.create(
                        user=request.user,
                        event_id=event_id,
                        ticket_type=ticket_type,
                        qr_code=str(uuid.uuid4()),
                        payment_method=payment_method
                    )
                    tickets.append(ticket)

                # Update available quantity
                ticket_type.available_quantity -= quantity
                ticket_type.save()

                serializer = TicketSerializer(tickets, many=True)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], url_path='print-ticket')
    def print_ticket(self, request, pk=None):
        ticket = self.get_object()
        if ticket.user != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TicketSerializer(ticket)
        return Response(serializer.data)
