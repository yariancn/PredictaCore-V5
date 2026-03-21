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

    // NODO IV: Visibilidad Externa (Google/Social)
    if (idFinal === 'VISIBILIDAD' && dna.startsWith('http')) {
      const query = `site:${dna} OR "${dna}" seguidores instagram tiktok comments authority`;
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
      hechos = dna; // Es una idea o concepto
    }

    // RECONEXIÓN CRÍTICA: La IA recibe HECHOS, no el enlace.
    const promptFinal = PROMPTS[idFinal](hechos);

    const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
      body: JSON.stringify({
        model: "grok-4-1-fast-reasoning",
        messages: [
          { role: "system", content: `${SYSTEM_INSTRUCTIONS}\n\n${PERSONA}\n\n${PROTOCOLOS_IA}` },
          { role: "system", content: `IDENTIFICA EL NICHO: Primero identifica qué vende el sitio. PROHIBIDO usar productos de los ejemplos (uñas, joyas) si no están en el dossier.` },
          { role: "system", content: `AUDITORÍA TÉCNICA 360:\n- Carga: ${visualsData.loadTime || 'N/A'}s\n- Errores: ${JSON.stringify(visualsData.technicalErrors || [])}` },
          { role: "system", content: `DOSSIER LITERAL (EVIDENCIA):\n${hechos}\n\nVISUALES:\n${JSON.stringify(visualsData.images || [])}` },
          { role: "user", content: promptFinal }
        ],
        temperature: 0.1 // Máxima precisión, mínima creatividad
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
