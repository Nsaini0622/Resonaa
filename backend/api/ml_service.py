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