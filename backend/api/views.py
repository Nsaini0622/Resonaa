import requests
import random
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
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


    # dictionary to match emotion to realted music genre
    # iTunes API keywords
EMOTION_GENRE_MAP = {
    'Happy': ['pop hits', 'upbeat', 'party', 'dance'],
    'Sad': ['acoustic sad', 'piano sad', 'melancholy', 'sad song'],
    'Angry': ['heavy metal', 'hard rock', 'punk'],
    'Fear': ['ambient calm', 'classical relax', 'meditation'],
    'Surprise': ['electronic dance', 'synthpop', 'indie'],
    'Neutral': ['lofi beats', 'chill', 'acoustic chill', 'jazz']
}

@api_view(['GET'])
def get_music_recommendation(request):
    emotion = request.query_params.get('emotion')
    
    if not emotion:
        return Response({'error': 'Valid emotion is required'}, status=status.HTTP_400_BAD_REQUEST)
        
    if emotion not in EMOTION_GENRE_MAP:
        emotion = 'Neutral'
    
    selected_query = random.choice(EMOTION_GENRE_MAP[emotion])
    
    import urllib.parse
    encoded_query = urllib.parse.quote(selected_query)
    
    # iTunes Search API (Hamesha kaam karti hai, free aur bina country block ke)
    itunes_url = f"https://itunes.apple.com/search?term={encoded_query}&entity=song&limit=10"
    
    try:
        response = requests.get(itunes_url)
        data = response.json()
            
        tracks = []
        # iTunes results array
        for track in data.get('results', []):
            tracks.append({
                'id': track.get('trackId'),
                'title': track.get('trackName'),
                'artist': track.get('artistName', 'Unknown Artist'),
                # iTunes ki high quality image
                'album_cover': track.get('artworkUrl100', ''),
                # iTunes ka 30 second preview
                'preview_url': track.get('previewUrl'),
                'deezer_link': track.get('trackViewUrl') # Apple Music link
            })
            
        return Response({
            'emotion': emotion,
            'search_query': selected_query,
            'tracks': tracks
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)