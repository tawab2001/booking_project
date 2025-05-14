from django.db import models
from django.contrib.auth.models import User
from events.models import Event
from django.conf import settings


# Create your models here.
class TicketType(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)  # VIP, Golden, Regular
    price = models.DecimalField(max_digits=10, decimal_places=2)
    max_per_person = models.PositiveIntegerField()

class Ticket(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    ticket_type = models.ForeignKey(TicketType, on_delete=models.CASCADE)
    qr_code = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=20, default='active')
