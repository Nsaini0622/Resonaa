from django.contrib import admin
from django.urls import path, include
from users import views as user_views
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', views.health_check, name='health_check'),
    
    # Auth APIs
    path('api/users/signup/', user_views.signup, name='signup'),
    path('api/users/login/', user_views.login, name='login'), 

    # Feature APIs (Emotion / Recommendation)
    path('api/features/', include('api.urls')), 
]