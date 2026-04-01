const express = require('express');
const cerebroWeb = require('./cerebro');           
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor'); 
const { FIREWALL_IA } = require('./firewall');
const { GoogleAuth } = require('google-auth-library');
const puppeteer = require('puppeteer');

// Capas consolidadas
const { CONTEXTOS } = require('./guia_ejecutiva');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json({ limit: '50mb' }));

const ETAPAS_ORDEN = ['INTRO', 'GEMELOS', 'SCORECARD', 'VISIBILIDAD', 'BENCHMARK', 'SWOT', 'WISHLIST', 'FRICTION', 'TACTICAL', 'SCALING', 'ROADMAP'];

app.get('/', (req, res) => res.send(getHTML()));

// ... lógica de /start y /poll se mantienen igual ...

async function ejecutarAuditoriaFondo(targetUrl, jobId) {
    let datosTarget = await captureAndScrape(targetUrl);
    const { PROMPTS, IDIOMA, REGLA_NUCLEAR } = cerebroWeb;
    
    // Autenticación Vertex...
    
    for (const etapaId of ETAPAS_ORDEN) {
        // REGRESO A LA INTELIGENCIA DEL REPORTE 6
        const promptFinal = PROMPTS[etapaId](datosTarget.texto);
        
        // El resto del flujo de envío a Vertex AI se mantiene idéntico al Reporte 6
        // asegurando que reciba las imágenes y el dossier completo sin sesgos tácticos.
    }
}

app.post('/generate-pdf', async (req, res) => {
    const { html } = req.body;
    let browser;
    try {
        browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
        const page = await browser.newPage();
        
        let htmlFinal = html;
        // Inyectamos las cápsulas solo si el título existe
        for (const [key, value] of Object.entries(CONTEXTOS)) {
            const regex = new RegExp(`(<h3.*?>.*?${key}.*?</h3>)`, 'gi');
            htmlFinal = htmlFinal.replace(regex, `$1<div class="capsula-contexto">${value}</div>`);
        }

        await page.setContent(htmlFinal, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();
        res.contentType("application/pdf").send(pdf);
    } catch (e) {
        if(browser) await browser.close();
        res.status(500).send("Error");
    }
});
