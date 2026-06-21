#!/usr/bin/env node
/**
 * Send Lite upsell email previews (initial + day1 + weekly).
 * Usage: RESEND_API_KEY=... node scripts/send-lite-upsell-preview.js [email] [lang]
 */

const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

function loadDotEnv() {
    const envPath = path.join(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) return;
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
        const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
        if (!m || process.env[m[1]]) continue;
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
}

loadDotEnv();

const {
    getLiteReportEmailCopy,
    getSamplePreviewLeaks,
    buildUpsellTitanUrl,
} = require('../lite-upsell');
const { wrapPredictaCoreEmail, getResendFrom, getSalesNotifyEmail } = require('../brand');

async function main() {
    const to = (process.argv[2] || getSalesNotifyEmail()).trim().toLowerCase();
    const lang = process.argv[3] === 'es' ? 'es' : 'en';

    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY not set');
        process.exit(1);
    }

    const targetUrl = 'https://example-baby-bedding.myshopify.com';
    const leaks = getSamplePreviewLeaks(lang);
    const metrics = { seoScore: 61, aiScore: 85, loadTimeSec: 4.3 };
    const resend = new Resend(process.env.RESEND_API_KEY);
    const variants = [
        { variant: 'initial', label: 'lite-initial' },
        { variant: 'day1', label: 'lite-day1' },
        { variant: 'weekly', label: 'lite-weekly' },
    ];

    for (const { variant, label } of variants) {
        const titanUrl = buildUpsellTitanUrl({
            email: to,
            dna: targetUrl,
            lang,
            campaign: label,
        });
        const mail = getLiteReportEmailCopy({
            lang,
            titanUrl,
            targetUrl,
            leaks,
            metrics,
            variant,
            daysSinceLite: variant === 'weekly' ? 7 : undefined,
        });
        const { data, error } = await resend.emails.send({
            from: getResendFrom(),
            to,
            subject: `[PREVIEW ${label.toUpperCase()}] ${mail.subject}`,
            text: `${mail.text}\n\n[Preview — sample Shopify baby bedding leaks]`,
            html: wrapPredictaCoreEmail(lang, mail.html, mail.preheader),
        });
        if (error) throw new Error(`${label}: ${error.message}`);
        console.log(`Sent ${label} → ${to} (id: ${data.id})`);
    }

    console.log('Done — check inbox for 3 preview emails.');
}

main().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
});
