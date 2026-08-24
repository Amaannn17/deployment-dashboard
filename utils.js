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


const formatNum = (num) => parseFloat(Number(num).toFixed(2));

function updateWork(system, model, phase) {
    // Apply the same encoding to find the correct input box
    let safeModel = encodeURIComponent(model).replace(/'/g, "%27");
    const inputField = document.getElementById(`input-${safeModel}`);
    const addedQty = parseFloat(inputField.value);

    if (isNaN(addedQty)) return;

    let currentVal = projectData[system][model].stages[phase] || 0;
    let newTotal = formatNum(currentVal + addedQty);
    let maxQty = formatNum(projectData[system][model].quantity);

    if (newTotal < 0) newTotal = 0;
    if (newTotal > maxQty) newTotal = maxQty;

    projectData[system][model].stages[phase] = newTotal;

    saveData();
    renderActiveTable();
    updateMasterChart();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { escapeHTML, formatNum, updateWork };
}
