// visual_omni.js - MOLDE PARA EL REPORTE FORENSE OMNI (45 PUNTOS)

function getHTMLOmni() {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore OMNI - Auditoría Forense Total</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
            :root {
                --pc-green: #10b981;
                --pc-gold: #d4af37;
                --pc-crimson: #991b1b;
                --pc-dark: #0f172a;
            }
            body { background: #050505; color: #d1d5db; font-family: 'Inter', sans-serif; }
            .terminal-box { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; }
            @media print {
                body { background: white; color: black; }
                .no-print { display: none; }
                .terminal-box { border: none; background: white; }
                .page-break { page-break-before: always; }
            }
            .report-section { margin-bottom: 2rem; padding: 1.5rem; border-left: 4px solid var(--pc-green); background: rgba(30, 41, 59, 0.5); }
        </style>
    </head>
    <body class="p-4 md:p-8">
        <div id="impresion-area" class="max-w-4xl mx-auto">
            <div class="flex justify-between items-end border-b border-gray-800 pb-6 mb-8">
                <div>
                    <h1 class="text-4xl font-800 text-white tracking-tighter">PREDICTACORE <span class="text-green-500">OMNI</span></h1>
                    <p class="text-xs text-gray-500 font-mono mt-1" id="pdf-domain">PROTOCOL: FULL FORENSIC SCAN / 45 NODES</p>
                </div>
                <div class="text-right">
                    <p class="text-[10px] text-gray-500 font-mono uppercase">Status: Finalizado</p>
                    <p class="text-[10px] text-gray-500 font-mono uppercase">Nivel: Inteligencia Máxima</p>
                </div>
            </div>

            <div id="reporte" class="space-y-6">
                </div>
        </div>

        <div class="text-center mt-12 no-print">
            <button id="btn-pdf" onclick="descargarPDFOmni()" class="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-full font-bold transition-all">
                Exportar Auditoría OMNI
            </button>
        </div>

        <script>
            async function descargarPDFOmni() {
                const btn = document.getElementById('btn-pdf');
                btn.innerText = "CRISTALIZANDO OMNI..."; btn.disabled = true;
                const contenido = document.getElementById('impresion-area').innerHTML;
                const estilos = document.querySelector('style').innerHTML;
                const htmlFinal = \`<html><head><style>\${estilos}</style></head><body>\${contenido}</body></html>\`;
                
                try {
                    const res = await fetch('/generate-pdf', { 
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify({ html: htmlFinal }) 
                    });
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'PREDICTACORE_OMNI.pdf'; a.click();
                } catch (e) { alert("Error al generar."); } finally { btn.innerText = "Exportar Auditoría OMNI"; btn.disabled = false; }
            }
        </script>
    </body>
    </html>
    `;
}
module.exports = { getHTMLOmni };
