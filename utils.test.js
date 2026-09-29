const test = require('node:test');
const assert = require('node:assert');
const { escapeHTML } = require('./utils.js');

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

test('escapeHTML neutralizes XSS vectors in attributes and event handlers', () => {
    const xssPayload1 = "model' onload='alert(1)";
    assert.strictEqual(
        escapeHTML(xssPayload1),
        "model&#39; onload=&#39;alert(1)"
    );

    const xssPayload2 = '"><script>alert("XSS")</script>';
    assert.strictEqual(
        escapeHTML(xssPayload2),
        '&quot;&gt;&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
    );
});
