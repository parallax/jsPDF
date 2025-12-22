const { jsPDF } = require('./dist/jspdf.node.js');

const doc = new jsPDF({
  unit: 'mm',
  format: 'a4',
  pdfUA: true  // Must be camelCase
});

// Document structure
doc.beginStructureElement('Document');

// Heading 1
doc.beginStructureElement('H1');
doc.setFontSize(24);
doc.text('Überschrift 1', 20, 30);
doc.endStructureElement();

// Paragraph
doc.beginStructureElement('P');
doc.setFontSize(12);
doc.text('Dies ist ein Absatz mit normalem Text.', 20, 50);
doc.endStructureElement();

doc.endStructureElement(); // End Document

doc.save('examples/temp/FIX-K-array-format.pdf');
console.log('PDF generated: examples/temp/FIX-K-array-format.pdf');
