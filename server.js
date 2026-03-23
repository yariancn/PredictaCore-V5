const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor'); // Importación original aprobada
// ... resto de imports ...

const app = express();
// ... configuración app ...

app.post('/diseccion', async (req, res) => {
  const { dna, etapaId } = req.body;
  const { XAI_API_KEY } = process.env;

  try {
    const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';
    let hechos = "";
    let targetUrl = dna.trim();

    if (targetUrl.startsWith('http')) {
      hechos = await captureAndScrape(targetUrl);
    } else if (targetUrl.includes('.com') || targetUrl.includes('.mx')) {
      targetUrl = `https://${targetUrl}`;
      hechos = await captureAndScrape(targetUrl);
    } else {
      hechos = targetUrl;
    }

    // ELIMINADO EL BLOQUE DE "ABORTO FORENSE" QUE CAUSABA EL FALLO

    const promptFinal = PROMPTS[idFinal](hechos);

    const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
      body: JSON.stringify({
        model: "grok-4-1-fast-reasoning", 
        messages: [
          { role: "system", content: `${PERSONA}` },
          { role: "system", content: `DOSSIER DEL SITIO:\n${hechos}` },
          { role: "user", content: promptFinal }
        ],
        temperature: 0.1 
      })
    });

    const xData = await xRes.json();
    res.json({ content: xData.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ content: `### FALLA TÉCNICA\nDetalle: ${error.message}` });
  }
});

app.listen(port, () => console.log(`PREDICTACORE TITÁN - MOTOR ACTIVO`));
