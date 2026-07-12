import mongoengine
from datetime import datetime
class UserProfile(mongoengine.Document):
   
   meta = {'collection': 'user_profiles'}

   #will save in database
   username = mongoengine.StringField(required=True, unique= True, max_length=50)
   email = mongoengine.EmailField(required=True, unique=True)
   password = mongoengine.StringField(required=True) # hashed password will be saved
   created_at = mongoengine.DateTimeField(default=datetime.utcnow)

   profile_picture_url = mongoengine.StringField(default="")
   is_active = mongoengine.BooleanField(default="")

   # taste profile and mood calibration (for AI recommendations)
   taste_profile=mongoengine.DictField(default=dict)
   mood_calibration=mongoengine.DictField(default=dict)

   def __str__(self):
        return self.username
