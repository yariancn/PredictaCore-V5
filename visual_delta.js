function getHTMLDelta() {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>PredictaCore — Seguimiento Mensual</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap');
            body { font-family: 'Inter', sans-serif; }
            @media print {
                @page { size: A4; margin: 0.75in; }
                body { background: #fff !important; color: #0f172a !important; }
                .report-section { page-break-inside: avoid; margin-bottom: 1.5rem; }
            }
            .markdown-content h3 { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 1rem 0 0.5rem; text-transform: uppercase; }
            .markdown-content p, .markdown-content li { font-size: 10pt; line-height: 1.5; color: #334155; }
        </style>
    </head>
    <body class="bg-white text-slate-800 p-8">
        <header class="border-b-4 border-emerald-500 pb-4 mb-8">
            <div class="text-[10px] text-emerald-600 font-bold tracking-widest uppercase">PredictaCore // Seguimiento Mensual</div>
            <h1 class="text-2xl font-black text-slate-900 mt-2">REPORTE DE SEGUIMIENTO</h1>
            <p id="pdf-domain" class="text-xs text-slate-500 mt-1 font-mono"></p>
            <p class="text-[9px] text-slate-400 mt-2">PredictaCore · predictacore.ai</p>
        </header>
        <div id="reporte" class="markdown-content"></div>
    </body>
    </html>`;
}

module.exports = { getHTMLDelta };
