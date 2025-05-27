from rest_framework import serializers
from .models import Event
import json

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

    def to_internal_value(self, data):
        import json
        if isinstance(data.get('dates'), str):
            try:
                data['dates'] = json.loads(data['dates'])
            except Exception:
                pass

        return super().to_internal_value(data)

    def create(self, validated_data):
        validated_data.pop('user', None)
        return Event.objects.create(**validated_data)
