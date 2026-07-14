const test = require('node:test');
const assert = require('node:assert');
const { formatNum } = require('./utils.js');

test('formatNum utility tests', async (t) => {
  await t.test('handles integers correctly', () => {
    assert.strictEqual(formatNum(5), 5);
    assert.strictEqual(formatNum(0), 0);
    assert.strictEqual(formatNum(-10), -10);
  });

  await t.test('handles floats correctly (rounds to 2 decimal places)', () => {
    assert.strictEqual(formatNum(5.123), 5.12);
    assert.strictEqual(formatNum(5.129), 5.13); // Test rounding up
    assert.strictEqual(formatNum(5.1), 5.1);
    assert.strictEqual(formatNum(-5.123), -5.12);
  });

  await t.test('handles string values containing numbers', () => {
    assert.strictEqual(formatNum("5"), 5);
    assert.strictEqual(formatNum("5.123"), 5.12);
    assert.strictEqual(formatNum("-10.5"), -10.5);
    assert.strictEqual(formatNum(" 5.12 "), 5.12);
  });

  await t.test('handles edge cases', () => {
    // Number("") is 0, so formatNum("") is 0
    assert.strictEqual(formatNum(""), 0);

    // Number(null) is 0
    assert.strictEqual(formatNum(null), 0);

    // Number(undefined) is NaN, toFixed fails or results in NaN -> parseFloat(NaN) -> NaN
    assert.ok(Number.isNaN(formatNum(undefined)));

    // Number("abc") is NaN
    assert.ok(Number.isNaN(formatNum("abc")));

    // Empty object/array
    assert.ok(Number.isNaN(formatNum({})));
    assert.strictEqual(formatNum([]), 0); // Number([]) is 0

    // Number(true) is 1, Number(false) is 0
    assert.strictEqual(formatNum(true), 1);
    assert.strictEqual(formatNum(false), 0);
  });
});
