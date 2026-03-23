const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const captureAndScrape = require('./motor'); // CORRECCIÓN 1: Importación directa sin llaves
const { SYSTEM_INSTRUCTIONS } = require('./instrucciones');
const { PROTOCOLOS_IA } = require('./protocolos');

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

    // Normalización de URL
    const isDomain = /\.(com|net|es|org|mx|info|biz|online|store|shop)/i.test(targetUrl);
    
    if (targetUrl.startsWith('http')) {
      hechos = await captureAndScrape(targetUrl);
    } else if (isDomain) {
      targetUrl = `https://${targetUrl}`;
      hechos = await captureAndScrape(targetUrl);
    } else {
      hechos = targetUrl; // Input manual (idea o concepto)
    }

    // CORRECCIÓN 2: KILL SWITCH sincronizado con los errores del motor
    if (hechos.includes("ERROR_MOTOR") || hechos.includes("FALLO_FORENSE")) {
        return res.json({ content: `### 🛑 ABORTO FORENSE\nEl motor de PredictaCore no pudo penetrar la seguridad de ${targetUrl}. \n\n**Sentencia:** El sitio presenta barreras técnicas (Timeouts o Bloqueos) que impiden una auditoría limpia. Un activo que no se deja auditar tampoco permite una indexación SEO fluida.\n\n*Operación abortada para garantizar Cero Alucinación.*` });
    }

    const promptFinal = PROMPTS[idFinal](hechos);

    const xRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${XAI_API_KEY}` },
      body: JSON.stringify({
        model: "grok-4-1-fast-reasoning", 
        messages: [
          { role: "system", content: `${SYSTEM_INSTRUCTIONS}\n\n${PERSONA}\n\n${PROTOCOLOS_IA}` },
          { role: "system", content: `DOSSIER LITERAL EXTRAÍDO DEL SITIO WEB:\n${hechos}` },
          { role: "user", content: promptFinal }
        ],
        temperature: 0.1 
      })
    });

    const xData = await xRes.json();
    res.json({ content: xData.choices[0].message.content });

  } catch (error) {
    console.error("Falla del Servidor:", error.message);
    res.status(500).json({ content: `### FALLA TÉCNICA DE INFRAESTRUCTURA\nDetalle: ${error.message}` });
  }
});

app.listen(port, () => console.log(`PREDICTACORE TITÁN - MOTOR DESBLOQUEADO Y KILL SWITCH ACTIVO`));
