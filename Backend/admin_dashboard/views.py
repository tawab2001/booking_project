from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.core.paginator import Paginator
from django.utils import timezone
from events.models import Event
from users.models import CustomUser
from tickets.models import Ticket
from datetime import datetime
from django.db.models import Sum, Count

@staff_member_required
def admin_dashboard(request):
    context = {
        'total_events': Event.objects.count(),
        'active_events': Event.objects.filter(status='active').count(),
        'total_users': CustomUser.objects.count(),
        'new_users': CustomUser.objects.filter(date_joined__month=timezone.now().month).count(),
        'tickets_sold': Ticket.objects.count(),
        'revenue': Ticket.objects.aggregate(Sum('price'))['price__sum'] or 0,
        'recent_events': Event.objects.order_by('-created_at')[:5],
        'recent_users': CustomUser.objects.order_by('-date_joined')[:5],
    }
    return render(request, 'admin/dashboard.html', context)

@staff_member_required
def admin_events(request):
    events_list = Event.objects.all().order_by('-created_at')
    paginator = Paginator(events_list, 10)  # 10 events per page
    page = request.GET.get('page')
    events = paginator.get_page(page)
    
    context = {
        'events': events,
        'total_events': events_list.count(),
        'active_events': events_list.filter(status='active').count(),
        'completed_events': events_list.filter(status='completed').count(),
    }
    return render(request, 'admin/events.html', context)

@staff_member_required
def admin_users(request):
    users_list = CustomUser.objects.all().order_by('-date_joined')
    paginator = Paginator(users_list, 10)  # 10 users per page
    page = request.GET.get('page')
    users = paginator.get_page(page)
    
    context = {
        'users': users,
        'total_users': users_list.count(),
        'active_users': users_list.filter(is_active=True).count(),
        'staff_users': users_list.filter(is_staff=True).count(),
    }
    return render(request, 'admin/users.html', context)

@staff_member_required
def admin_tickets(request):
    tickets_list = Ticket.objects.all().order_by('-created_at')
    paginator = Paginator(tickets_list, 10)  # 10 tickets per page
    page = request.GET.get('page')
    tickets = paginator.get_page(page)
    
    context = {
        'tickets': tickets,
        'total_tickets': tickets_list.count(),
        'total_revenue': tickets_list.aggregate(Sum('price'))['price__sum'] or 0,
        'tickets_by_event': tickets_list.values('event__name').annotate(count=Count('id')),
    }
    return render(request, 'admin/tickets.html', context)

@staff_member_required
def admin_reports(request):
    # Get date range from request or default to current month
    start_date = request.GET.get('start_date', timezone.now().replace(day=1))
    end_date = request.GET.get('end_date', timezone.now())

    context = {
        'revenue_by_day': Ticket.objects.filter(
            created_at__range=[start_date, end_date]
        ).values('created_at__date').annotate(
            total=Sum('price')
        ).order_by('created_at__date'),
        
        'events_by_category': Event.objects.values('category').annotate(
            count=Count('id')
        ),
        
        'top_selling_events': Event.objects.annotate(
            tickets_sold=Count('ticket')
        ).order_by('-tickets_sold')[:5],
        
        'user_registrations': CustomUser.objects.filter(
            date_joined__range=[start_date, end_date]
        ).values('date_joined__date').annotate(
            count=Count('id')
        ).order_by('date_joined__date'),
    }
    return render(request, 'admin/reports.html', context)

@staff_member_required
def admin_settings(request):
    if request.method == 'POST':
        # Handle settings updates here
        pass
    
    context = {
        'site_settings': {
            'site_name': 'EasyTicket',
            'contact_email': 'support@easyticket.com',
            'default_currency': 'USD',
            'timezone': 'UTC',
        }
    }
    return render(request, 'admin/settings.html', context)