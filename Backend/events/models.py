from django.db import models
from django.conf import settings
from django.utils import timezone
from users.models import CustomUser, OrganizerCompany

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.CharField(max_length=255)
    venue = models.CharField(max_length=255)
    category = models.CharField(max_length=100, null=True, blank=True)
    
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_events',
        null=True,
        blank=True
    )

    social_image = models.URLField(max_length=500, blank=True, null=True)
    cover_image = models.URLField(max_length=500, blank=True, null=True)
    dates = models.JSONField(blank=True, null=True)
    tickets = models.JSONField(blank=True, null=True)
    
    startSales = models.DateTimeField(blank=True, null=True)
    endSales = models.DateTimeField(blank=True, null=True)
    paymentMethod = models.CharField(max_length=100, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    organizer = models.ForeignKey(
        OrganizerCompany, 
        on_delete=models.CASCADE, 
        related_name='events',
        null=True,  # Allow null temporarily for migration
        blank=True
    )

    class Meta:
        db_table = 'events_event'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class TicketType(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='ticket_types')
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available_quantity = models.PositiveIntegerField()
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.event.title} - {self.name}"

class Ticket(models.Model):
    ticket_type = models.ForeignKey(TicketType, on_delete=models.CASCADE, related_name='tickets')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tickets')
    purchase_date = models.DateTimeField(auto_now_add=True)
    final_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_used = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.ticket_type.event.title} - {self.ticket_type.name} - {self.user.email}"
    

class Withdrawal(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    PAYMENT_METHODS = (
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer'),
    )

    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='withdrawals',
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    payment_details = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'events_withdrawal'
        ordering = ['-created_at']

    def __str__(self):
        return f"Withdrawal of {self.amount} by {self.user.email} - {self.status}"