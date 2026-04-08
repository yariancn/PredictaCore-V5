// visual_lite.js - MOLDE EJECUTIVO PARA EL REPORTE GRATUITO

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
            
            /* CONFIGURACIÓN EXACTA DE MÁRGENES PARA PDF */
            @page { size: A4; margin: 20mm 25mm; }
            body { font-family: 'Inter', sans-serif; background: #ffffff; color: #0f172a; margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
            
            .header-info { margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid #e2e8f0; }
            .cover-title { font-size: 2.2rem; font-weight: 800; color: #0f172a; text-transform: uppercase; line-height: 1.1; margin-bottom: 8px; }
            .cover-accent { width: 80px; height: 6px; background: #10b981; margin: 15px 0; }
            
            .report-section { margin-bottom: 25px; page-break-inside: avoid; }
            
            .markdown-content h3 { 
                color: #0f172a; font-size: 1.2rem; font-weight: 800;
                border-bottom: 2px solid #10b981; padding-bottom: 5px; margin: 0 0 12px 0; text-transform: uppercase;
            }
            .markdown-content ul, .markdown-content ol { padding-left: 1.2rem; margin-bottom: 1.2rem; }
            .markdown-content li { margin-bottom: 0.6rem; line-height: 1.6; color: #1e293b; font-size: 10.5pt; }
            .markdown-content p { font-size: 10.5pt; line-height: 1.6; color: #1e293b; text-align: justify; margin-bottom: 1rem; }
            .markdown-content strong { color: #0f172a; font-weight: 700; }
            
            /* Tablas con estética de élite */
            table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 1.5rem 0; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; }
            th { background: #0f172a; color: #ffffff; padding: 12px; text-transform: uppercase; font-size: 8.5pt; text-align: left; letter-spacing: 0.5px; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 9.5pt; color: #334155; }
            tr:last-child td { border-bottom: none; }
            tr:nth-child(even) td { background: #f8fafc; }
        </style>
    </head>
    <body>
        <div class="header-info">
            <div style="color: #10b981; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-size: 9pt;">Forensic Conversion Report</div>
            <div class="cover-title">PredictaCore Titán<br><span style="font-size: 1.4rem; color: #64748b;">Lite Intelligence</span></div>
            <div class="cover-accent"></div>
            <div style="font-size: 11pt; color: #64748b; font-weight: 600;" id="pdf-domain">Asset Analysis</div>
        </div>
        
        <div id="reporte"></div>
    </body>
    </html>
    `;
}
module.exports = { getHTMLLite };
