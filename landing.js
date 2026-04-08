// landing.js - LA FACHADA DE ÉLITE (PREDICTACORE - BILINGÜE, HIGH-TICKET & MANIFIESTO)

function getLandingHTML() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PredictaCore - Forensic Conversion Intelligence</title>
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

            /* Toggle Switch Styles */
            .lang-toggle {
                position: absolute;
                top: 20px;
                right: 20px;
                display: flex;
                gap: 10px;
                background: rgba(15, 23, 42, 0.8);
                padding: 5px 10px;
                border-radius: 20px;
                border: 1px solid #1e293b;
                z-index: 50;
            }
            .lang-btn {
                font-size: 10px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #64748b;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .lang-btn.active { color: #10b981; }
        </style>
    </head>
    <body class="min-h-screen flex flex-col items-center justify-between p-6 md:p-10 relative overflow-x-hidden">
        
        <div class="lang-toggle">
            <button id="btn-en" class="lang-btn active" onclick="setLanguage('en')">EN</button>
            <span class="text-zinc-700 text-[10px]">|</span>
            <button id="btn-es" class="lang-btn" onclick="setLanguage('es')">ES</button>
        </div>

        <div class="max-w-5xl w-full relative z-10 mb-auto mt-8">
            
            <header class="mb-12 text-center">
                <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-tighter mb-2 uppercase">
                    PREDICTA<span class="text-emerald-500">CORE</span>
                </h1>
                <p id="t-subtitle" class="text-zinc-500 text-xs md:text-sm uppercase tracking-[0.4em]">Forensic Audit Intelligence</p>
            </header>

            <div id="manifesto-stage" class="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div class="bg-black/40 border border-zinc-800 p-6 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <h3 id="t-man1-title" class="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-3">Who We Are & What We Do</h3>
                    <p id="t-man1-desc" class="text-sm text-zinc-400 leading-relaxed text-justify">
                        We are not a traditional marketing agency. We are <strong class="text-white">elite forensic conversion architects</strong>. We exclusively audit, diagnose, and seal the invisible capital leaks within your digital ecosystem that are silently draining your revenue. We stop the bleeding.
                    </p>
                </div>
                <div class="bg-black/40 border border-zinc-800 p-6 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <h3 id="t-man2-title" class="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-3">How We Operate & Why We Win</h3>
                    <p id="t-man2-desc" class="text-sm text-zinc-400 leading-relaxed text-justify">
                        We deploy <strong class="text-white">Synthetic Twins</strong>. While traditional agencies guess and run A/B tests using your budget, we simulate thousands of user interactions to pinpoint exact friction. We eliminate human opinion and replace it with mathematical certainty to maximize your ROI.
                    </p>
                </div>
            </div>

            <div id="capture-stage" class="terminal-box p-8 md:p-12 text-center transition-all duration-500 block shadow-[0_0_40px_rgba(16,185,129,0.05)]">
                <h2 id="t-form-title" class="text-2xl md:text-3xl font-bold text-white mb-4">Discover why your traffic isn't converting.</h2>
                <p id="t-form-desc" class="text-zinc-400 mb-8 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                    Enter your domain and receive a free 2-page diagnostic report directly in your inbox. We will identify your worst capital hemorrhages today.
                </p>

                <form id="audit-form" class="space-y-6 max-w-xl mx-auto text-left" onsubmit="iniciarAuditoria(event)">
                    <div>
                        <label id="t-lbl-url" class="block text-xs uppercase tracking-widest text-emerald-500 mb-2 font-bold">Digital Asset (URL)</label>
                        <input type="text" id="dna-url" placeholder="ex. mydomain.com" required class="w-full bg-zinc-900/50 text-xl text-white border border-zinc-700 rounded-lg p-4 focus:outline-none focus:border-emerald-500 transition-colors">
                    </div>
                    <div>
                        <label id="t-lbl-email" class="block text-xs uppercase tracking-widest text-emerald-500 mb-2 font-bold">Delivery Email</label>
                        <input type="email" id="user-email" placeholder="you@email.com" required class="w-full bg-zinc-900/50 text-xl text-white border border-zinc-700 rounded-lg p-4 focus:outline-none focus:border-emerald-500 transition-colors">
                    </div>
                    <button type="submit" id="btn-submit" class="w-full bg-emerald-600 text-white font-bold py-4 rounded-lg text-sm uppercase tracking-wider hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <span id="t-btn-submit">Generate Free Diagnosis</span>
                    </button>
                </form>
                <p id="t-confidential" class="mt-6 text-[10px] text-zinc-600 uppercase tracking-widest">100% Confidential. Analysis powered by synthetic twins.</p>
            </div>

            <div id="scanner-stage" class="hidden-flow terminal-box p-8 md:p-12 relative overflow-hidden">
                <div class="scan-line"></div>
                <div class="text-center mb-8 relative z-10">
                    <h3 id="t-scan-title" class="text-xl font-bold text-white uppercase tracking-widest animate-pulse">Executing Forensic Infiltration</h3>
                    <p id="target-display" class="text-emerald-500 mt-2 font-mono text-sm"></p>
                </div>
                <div class="font-mono text-xs md:text-sm text-zinc-400 space-y-2 h-48 overflow-y-auto relative z-10" id="terminal-logs"></div>
            </div>

            <div id="upsell-stage" class="hidden-flow terminal-box p-8 md:p-12 text-center border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                
                <h2 id="t-upsell-title" class="text-3xl font-bold text-white mb-2">Forensic X-Ray Sent</h2>
                <p class="text-zinc-400 mb-8"><span id="t-upsell-desc">The LITE diagnostic report has been securely routed to</span> <span id="sent-email" class="text-white font-bold"></span>.</p>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
                    
                    <div class="bg-zinc-900/80 border border-zinc-700 p-6 rounded-lg relative opacity-75">
                        <div id="t-tag-del" class="absolute top-0 right-0 bg-emerald-500 text-black text-[9px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-widest">Delivered</div>
                        <h3 class="text-lg font-bold text-white mb-2">LITE <span id="t-lite-free" class="text-xs text-zinc-500 font-normal">/ Free</span></h3>
                        <p id="t-lite-desc" class="text-xs text-zinc-400 mb-6 line-clamp-3">Surface-level diagnostic. 3 Critical Leaks, vital Scorecard, and Synthetic Projection (Wishlist).</p>
                        <button id="t-btn-lite" disabled class="w-full bg-zinc-800 text-zinc-500 py-3 rounded-lg text-xs font-bold uppercase cursor-not-allowed">Completed</button>
                    </div>

                    <div class="bg-black border border-emerald-500/50 p-6 rounded-lg relative shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-transform">
                        <h3 class="text-lg font-bold text-emerald-400 mb-2">TITÁN <span class="text-xs text-emerald-200 font-normal">/ $150 USD</span></h3>
                        <p id="t-titan-desc" class="text-xs text-zinc-300 mb-6">Deep tactical analysis. 15 Leakage Points across 11 Forensic Pillars with exact repair guides.</p>
                        <button id="t-btn-titan" onclick="alert('Conexión con Stripe pendiente en Fase 5')" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg text-xs font-bold uppercase transition-colors">Unlock Titan</button>
                    </div>

                    <div class="bg-black border border-amber-500/50 p-6 rounded-lg relative shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:-translate-y-1 transition-transform">
                        <div id="t-tag-rec" class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-black text-[9px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">Recommended</div>
                        <h3 class="text-lg font-bold text-amber-400 mb-2">OMNISCIENCIAS <span class="text-xs text-amber-200 font-normal">/ $399 USD</span></h3>
                        <p id="t-omni-desc" class="text-xs text-zinc-300 mb-6">The ultimate forensic scan. 45 Critical Points of deep architecture, pricing psychology, and hidden friction.</p>
                        <button id="t-btn-omni" onclick="alert('Conexión con Stripe pendiente en Fase 5')" class="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black py-3 rounded-lg text-xs font-bold uppercase transition-colors">Scale to Omnisciencias</button>
                    </div>

                </div>

                <div class="border-t border-zinc-800 pt-6 mt-4">
                    <button onclick="resetearAuditoria()" class="text-zinc-500 hover:text-emerald-400 text-xs uppercase tracking-widest transition-colors flex items-center justify-center mx-auto">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        <span id="t-btn-reset">Audit Another Domain</span>
                    </button>
                </div>
            </div>

        </div>

        <footer class="w-full max-w-5xl mt-20 pt-8 border-t border-zinc-900 text-center pb-8">
            <p id="t-disclaimer" class="text-[10px] text-zinc-600 leading-relaxed max-w-4xl mx-auto text-justify md:text-center">
                <strong class="uppercase text-zinc-500">Legal Disclaimer & Liability Waiver:</strong> PredictaCore provides strategic analysis based on predictive models, AI, and conversion heuristics. The generated reports, scores, and recommendations are strictly for strategic, educational, and consultative purposes. PredictaCore does not guarantee specific increases in sales, conversions, revenue, or financial results. The implementation of the suggested strategies and corrections is the absolute and exclusive responsibility of the client or user. PredictaCore, its founders, and operators are not liable for direct, indirect, incidental damages, capital losses, or business interruptions derived from the use, interpretation, or application of the information provided in our reports. By using this tool, you accept these terms in full.
            </p>
            <p id="t-rights" class="text-[10px] text-zinc-700 mt-4">&copy; 2026 PredictaCore. All rights reserved.</p>
        </footer>

        <script>
            // --- SISTEMA DE TRADUCCIÓN (BILINGÜE SPA) ---
            const i18n = {
                en: {
                    subtitle: "Forensic Audit Intelligence",
                    man1Title: "Who We Are & What We Do",
                    man1Desc: "We are not a traditional marketing agency. We are <strong class='text-white'>elite forensic conversion architects</strong>. We exclusively audit, diagnose, and seal the invisible capital leaks within your digital ecosystem that are silently draining your revenue. We stop the bleeding.",
                    man2Title: "How We Operate & Why We Win",
                    man2Desc: "We deploy <strong class='text-white'>Synthetic Twins</strong>. While traditional agencies guess and run A/B tests using your budget, we simulate thousands of user interactions to pinpoint exact friction. We eliminate human opinion and replace it with mathematical certainty to maximize your ROI.",
                    formTitle: "Discover why your traffic isn't converting.",
                    formDesc: "Enter your domain and receive a free 2-page diagnostic report directly in your inbox. We will identify your worst capital hemorrhages today.",
                    lblUrl: "Digital Asset (URL)",
                    lblEmail: "Delivery Email",
                    btnSubmit: "Generate Free Diagnosis",
                    confidential: "100% Confidential. Analysis powered by synthetic twins.",
                    scanTitle: "Executing Forensic Infiltration",
                    upsellTitle: "Forensic X-Ray Sent",
                    upsellDesc: "The LITE diagnostic report has been securely routed to",
                    tagDel: "Delivered",
                    liteFree: "/ Free",
                    liteDesc: "Surface-level diagnostic. 3 Critical Leaks, vital Scorecard, and Synthetic Projection (Wishlist).",
                    btnLite: "Completed",
                    titanDesc: "Deep tactical analysis. 15 Leakage Points across 11 Forensic Pillars with exact repair guides.",
                    btnTitan: "Unlock Titan",
                    tagRec: "Recommended",
                    omniDesc: "The ultimate forensic scan. 45 Critical Points of deep architecture, pricing psychology, and hidden friction.",
                    btnOmni: "Scale to Omnisciencias",
                    btnReset: "Audit Another Domain",
                    targetLabel: "TARGET: ",
                    disclaimer: "<strong class='uppercase text-zinc-500'>Legal Disclaimer & Liability Waiver:</strong> PredictaCore provides strategic analysis based on predictive models, AI, and conversion heuristics. The generated reports, scores, and recommendations are strictly for strategic, educational, and consultative purposes. PredictaCore does not guarantee specific increases in sales, conversions, revenue, or financial results. The implementation of the suggested strategies and corrections is the absolute and exclusive responsibility of the client or user. PredictaCore, its founders, and operators are not liable for direct, indirect, incidental damages, capital losses, or business interruptions derived from the use, interpretation, or application of the information provided in our reports. By using this tool, you accept these terms in full.",
                    rights: "&copy; 2026 PredictaCore. All rights reserved."
                },
                es: {
                    subtitle: "Inteligencia Forense de Conversión",
                    man1Title: "Quiénes Somos & Qué Hacemos",
                    man1Desc: "No somos una agencia de marketing tradicional. Somos <strong class='text-white'>arquitectos forenses de conversión de élite</strong>. Auditamos, diagnosticamos y sellamos las fugas de capital invisibles en tu ecosistema digital que están drenando tus ingresos. Detenemos la hemorragia.",
                    man2Title: "Cómo Operamos y Por Qué Ganamos",
                    man2Desc: "Desplegamos <strong class='text-white'>Gemelos Sintéticos</strong>. Mientras las agencias adivinan y hacen pruebas A/B usando tu presupuesto, nosotros simulamos miles de interacciones para calcular la fricción exacta. Eliminamos la opinión humana y la reemplazamos con certeza matemática para maximizar tu ROI.",
                    formTitle: "Descubre por qué tus visitantes no compran.",
                    formDesc: "Ingresa tu dominio y recibe un reporte diagnóstico gratuito de 2 páginas directamente en tu correo. Identificaremos tus peores fugas de capital hoy mismo.",
                    lblUrl: "Activo Digital (URL)",
                    lblEmail: "Correo de Entrega",
                    btnSubmit: "Generar Diagnóstico Gratuito",
                    confidential: "100% Confidencial. Análisis impulsado por gemelos sintéticos.",
                    scanTitle: "Ejecutando Infiltración Forense",
                    upsellTitle: "Radiografía Forense Enviada",
                    upsellDesc: "El reporte diagnóstico LITE ha sido enviado de forma segura a",
                    tagDel: "Entregado",
                    liteFree: "/ Gratis",
                    liteDesc: "Diagnóstico superficial. 3 Fugas Críticas, Scorecard vital y Proyección Sintética (Wishlist).",
