const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    // SANITIZADOR: Si la URL no tiene http, se lo ponemos nosotros
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http')) {
        finalUrl = `https://${finalUrl}`;
    }

    console.log(`[VISIÓN]: Escaneando con rigor en ${finalUrl}...`);
    
    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    });
    
    const page = await browser.newPage();
    // Simulamos una pantalla de laptop de alta resolución para que el reporte sea de élite
    await page.setViewport({ width: 1440, height: 900 });

    try {
        // Le damos 60 segundos porque los sitios pesados tardan en cargar
        await page.goto(finalUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // CAPTURA VISUAL: El "ojo" de Gemini
        const screenshot = await page.screenshot({ encoding: 'base64', fullPage: false });
        
        // EXTRACCIÓN DE ADN: El texto real del sitio
        const texto = await page.evaluate(() => document.body.innerText);
        
        await browser.close();
        return { screenshot, texto: texto.substring(0, 15000) };
        
    } catch (error) {
        await browser.close();
        throw new Error(`Falla de navegación en ${finalUrl}: ${error.message}`);
    }
}

module.exports = { captureAndScrape };
