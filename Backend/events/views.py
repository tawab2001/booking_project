# from django.shortcuts import render

# from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status, generics
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from .serializers import EventSerializer
# from .models import Event
# from tickets.models import TicketType, Ticket
# from django.db import transaction
# from django.db.models import Sum, Count
# from django.utils import timezone
# from datetime import timedelta
# from .serializers import TicketTypeSerializer
# from users.models import OrganizerCompany
# import logging

# logger = logging.getLogger(__name__)

# class EventCreateView(APIView):
#     parser_classes = [MultiPartParser, FormParser]
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         try:
#             # Check if user is an organizer
#             if not hasattr(request.user, 'organizer_company'):
#                 return Response(
#                     {'message': 'Only organizers can create events'},
#                     status=status.HTTP_403_FORBIDDEN
#                 )

#             # Add organizer to request data
#             data = request.data.copy()
#             data['organizer'] = request.user.organizer_company.id
#             data['creator'] = request.user.id

#             serializer = EventSerializer(data=data)
#             if serializer.is_valid():
#                 event = serializer.save()
#                 return Response({
#                     'status': 'success',
#                     'message': 'Event created successfully!',
#                     'data': EventSerializer(event).data
#                 }, status=status.HTTP_201_CREATED)
#             return Response({
#                 'status': 'error',
#                 'message': 'Invalid data',
#                 'errors': serializer.errors
#             }, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             logger.error(f"Error creating event: {str(e)}")
#             return Response({
#                 'status': 'error',
#                 'message': str(e)
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
   
      
# # Add this for single event operations
# class EventDetailView(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request, pk):
#         try:
#             event = Event.objects.get(pk=pk)
#             serializer = EventSerializer(event)
#             return Response(serializer.data)
#         except Event.DoesNotExist:
#             return Response(
#                 {"error": "Event not found"}, 
#                 status=status.HTTP_404_NOT_FOUND
#             )     

# class EventListView(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request):
#         events = Event.objects.all().order_by('-id')
#         serializer = EventSerializer(events, many=True)
#         return Response(serializer.data)

# class EventViewSet(generics.GenericAPIView):
#     queryset = Event.objects.all()
#     serializer_class = EventSerializer

#     def create(self, request, *args, **kwargs):
#         with transaction.atomic():
#             # Create the event first
#             serializer = self.get_serializer(data=request.data)
#             serializer.is_valid(raise_exception=True)
#             event = serializer.save()

#             # Create ticket types from the tickets JSON field
#             tickets_data = event.tickets
#             if tickets_data:
#                 for ticket_type, details in tickets_data.items():
#                     TicketType.objects.create(
#                         event=event,
#                         name=ticket_type.capitalize(),
#                         price=float(details.get('price', 0)),
#                         max_per_person=int(details.get('max_per_person', 1)),
#                         available_quantity=int(details.get('quantity', 0)),
#                     )

#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#     def update(self, request, *args, **kwargs):
#         with transaction.atomic():
#             instance = self.get_object()
#             serializer = self.get_serializer(instance, data=request.data, partial=True)
#             serializer.is_valid(raise_exception=True)
#             event = serializer.save()

#             # Update ticket types if tickets field is updated
#             tickets_data = event.tickets
#             if tickets_data:
#                 # Delete existing ticket types
#                 TicketType.objects.filter(event=event).delete()
                
#                 # Create new ticket types
#                 for ticket_type, details in tickets_data.items():
#                     TicketType.objects.create(
#                         event=event,
#                         name=ticket_type.capitalize(),
#                         price=float(details.get('price', 0)),
#                         max_per_person=int(details.get('max_per_person', 1)),
#                         available_quantity=int(details.get('quantity', 0)),
#                     )

#         return Response(serializer.data)

# class OrganizerEventListView(APIView):
#     permission_classes = [IsAuthenticated]
#     parser_classes = (MultiPartParser, FormParser)

#     def get(self, request):
#         try:
#             # Get organizer company for the authenticated user
#             organizer = OrganizerCompany.objects.get(user=request.user)
            
#             # Get all events for this organizer
#             events = Event.objects.filter(organizer=organizer)
#             serializer = EventSerializer(events, many=True)
            
#             return Response({
#                 'status': 'success',
#                 'data': serializer.data
#             })
#         except OrganizerCompany.DoesNotExist:
#             return Response({
#                 'status': 'error',
#                 'message': 'User is not an organizer'
#             }, status=status.HTTP_403_FORBIDDEN)
#         except Exception as e:
#             logger.error(f"Error fetching organizer events: {str(e)}")
#             return Response({
#                 'status': 'error',
#                 'message': 'Failed to fetch events'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     def post(self, request):
#         try:
#             # Get organizer company
#             organizer = OrganizerCompany.objects.get(user=request.user)
            
