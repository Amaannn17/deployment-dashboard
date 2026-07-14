const formatNum = (num) => parseFloat(Number(num).toFixed(2));

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { formatNum };
}
