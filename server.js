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
    let facts = "";
    let visualsData = {};

    if (dna.startsWith('http')) {
      if (idFinal === 'VISIBILIDAD') {
        const query = `site:${dna} OR "${dna}" instagram tiktok followers engagement`;
        const searchRes = await axios.get(`https://s.jina.ai/${encodeURIComponent(query)}`, {
          headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
        });
        facts = searchRes.data;
      } else {
        const scrape = await scrapeDeep(dna);
        facts = scrape.text;
        visualsData = scrape.visuals;
      }
    } else {
      facts = dna;
    }

    const promptFinal = PROMPTS[idFinal](facts);

    const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
      body: JSON.stringify({
        model: "grok-4-1-fast-reasoning",
        messages: [
          { role: "system", content: `${SYSTEM_INSTRUCTIONS}\n\n${PERSONA}\n\n${PROTOCOLOS_IA}` },
          { role: "system", content: `REGLA DE INTEGRIDAD: Si el dossier es escaso, sentencia la INVISIBILIDAD como una falla de capital. Identifica el nicho por el dominio o metadatos. No inventes productos si no hay evidencia.` },
          { role: "system", content: `DATOS VISUALES EXTRAÍDOS: ${JSON.stringify(visualsData)}` },
          { role: "system", content: `DOSSIER LITERAL DEL ACTIVO:\n${facts}` },
          { role: "user", content: promptFinal }
        ],
        temperature: 0.1 // Rigor absoluto
      })
    });

    const xData = await xRes.json();
    res.json({ content: xData.choices[0].message.content });

  } catch (error) {
    console.error("Falla en Nodo:", error.message);
    res.status(500).json({ content: `### FALLA DE INFRAESTRUCTURA\nEl sistema ha detectado una hemorragia técnica: ${error.message}` });
  }
});

app.listen(port, () => console.log(`PREDICTACORE TITÁN v33.0 - ORO MOLIDO ONLINE`));
