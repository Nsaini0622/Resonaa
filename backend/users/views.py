from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSignupSerializer

@api_view(['POST'])
def signup(request):
    # Frontend data send to serializer
    serializer = UserSignupSerializer(data=request.data)
    
    # if data is correct (validation pass)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "User registered successfully!",
            "username": user.username
        }, status=status.HTTP_201_CREATED)
    
    # if data is wrong (eg. email already exists)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)