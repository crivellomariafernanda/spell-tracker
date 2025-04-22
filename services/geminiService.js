const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

  async function getSpellSlotsFullProgression(className) {
    const prompt = `"En Dungeons and Dragons 5e, para la clase ${className}, ¿podrías listar los spell slots disponibles para cada nivel del 1 al 20? Respondeme en JSON estructurado así:

{
  '1': { '1': cantidad },
  '2': { '1': cantidad },
  '3': { '1': cantidad, '2': cantidad },
  ...
  '20': { '1': cantidad, '2': cantidad, ..., '9': cantidad }
}
"
`;
  
    const response = await axios.post(
      `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  
    const text = response.data.candidates[0].content.parts[0].text;
  
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}') + 1;
    const jsonString = text.substring(start, end);
  
    const parsedJson = JSON.parse(jsonString);
    return parsedJson;
  }

async function testGemini() {
  const prompt = "Decime simplemente: Hola desde Gemini";

  const response = await axios.post(
    `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
    {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("RESPUESTA COMPLETA DE GEMINI ->");
  console.log(JSON.stringify(response.data, null, 2));

  const text = response.data.candidates[0].content.parts[0].text;
  return { text };
}

module.exports = {
  getSpellSlotsFullProgression, 
  testGemini,
};
