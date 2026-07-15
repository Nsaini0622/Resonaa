import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Box, CircularProgress, useTheme } from '@mui/material';

function Profile() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const theme = useTheme(); // Theme se dark mode check karne ke liye

  useEffect(() => {
    if (!username) { navigate('/login'); return; }

        const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/api/features/mood-history/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, background: theme.palette.mode === 'dark' ? 'rgba(0, 31, 63, 0.6)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}>
        
        {/* Username heading ko Light/Bright kiya */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? '#D6F5FF' : '#001F3F' }}>
          {username}'s Mood History
        </Typography>
        
        <Button variant="outlined" size="small" onClick={() => navigate('/')} sx={{ mb: 3, borderColor: theme.palette.secondary.main, color: theme.palette.mode === 'dark' ? '#F8C8DC' : theme.palette.secondary.main }}>
          ← Back to Home
        </Button>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress color="secondary" /></Box>
        ) : history.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            No mood history yet. Go analyze your emotions!
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                {/* Table Header ko dark/contrast banaya */}
                <TableRow sx={{ background: theme.palette.mode === 'dark' ? 'rgba(25, 25, 112, 0.8)' : '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? '#D6F5FF' : '#001F3F' }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? '#D6F5FF' : '#001F3F' }}>Input Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? '#D6F5FF' : '#001F3F' }}>Emotion</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? '#D6F5FF' : '#001F3F' }}>Confidence</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((entry, index) => (
                  <TableRow key={index} sx={{ 
                    // Hover effect: Jab hover ho to background whiteish hoga, isliye text ko dark (Navy) kar diya
                    '&:hover': { background: theme.palette.mode === 'dark' ? 'rgba(214, 245, 255, 0.9)' : '#fafafa' },
                    '&:hover td': { color: theme.palette.mode === 'dark' ? '#000080' : 'inherit' }
                  }}>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{entry.timestamp}</TableCell>
                    <TableCell>
                      <Chip label={entry.input_type} size="small" variant="outlined" sx={{ color: 'inherit', borderColor: 'inherit' }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={entry.emotion} color={getEmotionColor(entry.emotion)} size="small" />
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{Math.round(entry.confidence * 100)}%</TableCell>
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