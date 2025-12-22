/**
 * PDF/UA Quote and BlockQuote Element Test Suite
 * Tests inline and block-level quotation elements
 *
 * Sprint 15: Quote und BlockQuote für Zitate
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Quote and BlockQuote Element Test Suite');
console.log('======================================================================\n');

// Test 1: Basic inline Quote
console.log('[Test 1] Basic inline Quote');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Basic Quote Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Inline Zitat Test', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Er sagte: ', x, 40);
    x += doc.getTextWidth('Er sagte: ');

    // Inline quote
    doc.beginQuote();
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('"Hallo Welt"', x, 40);
    x += doc.getTextWidth('"Hallo Welt"');
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endQuote();

    doc.text(' und ging weiter.', x, 40);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-quote-1-inline.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Basic inline quote within paragraph');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: Basic BlockQuote
console.log('[Test 2] Basic BlockQuote');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('BlockQuote Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('BlockQuote Test', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Descartes ist bekannt für dieses Zitat:', 10, 40);
    doc.endStructureElement();

    // Block quote
    doc.beginBlockQuote();
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('"Ich denke, also bin ich."', 20, 55);
    doc.text('(Cogito ergo sum)', 20, 65);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endBlockQuote();

    doc.beginStructureElement('P');
    doc.text('Dieser Satz ist ein Grundpfeiler der Philosophie.', 10, 85);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-quote-2-blockquote.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Block-level quote with multi-line content');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 3: Quote with language change
console.log('[Test 3] Quote with language change');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Quote Language Change Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Zitat mit Sprachwechsel', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Shakespeare schrieb: ', x, 40);
    x += doc.getTextWidth('Shakespeare schrieb: ');

    // English quote in German document
    doc.beginQuote({ lang: 'en-GB' });
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('"To be or not to be"', x, 40);
    x += doc.getTextWidth('"To be or not to be"');
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endQuote();

    doc.text('.', x, 40);
    doc.endStructureElement();

    // Second paragraph with French quote
    doc.beginStructureElement('P');
    x = 10;
    doc.text('Auf Deutsch: ', x, 60);
    x += doc.getTextWidth('Auf Deutsch: ');

    doc.beginQuote();
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('"Sein oder Nichtsein"', x, 60);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endQuote();

    doc.text('.', x + doc.getTextWidth('"Sein oder Nichtsein"'), 60);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-quote-3-language.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Quote with lang="en-GB" in German document');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 4: BlockQuote with nested elements
console.log('[Test 4] BlockQuote with nested elements');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('BlockQuote Nested Elements');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('BlockQuote mit Struktur', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Ein langes Zitat mit mehreren Absätzen:', 10, 40);
    doc.endStructureElement();

    // Block quote with multiple paragraphs
    doc.beginBlockQuote();
      doc.beginStructureElement('P');
      doc.setFont("AtkinsonHyperlegible", "italic");
      doc.text('Erster Absatz des Zitats. Dies ist ein längerer', 20, 55);
      doc.text('Text der über mehrere Zeilen geht.', 20, 65);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Zweiter Absatz des Zitats mit ', 20, 80);

      // Emphasis within blockquote
      doc.beginEmphasis();
      doc.setFont("AtkinsonHyperlegible", "bolditalic");
      doc.text('besonderer Betonung', 20 + doc.getTextWidth('Zweiter Absatz des Zitats mit '), 80);
      doc.setFont("AtkinsonHyperlegible", "italic");
      doc.endEmphasis();

      doc.text('.', 20 + doc.getTextWidth('Zweiter Absatz des Zitats mit besonderer Betonung'), 80);
      doc.setFont("AtkinsonHyperlegible", "normal");
      doc.endStructureElement();
    doc.endBlockQuote();

    doc.beginStructureElement('P');
    doc.text('Ende des Zitats.', 10, 100);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-quote-4-nested.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  BlockQuote with P and Em elements inside');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 5: Multiple quotes (German literature)
console.log('[Test 5] Multiple quotes - German literature');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Deutsche Zitate');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Berühmte deutsche Zitate', 10, 20);
    doc.endStructureElement();

    // Goethe quote
    doc.beginStructureElement('H2');
    doc.text('Johann Wolfgang von Goethe', 10, 40);
    doc.endStructureElement();

    doc.beginBlockQuote();
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('"Grau, teurer Freund, ist alle Theorie,', 20, 55);
    doc.text('und grün des Lebens goldner Baum."', 20, 65);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endBlockQuote();

    // Schiller quote
    doc.beginStructureElement('H2');
    doc.text('Friedrich Schiller', 10, 85);
    doc.endStructureElement();

    doc.beginBlockQuote();
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('"Die Weltgeschichte ist das Weltgericht."', 20, 100);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endBlockQuote();

    // Kant quote
    doc.beginStructureElement('H2');
    doc.text('Immanuel Kant', 10, 120);
    doc.endStructureElement();

    doc.beginBlockQuote();
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('"Habe Mut, dich deines eigenen Verstandes', 20, 135);
    doc.text('zu bedienen!"', 20, 145);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endBlockQuote();

  doc.endStructureElement();

  const filename = 'examples/temp/test-quote-5-german.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Multiple BlockQuotes with German literature');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 6: Quote in list items
console.log('[Test 6] Quotes in list items');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Quotes in Lists');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Zitate in Listen', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Wichtige Redewendungen:', 10, 40);
    doc.endStructureElement();

    doc.beginListNumbered();
      // Item 1 with English quote
      doc.beginListItem();
        doc.addListLabel('1.', 15, 55);
        doc.beginListBody();
          doc.text('Englisch: ', 22, 55);
          doc.beginQuote({ lang: 'en-US' });
          doc.setFont("AtkinsonHyperlegible", "italic");
          doc.text('"The early bird catches the worm"', 22 + doc.getTextWidth('Englisch: '), 55);
          doc.setFont("AtkinsonHyperlegible", "normal");
          doc.endQuote();
        doc.endListBody();
      doc.endStructureElement();

      // Item 2 with French quote
      doc.beginListItem();
        doc.addListLabel('2.', 15, 70);
        doc.beginListBody();
          doc.text('Französisch: ', 22, 70);
          doc.beginQuote({ lang: 'fr-FR' });
          doc.setFont("AtkinsonHyperlegible", "italic");
          doc.text('"C\'est la vie"', 22 + doc.getTextWidth('Französisch: '), 70);
          doc.setFont("AtkinsonHyperlegible", "normal");
          doc.endQuote();
        doc.endListBody();
      doc.endStructureElement();

      // Item 3 with Latin quote
      doc.beginListItem();
        doc.addListLabel('3.', 15, 85);
        doc.beginListBody();
          doc.text('Latein: ', 22, 85);
          doc.beginQuote({ lang: 'la' });
          doc.setFont("AtkinsonHyperlegible", "italic");
          doc.text('"Carpe diem"', 22 + doc.getTextWidth('Latein: '), 85);
          doc.setFont("AtkinsonHyperlegible", "normal");
          doc.endQuote();
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement();

  const filename = 'examples/temp/test-quote-6-in-lists.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Quotes with different languages in list items');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

console.log('======================================================================');
console.log('Test Summary');
console.log('======================================================================');
console.log('All test PDFs generated in examples/temp/');
console.log('');
console.log('Files created:');
console.log('  - test-quote-1-inline.pdf');
console.log('  - test-quote-2-blockquote.pdf');
console.log('  - test-quote-3-language.pdf');
console.log('  - test-quote-4-nested.pdf');
console.log('  - test-quote-5-german.pdf');
console.log('  - test-quote-6-in-lists.pdf');
console.log('');
console.log('Screenreader Testing:');
console.log('  - Quote: Screen reader may announce "quote" or use different intonation');
console.log('  - BlockQuote: Screen reader may announce "block quote" on entry/exit');
console.log('  - With lang attribute: Screen reader should change pronunciation');
console.log('');
console.log('veraPDF Validation:');
console.log('  docker run --rm -v $(pwd)/examples/temp:/data verapdf/verapdf:latest --flavour ua1 /data/test-quote-1-inline.pdf');
console.log('======================================================================');
