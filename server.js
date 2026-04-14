// server.js - RESTAURACIÓN TOTAL AL MODELO 2.5 (MOTOR ORIGINAL)
const express = require('express');
const cerebroWeb = require('./cerebro');           
const cerebroSocial = require('./cerebro_social'); 
const { PROMPTS_LITE } = require('./cerebro_lite');
const { getHTML } = require('./visual'); 
const { getHTMLLite } = require('./visual_lite');
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

// RUTAS QUE SABEMOS QUE FUNCIONAN
app.post('/start-lite', async (req, res) => {
    iniciarAuditoria(req.body.dna, req.body.email, 'lite');
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
    ejecutarAuditoriaFondo(targetUrl, jobId, modo).catch(e => console.error("!!! ERROR:", e));
}

async function ejecutarAuditoriaFondo(targetUrl, jobId, modo) {
    try {
        let datosTarget = await captureAndScrape(targetUrl);
        const cerebroActivo = targetUrl.includes('instagram.com') ? cerebroSocial : cerebroWeb;
        const promptsAUsar = (modo === 'lite') ? PROMPTS_LITE : cerebroActivo.PROMPTS;

        const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
        const auth = new GoogleAuth({ credentials: credenciales, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        
        // REGRESO AL MODELO 2.5 (URL ORIGINAL)
        const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-2.5-pro:generateContent`;

        for (const etapaId in promptsAUsar) {
            const promptFinal = promptsAUsar[etapaId](datosTarget.texto);
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
            }
            await new Promise(r => setTimeout(r, 2000));
        }
        jobs[jobId].status = 'done';
        await enviarReportePorCorreo(jobId, jobs[jobId].email, targetUrl, modo);
    } catch (error) { console.error("!!! FALLO MOTOR:", error); }
}

async function enviarReportePorCorreo(jobId, emailDestino, targetUrl, modo) {
    let browser;
    try {
        const job = jobs[jobId];
        let htmlBase = (modo === 'lite') ? getHTMLLite() : getHTML();
        browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlBase, { waitUntil: 'networkidle0' });
        await page.evaluate((progressData, dominio) => {
            const reporte = document.getElementById('reporte');
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
            attachments: [{ filename: `PredictaCore.pdf`, content: pdfBuffer }]
        });
    } catch (e) { if(browser) await browser.close(); }
}

app.listen(port, "0.0.0.0", () => console.log(`MOTOR 2.5 ONLINE - SIN CAMBIOS NO SOLICITADOS`));
