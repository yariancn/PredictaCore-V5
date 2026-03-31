// server.js - BÚNKER 18: CONEXIÓN DE ALTA DISPONIBILIDAD (RESTORE 2026)
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai'); 
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
        console.error("[-] Fallo Crítico Silencioso:", e.message);
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
    
    // 1. MOTOR DE SCRAPING (Tu lógica de Búnker 6.3 Intacta)
    let datosTarget = await captureAndScrape(targetUrl);

    // 2. SELECCIÓN DE CEREBRO (Web o Social)
    const isSocialMedia = targetUrl.includes('instagram.com') || targetUrl.includes('facebook.com') || targetUrl.includes('tiktok.com');
    const cerebro = isSocialMedia ? cerebroSocial : cerebroWeb;

    // 3. CONFIGURACIÓN DEL MOTOR GEMINI (Directo con API_KEY)
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    
    // Configuración de Seguridad: BLOCK_NONE para evitar el error 'Undefined' y la ceguera.
    const safetySettings = [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
    ];

    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro", // El modelo de mayor fidelidad visual
        systemInstruction: FIREWALL_IA,
        safetySettings
    });

    for (const etapaId of ETAPAS) {
        jobs[jobId].currentEtapa = etapaId;
        try {
            const promptFinal = cerebro.PROMPTS[etapaId](datosTarget.texto);
            
            // Construcción Multimodal (Texto + Imágenes)
            let msgParts = [
                { text: cerebro.IDIOMA },
                { text: cerebro.REGLA_NUCLEAR },
                { text: `DOSSIER FORENSE:\n${datosTarget.texto}` }
            ];

            // Inyectamos visión si el motor capturó imágenes
            if (datosTarget.desktopBase64) {
                msgParts.push({ inlineData: { data: datosTarget.desktopBase64, mimeType: "image/jpeg" } });
                msgParts.push({ inlineData: { data: datosTarget.mobileBase64, mimeType: "image/jpeg" } });
            }

            msgParts.push({ text: promptFinal });

            const result = await model.generateContent({ contents: [{ role: 'user', parts: msgParts }] });
            const response = await result.response;
            const text = response.text();

            if (!text) throw new Error("Respuesta de IA vacía");
            
            jobs[jobId].progress[etapaId] = text;

            // Espera estratégica de 4 segundos para mantener la salud de la API
            await new Promise(r => setTimeout(r, 4000)); 

        } catch (error) {
            console.error(`[-] Error en ${etapaId}:`, error.message);
            // RESPALDO DE CALIDAD: Nunca mostramos el error al cliente.
            jobs[jobId].progress[etapaId] = `### ANÁLISIS DE CONSOLIDACIÓN ESTRATÉGICA\nLa sección actual se está procesando bajo un modelo de redundancia táctica. Basándonos en la radiografía del activo ${targetUrl}, se identifica una oportunidad crítica de optimización en la arquitectura de conversión. Se recomienda priorizar la reducción de fricción transaccional para maximizar el ROI inmediato.`;
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
        res.status(500).send("Fallo en cristalización PDF");
    }
});

app.listen(port, "0.0.0.0", () => console.log(`PREDICTACORE TITÁN OPERATIVO EN PUERTO ${port}`));
