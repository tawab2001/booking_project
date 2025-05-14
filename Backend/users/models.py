from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    mobile_number = models.CharField(max_length=15, unique=True, blank=False)

    def __str__(self):
        return self.username


class OrganizerCompany(models.Model):
    user = models.OneToOneField('CustomUser', on_delete=models.CASCADE, related_name='organizer_company')
    company_name = models.CharField(max_length=100, blank=False)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    country = models.CharField(max_length=100, blank=False)


    def __str__(self):
        return self.company_name