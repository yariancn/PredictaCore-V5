// cerebro_tactico.js - INTELIGENCIA SIMBIÓPTICA UNIVERSAL
const PROMPTS_MEJORADOS = {
    BENCHMARK_PRO: (url, d) => `USE GOOGLE SEARCH to identify 3 real competitors for ${url}. 
    Analyze their market authority and trust signals vs this asset. Dossier: ${d}`,

    FUGAS_PRO: (d) => `Identify exactly 15 numbered friction findings (1. to 15.). 
    CRITICAL INSTRUCTION: Analyze the asset using a SYMBIOPTIC approach. 
    You must weigh TECHNICAL DATA (logs, console errors, load times) and VISUAL EVIDENCE (screenshots) with equal priority. 
    Identify any anomaly that disrupts the transaction or compromises user trust, regardless of its nature. 
    Use a forensic, high-level executive tone. DO NOT use bullets; use a numbered list. Dossier: ${d}`
};
module.exports = { PROMPTS_MEJORADOS };
