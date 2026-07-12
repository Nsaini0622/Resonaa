from rest_framework import serializers
from .models import UserProfile
from django.contrib.auth.hashers import make_password

class UserSignupSerializer(serializers.Serializer):
  username = serializers.charField(max_length=50, required=True)
  email=serializers.EmailField(required=True)
  password= serializers.CharField(write_only=True, required=True)

  def validate_username(self, value):
    #check if username exists or not
    if UserProfile.object(username=value).first():
      raise serializers.ValidationError("Username already exists.")
    return value
  
  def validate_email(self, value):
    # check if email exists
    if UserProfile.object(email=value).first():
      raise serializers.ValidationError("Email already registered.")
    return value
  
  def create(self, validated_data):
    #create password secure(hash)
    hashed_password = make_password(validated_data['password'])

    # save new user db
    user = UserProfile(
      username = validated_data['username'],
      email = validated_data['email'],
      password= hashed_password 
    )
    user.save()
    return user