
const express = require('express');
const cors = require('cors');
// 使用動態 import 來載入 node-fetch
let fetch;
const app = express();
app.use(express.json());
app.use(cors());

const GEMINI_API_KEY = 'AIzaSyB63rN8GW6xOTNTa713Wtaengy6wHcP4g0';

// GET 路由測試 server 狀態
app.get('/gemini', (req, res) => {
  res.send('Gemini server is running!');
});

app.post('/gemini', async (req, res) => {
  const prompt = req.body.prompt;
  console.log('Received prompt:', prompt);
  
  // 動態載入 node-fetch
  if (!fetch) {
    const { default: nodeFetch } = await import('node-fetch');
    fetch = nodeFetch;
  }
  
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const geminiBody = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  console.log('Gemini URL:', geminiUrl);
  console.log('Gemini Body:', JSON.stringify(geminiBody));
  try {
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody)
    });
    console.log('Gemini response status:', response.status);
    const data = await response.json();
    console.log('Gemini response data:', data);
    res.json(data);
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));