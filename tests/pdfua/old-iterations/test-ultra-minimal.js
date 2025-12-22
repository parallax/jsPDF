// Ultra-minimal PDF/UA test - single word
const { jsPDF } = require('./dist/jspdf.node.js');

const doc = new jsPDF({ pdfUA: true });
doc.setDocumentTitle('Ultra Minimal Test');

// Single structure element with single word
doc.beginStructureElement('Document');
  doc.beginStructureElement('P');
  doc.text('Test', 10, 10);
  doc.endStructureElement();
doc.endStructureElement();

const fs = require('fs');
const pdfData = doc.output('arraybuffer');
fs.writeFileSync('examples/temp/ultra-minimal.pdf', Buffer.from(pdfData));

console.log('✅ Ultra-minimal PDF created: examples/temp/ultra-minimal.pdf');
console.log('Please test this in Acrobat Reader!');
