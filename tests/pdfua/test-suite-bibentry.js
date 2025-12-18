/**
 * PDF/UA BibEntry Element Test Suite
 * Tests bibliography entries for academic/scientific documents
 *
 * Sprint 23: BibEntry (BITi 02.3.4)
 *
 * BibEntry is a reference identifying the external source of cited content.
 * It may contain a label (Lbl) as a child element.
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA BibEntry Element Test Suite');
console.log('======================================================================\n');

// Test 1: Simple bibliography list
console.log('[Test 1] Simple bibliography list');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Simple Bibliography Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Literaturverzeichnis', 10, 20);
    doc.endStructureElement();

    // Bibliography as a list
    doc.beginList();
      // Entry 1
      doc.beginListItem();
        doc.beginListBody();
          doc.beginBibEntry();
          doc.text('Müller, A. (2023). Barrierefreie PDF-Dokumente. Springer Verlag.', 15, 40);
          doc.endBibEntry();
        doc.endListBody();
      doc.endStructureElement();

      // Entry 2
      doc.beginListItem();
        doc.beginListBody();
          doc.beginBibEntry();
          doc.text('Schmidt, B. (2022). PDF/UA in der Praxis. Hanser Verlag.', 15, 55);
          doc.endBibEntry();
        doc.endListBody();
      doc.endStructureElement();

      // Entry 3
      doc.beginListItem();
        doc.beginListBody();
          doc.beginBibEntry();
          doc.text('Weber, C. (2021). Digitale Barrierefreiheit. O\'Reilly.', 15, 70);
          doc.endBibEntry();
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement();

  const filename = 'examples/temp/test-bibentry-1-simple.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Simple bibliography list with 3 entries');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: Numbered bibliography with labels
console.log('[Test 2] Numbered bibliography with labels');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Numbered Bibliography Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Quellenverzeichnis', 10, 20);
    doc.endStructureElement();

    // Numbered list for references
    doc.beginListNumbered();
      // Entry [1]
      doc.beginListItem();
        doc.addListLabel('[1]', 10, 40);
        doc.beginListBody();
          doc.beginBibEntry();
          doc.text('ISO 14289-1:2014. Document management applications.', 25, 40);
          doc.endBibEntry();
        doc.endListBody();
      doc.endStructureElement();

      // Entry [2]
      doc.beginListItem();
        doc.addListLabel('[2]', 10, 55);
        doc.beginListBody();
          doc.beginBibEntry();
          doc.text('W3C WCAG 2.1. Web Content Accessibility Guidelines.', 25, 55);
          doc.endBibEntry();
        doc.endListBody();
      doc.endStructureElement();

      // Entry [3]
      doc.beginListItem();
        doc.addListLabel('[3]', 10, 70);
        doc.beginListBody();
          doc.beginBibEntry();
          doc.text('PDF Association. Tagged PDF Best Practice Guide.', 25, 70);
          doc.endBibEntry();
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement();

  const filename = 'examples/temp/test-bibentry-2-numbered.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Numbered bibliography [1], [2], [3]');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 3: Academic paper style (APA)
console.log('[Test 3] Academic paper style (APA format)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('APA Bibliography Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('References', 10, 20);
    doc.endStructureElement();

    doc.beginList();
      // Journal article
      doc.beginListItem();
        doc.beginListBody();
          doc.beginBibEntry({ lang: 'en-US' });
          doc.text('Johnson, M., & Williams, K. (2023). Accessibility in digital', 15, 40);
          doc.text('documents: A comprehensive review. Journal of Accessibility,', 20, 48);
          doc.text('15(2), 123-145. https://doi.org/10.1234/ja.2023.001', 20, 56);
          doc.endBibEntry();
        doc.endListBody();
      doc.endStructureElement();

      // Book
      doc.beginListItem();
        doc.beginListBody();
          doc.beginBibEntry({ lang: 'en-US' });
          doc.text('Smith, A. B. (2022). Universal design for documents (2nd ed.).', 15, 75);
          doc.text('Academic Press.', 20, 83);
          doc.endBibEntry();
        doc.endListBody();
      doc.endStructureElement();

      // Conference paper
      doc.beginListItem();
        doc.beginListBody();
          doc.beginBibEntry({ lang: 'en-US' });
          doc.text('Davis, R., & Lee, S. (2021). PDF/UA implementation challenges.', 15, 100);
          doc.text('In Proceedings of the International Conference on Accessible', 20, 108);
          doc.text('Documents (pp. 45-52). ACM.', 20, 116);
          doc.endBibEntry();
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement();

  const filename = 'examples/temp/test-bibentry-3-apa.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  APA style: journal, book, conference paper');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 4: Mixed language bibliography
console.log('[Test 4] Mixed language bibliography');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Mixed Language Bibliography');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Literatur', 10, 20);
    doc.endStructureElement();

    doc.beginList();
      // German entry
      doc.beginListItem();
        doc.beginListBody();
          doc.beginBibEntry({ lang: 'de-DE' });
          doc.text('Hoffmann, P. (2023). Barrierefreiheit im Web. dpunkt.verlag.', 15, 40);
          doc.endBibEntry();
        doc.endListBody();
      doc.endStructureElement();

      // English entry
      doc.beginListItem();
        doc.beginListBody();
          doc.beginBibEntry({ lang: 'en-US' });
          doc.text('Clark, J. (2019). Building Accessible Websites. New Riders.', 15, 55);
          doc.endBibEntry();
        doc.endListBody();
      doc.endStructureElement();

      // French entry
      doc.beginListItem();
        doc.beginListBody();
          doc.beginBibEntry({ lang: 'fr-FR' });
          doc.text('Dupont, M. (2020). L\'accessibilité numérique. Eyrolles.', 15, 70);
          doc.endBibEntry();
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement();

  const filename = 'examples/temp/test-bibentry-4-mixed-lang.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Mixed languages: German, English, French');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 5: BibEntry in running text (inline citation)
console.log('[Test 5] BibEntry as inline citation');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Inline Citation Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Einleitung', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Wie bereits in der Literatur beschrieben ', 10, 40);
    doc.beginBibEntry();
    doc.text('(Müller, 2023)', 10 + doc.getTextWidth('Wie bereits in der Literatur beschrieben '), 40);
    doc.endBibEntry();
    doc.text(',', 10 + doc.getTextWidth('Wie bereits in der Literatur beschrieben (Müller, 2023)'), 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('ist die Barrierefreiheit von PDF-Dokumenten ein wichtiges Thema.', 10, 55);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Weitere Informationen finden sich bei ', x, 75);
    x += doc.getTextWidth('Weitere Informationen finden sich bei ');
    doc.beginBibEntry();
    doc.text('Schmidt (2022)', x, 75);
    doc.endBibEntry();
    x += doc.getTextWidth('Schmidt (2022)');
    doc.text(' und ', x, 75);
    x += doc.getTextWidth(' und ');
    doc.beginBibEntry();
    doc.text('Weber (2021)', x, 75);
    doc.endBibEntry();
    doc.text('.', x + doc.getTextWidth('Weber (2021)'), 75);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-bibentry-5-inline.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Inline citations in running text');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 6: Complete academic document
console.log('[Test 6] Complete academic document with citations');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Wissenschaftlicher Artikel');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    // Title
    doc.beginStructureElement('H1');
    doc.text('Barrierefreiheit in PDF-Dokumenten', 10, 20);
    doc.endStructureElement();

    // Abstract
    doc.beginStructureElement('H2');
    doc.text('Zusammenfassung', 10, 35);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Diese Arbeit untersucht die Implementierung von PDF/UA.', 10, 50);
    doc.endStructureElement();

    // Main section
    doc.beginStructureElement('H2');
    doc.text('1. Einleitung', 10, 70);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Der PDF/UA-Standard ', x, 85);
    x += doc.getTextWidth('Der PDF/UA-Standard ');
    doc.beginBibEntry();
    doc.text('[1]', x, 85);
    doc.endBibEntry();
    x += doc.getTextWidth('[1]');
    doc.text(' definiert Anforderungen für barrierefreie', x, 85);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('PDF-Dokumente. Die WCAG-Richtlinien [2] ergänzen diese Vorgaben.', 10, 95);
    doc.endStructureElement();

    // References section
    doc.beginStructureElement('H2');
    doc.text('Literaturverzeichnis', 10, 120);
    doc.endStructureElement();

    doc.beginListNumbered();
      doc.beginListItem();
        doc.addListLabel('[1]', 10, 135);
        doc.beginListBody();
          doc.beginBibEntry();
          doc.text('ISO 14289-1:2014. PDF/UA-1 Standard.', 25, 135);
          doc.endBibEntry();
        doc.endListBody();
      doc.endStructureElement();

      doc.beginListItem();
        doc.addListLabel('[2]', 10, 150);
        doc.beginListBody();
          doc.beginBibEntry();
          doc.text('W3C. WCAG 2.1 Guidelines.', 25, 150);
          doc.endBibEntry();
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement();

  const filename = 'examples/temp/test-bibentry-6-academic.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Complete academic document with [1], [2] citations');
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
console.log('  - test-bibentry-1-simple.pdf');
console.log('  - test-bibentry-2-numbered.pdf');
console.log('  - test-bibentry-3-apa.pdf');
console.log('  - test-bibentry-4-mixed-lang.pdf');
console.log('  - test-bibentry-5-inline.pdf');
console.log('  - test-bibentry-6-academic.pdf');
console.log('');
console.log('Screenreader Testing:');
console.log('  - BibEntry should be announced as bibliography/reference entry');
console.log('  - Labels [1], [2] should be read before the entry content');
console.log('  - Language changes should affect pronunciation');
console.log('');
console.log('PDF Structure:');
console.log('  - BibEntry is an inline-level structure element');
console.log('  - Can contain Lbl (label) as child');
console.log('  - Typically used within L/LI list structure');
console.log('');
console.log('veraPDF Validation:');
console.log('  docker run --rm -v $(pwd)/examples/temp:/data verapdf/verapdf:latest --flavour ua1 /data/test-bibentry-1-simple.pdf');
console.log('======================================================================');
