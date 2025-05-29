from django.db import models

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.CharField(max_length=255)
    venue = models.CharField(max_length=255)
    category = models.CharField(max_length=100, null=True, blank=True)

    social_image = models.URLField(max_length=500, blank=True, null=True)
    cover_image = models.URLField(max_length=500, blank=True, null=True)

    dates = models.JSONField(blank=True, null=True)

    ticketType = models.CharField(max_length=100, blank=True, null=True)
    ticketName = models.CharField(max_length=100, blank=True, null=True)
    quantity = models.PositiveIntegerField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    startSales = models.DateTimeField(blank=True, null=True)
    endSales = models.DateTimeField(blank=True, null=True)
    paymentMethod = models.CharField(max_length=100, blank=True, null=True)


    def _str_(self):
        return self.title