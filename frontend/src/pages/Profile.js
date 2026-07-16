import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Box, CircularProgress, useTheme, Grid } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function Profile() {
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (!username) { navigate('/login'); return; }

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/api/features/mood-history/?username=${username}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
          setHistory(data.history);
          
          const counts = {};
          let totalMoods = 0;
          
          data.history.forEach(entry => {
            counts[entry.emotion] = (counts[entry.emotion] || 0) + 1;
            totalMoods++;
          });
          
          const formattedChartData = Object.keys(counts).map(key => {
            const rawPercentage = (counts[key] / totalMoods) * 100;
            return {
              name: key,
              value: counts[key],
              percentage: Math.round(rawPercentage)
            };
          });
          
          setChartData(formattedChartData);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [username, navigate]);

  // Enhanced Gradients ensuring visibility in Dark Mode
  const getGradients = () => {
    if (theme.palette.mode === 'dark') {
      return {
        'Happy': { start: '#FF1493', end: '#C71585' },    // Bright Neon Pink
        'Sad': { start: '#00BFFF', end: '#4682B4' },      // Bright Sky Blue
        'Angry': { start: '#FF4500', end: '#DC143C' },    // Neon Red/Orange
        'Fear': { start: '#00FA9A', end: '#2E8B57' },     // Neon Teal/Green
        'Surprise': { start: '#DDA0DD', end: '#8A2BE2' }, // Bright Plum
        'Neutral': { start: '#1E90FF', end: '#0000CD' }   // Bright Royal Blue
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
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, background: theme.palette.mode === 'dark' ? 'rgba(0, 31, 63, 0.6)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? '#D6F5FF' : '#001F3F' }}>
            {username}'s Dashboard
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/')} sx={{ borderColor: theme.palette.secondary.main, color: theme.palette.mode === 'dark' ? '#F8C8DC' : theme.palette.secondary.main }}>
            ← Back to Home
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress color="secondary" /></Box>
        ) : history.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            No mood history yet. Go analyze your emotions!
          </Typography>
        ) : (
          <Grid container spacing={4}>
            
            {/* LEFT SIDE: ANALYTICS CHART */}
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 2, borderRadius: 2, background: theme.palette.mode === 'dark' ? 'rgba(25, 25, 112, 0.5)' : '#f9f9f9', textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 2, fontWeight: 'bold' }}>
                  Mood Breakdown
                </Typography>
                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <defs>
                        {/* Always recreate defs uniquely based on mode to prevent browser caching old colors */}
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
                        data={chartData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={50} 
                        outerRadius={90} 
                        paddingAngle={3}
                        labelLine={false}
                        label={renderCustomizedLabel}
                        stroke={theme.palette.mode === 'dark' ? 'rgba(25,25,112,0.8)' : '#fff'} // Adds subtle matching border to slices
                        strokeWidth={2}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#colorUv-${gradients[entry.name] ? entry.name : 'Default'})`} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: theme.palette.mode === 'dark' ? '#001F3F' : '#fff', borderRadius: '8px', color: theme.palette.text.primary, border: `1px solid ${theme.palette.secondary.main}` }}
                        itemStyle={{ color: theme.palette.text.primary }}
                        formatter={(value, name, props) => [`${value} times (${props.payload.percentage}%)`, name]}
                      />
                      <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Paper>
            </Grid>

            {/* RIGHT SIDE: HISTORY TABLE */}
            <Grid item xs={12} md={8}>
              <TableContainer component={Paper} elevation={1} sx={{ maxHeight: 400, borderRadius: 2, background: 'transparent' }}>
                <Table stickyHeader>
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
                      <TableRow key={index} sx={{ 
                        '&:hover': { background: theme.palette.mode === 'dark' ? 'rgba(214, 245, 255, 0.9)' : '#e9ecef' },
                        '&:hover td': { color: theme.palette.mode === 'dark' ? '#000080' : 'inherit' }
                      }}>
                        <TableCell sx={{ color: theme.palette.text.primary, transition: 'color 0.2s' }}>{entry.timestamp}</TableCell>
                        <TableCell>
                          <Chip label={entry.input_type} size="small" variant="outlined" sx={{ color: 'inherit', borderColor: 'inherit' }} />
                        </TableCell>
                        <TableCell>
                          <Chip label={entry.emotion} color={getEmotionColor(entry.emotion)} size="small" />
                        </TableCell>
                        <TableCell sx={{ color: theme.palette.text.primary, transition: 'color 0.2s' }}>{Math.round(entry.confidence * 100)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
}

export default Profile;