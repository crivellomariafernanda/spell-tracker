const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nombre visible de la partida
  code: { type: String, required: true, unique: true }, // Código único para unirse
  characters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }], // Referencia a personajes
  createdAt: { type: Date, default: Date.now }
});

const GameSession = mongoose.model('GameSession', gameSessionSchema);

module.exports = GameSession;
