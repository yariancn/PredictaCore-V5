// motor.js
const puppeteer = require('puppeteer');
const axios = require('axios');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log(`[MOTOR TITÁN] Iniciando infiltración original en: ${input}`);
    
    // Lanzamiento ligero, sin parámetros experimentales que alerten a los firewalls
    browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const page = await browser.newPage();
    // Identidad de navegador estándar
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // LA CLAVE QUE FUNCIONABA: domcontentloaded no espera a los trackers de Shopify
    await page.goto(input, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(3000); // Pequeña ventana para imágenes lazy-load

    // Extraemos el texto crudo
    const fullText = await page.evaluate(() => document.body.innerText);
    
    // Extraemos visuales directamente del DOM
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt || '' })).filter(i => i.src.startsWith('http')).slice(0, 20)),
      buttons: await page.$$eval('button, a.btn, .btn', els => els.map(el => el.textContent.trim()).filter(t => t.length > 2))
    };

    await browser.close();

    if (fullText.length < 300) throw new Error("Shopify bloqueó el renderizado inicial.");
    
    return { text: fullText.substring(0, 45000), visuals };

  } catch (error) {
    if (browser) await browser.close();
    console.log(`[MOTOR TITÁN] Resistencia detectada (${error.message}). Activando Jina Reader API...`);
    
    try {
      // LA REPARACIÓN DEL FALLBACK: Leemos Jina en formato Markdown
      const res = await axios.get(`https://r.jina.ai/${input}`, {
          headers: { 'X-Return-Format': 'markdown' }
      });
      
      const markdown = res.data;
      
      // Extraemos las imágenes que Jina SÍ vio (formato ![alt](url))
      const imageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\)]+)\)/g;
      let images = [];
      let match;
      while ((match = imageRegex.exec(markdown)) !== null && images.length < 20) {
          images.push({ alt: match[1] || 'Imagen Jina', src: match[2] });
      }

      return { 
          text: markdown.substring(0, 45000), 
          visuals: { 
              images: images,
              buttons: ["[Botones indexados en texto]"],
              note: "Modo rescate Jina"
          } 
      };
    } catch (jinaErr) {
      return { text: "BLOQUEO ABSOLUTO. El sitio no es accesible.", visuals: {} };
    }
  }
}

module.exports = { scrapeDeep };
