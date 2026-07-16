import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Button, Container, Box, IconButton, useTheme, Grid, Paper } from '@mui/material';
import { LightMode, DarkMode, GraphicEq, PlayArrow, Timeline, Mic } from '@mui/icons-material';
import { lightTheme, darkTheme } from './theme';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import EmotionCapture from './components/EmotionCapture';
import { motion } from 'framer-motion';

function Navbar({ darkMode, setDarkMode }) {
  const user = localStorage.getItem('username');
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.reload();
  };

  const navButton = (path, text) => (
    <Button 
      color="inherit" 
      onClick={() => navigate(path)}
      sx={{ 
        mx: 0.5,
        background: location.pathname === path ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` : 'transparent',
        color: location.pathname === path ? '#fff' : 'inherit',
        boxShadow: location.pathname === path ? `0 8px 18px ${theme.palette.primary.main}50` : 'none',
        '&:hover': { background: location.pathname === path ? '' : 'rgba(128,128,128,0.1)' }
      }}
    >
      {text}
    </Button>
  );

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 70 }}>
          <Box 
            onClick={() => navigate('/')} 
            sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer', '&:hover svg': { transform: 'scale(1.1)' } }}
          >
            <GraphicEq sx={{ color: theme.palette.secondary.main, fontSize: 32, mr: 1, transition: '0.3s' }} />
            <Typography variant="h5" sx={{ fontWeight: 800, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Resonaa
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {user && navButton('/', 'Home')}
            {user && navButton('/detect', 'Detect Mood')}
            {user && navButton('/profile', 'History')}
            
            <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ ml: 2, mr: 2, color: 'inherit' }}>
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>

            {user ? (
              <Button variant="outlined" color="inherit" onClick={handleLogout} sx={{ borderColor: 'rgba(128,128,128,0.3)', ml: 1 }}>
                Log out
              </Button>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')} sx={{ mr: 1 }}>Sign In</Button>
                <Button variant="contained" onClick={() => navigate('/signup')} 
                  sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)` }}>
                  Get Started
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

// Ye User ka Dashboard hai (Login karne ke baad dikhega)
function UserDashboard() {
  const user = localStorage.getItem('username');
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '90vh', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: '-10%', left: '-5%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`, filter: 'blur(60px)', zIndex: -1 }} />
      <Box sx={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '30vw', height: '30vw', background: `radial-gradient(circle, ${theme.palette.secondary.main}15 0%, transparent 70%)`, filter: 'blur(60px)', zIndex: -1 }} />

      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: 8 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
            Welcome back, <span style={{ color: theme.palette.secondary.main }}>{user}</span>! 👋
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 6, fontWeight: 400, maxWidth: 800 }}>
            Ready to discover some new music? Resonaa uses your current emotional state to find the perfect tracks for you.
          </Typography>

          <Paper elevation={0} sx={{ 
            p: { xs: 4, md: 6 }, 
            borderRadius: 4, 
            background: theme.palette.mode === 'dark' ? 'rgba(0, 31, 63, 0.4)' : 'rgba(255,255,255,0.6)', 
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
            textAlign: 'center',
            mb: 8
          }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Let AI understand your mood</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              Choose your preferred method. We can analyze your facial expressions through the camera, read your text, or listen to the tone of your voice.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/detect')}
              sx={{ px: 6, py: 2, borderRadius: 999, fontSize: '1.2rem', fontWeight: 'bold', background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, boxShadow: `0 10px 30px ${theme.palette.primary.main}40`, '&:hover': { transform: 'translateY(-3px)' }, transition: 'all 0.3s ease' }}
            >
              Start Detection <PlayArrow sx={{ ml: 1 }} />
            </Button>
          </Paper>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <GraphicEq sx={{ fontSize: 50, color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Deep Music Engine</Typography>
                <Typography variant="body2" color="text.secondary">We search through Apple Music's massive database to find tracks that perfectly match your exact psychological state.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Timeline sx={{ fontSize: 50, color: theme.palette.secondary.main, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Mood Tracking</Typography>
                <Typography variant="body2" color="text.secondary">Keep a diary of your emotions. We save your history securely so you can look back and understand your emotional trends.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Mic sx={{ fontSize: 50, color: theme.palette.primary.light, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Complete Privacy</Typography>
                <Typography variant="body2" color="text.secondary">Your photos and voice recordings are processed instantly in memory. We never save or store your personal media.</Typography>
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const user = localStorage.getItem('username');

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.style.backgroundColor = darkMode ? '#000E29' : '#F0F8FF';
  }, [darkMode]);

  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          {/* Agar user logged in hai to Naya Dashboard dikhao, warna Landing Page */}
          <Route path="/" element={user ? <UserDashboard /> : <LandingPage />} />
          
          {/* EmotionCapture ab ek alag page ban gaya hai */}
          <Route path="/detect" element={<Container sx={{mt: 8}}><EmotionCapture /></Container>} />
          
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;