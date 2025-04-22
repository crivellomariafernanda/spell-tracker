require('dotenv').config();
const express = require('express');
const path = require('path');
const Db = require('./db/Db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const characterRoutes = require('./routes/characters');
app.use('/api/characters', characterRoutes);

const testGeminiRoutes = require('./routes/testGemini');
app.use('/api/test-gemini', testGeminiRoutes);

const gameSessionRoutes = require('./routes/gamesessions');
app.use('/api/gamesessions', gameSessionRoutes);

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

Db.connect();

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
