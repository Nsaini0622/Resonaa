import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import EmotionCapture from './components/EmotionCapture';
import Profile from './pages/Profile';

function Home() {
  // Check 'username' is saved in browser memory or not
  const user = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    // remove token and username from memory
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // reload page to remove "welcome user"
    window.location.reload();
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Resonaa</h1>
      <p>Emotion-Based Music Recommendation</p>
      
      {/* if user is logged in show this else show (login/signup page) */}
      {user ? (
        <div style={{ marginTop: '20px' }}>
          <h3>Welcome, {user}! 👋</h3>

          <Link to="/profile">
            <button style={{ marginBottom: '20px', padding: '8px 15px', background: '#008CBA', color: 'white', border: 'none' }}>
              View My Profile & History
            </button>
          </Link>

        <EmotionCapture />
          
          
          <button onClick={handleLogout} style={{ padding: '10px 20px', cursor: 'pointer', background: '#ff4d4d', color: 'white', border: 'none' }}>
            Logout
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <Link to="/login">
            <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Login</button>
          </Link>
          <Link to="/signup">
            <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Sign Up</button>
          </Link>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
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