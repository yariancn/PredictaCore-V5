function getHTML() {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore Titán - Auditoría Forense</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        <style>
            body { background: #050505; color: #a1a1aa; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
            .gold-text { color: #d4af37; }
            .terminal-box { background: #09090b; border: 1px solid #18181b; }
            .report-section { border-left: 2px solid #18181b; padding-left: 1.5rem; margin-bottom: 4rem; transition: all 0.5s; }
            .border-gold { border-color: #d4af37 !important; }
            
            table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; margin-bottom: 1.5rem; font-size: 0.875rem; background: #09090b; }
            th, td { border: 1px solid #27272a; padding: 1rem; text-align: left; vertical-align: top; }
            th { background: #18181b; color: #d4af37; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
            
            .badge-red { color: #f87171; font-weight: 800; font-size: 1.2rem;}
            .badge-yellow { color: #facc15; font-weight: 800; font-size: 1.2rem;}
            .badge-green { color: #4ade80; font-weight: 800; font-size: 1.2rem;}
            
            .markdown-content h1, .markdown-content h2, .markdown-content h3 { color: #e4e4e7; margin-top: 2rem; margin-bottom: 1rem; font-weight: 600; }
            .markdown-content h3 { font-size: 1.1rem; color: #d4af37; text-transform: uppercase; letter-spacing: 0.05em; }
            .markdown-content p { margin-bottom: 1rem; line-height: 1.7; }
            .markdown-content ul, .markdown-content ol { margin-left: 1.5rem; margin-bottom: 1.5rem; }
            .markdown-content ul { list-style-type: disc; }
            .markdown-content ol { list-style-type: decimal; }
            .markdown-content li { margin-bottom: 0.8rem; line-height: 1.6; }
            .markdown-content strong { color: #ffffff; font-weight: 600; }

            /* HEMORRAGIA WEB */
            .hemorragia-critica { background-color: rgba(248, 113, 113, 0.2); color: #f87171; font-weight: 900; padding: 2px 6px; border-radius: 4px; display: inline-block; }

            /* REGLAS AGRESIVAS DE IMPRESIÓN PARA EL FORMATO TITÁN EJECUTIVO */
            @media print {
                @page { size: A4; margin: 2.5cm 2cm 2.5cm 2cm; }
                
                :root {
                    --black-core: #0A0A0A;
                    --green-electric: #39FF14;
                    --text-main: #1F2937;
                    --bg-light: #F9FAFB;
                    --alerta-suave-text: #991B1B; /* Rojo diluido y elegante */
                    --alerta-suave-bg: #FEE2E2; /* Fondo tenue para resaltar sin gritar */
                }
                
                body { background: #ffffff !important; color: var(--text-main) !important; font-size: 11pt; font-weight: 400; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.65; }
                .no-print { display: none !important; }
                
                .cover-page { display: flex; flex-direction: column; justify-content: center; height: 90vh; page-break-after: always; text-align: left; }
                .cover-title { font-size: 2.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 4px solid var(--black-core); padding-bottom: 1rem; margin-bottom: 2rem; color: var(--black-core) !important; }
                .cover-subtitle { font-size: 1.25rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; color: var(--black-core) !important; }
                .cover-meta { margin-top: auto; font-size: 0.875rem; font-weight: bold; border-top: 2px solid var(--black-core); padding-top: 1rem; color: var(--black-core) !important; }
                
                .report-section { page-break-before: always; border-left: none !important; padding-left: 0; margin-bottom: 2.5rem; padding-top: 0; }
                #section-INTRO { page-break-before: auto; }

                .markdown-content h1, .markdown-content h2, .markdown-content h3 { font-weight: 800; page-break-after: avoid; }
                
                /* TÍTULOS EJECUTIVOS: FONDO NEGRO, ACENTO VERDE ELÉCTRICO, LETRA BLANCA */
                .markdown-content h3 { 
                    background-color: var(--black-core) !important; 
                    color: #FFFFFF !important; 
                    padding: 12px 20px !important; 
                    border-left: 6px solid var(--green-electric) !important; 
                    margin-top: 30px !important; 
                    margin-bottom: 20px !important; 
                    font-size: 13pt !important; 
                    text-transform: uppercase !important; 
                    letter-spacing: 0.5px !important;
                    border-bottom: none !important;
                }
                
                .markdown-content p { line-height: 1.65; text-align: justify; orphans: 3; widows: 3; margin-bottom: 18px; color: var(--text-main) !important; }
                .markdown-content li { line-height: 1.65; text-align: justify; margin-bottom: 12px; page-break-inside: avoid; color: var(--text-main) !important; }
                .markdown-content strong { font-weight: 800; color: var(--black-core) !important; }
                
                /* TABLAS EJECUTIVAS */
                table { page-break-inside: auto; width: 100%; border-collapse: collapse; margin-top: 25px; margin-bottom: 25px; background: transparent !important; border: none !important; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                thead { display: table-header-group; }
                tfoot { display: table-footer-group; }
                tr { page-break-inside: avoid !important; page-break-after: auto; border-bottom: 1px solid #E5E7EB !important; }
                tr:nth-child(even) td { background-color: var(--bg-light) !important; }
                td, th { page-break-inside: avoid !important; }
                th { background-color: var(--black-core) !important; color: var(--green-electric) !important; padding: 14px !important; text-align: left !important; font-weight: 600 !important; text-transform: uppercase !important; border: none !important; }
                td { border: none !important; padding: 12px 14px !important; vertical-align: top !important; font-size: 10.5pt; color: var(--text-main) !important; }
                
                .badge-red { font-weight: 900; text-decoration: underline; color: var(--black-core) !important; }
                .badge-yellow { font-weight: 800; color: var(--black-core) !important; }
                .badge-green { font-weight: bold; color: var(--black-core) !important; }

                /* ETIQUETA HEMORRAGIA CRÍTICA IMPRESIÓN (Rojo Diluido) */
                .hemorragia-critica {
                    background-color: var(--alerta-suave-bg) !important;
                    color: var(--alerta-suave-text) !important;
                    font-weight: 900 !important;
                    padding: 2px 6px !important;
                    border-radius: 4px !important;
                    display: inline-block;
                }
            }
        </style>
    </head>
    <body class="p-6 md:p-20">
        
        <div class="hidden print:block fixed top-0 right-0 pt-4 pr-8 z-50">
            <img src="https://predictacore.com/tu-logo.png" alt="PredictaCore" style="height: 40px; width: auto;" onerror="this.style.display='none';">
            <span style="font-weight: 900; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.2em; border-bottom: 2px solid #000000; padding-bottom: 2px;">
                PREDICTACORE TITÁN
            </span>
        </div>

        <div class="max-w-4xl mx-auto">
            <header class="mb-16 flex justify-between items-end no-print">
                <div>
                    <h
