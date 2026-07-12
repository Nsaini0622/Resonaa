from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import random
from .models import MoodHistory

@api_view(['POST'])
def analyze_facial_emotion(request):
    # Frontend fetch username aur photo
    username = request.data.get('username')
    image_data = request.data.get('image') # Base64 string

    if not username or not image_data:
        return Response({'error': 'Username and Image are required'}, status=status.HTTP_400_BAD_request)

    # -------------------------------------------------------------
    # TODO: will call real AI/ML model
    # for now will generate random emotion for test flow
    emotions_list = ['Happy', 'Sad', 'Angry', 'Surprise', 'Neutral', 'Fear']
    detected_emotion = random.choice(emotions_list)
    # -------------------------------------------------------------

    # save in db
    mood_entry = MoodHistory(
        username=username,
        emotion=detected_emotion,
        input_type='facial',
        confidence=round(random.uniform(0.75, 0.98), 2) # fake confidence score
    )
    mood_entry.save()

    # sending response to frontend
    return Response({
        'message': 'Emotion analyzed successfully',
        'emotion': detected_emotion,
        'confidence': mood_entry.confidence
    })