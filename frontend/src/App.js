import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // Backend  (data fetch)
    fetch('http://127.0.0.1:8000/api/health/')
      .then(res => res.json())
      .then(data => {
        setMessage(data.message); 
      })
      .catch(err => {
        setMessage('Backend not connected');
        console.error('Error fetching health check:', err);
      });
  }, []); 

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Resonaa</h1>
      <p>Emotion-Based Music Recommendation</p>
      
      {/* Backend response */}
      <h3 style={{ color: 'blue' }}>
        Backend API Status: {message}
      </h3>
    </div>
  );
}

export default App;