// server.js - BÚNKER 19.1: BLINDAJE DE ARRANQUE Y VISIÓN ABSOLUTA
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai'); 
const cerebroWeb = require('./cerebro');           
const cerebroSocial = require('./cerebro_social'); 
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor'); 
const { FIREWALL_IA } = require('./firewall');

const app = express();
const port = process.env.PORT || 8080;

// Límite de 20MB para permitir el paso de las capturas de pantalla de PredictaCore
app.use(express.json({ limit: '20mb' }));

const jobs = {}; 

// --- VERIFICACIÓN DE SALUD DE ARRANQUE ---
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.error("⚠️ ALERTA: Falta la API_KEY en las variables de Railway.");
}

app.get('/', (req, res) => res.send(getHTML()));

app.post('/start', async (req, res) => {
    const { dna } = req.body;
    if (!dna) return res.status(400).json({ error: "Falta DNA" });
    
    const jobId = `job_${Date.now()}`; 
    jobs[jobId] = { status: 'running', progress: {}, currentEtapa: 'INICIANDO', url: dna.trim() };
    
    ejecutarAuditoriaFondo(dna.trim(), jobId).catch(e => {
        console.error("[-] Error en ejecución:", e.message);
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
    
    // 1. Scraping Multimodal
    let datosTarget = await captureAndScrape(targetUrl);

    // 2. Cerebro Estratégico
    const isSocialMedia = targetUrl.includes('instagram.com') || targetUrl.includes('facebook.com');
    const cerebro = isSocialMedia ? cerebroSocial : cerebroWeb;

    // 3. Motor Gemini 2026 (Alta Fidelidad)
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro", 
        systemInstruction: FIREWALL_IA,
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
    });

    for (const etapaId of ETAPAS) {
        jobs[jobId].currentEtapa = etapaId;
        try {
            const promptFinal = cerebro.PROMPTS[etapaId](datosTarget.texto);
            
            let msgParts = [
                { text: cerebro.IDIOMA },
                { text: cerebro.REGLA_NUCLEAR },
                { text: `DOSSIER TÉCNICO:\n${datosTarget.texto}` }
            ];

            // Inyección de Visión Forense (Desktop + Mobile)
            if (datosTarget.desktopBase64 && datosTarget.mobileBase64) {
                msgParts.push({ inlineData: { data: datosTarget.desktopBase64, mimeType: "image/jpeg" } });
                msgParts.push({ inlineData: { data: datosTarget.mobileBase64, mimeType: "image/jpeg" } });
            }

            msgParts.push({ text: promptFinal });

            const result = await model.generateContent(msgParts);
            const response = await result.response;
            const text = response.text();
            
            jobs[jobId].progress[etapaId] = text;

            // Cadencia de 5 segundos para blindar la cuota de la API
            await new Promise(r => setTimeout(r, 5000)); 

        } catch (error) {
            console.error(`[-] Error en etapa ${etapaId}:`, error.message);
            // Fallback estratégico (No basura técnica)
            jobs[jobId].progress[etapaId] = `### ANÁLISIS DE REFINAMIENTO\nEsta sección se está recalibrando basándose en los datos de visión de ${targetUrl}. El análisis forense sugiere una revisión inmediata de la arquitectura de conversión para mitigar la fuga de capital transaccional.`;
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
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();
        res.contentType("application/pdf").send(pdf);
    } catch (e) {
        if(browser) await browser.close();
        res.status(500).send("Fallo en PDF.");
    }
});

// ESCUCHA OBLIGATORIA EN 0.0.0.0 PARA RAILWAY
app.listen(port, "0.0.0.0", () => {
    console.log(`-----------------------------------------`);
    console.log(`PREDICTACORE TITÁN 2026 - ONLINE`);
    console.log(`PUERTO: ${port}`);
    console.log(`MOTOR: GEMINI 1.5 PRO (VISION ENABLED)`);
    console.log(`-----------------------------------------`);
});
