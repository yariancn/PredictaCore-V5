// estilos_titan.js - MAQUETACIÓN EJECUTIVA PROFESIONAL
const CSS_TITAN = `
<style>
    /* 1. TEXTO JUSTIFICADO Y LIMPIO */
    body { text-align: justify !important; line-height: 1.6; color: #1e293b; font-size: 11pt; font-family: sans-serif; }
    
    /* 2. ENCABEZADOS SOBRIOS (AZUL PIZARRA) */
    h3 { 
        color: #1e293b !important; 
        border-bottom: 2px solid #f1f5f9; 
        padding-bottom: 10px; 
        margin-top: 40px !important; 
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    /* 3. CÁPSULAS DE VALOR */
    .capsula-contexto { 
        background: #f8fafc; 
        border-left: 5px solid #1e293b; 
        padding: 15px; 
        margin: 10px 0 25px 0; 
        font-size: 10pt; 
        color: #64748b; 
        font-style: italic;
        text-align: justify !important;
    }

    /* 4. TABLAS LIMPIAS Y JUSTIFICADAS */
    table { width: 100%; border-collapse: collapse; margin: 20px 0; page-break-inside: avoid; border: 1px solid #e2e8f0; }
    th { 
        background-color: #f8fafc !important; 
        color: #1e293b !important; 
        border: 1px solid #cbd5e1; 
        padding: 12px; 
        font-weight: bold; 
        text-align: left; 
        font-size: 9pt; 
    }
    td { border: 1px solid #e2e8f0; padding: 12px; font-size: 9.5pt; vertical-align: top; text-align: justify !important; }

    /* 5. VIÑETAS ALINEADAS */
    ul, ol { padding-left: 20px !important; margin: 15px 0 !important; text-align: justify !important; }
    li { margin-bottom: 10px !important; list-style-position: outside !important; display: list-item !important; }
</style>
`;
module.exports = { CSS_TITAN };
