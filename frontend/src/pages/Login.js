import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        setSuccess(true);
        setMessage('Login successful! Redirecting...');
        setTimeout(() => { navigate('/'); window.location.reload(); }, 1500);
      } else {
        setSuccess(false);
        setMessage(data.error || 'Invalid credentials');
      }
    } catch (error) {
      setSuccess(false);
      setMessage('Error connecting to backend');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a2e' }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Login to continue your music journey
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Username or Email" name="username" value={formData.username}
            onChange={handleChange} required margin="normal" />
          <TextField fullWidth label="Password" name="password" type="password" value={formData.password}
            onChange={handleChange} required margin="normal" />
          <Button type="submit" fullWidth variant="contained" size="large"
            sx={{ mt: 2, background: '#0f3460', '&:hover': { background: '#1a1a2e' } }}>
            Login
          </Button>
        </form>

        {message && (
          <Alert severity={success ? "success" : "error"} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Button size="small" onClick={() => navigate('/signup')}>Sign Up</Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;