#             # Add organizer to request data
#             data = request.data.copy()
#             data['organizer'] = organizer.id
            
#             serializer = EventSerializer(data=data)
#             if serializer.is_valid():
#                 event = serializer.save()
                
#                 # Create ticket types if provided
#                 ticket_types_data = request.data.get('ticket_types', [])
#                 for ticket_type in ticket_types_data:
#                     ticket_type['event'] = event.id
#                     ticket_serializer = TicketTypeSerializer(data=ticket_type)
#                     if ticket_serializer.is_valid():
#                         ticket_serializer.save()
                
#                 return Response({
#                     'status': 'success',
#                     'message': 'Event created successfully',
#                     'data': EventSerializer(event).data
#                 }, status=status.HTTP_201_CREATED)
            
#             return Response({
#                 'status': 'error',
#                 'message': 'Invalid data',
#                 'errors': serializer.errors
#             }, status=status.HTTP_400_BAD_REQUEST)
            
#         except OrganizerCompany.DoesNotExist:
#             return Response({
#                 'status': 'error',
#                 'message': 'User is not an organizer'
#             }, status=status.HTTP_403_FORBIDDEN)
#         except Exception as e:
#             logger.error(f"Error creating event: {str(e)}")
#             return Response({
#                 'status': 'error',
#                 'message': 'Failed to create event'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class OrganizerEventDetailView(APIView):
#     permission_classes = [IsAuthenticated]
#     parser_classes = (MultiPartParser, FormParser)

#     def get_event(self, event_id, organizer):
#         try:
#             return Event.objects.get(id=event_id, organizer=organizer)
#         except Event.DoesNotExist:
#             return None

#     def get(self, request, event_id):
#         try:
#             organizer = OrganizerCompany.objects.get(user=request.user)
#             event = self.get_event(event_id, organizer)
            
#             if not event:
#                 return Response({
#                     'status': 'error',
#                     'message': 'Event not found'
#                 }, status=status.HTTP_404_NOT_FOUND)
            
#             serializer = EventSerializer(event)
#             return Response({
#                 'status': 'success',
#                 'data': serializer.data
#             })
#         except OrganizerCompany.DoesNotExist:
#             return Response({
#                 'status': 'error',
#                 'message': 'User is not an organizer'
#             }, status=status.HTTP_403_FORBIDDEN)
#         except Exception as e:
#             logger.error(f"Error fetching event details: {str(e)}")
#             return Response({
#                 'status': 'error',
#                 'message': 'Failed to fetch event details'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     def put(self, request, event_id):
#         try:
#             organizer = OrganizerCompany.objects.get(user=request.user)
#             event = self.get_event(event_id, organizer)
            
#             if not event:
#                 return Response({
#                     'status': 'error',
#                     'message': 'Event not found'
#                 }, status=status.HTTP_404_NOT_FOUND)
            
#             data = request.data.copy()
#             data['organizer'] = organizer.id
            
#             serializer = EventSerializer(event, data=data, partial=True)
#             if serializer.is_valid():
#                 event = serializer.save()
                
#                 # Update ticket types if provided
#                 if 'ticket_types' in request.data:
#                     # Delete existing ticket types
#                     event.ticket_types.all().delete()
                    
#                     # Create new ticket types
#                     for ticket_type in request.data['ticket_types']:
#                         ticket_type['event'] = event.id
#                         ticket_serializer = TicketTypeSerializer(data=ticket_type)
#                         if ticket_serializer.is_valid():
#                             ticket_serializer.save()
                
#                 return Response({
#                     'status': 'success',
#                     'message': 'Event updated successfully',
#                     'data': EventSerializer(event).data
#                 })
            
#             return Response({
#                 'status': 'error',
#                 'message': 'Invalid data',
#                 'errors': serializer.errors
#             }, status=status.HTTP_400_BAD_REQUEST)
            
#         except OrganizerCompany.DoesNotExist:
#             return Response({
#                 'status': 'error',
#                 'message': 'User is not an organizer'
#             }, status=status.HTTP_403_FORBIDDEN)
#         except Exception as e:
#             logger.error(f"Error updating event: {str(e)}")
#             return Response({
#                 'status': 'error',
#                 'message': 'Failed to update event'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     def delete(self, request, event_id):
#         try:
#             organizer = OrganizerCompany.objects.get(user=request.user)
#             event = self.get_event(event_id, organizer)
            
