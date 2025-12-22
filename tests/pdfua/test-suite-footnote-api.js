/**
 * PDF/UA Footnote API Test Suite
 * Tests the new convenience methods: addFootnoteRef() and addFootnote()
 *
 * Sprint 31: Automatic Lbl generation in footnote API
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Footnote API Test Suite (Sprint 31)');
console.log('======================================================================\n');

// Test 1: addFootnoteRef() basic usage
console.log('[Test 1] addFootnoteRef() - Basic usage');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('addFootnoteRef Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Footnote Reference Test', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFontSize(11);
    let x = 10;
    doc.text('This is important text', x, 40);
    x += doc.getTextWidth('This is important text');

    // Use the new convenience method
    doc.addFootnoteRef('¹', x, 40, { noteId: 'fn1' });
    x += 5;

    doc.text(' with a footnote reference.', x, 40);
    doc.endStructureElement();

    // Footnote at bottom
    doc.setFontSize(9);
    doc.addFootnote({
      id: 'fn1',
      label: '¹',
      text: 'This is the footnote explanation.',
      x: 15,
      y: 270
    });
  doc.endStructureElement();

  const filename = 'examples/temp/test-footnote-api-1-basic.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Tests: addFootnoteRef() creates Reference > Lbl structure');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: addFootnote() basic usage
console.log('[Test 2] addFootnote() - Basic usage');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('addFootnote Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Fußnoten-Test', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFontSize(11);
    doc.text('Ein Text mit einer Fußnote¹ hier.', 10, 40);
    doc.endStructureElement();

    // Use the new convenience method
    doc.setFontSize(9);
    doc.addFootnote({
      id: 'fn1',
      label: '¹',
      text: 'Dies ist der Fußnotentext.',
      x: 15,
      y: 270
    });
  doc.endStructureElement();

  const filename = 'examples/temp/test-footnote-api-2-addFootnote.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Tests: addFootnote() creates Note > Lbl > P structure');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 3: Multiple footnotes with both methods
console.log('[Test 3] Multiple footnotes using both methods');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Multiple Footnotes Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Multiple Footnotes', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFontSize(11);

    let x = 10;
    doc.text('First topic', x, 40);
    x += doc.getTextWidth('First topic');
    doc.addFootnoteRef('¹', x, 40, { noteId: 'fn1' });
    x += 5;

    doc.text(' and second topic', x, 40);
    x += doc.getTextWidth(' and second topic');
    doc.addFootnoteRef('²', x, 40, { noteId: 'fn2' });
    x += 5;

    doc.text(' are discussed here.', x, 40);
    doc.endStructureElement();

    // Separator
    doc.beginArtifact({ type: 'Layout' });
    doc.line(10, 250, 80, 250);
    doc.endArtifact();

    // Footnotes
    doc.setFontSize(9);

    doc.addFootnote({
      id: 'fn1',
      label: '¹',
      text: 'Explanation for the first topic.',
      x: 15,
      y: 260
    });

    doc.addFootnote({
      id: 'fn2',
      label: '²',
      text: 'Explanation for the second topic.',
      x: 15,
      y: 270
    });
  doc.endStructureElement();

  const filename = 'examples/temp/test-footnote-api-3-multiple.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Tests: Multiple footnotes with proper structure');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 4: Multiline footnote
console.log('[Test 4] Multiline footnote with addFootnote()');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Multiline Footnote Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Multiline Footnote', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFontSize(11);
    doc.text('A complex topic¹ requires detailed explanation.', 10, 40);
    doc.endStructureElement();

    // Multiline footnote using array
    doc.setFontSize(9);
    doc.addFootnote({
      id: 'fn1',
      label: '¹',
      text: [
        'This is a long footnote that spans multiple lines.',
        'The second line provides additional context.',
        'The third line concludes the explanation.'
      ],
      x: 15,
      y: 250,
      lineHeight: 10
    });
  doc.endStructureElement();

  const filename = 'examples/temp/test-footnote-api-4-multiline.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Tests: Multiline footnote text with array input');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 5: beginReference with automatic Lbl
console.log('[Test 5] beginReference({ label }) with automatic Lbl');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('beginReference Auto-Lbl Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Auto-Lbl in beginReference', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFontSize(11);
    doc.text('Text with auto-Lbl reference', 10, 40);

    // Use beginReference with label option
    doc.beginReference({
      label: '¹',
      labelX: 95,
      labelY: 40,
      noteId: 'fn1'
    });
    // Lbl is automatically created, no additional content needed
    doc.endReference();

    doc.text(' here.', 100, 40);
    doc.endStructureElement();

    doc.setFontSize(9);
    doc.addFootnote({
      id: 'fn1',
      label: '¹',
      text: 'Footnote using auto-Lbl in beginReference.',
      x: 15,
      y: 270
    });
  doc.endStructureElement();

  const filename = 'examples/temp/test-footnote-api-5-auto-lbl-ref.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Tests: beginReference() with automatic Lbl generation');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 6: beginNote with automatic Lbl + P
console.log('[Test 6] beginNote({ label }) with automatic Lbl + P');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('beginNote Auto-Lbl Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Auto-Lbl in beginNote', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFontSize(11);
    doc.text('Text mit Fußnote¹ hier.', 10, 40);
    doc.endStructureElement();

    // Use beginNote with label option - P is automatically opened
    doc.setFontSize(9);
    doc.beginNote({
      id: 'fn1',
      label: '¹',
      labelX: 10,
      labelY: 270
    });
    // P is already open, just add text
    doc.text('Der Fußnotentext wird automatisch in ein P-Element gepackt.', 15, 270);
    doc.endNote(); // Automatically closes P and Note

  doc.endStructureElement();

  const filename = 'examples/temp/test-footnote-api-6-auto-lbl-note.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Tests: beginNote() with automatic Lbl and P element');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 7: Backward compatibility - old API without label
console.log('[Test 7] Backward compatibility - old API without label');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Backward Compatibility Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Backward Compatibility', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFontSize(11);
    doc.text('Old-style footnote reference', 10, 40);

    // Old API - beginReference without label
    doc.beginReference();
    doc.beginStructureElement('Lbl');
    doc.setFontSize(8);
    doc.text('¹', 87, 37);
    doc.setFontSize(11);
    doc.endStructureElement();
    doc.endReference();

    doc.text(' here.', 92, 40);
    doc.endStructureElement();

    // Old API - beginNote without label
    doc.beginNote({ id: 'fn1' });
    doc.beginStructureElement('Lbl');
    doc.setFontSize(8);
    doc.text('¹', 10, 270);
    doc.endStructureElement();
    doc.beginStructureElement('P');
    doc.setFontSize(9);
    doc.text('Manual structure still works.', 15, 270);
    doc.endStructureElement();
    doc.endNote();

  doc.endStructureElement();

  const filename = 'examples/temp/test-footnote-api-7-backward-compat.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Tests: Old API without label parameters still works');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 8: Complete academic example
console.log('[Test 8] Complete academic example');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Academic Paper with Footnotes');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('The Importance of PDF/UA', 10, 20);
    doc.endStructureElement();

    doc.beginSect();
      doc.beginStructureElement('H2');
      doc.setFontSize(14);
      doc.text('Abstract', 10, 35);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');

      let x = 10;
      doc.text('PDF/UA (Universal Accessibility) is an ISO standard', x, 50);
      x += doc.getTextWidth('PDF/UA (Universal Accessibility) is an ISO standard');
      doc.addFootnoteRef('¹', x, 50, { noteId: 'fn1' });

      doc.text('that ensures electronic documents are accessible to people with', 10, 60);
      doc.text('disabilities. The Matterhorn Protocol', 10, 70);
      x = 10 + doc.getTextWidth('disabilities. The Matterhorn Protocol');
      doc.addFootnoteRef('²', x, 70, { noteId: 'fn2' });

      doc.text(' provides a comprehensive', x + 5, 70);
      doc.text('set of test conditions for PDF/UA validation.', 10, 80);
      doc.endStructureElement();
    doc.endSect();

    // Footnotes section
    doc.beginArtifact({ type: 'Layout' });
    doc.line(10, 250, 100, 250);
    doc.endArtifact();

    doc.setFontSize(9);

    doc.addFootnote({
      id: 'fn1',
      label: '¹',
      text: [
        'ISO 14289-1:2014, Document management — Electronic document file',
        'format enhancement for accessibility — Part 1: Use of ISO 32000-1'
      ],
      x: 15,
      y: 258,
      lineHeight: 8
    });

    doc.addFootnote({
      id: 'fn2',
      label: '²',
      text: 'PDF Association. (2014). The Matterhorn Protocol 1.02.',
      x: 15,
      y: 278
    });

  doc.endStructureElement();

  const filename = 'examples/temp/test-footnote-api-8-academic.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Tests: Complete academic document with multiple footnotes');
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
console.log('  - test-footnote-api-1-basic.pdf');
console.log('  - test-footnote-api-2-addFootnote.pdf');
console.log('  - test-footnote-api-3-multiple.pdf');
console.log('  - test-footnote-api-4-multiline.pdf');
console.log('  - test-footnote-api-5-auto-lbl-ref.pdf');
console.log('  - test-footnote-api-6-auto-lbl-note.pdf');
console.log('  - test-footnote-api-7-backward-compat.pdf');
console.log('  - test-footnote-api-8-academic.pdf');
console.log('');
console.log('New API Methods:');
console.log('  doc.addFootnoteRef(label, x, y, options)');
console.log('    - Creates: Reference > Lbl > text');
console.log('');
console.log('  doc.addFootnote(options)');
console.log('    - Creates: Note > [SR-announcement] > Lbl > P > text');
console.log('');
console.log('  doc.beginReference({ label, labelX, labelY, noteId })');
console.log('    - Auto-creates Lbl element if label provided');
console.log('');
console.log('  doc.beginNote({ label, labelX, labelY, id })');
console.log('    - Auto-creates Lbl and opens P if label provided');
console.log('    - endNote() automatically closes P');
console.log('');
console.log('veraPDF Validation:');
console.log('  docker run --rm -v $(pwd)/examples/temp:/data verapdf/cli --flavour ua1 /data/test-footnote-api-1-basic.pdf');
console.log('======================================================================');
