// server.js - NÚCLEO PREDICTACORE 3.1 (CORREGIDO)
const express = require('express');
// CORRECCIÓN DE IMPORTACIÓN:
const { VertexAI } = require('@google-cloud/aiplatform').v1;

const cerebroWeb = require('./cerebro');           
const cerebroSocial = require('./cerebro_social'); 
const { PROMPTS_LITE } = require('./cerebro_lite');
const { PROMPTS_OMNI } = require('./cerebro_omni');
const { getHTMLLite } = require('./visual_lite');
const { getHTMLOmni } = require('./visual_omni');
const { getLandingHTML } = require('./landing');    
const { captureAndScrape } = require('./motor');    
const { FIREWALL_IA } = require('./firewall');
const puppeteer = require('puppeteer');
const { Resend } = require('resend');
const marked = require('marked');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json({ limit: '10mb' }));

const resend = new Resend(process.env.RESEND_API_KEY);
const jobs = {}; 

// 1. INICIALIZAR VERTEX AI (Versión Proactiva)
const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
const vertexAI = new VertexAI({
    project: credenciales.project_id, 
    location: 'us-central1',
    credentials: credenciales
});

// 2. CONFIGURAR EL MODELO 3.1
const modelId = 'gemini-1.5-pro'; // El endpoint estable para capacidades 3.1 en Vertex
const generativeModel = vertexAI.getGenerativeModel({
    model: modelId,
    safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' }
    ],
    generationConfig: { temperature: 0.15, maxOutputTokens: 2500 }
});

app.get('/', (req, res) => res.send(getLandingHTML()));

app.post('/start-lite', async (req, res) => {
    iniciarProceso(req.body.dna, req.body.email, 'lite', res);
});

app.post('/start-omni', async (req, res) => {
    iniciarProceso(req.body.dna, req.body.email, 'omni', res);
});

async function iniciarProceso(dna, email, tipo, res) {
    let targetUrl = dna.trim();
    if (!targetUrl.startsWith('http') && targetUrl.includes('.')) targetUrl = `https://${targetUrl}`;
    const jobId = `${tipo}-${Date.now()}`; 
    jobs[jobId] = { status: 'running', progress: {}, email: email, type: tipo };
    ejecutarAuditoriaFondo(targetUrl, jobId, tipo).catch(e => console.error("!!! ERROR FONDO:", e));
    res.json({ status: 'started', jobId: jobId });
}

async function ejecutarAuditoriaFondo(targetUrl, jobId, tipo) {
    console.log(`\n--- MOTOR PREDICTACORE 3.1 ACTIVADO: ${tipo.toUpperCase()} ---`);
    try {
        let datosTarget = await captureAndScrape(targetUrl);
        const cerebroActivo = targetUrl.includes('instagram.com') ? cerebroSocial : cerebroWeb;
        const promptsSeleccionados = (tipo === 'omni') ? PROMPTS_OMNI : PROMPTS_LITE;

        for (const etapaId in promptsSeleccionados) {
            console.log(`> Ejecutando Escaneo Forense: ${etapaId}...`);
            const promptFinal = promptsSeleccionados[etapaId](datosTarget.texto);
            
            const request = {
                contents: [{ role: 'user', parts: [
                    { text: `${FIREWALL_IA}\n\n${cerebroActivo.IDIOMA}\n${cerebroActivo.REGLA_NUCLEAR}` },
                    { text: `DATASET:\n${datosTarget.texto}` },
                    { text: `COMMAND:\n${promptFinal}` }
                ]}],
            };

            const result = await generativeModel.generateContent(request);
            const response = await result.response;
            const text = response.candidates[0].content.parts[0].text;

            jobs[jobId].progress[etapaId] = text;
            console.log(`  [OK] Sección ${etapaId} procesada.`);
            await new Promise(r => setTimeout(r, 1500));
        }

        jobs[jobId].status = 'done';
        await enviarReportePorCorreo(jobId, jobs[jobId].email, targetUrl, tipo);

    } catch (error) {
        console.error("!!! FALLO CRÍTICO EN EL MOTOR 3.1:", error);
    }
}

async function enviarReportePorCorreo(jobId, emailDestino, targetUrl, tipo) {
    let browser;
    try {
        const job = jobs[jobId];
        const htmlBase = (tipo === 'omni') ? getHTMLOmni() : getHTMLLite();
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
                // Usamos marked que debe estar cargado en el visual_omni/lite
                div.innerHTML = typeof marked !== 'undefined' ? marked.parse(progressData[key]) : progressData[key];
                reporte.appendChild(div);
            }
        }, job.progress, targetUrl);

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        await resend.emails.send({
            from: 'PredictaCore <reportes@predictacore.ai>',
            to: emailDestino,
            subject: `PredictaCore Forensic Audit - ${tipo.toUpperCase()}`,
            attachments: [{ filename: `PredictaCore_${tipo.toUpperCase()}.pdf`, content: pdfBuffer }]
        });
        console.log(`>>> REPORTE ENTREGADO: ${emailDestino}`);
    } catch (e) { 
        console.error("Error en fase de entrega:", e);
        if(browser) await browser.close();
    }
}

app.listen(port, "0.0.0.0", () => console.log(`MOTOR PREDICTACORE 3.1 EN LÍNEA`));
