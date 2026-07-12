import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

function EmotionCapture() {
  // useRef hook holds direct reference of camera
  const webcamRef = useRef(null);
  
  // state to save photo
  const [imageSrc, setImageSrc] = useState(null);
  const [emotion, setEmotion] = useState(null);

  // function to click photo (useCallback keeps performance good )
  const capture = useCallback(() => {
    // take current frame from camera as base64 string
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  }, [webcamRef]);

  // Photo (retake) function
  const retake = () => {
    setImageSrc(null);
    setEmotion(null);
  };

  const analyzeEmotion = async () => {
    // for now will show fake response
    // in next step will connect to backend
    setEmotion("Detecting...");
    
    setTimeout(() => {
      setEmotion("Happy 😊");
    }, 1500);
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', width: '400px' }}>
      <h3>Facial Emotion Detection</h3>
      
      {/* show photo if clicked or elseshow live cam */}
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
        </div>
      ) : (
        <div>
          {/* Webcam component will access the browser's camera */}
          <Webcam
            audio={false} // only photo no audio
            ref={webcamRef} // connected to useRef 
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