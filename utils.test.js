const test = require('node:test');
const assert = require('node:assert');
const { escapeHTML, formatNum } = require('./utils.js');

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

test('formatNum rounds numbers to two decimal places', () => {
    assert.strictEqual(formatNum(12.3456), 12.35);
    assert.strictEqual(formatNum(12.344), 12.34);
    assert.strictEqual(formatNum(10), 10);
    assert.strictEqual(formatNum(0), 0);
});

test('formatNum handles string representations of numbers', () => {
    assert.strictEqual(formatNum('12.345'), 12.35);
    assert.strictEqual(formatNum('100'), 100);
});

test('formatNum handles negative numbers', () => {
    assert.strictEqual(formatNum(-5.6789), -5.68);
});
