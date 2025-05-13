from django.db import models
from events.models import Event

# Create your models here.
class SeatingMap(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    seat_number = models.CharField(max_length=10)
    is_reserved = models.BooleanField(default=False)