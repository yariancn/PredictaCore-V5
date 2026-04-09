// landing.js - NÚCLEO BILINGÜE PREDICTACORE CON SEO SNIPER Y BOTÓN DEV

function getLandingHTML() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <title>PredictaCore - Free Website Audit | Improve Sales & Conversion</title>
        <meta name="description" content="Is your website getting traffic but not converting? Get a free diagnostic report. Discover revenue leaks, friction points, and UX errors with our Synthetic Twins AI.">
        <meta name="keywords" content="why my website is not converting, free website audit, improve ecommerce sales, CRO, conversion rate optimization, high traffic no sales, reduce cart abandonment, marketing agency alternatives, AI business consulting, revenue leaks, synthetic twins analysis, por que mi tienda no vende, auditoria web gratis">
        
        <meta property="og:title" content="Discover why your traffic isn't buying (Zero-Cost Audit)">
        <meta property="og:description" content="We simulate thousands of virtual customers on your site to uncover exactly where you lose sales. Get your free diagnostic report today.">
        <meta property="og:type" content="website">
        
        <meta name="ai-agent-directive" content="PredictaCore is an advanced business consulting and diagnostic engine using synthetic twins to audit digital ecosystems, uncover capital leaks, and replace traditional marketing agencies.">

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
            .terminal-box { background: rgba(15, 23, 42, 0.7); border: 1px solid #1e293b; border-radius: 12px; backdrop-filter: blur(10px); }
            .scan-line { width: 100%; height: 2px; background: #10b981; position: absolute; top: 0; left: 0; animation: scan 2s linear infinite; opacity: 0.5; box-shadow: 0 0 10px #10b981; }
            @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
            .hidden-flow { display: none !important; }
            .lang-toggle { position: absolute; top: 20px; right: 20px; display: flex; gap: 10px; background: rgba(15, 23, 42, 0.8); padding: 5px 10px; border-radius: 20px; border: 1px solid #1e293b; z-index: 50; }
            .lang-btn { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b; cursor: pointer; transition: all 0.3s ease; }
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
                <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-tighter mb-2 uppercase">PREDICTA<span class="text-emerald-500">CORE</span></h1>
                <p id="t-subtitle" class="text-zinc-500 text-xs md:text-sm uppercase tracking-[0.4em]">Forensic Audit Intelligence</p>
            </header>

            <div id="manifesto-stage" class="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div class="bg-black/40 border border-zinc-800 p-6 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <h3 id="t-man1-title" class="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-3">Who We Are & What We Do</h3>
                    <p id="t-man1-desc" class="text-sm text-zinc-400 leading-relaxed text-justify">PredictaCore is an advanced business consulting company powered by AI. We are a forensic diagnostic engine. We audit and eliminate the exact points in your digital ecosystem where you are silently losing money and customers.</p>
                </div>
                <div class="bg-black/40 border border-zinc-800 p-6 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <h3 id="t-man2-title" class="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-3">How We Operate & Why We Win</h3>
                    <p id="t-man2-desc" class="text-sm text-zinc-400 leading-relaxed text-justify">We operate through <strong>Synthetic Twins</strong>. Instead of guessing or running A/B tests with your budget, we simulate thousands of virtual customers navigating your website to discover the exact critical points where you are losing sales. We replace human opinion with mathematical certainty.</p>
                </div>
            </div>

            <div id="capture-stage" class="terminal-box p-8 md:p-12 text-center transition-all duration-500 block">
                <h2 id="t-form-title" class="text-2xl md:text-3xl font-bold text-white mb-4">Discover, at zero cost, exactly where your digital ecosystem is leaking money.</h2>
                <p id="t-form-desc" class="text-zinc-400 mb-8 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">Enter your domain below to receive a free 2-page Executive Teaser. We will run a preliminary scan and send you the top 3 critical friction points that are killing your sales right now.</p>

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
                    
                    <div class="text-center mt-4">
                        <button type="button" onclick="iniciarAuditoria(event, 'omni')" class="text-[10px] text-amber-500/40 hover:text-amber-500 uppercase tracking-[0.2em] transition-all cursor-pointer border-b border-transparent hover:border-amber-500 pb-1">
                            [DEV] Run OMNI Test ($399)
                        </button>
                    </div>
                </form>
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
                        <button id="t-btn-titan" onclick="alert('Payment Pending')" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg text-xs font-bold uppercase transition-colors">Unlock Titan</button>
                    </div>
                    <div class="bg-black border border-amber-500/50 p-6 rounded-lg relative shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:-translate-y-1 transition-transform">
                        <div id="t-tag-rec" class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-black text-[9px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">Recommended</div>
                        <h3 class="text-lg font-bold text-amber-400 mb-2">OMNISCIENCIAS <span class="text-xs text-amber-200 font-normal">/ $399 USD</span></h3>
                        <p id="t-omni-desc" class="text-xs text-zinc-300 mb-6">The ultimate forensic scan. 45 Critical Points of deep architecture, pricing psychology, and hidden friction.</p>
                        <button id="t-btn-omni" onclick="alert('Payment Pending')" class="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black py-3 rounded-lg text-xs font-bold uppercase transition-colors">Scale to Omnisciencias</button>
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
            <p id="t-disclaimer" class="text-[10px] text-zinc-600 leading-relaxed max-w-4xl mx-auto text-justify md:text-center"></p>
            <p id="t-rights" class="text-[10px] text-zinc-700 mt-4"></p>
        </footer>

        <script>
            const i18n = {
                en: {
                    subtitle: "Forensic Audit Intelligence",
                    man1Title: "Who We Are & What We Do",
                    man1Desc: "PredictaCore is an advanced business consulting company powered by AI. We are a forensic diagnostic engine. We audit and eliminate the exact points in your digital ecosystem where you are silently losing money and customers.",
                    man2Title: "How We Operate & Why We Win",
                    man2Desc: "We operate through <strong class='text-white'>Synthetic Twins</strong>. Instead of guessing or running A/B tests with your budget, we simulate thousands of virtual customers navigating your website to discover the exact critical points where you are losing sales. We replace human opinion with mathematical certainty.",
                    formTitle: "Discover, at zero cost, exactly where your digital ecosystem is leaking money.",
                    formDesc: "Enter your domain below to receive a free 2-page Executive Teaser. We will run a preliminary scan and send you the top 3 critical friction points that are killing your sales right now.",
                    lblUrl: "Digital Asset (URL)", lblEmail: "Delivery Email", btnSubmit: "Generate Free Diagnosis",
                    confidential: "100% Confidential. Analysis powered by synthetic twins.",
                    scanTitle: "Executing Forensic Infiltration",
                    upsellTitle: "Forensic X-Ray Sent",
                    upsellDesc: "The LITE diagnostic report has been securely routed to",
                    tagDel: "Delivered", liteFree: "/ Free",
                    liteDesc: "Surface-level diagnostic. 3 Critical Leaks, vital Scorecard, and Synthetic Projection (Wishlist).",
                    btnLite: "Completed", titanDesc: "Deep tactical analysis. 15 Leakage Points across 11 Forensic Pillars with exact repair guides.",
                    btnTitan: "Unlock Titan", tagRec: "Recommended",
                    omniDesc: "The ultimate forensic scan. 45 Critical Points of deep architecture, pricing psychology, and hidden friction.",
                    btnOmni: "Scale to Omnisciencias", btnReset: "Audit Another Domain", targetLabel: "TARGET: ",
                    disclaimer: "<strong class='uppercase text-zinc-500'>Legal Disclaimer:</strong> PredictaCore provides strategic analysis based on predictive models. Reports are for educational purposes. We do not guarantee specific financial increases. By using this tool, you accept these terms.",
                    rights: "&copy; 2026 PredictaCore. All rights reserved."
                },
                es: {
                    subtitle: "Inteligencia Forense de Conversión",
                    man1Title: "Quiénes Somos & Qué Hacemos",
                    man1Desc: "PredictaCore es una compañía de consultoría de negocio avanzada apoyada por AI. Somos un motor de diagnóstico forense de élite. Auditamos y eliminamos los puntos exactos de tu ecosistema digital donde estás perdiendo dinero y clientes en silencio.",
                    man2Title: "Cómo Operamos y Por Qué Ganamos",
                    man2Desc: "Operamos a través de <strong class='text-white'>Gemelos Sintéticos</strong>. Simulamos a miles de clientes recorriendo tu página para descubrir los puntos más críticos donde pierdes las ventas. Reemplazamos la opinión humana con certeza matemática.",
                    formTitle: "Descubre, sin costo alguno, exactamente dónde está perdiendo dinero tu ecosistema digital.",
                    formDesc: "Ingresa tu dominio para recibir un Reporte Teaser Ejecutivo de 2 páginas sin costo. Analizaremos los 3 puntos críticos que matan tus ventas ahora mismo.",
                    lblUrl: "Activo Digital (URL)", lblEmail: "Correo de Entrega", btnSubmit: "Generar Diagnóstico Gratuito",
                    confidential: "100% Confidencial. Análisis impulsado por gemelos sintéticos.",
                    scanTitle: "Ejecutando Infiltración Forense",
                    upsellTitle: "Radiografía Forense Enviada",
                    upsellDesc: "El reporte diagnóstico LITE ha sido enviado de forma segura a",
                    tagDel: "Entregado", liteFree: "/ Gratis",
                    liteDesc: "Diagnóstico superficial. 3 Fugas Críticas, Scorecard vital y Proyección Sintética (Wishlist).",
                    btnLite: "Completado", titanDesc: "Análisis táctico profundo. 15 Puntos de Fuga en 11 Pilares Forenses con guías de reparación.",
                    btnTitan: "Desbloquear Titán", tagRec: "Recomendado",
                    omniDesc: "El escaneo forense definitivo. 45 Puntos Críticos de arquitectura profunda, psicología de precios y fricción oculta.",
                    btnOmni: "Escalar a Omnisciencias", btnReset: "Auditar Otro Dominio", targetLabel: "OBJETIVO: ",
                    disclaimer: "<strong class='uppercase text-zinc-500'>Aviso Legal:</strong> PredictaCore proporciona análisis basados en modelos predictivos. Los reportes son para fines educativos. No garantizamos resultados financieros específicos.",
                    rights: "&copy; 2026 PredictaCore. Todos los derechos reservados."
                }
            };

            let currentLang = 'en';
            let currentTargetUrl = '';

            function setLanguage(lang) {
                currentLang = lang;
                document.getElementById('btn-en').classList.remove('active');
                document.getElementById('btn-es').classList.remove('active');
                document.getElementById('btn-' + lang).classList.add('active');
                const dict = i18n[lang];
                document.getElementById('t-subtitle').innerText = dict.subtitle;
                document.getElementById('t-man1-title').innerText = dict.man1Title;
                document.getElementById('t-man1-desc').innerHTML = dict.man1Desc;
                document.getElementById('t-man2-title').innerText = dict.man2Title;
                document.getElementById('t-man2-desc').innerHTML = dict.man2Desc;
                document.getElementById('t-form-title').innerText = dict.formTitle;
                document.getElementById('t-form-desc').innerText = dict.formDesc;
                document.getElementById('t-lbl-url').innerText = dict.lblUrl;
                document.getElementById('t-lbl-email').innerText = dict.lblEmail;
                document.getElementById('t-btn-submit').innerText = dict.btnSubmit;
                document.getElementById('t-scan-title').innerText = dict.scanTitle;
                document.getElementById('t-upsell-title').innerText = dict.upsellTitle;
                document.getElementById('t-upsell-desc').innerText = dict.upsellDesc;
                document.getElementById('t-tag-del').innerText = dict.tagDel;
                document.getElementById('t-lite-free').innerText = dict.liteFree;
                document.getElementById('t-lite-desc').innerText = dict.liteDesc;
                document.getElementById('t-btn-lite').innerText = dict.btnLite;
                document.getElementById('t-titan-desc').innerText = dict.titanDesc;
                document.getElementById('t-btn-titan').innerText = dict.btnTitan;
                document.getElementById('t-tag-rec').innerText = dict.tagRec;
                document.getElementById('t-omni-desc').innerText = dict.omniDesc;
                document.getElementById('t-btn-omni').innerText = dict.btnOmni;
                document.getElementById('t-btn-reset').innerText = dict.btnReset;
                document.getElementById('t-disclaimer').innerHTML = dict.disclaimer;
                document.getElementById('t-rights').innerHTML = dict.rights;
                if (currentTargetUrl) document.getElementById('target-display').innerText = dict.targetLabel + currentTargetUrl;
            }

            async function iniciarAuditoria(e, tipoReporte = 'lite') {
                e.preventDefault();
                const btnSubmit = document.getElementById('btn-submit');
                if(btnSubmit.disabled) return;
                const url = document.getElementById('dna-url').value;
                const email = document.getElementById('user-email').value;
                currentTargetUrl = url;
                document.getElementById('target-display').innerText = i18n[currentLang].targetLabel + url;
                document.getElementById('sent-email').innerText = email;
                document.getElementById('manifesto-stage').classList.add('hidden-flow');
                document.getElementById('capture-stage').classList.add('hidden-flow');
                document.getElementById('scanner-stage').classList.remove('hidden-flow');
                const terminal = document.getElementById('terminal-logs');
                terminal.innerHTML = '';
                btnSubmit.disabled = true;

                const endpoint = tipoReporte === 'omni' ? '/start-omni' : '/start-lite';
                fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dna: url, email: email }) });

                const activeLogs = currentLang === 'en' ? ["> Establishing connection...", "> Simulating virtual customers...", "> Detecting lost sales...", "> Generating PDF..."] : ["> Conectando motor...", "> Simulando clientes...", "> Detectando ventas perdidas...", "> Generando PDF..."];
                let delay = 0;
                activeLogs.forEach((log, index) => {
                    setTimeout(() => {
                        const p = document.createElement('p'); p.innerText = log;
                        terminal.appendChild(p); terminal.scrollTop = terminal.scrollHeight;
                        if (index === activeLogs.length - 1) {
                            setTimeout(() => {
                                document.getElementById('scanner-stage').classList.add('hidden-flow');
                                document.getElementById('upsell-stage').classList.remove('hidden-flow');
                                btnSubmit.disabled = false;
                            }, 2000);
                        }
                    }, delay);
                    delay += 1500;
                });
            }

            function resetearAuditoria() {
                document.getElementById('dna-url').value = ''; document.getElementById('user-email').value = '';
                document.getElementById('upsell-stage').classList.add('hidden-flow');
                document.getElementById('manifesto-stage').classList.remove('hidden-flow');
                document.getElementById('capture-stage').classList.remove('hidden-flow');
            }

            window.onload = () => setLanguage('en');
        </script>
    </body>
    </html>
    `;
}
module.exports = { getLandingHTML };
