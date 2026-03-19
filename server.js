const express = require('express');
const { getHTML } = require('./visual');
const { captureAndScrape } = require('./motor');
const { PROMPTS } = require('./cerebro');
const { PROTOCOLOS_IA } = require('./protocolos');

const app = express();
app.use(express.json());

// NODO DE ENTRADA: Railway servirá tu página aquí
app.get('/', (req, res) => {
    res.send(getHTML());
});

// NODO DE DISECCIÓN: Procesa la auditoría
app.post('/diseccion', async (req, res) => {
    const { dna, etapaId } = req.body;
    try {
        const dataActivo = await captureAndScrape(dna);
        const promptTemplate = PROMPTS[etapaId.toLowerCase()];
        
        // Aquí se generará la sentencia de capital
        res.json({ 
            content: `[SISTEMA OPERATIVO]\n\nAnalizando: ${dna}\nFase: ${etapaId}\nProtocolo: UMCT-32` 
        });
    } catch (error) {
        res.status(500).json({ content: "ERROR DE DISECCIÓN: El activo digital tiene bloqueos de capital." });
    }
});

// CERTIDUMBRE TÉCNICA: Railway inyecta el puerto aquí
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PREDICTACORE TITÁN V32.0 DESPLEGADO EN PUERTO ${PORT}`);
});
