/** Idioma del reporte = idioma de la página/perfil analizado (no preferencia del sistema). */

const ES_REGLAS = `Si el activo está en ESPAÑOL:
- Español latinoamericano neutro (México / LATAM). Tono directo para emprendedor.
- Usa: sitio web, celular, correo, negocio, cliente, página, reservar, carrito, contacto.`;

const EN_REGLAS = `Si el activo está en INGLÉS:
- Inglés americano neutro para negocios (website, email, apply, checkout, customer).`;

const IDIOMA_REPORTE = `INSTRUCCIÓN CRÍTICA DE IDIOMA:
1. El reporte DEBE estar en el MISMO idioma que la página o perfil público analizado (titular, textos visibles, bio).
2. Lee el bloque IDIOMA_REPORTE del dossier — CODIGO e IDIOMA_APLICAR son la verdad. Cero mezclas.
3. Ignora idioma de la plataforma (Login, Meta, cookies). Usa contenido del negocio.
${ES_REGLAS}
${EN_REGLAS}`;

const IDIOMA_SOCIAL_EXTRA = `PERFIL SOCIAL: Idioma desde la bio y contenido del negocio. Ignora textos de la plataforma ('Iniciar sesión', 'Log in', 'Publicaciones', 'Meta').`;

const IDIOMA_SOCIAL = `${IDIOMA_REPORTE}\n${IDIOMA_SOCIAL_EXTRA}`;

const IDIOMA_LITE = IDIOMA_REPORTE;
const IDIOMA_DELTA = IDIOMA_REPORTE;

function normalizeHtmlLang(raw) {
    const lang = String(raw || '').trim().toLowerCase();
    if (!lang || lang === 'ausente' || lang === 'no_detectado' || lang === 'unknown') return '';
    return lang.split(/[_\s]/)[0];
}

function scoreLanguage(text) {
    const sample = String(text || '').toLowerCase().slice(0, 4000);
    const es = (sample.match(/\b(el|la|los|las|de|que|para|con|por|una|del|más|sitio|contacto|servicio|empresa|tienda|clínica|reservar|nosotros|tu|bienvenido|comprar|productos)\b/g) || []).length;
    const en = (sample.match(/\b(the|and|your|our|website|home|about|contact|shop|buy|learn|get|free|services|products|welcome|click|email|order|business|customer)\b/g) || []).length;
    return { es, en };
}

function resolveReportLocale(htmlLang, textSample) {
    const lang = normalizeHtmlLang(htmlLang);
    const { es, en } = scoreLanguage(textSample);

    if (lang.startsWith('en')) {
        return { code: 'en-US', label: 'English (US business)' };
    }
    if (lang.startsWith('es')) {
        return { code: 'es-LATAM', label: 'Español latinoamericano' };
    }
    if (lang.startsWith('pt')) {
        return { code: 'pt-BR', label: 'Português (Brasil)' };
    }
    if (lang.startsWith('fr')) {
        return { code: 'fr-FR', label: 'Français' };
    }

    if (en >= 6 && en > es) {
        return { code: 'en-US', label: 'English (US business)' };
    }
    if (es >= 4 && es >= en) {
        return { code: 'es-LATAM', label: 'Español latinoamericano' };
    }
    if (en >= 4 && en >= es) {
        return { code: 'en-US', label: 'English (US business)' };
    }

    return { code: 'en-US', label: 'English (US business)' };
}

function parseLocaleFromDossier(dossier) {
    const block = String(dossier || '');
    const codigo = block.match(/CODIGO:\s*(\S+)/)?.[1] || '';
    if (codigo.startsWith('es')) {
        return { code: 'es-LATAM', label: 'Español latinoamericano' };
    }
    if (codigo.startsWith('en')) {
        return { code: 'en-US', label: 'English (US business)' };
    }
    if (codigo.startsWith('pt')) {
        return { code: 'pt-BR', label: 'Português (Brasil)' };
    }
    if (codigo.startsWith('fr')) {
        return { code: 'fr-FR', label: 'Français' };
    }

    const htmlLang = block.match(/HTML_LANG:\s*(\S+)/)?.[1] || '';
    const title = block.match(/TITULO:\s*([^|]+)/)?.[1] || '';
    const textoIdx = block.indexOf('| TEXTO:');
    const textSample = textoIdx >= 0
        ? block.slice(textoIdx, textoIdx + 3500)
        : block.slice(0, 3500);
    return resolveReportLocale(htmlLang, `${title} ${textSample}`);
}

function formatIdiomaBlock(htmlLang, textSample) {
    const locale = resolveReportLocale(htmlLang, textSample);
    const note = locale.code.startsWith('es')
        ? 'REGLA: Todo el PDF en español latinoamericano — mismo idioma que la página.'
        : locale.code.startsWith('en')
            ? 'RULE: Entire PDF in US business English — same language as the analyzed page.'
            : `REGLA: Todo el PDF en ${locale.label} — mismo idioma que la página.`;

    return `
=== IDIOMA_REPORTE (OBLIGATORIO EN TODO EL PDF) ===
HTML_LANG: ${htmlLang || 'NO_DETECTADO'}
IDIOMA_APLICAR: ${locale.label}
CODIGO: ${locale.code}
${note}
=== FIN IDIOMA_REPORTE ===`;
}

/** Prompt inyectado en cada llamada a Gemini — anula cualquier default en español. */
function buildReportLanguagePrompt(locale) {
    const base = IDIOMA_REPORTE;
    if (locale.code.startsWith('en')) {
        return `${base}

MANDATORY — ANALYZED PAGE IS ENGLISH:
Write THIS ENTIRE SECTION in US business English only.
All ### headers, table labels, numbered lists, and paragraphs must be English.
Do NOT use Spanish section titles (e.g. avoid "Introducción", "Fugas", "Acciones").
Match the language your customer sees on their public page.`;
    }
    if (locale.code.startsWith('es')) {
        return `${base}

OBLIGATORIO — LA PÁGINA ANALIZADA ESTÁ EN ESPAÑOL:
Redacta TODA esta sección en español latinoamericano.
Todos los encabezados ###, etiquetas de tablas, listas numeradas y párrafos en español.
NO uses títulos en inglés (evita "Introduction", "Leaks", "Actions").
Usa el mismo idioma que ve el cliente en su página pública.`;
    }
    return `${base}\n\nSigue IDIOMA_APLICAR y CODIGO del dossier al pie de la letra.`;
}

module.exports = {
    IDIOMA_REPORTE,
    IDIOMA_SOCIAL,
    IDIOMA_LITE,
    IDIOMA_DELTA,
    formatIdiomaBlock,
    resolveReportLocale,
    parseLocaleFromDossier,
    buildReportLanguagePrompt,
    scoreLanguage,
};
