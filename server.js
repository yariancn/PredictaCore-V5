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
        const query = `site:${dna} OR "${dna}" instagram tiktok followers`;
        const searchRes = await axios.get(`https://s.jina.ai/${encodeURIComponent(query)}`, {
          headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
        });
        facts = searchRes.data;
      } else {
        const scrapeResult = await scrapeDeep(dna);
        facts = scrapeResult.text;
        visualsData = scrapeResult.visuals;
      }
    } else {
      facts = dna;
    }

    // Evaluación de la calidad del Dossier
    const calidadDossier = facts.length > 500 ? "ÓPTIMA" : "CRÍTICA (DATOS INSUFICIENTES)";

    const promptFinal = PROMPTS[idFinal](facts);

    const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
      body: JSON.stringify({
        model: "grok-4-1-fast-reasoning",
        messages: [
          { role: "system", content: `${SYSTEM_INSTRUCTIONS}\n\n${PERSONA}\n\n${PROTOCOLOS_IA}` },
          { role: "system", content: `ESTADO DEL DOSSIER: ${calidadDossier}. Si es CRÍTICA, enfoca el análisis en cómo la falta de visibilidad/acceso arruina la conversión, pero NO repitas 'Insolvencia de datos' en cada párrafo. Sé constructivo con lo poco que tengas.` },
          { role: "system", content: `IDENTIFICACIÓN DE NICHO: ¿De qué trata el negocio según el texto? Si es Pam and Ander, asume Moda Infantil.` },
          { role: "system", content: `EVIDENCIA VISUAL/TÉCNICA: ${JSON.stringify(visualsData)}` },
          { role: "system", content: `TEXTO EXTRAÍDO:\n${facts}` },
          { role: "user", content: promptFinal }
        ],
        temperature: 0.2 // Un poco de temperatura para evitar bucles repetitivos
      })
    });

    const xData = await xRes.json();
    res.json({ content: xData.choices[0].message.content });

  } catch (error) {
    console.error("Falla en Servidor:", error.message);
    res.status(500).json({ content: `### FALLA DE INFRAESTRUCTURA\nDetalle: ${error.message}` });
  }
});

app.listen(port, () => console.log(`PREDICTACORE TITÁN v40.0 - INICIADO`));
