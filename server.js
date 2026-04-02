const express = require('express');
const { PROMPTS } = require('./analisis_web');
const { PROMPTS_SOCIAL } = require('./analisis_social');
const { PROMPTS_IDEAS } = require('./analisis_ideas');
const { ESTILOS_PDF } = require('./formato');
const { CONTEXTOS } = require('./guia_ejecutiva');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');
const { REGLAS_NUCLEARES } = require('./directrices');
const { GoogleAuth } = require('google-auth-library');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json({ limit: '50mb' }));

const jobs = {};

app.get('/', (req, res) => res.send(getHTML()));

app.post('/start', async (req, res) => {
    const { dna } = req.body;
    if (!dna) return res.status(400).json({ error: "Falta DNA" });
    const jobId = `PC_${Date.now()}`;
    jobs[jobId] = { status: 'running', progress: {}, currentEtapa: 'INICIANDO', dna };
    
    ejecutarProceso(jobId).catch(e => {
        console.error("Fallo Job:", e);
        jobs[jobId].status = 'error';
    });
    
    res.json({ jobId });
});

async function ejecutarProceso(jobId) {
    const dna = jobs[jobId].dna.trim();
    let dossier = "";
    let cerebroActivo = PROMPTS;
    let screenshot = null;

    // 1. IDENTIFICACIÓN DE INPUT
    if (dna.startsWith('http')) {
        const data = await captureAndScrape(dna);
        dossier = data.texto;
        screenshot = data.desktopBase64;
        if (dna.includes('instagram.com') || dna.includes('facebook.com') || dna.includes('tiktok.com')) {
            cerebroActivo = PROMPTS_SOCIAL;
        }
    } else {
        dossier = `IDEA DE NEGOCIO / CONCEPTO: ${dna}`;
        cerebroActivo = PROMPTS_IDEAS;
    }

    // 2. CONEXIÓN VERTEX
    const creds = JSON.parse(process.env.GOOGLE_CREDS);
    const auth = new GoogleAuth({ credentials: creds, scopes: 'https://www.googleapis.com/auth/cloud-platform' });
    const client = await auth.getClient();
    const token = (await client.getAccessToken()).token;
    const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${creds.project_id}/locations/us-central1/publishers/google/models/gemini-2.5-pro:generateContent`;

    const etapas = Object.keys(cerebroActivo);

    for (const etapaId of etapas) {
        jobs[jobId].currentEtapa = etapaId;
        try {
            let partes = [
                { text: `DIRECTRICES: ${REGLAS_NUCLEARES}` },
                { text: `DOSSIER FORENSE: ${dossier}` },
                { text: cerebroActivo[etapaId](dossier) }
            ];
            
            if (screenshot) {
                partes.push({ inlineData: { mimeType: "image/jpeg", data: screenshot } });
            }

            const resIA = await fetch(vertexUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ contents: [{ role: "user", parts: partes }], generationConfig: { temperature: 0.15 } })
            });

            const dataIA = await resIA.json();
            jobs[jobId].progress[etapaId] = dataIA.candidates[0].content.parts[0].text;
            await new Promise(r => setTimeout(r, 4000));
        } catch (e) {
            jobs[jobId].progress[etapaId] = `### ${etapaId}\nError en análisis.`;
        }
    }
    jobs[jobId].status = 'done';
}

app.get('/poll', (req, res) => res.json(jobs[req.query.jobId]));

app.get('/download', async (req, res) => {
    const job = jobs[req.query.jobId];
    if (!job || job.status !== 'done') return res.status(404).send("No listo");

    let htmlFinal = `<html><head>${ESTILOS_PDF}</head><body>`;
    Object.keys(job.progress).forEach(etapa => {
        let texto = job.progress[etapa].replace(/### (.*)/g, '<h3>$1</h3>').replace(/\n/g, '<br>');
        if (CONTEXTOS[etapa]) {
            texto = texto.replace(/<h3>(.*?)<\/h3>/, `<h3>$1</h3><div class="capsula-contexto">${CONTEXTOS[etapa]}</div>`);
        }
        htmlFinal += `<section>${texto}</section>`;
    });
    htmlFinal += `</body></html>`;

    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlFinal, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '1.5cm', bottom: '1.5cm', left: '1.2cm', right: '1.2cm' } });
    await browser.close();
    res.contentType("application/pdf").send(pdf);
});

app.listen(port, "0.0.0.0", () => console.log(`TITÁN B31: NÚCLEO EN LINEA`));
