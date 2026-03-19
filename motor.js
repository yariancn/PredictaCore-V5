const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let browser;
    try {
        let targetUrl = url.trim();
        if (!targetUrl.startsWith('http')) {
            targetUrl = 'https://' + targetUrl;
        }

        console.log(`[MOTOR]: Iniciando disección de: ${targetUrl}`);
        
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        const texto = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script, style, noscript, iframe');
            scripts.forEach(s => s.remove());
            return {
                titulo: document.title,
                descripcion: document.querySelector('meta[name="description"]')?.content || "",
                cuerpo: document.body.innerText.substring(0, 50000)
            };
        });

        const screenshot = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 70 });
        await browser.close();
        
        return {
            texto: `TÍTULO: ${texto.titulo}\nDESCRIPCIÓN: ${texto.descripcion}\nCONTENIDO: ${texto.cuerpo}`,
            screenshot: screenshot
        };

    } catch (error) {
        if (browser) await browser.close();
        throw new Error(`[FALLA DE MOTOR]: ${error.message}`);
    }
}

// LÍNEA CRÍTICA DE CAPITAL: Sin esto, el servidor no puede llamar a la función
module.exports = { captureAndScrape };
