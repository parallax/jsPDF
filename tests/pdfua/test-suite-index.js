/**
 * PDF/UA Index Element Test Suite
 * Tests subject/keyword indexes for documents
 *
 * Sprint 23: Index (BITi 02.1.2)
 *
 * Index is a sequence of entries containing identifying text accompanied
 * by reference elements that point out occurrences in the document.
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Index Element Test Suite');
console.log('======================================================================\n');

// Test 1: Simple index
console.log('[Test 1] Simple index');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Simple Index Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    // Heading OUTSIDE of Index (best practice)
    doc.beginStructureElement('H1');
    doc.text('Stichwortverzeichnis', 10, 20);
    doc.endStructureElement();

    doc.beginIndex();
      doc.beginList();
        doc.addIndexEntry('Accessibility', '12, 45, 78', 15, 40);
        doc.addIndexEntry('Barrierefreiheit', '23, 56', 15, 52);
        doc.addIndexEntry('CSS', '34, 67, 89', 15, 64);
        doc.addIndexEntry('Dokument', '5, 18, 92', 15, 76);
        doc.addIndexEntry('Element', '7, 29, 41', 15, 88);
      doc.endList();
    doc.endIndex();
  doc.endStructureElement();

  const filename = 'examples/temp/test-index-1-simple.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Simple alphabetical index');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: Alphabetical sections
console.log('[Test 2] Alphabetical sections (A, B, C...)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Alphabetical Index Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Index', 10, 20);
    doc.endStructureElement();

    doc.beginIndex();
      // Section A
      doc.beginStructureElement('P');
      doc.setFont('AtkinsonHyperlegible', 'bold');
      doc.text('A', 10, 40);
      doc.setFont('AtkinsonHyperlegible', 'normal');
      doc.endStructureElement();

      doc.beginList();
        doc.addIndexEntry('Alternativtext', '15, 23', 15, 52);
        doc.addIndexEntry('Annotation', '45, 67', 15, 64);
        doc.addIndexEntry('Artifact', '78, 92', 15, 76);
      doc.endList();

      // Section B
      doc.beginStructureElement('P');
      doc.setFont('AtkinsonHyperlegible', 'bold');
      doc.text('B', 10, 95);
      doc.setFont('AtkinsonHyperlegible', 'normal');
      doc.endStructureElement();

      doc.beginList();
        doc.addIndexEntry('Barrierefreiheit', '3, 12, 56', 15, 107);
        doc.addIndexEntry('BDC-Operator', '34, 89', 15, 119);
        doc.addIndexEntry('Bookmark', '23, 78', 15, 131);
      doc.endList();

      // Section C
      doc.beginStructureElement('P');
      doc.setFont('AtkinsonHyperlegible', 'bold');
      doc.text('C', 10, 150);
      doc.setFont('AtkinsonHyperlegible', 'normal');
      doc.endStructureElement();

      doc.beginList();
        doc.addIndexEntry('Caption', '45, 67', 15, 162);
        doc.addIndexEntry('Code', '12, 34, 89', 15, 174);
      doc.endList();
    doc.endIndex();
  doc.endStructureElement();

  const filename = 'examples/temp/test-index-2-alphabetical.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Index with A, B, C section headers');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 3: Index with sub-entries (nested)
console.log('[Test 3] Index with sub-entries');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Nested Index Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Sachregister', 10, 20);
    doc.endStructureElement();

    doc.beginIndex();
      doc.beginList();
        // Main entry with sub-entries
        doc.beginListItem();
          doc.beginListBody();
            doc.text('Accessibility', 15, 40);

            // Nested list for sub-entries
            doc.beginList();
              doc.beginListItem();
                doc.beginListBody();
                  doc.text('Definition, 5', 25, 52);
                doc.endListBody();
              doc.endStructureElement();

              doc.beginListItem();
                doc.beginListBody();
                  doc.text('Gesetze, 12, 23', 25, 64);
                doc.endListBody();
              doc.endStructureElement();

              doc.beginListItem();
                doc.beginListBody();
                  doc.text('Standards, 34, 45, 67', 25, 76);
                doc.endListBody();
              doc.endStructureElement();
            doc.endList();

          doc.endListBody();
        doc.endStructureElement();

        // Another main entry with sub-entries
        doc.beginListItem();
          doc.beginListBody();
            doc.text('PDF', 15, 95);

            doc.beginList();
              doc.beginListItem();
                doc.beginListBody();
                  doc.text('PDF/A, 78, 89', 25, 107);
                doc.endListBody();
              doc.endStructureElement();

              doc.beginListItem();
                doc.beginListBody();
                  doc.text('PDF/UA, 12, 34, 56, 78', 25, 119);
                doc.endListBody();
              doc.endStructureElement();

              doc.beginListItem();
                doc.beginListBody();
                  doc.text('Tagged PDF, 23, 45', 25, 131);
                doc.endListBody();
              doc.endStructureElement();
            doc.endList();

          doc.endListBody();
        doc.endStructureElement();

        // Simple entry without sub-entries
        doc.addIndexEntry('Screenreader', '15, 67, 92', 15, 150);

      doc.endList();
    doc.endIndex();
  doc.endStructureElement();

  const filename = 'examples/temp/test-index-3-nested.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Index with nested sub-entries');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 4: Technical manual index
console.log('[Test 4] Technical manual index');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Technical Index Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Index', 10, 20);
    doc.endStructureElement();

    doc.beginIndex({ lang: 'en-US' });
      doc.beginList();
        doc.addIndexEntry('API reference', '45-67', 15, 40);
        doc.addIndexEntry('beginStructureElement()', '23', 15, 52);
        doc.addIndexEntry('BDC operator', '34, 56', 15, 64);
        doc.addIndexEntry('configuration', '12-15', 15, 76);
        doc.addIndexEntry('endStructureElement()', '24', 15, 88);
        doc.addIndexEntry('error handling', '78-82', 15, 100);
        doc.addIndexEntry('font embedding', '89-95', 15, 112);
        doc.addIndexEntry('getLanguage()', '67', 15, 124);
        doc.addIndexEntry('installation', '5-8', 15, 136);
        doc.addIndexEntry('jsPDF constructor', '9-11', 15, 148);
      doc.endList();
    doc.endIndex();
  doc.endStructureElement();

  const filename = 'examples/temp/test-index-4-technical.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Technical manual index with page ranges');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 5: Book-style index (German)
console.log('[Test 5] Book-style index (German)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Buchindex');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Stichwortverzeichnis', 10, 20);
    doc.endStructureElement();

    doc.beginIndex();
      // Using paragraph style for compact index
      doc.beginStructureElement('P');
      doc.text('Abkürzung 22; Alt-Text 15, 45, 78; Annotation 34; Artifact 56, 89;', 10, 40);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Barrierefreiheit 3, 12, 23, 56, 78; BDC 34, 67; Bildunterschrift 45;', 10, 52);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Caption 45, 67; Code 12, 89; CSS 34;', 10, 64);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Dokument 5, 18, 92; DPI 23;', 10, 76);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Element 7, 29, 41; EMC 34, 67; Expansion 22;', 10, 88);
      doc.endStructureElement();
    doc.endIndex();
  doc.endStructureElement();

  const filename = 'examples/temp/test-index-5-book.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Book-style compact index');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 6: Multi-column index (simulated)
console.log('[Test 6] Multi-page document structure');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Complete Document with Index');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    // Page 1: Content
    doc.beginStructureElement('H1');
    doc.text('Kapitel 1: Einführung', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Dies ist der Inhalt von Kapitel 1.', 10, 35);
    doc.endStructureElement();

    doc.beginStructureElement('H1');
    doc.text('Kapitel 2: Methoden', 10, 55);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Dies ist der Inhalt von Kapitel 2.', 10, 70);
    doc.endStructureElement();

    // Page 2: Index
    doc.addPage();

    doc.beginStructureElement('H1');
    doc.text('Stichwortverzeichnis', 10, 20);
    doc.endStructureElement();

    doc.beginIndex();
      doc.beginList();
        doc.addIndexEntry('Einführung', '1', 15, 40);
        doc.addIndexEntry('Kapitel', '1, 2', 15, 52);
        doc.addIndexEntry('Methoden', '2', 15, 64);
      doc.endList();
    doc.endIndex();
  doc.endStructureElement();

  const filename = 'examples/temp/test-index-6-multipage.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Multi-page document with index on page 2');
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
console.log('  - test-index-1-simple.pdf');
console.log('  - test-index-2-alphabetical.pdf');
console.log('  - test-index-3-nested.pdf');
console.log('  - test-index-4-technical.pdf');
console.log('  - test-index-5-book.pdf');
console.log('  - test-index-6-multipage.pdf');
console.log('');
console.log('Screenreader Testing:');
console.log('  - Index should be announced as index/register');
console.log('  - Each entry with its page references should be readable');
console.log('  - Nested entries should maintain hierarchy');
console.log('');
console.log('PDF Structure:');
console.log('  - Index is a grouping structure element');
console.log('  - Typically contains L (list) elements');
console.log('  - Heading should be OUTSIDE Index element (best practice)');
console.log('  - Avoid H1-H6 inside Index');
console.log('');
console.log('veraPDF Validation:');
console.log('  docker run --rm -v $(pwd)/examples/temp:/data verapdf/verapdf:latest --flavour ua1 /data/test-index-1-simple.pdf');
console.log('======================================================================');
