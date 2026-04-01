// cerebro_tactico.js - MEJORAS DE PRECISIÓN (SIN TOCAR ARCHIVOS BASE)

const PROMPTS_MEJORADOS = {
    BENCHMARK_PRO: (url, d) => `USE THE GOOGLE SEARCH TOOL to identify 3 REAL competitors of ${url} in the baby personalized clothing niche. 
    Compare them against ${url} in this table:
    1. Value Proposition.
    2. Authority Level.
    3. Mobile Experience.
    4. Trust Signals.
    Dossier: ${d}`,

    FUGAS_PRO: (d) => `Identify 15 critical friction leaks. 
    INSTRUCTION: You MUST reference specific visual details from the Desktop and Mobile screenshots provided. 
    Mention colors, layout overlaps, or button clarity. Mark the worst as **[CRITICAL HEMORRHAGE]**.
    Dossier: ${d}`
};

module.exports = { PROMPTS_MEJORADOS };
