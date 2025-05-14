from django.urls import path
from .views import UserSignupView, OrganizerSignupView

urlpatterns = [
    path('signup/user/', UserSignupView.as_view(), name='user_signup'),
    path('signup/organizer/', OrganizerSignupView.as_view(), name='organizer_signup'),
]