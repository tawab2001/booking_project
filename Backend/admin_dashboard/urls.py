from django.urls import path
from . import views

urlpatterns = [
    path('', views.admin_dashboard, name='admin_dashboard'),
    path('events/', views.admin_events, name='admin_events'),
    path('users/', views.admin_users, name='admin_users'),
    path('tickets/', views.admin_tickets, name='admin_tickets'),
    path('reports/', views.admin_reports, name='admin_reports'),
    path('settings/', views.admin_settings, name='admin_settings'),
]