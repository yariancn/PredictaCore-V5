// server.js - BÚNKER 5: OPERADOR LÓGICO AUTÓNOMO (SEGUNDO PLANO)

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
// NUEVA MEMORIA CENTRAL: Aquí se guardan los reportes mientras se procesan en fondo
const jobs = {}; 

const ETAPAS_ORDEN = [
    'INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK',
    'SWOT', 'WISHLIST', 'FUGAS', 'ACCIONES', 'HERRAMIENTAS', 'OMNI'
];

app.get('/', (req, res) => res.send(getHTML()));

// EL DISPARO: Inicia el proceso y libera al navegador inmediatamente
app.post('/start', async (req, res) => {
    const { dna } = req.body;
    let targetUrl = dna.trim();
    
    const isDomain = /\.(com|net|es|org|mx|info|biz|online|store|shop)/i.test(targetUrl);
    if (!targetUrl.startsWith('http') && isDomain) {
        targetUrl = `https://${targetUrl}`;
    }
    
    const jobId = targetUrl; // Usamos la URL como ID único del trabajo

    // Si no existe o ya terminó, creamos un trabajo nuevo en segundo plano
    if (!jobs[jobId] || jobs[jobId].status === 'done' || jobs[jobId].status === 'error') {
        jobs[jobId] = { status: 'running', progress: {}, currentEtapa: 'INICIANDO' };
        
        // Disparamos la función asíncrona sin "await" para que trabaje sola
        ejecutarAuditoriaFondo(targetUrl, jobId).catch(e => {
            console.error("Fallo crítico en fondo:", e);
            if(jobs[jobId]) jobs[jobId].status = 'error';
        });
    }
    
    res.json({ jobId });
});

// EL RADAR: El frontend llama aquí para ver cómo va el reporte
app.get('/poll', (req, res) => {
    const jobId = req.query.jobId;
    if (!jobs[jobId]) return res.json({ status: 'not_found' });
    res.json(jobs[jobId]);
});

// LA MÁQUINA DE TRABAJO (Opera aunque cierres la computadora)
async function ejecutarAuditoriaFondo(targetUrl, jobId) {
    let datosTarget = { isUrl: false, texto: "", desktopBase64: null, mobileBase64: null };
    const isDomain = /\.(com|net|es|org|mx|info|biz|online|store|shop)/i.test(targetUrl);

    if (isDomain || targetUrl.startsWith('http')) {
        if (!dossierCache[targetUrl]) {
            console.log(`[+] Extrayendo Visión Absoluta de: ${targetUrl}`);
            dossierCache[targetUrl] = await captureAndScrape(targetUrl);
            setTimeout(() => { delete dossierCache[targetUrl]; }, 1000 * 60 * 25);
        }
        datosTarget = dossierCache[targetUrl];
    } else {
        datosTarget.texto = targetUrl;
    }

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

    for (const etapaId of ETAPAS_ORDEN) {
        jobs[jobId].currentEtapa = etapaId; // Informamos qué etapa se está procesando
        
        try {
            const promptFinal = PROMPTS[etapaId](datosTarget.texto);
            
            let partesMensaje = [
                { text: `FECHA ACTUAL DEL SISTEMA: Hoy es ${fechaActual}. Evalúa todo basándote en que este es el presente absoluto.` },
                { text: `DOSSIER DEL ACTIVO ANALIZADO:\n${datosTarget.texto}` }
            ];

            if (datosTarget.isUrl && datosTarget.desktopBase64 && datosTarget.mobileBase64) {
                partesMensaje.push({ text: "EVIDENCIA VISUAL 1: Captura de la versión Escritorio." });
                partesMensaje.push({ inlineData: { mimeType: "image/jpeg", data: datosTarget.desktopBase64 } });
                partesMensaje.push({ text: "EVIDENCIA VISUAL 2: Captura de la versión Móvil." });
                partesMensaje.push({ inlineData: { mimeType: "image/jpeg", data: datosTarget.mobileBase64 } });
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
            
            // Guardamos el resultado exitoso en la memoria central
            jobs[jobId].progress[etapaId] = textoForense;

            // Respirador de 3 segundos para el servidor
            await new Promise(resolve => setTimeout(resolve, 3000));

        } catch (error) {
            console.error(`Fallo en etapa ${etapaId}:`, error.message);
            jobs[jobId].progress[etapaId] = `### FALLA TÉCNICA\nDetalle: ${error.message}`;
        }
    }
    
    jobs[jobId].status = 'done'; // Proceso finalizado con éxito
}

app.listen(port, "0.0.0.0", () => console.log(`PREDICTACORE TITÁN - MOTOR AUTÓNOMO ACTIVO EN ${port}`));
