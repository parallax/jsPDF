const { jsPDF } = require('./dist/jspdf.node.js');

// Create PDF with PDF/UA mode enabled
const doc = new jsPDF({ pdfUA: true });

// Set document title (required for PDF/UA)
doc.setDocumentTitle('Sprint 3 - K Array Format Fix');

// Create document structure
doc.beginStructureElement('Document');

  // Add a heading - automatically tagged
  doc.beginStructureElement('H1');
  doc.setFontSize(24);
  doc.text('Überschrift 1', 20, 30);
  doc.endStructureElement();

  // Add paragraphs - automatically tagged
  doc.beginStructureElement('P');
  doc.setFontSize(12);
  doc.text('Dies ist ein Absatz mit normalem Text.', 20, 50);
  doc.endStructureElement();

doc.endStructureElement();

doc.save('examples/temp/FINAL-k-array-fix.pdf');
console.log('PDF generated: examples/temp/FINAL-k-array-fix.pdf');
console.log('');
console.log('=== APPLIED FIX ===');
console.log('Changed /K format from "/K 0" (integer) to "/K [0]" (array)');
console.log('This matches the reference PDF format exactly.');
console.log('');
console.log('Please test this PDF in Acrobat Reader with screen reader!');
