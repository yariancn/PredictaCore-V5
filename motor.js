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
        // Viewport amplio para capturar la jerarquía visual completa
        await page.setViewport({ width: 1440, height: 2000 }); 
        
        // Esperamos a que la red esté inactiva para capturar scripts de pago y SEO
        await page.goto(finalUrl, { waitUntil: 'networkidle2', timeout: 50000 });
        
        const screenshot = await page.screenshot({ encoding: 'base64', fullPage: false });
        const texto = await page.evaluate(() => document.body.innerText);
        
        await browser.close();
        
        // EXPANSIÓN A 50,000: Capturamos Bosque, Árboles y Flora (SEO/Footer/Scripts)
        return { screenshot, texto: texto.substring(0, 50000), isUrl: true };
        
    } catch (e) {
        console.log(`[AVISO]: Error en el escaneo: ${e.message}`);
        await browser.close();
        return { screenshot: null, texto: input, isUrl: false };
    }
}

module.exports = { captureAndScrape };        return { screenshot: null, texto: input, isUrl: false };
    }
}

module.exports = { captureAndScrape };
