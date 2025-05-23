from django.urls import path
from .views import AdminLoginView, AdminStatsView, AdminUsersView, AdminEventsView
from django.db.models import Sum
from rest_framework.views import APIView
urlpatterns = [
path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('users/', AdminUsersView.as_view(), name='admin-users'),
    path('events/', AdminEventsView.as_view(), name='admin-events'),
        path('login/', AdminLoginView.as_view(), name='admin-login'),
]