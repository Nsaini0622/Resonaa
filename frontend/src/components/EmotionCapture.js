import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

function EmotionCapture() {
  const webcamRef = useRef(null);
  
  const [imageSrc, setImageSrc] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [songs, setSongs] = useState([]); 

  // New text states
  const [textInput, setTextInput] = useState("");
  const [inputType, setInputType] = useState("camera"); // 'camera' or 'text'

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setImageSrc(null);
    setEmotion(null);
    setSongs([]);
    setTextInput(""); // Text bhi clear kardo
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

  // Facial Emotion API Call
  const analyzeEmotion = async () => {
    setEmotion("Detecting...");
    setSongs([]);

    try {
      const username = localStorage.getItem('username');
      const response = await fetch('http://127.0.0.1:8000/api/features/facial-emotion/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, image: imageSrc }),
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

  // Text Emotion API Call
  const analyzeTextEmotion = async () => {
    if (!textInput) return;
    setEmotion("Reading text...");
    setSongs([]);

    try {
      const username = localStorage.getItem('username');
      const response = await fetch('http://127.0.0.1:8000/api/features/text-emotion/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, text: textInput }),
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
    <div style={{ textAlign: 'center', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', width: '400px' }}>
      <h3>Mood & Music Detector</h3>
      
      {/* TAB BUTTONS (Camera aur Text ke beech switch karne ke liye) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => { setInputType("camera"); retake(); }} 
          style={{ padding: '8px 15px', cursor: 'pointer', background: inputType === 'camera' ? '#008CBA' : '#eee', color: inputType === 'camera' ? 'white' : 'black', border: 'none', borderRadius: '5px' }}>
          📷 Camera
        </button>
        <button 
          onClick={() => { setInputType("text"); retake(); }} 
          style={{ padding: '8px 15px', cursor: 'pointer', background: inputType === 'text' ? '#008CBA' : '#eee', color: inputType === 'text' ? 'white' : 'black', border: 'none', borderRadius: '5px' }}>
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
            style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '5px', boxSizing: 'border-box' }}
          />
          <button onClick={analyzeTextEmotion} style={{ marginTop: '10px', padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Analyze Text
          </button>
        </div>
      )}

      {/* CAMERA SECTION */}
      {inputType === "camera" && (
        imageSrc ? (
          <div>
            <img src={imageSrc} alt="captured face" style={{ width: '100%', borderRadius: '10px' }} />
            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-around' }}>
              <button onClick={retake} style={{ padding: '8px 15px', cursor: 'pointer' }}>Retake</button>
              <button onClick={analyzeEmotion} style={{ padding: '8px 15px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>Analyze Mood</button>
            </div>
          </div>
        ) : (
          <div>
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: '100%', borderRadius: '10px' }} />
            <button onClick={capture} style={{ marginTop: '15px', padding: '10px 20px', background: '#008CBA', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Capture Photo
            </button>
          </div>
        )
      )}

      {/* RESULTS (EMOTION & SONGS) */}
      {emotion && (
        <h4 style={{ marginTop: '15px', color: 'blue' }}>Detected Mood: {emotion}</h4>
      )}

      {songs.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h4>Recommended Songs for you:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
            {songs.map((song, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', background: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
                <img src={song.album_cover} alt="album cover" style={{ width: '50px', height: '50px', borderRadius: '5px', marginRight: '15px' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{song.title}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'gray' }}>{song.artist}</p>
                </div>
                {song.preview_url ? (
                  <audio controls style={{ height: '30px', width: '130px' }}>
                    <source src={song.preview_url} type="audio/mpeg" />
                  </audio>
                ) : (
                  <a href={song.deezer_link} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'blue' }}>Play</a>
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