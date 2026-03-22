const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let browser;
    try {
        console.log(`[MOTOR TITÁN]: Iniciando disección de: ${url}`);
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
        await page.setViewport({ width: 1280, height: 800 });
        
        // La clave original que sí funcionaba
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        
        const textoExtraido = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script, style, noscript, iframe');
            scripts.forEach(s => s.remove());
            
            return {
                titulo: document.title,
                descripcion: document.querySelector('meta[name="description"]')?.content || "",
                cuerpo: document.body.innerText.substring(0, 45000)
            };
        });

        await browser.close();
        console.log(`[MOTOR TITÁN]: Disección finalizada con éxito.`);
        
        return `TÍTULO: ${textoExtraido.titulo}\nDESCRIPCIÓN: ${textoExtraido.descripcion}\nCONTENIDO: ${textoExtraido.cuerpo}`;
        
    } catch (error) {
        console.error(`[FALLA DE MOTOR]: ${error.message}`);
        if (browser) await browser.close();
        return `ERROR CRÍTICO: Imposible extraer datos de ${url}.`;
    }
}

module.exports = { captureAndScrape };
