from django.db import models
from django.conf import settings
from events.models import Event
from django.utils import timezone
from decimal import Decimal

class TicketType(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)  # VIP, Golden, Regular
    price = models.DecimalField(max_digits=10, decimal_places=2)
    max_per_person = models.PositiveIntegerField(default=1)
    available_quantity = models.PositiveIntegerField(default=0)
    surcharge = models.DecimalField(max_digits=5, decimal_places=2, default=2.00)

    def get_final_price(self):
        return self.price + Decimal(self.surcharge)

    def __str__(self):
        return f"{self.name} for {self.event.title}"

from events.models import Event

# ...existing code...

class Ticket(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    ticket_type = models.ForeignKey(TicketType, on_delete=models.CASCADE)
    created_date = models.DateTimeField(default=timezone.now)
    qr_code = models.CharField(max_length=255, unique=True)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_method = models.CharField(
        max_length=20,
        choices=[
            ('credit_card', 'Credit Card'),
            ('debit_card', 'Debit Card'),
            ('bank_transfer', 'Bank Transfer'),
        ],
        default='credit_card'
    )
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

    def save(self, *args, **kwargs):
        if not self.final_price or self.final_price == 0:
            self.final_price = self.ticket_type.get_final_price()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Ticket {self.qr_code} for {self.event.title}"
