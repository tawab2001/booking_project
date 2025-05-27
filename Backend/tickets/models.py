from django.db import models
from django.conf import settings
from events.models import Event
from django.utils import timezone

class TicketType(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)  # VIP, Golden, Regular
    price = models.DecimalField(max_digits=10, decimal_places=2)
    max_per_person = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.name} for {self.event.title}"

from events.models import Event

# ...existing code...

class Ticket(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    ticket_type = models.ForeignKey(TicketType, on_delete=models.CASCADE)
    created_date = models.DateTimeField(default=timezone.now)  # Changed from auto_now_add
    qr_code = models.CharField(max_length=255, unique=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('paid', 'Paid'),
            ('active', 'Active'),
            ('cancelled', 'Cancelled')
        ],
        default='pending'
    )

    def __str__(self):
        return f"Ticket {self.qr_code} for {self.event.title}"
