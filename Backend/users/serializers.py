from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import OrganizerCompany, CustomUser

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    mobile_number = serializers.CharField(max_length=15)

    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'mobile_number', 'password', 'password_confirm']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        if not data['mobile_number'].isdigit() or len(data['mobile_number']) < 10:
            raise serializers.ValidationError({"mobile_number": "Invalid mobile number."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            mobile_number=validated_data['mobile_number'],
            password=validated_data['password']
        )
        return user

class OrganizerCompanySerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = OrganizerCompany
        fields = ['user', 'company_name', 'description']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            company = OrganizerCompany.objects.create(user=user, **validated_data)
            return company
        raise serializers.ValidationError(user_serializer.errors)