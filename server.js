// server.js - BÚNKER 10.1: RECTIFICACIÓN DE MODELO Y ENDPOINT STABLE

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

const jobs = {}; 

app.get('/', (req, res) => res.send(getHTML()));

app.post('/start', async (req, res) => {
    try {
        const { dna } = req.body;
        if (!dna) return res.status(400).json({ error: "Falta DNA" });

        let targetUrl = dna.trim();
        const isDomain = /\.(com|net|es|org|mx|info|biz|online|store|shop)/i.test(targetUrl);
        if (!targetUrl.startsWith('http') && isDomain) targetUrl = `https://${targetUrl}`;
        
        const jobId = `job_${Date.now()}`; 
        jobs[jobId] = { status: 'running', progress: {}, currentEtapa: 'INICIANDO', url: targetUrl };
        
        ejecutarAuditoriaFondo(targetUrl, jobId).catch(e => {
            console.error("Fallo crítico en fondo:", e);
            if(jobs[jobId]) jobs[jobId].status = 'error';
        });
        
        console.log(`[+] Auditoría iniciada. ID: ${jobId} | Target: ${targetUrl}`);
        res.json({ jobId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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
        res.status(500).send("Fallo PDF");
    }
});

// MOTOR DE REINTENTO MEJORADO
async function llamarVertexConReintento(url, headers, payload, etapaId, intentos = 3) {
    for (let i = 0; i < intentos; i++) {
        try {
            const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });
            if (res.status === 429) {
                const espera = 15000 * (i + 1);
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
    const ETAPAS = ['INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK', 'SWOT', 'WISHLIST', 'FUGAS', 'ACCIONES', 'HERRAMIENTAS', 'OMNI'];
    
    let datosTarget = { isUrl: false, texto: "", desktopBase64: null, mobileBase64: null };
    const isDomain = /\.(com|net|es|org|mx|info|biz|online|store|shop)/i.test(targetUrl);

    if (isDomain || targetUrl.startsWith('http')) {
        console.log(`[+] Scrapeando: ${targetUrl}`);
        datosTarget = await captureAndScrape(targetUrl);
    } else {
        datosTarget.texto = targetUrl;
    }

    const isSocialMedia = targetUrl.includes('instagram.com') || targetUrl.includes('facebook.com') || targetUrl.includes('tiktok.com');
    const cerebro = isSocialMedia ? cerebroSocial : cerebroWeb;
    
    // --- EXTRACCIÓN DE CREDENCIALES SEGURA ---
    const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
    const auth = new GoogleAuth({ credentials: credenciales, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    
    // CAMBIO CRÍTICO: Usamos gemini-1.5-pro-002 (Versión de producción estable)
    const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-1.5-pro-002:generateContent`;

    for (const etapaId of ETAPAS) {
        jobs[jobId].currentEtapa = etapaId;
        try {
            const promptFinal = cerebro.PROMPTS[etapaId](datosTarget.texto);
            let partes = [
                { text: cerebro.IDIOMA }, { text: cerebro.REGLA_NUCLEAR },
                { text: `URL: ${targetUrl} | DOSSIER: ${datosTarget.texto}` }
            ];

            if (datosTarget.isUrl && datosTarget.desktopBase64) {
                partes.push({ inlineData: { mimeType: "image/jpeg", data: datosTarget.desktopBase64 } });
                partes.push({ inlineData: { mimeType: "image/jpeg", data: datosTarget.mobileBase64 } });
            }
            partes.push({ text: promptFinal });

            const payload = {
                systemInstruction: { parts: [{ text: FIREWALL_IA }] },
                contents: [{ role: "user", parts: partes }],
                generationConfig: { temperature: 0.15 } 
            };

            if (etapaId === 'VISIBILIDAD' || etapaId === 'BENCHMARK') payload.tools = [{ googleSearch: {} }];

            const vertexData = await llamarVertexConReintento(vertexUrl, { "Content-Type": "application/json", "Authorization": `Bearer ${tokenResponse.token}` }, payload, etapaId);
            
            if (vertexData.candidates && vertexData.candidates[0].content) {
                jobs[jobId].progress[etapaId] = vertexData.candidates[0].content.parts[0].text;
            } else {
                throw new Error("Respuesta de AI malformada");
            }

            // Cadencia de 4s para estabilidad
            await new Promise(r => setTimeout(r, 4000));
        } catch (error) {
            console.error(`[-] Error en ${etapaId}:`, error.message);
            jobs[jobId].progress[etapaId] = `### FALLA TÉCNICA\nDetalle: El motor de inteligencia no respondió correctamente. Reintenta la simulación o verifica tus cuotas de Google Cloud.`;
        }
    }
    jobs[jobId].status = 'done'; 
}

app.listen(port, "0.0.0.0", () => console.log(`PREDICTACORE TITÁN ACTIVO EN ${port}`));
