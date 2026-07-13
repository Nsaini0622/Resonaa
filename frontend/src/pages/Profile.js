import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {

    if (!username) {
      navigate('/login');
      return;
    }

    // ask history from backend
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/features/mood-history/?username=${username}`);
        const data = await response.json();
        
        if (response.ok) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error("Error fetching history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [username, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', width: '80%', margin: '50px auto' }}>
      <h2>{username}'s Mood History</h2>
      
      <button onClick={() => navigate('/')} style={{ marginBottom: '20px', padding: '8px 15px' }}>
        ← Back to Home
      </button>

      {loading ? (
        <p>Loading your past moods...</p>
      ) : history.length === 0 ? (
        <p>No mood history found. Go scan your face!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f2f2f2' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date & Time</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Input Type</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Detected Emotion</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.timestamp}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.input_type}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>{entry.emotion}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{Math.round(entry.confidence * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Profile;