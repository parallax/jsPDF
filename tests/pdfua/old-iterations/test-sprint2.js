// Generate Sprint 2 PDF (with Structure Tree)
const { jsPDF } = require('./dist/jspdf.node.js');

const doc = new jsPDF({ pdfUA: true });

// Set document title
doc.setDocumentTitle('Sprint 2 Test Document');

// Create document structure
doc.beginStructureElement('Document');

  // Add a heading
  doc.beginStructureElement('H1');
  doc.text('Hello PDF/UA World!', 10, 10);
  doc.endStructureElement();

  // Add paragraphs
  doc.beginStructureElement('P');
  doc.text('This document has:', 10, 20);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('  - StructTreeRoot with structure elements', 10, 30);
  doc.text('  - MarkInfo dictionary with Marked=true', 10, 40);
  doc.text('  - Nested Document/H1/P structure', 10, 50);
  doc.endStructureElement();

doc.endStructureElement();

// Save to file
const fs = require('fs');
const pdfData = doc.output('arraybuffer');
fs.writeFileSync('examples/temp/sprint2.pdf', Buffer.from(pdfData));

console.log('✅ Sprint 2 PDF created: examples/temp/sprint2.pdf');
