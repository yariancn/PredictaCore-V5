// server.js - NÚCLEO PREDICTACORE (LITE, TITÁN & OMNISCIENCIAS)
const express = require('express');
const cerebroWeb = require('./cerebro');           
const cerebroSocial = require('./cerebro_social'); 
const { PROMPTS_LITE } = require('./cerebro_lite');
const { PROMPTS_OMNI } = require('./cerebro_omni'); // NUEVO
const { getHTMLLite } = require('./visual_lite');
const { getHTMLOmni } = require('./visual_omni');   // NUEVO
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

// RUTA PARA REPORTE GRATUITO
app.post('/start-lite', async (req, res) => {
    const { dna, email } = req.body;
    iniciarProceso(dna, email, 'lite', res);
});

// RUTA PARA PRUEBA DE DESARROLLO OMNI ($399)
app.post('/start-omni', async (req, res) => {
    const { dna, email } = req.body;
    iniciarProceso(dna, email, 'omni', res);
});

async function iniciarProceso(dna, email, tipo, res) {
    let targetUrl = dna.trim();
    if (!targetUrl.startsWith('http') && targetUrl.includes('.')) targetUrl = `https://${targetUrl}`;
    
    const jobId = `${tipo}-${targetUrl}-${Date.now()}`; 
    jobs[jobId] = { status: 'running', progress: {}, email: email, type: tipo };
    
    ejecutarAuditoriaFondo(targetUrl, jobId, tipo).catch(e => {
        console.error(`Fallo en Auditoría ${tipo}:`, e);
        if(jobs[jobId]) jobs[jobId].status = 'error';
    });
    
    res.json({ status: 'started', jobId: jobId });
}

async function ejecutarAuditoriaFondo(targetUrl, jobId, tipo) {
    let datosTarget = await captureAndScrape(targetUrl);
    const isSocialMedia = targetUrl.includes('instagram.com') || targetUrl.includes('facebook.com');
    const cerebroActivo = isSocialMedia ? cerebroSocial : cerebroWeb;

    // SELECCIÓN DE PROMPTS SEGÚN TIPO
    let promptsSeleccionados;
    if (tipo === 'lite') promptsSeleccionados = PROMPTS_LITE;
    else if (tipo === 'omni') promptsSeleccionados = PROMPTS_OMNI;
    else promptsSeleccionados = PROMPTS_LITE; // Fallback

    const { IDIOMA, REGLA_NUCLEAR } = cerebroActivo;
    const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
    const auth = new GoogleAuth({ credentials: credenciales, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-1.5-pro:generateContent`;

    for (const etapaId in promptsSeleccionados) {
        try {
            const promptFinal = promptsSeleccionados[etapaId](datosTarget.texto);
            let partesMensaje = [
                { text: IDIOMA }, { text: REGLA_NUCLEAR },
                { text: `CONTEXTO DEL SITIO:\n${datosTarget.texto}` },
                { text: promptFinal }
            ];

            if (datosTarget.desktopBase64) {
                partesMensaje.push({ inlineData: { mimeType: "image/jpeg", data: datosTarget.desktopBase64 } });
            }

            const payload = {
                systemInstruction: { parts: [{ text: FIREWALL_IA }] },
                contents: [{ role: "user", parts: partesMensaje }],
                generationConfig: { temperature: 0.15 } 
            };

            const vertexRes = await fetch(vertexUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenResponse.token}` },
                body: JSON.stringify(payload)
            });

            const vertexData = await vertexRes.json();
            jobs[jobId].progress[etapaId] = vertexData.candidates[0].content.parts[0].text;
            
            // Pausa de seguridad para evitar Rate Limits en Vertex AI
            await new Promise(r => setTimeout(r, 4000));

        } catch (error) {
            jobs[jobId].progress[etapaId] = `Error en etapa ${etapaId}`;
        }
    }
    
    jobs[jobId].status = 'done';
    await enviarReportePorCorreo(jobId, jobs[jobId].email, targetUrl, tipo);
}

async function enviarReportePorCorreo(jobId, emailDestino, targetUrl, tipo) {
    try {
        const job = jobs[jobId];
        // SELECCIÓN DE MOLDE VISUAL
        const htmlBase = (tipo === 'omni') ? getHTMLOmni() : getHTMLLite();
        
        const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlBase, { waitUntil: 'networkidle0' });

        await page.evaluate((progressData, dominio, tipoAudit) => {
            const reporte = document.getElementById('reporte');
            const domainEl = document.getElementById('pdf-domain');
            if(domainEl) domainEl.innerText = 'Analysis: ' + dominio;
            
            for (const key in progressData) {
                const div = document.createElement('div');
                div.innerHTML = marked.parse(progressData[key]);
                reporte.appendChild(div);
            }
        }, job.progress, targetUrl, tipo);

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        await resend.emails.send({
            from: 'PredictaCore <reportes@predictacore.ai>',
            to: emailDestino,
            subject: `PredictaCore Audit - ${tipo.toUpperCase()} Protocol`,
            text: `Attached is your ${tipo} forensic conversion report.`,
            attachments: [{ filename: `PredictaCore_${tipo.toUpperCase()}.pdf`, content: pdfBuffer }]
        });
        console.log(`>>> Reporte ${tipo} enviado a ${emailDestino}`);
    } catch (error) {
        console.error("Error en envío:", error);
    }
}

app.listen(port, "0.0.0.0", () => console.log(`MOTOR PREDICTACORE ACTIVADO EN PUERTO ${port}`));
