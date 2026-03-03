const axios = require('axios');

async function llamarIA(instruccion, prompt) {
    const key = (process.env.XAI_API_KEY || "").trim();
    if (!key) throw new Error("FALTA_LLAVE_XAI: Configura XAI_API_KEY en Railway.");

    try {
        const r = await axios.post('https://api.x.ai/v1/chat/completions', {
            // MODELO IDENTIFICADO: Sincronizado con tu consola de xAI
            model: "grok-4-latest", 
            messages: [
                { role: "system", content: instruccion },
                { role: "user", content: prompt }
            ],
            temperature: 0.1,
            stream: false
        }, { 
            headers: { 
                'Authorization': `Bearer ${key}`, 
                'Content-Type': 'application/json' 
            }, 
            timeout: 90000 
        });
        return r.data.choices[0].message.content;
    } catch (e) {
        const detail = e.response ? JSON.stringify(e.response.data) : e.message;
        throw new Error("XAI_FAIL: " + detail);
    }
}

async function extraerDNA(url) {
    try {
        const jinaKey = (process.env.JINA_API_KEY || "").trim();
        const headers = jinaKey ? { 'Authorization': `Bearer ${jinaKey}` } : {};
        const r = await axios.get("https://r.jina.ai/" + url, { headers, timeout: 25000 });
        return r.data.substring(0, 15000);
    } catch (e) { throw new Error("JINA_FAIL: " + e.message); }
}

module.exports = { llamarIA, extraerDNA };
