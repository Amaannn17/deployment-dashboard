// A simple benchmark to test array .join vs string concatenation

function benchStringConcat(iterations) {
  let tableHTML = '<tbody>';
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    tableHTML += `<tr><td>${i}</td><td>Data ${i}</td><td>Data ${i}</td><td>Data ${i}</td><td>Data ${i}</td></tr>`;
  }
  tableHTML += '</tbody>';
  const end = process.hrtime.bigint();
  return Number(end - start) / 1e6; // in ms
}

function benchArrayJoin(iterations) {
  let tableHTML = ['<tbody>'];
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    tableHTML.push(`<tr><td>${i}</td><td>Data ${i}</td><td>Data ${i}</td><td>Data ${i}</td><td>Data ${i}</td></tr>`);
  }
  tableHTML.push('</tbody>');
  const result = tableHTML.join('');
  const end = process.hrtime.bigint();
  return Number(end - start) / 1e6; // in ms
}

const iterations = 100000;
console.log(`String concat: ${benchStringConcat(iterations)} ms`);
console.log(`Array join: ${benchArrayJoin(iterations)} ms`);
