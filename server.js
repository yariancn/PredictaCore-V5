// server.js - BÚNKER 5: OPERADOR LÓGICO (ESTABLE PYA20)

const express = require('express');
const { PROMPTS } = require('./cerebro'); 
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor'); 
const { FIREWALL_IA } = require('./firewall');
const { GoogleAuth } = require('google-auth-library');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

const dossierCache = {};

app.get('/', (req, res) => res.send(getHTML()));

app.post('/diseccion', async (req, res) => {
  const { dna, etapaId } = req.body;
  
  try {
    const idFinal = PROMPTS[etapaId] ? etapaId : 'OMNI';
    let datosTarget = { isUrl: false, texto: "", desktopBase64: null, mobileBase64: null };
    let targetUrl = dna.trim();

    const isDomain = /\.(com|net|es|org|mx|info|biz|online|store|shop)/i.test(targetUrl);
    
    if (!targetUrl.startsWith('http') && isDomain) {
      targetUrl = `https://${targetUrl}`;
    }

    if (isDomain || targetUrl.startsWith('http')) {
      if (!dossierCache[targetUrl]) {
        console.log(`[+] Extrayendo Visión Absoluta de: ${targetUrl}`);
        dossierCache[targetUrl] = await captureAndScrape(targetUrl);
        setTimeout(() => { delete dossierCache[targetUrl]; }, 1000 * 60 * 15);
      }
      datosTarget = dossierCache[targetUrl];
    } else {
      datosTarget.texto = targetUrl;
    }

    const promptFinal = PROMPTS[idFinal](datosTarget.texto);
    const fechaActual = new Date().toLocaleDateString('es-ES', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
    const projectId = credenciales.project_id;
    const location = 'us-central1'; 
    
    const auth = new GoogleAuth({
      credentials: credenciales,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const accessToken = tokenResponse.token;

    const vertexUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-2.5-pro:generateContent`;

    let partesMensaje = [
        { text: `FECHA ACTUAL DEL SISTEMA: Hoy es ${fechaActual}. Evalúa todo basándote en que este es el presente absoluto.` },
        { text: `DOSSIER DEL ACTIVO ANALIZADO:\n${datosTarget.texto}` }
    ];

    if (datosTarget.isUrl && datosTarget.desktopBase64 && datosTarget.mobileBase64) {
        partesMensaje.push({ text: "EVIDENCIA VISUAL 1: Captura de la versión Escritorio." });
        partesMensaje.push({
            inlineData: { mimeType: "image/jpeg", data: datosTarget.desktopBase64 }
        });
        partesMensaje.push({ text: "EVIDENCIA VISUAL 2: Captura de la versión Móvil." });
        partesMensaje.push({
            inlineData: { mimeType: "image/jpeg", data: datosTarget.mobileBase64 }
        });
    }

    partesMensaje.push({ text: promptFinal });

    const payload = {
      systemInstruction: { parts: [{ text: FIREWALL_IA }] },
      contents: [{ role: "user", parts: partesMensaje }],
      generationConfig: { temperature: 0.1 }
    };

    if (etapaId === 'VISIBILIDAD' || etapaId === 'BENCHMARK') {
        payload.tools = [{ googleSearch: {} }];
    }

    const vertexRes = await fetch(vertexUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${accessToken}` 
      },
      body: JSON.stringify(payload)
    });

    if (!vertexRes.ok) {
        const errorData = await vertexRes.text();
        throw new Error(`Fallo en Vertex AI: ${errorData}`);
    }

    const vertexData = await vertexRes.json();
    const textoForense = vertexData.candidates[0].content.parts[0].text;
    
    res.json({ content: textoForense });

  } catch (error) {
    console.error("Falla del Servidor:", error.message);
    res.status(500).json({ content: `### FALLA TÉCNICA\nDetalle: ${error.message}` });
  }
});

app.listen(port, "0.0.0.0", () => console.log(`PREDICTACORE TITÁN - MOTOR ACTIVO EN PUERTO ${port}`));
