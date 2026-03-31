// server.js - BÚNKER 8: SECUENCIADOR ANTIBLOQUEO (CADENCIA TITÁN)

const express = require('express');
const cerebroWeb = require('./cerebro');           
const cerebroSocial = require('./cerebro_social'); 
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor'); 
const { FIREWALL_IA } = require('./firewall');
const { GoogleAuth } = require('google-auth-library');
const puppeteer = require('puppeteer');
const dns = require('dns');
const { promisify } = require('util');
const lookup = promisify(dns.lookup);

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json({ limit: '10mb' }));

const dossierCache = {};
const jobs = {}; 

const ETAPAS_ORDEN = [
    'INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK',
    'SWOT', 'WISHLIST', 'FUGAS', 'ACCIONES', 'HERRAMIENTAS', 'OMNI'
];

async function verificarDominio(url) {
    try {
        const urlObj = new URL(url);
        await lookup(urlObj.hostname);
        return true;
    } catch (error) {
        return false;
    }
}

app.get('/', (req, res) => res.send(getHTML()));

app.post('/start', async (req, res) => {
    const { dna } = req.body;
    let targetUrl = dna.trim();
    
    const isDomain = /\.(com|net|es|org|mx|info|biz|online|store|shop)/i.test(targetUrl);
    if (!targetUrl.startsWith('http') && isDomain) {
        targetUrl = `https://${targetUrl}`;
    }
    
    if (isDomain || targetUrl.startsWith('http')) {
        const dominioValido = await verificarDominio(targetUrl);
        if (!dominioValido) {
            return res.status(400).json({ error: "ERR_NAME_NOT_RESOLVED" });
        }
    }
    
    const jobId = targetUrl; 

    if (!jobs[jobId] || jobs[jobId].status === 'done' || jobs[jobId].status === 'error') {
        jobs[jobId] = { status: 'running', progress: {}, currentEtapa: 'INICIANDO' };
        
        ejecutarAuditoriaFondo(targetUrl, jobId).catch(e => {
            console.error("Fallo crítico en fondo:", e);
            if(jobs[jobId]) jobs[jobId].status = 'error';
        });
    }
    
    res.json({ jobId });
});

app.get('/poll', (req, res) => {
    const jobId = req.query.jobId;
    if (!jobs[jobId]) return res.json({ status: 'not_found' });
    res.json(jobs[jobId]);
});

app.post('/generate-pdf', async (req, res) => {
    const { html } = req.body;
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process', '--disable-gpu']
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0in', bottom: '0in', left: '0in', right: '0in' } // El margen de 1in ya viene en tu visual.js
        });
        await browser.close();
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="PredictaCore_Auditoria.pdf"');
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error al generar PDF:", error);
        if (browser) await browser.close();
        res.status(500).send("Fallo al generar el documento PDF.");
    }
});

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

    const isSocialMedia = targetUrl.includes('instagram.com') || targetUrl.includes('facebook.com') || targetUrl.includes('tiktok.com');
    const cerebroActivo = isSocialMedia ? cerebroSocial : cerebroWeb;
    const { PROMPTS, IDIOMA, REGLA_NUCLEAR } = cerebroActivo;

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
    const vertexUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-1.5-pro:generateContent`;

    for (const etapaId of ETAPAS_ORDEN) {
        jobs[jobId].currentEtapa = etapaId; 
        
        try {
            const promptFinal = PROMPTS[etapaId](datosTarget.texto);
            
            let partesMensaje = [
                { text: IDIOMA },
                { text: REGLA_NUCLEAR }, 
                { text: `FECHA ACTUAL DEL SISTEMA: Hoy es ${fechaActual}.` },
                { text: `URL DEL ACTIVO (CLAVE PARA IDENTIFICAR AL CLIENTE): ${targetUrl}` },
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
                generationConfig: { temperature: 0.15 } 
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
                const errorData = await vertexRes.json();
                // Manejo de cuota agotada (429) para reintento automático opcional o reporte claro
                if (vertexRes.status === 429) {
                    throw new Error("Límite de peticiones de Google agotado. El sistema esperará más tiempo en la siguiente etapa.");
                }
                throw new Error(`Fallo en Vertex AI: \${JSON.stringify(errorData)}`);
            }

            const vertexData = await vertexRes.json();
            const textoForense = vertexData.candidates[0].content.parts[0].text;
            
            jobs[jobId].progress[etapaId] = textoForense;

            // --- AJUSTE TITÁN: Retraso de 5 segundos para proteger la cuota ---
            await new Promise(resolve => setTimeout(resolve, 5000));

        } catch (error) {
            console.error(`Fallo en etapa \${etapaId}:`, error.message);
            jobs[jobId].progress[etapaId] = `### FALLA TÉCNICA\\nDetalle: \${error.message}`;
            // Si hay error, esperamos un poco más antes de la siguiente para "enfriar" la API
            await new Promise(resolve => setTimeout(resolve, 8000));
        }
    }
    
    jobs[jobId].status = 'done'; 
}

app.listen(port, "0.0.0.0", () => console.log(`PREDICTACORE TITÁN - MOTOR AUTÓNOMO ACTIVO EN \${port}`));