#             if not event:
#                 return Response({
#                     'status': 'error',
#                     'message': 'Event not found'
#                 }, status=status.HTTP_404_NOT_FOUND)
            
#             event.delete()
#             return Response({
#                 'status': 'success',
#                 'message': 'Event deleted successfully'
#             })
            
#         except OrganizerCompany.DoesNotExist:
#             return Response({
#                 'status': 'error',
#                 'message': 'User is not an organizer'
#             }, status=status.HTTP_403_FORBIDDEN)
#         except Exception as e:
#             logger.error(f"Error deleting event: {str(e)}")
#             return Response({
#                 'status': 'error',
#                 'message': 'Failed to delete event'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class OrganizerDashboardStatsView(generics.GenericAPIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         try:
#             # Debug logging
#             print(f"User: {request.user.email}")
#             print(f"Is organizer: {hasattr(request.user, 'organizer_company')}")
            
#             # Check if user is an organizer
#             if not hasattr(request.user, 'organizer_company'):
#                 return Response(
#                     {"message": "User is not an organizer"},
#                     status=status.HTTP_403_FORBIDDEN
#                 )

#             # Get organizer's events
#             events = Event.objects.filter(organizer=request.user.organizer_company)
            
#             # Debug logging
#             print(f"Total events found: {events.count()}")
#             print(f"Events: {list(events.values_list('title', flat=True))}")
            
#             # Get events from the last 30 days
#             thirty_days_ago = timezone.now() - timedelta(days=30)
#             recent_events = events.filter(created_at__gte=thirty_days_ago)

#             # Calculate statistics
#             total_events = events.count()
#             total_tickets_sold = Ticket.objects.filter(ticket_type__event__in=events).count()
#             total_revenue = Ticket.objects.filter(
#                 ticket_type__event__in=events
#             ).aggregate(
#                 total=Sum('final_price')
#             )['total'] or 0

#             # Get recent events with their statistics
#             recent_events_data = []
#             for event in recent_events:
#                 ticket_types = TicketType.objects.filter(event=event)
#                 tickets = Ticket.objects.filter(ticket_type__event=event)
                
#                 total_tickets = sum(tt.available_quantity for tt in ticket_types)
#                 tickets_sold = tickets.count()
#                 event_revenue = tickets.aggregate(total=Sum('final_price'))['total'] or 0

#                 recent_events_data.append({
#                     'id': event.id,
#                     'title': event.title,
#                     'created_at': event.created_at,
#                     'is_active': event.is_active,
#                     'total_tickets': total_tickets,
#                     'total_tickets_sold': tickets_sold,
#                     'total_revenue': event_revenue,
#                     'min_price': min(tt.price for tt in ticket_types) if ticket_types else 0,
#                     'max_price': max(tt.price for tt in ticket_types) if ticket_types else 0,
#                 })

#             return Response({
#                 'status': 'success',
#                 'data': {
#                     'total_events': total_events,
#                     'total_tickets_sold': total_tickets_sold,
#                     'total_revenue': float(total_revenue),
#                     'recent_events': recent_events_data
#                 }
#             })
#         except Exception as e:
#             logger.error(f"Error fetching dashboard stats: {str(e)}")
#             return Response({
#                 'status': 'error',
#                 'message': str(e)
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from django.shortcuts import render
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import EventSerializer, TicketTypeSerializer
from .models import Event, Withdrawal
from tickets.models import TicketType, Ticket
from django.db import transaction
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from users.models import OrganizerCompany
import logging

logger = logging.getLogger(__name__)

