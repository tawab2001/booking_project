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

class SocialAccountsSerializer(serializers.Serializer):
    facebook_url = serializers.URLField(max_length=200, required=False, allow_blank=True, allow_null=True)
    instagram_url = serializers.URLField(max_length=200, required=False, allow_blank=True, allow_null=True)
    whatsapp_number = serializers.CharField(max_length=20, required=False, allow_blank=True, allow_null=True)

    def validate_facebook_url(self, value):
        if value and "facebook.com" not in value:
            raise serializers.ValidationError("Please enter a valid Facebook URL")
        return value

    def validate_instagram_url(self, value):
        if value and "instagram.com" not in value:
            raise serializers.ValidationError("Please enter a valid Instagram URL")
        return value

    def validate_whatsapp_number(self, value):
        if value and not value.replace('+', '').isdigit():
            raise serializers.ValidationError("WhatsApp number should contain only digits and an optional '+' prefix")
        return value

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    password_confirm = serializers.CharField(write_only=True, required=False)
    mobile_number = serializers.CharField(max_length=15)
    social_accounts = SocialAccountsSerializer(required=False)  # Nested serializer

    class Meta:
        model = get_user_model()
        fields = [
            'id', 'username', 'email', 'mobile_number',
            'social_accounts', 'password', 'password_confirm'
        ]
        read_only_fields = ['id']
        extra_kwargs = {
            'facebook_url': {'required': False},
            'instagram_url': {'required': False},
            'whatsapp_number': {'required': False}
        }

    def validate(self, data):
        if 'password' in data:
            if data['password'] != data.get('password_confirm'):
                raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        if not data.get('mobile_number', '').isdigit() or len(data.get('mobile_number', '')) < 10:
            raise serializers.ValidationError({"mobile_number": "Invalid mobile number."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        social_accounts = validated_data.pop('social_accounts', {})
        
        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            mobile_number=validated_data['mobile_number'],
            password=validated_data['password'],
            facebook_url=social_accounts.get('facebook_url', ''),
            instagram_url=social_accounts.get('instagram_url', ''),
            whatsapp_number=social_accounts.get('whatsapp_number', '')
        )
        return user

    def update(self, instance, validated_data):
        validated_data.pop('password', None)
        validated_data.pop('password_confirm', None)
        social_accounts = validated_data.pop('social_accounts', {})

        # Update social media fields
        instance.facebook_url = social_accounts.get('facebook_url', instance.facebook_url) or ''
        instance.instagram_url = social_accounts.get('instagram_url', instance.instagram_url) or ''
        instance.whatsapp_number = social_accounts.get('whatsapp_number', instance.whatsapp_number) or ''

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

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

