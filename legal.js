/**
 * Regenoxy LLC legal pages — English only, separate brands:
 * PredictaCore → /terms | /privacy
 * Clinical → oxyhyperbaric.com + /legal/clinical-services
 * Hub → /legal/regenoxy
 */

const UPDATED = 'May 27, 2026';

const CLINICAL_WEB = (process.env.REGENOXY_CLINICAL_WEB || 'https://oxyhyperbaric.com').replace(/\/$/, '');
const CLINICAL_TERMS_URL = process.env.REGENOXY_CLINICAL_TERMS_URL
    || `${CLINICAL_WEB}/legal`;
const PREDICTACORE_WEB = 'https://predictacore.ai';
const REGENOXY_HUB_PATH = '/legal/regenoxy';

function wrapRegenoxyPage({ title, breadcrumb, breadcrumbHref, intro, bodyHtml, footerLinks }) {
    const links = (footerLinks || [])
        .map((l) => `<a href="${l.href}" class="text-sky-400 hover:underline">${l.label}</a>`)
        .join(' · ');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Regenoxy LLC</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body{background:#0a0f1a;color:#cbd5e1;font-family:Inter,sans-serif}</style>
</head>
<body class="max-w-3xl mx-auto p-8 text-sm leading-relaxed">
    <header class="border-b border-slate-700 pb-4 mb-6">
        <p class="text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-2">Regenoxy LLC — legal documents</p>
        <nav class="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold uppercase tracking-wider">
            <a href="${REGENOXY_HUB_PATH}" class="text-sky-400">Legal center</a>
            <a href="${CLINICAL_WEB}" class="text-slate-300 hover:text-white" rel="noopener">Oxy Hyperbaric ↗</a>
            <a href="${PREDICTACORE_WEB}" class="text-slate-300 hover:text-white" rel="noopener">PredictaCore ↗</a>
        </nav>
    </header>
    ${breadcrumbHref ? `<a href="${breadcrumbHref}" class="text-sky-400 text-xs uppercase tracking-widest">← Back</a>` : ''}
    ${breadcrumb ? `<p class="text-slate-500 text-xs mt-2">${breadcrumb}</p>` : ''}
    <h1 class="text-2xl font-black text-white mt-3 mb-2">${title}</h1>
    <p class="text-slate-500 text-xs mb-6">Last updated: ${UPDATED}</p>
    ${intro || ''}
    <section class="space-y-6 text-slate-300">${bodyHtml}</section>
    <footer class="mt-12 pt-6 border-t border-slate-700 text-slate-500 text-xs">${links}</footer>
</body>
</html>`;
}

function wrapPredictacorePage({ title, intro, bodyHtml, footerLinks }) {
    const links = (footerLinks || [])
        .map((l) => `<a href="${l.href}" class="text-emerald-500 hover:underline">${l.label}</a>`)
        .join(' · ');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | PredictaCore</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body{background:#050505;color:#d1d5db;font-family:Inter,sans-serif}</style>
</head>
<body class="max-w-3xl mx-auto p-8 text-sm leading-relaxed">
    <header class="border-b border-zinc-800 pb-4 mb-6">
        <a href="/" class="text-emerald-500 text-xs uppercase tracking-widest font-black">PredictaCore</a>
        <p class="text-[10px] text-zinc-600 mt-1">Operated by Regenoxy LLC · Digital / AI services only</p>
    </header>
    <h1 class="text-2xl font-black text-white mb-2">${title}</h1>
    <p class="text-zinc-500 text-xs mb-6">Last updated: ${UPDATED}</p>
    ${intro || ''}
    <section class="space-y-6 text-zinc-300">${bodyHtml}</section>
    <footer class="mt-12 pt-6 border-t border-zinc-800 text-zinc-600 text-xs">${links}</footer>
</body>
</html>`;
}

function getRegenoxyHubHTML() {
    const clinicalTerms = CLINICAL_TERMS_URL.startsWith('http')
        ? CLINICAL_TERMS_URL
        : `${CLINICAL_WEB}${CLINICAL_TERMS_URL}`;

    return wrapRegenoxyPage({
        title: 'Legal center — Regenoxy LLC',
        intro: `<div class="border border-slate-600 bg-slate-900/60 p-4 rounded text-xs text-slate-400">
            <strong>Regenoxy LLC</strong> operates independent brands. Open the document for the <strong>service you purchased</strong>.
            Hyperbaric terms do <strong>not</strong> apply to PredictaCore, and vice versa.
        </div>`,
        bodyHtml: `
        <div class="grid gap-6 md:grid-cols-2">
            <div class="border-2 border-sky-800/60 bg-slate-900/80 p-5 rounded-lg">
                <p class="text-[10px] uppercase tracking-widest text-sky-400 mb-2">Clinical / wellness</p>
                <h2 class="text-lg font-black text-white mb-2">Oxy Hyperbaric</h2>
                <p class="text-xs text-slate-400 mb-4">Hyperbaric chamber, consultations, CarePatron, phone, calendars.</p>
                <p class="text-xs mb-3">Website: <a href="${CLINICAL_WEB}" class="text-sky-400 font-bold underline" rel="noopener">${CLINICAL_WEB}</a></p>
                <ul class="space-y-2 text-sm">
                    <li><a href="${clinicalTerms}" class="text-sky-300 font-bold hover:underline">Clinical terms ↗</a></li>
                    <li><a href="/legal/clinical-services" class="text-slate-400 hover:underline text-xs">Mirror on predictacore.ai</a></li>
                </ul>
            </div>
            <div class="border-2 border-emerald-900/50 bg-zinc-950 p-5 rounded-lg">
                <p class="text-[10px] uppercase tracking-widest text-emerald-500 mb-2">Digital / AI</p>
                <h2 class="text-lg font-black text-white mb-2">PredictaCore</h2>
                <p class="text-xs text-zinc-400 mb-4">Website audits, Titan Report, monthly monitoring.</p>
                <p class="text-xs mb-3">Website: <a href="${PREDICTACORE_WEB}" class="text-emerald-500 font-bold underline">${PREDICTACORE_WEB}</a></p>
                <ul class="space-y-2 text-sm">
                    <li><a href="/terms" class="text-emerald-400 font-bold hover:underline">PredictaCore Terms</a></li>
                    <li><a href="/privacy" class="text-emerald-400 hover:underline">PredictaCore Privacy</a></li>
                </ul>
            </div>
        </div>
        <div class="border border-slate-700 p-4 rounded">
            <h2 class="text-white font-bold mb-2">Payments (all lines)</h2>
            <a href="/legal/payments" class="text-sky-400 font-bold hover:underline">Regenoxy LLC payment policy</a>
        </div>
        <div>
            <h2 class="text-white font-bold mb-2">Corporate privacy</h2>
            <a href="/legal/privacy" class="text-sky-400 hover:underline">Regenoxy LLC privacy (all brands)</a>
        </div>`,
        footerLinks: [
            { href: CLINICAL_WEB, label: 'oxyhyperbaric.com' },
            { href: PREDICTACORE_WEB, label: 'predictacore.ai' },
        ],
    });
}

function getLegalHubHTML() {
    return getRegenoxyHubHTML();
}

function getTerminosHTML() {
    return wrapPredictacorePage({
        title: 'Terms of Service',
        intro: `<div class="border border-emerald-900/50 bg-emerald-950/30 p-4 rounded mb-8 text-xs text-emerald-100/90">
            <strong>PredictaCore only</strong> (predictacore.ai). Does not include hyperbaric chamber or services at
            <a href="${CLINICAL_WEB}" class="underline text-emerald-400" rel="noopener">oxyhyperbaric.com</a>.
            Corporate index: <a href="${REGENOXY_HUB_PATH}" class="underline">Regenoxy LLC</a>.
        </div>`,
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Provider</h2>
            <p>The <strong>PredictaCore</strong> service is operated by Regenoxy LLC at predictacore.ai. Independent digital brand from Oxy Hyperbaric.</p></div>
        <div><h2 class="text-white font-bold mb-2">2. Service</h2>
            <p>AI-powered analysis of digital assets; PDF reports with recommendations. We do <strong>not</strong> implement changes on your website and do not guarantee specific business results or revenue increases.</p></div>
        <div><h2 class="text-white font-bold mb-2">3. Products and pricing</h2>
            <p><strong>Titan Report (initial one-time):</strong> USD $349.00 — charged when you purchase.</p>
            <p class="mt-2"><strong>Monthly monitoring subscription:</strong> USD $25.00/month — activates when you purchase the Titan Report; <strong>first charge occurs approximately 30 days later</strong>. Subsequent charges are monthly on the same billing date.</p></div>
        <div><h2 class="text-white font-bold mb-2">4. No refunds</h2>
            <p><strong>ALL SALES ARE FINAL.</strong> The USD $349.00 Titan Report payment is <strong>non-refundable</strong> under all circumstances. Processed monthly USD $25.00 charges are <strong>non-refundable</strong>; no prorated refunds if you cancel after a charge.</p></div>
        <div><h2 class="text-white font-bold mb-2">5. Subscription cancellation</h2>
            <p>Cancel via the Stripe customer portal or by contacting us. To avoid the next monthly charge, cancel at least <strong>5 (five) business days</strong> before your scheduled renewal date.</p></div>
        <div><h2 class="text-white font-bold mb-2">6. Limitation of liability</h2>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, REGENOXY LLC SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. TOTAL LIABILITY SHALL NOT EXCEED AMOUNTS PAID BY YOU IN THE PRIOR 12 MONTHS. Reports may contain AI inaccuracies; you are solely responsible for business decisions.</p></div>
        <div><h2 class="text-white font-bold mb-2">7. Intellectual property</h2>
            <p>Reports are for your internal use. PredictaCore methodology, marks, and technology are exclusive property of Regenoxy LLC. No resale or redistribution without written consent.</p></div>
        <div><h2 class="text-white font-bold mb-2">8. Governing law</h2>
            <p>State of Delaware, USA. Disputes resolved by binding arbitration in English unless mandatory consumer law requires otherwise.</p></div>
        <div><h2 class="text-white font-bold mb-2">9. Contact</h2>
            <p><a href="mailto:reportes@predictacore.ai" class="text-emerald-500">reportes@predictacore.ai</a></p></div>`,
        footerLinks: [
            { href: '/privacy', label: 'PredictaCore Privacy' },
            { href: REGENOXY_HUB_PATH, label: 'Other Regenoxy brands' },
        ],
    });
}

function getPrivacidadHTML() {
    return wrapPredictacorePage({
        title: 'Privacy Policy',
        intro: `<div class="border border-zinc-800 bg-zinc-900/40 p-4 rounded mb-8 text-xs text-zinc-400">
            <strong>PredictaCore service only.</strong> Clinical / Oxy Hyperbaric: use your appointment contact or
            <a href="/legal/privacy" class="text-emerald-500 underline">Regenoxy privacy</a>.
        </div>`,
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Controller</h2>
            <p>Regenoxy LLC — PredictaCore brand. reportes@predictacore.ai</p></div>
        <div><h2 class="text-white font-bold mb-2">2. Data we collect</h2>
            <ul class="list-disc pl-5 space-y-1">
                <li>Email address</li>
                <li>Website or profile URL analyzed</li>
                <li>Payment data (processed by Stripe; we do not store card numbers)</li>
                <li>Public content scraped to generate reports</li>
                <li>Technical logs (IP, server events)</li>
            </ul></div>
        <div><h2 class="text-white font-bold mb-2">3. How we use data</h2>
            <p>Deliver reports, billing, monthly follow-ups, support, and legal compliance.</p></div>
        <div><h2 class="text-white font-bold mb-2">4. Processors</h2>
            <p>Stripe, Resend, Google Cloud / Vertex AI, Railway, PostgreSQL.</p></div>
        <div><h2 class="text-white font-bold mb-2">5. Retention</h2>
            <p>While your subscription is active and up to 24 months after cancellation unless law requires longer retention.</p></div>
        <div><h2 class="text-white font-bold mb-2">6. Your rights</h2>
            <p>Request access, correction, or deletion where applicable: reportes@predictacore.ai</p></div>
        <div><h2 class="text-white font-bold mb-2">7. Security</h2>
            <p>HTTPS and reasonable controls; no system is 100% secure.</p></div>`,
        footerLinks: [
            { href: '/terms', label: 'PredictaCore Terms' },
            { href: REGENOXY_HUB_PATH, label: 'Regenoxy legal center' },
        ],
    });
}

function getServiciosClinicosHTML() {
    const clinicalTerms = CLINICAL_TERMS_URL.startsWith('http')
        ? CLINICAL_TERMS_URL
        : `${CLINICAL_WEB}${CLINICAL_TERMS_URL}`;

    return wrapRegenoxyPage({
        title: 'Terms — Clinical services (Oxy Hyperbaric)',
        breadcrumb: 'Oxy Hyperbaric / Regenoxy LLC',
        breadcrumbHref: REGENOXY_HUB_PATH,
        intro: `<div class="border border-sky-900/50 bg-sky-950/30 p-4 rounded mb-8 text-xs text-sky-100/90">
            <strong>Clinical and wellness services only</strong> at ${CLINICAL_WEB}.
            <strong>Does not apply to PredictaCore</strong> (<a href="/terms" class="underline">PredictaCore terms</a>).
            Preferred canonical URL on clinical site:
            <a href="${clinicalTerms}" class="text-sky-300 font-bold underline" rel="noopener">${clinicalTerms}</a>.
        </div>`,
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Nature of service</h2>
            <p>Health and wellness services provided by Regenoxy LLC. Not a substitute for emergency medical care.</p></div>
        <div><h2 class="text-white font-bold mb-2">2. Appointments</h2>
            <p>Booked via CarePatron, online calendar, or phone. Arrive on time. Cancel with at least 24–48 hours notice unless otherwise stated when booking.</p></div>
        <div><h2 class="text-white font-bold mb-2">3. Payment</h2>
            <p>Price is quoted when you book. Payment may be collected via CarePatron, Stripe (in person or payment link), or phone. Payment constitutes acceptance of these terms and our <a href="/legal/payments" class="text-sky-400 underline">payment policy</a>.</p></div>
        <div><h2 class="text-white font-bold mb-2">4. Refunds and cancellations</h2>
            <p>Policies depend on the service booked and are communicated at scheduling. Services already rendered or not canceled on time may be non-refundable except where required by law.</p></div>
        <div><h2 class="text-white font-bold mb-2">5. Informed consent</h2>
            <p>Specific treatments may require additional forms in clinic or on CarePatron.</p></div>
        <div><h2 class="text-white font-bold mb-2">6. Limitation of liability</h2>
            <p>To the maximum extent permitted by law, Regenoxy LLC is not liable for indirect damages. Total liability is limited to amounts paid for the service giving rise to the claim.</p></div>
        <div><h2 class="text-white font-bold mb-2">7. Governing law</h2>
            <p>State of Delaware, USA, without prejudice to mandatory local consumer rights.</p></div>`,
        footerLinks: [
            { href: clinicalTerms, label: 'Oxy Hyperbaric site' },
            { href: REGENOXY_HUB_PATH, label: 'Legal center' },
        ],
    });
}

function getPagosHTML() {
    return wrapRegenoxyPage({
        title: 'Payment policy — Regenoxy LLC',
        breadcrumb: 'Payments',
        breadcrumbHref: REGENOXY_HUB_PATH,
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Bank statement</h2>
            <p>Charges may appear as <strong>REGENOXY</strong> or a service-specific descriptor (clinical vs PredictaCore).</p></div>
        <div><h2 class="text-white font-bold mb-2">2. Which terms apply</h2>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>PredictaCore</strong> (predictacore.ai): <a href="/terms" class="text-emerald-400 underline">/terms</a> — AI audits only.</li>
                <li><strong>Oxy Hyperbaric</strong> (${CLINICAL_WEB}): <a href="/legal/clinical-services" class="text-sky-400 underline">clinical terms</a>.</li>
                <li><strong>CarePatron / phone:</strong> terms for the booked service plus this payment policy.</li>
            </ul></div>
        <div><h2 class="text-white font-bold mb-2">3. Disputes</h2>
            <p>Contact Regenoxy with your receipt before initiating a chargeback.</p></div>`,
        footerLinks: [{ href: REGENOXY_HUB_PATH, label: 'Legal center' }],
    });
}

function getPrivacidadRegenoxyHTML() {
    return wrapRegenoxyPage({
        title: 'Privacy Policy — Regenoxy LLC (all brands)',
        breadcrumb: 'Corporate privacy',
        breadcrumbHref: REGENOXY_HUB_PATH,
        intro: `<div class="border border-slate-600 bg-slate-900/40 p-4 rounded mb-8 text-xs text-slate-400">
            General framework for Regenoxy LLC. <strong>PredictaCore:</strong> <a href="/privacy" class="text-emerald-500 underline">service-specific privacy</a>.
            <strong>Clinical:</strong> health data handled per practice at ${CLINICAL_WEB}.
        </div>`,
        bodyHtml: `
        <div><h2 class="text-white font-bold mb-2">1. Controller</h2>
            <p>Regenoxy LLC. PredictaCore: reportes@predictacore.ai. Clinical: contact provided when you book.</p></div>
        <div><h2 class="text-white font-bold mb-2">2. Data we may process</h2>
            <ul class="list-disc pl-5 space-y-1">
                <li>Contact information (name, email, phone)</li>
                <li>Health/wellness data (clinical services only, as applicable)</li>
                <li>Payment data (Stripe, CarePatron, etc.; we do not store full card numbers)</li>
                <li>Technical data (IP, logs)</li>
                <li>PredictaCore: URLs and public site content analyzed</li>
            </ul></div>
        <div><h2 class="text-white font-bold mb-2">3–6. Purposes, processors, retention, rights</h2>
            <p>Service delivery, billing, legal compliance, and security. Processors include Stripe, CarePatron, calendar tools, email, cloud, and AI vendors as needed. Exercise rights via your service contact channel.</p></div>`,
        footerLinks: [
            { href: '/privacy', label: 'PredictaCore Privacy' },
            { href: CLINICAL_WEB, label: 'Oxy Hyperbaric' },
        ],
    });
}

module.exports = {
    CLINICAL_WEB,
    CLINICAL_TERMS_URL,
    REGENOXY_HUB_PATH,
    getRegenoxyHubHTML,
    getLegalHubHTML,
    getTerminosHTML,
    getPrivacidadHTML,
    getServiciosClinicosHTML,
    getPagosHTML,
    getPrivacidadRegenoxyHTML,
};
