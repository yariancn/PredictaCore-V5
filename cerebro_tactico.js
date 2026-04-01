// CerebroTactico.js - BALANCE TÉCNICO-VISUAL
const PROMPTS_MEJORADOS = {
    BENCHMARK_PRO: (url, d) => `USE GOOGLE SEARCH to find 3 real baby apparel competitors for ${url}. 
    Compare them in a table focusing on REAL market positioning and trust signals. Dossier: ${d}`,

    FUGAS_PRO: (d) => `Identify 15 critical friction findings. 
    INSTRUCTION: You MUST combine TECHNICAL DATA (Check the 'TIEMPO DE CARGA' and 'ERRORES CONSOLA' in the dossier text) with VISUAL EVIDENCE from the screenshots. 
    If Shop Pay or checkout errors are present in the text, report them with high priority. 
    Mark the most damaging as **[HEMORRAGIA CRÍTICA]**. Dossier: ${d}`
};
module.exports = { PROMPTS_MEJORADOS };
