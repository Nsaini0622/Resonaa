import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useTheme } from '@mui/material/styles';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function EmotionCapture() {
  const theme = useTheme();
  const webcamRef = useRef(null);
  
  const [imageSrc, setImageSrc] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [songs, setSongs] = useState([]); 

  const [textInput, setTextInput] = useState("");
  const [inputType, setInputType] = useState("camera");
  const [musicPref, setMusicPref] = useState("Global"); // 'Global', 'Bollywood', 'Pakistani'

  // NATIVE VOICE RECORDING STATES
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setImageSrc(null);
    setEmotion(null);
    setSongs([]);
    setTextInput("");
    setAudioBlobUrl(null); // voice will be cleared
  };
  
  const fetchSongs = async (detectedMood) => {
    try {
      // URL me &preference=... add kiya gaya
      const res = await fetch(`http://127.0.0.1:8000/api/features/music-recommendations/?emotion=${detectedMood}&preference=${musicPref}`);
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/features/facial-emotion/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ image: imageSrc }), 
      });
      const data = await response.json();
      if (response.ok) {
        setEmotion(`${data.emotion} (Confidence: ${Math.round(data.confidence * 100)}%)`);
        fetchSongs(data.emotion);
      } else setEmotion("Error detecting emotion");
    } catch (error) { setEmotion("Error connecting to server"); }
  };

  const analyzeTextEmotion = async () => {
    if (!textInput) return;
    setEmotion("Reading text...");
    setSongs([]);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/features/text-emotion/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ text: textInput }), 
      });
      const data = await response.json();
      if (response.ok) {
        setEmotion(`${data.emotion} (Confidence: ${Math.round(data.confidence * 100)}%)`);
        fetchSongs(data.emotion);
      } else setEmotion("Error detecting text emotion");
    } catch (error) { setEmotion("Error connecting to server"); }
  };

  // NATIVE VOICE RECORDING LOGIC
  const startRecording = async () => {
    setAudioBlobUrl(null);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // We determine the best supported audio format based on the browser.
      let mimeType = 'audio/webm'; // Default for most modern browsers
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4'; 
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType });
      mediaRecorderRef.current = mediaRecorder;

      // We push the data directly into the array.
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // All those small chunks are combined to create a proper audio file.
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(audioUrl);
      };

      // Collect chunks at a 100ms interval (so that buffering works properly).
      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Microphone permission denied or an error occurred.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const analyzeVoiceEmotion = async () => {
    if (!audioBlobUrl) return;
    setEmotion("Analyzing voice...");
    setSongs([]);
    try {
      const audioBlob = await fetch(audioBlobUrl).then(r => r.blob());
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result;
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/api/features/voice-emotion/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ audio: base64Audio }),
        });
        const data = await response.json();
        if (response.ok) {
          setEmotion(`${data.emotion} (Confidence: ${Math.round(data.confidence * 100)}%)`);
          fetchSongs(data.emotion);
        } else setEmotion("Error detecting voice emotion");
      };
    } catch (error) { setEmotion("Error connecting to server"); }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px auto', padding: '30px', 
      background: theme.palette.mode === 'dark' ? 'rgba(0, 31, 63, 0.6)' : 'rgba(255, 255, 255, 0.7)', 
      backdropFilter: 'blur(20px)', border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, 
      borderRadius: '24px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
    }}>
      <h3 style={{ color: theme.palette.text.primary, marginTop: 0 }}>Mood & Music Detector</h3>
      
            {/* MUSIC PREFERENCE DROPDOWN */}
      <FormControl size="small" sx={{ mb: 3, minWidth: 150 }}>
        <InputLabel sx={{ color: theme.palette.text.primary }}>Music Style</InputLabel>
        <Select
          value={musicPref}
          label="Music Style"
          onChange={(e) => setMusicPref(e.target.value)}
          sx={{ color: theme.palette.text.primary, '.MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main } }}
        >
          <MenuItem value="English">🇺🇸 English/Western</MenuItem>
          <MenuItem value="Bollywood">🇮🇳 Bollywood/Hindi</MenuItem>
          <MenuItem value="Pakistani">🇵🇰 Pakistani/Urdu</MenuItem>
          <MenuItem value="Global">🌎 Global Mix</MenuItem>
        </Select>
      </FormControl>
      
      {/* TAB BUTTONS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => { setInputType("camera"); retake(); }} style={{ padding: '8px 15px', cursor: 'pointer', background: inputType === 'camera' ? theme.palette.primary.main : 'transparent', color: inputType === 'camera' ? 'white' : theme.palette.text.primary, border: `1px solid ${theme.palette.primary.main}`, borderRadius: '999px' }}>📷 Camera</button>
        <button onClick={() => { setInputType("text"); retake(); }} style={{ padding: '8px 15px', cursor: 'pointer', background: inputType === 'text' ? theme.palette.primary.main : 'transparent', color: inputType === 'text' ? 'white' : theme.palette.text.primary, border: `1px solid ${theme.palette.primary.main}`, borderRadius: '999px' }}>✍️ Text</button>
        <button onClick={() => { setInputType("voice"); retake(); }} style={{ padding: '8px 15px', cursor: 'pointer', background: inputType === 'voice' ? theme.palette.primary.main : 'transparent', color: inputType === 'voice' ? 'white' : theme.palette.text.primary, border: `1px solid ${theme.palette.primary.main}`, borderRadius: '999px' }}>🎤 Voice</button>
      </div>
      
      {/* TEXT INPUT SECTION */}
      {inputType === "text" && (
        <div>
          <textarea placeholder="How are you feeling today?" value={textInput} onChange={(e) => setTextInput(e.target.value)} style={{ width: '100%', height: '80px', padding: '15px', borderRadius: '12px', boxSizing: 'border-box', background: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'white', color: theme.palette.text.primary, border: `1px solid ${theme.palette.mode === 'dark' ? '#4A5568' : '#ccc'}`, fontFamily: 'inherit' }} />
          <button onClick={analyzeTextEmotion} style={{ marginTop: '15px', padding: '10px 24px', background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, color: 'white', border: 'none', borderRadius: '999px', cursor: 'pointer', fontWeight: 'bold' }}>Analyze Text</button>
        </div>
      )}

      {/* VOICE INPUT SECTION */}
      {inputType === "voice" && (
        <div style={{ padding: '15px', background: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'white', borderRadius: '12px', border: `1px solid ${theme.palette.mode === 'dark' ? '#4A5568' : '#ccc'}` }}>
          <p style={{ color: theme.palette.text.primary, margin: '0 0 15px 0' }}>Status: <strong style={{ color: isRecording ? 'red' : 'inherit' }}>{isRecording ? 'RECORDING 🔴' : 'IDLE'}</strong></p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
            <button onClick={startRecording} disabled={isRecording} style={{ padding: '8px 15px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '999px', cursor: isRecording ? 'not-allowed' : 'pointer' }}>⏺ Record</button>
            <button onClick={stopRecording} disabled={!isRecording} style={{ padding: '8px 15px', background: '#34495e', color: 'white', border: 'none', borderRadius: '999px', cursor: !isRecording ? 'not-allowed' : 'pointer' }}>⏹ Stop</button>
          </div>
          {audioBlobUrl && (
            <div>
              <audio src={audioBlobUrl} controls style={{ width: '100%', marginBottom: '15px' }} />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button onClick={retake} style={{ padding: '8px 20px', cursor: 'pointer', background: 'transparent', border: `1px solid ${theme.palette.text.primary}`, color: theme.palette.text.primary, borderRadius: '999px' }}>Clear</button>
                <button onClick={analyzeVoiceEmotion} style={{ padding: '8px 20px', background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, color: 'white', border: 'none', cursor: 'pointer', borderRadius: '999px', fontWeight: 'bold' }}>Analyze Voice</button>
              </div>
            </div>
          )}
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
            <button onClick={capture} style={{ marginTop: '15px', padding: '10px 24px', background: theme.palette.primary.main, color: 'white', border: 'none', borderRadius: '999px', cursor: 'pointer', fontWeight: 'bold' }}>Capture Photo</button>
          </div>
        )
      )}

      {/* RESULTS (EMOTION & SONGS) */}
      {emotion && <h4 style={{ marginTop: '20px', color: theme.palette.secondary.main, fontWeight: 'bold' }}>Detected Mood: {emotion}</h4>}
      {songs.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h4 style={{ color: theme.palette.text.primary }}>Recommended Songs for you:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
            {songs.map((song, index) => (
              <div key={index} className="song-card" style={{ display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '12px', background: theme.palette.mode === 'dark' ? '#B0E0E6' : '#f9f9f9', border: `1px solid ${theme.palette.mode === 'dark' ? '#D6F5FF' : 'rgba(0,0,0,0.05)'}`, transition: 'all 0.2s ease', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = theme.palette.mode === 'dark' ? '#D6F5FF' : '#e9ecef'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = theme.palette.mode === 'dark' ? '#B0E0E6' : '#f9f9f9'; }} >
                <img src={song.album_cover} alt="album cover" style={{ width: '55px', height: '55px', borderRadius: '8px', marginRight: '15px' }} />
                <div style={{ flex: 1 }}>
                  <p className="song-text" style={{ margin: 0, fontWeight: 'bold', color: '#000080', transition: 'color 0.2s' }}>{song.title}</p>
                  <p className="artist-text" style={{ margin: 0, fontSize: '12px', color: '#001F3F', transition: 'color 0.2s' }}>{song.artist}</p>
                </div>
                {song.preview_url ? (
                  <audio controls style={{ height: '35px', width: '130px' }}><source src={song.preview_url} type="audio/mpeg" /></audio>
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