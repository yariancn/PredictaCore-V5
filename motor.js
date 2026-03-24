const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process', '--disable-gpu']
        });
        
        // 1. Iniciar Cronómetro
        const startTime = Date.now();
        const page = await browser.newPage();
        
        // 2. Encender Escáner de Consola (Errores invisibles)
        let consoleErrors = [];
        page.on('pageerror', err => consoleErrors.push(err.message));
        page.on('requestfailed', request => {
            if (request.resourceType() === 'document' || request.resourceType() === 'script') {
                consoleErrors.push(`Fallo de recurso: ${request.url()}`);
            }
        });

        // 3. Captura y Análisis: Versión ESCRITORIO
        await page.setViewport({ width: 1280, height: 900 });
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // Detener cronómetro de carga principal
        const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);
        
        // Foto Escritorio
        const desktopBase64 = await page.screenshot({ encoding: 'base64' });

        // 4. Captura: Versión MÓVIL (Simulación iPhone)
        await page.setViewport({ width: 390, height: 844, isMobile: true });
        await new Promise(r => setTimeout(r, 1000)); // Breve pausa para que el diseño responsivo se ajuste
        const mobileBase64 = await page.screenshot({ encoding: 'base64' });

        // 5. Extracción de Datos Crudos (Texto "Hasta la cocina")
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
        
        // Limpiar errores para no saturar a la IA
        const erroresReducidos = consoleErrors.slice(0, 3).join(' | ') || "Ninguno crítico detectado";

        // Armar el Dossier de Texto
        const dossierTexto = `FECHA: ${fechaHoy} | TITULO: ${dataForense.titulo} | DESCRIPCION: ${dataForense.descripcion} | TIEMPO DE CARGA: ${loadTime} segundos | ERRORES CONSOLA: ${erroresReducidos} | CTAS: ${dataForense.interactores} | IMAGENES: ${dataForense.visual} | TEXTO: ${dataForense.cuerpo}`;

        // Devolver el paquete completo (Texto + Imágenes)
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
