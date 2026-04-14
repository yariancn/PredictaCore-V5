// server.js - NÚCLEO PREDICTACORE UNIFICADO (LITE + TITÁN)
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

// CONFIGURACIÓN DE CORREO (RESEND API)
const resend = new Resend(process.env.RESEND_API_KEY);
const jobs = {}; 

app.get('/', (req, res) => res.send(getLandingHTML()));

// --- RUTAS DE ACTIVACIÓN ---

// 1. Ruta Teaser (Gratuito) - Llama a /start-lite
app.post('/start-lite', async (req, res) => {
    iniciarAuditoria(req.body.dna, req.body.email, true);
    res.json({ status: 'started' });
});

// 2. Ruta Titán (Pago $239) - Llama a /start
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
    
    console.log(`>>> [SISTEMA] Iniciando Reporte ${modo} para: ${targetUrl}`);
    ejecutarAuditoriaFondo(targetUrl, jobId, isLite).catch(e => console.error("!!! ERROR:", e));
}

async function ejecutarAuditoriaFondo(targetUrl, jobId, isLite) {
    try {
        let datosTarget = await captureAndScrape(targetUrl);
        const cerebroActivo = targetUrl.includes('instagram.com') ? cerebroSocial : cerebroWeb;
        
        // Selección de Prompts: Lite (5 secciones) vs Titán (11 secciones)
        const promptsAUsar = isLite ? PROMPTS_LITE : cerebroActivo.PROMPTS;

        const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
        const auth = new GoogleAuth({ credentials: credenciales, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        
        const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-1.5-pro:generateContent`;

        for (const etapaId in promptsAUsar) {
            console.log(`> Procesando sección: ${etapaId}`);
            const promptFinal = promptsAUsar[etapaId](datosTarget.texto);
            
            const payload = {
                contents: [{ 
                    role: "user", 
                    parts: [
                        { text: FIREWALL_IA },
                        { text: cerebroActivo.IDIOMA }, 
                        { text: cerebroActivo.REGLA_NUCLEAR },
                        { text: `CONTEXTO ESTRATÉGICO:\n${datosTarget.texto}` }, 
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
            await new Promise(r => setTimeout(r, 2000)); // Respeto de cuota
        }

        jobs[jobId].status = 'done';
        await enviarReportePorCorreo(jobId, jobs[jobId].email, targetUrl, isLite);

    } catch (error) {
        console.error("!!! FALLO MOTOR:", error);
    }
}

async function enviarReportePorCorreo(jobId, emailDestino, targetUrl, isLite) {
    let browser;
    try {
        const job = jobs[jobId];
        const htmlBase = isLite ? getHTMLLite() : getHTML();
        
        browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlBase, { waitUntil: 'networkidle0' });

        await page.evaluate((progressData, dominio) => {
            const reporte = document.getElementById('reporte');
            for (const key in progressData) {
                const div = document.createElement('div');
                div.className = 'report-section';
                // Usamos marked para convertir el markdown de la IA en HTML visual
                div.innerHTML = marked.parse(progressData[key]);
                reporte.appendChild(div);
            }
        }, job.progress, targetUrl);

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        const nombreArchivo = isLite ? 'PREDICTACORE_LITE.pdf' : 'PREDICTACORE_TITAN.pdf';
        const subject = isLite ? 'Tu Auditoría Forense (Teaser)' : 'Tu Auditoría Forense Titán Completa';

        await resend.emails.send({
            from: 'PredictaCore <reportes@predictacore.ai>',
            to: emailDestino,
            subject: subject,
            attachments: [{ filename: nombreArchivo, content: pdfBuffer }]
        });
        
        console.log(`>>> [EXITO] Reporte ${isLite ? 'LITE' : 'TITÁN'} enviado a ${emailDestino}`);
    } catch (e) {
        if(browser) await browser.close();
        console.error("Error al ensamblar o enviar correo:", e);
    }
}

// Ruta para generación de PDF bajo demanda (usada por el botón del visual)
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

app.listen(port, "0.0.0.0", () => console.log(`MOTOR UNIFICADO PREDICTACORE ONLINE`));
