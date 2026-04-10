// landing.js - INTERFAZ ACTUALIZADA CON OPCIONES DE REPORTE

function getLandingHTML() {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore Titán - Centro de Comando</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
            body { background: #050505; color: #d1d5db; font-family: 'Inter', sans-serif; background-image: radial-gradient(circle at 50% 0%, #1e293b 0%, transparent 50%); }
            .terminal-box { background: rgba(15, 23, 42, 0.7); border: 1px solid #1e293b; border-radius: 12px; backdrop-filter: blur(10px); }
            .btn-elite { transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.1); }
            .btn-elite:hover { transform: translateY(-2px); border-color: #10b981; box-shadow: 0 0 20px rgba(16, 185, 129, 0.2); }
            .hidden-flow { display: none; }
        </style>
    </head>
    <body class="min-h-screen flex items-center justify-center p-4">
        <div class="max-w-2xl w-full">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-800 text-white tracking-tighter mb-2">PREDICTACORE <span class="text-green-500">TITÁN</span></h1>
                <p class="text-gray-400 text-sm font-light">Ambiente de Prueba: Protocolos de Auditoría Forense</p>
            </div>

            <div id="setup-stage" class="terminal-box p-8">
                <div class="space-y-4">
                    <div>
                        <label class="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Dominio del Activo (DNA)</label>
                        <input type="text" id="dna-url" placeholder="ejemplo.com" class="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-green-500 transition-all">
                    </div>
                    <div>
                        <label class="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Canal de Entrega (Email)</label>
                        <input type="email" id="user-email" placeholder="tu@email.com" class="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-green-500 transition-all">
                    </div>
                    <button onclick="prepararProtocolo()" class="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-green-500 hover:text-white transition-all">
                        INICIALIZAR SECUENCIA
                    </button>
                </div>
            </div>

            <div id="selection-stage" class="hidden-flow space-y-4">
                <div class="terminal-box p-6 text-center">
                    <p class="text-green-500 font-mono text-xs mb-4">>>> SELECCIONE NIVEL DE PENETRACIÓN:</p>
                    <div class="grid grid-cols-1 gap-4">
                        <button onclick="ejecutar('lite')" class="btn-elite bg-gray-900 p-4 rounded-xl text-left">
                            <span class="text-green-500 font-bold block">REPORTE TEASER (LITE)</span>
                            <span class="text-[10px] text-gray-500">5 Puntos críticos. Entrega vía Email.</span>
                        </button>
                        <button onclick="ejecutar('titan')" class="btn-elite bg-gray-900 p-4 rounded-xl text-left">
                            <span class="text-blue-500 font-bold block">REPORTE TITÁN (STÁNDAR)</span>
                            <span class="text-[10px] text-gray-500">15 Puntos forenses. Análisis en pantalla.</span>
                        </button>
                        <button onclick="ejecutar('omni')" class="btn-elite bg-gray-900 p-4 rounded-xl text-left">
                            <span class="text-yellow-500 font-bold block">PROTOCOLO OMNI (FULL SCAN)</span>
                            <span class="text-[10px] text-gray-500">45 Puntos críticos. Escaneo de 3 matrices.</span>
                        </button>
                    </div>
                </div>
            </div>

            <div id="status-stage" class="hidden-flow terminal-box p-6 mt-4 font-mono text-[11px]">
                <div id="terminal-logs" class="space-y-1 text-gray-400"></div>
            </div>
        </div>

        <script>
            let targetData = { url: '', email: '' };

            function prepararProtocolo() {
                targetData.url = document.getElementById('dna-url').value;
                targetData.email = document.getElementById('user-email').value;
                if(!targetData.url || !targetData.email) return alert("Faltan datos.");
                
                document.getElementById('setup-stage').classList.add('hidden-flow');
                document.getElementById('selection-stage').classList.remove('hidden-flow');
            }

            async function ejecutar(modo) {
                document.getElementById('selection-stage').classList.add('hidden-flow');
                document.getElementById('status-stage').classList.remove('hidden-flow');
                const logs = document.getElementById('terminal-logs');
                logs.innerHTML = '<p class="text-green-500">>> Lanzando protocolo ' + modo.toUpperCase() + '...</p>';

                // Aquí es donde llamamos a la ruta correspondiente en server.js
                const endpoint = modo === 'titan' ? '/start' : '/start-' + modo;
                
                try {
                    await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ dna: targetData.url, email: targetData.email })
                    });
                    logs.innerHTML += '<p>>> Petición aceptada. Procesando...</p>';
                } catch (e) {
                    logs.innerHTML += '<p class="text-red-500">>> ERROR DE CONEXIÓN.</p>';
                }
            }
        </script>
    </body>
    </html>
    `;
}
module.exports = { getLandingHTML };
