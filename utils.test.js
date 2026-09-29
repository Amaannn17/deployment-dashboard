const test = require('node:test');
const assert = require('node:assert');
const { escapeHTML, isSafeKey } = require('./utils.js');

test('escapeHTML escapes basic HTML entities', () => {
    assert.strictEqual(escapeHTML('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
});

test('escapeHTML escapes quotes and ampersands', () => {
    assert.strictEqual(escapeHTML('Tom & Jerry "The Movie" \'92'), 'Tom &amp; Jerry &quot;The Movie&quot; &#39;92');
});

test('escapeHTML handles non-strings gracefully', () => {
    assert.strictEqual(escapeHTML(null), null);
    assert.strictEqual(escapeHTML(undefined), undefined);
    assert.strictEqual(escapeHTML(123), 123);
});

test('escapeHTML returns same string if no entities', () => {
    assert.strictEqual(escapeHTML('Safe String 123'), 'Safe String 123');
});

test('isSafeKey identifies unsafe prototype pollution keys', () => {
    assert.strictEqual(isSafeKey('__proto__'), false);
    assert.strictEqual(isSafeKey('constructor'), false);
    assert.strictEqual(isSafeKey('prototype'), false);
    assert.strictEqual(isSafeKey(''), false);
    assert.strictEqual(isSafeKey('   '), false);
    assert.strictEqual(isSafeKey(null), false);
    assert.strictEqual(isSafeKey(undefined), false);
    assert.strictEqual(isSafeKey(123), false);
});

test('isSafeKey allows valid property keys', () => {
    assert.strictEqual(isSafeKey('Model-A100'), true);
    assert.strictEqual(isSafeKey('lighting_fixture'), true);
    assert.strictEqual(isSafeKey('quantity'), true);
});

test('prototype pollution resistance in mock data processing', () => {
    const projectData = { lighting: {} };
    const targetSystem = 'lighting';

    const maliciousRows = [
        { 'model': '__proto__', 'quantity': 10 },
        { 'model': 'constructor', 'quantity': 10 },
        { 'model': 'prototype', 'quantity': 10 },
        { 'model': 'VALID_MODEL', 'quantity': 5 }
    ];

    maliciousRows.forEach(row => {
        let model = String(row.model).trim();
        if (!isSafeKey(model)) return;

        if (!Object.prototype.hasOwnProperty.call(projectData[targetSystem], model)) {
            projectData[targetSystem][model] = { quantity: 0 };
        }
        projectData[targetSystem][model].quantity += row.quantity;
    });

    assert.strictEqual(Object.prototype.polluted, undefined);
    assert.strictEqual(Object.prototype.hasOwnProperty.call(projectData.lighting, '__proto__'), false);
    assert.strictEqual(Object.prototype.hasOwnProperty.call(projectData.lighting, 'constructor'), false);
    assert.strictEqual(Object.prototype.hasOwnProperty.call(projectData.lighting, 'prototype'), false);
    assert.strictEqual(projectData.lighting['VALID_MODEL'].quantity, 5);
});
