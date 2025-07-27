// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // or change to '.env' if you keep it inside murf-backend

// If you're on Node < 18, install and uncomment:
// const fetch = require('node-fetch');

// Initialize database
require('./database');

// Import routes
const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicines');
const moodRoutes = require('./routes/mood');
const memoryRoutes = require('./routes/memory');
const emergencyRoutes = require('./routes/emergency');

const app = express();
const PORT = process.env.PORT || 5000;

const MURF_API_KEY = process.env.MURF_API_KEY;
const DEFAULT_VOICE_ID = process.env.MURF_VOICE_ID || 'en-IN-arohi';

if (!MURF_API_KEY) {
  console.warn('[WARN] MURF_API_KEY is not set. /speak will return 500.');
}

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/emergency', emergencyRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/speak', async (req, res) => {
  const { text, voiceId } = req.body || {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required' });
  }
  if (!MURF_API_KEY) {
    return res.status(500).json({ error: 'MURF_API_KEY missing on server' });
  }

  // If the frontend ever sends something like "en", fall back to a valid voiceId.
  const selectedVoiceId =
    (typeof voiceId === 'string' && voiceId.includes('-')) ? voiceId : DEFAULT_VOICE_ID;

  const payload = {
    text,
    voiceId: selectedVoiceId,
    format: 'mp3',
    modelVersion: 'GEN2',
    sampleRate: 44100,
    encodeAsBase64: false
  };

  try {
    console.log('[Murf] -> payload:', payload);

    const response = await fetch('https://api.murf.ai/v1/speech/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': MURF_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const raw = await response.text();
    let data;
    try { data = JSON.parse(raw); } catch { data = raw; }

    console.log('[Murf] <- status:', response.status);
    console.log('[Murf] <- body:', data);

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.errorMessage || data?.message || 'Murf API error',
        details: data
      });
    }

    const audioUrl =
      data?.audioFile ||
      (data?.encodedAudio ? `data:audio/mpeg;base64,${data.encodedAudio}` : null);

    if (!audioUrl) {
      return res.status(500).json({
        error: 'audioUrl not found in Murf response',
        details: data
      });
    }

    return res.json({ audioUrl });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
