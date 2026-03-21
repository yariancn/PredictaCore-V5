const puppeteer = require('puppeteer');
const axios = require('axios');

async function scrapeDeep(input) {
  if (!input.startsWith('http')) return { text: input, visuals: {} };

  let browser;
  try {
    console.log(`[MOTOR TITÁN] Iniciando infiltración original en: ${input}`);
    browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const page = await browser.newPage();
    await page.goto(input, { waitUntil: 'networkidle2', timeout: 35000 });

    // Scroll original para cargar elementos
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    const fullText = await page.evaluate(() => document.body.innerText);
    const visuals = {
      images: await page.$$eval('img', imgs => imgs.map(img => ({ src: img.src, alt: img.alt || '' })).slice(0, 15)),
      buttons: await page.$$eval('button, a, input[type="submit"]', els => els.map(el => el.textContent.trim()).filter(t => t.length > 2))
    };

    await browser.close();

    if (fullText.length < 200) throw new Error("Contenido insuficiente");
    return { text: fullText.substring(0, 45000), visuals };

  } catch (error) {
    if (browser) await browser.close();
    console.log(`[MOTOR TITÁN] Fallo en Puppeteer. Activando Jina: ${error.message}`);
    try {
      const res = await axios.get(`https://r.jina.ai/${input}`);
      return { text: res.data, visuals: {} };
    } catch (jinaErr) {
      return { text: "No detectado. Sitio inaccesible.", visuals: {} };
    }
  }
}

module.exports = { scrapeDeep };
