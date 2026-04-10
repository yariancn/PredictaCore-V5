// server.js - RESTAURACIÓN TOTAL (Mismo motor de ayer, ahora con OMNI liberado)
const express = require('express');
const cerebroWeb = require('./cerebro');           
const cerebroSocial = require('./cerebro_social'); 
const { PROMPTS_LITE } = require('./cerebro_lite');
const { getHTML } = require('./visual'); // Tu visual Titán original
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

// RUTA LITE (LA QUE YA FUNCIONABA)
app.post('/start-lite', async (req, res) => {
    iniciarAuditoria(req.body.dna, req.body.email, true);
    res.json({ status: 'started' });
});

// RUTA OMNI (NUEVA: MISMA LÓGICA, MÁS PUNTOS)
app.post('/start-omni', async (req, res) => {
    iniciarAuditoria(req.body.dna, req.body.email, false);
    res.json({ status: 'started' });
});

async function iniciarAuditoria(dna, email, isLite) {
    let targetUrl = dna.trim();
    if (!targetUrl.startsWith('http') && targetUrl.includes('.')) targetUrl = `https://${targetUrl}`;
    const jobId = targetUrl + '-' + Date.now(); 
    jobs[jobId] = { status: 'running', progress: {}, email: email, isLite: isLite };
    ejecutarAuditoriaFondo(targetUrl, jobId, isLite).catch(e => console.error("!!! ERROR:", e));
}

async function ejecutarAuditoriaFondo(targetUrl, jobId, isLite) {
    let datosTarget = await captureAndScrape(targetUrl);
    const cerebroActivo = targetUrl.includes('instagram.com') ? cerebroSocial : cerebroWeb;
    
    const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
    const auth = new GoogleAuth({ credentials: credenciales, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    
    // Tu ruta de ayer que sabemos que responde
    const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-1.5-pro:generateContent`;

    // Seleccionamos los prompts: Lite (5 puntos) o los 45 puntos que discutimos
    const PROMPTS_ACTUALES = isLite ? PROMPTS_LITE : cerebroActivo.PROMPTS_OMNI; 

    for (const etapaId in PROMPTS_ACTUALES) {
        const promptFinal = PROMPTS_ACTUALES[etapaId](datosTarget.texto);
        const payload = {
            contents: [{ role: "user", parts: [
                { text: cerebroActivo.IDIOMA }, 
                { text: cerebroActivo.REGLA_NUCLEAR },
                { text: `CONTEXTO:\n${datosTarget.texto}` }, 
                { text: promptFinal }
            ]}],
            // BLINDAJE: Esto evita que el reporte de 45 puntos se bloquee
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
            jobs[jobId].progress[etapaId] = "Sección no disponible por protocolo.";
        }
        await new Promise(r => setTimeout(r, 2000));
    }

    jobs[jobId].status = 'done';
    await enviarReportePorCorreo(jobId, jobs[jobId].email, targetUrl, isLite);
}

async function enviarReportePorCorreo(jobId, emailDestino, targetUrl, isLite) {
    try {
        const job = jobs[jobId];
        const htmlBase = isLite ? getHTMLLite() : getHTML(); // Usamos tus archivos visuales originales
        
        const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlBase, { waitUntil: 'networkidle0' });

        await page.evaluate((progressData, dominio) => {
            const reporte = document.getElementById('reporte');
            for (const key in progressData) {
                const div = document.createElement('div');
                div.innerText = progressData[key];
                reporte.appendChild(div);
            }
        }, job.progress, targetUrl);

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        await resend.emails.send({
            from: 'PredictaCore <reportes@predictacore.ai>',
            to: emailDestino,
            subject: `Auditoría PredictaCore - ${targetUrl}`,
            attachments: [{ filename: 'Reporte.pdf', content: pdfBuffer }]
        });
    } catch (e) { console.error(e); }
}

app.listen(port, "0.0.0.0", () => console.log(`MOTOR RESTAURADO`));
