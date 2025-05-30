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
from .models import Event
import json

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

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