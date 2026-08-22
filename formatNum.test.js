const test = require('node:test');
const assert = require('node:assert');
const { formatNum } = require('./formatNum.js');

test('formatNum properly formats numbers', async (t) => {
    await t.test('rounds to 2 decimal places', () => {
        assert.strictEqual(formatNum(1.234), 1.23);
        assert.strictEqual(formatNum(1.235), 1.24);
        assert.strictEqual(formatNum(1.239), 1.24);
    });

    await t.test('handles integers properly', () => {
        assert.strictEqual(formatNum(5), 5);
        assert.strictEqual(formatNum(100), 100);
    });

    await t.test('handles strings correctly', () => {
        assert.strictEqual(formatNum('1.234'), 1.23);
        assert.strictEqual(formatNum('5'), 5);
    });

    await t.test('handles zero correctly', () => {
        assert.strictEqual(formatNum(0), 0);
        assert.strictEqual(formatNum('0'), 0);
    });

    await t.test('handles edge cases', () => {
        assert.strictEqual(formatNum(null), 0);
        assert.strictEqual(formatNum(''), 0);
        assert.ok(Number.isNaN(formatNum(undefined)));
        assert.ok(Number.isNaN(formatNum('abc')));
        assert.ok(Number.isNaN(formatNum(NaN)));
    });
});
