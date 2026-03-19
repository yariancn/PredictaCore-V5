const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let input = url.trim();
    const isUrl = input.includes('.') && !input.includes(' ');
    if (!isUrl) return { screenshot: null, texto: input, isUrl: false };

    let finalUrl = input.startsWith('http') ? input : `https://${input}`;
    console.log(`[EXTRACCIÓN PROFUNDA]: Entrando a las entrañas de ${finalUrl}...`);
    
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 2500 });
        
        // Esperamos a que la estructura esté lista para el análisis forense
        await page.goto(finalUrl, { waitUntil: 'networkidle2', timeout: 45000 });

        // EXTRACCIÓN MAESTRA: Texto + SEO + Estructura de Conversión
        const dataMaster = await page.evaluate(() => {
            return {
                texto: document.body.innerText,
                html_head: document.head.innerHTML.substring(0, 10000), // SEO y Scripts
                metas: Array.from(document.querySelectorAll('meta')).map(m => m.outerHTML).join('\n'),
                botones: Array.from(document.querySelectorAll('button, a.button')).map(b => b.innerText).join(' | ')
            };
        });

        const screenshot = await page.screenshot({ encoding: 'base64', fullPage: false });
        await browser.close();

        // Creamos el "Dossier de Entrañas"
        const dossier = `
        ### DOSSIER DE ENTRAÑAS TÉCNICAS ###
        [CONTENIDO VISUAL]: ${dataMaster.texto.substring(0, 40000)}
        [ESTRUCTURA SEO/META]: ${dataMaster.metas}
        [SCRIPTS Y CABECERA]: ${dataMaster.html_head}
        [NODOS DE ACCIÓN]: ${dataMaster.botones}
        `.trim();

        return { screenshot, texto: dossier, isUrl: true };
    } catch (e) {
        console.log(`[ERROR DE ENTRADA]: ${e.message}`);
        if (browser) await browser.close();
        return { screenshot: null, texto: input, isUrl: false };
    }
}

module.exports = { captureAndScrape };
