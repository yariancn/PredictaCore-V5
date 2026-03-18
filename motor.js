const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let input = url.trim();
    const isUrl = input.includes('.') && !input.includes(' ');

    if (!isUrl) {
        return { screenshot: null, texto: input, isUrl: false };
    }

    let finalUrl = input.startsWith('http') ? input : `https://${input}`;
    console.log(`[BARRIDO 360]: Escaneando ecosistema en ${finalUrl}...`);
    
    let browser;
    try {
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage();
        // Viewport extendido para capturar la flora y fauna del sitio
        await page.setViewport({ width: 1440, height: 2000 }); 
        
        // Espera de 60s para asegurar carga de scripts de pago y SEO
        await page.goto(finalUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        
        const screenshot = await page.screenshot({ encoding: 'base64', fullPage: false });
        const texto = await page.evaluate(() => document.body.innerText);
        
        await browser.close();
        
        // CAPACIDAD 50K: Para no perder ni un logo del footer ni rastro de SEO
        return { screenshot, texto: texto.substring(0, 50000), isUrl: true };
        
    } catch (e) {
        console.log(`[AVISO]: Error en el escaneo: ${e.message}`);
        if (browser) await browser.close();
        return { screenshot: null, texto: input, isUrl: false };
    }
}

module.exports = { captureAndScrape };
