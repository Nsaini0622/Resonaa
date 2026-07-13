

from transformers import pipeline

# will downlaod model at 1st (~300 mb) then use cache
emotion_classifier = None

def get_classifier():
    global emotion_classifier
    if emotion_classifier is None:
        # HuggingFace pre-trained emotion detection model
        emotion_classifier = pipeline(
            "text-classification",
            model="bhadresh-savani/distilbert-base-uncased-emotion",
            top_k=None  # score every emotion
        )
    return emotion_classifier

def detect_text_emotion(text):
    classifier = get_classifier()
    
    # giev text to aai mODEL and it will return the list
    results = classifier(text[:512])  # Max 512 characters (model limit)
    
    # Results: [[{'label': 'joy', 'score': 0.98}, {'label': 'sadness', 'score': 0.01}, ...]]
    predictions = results[0]
    
    # Smax score emotion
    best = max(predictions, key=lambda x: x['score'])
    
    # map model's labels with ours
    label_map = {
        'joy': 'Happy',
        'sadness': 'Sad',
        'anger': 'Angry',
        'fear': 'Fear',
        'surprise': 'Surprise',
        'love': 'Happy'  # Love is in happy category
    }
    
    detected_emotion = label_map.get(best['label'], 'Neutral')
    confidence = round(best['score'], 2)
    
    # send scorefor every emotion (for analytics)
    all_scores = {}
    for pred in predictions:
        mapped_label = label_map.get(pred['label'], pred['label'])
        all_scores[mapped_label] = round(pred['score'], 4)
    
    return {
        'emotion': detected_emotion,
        'confidence': confidence,
        'all_scores': all_scores
    }

import base64
import numpy as np
import cv2
import os

def detect_facial_emotion(base64_image):
    if ',' in base64_image:
        base64_image = base64_image.split(',')[1]
    
    image_bytes = base64.b64decode(base64_image)
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        return {'emotion': 'Neutral', 'confidence': 0.5, 'all_scores': {}}
    
    # resize img to small (for no memory problem)
    height, width = image.shape[:2]
    if width > 300:
        scale = 300 / width
        image = cv2.resize(image, (300, int(height * scale)))
    
    try:
        from deepface import DeepFace
        
        # directly give numbpy array to deepface
        result = DeepFace.analyze(
            img_path=image,
            actions=['emotion'],
            enforce_detection=False,
            detector_backend='opencv'
        )
        
        if isinstance(result, list):
            result = result[0]
        
        emotions = result.get('emotion', {})
        dominant = result.get('dominant_emotion', 'neutral')
        
        label_map = {
            'angry': 'Angry',
            'disgust': 'Angry',
            'fear': 'Fear',
            'happy': 'Happy',
            'sad': 'Sad',
            'surprise': 'Surprise',
            'neutral': 'Neutral'
        }
        
        mapped_emotion = label_map.get(dominant, 'Neutral')
        confidence = round(emotions.get(dominant, 50) / 100, 2)
        
        all_scores = {}
        for key, value in emotions.items():
            mapped = label_map.get(key, key)
            all_scores[mapped] = round(value / 100, 4)
        
        return {
            'emotion': mapped_emotion,
            'confidence': confidence,
            'all_scores': all_scores
        }
        
    except Exception as e:
        print(f"DeepFace Error: {e}")
        # use open cv fallback if deepface fails
        return detect_facial_emotion_fallback(image)

def detect_facial_emotion_fallback(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    cascade_path = os.path.join(os.path.dirname(__file__), 'haarcascade_frontalface_default.xml')
    face_cascade = cv2.CascadeClassifier(cascade_path)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    if len(faces) == 0:
        return {'emotion': 'Neutral', 'confidence': 0.6, 'all_scores': {'Neutral': 0.6}}
    
    (x, y, w, h) = faces[0]
    face_roi = gray[y:y+h, x:x+w]
    
    mean_val = np.mean(face_roi)
    std_val = np.std(face_roi)
    
    if std_val > 55 and mean_val > 135:
        emotion, conf = 'Happy', 0.78
    elif std_val > 55 and mean_val < 105:
        emotion, conf = 'Sad', 0.72
    elif std_val > 50 and mean_val < 115:
        emotion, conf = 'Angry', 0.68
    elif std_val > 60:
        emotion, conf = 'Surprise', 0.70
    else:
        emotion, conf = 'Neutral', 0.75
    
    return {'emotion': emotion, 'confidence': conf, 'all_scores': {emotion: conf}}