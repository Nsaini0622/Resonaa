import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // Backend se data fetch kar rahe hain
    fetch('http://127.0.0.1:8000/api/health/')
      .then(res => res.json())
      .then(data => {
        setMessage(data.message); // Jo message API se aayega, wo set hoga
      })
      .catch(err => {
        setMessage('Backend not connected');
        console.error('Error fetching health check:', err);
      });
  }, []); // [] ka matlab: ye code sirf page load hone par ek baar chalega

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Resonaa</h1>
      <p>Emotion-Based Music Recommendation</p>
      
      {/* Backend ka response yahan dikhega */}
      <h3 style={{ color: 'blue' }}>
        Backend API Status: {message}
      </h3>
    </div>
  );
}

export default App;