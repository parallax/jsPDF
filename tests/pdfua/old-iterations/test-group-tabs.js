const { jsPDF } = require('./dist/jspdf.node.js');

// Create PDF with PDF/UA mode enabled
const doc = new jsPDF({ pdfUA: true });

// Set document title and language
doc.setDocumentTitle('Test mit Group und Tabs');
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

doc.save('examples/temp/TEST-group-tabs.pdf');
console.log('PDF generated: examples/temp/TEST-group-tabs.pdf');
console.log('');
console.log('=== NEW FIX APPLIED ===');
console.log('Added to Page object:');
console.log('  /Tabs /S             - for proper reading order');
console.log('  /Group << ... >>     - transparency group with DeviceRGB');
console.log('');
console.log('PLEASE TEST in Acrobat Reader + Screen Reader!');
