function escapeHTML(str) {
    if (str === null || str === undefined) {
        return '';
    }
    return String(str).replace(/[&<>'"]/g, function(match) {
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

function formatNum(num) {
    return parseFloat(Number(num).toFixed(2));
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { escapeHTML, formatNum };
}
