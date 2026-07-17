from django.urls import path
from . import views

urlpatterns = [
    path('facial-emotion/', views.analyze_facial_emotion, name='facial_emotion'),
    
    path('mood-history/', views.get_mood_history, name='mood_history'), 
    
    path('music-recommendations/', views.get_music_recommendation, name='music_recommendations'),

    path('text-emotion/', views.analyze_text_emotion, name='text_emotion'),

    path('voice-emotion/', views.analyze_voice_emotion, name='voice_emotion'),

    path('listening-history/', views.get_listening_history, name='listening_history'),

    path('youtube-play/', views.get_youtube_link, name='youtube_play'),
]