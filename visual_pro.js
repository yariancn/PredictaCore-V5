// visual_pro.js - ACTUALIZADO CON FIX DE VIÑETAS Y CONTEXTO

const ESTILOS_PRO = `
<style>
    /* 1. FIX DE VIÑETAS FUERA DE LUGAR */
    .markdown-content ul, .markdown-content ol {
        margin-left: 0 !important;
        padding-left: 1.5rem !important;
        list-style-position: outside !important;
    }
    .markdown-content li {
        margin-bottom: 0.8rem !important;
        line-height: 1.5;
        display: list-item !important;
    }

    /* 2. CÁPSULA DE CONTEXTO (HUMAN-FRIENDLY) */
    .capsula-contexto {
        background: #1e293b;
        border-left: 4px solid #10b981;
        padding: 12px 16px;
        margin-bottom: 20px;
        font-size: 13px;
        color: #94a3b8;
        font-style: italic;
        border-radius: 0 8px 8px 0;
    }

    /* 3. CONTROL DE SALTOS Y TABLAS */
    table { page-break-inside: avoid !important; margin-bottom: 25px; border-collapse: collapse; width: 100%; }
    .report-section { page-break-before: always; padding-top: 20px; }
    h3 { page-break-after: avoid !important; color: #10b981 !important; margin-top: 30px !important; }
</style>
`;

module.exports = { ESTILOS_PRO };
