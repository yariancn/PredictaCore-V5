// server.js - BÚNKER 7 RESTAURADO (FASE 3: CEREBRO LITE Y RESEND SMTP)
const express = require('express');
const cerebroWeb = require('./cerebro');           
const cerebroSocial = require('./cerebro_social'); 
const { PROMPTS_LITE } = require('./cerebro_lite'); // NUEVO: Importación del Cerebro Lite
const { getHTML } = require('./visual'); 
const { getLandingHTML } = require('./landing'); 
const { captureAndScrape } = require('./motor'); 
const { FIREWALL_IA } = require('./firewall');
const { GoogleAuth } = require('google-auth-library');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer'); 

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json({ limit: '10mb' }));

// CONFIGURACIÓN DE CORREO PROFESIONAL (RESEND)
const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 2525,
    secure: true,
    auth: {
        user: 'resend', // Resend usa la palabra "resend" como usuario por defecto
        pass: process.env.RESEND_API_KEY // Aquí irá tu llave secreta de Resend en Railway
    }
});

const jobs = {}; 
const dossierCache = {};
const ETAPAS_ORDEN = ['INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK', 'SWOT', 'WISHLIST', 'FUGAS', 'ACCIONES', 'HERRAMIENTAS', 'OMNI'];

app.get('/', (req, res) => res.send(getLandingHTML()));

app.post('/start-lite', async (req, res) => {
    const { dna, email } = req.body;
    let targetUrl = dna.trim();
    if (!targetUrl.startsWith('http') && targetUrl.includes('.')) targetUrl = `https://${targetUrl}`;
    
    const jobId = targetUrl + '-' + Date.now(); 
    jobs[jobId] = { status: 'running', progress: {}, email: email, type: 'lite' };
    
    ejecutarAuditoriaFondo(targetUrl, jobId, true).catch(e => {
        console.error("Fallo crítico en Auditoría Lite:", e);
        if(jobs[jobId]) jobs[jobId].status = 'error';
    });
    
    res.json({ status: 'started', jobId: jobId, message: 'Auditoría en proceso' });
});

app.post('/start', async (req, res) => {
    const { dna } = req.body;
    let targetUrl = dna.trim();
    if (!targetUrl.startsWith('http') && targetUrl.includes('.')) targetUrl = `https://${targetUrl}`;
    
    const jobId = targetUrl; 
    jobs[jobId] = { status: 'running', progress: {}, currentEtapa: 'INICIANDO' };
    
    ejecutarAuditoriaFondo(targetUrl, jobId, false).catch(e => {
        console.error("Fallo crítico:", e);
        if(jobs[jobId]) jobs[jobId].status = 'error';
    });
    
    res.json({ jobId });
});

app.get('/poll', (req, res) => {
    const jobId = req.query.jobId;
    if (!jobs[jobId]) return res.json({ status: 'not_found' });
    res.json(jobs[jobId]);
});

async function ejecutarAuditoriaFondo(targetUrl, jobId, isLite = false) {
    let datosTarget = await captureAndScrape(targetUrl);

    const isSocialMedia = targetUrl.includes('instagram.com') || targetUrl.includes('facebook.com') || targetUrl.includes('tiktok.com');
    const cerebroActivo = isSocialMedia ? cerebroSocial : cerebroWeb;
    const { IDIOMA, REGLA_NUCLEAR } = cerebroActivo;

    const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
    const auth = new GoogleAuth({
        credentials: credenciales,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-2.5-pro:generateContent`;

    // BIFURCACIÓN DE CEREBROS
    const etapasAEjecutar = isLite ? Object.keys(PROMPTS_LITE) : ETAPAS_ORDEN;
    const PROMPTS_ACTUALES = isLite ? PROMPTS_LITE : cerebroActivo.PROMPTS;

    for (const etapaId of etapasAEjecutar) {
        if(jobs[jobId]) jobs[jobId].currentEtapa = etapaId;
        try {
            const promptFinal = PROMPTS_ACTUALES[etapaId](datosTarget.texto);
            let partesMensaje = [
                { text: IDIOMA }, { text: REGLA_NUCLEAR },
                { text: `CONTEXTO ESTRATÉGICO:\n${datosTarget.texto}` }
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

            if (!isLite && (etapaId === 'VISIBILIDAD' || etapaId === 'BENCHMARK')) payload.tools = [{ googleSearch: {} }];

            const vertexRes = await fetch(vertexUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenResponse.token}` },
                body: JSON.stringify(payload)
            });

            const vertexData = await vertexRes.json();
            jobs[jobId].progress[etapaId] = vertexData.candidates[0].content.parts[0].text;
            await new Promise(r => setTimeout(r, 3500));

        } catch (error) {
            jobs[jobId].progress[etapaId] = `### FALLA TÉCNICA\n${error.message}`;
        }
    }
    jobs[jobId].status = 'done';

    if (isLite) {
        await enviarReportePorCorreo(jobId, jobs[jobId].email, targetUrl);
    }
}

async function enviarReportePorCorreo(jobId, emailDestino, targetUrl) {
    console.log(`>>> Cristalizando PDF forense para: ${emailDestino}`);
    try {
        const job = jobs[jobId];
        const htmlBase = getHTML(); 
        
        const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlBase, { waitUntil: 'networkidle0' });

        // Inyectamos la información cruda en el molde visual para generar el PDF
        await page.evaluate((progressData, dominio) => {
            const reporte = document.getElementById('reporte');
            reporte.innerHTML = '';
            document.getElementById('pdf-domain').innerText = 'Analysis: ' + dominio;
            
            for (const key in progressData) {
                const seccion = document.createElement('div');
                seccion.className = 'report-section';
                let htmlGenerado = marked.parse(progressData[key]);
                seccion.innerHTML = '<div class="markdown-content" style="color: #0f172a !important;">' + htmlGenerado + '</div>';
                reporte.appendChild(seccion);
            }
        }, job.progress, targetUrl);

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        const mailOptions = {
            from: '"PredictaCore Titán" <reportes@predictacore.ai>',
            to: emailDestino,
            subject: 'Tu Auditoría Forense PredictaCore (Lite)',
            text: 'Adjunto encontrarás la radiografía de conversión de tu activo digital. Ábrelo en un ordenador para su correcta visualización.',
            attachments: [
                {
                    filename: 'PREDICTACORE_LITE.pdf',
                    content: pdfBuffer
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log(`>>> Sellado. Reporte entregado con éxito a ${emailDestino}.`);
    } catch (error) {
        console.error(">>> Error crítico al ensamblar o enviar correo:", error);
    }
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
        res.status(500).send("Fallo PDF");
    }
});

app.listen(port, "0.0.0.0", () => console.log(`PREDICTACORE TITÁN EN VIVO - MOTOR DE CORREO ACTIVADO`));
