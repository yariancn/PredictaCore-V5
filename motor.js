const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let input = url.trim();
    
    // Lógica de detección: ¿Es una URL o una Idea?
    // Si tiene espacios o no tiene puntos, lo tratamos como concepto puro.
    const isPotentiallyUrl = input.includes('.') && !input.includes(' ');

    if (!isPotentiallyUrl) {
        return { screenshot: null, texto: input, isUrl: false };
    }

    // Normalizamos la URL
    let finalUrl = input.startsWith('http') ? input : `https://${input}`;

    console.log(`[VISIÓN]: Intentando disección visual de ${finalUrl}...`);
    
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    });

    try {
        const page = await browser.newPage();
        // Resolución de alta gama para análisis semiótico preciso
        await page.setViewport({ width: 1440, height: 900 });
        
        // Esperamos a que la red esté tranquila para capturar todo
        await page.goto(finalUrl, { waitUntil: 'networkidle2', timeout: 50000 });
        
        const screenshot = await page.screenshot({ encoding: 'base64' });
        const texto = await page.evaluate(() => document.body.innerText);
        
        await browser.close();
        return { screenshot, texto: texto.substring(0, 10000), isUrl: true };
        
    } catch (e) {
        console.log(`[AVISO]: No se pudo abrir la web (${e.message}). Pasando a modo concepto.`);
        await browser.close();
        return { screenshot: null, texto: input, isUrl: false };
    }
}

module.exports = { captureAndScrape };
