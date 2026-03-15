const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    // 1. Limpieza de URL: Si entra "google.com", lo convierte en "https://google.com"
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http')) {
        finalUrl = `https://${finalUrl}`;
    }

    console.log(`[VISIÓN]: Intentando navegar a ${finalUrl}...`);
    
    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    try {
        await page.goto(finalUrl, { waitUntil: 'networkidle2', timeout: 45000 });
        const screenshot = await page.screenshot({ encoding: 'base64' });
        const texto = await page.evaluate(() => document.body.innerText);
        await browser.close();
        return { screenshot, texto: texto.substring(0, 10000), isUrl: true };
    } catch (error) {
        await browser.close();
        console.error(`[Aviso]: No se pudo navegar como URL. Procesando como concepto.`);
        return { screenshot: null, texto: url, isUrl: false };
    }
}

module.exports = { captureAndScrape };
