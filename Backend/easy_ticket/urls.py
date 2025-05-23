"""
URL configuration for easy_ticket project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
<<<<<<< HEAD
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


=======
from django.db.models import Sum
from rest_framework.views import APIView
>>>>>>> 419a4115209be8e84363dc20db0eb72f335ef993

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path("admincustom/", include("admin_dashboard.urls")),
<<<<<<< HEAD

    path('api/events/', include('events.urls')),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

=======
    path('api/admin/', include('admin_dashboard.urls'))
]
>>>>>>> 419a4115209be8e84363dc20db0eb72f335ef993
