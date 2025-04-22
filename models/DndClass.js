const mongoose = require('mongoose');

const dndClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  levels: { type: mongoose.Schema.Types.Mixed, required: true }
});

const DnDClass = mongoose.model('DnDClass', dndClassSchema);

module.exports = DnDClass;
