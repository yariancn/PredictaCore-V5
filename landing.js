// landing.js - LANDING PAGE FORENSE COMPLETA (HERO + METODOLOGÍA + PARTNERS)

function getLandingHTML() {
    return `
    <!DOCTYPE html>
    <html lang="es" class="scroll-smooth">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore Titán - Inteligencia Forense de Conversión</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
            body { background: #050505; color: #d1d5db; font-family: 'Inter', sans-serif; }
            .hero-bg { background-image: radial-gradient(circle at 50% 0%, #1e293b 0%, transparent 60%); }
            .terminal-box { background: rgba(15, 23, 42, 0.8); border: 1px solid #1e293b; border-radius: 12px; backdrop-filter: blur(12px); }
            .mockup-card { background: linear-gradient(180deg, rgba(15,23,42,1) 0%, rgba(5,5,5,1) 100%); border: 1px solid #10b981; }
            .hidden-flow { display: none !important; }
            .scan-line { width: 100%; height: 2px; background: #10b981; position: absolute; top: 0; left: 0; animation: scan 3s infinite linear; opacity: 0.3; }
            @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
            .lang-btn { cursor: pointer; transition: all 0.3s; opacity: 0.5; }
            .lang-btn.active { opacity: 1; color: #10b981; font-weight: bold; }
        </style>
    </head>
    <body class="antialiased overflow-x-hidden">
        
        <div class="fixed top-6 right-6 flex space-x-4 text-xs tracking-widest z-50 bg-black/50 p-2 rounded-full border border-zinc-800 backdrop-blur-md">
            <span onclick="setLanguage('es')" id="lang-es" class="lang-btn active px-2">ES</span>
            <span class="text-zinc-700">|</span>
            <span onclick="setLanguage('en')" id="lang-en" class="lang-btn px-2">EN</span>
        </div>

        <section class="min-h-screen flex items-center justify-center p-4 hero-bg relative pt-20 pb-20">
            <div class="max-w-2xl w-full relative z-10">
                
                <div id="setup-stage" class="terminal-box p-8 md:p-10 text-center shadow-[0_0_40px_rgba(15,23,42,0.9)]">
                    <div class="flex items-center justify-center space-x-3 mb-8">
                        <div class="w-12 h-12 border border-emerald-500/50 bg-emerald-950/30 rounded flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <svg class="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
                        </div>
                        <h1 class="text-3xl font-800 text-white tracking-tighter uppercase">PREDICTA<span class="text-emerald-500 font-black">CORE</span></h1>
                    </div>
                    
                    <div class="mb-8 text-left border-l-2 border-emerald-500 pl-5">
                        <h2 id="intro-heading" class="text-xs text-emerald-500 font-bold tracking-[0.2em] uppercase mb-3">Auditoría Forense de Conversión</h2>
                        <p id="intro-desc" class="text-sm text-zinc-400 leading-relaxed">
                            Tener tráfico no sirve de nada si tu página no convierte. Tu negocio está perdiendo ventas todos los días por errores de navegación y fricción invisibles al ojo humano. No somos una agencia con opiniones subjetivas ni una IA genérica. Nuestro motor inyecta 9,000 "gemelos sintéticos" que simulan navegar y comprar en tu sitio, detectando el punto exacto donde los clientes abandonan.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <input type="text" id="dna-url" placeholder="URL del Activo (ej. empresa.com)" class="w-full bg-black/80 border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono text-sm">
                        <input type="email" id="user-email" placeholder="Canal de Entrega (Email Ejecutivo)" class="w-full bg-black/80 border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono text-sm">
                        <button id="btn-start" onclick="iniciarEscaneo()" class="w-full bg-white text-black font-extrabold py-5 rounded-lg hover:bg-emerald-500 hover:text-white transition-all uppercase tracking-[0.15em] text-xs shadow-[0_0_20px_rgba(255,255,255,0.1)] mt-2">
                            Iniciar Diagnóstico Gratuito
                        </button>
                    </div>
                </div>

                <div id="scanner-stage" class="hidden-flow terminal-box p-8 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                    <div class="scan-line"></div>
                    <div class="flex items-center space-x-3 mb-4 border-b border-zinc-800 pb-4">
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span class="text-xs text-emerald-500 tracking-widest font-bold uppercase">Motor Simbióptico Activo</span>
                    </div>
                    <div id="terminal-output" class="font-mono text-[10px] md:text-xs text-zinc-500 space-y-2 h-64 overflow-y-auto">
                        <p class="text-emerald-500 font-bold" id="log-init">>> INICIALIZANDO NÚCLEO PREDICTACORE...</p>
                    </div>
                </div>

                <div id="upsell-stage" class="hidden-flow terminal-box p-8 md:p-12 text-center border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)] relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
                    <div class="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 class="text-3xl font-extrabold text-white mb-2 tracking-tight" id="upsell-title">Radiografía Enviada</h2>
                    <p class="text-zinc-400 mb-8 text-sm"><span id="upsell-subtitle">El reporte inicial ha sido entregado a</span> <span id="sent-email" class="text-white font-bold"></span>.</p>
                    
                    <div class="bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-lg mb-8 text-left">
                        <h3 class="text-emerald-400 font-bold uppercase tracking-widest text-[10px] mb-3 flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <span id="box-tag">Vectores de Optimización Detectados</span>
                        </h3>
                        <p class="text-sm text-zinc-300 leading-relaxed" id="box-text">
                            El escaneo inicial muestra que tu página tiene cuellos de botella invisibles. Estás atrayendo visitas, pero no se están convirtiendo en clientes al ritmo que deberían. El Reporte Titán te muestra exactamente dónde se caen las ventas y cómo arreglarlo.
                        </p>
                    </div>

                    <div class="border-t border-zinc-800 pt-8">
                        <h4 class="text-5xl font-black text-white mb-2 tracking-tighter">$239 <span class="text-lg text-zinc-600 line-through font-normal">$700 USD</span></h4>
                        <p class="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em] mb-8" id="sub-price">Incluye Suscripción Titán ($15/mes)</p>
                        
                        <button onclick="comprarTitan()" class="w-full bg-emerald-600 text-white font-extrabold py-5 px-12 rounded-lg text-sm uppercase tracking-[0.15em] hover:bg-emerald-500 transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] mb-5" id="btn-titan">
                            Activar Protección Titán
                        </button>

                        <div class="max-w-xs mx-auto text-[10px] text-zinc-500 uppercase leading-relaxed tracking-wider" id="disclaimer">
                            Analizado mediante la colisión de 9,000 modelos simbiópticos. Cargo único de $239 y suscripción mensual de $15.
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-24 bg-black relative border-t border-zinc-900">
            <div class="max-w-5xl mx-auto px-6">
                <div class="text-center mb-16">
                    <h2 class="text-xs text-emerald-500 font-bold tracking-[0.2em] uppercase mb-3" id="proof-title">La Anatomía del Veredicto</h2>
                    <h3 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight" id="proof-sub">Qué incluye el Reporte Titán</h3>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="mockup-card rounded-xl p-8 relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
                        <div class="text-emerald-500 font-mono text-sm mb-4">01 //</div>
                        <h4 class="text-xl font-bold text-white mb-3 tracking-tight" id="proof-c1">15 Puntos de Fuga</h4>
                        <p class="text-sm text-zinc-400 leading-relaxed" id="proof-c1t">Identificación exacta de la hemorragia de capital y fricción dentro de su embudo de conversión y arquitectura de decisión.</p>
                    </div>
                    <div class="mockup-card rounded-xl p-8 relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
                        <div class="text-emerald-500 font-mono text-sm mb-4">02 //</div>
                        <h4 class="text-xl font-bold text-white mb-3 tracking-tight" id="proof-c2">Matriz Táctica (SWOT)</h4>
                        <p class="text-sm text-zinc-400 leading-relaxed" id="proof-c2t">Diagnóstico forense de amenazas y oportunidades frente a su competencia directa en el campo de batalla digital.</p>
                    </div>
                    <div class="mockup-card rounded-xl p-8 relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
                        <div class="text-emerald-500 font-mono text-sm mb-4">03 //</div>
                        <h4 class="text-xl font-bold text-white mb-3 tracking-tight" id="proof-c3">Acciones [COPY-PASTE]</h4>
                        <p class="text-sm text-zinc-400 leading-relaxed" id="proof-c3t">Soluciones exactas, textos reescritos y directrices de código listas para que su equipo las implemente hoy mismo.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-24 bg-[#0a0f18] relative border-t border-zinc-900">
            <div class="max-w-5xl mx-auto px-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 class="text-xs text-emerald-500 font-bold tracking-[0.2em] uppercase mb-3" id="method-title">El Motor Simbióptico</h2>
                        <h3 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-6">Auditoría de Nivel <br>Boardroom.</h3>
                        <p class="text-zinc-400 text-sm leading-relaxed mb-8">
                            PredictaCore no emite sugerencias de diseño. Ejecutamos una disección anatómica basada en inteligencia matemática y comportamiento humano para proteger su flujo de caja.
                        </p>
                        <ul class="space-y-6">
                            <li class="flex items-start">
                                <div class="mt-1 mr-4 w-6 h-6 rounded bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-500 text-xs">✓</div>
                                <div>
                                    <h4 class="text-white font-bold text-sm mb-1" id="method-1">9,000 Simulaciones</h4>
                                    <p class="text-zinc-500 text-xs leading-relaxed" id="method-1t">Colisionamos gemelos sintéticos contra su arquitectura digital para detectar puntos ciegos de fricción.</p>
                                </div>
                            </li>
                            <li class="flex items-start">
                                <div class="mt-1 mr-4 w-6 h-6 rounded bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-500 text-xs">✓</div>
                                <div>
                                    <h4 class="text-white font-bold text-sm mb-1" id="method-2">11 Pilares de Rentabilidad</h4>
                                    <p class="text-zinc-500 text-xs leading-relaxed" id="method-2t">Evaluamos desde la psicología de precios y la tangibilidad de oferta hasta fugas exactas en el checkout.</p>
                                </div>
                            </li>
                            <li class="flex items-start">
                                <div class="mt-1 mr-4 w-6 h-6 rounded bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-500 text-xs">✓</div>
                                <div>
                                    <h4 class="text-white font-bold text-sm mb-1" id="method-3">Veredicto Forense</h4>
                                    <p class="text-zinc-500 text-xs leading-relaxed" id="method-3t">Sin opiniones subjetivas de agencia. Solo datos cuantificables y rutas de reparación inmediata.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="relative">
                        <div class="aspect-square rounded-full border border-zinc-800 flex items-center justify-center relative p-8">
                            <div class="absolute inset-0 border border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                            <div class="absolute inset-8 border border-zinc-800 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                            <div class="w-full h-full bg-black rounded-full border border-zinc-800 flex items-center justify-center z-10 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                                <div class="text-center">
                                    <div class="text-4xl font-black text-white tracking-tighter mb-1">9,000+</div>
                                    <div class="text-[9px] text-emerald-500 uppercase tracking-widest font-bold">Simbióticos Activos</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-20 bg-black border-t border-zinc-900 text-center">
            <div class="max-w-3xl mx-auto px-6">
                <div class="w-12 h-12 border border-zinc-800 bg-zinc-900 rounded flex items-center justify-center mx-auto mb-6">
                    <svg class="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <h2 class="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight" id="partner-title">Conviértase en Auditor Forense</h2>
                <p class="text-sm text-zinc-500 mb-8" id="partner-text">Agencias y Consultores: Escale su autoridad corporativa y sus ingresos operando directamente con la tecnología de PredictaCore bajo nuestro modelo piramidal de comisiones.</p>
                <button onclick="window.scrollTo(0,0)" class="border border-zinc-700 text-zinc-300 font-bold py-3 px-8 rounded-lg hover:bg-zinc-800 hover:text-white transition-all text-xs uppercase tracking-widest" id="partner-btn">
                    Aplicar al Programa de Partners
                </button>
            </div>
            <div class="mt-20 text-[10px] text-zinc-700 uppercase tracking-widest">
                © 2026 PREDICTACORE. SISTEMA DE INTELIGENCIA FORENSE.
            </div>
        </section>

        <script>
            let currentLang = 'es';
            const dictionary = {
                es: {
                    introHeading: "Auditoría Forense de Conversión",
                    introDesc: "Tener tráfico no sirve de nada si tu página no convierte. Tu negocio está perdiendo ventas todos los días por errores de navegación y fricción invisibles al ojo humano. No somos una agencia con opiniones subjetivas ni una IA genérica. Nuestro motor inyecta 9,000 \\"gemelos sintéticos\\" que simulan navegar y comprar en tu sitio, detectando el punto exacto donde los clientes abandonan.",
                    placeholderUrl: "URL del Activo (ej. empresa.com)",
                    placeholderEmail: "Canal de Entrega (Email Ejecutivo)",
                    btnStart: "Iniciar Diagnóstico Gratuito",
                    logInit: ">> INICIALIZANDO NÚCLEO PREDICTACORE...",
                    upsellTitle: "Radiografía Enviada",
                    upsellSub: "El reporte inicial ha sido entregado a",
                    boxTag: "Vectores de Optimización Detectados",
                    boxText: "El escaneo inicial muestra que tu página tiene cuellos de botella invisibles. Estás atrayendo visitas, pero no se están convirtiendo en clientes al ritmo que deberían. El Reporte Titán te muestra exactamente dónde se caen las ventas y cómo arreglarlo.",
                    subPrice: "Incluye Suscripción Titán ($15/mes)",
                    btnTitan: "Activar Protección Titán",
                    disclaimer: "Analizado mediante la colisión de 9,000 modelos simbiópticos. Cargo único de $239 y suscripción mensual de $15.",
                    alertProcess: "¡Procesamiento en curso! El motor ha iniciado la auditoría Titán. Recibirá el reporte completo en su correo en breve.",
                    alertError: "Faltan datos operativos.",
                    // Nuevos Textos
                    proofTitle: "La Anatomía del Veredicto",
                    proofSub: "Qué incluye el Reporte Titán",
                    proofC1: "15 Puntos de Fuga",
                    proofC1T: "Identificación exacta de la hemorragia de capital y fricción dentro de su embudo de conversión y arquitectura de decisión.",
                    proofC2: "Matriz Táctica (SWOT)",
                    proofC2T: "Diagnóstico forense de amenazas y oportunidades frente a su competencia directa en el campo de batalla digital.",
                    proofC3: "Acciones [COPY-PASTE]",
                    proofC3T: "Soluciones exactas, textos reescritos y directrices de código listas para que su equipo las implemente hoy mismo.",
                    methodTitle: "El Motor Simbióptico",
                    method1: "9,000 Simulaciones",
                    method1T: "Colisionamos gemelos sintéticos contra su arquitectura digital para detectar puntos ciegos de fricción.",
                    method2: "11 Pilares de Rentabilidad",
                    method2T: "Evaluamos desde la psicología de precios y la tangibilidad de oferta hasta fugas exactas en el checkout.",
                    method3: "Veredicto Forense",
                    method3T: "Sin opiniones subjetivas de agencia. Solo datos cuantificables y rutas de reparación inmediata.",
                    partnerTitle: "Conviértase en Auditor Forense",
                    partnerText: "Agencias y Consultores: Escale su autoridad corporativa y sus ingresos operando directamente con la tecnología de PredictaCore bajo nuestro modelo piramidal de comisiones.",
                    partnerBtn: "Aplicar al Programa de Partners"
                },
                en: {
                    introHeading: "Forensic Conversion Audit",
                    introDesc: "Traffic is useless if your page doesn't convert. Your business is losing sales every day due to navigation errors and friction invisible to the human eye. We are not an agency with subjective opinions or a generic AI. Our engine injects 9,000 \\"synthetic twins\\" that simulate navigating and buying on your site, detecting the exact point where customers drop off.",
                    placeholderUrl: "Asset URL (e.g., enterprise.com)",
                    placeholderEmail: "Delivery Channel (Executive Email)",
                    btnStart: "Start Free Diagnostic",
                    logInit: ">> INITIALIZING PREDICTACORE CORE...",
                    upsellTitle: "X-Ray Sent",
                    upsellSub: "The initial report has been delivered to",
                    boxTag: "Optimization Vectors Detected",
                    boxText: "The initial scan shows your page has invisible bottlenecks. You are attracting visitors, but they are not converting into customers at the rate they should. The Titan Report shows you exactly where sales drop off and how to fix it.",
                    subPrice: "Includes Titan Subscription ($15/mo)",
                    btnTitan: "Activate Titan Protection",
                    disclaimer: "Analyzed through the collision of 9,000 symbioptic models. One-time $239 charge and $15/mo subscription.",
                    alertProcess: "Processing in progress! The engine has started the Titan audit. You will receive the full report in your email shortly.",
                    alertError: "Operational data missing.",
                    // Nuevos Textos
                    proofTitle: "The Anatomy of the Verdict",
                    proofSub: "What's inside the Titan Report",
                    proofC1: "15 Leakage Points",
                    proofC1T: "Exact identification of capital hemorrhage and friction within your conversion funnel and decision architecture.",
                    proofC2: "Tactical Matrix (SWOT)",
                    proofC2T: "Forensic diagnostic of threats and opportunities against your direct competition in the digital battlefield.",
                    proofC3: "[COPY-PASTE] Actions",
                    proofC3T: "Exact solutions, rewritten copy, and code directives ready for your team to implement today.",
                    methodTitle: "The Symbioptic Engine",
                    method1: "9,000 Simulations",
                    method1T: "We collide synthetic twins against your digital architecture to detect blind spots of friction.",
                    method2: "11 Profitability Pillars",
                    method2T: "We evaluate everything from pricing psychology and offer tangibility to exact checkout leaks.",
                    method3: "Forensic Verdict",
                    method3T: "No subjective agency opinions. Only quantifiable data and immediate repair routes.",
                    partnerTitle: "Become a Forensic Auditor",
                    partnerText: "Agencies and Consultants: Scale your corporate authority and revenue by operating directly with PredictaCore technology under our commission pyramid model.",
                    partnerBtn: "Apply to the Partner Program"
                }
            };

            function setLanguage(lang) {
                currentLang = lang;
                document.getElementById('lang-es').classList.toggle('active', lang === 'es');
                document.getElementById('lang-en').classList.toggle('active', lang === 'en');
                
                const d = dictionary[lang];
                // Elementos Base
                document.getElementById('intro-heading').innerText = d.introHeading;
                document.getElementById('intro-desc').innerText = d.introDesc;
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
                // Elementos Nuevos
                document.getElementById('proof-title').innerText = d.proofTitle;
                document.getElementById('proof-sub').innerText = d.proofSub;
                document.getElementById('proof-c1').innerText = d.proofC1;
                document.getElementById('proof-c1t').innerText = d.proofC1T;
                document.getElementById('proof-c2').innerText = d.proofC2;
                document.getElementById('proof-c2t').innerText = d.proofC2T;
                document.getElementById('proof-c3').innerText = d.proofC3;
                document.getElementById('proof-c3t').innerText = d.proofC3T;
                document.getElementById('method-title').innerText = d.methodTitle;
                document.getElementById('method-1').innerText = d.method1;
                document.getElementById('method-1t').innerText = d.method1T;
                document.getElementById('method-2').innerText = d.method2;
                document.getElementById('method-2t').innerText = d.method2T;
                document.getElementById('method-3').innerText = d.method3;
                document.getElementById('method-3t').innerText = d.method3T;
                document.getElementById('partner-title').innerText = d.partnerTitle;
                document.getElementById('partner-text').innerText = d.partnerText;
                document.getElementById('partner-btn').innerText = d.partnerBtn;
            }

            async function iniciarEscaneo() {
                const url = document.getElementById('dna-url').value;
                const email = document.getElementById('user-email').value;
                if(!url || !email) return alert(dictionary[currentLang].alertError);

                document.getElementById('setup-stage').classList.add('hidden-flow');
                document.getElementById('scanner-stage').classList.remove('hidden-flow');
                document.getElementById('sent-email').innerText = email;

                // Desplazamiento suave hacia arriba al iniciar para enfocar el terminal
                window.scrollTo({ top: 0, behavior: 'smooth' });

                const terminal = document.getElementById('terminal-output');
                const logs = currentLang === 'es' ? 
                    [">> Conectando con nodos forenses...", ">> Inyectando Gemelos Sintéticos...", ">> Analizando fricción de arquitectura...", ">> Sellando radiografía Lite...", ">> Entregando veredicto..."] :
                    [">> Connecting forensic nodes...", ">> Injecting Synthetic Twins...", ">> Analyzing architectural friction...", ">> Sealing Lite X-ray...", ">> Delivering verdict..."];

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
                    terminal.scrollTop = terminal.scrollHeight; // Auto-scroll terminal
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
