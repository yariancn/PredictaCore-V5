// landing.js - INTERFAZ FORENSE BILINGÜE + LENGUAJE DE NEGOCIOS

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
            .lang-btn { cursor: pointer; transition: all 0.3s; opacity: 0.5; }
            .lang-btn.active { opacity: 1; color: #10b981; font-weight: bold; }
        </style>
    </head>
    <body class="min-h-screen flex items-center justify-center p-4">
        
        <div class="fixed top-6 right-6 flex space-x-4 text-xs tracking-widest z-50">
            <span onclick="setLanguage('es')" id="lang-es" class="lang-btn active">ES</span>
            <span class="text-zinc-800">|</span>
            <span onclick="setLanguage('en')" id="lang-en" class="lang-btn">EN</span>
        </div>

        <div class="max-w-2xl w-full">
            <div id="setup-stage" class="terminal-box p-8 text-center">
                <h1 class="text-3xl font-800 text-white mb-6 tracking-tighter text-left uppercase">PREDICTACORE <span class="text-emerald-500 font-black">TITÁN</span></h1>
                <div class="space-y-4">
                    <input type="text" id="dna-url" placeholder="URL del Activo (ej. tunegocio.com)" class="w-full bg-black/50 border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-emerald-500 transition-all">
                    <input type="email" id="user-email" placeholder="Canal de Entrega (Email)" class="w-full bg-black/50 border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-emerald-500 transition-all">
                    <button id="btn-start" onclick="iniciarEscaneo()" class="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-emerald-500 hover:text-white transition-all uppercase tracking-widest text-sm">
                        Iniciar Escaneo Forense Gratis
                    </button>
                </div>
            </div>

            <div id="scanner-stage" class="hidden-flow terminal-box p-8 relative overflow-hidden">
                <div class="scan-line"></div>
                <div id="terminal-output" class="font-mono text-[10px] md:text-xs text-zinc-500 space-y-1 h-64 overflow-y-auto">
                    <p class="text-emerald-500 font-bold" id="log-init">>> INICIALIZANDO NÚCLEO PREDICTACORE...</p>
                </div>
            </div>

            <div id="upsell-stage" class="hidden-flow terminal-box p-8 md:p-12 text-center border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <div class="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 class="text-3xl font-bold text-white mb-2 tracking-tight" id="upsell-title">Radiografía Enviada</h2>
                <p class="text-zinc-400 mb-8 text-sm"><span id="upsell-subtitle">El reporte inicial ha sido entregado a</span> <span id="sent-email" class="text-white font-bold"></span>.</p>
                
                <div class="bg-emerald-950/10 border border-emerald-900/30 p-6 rounded-lg mb-8 text-left">
                    <h3 class="text-emerald-500 font-bold uppercase tracking-widest text-[10px] mb-3 flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span id="box-tag">Vectores de Optimización Detectados</span>
                    </h3>
                    <p class="text-sm text-zinc-300 leading-relaxed" id="box-text">
                        El escaneo inicial muestra que tu página tiene cuellos de botella invisibles. Estás atrayendo visitas, pero no se están convirtiendo en clientes al ritmo que deberían. El Reporte Titán te muestra exactamente dónde se caen las ventas y cómo arreglarlo.
                    </p>
                </div>

                <div class="border-t border-zinc-800 pt-8">
                    <h4 class="text-4xl font-extrabold text-white mb-2 tracking-tighter">$239 <span class="text-sm text-zinc-500 line-through font-normal">$700 USD</span></h4>
                    <p class="text-xs text-emerald-500 font-bold uppercase tracking-widest mb-6 tracking-[0.2em]" id="sub-price">Incluye Suscripción Titán ($15/mes)</p>
                    
                    <button onclick="comprarTitan()" class="w-full bg-emerald-600 text-white font-bold py-4 px-12 rounded-lg text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] mb-4" id="btn-titan">
                        Activar Protección Titán
                    </button>

                    <div class="max-w-xs mx-auto text-[9px] text-zinc-600 uppercase leading-tight tracking-wider" id="disclaimer">
                        Analizado mediante la colisión de 9,000 modelos simbiópticos. Cargo único de $239 y suscripción de $15/mes.
                    </div>
                </div>
            </div>
        </div>

        <script>
            let currentLang = 'es';
            const dictionary = {
                es: {
                    placeholderUrl: "URL del Activo (ej. tunegocio.com)",
                    placeholderEmail: "Canal de Entrega (Email)",
                    btnStart: "Iniciar Escaneo Forense Gratis",
                    logInit: ">> INICIALIZANDO NÚCLEO PREDICTACORE...",
                    upsellTitle: "Radiografía Enviada",
                    upsellSub: "El reporte inicial ha sido entregado a",
                    boxTag: "Vectores de Optimización Detectados",
                    boxText: "El escaneo inicial muestra que tu página tiene cuellos de botella invisibles. Estás atrayendo visitas, pero no se están convirtiendo en clientes al ritmo que deberían. El Reporte Titán te muestra exactamente dónde se caen las ventas y cómo arreglarlo.",
                    subPrice: "Incluye Suscripción Titán ($15/mes)",
                    btnTitan: "Activar Protección Titán",
                    disclaimer: "Analizado mediante la colisión de 9,000 modelos simbiópticos. Cargo único de $239 y suscripción de $15/mes.",
                    alertProcess: "¡Procesando! Tu Auditoría Titán ha comenzado. El reporte completo llegará a su email en unos minutos.",
                    alertError: "Faltan datos"
                },
                en: {
                    placeholderUrl: "Asset URL (e.g., yourbusiness.com)",
                    placeholderEmail: "Delivery Channel (Email)",
                    btnStart: "Start Free Forensic Scan",
                    logInit: ">> INITIALIZING PREDICTACORE CORE...",
                    upsellTitle: "X-Ray Sent",
                    upsellSub: "The initial report has been delivered to",
                    boxTag: "Optimization Vectors Detected",
                    boxText: "The initial scan shows your page has invisible bottlenecks. You're attracting visitors, but they aren't converting at the rate they should. The Titan Report shows you exactly where sales are dropping and how to fix it.",
                    subPrice: "Includes Titan Subscription ($15/mo)",
                    btnTitan: "Activate Titan Protection",
                    disclaimer: "Analyzed through the collision of 9,000 symbioptic models. One-time $239 charge and $15/mo subscription.",
                    alertProcess: "Processing! Your Titan Audit has started. The full report will arrive in your email shortly.",
                    alertError: "Missing data"
                }
            };

            function setLanguage(lang) {
                currentLang = lang;
                document.getElementById('lang-es').classList.toggle('active', lang === 'es');
                document.getElementById('lang-en').classList.toggle('active', lang === 'en');
                
                const d = dictionary[lang];
                document.getElementById('dna-url').placeholder = d.placeholderUrl;
                document.getElementById('user-email').placeholder = d.placeholderEmail;
                document.getElementById('btn-start').innerText = d.btnStart;
                document.getElementById('log-init').innerText = d.logInit;
                document.getElementById('upsell-title').innerText = d.upsellTitle;
                document.getElementById('upsell-subtitle').innerText = d.upsellSub;
                document.getElementById('box-tag').innerText = d.boxTag;
                document.getElementById('box-text').innerText = d.boxText;
                document.getElementById('sub-price').innerText = d.subPrice;
                document.getElementById('btn-titan').innerText = d.btnTitan;
                document.getElementById('disclaimer').innerText = d.disclaimer;
            }

            async function iniciarEscaneo() {
                const url = document.getElementById('dna-url').value;
                const email = document.getElementById('user-email').value;
                if(!url || !email) return alert(dictionary[currentLang].alertError);

                document.getElementById('setup-stage').classList.add('hidden-flow');
                document.getElementById('scanner-stage').classList.remove('hidden-flow');
                document.getElementById('sent-email').innerText = email;

                const terminal = document.getElementById('terminal-output');
                const logs = currentLang === 'es' ? 
                    [">> Conectando con nodos forenses...", ">> Inyectando Gemelos Sintéticos...", ">> Analizando jerarquía visual...", ">> Sellando radiografía Lite...", ">> Enviando reporte..."] :
                    [">> Connecting forensic nodes...", ">> Injecting Synthetic Twins...", ">> Analyzing visual hierarchy...", ">> Sealing Lite X-ray...", ">> Sending report..."];

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

            async function comprarTitan() {
                const url = document.getElementById('dna-url').value;
                const email = document.getElementById('user-email').value;
                alert(dictionary[currentLang].alertProcess);
                fetch('/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dna: url, email: email })
                });
            }
        </script>
    </body>
    </html>
    `;
}

module.exports = { getLandingHTML };
