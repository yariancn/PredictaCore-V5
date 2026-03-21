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

  try {
    const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';
    let hechos = "";
    let visualsData = {};

    if (dna.startsWith('http')) {
      const deepData = await scrapeDeep(dna);
      hechos = deepData.text;
      visualsData = deepData.visuals;
    } else {
      hechos = dna;
    }

    // RECONEXIÓN CRÍTICA: La IA ahora recibe la "carne" (hechos), no el enlace.
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
          { role: "system", content: `${SYSTEM_INSTRUCTIONS}\n\n${PERSONA}\n\n${PROTOCOLOS_IA}` },
          { role: "system", content: `AUDITORÍA TÉCNICA 360:\n- Velocidad de Carga: ${visualsData.loadTime || 'N/A'}s\n- Errores No Visuales: ${JSON.stringify(visualsData.technicalErrors || [])}\n- Performance: ${JSON.stringify(visualsData.perfMetrics || {})}` },
          { role: "system", content: `VISUALES DETECTADOS: ${JSON.stringify(visualsData)}` },
          { role: "system", content: `DOSSIER LITERAL DEL ACTIVO:\n${hechos}` },
          { role: "user", content: promptFinal }
        ],
        temperature: 0.2
      })
    });

    const xData = await xRes.json();
    res.json({ content: xData.choices[0].message.content });

  } catch (error) {
    console.error("Falla en Nodo:", error.message);
    res.status(500).json({ content: `### FALLA DE INFRAESTRUCTURA\nDetalle: ${error.message}` });
  }
});

app.listen(port, () => console.log(`PREDICTACORE TITÁN v32.0 - ESTATUS: ONLINE`));
