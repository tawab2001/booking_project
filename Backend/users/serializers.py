# from rest_framework import serializers
# from django.contrib.auth import get_user_model
# from .models import OrganizerCompany, CustomUser

# class UserSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)
#     password_confirm = serializers.CharField(write_only=True)
#     mobile_number = serializers.CharField(max_length=15)

#     class Meta:
#         model = get_user_model()
#         fields = ['username', 'email', 'mobile_number', 'password', 'password_confirm']

#     def validate(self, data):
#         if data['password'] != data['password_confirm']:
#             raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
#         if not data['mobile_number'].isdigit() or len(data['mobile_number']) < 10:
#             raise serializers.ValidationError({"mobile_number": "Invalid mobile number."})
#         return data

#     def create(self, validated_data):
#         validated_data.pop('password_confirm')
#         user = get_user_model().objects.create_user(
#             username=validated_data['username'],
#             email=validated_data['email'],
#             mobile_number=validated_data['mobile_number'],
#             password=validated_data['password']
#         )
#         return user

# class OrganizerCompanySerializer(serializers.ModelSerializer):
#     user = UserSerializer()

#     class Meta:
#         model = OrganizerCompany
#         fields = ['user', 'company_name', 'description']

#     def create(self, validated_data):
#         user_data = validated_data.pop('user')
#         user_serializer = UserSerializer(data=user_data)
#         if user_serializer.is_valid():
#             user = user_serializer.save()
#             company = OrganizerCompany.objects.create(user=user, **validated_data)
#             return company
#         raise serializers.ValidationError(user_serializer.errors)

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import OrganizerCompany, CustomUser

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    mobile_number = serializers.CharField(max_length=15)

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'mobile_number', 'password', 'password_confirm']
        read_only_fields = ['id']

    def validate(self, data):
        if 'password' in data:
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

    def update(self, instance, validated_data):
        # Remove password fields for updates
        validated_data.pop('password', None)
        validated_data.pop('password_confirm', None)
        return super().update(instance, validated_data)

class OrganizerCompanySerializer(serializers.ModelSerializer):
    user = UserSerializer()
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = OrganizerCompany
        fields = ['user', 'company_name', 'description', 'country', 'created_at']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            company = OrganizerCompany.objects.create(
                user=user,
                **validated_data
            )
            return company
        raise serializers.ValidationError(user_serializer.errors)

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
        
        return super().update(instance, validated_data)

