# from rest_framework import serializers
# from .models import Event
# import json

# class EventSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Event
#         fields = '__all__'

#     def to_internal_value(self, data):
#         import json
#         if isinstance(data.get('dates'), str):
#             try:
#                 data['dates'] = json.loads(data['dates'])
#             except Exception:
#                 pass

#         return super().to_internal_value(data)

#     def create(self, validated_data):
#         # احذف أي مفتاح "user" لو جاي بالغلط من الفرونت أو البوستمان
#         validated_data.pop('user', None)
#         return Event.objects.create(**validated_data)
    

from rest_framework import serializers
from .models import Event, TicketType, Ticket

class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = ['id', 'name', 'price', 'available_quantity', 'description']

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['id', 'final_price', 'purchase_date', 'is_used']

class EventSerializer(serializers.ModelSerializer):
    ticket_types = TicketTypeSerializer(many=True, read_only=True)
    total_tickets_sold = serializers.SerializerMethodField()
    total_revenue = serializers.SerializerMethodField()
    min_price = serializers.SerializerMethodField()
    max_price = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'phone', 'email', 
            'address', 'venue', 'category', 'social_image', 
            'cover_image', 'dates', 'tickets', 'startSales', 
            'endSales', 'paymentMethod', 'created_at', 'updated_at',
            'is_active', 'organizer', 'ticket_types', 'total_tickets_sold',
            'total_revenue', 'min_price', 'max_price'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_total_tickets_sold(self, obj):
        return sum(ticket_type.tickets.count() for ticket_type in obj.ticket_types.all())

    def get_total_revenue(self, obj):
        total = 0
        for ticket_type in obj.ticket_types.all():
            total += sum(ticket.final_price for ticket in ticket_type.tickets.all())
        return round(total, 2)

    def get_min_price(self, obj):
        prices = [tt.price for tt in obj.ticket_types.all()]
        return min(prices) if prices else 0

    def get_max_price(self, obj):
        prices = [tt.price for tt in obj.ticket_types.all()]
        return max(prices) if prices else 0

    def to_internal_value(self, data):
        # Handle dates JSON field
        if isinstance(data.get('dates'), str):
            try:
                data['dates'] = json.loads(data['dates'])
            except Exception:
                pass
                
        # Handle tickets JSON field
        if isinstance(data.get('tickets'), str):
            try:
                data['tickets'] = json.loads(data['tickets'])
            except Exception:
                pass

        return super().to_internal_value(data)

    def create(self, validated_data):
        # Remove user if accidentally sent
        validated_data.pop('user', None)
        return Event.objects.create(**validated_data)

    def validate_tickets(self, value):
        """
        Validate that at least one ticket type is provided
        """
        if not value:
            raise serializers.ValidationError("At least one ticket type is required")
        
        if not (value.get('vip') or value.get('regular')):
            raise serializers.ValidationError("At least one ticket type (VIP or Regular) must be provided")
            
        return value