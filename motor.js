const puppeteer = require('puppeteer');

async function captureAndScrape(url) {
    let browser;
    try {
        const isSocialMedia = url.includes('instagram.com') || url.includes('facebook.com') || url.includes('tiktok.com');
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process', '--disable-gpu']
        });
        const page = await browser.newPage();
        if (isSocialMedia) await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        const desktopBase64 = await page.screenshot({ type: 'jpeg', quality: 60, encoding: 'base64' });
        await page.setViewport({ width: 375, height: 812, isMobile: true });
        const mobileBase64 = await page.screenshot({ type: 'jpeg', quality: 60, encoding: 'base64' });

        const data = await page.evaluate(() => {
            return { cuerpo: document.body.innerText.substring(0, 40000) };
        });

        await browser.close();
        return { isUrl: true, texto: data.cuerpo, desktopBase64, mobileBase64 };
    } catch (error) {
        if (browser) await browser.close();
        throw error;
    }
}
module.exports = { captureAndScrape };
