import jwt
from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

JWT_SECRET = getattr(settings, 'SECRET_KEY', 'my_secret_key')

def token_required(f):
    @wraps(f)
    def decorated(request, *args, **kwargs):
        # Frontend send to headder : "Authorization: Bearer <token>"
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Token is missing!'}, status=status.HTTP_401_UNAUTHORIZED)
            
        token = auth_header.split(' ')[1]
        
        try:
            # Token verification
            data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            # Username in token will be added to new variable
            request.jwt_username = data['username']
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired!'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token!'}, status=status.HTTP_401_UNAUTHORIZED)
            
        return f(request, *args, **kwargs)
        
    return decorated 