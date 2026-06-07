// visual_lite.js - REPORTE LITE CON MARCA PREDICTACORE

const { getPdfCoverBrandHtml, getPdfBrandStyles } = require('./brand');

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
            @page { size: A4; margin: 15mm 20mm; }
            body { font-family: 'Inter', sans-serif; background: #ffffff; color: #0f172a; margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
            ${getPdfBrandStyles()}
            .header-info { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e2e8f0; }
            .cover-title { font-size: 1.5rem; font-weight: 800; color: #64748b; text-transform: uppercase; line-height: 1.1; margin-top: 8px; }
            .cover-accent { width: 80px; height: 5px; background: #10b981; margin: 10px 0; }
            .report-section { margin-bottom: 20px; page-break-inside: avoid; }
            .markdown-content h3 {
                color: #0f172a; font-size: 1.15rem; font-weight: 800;
                border-bottom: 2px solid #10b981; padding-bottom: 4px; margin: 0 0 10px 0; text-transform: uppercase;
            }
            .markdown-content ul, .markdown-content ol { padding-left: 1.2rem; margin-bottom: 1rem; }
            .markdown-content li { margin-bottom: 0.5rem; line-height: 1.5; color: #1e293b; font-size: 10pt; }
            .markdown-content p { font-size: 10pt; line-height: 1.5; color: #1e293b; text-align: justify; margin-bottom: 0.8rem; }
            .markdown-content strong { color: #0f172a; font-weight: 700; }
            table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 1rem 0; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; }
            th { background: #0f172a; color: #ffffff; padding: 10px; text-transform: uppercase; font-size: 8pt; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 9pt; color: #334155; }
            tr:last-child td { border-bottom: none; }
            tr:nth-child(even) td { background: #f8fafc; }
            .lite-titan-cta {
                margin-top: 28px; padding: 18px; border: 2px solid #10b981; border-radius: 8px;
                background: #ecfdf5; page-break-inside: avoid;
            }
            .lite-titan-cta h3 { color: #065f46; font-size: 11pt; margin: 0 0 8px 0; text-transform: uppercase; border: none; }
            .lite-titan-cta p { font-size: 9.5pt; color: #047857; margin: 0; line-height: 1.5; word-break: break-all; }
        </style>
    </head>
    <body>
        <div class="header-info">
            ${getPdfCoverBrandHtml()}
            <div class="cover-title">Lite Intelligence Report</div>
            <div class="cover-accent"></div>
            <div id="pdf-metrics"></div>
            <div style="font-size: 10.5pt; color: #64748b; font-weight: 600;" id="pdf-domain">Asset Analysis</div>
        </div>
        <div id="evidence-area"></div>
        <div id="reporte"></div>
    </body>
    </html>
    `;
}
module.exports = { getHTMLLite };
