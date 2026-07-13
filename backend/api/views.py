import random
import requests
import urllib.parse
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
# EMOTION_GENRE_MAP = {
#     'Happy': ['pop hits', 'upbeat', 'party', 'dance'],
#     'Sad': ['acoustic sad', 'piano sad', 'melancholy', 'sad song'],
#     'Angry': ['heavy metal', 'hard rock', 'punk'],
#     'Fear': ['ambient calm', 'classical relax', 'meditation'],
#     'Surprise': ['electronic dance', 'synthpop', 'indie'],
#     'Neutral': ['lofi beats', 'chill', 'acoustic chill', 'jazz']
# }

# Hindi / Bollywood music keywords
# EMOTION_GENRE_MAP = {
#     'Happy': ['bollywood dance', 'hindi pop hits', 'punjabi upbeat', 'bollywood party'],
#     'Sad': ['bollywood sad', 'hindi emotional', 'arijit singh sad', 'sad hindi acoustic'],
#     'Angry': ['bollywood rock', 'hindi intense', 'angry bollywood'],
#     'Fear': ['hindi calm', 'bollywood instrumental', 'indian classical flute'],
#     'Surprise': ['bollywood mashup', 'hindi electronic', 'coke studio india'],
#     'Neutral': ['bollywood lofi', 'hindi chill', 'indian acoustic', 'bollywood romantic']
# }



# EMOTION_TAGS = {
#     'Happy': ['happy', 'dance', 'upbeat', 'party', 'fun', 'joy', 'feel good', 'energetic', 'bollywood dance', 'pop', 'bhangra'],
#     'Sad': ['sad', 'emotional', 'heartbreak', 'melancholy', 'cry', 'acoustic sad', 'pain', 'lonely', 'bollywood sad', 'sufi'],
#     'Angry': ['angry', 'rage', 'intense', 'hard rock', 'heavy metal', 'aggressive', 'rebel', 'rock'],
#     'Fear': ['calm', 'ambient', 'relaxing', 'peaceful', 'meditation', 'soothing', 'flute', 'healing', 'instrumental'],
#     'Surprise': ['electronic', 'mashup', 'remix', 'synth', 'unexpected', 'fusion', 'edm', 'indie', 'experimental'],
#     'Neutral': ['chill', 'lofi', 'acoustic', 'jazz', 'easy listening', 'breeze', 'romantic', 'soft', 'indie pop']
# }


# Indian languages and artists mixed tags
EMOTION_TAGS = {
    'Happy': ['dance', 'party', 'punjabi', 'bollywood hit', 'upbeat', 'badshah', 'happy hindi',
              
              
        'bollywood dance', 'punjabi hit', 'happy hindi', # Hindi
        'pakistani pop', 'coke studio upbeat' #oak 
        'party pop', 'upbeat', 'dance hits',             # English
        ],


    'Sad': ['sad hindi', 'arijit singh', 'melancholy', 'broken heart', 'sufi', 'sad acoustic',
            
        'arijit singh sad', 'bollywood emotional',       # Hindi
        'atif aslam sad', 'rahat fateh', 'sad sufi' #pak 
            'melancholy', 'sad acoustic', 'heartbreak',      # English
        ],


    'Angry': ['hard rock', 'intense', 'angry', 'metal', 'hip hop india', 'rap',
              
        'bollywood rock', 'desi hip hop', 'intense',     # Hindi
        'pakistani rock', 'junoon', 'ep band', #pak 
        'hard rock', 'heavy metal', 'angry rap',         # English
        ],


    'Fear': ['calm', 'relaxing', 'flute', 'meditation', 'indian classical', 'peaceful',
             
        'indian classical flute', 'soothing hindi',      # Hindi
        'meditation', 'sufi calm', 'rabab' #pak
         'calm ambient', 'relaxing instrumental',         # English
           ],


    'Surprise': ['mashup', 'remix', 'electronic', 'coke studio', 'fusion', 'indie india',
                 
        'bollywood mashup', 'fusion india',              # Hindi
        'coke studio pakistan', 'nescafe basement' #pak
        'electronic', 'synthpop', 'indie hit',           # English
        ],


    'Neutral': ['lofi hindi', 'chill', 'acoustic', 'jazz', 'romantic bollywood', 'indie pop',
                
        'bollywood lofi', 'hindi chill',                 # Hindi
        'urdu acoustic', 'indie pakistan', 'ghazal' #pak
        'lofi beats', 'chill jazz', 'easy listening',    # English
        ]
}

# some random words to get new search 
MODIFIERS = ['hits', 'music', 'song', 'track', 'top', 'india', 'global', 'new', 'classic']

@api_view(['GET'])
def get_music_recommendation(request):
    emotion = request.query_params.get('emotion')
    
    if not emotion:
        return Response({'error': 'Valid emotion is required'}, status=status.HTTP_400_BAD_REQUEST)
        
    if emotion not in EMOTION_TAGS:
        emotion = 'Neutral'

        # get a base search term associated with emotion
    selected_query = random.choice(EMOTION_TAGS[emotion])
    encoded_query = urllib.parse.quote(selected_query)


    # 1. get one main word acc to emotion (e.g., 'heartbreak')
    base_tag = random.choice(EMOTION_TAGS[emotion])
    
    # 2. one random extra word (e.g., 'hits')
    modifier = random.choice(MODIFIERS)
    
    # 3.sometimes will add year to get new recommendation
    year = random.choice(['', '2023', '2022', '2010s', '90s', '2000s'])
    
    # Search query generated: "heartbreak hits 90s" "bollywood dance new"
    selected_query = f"{base_tag} {modifier} {year}".strip()
    
    encoded_query = urllib.parse.quote(selected_query)
    
    # will ask iTunes 15 songs and filter 10 songs
    # itunes_url = f"https://itunes.apple.com/search?term={encoded_query}&entity=song&limit=15"

    # added IN
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
        
        # shuffle order so music will not be in same order 
        if len(tracks) > 0:
            random.shuffle(tracks)
            #top 8-10 songs
            tracks = tracks[:10]
        else:
            # Failsafe: if combination doesn't recommend songs ask from simple tag
            fallback_query = urllib.parse.quote(emotion)
            fallback_url = f"https://itunes.apple.com/search?term={fallback_query}&entity=song&limit=10"
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
            selected_query = emotion
            
        return Response({
            'emotion': emotion,
            'search_query': selected_query,
            'tracks': tracks
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)