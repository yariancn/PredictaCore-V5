// server.js - MOTOR PREDICTACORE ESTABILIZADO (VERSION PARA LANZAMIENTO)
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
    console.log(`\n--- INICIO AUDITORÍA ${tipo.toUpperCase()} ---`);
    try {
        let datosTarget = await captureAndScrape(targetUrl);
        const cerebroActivo = targetUrl.includes('instagram.com') ? cerebroSocial : cerebroWeb;
        const promptsSeleccionados = (tipo === 'omni') ? PROMPTS_OMNI : PROMPTS_LITE;

        const credenciales = JSON.parse(process.env.GOOGLE_CREDS);
        const auth = new GoogleAuth({ credentials: credenciales, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        
        // RECOMENDACIÓN: Usamos 1.5 Flash por su velocidad y estabilidad en reportes largos (45 puntos).
        // Cambiar a 'gemini-1.5-pro' si prefieres más profundidad a costa de más lentitud y riesgo de timeout.
        const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${credenciales.project_id}/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent`;

        for (const etapaId in promptsSeleccionados) {
            console.log(`> Llamando Vertex AI para etapa: ${etapaId}...`);
            const promptFinal = promptsSeleccionados[etapaId](datosTarget.texto);
            
            const payload = {
                contents: [{ role: "user", parts: [
                    { text: cerebroActivo.IDIOMA }, 
                    { text: cerebroActivo.REGLA_NUCLEAR },
                    { text: `TARGET CONTEXT:\n${datosTarget.texto}` }, 
                    { text: promptFinal }
                ]}],
                // CAMBIO RECOMENDADO: Desactivar filtros para que no bloqueen el lenguaje "forense"
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ],
                generationConfig: { 
                    temperature: 0.12, // Temperatura baja para mayor precisión matemática
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
                console.log(`  [OK] Etapa ${etapaId} completada.`);
            } else {
                // LOG DE GUERRA: Nos dice exactamente por qué Google rechazó la petición
                console.error(`  [!] ERROR EN VERTEX (${etapaId}):`, JSON.stringify(vertexData));
                jobs[jobId].progress[etapaId] = "### SECTION ANALYSIS UNAVAILABLE\nThe deep scan for this specific pillar was interrupted by the safety protocol. Please retry.";
            }
            await new Promise(r => setTimeout(r, 3000));
        }

        jobs[jobId].status = 'done';
        await enviarReportePorCorreo(jobId, jobs[jobId].email, targetUrl, tipo);

    } catch (error) {
        console.error("!!! FALLO TOTAL EN EL MOTOR:", error);
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
                // Usamos la librería marked (cargada en el visual) para convertir Markdown a HTML
                div.innerHTML = typeof marked !== 'undefined' ? marked.parse(progressData[key]) : progressData[key];
                reporte.appendChild(div);
            }
        }, job.progress, targetUrl);

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        await resend.emails.send({
            from: 'PredictaCore <reportes@predictacore.ai>',
            to: emailDestino,
            subject: `PredictaCore Forensic Audit - ${tipo.toUpperCase()} Protocol`,
            text: `Attached is your forensic report for ${targetUrl}.`,
            attachments: [{ filename: `PredictaCore_${tipo.toUpperCase()}.pdf`, content: pdfBuffer }]
        });
        console.log(`>>> EXITO: Reporte enviado a ${emailDestino}.`);
    } catch (e) { 
        console.error("!!! ERROR EN ENVÍO:", e);
        if(browser) await browser.close();
    }
}

app.listen(port, "0.0.0.0", () => console.log(`MOTOR PREDICTACORE ACTIVADO`));
