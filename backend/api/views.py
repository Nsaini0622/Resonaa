import random
import requests
import urllib.parse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import MoodHistory
from users.auth import token_required
from .models import MoodHistory, ListeningHistory 
from .models import MoodHistory, ListeningHistory, EmotionFeedback



# --- FACIAL EMOTION API ---
@api_view(['POST'])
@token_required
def analyze_facial_emotion(request):
    username = request.jwt_username
    image_data = request.data.get('image')

    if not username or not image_data:
        return Response({'error': 'Username and Image are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        from .ml_service import detect_facial_emotion
        result = detect_facial_emotion(image_data)

        mood_entry = MoodHistory(
            username=username,
            emotion=result['emotion'],
            input_type='facial',
            confidence=result['confidence']
        )
        mood_entry.save()

        return Response({
            'message': 'Emotion analyzed successfully',
            'emotion': result['emotion'],
            'confidence': result['confidence'],
            'all_scores': result['all_scores']
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- TEXT EMOTION API ---
@api_view(['POST'])
@token_required
def analyze_text_emotion(request):
    username = request.jwt_username
    text_data = request.data.get('text')

    if not username or not text_data:
        return Response({'error': 'Username and Text are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        from .ml_service import detect_text_emotion
        result = detect_text_emotion(text_data)

        mood_entry = MoodHistory(
            username=username,
            emotion=result['emotion'],
            input_type='text',
            confidence=result['confidence']
        )
        mood_entry.save()

        return Response({
            'message': 'Text emotion analyzed successfully',
            'emotion': result['emotion'],
            'confidence': result['confidence'],
            'all_scores': result['all_scores']
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- VOICE EMOTION API ----
@api_view(['POST'])
@token_required
def analyze_voice_emotion(request):
    username = request.jwt_username
    audio_data = request.data.get('audio')

    if not username or not audio_data:
        return Response({'error': 'Username and Audio data are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        from .ml_service import detect_voice_emotion
        result = detect_voice_emotion(audio_data)

        mood_entry = MoodHistory(
            username=username,
            emotion=result['emotion'],
            input_type='speech',
            confidence=result['confidence']
        )
        mood_entry.save()

        return Response({
            'message': 'Voice emotion analyzed successfully',
            'emotion': result['emotion'],
            'confidence': result['confidence'],
            'all_scores': result['all_scores']
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- MOOD HISTORY API ---
@api_view(['GET'])
@token_required
def get_mood_history(request):
    username = request.jwt_username
    
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


# --- GET LISTENING HISTORY API ---
@api_view(['GET'])
@token_required
def get_listening_history(request):
    username = request.jwt_username
    
    if not username:
        return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
        
    # Fetch all tracks for this user, ordered by newest first, limited to the last 50 tracks to prevent lag
    tracks = ListeningHistory.objects(username=username).order_by('-timestamp')[:50]
    
    history_list = []
    for track in tracks:
        history_list.append({
            'title': track.title,
            'artist': track.artist,
            'album_cover': track.album_cover,
            'deezer_link': track.deezer_link,
            'associated_emotion': track.associated_emotion,
            'timestamp': track.timestamp.strftime('%Y-%m-%d %H:%M')
        })
        
    return Response({'tracks': history_list})

# --- MUSIC RECOMMENDATION API ---
# iTunes API keywords (separated by language preference)
EMOTION_TAGS = {
    'English': {
        'Happy': ['billboard pop', 'hollywood dance hits', 'upbeat english', 'party anthems'],
        'Sad': ['acoustic sad english', 'melancholy piano', 'english sad song', 'heartbreak pop'],
        'Angry': ['heavy metal', 'hard rock english', 'punk rock', 'english hip hop'],
        'Fear': ['ambient calm', 'classical relax', 'meditation soundscape'],
        'Surprise': ['edm hits', 'electronic dance', 'synthpop english', 'indie alternative'],
        'Neutral': ['lofi beats', 'chill english pop', 'acoustic chill', 'jazz standards']
    },
    'Global': {
        'Happy': ['pop hits', 'upbeat', 'party', 'dance global'],
        'Sad': ['acoustic sad', 'piano sad', 'melancholy', 'sad song'],
        'Angry': ['heavy metal', 'hard rock', 'punk'],
        'Fear': ['ambient calm', 'classical relax', 'meditation'],
        'Surprise': ['electronic dance', 'synthpop', 'indie global'],
        'Neutral': ['lofi beats', 'chill', 'acoustic chill', 'jazz']
    },
    'Bollywood': {
        'Happy': ['bollywood dance', 'hindi pop hits', 'punjabi upbeat', 'badshah party'],
        'Sad': ['bollywood sad', 'hindi emotional', 'arijit singh sad', 'sad hindi acoustic'],
        'Angry': ['bollywood rock', 'hindi intense', 'angry bollywood', 'desi hip hop'],
        'Fear': ['hindi calm', 'bollywood instrumental', 'indian classical flute'],
        'Surprise': ['bollywood mashup', 'hindi electronic', 'coke studio india'],
        'Neutral': ['bollywood lofi', 'hindi chill', 'indian acoustic', 'bollywood romantic']
    },
    'Pakistani': {
        'Happy': ['pakistani pop', 'coke studio upbeat', 'hasan raheem', 'ali zafar upbeat', 'pakistani dance', 'bhangra pop'],
        'Sad': ['kaifi khalil', 'atif aslam sad', 'rahat fateh ali khan', 'pakistani indie sad', 'abdul hannan', 'sad sufi', 'urdu acoustic emotional'],
        'Angry': ['pakistani rock', 'junoon', 'ep band', 'desi hip hop pakistan', 'young stunners', 'urdu rap'],
        'Fear': ['rabab instrumental', 'sufi calm', 'meditation urdu', 'pakistani classical', 'qawwali chill'],
        'Surprise': ['coke studio pakistan', 'nescafe basement', 'umair', 'samar jafri', 'pakistani indie pop', 'velo sound station'],
        'Neutral': ['urdu lofi', 'pakistani acoustic', 'ali sethi', 'ghazal chill', 'indie pakistan', 'shae gill']
    }
}

@api_view(['GET'])
def get_music_recommendation(request):
    emotion = request.query_params.get('emotion')
    preference = request.query_params.get('preference', 'Global')
    
    if not emotion:
        return Response({'error': 'Valid emotion is required'}, status=status.HTTP_400_BAD_REQUEST)
        
    if preference not in EMOTION_TAGS:
        preference = 'Global'
        
    if emotion not in EMOTION_TAGS[preference]:
        emotion = 'Neutral'
    
    selected_query = random.choice(EMOTION_TAGS[preference][emotion])
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
            fallback_query = f"{preference} {emotion}"
            fallback_url = f"https://itunes.apple.com/search?term={urllib.parse.quote(fallback_query)}&entity=song&country=IN&limit=10"
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
            selected_query = fallback_query


        #The existing return (which sends the data to the frontend)
        return Response({
            'emotion': emotion,
            'search_query': selected_query,
            'tracks': tracks
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


# --- YOUTUBE PLAY API (Fixed using ytmusicapi) ---
from ytmusicapi import YTMusic

# initializing YTMusic object 
from ytmusicapi import YTMusic
ytmusic = YTMusic()
        
# Search query # --- YOUTUBE PLAY & SAVE HISTORY API ---
from ytmusicapi import YTMusic
ytmusic = YTMusic()

@api_view(['GET'])
@token_required
def get_youtube_link(request):
    song_name = request.query_params.get('song')
    artist_name = request.query_params.get('artist')
    
    album_cover = request.query_params.get('cover', '')
    emotion = request.query_params.get('emotion', 'Unknown')
    username = request.jwt_username
    
    if not song_name:
        return Response({'error': 'Song name is required'}, status=status.HTTP_400_BAD_REQUEST)
        
    query = f"{song_name} {artist_name}"
    
    try:
        search_results = ytmusic.search(query, filter="songs", limit=1)
        video_id = None
        
        if search_results and len(search_results) > 0:
            video_id = search_results[0]['videoId']
            title_to_save = search_results[0].get('title', song_name)
        else:
            fallback_results = ytmusic.search(query, limit=1)
            if fallback_results and len(fallback_results) > 0:
                video_id = fallback_results[0]['videoId']
                title_to_save = song_name
                
        if video_id:
            youtube_link = f"https://www.youtube.com/watch?v={video_id}"
            
            # --- SAVE TO DATABASE ---
            history_track = ListeningHistory(
                username=username,
                track_id=video_id,
                title=title_to_save,
                artist=artist_name,
                album_cover=album_cover,
                deezer_link=youtube_link,
                associated_emotion=emotion
            )
            history_track.save()
            # ------------------------
            
            return Response({'youtube_url': youtube_link, 'title': title_to_save})
        else:
            return Response({'error': 'Song not found on YouTube Music'}, status=status.HTTP_404_NOT_FOUND)
            
    except Exception as e:
        print(f"YouTube Error: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

# --- ML FEEDBACK API ---
@api_view(['POST'])
@token_required
def submit_feedback(request):
    username = request.jwt_username
    mood = request.data.get('mood')
    track_id = request.data.get('track_id')
    is_accurate = request.data.get('is_accurate')
    
    if mood is None or is_accurate is None:
        return Response({'error': 'Missing feedback data'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        feedback = EmotionFeedback(
            username=username,
            mood=mood,
            track_id=track_id,
            is_accurate=is_accurate
        )
        feedback.save()
        
        # NOTE: In a full ML pipeline, we would trigger an Apache Spark job here 
        # to retrain user preferences. For now, we save it for analysis.
        
        return Response({'message': 'Feedback processed successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)