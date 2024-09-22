from django.urls import path
from .views import BFHLView

urlpatterns = [
    path('bfhl/', BFHLView.as_view(), name='bfhl'),
]
