import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './pages/Signup';

// homepage
function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Resonaa</h1>
      <p>Emotion-Based Music Recommendation</p>
      <Link to="/signup">
        <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Go to Sign Up</button>
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;