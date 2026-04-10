// server.js - MOTOR PREDICTACORE RESTAURADO Y BLINDADO (PASO 1: SEGURIDAD OMNI)
const express = require('express');
const cerebroWeb = require('./cerebro');           
const cerebroSocial = require('./cerebro_social'); 
const { PROMPTS_LITE } = require('./cerebro_lite');
const { PROMPTS_OMNI } = require('./cerebro_omni');
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

// RUTA REPORTE LITE
app.post('/start-lite', async (req, res) => {
    iniciarAuditoria(req.body.dna, req.body.email, true);
    res.json({ status: 'started' });
});

// RUTA REPORTE OMNI
app.post('/start-omni', async (req, res) => {
    iniciarAuditoria(req.body.dna, req.body.email, false);
    res.json({ status: 'started' });
});

async function iniciarAuditoria(dna, email, isLite) {
    let targetUrl = dna.trim();
    if (!targetUrl.startsWith('http') && targetUrl.includes('.')) targetUrl = `https://${targetUrl}`;
    
    const tipo = isLite ? 'LITE' : 'OMNI';
    const jobId = `${tipo}-${Date.now()}`; 
    jobs[jobId] = { status: 'running', progress: {}, email: email, isLite: isLite };
    
    console.log(`\n--- INICIANDO PROTOCOLO ${tipo}: ${targetUrl} ---`);
    
    ejecutarAuditoriaFondo(targetUrl, jobId, isLite).catch(e => {
        console.error(`!!! FALLO CRÍTICO ${tipo}:`, e);
        if(jobs[jobId]) jobs[jobId].status = 'error';
    });
}

async function ejecutarAuditoriaFondo(targetUrl, jobId, isLite) {
    let datosTarget = await captureAndScrape(targetUrl);
    const cerebroActivo = targetUrl.includes('instagram.com') ? cerebroSocial : cerebroWeb;
    
    const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
    const auth = new GoogleAuth({
        credentials: credenciales,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    
    // URL validada en tu proyecto
    const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-1.5-pro:generateContent`;

    const PROMPTS_ACTUALES = isLite ? PROMPTS_LITE : PROMPTS_OMNI;

    for (const etapaId in PROMPTS_ACTUALES) {
        try {
            console.log(`> Ejecutando etapa: ${etapaId}...`);
            const promptFinal = PROMPTS_ACTUALES[etapaId](datosTarget.texto);
            
            const payload = {
                systemInstruction: { parts: [{ text: FIREWALL_IA }] },
                contents: [{ 
                    role: "user", 
                    parts: [
                        { text: cerebroActivo.IDIOMA }, 
                        { text: cerebroActivo.REGLA_NUCLEAR },
                        { text: `CONTEXTO ESTRATÉGICO:\n${datosTarget.texto}` },
                        { text: promptFinal }
                    ]
                }],
                // BLINDAJE: BLOCK_NONE permite lenguaje forense agresivo sin censura
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ],
                generationConfig: { 
                    temperature: 0.15,
                    maxOutputTokens: 2500 
                } 
            };

            const vertexRes = await fetch(vertexUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenResponse.token}` },
                body: JSON.stringify(payload)
            });

            const vertexData = await vertexRes.json();

            if (vertexData.candidates && vertexData.candidates[0].content) {
                jobs[jobId].progress[etapaId] = vertexData.candidates[0].content.parts[0].text;
                console.log(`  [OK] ${etapaId} completada.`);
            } else {
                console.error(`  [!] Error Vertex en ${etapaId}:`, JSON.stringify(vertexData));
                jobs[jobId].progress[etapaId] = "### SECTION ANALYSIS UNAVAILABLE\nPlease retry.";
            }
            // Pausa técnica para estabilidad de cuota
            await new Promise(r => setTimeout(r, 3000));

        } catch (error) {
            console.error(`Error en bucle ${etapaId}:`, error);
            jobs[jobId].progress[etapaId] = "Error técnico en esta sección.";
        }
    }

    jobs[jobId].status = 'done';
    await enviarReportePorCorreo(jobId, jobs[jobId].email, targetUrl, isLite);
}

async function enviarReportePorCorreo(jobId, emailDestino, targetUrl, isLite) {
    try {
        const job = jobs[jobId];
        const htmlBase = isLite ? getHTMLLite() : getHTMLOmni();
        
        console.log(`> Iniciando Puppeteer para ${isLite ? 'LITE' : 'OMNI'}...`);
        const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlBase, { waitUntil: 'networkidle0' });

        await page.evaluate((progressData, dominio) => {
            const reporte = document.getElementById('reporte');
            const domainEl = document.getElementById('pdf-domain');
            if(domainEl) domainEl.innerText = 'Analysis: ' + dominio;
            
            for (const key in progressData) {
                const div = document.createElement('div');
                div.className = 'report-section';
                // marked está cargado globalmente en el molde visual
                div.innerHTML = marked.parse(progressData[key]);
                reporte.appendChild(div);
            }
        }, job.progress, targetUrl);

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        const filename = isLite ? 'PREDICTACORE_LITE.pdf' : 'PREDICTACORE_OMNI.pdf';
        const subject = isLite ? 'Tu Auditoría PredictaCore (Lite)' : 'Protocolo OMNISCIENCIAS: Auditoría Forense Completa';

        await resend.emails.send({
            from: 'PredictaCore <reportes@predictacore.ai>',
            to: emailDestino,
            subject: subject,
            text: `Adjunto enviamos el análisis forense para: ${targetUrl}`,
            attachments: [{ filename: filename, content: pdfBuffer }]
        });
        console.log(`>>> EXITO: Reporte entregado a ${emailDestino}`);
    } catch (error) {
        console.error("!!! Error en envío final:", error);
    }
}

app.listen(port, "0.0.0.0", () => console.log(`MOTOR PREDICTACORE ESTABLE EN PUERTO ${port}`));
