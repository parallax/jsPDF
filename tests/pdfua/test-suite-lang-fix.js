// Test Suite: Verify /Lang fix resolves AVPageView issue
const { jsPDF } = require('./dist/jspdf.node.js');
const fs = require('fs');

console.log('========================================');
console.log('PDF/UA Test Suite - /Lang Fix Verification');
console.log('========================================\n');

// Test 1: Ultra-minimal (1 word)
console.log('Test 1: Ultra-minimal PDF (1 word)');
const doc1 = new jsPDF({ pdfUA: true });
doc1.setDocumentTitle('Test 1 - Minimal');
doc1.beginStructureElement('Document');
  doc1.beginStructureElement('P');
  doc1.text('Test', 10, 10);
  doc1.endStructureElement();
doc1.endStructureElement();
fs.writeFileSync('examples/temp/test1-minimal.pdf', Buffer.from(doc1.output('arraybuffer')));
console.log('✅ Created: examples/temp/test1-minimal.pdf\n');

// Test 2: Simple document with multiple paragraphs
console.log('Test 2: Simple document with multiple paragraphs');
const doc2 = new jsPDF({ pdfUA: true });
doc2.setDocumentTitle('Test 2 - Multiple Paragraphs');
doc2.beginStructureElement('Document');

  doc2.beginStructureElement('P');
  doc2.text('First paragraph of text.', 10, 20);
  doc2.endStructureElement();

  doc2.beginStructureElement('P');
  doc2.text('Second paragraph of text.', 10, 30);
  doc2.endStructureElement();

  doc2.beginStructureElement('P');
  doc2.text('Third paragraph of text.', 10, 40);
  doc2.endStructureElement();

doc2.endStructureElement();
fs.writeFileSync('examples/temp/test2-paragraphs.pdf', Buffer.from(doc2.output('arraybuffer')));
console.log('✅ Created: examples/temp/test2-paragraphs.pdf\n');

// Test 3: Document with headings
console.log('Test 3: Document with headings (H1, H2)');
const doc3 = new jsPDF({ pdfUA: true });
doc3.setDocumentTitle('Test 3 - Headings');
doc3.beginStructureElement('Document');

  doc3.beginStructureElement('H1');
  doc3.setFontSize(20);
  doc3.text('Main Heading', 10, 20);
  doc3.endStructureElement();

  doc3.beginStructureElement('P');
  doc3.setFontSize(12);
  doc3.text('Introduction paragraph.', 10, 35);
  doc3.endStructureElement();

  doc3.beginStructureElement('H2');
  doc3.setFontSize(16);
  doc3.text('Subheading', 10, 50);
  doc3.endStructureElement();

  doc3.beginStructureElement('P');
  doc3.setFontSize(12);
  doc3.text('Content under subheading.', 10, 65);
  doc3.endStructureElement();

doc3.endStructureElement();
fs.writeFileSync('examples/temp/test3-headings.pdf', Buffer.from(doc3.output('arraybuffer')));
console.log('✅ Created: examples/temp/test3-headings.pdf\n');

// Test 4: Complex nested structure
console.log('Test 4: Complex document with nested structure');
const doc4 = new jsPDF({ pdfUA: true });
doc4.setDocumentTitle('Test 4 - Complex Structure');
doc4.setLanguage('de-DE'); // Test with German language
doc4.beginStructureElement('Document');

  doc4.beginStructureElement('H1');
  doc4.setFontSize(20);
  doc4.text('Hauptüberschrift', 10, 20);
  doc4.endStructureElement();

  doc4.beginStructureElement('P');
  doc4.setFontSize(12);
  doc4.text('Dies ist ein deutscher Text mit mehreren Wörtern.', 10, 35);
  doc4.endStructureElement();

  doc4.beginStructureElement('H2');
  doc4.setFontSize(16);
  doc4.text('Erster Abschnitt', 10, 50);
  doc4.endStructureElement();

  doc4.beginStructureElement('P');
  doc4.setFontSize(12);
  doc4.text('Text im ersten Abschnitt.', 10, 65);
  doc4.endStructureElement();

  doc4.beginStructureElement('H2');
  doc4.setFontSize(16);
  doc4.text('Zweiter Abschnitt', 10, 80);
  doc4.endStructureElement();

  doc4.beginStructureElement('P');
  doc4.setFontSize(12);
  doc4.text('Text im zweiten Abschnitt mit weiteren Details.', 10, 95);
  doc4.endStructureElement();

  doc4.beginStructureElement('P');
  doc4.setFontSize(12);
  doc4.text('Noch ein Absatz mit zusätzlichen Informationen.', 10, 105);
  doc4.endStructureElement();

doc4.endStructureElement();
fs.writeFileSync('examples/temp/test4-complex.pdf', Buffer.from(doc4.output('arraybuffer')));
console.log('✅ Created: examples/temp/test4-complex.pdf\n');

// Test 5: Multi-page document
console.log('Test 5: Multi-page document');
const doc5 = new jsPDF({ pdfUA: true });
doc5.setDocumentTitle('Test 5 - Multi-page');
doc5.beginStructureElement('Document');

  // Page 1
  doc5.beginStructureElement('H1');
  doc5.setFontSize(20);
  doc5.text('Page 1 - Introduction', 10, 20);
  doc5.endStructureElement();

  doc5.beginStructureElement('P');
  doc5.setFontSize(12);
  doc5.text('This is content on the first page.', 10, 35);
  doc5.endStructureElement();

  // Page 2
  doc5.addPage();

  doc5.beginStructureElement('H1');
  doc5.setFontSize(20);
  doc5.text('Page 2 - Continuation', 10, 20);
  doc5.endStructureElement();

  doc5.beginStructureElement('P');
  doc5.setFontSize(12);
  doc5.text('This is content on the second page.', 10, 35);
  doc5.endStructureElement();

doc5.endStructureElement();
fs.writeFileSync('examples/temp/test5-multipage.pdf', Buffer.from(doc5.output('arraybuffer')));
console.log('✅ Created: examples/temp/test5-multipage.pdf\n');

console.log('========================================');
console.log('All test PDFs created successfully!');
console.log('========================================\n');
console.log('Please test these PDFs in Acrobat Reader:');
console.log('1. examples/temp/test1-minimal.pdf');
console.log('2. examples/temp/test2-paragraphs.pdf');
console.log('3. examples/temp/test3-headings.pdf');
console.log('4. examples/temp/test4-complex.pdf (German)');
console.log('5. examples/temp/test5-multipage.pdf\n');
console.log('Expected: All text should be visible and readable by screen reader');
console.log('NOT: "AVPageView Textrahmen" placeholder');
