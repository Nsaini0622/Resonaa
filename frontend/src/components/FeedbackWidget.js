import React, { useState } from 'react';
import { Box, Typography, IconButton, Snackbar, Alert, useTheme } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';

function FeedbackWidget({ detectedMood, trackId }) {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const theme = useTheme();

  const handleFeedback = async (isAccurate) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://127.0.0.1:8000/api/features/feedback/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          mood: detectedMood,
          track_id: trackId || "general",
          is_accurate: isAccurate 
        }),
      });
      
      setFeedbackSent(true);
      setToastOpen(true);
    } catch (error) {
      console.error("Feedback failed", error);
    }
  };

  if (feedbackSent) {
    return (
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: theme.palette.success.main, fontWeight: 'bold' }}>
          ✓ Thanks for your feedback! Resonaa is learning your taste.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
      <Typography variant="body2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
        Was this emotion & music recommendation accurate?
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <IconButton 
          onClick={() => handleFeedback(true)}
          sx={{ border: `1px solid ${theme.palette.success.main}`, color: theme.palette.success.main, '&:hover': { background: `${theme.palette.success.main}20` } }}
        >
          <ThumbUp fontSize="small" />
        </IconButton>
        <IconButton 
          onClick={() => handleFeedback(false)}
          sx={{ border: `1px solid ${theme.palette.error.main}`, color: theme.palette.error.main, '&:hover': { background: `${theme.palette.error.main}20` } }}
        >
          <ThumbDown fontSize="small" />
        </IconButton>
      </Box>
      
      <Snackbar open={toastOpen} autoHideDuration={3000} onClose={() => setToastOpen(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>Feedback saved to ML Engine!</Alert>
      </Snackbar>
    </Box>
  );
}

export default FeedbackWidget;