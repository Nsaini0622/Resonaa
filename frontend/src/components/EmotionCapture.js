import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

function EmotionCapture() {
  // useRef hook holds direct reference of camera
  const webcamRef = useRef(null);
  
  // state to save photo, emotion, and songs
  const [imageSrc, setImageSrc] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [songs, setSongs] = useState([]); 

  // function to click photo
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  }, [webcamRef]);

  // Photo (retake) function
  const retake = () => {
    setImageSrc(null);
    setEmotion(null);
    setSongs([]); // Clear old songs
  };
  
  // -- UPDATED: Fetch songs from Deezer API --
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

  // -- UPDATED: Analyze emotion AND fetch songs --
  const analyzeEmotion = async () => {
    setEmotion("Detecting...");
    setSongs([]); // Clear old songs before loading new ones

    try {
      const username = localStorage.getItem('username');
      
      // Step 1: Detect Emotion
      const response = await fetch('http://127.0.0.1:8000/api/features/facial-emotion/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, image: imageSrc }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmotion(`${data.emotion} (Confidence: ${Math.round(data.confidence * 100)}%)`);
        
        // Step 2: Now fetch music for this emotion
        fetchSongs(data.emotion);
      } else {
        setEmotion("Error detecting emotion");
        console.error(data);
      }
    } catch (error) {
      setEmotion("Error connecting to server");
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', width: '400px' }}>
      <h3>Facial Emotion Detection</h3>
      
      {/* show photo if clicked or else show live cam */}
      {imageSrc ? (
        <div>
          <img src={imageSrc} alt="captured face" style={{ width: '100%', borderRadius: '10px' }} />
          <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-around' }}>
            <button onClick={retake} style={{ padding: '8px 15px' }}>Retake</button>
            <button onClick={analyzeEmotion} style={{ padding: '8px 15px', background: '#4CAF50', color: 'white' }}>Analyze Mood</button>
          </div>
          
          {emotion && (
            <h4 style={{ marginTop: '15px', color: 'blue' }}>Detected Mood: {emotion}</h4>
          )}

          {/* -- NEW: SHOW SONGS UI -- */}
          {songs.length > 0 && (
            <div style={{ marginTop: '20px', textAlign: 'left' }}>
              <h4>Recommended Songs for you:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                {songs.map((song, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', background: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
                    
                    {/* Album cover photo */}
                    <img src={song.album_cover} alt="album cover" style={{ width: '50px', height: '50px', borderRadius: '5px', marginRight: '15px' }} />
                    
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>{song.title}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'gray' }}>{song.artist}</p>
                    </div>

                    {/* Play Audio Button */}
                    {song.preview_url ? (
                      <audio controls style={{ height: '30px', width: '130px' }}>
                        <source src={song.preview_url} type="audio/mpeg" />
                      </audio>
                    ) : (
                      <a href={song.deezer_link} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'blue' }}>Play on Deezer</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        <div>
          {/* Webcam component will access the browser's camera */}
          <Webcam
            audio={false} // only photo no audio
            ref={webcamRef} 
            screenshotFormat="image/jpeg"
            style={{ width: '100%', borderRadius: '10px' }}
          />
          <button onClick={capture} style={{ marginTop: '15px', padding: '10px 20px', background: '#008CBA', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Capture Photo
          </button>
        </div>
      )}
    </div>
  );
}

export default EmotionCapture;