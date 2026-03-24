// server.js - BÚNKER 5: OPERADOR LÓGICO (VERSIÓN VANGUARDIA - VISIÓN ABSOLUTA)

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
    let datosTarget = { isUrl: false, texto: "", desktopBase64: null, mobileBase64: null };
    let targetUrl = dna.trim();

    const isDomain = /\.(com|net|es|org|mx|info|biz|online|store|shop)/i.test(targetUrl);
    
    if (targetUrl.startsWith('http')) {
      datosTarget = await captureAndScrape(targetUrl);
    } else if (isDomain) {
      targetUrl = `https://${targetUrl}`;
      datosTarget = await captureAndScrape(targetUrl);
    } else {
      // Si el usuario metió una idea cruda en vez de URL
      datosTarget.texto = targetUrl;
    }

    const promptFinal = PROMPTS[idFinal](datosTarget.texto);
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

    // 2. CONSTRUCCIÓN DEL PAYLOAD (TEXTO + VISIÓN MULTIMODAL + GOOGLE SEARCH)
    let partesMensaje = [
        { text: `FECHA ACTUAL DEL SISTEMA: Hoy es ${fechaActual}. Evalúa todo basándote en que este es el presente absoluto.` },
        { text: `DOSSIER DEL ACTIVO ANALIZADO (Datos internos extraídos, tiempo de carga y errores de consola):\n${datosTarget.texto}` }
    ];

    // INYECCIÓN DE VISIÓN ABSOLUTA: Si el motor trajo fotos, se las mostramos a Gemini
    if (datosTarget.isUrl && datosTarget.desktopBase64 && datosTarget.mobileBase64) {
        partesMensaje.push({ text: "EVIDENCIA VISUAL 1: Captura de pantalla de la versión Escritorio (Desktop). Analiza colores, contrastes, visibilidad de botones y economía del ojo." });
        partesMensaje.push({
            inlineData: {
                mimeType: "image/png",
                data: datosTarget.desktopBase64
            }
        });
        partesMensaje.push({ text: "EVIDENCIA VISUAL 2: Captura de pantalla de la versión Móvil (Smartphone). Analiza si el diseño es responsivo, si hay elementos encimados y si hay fricción visual en la navegación táctil." });
        partesMensaje.push({
            inlineData: {
                mimeType: "image/png",
                data: datosTarget.mobileBase64
            }
        });
    }

    // Añadir la instrucción específica de la etapa (Scorecard, Fugas, etc.)
    partesMensaje.push({ text: promptFinal });

    const payload = {
      systemInstruction: {
        parts: [{ text: FIREWALL_IA }] 
      },
      contents: [
        { 
          role: "user", 
          parts: partesMensaje
        }
      ],
      tools: [
        { googleSearch: {} } // Radar SEO en tiempo real
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
    const textoForense = vertexData.candidates[0].content.parts[0].text;
    
    res.json({ content: textoForense });

  } catch (error) {
    console.error("Falla del Servidor:", error.message);
    res.status(500).json({ content: `### FALLA TÉCNICA\nDetalle: ${error.message}` });
  }
});

app.listen(port, () => console.log(`PREDICTACORE TITÁN - MOTOR ORO MOLIDO ACTIVO EN PUERTO ${port}`));
