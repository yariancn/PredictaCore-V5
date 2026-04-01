// server.js - BÚNKER 22: RECTIFICACIÓN LÍNEA POR LÍNEA (2.5 PRO)
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

// Aumentamos el límite para que las capturas de pantalla no bloqueen el servidor
app.use(express.json({ limit: '50mb' }));

const jobs = {}; 

app.get('/', (req, res) => res.send(getHTML()));

app.post('/start', async (req, res) => {
    const { dna } = req.body;
    if (!dna) return res.status(400).json({ error: "Falta DNA" });
    const jobId = `job_${Date.now()}`; 
    jobs[jobId] = { status: 'running', progress: {}, currentEtapa: 'INICIANDO', url: dna.trim() };
    
    ejecutarAuditoriaFondo(dna.trim(), jobId).catch(e => {
        console.error("[-] Error en Búnker 22:", e.message);
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
    
    // 1. Scraping Multimodal (Ojos del Titán)
    let datosTarget = await captureAndScrape(targetUrl);

    // 2. Selección de Cerebro Estratégico
    const isSocialMedia = targetUrl.includes('instagram.com') || targetUrl.includes('facebook.com');
    const cerebro = isSocialMedia ? cerebroSocial : cerebroWeb;

    // 3. Motor de Élite: Gemini 2.5 Pro
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-pro", 
        systemInstruction: FIREWALL_IA
    });

    for (const etapaId of ETAPAS) {
        jobs[jobId].currentEtapa = etapaId;
        try {
            const promptFinal = cerebro.PROMPTS[etapaId](datosTarget.texto);
            
            // Construcción del Mensaje Forense
            let msgParts = [
                { text: `SISTEMA_IDIOMA: ${cerebro.IDIOMA}` },
                { text: `REGLA_NUCLEAR: ${cerebro.REGLA_NUCLEAR}` },
                { text: `DOSSIER_AUDITORIA: ${datosTarget.texto}` }
            ];

            // Inyección de Visión (Desktop + Mobile) con calidad optimizada
            if (datosTarget.desktopBase64 && datosTarget.mobileBase64) {
                msgParts.push({ inlineData: { data: datosTarget.desktopBase64, mimeType: "image/jpeg" } });
                msgParts.push({ inlineData: { data: datosTarget.mobileBase64, mimeType: "image/jpeg" } });
            }

            msgParts.push({ text: promptFinal });

            // Herramientas de búsqueda solo para etapas específicas
            const tools = (etapaId === 'VISIBILIDAD' || etapaId === 'BENCHMARK') 
                ? [{ googleSearchRetrieval: {} }] 
                : [];

            const result = await model.generateContent({
                contents: [{ role: 'user', parts: msgParts }],
                generationConfig: { temperature: 0.15 },
                tools: tools,
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ]
            });

            const response = await result.response;
            const text = response.text();

            if (!text) throw new Error("IA_SILENT_ERROR");

            jobs[jobId].progress[etapaId] = text;
            
            // Pausa estratégica de 4.5s para blindar la cuota de la API
            await new Promise(r => setTimeout(r, 4500)); 

        } catch (error) {
            console.error(`[-] Fallo en ${etapaId}:`, error.message);
            // Reintento de seguridad sin herramientas de búsqueda si estas fallan
            try {
                const retry = await model.generateContent([{ text: cerebro.PROMPTS[etapaId](datosTarget.texto) }]);
                jobs[jobId].progress[etapaId] = retry.response.text();
            } catch (e2) {
                jobs[jobId].progress[etapaId] = `### ERROR FORENSE\nFallo en el nodo ${etapaId}. Detalle técnico: ${error.message}`;
            }
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
        res.status(500).send("Fallo en cristalización PDF.");
    }
});

// El servidor debe escuchar en 0.0.0.0 para que Railway lo detecte como vivo
app.listen(port, "0.0.0.0", () => {
    console.log(`TITÁN BÚNKER 22: MOTOR 2.5 PRO DESPLEGADO EN PUERTO ${port}`);
});
