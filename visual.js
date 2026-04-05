// visual.js - RESTAURADO CON ESTILOS DE CLASE MUNDIAL

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
            /* TUS ESTILOS ORIGINALES DE COLORES (RESTAURADOS) */
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');

            :root {
                --pc-green: #10b981;
                --pc-gold: #d4af37;
                --pc-crimson: #991b1b;
                --pc-crimson-bg: #fef2f2;
                --pc-dark: #0f172a;
                --pc-table-head: #1e293b;
                --pc-border: #e2e8f0;
            }

            body { background: #050505; color: #d1d5db; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
            .terminal-box { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; }

            /* ======================================================== */
            /* ESTILOS PRO INYECTADOS AQUÍ (SIN ROMPER EL SERVIDOR) */
            /* ======================================================== */
            .markdown-content ul, .markdown-content ol { margin-left: 0 !important; padding-left: 1.5rem !important; list-style-position: outside !important; }
            .markdown-content li { margin-bottom: 0.6rem !important; display: list-item !important; }

            .capsula-contexto { background: #f8fafc; border-left: 5px solid #10b981; padding: 16px 20px; margin-bottom: 25px; font-size: 13px; color: #64748b; font-style: italic; border-radius: 0 12px 12px 0; }

            table { width: 100%; border-collapse: collapse; margin: 25px 0; page-break-inside: avoid !important; }
            th { background: #1e293b; color: #ffffff; padding: 12px; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
            td { border: 1px solid #e2e8f0; padding: 12px; font-size: 13px; vertical-align: top; }

            h3 { color: #10b981 !important; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-top: 40px; text-transform: uppercase; font-weight: 800; page-break-after: avoid !important; }
            .report-section { page-break-before: always; padding-top: 20px; }
        </style>
    </head>
    <body>

        <script>
            // TUS SCRIPTS ORIGINALES DE INTERFAZ (RESTAURADOS)
            async function descargarPDFBackend() {
                const btn = document.getElementById('btn-pdf');
                btn.innerText = "CRISTALIZANDO..."; btn.disabled = true;
                
                // Enviar solo el área de impresión para evitar saturación
                const contenido = document.getElementById('impresion-area').innerHTML;
                const estilos = document.querySelector('style').innerHTML;
                const htmlFinal = \`<html><head><style>\${estilos}</style></head><body><div class="print-container">\${contenido}</div></body></html>\`;
                
                try {
                    const res = await fetch('/generate-pdf', { 
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify({ html: htmlFinal }) 
                    });
                    if (!res.ok) throw new Error();
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'PREDICTACORE_TITAN_REPORT.pdf'; a.click();
                } catch (e) {
                    alert("Error al cristalizar. Reintenta.");
                } finally {
                    btn.innerText = "Exportar Reporte Titán"; btn.disabled = false;
                }
            }
        </script>
    </body>
    </html>
    `;
}
module.exports = { getHTML };
