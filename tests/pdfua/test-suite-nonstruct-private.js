/**
 * PDF/UA NonStruct and Private Element Test Suite
 * Tests for layout containers without semantic meaning
 *
 * Sprint 24: NonStruct/Private (BITi 02.1.2)
 *
 * NonStruct: Content IS accessible to screen readers (grouping only)
 * Private: Content is IGNORED by assistive technology
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA NonStruct and Private Element Test Suite');
console.log('======================================================================\n');

// Test 1: NonStruct basic usage
console.log('[Test 1] NonStruct basic usage');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('NonStruct Basic Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('NonStruct Demonstration', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Der folgende Inhalt ist in einem NonStruct-Element gruppiert.', 10, 35);
    doc.endStructureElement();

    // NonStruct grouping - content IS accessible
    doc.beginNonStruct();
      doc.beginStructureElement('P');
      doc.text('Dieser Text ist in NonStruct und wird vorgelesen.', 10, 55);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Auch dieser Text ist zugänglich.', 10, 70);
      doc.endStructureElement();
    doc.endNonStruct();

    doc.beginStructureElement('P');
    doc.text('Ende des Dokuments.', 10, 90);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-nonstruct-1-basic.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  NonStruct grouping - content should be readable');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: NonStruct for layout columns
console.log('[Test 2] NonStruct for layout columns');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('NonStruct Layout Columns');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Zweispaltiges Layout', 10, 20);
    doc.endStructureElement();

    // Column 1
    doc.beginNonStruct();
      doc.beginStructureElement('P');
      doc.text('Linke Spalte:', 10, 40);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Inhalt der ersten Spalte.', 10, 55);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Weitere Informationen.', 10, 70);
      doc.endStructureElement();
    doc.endNonStruct();

    // Column 2
    doc.beginNonStruct();
      doc.beginStructureElement('P');
      doc.text('Rechte Spalte:', 110, 40);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Inhalt der zweiten Spalte.', 110, 55);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Zusätzliche Details.', 110, 70);
      doc.endStructureElement();
    doc.endNonStruct();
  doc.endStructureElement();

  const filename = 'examples/temp/test-nonstruct-2-columns.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Two-column layout with NonStruct grouping');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 3: Private basic usage
console.log('[Test 3] Private basic usage');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Private Element Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Private Element Test', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Dieser Text ist normal zugänglich.', 10, 40);
    doc.endStructureElement();

    // Private content - should be IGNORED by screen readers
    // Note: Private uses Artifact mechanism internally, no structure elements inside
    doc.beginPrivate();
    doc.text('INTERN: Dieser Text sollte ignoriert werden.', 10, 60);
    doc.text('Bearbeitungsnotiz: Geprüft am 15.01.2024', 10, 75);
    doc.endPrivate();

    doc.beginStructureElement('P');
    doc.text('Dieser Text ist wieder zugänglich.', 10, 95);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-private-1-basic.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Private content should be IGNORED by screen readers');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 4: NonStruct vs Private comparison
console.log('[Test 4] NonStruct vs Private comparison');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('NonStruct vs Private Comparison');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Vergleich: NonStruct vs Private', 10, 20);
    doc.endStructureElement();

    // NonStruct section
    doc.beginStructureElement('H2');
    doc.text('NonStruct (wird vorgelesen)', 10, 40);
    doc.endStructureElement();

    doc.beginNonStruct();
      doc.beginStructureElement('P');
      doc.text('Dieser Text ist in NonStruct.', 10, 55);
      doc.endStructureElement();
      doc.beginStructureElement('P');
      doc.text('Er sollte vom Screenreader gelesen werden.', 10, 70);
      doc.endStructureElement();
    doc.endNonStruct();

    // Private section
    doc.beginStructureElement('H2');
    doc.text('Private (wird ignoriert)', 10, 95);
    doc.endStructureElement();

    // Note: Private uses Artifact mechanism, no structure elements inside
    doc.beginPrivate();
    doc.text('Dieser Text ist in Private.', 10, 110);
    doc.text('Er sollte vom Screenreader IGNORIERT werden.', 10, 125);
    doc.endPrivate();

    // Normal section
    doc.beginStructureElement('H2');
    doc.text('Normaler Inhalt', 10, 150);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Dieser Text ist normal strukturiert.', 10, 165);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-nonstruct-private-comparison.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Direct comparison: NonStruct (accessible) vs Private (ignored)');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 5: Nested NonStruct
console.log('[Test 5] Nested NonStruct elements');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Nested NonStruct Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Verschachtelte NonStruct-Elemente', 10, 20);
    doc.endStructureElement();

    doc.beginNonStruct();
      doc.beginStructureElement('P');
      doc.text('Äußerer NonStruct - Ebene 1', 10, 40);
      doc.endStructureElement();

      doc.beginNonStruct();
        doc.beginStructureElement('P');
        doc.text('Innerer NonStruct - Ebene 2', 20, 55);
        doc.endStructureElement();

        doc.beginNonStruct();
          doc.beginStructureElement('P');
          doc.text('Tiefster NonStruct - Ebene 3', 30, 70);
          doc.endStructureElement();
        doc.endNonStruct();

      doc.endNonStruct();

      doc.beginStructureElement('P');
      doc.text('Zurück zu Ebene 1', 10, 90);
      doc.endStructureElement();
    doc.endNonStruct();
  doc.endStructureElement();

  const filename = 'examples/temp/test-nonstruct-3-nested.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Nested NonStruct elements at multiple levels');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 6: Private for internal notes
console.log('[Test 6] Private for internal document notes');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Document with Internal Notes');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Vertrag Nr. 12345', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Zwischen Partei A und Partei B wird folgendes vereinbart:', 10, 40);
    doc.endStructureElement();

    // Internal note (should not be read to end users)
    // Note: Private uses Artifact mechanism internally
    doc.beginPrivate();
    doc.setTextColor(128, 128, 128);
    doc.text('[INTERN: Rechtlich geprüft von Dr. Müller, 10.01.2024]', 10, 55);
    doc.setTextColor(0, 0, 0);
    doc.endPrivate();

    doc.beginStructureElement('P');
    doc.text('§1 Gegenstand des Vertrags', 10, 75);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 10, 90);
    doc.endStructureElement();

    // Another internal note
    doc.beginPrivate();
    doc.setTextColor(128, 128, 128);
    doc.text('[TODO: §2 noch überarbeiten]', 10, 105);
    doc.setTextColor(0, 0, 0);
    doc.endPrivate();

    doc.beginStructureElement('P');
    doc.text('§2 Laufzeit', 10, 125);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Der Vertrag tritt am 01.02.2024 in Kraft.', 10, 140);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-private-2-notes.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Contract with internal notes (should be hidden from screen readers)');
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
console.log('  - test-nonstruct-1-basic.pdf');
console.log('  - test-nonstruct-2-columns.pdf');
console.log('  - test-private-1-basic.pdf');
console.log('  - test-nonstruct-private-comparison.pdf');
console.log('  - test-nonstruct-3-nested.pdf');
console.log('  - test-private-2-notes.pdf');
console.log('');
console.log('Screenreader Testing:');
console.log('  NonStruct:');
console.log('    - Content SHOULD be read by screen reader');
console.log('    - Grouping has no semantic meaning');
console.log('    - Used for layout purposes');
console.log('');
console.log('  Private:');
console.log('    - Content should be IGNORED by screen reader');
console.log('    - Used for internal/processing content');
console.log('    - Different from Artifact (which is decorative)');
console.log('');
console.log('PDF Structure:');
console.log('  - NonStruct: /S /NonStruct - grouping without semantics');
console.log('  - Private: /S /Private - content for application use only');
console.log('');
console.log('veraPDF Validation:');
console.log('  docker run --rm -v $(pwd)/examples/temp:/data verapdf/verapdf:latest --flavour ua1 /data/test-nonstruct-1-basic.pdf');
console.log('======================================================================');
