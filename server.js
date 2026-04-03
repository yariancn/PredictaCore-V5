// server.js - HUB CENTRAL PREDICTACORE
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
app.use(express.json({ limit: '50mb' }));
const jobs = {};

app.get('/', (req, res) => res.send(getHTML()));

app.post('/start', async (req, res) => {
    const { dna } = req.body;
    const jobId = `PC_${Date.now()}`;
    jobs[jobId] = { status: 'running', progress: {}, currentEtapa: 'INIT', dna };
    ejecutarProceso(jobId).catch(e => { jobs[jobId].status = 'error'; });
    res.json({ jobId });
});

async function ejecutarProceso(jobId) {
    let input = jobs[jobId].dna.trim();
    let dossier = "";
    let cerebroActivo = PROMPTS_IDEAS;
    let screenshot = null;

    let isURL = input.includes('.') && !input.includes(' ');
    let targetURL = isURL && !input.startsWith('http') ? `https://${input}` : input;

    if (isURL) {
        const data = await captureAndScrape(targetURL);
        dossier = data.texto;
        screenshot = data.desktopBase64;
        cerebroActivo = (input.includes('instagram.com') || input.includes('facebook.com')) ? PROMPTS_SOCIAL : PROMPTS;
    } else {
        dossier = input;
    }

    const creds = JSON.parse(process.env.GOOGLE_CREDS);
    const auth = new GoogleAuth({ credentials: creds, scopes: 'https://www.googleapis.com/auth/cloud-platform' });
    const client = await auth.getClient();
    const token = (await client.getAccessToken()).token;
    const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${creds.project_id}/locations/us-central1/publishers/google/models/gemini-2.5-pro:generateContent`;

    const etapas = Object.keys(cerebroActivo);
    for (const etapaId of etapas) {
        jobs[jobId].currentEtapa = etapaId;
        try {
            let partes = [{ text: `DIRECTRICES: ${REGLAS_NUCLEARES}` }, { text: `DOSSIER: ${dossier}` }, { text: cerebroActivo[etapaId](dossier) }];
            if (screenshot) partes.push({ inlineData: { mimeType: "image/jpeg", data: screenshot } });

            const resIA = await fetch(vertexUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ contents: [{ role: "user", parts: partes }], generationConfig: { temperature: 0.15 } })
            });
            const dataIA = await resIA.json();
            jobs[jobId].progress[etapaId] = dataIA.candidates[0].content.parts[0].text;
            await new Promise(r => setTimeout(r, 4500));
        } catch (e) { jobs[jobId].progress[etapaId] = "### ERROR EN NODO"; }
    }
    jobs[jobId].status = 'done';
}

app.get('/poll', (req, res) => res.json(jobs[req.query.jobId]));
app.get('/download', async (req, res) => {
    const job = jobs[req.query.jobId];
    let htmlFinal = `<html><head>${ESTILOS_PDF}</head><body>`;
    Object.keys(job.progress).forEach(etapa => {
        let texto = job.progress[etapa].replace(/### (.*)/g, '<h3>$1</h3>').replace(/\n/g, '<br>');
        if (CONTEXTOS[etapa]) texto = texto.replace(/<h3>(.*?)<\/h3>/, `<h3>$1</h3><div class=\"capsula-contexto\">${CONTEXTOS[etapa]}</div>`);
        htmlFinal += `<section>${texto}</section>`;
    });
    htmlFinal += `</body></html>`;
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlFinal, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    res.contentType("application/pdf").send(pdf);
});
app.listen(8080, () => console.log("TITÁN B31 OPERATIVO"));
