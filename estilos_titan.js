// estilos_titan.js - MAQUETACIÓN DE ÉLITE PARA EL PDF

const CSS_TITAN = `
<style>
    /* Evita que las tablas se corten entre páginas */
    table, .report-section { page-break-inside: avoid !important; margin-bottom: 30px; }
    
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

    h3 { 
        color: #10b981 !important; 
        border-bottom: 2px solid #1e293b; 
        padding-bottom: 10px; 
        margin-top: 40px !important; 
        page-break-after: avoid !important;
    }
    
    /* Resalte visual para Hemorragias */
    strong { 
        color: #ef4444 !important; 
    }

    /* Mejora de legibilidad en listas */
    li { margin-bottom: 15px !important; line-height: 1.6; }
</style>
`;

module.exports = { CSS_TITAN };
