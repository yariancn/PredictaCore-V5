const axios = require('axios');

async function llamarIA(instruccion, prompt) {
    // SEGURIDAD: Validamos que la llave exista antes de usarla
    const key = process.env.XAI_API_KEY ? process.env.XAI_API_KEY.trim() : null;
    
    if (!key) {
        throw new Error("ERROR: Falta la variable XAI_API_KEY en Railway.");
    }

    try {
        const r = await axios.post('https://api.x.ai/v1/chat/completions', {
            model: "grok-2-1212",
            messages: [
                { role: "system", content: instruccion },
                { role: "user", content: prompt }
            ],
            temperature: 0.1
        }, { 
            headers: { 
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            }, 
            timeout: 90000 
        });
        return r.data.choices[0].message.content;
    } catch (error) {
        const msg = error.response ? JSON.stringify(error.response.data) : error.message;
        throw new Error("Falla en xAI: " + msg);
    }
}

async function extraerDNA(url) {
    try {
        // Usamos JINA_API_KEY si existe, si no, va sin llave (limitado)
        const jinaKey = process.env.JINA_API_KEY ? process.env.JINA_API_KEY.trim() : "";
        const headers = jinaKey ? { 'Authorization': `Bearer ${jinaKey}` } : {};
        
        const r = await axios.get("https://r.jina.ai/" + url, { headers, timeout: 25000 });
        return r.data.substring(0, 15000);
    } catch (e) {
        throw new Error("Error extrayendo ADN del sitio: " + e.message);
    }
}

module.exports = { llamarIA, extraerDNA };
