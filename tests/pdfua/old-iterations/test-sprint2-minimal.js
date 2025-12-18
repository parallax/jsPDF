// Minimal Sprint 2 test - single text with structure
const { jsPDF } = require('./dist/jspdf.node.js');

const doc = new jsPDF({ pdfUA: true });
doc.setDocumentTitle('Minimal Sprint 2 Test');

// Single structure element with single text
doc.beginStructureElement('Document');
  doc.beginStructureElement('P');
  doc.text('Hello World!', 10, 10);
  doc.endStructureElement();
doc.endStructureElement();

const fs = require('fs');
const pdfData = doc.output('arraybuffer');
fs.writeFileSync('examples/temp/sprint2-minimal.pdf', Buffer.from(pdfData));

console.log('✅ Minimal Sprint 2 PDF created');
console.log('Structure tree:', JSON.stringify(doc.internal.structureTree.root, null, 2));
