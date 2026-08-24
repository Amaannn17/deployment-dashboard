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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { escapeHTML };
}
