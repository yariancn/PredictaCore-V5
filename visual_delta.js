function getHTMLDelta() {
    return `
    <!DOCTYPE html>
    <html lang="en">
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
                #pdf-closing { display: block !important; page-break-inside: avoid; }
            }
            .markdown-content h3 { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 1rem 0 0.5rem; text-transform: uppercase; }
            .markdown-content p, .markdown-content li { font-size: 10pt; line-height: 1.5; color: #334155; }
            .delta-table { width: 100%; border-collapse: collapse; font-size: 9pt; margin: 12px 0; table-layout: fixed; }
            .delta-table th, .delta-table td { border: 1px solid #cbd5e1; padding: 7px 8px; text-align: left; vertical-align: top; word-wrap: break-word; }
            .delta-table th { background: #f1f5f9; font-weight: 800; color: #0f172a; }
            .delta-table td:nth-child(4), .delta-table th:nth-child(4) { width: 48px; text-align: center; }
            .delta-scorecard-summary { font-size: 10pt; margin: 8px 0 12px; color: #334155; }
            .delta-scorecard-note { font-size: 9pt; font-weight: 700; margin: 14px 0 6px; color: #0f172a; }
            .delta-scorecard-legend { font-size: 8.5pt; margin: 0 0 12px 0; padding-left: 18px; color: #475569; }
            .delta-scorecard-legend li { margin-bottom: 4px; }
            .delta-scorecard h3 { font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 8px; text-transform: uppercase; }
            .delta-glance { font-size: 9pt; margin: 0 0 12px 0; padding: 10px 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; list-style: none; }
            .delta-glance li { margin-bottom: 4px; color: #334155; }
            .pc-header-disclaimer { font-size: 7.5pt; color: #64748b; line-height: 1.4; margin: 8px 0 0 0; padding: 6px 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; }
            .pc-report-closing { margin-top: 28px; padding-top: 18px; page-break-inside: avoid; color: #475569; font-size: 9pt; line-height: 1.55; }
            .pc-closing-rule { width: 72px; height: 4px; background: #10b981; margin-bottom: 14px; }
            .pc-closing-lead { font-size: 10pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #0f172a; margin: 0 0 10px 0; }
            .pc-disclaimer { font-size: 8.5pt; background: #f8fafc; border-left: 3px solid #f59e0b; padding: 8px 10px; margin: 0 0 10px 0; }
            .pc-closing-meta { font-size: 8pt; font-weight: 700; letter-spacing: 0.06em; color: #64748b; margin-top: 14px; }
        </style>
    </head>
    <body class="bg-white text-slate-800 p-8">
        <header class="border-b-4 border-emerald-500 pb-4 mb-8">
            <div class="text-[10px] text-emerald-600 font-bold tracking-widest uppercase">PredictaCore // Monthly Monitoring</div>
            <h1 class="text-2xl font-black text-slate-900 mt-2">MONITORING REPORT</h1>
            <p id="pdf-domain" class="text-xs text-slate-500 mt-1 font-mono"></p>
            <div id="pdf-header-disclaimer"></div>
            <p class="text-[9px] text-slate-400 mt-2">PredictaCore · predictacore.ai</p>
        </header>
        <div id="reporte" class="markdown-content"></div>
        <div id="pdf-closing"></div>
    </body>
    </html>`;
}

module.exports = { getHTMLDelta };
