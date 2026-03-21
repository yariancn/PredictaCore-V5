const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);
const axios = require('axios');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log(`[MOTOR TITÁN] Iniciando infiltración profunda en: ${input}`);
    
    browser = await chromium.launch({ 
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--window-size=1920,1080'
      ] 
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      locale: 'es-ES,es;q=0.9',
      timezoneId: 'Europe/Madrid'
    });

    const page = await context.newPage();

    // Captura de Errores Críticos (Scripts rotos que matan la conversión)
    let technicalErrors = [];
    page.on('pageerror', err => technicalErrors.push(err.message));

    // Navegación Táctica: Esperamos a que la red esté casi vacía, con límite de seguridad
    const startTime = Date.now();
    await page.goto(input, { waitUntil: 'networkidle', timeout: 35000 }).catch(() => console.log("[MOTOR] Forzando continuación tras timeout de red."));
    const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);

    // Bypass Anti-Bot: Scroll humanoide para activar Lazy Loading de imágenes de producto
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 150);
      });
    });

    // Extracción de Identidad y Metadatos (Crucial para anclaje de nicho)
    const metaData = await page.evaluate(() => {
      const title = document.title;
      const desc = document.querySelector('meta[name="description"]')?.content || '';
      const h1 = Array.from(document.querySelectorAll('h1')).map(h => h.innerText).join(' | ');
      return { title, desc, h1 };
    });

    // Extracción Forense del Texto Renderizado (Eliminando código basura)
    const fullText = await page.evaluate(() => {
      const elementsToRemove = document.querySelectorAll('script, style, noscript, iframe, svg');
      elementsToRemove.forEach(el => el.remove());
      return document.body.innerText.replace(/\n+/g, '\n');
    });

    // Extracción de Evidencia Visual (Imágenes y Call To Actions)
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt || 'N/A' })).filter(i => i.src.startsWith('http') && !i.src.includes('pixel')).slice(0, 15)),
      buttons: await page.$$eval('button, a[role="button"], input[type="submit"], .btn', els => els.map(el => el.textContent.trim()).filter(t => t.length > 2)),
      loadTime,
      technicalErrors: technicalErrors.slice(0, 3)
    };

    await browser.close();

    // Verificación de Integridad: Si el sitio nos dio una página en blanco, lanzamos error
    if (fullText.length < 300) throw new Error("Bloqueo de contenido detectado (Payload vacío)");

    const finalDossier = `[METADATOS]\nTITULO: ${metaData.title}\nDESCRIPCION: ${metaData.desc}\nENCABEZADOS PRINCIPALES: ${metaData.h1}\n\n[CONTENIDO RENDERIZADO]\n${fullText}`;

    return { text: finalDossier.substring(0, 45000), visuals };

  } catch (e) {
    if (browser) await browser.close();
    console.error(`[MOTOR TITÁN] Extracción primaria fallida: ${e.message}. Activando Protocolo de Emergencia Jina.`);
    
    // Fallback: Usamos Jina Reader si el navegador completo es bloqueado por Cloudflare
    try {
      const res = await axios.get(`https://r.jina.ai/${input}`, { headers: { "X-Return-Format": "markdown" }, timeout: 15000 });
      return { text: res.data || "SITIO INACCESIBLE - BLOQUEO TOTAL", visuals: { note: "Extracción de Emergencia", loadTime: 'N/A', technicalErrors: [e.message] } };
    } catch (jinaErr) {
      return { text: "ERROR CRITICO: Servidor destino rechaza todas las conexiones.", visuals: {} };
    }
  }
}

module.exports = { scrapeDeep };
