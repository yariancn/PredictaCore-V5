// motor.js - Versión Deep Recon v102
const axios = require('axios');

async function scrapeDeep(url) {
    try {
        // 1. Definimos las subpáginas críticas de cualquier negocio
        const targets = [
            url,
            url.endsWith('/') ? url + 'contacto' : url + '/contacto',
            url.endsWith('/') ? url + 'servicios' : url + '/servicios',
            url.endsWith('/') ? url + 'precios' : url + '/precios'
        ];

        console.log("Iniciando Barrido de Perímetro en:", url);

        // 2. Ejecutamos raspado paralelo para ganar velocidad
        const scrapingPromises = targets.map(target => 
            axios.get(`https://r.jina.ai/${target}`, {
                headers: { "X-Return-Format": "markdown" } // Markdown es mejor para que Grok entienda
            }).catch(() => null) // Si una subpágina no existe, la ignoramos
        );

        const results = await Promise.all(scrapingPromises);
        
        // 3. Consolidamos toda la "verdad" del sitio en un solo bloque
        const fullText = results
            .filter(r => r && r.data)
            .map(r => r.data)
            .join("\n\n--- NUEVA SECCIÓN DETECTADA ---\n\n");

        return {
            text: fullText.substring(0, 15000), // Subimos a 15k caracteres para no perder el footer
            visuals: {} // Aquí iría tu lógica de Playwright si la usas
        };
    } catch (e) {
        throw new Error("Fallo en la exploración de profundidad: " + e.message);
    }
}

module.exports = { scrapeDeep };
