/**
 * PDF/UA Strong and Em (Emphasis) Test Suite
 * Tests semantic text highlights for screen reader accessibility
 *
 * Sprint 13: Semantische Hervorhebungen
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Strong and Em (Emphasis) Test Suite');
console.log('======================================================================\n');

// Test 1: Basic Strong element
console.log('[Test 1] Basic Strong element');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Strong Element Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Strong Element Test', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('This is a ', 10, 40);

    // Strong text - semantically important
    doc.beginStrong();
    doc.setFont("AtkinsonHyperlegible", "bold");
    const strongText = 'very important';
    doc.text(strongText, 10 + doc.getTextWidth('This is a '), 40);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStrong();

    doc.text(' message.', 10 + doc.getTextWidth('This is a ' + strongText), 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Please ', 10, 55);

    doc.beginStrong();
    doc.setFont("AtkinsonHyperlegible", "bold");
    const warningText = 'do not ignore';
    doc.text(warningText, 10 + doc.getTextWidth('Please '), 55);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStrong();

    doc.text(' this warning.', 10 + doc.getTextWidth('Please ' + warningText), 55);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-strong-em-1-strong-basic.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Strong elements in two paragraphs');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: Basic Em (Emphasis) element
console.log('[Test 2] Basic Em (Emphasis) element');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Emphasis Element Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Emphasis (Em) Element Test', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('The word ', 10, 40);

    // Em text - semantic emphasis
    doc.beginEmphasis();
    doc.setFont("AtkinsonHyperlegible", "italic");
    const emText = 'accessibility';
    doc.text(emText, 10 + doc.getTextWidth('The word '), 40);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endEmphasis();

    doc.text(' is important.', 10 + doc.getTextWidth('The word ' + emText), 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('This feature is ', 10, 55);

    doc.beginEmphasis();
    doc.setFont("AtkinsonHyperlegible", "italic");
    const emText2 = 'essential';
    doc.text(emText2, 10 + doc.getTextWidth('This feature is '), 55);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endEmphasis();

    doc.text(' for users.', 10 + doc.getTextWidth('This feature is ' + emText2), 55);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-strong-em-2-em-basic.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Em elements in two paragraphs');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 3: Strong and Em combined in one paragraph
console.log('[Test 3] Strong and Em combined');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Combined Strong and Em Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Combined Strong and Em', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    const y = 40;

    doc.text('This text has ', x, y);
    x += doc.getTextWidth('This text has ');

    // Strong
    doc.beginStrong();
    doc.setFont("AtkinsonHyperlegible", "bold");
    doc.text('strong', x, y);
    x += doc.getTextWidth('strong');
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStrong();

    doc.text(' and ', x, y);
    x += doc.getTextWidth(' and ');

    // Em
    doc.beginEmphasis();
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('emphasized', x, y);
    x += doc.getTextWidth('emphasized');
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endEmphasis();

    doc.text(' parts.', x, y);
    doc.endStructureElement();

    // Second paragraph with both
    doc.beginStructureElement('P');
    x = 10;
    const y2 = 55;

    doc.text('Users ', x, y2);
    x += doc.getTextWidth('Users ');

    doc.beginStrong();
    doc.setFont("AtkinsonHyperlegible", "bold");
    doc.text('must', x, y2);
    x += doc.getTextWidth('must');
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStrong();

    doc.text(' understand ', x, y2);
    x += doc.getTextWidth(' understand ');

    doc.beginEmphasis();
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('this concept', x, y2);
    x += doc.getTextWidth('this concept');
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endEmphasis();

    doc.text('.', x, y2);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-strong-em-3-combined.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Strong and Em combined in paragraphs');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 4: Strong/Em in lists
console.log('[Test 4] Strong/Em in lists');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Strong/Em in Lists');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Strong and Em in Lists', 10, 20);
    doc.endStructureElement();

    doc.beginList();
      // Item 1 with Strong
      doc.beginListItem();
        doc.addListLabel('•', 15, 40);
        doc.beginListBody();
          doc.text('Remember to ', 20, 40);
          doc.beginStrong();
          doc.setFont("AtkinsonHyperlegible", "bold");
          doc.text('save your work', 20 + doc.getTextWidth('Remember to '), 40);
          doc.setFont("AtkinsonHyperlegible", "normal");
          doc.endStrong();
        doc.endListBody();
      doc.endStructureElement();

      // Item 2 with Em
      doc.beginListItem();
        doc.addListLabel('•', 15, 52);
        doc.beginListBody();
          doc.text('Check the ', 20, 52);
          doc.beginEmphasis();
          doc.setFont("AtkinsonHyperlegible", "italic");
          doc.text('documentation', 20 + doc.getTextWidth('Check the '), 52);
          doc.setFont("AtkinsonHyperlegible", "normal");
          doc.endEmphasis();
          doc.text(' first', 20 + doc.getTextWidth('Check the documentation'), 52);
        doc.endListBody();
      doc.endStructureElement();

      // Item 3 with both
      doc.beginListItem();
        doc.addListLabel('•', 15, 64);
        doc.beginListBody();
          let x = 20;
          doc.text('This is ', x, 64);
          x += doc.getTextWidth('This is ');

          doc.beginStrong();
          doc.setFont("AtkinsonHyperlegible", "bold");
          doc.text('critical', x, 64);
          x += doc.getTextWidth('critical');
          doc.setFont("AtkinsonHyperlegible", "normal");
          doc.endStrong();

          doc.text(' and ', x, 64);
          x += doc.getTextWidth(' and ');

          doc.beginEmphasis();
          doc.setFont("AtkinsonHyperlegible", "italic");
          doc.text('urgent', x, 64);
          doc.setFont("AtkinsonHyperlegible", "normal");
          doc.endEmphasis();
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement();

  const filename = 'examples/temp/test-strong-em-4-in-lists.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Strong and Em in list items');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 5: German language with Strong/Em
console.log('[Test 5] German language with Strong/Em');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Strong/Em auf Deutsch');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Semantische Hervorhebungen', 10, 20);
    doc.endStructureElement();

    // Paragraph with Strong
    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Dies ist ein ', x, 40);
    x += doc.getTextWidth('Dies ist ein ');

    doc.beginStrong();
    doc.setFont("AtkinsonHyperlegible", "bold");
    doc.text('äußerst wichtiger', x, 40);
    x += doc.getTextWidth('äußerst wichtiger');
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStrong();

    doc.text(' Hinweis.', x, 40);
    doc.endStructureElement();

    // Paragraph with Em
    doc.beginStructureElement('P');
    x = 10;
    doc.text('Der Begriff ', x, 55);
    x += doc.getTextWidth('Der Begriff ');

    doc.beginEmphasis();
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('Barrierefreiheit', x, 55);
    x += doc.getTextWidth('Barrierefreiheit');
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endEmphasis();

    doc.text(' ist zentral.', x, 55);
    doc.endStructureElement();

    // Paragraph with umlauts in both
    doc.beginStructureElement('P');
    x = 10;
    doc.text('Größe und ', x, 70);
    x += doc.getTextWidth('Größe und ');

    doc.beginStrong();
    doc.setFont("AtkinsonHyperlegible", "bold");
    doc.text('Qualität', x, 70);
    x += doc.getTextWidth('Qualität');
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStrong();

    doc.text(' der ', x, 70);
    x += doc.getTextWidth(' der ');

    doc.beginEmphasis();
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('Lösung', x, 70);
    x += doc.getTextWidth('Lösung');
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endEmphasis();

    doc.text(' überzeugen.', x, 70);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-strong-em-5-german.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ German text with umlauts in Strong/Em');
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
console.log('  - test-strong-em-1-strong-basic.pdf');
console.log('  - test-strong-em-2-em-basic.pdf');
console.log('  - test-strong-em-3-combined.pdf');
console.log('  - test-strong-em-4-in-lists.pdf');
console.log('  - test-strong-em-5-german.pdf');
console.log('');
console.log('Screenreader Testing:');
console.log('  - Strong text should be announced with emphasis');
console.log('  - Em text should be announced with changed intonation');
console.log('  - The exact behavior depends on the screen reader settings');
console.log('');
console.log('veraPDF Validation:');
console.log('  docker run --rm -v $(pwd)/examples/temp:/data verapdf/verapdf:latest --flavour ua1 /data/test-strong-em-1-strong-basic.pdf');
console.log('======================================================================');