# Existing views (unchanged)
class EventCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            if not hasattr(request.user, 'organizer_company'):
                return Response(
                    {'message': 'Only organizers can create events'},
                    status=status.HTTP_403_FORBIDDEN
                )

            data = request.data.copy()
            data['organizer'] = request.user.organizer_company.id
            data['creator'] = request.user.id

            serializer = EventSerializer(data=data)
            if serializer.is_valid():
                event = serializer.save()
                return Response({
                    'status': 'success',
                    'message': 'Event created successfully!',
                    'data': EventSerializer(event).data
                }, status=status.HTTP_201_CREATED)
            return Response({
                'status': 'error',
                'message': 'Invalid data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error creating event: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EventDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
            serializer = EventSerializer(event)
            return Response(serializer.data)
        except Event.DoesNotExist:
            return Response(
                {"error": "Event not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

class EventListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        events = Event.objects.all().order_by('-id')
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

class EventViewSet(generics.GenericAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            event = serializer.save()

            tickets_data = event.tickets
            if tickets_data:
                for ticket_type, details in tickets_data.items():
                    TicketType.objects.create(
                        event=event,
                        name=ticket_type.capitalize(),
                        price=float(details.get('price', 0)),
                        max_per_person=int(details.get('max_per_person', 1)),
                        available_quantity=int(details.get('quantity', 0)),
                    )

            return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        with transaction.atomic():
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            event = serializer.save()

            tickets_data = event.tickets
            if tickets_data:
                TicketType.objects.filter(event=event).delete()
                for ticket_type, details in tickets_data.items():
                    TicketType.objects.create(
                        event=event,
                        name=ticket_type.capitalize(),
                        price=float(details.get('price', 0)),
                        max_per_person=int(details.get('max_per_person', 1)),
                        available_quantity=int(details.get('quantity', 0)),
                    )

        return Response(serializer.data)

class OrganizerEventListView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        try:
            organizer = OrganizerCompany.objects.get(user=request.user)
            events = Event.objects.filter(organizer=organizer)
            serializer = EventSerializer(events, many=True)
            return Response({
                'status': 'success',
                'data': serializer.data
            })
        except OrganizerCompany.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'User is not an organizer'
            }, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            logger.error(f"Error fetching organizer events: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Failed to fetch events'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            organizer = OrganizerCompany.objects.get(user=request.user)
            data = request.data.copy()
            data['organizer'] = organizer.id
            serializer = EventSerializer(data=data)
            if serializer.is_valid():
                event = serializer.save()
                ticket_types_data = request.data.get('ticket_types', [])
                for ticket_type in ticket_types_data:
                    ticket_type['event'] = event.id
                    ticket_serializer = TicketTypeSerializer(data=ticket_type)
                    if ticket_serializer.is_valid():
                        ticket_serializer.save()
                return Response({
                    'status': 'success',
                    'message': 'Event created successfully',
                    'data': EventSerializer(event).data
                }, status=status.HTTP_201_CREATED)
            return Response({
                'status': 'error',
                'message': 'Invalid data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        except OrganizerCompany.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'User is not an organizer'
            }, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            logger.error(f"Error creating event: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Failed to create event'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OrganizerEventDetailView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_event(self, event_id, organizer):
        try:
            return Event.objects.get(id=event_id, organizer=organizer)
        except Event.DoesNotExist:
            return None

    def get(self, request, event_id):
        try:
            organizer = OrganizerCompany.objects.get(user=request.user)
            event = self.get_event(event_id, organizer)
            if not event:
                return Response({
                    'status': 'error',
                    'message': 'Event not found'
                }, status=status.HTTP_404_NOT_FOUND)
            serializer = EventSerializer(event)
            return Response({
                'status': 'success',
                'data': serializer.data
            })
        except OrganizerCompany.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'User is not an organizer'
            }, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            logger.error(f"Error fetching event details: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Failed to fetch event details'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, event_id):
        try:
            organizer = OrganizerCompany.objects.get(user=request.user)
            event = self.get_event(event_id, organizer)
            if not event:
                return Response({
                    'status': 'error',
                    'message': 'Event not found'
                }, status=status.HTTP_404_NOT_FOUND)
            data = request.data.copy()
            data['organizer'] = organizer.id
            serializer = EventSerializer(event, data=data, partial=True)
            if serializer.is_valid():
                event = serializer.save()
                if 'ticket_types' in request.data:
                    event.ticket_types.all().delete()
                    for ticket_type in request.data['ticket_types']:
                        ticket_type['event'] = event.id
                        ticket_serializer = TicketTypeSerializer(data=ticket_type)
                        if ticket_serializer.is_valid():
                            ticket_serializer.save()
                return Response({
                    'status': 'success',
                    'message': 'Event updated successfully',
                    'data': EventSerializer(event).data
                })
            return Response({
                'status': 'error',
                'message': 'Invalid data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        except OrganizerCompany.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'User is not an organizer'
            }, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            logger.error(f"Error updating event: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Failed to update event'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, event_id):
        try:
            organizer = OrganizerCompany.objects.get(user=request.user)
            event = self.get_event(event_id, organizer)
            if not event:
                return Response({
                    'status': 'error',
                    'message': 'Event not found'
                }, status=status.HTTP_404_NOT_FOUND)
            event.delete()
            return Response({
                'status': 'success',
                'message': 'Event deleted successfully'
            })
        except OrganizerCompany.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'User is not an organizer'
            }, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            logger.error(f"Error deleting event: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Failed to delete event'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OrganizerDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            print(f"User: {request.user.email}")
            print(f"Is organizer: {hasattr(request.user, 'organizer_company')}")
            
            if not hasattr(request.user, 'organizer_company'):
                return Response(
                    {"message": "User is not an organizer"},
                    status=status.HTTP_403_FORBIDDEN
                )

            events = Event.objects.filter(organizer=request.user.organizer_company)
            print(f"Total events found: {events.count()}")
            print(f"Events: {list(events.values_list('title', flat=True))}")
            
            thirty_days_ago = timezone.now() - timedelta(days=30)
            recent_events = events.filter(created_at__gte=thirty_days_ago)

            total_events = events.count()
            total_tickets_sold = Ticket.objects.filter(ticket_type__event__in=events).count()
            total_revenue = Ticket.objects.filter(
                ticket_type__event__in=events
            ).aggregate(
                total=Sum('final_price')
            )['total'] or 0

            # Calculate withdrawable earnings
            platform_fee = total_tickets_sold * 2  # $2 per ticket
            withdrawn_amount = Withdrawal.objects.filter(
                user=request.user, status='completed'
            ).aggregate(total=Sum('amount'))['total'] or 0
            pending_withdrawals = Withdrawal.objects.filter(
                user=request.user, status='pending'
            ).aggregate(total=Sum('amount'))['total'] or 0
            withdrawable_earnings = max(0, float(total_revenue) - platform_fee - float(withdrawn_amount) - float(pending_withdrawals))

            recent_events_data = []
            for event in recent_events:
                ticket_types = TicketType.objects.filter(event=event)
                tickets = Ticket.objects.filter(ticket_type__event=event)
                
                total_tickets = sum(tt.available_quantity for tt in ticket_types)
                tickets_sold = tickets.count()
                event_revenue = tickets.aggregate(total=Sum('final_price'))['total'] or 0

                recent_events_data.append({
                    'id': event.id,
                    'title': event.title,
                    'created_at': event.created_at,
                    'is_active': event.is_active,
                    'total_tickets': total_tickets,
                    'total_tickets_sold': tickets_sold,
                    'total_revenue': float(event_revenue),
                    'min_price': float(min(tt.price for tt in ticket_types)) if ticket_types else 0,
                    'max_price': float(max(tt.price for tt in ticket_types)) if ticket_types else 0,
                })

            return Response({
                'status': 'success',
                'data': {
                    'total_events': total_events,
                    'total_tickets_sold': total_tickets_sold,
                    'total_revenue': float(total_revenue),
                    'withdrawable_earnings': withdrawable_earnings,
                    'recent_events': recent_events_data
                }
            })
        except Exception as e:
            logger.error(f"Error fetching dashboard stats: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WithdrawalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            if not hasattr(request.user, 'organizer_company'):
                return Response(
                    {'status': 'error', 'message': 'User is not an organizer'},
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = WithdrawalSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'status': 'error',
                    'message': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

            events = Event.objects.filter(organizer=request.user.organizer_company)
            total_tickets_sold = Ticket.objects.filter(ticket_type__event__in=events).count()
            total_revenue = Ticket.objects.filter(
                ticket_type__event__in=events
            ).aggregate(total=Sum('final_price'))['total'] or 0
            platform_fee = total_tickets_sold * 2
            withdrawn_amount = Withdrawal.objects.filter(
                user=request.user, status='completed'
            ).aggregate(total=Sum('amount'))['total'] or 0
            pending_withdrawals = Withdrawal.objects.filter(
                user=request.user, status='pending'
            ).aggregate(total=Sum('amount'))['total'] or 0
            withdrawable_earnings = max(0, float(total_revenue) - platform_fee - float(withdrawn_amount) - float(pending_withdrawals))

            amount = serializer.validated_data['amount']
            if amount > withdrawable_earnings:
                return Response({
                    'status': 'error',
                    'message': 'Requested amount exceeds available earnings'
                }, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                withdrawal = Withdrawal.objects.create(
                    user=request.user,
                    amount=amount,
                    payment_method=serializer.validated_data['payment_method'],
                    payment_details=serializer.validated_data['payment_details'],
                    status='pending'
                )

            return Response({
                'status': 'success',
                'message': 'Withdrawal request submitted successfully',
                'withdrawal_id': withdrawal.id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error processing withdrawal: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)