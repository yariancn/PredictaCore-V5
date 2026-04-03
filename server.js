// server.js - BÚNKER 7 RESTAURADO (SIN FILTROS NI REDUNDANCIAS)
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
const dossierCache = {};
const ETAPAS_ORDEN = ['INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK', 'SWOT', 'WISHLIST', 'FUGAS', 'ACCIONES', 'HERRAMIENTAS', 'OMNI'];

app.get('/', (req, res) => res.send(getHTML()));

app.post('/start', async (req, res) => {
    const { dna } = req.body;
    let targetUrl = dna.trim();
    if (!targetUrl.startsWith('http') && targetUrl.includes('.')) targetUrl = `https://${targetUrl}`;
    
    const jobId = targetUrl; 
    jobs[jobId] = { status: 'running', progress: {}, currentEtapa: 'INICIANDO' };
    
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
    let datosTarget = await captureAndScrape(targetUrl);

    const isSocialMedia = targetUrl.includes('instagram.com') || targetUrl.includes('facebook.com') || targetUrl.includes('tiktok.com');
    const cerebroActivo = isSocialMedia ? cerebroSocial : cerebroWeb;
    const { PROMPTS, IDIOMA, REGLA_NUCLEAR } = cerebroActivo;

    const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
    const auth = new GoogleAuth({
        credentials: credenciales,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    // RECTIFICACIÓN: Endpoint estable para Gemini 2.5 Pro en Vertex
    const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-2.5-pro:generateContent`;

    for (const etapaId of ETAPAS_ORDEN) {
        jobs[jobId].currentEtapa = etapaId;
        try {
            const promptFinal = PROMPTS[etapaId](datosTarget.texto);
            let partesMensaje = [
                { text: IDIOMA }, { text: REGLA_NUCLEAR },
                { text: `CONTEXTO ESTRATÉGICO:\n${datosTarget.texto}` }
            ];

            if (datosTarget.isUrl && datosTarget.desktopBase64 && datosTarget.mobileBase64) {
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

            const vertexRes = await fetch(vertexUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenResponse.token}` },
                body: JSON.stringify(payload)
            });

            const vertexData = await vertexRes.json();
            jobs[jobId].progress[etapaId] = vertexData.candidates[0].content.parts[0].text;
            await new Promise(r => setTimeout(r, 3500));

        } catch (error) {
            // ELIMINADA LA REDUNDANCIA: Regresamos a la verdad forense
            jobs[jobId].progress[etapaId] = `### FALLA TÉCNICA\n${error.message}`;
        }
    }
    jobs[jobId].status = 'done';
}

app.post('/generate-pdf', async (req, res) => {
    const { html } = req.body;
    let browser;
    try {
        browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();
        res.contentType("application/pdf").send(pdf);
    } catch (e) {
        if(browser) await browser.close();
        res.status(500).send("Fallo PDF");
    }
});

app.listen(port, "0.0.0.0", () => console.log(`PREDICTACORE TITÁN RESTAURADO`));
