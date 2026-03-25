function getHTML() {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore Titán - Auditoría Forense</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body { background: #050505; color: #a1a1aa; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
            .gold-text { color: #d4af37; }
            .terminal-box { background: #09090b; border: 1px solid #18181b; }
            .report-section { border-left: 2px solid #18181b; padding-left: 1.5rem; margin-bottom: 4rem; transition: all 0.5s; }
            .border-gold { border-color: #d4af37 !important; }
            table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; margin-bottom: 1.5rem; font-size: 0.875rem; background: #09090b; }
            th, td { border: 1px solid #27272a; padding: 1rem; text-align: left; vertical-align: top; }
            th { background: #18181b; color: #d4af37; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
            .badge-red { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid #7f1d1d; padding: 4px 10px; border-radius: 4px; font-weight: 600; font-size: 0.75rem; text-transform: uppercase;}
            .badge-yellow { background: rgba(234, 179, 8, 0.1); color: #facc15; border: 1px solid #713f12; padding: 4px 10px; border-radius: 4px; font-weight: 600; font-size: 0.75rem; text-transform: uppercase;}
            .badge-green { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid #14532d; padding: 4px 10px; border-radius: 4px; font-weight: 600; font-size: 0.75rem; text-transform: uppercase;}
            .markdown-content h3 { font-size: 1.1rem; color: #d4af37; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;}
            .markdown-content p { margin-bottom: 1rem; line-height: 1.7; }
            .markdown-content ul, .markdown-content ol { margin-left: 1.5rem; margin-bottom: 1.5rem; }
            .markdown-content ul { list-style-type: disc; }
            .markdown-content ol { list-style-type: decimal; }
            .markdown-content li { margin-bottom: 0.8rem; line-height: 1.6; }
            .markdown-content strong { color: #ffffff; font-weight: 600; }

            @media print {
                @page { size: A4; margin: 2cm; }
                body { background: #ffffff !important; color: #1f2937 !important; font-size: 10pt; }
                .no-print { display: none !important; }
                .cover-page { display: flex; flex-direction: column; justify-content: center; height: 90vh; page-break-after: always; text-align: left; }
                .cover-title { font-size: 2.5rem; font-weight: 800; color: #111827; text-transform: uppercase; border-bottom: 4px solid #b8860b; padding-bottom: 1rem; margin-bottom: 2rem; }
                .cover-subtitle { font-size: 1.25rem; color: #4b5563; text-transform: uppercase; letter-spacing: 0.2em; }
                .cover-meta { margin-top: auto; font-size: 0.875rem; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 1rem; }
                .report-section { page-break-before: always; border-left: 3px solid #b8860b !important; padding-left: 1.5rem; margin-bottom: 2.5rem; }
                #section-INTRO { page-break-before: auto; }
                .markdown-content h3 { color: #b8860b !important; font-size: 13pt; margin-top: 0; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; }
                .markdown-content p, .markdown-content li { line-height: 1.7; text-align: justify; margin-bottom: 1.2rem; }
                .markdown-content strong { color: #000000 !important; }
                table { page-break-inside: auto; width: 100%; border-collapse: collapse; }
                thead { display: table-header-group; }
                tr { page-break-inside: avoid; }
                th, td { border: 1px solid #d1d5db !important; color: #111827 !important; padding: 12px; }
                th { background: #f9fafb !important; color: #b8860b !important; font-size: 9pt; text-transform: uppercase; }
                .badge-red { border: 1px solid #dc2626 !important; color: #dc2626 !important; }
                .badge-yellow { border: 1px solid #d97706 !important; color: #d97706 !important; }
                .badge-green { border: 1px solid #16a34a !important; color: #16a34a !important; }
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
                <button id="btn-pdf" onclick="window.print()" class="hidden border border-[#d4af37] text-[#d4af37] px-6 py-2 text-xs uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-colors duration-300">Exportar PDF</button>
            </header>

            <div class="hidden print:flex cover-page">
                <div><div class="cover-subtitle mb-4">Reporte Forense de Conversión</div><div class="cover-title">Auditoría PredictaCore</div><div class="text-lg text-gray-600 mb-8" id="pdf-domain"></div></div>
                <div class="cover-meta flex justify-between w-full"><span>CLASIFICACIÓN: CONFIDENCIAL</span><span id="pdf-date"></span></div>
            </div>

            <div class="terminal-box p-6 mb-12 no-print">
                <input type="text" id="dna" placeholder="Ingresa dominio..." class="w-full bg-transparent text-white border-b border-zinc-800 p-2 focus:outline-none focus:border-gold placeholder-zinc-700">
                <button onclick="ejecutar()" id="btn-ejecutar" class="mt-6 bg-zinc-900 text-gold-text border border-zinc-800 px-6 py-3 text-xs uppercase tracking-[0.2em] hover:border-gold transition-all w-full">Ejecutar Auditoría</button>
            </div>
            <div id="status" class="text-[10px] tracking-[0.3em] text-zinc-500 mb-8 uppercase no-print"></div>
            <div id="reporte" class="space-y-4"></div>
        </div>

        <script>
            document.getElementById('pdf-date').innerText = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

            // EL FILTRO ANTI-MAYÚSCULAS: Si la IA grita, la convertimos a formato elegante
            function fixText(str) {
                if (!str) return '';
                let txt = String(str).trim();
                const alphas = txt.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ]/g, '');
                if (alphas.length === 0) return txt;
                const uppers = txt.replace(/[^A-ZÁÉÍÓÚÑ]/g, '').length;
                if (uppers / alphas.length > 0.4) {
                    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
                }
                return txt;
            }

            function aplicarSemaforos(htmlContent) {
                const div = document.createElement('div');
                div.innerHTML = htmlContent;
                const celdas = div.querySelectorAll('td');
                celdas.forEach(td => {
                    const textoOriginal = td.textContent.trim();
                    const texto = textoOriginal.toLowerCase();
                    const matchNumero = textoOriginal.match(/^(\\d+)(?:\\/10)?$/);
                    if (matchNumero) {
                        const calif = parseInt(matchNumero[1], 10);
                        if (calif <= 5) td.innerHTML = '<span class="badge-red">' + td.innerHTML + '</span>';
                        else if (calif <= 7) td.innerHTML = '<span class="badge-yellow">' + td.innerHTML + '</span>';
                        else td.innerHTML = '<span class="badge-green">' + td.innerHTML + '</span>';
                        return; 
                    }
                    const kwRojas = ['deficiente', 'alto', 'fuga', 'riesgo', 'negativo', 'crítico', 'amenaza', 'ausente', 'pobre', 'nulo'];
                    const kwAmarillas = ['parcial', 'medio', 'no evaluable', 'no detectado', 'presente', 'moderado', 'regular'];
                    const kwVerdes = ['óptimo', 'adecuada', 'coherente', 'positivo', 'excelente', 'fuerte', 'fortaleza', 'bajo', 'adecuado'];

                    if (kwRojas.some(kw => texto.includes(kw)) || texto === 'no') td.innerHTML = '<span class="badge-red">' + td.innerHTML + '</span>';
                    else if (kwAmarillas.some(kw => texto.includes(kw))) td.innerHTML = '<span class="badge-yellow">' + td.innerHTML + '</span>';
                    else if (kwVerdes.some(kw => texto.includes(kw)) || texto === 'sí' || texto === 'si') td.innerHTML = '<span class="badge-green">' + td.innerHTML + '</span>';
                });
                return div.innerHTML;
            }

            async function ejecutar() {
                const dna = document.getElementById('dna').value;
                if (!dna) return;
                document.getElementById('pdf-domain').innerText = 'Activo analizado: ' + dna;
                
                document.getElementById('btn-ejecutar').disabled = true;
                document.getElementById('btn-pdf').classList.add('hidden'); 
                const reporte = document.getElementById('reporte');
                reporte.innerHTML = '';
                document.getElementById('status').innerText = 'PROCESANDO ESTRUCTURAS JSON...';

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
                    div.className = 'report-section animate-pulse';
                    div.id = 'section-' + etapa.id;
                    div.innerHTML = '<h3 class="no-print">' + etapa.title + '</h3><div id="content-' + etapa.id + '" class="markdown-content text-zinc-400 font-light italic">Analizando nodos...</div>';
                    reporte.appendChild(div);

                    try {
                        const res = await fetch('/diseccion', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ dna: dna, etapaId: etapa.id })
                        });
                        const data = await res.json();
                        
                        // LIMPIEZA DEL JSON (Por si la IA mete markdown residual)
                        let rawJson = data.content.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
                        let j = JSON.parse(rawJson);
                        let html = '';

                        // EL CONSTRUCTOR HTML PERFECTO (Garantiza números, tablas y minúsculas)
                        if (etapa.id === 'INTRO') {
                            j.parrafos?.forEach(p => html += \`<p>\${fixText(p)}</p>\`);
                        } else if (etapa.id === 'GEMELOS') {
                            html += '<ul>';
                            j.gemelos?.forEach(g => html += \`<li><strong>\${fixText(g.nombre)}:</strong> \${fixText(g.descripcion)}</li>\`);
                            html += '</ul>';
                        } else if (etapa.id === 'SCORECARD') {
                            html += '<table><thead><tr><th>Punto de Salud</th><th>Calificación</th><th>Diagnóstico Forense</th></tr></thead><tbody>';
                            j.scorecard?.forEach(s => html += \`<tr><td>\${fixText(s.punto)}</td><td>\${s.calificacion}</td><td>\${fixText(s.diagnostico)}</td></tr>\`);
                            html += '</tbody></table>';
                        } else if (etapa.id === 'VISIBILIDAD') {
                            html += '<ul>';
                            j.datos?.forEach(d => html += \`<li><strong>\${fixText(d.titulo)}:</strong> \${fixText(d.texto)}</li>\`);
                            html += '</ul>';
                        } else if (etapa.id === 'BENCHMARK') {
                            html += \`<table><thead><tr><th>Fricción Estratégica</th><th>Activo Analizado</th><th>\${j.competidores[0]}</th><th>\${j.competidores[1]}</th><th>\${j.competidores[2]}</th></tr></thead><tbody>\`;
                            j.fricciones?.forEach(f => html += \`<tr><td><strong>\${fixText(f.nombre)}</strong></td><td>\${fixText(f.activo)}</td><td>\${fixText(f.comp1)}</td><td>\${fixText(f.comp2)}</td><td>\${fixText(f.comp3)}</td></tr>\`);
                            html += '</tbody></table>';
                        } else if (etapa.id === 'SWOT') {
                            html += '<strong>Fortalezas:</strong><ol>'; j.fortalezas?.forEach(i => html += \`<li>\${fixText(i)}</li>\`); html += '</ol>';
                            html += '<strong>Debilidades:</strong><ol>'; j.debilidades?.forEach(i => html += \`<li>\${fixText(i)}</li>\`); html += '</ol>';
                            html += '<strong>Oportunidades:</strong><ol>'; j.oportunidades?.forEach(i => html += \`<li>\${fixText(i)}</li>\`); html += '</ol>';
                            html += '<strong>Amenazas:</strong><ol>'; j.amenazas?.forEach(i => html += \`<li>\${fixText(i)}</li>\`); html += '</ol>';
                        } else if (etapa.id === 'WISHLIST') {
                            html += '<ol>'; j.deseos?.forEach(d => html += \`<li>\${fixText(d)}</li>\`); html += '</ol>';
                        } else if (etapa.id === 'FUGAS') {
                            html += '<ol>'; j.fugas?.forEach(f => html += \`<li><strong>\${fixText(f.titulo)}:</strong> \${fixText(f.descripcion)}</li>\`); html += '</ol>';
                        } else if (etapa.id === 'ACCIONES') {
                            html += '<ol>'; j.acciones?.forEach(a => html += \`<li><strong>\${fixText(a.titulo)}:</strong> \${fixText(a.descripcion)}</li>\`); html += '</ol>';
                        } else if (etapa.id === 'HERRAMIENTAS') {
                            html += '<ol>'; j.herramientas?.forEach(h => html += \`<li><strong>\${fixText(h.nombre)}:</strong> \${fixText(h.descripcion)}</li>\`); html += '</ol>';
                        } else if (etapa.id === 'OMNI') {
                            html += '<ol>'; j.fases?.forEach(f => html += \`<li><strong>\${fixText(f.fase)}:</strong> \${fixText(f.descripcion)}</li>\`); html += '</ol>';
                        }

                        if(html.includes('<table')) html = aplicarSemaforos(html);

                        const contentDiv = document.getElementById('content-' + etapa.id);
                        document.getElementById('section-' + etapa.id).classList.remove('animate-pulse');
                        contentDiv.classList.remove('italic', 'text-zinc-400');
                        contentDiv.classList.add('text-zinc-300');
                        contentDiv.innerHTML = html;
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        
                    } catch (e) {
                        console.error(e);
                        document.getElementById('content-' + etapa.id).innerHTML = '<span class="text-red-500 font-bold">ERROR JSON: La IA omitió un dato. Reintenta.</span>';
                    }
                }
                document.getElementById('status').innerText = 'AUDITORÍA FINALIZADA.';
                document.getElementById('btn-ejecutar').disabled = false;
                document.getElementById('btn-pdf').classList.remove('hidden');
            }
        </script>
    </body>
    </html>
    `;
}
module.exports = { getHTML };
