from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Count, Sum
from users.models import CustomUser
from events.models import Event
from tickets.models import Ticket
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q
from tickets.models import Ticket, TicketType
import logging
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta

logger = logging.getLogger(__name__)

# class AdminStatsView(APIView):
#     permission_classes = [IsAdminUser]

#     def get(self, request):
#         try:
#             logger.info('Fetching admin stats...')
#             total_users = CustomUser.objects.count()
#             logger.info(f'Total users: {total_users}')
#             total_events = Event.objects.count()
#             logger.info(f'Total events: {total_events}')
#             total_tickets = Ticket.objects.count()
#             logger.info(f'Total tickets: {total_tickets}')
#             # Calculate revenue by joining Ticket with TicketType
#             revenue = float(Ticket.objects.filter(status='active')
#                            .aggregate(total=Sum('ticket_type__price'))['total'] or 0)
#             logger.info(f'Revenue: {revenue}')
#             stats = {
#                 'totalUsers': total_users,
#                 'totalEvents': total_events,
#                 'totalTickets': total_tickets,
#                 'revenue': revenue
#             }
#             return Response({
#                 'status': 'success',
#                 'data': stats
#             })
#         except Exception as e:
#             logger.error(f"Error fetching admin stats: {str(e)}", exc_info=True)
#             return Response({
#                 'status': 'error',
#                 'message': f'Failed to fetch statistics: {str(e)}'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


logger = logging.getLogger(__name__)

