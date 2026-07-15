import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useTheme } from '@mui/material/styles';

function EmotionCapture() {
  const theme = useTheme();
  const webcamRef = useRef(null);
  
  const [imageSrc, setImageSrc] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [songs, setSongs] = useState([]); 

  const [textInput, setTextInput] = useState("");
  const [inputType, setInputType] = useState("camera"); 

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setImageSrc(null);
    setEmotion(null);
    setSongs([]);
    setTextInput(""); 
  };
  
  const fetchSongs = async (detectedMood) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/features/music-recommendations/?emotion=${detectedMood}`);
      const musicData = await res.json();
      
      if (res.ok) {
        setSongs(musicData.tracks);
      }
    } catch (error) {
      console.error("Error fetching songs", error);
    }
  };

  const analyzeEmotion = async () => {
    setEmotion("Detecting...");
    setSongs([]);

    try {
      // Token nikalo
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/features/facial-emotion/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Token bhej rahe hain
        },
        body: JSON.stringify({ image: imageSrc }), // Username bhejne ki zaroorat nahi, backend token se khud nikal lega
      });

      const data = await response.json();
      if (response.ok) {
        setEmotion(`${data.emotion} (Confidence: ${Math.round(data.confidence * 100)}%)`);
        fetchSongs(data.emotion);
      } else {
        setEmotion("Error detecting emotion");
      }
    } catch (error) {
      setEmotion("Error connecting to server");
    }
  };

  const analyzeTextEmotion = async () => {
    if (!textInput) return;
    setEmotion("Reading text...");
    setSongs([]);

    try {
      // Token nikalo
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/features/text-emotion/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Token bhej rahe hain
        },
        body: JSON.stringify({ text: textInput }), // Username bhejne ki zaroorat nahi
      });

      const data = await response.json();
      if (response.ok) {
        setEmotion(`${data.emotion} (Confidence: ${Math.round(data.confidence * 100)}%)`);
        fetchSongs(data.emotion);
      } else {
        setEmotion("Error detecting text emotion");
      }
    } catch (error) {
      setEmotion("Error connecting to server");
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px auto', padding: '30px', 
      background: theme.palette.mode === 'dark' ? 'rgba(0, 31, 63, 0.6)' : 'rgba(255, 255, 255, 0.7)', 
      backdropFilter: 'blur(20px)', border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, 
      borderRadius: '24px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
    }}>
      <h3 style={{ color: theme.palette.text.primary, marginTop: 0 }}>Mood & Music Detector</h3>
      
      {/* TAB BUTTONS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => { setInputType("camera"); retake(); }} 
          style={{ padding: '8px 15px', cursor: 'pointer', background: inputType === 'camera' ? theme.palette.primary.main : 'transparent', color: inputType === 'camera' ? 'white' : theme.palette.text.primary, border: `1px solid ${theme.palette.primary.main}`, borderRadius: '999px' }}>
          📷 Camera
        </button>
        <button 
          onClick={() => { setInputType("text"); retake(); }} 
          style={{ padding: '8px 15px', cursor: 'pointer', background: inputType === 'text' ? theme.palette.primary.main : 'transparent', color: inputType === 'text' ? 'white' : theme.palette.text.primary, border: `1px solid ${theme.palette.primary.main}`, borderRadius: '999px' }}>
          ✍️ Text
        </button>
      </div>
      
      {/* TEXT INPUT SECTION */}
      {inputType === "text" && (
        <div>
          <textarea 
            placeholder="How are you feeling today? (e.g. I had a really bad day)" 
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            style={{ width: '100%', height: '80px', padding: '15px', borderRadius: '12px', boxSizing: 'border-box', background: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'white', color: theme.palette.text.primary, border: `1px solid ${theme.palette.mode === 'dark' ? '#4A5568' : '#ccc'}`, fontFamily: 'inherit' }}
          />
          <button onClick={analyzeTextEmotion} style={{ marginTop: '15px', padding: '10px 24px', background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, color: 'white', border: 'none', borderRadius: '999px', cursor: 'pointer', fontWeight: 'bold' }}>
            Analyze Text
          </button>
        </div>
      )}

      {/* CAMERA SECTION */}
      {inputType === "camera" && (
        imageSrc ? (
          <div>
            <img src={imageSrc} alt="captured face" style={{ width: '100%', borderRadius: '16px' }} />
            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-around' }}>
              <button onClick={retake} style={{ padding: '8px 20px', cursor: 'pointer', background: 'transparent', border: `1px solid ${theme.palette.text.primary}`, color: theme.palette.text.primary, borderRadius: '999px' }}>Retake</button>
              <button onClick={analyzeEmotion} style={{ padding: '8px 20px', background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, color: 'white', border: 'none', cursor: 'pointer', borderRadius: '999px', fontWeight: 'bold' }}>Analyze Mood</button>
            </div>
          </div>
        ) : (
          <div>
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: '100%', borderRadius: '16px' }} />
            <button onClick={capture} style={{ marginTop: '15px', padding: '10px 24px', background: theme.palette.primary.main, color: 'white', border: 'none', borderRadius: '999px', cursor: 'pointer', fontWeight: 'bold' }}>
              Capture Photo
            </button>
          </div>
        )
      )}

      {/* RESULTS (EMOTION & SONGS) */}
      {emotion && (
        <h4 style={{ marginTop: '20px', color: theme.palette.secondary.main, fontWeight: 'bold' }}>Detected Mood: {emotion}</h4>
      )}

      {songs.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h4 style={{ color: theme.palette.text.primary }}>Recommended Songs for you:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
            {songs.map((song, index) => (
              <div 
                key={index} 
                className="song-card"
                style={{ 
                  display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '12px',
                  background: theme.palette.mode === 'dark' ? '#B0E0E6' : '#f9f9f9',
                  border: `1px solid ${theme.palette.mode === 'dark' ? '#D6F5FF' : 'rgba(0,0,0,0.05)'}`,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (theme.palette.mode === 'dark') {
                    e.currentTarget.style.background = '#D6F5FF'; 
                  } else {
                    e.currentTarget.style.background = '#e9ecef';
                  }
                }}
                onMouseLeave={(e) => {
                  if (theme.palette.mode === 'dark') {
                    e.currentTarget.style.background = '#B0E0E6'; 
                  } else {
                    e.currentTarget.style.background = '#f9f9f9';
                  }
                }}
              >
                <img src={song.album_cover} alt="album cover" style={{ width: '55px', height: '55px', borderRadius: '8px', marginRight: '15px' }} />
                <div style={{ flex: 1 }}>
                  <p className="song-text" style={{ margin: 0, fontWeight: 'bold', color: '#000080', transition: 'color 0.2s' }}>{song.title}</p>
                  <p className="artist-text" style={{ margin: 0, fontSize: '12px', color: '#001F3F', transition: 'color 0.2s' }}>{song.artist}</p>
                </div>
                {song.preview_url ? (
                  <audio controls style={{ height: '35px', width: '130px' }}>
                    <source src={song.preview_url} type="audio/mpeg" />
                  </audio>
                ) : (
                  <a href={song.deezer_link} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: theme.palette.secondary.main, fontWeight: 'bold', textDecoration: 'none' }}>Play</a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default EmotionCapture;