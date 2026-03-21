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
  const { XAI_API_KEY, JINA_API_KEY } = process.env;

  try {
    const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';
    let hechos = "";
    let visualsData = {};

    // Lógica para VISIBILIDAD: Búsqueda externa en Google/Redes
    if (idFinal === 'VISIBILIDAD' && dna.startsWith('http')) {
      const searchUrl = `https://s.jina.ai/${dna} instagram followers tiktok comments`;
      const searchRes = await fetch(searchUrl, { 
        headers: { "Authorization": `Bearer ${JINA_API_KEY}` } 
      });
      hechos = await searchRes.text();
    } else if (dna.startsWith('http')) {
      // Barrido normal del sitio
      const deepData = await scrapeDeep(dna);
      hechos = deepData.text;
      visualsData = deepData.visuals;
    } else {
      hechos = dna;
    }

    // CORRECCIÓN CRÍTICA: Ahora enviamos 'hechos' (el contenido) y no solo la URL
    const promptFinal = PROMPTS[idFinal](hechos);

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
            content: `DATOS REALES DEL ACTIVO:\n${hechos}\n\nVISUALES DETECTADOS:\n${JSON.stringify(visualsData)}` 
          },
          { role: "user", content: promptFinal }
        ],
        temperature: 0.2
      })
    });

    const xData = await xRes.json();
    res.json({ content: xData.choices[0].message.content });

  } catch (error) {
    console.error(`[FALLA]: ${error.message}`);
    res.status(500).json({ content: `### FALLA DE INFRAESTRUCTURA\nDetalle: ${error.message}` });
  }
});

app.listen(port, () => console.log(`PREDICTACORE TITÁN v32.0 - ONLINE`));
