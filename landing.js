// landing.js - LA FACHADA DE ÉLITE Y CAPTURA DE LEADS (FASE 4: 3 NIVELES Y SPA)

function getLandingHTML() {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore Titán - Inteligencia Forense de Conversión</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');

            body { 
                background: #050505; 
                color: #d1d5db; 
                font-family: 'Inter', sans-serif; 
                -webkit-font-smoothing: antialiased;
                background-image: radial-gradient(circle at 50% 0%, #1e293b 0%, transparent 50%);
            }
            
            .terminal-box { 
                background: rgba(15, 23, 42, 0.7); 
                border: 1px solid #1e293b; 
                border-radius: 12px; 
                backdrop-filter: blur(10px);
            }

            .scan-line {
                width: 100%;
                height: 2px;
                background: #10b981;
                position: absolute;
                top: 0;
                left: 0;
                animation: scan 2s linear infinite;
                opacity: 0.5;
                box-shadow: 0 0 10px #10b981;
            }

            @keyframes scan {
                0% { top: 0; }
                100% { top: 100%; }
            }

            .hidden-flow { display: none !important; }
        </style>
    </head>
    <body class="min-h-screen flex flex-col items-center justify-center p-6 md:p-10 relative overflow-x-hidden">
        
        <div class="max-w-5xl w-full relative z-10">
            
            <header class="mb-10 text-center">
                <h1 class="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tighter mb-2">PREDICTACORE <span class="text-emerald-500">TITÁN</span></h1>
                <p class="text-zinc-500 text-xs md:text-sm uppercase tracking-[0.4em]">Forensic Audit Intelligence</p>
            </header>

            <div id="capture-stage" class="terminal-box p-8 md:p-12 text-center transition-all duration-500 block">
                <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">Descubre por qué tus visitantes no compran.</h2>
                <p class="text-zinc-400 mb-8 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                    No somos una consultoría; somos un motor de auditoría forense. Ingresa tu dominio y recibe un reporte diagnóstico gratuito de 2 páginas directamente en tu correo. Identificaremos las fugas críticas de capital en tu ecosistema digital.
                </p>

                <form id="audit-form" class="space-y-6 max-w-xl mx-auto text-left" onsubmit="iniciarAuditoria(event)">
                    <div>
                        <label class="block text-xs uppercase tracking-widest text-emerald-500 mb-2 font-bold">Activo Digital (URL)</label>
                        <input type="text" id="dna-url" placeholder="ej. midominio.com" required class="w-full bg-zinc-900/50 text-xl text-white border border-zinc-700 rounded-lg p-4 focus:outline-none focus:border-emerald-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-xs uppercase tracking-widest text-emerald-500 mb-2 font-bold">Correo de Entrega</label>
                        <input type="email" id="user-email" placeholder="tu@correo.com" required class="w-full bg-zinc-900/50 text-xl text-white border border-zinc-700 rounded-lg p-4 focus:outline-none focus:border-emerald-500 transition-colors">
                    </div>
                    <button type="submit" id="btn-submit" class="w-full bg-emerald-600 text-white font-bold py-4 rounded-lg text-sm uppercase tracking-wider hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        Generar Diagnóstico Gratuito
                    </button>
                </form>
                <p class="mt-6 text-[10px] text-zinc-600 uppercase tracking-widest">100% Confidencial. Análisis impulsado por gemelos sintéticos.</p>
            </div>

            <div id="scanner-stage" class="hidden-flow terminal-box p-8 md:p-12 relative overflow-hidden">
                <div class="scan-line"></div>
                <div class="text-center mb-8 relative z-10">
                    <h3 class="text-xl font-bold text-white uppercase tracking-widest animate-pulse">Ejecutando Infiltración Forense</h3>
                    <p id="target-display" class="text-emerald-500 mt-2 font-mono text-sm"></p>
                </div>
                
                <div class="font-mono text-xs md:text-sm text-zinc-400 space-y-2 h-48 overflow-y-auto relative z-10" id="terminal-logs">
                </div>
            </div>

            <div id="upsell-stage" class="hidden-flow terminal-box p-8 md:p-12 text-center border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                
                <h2 class="text-3xl font-bold text-white mb-2">Radiografía Enviada</h2>
                <p class="text-zinc-400 mb-8">El reporte diagnóstico LITE ha sido enviado a <span id="sent-email" class="text-white font-bold"></span>.</p>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
                    
                    <div class="bg-zinc-900/80 border border-zinc-700 p-6 rounded-lg relative opacity-75">
                        <div class="absolute top-0 right-0 bg-emerald-500 text-black text-[9px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-widest">Entregado</div>
                        <h3 class="text-lg font-bold text-white mb-2">LITE <span class="text-xs text-zinc-500 font-normal">/ Gratis</span></h3>
                        <p class="text-xs text-zinc-400 mb-6 line-clamp-3">Diagnóstico superficial. 3 Fugas Críticas, Scorecard vital y Proyección Sintética (Wishlist).</p>
                        <button disabled class="w-full bg-zinc-800 text-zinc-500 py-3 rounded-lg text-xs font-bold uppercase cursor-not-allowed">Completado</button>
                    </div>

                    <div class="bg-black border border-emerald-500/50 p-6 rounded-lg relative shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-transform">
                        <h3 class="text-lg font-bold text-emerald-400 mb-2">TITÁN <span class="text-xs text-emerald-200 font-normal">/ $15 USD</span></h3>
                        <p class="text-xs text-zinc-300 mb-6">Análisis táctico profundo. 15 Puntos de Fuga en 11 Pilares Forenses con guías de reparación exactas.</p>
                        <button onclick="alert('Conexión con Stripe pendiente en Fase 5')" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg text-xs font-bold uppercase transition-colors">Desbloquear Titán</button>
                    </div>

                    <div class="bg-black border border-amber-500/50 p-6 rounded-lg relative shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:-translate-y-1 transition-transform">
                        <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-black text-[9px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">Recomendado</div>
                        <h3 class="text-lg font-bold text-amber-400 mb-2">OMNI <span class="text-xs text-amber-200 font-normal">/ $49 USD</span></h3>
                        <p class="text-xs text-zinc-300 mb-6">El escaneo forense definitivo. 45 Puntos Críticos de arquitectura, psicología de precios y fricción oculta.</p>
                        <button onclick="alert('Conexión con Stripe pendiente en Fase 5')" class="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black py-3 rounded-lg text-xs font-bold uppercase transition-colors">Escalar a OMNI</button>
                    </div>

                </div>

                <div class="border-t border-zinc-800 pt-6 mt-4">
                    <button onclick="resetearAuditoria()" class="text-zinc-500 hover:text-emerald-400 text-xs uppercase tracking-widest transition-colors flex items-center justify-center mx-auto">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        Auditar Otro Dominio
                    </button>
                </div>
            </div>

        </div>

        <script>
            const logs = [
                "> Estableciendo conexión con motor de gemelos sintéticos...",
                "> Analizando arquitectura del DOM y arbol de renderizado...",
                "> [ALERTA] Detectando nodos de fricción en la ruta de conversión...",
                "> Evaluando los 11 Pilares Forenses...",
                "> Simulando psicologías de compra (4 arquetipos detectados)...",
                "> Compilando métricas del Scorecard Vital...",
                "> [HEMORRAGIA DETECTADA] Analizando abandono en Check-out...",
                "> Proyectando escenario ideal (Wishlist) y brecha de potencial...",
                "> Cristalizando hallazgos. Generando PDF Forense...",
                "> Enrutando a servidor de correo seguro..."
            ];

            async function iniciarAuditoria(e) {
                e.preventDefault();
                const btnSubmit = document.getElementById('btn-submit');
                if(btnSubmit.disabled) return;
                
                const url = document.getElementById('dna-url').value;
                const email = document.getElementById('user-email').value;
                
                document.getElementById('target-display').innerText = \`OBJETIVO: \${url}\`;
                document.getElementById('sent-email').innerText = email;

                // Transición: Ocultar Captura -> Mostrar Escáner
                document.getElementById('capture-stage').classList.add('hidden-flow');
                document.getElementById('scanner-stage').classList.remove('hidden-flow');

                const terminal = document.getElementById('terminal-logs');
                terminal.innerHTML = '';
                btnSubmit.disabled = true;

                // CONEXIÓN REAL AL SERVIDOR
                try {
                    fetch('/start-lite', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ dna: url, email: email })
                    });
                } catch (err) {
                    console.error("Fallo de conexión:", err);
                }

                // Animación de la Terminal
                let delay = 0;
                logs.forEach((log, index) => {
                    setTimeout(() => {
                        const p = document.createElement('p');
                        p.innerHTML = log.replace(/\\[ALERTA\\]/g, '<span class="text-yellow-500 font-bold">[ALERTA]</span>')
                                         .replace(/\\[HEMORRAGIA DETECTADA\\]/g, '<span class="text-red-500 font-bold">[HEMORRAGIA DETECTADA]</span>');
                        terminal.appendChild(p);
                        terminal.scrollTop = terminal.scrollHeight;
                        
                        if (index === logs.length - 1) {
                            setTimeout(() => {
                                // Transición: Ocultar Escáner -> Mostrar Upsell
                                document.getElementById('scanner-stage').classList.add('hidden-flow');
                                document.getElementById('upsell-stage').classList.remove('hidden-flow');
                                btnSubmit.disabled = false;
                            }, 2000);
                        }
                    }, delay);
                    delay += Math.random() * 800 + 800; // Simula procesamiento asíncrono
                });
            }

            // FUNCIÓN DE RESETEO (Arquitectura SPA)
            function resetearAuditoria() {
                // 1. Limpiar los campos de texto
                document.getElementById('dna-url').value = '';
                document.getElementById('user-email').value = '';
                
                // 2. Ocultar el Upsell y volver a mostrar la Captura inicial
                document.getElementById('upsell-stage').classList.add('hidden-flow');
                document.getElementById('capture-stage').classList.remove('hidden-flow');
            }
        </script>
    </body>
    </html>
    `;
}

module.exports = { getLandingHTML };
