from django.urls import path
from .views import UserSignupView,ContactView,AvatarUploadView, OrganizerSignupView, PasswordResetConfirmView ,LoginView, UserProfileView, RequestPasswordResetView, GoogleLoginView,GoogleUserSignupView, GoogleOrganizerSignupView

urlpatterns = [
    path('signup/user/', UserSignupView.as_view(), name='user-signup'),
    path('signup/organizer/', OrganizerSignupView.as_view(), name='organizer-signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('password_reset/', RequestPasswordResetView.as_view(), name='password_reset'),
    path('password_reset_confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('login/google/', GoogleLoginView.as_view(), name='google-login'),
    path('signup/user/google/', GoogleUserSignupView.as_view(), name='google_user_signup'),
    path('signup/organizer/google/', GoogleOrganizerSignupView.as_view(), name='google_organizer_signup'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/avatar/', AvatarUploadView.as_view(), name='avatar-upload'),
]



# from django.urls import path
# from .views import (
#     UserSignupView, 
#     OrganizerSignupView, 
#     PasswordResetConfirmView,
#     LoginView, 
#     UserProfileView, 
#     RequestPasswordResetView,
#     GoogleLoginView,
#     GoogleUserSignupView,
#     GoogleOrganizerSignupView
# )

# urlpatterns = [
#     path('signup/user/', UserSignupView.as_view(), name='user-signup'),
#     path('signup/organizer/', OrganizerSignupView.as_view(), name='organizer-signup'),
#     path('signup/user/google/', GoogleUserSignupView.as_view(), name='google-user-signup'),
#     path('signup/organizer/google/', GoogleOrganizerSignupView.as_view(), name='google-organizer-signup'),
#     path('login/', LoginView.as_view(), name='login'),
#     path('login/google/', GoogleLoginView.as_view(), name='google-login'),
#     path('profile/', UserProfileView.as_view(), name='user-profile'),
#     path('password_reset/', RequestPasswordResetView.as_view(), name='password-reset-request'),
#     path('password_reset_confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
# ]