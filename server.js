// server.js - BÚNKER 20: RESTAURACIÓN DE VISIÓN ABSOLUTA
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai'); 
const cerebroWeb = require('./cerebro');           
const cerebroSocial = require('./cerebro_social'); 
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor'); 
const { FIREWALL_IA } = require('./firewall');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json({ limit: '30mb' })); // Espacio de sobra para capturas 4K

const jobs = {}; 

app.get('/', (req, res) => res.send(getHTML()));

app.post('/start', async (req, res) => {
    const { dna } = req.body;
    if (!dna) return res.status(400).json({ error: "Falta DNA" });
    const jobId = `job_${Date.now()}`; 
    jobs[jobId] = { status: 'running', progress: {}, currentEtapa: 'INICIANDO', url: dna.trim() };
    
    ejecutarAuditoriaFondo(dna.trim(), jobId).catch(e => {
        console.error("[-] Error Crítico:", e.message);
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
    
    // 1. SCRAPING (Motor intacto de 9,000 simulaciones)
    let datosTarget = await captureAndScrape(targetUrl);

    // 2. SELECCIÓN DE CEREBRO
    const isSocialMedia = targetUrl.includes('instagram.com') || targetUrl.includes('facebook.com') || targetUrl.includes('tiktok.com');
    const cerebro = isSocialMedia ? cerebroSocial : cerebroWeb;

    // 3. INICIALIZACIÓN DE MOTOR DE ÉLITE
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    
    // Usamos Gemini 1.5 Pro: El único capaz de diseccionar UX/UI con precisión forense
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        systemInstruction: FIREWALL_IA
    });

    for (const etapaId of ETAPAS) {
        jobs[jobId].currentEtapa = etapaId;
        try {
            const promptFinal = cerebro.PROMPTS[etapaId](datosTarget.texto);
            
            // CONSTRUCCIÓN DEL PAQUETE MULTIMODAL
            let msgParts = [
                { text: `ID_IDIOMA: ${cerebro.IDIOMA}` },
                { text: `REGLA_NUCLEAR: ${cerebro.REGLA_NUCLEAR}` },
                { text: `DOSSIER_ACTIVO: ${datosTarget.texto}` }
            ];

            // INYECTAMOS VISIÓN (Desktop + Mobile)
            if (datosTarget.desktopBase64 && datosTarget.mobileBase64) {
                msgParts.push({ inlineData: { data: datosTarget.desktopBase64, mimeType: "image/jpeg" } });
                msgParts.push({ inlineData: { data: datosTarget.mobileBase64, mimeType: "image/jpeg" } });
            }

            msgParts.push({ text: promptFinal });

            // CONFIGURACIÓN DE GENERACIÓN
            const config = {
                temperature: 0.15,
                topP: 0.8,
                topK: 40
            };

            // FIX DE HERRAMIENTAS: El SDK de Google usa una sintaxis distinta a Vertex
            const tools = (etapaId === 'VISIBILIDAD' || etapaId === 'BENCHMARK') 
                ? [{ googleSearchRetrieval: {} }] 
                : [];

            const result = await model.generateContent({
                contents: [{ role: 'user', parts: msgParts }],
                generationConfig: config,
                tools: tools
            });

            const response = await result.response;
            const text = response.text();

            if (!text) throw new Error("IA_SILENT_ERROR");

            jobs[jobId].progress[etapaId] = text;
            
            // Cadencia de seguridad para evitar bloqueos por cuota
            await new Promise(r => setTimeout(r, 4500)); 

        } catch (error) {
            console.error(`[-] Fallo en etapa ${etapaId}:`, error.message);
            // RE INTENTO SIN IMÁGENES (Solo si falla la visión por peso de archivo)
            try {
                const retry = await model.generateContent([cerebro.PROMPTS[etapaId](datosTarget.texto)]);
                jobs[jobId].progress[etapaId] = retry.response.text();
            } catch (e2) {
                jobs[jobId].progress[etapaId] = `### ERROR FORENSE\nNo se pudo generar el veredicto en ${etapaId}. Motivo: ${error.message}`;
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
        res.status(500).send("Error PDF.");
    }
});

app.listen(port, "0.0.0.0", () => console.log(`TITÁN BÚNKER 20: ONLINE`));
