const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { scrapeDeep } = require('./motor');
const { SYSTEM_INSTRUCTIONS } = require('./instrucciones');
const { PROTOCOLOS_IA } = require('./protocolos');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

app.get('/', (req, res) => res.send(getHTML()));

app.post('/diseccion', async (req, res) => {
  const { dna, etapaId } = req.body;
  const { XAI_API_KEY } = process.env;

  if (!XAI_API_KEY) {
    return res.status(500).json({ content: '[ERROR]: XAI_API_KEY no detectada en el entorno.' });
  }

  try {
    const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';
    let hechos = dna;
    let visualsData = {};

    // Si es una URL, activamos el Motor Playwright
    if (dna.startsWith('http')) {
      const deepData = await scrapeDeep(dna);
      hechos = deepData.text;
      visualsData = deepData.visuals;
    }

    const promptFinal = PROMPTS[idFinal](hechos);

    // Conexión con Grok-4-1 inyectando la Autoridad de PredictaCore
    const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-4-1-fast-reasoning",
        messages: [
          { 
            role: "system", 
            content: `${SYSTEM_INSTRUCTIONS}\n\n${PERSONA}\n\n${PROTOCOLOS_IA}` 
          },
          { 
            role: "system", 
            content: `DATOS LITERALES DEL ACTIVO:\n${hechos}\n\nDATOS VISUALES DETECTADOS:\n${JSON.stringify(visualsData)}` 
          },
          { 
            role: "user", 
            content: promptFinal 
          }
        ],
        temperature: 0.2
      })
    });

    if (!xRes.ok) {
      const errorData = await xRes.json();
      throw new Error(`xAI Error: ${errorData.error?.message || xRes.statusText}`);
    }

    const xData = await xRes.json();
    if (xData.choices && xData.choices[0].message) {
      return res.json({ content: xData.choices[0].message.content });
    }
    
    throw new Error("Respuesta de IA vacía o malformada.");

  } catch (error) {
    console.error(`[FALLA CRÍTICA]: ${error.message}`);
    res.status(500).json({ 
      content: `### FALLA DE INFRAESTRUCTURA\nEl Nodo de Cierre ha colapsado.\nDetalle: ${error.message}` 
    });
  }
});

app.listen(port, () => {
  console.log(`PREDICTACORE TITÁN v32.0 - ESTATUS: ONLINE (Leyes Inyectadas)`);
});
