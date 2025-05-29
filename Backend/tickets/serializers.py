from rest_framework import serializers
from .models import Ticket, TicketType
import qrcode
import base64
from io import BytesIO


class TicketTypeSerializer(serializers.ModelSerializer):
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True, source='get_final_price')
    
    class Meta:
        model = TicketType
        fields = ['id', 'event', 'name', 'price', 'max_per_person', 'available_quantity', 'surcharge', 'final_price']

class TicketSerializer(serializers.ModelSerializer):
    ticket_qr = serializers.SerializerMethodField()
    ticket_type_details = TicketTypeSerializer(source='ticket_type', read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'user', 'event', 'ticket_type', 'ticket_type_details', 'qr_code', 'status', 'final_price', 'payment_method', 'ticket_qr']

    def get_ticket_qr(self, obj):
        # Generate QR code
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(f"Ticket ID: {obj.id}\nEvent: {obj.event.title}\nType: {obj.ticket_type.name}\nStatus: {obj.status}")
        qr.make(fit=True)
        
        # Create QR code image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        return base64.b64encode(buffer.getvalue()).decode()