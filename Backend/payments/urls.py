from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_payment, name='create-payment'),
    path('execute/', views.execute_payment, name='execute-payment'),
] 