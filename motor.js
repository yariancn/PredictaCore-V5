const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin()); // Activamos el camuflaje anti-bots
const axios = require('axios');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log(`[MOTOR TITÁN] Iniciando infiltración Stealth en: ${input}`);
    browser = await puppeteer.launch({ 
      headless: "new",
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--window-size=1280,800'
      ] 
    });
    
    const page = await browser.newPage();
    // Nos hacemos pasar por un usuario de Mac normal
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    
    // Entramos y esperamos a que el contenido principal cargue
    await page.goto(input, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await page.waitForTimeout(3000); // Espera estratégica para scripts de Shopify

    // Scroll humanoide: vital para que Shopify cargue las imágenes de los productos
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 150; // Scroll suave
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          // Bajamos hasta el fondo o hasta un límite seguro
          if (totalHeight >= document.body.scrollHeight || totalHeight > 8000) {
            clearInterval(timer);
            resolve();
          }
        }, 150);
      });
    });

    // Extraemos todo el texto visible
    const fullText = await page.evaluate(() => document.body.innerText);
    
    // Extraemos imágenes y botones (ignorando píxeles de rastreo)
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt || 'Sin alt' })).filter(i => i.src.startsWith('http') && !i.src.includes('pixel')).slice(0, 20)),
      buttons: await page.$$eval('button, a.btn, input[type="submit"]', els => els.map(el => el.textContent.trim()).filter(t => t.length > 2))
    };

    await browser.close();

    // Log para nosotros: Si extrae menos de 300 caracteres, seguimos bloqueados
    console.log(`[MOTOR TITÁN] Caracteres extraídos: ${fullText.length}`);
    console.log(`[MOTOR TITÁN] Imágenes encontradas: ${visuals.images.length}`);

    if (fullText.length < 300) throw new Error("Contenido insuficiente. Posible bloqueo de Cloudflare.");
    
    return { text: fullText.substring(0, 40000), visuals };

  } catch (error) {
    if (browser) await browser.close();
    console.error(`[MOTOR TITÁN] Fallo Stealth: ${error.message}. Activando sensor Jina.`);
    try {
      const res = await axios.get(`https://r.jina.ai/${input}`);
      return { text: res.data, visuals: { note: "Extracción de emergencia" } };
    } catch (jinaErr) {
      return { text: "BLOQUEO TOTAL. No se pudo acceder al sitio.", visuals: {} };
    }
  }
}

module.exports = { scrapeDeep };
