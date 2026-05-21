// landing.js - REDISEÑO DE ÉLITE: NARRATIVA FORENSE, GEO/SEO Y MURO DE PAGO

function getLandingHTML() {
    return `
    <!DOCTYPE html>
    <html lang="en" class="scroll-smooth">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <title>PredictaCore | AI Forensic Website Audits & CRO</title>
        <meta name="description" content="PredictaCore is the premier AI forensic audit platform. We simulate your exact customer profiles to uncover hidden UX friction and deliver precise, code-level instructions to seal conversion leaks and increase sales.">
        <meta name="keywords" content="Conversion Rate Optimization, CRO audit, AI business audit, forensic website analysis, sales funnel optimization, fix UX friction, ecommerce conversion analysis">
        <meta name="author" content="PredictaCore">
        
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "PredictaCore Titan",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "AI-driven forensic analysis tool that identifies website conversion bottlenecks through synthetic user simulation. Delivers exact actionable code and architectural instructions to optimize sales.",
          "offers": {
            "@type": "Offer",
            "price": "349.00",
            "priceCurrency": "USD"
          }
        }
        </script>

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
                <div class="flex space-x-3 text-[10px] tracking-widest border border-zinc-800 px-3 py-1 rounded-full">
                    <span onclick="setLanguage('en')" id="lang-en" class="lang-btn active">EN</span>
                    <span class="text-zinc-700">/</span>
                    <span onclick="setLanguage('es')" id="lang-es" class="lang-btn">ES</span>
                </div>
                <a href="#terminal-section" id="nav-access" class="text-[10px] uppercase font-bold tracking-widest text-emerald-500 border-b border-emerald-500/30">Node Access</a>
            </div>
        </nav>

        <section class="min-h-screen flex flex-col justify-center px-6 pt-32 pb-20">
            <div class="max-w-6xl mx-auto w-full">
                <h1 id="hero-title" class="text-huge text-white mb-8">TRAFFIC DOES NOT GUARANTEE <br><span class="text-emerald-500">PROFITABILITY.</span></h1>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <p id="hero-desc" class="text-xl text-zinc-400 leading-tight border-l-4 border-emerald-500 pl-6">
                        Your digital asset might be losing daily sales due to friction errors invisible to you and your team. We track those flaws and deliver the exact forensic verdict to fix them.
                    </p>
                    <div class="flex items-end justify-start md:justify-end">
                        <div class="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-mono">
                            // Ecosistema Blindado v.2.5
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
                            <div class="absolute top-4 right-4 text-[8px] font-bold text-zinc-400 uppercase">TITAN REPORT // CONFIDENTIAL</div>
                            <h4 id="dos-title" class="text-2xl font-black mb-6 uppercase tracking-tighter">Vital Signs</h4>
                            <div class="space-y-4 font-mono text-[10px]">
                                <div class="flex justify-between border-b border-zinc-200 pb-2">
                                    <span id="dos-p1">Pillar 02: UX/UI Friction</span>
                                    <span id="dos-s1" class="text-red-600 font-bold">4/10 [Leak]</span>
                                </div>
                                <div class="flex justify-between border-b border-zinc-200 pb-2">
                                    <span id="dos-p2">Pillar 05: Authority Arch.</span>
                                    <span id="dos-s2" class="text-red-600 font-bold">3/10 [Leak]</span>
                                </div>
                                <div class="flex justify-between border-b border-zinc-200 pb-2">
                                    <span id="dos-p3">Pillar 07: Checkout Velocity</span>
                                    <span id="dos-s3" class="text-emerald-600 font-bold">9/10 [Optimized]</span>
                                </div>
                            </div>
                            <div id="dos-meat" class="mt-8 p-4 bg-zinc-100 rounded text-[9px] leading-relaxed border-l-2 border-red-500 font-bold">
                                "Critical Flaw 04: Main CTA button suffers a 1.2s delay on mobile devices, causing an 18% hidden drop-off rate. Immediate action: Modify LCP rendering priority."
                            </div>
                            <div class="mt-8 pt-6 border-t border-zinc-200">
                                <div class="h-2 bg-zinc-200 w-full mb-2"></div>
                                <div class="h-2 bg-emerald-500 w-3/4"></div>
                            </div>
                        </div>
                    </div>
                    <div class="order-1 lg:order-2">
                        <h2 id="offer-title" class="text-xs text-emerald-500 font-bold tracking-[0.3em] uppercase mb-4">What we deliver</h2>
                        <h3 id="offer-sub" class="text-4xl font-extrabold text-white mb-6 leading-none">A Boardroom Level Report.</h3>
                        <p id="offer-desc" class="text-zinc-400 mb-8 leading-relaxed">
                            We don't do automatic fixes or generic opinions. The Titan Report gives you the exact code and structural changes needed so your team can seal the leaks immediately.
                        </p>
                        <ul class="space-y-4 font-mono text-[11px] text-zinc-300">
                            <li class="flex items-center"><span class="w-1.5 h-1.5 bg-emerald-500 mr-3"></span> <span id="li-1">Identification of Hidden Drop-off Points.</span></li>
                            <li class="flex items-center"><span class="w-1.5 h-1.5 bg-emerald-500 mr-3"></span> <span id="li-2">Exact Actionable Code [COPY-PASTE].</span></li>
                            <li class="flex items-center"><span class="w-1.5 h-1.5 bg-emerald-500 mr-3"></span> <span id="li-3">Black Box Aesthetic & Executive Priority.</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-24 relative">
            <div class="max-w-6xl mx-auto px-6 text-center">
                <h2 id="method-title" class="text-xs text-emerald-500 font-bold tracking-[0.3em] uppercase mb-12">Our Technology</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="p-8 border border-zinc-800 bg-white/5 rounded-xl text-left">
                        <div class="text-3xl font-black text-white mb-2">9,000+</div>
                        <div id="m1" class="text-xs font-bold uppercase tracking-widest text-emerald-500">Synthetic Twins</div>
                        <p id="m1-desc" class="text-[10px] mt-4 text-zinc-400 leading-relaxed">We don't use random traffic. We clone the specific profile of your ideal customer and collide them against your asset to find invisible drop-off points.</p>
                    </div>
                    <div class="p-8 border border-zinc-800 bg-white/5 rounded-xl text-left">
                        <div class="text-3xl font-black text-white mb-2">11</div>
                        <div id="m2" class="text-xs font-bold uppercase tracking-widest text-emerald-500">Forensic Pillars</div>
                        <p id="m2-desc" class="text-[10px] mt-4 text-zinc-400 leading-relaxed">We audit Checkout Velocity, UX/UI Friction, Authority Architecture, Pricing Psychology, Cognitive Load, Trust Signals, and technical SEO structure.</p>
                    </div>
                    <div class="p-8 border border-zinc-800 bg-white/5 rounded-xl text-left">
                        <div class="text-3xl font-black text-white mb-2">0</div>
                        <div id="m3" class="text-xs font-bold uppercase tracking-widest text-emerald-500">Subjective Opinions</div>
                        <p id="m3-desc" class="text-[10px] mt-4 text-zinc-400 leading-relaxed">No guesswork. We deliver the exact line of code or structural change needed to seal the leak, based purely on mathematical behavior.</p>
                    </div>
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
                        <input type="text" id="dna-url" placeholder="Asset URL (e.g. yourbusiness.com)" class="w-full bg-black border border-zinc-800 rounded p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono text-xs uppercase tracking-widest">
                        <input type="email" id="user-email" placeholder="Executive Email" class="w-full bg-black border border-zinc-800 rounded p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono text-xs uppercase tracking-widest">
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
                    <p class="text-zinc-500 text-xs mb-8" id="up-st">Successfully sent to <span id="sent-email" class="text-white font-bold"></span>.</p>
                    
                    <div class="bg-zinc-900 border border-zinc-800 p-6 rounded mb-8 text-left">
                        <p id="box-text" class="text-[11px] text-zinc-400 leading-relaxed">
                            Initial scan shows critical bottlenecks. You are losing sales today due to UX friction. The Titan Report dissects your architecture and delivers the exact instructions to seal these leaks.
                        </p>
                    </div>

                    <div class="border-t border-zinc-800 pt-8">
                        <h4 class="text-4xl font-black text-white mb-2 tracking-tighter">$349 <span class="text-xs text-zinc-600 line-through font-normal">$700 USD</span></h4>
                        <p id="sub-price" class="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mb-6">+ Titan Subscription ($15/mo)</p>
                        <button onclick="comprarTitan()" class="w-full bg-emerald-600 text-white font-black py-4 rounded text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-4" id="btn-titan">
                            Activate Titan Protection
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <footer class="py-12 bg-black border-t border-zinc-900 text-center">
            <div class="max-w-4xl mx-auto px-6">
                <p id="footer-text" class="text-[10px] text-emerald-600 uppercase tracking-[0.2em] mb-6">Consultant or Agency? Join our Forensic Audit network.</p>
                <p id="disclaimer-text" class="text-[9px] text-zinc-600 leading-relaxed mb-6 max-w-2xl mx-auto">
                    Disclaimer: PredictaCore provides AI-driven technical and UX analysis. We deliver exact instructions, but we do not implement changes directly on your site. Results depend on your team's execution. This service does not constitute legal or financial advice.
                </p>
                <div class="text-[9px] text-zinc-800 font-mono">
                    © 2026 PREDICTACORE // NODE_STATUS: OPERATIONAL
                </div>
            </div>
        </footer>

        <script>
            // RASTREO FANTASMA DE AFILIADOS
            const urlParams = new URLSearchParams(window.location.search);
            const refCode = urlParams.get('ref') || '';

            let currentLang = 'en';
            
            const dictionary = {
                en: {
                    navAccess: "Node Access",
                    heroTitle: "TRAFFIC DOES NOT GUARANTEE <br><span class='text-emerald-500'>PROFITABILITY.</span>",
                    heroDesc: "Your digital asset might be losing daily sales due to friction errors invisible to you and your team. We track those flaws and deliver the exact forensic verdict to fix them.",
                    dosTitle: "Vital Signs", dosP1: "Pillar 02: UX/UI Friction", dosS1: "4/10 [Leak]", dosP2: "Pillar 05: Authority Arch.", dosS2: "3/10 [Leak]", dosP3: "Pillar 07: Checkout Velocity", dosS3: "9/10 [Optimized]",
                    dosMeat: `"Critical Flaw 04: Main CTA button suffers a 1.2s delay on mobile devices, causing an 18% hidden drop-off rate. Immediate action: Modify LCP rendering priority."`,
                    offerTitle: "What we deliver", offerSub: "A Boardroom Level Report.", offerDesc: "We don't do automatic fixes or generic opinions. The Titan Report gives you the exact code and structural changes needed so your team can seal the leaks immediately.",
                    li1: "Identification of Hidden Drop-off Points.", li2: "Exact Actionable Code [COPY-PASTE].", li3: "Black Box Aesthetic & Executive Priority.",
                    methodTitle: "Our Technology",
                    m1: "Synthetic Twins", m1Desc: "We don't use random traffic. We clone the specific profile of your ideal customer and collide them against your asset to find invisible drop-off points.",
                    m2: "Forensic Pillars", m2Desc: "We audit Checkout Velocity, UX/UI Friction, Authority Architecture, Pricing Psychology, Cognitive Load, Trust Signals, and technical SEO structure.",
                    m3: "Zero Opinions", m3Desc: "No guesswork. We deliver the exact line of code or structural change needed to seal the leak, based purely on mathematical behavior.",
                    termTitle: "Start Forensic Diagnostic", btnStart: "Execute Free Scan",
                    logInit: ">> INITIALIZING PREDICTACORE CORE...",
                    upT: "X-Ray Sealed", upSt: "Successfully sent to",
                    boxText: "Initial scan shows critical bottlenecks. You are losing sales today due to UX friction. The Titan Report dissects your architecture and delivers the exact instructions to seal these leaks.",
                    subPrice: "+ Titan Subscription ($15/mo)", btnTitan: "Activate Titan Protection",
                    footerText: "Consultant or Agency? Join our Forensic Audit network.",
                    disclaimerText: "Disclaimer: PredictaCore provides AI-driven technical and UX analysis. We deliver exact instructions, but we do not implement changes directly on your site. Results depend on your team's execution. This service does not constitute legal or financial advice.",
                    alertProcess: "Redirecting to secure payment gateway...", alertError: "Required data missing.", successPayment: "Payment confirmed! Your Titan report is being processed by the AI and will arrive in your email shortly.",
                    phUrl: "Asset URL (e.g. yourbusiness.com)", phEmail: "Executive Email"
                },
                es: {
                    navAccess: "Acceso Nodo",
                    heroTitle: "TENER TRÁFICO NO GARANTIZA <br><span class='text-emerald-500'>RENTABILIDAD.</span>",
                    heroDesc: "Tu activo digital podría estar perdiendo ventas diarias por errores invisibles en la navegación que ni tú ni tu equipo conocen. Nosotros rastreamos esas fallas y te dictamos el veredicto forense para sellarlas.",
                    dosTitle: "Signos Vitales", dosP1: "Pilar 02: Fricción UX/UI", dosS1: "4/10 [Fuga]", dosP2: "Pilar 05: Arq. de Autoridad", dosS2: "3/10 [Fuga]", dosP3: "Pilar 07: Vel. de Checkout", dosS3: "9/10 [Optimizado]",
                    dosMeat: `"Falla Crítica 04: El botón principal de compra sufre un retraso de 1.2s en la versión móvil, provocando una tasa de abandono oculta del 18%. Acción inmediata: Modificar prioridad de renderizado (LCP)."`,
                    offerTitle: "Lo que entregamos", offerSub: "Un Reporte de Nivel Boardroom.", offerDesc: "No hacemos arreglos automáticos ni damos opiniones genéricas. El Reporte Titán le da a tu equipo el código exacto y los cambios estructurales para sellar las fugas de inmediato.",
                    li1: "Identificación de Puntos de Abandono Ocultos.", li2: "Código Exacto Accionable [COPY-PASTE].", li3: "Estética Black Box y Prioridad Ejecutiva.",
                    methodTitle: "Nuestra Tecnología",
                    m1: "Gemelos Sintéticos", m1Desc: "No usamos tráfico al azar. Clonamos el perfil exacto de tu cliente ideal y lo colisionamos contra tu activo para encontrar puntos de fuga invisibles.",
                    m2: "Pilares Forenses", m2Desc: "Auditamos Velocidad de Checkout, Fricción UX/UI, Arquitectura de Autoridad, Psicología de Precios, Carga Cognitiva, Señales de Confianza y estructura SEO técnica.",
                    m3: "Cero Opiniones", m3Desc: "Sin adivinanzas. Entregamos la línea de código o el cambio estructural exacto para sellar la fuga, basados puramente en comportamiento matemático.",
                    termTitle: "Iniciar Diagnóstico Forense", btnStart: "Ejecutar Escaneo Gratuito",
                    logInit: ">> INICIALIZANDO NÚCLEO PREDICTACORE...",
                    upT: "Radiografía Sellada", upSt: "Enviado con éxito a",
                    boxText: "El escaneo inicial muestra cuellos de botella críticos. Estás perdiendo ventas hoy por fricción UX. El Reporte Titán disecta tu arquitectura y entrega las instrucciones exactas para sellar estas fugas.",
                    subPrice: "+ Suscripción Titán ($15/mes)", btnTitan: "Activar Protección Titán",
                    footerText: "¿Consultor o Agencia? Únete a nuestra red de Auditoría Forense.",
                    disclaimerText: "Descargo de responsabilidad: PredictaCore provee análisis técnico y UX impulsado por IA. Entregamos instrucciones exactas, pero no implementamos cambios directamente en su sitio. Los resultados dependen de la ejecución de su equipo. Este servicio no constituye asesoramiento legal o financiero.",
                    alertProcess: "Redirigiendo a la pasarela segura de pago...", alertError: "Faltan datos requeridos.", successPayment: "¡Pago confirmado! Tu reporte Titán está siendo procesado por la IA y llegará a tu correo a la brevedad.",
                    phUrl: "URL del Activo (ej. tunegocio.com)", phEmail: "Email Ejecutivo"
                }
            };

            // Alerta si regresa de un pago exitoso
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
                document.getElementById('hero-desc').innerText = d.heroDesc;
                
                document.getElementById('dos-title').innerText = d.dosTitle;
                document.getElementById('dos-p1').innerText = d.dosP1; document.getElementById('dos-s1').innerText = d.dosS1;
                document.getElementById('dos-p2').innerText = d.dosP2; document.getElementById('dos-s2').innerText = d.dosS2;
                document.getElementById('dos-p3').innerText = d.dosP3; document.getElementById('dos-s3').innerText = d.dosS3;
                document.getElementById('dos-meat').innerText = d.dosMeat;

                document.getElementById('offer-title').innerText = d.offerTitle;
                document.getElementById('offer-sub').innerText = d.offerSub;
                document.getElementById('offer-desc').innerText = d.offerDesc;
                document.getElementById('li-1').innerText = d.li1;
                document.getElementById('li-2').innerText = d.li2;
                document.getElementById('li-3').innerText = d.li3;

                document.getElementById('method-title').innerText = d.methodTitle;
                document.getElementById('m1').innerText = d.m1; document.getElementById('m1-desc').innerText = d.m1Desc;
                document.getElementById('m2').innerText = d.m2; document.getElementById('m2-desc').innerText = d.m2Desc;
                document.getElementById('m3').innerText = d.m3; document.getElementById('m3-desc').innerText = d.m3Desc;
                
                document.getElementById('term-title').innerText = d.termTitle;
                document.getElementById('btn-start').innerText = d.btnStart;
                document.getElementById('dna-url').placeholder = d.phUrl;
                document.getElementById('user-email').placeholder = d.phEmail;
                document.getElementById('log-init').innerText = d.logInit;
                
                document.getElementById('up-t').innerText = d.upT;
                document.getElementById('up-st').innerHTML = \`\${d.upSt} <span id="sent-email" class="text-white font-bold">\${document.getElementById('user-email').value}</span>.\`;
                document.getElementById('box-text').innerText = d.boxText;
                document.getElementById('sub-price').innerText = d.subPrice;
                document.getElementById('btn-titan').innerText = d.btnTitan;
                
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
