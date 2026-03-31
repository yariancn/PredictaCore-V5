// server.js - BÚNKER 15: SINCRONIZACIÓN DE LLAVES Y MOTOR SDK TITÁN
const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai'); 
const cerebroWeb = require('./cerebro');           
const cerebroSocial = require('./cerebro_social'); 
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor'); 
const { FIREWALL_IA } = require('./firewall');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json({ limit: '10mb' }));
const jobs = {}; 

app.get('/', (req, res) => res.send(getHTML()));

app.post('/start', async (req, res) => {
    const { dna } = req.body;
    if (!dna) return res.status(400).json({ error: "Falta DNA" });
    const jobId = `job_${Date.now()}`; 
    jobs[jobId] = { status: 'running', progress: {}, currentEtapa: 'INICIANDO', url: dna.trim() };
    
    ejecutarAuditoriaFondo(dna.trim(), jobId).catch(e => {
        console.error("Fallo crítico en fondo:", e);
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
    
    // 1. Scrapeo Forense
    let datosTarget = await captureAndScrape(targetUrl);

    // 2. Cerebro
    const isSocialMedia = targetUrl.includes('instagram.com') || targetUrl.includes('facebook.com') || targetUrl.includes('tiktok.com');
    const cerebro = isSocialMedia ? cerebroSocial : cerebroWeb;

    // 3. --- INICIALIZACIÓN BLINDADA (EL FIX) ---
    const creds = JSON.parse(process.env.GOOGLE_CREDS);
    
    const vertexAI = new VertexAI({ 
        project: creds.project_id, 
        location: 'us-central1',
        googleAuthOptions: {
            credentials: creds // Esto inyecta las llaves directamente sin buscar archivos
        }
    });

    const model = vertexAI.getGenerativeModel({
        model: 'gemini-1.5-pro-002',
        systemInstruction: FIREWALL_IA,
        generationConfig: { temperature: 0.15 }
    });

    for (const etapaId of ETAPAS) {
        jobs[jobId].currentEtapa = etapaId;
        try {
            const promptFinal = cerebro.PROMPTS[etapaId](datosTarget.texto);
            let msgParts = [
                { text: cerebro.IDIOMA },
                { text: cerebro.REGLA_NUCLEAR },
                { text: `DOSSIER:\n${datosTarget.texto}` }
            ];

            if (datosTarget.desktopBase64) {
                msgParts.push({ inlineData: { mimeType: "image/jpeg", data: datosTarget.desktopBase64 } });
                msgParts.push({ inlineData: { mimeType: "image/jpeg", data: datosTarget.mobileBase64 } });
            }
            msgParts.push({ text: promptFinal });

            const request = { contents: [{ role: 'user', parts: msgParts }] };
            
            if (etapaId === 'VISIBILIDAD' || etapaId === 'BENCHMARK') {
                request.tools = [{ googleSearch: {} }];
            }

            const result = await model.generateContent(request);
            const response = await result.response;
            jobs[jobId].progress[etapaId] = response.candidates[0].content.parts[0].text;

            await new Promise(r => setTimeout(r, 5000)); 
        } catch (error) {
            console.error(`[-] Error en etapa ${etapaId}:`, error.message);
            jobs[jobId].progress[etapaId] = `### FALLA TÉCNICA\n${error.message}`;
            await new Promise(r => setTimeout(r, 8000));
        }
    }
    jobs[jobId].status = 'done';
}

app.post('/generate-pdf', async (req, res) => {
    const { html } = req.body;
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: "new", 
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();
        res.contentType("application/pdf").send(pdf);
    } catch (e) {
        if(browser) await browser.close();
        res.status(500).send("Error en Cristalización");
    }
});

app.listen(port, "0.0.0.0", () => console.log(`PREDICTACORE TITÁN OPERATIVO EN RAILWAY (SDK STABLE)`));
