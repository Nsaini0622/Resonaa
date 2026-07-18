import mongoengine
from datetime import datetime

class MoodHistory(mongoengine.Document):
    meta = {'collection': 'mood_history'}
    
    # which users mood
    username = mongoengine.StringField(required=True)
    
    # emotion detected (e.g. "happy", "sad", "angry")
    emotion = mongoengine.StringField(required=True)
    
    # Model surity (0.0 - 1.0 tak)
    confidence = mongoengine.FloatField(default=0.85)
    
    # Emotion from which source (text, speech,facial)
    input_type = mongoengine.StringField(choices=('text', 'speech', 'facial'))
    
    # saved when
    timestamp = mongoengine.DateTimeField(default=datetime.utcnow)

    def __str__(self):
        return f"{self.username} - {self.emotion} at {self.timestamp}"
    
    # --- LISTENING HISTORY MODEL ---
class ListeningHistory(mongoengine.Document):
    meta = {'collection': 'listening_history'}
    
    # ehose songs
    username = mongoengine.StringField(required=True)
    
    # Songs details (from iTunes)
    track_id = mongoengine.StringField()           # Track unique ID
    title = mongoengine.StringField(required=True) # song name
    artist = mongoengine.StringField()             # Singer's name
    album_cover = mongoengine.StringField()        # Album photo link
    deezer_link = mongoengine.StringField()        # Play link
    
    # song suggested on which mood
    associated_emotion = mongoengine.StringField()
    
    # saved when
    timestamp = mongoengine.DateTimeField(default=datetime.utcnow)

    def __str__(self):
        return f"{self.username} - {self.title} by {self.artist}"
    
# --- REINFORCEMENT LEARNING FEEDBACK MODEL ---
class EmotionFeedback(mongoengine.Document):
    meta = {'collection': 'emotion_feedback'}
    
    username = mongoengine.StringField(required=True)
    mood = mongoengine.StringField(required=True)
    track_id = mongoengine.StringField()
    is_accurate = mongoengine.BooleanField(required=True)
    timestamp = mongoengine.DateTimeField(default=datetime.utcnow)

    def __str__(self):
        return f"{self.username} - Mood: {self.mood} - Accurate: {self.is_accurate}"