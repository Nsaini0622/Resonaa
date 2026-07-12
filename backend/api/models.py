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