// Generate Sprint 3 PDF (with Marked Content)
const { jsPDF } = require('./dist/jspdf.node.js');

const doc = new jsPDF({ pdfUA: true });

// Set document title
doc.setDocumentTitle('Sprint 3 Test Document');

// Create document structure
doc.beginStructureElement('Document');

  // Add a heading - automatically tagged
  doc.beginStructureElement('H1');
  doc.text('Hello PDF/UA World!', 10, 10);
  doc.endStructureElement();

  // Add paragraphs - automatically tagged
  doc.beginStructureElement('P');
  doc.text('This document has:', 10, 20);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('  - Automatic content tagging with MCIDs', 10, 30);
  doc.text('  - BDC/EMC operators around each text()', 10, 40);
  doc.text('  - ParentTree mapping MCIDs to structure', 10, 50);
  doc.text('  - StructParents in page objects', 10, 60);
  doc.endStructureElement();

doc.endStructureElement();

// Save to file
const fs = require('fs');
const pdfData = doc.output('arraybuffer');
fs.writeFileSync('examples/temp/sprint3.pdf', Buffer.from(pdfData));

console.log('✅ Sprint 3 PDF created: examples/temp/sprint3.pdf');
