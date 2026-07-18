import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, Typography, IconButton, Box, CircularProgress, useTheme } from '@mui/material';
import { Close } from '@mui/icons-material';

function MusicPlayer({ open, onClose, track }) {
  const [youtubeId, setYoutubeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const theme = useTheme();

  const handleClose = () => {
    setYoutubeId(null);
    onClose();
  };

  const fetchYoutubeUrl = async (title, artist, albumCover, emotionName) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const encodedTitle = encodeURIComponent(title || "");
      const encodedArtist = encodeURIComponent(artist || "");
      
      const encodedCover = encodeURIComponent(albumCover || "");
      
      let pureEmotion = "Unknown";
      if (emotionName) {
        pureEmotion = emotionName.split(' ')[0]; 
      }
      const encodedEmotion = encodeURIComponent(pureEmotion);
      
      const response = await fetch(`http://127.0.0.1:8000/api/features/youtube-play/?song=${encodedTitle}&artist=${encodedArtist}&cover=${encodedCover}&emotion=${encodedEmotion}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (response.ok && data.youtube_url) {
        const url = new URL(data.youtube_url);
        const vid = url.searchParams.get("v");
        setYoutubeId(vid);
      } else {
        setErrorMsg(data.error || "Could not find full track audio.");
      }
    } catch (error) {
      console.error("Error finding track", error);
      setErrorMsg("Error connecting to search server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && track) {
      setYoutubeId(null);
      setErrorMsg("");
      fetchYoutubeUrl(track.title, track.artist, track.album_cover, track.associated_emotion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, track]);

  if (!track) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, background: theme.palette.mode === 'dark' ? '#001A4D' : '#ffffff', color: theme.palette.text.primary, p: 1 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={handleClose} color="inherit"><Close /></IconButton>
      </Box>
      <DialogContent sx={{ textAlign: 'center', p: 0, pb: 2, px: 2 }}>
        
        {!youtubeId && (
          <img src={track.album_cover || track.album_cover_medium || "https://via.placeholder.com/150"} alt="cover" style={{ width: 180, height: 180, borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', marginBottom: '20px' }} />
        )}
        
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>{track.title}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{track.artist}</Typography>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, height: 100, justifyContent: 'center' }}>
            <CircularProgress size={30} />
            <Typography variant="body2">Finding full track...</Typography>
          </Box>
        ) : errorMsg ? (
          <Typography color="error" variant="body2" sx={{ pb: 3 }}>{errorMsg}</Typography>
        ) : youtubeId ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', background: 'black', position: 'relative', paddingTop: '56.25%' }}>
            {/* Standard HTML iframe jo YouTube hamesha allow karta hai */}
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default MusicPlayer;