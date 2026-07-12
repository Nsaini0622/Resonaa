import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  
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
        // save token to browser (local storage)
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        
        setMessage('Login Successful! Redirecting...');
        
        // after 1.5 sec automatically send to home page
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setMessage('Error: ' + data.error);
      }
    } catch (error) {
      setMessage('Error connecting to backend');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Login to Resonaa</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto', gap: '15px' }}>
        <input 
          type="text" name="username" placeholder="Username or Email" 
          value={formData.username} onChange={handleChange} required 
        />
        <input 
          type="password" name="password" placeholder="Password" 
          value={formData.password} onChange={handleChange} required 
        />
        <button type="submit">Login</button>
      </form>

      <p style={{ color: message.includes('Success') ? 'green' : 'red' }}>{message}</p>
    </div>
  );
}

export default Login;