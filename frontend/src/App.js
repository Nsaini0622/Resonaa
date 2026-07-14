import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Button, Container, Box, IconButton, useTheme } from '@mui/material';
import { LightMode, DarkMode, GraphicEq } from '@mui/icons-material'; // Using GraphicEq for music vibe
import { lightTheme, darkTheme } from './theme';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EmotionCapture from './components/EmotionCapture';

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
          {/* Logo */}
          <Box 
            onClick={() => navigate('/')} 
            sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer', '&:hover svg': { transform: 'scale(1.1)' } }}
          >
            <GraphicEq sx={{ color: theme.palette.secondary.main, fontSize: 32, mr: 1, transition: '0.3s' }} />
            <Typography variant="h5" sx={{ fontWeight: 800, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Resonaa
            </Typography>
          </Box>

          {/* Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {user && navButton('/', 'Home')}
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

function Home() {
  const user = localStorage.getItem('username');
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '90vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background Glow Effects (Blue & Pink) */}
      <Box sx={{ position: 'absolute', top: '-10%', left: '-5%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${theme.palette.primary.main}20 0%, transparent 70%)`, filter: 'blur(60px)', zIndex: -1 }} />
      <Box sx={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '30vw', height: '30vw', background: `radial-gradient(circle, ${theme.palette.secondary.main}15 0%, transparent 70%)`, filter: 'blur(60px)', zIndex: -1 }} />

      <Container maxWidth="md" sx={{ textAlign: 'center', pt: { xs: 6, md: 10 }, pb: 8 }}>
        {user ? (
          <Box>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
              How are you feeling today, <span style={{ color: theme.palette.secondary.main }}>{user}</span>?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 6, fontWeight: 400 }}>
              Use your camera or type your thoughts to get personalized music recommendations.
            </Typography>
            <EmotionCapture />
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'inline-block', p: '8px 16px', background: `${theme.palette.secondary.main}15`, color: theme.palette.secondary.main, borderRadius: 999, fontWeight: 600, mb: 3 }}>
              AI-Powered Music Recommendations
            </Box>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 800, letterSpacing: '-1px' }}>
              Music that resonates with <br />
              <span style={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                your exact emotion.
              </span>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 5, maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
              Resonaa uses AI to analyze your facial expressions or text, automatically generating the perfect playlist for your current mood.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="contained" size="large" component={Link} to="/signup"
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem', background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)` }}>
                Start Listening Free
              </Button>
              <Button variant="outlined" size="large" component={Link} to="/login"
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderColor: 'rgba(128,128,128,0.3)', color: 'inherit' }}>
                Sign In
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

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
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;