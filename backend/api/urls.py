from django.urls import path
from . import views

urlpatterns = [
    path('facial-emotion/', views.analyze_facial_emotion, name='facial_emotion'),
]