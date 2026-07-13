import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Box, CircularProgress } from '@mui/material';

function Profile() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) { navigate('/login'); return; }

    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/features/mood-history/?username=${username}`);
        const data = await response.json();
        if (response.ok) setHistory(data.history);
      } catch (error) {
        console.error("Error fetching history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [username, navigate]);

  const getEmotionColor = (emotion) => {
    const colors = {
      'Happy': 'success', 'Sad': 'info', 'Angry': 'error',
      'Fear': 'warning', 'Surprise': 'secondary', 'Neutral': 'default'
    };
    return colors[emotion] || 'default';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a2e' }}>
          {username}'s Mood History
        </Typography>
        <Button variant="outlined" size="small" onClick={() => navigate('/')} sx={{ mb: 3 }}>
          ← Back to Home
        </Button>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
        ) : history.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            No mood history yet. Go analyze your emotions!
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Input Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Emotion</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Confidence</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((entry, index) => (
                  <TableRow key={index} sx={{ '&:hover': { background: '#fafafa' } }}>
                    <TableCell>{entry.timestamp}</TableCell>
                    <TableCell>
                      <Chip label={entry.input_type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip label={entry.emotion} color={getEmotionColor(entry.emotion)} size="small" />
                    </TableCell>
                    <TableCell>{Math.round(entry.confidence * 100)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}

export default Profile;