// visual_omni.js - MOLDE CORPORATIVO PREMIUM PARA OMNISCIENCIAS ($399)

function getHTMLOmni() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
            @page { size: A4; margin: 20mm 20mm; }
            body { font-family: 'Inter', sans-serif; background: #ffffff; color: #111827; margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
            .header-info { margin-bottom: 25px; padding-bottom: 15px; border-bottom: 3px solid #f59e0b; display: flex; justify-content: space-between; align-items: flex-end; }
            .cover-title { font-size: 2.2rem; font-weight: 800; color: #111827; text-transform: uppercase; line-height: 1; }
            .cover-subtitle { font-size: 1.2rem; color: #f59e0b; font-weight: 700; letter-spacing: 1px; margin-top: 5px; }
            .badge { background: #111827; color: #f59e0b; padding: 5px 12px; font-size: 8pt; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; border-radius: 4px; }
            .markdown-content h3 { color: #ffffff; background: #111827; font-size: 1.1rem; font-weight: 700; padding: 10px 15px; margin: 25px 0 15px 0; text-transform: uppercase; border-left: 5px solid #f59e0b; }
            .markdown-content p { font-size: 9.5pt; line-height: 1.6; color: #374151; text-align: justify; margin-bottom: 1rem; }
            table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; border: 1px solid #d1d5db; }
            th { background: #f3f4f6; color: #111827; padding: 10px; text-transform: uppercase; font-size: 8pt; text-align: left; border-bottom: 2px solid #111827; }
            td { padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 8.5pt; color: #4b5563; }
        </style>
    </head>
    <body>
        <div class="header-info">
            <div>
                <div class="cover-title">PREDICTACORE</div>
                <div class="cover-subtitle">OMNISCIENCIAS PROTOCOL</div>
            </div>
            <div style="text-align: right;">
                <div class="badge">Deep Forensic Scan</div>
                <div style="font-size: 9pt; color: #6b7280; font-weight: 600; margin-top: 8px;" id="pdf-domain">Asset Analysis</div>
            </div>
        </div>
        <div id="reporte" class="markdown-content"></div>
    </body>
    </html>
    `;
}
module.exports = { getHTMLOmni };
