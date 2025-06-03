from django.urls import path
from .views import (
    EventCreateView,
    EventDetailView,
    EventListView,
    OrganizerEventListView,
    OrganizerEventDetailView,
    OrganizerDashboardStatsView,
    WithdrawalView
)

urlpatterns = [
    # Public event endpoints
    path('events/', EventListView.as_view(), name='event-list'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('events/create/', EventCreateView.as_view(), name='create-event'),
    
    # Organizer endpoints - moved before the detail view to avoid URL pattern conflicts
    path('organizer/stats/', OrganizerDashboardStatsView.as_view(), name='organizer-dashboard-stats'),
    path('organizer/events/', OrganizerEventListView.as_view(), name='organizer-event-list'),
    path('organizer/events/<int:event_id>/', OrganizerEventDetailView.as_view(), name='organizer-event-detail'),
    path('organizer/dashboard/', OrganizerDashboardStatsView.as_view(), name='organizer-dashboard'),
    path('organizer/withdraw/', WithdrawalView.as_view(), name='organizer-withdraw'),
]