// server.js - BÚNKER 5: OPERADOR LÓGICO (VERSIÓN ORO MOLIDO - GEMINI VERTEX AI)

const express = require('express');
const { PROMPTS } = require('./cerebro'); 
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor'); 
const { FIREWALL_IA } = require('./firewall');
const { GoogleAuth } = require('google-auth-library');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

app.get('/', (req, res) => res.send(getHTML()));

app.post('/diseccion', async (req, res) => {
  const { dna, etapaId } = req.body;
  
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
    const fechaActual = new Date().toLocaleDateString('es-ES', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    // 1. AUTENTICACIÓN FORENSE CON VERTEX AI
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

    // 2. CONSTRUCCIÓN DEL PAYLOAD CON BÚSQUEDA EN GOOGLE (GROUNDING)
    const payload = {
      systemInstruction: {
        parts: [{ text: FIREWALL_IA }] 
      },
      contents: [
        { 
          role: "user", 
          parts: [
            { text: `FECHA ACTUAL DEL SISTEMA: Hoy es ${fechaActual}. Evalúa todo basándote en que este es el presente absoluto.` },
            { text: `DOSSIER DEL ACTIVO ANALIZADO (Datos internos extraídos):\n${hechos}` },
            { text: promptFinal }
          ]
        }
      ],
      tools: [
        { googleSearch: {} } // CORRECCIÓN: Vertex AI actualizó el comando a googleSearch
      ],
      generationConfig: {
        temperature: 0.1 
      }
    };

    // 3. EJECUCIÓN DEL DIAGNÓSTICO
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
    
    // Extracción del texto de la respuesta de Gemini
    const textoForense = vertexData.candidates[0].content.parts[0].text;
    
    res.json({ content: textoForense });

  } catch (error) {
    console.error("Falla del Servidor:", error.message);
    res.status(500).json({ content: `### FALLA TÉCNICA\nDetalle: ${error.message}` });
  }
});

app.listen(port, () => console.log(`PREDICTACORE TITÁN - MOTOR ORO MOLIDO ACTIVO EN PUERTO ${port}`));
