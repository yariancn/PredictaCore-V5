// cerebro_tactico.js - RESTAURACIÓN DE INTELIGENCIA UNIVERSAL
const PROMPTS_MEJORADOS = {
    BENCHMARK_PRO: (url, d) => `USE GOOGLE SEARCH to identify 3 real competitors for ${url}. 
    Analyze their market authority and trust signals vs this asset. Dossier: ${d}`,

    FUGAS_PRO: (d) => `PERFORM A FULL FORENSIC AUDIT. Identify exactly 15 numbered friction findings (1. to 15.). 
    INSTRUCTION: You are a senior forensic auditor. Analyze ALL data provided (technical logs, console errors, load times, and screenshots). 
    Identify any anomaly, visual or functional, that disrupts the user journey or kills conversion. 
    Do not miss technical failures hidden in the logs. Use a cold, executive tone. Dossier: ${d}`
};
module.exports = { PROMPTS_MEJORADOS };
