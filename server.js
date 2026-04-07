// server.js - BÚNKER 7 RESTAURADO (FASE 2: ENRUTAMIENTO Y CORREO)
const express = require('express');
const cerebroWeb = require('./cerebro');           
const cerebroSocial = require('./cerebro_social'); 
const { getHTML } = require('./visual'); // Molde oculto para el PDF
const { getLandingHTML } = require('./landing'); // NUEVO: Fachada de Captura
const { captureAndScrape } = require('./motor'); 
const { FIREWALL_IA } = require('./firewall');
const { GoogleAuth } = require('google-auth-library');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer'); // NUEVO: Motor de envíos

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json({ limit: '10mb' }));

// NUEVO: CONFIGURACIÓN BÁSICA DE CORREO (Usa variables de entorno en producción)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const jobs = {}; 
const dossierCache = {};
const ETAPAS_ORDEN = ['INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK', 'SWOT', 'WISHLIST', 'FUGAS', 'ACCIONES', 'HERRAMIENTAS', 'OMNI'];

// MODIFICADO: La ruta raíz ahora muestra la Landing Page
app.get('/', (req, res) => res.send(getLandingHTML()));

// NUEVO: Ruta para el reporte gratuito (Procesamiento en segundo plano puro)
app.post('/start-lite', async (req, res) => {
    const { dna, email } = req.body;
    let targetUrl = dna.trim();
    if (!targetUrl.startsWith('http') && targetUrl.includes('.')) targetUrl = `https://${targetUrl}`;
    
    const jobId = targetUrl + '-' + Date.now(); 
    jobs[jobId] = { status: 'running', progress: {}, email: email, type: 'lite' };
    
    // Ejecutamos sin detener la respuesta (Fire and Forget)
    ejecutarAuditoriaFondo(targetUrl, jobId, true).catch(e => {
        console.error("Fallo crítico en Auditoría Lite:", e);
        if(jobs[jobId]) jobs[jobId].status = 'error';
    });
    
    // Respondemos de inmediato para que la animación de la landing continúe
    res.json({ status: 'started', jobId: jobId, message: 'Auditoría en proceso' });
});

// MANTENIDO: Ruta original (por si necesitas pruebas directas)
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

// MODIFICADO: Soporta modo "isLite" para usar menos etapas
async function ejecutarAuditoriaFondo(targetUrl, jobId, isLite = false) {
    let datosTarget = await captureAndScrape(targetUrl);

    const isSocialMedia = targetUrl.includes('instagram.com') || targetUrl.includes('facebook.com') || targetUrl.includes('tiktok.com');
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

    // Si es Lite, eventualmente usaremos menos etapas. Por ahora usa todo pero lo preparo.
    const etapasAEjecutar = isLite ? ETAPAS_ORDEN.slice(0, 3) : ETAPAS_ORDEN; // Solo 3 para pruebas rápidas del Lite

    for (const etapaId of etapasAEjecutar) {
        if(jobs[jobId]) jobs[jobId].currentEtapa = etapaId;
        try {
            const promptFinal = PROMPTS[etapaId](datosTarget.texto);
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

            if (etapaId === 'VISIBILIDAD' || etapaId === 'BENCHMARK') payload.tools = [{ googleSearch: {} }];

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

    // NUEVO: Lógica de envío final si es Lite
    if (isLite) {
        enviarReportePorCorreo(jobId, jobs[jobId].email);
    }
}

// NUEVO: Función para cristalizar y enviar
async function enviarReportePorCorreo(jobId, emailDestino) {
    console.log(`>>> Preparando envío de PDF para: ${emailDestino}`);
    // AQUÍ ENSAMBLAREMOS EL PDF EN EL SERVIDOR EN LA FASE 3
    // Por ahora, solo simula el envío exitoso en la consola.
    /*
    const mailOptions = {
        from: '"PredictaCore Titán" <tu@correo.com>',
        to: emailDestino,
        subject: 'Tu Auditoría Forense PredictaCore',
        text: 'Adjunto encontrarás tu reporte diagnóstico.',
        // attachments: [{ filename: 'Reporte_Titan.pdf', path: 'ruta/al/pdf' }]
    };
    await transporter.sendMail(mailOptions);
    */
    console.log(`>>> Reporte "enviado" a ${emailDestino} con éxito.`);
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

app.listen(port, "0.0.0.0", () => console.log(`PREDICTACORE TITÁN RESTAURADO Y ENRUTADO (FASE 2)`));