class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        logger.info('Fetching admin stats...')
        try:
            # Get period from query params (default: 30 days)
            period = request.query_params.get('period', '30d')
            if period == '7d':
                days = 7
            elif period == '90d':
                days = 90
            else:
                days = 30  # Default to 30d

            # Current stats
            current_date = timezone.now()
            start_date = current_date - timezone.timedelta(days=days)

            total_users = CustomUser.objects.filter(
                is_active=True,
                date_joined__gte=start_date
            ).count()
            total_events = Event.objects.filter(
                is_active=True,
                created_at__gte=start_date
            ).count()

            # Calculate total tickets and revenue
            total_tickets = 0
            revenue = 0
            for event in Event.objects.filter(is_active=True, created_at__gte=start_date):
                ticket_types = TicketType.objects.filter(event=event)
                for ticket_type in ticket_types:
                    total_tickets += ticket_type.available_quantity or 0
                    sold_tickets = Ticket.objects.filter(
                        ticket_type=ticket_type,
                        created_date__gte=start_date  # Changed from purchase_date
                    )
                    revenue += sum(
                        ticket.final_price or 0 for ticket in sold_tickets
                        if ticket.final_price is not None
                    )

            # Previous period stats
            prev_start_date = start_date - timezone.timedelta(days=days)
            prev_users = CustomUser.objects.filter(
                is_active=True,
                date_joined__gte=prev_start_date,
                date_joined__lt=start_date
            ).count()
            prev_events = Event.objects.filter(
                is_active=True,
                created_at__gte=prev_start_date,
                created_at__lt=start_date
            ).count()

            prev_tickets = 0
            prev_revenue = 0
            for event in Event.objects.filter(
                is_active=True,
                created_at__gte=prev_start_date,
                created_at__lt=start_date
            ):
                ticket_types = TicketType.objects.filter(event=event)
                for ticket_type in ticket_types:
                    prev_tickets += ticket_type.available_quantity or 0
                    sold_tickets = Ticket.objects.filter(
                        ticket_type=ticket_type,
                        created_date__gte=prev_start_date,  # Changed from purchase_date
                        created_date__lt=start_date
                    )
                    prev_revenue += sum(
                        ticket.final_price or 0 for ticket in sold_tickets
                        if ticket.final_price is not None
                    )

            # Monthly stats for trends
            monthly_stats = {
                'labels': [],
                'users': [],
                'events': [],
                'tickets': [],
                'revenue': []
            }
            for i in range(6):
                month_start = (current_date - relativedelta(months=i)).replace(
                    day=1, hour=0, minute=0, second=0, microsecond=0
                )
                month_end = month_start + relativedelta(months=1)

                monthly_stats['labels'].insert(0, month_start.strftime('%B %Y'))

                monthly_users = CustomUser.objects.filter(
                    is_active=True,
                    date_joined__gte=month_start,
                    date_joined__lt=month_end
                ).count()
                monthly_events = Event.objects.filter(
                    is_active=True,
                    created_at__gte=month_start,
                    created_at__lt=month_end
                ).count()

                monthly_tickets = 0
                monthly_revenue = 0
                for event in Event.objects.filter(
                    is_active=True,
                    created_at__gte=month_start,
                    created_at__lt=month_end
                ):
                    ticket_types = TicketType.objects.filter(event=event)
                    for ticket_type in ticket_types:
                        monthly_tickets += ticket_type.available_quantity or 0
                        sold_tickets = Ticket.objects.filter(
                            ticket_type=ticket_type,
                            created_date__gte=month_start,  # Changed from purchase_date
                            created_date__lt=month_end
                        )
                        monthly_revenue += sum(
                            ticket.final_price or 0 for ticket in sold_tickets
                            if ticket.final_price is not None
                        )

                monthly_stats['users'].insert(0, monthly_users)
                monthly_stats['events'].insert(0, monthly_events)
                monthly_stats['tickets'].insert(0, monthly_tickets)
                monthly_stats['revenue'].insert(0, monthly_revenue)

            stats = {
                'current': {
                    'totalUsers': total_users,
                    'totalEvents': total_events,
                    'totalTickets': total_tickets,
                    'revenue': float(revenue)
                },
                'previous': {
                    'totalUsers': prev_users,
                    'totalEvents': prev_events,
                    'totalTickets': prev_tickets,
                    'revenue': float(prev_revenue)
                },
                'monthly': monthly_stats
            }

            logger.info('Successfully fetched admin stats')
            logger.debug(f'Stats data: {stats}')
            return Response({
                'status': 'success',
                'data': stats
            })

        except Exception as e:
            logger.error(f"Error fetching admin stats: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': f'Failed to fetch statistics: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_events_stats(request):
    try:
        user = request.user
        user_events = Event.objects.filter(Q(creator=user) | Q(creator__isnull=True))
        
        total_events = user_events.count()
        total_tickets = Ticket.objects.filter(event__in=user_events).count()
        total_revenue = Ticket.objects.filter(
            event__in=user_events,
            status='active'
        ).aggregate(
            total=Sum('final_price')
        )['total'] or 0
        
        events_data = []
        for event in user_events:
            tickets = Ticket.objects.filter(event=event)
            tickets_sold = tickets.count()
            revenue = tickets.filter(status='active').aggregate(
                total=Sum('final_price')
            )['total'] or 0
            
            ticket_type = TicketType.objects.filter(event=event).first()
            
            events_data.append({
                'id': event.id,
                'name': event.title,
                'date': event.dates.get('start_date') if hasattr(event, 'dates') and event.dates else None,
                'ticketsSold': tickets_sold,
                'totalTickets': TicketType.objects.filter(event=event).aggregate(
                    total=Sum('available_quantity')
                )['total'] or 0,
                'price': float(ticket_type.price) if ticket_type else 0,
                'revenue': float(revenue),
                'status': 'ACTIVE' if hasattr(event, 'end_sales') and event.end_sales and event.end_sales > timezone.now() else 'ENDED'
            })
        
        today = timezone.now()
        last_90_days = today - timedelta(days=90)
        
        monthly_stats = Ticket.objects.filter(
            event__in=user_events,
            created_date__gte=last_90_days,
            status='active'
        ).extra(
            select={'month': "DATE_TRUNC('month', created_date)"}
        ).values('month').annotate(
            tickets=Count('id'),
            revenue=Sum('final_price')
        ).order_by('month')
        
        response_data = {
            'status': 'success',
            'data': {
                'current': {
                    'totalEvents': total_events,
                    'totalTickets': total_tickets,
                    'revenue': float(total_revenue)
                },
                'events': events_data,
                'monthly': {
                    'labels': [stat['month'].strftime('%B %Y') for stat in monthly_stats],
                    'tickets': [stat['tickets'] for stat in monthly_stats],
                    'revenue': [float(stat['revenue'] or 0) for stat in monthly_stats]
                }
            }
        }
        
        logger.info('Successfully fetched user events stats')
        return Response(response_data)
        
    except Exception as e:
        logger.error(f"Error fetching user events stats: {str(e)}", exc_info=True)
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class AdminUsersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, user_id=None):
        try:
            if user_id:
                user = CustomUser.objects.get(id=user_id)
                return Response({
                    'status': 'success',
                    'data': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'is_active': user.is_active,
                        'date_joined': user.date_joined
                    }
                })
            
            users = CustomUser.objects.all().values(
                'id', 'username', 'email', 'date_joined', 'is_active'
            )
            return Response({
                'status': 'success',
                'data': list(users)
            })
        except CustomUser.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            for key, value in request.data.items():
                if key != 'password':  # Don't update password directly
                    setattr(user, key, value)
            user.save()
            return Response({
                'status': 'success',
                'message': 'User updated successfully',
                'data': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_active': user.is_active
                }
            })
        except CustomUser.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id):
        try:
            # Get the user to delete
            user = CustomUser.objects.get(id=user_id)
            
            # Check if user is trying to delete themselves
            if request.user.id == user_id:
                return Response({
                    'status': 'error',
                    'message': 'You cannot delete your own account'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user is a superuser
            if user.is_superuser:
                return Response({
                    'status': 'error',
                    'message': 'Cannot delete superuser accounts'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check for related data
            related_data = {
                'events': user.created_events.count(),
                'tickets': user.ticket_set.count(),
                'organizer': hasattr(user, 'organizer_company')
            }
            
            if any(related_data.values()):
                message = "Unable to delete user. Please handle the following data first:\n"
                if related_data['events']:
                    message += f"- User has {related_data['events']} created events\n"
                if related_data['tickets']:
                    message += f"- User has {related_data['tickets']} purchased tickets\n"
                if related_data['organizer']:
                    message += "- User has organizer company data\n"
                
                return Response({
                    'status': 'error',
                    'message': message.strip(),
                    'related_data': related_data
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # If no related data, proceed with deletion
            user.delete()
            return Response({
                'status': 'success',
                'message': 'User deleted successfully'
            })
                
        except CustomUser.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Log the general error
            logger.error(f"Unexpected error while deleting user {user_id}: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'An unexpected error occurred'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminEventsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            events = Event.objects.all().values(
                'id', 'title', 'date', 'location', 'status'
            )
            return Response(
                {
                    'data': list(events),
                    'status': 'success'
                }, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    'error': str(e),
                    'status': 'error'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AdminLoginView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')

            if not email or not password:
                return Response({
                    'status': 'error',
                    'message': 'Email and password are required'
                }, status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(username=email, password=password)

            if not user:
                return Response({
                    'status': 'error',
                    'message': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)

            if not user.is_staff:
                return Response({
                    'status': 'error',
                    'message': 'User is not an admin'
                }, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)

            return Response({
                'status': 'success',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user_type': 'admin',
                'user_data': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'is_staff': user.is_staff
                }
            })

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) # Allow unauthenticated access

    def put(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            for key, value in request.data.items():
                if key != 'password':  # Don't update password directly
                    setattr(user, key, value)
            user.save()
            return Response({
                'status': 'success',
                'message': 'User updated successfully',
                'data': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_active': user.is_active
                }
            })
        except CustomUser.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            user.delete()
            return Response({
                'status': 'success',
                'message': 'User deleted successfully'
            })
        except CustomUser.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    