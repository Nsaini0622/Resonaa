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



@api_view(['GET'])
def get_mood_history(request):
    username = request.query_params.get('username')
    
    if not username:
        return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
        
    # get all entries of user from db, new to old time order (order_by('-timestamp')) 
    history = MoodHistory.objects(username=username).order_by('-timestamp')
    
    # convert data ato json
    history_list = []
    for entry in history:
        history_list.append({
            'emotion': entry.emotion,
            'confidence': entry.confidence,
            'input_type': entry.input_type,
            'timestamp': entry.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        })
        
    return Response({'history': history_list})