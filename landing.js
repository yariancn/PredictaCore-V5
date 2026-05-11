// landing.js - REDISEÑO DE ÉLITE: NARRATIVA DE VENTA + TERMINAL DE CIERRE

function getLandingHTML() {
    return `
    <!DOCTYPE html>
    <html lang="es" class="scroll-smooth">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore - Inteligencia Forense de Negocios</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
            
            :root {
                --pc-emerald: #10b981;
                --pc-gold: #d4af37;
                --pc-dark-bg: #050505;
            }

            body { 
                background: var(--pc-dark-bg); 
                color: #d1d5db; 
                font-family: 'Inter', sans-serif;
                overflow-x: hidden;
            }

            .glass-panel { 
                background: rgba(15, 23, 42, 0.6); 
                border: 1px solid rgba(30, 41, 59, 0.5); 
                backdrop-filter: blur(12px); 
            }

            .text-huge { font-size: clamp(3rem, 8vw, 6rem); line-height: 0.9; font-weight: 900; letter-spacing: -0.05em; }
            
            .dossier-preview {
                background: #fff;
                color: #0f172a;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                transform: rotateX(10deg) rotateY(-5deg);
                transition: all 0.5s ease;
            }
            .dossier-preview:hover { transform: rotateX(0deg) rotateY(0deg); }

            .scan-line { width: 100%; height: 2px; background: var(--pc-emerald); position: absolute; top: 0; left: 0; animation: scan 3s infinite linear; opacity: 0.3; }
            @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }

            .hidden-flow { display: none !important; }
            .lang-btn { cursor: pointer; transition: all 0.3s; opacity: 0.4; }
            .lang-btn.active { opacity: 1; color: var(--pc-emerald); font-weight: bold; }

            .mesh-bg {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-image: radial-gradient(circle at 50% -20%, #1e293b 0%, transparent 50%);
                z-index: -1;
            }
        </style>
    </head>
    <body class="antialiased">
        <div class="mesh-bg"></div>

        <nav class="fixed top-0 w-full z-50 p-6 flex justify-between items-center glass-panel border-b border-white/5">
            <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <span class="font-black tracking-tighter text-xl text-white uppercase">PREDICTA<span class="text-emerald-500">CORE</span></span>
            </div>
            <div class="flex items-center space-x-6">
                <div class="flex space-x-3 text-[10px] tracking-widest border border-zinc-800 px-3 py-1 rounded-full">
                    <span onclick="setLanguage('es')" id="lang-es" class="lang-btn active">ES</span>
                    <span class="text-zinc-700">/</span>
                    <span onclick="setLanguage('en')" id="lang-en" class="lang-btn">EN</span>
                </div>
                <a href="#terminal-section" class="text-[10px] uppercase font-bold tracking-widest text-emerald-500 border-b border-emerald-500/30">Acceso Nodo</a>
            </div>
        </nav>

        <section class="min-h-screen flex flex-col justify-center px-6 pt-32 pb-20">
            <div class="max-w-6xl mx-auto w-full">
                <h1 id="hero-title" class="text-huge text-white mb-8">LA ERA DE LAS <br><span class="text-emerald-500">SUPOSICIONES</span> HA TERMINADO.</h1>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <p id="hero-desc" class="text-xl text-zinc-400 leading-tight border-l-4 border-emerald-500 pl-6">
                        Tener tráfico no garantiza rentabilidad. Su activo digital está perdiendo ventas hoy mismo por errores de fricción invisibles al ojo humano. Nosotros no damos opiniones; dictamos veredictos forenses.
                    </p>
                    <div class="flex items-end justify-start md:justify-end">
                        <div class="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-mono">
                            // 9,000 Simulaciones Activas <br> // Ecosistema Blindado v.2.5
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-24 bg-[#080808] border-y border-zinc-900 overflow-hidden">
            <div class="max-w-6xl mx-auto px-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div class="order-2 lg:order-1">
                        <div class="dossier-preview p-8 md:p-12 rounded-sm aspect-[3/4] max-w-md mx-auto relative">
                            <div class="absolute top-4 right-4 text-[8px] font-bold text-zinc-400 uppercase">TITÁN REPORT // CONFIDENCIAL</div>
                            <h4 class="text-2xl font-black mb-6 uppercase tracking-tighter">Signos Vitales</h4>
                            <div class="space-y-4 font-mono text-[10px]">
                                <div class="flex justify-between border-b border-zinc-200 pb-2">
                                    <span>Pilar 01: Fricción UX/UI</span>
                                    <span class="text-red-600 font-bold">4/10 [Fuga]</span>
                                </div>
                                <div class="flex justify-between border-b border-zinc-200 pb-2">
                                    <span>Pilar 04: Claridad de Oferta</span>
                                    <span class="text-red-600 font-bold">3/10 [Fuga]</span>
                                </div>
                                <div class="flex justify-between border-b border-zinc-200 pb-2">
                                    <span>Pilar 07: Checkout Velocity</span>
                                    <span class="text-emerald-600 font-bold">9/10 [Optimizado]</span>
                                </div>
                            </div>
                            <div class="mt-8 p-4 bg-zinc-100 rounded text-[9px] leading-relaxed italic">
                                "El activo presenta una hemorragia de confianza en el nodo de cierre debido a una arquitectura de autoridad diluida..."
                            </div>
                            <div class="mt-8 pt-6 border-t border-zinc-200">
                                <div class="h-2 bg-zinc-200 w-full mb-2"></div>
                                <div class="h-2 bg-emerald-500 w-3/4"></div>
                            </div>
                        </div>
                    </div>
                    <div class="order-1 lg:order-2">
                        <h2 id="offer-title" class="text-xs text-emerald-500 font-bold tracking-[0.3em] uppercase mb-4">Lo que entregamos</h2>
                        <h3 id="offer-sub" class="text-4xl font-extrabold text-white mb-6 leading-none">Un Reporte de Nivel Boardroom.</h3>
                        <p id="offer-desc" class="text-zinc-400 mb-8 leading-relaxed">
                            No somos una IA genérica ni una consultora cobrando miles de dólares por un PDF bonito. El Reporte Titán es el mapa exacto para sellar las fugas de su negocio.
                        </p>
                        <ul class="space-y-4">
                            <li class="flex items-center text-sm text-zinc-300"><span class="w-1.5 h-1.5 bg-emerald-500 mr-3"></span> 15 Puntos de Fuga Identificados.</li>
                            <li class="flex items-center text-sm text-zinc-300"><span class="w-1.5 h-1.5 bg-emerald-500 mr-3"></span> Matriz Táctica SWOT Financiera.</li>
                            <li class="flex items-center text-sm text-zinc-300"><span class="w-1.5 h-1.5 bg-emerald-500 mr-3"></span> Acciones [COPY-PASTE] Inmediatas.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-24 relative">
            <div class="max-w-6xl mx-auto px-6 text-center">
                <h2 id="method-title" class="text-xs text-emerald-500 font-bold tracking-[0.3em] uppercase mb-8">Nuestra Tecnología</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="p-8 border border-zinc-800 bg-white/5 rounded-xl">
                        <div class="text-4xl font-black text-white mb-2">9,000+</div>
                        <div id="m1" class="text-xs font-bold uppercase tracking-widest text-zinc-500">Gemelos Sintéticos</div>
                        <p id="m1-desc" class="text-[10px] mt-4 text-zinc-500 leading-relaxed">Colisionamos miles de simulaciones contra su activo para encontrar fallos invisibles.</p>
                    </div>
                    <div class="p-8 border border-zinc-800 bg-white/5 rounded-xl">
                        <div class="text-4xl font-black text-white mb-2">11</div>
                        <div id="m2" class="text-xs font-bold uppercase tracking-widest text-zinc-500">Pilares Forenses</div>
                        <p id="m2-desc" class="text-[10px] mt-4 text-zinc-500 leading-relaxed">Desde psicología de precios hasta arquitectura de autoridad y SEO de IA.</p>
                    </div>
                    <div class="p-8 border border-zinc-800 bg-white/5 rounded-xl">
                        <div class="text-4xl font-black text-white mb-2">0</div>
                        <div id="m3" class="text-xs font-bold uppercase tracking-widest text-zinc-500">Opiniones Subjetivas</div>
                        <p id="m3-desc" class="text-[10px] mt-4 text-zinc-500 leading-relaxed">Cada dato es una sentencia matemática basada en el comportamiento real del usuario.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="terminal-section" class="py-24 bg-emerald-950/10 border-t border-emerald-900/20">
            <div class="max-w-2xl mx-auto px-6">
                
                <div id="setup-stage" class="terminal-box p-8 md:p-12 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                    <h2 id="term-title" class="text-2xl font-black text-white mb-6 uppercase tracking-tighter text-center">Iniciar Diagnóstico Forense</h2>
                    <div class="space-y-4">
                        <input type="text" id="dna-url" placeholder="URL del Activo (ej. tunegocio.com)" class="w-full bg-black border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono text-xs uppercase tracking-widest">
                        <input type="email" id="user-email" placeholder="Email Ejecutivo" class="w-full bg-black border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono text-xs uppercase tracking-widest">
                        <button id="btn-start" onclick="iniciarEscaneo()" class="w-full bg-emerald-600 text-white font-black py-4 rounded hover:bg-emerald-500 transition-all uppercase tracking-[0.2em] text-xs">
                            Ejecutar Escaneo Gratuito
                        </button>
                    </div>
                </div>

                <div id="scanner-stage" class="hidden-flow terminal-box p-8 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                    <div class="scan-line"></div>
                    <div id="terminal-output" class="font-mono text-[10px] text-emerald-500 space-y-1 h-64 overflow-y-auto">
                        <p id="log-init">>> INICIALIZANDO NÚCLEO PREDICTACORE...</p>
                    </div>
                </div>

                <div id="upsell-stage" class="hidden-flow terminal-box p-8 md:p-12 text-center relative border border-emerald-500/50">
                    <div class="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 id="up-t" class="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Radiografía Sellada</h2>
                    <p class="text-zinc-500 text-xs mb-8" id="up-st">Enviado con éxito a <span id="sent-email" class="text-white font-bold"></span>.</p>
                    
                    <div class="bg-black/50 border border-zinc-800 p-6 rounded-lg mb-8 text-left">
                        <p id="box-text" class="text-[11px] text-zinc-400 leading-relaxed">
                            El escaneo inicial muestra cuellos de botella invisibles. Está perdiendo ventas hoy mismo por fricción en la navegación. El Reporte Titán disecta su arquitectura y le muestra cómo sellar estas fugas.
                        </p>
                    </div>

                    <div class="border-t border-zinc-800 pt-8">
                        <h4 class="text-4xl font-black text-white mb-2 tracking-tighter">$239 <span class="text-xs text-zinc-600 line-through font-normal">$700 USD</span></h4>
                        <p id="sub-price" class="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mb-6">+ Suscripción Titán ($15/mes)</p>
                        <button onclick="comprarTitan()" class="w-full bg-emerald-600 text-white font-black py-4 rounded text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-4" id="btn-titan">
                            Activar Protección Titán
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <footer class="py-12 bg-black border-t border-zinc-900 text-center">
            <div class="max-w-2xl mx-auto px-6">
                <p id="footer-text" class="text-[10px] text-zinc-600 uppercase tracking-[0.2em] mb-4">¿Consultor o Agencia? Únete a nuestra red de Auditoría Forense.</p>
                <div class="text-[9px] text-zinc-800 font-mono">
                    © 2026 PREDICTACORE // NODE_STATUS: OPERATIONAL
                </div>
            </div>
        </footer>

        <script>
            let currentLang = 'es';
            const dictionary = {
                es: {
                    heroTitle: "LA ERA DE LAS <br><span class='text-emerald-500'>SUPOSICIONES</span> HA TERMINADO.",
                    heroDesc: "Tener tráfico no garantiza rentabilidad. Su activo digital está perdiendo ventas hoy mismo por errores de fricción invisibles al ojo humano. Nosotros no damos opiniones; dictamos veredictos forenses.",
                    offerTitle: "Lo que entregamos",
                    offerSub: "Un Reporte de Nivel Boardroom.",
                    offerDesc: "No somos una IA genérica ni una consultora cobrando miles de dólares por un PDF bonito. El Reporte Titán es el mapa exacto para sellar las fugas de su negocio.",
                    methodTitle: "Nuestra Tecnología",
                    m1: "Gemelos Sintéticos", m1Desc: "Colisionamos miles de simulaciones contra su activo para encontrar fallos invisibles.",
                    m2: "Pilares Forenses", m2Desc: "Desde psicología de precios hasta arquitectura de autoridad y SEO de IA.",
                    m3: "Cero Opiniones", m3Desc: "Cada dato es una sentencia matemática basada en el comportamiento real.",
                    termTitle: "Iniciar Diagnóstico Forense",
                    btnStart: "Ejecutar Escaneo Gratuito",
                    logInit: ">> INICIALIZANDO NÚCLEO PREDICTACORE...",
                    upT: "Radiografía Sellada", upSt: "Enviado con éxito a",
                    boxText: "El escaneo inicial muestra cuellos de botella invisibles. Está perdiendo ventas hoy mismo por fricción en la navegación. El Reporte Titán disecta su arquitectura y le muestra cómo sellar estas fugas.",
                    subPrice: "+ Suscripción Titán ($15/mes)",
                    btnTitan: "Activar Protección Titán",
                    footerText: "¿Consultor o Agencia? Únete a nuestra red de Auditoría Forense.",
                    alertProcess: "¡Procesando! Su Auditoría Titán ha comenzado.",
                    alertError: "Datos requeridos incompletos."
                },
                en: {
                    heroTitle: "THE ERA OF <br><span class='text-emerald-500'>ASSUMPTIONS</span> IS OVER.",
                    heroDesc: "Traffic does not guarantee profitability. Your digital asset is losing sales today due to friction errors invisible to the human eye. We don't offer opinions; we deliver forensic verdicts.",
                    offerTitle: "What we deliver",
                    offerSub: "A Boardroom Level Report.",
                    offerDesc: "We are not generic AI or a consultancy charging thousands for a pretty PDF. The Titan Report is the exact map to seal your business leaks.",
                    methodTitle: "Our Technology",
                    m1: "Synthetic Twins", m1Desc: "We collide thousands of simulations against your asset to find invisible flaws.",
                    m2: "Forensic Pillars", m2Desc: "From pricing psychology to authority architecture and AI SEO.",
                    m3: "Zero Opinions", m3Desc: "Every data point is a mathematical sentence based on real behavior.",
                    termTitle: "Start Forensic Diagnostic",
                    btnStart: "Execute Free Scan",
                    logInit: ">> INITIALIZING PREDICTACORE CORE...",
                    upT: "X-Ray Sealed", upSt: "Successfully sent to",
                    boxText: "Initial scan shows invisible bottlenecks. You're losing sales today due to navigation friction. The Titan Report dissects your architecture to show you how to seal these leaks.",
                    subPrice: "+ Titan Subscription ($15/mo)",
                    btnTitan: "Activate Titan Protection",
                    footerText: "Consultant or Agency? Join our Forensic Audit network.",
                    alertProcess: "Processing! Your Titan Audit has started.",
                    alertError: "Required data missing."
                }
            };

            function setLanguage(lang) {
                currentLang = lang;
                document.getElementById('lang-es').classList.toggle('active', lang === 'es');
                document.getElementById('lang-en').classList.toggle('active', lang === 'en');
                const d = dictionary[lang];
                document.getElementById('hero-title').innerHTML = d.heroTitle;
                document.getElementById('hero-desc').innerText = d.heroDesc;
                document.getElementById('offer-title').innerText = d.offerTitle;
                document.getElementById('offer-sub').innerText = d.offerSub;
                document.getElementById('offer-desc').innerText = d.offerDesc;
                document.getElementById('method-title').innerText = d.methodTitle;
                document.getElementById('m1').innerText = d.m1; document.getElementById('m1-desc').innerText = d.m1Desc;
                document.getElementById('m2').innerText = d.m2; document.getElementById('m2-desc').innerText = d.m2Desc;
                document.getElementById('m3').innerText = d.m3; document.getElementById('m3-desc').innerText = d.m3Desc;
                document.getElementById('term-title').innerText = d.termTitle;
                document.getElementById('btn-start').innerText = d.btnStart;
                document.getElementById('log-init').innerText = d.logInit;
                document.getElementById('up-t').innerText = d.upT;
                document.getElementById('up-st').innerHTML = \`\${d.upSt} <span id="sent-email" class="text-white font-bold"></span>\`;
                document.getElementById('box-text').innerText = d.boxText;
                document.getElementById('sub-price').innerText = d.subPrice;
                document.getElementById('btn-titan').innerText = d.btnTitan;
                document.getElementById('footer-text').innerText = d.footerText;
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
                    [">> Conectando nodos...", ">> Inyectando Gemelos...", ">> Analizando Fricción...", ">> Sellando Teaser...", ">> Enviando..."] :
                    [">> Connecting nodes...", ">> Injecting Twins...", ">> Analyzing Friction...", ">> Sealing Teaser...", ">> Sending..."];
                fetch('/start-lite', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ dna: url, email: email }) });
                let i = 0;
                const interval = setInterval(() => {
                    const p = document.createElement('p'); p.innerText = logs[i]; terminal.appendChild(p); i++;
                    if(i >= logs.length) { 
                        clearInterval(interval); 
                        setTimeout(() => { document.getElementById('scanner-stage').classList.add('hidden-flow'); document.getElementById('upsell-stage').classList.remove('hidden-flow'); }, 2000); 
                    }
                }, 1000);
            }

            async function comprarTitan() {
                const url = document.getElementById('dna-url').value;
                const email = document.getElementById('user-email').value;
                alert(dictionary[currentLang].alertProcess);
                fetch('/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dna: url, email: email }) });
            }
        </script>
    </body>
    </html>
    `;
}

module.exports = { getLandingHTML };
