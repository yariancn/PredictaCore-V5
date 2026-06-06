/**
 * Web vs social audit targets — shared by motor, server, and internal UI.
 */

const SOCIAL_PLATFORMS = {
    instagram: {
        id: 'instagram',
        label: 'Instagram',
        domain: 'instagram.com',
        placeholder: '@brand or brand',
        hint: 'Public profile URL or username',
    },
    facebook: {
        id: 'facebook',
        label: 'Facebook',
        domain: 'facebook.com',
        placeholder: 'pagename or facebook.com/pagename',
        hint: 'Page or profile URL',
    },
    tiktok: {
        id: 'tiktok',
        label: 'TikTok',
        domain: 'tiktok.com',
        placeholder: '@brand',
        hint: 'Public profile @handle',
    },
};

function isSocialMediaUrl(url) {
    const u = String(url || '').toLowerCase();
    return u.includes('instagram.com')
        || u.includes('facebook.com')
        || u.includes('tiktok.com');
}

function normalizeUrl(dna) {
    let url = (dna || '').trim();
    if (!url) return '';
    if (!url.startsWith('http')) url = `https://${url.replace(/^\/\//, '')}`;
    return url;
}

function buildSocialProfileUrl(platform, handle) {
    const meta = SOCIAL_PLATFORMS[platform];
    if (!meta || !handle) return '';

    let raw = String(handle).trim();
    if (!raw) return '';

    if (raw.toLowerCase().includes(meta.domain)) {
        return normalizeUrl(raw);
    }

    raw = raw.replace(/^@/, '').replace(/^\//, '');

    if (platform === 'instagram') {
        return `https://www.instagram.com/${raw}/`;
    }
    if (platform === 'facebook') {
        return `https://www.facebook.com/${raw}`;
    }
    if (platform === 'tiktok') {
        return `https://www.tiktok.com/@${raw.replace(/^@/, '')}`;
    }
    return '';
}

function resolveAuditTarget({ assetType, dna, platform, handle }) {
    const type = assetType === 'social' ? 'social' : 'web';

    if (type === 'web') {
        const url = normalizeUrl(dna);
        if (!url) return { ok: false, error: 'Website URL required' };
        if (isSocialMediaUrl(url)) {
            return { ok: false, error: 'Use Social Profile mode for Instagram, Facebook, or TikTok URLs' };
        }
        return { ok: true, url, assetType: 'web' };
    }

    if (!SOCIAL_PLATFORMS[platform]) {
        return { ok: false, error: 'Select Instagram, Facebook, or TikTok' };
    }

    const url = buildSocialProfileUrl(platform, handle || dna);
    if (!url) return { ok: false, error: 'Social profile handle or URL required' };

    return { ok: true, url, assetType: 'social', platform };
}

module.exports = {
    SOCIAL_PLATFORMS,
    isSocialMediaUrl,
    normalizeUrl,
    buildSocialProfileUrl,
    resolveAuditTarget,
};
