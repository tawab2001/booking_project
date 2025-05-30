from django.core.management.base import BaseCommand
from events.models import Event
from tickets.models import TicketType

class Command(BaseCommand):
    help = 'Creates ticket types for existing events'

    def handle(self, *args, **kwargs):
        events = Event.objects.all()
        for event in events:
            if event.tickets:
                self.stdout.write(f'Processing event: {event.title}')
                for ticket_type, details in event.tickets.items():
                    # Check if ticket type already exists
                    existing = TicketType.objects.filter(event=event, name=ticket_type.capitalize()).first()
                    if not existing:
                        TicketType.objects.create(
                            event=event,
                            name=ticket_type.capitalize(),
                            price=float(details.get('price', 0)),
                            max_per_person=int(details.get('max_per_person', 1)),
                            available_quantity=int(details.get('quantity', 0)),
                        )
                        self.stdout.write(self.style.SUCCESS(
                            f'Created ticket type {ticket_type} for event {event.title}'
                        ))
                    else:
                        self.stdout.write(
                            f'Ticket type {ticket_type} already exists for event {event.title}'
                        ) 