from django.contrib import admin
from .models import Ticket, TicketType

@admin.register(TicketType)
class TicketTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'event', 'price', 'surcharge', 'available_quantity', 'max_per_person')
    list_filter = ('event', 'name')
    search_fields = ('name', 'event__title')

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'event', 'ticket_type', 'status', 'created_date')
    list_filter = ('status', 'ticket_type', 'event')
    search_fields = ('user__email', 'event__title', 'qr_code')
    readonly_fields = ('qr_code', 'created_date')
