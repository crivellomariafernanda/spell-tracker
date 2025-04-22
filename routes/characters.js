const express = require("express");
const router = express.Router();
const Character = require("../models/Character");
const { findOrCreateDnDClass } = require("../services/dndClassService");
const { DND_CLASSES } = require('../constants/dndClasses'); 

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const character = await Character.findById(id);

    if (!character) {
      return res.status(404).json({ error: "Personaje no encontrado" });
    }

    res.json(character);
  } catch (error) {
    console.error("Error obteniendo personaje:", error.message);
    res.status(500).json({ error: "Error obteniendo personaje" });
  }
});
router.post("/:id/cast", async (req, res) => {
  const { id } = req.params;
  const { spellLevel } = req.body;

  try {
    const character = await Character.findById(id);

    if (!character) {
      return res.status(404).json({ error: "Personaje no encontrado" });
    }

    const slot = character.spellSlots[spellLevel];

    if (!slot) {
      return res
        .status(400)
        .json({
          error: `El personaje no tiene spell slots de nivel ${spellLevel}`,
        });
    }

    if (slot.used >= slot.max) {
      return res
        .status(400)
        .json({ error: `No quedan slots disponibles de nivel ${spellLevel}` });
    }

    // Gastar un slot
    slot.used += 1;

    character.markModified("spellSlots");

    await character.save();

    res.json({
      message: `Se gastó un slot de hechizo de nivel ${spellLevel}.`,
      spellSlots: character.spellSlots,
    });
  } catch (error) {
    console.error("Error casteando hechizo:", error.message);
    res.status(500).json({ error: "Error casteando hechizo" });
  }
});

router.post("/:id/longrest", async (req, res) => {
  const { id } = req.params;

  try {
    const character = await Character.findById(id);

    if (!character) {
      return res.status(404).json({ error: "Personaje no encontrado" });
    }

    // Restaurar vida
    character.hpCurrent = character.hpMax;

    // Restaurar todos los spell slots
    if (character.spellSlots) {
      Object.keys(character.spellSlots).forEach((level) => {
        character.spellSlots[level].used = 0;
      });
    }

    await character.save();

    res.json({
      message: "Descanso largo completado. Vida y spell slots restaurados.",
      character,
    });
  } catch (error) {
    console.error("Error aplicando descanso largo:", error.message);
    res.status(500).json({ error: "Error aplicando descanso largo" });
  }
});

router.get("/", async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (error) {
    console.error("Error obteniendo personajes:", error.message);
    res.status(500).json({ error: "Error obteniendo personajes" });
  }
});

router.post("/", async (req, res) => {
  const { playerName, characterName, class: clase, level } = req.body;

  try {
    // Validamos que la clase sea válida
    if (!Object.values(DND_CLASSES).includes(clase.toLowerCase())) {
      return res.status(400).json({ error: `Clase ${clase} no es válida.` });
    }

    const dndClass = await findOrCreateDnDClass(clase.toLowerCase());

    // Obtenemos los slots correspondientes al nivel del personaje
    const slotsThisLevel = dndClass.levels[level];

    if (!slotsThisLevel) {
      return res
        .status(400)
        .json({
          error: `No hay datos de spell slots para nivel ${level} de la clase ${clase}`,
        });
    }

    // Armamos el objeto de spellSlots
    const spellSlots = {};
    Object.keys(slotsThisLevel).forEach((spellLevel) => {
      spellSlots[spellLevel] = {
        max: slotsThisLevel[spellLevel],
        used: 0,
      };
    });

    const newCharacter = await Character.create({
      playerName,
      characterName,
      class: dndClass.name,
      level,
      hpMax: null,
      hpCurrent: null,
      spellSlots,
    });

    res.json({
      message: "Personaje creado exitosamente",
      character: newCharacter,
    });
  } catch (error) {
    console.error("Error creando personaje:", error.message);
    res.status(500).json({ error: "Error creando personaje" });
  }
});

module.exports = router;
