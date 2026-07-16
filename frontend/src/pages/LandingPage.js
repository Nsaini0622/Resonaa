import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraphicEq, Face, Mic, Create, MusicNote, Security } from '@mui/icons-material';

const FeatureCard = ({ icon, title, description, delay }) => {
  const theme = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay }}
    >
      <Paper elevation={0} sx={{
        p: 4, height: '100%', borderRadius: 4,
        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        transition: 'all 0.3s ease',
        '&:hover': { transform: 'translateY(-10px)', boxShadow: `0 20px 40px ${theme.palette.primary.main}20` }
      }}>
        <Box sx={{ width: 60, height: 60, borderRadius: '50%', background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', mb: 3 }}>
          {icon}
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.text.primary }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Paper>
    </motion.div>
  );
};

function LandingPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      
      {/* HERO SECTION */}
      <Box sx={{ 
        minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative',
        background: theme.palette.mode === 'dark' 
          ? `radial-gradient(circle at 20% 30%, ${theme.palette.primary.main}30 0%, transparent 50%), radial-gradient(circle at 80% 70%, ${theme.palette.secondary.main}30 0%, transparent 50%)` 
          : `radial-gradient(circle at 20% 30%, ${theme.palette.primary.main}15 0%, transparent 50%), radial-gradient(circle at 80% 70%, ${theme.palette.secondary.main}15 0%, transparent 50%)`
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <Box sx={{ display: 'inline-block', px: 2, py: 1, borderRadius: 999, background: `${theme.palette.secondary.main}20`, color: theme.palette.secondary.main, fontWeight: 'bold', mb: 3 }}>
                  <GraphicEq sx={{ verticalAlign: 'middle', mr: 1, fontSize: 18 }} />
                  AI-Powered Music Engine
                </Box>
                <Typography variant="h1" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '3rem', md: '4.5rem' }, lineHeight: 1.1, color: theme.palette.text.primary }}>
                  Music that matches <br/>
                  your <span style={{ background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>exact mood.</span>
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 5, fontWeight: 400, maxWidth: '90%' }}>
                  Resonaa uses state-of-the-art AI to analyze your facial expressions, text, or voice tone, instantly curating the perfect playlist for how you're feeling right now.
                </Typography>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Button variant="contained" size="large" onClick={() => navigate('/signup')} sx={{ px: 5, py: 1.5, borderRadius: 999, fontSize: '1.1rem', background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` }}>
                    Start Listening Free
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
                <img src="https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=1000&auto=format&fit=crop" alt="Music AI" style={{ width: '100%', borderRadius: '24px', boxShadow: `0 30px 60px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(15,82,186,0.2)'}` }} />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Box sx={{ py: { xs: 10, md: 15 }, background: theme.palette.mode === 'dark' ? '#000E29' : '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, color: theme.palette.text.primary }}>How Resonaa Works</Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Three powerful AI engines working together to understand your emotional state and deliver the perfect soundscape.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FeatureCard 
                icon={<Face fontSize="large" />} 
                title="Facial Recognition" 
                description="Our OpenCV algorithms scan your facial micro-expressions to determine your mood instantly through your device camera."
                delay={0.1}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard 
                icon={<Create fontSize="large" />} 
                title="Semantic Analysis" 
                description="Type how you feel. Our HuggingFace BERT NLP model understands the context and sentiment behind your words."
                delay={0.3}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard 
                icon={<Mic fontSize="large" />} 
                title="Vocal Tone Processing" 
                description="Speak to Resonaa. We use Librosa signal processing to analyze the pitch and volume of your voice, fused with Speech-to-Text."
                delay={0.5}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* METRICS SECTION */}
      <Box sx={{ py: 10, background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} md={3}>
              <Typography variant="h3" fontWeight="bold">3+</Typography>
              <Typography variant="subtitle1">AI Models Used</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" fontWeight="bold">90M+</Typography>
              <Typography variant="subtitle1">Tracks Available</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" fontWeight="bold"><Security fontSize="large" sx={{ verticalAlign: 'bottom' }} /></Typography>
              <Typography variant="subtitle1">100% Secure JWT</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" fontWeight="bold">0</Typography>
              <Typography variant="subtitle1">Audio Stored (Privacy First)</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ py: 6, textAlign: 'center', background: theme.palette.mode === 'dark' ? '#000814' : '#F0F8FF' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Resonaa. An AI Mood-Based Music Engine.
        </Typography>
      </Box>
    </Box>
  );
}

export default LandingPage;