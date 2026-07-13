from rest_framework import serializers
from .models import UserProfile
from django.contrib.auth.hashers import make_password
import re

class UserSignupSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate_username(self, value):
        # letters, numbers and underscore allowed
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        # Minimum 3 characters
        if len(value) < 3:
            raise serializers.ValidationError("Username should be of .")
        # Check if usename exists or not
        if UserProfile.objects(username=value).first():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if UserProfile.objects(email=value).first():
            raise serializers.ValidationError("Email already registered.")
        return value

    def validate_password(self, value):
        # Minimum 8 characters
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        # atleast 1 uppercase letter
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter (A-Z).")
        # atleast1 lowercase letter
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter (a-z).")
        #  atlaeast 1 number
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one number (0-9).")
        # atleast 1 special character
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must contain at least one special character (!@#$%...).")
        return value

    def create(self, validated_data):
        hashed_password = make_password(validated_data['password'])
        
        user = UserProfile(
            username=validated_data['username'],
            email=validated_data['email'],
            password=hashed_password
        )
        user.save()
        return user