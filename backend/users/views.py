from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .serializers import UserSignupSerializer
from .models import UserProfile
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from .auth import token_required

JWT_SECRET = getattr(settings, 'SECRET_KEY', 'my_secret_key')

@api_view(['POST'])
def signup(request):
    serializer = UserSignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "User registered successfully!",
            "username": user.username
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
# YAHAN @token_required NAHI HONA CHAHIYE
def login(request):
    username_or_email = request.data.get('username')
    password = request.data.get('password')

    if not username_or_email or not password:
        return Response({'error': 'Please provide username and password'}, status=status.HTTP_400_BAD_REQUEST)

    user = UserProfile.objects(username=username_or_email).first()
    if not user:
        user = UserProfile.objects(email=username_or_email).first()

    if not user or not check_password(password, user.password):
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    payload = {
        'user_id': str(user.id),
        'username': user.username,
        'exp': datetime.utcnow() + timedelta(hours=1)
    }
    
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')

    return Response({
        'message': 'Login successful',
        'token': token,
        'username': user.username
    })