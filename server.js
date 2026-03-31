// server.js - BÚNKER 9: MOTOR DE REINTENTO DINÁMICO Y MULTI-AUDITORÍA

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
    } catch (error) { return false; }
}

app.get('/', (req, res) => res.send(getHTML()));

app.post('/start', async (req, res) => {
    const { dna } = req.body;
    let targetUrl = dna.trim();
    const isDomain = /\.(com|net|es|org|mx|info|biz|online|store|shop)/i.test(targetUrl);
    if (!targetUrl.startsWith('http') && isDomain) targetUrl = `https://${targetUrl}`;
    
    if (isDomain || targetUrl.startsWith('http')) {
        const dominioValido = await verificarDominio(targetUrl);
        if (!dominioValido) return res.status(400).json({ error: "ERR_NAME_NOT_RESOLVED" });
    }
    
    const jobId = `${targetUrl}_${Date.now()}`; 
    jobs[jobId] = { status: 'running', progress: {}, currentEtapa: 'INICIANDO' };
    
    ejecutarAuditoriaFondo(targetUrl, jobId).catch(e => {
        console.error("Fallo crítico en fondo:", e);
        jobs[jobId].status = 'error';
    });
    
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
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        if (browser) await browser.close();
        res.status(500).send("Fallo al generar PDF.");
    }
});

// FUNCIÓN DE AYUDA PARA REINTENTOS
async function llamarVertexConReintento(url, headers, payload, etapaId, intentos = 3) {
    for (let i = 0; i < intentos; i++) {
        try {
            const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });
            if (res.status === 429) {
                const espera = 10000 * (i + 1);
                console.log(`[!] Cuota excedida en ${etapaId}. Reintentando en ${espera/1000}s...`);
                await new Promise(r => setTimeout(r, espera));
                continue;
            }
            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText);
            }
            return await res.json();
        } catch (error) {
            if (i === intentos - 1) throw error;
            await new Promise(r => setTimeout(r, 5000));
        }
    }
}

async function ejecutarAuditoriaFondo(targetUrl, jobId) {
    let datosTarget = { isUrl: false, texto: "", desktopBase64: null, mobileBase64: null };
    const isDomain = /\.(com|net|es|org|mx|info|biz|online|store|shop)/i.test(targetUrl);

    if (isDomain || targetUrl.startsWith('http')) {
        console.log(`[+] Extrayendo Visión Absoluta de: ${targetUrl}`);
        datosTarget = await captureAndScrape(targetUrl);
    } else {
        datosTarget.texto = targetUrl;
    }

    const isSocialMedia = targetUrl.includes('instagram.com') || targetUrl.includes('facebook.com') || targetUrl.includes('tiktok.com');
    const cerebroActivo = isSocialMedia ? cerebroSocial : cerebroWeb;
    const { PROMPTS, IDIOMA, REGLA_NUCLEAR } = cerebroActivo;
    const fechaActual = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
    const projectId = credenciales.project_id;
    const auth = new GoogleAuth({ credentials: credenciales, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const accessToken = tokenResponse.token;
    const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-1.5-pro:generateContent`;

    const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` };

    for (const etapaId of ETAPAS_ORDEN) {
        jobs[jobId].currentEtapa = etapaId;
        try {
            const promptFinal = PROMPTS[etapaId](datosTarget.texto);
            let partesMensaje = [
                { text: IDIOMA }, { text: REGLA_NUCLEAR },
                { text: `FECHA ACTUAL: ${fechaActual} | URL: ${targetUrl}` },
                { text: `DOSSIER: ${datosTarget.texto}` }
            ];

            if (datosTarget.isUrl && datosTarget.desktopBase64) {
                partesMensaje.push({ inlineData: { mimeType: "image/jpeg", data: datosTarget.desktopBase64 } });
                partesMensaje.push({ inlineData: { mimeType: "image/jpeg", data: datosTarget.mobileBase64 } });
            }

            partesMensaje.push({ text: promptFinal });

            const payload = {
                systemInstruction: { parts: [{ text: FIREWALL_IA }] },
                contents: [{ role: "user", parts: partesMensaje }],
                generationConfig: { temperature: 0.15 } 
            };

            if (etapaId === 'VISIBILIDAD' || etapaId === 'BENCHMARK') payload.tools = [{ googleSearch: {} }];

            const vertexData = await llamarVertexConReintento(vertexUrl, headers, payload, etapaId);
            jobs[jobId].progress[etapaId] = vertexData.candidates[0].content.parts[0].text;

            // Cadencia de seguridad para permitir multi-auditoría
            await new Promise(r => setTimeout(r, 4000));

        } catch (error) {
            console.error(`[-] Error final en etapa ${etapaId}:`, error.message);
            jobs[jobId].progress[etapaId] = `### FALLA TÉCNICA RECURRENTE\nEl motor de inteligencia está saturado. Intenta exportar lo que se generó o reinicia la simulación.`;
        }
    }
    jobs[jobId].status = 'done'; 
}

app.listen(port, "0.0.0.0", () => console.log(`PREDICTACORE TITÁN - MOTOR AUTÓNOMO ACTIVO EN ${port}`));
