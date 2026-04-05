// visual_pro.js - ESTÉTICA DE CLASE MUNDIAL

const ESTILOS_PRO = `
<style>
    /* 1. CONFIGURACIÓN DE PÁGINA Y TEXTO */
    body { font-family: 'Inter', sans-serif; color: #1e293b; line-height: 1.6; text-align: justify !important; }
    .markdown-content ul, .markdown-content ol { margin-left: 0 !important; padding-left: 1.5rem !important; list-style-position: outside !important; }
    .markdown-content li { margin-bottom: 0.6rem !important; display: list-item !important; }

    /* 2. CÁPSULA DE CONTEXTO (VALOR AGREGADO) */
    .capsula-contexto {
        background: #f8fafc;
        border-left: 5px solid #10b981;
        padding: 16px 20px;
        margin-bottom: 25px;
        font-size: 13px;
        color: #64748b;
        font-style: italic;
        border-radius: 0 12px 12px 0;
    }

    /* 3. TABLAS DE ALTA GAMA */
    table { width: 100%; border-collapse: collapse; margin: 25px 0; page-break-inside: avoid !important; }
    th { background: #1e293b; color: #ffffff; padding: 12px; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
    td { border: 1px solid #e2e8f0; padding: 12px; font-size: 13px; vertical-align: top; }

    /* 4. TÍTULOS Y SECCIONES */
    h3 { color: #10b981 !important; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-top: 40px; text-transform: uppercase; font-weight: 800; page-break-after: avoid !important; }
    .report-section { page-break-before: always; padding-top: 20px; }
</style>
`;

module.exports = { ESTILOS_PRO };
