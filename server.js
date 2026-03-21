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

    // NODO IV: Visibilidad Externa (Google/Redes)
    if (idFinal === 'VISIBILIDAD' && dna.startsWith('http')) {
      const query = `site:${dna} OR "${dna}" seguidores instagram tiktok comments`;
      const searchRes = await fetch(`https://s.jina.ai/${encodeURIComponent(query)}`, {
        headers: { "Authorization": `Bearer ${JINA_API_KEY}` }
      });
      hechos = await searchRes.text();
    } else if (dna.startsWith('http')) {
      // BARRIDO NORMAL
      const deepData = await scrapeDeep(dna);
      hechos = deepData.text;
      visualsData = deepData.visuals;
    } else {
      hechos = dna; // Concepto manual
    }

    // CONEXIÓN ORO: Pasamos la "carne" (hechos) al cerebro
    const promptFinal = PROMPTS[idFinal](hechos);

    const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
      body: JSON.stringify({
        model: "grok-4-1-fast-reasoning",
        messages: [
          { role: "system", content: `${SYSTEM_INSTRUCTIONS}\n\n${PERSONA}\n\n${PROTOCOLOS_IA}` },
          { role: "system", content: `REGLA DE ORO: Identifica el nicho real en el dossier. PROHIBIDO hablar de joyas o uñas si no están en el texto.` },
          { role: "system", content: `EVIDENCIA TÉCNICA 360:\n- Carga: ${visualsData.loadTime || 'N/A'}s\n- Errores: ${JSON.stringify(visualsData.technicalErrors || [])}\n- Visuales: ${JSON.stringify(visualsData.images || [])}` },
          { role: "system", content: `CONTENIDO LITERAL:\n${hechos}` },
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

app.listen(port, () => console.log(`PREDICTACORE TITÁN v32.0 - ORO MOLIDO - ONLINE`));
