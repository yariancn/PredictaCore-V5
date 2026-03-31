// server.js - BÚNKER 11: RECTIFICACIÓN DE RUTA Y ESCALA SEGURA

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
    
    // ID único para cada auditoría para permitir simultaneidad
    const jobId = `job_${Date.now()}`; 
    jobs[jobId] = { status: 'running', progress: {}, currentEtapa: 'INICIANDO', url: targetUrl };
    
    ejecutarAuditoriaFondo(targetUrl, jobId).catch(e => {
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

async function ejecutarAuditoriaFondo(targetUrl, jobId) {
    const ETAPAS = ['INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK', 'SWOT', 'WISHLIST', 'FUGAS', 'ACCIONES', 'HERRAMIENTAS', 'OMNI'];
    
    let datosTarget = { isUrl: false, texto: "", desktopBase64: null, mobileBase64: null };
    if (/\.(com|net|es|org|mx|info|biz|online|store|shop)/i.test(targetUrl) || targetUrl.startsWith('http')) {
        datosTarget = await captureAndScrape(targetUrl);
    } else {
        datosTarget.texto = targetUrl;
    }

    const isSocialMedia = targetUrl.includes('instagram.com') || targetUrl.includes('facebook.com') || targetUrl.includes('tiktok.com');
    const cerebro = isSocialMedia ? cerebroSocial : cerebroWeb;

    // --- EXTRACCIÓN DINÁMICA DE CREDENCIALES ---
    const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
    const auth = new GoogleAuth({ credentials: credenciales, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    
    // Usamos el project_id real que viene en tu JSON para evitar el 404
    const projectId = credenciales.project_id;
    const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-1.5-pro:generateContent`;

    for (const etapaId of ETAPAS) {
        jobs[jobId].currentEtapa = etapaId;
        try {
            const promptFinal = cerebro.PROMPTS[etapaId](datosTarget.texto);
            let partes = [
                { text: cerebro.IDIOMA }, { text: cerebro.REGLA_NUCLEAR },
                { text: `URL ANALIZADA: ${targetUrl} | DOSSIER: ${datosTarget.texto}` }
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

            const vertexRes = await fetch(vertexUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenResponse.token}` },
                body: JSON.stringify(payload)
            });

            if (!vertexRes.ok) {
                const errorText = await vertexRes.text();
                throw new Error(errorText);
            }

            const vertexData = await vertexRes.json();
            jobs[jobId].progress[etapaId] = vertexData.candidates[0].content.parts[0].text;

            // Retraso de 4 segundos entre etapas para no saturar la cuota
            await new Promise(r => setTimeout(r, 4000));
            
        } catch (error) {
            console.error(`[-] Error en ${etapaId}:`, error.message);
            jobs[jobId].progress[etapaId] = `### FALLA TÉCNICA\nDetalle: ${error.message}`;
            // Espera extra si hubo error para "enfriar" la conexión
            await new Promise(r => setTimeout(r, 6000));
        }
    }
    jobs[jobId].status = 'done'; 
}

app.listen(port, "0.0.0.0", () => console.log(`PREDICTACORE TITÁN ACTIVO EN ${port}`));
