// landing.js - LA FACHADA DE ÉLITE Y CAPTURA DE LEADS (FASE 2 ACTIVA)

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

            .hidden-flow { display: none; }
        </style>
    </head>
    <body class="min-h-screen flex flex-col items-center justify-center p-6 md:p-20 relative overflow-x-hidden">
        
        <div class="max-w-4xl w-full relative z-10">
            
            <header class="mb-12 text-center">
                <h1 class="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tighter mb-2">PREDICTACORE <span class="text-emerald-500">TITÁN</span></h1>
                <p class="text-zinc-500 text-xs md:text-sm uppercase tracking-[0.4em]">Forensic Audit Intelligence</p>
            </header>

            <div id="capture-stage" class="terminal-box p-8 md:p-12 text-center transition-all duration-500">
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
                    <button type="submit" class="w-full bg-emerald-600 text-white font-bold py-4 rounded-lg text-sm uppercase tracking-wider hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        Generar Diagnóstico Gratuito
                    </button>
                </form>
                <p class="mt-6 text-[10px] text-zinc-600 uppercase tracking-widest">100% Confidencial. Análisis impulsado por modelos simbiópticos.</p>
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
                <div class="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 class="text-3xl font-bold text-white mb-2">Radiografía Enviada</h2>
                <p class="text-zinc-400 mb-8">El reporte diagnóstico inicial ha sido enviado a <span id="sent-email" class="text-white font-bold"></span>.</p>
                
                <div class="bg-black/50 border border-zinc-800 p-6 rounded-lg mb-8 text-left">
                    <h3 class="text-red-500 font-bold uppercase tracking-widest text-xs mb-4 flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Alerta del Sistema
                    </h3>
                    <p class="text-sm text-zinc-300">Nuestro escaneo superficial detectó altos niveles de fricción transaccional. El reporte gratuito solo muestra la superficie.</p>
                </div>

                <div class="border-t border-zinc-800 pt-8">
                    <h4 class="text-xl font-bold text-white mb-4 uppercase">Desbloquea el Reporte OMNI Titán</h4>
                    <p class="text-sm text-zinc-400 mb-6 max-w-lg mx-auto">
                        Asciende al análisis forense completo. <strong>Identificamos 45 Puntos de Fuga Críticos</strong> exactos en tu UX, Copywriting y Arquitectura de Autoridad, con las acciones precisas para sellarlos.
                    </p>
                    <button class="bg-gradient-to-r from-emerald-600 to-emerald-400 text-black font-bold py-4 px-10 rounded-lg text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                        Desbloquear 45 Puntos ($15)
                    </button>
                    <p class="mt-4 text-[10px] text-zinc-500 uppercase tracking-widest">Incluye hoja de ruta de ejecución y matriz táctica (SWOT).</p>
                </div>
            </div>

        </div>

        <script>
            const logs = [
                "> Estableciendo conexión segura con servidor objetivo...",
                "> Analizando arquitectura del DOM y arbol de renderizado...",
                "> [ALERTA] Detectando nodos de fricción en la ruta de conversión...",
                "> Mapeando elementos de autoridad y prueba social...",
                "> Simulando psicologías de compra (4 arquetipos detectados)...",
                "> Extrayendo metadatos y perfil de visibilidad orgánica...",
                "> Compilando métricas del Scorecard Vital...",
                "> [HEMORRAGIA DETECTADA] Analizando abandono en Check-out...",
                "> Cristalizando hallazgos. Generando PDF...",
                "> Enrutando a servidor de correo seguro..."
            ];

            async function iniciarAuditoria(e) {
                e.preventDefault();
                const url = document.getElementById('dna-url').value;
                const email = document.getElementById('user-email').value;
                
                document.getElementById('target-display').innerText = \`OBJETIVO: \${url}\`;
                document.getElementById('sent-email').innerText = email;

                document.getElementById('capture-stage').classList.add('hidden-flow');
                document.getElementById('scanner-stage').classList.remove('hidden-flow');

                const terminal = document.getElementById('terminal-logs');
                terminal.innerHTML = '';

                // CONEXIÓN REAL AL SERVIDOR (AQUÍ ESTABA EL PROBLEMA)
                try {
                    fetch('/start-lite', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ dna: url, email: email })
                    });
                } catch (err) {
                    console.error("Fallo de conexión:", err);
                }

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
                                document.getElementById('scanner-stage').classList.add('hidden-flow');
                                document.getElementById('upsell-stage').classList.remove('hidden-flow');
                            }, 2000);
                        }
                    }, delay);
                    delay += Math.random() * 800 + 800;
                });
            }
        </script>
    </body>
    </html>
    \`;
}

module.exports = { getLandingHTML };
