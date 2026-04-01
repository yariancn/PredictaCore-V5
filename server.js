// server.js - BÚNKER 25.3: SINCRONIZACIÓN DE RUTAS MINÚSCULAS
const express = require('express');
const cerebroWeb = require('./cerebro');           
const cerebroSocial = require('./cerebro_social'); 
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor'); 
const { FIREWALL_IA } = require('./firewall');
const { GoogleAuth } = require('google-auth-library');
const puppeteer = require('puppeteer');

// --- RUTAS CORREGIDAS SEGÚN TU GITHUB (TODO MINÚSCULAS) ---
const { PROMPTS_MEJORADOS } = require('./cerebro_tactico');
const { CONTEXTOS } = require('./guia_ejecutiva');
const { CSS_TITAN } = require('./estilos_titan');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json({ limit: '50mb' }));

const jobs = {}; 
const ETAPAS_ORDEN = ['INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK', 'SWOT', 'WISHLIST', 'FUGAS', 'ACCIONES', 'HERRAMIENTAS', 'OMNI'];

app.get('/', (req, res) => res.send(getHTML()));

app.post('/start', async (req, res) => {
    const { dna } = req.body;
    if (!dna) return res.status(400).json({ error: "Falta DNA" });
    
    let targetUrl = dna.trim();
    if (!targetUrl.startsWith('http') && targetUrl.includes('.')) targetUrl = `https://${targetUrl}`;
    
    const jobId = `job_${Date.now()}`; 
    jobs[jobId] = { status: 'running', progress: {}, currentEtapa: 'INICIANDO', url: targetUrl };
    
    ejecutarAuditoriaFondo(targetUrl, jobId).catch(e => {
        console.error("[-] Fallo crítico:", e);
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

    const isSocialMedia = targetUrl.includes('instagram.com') || targetUrl.includes('facebook.com');
    const cerebroActivo = isSocialMedia ? cerebroSocial : cerebroWeb;
    const { PROMPTS, IDIOMA, REGLA_NUCLEAR } = cerebroActivo;

    const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
    const auth = new GoogleAuth({
        credentials: credenciales,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-2.5-pro:generateContent`;

    for (const etapaId of ETAPAS_ORDEN) {
        jobs[jobId].currentEtapa = etapaId;
        try {
            let promptFinal;
            // Se activan las mejoras tácticas de visión y búsqueda
            if (etapaId === 'BENCHMARK') {
                promptFinal = PROMPTS_MEJORADOS.BENCHMARK_PRO(targetUrl, datosTarget.texto);
            } else if (etapaId === 'FUGAS') {
                promptFinal = PROMPTS_MEJORADOS.FUGAS_PRO(datosTarget.texto);
            } else {
                promptFinal = PROMPTS[etapaId](datosTarget.texto);
            }

            let partesMensaje = [
                { text: IDIOMA }, 
                { text: REGLA_NUCLEAR },
                { text: `DOSSIER FORENSE:\n${datosTarget.texto}` }
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

            if (etapaId === 'VISIBILIDAD' || etapaId === 'BENCHMARK') {
                payload.tools = [{ googleSearch: {} }];
            }

            const vertexRes = await fetch(vertexUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenResponse.token}` },
                body: JSON.stringify(payload)
            });

            const vertexData = await vertexRes.json();
            jobs[jobId].progress[etapaId] = vertexData.candidates[0].content.parts[0].text;
            
            await new Promise(r => setTimeout(r, 4000));

        } catch (error) {
            jobs[jobId].progress[etapaId] = `### FALLA EN NODO\n${error.message}`;
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

        let htmlFinal = html;
        for (const [etapa, explicacion] of Object.entries(CONTEXTOS)) {
            const regex = new RegExp(`(### .+)`, 'g');
            htmlFinal = htmlFinal.replace(regex, `$1\n<div class="capsula-contexto">${explicacion}</div>`);
        }

        const htmlConEstilos = htmlFinal.replace('</head>', `${CSS_TITAN}</head>`);
        
        await page.setContent(htmlConEstilos, { waitUntil: 'networkidle0' });
        
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '1.5cm', bottom: '1.5cm', left: '1.2cm', right: '1.2cm' }
        });
        
        await browser.close();
        res.contentType("application/pdf").send(pdf);
    } catch (e) {
        if(browser) await browser.close();
        res.status(500).send("Fallo en la cristalización del reporte.");
    }
});

app.listen(port, "0.0.0.0", () => console.log(`PREDICTACORE TITÁN: BÚNKER 25 OPERATIVO`));
