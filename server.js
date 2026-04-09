// server.js - NÚCLEO PREDICTACORE CON ARQUITECTURA VERTEX 3.1
const express = require('express');
const { VertexAI } = require('@google-cloud/aiplatform');

// Importaciones de lógica de negocio
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

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json({ limit: '10mb' }));

const resend = new Resend(process.env.RESEND_API_KEY);
const jobs = {}; 

// 1. INICIALIZAR VERTEX AI CON TU PROYECTO
const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
const vertex_ai = new VertexAI({
    project: credenciales.project_id, 
    location: 'us-central1',
    credentials: credenciales
});

// 2. CONFIGURAR EL MODELO (Aquí usamos la recomendación de Vertex 3.1)
const modelId = 'gemini-1.5-flash'; // Google mapea el 3.1/Flash-Lite a este endpoint estable
const generativeModel = vertex_ai.getGenerativeModel({
    model: modelId,
    safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' }
    ],
    generationConfig: { temperature: 0.2, maxOutputTokens: 3000 }
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
    console.log(`\n--- INICIO AUDITORÍA ${tipo.toUpperCase()} (VERTEX 3.1 ENGINE) ---`);
    try {
        let datosTarget = await captureAndScrape(targetUrl);
        const cerebroActivo = targetUrl.includes('instagram.com') ? cerebroSocial : cerebroWeb;
        const promptsSeleccionados = (tipo === 'omni') ? PROMPTS_OMNI : PROMPTS_LITE;

        for (const etapaId in promptsSeleccionados) {
            console.log(`> Procesando etapa: ${etapaId}...`);
            const promptFinal = promptsSeleccionados[etapaId](datosTarget.texto);
            
            const request = {
                contents: [{ role: 'user', parts: [
                    { text: `${FIREWALL_IA}\n\n${cerebroActivo.IDIOMA}\n${cerebroActivo.REGLA_NUCLEAR}` },
                    { text: `CONTEXTO ESTRATÉGICO:\n${datosTarget.texto}` },
                    { text: `INSTRUCCIÓN FORENSE:\n${promptFinal}` }
                ]}],
            };

            const streamingResp = await generativeModel.generateContentStream(request);
            let fullText = "";
            for await (const item of streamingResp.stream) {
                fullText += item.candidates[0].content.parts[0].text;
            }

            jobs[jobId].progress[etapaId] = fullText;
            console.log(`  [OK] Etapa ${etapaId} lista.`);
            await new Promise(r => setTimeout(r, 1000));
        }

        jobs[jobId].status = 'done';
        await enviarReportePorCorreo(jobId, jobs[jobId].email, targetUrl, tipo);

    } catch (error) {
        console.error("!!! FALLO EN MOTOR VERTEX:", error);
    }
}

async function enviarReportePorCorreo(jobId, emailDestino, targetUrl, tipo) {
    let browser;
    try {
        const job = jobs[jobId];
        const htmlBase = (tipo === 'omni') ? getHTMLOmni() : getHTMLLite();
        browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
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
            subject: `PredictaCore Forensic Audit - ${tipo.toUpperCase()}`,
            attachments: [{ filename: `PredictaCore_${tipo.toUpperCase()}.pdf`, content: pdfBuffer }]
        });
        console.log(`>>> EXITO: Reporte enviado a ${emailDestino}`);
    } catch (e) { 
        if(browser) await browser.close();
    }
}

app.listen(port, "0.0.0.0", () => console.log(`MOTOR PREDICTACORE 3.1 ACTIVADO`));
