from django.urls import path
from .views import UserSignupView, OrganizerSignupView, LoginView, UserProfileView

urlpatterns = [
    path('signup/user/', UserSignupView.as_view(), name='user-signup'),
    path('signup/organizer/', OrganizerSignupView.as_view(), name='organizer-signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),

]