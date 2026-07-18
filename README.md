<div align="center">

# 🎵 Resonaa
### AI-Powered Emotion-Based Music Recommendation Platform

Resonaa is a full-stack, AI-powered music recommendation system. It goes beyond manual playlists by understanding your current psychological state. Using your device's camera, microphone, or text input, Resonaa analyzes your emotions in real-time and fetches the perfect music tracks tailored to your exact mood.
![Banner](https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=1200&auto=format&fit=crop)

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![Django](https://img.shields.io/badge/Backend-Django-092E20?logo=django)
![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)

</div>

## ✨ Key Features
- **Facial Emotion Recognition:** Uses OpenCV pixel density and contrast algorithms to detect micro-expressions directly from your webcam.
- **Semantic Text Analysis:** Integrates HuggingFace's pre-trained `distilbert-base-uncased-emotion` NLP model to understand the context and true sentiment of your typed thoughts.
- **Vocal Tone Fusion:** Processes microphone audio using `librosa` (pitch/volume signal processing) and Google Speech-to-Text to fuse tone and words for accurate speech emotion.
- **Deep Music Curation:** Maps emotions dynamically to the Apple iTunes Search API, retrieving tracks across Global, English, Bollywood, and Pakistani genres.
- **In-App Music Streaming:** Uses a hidden YouTube iframe integration paired with `ytmusicapi` to stream full-length audio legally and seamlessly within the app.
- **Interactive Dashboards:** Tracks user history with MongoDB and visualizes mood trends over time using `Recharts` interactive pie charts.
- **Passwordless Security:** Protected by robust JWT (JSON Web Tokens) middleware and complex regex password policies.

## 🛠️ Tech Stack
**Frontend:**
- React.js & React Router
- Material-UI (MUI) & Framer Motion (Glassmorphism & Animations)
- React Webcam & Recharts

**Backend:**
- Django & Django REST Framework (Python)
- MongoDB Atlas (via MongoEngine)
- OpenCV, DeepFace, HuggingFace Transformers, Librosa

## AI & Machine Learning

- OpenCV
- DeepFace
- HuggingFace Transformers
- Librosa
- SpeechRecognition

## Database

- MongoDB Atlas
- MongoEngine

## APIs

- Apple iTunes Search API
- Google Speech-to-Text
- YouTube Music API (Optional)

  ---

# 🏗 System Architecture

```
                +----------------------+
                |      React Frontend  |
                +----------+-----------+
                           |
                           |
                     REST API Requests
                           |
                           ▼
              +-------------------------+
              | Django REST Framework   |
              +------------+------------+
                           |
          ------------------------------------------
          |                  |                     |
          ▼                  ▼                     ▼
   Face Detection      Text Analysis      Voice Analysis
    (OpenCV)          (Transformers)        (Librosa)
          \                |                  /
           \               |                 /
            \              |                /
             +----------------------------+
             | Emotion Classification     |
             +-------------+--------------+
                           |
                           ▼
              Emotion → Music Mapping Engine
                           |
                           ▼
                  Apple iTunes API
                           |
                           ▼
                  Recommended Songs
```


---

## 📂 Project Structure

```bash
Resonaa/
├── frontend/                 # Client-side React application
│   ├── src/
│   │   ├── components/       # EmotionCapture, MusicPlayer UI
│   │   ├── pages/            # LandingPage, Auth, Profile
│   │   ├── theme.js          # MUI Custom Color Palette
│   │   └── App.js            # Main Router & Scaffold
│
├── backend/                  # Server-side Django application
│   ├── resonaa_api/          # Main project configuration
│   ├── users/                # Authentication & Security logic
│   ├── api/                  # Emotion engines & Music APIs
│   │   ├── ml_service.py     # AI Pipeline (OpenCV, BERT, Librosa)
│   │   └── models.py         # MongoDB Schemas (History Tracking)
│   └── venv/                 # Isolated Python environment
```
---

# 🚀 Getting Started

## Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB Atlas Account

---

## Clone Repository

```bash
git clone https://github.com/your-username/Resonaa.git

cd Resonaa
```

---

# Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm start
```

Application will start at

```
http://localhost:3000
```

---


**📊 Project Metrics**
- ⚡ Analyzes user emotions via 3 separate neural/algorithmic pathways within seconds
- 🎯 Dynamically cross-references moods against over 90 Million global tracks
- 🔍 Filters output specifically for distinct regional markets (India/Pakistan/Global)
- 🤖 Generates continuous reinforcement learning data via user feedback
- 📈 Visualizes psychological trends via interactive chart analytics
- 🧩 Bypasses third-party audio restrictions using an invisible streaming proxy

**🎯 Future Improvements**
- 📝 Spotify & Apple Music account integration
- 📊 Advanced Emotion-to-BPM acoustic mapping
- 🌐 Multi-language UI and emotion detection
- 🔐 FIDO2 WebAuthn (Passkeys) passwordless authentication
- 🤝 Friend-to-friend mood playlist sharing
- 📈 Weekly AI-powered mood & listening reports
- 🤖 Smarter AI-based music recommendations
- 🎵 Personalized playlist generation
- ☁️ Cross-device cloud synchronization
- 📱 Android & iOS mobile applications
- 📊 Enhanced mood analytics dashboard
- 🎧 Support for additional music platforms

---

# 🔒 Privacy

Resonaa follows a privacy-first approach.

- Images and audio are processed in memory.
- No media files are permanently stored.
- User authentication is secured using JWT.
- Sensitive credentials are managed through environment variables.

---
<div align="center">

Made with ❤️ using React, Django and AI

⭐ Star this repository if you found it useful.

</div>
