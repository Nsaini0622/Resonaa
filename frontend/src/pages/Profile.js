import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Box, CircularProgress, useTheme, Grid, IconButton } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PlayArrow, Headset } from '@mui/icons-material';
import MusicPlayer from '../components/MusicPlayer';

function Profile() {
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [listeningHistory, setListeningHistory] = useState([]); // New state for songs
  const [loading, setLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (!username) { navigate('/login'); return; }

    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // 1. Fetch Mood History
        const moodRes = await fetch(`http://127.0.0.1:8000/api/features/mood-history/?username=${username}`, { headers });
        const moodData = await moodRes.json();
        
        if (moodRes.ok) {
          setHistory(moodData.history);
          
          // Calculate Chart Percentages
          const counts = {};
          let totalMoods = 0;
          moodData.history.forEach(entry => {
            counts[entry.emotion] = (counts[entry.emotion] || 0) + 1;
            totalMoods++;
          });
          
          const formattedChartData = Object.keys(counts).map(key => ({
            name: key,
            value: counts[key],
            percentage: Math.round((counts[key] / totalMoods) * 100)
          }));
          setChartData(formattedChartData);
        }

        // 2. Fetch Listening History (Newly added API)
        const musicRes = await fetch(`http://127.0.0.1:8000/api/features/listening-history/?username=${username}`, { headers });
        const musicData = await musicRes.json();
        
        if (musicRes.ok) {
          setListeningHistory(musicData.tracks);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, [username, navigate]);

  const getGradients = () => {
    if (theme.palette.mode === 'dark') {
      return {
        'Happy': { start: '#FF1493', end: '#C71585' },
        'Sad': { start: '#00BFFF', end: '#4682B4' },
        'Angry': { start: '#FF4500', end: '#DC143C' },
        'Fear': { start: '#00FA9A', end: '#2E8B57' },
        'Surprise': { start: '#DDA0DD', end: '#8A2BE2' },
        'Neutral': { start: '#1E90FF', end: '#0000CD' }
      };
    } else {
      return {
        'Happy': { start: '#4169E1', end: '#000080' },
        'Sad': { start: '#87CEEB', end: '#0F52BA' },
        'Angry': { start: '#FF66B2', end: '#FF007F' },
        'Fear': { start: '#9FE2BF', end: '#008080' },
        'Surprise': { start: '#FFE4E1', end: '#F8C8DC' },
        'Neutral': { start: '#B0E0E6', end: '#87CEEB' }
      };
    }
  };

  const gradients = getGradients();

  const getEmotionColor = (emotion) => {
    const colors = { 'Happy': 'success', 'Sad': 'info', 'Angry': 'error', 'Fear': 'warning', 'Surprise': 'secondary', 'Neutral': 'default' };
    return colors[emotion] || 'default';
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    if (percentage < 5) return null;

    return (
      <text x={x} y={y} fill="#ffffff" fontSize="13px" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, background: theme.palette.mode === 'dark' ? 'rgba(0, 31, 63, 0.6)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? '#D6F5FF' : '#001F3F' }}>
            {username}'s Dashboard
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/')} sx={{ borderColor: theme.palette.secondary.main, color: theme.palette.mode === 'dark' ? '#F8C8DC' : theme.palette.secondary.main }}>
            ← Home
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress color="secondary" /></Box>
        ) : history.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            No history found. Head to the home page to capture your mood!
          </Typography>
        ) : (
          <Grid container spacing={4}>
            
            {/* ROW 1: ANALYTICS CHART & LISTENING HISTORY */}
            <Grid item xs={12} md={5}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 3, background: theme.palette.mode === 'dark' ? 'rgba(25, 25, 112, 0.5)' : '#f9f9f9', textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 2, fontWeight: 'bold' }}>
                  Mood Breakdown
                </Typography>
                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <defs>
                        {Object.keys(gradients).map((emotion) => (
                          <linearGradient key={`grad-${theme.palette.mode}-${emotion}`} id={`colorUv-${emotion}`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={gradients[emotion].start} stopOpacity={1} />
                            <stop offset="100%" stopColor={gradients[emotion].end} stopOpacity={1} />
                          </linearGradient>
                        ))}
                        <linearGradient id="colorUv-Default" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#bdc3c7" stopOpacity={1} />
                          <stop offset="100%" stopColor="#2c3e50" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                      <Pie 
                        data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} labelLine={false} label={renderCustomizedLabel}
                        stroke={theme.palette.mode === 'dark' ? 'rgba(25,25,112,0.8)' : '#fff'} strokeWidth={2}
                      >
                        {chartData.map((entry, index) => (<Cell key={index} fill={`url(#colorUv-${gradients[entry.name] ? entry.name : 'Default'})`} />))}
                      </Pie>
                      <Tooltip contentStyle={{ background: theme.palette.mode === 'dark' ? '#001F3F' : '#fff', borderRadius: '8px', color: theme.palette.text.primary }} />
                      <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Paper>
            </Grid>

            {/* LISTENING HISTORY WIDGET */}
            <Grid item xs={12} md={7}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 3, background: theme.palette.mode === 'dark' ? 'rgba(25, 25, 112, 0.5)' : '#f9f9f9', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: theme.palette.text.primary }}>
                  <Headset sx={{ mr: 1, color: theme.palette.secondary.main }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Listening History</Typography>
                </Box>
                
                {listeningHistory.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No tracks discovered yet.</Typography>
                ) : (
                  <Box sx={{ maxHeight: 300, overflowY: 'auto', pr: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {listeningHistory.map((track, idx) => (
                      <Box key={idx} sx={{ 
                        display: 'flex', alignItems: 'center', p: 1.5, borderRadius: 2, 
                        background: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : '#fff',
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                        transition: 'all 0.2s', '&:hover': { background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#f0f0f0' }
                      }}>
                        <img src={track.album_cover} alt="album" style={{ width: 45, height: 45, borderRadius: 8, marginRight: 15 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? '#D6F5FF' : '#001F3F' }}>
                            {track.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? '#B0E0E6' : 'gray', display: 'flex', alignItems: 'center', gap: 1 }}>
                            {track.artist} • <Chip label={track.associated_emotion} size="small" sx={{ height: 16, fontSize: '0.65rem' }} />
                          </Typography>
                        </Box>
                        <IconButton 
                          onClick={() => { setSelectedTrack(track); setPlayerOpen(true); }} 
                          size="small" 
                          sx={{ background: theme.palette.secondary.main, color: '#fff', '&:hover': { background: theme.palette.secondary.dark } }}
                        >
                          <PlayArrow fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* ROW 2: MOOD HISTORY TABLE */}
            <Grid item xs={12}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 3, background: theme.palette.mode === 'dark' ? 'rgba(25, 25, 112, 0.5)' : '#f9f9f9' }}>
                <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 2, fontWeight: 'bold' }}>
                  Detailed Mood Logs
                </Typography>
                <TableContainer sx={{ maxHeight: 300 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', background: theme.palette.mode === 'dark' ? 'rgba(0, 31, 63, 0.9)' : '#f5f5f5', color: theme.palette.text.primary }}>Date & Time</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', background: theme.palette.mode === 'dark' ? 'rgba(0, 31, 63, 0.9)' : '#f5f5f5', color: theme.palette.text.primary }}>Input</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', background: theme.palette.mode === 'dark' ? 'rgba(0, 31, 63, 0.9)' : '#f5f5f5', color: theme.palette.text.primary }}>Emotion</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', background: theme.palette.mode === 'dark' ? 'rgba(0, 31, 63, 0.9)' : '#f5f5f5', color: theme.palette.text.primary }}>Confidence</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {history.map((entry, index) => (
                        <TableRow key={index} sx={{ '&:hover': { background: theme.palette.mode === 'dark' ? 'rgba(214, 245, 255, 0.1)' : '#e9ecef' } }}>
                          <TableCell sx={{ color: theme.palette.text.primary }}>{entry.timestamp}</TableCell>
                          <TableCell><Chip label={entry.input_type} size="small" variant="outlined" sx={{ color: 'inherit', borderColor: 'inherit' }} /></TableCell>
                          <TableCell><Chip label={entry.emotion} color={getEmotionColor(entry.emotion)} size="small" /></TableCell>
                          <TableCell sx={{ color: theme.palette.text.primary }}>{Math.round(entry.confidence * 100)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

          </Grid>
        )}
      </Paper>
      {/* MUSIC PLAYER MODAL */}
      <MusicPlayer open={playerOpen} onClose={() => { setPlayerOpen(false); setSelectedTrack(null); }} track={selectedTrack} />
    </Container>
  );
}

export default Profile;