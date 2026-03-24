const express = require('express');
const { PROMPTS } = require('./cerebro'); 
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor'); 
const { FIREWALL_IA } = require('./firewall'); 

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
    let targetUrl = dna.trim();

    const isDomain = /\.(com|net|es|org|mx|info|biz|online|store|shop)/i.test(targetUrl);
    
    if (targetUrl.startsWith('http')) {
      hechos = await captureAndScrape(targetUrl);
    } else if (isDomain) {
      targetUrl = `https://${targetUrl}`;
      hechos = await captureAndScrape(targetUrl);
    } else {
      hechos = targetUrl;
    }

    const promptFinal = PROMPTS[idFinal](hechos);

    // NUEVO: Calculamos la fecha actual para el motor
    const fechaActual = new Date().toLocaleDateString('es-ES', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
      body: JSON.stringify({
        model: "grok-4-1-fast-reasoning", 
        messages: [
          { role: "system", content: FIREWALL_IA },
          // NUEVO: Inyectamos el reloj interno a la IA
          { role: "system", content: `FECHA ACTUAL DEL SISTEMA: Hoy es ${fechaActual}. Evalúa cualquier fecha en los datos (como reseñas o posts) basándote en que este es el presente absoluto. No asumas que eventos de este año están en el futuro.` },
          { role: "system", content: `DOSSIER DEL ACTIVO ANALIZADO:\n${hechos}` },
          { role: "user", content: promptFinal }
        ],
        temperature: 0.1 
      })
    });

    const xData = await xRes.json();
    res.json({ content: xData.choices[0].message.content });

  } catch (error) {
    console.error("Falla del Servidor:", error.message);
    res.status(500).json({ content: `### FALLA TÉCNICA\nDetalle: ${error.message}` });
  }
});

app.listen(port, () => console.log(`PREDICTACORE TITÁN - MOTOR ACTIVO EN PUERTO ${port}`));
