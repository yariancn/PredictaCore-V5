const express = require('express');
const axios = require('axios');
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
    let visualsData = { images: [], buttons: [], loadTime: 'N/A', technicalErrors: [] };

    if (dna.startsWith('http')) {
      if (idFinal === 'VISIBILIDAD') {
        // Búsqueda de autoridad externa
        const query = `site:${dna} OR "${dna}" seguidores instagram tiktok engagement`;
        const searchRes = await axios.get(`https://s.jina.ai/${encodeURIComponent(query)}`, {
          headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
        });
        hechos = searchRes.data;
      } else {
        // Scrape profundo del activo
        const deepData = await scrapeDeep(dna);
        hechos = deepData.text;
        visualsData = deepData.visuals;
      }
    } else {
      hechos = dna; // Es una idea o concepto manual
    }

    // RECONEXIÓN: La IA recibe los HECHOS, no el enlace
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
          { role: "system", content: `IDENTIFICACIÓN DE NICHO: Antes de analizar, detecta el producto/servicio real en el dossier. PROHIBIDO usar ejemplos de joyería o uñas si no aparecen en los datos.` },
          { role: "system", content: `EVIDENCIA TÉCNICA 360:\n- Carga: ${visualsData.loadTime}s\n- Errores de Consola: ${JSON.stringify(visualsData.technicalErrors)}\n- Visuales: ${JSON.stringify(visualsData.images)}` },
          { role: "system", content: `DOSSIER LITERAL EXTRAÍDO:\n${hechos || "ACTIVO NO DETECTADO"}` },
          { role: "user", content: promptFinal }
        ],
        temperature: 0.1
      })
    });

    const xData = await xRes.json();
    res.json({ content: xData.choices[0].message.content });

  } catch (error) {
    console.error("Falla en Nodo:", error.message);
    res.status(500).json({ content: `### FALLA DE INFRAESTRUCTURA\nDetalle: ${error.message}` });
  }
});

app.listen(port, () => console.log(`PREDICTACORE TITÁN v32.0 - ORO MOLIDO ONLINE`));
