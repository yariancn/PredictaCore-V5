// server.js - BÚNKER 7 RESTAURADO: RECTIFICACIÓN DE CANAL
const express = require('express');
const cerebroWeb = require('./cerebro');           
const cerebroSocial = require('./cerebro_social'); 
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor'); 
const { FIREWALL_IA } = require('./firewall');
const { GoogleAuth } = require('google-auth-library');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json({ limit: '10mb' }));
const jobs = {}; 

app.get('/', (req, res) => res.send(getHTML()));

app.post('/start', async (req, res) => {
    const { dna } = req.body;
    if (!dna) return res.status(400).json({ error: "Falta DNA" });
    
    let targetUrl = dna.trim();
    const isDomain = /\.(com|net|es|org|mx|info|biz|online|store|shop)/i.test(targetUrl);
    if (!targetUrl.startsWith('http') && isDomain) targetUrl = `https://${targetUrl}`;
    
    const jobId = `job_${Date.now()}`; 
    jobs[jobId] = { status: 'running', progress: {}, currentEtapa: 'INICIANDO', url: targetUrl };
    
    ejecutarAuditoriaFondo(targetUrl, jobId).catch(e => {
        console.error("Fallo crítico:", e);
        if(jobs[jobId]) jobs[jobId].status = 'error';
    });
    
    res.json({ jobId });
});

app.get('/poll', (req, res) => {
    const jobId = req.query.jobId;
    if (!jobs[jobId]) return res.json({ status: 'not_found' });
    res.json(jobs[jobId]);
});

async function ejecutarAuditoriaFondo(targetUrl, jobId) {
    const ETAPAS = ['INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK', 'SWOT', 'WISHLIST', 'FUGAS', 'ACCIONES', 'HERRAMIENTAS', 'OMNI'];
    
    // 1. Extracción con motor.js corregido
    let datosTarget = await captureAndScrape(targetUrl);

    // 2. Selección de Cerebro
    const isSocialMedia = targetUrl.includes('instagram.com') || targetUrl.includes('facebook.com') || targetUrl.includes('tiktok.com');
    const cerebro = isSocialMedia ? cerebroSocial : cerebroWeb;

    // 3. Autenticación Vertex AI
    const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
    const auth = new GoogleAuth({
        credentials: credenciales,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-1.5-pro-001:generateContent`;

    for (const etapaId of ETAPAS) {
        jobs[jobId].currentEtapa = etapaId;
        try {
            const promptFinal = cerebro.PROMPTS[etapaId](datosTarget.texto);
            
            let partes = [
                { text: cerebro.IDIOMA },
                { text: cerebro.REGLA_NUCLEAR },
                { text: `CONTEXTO: ${targetUrl} | DOSSIER: ${datosTarget.texto}` }
            ];

            if (datosTarget.desktopBase64) {
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

            const res = await fetch(vertexUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenResponse.token}` },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            jobs[jobId].progress[etapaId] = data.candidates[0].content.parts[0].text;
            await new Promise(r => setTimeout(r, 4000));

        } catch (error) {
            jobs[jobId].progress[etapaId] = `### FALLA TÉCNICA\n${error.message}`;
        }
    }
    jobs[jobId].status = 'done';
}

app.post('/generate-pdf', async (req, res) => {
    const { html } = req.body;
    let browser;
    try {
        browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();
        res.contentType("application/pdf").send(pdf);
    } catch (e) {
        if(browser) await browser.close();
        res.status(500).send("Error PDF");
    }
});

app.listen(port, "0.0.0.0", () => console.log(`PREDICTACORE TITÁN RESTAURADO`));
