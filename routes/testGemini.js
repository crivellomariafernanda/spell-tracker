const express = require('express');
const router = express.Router();
const { testGemini } = require('../services/geminiService');

// Ruta para probar Gemini
router.get('/', async (req, res) => {
  try {
    const response = await testGemini();
    res.json({ message: 'Gemini respondió OK', response });
  } catch (error) {
    console.error('Error en test de Gemini:', error.message);
    res.status(500).json({ message: 'Error al conectar con Gemini', error: error.message });
  }
});

module.exports = router;
