/**
 * PDF/UA Font Styles Test Suite
 * Tests Bold, Italic, and BoldItalic variants of Atkinson Hyperlegible
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Font Styles Test Suite');
console.log('======================================================================\n');

// Test 1: All font styles
console.log('[Test 1] All font styles');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Font Styles Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Font Styles', 10, 10);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Regular: The quick brown fox jumps over the lazy dog.', 10, 30);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFont("AtkinsonHyperlegible", "bold");
    doc.text('Bold: The quick brown fox jumps over the lazy dog.', 10, 40);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('Italic: The quick brown fox jumps over the lazy dog.', 10, 50);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFont("AtkinsonHyperlegible", "bolditalic");
    doc.text('BoldItalic: The quick brown fox jumps over the lazy dog.', 10, 60);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-fontstyles-1-all.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ All four font styles');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: Mixed styles in paragraph
console.log('[Test 2] Mixed styles in one paragraph');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Mixed Font Styles');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.setFont("AtkinsonHyperlegible", "bold");
    doc.text('Important Notice', 10, 10);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('This text is ', 10, 30);
    doc.setFont("AtkinsonHyperlegible", "bold");
    const boldWidth = doc.getTextWidth('bold');
    doc.text('bold', 10 + doc.getTextWidth('This text is '), 30);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.text(' and this is ', 10 + doc.getTextWidth('This text is bold'), 30);
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('italic', 10 + doc.getTextWidth('This text is bold and this is '), 30);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.text('.', 10 + doc.getTextWidth('This text is bold and this is italic'), 30);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('Note: This is emphasized text.', 10, 50);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('For ', 10, 70);
    doc.setFont("AtkinsonHyperlegible", "bolditalic");
    doc.text('very strong emphasis', 10 + doc.getTextWidth('For '), 70);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.text(', use bold italic.', 10 + doc.getTextWidth('For very strong emphasis'), 70);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-fontstyles-2-mixed.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Mixed styles within paragraphs');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log('');
}

// Test 3: German umlauts in all styles
console.log('[Test 3] German umlauts in all styles');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Deutsche Schriften');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Deutsche Schriftstile', 10, 10);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Regular: Äpfel, Öl, Übung, Größe, ß', 10, 30);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFont("AtkinsonHyperlegible", "bold");
    doc.text('Fett: Äpfel, Öl, Übung, Größe, ß', 10, 40);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('Kursiv: Äpfel, Öl, Übung, Größe, ß', 10, 50);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFont("AtkinsonHyperlegible", "bolditalic");
    doc.text('Fett Kursiv: Äpfel, Öl, Übung, Größe, ß', 10, 60);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-fontstyles-3-german.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ German umlauts in all styles');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log('');
}

// Test 4: Font styles in lists
console.log('[Test 4] Font styles in lists');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Font Styles in Lists');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Task Priorities', 10, 10);
    doc.endStructureElement();

    doc.beginList();
      doc.beginListItem();
        doc.addListLabel('•', 15, 25);
        doc.beginListBody();
          doc.text('Regular priority task', 20, 25);
        doc.endListBody();
      doc.endStructureElement();

      doc.beginListItem();
        doc.addListLabel('•', 15, 35);
        doc.beginListBody();
          doc.setFont("AtkinsonHyperlegible", "bold");
          doc.text('High priority task', 20, 35);
          doc.setFont("AtkinsonHyperlegible", "normal");
        doc.endListBody();
      doc.endStructureElement();

      doc.beginListItem();
        doc.addListLabel('•', 15, 45);
        doc.beginListBody();
          doc.setFont("AtkinsonHyperlegible", "italic");
          doc.text('Optional task', 20, 45);
          doc.setFont("AtkinsonHyperlegible", "normal");
        doc.endListBody();
      doc.endStructureElement();

      doc.beginListItem();
        doc.addListLabel('•', 15, 55);
        doc.beginListBody();
          doc.setFont("AtkinsonHyperlegible", "bolditalic");
          doc.text('Critical task', 20, 55);
          doc.setFont("AtkinsonHyperlegible", "normal");
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement();

  const filename = 'examples/temp/test-fontstyles-4-lists.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Font styles in list items');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log('');
}

// Test 5: Font styles in tables
console.log('[Test 5] Font styles in tables');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Font Styles in Tables');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Product Catalog', 10, 10);
    doc.endStructureElement();

    doc.beginStructureElement('Table');
      doc.beginTableHead();
        doc.beginTableRow();
          doc.beginTableHeaderCell('Column');
          doc.setFont("AtkinsonHyperlegible", "bold");
          doc.text('Product', 20, 25);
          doc.setFont("AtkinsonHyperlegible", "normal");
          doc.endStructureElement();

          doc.beginTableHeaderCell('Column');
          doc.setFont("AtkinsonHyperlegible", "bold");
          doc.text('Status', 80, 25);
          doc.setFont("AtkinsonHyperlegible", "normal");
          doc.endStructureElement();

          doc.beginTableHeaderCell('Column');
          doc.setFont("AtkinsonHyperlegible", "bold");
          doc.text('Price', 120, 25);
          doc.setFont("AtkinsonHyperlegible", "normal");
          doc.endStructureElement();
        doc.endStructureElement();
      doc.endTableHead();

      doc.beginTableBody();
        doc.beginTableRow();
          doc.beginTableDataCell();
          doc.text('Widget A', 20, 35);
          doc.endStructureElement();

          doc.beginTableDataCell();
          doc.setFont("AtkinsonHyperlegible", "italic");
          doc.text('Available', 80, 35);
          doc.setFont("AtkinsonHyperlegible", "normal");
          doc.endStructureElement();

          doc.beginTableDataCell();
          doc.text('$19.99', 120, 35);
          doc.endStructureElement();
        doc.endStructureElement();

        doc.beginTableRow();
          doc.beginTableDataCell();
          doc.text('Widget B', 20, 45);
          doc.endStructureElement();

          doc.beginTableDataCell();
          doc.setFont("AtkinsonHyperlegible", "bolditalic");
          doc.text('Out of Stock', 80, 45);
          doc.setFont("AtkinsonHyperlegible", "normal");
          doc.endStructureElement();

          doc.beginTableDataCell();
          doc.text('$29.99', 120, 45);
          doc.endStructureElement();
        doc.endStructureElement();
      doc.endTableBody();
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-fontstyles-5-tables.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Font styles in table cells');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log('');
}

// Summary
console.log('======================================================================');
console.log('Test Suite Complete');
console.log('======================================================================\n');

console.log('Generated PDFs:');
console.log('  examples/temp/test-fontstyles-1-all.pdf - All four styles');
console.log('  examples/temp/test-fontstyles-2-mixed.pdf - Mixed styles in text');
console.log('  examples/temp/test-fontstyles-3-german.pdf - German umlauts');
console.log('  examples/temp/test-fontstyles-4-lists.pdf - Styles in lists');
console.log('  examples/temp/test-fontstyles-5-tables.pdf - Styles in tables\n');

console.log('Next steps:');
console.log('  1. Open PDFs in Acrobat Reader');
console.log('  2. Verify visual appearance:');
console.log('     - Bold text is noticeably heavier');
console.log('     - Italic text is properly slanted');
console.log('     - BoldItalic combines both effects');
console.log('  3. Run veraPDF validation');
console.log('  4. Verify fonts are embedded in PDF\n');

console.log('Expected Results:');
console.log('  - All text should use Atkinson Hyperlegible font family');
console.log('  - Font styles should be clearly distinguishable');
console.log('  - German umlauts should render correctly in all styles');
console.log('  - Screen readers should read all text normally\n');
