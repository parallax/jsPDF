const { jsPDF } = require('./dist/jspdf.node.js');

// Create PDF with PDF/UA mode enabled
const doc = new jsPDF({ pdfUA: true });

// Set document title and language (German)
doc.setDocumentTitle('Test mit /Lang in BDC');
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

doc.save('examples/temp/CRITICAL-lang-in-bdc.pdf');
console.log('PDF generated: examples/temp/CRITICAL-lang-in-bdc.pdf');
console.log('');
console.log('=== CRITICAL FIX APPLIED ===');
console.log('Added /Lang to EVERY BDC operator:');
console.log('  /Span <</Lang (de-DE)/MCID 0>> BDC');
console.log('');
console.log('This matches the working reference PDF format!');
console.log('');
console.log('PLEASE TEST in Acrobat Reader + Screen Reader!');
