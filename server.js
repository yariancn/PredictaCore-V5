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
    let visualsData = {};

    if (dna.startsWith('http')) {
      if (idFinal === 'VISIBILIDAD') {
        const query = `site:${dna} OR "${dna}"`;
        try {
          const searchRes = await axios.get(`https://s.jina.ai/${encodeURIComponent(query)}`, {
            headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
          });
          hechos = searchRes.data;
        } catch(e) {
          hechos = "No detectado.";
        }
      } else {
        const scrapedData = await scrapeDeep(dna);
        hechos = scrapedData.text;
        visualsData = scrapedData.visuals;
      }
    } else {
      hechos = dna;
    }

    // LA ÚNICA CORRECCIÓN REAL: Pasamos la carne (hechos) al cerebro
    const promptFinal = PROMPTS[idFinal](hechos);

    const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
      body: JSON.stringify({
        model: "grok-4-1-fast-reasoning",
        messages: [
          { role: "system", content: `${SYSTEM_INSTRUCTIONS}\n\n${PERSONA}\n\n${PROTOCOLOS_IA}` },
          { role: "system", content: `VISUALES DETECTADOS: ${JSON.stringify(visualsData)}` },
          { role: "user", content: promptFinal }
        ],
        temperature: 0.1
      })
    });

    const xData = await xRes.json();
    res.json({ content: xData.choices[0].message.content });

  } catch (error) {
    console.error("Falla de Nodo:", error.message);
    res.status(500).json({ content: `### FALLA TÉCNICA\nDetalle: ${error.message}` });
  }
});

app.listen(port, () => console.log(`PREDICTACORE TITÁN v32.0 - ONLINE Y ESTABLE`));
