const puppeteer = require('puppeteer');

/**
 * MOTOR PREDICTACORE: Captura de Entrañas y Evidencia Visual
 * Optimizado para entornos de alta carga y contenedores.
 */
async function captureAndScrape(url) {
    let browser;
    try {
        console.log(`[MOTOR]: Iniciando disección de: ${url}`);
        
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        
        // Ajustamos la vista para "ver" como un humano (Desktop)
        await page.setViewport({ width: 1280, height: 800 });

        // Tiempo de espera inteligente para sitios pesados
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // 1. EXTRACCIÓN DE ENTRAÑAS (Texto y Metadatos)
        const texto = await page.evaluate(() => {
            // Limpiamos basura que no sirve para el análisis forense
            const scripts = document.querySelectorAll('script, style, noscript, iframe');
            scripts.forEach(s => s.remove());
            
            return {
                titulo: document.title,
                descripcion: document.querySelector('meta[name="description"]')?.content || "",
                cuerpo: document.body.innerText.substring(0, 50000), // Evitamos saturar el cerebro
                scriptsCount: document.querySelectorAll('script').length,
                links: document.querySelectorAll('a').length
            };
        });

        // 2. CAPTURA DE EVIDENCIA (Screenshot)
        // La comprimimos en Base64 para que el envío sea veloz
        const screenshot = await page.screenshot({ 
            encoding: 'base64', 
            type: 'jpeg', 
            quality: 70 
        });

        await browser.close();
        console.log(`[MOTOR]: Disección finalizada con éxito.`);

        return {
            texto: `TÍTULO: ${texto.titulo}\nDESCRIPCIÓN: ${texto.descripcion}\nCONTENIDO: ${texto.cuerpo}`,
            screenshot: screenshot
        };

    } catch (error) {
        console.error(`[FALLA DE MOTOR]: ${error.message}`);
        if (browser) await browser.close();
        throw new Error("El activo digital tiene bloqueos que impiden la disección.");
    }
}

module.exports = { captureAndScrape };
