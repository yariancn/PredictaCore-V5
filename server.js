// server.js - NÚCLEO RESTAURADO (TEASER + TITÁN)
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

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json({ limit: '10mb' }));

const resend = new Resend(process.env.RESEND_API_KEY);
const jobs = {}; 

app.get('/', (req, res) => res.send(getLandingHTML()));

// 1. CARRIL TEASER (EL QUE YA FUNCIONABA)
app.post('/start-lite', async (req, res) => {
    iniciarAuditoria(req.body.dna, req.body.email, true);
    res.json({ status: 'started' });
});

// 2. CARRIL TITÁN (NUEVO, USANDO LA MISMA LÓGICA)
app.post('/start', async (req, res) => {
    iniciarAuditoria(req.body.dna, req.body.email, false);
    res.json({ status: 'started' });
});

async function iniciarAuditoria(dna, email, isLite) {
    let targetUrl = dna.trim();
    if (!targetUrl.startsWith('http') && targetUrl.includes('.')) targetUrl = `https://${targetUrl}`;
    const modo = isLite ? 'LITE' : 'TITAN';
    const jobId = `${modo}-${Date.now()}`; 
    jobs[jobId] = { status: 'running', progress: {}, email: email, isLite: isLite };
    ejecutarAuditoriaFondo(targetUrl, jobId, isLite).catch(e => console.error(e));
}

async function ejecutarAuditoriaFondo(targetUrl, jobId, isLite) {
    try {
        let datosTarget = await captureAndScrape(targetUrl);
        const cerebroActivo = targetUrl.includes('instagram.com') ? cerebroSocial : cerebroWeb;
        const promptsAUsar = isLite ? PROMPTS_LITE : cerebroActivo.PROMPTS;

        const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
        const auth = new GoogleAuth({ credentials: credenciales, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        
        // URL DE GEMINI 1.5 PRO (LA QUE USABA TU TEASER CON ÉXITO)
        const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-1.5-pro:generateContent`;

        for (const etapaId in promptsAUsar) {
            const promptFinal = promptsAUsar[etapaId](datosTarget.texto);
            const payload = {
                contents: [{ role: "user", parts: [
                    { text: FIREWALL_IA },
                    { text: cerebroActivo.IDIOMA }, 
                    { text: cerebroActivo.REGLA_NUCLEAR },
                    { text: `CONTEXTO:\n${datosTarget.texto}` }, 
                    { text: promptFinal }
                ]}],
                generationConfig: { temperature: 0.15, maxOutputTokens: 2500 } 
            };

            const vertexRes = await fetch(vertexUrl, { 
                method: "POST", 
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenResponse.token}` }, 
                body: JSON.stringify(payload) 
            });

            const vertexData = await vertexRes.json();
            if (vertexData.candidates) {
                jobs[jobId].progress[etapaId] = vertexData.candidates[0].content.parts[0].text;
            }
            await new Promise(r => setTimeout(r, 2000));
        }
        await enviarReportePorCorreo(jobId, jobs[jobId].email, targetUrl, isLite);
    } catch (error) { console.error("!!! ERROR MOTOR:", error); }
}

async function enviarReportePorCorreo(jobId, emailDestino, targetUrl, isLite) {
    let browser;
    try {
        const job = jobs[jobId];
        const htmlBase = isLite ? getHTMLLite() : getHTML();
        browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlBase, { waitUntil: 'networkidle0' });

        await page.evaluate((progressData) => {
            const reporte = document.getElementById('reporte');
            for (const key in progressData) {
                const div = document.createElement('div');
                div.className = 'report-section';
                // marked.parse funcionará aquí porque tus visuales cargan el CDN
                div.innerHTML = marked.parse(progressData[key]);
                reporte.appendChild(div);
            }
        }, job.progress);

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        await resend.emails.send({
            from: 'PredictaCore <reportes@predictacore.ai>',
            to: emailDestino,
            subject: isLite ? 'Radiografía Forense PredictaCore' : 'Auditoría Titán Completa',
            attachments: [{ filename: 'PredictaCore.pdf', content: pdfBuffer }]
        });
        console.log(`>>> [EXITO] Reporte enviado.`);
    } catch (e) { if(browser) await browser.close(); console.error(e); }
}

app.listen(port, "0.0.0.0", () => console.log(`MOTOR UNIFICADO ONLINE`));
