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

function isSafeKey(key) {
    if (typeof key !== 'string') {
        return false;
    }
    const unsafeKeys = ['__proto__', 'constructor', 'prototype'];
    return key.trim() !== '' && !unsafeKeys.includes(key);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { escapeHTML, isSafeKey };
}
