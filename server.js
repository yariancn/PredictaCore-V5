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

  if (!XAI_API_KEY) {
    return res.status(500).json({ content: "Error: API Key de xAI no configurada." });
  }

  try {
    const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';
    let facts = "";
    let visualsData = {};

    // Ejecución del NODO IV (Visibilidad Externa) o del Scrape Principal
    if (dna.startsWith('http')) {
      if (idFinal === 'VISIBILIDAD') {
        const query = `site:${dna} OR "${dna}" instagram tiktok followers engagement seo`;
        try {
          const searchRes = await axios.get(`https://s.jina.ai/${encodeURIComponent(query)}`, {
            headers: { "Authorization": `Bearer ${JINA_API_KEY}` }, timeout: 10000
          });
          facts = searchRes.data;
        } catch (e) {
          facts = "No se encontraron datos externos o el motor de búsqueda bloqueó la consulta.";
        }
      } else {
        const scrapeData = await scrapeDeep(dna);
        facts = scrapeData.text;
        visualsData = scrapeData.visuals;
      }
    } else {
      facts = dna;
    }

    // Análisis de Integridad del Dossier
    const calidadDossier = facts.length > 800 ? "COMPLETO" : "DEFICIENTE_O_BLOQUEADO";

    const promptFinal = PROMPTS[idFinal](facts);

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
      body: JSON.stringify({
        model: "grok-4-1-fast-reasoning",
        messages: [
          { role: "system", content: `${SYSTEM_INSTRUCTIONS}\n\n${PERSONA}\n\n${PROTOCOLOS_IA}` },
          { role: "system", content: `DIRECTRIZ DE INTEGRIDAD: El estado del dossier es ${calidadDossier}. Si es DEFICIENTE, tu diagnóstico debe centrarse estrictamente en el impacto financiero de tener una arquitectura web bloqueada, lenta o vacía (Ej: "Un sitio que no puede ser leído por bots, no puede ser indexado por Google"). PROHIBIDO inventar inventarios, precios o nichos si no aparecen en el texto.` },
          { role: "system", content: `EVIDENCIA TÉCNICA EXTRAÍDA:\n- Tiempo de Carga: ${visualsData.loadTime || 'N/A'}s\n- Errores de Consola (Fricción Técnica): ${JSON.stringify(visualsData.technicalErrors || [])}\n- Imágenes y CTAs: ${JSON.stringify(visualsData)}` },
          { role: "system", content: `DOSSIER FORENSE (Texto Base):\n${facts}` },
          { role: "user", content: promptFinal }
        ],
        temperature: 0.1 // Máximo rigor analítico
      })
    });

    if (!response.ok) throw new Error(`Error de API xAI: ${response.statusText}`);
    
    const xData = await response.json();
    res.json({ content: xData.choices[0].message.content });

  } catch (error) {
    console.error("[CRÍTICO] Colapso del Nodo de Procesamiento:", error.message);
    res.status(500).json({ content: `### HEMORRAGIA TÉCNICA DETECTADA\nEl sistema no pudo completar la disección. Detalle forense: ${error.message}` });
  }
});

app.listen(port, () => console.log(`PREDICTACORE TITÁN v40 - ARQUITECTURA LIMPIA - ONLINE`));
