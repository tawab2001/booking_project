from rest_framework import serializers
from .models import Ticket, TicketType


class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = ['id', 'event', 'name', 'price', 'max_per_person']

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['id', 'user', 'event', 'ticket_type', 'qr_code', 'status']