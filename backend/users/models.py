import mongoengine
from datetime import datetime

class UserProfile(mongoengine.Document):
    meta = {'collection': 'user_profiles'}
    
    username = mongoengine.StringField(required=True, unique=True, max_length=50)
    email = mongoengine.EmailField(required=True, unique=True)
    password = mongoengine.StringField(required=True)
    created_at = mongoengine.DateTimeField(default=datetime.utcnow)
    
    profile_picture_url = mongoengine.StringField(default="")
    
    is_active = mongoengine.BooleanField(default=True)
    
    taste_profile = mongoengine.DictField()
    mood_calibration = mongoengine.DictField()

    def __str__(self):
        return self.username