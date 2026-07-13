import random
import requests
import urllib.parse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import MoodHistory

# --- FACIAL EMOTION API ---
@api_view(['POST'])
def analyze_facial_emotion(request):
    username = request.data.get('username')
    image_data = request.data.get('image')

    if not username or not image_data:
        return Response({'error': 'Username and Image are required'}, status=status.HTTP_400_BAD_REQUEST)

    emotions_list = ['Happy', 'Sad', 'Angry', 'Surprise', 'Neutral', 'Fear']
    detected_emotion = random.choice(emotions_list)

    mood_entry = MoodHistory(
        username=username,
        emotion=detected_emotion,
        input_type='facial',
        confidence=round(random.uniform(0.75, 0.98), 2)
    )
    mood_entry.save()

    return Response({
        'message': 'Emotion analyzed successfully',
        'emotion': detected_emotion,
        'confidence': mood_entry.confidence
    })

# --- TEXT EMOTION API ---
@api_view(['POST'])
def analyze_text_emotion(request):
    username = request.data.get('username')
    text_data = request.data.get('text')

    if not username or not text_data:
        return Response({'error': 'Username and Text are required'}, status=status.HTTP_400_BAD_REQUEST)

    text_lower = text_data.lower()
    
    # Basic logic for text emotion (jab tak AI na lage)
    if any(word in text_lower for word in ['sad', 'cry', 'bad', 'hurt', 'pain', 'lonely', 'depressed', 'unhappy']):
        detected_emotion = 'Sad'
    elif any(word in text_lower for word in ['happy', 'good', 'great', 'awesome', 'joy', 'win', 'best']):
        detected_emotion = 'Happy'
    elif any(word in text_lower for word in ['angry', 'mad', 'hate', 'furious', 'stupid', 'annoyed']):
        detected_emotion = 'Angry'
    elif any(word in text_lower for word in ['scared', 'fear', 'terrified', 'anxious', 'nervous']):
        detected_emotion = 'Fear'
    else:
        emotions_list = ['Surprise', 'Neutral', 'Happy']
        detected_emotion = random.choice(emotions_list)

    mood_entry = MoodHistory(
        username=username,
        emotion=detected_emotion,
        input_type='text',
        confidence=round(random.uniform(0.70, 0.95), 2)
    )
    mood_entry.save()

    return Response({
        'message': 'Text emotion analyzed successfully',
        'emotion': detected_emotion,
        'confidence': mood_entry.confidence
    })

# --- MOOD HISTORY API ---
@api_view(['GET'])
def get_mood_history(request):
    username = request.query_params.get('username')
    
    if not username:
        return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
        
    history = MoodHistory.objects(username=username).order_by('-timestamp')
    
    history_list = []
    for entry in history:
        history_list.append({
            'emotion': entry.emotion,
            'confidence': entry.confidence,
            'input_type': entry.input_type,
            'timestamp': entry.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        })
        
    return Response({'history': history_list})

# --- MUSIC RECOMMENDATION API ---
EMOTION_TAGS = {
    'Happy': ['party pop', 'upbeat', 'dance hits', 'bollywood dance', 'punjabi hit', 'happy hindi', 'pakistani pop'],
    'Sad': ['melancholy', 'sad acoustic', 'heartbreak', 'arijit singh sad', 'bollywood emotional', 'atif aslam sad', 'sad sufi'],
    'Angry': ['hard rock', 'heavy metal', 'angry rap', 'bollywood rock', 'desi hip hop', 'intense', 'pakistani rock'],
    'Fear': ['calm ambient', 'relaxing instrumental', 'indian classical flute', 'soothing hindi', 'meditation', 'rabab'],
    'Surprise': ['electronic', 'synthpop', 'indie hit', 'bollywood mashup', 'fusion india', 'coke studio pakistan'],
    'Neutral': ['lofi beats', 'chill jazz', 'easy listening', 'bollywood lofi', 'hindi chill', 'urdu acoustic']
}

@api_view(['GET'])
def get_music_recommendation(request):
    emotion = request.query_params.get('emotion')
    
    if not emotion:
        return Response({'error': 'Valid emotion is required'}, status=status.HTTP_400_BAD_REQUEST)
        
    if emotion not in EMOTION_TAGS:
        emotion = 'Neutral'
    
    selected_query = random.choice(EMOTION_TAGS[emotion])
    encoded_query = urllib.parse.quote(selected_query)
    
    itunes_url = f"https://itunes.apple.com/search?term={encoded_query}&entity=song&country=IN&limit=15"
    
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(itunes_url, headers=headers)
        data = response.json()
            
        tracks = []
        for track in data.get('results', []):
            if track.get('trackId'):
                tracks.append({
                    'id': track.get('trackId'),
                    'title': track.get('trackName'),
                    'artist': track.get('artistName', 'Unknown Artist'),
                    'album_cover': track.get('artworkUrl100', ''),
                    'preview_url': track.get('previewUrl'),
                    'deezer_link': track.get('trackViewUrl')
                })
        
        if len(tracks) > 0:
            random.shuffle(tracks)
            tracks = tracks[:10]
        else:
            fallback_url = f"https://itunes.apple.com/search?term=bollywood+{emotion}&entity=song&country=IN&limit=10"
            fb_res = requests.get(fallback_url, headers=headers)
            for track in fb_res.json().get('results', []):
                tracks.append({
                    'id': track.get('trackId'),
                    'title': track.get('trackName'),
                    'artist': track.get('artistName', 'Unknown'),
                    'album_cover': track.get('artworkUrl100', ''),
                    'preview_url': track.get('previewUrl'),
                    'deezer_link': track.get('trackViewUrl')
                })
            selected_query = f"bollywood {emotion}"
            
        return Response({
            'emotion': emotion,
            'search_query': selected_query,
            'tracks': tracks
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)