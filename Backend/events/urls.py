from django.urls import path
from .views import EventCreateView
from .views import EventDetailView
from .views import EventListView

urlpatterns = [
    path('create/', EventCreateView.as_view(), name='create-event'),
    path('<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('', EventListView.as_view(), name='event-list'),

]