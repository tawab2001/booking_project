from django.shortcuts import render

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import EventSerializer
from .models import Event
from tickets.models import TicketType
from django.db import transaction


# from django.shortcuts import render
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import EventSerializer

class EventCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]  # إضافة هذا السطر

    def post(self, request):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Event created successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
      
# Add this for single event operations
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
            # Create the event first
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            event = serializer.save()

            # Create ticket types from the tickets JSON field
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

            # Update ticket types if tickets field is updated
            tickets_data = event.tickets
            if tickets_data:
                # Delete existing ticket types
                TicketType.objects.filter(event=event).delete()
                
                # Create new ticket types
                for ticket_type, details in tickets_data.items():
                    TicketType.objects.create(
                        event=event,
                        name=ticket_type.capitalize(),
                        price=float(details.get('price', 0)),
                        max_per_person=int(details.get('max_per_person', 1)),
                        available_quantity=int(details.get('quantity', 0)),
                    )

        return Response(serializer.data)