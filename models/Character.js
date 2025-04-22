const mongoose = require('mongoose');
const { DND_CLASSES } = require('../constants/dndClasses');

const characterSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  characterName: { type: String, required: true },
  class: { type: String, required: true },
  level: { type: Number, required: true },
  hpMax: { type: Number, default: null },
  hpCurrent: { type: Number, default: null },
  spellSlots: { type: mongoose.Schema.Types.Mixed, default: {} },
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
