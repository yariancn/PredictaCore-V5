// motor.js - Evolución Titán
const { chromium } = require('playwright'); 
// Sugerencia técnica: Instalar 'playwright-extra' y 'puppeteer-extra-plugin-stealth'

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };
  let browser;
  try {
    // 1. Lanzamiento con Stealth (Simulado aquí con headers y contexto)
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });
    
    const page = await context.newPage();
    
    // 2. Bypass de Intersticiales (Cloudflare/Shopify)
    await page.goto(input, { waitUntil: 'networkidle', timeout: 60000 });
    
    // Si es Red Social, necesitamos scroll específico para disparar carga de comentarios
    if (input.includes('instagram.com') || input.includes('tiktok.com')) {
        await page.waitForTimeout(5000); // Espera de renderizado dinámico
        await page.evaluate(() => window.scrollBy(0, 1000));
    }

    // 3. Extracción Multimodal
    const fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt })).slice(0, 15)),
      // Capturamos el "snapshot" visual si el texto falla
      screenshot: await page.screenshot({ encoding: "base64" }) 
    };

    await browser.close();
    return { text: fullText.substring(0, 50000), visuals };
  } catch (e) {
    if (browser) await browser.close();
    // Fallback a Jina con Headers de Autoridad
    const res = await axios.get(`https://r.jina.ai/${input}`, {
        headers: { "X-Return-Format": "markdown", "Authorization": `Bearer ${process.env.JINA_API_KEY}` }
    });
    return { text: res.data, visuals: {} };
  }
}
