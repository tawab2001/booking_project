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

logger = logging.getLogger(__name__)

class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            logger.info('Fetching admin stats...')
            total_users = CustomUser.objects.count()
            logger.info(f'Total users: {total_users}')
            total_events = Event.objects.count()
            logger.info(f'Total events: {total_events}')
            total_tickets = Ticket.objects.count()
            logger.info(f'Total tickets: {total_tickets}')
            # Calculate revenue by joining Ticket with TicketType
            revenue = float(Ticket.objects.filter(status='active')
                           .aggregate(total=Sum('ticket_type__price'))['total'] or 0)
            logger.info(f'Revenue: {revenue}')
            stats = {
                'totalUsers': total_users,
                'totalEvents': total_events,
                'totalTickets': total_tickets,
                'revenue': revenue
            }
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
    