from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            # Try to fetch the user by email or username
            user = UserModel.objects.get(
                Q(email=username) | Q(username=username)
            )
            if user.check_password(password):
                return user
        except UserModel.DoesNotExist:
            return None

class GoogleOAuth2Backend(ModelBackend):
    def authenticate(self, request, google_id=None, **kwargs):
        if not google_id:
            return None
            
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(google_id=google_id)
        except UserModel.DoesNotExist:
            return None