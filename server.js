const express = require('express');
const { PERSONA, PROMPTS } = require('./cerebro');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');
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

    // 1. LA CURA A LA CEGUERA: Forzamos el encendido del motor aunque falte el "http"
    const isDomain = targetUrl.includes('.com') || targetUrl.includes('.net') || targetUrl.includes('.es') || targetUrl.includes('.org') || targetUrl.includes('.mx');
    
    if (targetUrl.startsWith('http')) {
      hechos = await captureAndScrape(targetUrl);
    } else if (isDomain) {
      targetUrl = `https://${targetUrl}`;
      hechos = await captureAndScrape(targetUrl);
    } else {
      hechos = targetUrl; // Es una idea o concepto escrito a mano
    }

    // 2. EL KILL SWITCH ANTI-ALUCINACIONES
    if (hechos.includes("ERROR CRÍTICO")) {
        return res.json({ content: `### 🛑 ABORTO FORENSE\nEl motor de PredictaCore no pudo penetrar la seguridad de ${targetUrl}. Cloudflare o Shopify bloquearon la extracción. \n\n**Sentencia:** Un sitio que bloquea a los bots de auditoría también bloquea a Google. Su SEO orgánico está muerto. \n\n*Operación abortada para garantizar Cero Alucinación.*` });
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
        temperature: 0.1 // Cero imaginación, solo bisturí forense.
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
