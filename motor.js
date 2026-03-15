const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let input = url.trim();
    
    // Si tiene espacios o no tiene puntos, es una IDEA, no una WEB
    const isUrl = input.includes('.') && !input.includes(' ');

    if (!isUrl) {
        return { screenshot: null, texto: input, isUrl: false };
    }

    let finalUrl = input.startsWith('http') ? input : `https://${input}`;

    console.log(`[VISIÓN]: Intentando abrir ${finalUrl}...`);
    
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        
        // Esperamos 45 segundos para que carguen sitios pesados
        await page.goto(finalUrl, { waitUntil: 'networkidle2', timeout: 45000 });
        
        const screenshot = await page.screenshot({ encoding: 'base64' });
        const texto = await page.evaluate(() => document.body.innerText);
        
        await browser.close();
        return { screenshot, texto: texto.substring(0, 10000), isUrl: true };
        
    } catch (e) {
        console.log(`[AVISO]: No se pudo navegar. Error: ${e.message}`);
        await browser.close();
        return { screenshot: null, texto: input, isUrl: false };
    }
}

module.exports = { captureAndScrape };
