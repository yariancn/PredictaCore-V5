// visual_lite.js - MOLDE PARA EL REPORTE GRATUITO DE 2 PÁGINAS

function getHTMLLite() {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
            body { font-family: 'Inter', sans-serif; background: #ffffff; color: #0f172a; margin: 0; padding: 40px; }
            
            /* ESTILO PARA PDF LITE - SIN SALTOS DE PÁGINA FORZADOS */
            .cover-title { font-size: 2.5rem; font-weight: 800; color: #0f172a; text-transform: uppercase; line-height: 1.1; margin-bottom: 10px; }
            .cover-accent { width: 80px; height: 6px; background: #10b981; margin: 1rem 0; }
            .header-info { margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0; }
            
            /* LAS SECCIONES AHORA FLUYEN JUNTAS CON UN MARGEN */
            .report-section { margin-bottom: 30px; }
            
            .markdown-content h3 { 
                color: #0f172a; font-size: 1.3rem; font-weight: 800;
                border-bottom: 2px solid #10b981; padding-bottom: 5px; margin: 0 0 15px 0; text-transform: uppercase;
            }
            .markdown-content ul, .markdown-content ol { padding-left: 1.5rem; margin-bottom: 1.5rem; }
            .markdown-content li { margin-bottom: 0.8rem; line-height: 1.6; color: #0f172a; }
            .markdown-content p { font-size: 11pt; line-height: 1.6; color: #0f172a; text-align: justify; margin-bottom: 1.2rem; }
            
            /* Tablas */
            table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; border: 1px solid #e2e8f0; }
            th { background: #1e293b; color: #ffffff; padding: 12px; text-transform: uppercase; font-size: 9pt; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 10pt; }
            tr:nth-child(even) td { background: #f8fafc; }
        </style>
    </head>
    <body>
        <div class="header-info">
            <div style="color: #10b981; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-size: 10pt;">Forensic Conversion Report</div>
            <div class="cover-title">PredictaCore Titán<br><span style="font-size: 1.5rem; color: #64748b;">Lite Intelligence</span></div>
            <div class="cover-accent"></div>
            <div style="font-size: 12pt; color: #64748b; font-weight: 600;" id="pdf-domain">Asset Analysis</div>
        </div>
        
        <div id="reporte"></div>
    </body>
    </html>
    `;
}
module.exports = { getHTMLLite };
