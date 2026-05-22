// landing.js - REDISEÑO DE ÉLITE: CERO JERGA TÉCNICA, MÁXIMA AUTORIDAD Y ESTÉTICA BALANCEADA

function getLandingHTML() {
    return `
    <!DOCTYPE html>
    <html lang="en" class="scroll-smooth">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <script>
            window.history.scrollRestoration = 'manual';
            window.onload = function() {
                setTimeout(function() { window.scrollTo(0, 0); }, 10);
            };
        </script>

        <title>PredictaCore | AI Website Audits to Increase Sales</title>
        <meta name="description" content="PredictaCore is the premier AI audit platform. We uncover hidden obstacles that drive your customers away and deliver a precise, step-by-step action plan to increase your sales.">
        
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
            
            :root {
                --pc-emerald: #10b981;
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

            .text-huge { font-size: clamp(2.5rem, 6vw, 5.5rem); line-height: 0.95; font-weight: 900; letter-spacing: -0.05em; }
            
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
                <div class="flex space-x-3 text-[10px] tracking-widest border border-zinc-800 px-3 py-1 rounded-full bg-black/50">
                    <span onclick="setLanguage('en')" id="lang-en" class="lang-btn active">EN</span>
                    <span class="text-zinc-700">/</span>
                    <span onclick="setLanguage('es')" id="lang-es" class="lang-btn">ES</span>
                </div>
                <a href="#terminal-section" id="nav-access" class="text-[10px] uppercase font-bold tracking-widest text-emerald-500 border-b border-emerald-500/30 hover:text-emerald-400 transition-colors">Node Access</a>
            </div>
        </nav>

        <section class="min-h-screen flex flex-col justify-center px-6 pt-32 pb-20">
            <div class="max-w-6xl mx-auto w-full">
                <h1 id="hero-title" class="text-huge text-white mb-12">TRAFFIC DOES NOT GUARANTEE <br><span class="text-emerald-500">PROFITABILITY.</span></h1>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                    <div class="border-l-4 border-emerald-500 pl-6">
                        <p id="hero-desc-left" class="text-xl text-zinc-200 leading-tight">
                            Your digital asset might be losing daily sales due to friction errors invisible to you and your team. We identify those flaws and deliver the exact forensic blueprint to fix them.
                        </p>
                    </div>
                    <div class="border-l-4 border-zinc-700 pl-6 flex flex-col justify-center">
                        <p id="hero-desc-right" class="text-md text-zinc-400 leading-relaxed">
                            We are PredictaCore. Agencies charge thousands for opinions; generic AI gives basic advice. We run thousands of simulations on your website to reveal the invisible errors driving your customers away, and tell you exactly how to fix them.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-24 bg-[#080808] border-y border-zinc-900 overflow-hidden">
            <div class="max-w-6xl mx-auto px-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div class="order-2 lg:order-1">
                        <div class="dossier-preview p-8 md:p-12 rounded-sm aspect-[3/4] max-w-md mx-auto relative flex flex-col">
                            <div class="absolute top-4 right-4 text-[8px] font-bold text-zinc-400 uppercase">TITAN REPORT // CONFIDENTIAL</div>
                            
                            <div class="flex items-center space-x-2 mb-6 border-b border-zinc-200 pb-4 mt-4">
                                <div class="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <span class="font-black tracking-tighter text-lg text-black uppercase">PREDICTA<span class="text-emerald-600">CORE</span></span>
                                <span id="dos-sample" class="text-[9px] text-zinc-400 ml-auto uppercase font-bold tracking-widest bg-zinc-100 px-2 py-1 rounded">SAMPLE EXTRACT</span>
                            </div>

                            <h4 id="dos-title" class="text-2xl font-black mb-4 uppercase tracking-tighter">Vital Signs</h4>
                            
                            <div id="dos-meat" class="flex-grow space-y-3">
                                <div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm">
                                    <p class="text-[9px] text-zinc-900 leading-relaxed font-medium">
                                        <strong>[ Flaw 01 ] - Checkout Friction:</strong><br>
                                        Express payment buttons bypass cart and reduce AOV.<br>
                                        <span class="text-emerald-700 font-bold block mt-1">>> [DIRECT ACTION]:</span> Restrict express buttons to final screen.
                                    </p>
                                </div>
                                <div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm">
                                    <p class="text-[9px] text-zinc-900 leading-relaxed font-medium">
                                        <strong>[ Flaw 02 ] - Authority Weakness:</strong><br>
                                        Website disconnected from positive external reviews.<br>
                                        <span class="text-emerald-700 font-bold block mt-1">>> [DIRECT ACTION]:</span> Inject dynamic social proof carousel.
                                    </p>
                                </div>
                                <div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm">
                                    <p class="text-[9px] text-zinc-900 leading-relaxed font-medium">
                                        <strong>[ Flaw 03 ] - Visual Paralysis:</strong><br>
                                        Cluttered main menu fragments user attention.<br>
                                        <span class="text-emerald-700 font-bold block mt-1">>> [DIRECT ACTION]:</span> Consolidate navigation into "Shop By Item".
                                    </p>
                                </div>
                            </div>
                            
                            <div class="mt-6 pt-4 border-t border-zinc-200">
                                <div class="h-2 bg-zinc-200 w-full mb-2"></div>
                                <div class="h-2 bg-emerald-500 w-3/4"></div>
                            </div>
                        </div>
                    </div>
                    <div class="order-1 lg:order-2">
                        <h2 id="offer-title" class="text-xs text-emerald-500 font-bold tracking-[0.3em] uppercase mb-4">What we deliver</h2>
                        <h3 id="offer-sub" class="text-4xl font-extrabold text-white mb-6 leading-none">A Boardroom Level Blueprint.</h3>
                        <p id="offer-desc" class="text-zinc-300 mb-8 leading-relaxed">
                            We don't give you technical riddles. The Titan Report gives you and your team a clear, step-by-step action plan to remove buying obstacles immediately.
                        </p>
                        
                        <ul class="space-y-6 font-mono text-xs text-zinc-300">
                            <li class="flex items-start">
                                <span class="w-2 h-2 mt-1 bg-emerald-500 mr-4 shrink-0"></span> 
                                <span id="li-1" class="leading-tight">1. Drop-off Point X-Ray<br><span class="text-[10px] text-zinc-500">(Where exactly do they leave?)</span></span>
                            </li>
                            <li class="flex items-start">
                                <span class="w-2 h-2 mt-1 bg-emerald-500 mr-4 shrink-0"></span> 
                                <span id="li-2" class="leading-tight">2. Direct Action Plan<br><span class="text-[10px] text-zinc-500">(What to change today)</span></span>
                            </li>
                            <li class="flex items-start">
                                <span class="w-2 h-2 mt-1 bg-emerald-500 mr-4 shrink-0"></span> 
                                <span id="li-3" class="leading-tight">3. Hidden Competition Analysis<br><span class="text-[10px] text-zinc-500">(Why do they buy elsewhere?)</span></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-24 relative">
            <div class="max-w-6xl mx-auto px-6 text-center">
                <h2 id="method-title" class="text-xs text-emerald-500 font-bold tracking-[0.3em] uppercase mb-12">Our Technology</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div class="p-8 border border-zinc-800 bg-white/5 rounded-xl text-left hover:bg-white/10 transition-colors">
                        <div class="text-3xl font-black text-white mb-2">9,000+</div>
                        <div id="m1" class="text-xs font-bold uppercase tracking-widest text-emerald-500">Synthetic Twins</div>
                        <p id="m1-desc" class="text-[11px] mt-4 text-zinc-300 leading-relaxed">We clone the specific profile of your ideal customer and simulate thousands of visits to find the exact points where they get frustrated and leave.</p>
                    </div>
                    <div class="p-8 border border-zinc-800 bg-white/5 rounded-xl text-left hover:bg-white/10 transition-colors">
                        <div class="text-3xl font-black text-white mb-2">11</div>
                        <div id="m2" class="text-xs font-bold uppercase tracking-widest text-emerald-500">Forensic Pillars</div>
                        <p id="m2-desc" class="text-[11px] mt-4 text-zinc-300 leading-relaxed">We audit every critical aspect of your digital asset, leaving no blind spots in your conversion funnel.</p>
                    </div>
                    <div class="p-8 border border-zinc-800 bg-white/5 rounded-xl text-left hover:bg-white/10 transition-colors">
                        <div class="text-3xl font-black text-white mb-2">0</div>
                        <div id="m3" class="text-xs font-bold uppercase tracking-widest text-emerald-500">Subjective Opinions</div>
                        <p id="m3-desc" class="text-[11px] mt-4 text-zinc-300 leading-relaxed">No guesswork. We deliver the exact instructions needed to seal the leak, based purely on real customer behavior.</p>
                    </div>
                </div>

                <div class="bg-black/50 border border-zinc-800 p-8 rounded-xl text-left max-w-4xl mx-auto">
                    <h3 id="pillars-title" class="text-emerald-500 font-bold tracking-[0.2em] uppercase mb-6 text-[10px] border-b border-zinc-800 pb-4">The 11 Pillars of our Forensic Audit</h3>
                    <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 font-mono text-[10px] text-zinc-400">
                        <li id="p-1"><span class="text-emerald-600 mr-2">01</span> Asset X-Ray</li>
                        <li id="p-2"><span class="text-emerald-600 mr-2">02</span> Psychological Profiles</li>
                        <li id="p-3"><span class="text-emerald-600 mr-2">03</span> Health Scorecard</li>
                        <li id="p-4"><span class="text-emerald-600 mr-2">04</span> Visibility & SEO</li>
                        <li id="p-5"><span class="text-emerald-600 mr-2">05</span> Competitive Benchmark</li>
                        <li id="p-6"><span class="text-emerald-600 mr-2">06</span> SWOT Matrix</li>
                        <li id="p-7"><span class="text-emerald-600 mr-2">07</span> Wishlist</li>
                        <li id="p-8"><span class="text-emerald-600 mr-2">08</span> 15 Drop-off Points</li>
                        <li id="p-9"><span class="text-emerald-600 mr-2">09</span> 15 Tactical Actions</li>
                        <li id="p-10"><span class="text-emerald-600 mr-2">10</span> Scaling Tools</li>
                        <li id="p-11"><span class="text-emerald-600 mr-2">11</span> 21-Day Roadmap</li>
                    </ul>
                </div>
            </div>
        </section>

        <section id="terminal-section" class="py-24 bg-emerald-950/10 border-t border-emerald-900/20">
            <div class="max-w-2xl mx-auto px-6">
                
                <div id="setup-stage" class="terminal-box p-8 md:p-12 shadow-[0_0_50px_rgba(16,185,129,0.1)] border border-zinc-800 bg-black/80 relative">
                    <div class="absolute top-4 right-4 text-[10px] text-emerald-500 font-mono animate-pulse">
                        // AVAILABLE NODES: 2
                    </div>
                    <h2 id="term-title" class="text-2xl font-black text-white mt-4 mb-6 uppercase tracking-tighter text-center">Start Forensic Diagnostic</h2>
                    <div class="space-y-4">
                        <input type="text" id="dna-url" placeholder="Website URL (e.g. yourbusiness.com)" class="w-full bg-black border border-zinc-700 rounded p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono text-xs uppercase tracking-widest">
                        <input type="email" id="user-email" placeholder="Your Email" class="w-full bg-black border border-zinc-700 rounded p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono text-xs uppercase tracking-widest">
                        <button id="btn-start" onclick="iniciarEscaneo()" class="w-full bg-emerald-600 text-white font-black py-4 rounded hover:bg-emerald-500 transition-all uppercase tracking-[0.2em] text-xs">
                            Execute Free Scan
                        </button>
                    </div>
                </div>

                <div id="scanner-stage" class="hidden-flow terminal-box p-8 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)] bg-black border border-emerald-500">
                    <div class="scan-line"></div>
                    <div id="terminal-output" class="font-mono text-[10px] text-emerald-500 space-y-1 h-64 overflow-y-auto">
                        <p id="log-init">>> INITIALIZING PREDICTACORE CORE...</p>
                    </div>
                </div>

                <div id="upsell-stage" class="hidden-flow terminal-box p-8 md:p-12 text-center relative border border-emerald-500/50 bg-black">
                    <div class="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 id="up-t" class="text-2xl font-black text-white mb-2 uppercase tracking-tighter">X-Ray Sealed</h2>
                    <p class="text-zinc-400 text-xs mb-8" id="up-st">Successfully sent to <span id="sent-email" class="text-white font-bold"></span>.</p>
                    
                    <div class="bg-zinc-900 border border-zinc-700 p-6 rounded mb-8 text-left">
                        <p id="box-text" class="text-[11px] text-zinc-300 leading-relaxed">
                            Initial scan shows critical bottlenecks. You are losing sales today due to purchasing obstacles. The Titan Report dissects your website and delivers the exact instructions to fix these leaks.
                        </p>
                    </div>

                    <div class="border-t border-zinc-800 pt-8">
                        <h4 class="text-4xl font-black text-white mb-2 tracking-tighter">$349 <span class="text-xs text-zinc-600 line-through font-normal">$700 USD</span></h4>
                        <p id="sub-price" class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-6">+ Titan Subscription ($25/mo for Continuous Monitoring)</p>
                        
                        <button onclick="comprarTitan()" class="w-full bg-emerald-600 text-white font-black py-4 rounded text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-2" id="btn-titan">
                            Activate Titan Protection
                        </button>
                        <p id="cancel-badge" class="text-[9px] text-zinc-500 uppercase tracking-widest mb-4">(Cancel any time)</p>
                    </div>
                </div>
            </div>
        </section>

        <footer class="py-12 bg-black border-t border-zinc-900 text-center">
            <div class="max-w-4xl mx-auto px-6">
                <p id="footer-text" class="text-[10px] text-emerald-600 uppercase tracking-[0.2em] mb-6">Consultant or Agency? Join our Forensic Audit network.</p>
                <p id="disclaimer-text" class="text-[9px] text-zinc-500 leading-relaxed mb-6 max-w-2xl mx-auto">
                    Disclaimer: PredictaCore provides AI-driven technical and business analysis. We deliver exact instructions, but we do not implement changes directly on your site. Subscription cancellations must be requested at least 5 days prior to the next billing cycle.
                </p>
                <div class="text-[9px] text-zinc-700 font-mono">
                    © 2026 PREDICTACORE // NODE_STATUS: OPERATIONAL
                </div>
            </div>
        </footer>

        <script>
            const urlParams = new URLSearchParams(window.location.search);
            const refCode = urlParams.get('ref') || '';

            let currentLang = 'en';
            
            const dictionary = {
                en: {
                    navAccess: "Node Access",
                    heroTitle: "TRAFFIC DOES NOT GUARANTEE <br><span class='text-emerald-500'>PROFITABILITY.</span>",
                    heroDescLeft: "Your digital asset might be losing daily sales due to friction errors invisible to you and your team. We identify those flaws and deliver the exact forensic blueprint to fix them.",
                    heroDescRight: "We are PredictaCore. Agencies charge thousands for opinions; generic AI gives basic advice. We run thousands of simulations on your website to reveal the invisible errors driving your customers away, and tell you exactly how to fix them.",
                    dosSample: "SAMPLE EXTRACT",
                    dosTitle: "Vital Signs",
                    dosMeat: '<div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm"><p class="text-[9px] text-zinc-900 leading-relaxed font-medium"><strong>[ Flaw 01 ] - Checkout Friction:</strong><br>Express payment buttons bypass cart and reduce AOV.<br><span class="text-emerald-700 font-bold block mt-1">>> [DIRECT ACTION]:</span> Restrict express buttons to final screen.</p></div><div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm"><p class="text-[9px] text-zinc-900 leading-relaxed font-medium"><strong>[ Flaw 02 ] - Authority Weakness:</strong><br>Website disconnected from positive external reviews.<br><span class="text-emerald-700 font-bold block mt-1">>> [DIRECT ACTION]:</span> Inject dynamic social proof carousel.</p></div><div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm"><p class="text-[9px] text-zinc-900 leading-relaxed font-medium"><strong>[ Flaw 03 ] - Visual Paralysis:</strong><br>Cluttered main menu fragments user attention.<br><span class="text-emerald-700 font-bold block mt-1">>> [DIRECT ACTION]:</span> Consolidate navigation into "Shop By Item".</p></div>',
                    offerTitle: "What we deliver", offerSub: "A Boardroom Level Blueprint.", offerDesc: "We don't give you technical riddles. The Titan Report gives you and your team a clear, step-by-step action plan to remove buying obstacles immediately.",
                    li1: "1. Drop-off Point X-Ray<br><span class='text-[10px] text-zinc-500'>(Where exactly do they leave?)</span>", 
                    li2: "2. Direct Action Plan<br><span class='text-[10px] text-zinc-500'>(What to change today)</span>", 
                    li3: "3. Hidden Competition Analysis<br><span class='text-[10px] text-zinc-500'>(Why do they buy elsewhere?)</span>",
                    methodTitle: "Our Technology",
                    m1: "Synthetic Twins", m1Desc: "We clone the specific profile of your ideal customer and simulate thousands of visits to find the exact points where they get frustrated and leave.",
                    m2: "Forensic Pillars", m2Desc: "We audit every critical aspect of your digital asset, leaving no blind spots in your conversion funnel.",
                    m3: "Zero Opinions", m3Desc: "No guesswork. We deliver the exact instructions needed to seal the leak, based purely on real customer behavior.",
                    pillarsTitle: "The 11 Pillars of our Forensic Audit",
                    p1: "Asset X-Ray", p2: "Psychological Profiles", p3: "Health Scorecard", p4: "Visibility & SEO", p5: "Competitive Benchmark", p6: "SWOT Matrix", p7: "Wishlist", p8: "15 Drop-off Points", p9: "15 Tactical Actions", p10: "Scaling Tools", p11: "21-Day Roadmap",
                    termTitle: "Start Forensic Diagnostic", btnStart: "Execute Free Scan",
                    logInit: ">> INITIALIZING PREDICTACORE CORE...",
                    upT: "X-Ray Sealed", upSt: "Successfully sent to",
                    boxText: "Initial scan shows critical bottlenecks. You are losing sales today due to purchasing obstacles. The Titan Report dissects your website and delivers the exact instructions to fix these leaks.",
                    subPrice: "+ Titan Subscription ($25/mo for Continuous Monitoring)", btnTitan: "Activate Titan Protection", cancelBadge: "(Cancel any time)",
                    footerText: "Consultant or Agency? Join our Forensic Audit network.",
                    disclaimerText: "Disclaimer: PredictaCore provides AI-driven technical and business analysis. We deliver exact instructions, but we do not implement changes directly on your site. Subscription cancellations must be requested at least 5 days prior to the next billing cycle.",
                    alertProcess: "Redirecting to secure payment gateway...", alertError: "Required data missing.", successPayment: "Payment confirmed! Your Titan report is being processed by the AI and will arrive in your email shortly.",
                    phUrl: "Website URL (e.g. yourbusiness.com)", phEmail: "Your Email"
                },
                es: {
                    navAccess: "Acceso Nodo",
                    heroTitle: "TENER TRÁFICO NO GARANTIZA <br><span class='text-emerald-500'>RENTABILIDAD.</span>",
                    heroDescLeft: "Tu activo digital podría estar perdiendo ventas diarias por errores invisibles en la navegación que ni tú ni tu equipo conocen. Nosotros rastreamos esas fallas y te entregamos la directiva forense exacta para sellarlas.",
                    heroDescRight: "Somos PredictaCore. Las agencias cobran miles por opiniones; la IA genérica da consejos básicos. Nosotros colisionamos miles de simulaciones contra tu página para revelar los errores invisibles que ahuyentan a tus clientes, y te decimos exactamente cómo solucionarlos.",
                    dosSample: "EXTRACTO DE MUESTRA",
                    dosTitle: "Signos Vitales",
                    dosMeat: '<div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm"><p class="text-[9px] text-zinc-900 leading-relaxed font-medium"><strong>[ Falla 01 ] - Fricción de Checkout:</strong><br>Botones de pago rápido saltan el carrito y reducen el Ticket Promedio.<br><span class="text-emerald-700 font-bold block mt-1">>> [ACCIÓN DIRECTA]:</span> Restringir botones express a la pantalla final.</p></div><div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm"><p class="text-[9px] text-zinc-900 leading-relaxed font-medium"><strong>[ Falla 02 ] - Debilidad de Autoridad:</strong><br>Sitio web desconectado de reseñas externas positivas.<br><span class="text-emerald-700 font-bold block mt-1">>> [ACCIÓN DIRECTA]:</span> Inyectar carrusel dinámico de prueba social.</p></div><div class="p-3 bg-zinc-100 rounded border-l-4 border-red-600 shadow-sm"><p class="text-[9px] text-zinc-900 leading-relaxed font-medium"><strong>[ Falla 03 ] - Parálisis Visual:</strong><br>Menú principal saturado fragmenta la atención.<br><span class="text-emerald-700 font-bold block mt-1">>> [ACCIÓN DIRECTA]:</span> Consolidar navegación en "Shop By Item".</p></div>',
                    offerTitle: "Lo que entregamos", offerSub: "Un Mapa de Acción Definitivo.", offerDesc: "No entregamos acertijos técnicos. El Reporte Titán le da a tu equipo instrucciones precisas paso a paso para eliminar los obstáculos de compra de inmediato.",
                    li1: "1. Radiografía de Abandono<br><span class='text-[10px] text-zinc-500'>(¿Dónde exactamente se van?)</span>", 
                    li2: "2. Plan de Acción Directo<br><span class='text-[10px] text-zinc-500'>(¿Qué cambiar hoy mismo?)</span>", 
                    li3: "3. Análisis de Competencia<br><span class='text-[10px] text-zinc-500'>(¿Por qué compran en otro lado?)</span>",
                    methodTitle: "Nuestra Tecnología",
                    m1: "Gemelos Sintéticos", m1Desc: "Clonamos el perfil exacto de tu cliente ideal y simulamos miles de visitas para encontrar los puntos exactos donde se frustran y abandonan.",
                    m2: "Pilares Forenses", m2Desc: "Auditamos cada aspecto crítico de tu activo digital, sin dejar puntos ciegos en tu embudo de conversión.",
                    m3: "Cero Opiniones", m3Desc: "Sin adivinanzas. Entregamos las instrucciones exactas para sellar la fuga, basados puramente en el comportamiento real del cliente.",
                    pillarsTitle: "Los 11 Pilares de nuestra Auditoría Forense",
                    p1: "Radiografía del Activo", p2: "Perfiles Psicológicos", p3: "Scorecard de Salud", p4: "Visibilidad y SEO", p5: "Benchmark Competitivo", p6: "Matriz Estratégica", p7: "Lista de Deseos", p8: "15 Puntos de Fuga", p9: "15 Acciones Tácticas", p10: "Herramientas de Escala", p11: "Hoja de Ruta a 21 Días",
                    termTitle: "Iniciar Diagnóstico Forense", btnStart: "Ejecutar Escaneo Gratuito",
                    logInit: ">> INICIALIZANDO NÚCLEO PREDICTACORE...",
                    upT: "Radiografía Sellada", upSt: "Enviado con éxito a",
                    boxText: "El escaneo inicial muestra cuellos de botella críticos. Estás perdiendo ventas hoy por obstáculos de compra. El Reporte Titán disecta tu sitio y entrega las instrucciones exactas para arreglar estas fugas.",
                    subPrice: "+ Suscripción Titán ($25/mes por Monitoreo Continuo)", btnTitan: "Activar Protección Titán", cancelBadge: "(Cancela cuando quieras)",
                    footerText: "¿Consultor o Agencia? Únete a nuestra red de Auditoría Forense.",
                    disclaimerText: "Descargo de responsabilidad: PredictaCore provee análisis técnico y de negocios impulsado por IA. Entregamos instrucciones exactas, pero no implementamos cambios directamente en su sitio. Las cancelaciones de suscripción deben solicitarse al menos 5 días antes del siguiente ciclo de facturación.",
                    alertProcess: "Redirigiendo a la pasarela segura de pago...", alertError: "Faltan datos requeridos.", successPayment: "¡Pago confirmado! Tu reporte Titán está siendo procesado por la IA y llegará a tu correo a la brevedad.",
                    phUrl: "URL del Sitio (ej. tunegocio.com)", phEmail: "Tu Email"
                }
            };

            if (urlParams.get('success') === 'true') {
                alert(dictionary[currentLang].successPayment);
            }

            function setLanguage(lang) {
                currentLang = lang;
                document.getElementById('lang-es').classList.toggle('active', lang === 'es');
                document.getElementById('lang-en').classList.toggle('active', lang === 'en');
                const d = dictionary[lang];
                
                document.getElementById('nav-access').innerText = d.navAccess;
                document.getElementById('hero-title').innerHTML = d.heroTitle;
                document.getElementById('hero-desc-left').innerText = d.heroDescLeft;
                document.getElementById('hero-desc-right').innerText = d.heroDescRight;
                
                document.getElementById('dos-sample').innerText = d.dosSample;
                document.getElementById('dos-title').innerText = d.dosTitle;
                document.getElementById('dos-meat').innerHTML = d.dosMeat;

                document.getElementById('offer-title').innerText = d.offerTitle;
                document.getElementById('offer-sub').innerText = d.offerSub;
                document.getElementById('offer-desc').innerText = d.offerDesc;
                document.getElementById('li-1').innerHTML = d.li1;
                document.getElementById('li-2').innerHTML = d.li2;
                document.getElementById('li-3').innerHTML = d.li3;

                document.getElementById('method-title').innerText = d.methodTitle;
                document.getElementById('m1').innerText = d.m1; document.getElementById('m1-desc').innerText = d.m1Desc;
                document.getElementById('m2').innerText = d.m2; document.getElementById('m2-desc').innerText = d.m2Desc;
                document.getElementById('m3').innerText = d.m3; document.getElementById('m3-desc').innerText = d.m3Desc;
                
                document.getElementById('pillars-title').innerText = d.pillarsTitle;
                for(let i=1; i<=11; i++) {
                    let text = d['p'+i];
                    let num = i < 10 ? '0'+i : i;
                    document.getElementById('p-'+i).innerHTML = '<span class="text-emerald-600 mr-2">' + num + '</span> ' + text;
                }
                
                document.getElementById('term-title').innerText = d.termTitle;
                document.getElementById('btn-start').innerText = d.btnStart;
                document.getElementById('dna-url').placeholder = d.phUrl;
                document.getElementById('user-email').placeholder = d.phEmail;
                document.getElementById('log-init').innerText = d.logInit;
                
                document.getElementById('up-t').innerText = d.upT;
                document.getElementById('up-st').innerHTML = d.upSt + ' <span id="sent-email" class="text-white font-bold">' + document.getElementById('user-email').value + '</span>.';
                
                document.getElementById('box-text').innerText = d.boxText;
                document.getElementById('sub-price').innerText = d.subPrice;
                document.getElementById('btn-titan').innerText = d.btnTitan;
                document.getElementById('cancel-badge').innerText = d.cancelBadge;
                
                document.getElementById('footer-text').innerText = d.footerText;
                document.getElementById('disclaimer-text').innerText = d.disclaimerText;
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
                    [">> Conectando nodos...", ">> Inyectando Gemelos Sintéticos...", ">> Analizando Perfiles y Fricción...", ">> Sellando Teaser...", ">> Enviando..."] :
                    [">> Connecting nodes...", ">> Injecting Synthetic Twins...", ">> Analyzing Profiles & Friction...", ">> Sealing Teaser...", ">> Sending..."];
                
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
                if(!url || !email) return alert(dictionary[currentLang].alertError);

                alert(dictionary[currentLang].alertProcess);
                
                try {
                    const res = await fetch('/start', { 
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify({ dna: url, email: email, refCode: refCode }) 
                    });
                    const data = await res.json();
                    
                    if (data.status === 'checkout' && data.url) {
                        window.location.href = data.url; 
                    } else {
                        alert(currentLang === 'es' ? "Error al generar enlace de pago." : "Error generating checkout URL.");
                    }
                } catch (err) {
                    console.error("!!! Error en pasarela:", err);
                    alert("Error de red.");
                }
            }
        </script>
    </body>
    </html>
    `;
}

module.exports = { getLandingHTML };
