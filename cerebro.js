// motor.js - BÚNKER 6: MOTOR BIMODAL (E-COMMERCE + STEALTH PARA REDES SOCIALES)
const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let browser;
    try {
        // 1. DETECTOR DE ENTORNO
        const isSocialMedia = url.includes('instagram.com') || url.includes('facebook.com') || url.includes('tiktok.com');

        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage', 
                '--single-process', 
                '--disable-gpu',
                '--disable-blink-features=AutomationControlled' // Máscara anti-bot base
            ]
        });
        
        const startTime = Date.now();
        const page = await browser.newPage();
        
        // 2. MÁSCARA HUMANA (SOLO PARA REDES SOCIALES)
        if (isSocialMedia) {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8' });
        }
        
        let consoleErrors = [];
        page.on('pageerror', err => consoleErrors.push(err.message));
        page.on('requestfailed', request => {
            if (request.resourceType() === 'document' || request.resourceType() === 'script') {
                consoleErrors.push(`Fallo de recurso: ${request.url()}`);
            }
        });

        await page.setViewport({ width: 1280, height: 900 });
        
        // 3. BIFURCACIÓN DE CARGA (PROTECCIÓN DE TUS REPORTES ACTUALES)
        if (isSocialMedia) {
            // REDES SOCIALES: Extracción agresiva y rápida antes de que salte el muro de login
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await new Promise(r => setTimeout(r, 3500)); // Damos 3.5s para que los comentarios en JS rendericen
        } else {
            // SITIOS WEB (E-COMMERCE): Lógica actual intacta, sin modificaciones
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        }
        
        const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);
        
        // CÁMARA LIGERA: JPEG al 60%
        const desktopBase64 = await page.screenshot({ type: 'jpeg', quality: 60, encoding: 'base64' });

        await page.setViewport({ width: 390, height: 844, isMobile: true });
        await new Promise(r => setTimeout(r, 1000)); 
        const mobileBase64 = await page.screenshot({ type: 'jpeg', quality: 60, encoding: 'base64' });

        const dataForense = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script, style, noscript, iframe');
            scripts.forEach(s => s.remove());

            const imgs = Array.from(document.querySelectorAll('img'))
                .map(img => `[Imagen: ${img.alt || img.title || 'Sin descripción'}]`)
                .join(' | ');

            const botones = Array.from(document.querySelectorAll('a, button'))
                .map(b => b.innerText.trim())
                .filter(texto => texto.length > 2)
                .join(' | ');

            return {
                titulo: document.title,
                descripcion: document.querySelector('meta[name="description"]')?.content || "",
                cuerpo: document.body.innerText.substring(0, 45000),
                interactores: botones,
                visual: imgs
            };
        });

        await browser.close();
        const fechaHoy = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        
        const erroresReducidos = consoleErrors.slice(0, 3).join(' | ') || "Ninguno crítico detectado";

        const dossierTexto = `FECHA: ${fechaHoy} | TITULO: ${dataForense.titulo} | DESCRIPCION: ${dataForense.descripcion} | TIEMPO DE CARGA: ${loadTime} segundos | ERRORES CONSOLA: ${erroresReducidos} | CTAS: ${dataForense.interactores} | IMAGENES: ${dataForense.visual} | TEXTO: ${dataForense.cuerpo}`;

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
