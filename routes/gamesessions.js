const express = require("express");
const router = express.Router();
const GameSession = require("../models/gameSession");
const Character = require("../models/Character");

// Unirse a una partida con un personaje
router.post("/:code/join", async (req, res) => {
  const { code } = req.params;
  const { characterId } = req.body;

  if (!characterId) {
    return res
      .status(400)
      .json({ error: "El ID del personaje es obligatorio." });
  }

  try {
    const gameSession = await GameSession.findOne({ code: code.toUpperCase() });

    if (!gameSession) {
      return res
        .status(404)
        .json({ error: "Partida no encontrada con ese código." });
    }

    const character = await Character.findById(characterId);

    if (!character) {
      return res.status(404).json({ error: "Personaje no encontrado." });
    }

    // Verificar que el personaje no esté ya en la partida
    if (gameSession.characters.includes(characterId)) {
      return res
        .status(400)
        .json({ error: "Este personaje ya está unido a esta partida." });
    }

    // Agregamos el personaje
    gameSession.characters.push(characterId);
    await gameSession.save();

    res.json({
      message: `Personaje ${character.characterName} unido a la partida ${gameSession.name}`,
      gameSession,
    });
  } catch (error) {
    console.error("Error uniendo personaje a partida:", error.message);
    res.status(500).json({ error: "Error uniendo personaje a partida" });
  }
});

// Función para generar un código aleatorio
function generateSessionCode(name) {
  const cleanName = name.replace(/\s+/g, "").toUpperCase(); // Sacamos espacios
  const randomNumber = Math.floor(100 + Math.random() * 900); // Número de 3 dígitos
  return `${cleanName.substring(0, 5)}${randomNumber}`; // Ej: DRAGO123
}

router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ error: "El nombre de la partida es obligatorio." });
  }

  try {
    const code = generateSessionCode(name);

    const newGameSession = await GameSession.create({
      name,
      code,
      characters: [],
    });

    res.json({
      message: "Partida creada exitosamente.",
      gameSession: newGameSession,
    });
  } catch (error) {
    console.error("Error creando partida:", error.message);
    res.status(500).json({ error: "Error creando partida" });
  }
});

module.exports = router;
