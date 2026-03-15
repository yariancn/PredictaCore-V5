const { VertexAI } = require('@google-cloud/vertexai');
const puppeteer = require('puppeteer');

// Inicializamos el Cerebro de Google
const vertex_ai = new VertexAI({
    project: 'TU_PROJECT_ID_AQUÍ', // Cámbialo por el "project_id" de tu JSON
    location: 'us-central1'
});

async function captureAndScrape(url) {
    console.log(`[FORENSE]: Iniciando visión y extracción de ${url}`);
    
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // 1. CAPTURA DE VISIÓN (Lo que vale los $1,000 USD)
        const screenshot = await page.screenshot({ encoding: 'base64', fullPage: false });
        
        // 2. EXTRACCIÓN DE TEXTO (El ADN crudo)
        const texto = await page.evaluate(() => document.body.innerText);
        
        await browser.close();
        return { screenshot, texto: texto.substring(0, 10000) };
        
    } catch (error) {
        await browser.close();
        throw new Error(`Falla en captura: ${error.message}`);
    }
}

module.exports = { captureAndScrape, vertex_ai };
