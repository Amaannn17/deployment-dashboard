function escapeHTML(str) {
    if (typeof str !== 'string') {
        return str;
    }
    return str.replace(/[&<>'"]/g, function(match) {
        switch (match) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#39;';
            default: return match;
        }
    });
}

function sanitizeKey(key) {
    if (typeof key !== 'string') {
        return key;
    }
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return key + '_safe';
    }
    return key;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { escapeHTML, sanitizeKey };
}
