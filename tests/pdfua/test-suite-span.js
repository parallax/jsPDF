/**
 * PDF/UA Span Element Test Suite
 * Tests generic inline container for formatting and language changes
 *
 * Sprint 14: Span-Element für Inline-Container
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Span Element Test Suite');
console.log('======================================================================\n');

// Test 1: Basic Span element
console.log('[Test 1] Basic Span element');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Basic Span Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Span Element Test', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Text with ', 10, 40);

    // Simple span for grouping
    doc.beginSpan();
    doc.setTextColor(255, 0, 0);
    doc.text('red colored text', 10 + doc.getTextWidth('Text with '), 40);
    doc.setTextColor(0, 0, 0);
    doc.endSpan();

    doc.text(' inside paragraph.', 10 + doc.getTextWidth('Text with red colored text'), 40);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-span-1-basic.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Basic span with color change');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: Span with language change
console.log('[Test 2] Span with language change');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Language Change Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Sprachwechsel Test', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Das Wort ', x, 40);
    x += doc.getTextWidth('Das Wort ');

    // English word in German text
    doc.beginSpan({ lang: 'en-US' });
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('Computer', x, 40);
    x += doc.getTextWidth('Computer');
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endSpan();

    doc.text(' ist ein Anglizismus.', x, 40);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-span-2-language.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Span with lang="en-US" in German document');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 3: Multiple language spans
console.log('[Test 3] Multiple language spans');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Multi-Language Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Mehrsprachiger Text', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Auf Französisch: ', x, 40);
    x += doc.getTextWidth('Auf Französisch: ');

    // French
    doc.beginSpan({ lang: 'fr-FR' });
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('bonjour', x, 40);
    x += doc.getTextWidth('bonjour');
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endSpan();

    doc.text(', auf Spanisch: ', x, 40);
    x += doc.getTextWidth(', auf Spanisch: ');

    // Spanish
    doc.beginSpan({ lang: 'es-ES' });
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('hola', x, 40);
    x += doc.getTextWidth('hola');
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endSpan();

    doc.text(', auf Italienisch: ', x, 40);
    x += doc.getTextWidth(', auf Italienisch: ');

    // Italian
    doc.beginSpan({ lang: 'it-IT' });
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('ciao', x, 40);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endSpan();

    doc.text('.', x + doc.getTextWidth('ciao'), 40);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-span-3-multilang.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Multiple language spans (French, Spanish, Italian)');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 4: Span in lists
console.log('[Test 4] Span in lists');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Span in Lists');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Fremdwörter in Listen', 10, 20);
    doc.endStructureElement();

    doc.beginList();
      // Item 1
      doc.beginListItem();
        doc.addListLabel('•', 15, 40);
        doc.beginListBody();
          doc.text('Begriff: ', 20, 40);
          doc.beginSpan({ lang: 'en-US' });
          doc.text('Accessibility', 20 + doc.getTextWidth('Begriff: '), 40);
          doc.endSpan();
        doc.endListBody();
      doc.endStructureElement();

      // Item 2
      doc.beginListItem();
        doc.addListLabel('•', 15, 52);
        doc.beginListBody();
          doc.text('Begriff: ', 20, 52);
          doc.beginSpan({ lang: 'en-US' });
          doc.text('Screen Reader', 20 + doc.getTextWidth('Begriff: '), 52);
          doc.endSpan();
        doc.endListBody();
      doc.endStructureElement();

      // Item 3
      doc.beginListItem();
        doc.addListLabel('•', 15, 64);
        doc.beginListBody();
          doc.text('Begriff: ', 20, 64);
          doc.beginSpan({ lang: 'la' });
          doc.setFont("AtkinsonHyperlegible", "italic");
          doc.text('Lorem ipsum', 20 + doc.getTextWidth('Begriff: '), 64);
          doc.setFont("AtkinsonHyperlegible", "normal");
          doc.endSpan();
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement();

  const filename = 'examples/temp/test-span-4-in-lists.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Span with language in list items');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 5: Span combined with Strong/Em
console.log('[Test 5] Span combined with Strong/Em');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Span with Strong/Em');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Kombinierte Elemente', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Dies ist ', x, 40);
    x += doc.getTextWidth('Dies ist ');

    // Strong (German)
    doc.beginStrong();
    doc.setFont("AtkinsonHyperlegible", "bold");
    doc.text('wichtig', x, 40);
    x += doc.getTextWidth('wichtig');
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStrong();

    doc.text(' und ', x, 40);
    x += doc.getTextWidth(' und ');

    // Span with English + Em
    doc.beginSpan({ lang: 'en-US' });
    doc.beginEmphasis();
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('very important', x, 40);
    x += doc.getTextWidth('very important');
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endEmphasis();
    doc.endSpan();

    doc.text(' zugleich.', x, 40);
    doc.endStructureElement();

    // Second paragraph
    doc.beginStructureElement('P');
    x = 10;
    doc.text('Der Begriff ', x, 60);
    x += doc.getTextWidth('Der Begriff ');

    // Strong + Span with English
    doc.beginStrong();
    doc.beginSpan({ lang: 'en-US' });
    doc.setFont("AtkinsonHyperlegible", "bold");
    doc.text('Universal Design', x, 60);
    x += doc.getTextWidth('Universal Design');
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endSpan();
    doc.endStrong();

    doc.text(' ist zentral.', x, 60);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-span-5-combined.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Span combined with Strong and Em');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

console.log('======================================================================');
console.log('Test Summary');
console.log('======================================================================');
console.log('All test PDFs generated in examples/temp/');
console.log('');
console.log('Files created:');
console.log('  - test-span-1-basic.pdf');
console.log('  - test-span-2-language.pdf');
console.log('  - test-span-3-multilang.pdf');
console.log('  - test-span-4-in-lists.pdf');
console.log('  - test-span-5-combined.pdf');
console.log('');
console.log('Screenreader Testing:');
console.log('  - Span with lang attribute: Screen reader should change pronunciation');
console.log('  - Span without lang: No audible change (structural only)');
console.log('  - The exact behavior depends on the screen reader and voice settings');
console.log('');
console.log('veraPDF Validation:');
console.log('  docker run --rm -v $(pwd)/examples/temp:/data verapdf/verapdf:latest --flavour ua1 /data/test-span-1-basic.pdf');
console.log('======================================================================');
