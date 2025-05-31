from django.urls import path
from .views import (
    AdminLoginView, 
    AdminStatsView, 
    AdminUsersView, 
    AdminEventsView,
    get_user_events_stats,
)

urlpatterns = [
path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('users/', AdminUsersView.as_view(), name='admin-users'),
    path('users/<int:user_id>/', AdminUsersView.as_view(), name='admin-user-detail'),
    path('events/', AdminEventsView.as_view(), name='admin-events'),
        path('login/', AdminLoginView.as_view(), name='admin-login'),
    path('events/stats/', get_user_events_stats, name='user-events-stats'),
]