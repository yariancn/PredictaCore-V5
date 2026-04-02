const express = require('express');
const { PROMPTS } = require('./analisis_web');
const { PROMPTS_SOCIAL } = require('./analisis_social');
const { PROMPTS_IDEAS } = require('./analisis_ideas');
const { ESTILOS_PDF } = require('./formato');
const { CONTEXTOS } = require('./guia_ejecutiva');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');
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
    
    runAnalysis(jobId).catch(e => { jobs[jobId].status = 'error'; });
    res.json({ jobId });
});

async function runAnalysis(jobId) {
    const dna = jobs[jobId].dna;
    let dossier = "";
    let cerebro = PROMPTS;

    // Lógica de Selección de Cerebro
    if (dna.includes('http')) {
        const data = await captureAndScrape(dna);
        dossier = data.texto;
        jobs[jobId].img = data.desktopBase64;
        if (dna.includes('instagram.com') || dna.includes('facebook.com')) cerebro = PROMPTS_SOCIAL;
    } else {
        dossier = dna;
        cerebro = PROMPTS_IDEAS;
    }

    const etapas = Object.keys(cerebro);
    for (const id of etapas) {
        jobs[jobId].currentEtapa = id;
        // Aquí se llama a Vertex AI (Gemini 2.5 Pro)
        // Se inyecta el prompt: cerebro[id](dossier)
        // Se guarda en: jobs[jobId].progress[id]
        await new Promise(r => setTimeout(r, 4000)); 
    }
    jobs[jobId].status = 'done';
}

app.get('/poll', (req, res) => res.json(jobs[req.query.jobId]));

app.listen(8080, () => console.log("TITÁN B31 OPERATIVO"));
