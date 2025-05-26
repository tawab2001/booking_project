from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    mobile_number = models.CharField(max_length=15, blank=True, default='0000000000')
    is_organizer = models.BooleanField(default=False)
    profile_picture = models.URLField(max_length=500, blank=True)
    google_id = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    facebook_url = models.URLField(max_length=200, blank=True, null=True)
    instagram_url = models.URLField(max_length=200, blank=True, null=True)
    whatsapp_number = models.CharField(max_length=20, blank=True, null=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Removed mobile_number from required fields

    def __str__(self):
        return self.email

class OrganizerCompany(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='organizer_company')
    company_name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    country = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.company_name} ({self.user.email})"