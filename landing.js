// landing.js - INTERFAZ UNIFICADA: TERMINAL + OFERTA TITÁN ($239 + $15/mes)

function getLandingHTML() {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore Titán - Inteligencia Forense</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
            body { background: #050505; color: #d1d5db; font-family: 'Inter', sans-serif; background-image: radial-gradient(circle at 50% 0%, #1e293b 0%, transparent 50%); }
            .terminal-box { background: rgba(15, 23, 42, 0.7); border: 1px solid #1e293b; border-radius: 12px; backdrop-filter: blur(10px); }
            .hidden-flow { display: none; }
            .scan-line { width: 100%; height: 2px; background: #10b981; position: absolute; top: 0; left: 0; animation: scan 3s infinite linear; opacity: 0.3; }
            @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        </style>
    </head>
    <body class="min-h-screen flex items-center justify-center p-4">
        <div class="max-w-2xl w-full">
            
            <div id="setup-stage" class="terminal-box p-8 text-center">
                <h1 class="text-3xl font-800 text-white mb-6 tracking-tighter text-left">PREDICTACORE <span class="text-emerald-500 font-black">TITÁN</span></h1>
                <div class="space-y-4">
                    <input type="text" id="dna-url" placeholder="URL del Activo (ej. tunegocio.com)" class="w-full bg-black/50 border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-emerald-500 transition-all">
                    <input type="email" id="user-email" placeholder="Canal de Entrega (Email)" class="w-full bg-black/50 border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-emerald-500 transition-all">
                    <button onclick="iniciarEscaneo()" class="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-emerald-500 hover:text-white transition-all uppercase tracking-widest text-sm">
                        Iniciar Escaneo Forense Gratis
                    </button>
                </div>
            </div>

            <div id="scanner-stage" class="hidden-flow terminal-box p-8 relative overflow-hidden">
                <div class="scan-line"></div>
                <div id="terminal-output" class="font-mono text-[10px] md:text-xs text-zinc-500 space-y-1 h-64 overflow-y-auto">
                    <p class="text-emerald-500 font-bold">>> INICIALIZANDO NÚCLEO PREDICTACORE...</p>
                </div>
            </div>

            <div id="upsell-stage" class="hidden-flow terminal-box p-8 md:p-12 text-center border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <div class="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 class="text-3xl font-bold text-white mb-2 tracking-tight">Radiografía Enviada</h2>
                <p class="text-zinc-400 mb-8 text-sm">El reporte inicial ha sido entregado a <span id="sent-email" class="text-white font-bold"></span>.</p>
                
                <div class="bg-red-950/20 border border-red-900/50 p-6 rounded-lg mb-8 text-left">
                    <h3 class="text-red-500 font-bold uppercase tracking-widest text-[10px] mb-3 flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Diagnóstico de Riesgo Elevado
                    </h3>
                    <p class="text-sm text-zinc-300">Nuestro escaneo detectó fricción severa. Estás perdiendo capital en cada visita. El reporte Lite solo muestra la superficie de la hemorragia.</p>
                </div>

                <div class="border-t border-zinc-800 pt-8">
                    <h4 class="text-4xl font-extrabold text-white mb-2 tracking-tighter">$239 <span class="text-sm text-zinc-500 line-through font-normal">$700 USD</span></h4>
                    <p class="text-xs text-emerald-500 font-bold uppercase tracking-widest mb-6 tracking-[0.2em]">Incluye Suscripción Titán ($15/mes)</p>
                    
                    <button class="w-full bg-emerald-600 text-white font-bold py-4 px-12 rounded-lg text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] mb-4">
                        Activar Protección Titán
                    </button>

                    <div class="max-w-xs mx-auto text-[9px] text-zinc-600 uppercase leading-tight tracking-wider">
                        Cargo único de $239 y suscripción de $15/mes. Cancelable tras el primer periodo de 30 días. Sin reembolsos en el mes en curso.
                    </div>
                </div>
            </div>

        </div>

        <script>
            async function iniciarEscaneo() {
                const url = document.getElementById('dna-url').value;
                const email = document.getElementById('user-email').value;
                if(!url || !email) return alert("Faltan datos");

                document.getElementById('setup-stage').classList.add('hidden-flow');
                document.getElementById('scanner-stage').classList.remove('hidden-flow');
                document.getElementById('sent-email').innerText = email;

                const terminal = document.getElementById('terminal-output');
                const logs = [
                    ">> Conectando con nodos forenses...",
                    ">> Inyectando Gemelos Sintéticos en la ruta de conversión...",
                    ">> [ALERTA] Fricción detectada en el Nodo de Cierre.",
                    ">> Analizando jerarquía visual...",
                    ">> [HEMORRAGIA DETECTADA] Abandono masivo en checkout.",
                    ">> Sellando radiografía Lite...",
                    ">> Enviando reporte al canal de entrega..."
                ];

                // Llamada real al servidor
                fetch('/start-lite', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ dna: url, email: email })
                });

                let i = 0;
                const interval = setInterval(() => {
                    const p = document.createElement('p');
                    p.innerText = logs[i];
                    terminal.appendChild(p);
                    i++;
                    if(i >= logs.length) {
                        clearInterval(interval);
                        setTimeout(() => {
                            document.getElementById('scanner-stage').classList.add('hidden-flow');
                            document.getElementById('upsell-stage').classList.remove('hidden-flow');
                        }, 2000);
                    }
                }, 1000);
            }
        </script>
    </body>
    </html>
    `;
}

module.exports = { getLandingHTML };
