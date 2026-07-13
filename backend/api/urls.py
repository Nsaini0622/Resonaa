from django.urls import path
from . import views

urlpatterns = [
    path('facial-emotion/', views.analyze_facial_emotion, name='facial_emotion'),
    path('mood-history/', views.get_mood_history, name='mood_history'), 
    path('music-recommendations/', views.get_music_recommendation, name='music_recommendations'),
]