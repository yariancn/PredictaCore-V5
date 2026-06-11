/** Ubicación / mercado geográfico inferido del activo — universal por giro */

const COUNTRY_TLD = {
    mx: 'MX', 'com.mx': 'MX', es: 'ES', 'co.uk': 'GB', uk: 'GB',
    'com.au': 'AU', au: 'AU', de: 'DE', fr: 'FR', br: 'BR', ar: 'AR', cl: 'CL', co: 'CO',
};

const COUNTRY_NAMES = {
    MX: ['mexico', 'méxico', 'mexico city', 'cdmx'],
    US: ['usa', 'united states', 'u.s.a', 'america'],
    ES: ['españa', 'spain', 'madrid', 'barcelona'],
    AU: ['australia', 'australian'],
    GB: ['uk', 'united kingdom', 'england', 'london'],
};

const LOCAL_GIROS = new Set(['salud', 'restaurante', 'inmobiliario', 'servicios', 'general']);

function inferCountryFromDomain(url) {
    try {
        const host = new URL(url).hostname.toLowerCase();
        for (const [tld, code] of Object.entries(COUNTRY_TLD)) {
            if (host.endsWith(`.${tld}`)) return code;
        }
        if (host.endsWith('.com') || host.endsWith('.net') || host.endsWith('.org')) return null;
    } catch { /* skip */ }
    return null;
}

function inferCountryFromLang(htmlLang) {
    if (!htmlLang) return null;
    const l = htmlLang.toLowerCase();
    if (l.startsWith('es')) return 'ES';
    if (l.startsWith('en-au')) return 'AU';
    if (l.startsWith('en-gb')) return 'GB';
    if (l.startsWith('en')) return 'US';
    if (l.startsWith('pt-br')) return 'BR';
    if (l.startsWith('de')) return 'DE';
    if (l.startsWith('fr')) return 'FR';
    return null;
}

function detectCountryInText(text) {
    const lower = String(text || '').toLowerCase();
    for (const [code, names] of Object.entries(COUNTRY_NAMES)) {
        if (names.some((n) => lower.includes(n))) return code;
    }
    if (/\b(?:TX|CA|FL|NY|IL|GA|AZ|CO|WA|OR|NV|NC|SC|VA|PA|OH|MI|MN|WI|MO|TN|LA|AL|KY|OK|UT|IA|AR|MS|KS|NM|NE|WV|ID|HI|NH|ME|MT|RI|DE|SD|ND|AK|VT|WY|DC)\b/.test(text)) {
        return 'US';
    }
    return null;
}

function extractGeoContext(onPage, url, giro) {
    const sample = `${onPage?.textSample || ''} ${onPage?.metaDescription || ''} ${onPage?.h1Text || ''}`.slice(0, 4000);

    const cityStateZip = sample.match(
        /\b([A-ZÁÉÍÓÚ][a-záéíóúA-Z]+(?:\s+[A-ZÁÉÍÓÚ][a-záéíóú]+)?),\s*([A-Z]{2}|[A-Za-záéíóúÁÉÍÓÚ\s]{2,30})(?:\s+(\d{4,5}))?\b/
    );
    const mxCity = sample.match(/\b(CDMX|Ciudad de México|Guadalajara|Monterrey|Cancún|Puebla|Tijuana|Querétaro|León|Mérida)\b/i);
    const esCity = sample.match(/\b(Madrid|Barcelona|Valencia|Sevilla|Bogotá|Buenos Aires|Santiago|Lima)\b/i);

    const city = cityStateZip?.[1]?.trim() || mxCity?.[0] || esCity?.[0] || null;
    const region = cityStateZip?.[2]?.trim() || null;
    const postal = cityStateZip?.[3] || null;

    const country = detectCountryInText(sample)
        || inferCountryFromDomain(url)
        || inferCountryFromLang(onPage?.htmlLang)
        || (region && /^[A-Z]{2}$/.test(region) ? 'US' : null);

    const hasLocalSignals = !!(city || /\b(dirección|address|ubicación|location|horario|hours|visit us|visítanos|sucursal|branch|our store|nuestra tienda|showroom|walk-?in|tienda física|physical store)\b/i.test(sample));
    const giroId = giro?.id || 'general';
    let scope = 'NATIONAL';
    if (LOCAL_GIROS.has(giroId) && hasLocalSignals) scope = 'LOCAL';
    if (giroId === 'ecommerce') scope = 'NATIONAL';
    if (giroId === 'salud' || giroId === 'restaurante') scope = hasLocalSignals ? 'LOCAL' : 'NATIONAL';

    const parts = [city, region, country].filter(Boolean);
    const label = parts.length ? parts.join(', ') : (country || 'NO_DETECTADA');

    return {
        city,
        region,
        postal,
        country: country || 'NO_DETECTADA',
        scope,
        label,
        hasLocalSignals,
    };
}

function formatGeoBlock(geo) {
    return `
=== UBICACION_MERCADO (OBLIGATORIO PARA BENCHMARK) ===
ALCANCE: ${geo.scope}
CIUDAD: ${geo.city || 'NO_DETECTADA'}
REGION: ${geo.region || 'NO_DETECTADA'}
PAIS: ${geo.country}
ETIQUETA: ${geo.label}
REGLA_BENCHMARK: Competidores del mismo nicho comercial Y del mismo mercado geográfico (${geo.scope === 'LOCAL' ? 'misma ciudad/región' : 'mismo país/mercado'}). PROHIBIDO competidores de otro país o región lejana salvo que el activo sea explícitamente global.
=== FIN UBICACION_MERCADO ===`;
}

function inferCountryFromSnapshot(snapshot, domain) {
    const blob = `${snapshot?.title || ''} ${snapshot?.description || ''} ${snapshot?.bodyText || ''}`;
    return detectCountryInText(blob) || inferCountryFromDomain(`https://${domain}`) || null;
}

function geoMatchesMarket(clientGeo, snapshot, domain) {
    if (!clientGeo || clientGeo.country === 'NO_DETECTADA') return true;

    const blob = `${snapshot?.title || ''} ${snapshot?.description || ''} ${snapshot?.bodyText || ''}`.toLowerCase();
    const compCountry = inferCountryFromSnapshot(snapshot, domain);

    if (clientGeo.country && compCountry && clientGeo.country !== compCountry) {
        return false;
    }

    if (clientGeo.scope === 'LOCAL' && clientGeo.city) {
        const cityLower = clientGeo.city.toLowerCase();
        if (blob.includes(cityLower)) return true;
        if (clientGeo.region && blob.includes(clientGeo.region.toLowerCase())) return true;
        if (compCountry && compCountry !== clientGeo.country) return false;
        return false;
    }

    if (clientGeo.country && clientGeo.country !== 'NO_DETECTADA') {
        const markers = COUNTRY_NAMES[clientGeo.country] || [];
        if (markers.some((m) => blob.includes(m))) return true;
        if (compCountry === clientGeo.country) return true;
        if (!compCountry) return true;
        return false;
    }

    return true;
}

module.exports = {
    extractGeoContext,
    formatGeoBlock,
    geoMatchesMarket,
    inferCountryFromDomain,
};
