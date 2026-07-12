import React, { useState } from 'react';

function Signup() {
  //  state variables to store data
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // when Form Submit (API Call)
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // convert js object to JSON 
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Success: ' + data.message);
      } else {
        // if email already exists types error occurs
        setMessage('Error: ' + JSON.stringify(data)); 
      }
    } catch (error) {
      setMessage('Error connecting to backend');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Sign Up for Resonaa</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto', gap: '15px' }}>
        <input 
          type="text" name="username" placeholder="Username" 
          value={formData.username} onChange={handleChange} required 
        />
        <input 
          type="email" name="email" placeholder="Email" 
          value={formData.email} onChange={handleChange} required 
        />
        <input 
          type="password" name="password" placeholder="Password" 
          value={formData.password} onChange={handleChange} required 
        />
        <button type="submit">Sign Up</button>
      </form>

      <p style={{ color: 'red' }}>{message}</p>
    </div>
  );
}

export default Signup;