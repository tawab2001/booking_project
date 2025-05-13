from django.db import models

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

