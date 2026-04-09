// server.js - MOTOR PREDICTACORE PRO (RESTAURADO Y SIN FILTROS DE SEGURIDAD)
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
    console.log(`--- INICIO AUDITORÍA ${tipo.toUpperCase()} ---`);
    try {
        let datosTarget = await captureAndScrape(targetUrl);
        const cerebroActivo = targetUrl.includes('instagram.com') ? cerebroSocial : cerebroWeb;
        const promptsSeleccionados = (tipo === 'omni') ? PROMPTS_OMNI : PROMPTS_LITE;

        const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
        const auth = new GoogleAuth({ credentials: credenciales, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        
        // Usamos 1.5 PRO que es el modelo que Google tiene activo para tu proyecto
        const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-1.5-pro:generateContent`;

        for (const etapaId in promptsSeleccionados) {
            console.log(`> Ejecutando: ${etapaId}...`);
            const promptFinal = promptsSeleccionados[etapaId](datosTarget.texto);
            
            const payload = {
                contents: [{ role: "user", parts: [
                    { text: `${FIREWALL_IA}\n\n${cerebroActivo.IDIOMA}\n${cerebroActivo.REGLA_NUCLEAR}` },
                    { text: `CONTEXTO:\n${datosTarget.texto}` }, 
                    { text: promptFinal }
                ]}],
                // APAGAMOS LOS FILTROS PARA QUE NO CENSURE EL REPORTE
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
                console.log(`  [OK] ${etapaId} completada.`);
            } else {
                console.error(`  [!] Error Vertex:`, JSON.stringify(vertexData));
                jobs[jobId].progress[etapaId] = "Análisis temporalmente no disponible.";
            }
            await new Promise(r => setTimeout(r, 4000)); // Pausa para estabilidad
        }

        jobs[jobId].status = 'done';
        await enviarReportePorCorreo(jobId, jobs[jobId].email, targetUrl, tipo);

    } catch (error) {
        console.error("!!! FALLO MOTOR:", error);
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
        console.log(`>>> REPORTE ENTREGADO: ${emailDestino}`);
    } catch (e) { 
        console.error(e);
        if(browser) await browser.close();
    }
}

app.listen(port, "0.0.0.0", () => console.log(`PREDICTACORE ONLINE`));
