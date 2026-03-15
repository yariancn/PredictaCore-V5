const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    console.log(`[VISIÓN]: Escaneando ${url}...`);
    
    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ]
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1000 });

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // FOTO REAL (Lo que Gemini usará para no mentir)
        const screenshot = await page.screenshot({ encoding: 'base64' });
        
        // ADN TEXTUAL
        const texto = await page.evaluate(() => document.body.innerText);
        
        await browser.close();
        return { screenshot, texto: texto.substring(0, 10000) };
        
    } catch (error) {
        await browser.close();
        throw new Error(`Falla de visión en Puppeteer: ${error.message}`);
    }
}

module.exports = { captureAndScrape };
