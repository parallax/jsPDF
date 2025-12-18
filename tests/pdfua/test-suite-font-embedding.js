/**
 * PDF/UA Font Embedding Test Suite
 *
 * Tests that Atkinson Hyperlegible font is automatically loaded
 * and embedded when PDF/UA mode is enabled.
 *
 * Run: node tests/pdfua/test-suite-font-embedding.js
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('='.repeat(70));
console.log('PDF/UA Font Embedding Test Suite');
console.log('='.repeat(70));

// Test 1: Verify font is auto-loaded in PDF/UA mode
console.log('\n[Test 1] PDF/UA with embedded font (simple text)');
try {
  const doc = new jsPDF({
    pdfUA: true,
    title: 'Test Embedded Font'
  });

  doc.setDocumentTitle('Font Embedding Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
  doc.beginStructureElement('H1');
  doc.text('Font Embedding Test', 10, 10);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('This text uses Atkinson Hyperlegible font.', 10, 20);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('Character distinction test: I l 1 | 0 O | fi fl', 10, 30);
  doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-font-embedding-1.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);

  // Verify font is embedded by checking PDF content
  const pdfContent = fs.readFileSync(filename, 'utf8');
  if (pdfContent.includes('AtkinsonHyperlegible')) {
    console.log('✓ Font name found in PDF');
  } else {
    console.log('✗ Font name NOT found in PDF');
  }

  if (pdfContent.includes('/FontFile2')) {
    console.log('✓ FontFile2 present (TrueType font embedded)');
  } else {
    console.log('✗ FontFile2 NOT present');
  }

} catch (error) {
  console.log('✗ Failed:', error.message);
}

// Test 2: Verify standard fonts NOT used in PDF/UA mode
console.log('\n[Test 2] Verify no standard fonts (Helvetica, Times, etc.)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('No Standard Fonts Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
  doc.beginStructureElement('P');
  doc.text('This should use Atkinson Hyperlegible, not Helvetica.', 10, 10);
  doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-font-embedding-2.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);

  const pdfContent = fs.readFileSync(filename, 'utf8');

  // Check that standard fonts are NOT used
  const standardFonts = ['Helvetica', 'Times-Roman', 'Courier'];
  let hasStandardFont = false;
  for (const font of standardFonts) {
    if (pdfContent.includes('/' + font)) {
      console.log('✗ Standard font found:', font);
      hasStandardFont = true;
    }
  }

  if (!hasStandardFont) {
    console.log('✓ No standard fonts used');
  }

} catch (error) {
  console.log('✗ Failed:', error.message);
}

// Test 3: Complex document with multiple elements
console.log('\n[Test 3] Complex document with headings and paragraphs');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Complex Font Embedding Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');

  doc.beginStructureElement('H1');
  doc.setFontSize(24);
  doc.text('Accessibility with Atkinson Hyperlegible', 10, 20);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.beginStructureElement('P');
  doc.text('This font was designed by the Braille Institute specifically', 10, 35);
  doc.text('for enhanced readability by readers with low vision.', 10, 42);
  doc.endStructureElement();

  doc.beginStructureElement('H2');
  doc.setFontSize(16);
  doc.text('Key Features', 10, 57);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.beginStructureElement('P');
  doc.text('• Greater differentiation between similar characters', 10, 70);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('• Large counters (open spaces in letters)', 10, 77);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('• Optimized for magnification', 10, 84);
  doc.endStructureElement();

  doc.beginStructureElement('H2');
  doc.setFontSize(16);
  doc.text('Character Distinction Test', 10, 99);
  doc.endStructureElement();

  doc.setFontSize(14);
  doc.beginStructureElement('P');
  doc.text('Capital I vs lowercase l vs number 1: I l 1', 10, 112);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('Number 0 vs capital O: 0 O', 10, 121);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('All characters: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10, 130);
  doc.endStructureElement();

  doc.endStructureElement();

  const filename = 'examples/temp/test-font-embedding-3.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);

  const pdfContent = fs.readFileSync(filename, 'utf8');
  if (pdfContent.includes('AtkinsonHyperlegible') && pdfContent.includes('/FontFile2')) {
    console.log('✓ Font properly embedded in complex document');
  }

} catch (error) {
  console.log('✗ Failed:', error.message);
}

// Test 4: Verify font NOT loaded in regular (non-PDF/UA) mode
console.log('\n[Test 4] Regular PDF without PDF/UA (should use standard fonts)');
try {
  const doc = new jsPDF(); // NO pdfUA option

  doc.text('Regular PDF with standard fonts', 10, 10);

  const filename = 'examples/temp/test-font-embedding-4-regular.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);

  const pdfContent = fs.readFileSync(filename, 'utf8');

  if (pdfContent.includes('AtkinsonHyperlegible')) {
    console.log('✗ Atkinson Hyperlegible loaded in regular mode (should NOT be)');
  } else {
    console.log('✓ Atkinson Hyperlegible NOT loaded (correct for regular PDF)');
  }

  if (pdfContent.includes('/Helvetica')) {
    console.log('✓ Standard font (Helvetica) used in regular mode');
  }

} catch (error) {
  console.log('✗ Failed:', error.message);
}

// Test 5: German text with PDF/UA
console.log('\n[Test 5] German text with embedded font');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Deutsche Schrifteinbettung');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
  doc.beginStructureElement('H1');
  doc.text('Barrierefreiheit mit Atkinson Hyperlegible', 10, 10);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('Dieser Text nutzt eine eingebettete Schriftart für', 10, 20);
  doc.text('bessere Zugänglichkeit und Lesbarkeit.', 10, 27);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('Umlaute: ä ö ü Ä Ö Ü ß', 10, 37);
  doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-font-embedding-5-german.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);

  const pdfContent = fs.readFileSync(filename, 'utf8');
  if (pdfContent.includes('AtkinsonHyperlegible') && pdfContent.includes('de-DE')) {
    console.log('✓ German language + embedded font working');
  }

} catch (error) {
  console.log('✗ Failed:', error.message);
}

console.log('\n' + '='.repeat(70));
console.log('Test Suite Complete');
console.log('='.repeat(70));
console.log('\nGenerated PDFs:');
console.log('  examples/temp/test-font-embedding-1.pdf - Simple text');
console.log('  examples/temp/test-font-embedding-2.pdf - No standard fonts');
console.log('  examples/temp/test-font-embedding-3.pdf - Complex document');
console.log('  examples/temp/test-font-embedding-4-regular.pdf - Regular PDF (comparison)');
console.log('  examples/temp/test-font-embedding-5-german.pdf - German text');
console.log('\nNext steps:');
console.log('  1. Open PDFs in Acrobat Reader');
console.log('  2. Test with screen reader');
console.log('  3. Check File → Properties → Fonts to verify embedding');
console.log('  4. Run veraPDF validation');
console.log('  5. Test character distinction (I l 1, 0 O)');
console.log('  6. Test magnification (zoom to 400%)');
