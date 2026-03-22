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
            /* TEMA OSCURO (PANTALLA DASHBOARD) */
            body { background: #050505; color: #a1a1aa; font-family: ui-sans-serif, system-ui; }
            .gold-text { color: #d4af37; }
            .terminal-box { background: #09090b; border: 1px solid #18181b; }
            .report-section { border-left: 2px solid #18181b; padding-left: 1.5rem; margin-bottom: 4rem; transition: all 0.5s; }
            .border-gold { border-color: #d4af37 !important; }
            
            /* ESTILOS DE TABLAS (PANTALLA) */
            table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; margin-bottom: 1.5rem; font-size: 0.875rem; background: #09090b; }
            th, td { border: 1px solid #27272a; padding: 1rem; text-align: left; vertical-align: top; }
            th { background: #18181b; color: #d4af37; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
            
            /* SEMÁFOROS UNIVERSALES (PANTALLA) */
            .badge-red { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid #7f1d1d; padding: 4px 10px; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 0.75rem; text-transform: uppercase;}
            .badge-yellow { background: rgba(234, 179, 8, 0.1); color: #facc15; border: 1px solid #713f12; padding: 4px 10px; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 0.75rem; text-transform: uppercase;}
            .badge-green { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid #14532d; padding: 4px 10px; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 0.75rem; text-transform: uppercase;}
            
            /* FORMATO DE TEXTO (PANTALLA) */
            .markdown-content h1, .markdown-content h2, .markdown-content h3 { color: #e4e4e7; margin-top: 2rem; margin-bottom: 1rem; font-weight: 600; }
            .markdown-content h3 { font-size: 1.1rem; color: #d4af37; text-transform: uppercase; letter-spacing: 0.05em; }
            .markdown-content p { margin-bottom: 1rem; line-height: 1.7; }
            .markdown-content ul, .markdown-content ol { margin-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
            .markdown-content li { margin-bottom: 0.5rem; line-height: 1.6; }
            .markdown-content strong { color: #ffffff; font-weight: 600; }

            /* TEMA IMPRESIÓN (PDF EJECUTIVO BLANCO Y ORO) */
            @media print {
                body { background: #ffffff !important; color: #111827 !important; font-size: 10pt; }
                .no-print { display: none !important; }
                .report-section { border-left: 3px solid #d4af37 !important; padding-left: 1.5rem; margin-bottom: 3rem; page-break-inside: avoid; }
                .markdown-content h1, .markdown-content h2, .markdown-content h3 { color: #000000 !important; page-break-after: avoid; }
                .markdown-content h3 { color: #b8860b !important; }
                .markdown-content strong { color: #000000 !important; }
                table { page-break-inside: avoid; width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #d1d5db !important; color: #111827 !important; background: #ffffff !important;}
                th { background: #f3f4f6 !important; color: #b8860b !important; }
                
                /* Semáforos en PDF (Fondo transparente, solo bordes y texto para impresión limpia) */
                .badge-red { background: transparent !important; color: #dc2626 !important; border: 1px solid #dc2626 !important; }
                .badge-yellow { background: transparent !important; color: #d97706 !important; border: 1px solid #d97706 !important; }
                .badge-green { background: transparent !important; color: #16a34a !important; border: 1px solid #16a34a !important; }
                
                @page { margin: 2cm; }
            }
        </style>
    </head>
    <body class="p-6 md:p-20">
        <div class="max-w-4xl mx-auto">
            <header class="mb-16 flex justify-between items-end no-print">
                <div>
                    <h1 class="text-3xl font-bold tracking-[0.2em] text-white uppercase">PREDICTACORE <span class="gold-text italic">TITÁN</span></h1>
                    <p class="text-zinc-600 text-[10px] mt-2 uppercase tracking-[0.3em]">Auditoría Forense de Conversión</p>
                </div>
                <button id="btn-pdf" onclick="window.print()" class="hidden border border-[#d4af37] text-[#d4af37] px-6 py-2 text-xs uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-colors duration-300">
                    Exportar PDF
                </button>
            </header>

            <div class="hidden print:block mb-10 border-b-2 border-[#d4af37] pb-4">
                <h1 class="text-3xl font-bold uppercase tracking-widest text-black">Reporte Forense PredictaCore</h1>
                <p class="text-gray-500 text-sm mt-1" id="pdf-date"></p>
            </div>

            <div class="terminal-box p-6 mb-12 no-print">
                <input type="text" id="dna" placeholder="Ingresa dominio (ej. marca.com)..." class="w-full bg-transparent text-white border-b border-zinc-800 p-2 focus:outline-none focus:border-gold placeholder-zinc-700">
                <button onclick="ejecutar()" id="btn-ejecutar" class="mt-6 bg-zinc-900 text-gold-text border border-zinc-800 px-6 py-3 text-xs uppercase tracking-[0.2em] hover:border-gold transition-all w-full">Ejecutar Auditoría</button>
            </div>
            
            <div id="status" class="text-[10px] tracking-[0.3em] text-zinc-500 mb-8 uppercase no-print"></div>
            
            <div id="reporte" class="space-y-4"></div>
        </div>

        <script>
            // Pone la fecha actual en el PDF
            document.getElementById('pdf-date').innerText = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

            // Motor de Semáforos Universal (Evalúa palabras clave de impacto)
            function aplicarSemaforos(htmlContent) {
                const div = document.createElement('div');
                div.innerHTML = htmlContent;
                
                const celdas = div.querySelectorAll('td');
                celdas.forEach(td => {
                    const texto = td.textContent.trim().toLowerCase();
                    
                    // ALERTA ROJA (Fugas, deficiencias, riesgos)
                    if (texto.includes('deficiente') || texto.includes('alto') || texto.includes('fuga') || texto.includes('riesgo') || texto.includes('negativo') || texto === 'no') {
                        td.innerHTML = \`<span class="badge-red">\${td.innerHTML}</span>\`;
                    }
                    // ALERTA AMARILLA (Parcial, no detectado, medio)
                    else if (texto.includes('parcial') || texto.includes('medio') || texto.includes('no evaluable') || texto.includes('no detectado') || texto.includes('presente')) {
                        td.innerHTML = \`<span class="badge-yellow">\${td.innerHTML}</span>\`;
                    }
                    // ALERTA VERDE (Óptimo, adecuado, coherente)
                    else if (texto.includes('óptimo') || texto.includes('coherente') || texto.includes('adecuada') || texto.includes('positivo') || texto === 'sí') {
                        td.innerHTML = \`<span class="badge-green">\${td.innerHTML}</span>\`;
                    }
                });
                return div.innerHTML;
            }

            async function ejecutar() {
                const dna = document.getElementById('dna').value;
                if (!dna) return;
                
                const btn = document.getElementById('btn-ejecutar');
                const status = document.getElementById('status');
                const reporte = document.getElementById('reporte');
                const btnPdf = document.getElementById('btn-pdf');
                
                btn.disabled = true;
                btnPdf.classList.add('hidden'); // Ocultar PDF mientras compila
                reporte.innerHTML = "";
                status.innerText = "EXTRAYENDO DOSSIER LITERAL Y PROCESANDO HEURÍSTICAS...";

                const etapas = [
                    {id: 'INTRO', title: 'I. Diagnóstico de Ingeniería'},
                    {id: 'GEMELOS', title: 'II. Perfiles Psicológicos'},
                    {id: 'SCORECARD', title: 'III. Scorecard PredictaCore'},
                    {id: 'VISIBILIDAD', title: 'IV. Visibilidad Externa'},
                    {id: 'BENCHMARK', title: 'V. Benchmarking Local'},
                    {id: 'SWOT', title: 'VI. Matriz Estratégica'},
                    {id: 'WISHLIST', title: 'VII. Lista de Deseos'},
                    {id: 'FUGAS', title: 'VIII. 15 Fugas de Capital'},
                    {id: 'ACCIONES', title: 'IX. 15 Acciones Tácticas'},
                    {id: 'HERRAMIENTAS', title: 'X. Herramientas de Escala'},
                    {id: 'OMNI', title: 'XI. Autoridad y Hoja de Ruta'}
                ];

                for (const etapa of etapas) {
                    const div = document.createElement('div');
                    div.className = "report-section animate-pulse";
                    div.id = "section-" + etapa.id;
                    // El título se oculta en la impresión porque la IA ya imprime su propio H3
                    div.innerHTML = '<h3 class="text-zinc-600 text-[10px] tracking-[0.5em] mb-4 uppercase no-print">' + etapa.title + '</h3>' +
                                     '<div id="content-' + etapa.id + '" class="markdown-content text-zinc-400 font-light italic">Analizando nodos...</div>';
                    reporte.appendChild(div);

                    try {
                        const res = await fetch('/diseccion', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ dna, etapaId: etapa.id })
                        });
                        const data = await res.json();
                        
                        const contentDiv = document.getElementById("content-" + etapa.id);
                        const sectionDiv = document.getElementById("section-" + etapa.id);
                        
                        sectionDiv.classList.remove('animate-pulse');
                        sectionDiv.classList.add('border-gold');
                        contentDiv.classList.remove('italic', 'text-zinc-400');
                        contentDiv.classList.add('text-zinc-300');
                        
                        // Renderiza el formato crudo a diseño HTML limpio
                        let htmlLimpio = marked.parse(data.content);
                        
                        // Si hay tablas (como Scorecard o FODA), aplica el motor de semáforos
                        if(htmlLimpio.includes('table')) {
                            htmlLimpio = aplicarSemaforos(htmlLimpio);
                        }
                        
                        contentDiv.innerHTML = htmlLimpio;
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    } catch (e) {
                        console.error(e);
                        document.getElementById("content-" + etapa.id).innerHTML = "<span class='text-red-500 font-bold'>ERROR DE RUPTURA: Fallo en la red o servidor.</span>";
                    }
                }
                status.innerText = "AUDITORÍA FINALIZADA. LISTO PARA DESPLIEGUE EJECUTIVO.";
                btn.disabled = false;
                btnPdf.classList.remove('hidden'); // Aparece el botón de Exportar
            }
        </script>
    </body>
    </html>\`;
}
module.exports = { getHTML };
