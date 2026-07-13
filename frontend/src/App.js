import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EmotionCapture from './components/EmotionCapture';

function Navbar() {
  const user = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.reload();
  };

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #1a1a2e, #16213e, #0f3460)' }}>
      <Toolbar>
        <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')}>
          Resonaa
        </Typography>
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>Welcome, {user}</Typography>
            <Button color="inherit" onClick={() => navigate('/profile')}>Profile</Button>
            <Button color="error" variant="contained" size="small" onClick={handleLogout}>Logout</Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate('/signup')}>Sign Up</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

function Home() {
  const user = localStorage.getItem('username');

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
      {user ? (
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a2e' }}>
            How are you feeling today?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Use your camera or type your feelings to get personalized music recommendations
          </Typography>
          <EmotionCapture />
        </Box>
      ) : (
        <Box sx={{ mt: 10 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a2e' }}>
            Resonaa
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Emotion-Based Music Recommendation System
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, margin: '0 auto' }}>
            Discover music that matches your mood. Our AI analyzes your emotions through facial expressions or text and recommends the perfect playlist.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button variant="contained" size="large" component={Link} to="/login"
              sx={{ background: '#0f3460', '&:hover': { background: '#1a1a2e' } }}>
              Login
            </Button>
            <Button variant="outlined" size="large" component={Link} to="/signup"
              sx={{ borderColor: '#0f3460', color: '#0f3460' }}>
              Sign Up
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;