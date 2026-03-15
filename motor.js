const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    console.log(`[VISIÓN]: Entrando a las entrañas de ${url}`);
    
    // Configuración para Railway (necesita estos flags)
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1000 }); // Resolución de laptop
    
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // CAPTURA VISUAL (La prueba irrefutable)
        const screenshot = await page.screenshot({ encoding: 'base64' });
        
        // CAPTURA DE TEXTO (El ADN técnico)
        const texto = await page.evaluate(() => document.body.innerText);
        
        await browser.close();
        return { screenshot, texto: texto.substring(0, 12000) };
        
    } catch (error) {
        await browser.close();
        throw new Error(`Error de Visión: ${error.message}`);
    }
}

module.exports = { captureAndScrape };
