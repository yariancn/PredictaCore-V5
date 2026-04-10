// server.js - MOTOR UNIFICADO (ESTRUCTURA DE PETICIÓN LITE PARA TODO EL SISTEMA)
const express = require('express');
const cerebroWeb = require('./cerebro');           
const cerebroSocial = require('./cerebro_social'); 
const { PROMPTS_LITE } = require('./cerebro_lite');
const { PROMPTS_OMNI } = require('./cerebro_omni'); 
const { getHTML } = require('./visual'); 
const { getHTMLLite } = require('./visual_lite');
const { getHTMLOmni } = require('./visual_omni'); 
const { getLandingHTML } = require('./landing'); 
const { captureAndScrape } = require('./motor'); 
const { FIREWALL_IA } = require('./firewall');
const { GoogleAuth } = require('google-auth-library');
const puppeteer = require('puppeteer');
const { Resend } = require('resend');
const marked = require('marked');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json({ limit: '10mb' }));

const resend = new Resend(process.env.RESEND_API_KEY);
const jobs = {}; 

app.get('/', (req, res) => res.send(getLandingHTML()));

app.post('/start-lite', async (req, res) => {
    iniciarAuditoria(req.body.dna, req.body.email, 'lite');
    res.json({ status: 'started' });
});

app.post('/start-omni', async (req, res) => {
    iniciarAuditoria(req.body.dna, req.body.email, 'omni');
    res.json({ status: 'started' });
});

app.post('/start', async (req, res) => {
    iniciarAuditoria(req.body.dna, req.body.email, 'titan');
    res.json({ status: 'started' });
});

async function iniciarAuditoria(dna, email, modo) {
    let targetUrl = dna.trim();
    if (!targetUrl.startsWith('http') && targetUrl.includes('.')) targetUrl = `https://${targetUrl}`;
    const jobId = `${modo}-${Date.now()}`; 
    jobs[jobId] = { status: 'running', progress: {}, email: email, modo: modo };
    console.log(`>>> Lanzando Auditoría [${modo.toUpperCase()}]: ${targetUrl}`);
    ejecutarAuditoriaFondo(targetUrl, jobId, modo).catch(e => console.error("!!! ERROR:", e));
}

async function ejecutarAuditoriaFondo(targetUrl, jobId, modo) {
    try {
        let datosTarget = await captureAndScrape(targetUrl);
        const cerebroActivo = targetUrl.includes('instagram.com') ? cerebroSocial : cerebroWeb;
        
        let promptsAUsar;
        if (modo === 'lite') promptsAUsar = PROMPTS_LITE;
        else if (modo === 'omni') promptsAUsar = PROMPTS_OMNI;
        else promptsAUsar = cerebroActivo.PROMPTS;

        const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
        const auth = new GoogleAuth({ credentials: credenciales, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        
        // URL ORIGINAL (La que sí te funciona)
        const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-1.5-pro:generateContent`;

        for (const etapaId in promptsAUsar) {
            console.log(`> Generando sección: ${etapaId}`);
            const promptFinal = promptsAUsar[etapaId](datosTarget.texto);
            
            // PAYLOAD CORREGIDO: Eliminamos systemInstruction y usamos la estructura plana del Lite
            const payload = {
                contents: [{ 
                    role: "user", 
                    parts: [
                        { text: FIREWALL_IA },
                        { text: cerebroActivo.IDIOMA }, 
                        { text: cerebroActivo.REGLA_NUCLEAR },
                        { text: `CONTEXTO:\n${datosTarget.texto}` }, 
                        { text: promptFinal }
                    ]
                }],
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ],
                generationConfig: { temperature: 0.15, maxOutputTokens: 2500 } 
            };

            const vertexRes = await fetch(vertexUrl, { 
                method: "POST", 
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenResponse.token}` }, 
                body: JSON.stringify(payload) 
            });

            const vertexData = await vertexRes.json();
            if (vertexData.candidates && vertexData.candidates[0].content) {
                jobs[jobId].progress[etapaId] = vertexData.candidates[0].content.parts[0].text;
            } else {
                console.error(`Error en ${etapaId}:`, JSON.stringify(vertexData));
                jobs[jobId].progress[etapaId] = "### ANÁLISIS NO DISPONIBLE";
            }
            await new Promise(r => setTimeout(r, 2000));
        }

        jobs[jobId].status = 'done';
        await enviarReportePorCorreo(jobId, jobs[jobId].email, targetUrl, modo);
    } catch (error) {
        console.error("!!! FALLO MOTOR:", error);
    }
}

async function enviarReportePorCorreo(jobId, emailDestino, targetUrl, modo) {
    let browser;
    try {
        const job = jobs[jobId];
        let htmlBase = (modo === 'lite') ? getHTMLLite() : (modo === 'omni' ? getHTMLOmni() : getHTML());

        browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlBase, { waitUntil: 'networkidle0' });

        await page.evaluate((progressData, dominio) => {
            const reporte = document.getElementById('reporte');
            const dEl = document.getElementById('pdf-domain');
            if(dEl) dEl.innerText = 'Analysis: ' + dominio;
            for (const key in progressData) {
                const div = document.createElement('div');
                div.className = 'report-section';
                div.innerHTML = marked.parse(progressData[key]);
                reporte.appendChild(div);
            }
        }, job.progress, targetUrl);

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        await resend.emails.send({
            from: 'PredictaCore <reportes@predictacore.ai>',
            to: emailDestino,
            subject: `PredictaCore Audit - ${modo.toUpperCase()}`,
            attachments: [{ filename: `PredictaCore_${modo.toUpperCase()}.pdf`, content: pdfBuffer }]
        });
        console.log(`>>> REPORTE ${modo.toUpperCase()} ENVIADO`);
    } catch (e) { if(browser) await browser.close(); console.error(e); }
}

app.listen(port, "0.0.0.0", () => console.log(`MOTOR UNIFICADO ONLINE`));
