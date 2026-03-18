const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let input = url.trim();
    const isUrl = input.includes('.') && !input.includes(' ');

    if (!isUrl) {
        return { screenshot: null, texto: input, isUrl: false };
    }

    let finalUrl = input.startsWith('http') ? input : `https://${input}`;
    console.log(`[BARRIDO 360]: Escaneando ecosistema en ${finalUrl}...`);
    
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 2000 }); 
        
        // Timeout de 60s para asegurar carga de flora y fauna (scripts/SEO)
        await page.goto(finalUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        
        const screenshot = await page.screenshot({ encoding: 'base64', fullPage: false });
        const texto = await page.evaluate(() => document.body.innerText);
        
        await browser.close();
        
        // CAPACIDAD 50K: Captura total de cabecera a footer
        return { screenshot, texto: texto.substring(0, 50000), isUrl: true };
        
    } catch (e) {
        console.log(`[AVISO]: Error en el escaneo: ${e.message}`);
        if (browser) await browser.close();
        return { screenshot: null, texto: input, isUrl: false };
    }
}

module.exports = { captureAndScrape };
