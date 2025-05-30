from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class AdminDashboard(models.Model):
    """
    Model representing the admin dashboard for managing events and tickets.
    """

    # Fields for the AdminDashboard model can be defined here.
    # For example, you might want to track the number of events, tickets sold, etc.

    class Meta:
        verbose_name = "Admin Dashboard"
        verbose_name_plural = "Admin Dashboards"

    def __str__(self):
        return "Admin Dashboard"

class AdminSettings(models.Model):
    email_notifications = models.BooleanField(default=True)
    site_maintenance_mode = models.BooleanField(default=False)
    auto_approve_events = models.BooleanField(default=False)
    allow_user_registration = models.BooleanField(default=True)
    language = models.CharField(max_length=10, default='en')
    timezone = models.CharField(max_length=50, default='UTC+2')
    last_updated = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    class Meta:
        verbose_name = 'Admin Settings'
        verbose_name_plural = 'Admin Settings'

    def __str__(self):
        return f'Admin Settings (Last updated: {self.last_updated})'

    @classmethod
    def get_settings(cls):
        settings = cls.objects.first()
        if not settings:
            settings = cls.objects.create()