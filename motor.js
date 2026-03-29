// motor.js - BÚNKER 6.2: TÁCTICA DE ESPEJO (BYPASS DEFINITIVO PARA INSTAGRAM)
const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let browser;
    try {
        let targetUrl = url;
        const isInstagram = url.includes('instagram.com');
        const isSocialMedia = isInstagram || url.includes('facebook.com') || url.includes('tiktok.com');

        // TÁCTICA DE ESPEJO: Si es Instagram, enrutamos el motor hacia un visor público sin muros
        if (isInstagram) {
            // Extrae "pamandander" de "instagram.com/pamandander"
            const parts = url.split('/');
            const username = parts[parts.length - 1] || parts[parts.length - 2];
            targetUrl = `https://www.picuki.com/profile/${username}`;
        }

        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage', 
                '--single-process', 
                '--disable-gpu',
                '--disable-blink-features=AutomationControlled'
            ]
        });
        
        const startTime = Date.now();
        const page = await browser.newPage();
        
        if (isSocialMedia) {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8' });
            
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'webdriver', { get: () => false });
            });
        }
        
        let consoleErrors = [];
        page.on('pageerror', err => consoleErrors.push(err.message));
        
        await page.setViewport({ width: 1280, height: 900 });
        
        if (isSocialMedia) {
            // El motor carga el espejo público sin interrupciones de inicio de sesión
            await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await new Promise(r => setTimeout(r, 4000)); 
            await page.evaluate(() => window.scrollBy(0, 800));
            await new Promise(r => setTimeout(r, 1500));
        } else {
            // TUS REPORTES WEB SIGUEN INTACTOS (El motor usa tu URL original)
            await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        }
        
        const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);
        
        const desktopBase64 = await page.screenshot({ type: 'jpeg', quality: 60, encoding: 'base64' });

        await page.setViewport({ width: 390, height: 844, isMobile: true });
        await new Promise(r => setTimeout(r, 1000)); 
        const mobileBase64 = await page.screenshot({ type: 'jpeg', quality: 60, encoding: 'base64' });

        const dataForense = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script, style, noscript, iframe');
            scripts.forEach(s => s.remove());

            const metaDesc = document.querySelector('meta[name="description"]')?.content || document.querySelector('meta[property="og:description"]')?.content || "";
            const metaTitle = document.querySelector('meta[property="og:title"]')?.content || document.title;

            const imgs = Array.from(document.querySelectorAll('img'))
                .map(img => `[Imagen: ${img.alt || img.title || 'Sin descripción'}]`)
                .join(' | ');

            const botones = Array.from(document.querySelectorAll('a, button'))
                .map(b => b.innerText.trim())
                .filter(texto => texto.length > 2)
                .join(' | ');

            return {
                titulo: metaTitle,
                descripcion: metaDesc,
                cuerpo: document.body.innerText.substring(0, 45000),
                interactores: botones,
                visual: imgs
            };
        });

        await browser.close();
        const fechaHoy = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        
        const erroresReducidos = consoleErrors.slice(0, 3).join(' | ') || "Ninguno crítico detectado";

        // Filtro de limpieza: Si usamos el espejo, borramos la palabra "Picuki" para que la IA siga sabiendo que es Instagram
        let cuerpoLimpio = dataForense.cuerpo.replace(/Picuki/gi, 'Instagram').substring(0, 45000);

        const dossierTexto = `FECHA: ${fechaHoy} | TITULO: ${dataForense.titulo} | DESCRIPCION: ${dataForense.descripcion} | TIEMPO DE CARGA: ${loadTime} segundos | ERRORES CONSOLA: ${erroresReducidos} | CTAS: ${dataForense.interactores} | IMAGENES: ${dataForense.visual} | TEXTO: ${cuerpoLimpio}`;

        return { 
            isUrl: true, 
            texto: dossierTexto, 
            desktopBase64: desktopBase64, 
            mobileBase64: mobileBase64 
        };

    } catch (error) {
        if (browser) await browser.close();
        return { 
            isUrl: false, 
            texto: `ERROR_MOTOR: ${error.message}` 
        };
    }
}

module.exports = { captureAndScrape };
