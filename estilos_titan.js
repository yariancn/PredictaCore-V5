// EstilosTitan.js - MAQUETACIÓN EJECUTIVA DE ALTA PRECISIÓN
const CSS_TITAN = `
<style>
    /* 1. ESTRUCTURA EJECUTIVA */
    body { 
        text-align: justify; 
        line-height: 1.6; 
        color: #1e293b;
        font-size: 11pt;
    }
    
    .report-section { page-break-inside: avoid; margin-bottom: 40px; }
    
    /* 2. TÍTULOS CON AUTORIDAD (VERDE PREDICTACORE) */
    h3 { 
        color: #059669 !important; 
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 8px;
        margin-top: 35px !important;
        text-align: left;
        page-break-after: avoid;
    }

    /* 3. CÁPSULAS DE CONTEXTO (VALOR PARA EL CLIENTE) */
    .capsula-contexto {
        background: #f8fafc;
        border-left: 4px solid #059669;
        padding: 12px 18px;
        margin: 10px 0 20px 0;
        font-size: 10pt;
        color: #475569;
        font-style: italic;
    }

    /* 4. LIMPIEZA DE TABLAS (SIN CABECERAS NEGRAS) */
    table { 
        width: 100%; 
        border-collapse: collapse; 
        margin: 20px 0; 
        page-break-inside: avoid;
    }
    th { 
        background-color: #f1f5f9 !important; 
        color: #0f172a !important; 
        border: 1px solid #cbd5e1; 
        padding: 12px;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 9pt;
    }
    td { 
        border: 1px solid #e2e8f0; 
        padding: 10px; 
        font-size: 9.5pt;
    }

    /* 5. ALINEACIÓN DE VIÑETAS */
    ul, ol { 
        padding-left: 25px !important; 
        margin: 15px 0 !important;
    }
    li { 
        margin-bottom: 10px !important;
        list-style-position: outside !important;
    }

    /* Resalte de hallazgos críticos */
    strong { color: #b91c1c; } 
</style>
`;
module.exports = { CSS_TITAN };
