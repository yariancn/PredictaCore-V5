// server.js - BÚNKER 5: OPERADOR LÓGICO

const express = require('express');
const { PROMPTS } = require('./cerebro'); 
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor'); 
const { FIREWALL_IA } = require('./firewall'); // NUESTRO CANDADO MAESTRO

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

    const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
      body: JSON.stringify({
        model: "grok-4-1-fast-reasoning", 
        messages: [
          // 1. EL CANDADO DE TITANIO: Entra primero, establece las reglas inquebrantables.
          { role: "system", content: FIREWALL_IA },
          // 2. LOS DATOS: La información cruda extraída del motor.
          { role: "system", content: `DOSSIER DEL ACTIVO ANALIZADO:\n${hechos}` },
          // 3. LA INSTRUCCIÓN: El prompt limpio del cerebro.
          { role: "user", content: promptFinal }
        ],
        temperature: 0.1 // Temperatura baja para evitar alucinaciones.
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
