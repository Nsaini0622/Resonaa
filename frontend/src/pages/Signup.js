import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';

function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setSuccess(false);
        const errors = Object.values(data).flat().join(' | ');
        setMessage(errors);
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
          Create Account
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Join Resonaa and discover music that matches your mood
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Username" name="username" value={formData.username}
            onChange={handleChange} required margin="normal" />
          <TextField fullWidth label="Email" name="email" type="email" value={formData.email}
            onChange={handleChange} required margin="normal" />
          <TextField fullWidth label="Password" name="password" type="password" value={formData.password}
            onChange={handleChange} required margin="normal"
            helperText="Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char" />
          <Button type="submit" fullWidth variant="contained" size="large"
            sx={{ mt: 2, background: '#0f3460', '&:hover': { background: '#1a1a2e' } }}>
            Sign Up
          </Button>
        </form>

        {message && (
          <Alert severity={success ? "success" : "error"} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Button size="small" onClick={() => navigate('/login')}>Login</Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Signup;