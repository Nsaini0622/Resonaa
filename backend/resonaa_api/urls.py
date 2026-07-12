from django.contrib import admin
from django.urls import path
from users import views as user_views
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', views.health_check, name='health_check'),
    path('api/users/signup/', user_views.signup, name='signup'),
]