from django.db import models
from django.contrib.auth.models import User
from events.models import Event
from django.conf import settings

# Create your models here.
class Payment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='pending')
    transaction_id = models.CharField(max_length=255, null=True)