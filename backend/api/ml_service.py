from transformers import pipeline
import tempfile
import librosa
import numpy as np
import base64
import cv2
import os
import speech_recognition as sr
from pydub import AudioSegment

# --- TEXT EMOTION (BERT) ---
emotion_classifier = None

def get_classifier():
    global emotion_classifier
    if emotion_classifier is None:
        emotion_classifier = pipeline(
            "text-classification",
            model="bhadresh-savani/distilbert-base-uncased-emotion",
            top_k=None
        )
    return emotion_classifier

def detect_text_emotion(text):
    classifier = get_classifier()
    results = classifier(text[:512])
    predictions = results[0]
    best = max(predictions, key=lambda x: x['score'])
    
    label_map = {
        'joy': 'Happy',
        'sadness': 'Sad',
        'anger': 'Angry',
        'fear': 'Fear',
        'surprise': 'Surprise',
        'love': 'Happy'
    }
    
    detected_emotion = label_map.get(best['label'], 'Neutral')
    confidence = round(best['score'], 2)
    
    all_scores = {}
    for pred in predictions:
        mapped_label = label_map.get(pred['label'], pred['label'])
        all_scores[mapped_label] = round(pred['score'], 4)
    
    return {
        'emotion': detected_emotion,
        'confidence': confidence,
        'all_scores': all_scores
    }


# --- VOICE EMOTION (FUSION: TONE + WORDS) ---
def detect_voice_emotion(base64_audio):
    if ',' in base64_audio:
        base64_audio = base64_audio.split(',')[1]
        
    try:
        import base64
        import os
        import speech_recognition as sr
        
        audio_bytes = base64.b64decode(base64_audio)
        
        # Same audio to temp file
        temp_path = os.path.join(tempfile.gettempdir(), 'resonaa_audio.webm')
        with open(temp_path, 'wb') as f:
            f.write(audio_bytes)
            
        # 1. Convert to WAV format (needs both WAV Librosa and SpeechRecognition )
        y, sr_freq = librosa.load(temp_path, sr=16000)
        wav_path = os.path.join(tempfile.gettempdir(), 'resonaa_audio.wav')
        import soundfile as sf
        sf.write(wav_path, y, sr_freq)
        
        if os.path.exists(temp_path):
            os.remove(temp_path)

        if len(y) == 0:
            return {'emotion': 'Neutral', 'confidence': 0.5, 'all_scores': {}}

        # --- PART A: TONE ANALYSIS  ---
        rms = librosa.feature.rms(y=y)[0]
        mean_volume = np.mean(rms)
        pitches, magnitudes = librosa.piptrack(y=y, sr=sr_freq)
        pitch_mean = np.mean(pitches[pitches > 0]) if np.any(pitches > 0) else 0
        zero_crossings = librosa.zero_crossings(y, pad=False)
        crossing_rate = np.mean(zero_crossings)

        tone_emotion = 'Neutral'
        tone_confidence = 0.5
        
        if mean_volume > 0.02 and pitch_mean > 800:
            if crossing_rate > 0.12:
                tone_emotion, tone_confidence = 'Angry', 0.7
            else:
                tone_emotion, tone_confidence = 'Happy', 0.7
        elif mean_volume < 0.008:
            tone_emotion, tone_confidence = 'Sad', 0.7

        # --- PART B: SEMANTIC ANALYSIS (what's said) ---
        words_emotion = None
        spoken_text = ""
        try:
            recognizer = sr.Recognizer()
            with sr.AudioFile(wav_path) as source:
                # Clear bg noice and listen to audio
                recognizer.adjust_for_ambient_noise(source)
                audio_data = recognizer.record(source)
                
            # Get get from google Speech API (Free) 
            spoken_text = recognizer.recognize_google(audio_data)
            print(f"User said: {spoken_text}")
            
            # extracted text sent to text Ai (BERT)
            text_result = detect_text_emotion(spoken_text)
            words_emotion = text_result['emotion']
            words_confidence = text_result['confidence']
        except Exception as stt_e:
            print(f"Speech-to-Text Error: {stt_e}")

        # Temp WAV clean
        if os.path.exists(wav_path):
            os.remove(wav_path)

        # --- PART C: FUSION ---
        #If the words are understood we'll give higher priority to Words (Text AI).
        if words_emotion and words_emotion != 'Neutral':
            final_emotion = words_emotion
            final_confidence = round(words_confidence, 2)
        else:
            # If the words aren't understood properly or the words are neutral, we'll use Tone (Voice).
            final_emotion = tone_emotion
            final_confidence = round(tone_confidence, 2)

        # Always send a basic dictionary.
        all_scores = {
            'Happy': 0.1, 'Sad': 0.1, 'Angry': 0.1, 
            'Fear': 0.1, 'Surprise': 0.1, 'Neutral': 0.1
        }
        all_scores[final_emotion] = final_confidence

        return {
            'emotion': final_emotion,
            'confidence': final_confidence,
            'all_scores': all_scores,
            'spoken_text': spoken_text  # for debugging (optional)
        }
    except Exception as e:
        print(f"Voice Analysis Error: {e}")
        return {'emotion': 'Neutral', 'confidence': 0.5, 'all_scores': {}}


# --- FACIAL EMOTION (DEEPFACE / OPENCV) ---
def detect_facial_emotion(base64_image):
    if ',' in base64_image:
        base64_image = base64_image.split(',')[1]
    
    image_bytes = base64.b64decode(base64_image)
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        return {'emotion': 'Neutral', 'confidence': 0.5, 'all_scores': {}}
    
    height, width = image.shape[:2]
    if width > 300:
        scale = 300 / width
        image = cv2.resize(image, (300, int(height * scale)))
    
    try:
        from deepface import DeepFace
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