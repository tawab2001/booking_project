from django.urls import path
from .views import UserSignupView, OrganizerSignupView, LoginView, UserProfileView, RequestPasswordResetView, PasswordResetConfirmView

urlpatterns = [
    path('signup/user/', UserSignupView.as_view(), name='user-signup'),
    path('signup/organizer/', OrganizerSignupView.as_view(), name='organizer-signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('password_reset/', RequestPasswordResetView.as_view(), name='password_reset'),
    path('password_reset_confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]

