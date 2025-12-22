const { jsPDF } = require('./dist/jspdf.node.js');

// Create PDF with PDF/UA mode enabled
const doc = new jsPDF({ pdfUA: true });

// Set document title and language
doc.setDocumentTitle('Test: Object-Nummer Fix');
doc.setLanguage('de-DE');

// Create document structure
doc.beginStructureElement('Document');

  // Add a heading
  doc.beginStructureElement('H1');
  doc.setFontSize(24);
  doc.text('Überschrift 1', 20, 30);
  doc.endStructureElement();

  // Add paragraph
  doc.beginStructureElement('P');
  doc.setFontSize(12);
  doc.text('Dies ist ein Absatz mit normalem Text.', 20, 50);
  doc.endStructureElement();

doc.endStructureElement();

doc.save('examples/temp/CRITICAL-object-fix.pdf');
console.log('PDF generated: examples/temp/CRITICAL-object-fix.pdf');
console.log('');
console.log('=== CRITICAL FIX: Object Number Reservation ===');
console.log('Object numbers are now reserved IMMEDIATELY when:');
console.log('  - StructTreeRoot is created');
console.log('  - Each StructElement is created (beginStructureElement)');
console.log('');
console.log('This prevents object number collisions!');
console.log('');
console.log('PLEASE TEST in Acrobat Reader + Screen Reader!');
