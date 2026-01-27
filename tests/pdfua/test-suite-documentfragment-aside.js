/**
 * PDF/UA DocumentFragment and Aside Element Test Suite
 * Tests for PDF 2.0 structure elements (ISO 32000-2)
 *
 * Sprint 26: DocumentFragment + Aside
 *
 * NOTE: These are PDF 2.0 (ISO 32000-2) elements, part of PDF/UA-2.
 * Older PDF readers may not fully support them, but content remains
 * accessible through graceful fallback.
 *
 * DocumentFragment: Excerpts from other documents
 * Aside: Sidebars, pull quotes, tangentially related content
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA DocumentFragment and Aside Element Test Suite');
console.log('======================================================================\n');

// Test 1: Simple DocumentFragment
console.log('[Test 1] Simple DocumentFragment');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('DocumentFragment Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Dokument mit Auszug', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Im Folgenden ein Auszug aus dem Grundgesetz:', 10, 40);
    doc.endStructureElement();

    // Document excerpt
    doc.beginDocumentFragment({ lang: 'de-DE' });
      doc.beginStructureElement('H2');
      doc.text('Grundgesetz für die Bundesrepublik Deutschland', 10, 60);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.setFont('AtkinsonHyperlegible', 'bold');
      doc.text('Artikel 1', 10, 75);
      doc.setFont('AtkinsonHyperlegible', 'normal');
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('(1) Die Würde des Menschen ist unantastbar.', 10, 90);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('(2) Das Deutsche Volk bekennt sich darum zu unverletzlichen', 10, 105);
      doc.text('und unveräußerlichen Menschenrechten.', 10, 115);
      doc.endStructureElement();
    doc.endDocumentFragment();

    doc.beginStructureElement('P');
    doc.text('Ende des Auszugs. Der Haupttext setzt hier fort.', 10, 140);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-docfragment-1-simple.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Legal document excerpt with DocumentFragment');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: Simple Aside (Sidebar)
console.log('[Test 2] Simple Aside (Sidebar)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Aside Sidebar Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Artikel über Barrierefreiheit', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Barrierefreiheit im Web ist wichtig für alle Nutzer.', 10, 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Besonders Menschen mit Behinderungen profitieren davon.', 10, 55);
    doc.endStructureElement();

    // Sidebar with additional info
    doc.beginAside();
      doc.beginStructureElement('H2');
      doc.setFontSize(12);
      doc.text('Wussten Sie?', 120, 40);
      doc.setFontSize(14);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.setFontSize(10);
      doc.text('Etwa 15% der Weltbevölkerung', 120, 55);
      doc.text('lebt mit einer Behinderung.', 120, 63);
      doc.text('Das sind über 1 Milliarde', 120, 71);
      doc.text('Menschen weltweit.', 120, 79);
      doc.setFontSize(14);
      doc.endStructureElement();
    doc.endAside();

    doc.beginStructureElement('P');
    doc.text('Die WCAG-Richtlinien helfen bei der Umsetzung.', 10, 80);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-aside-1-sidebar.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Article with sidebar using Aside');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 3: Aside as Pull Quote
console.log('[Test 3] Aside as Pull Quote');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Aside Pull Quote Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Interview mit einem Experten', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Wir sprachen mit Dr. Müller über die Zukunft der Technologie.', 10, 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Er betonte die Wichtigkeit von Innovationen für die Gesellschaft.', 10, 55);
    doc.endStructureElement();

    // Pull quote
    doc.beginAside();
      doc.beginBlockQuote();
      doc.setFontSize(16);
      doc.setFont('AtkinsonHyperlegible', 'bolditalic');
      doc.text('"Technologie sollte', 30, 85);
      doc.text('Menschen verbinden,', 30, 100);
      doc.text('nicht trennen."', 30, 115);
      doc.setFont('AtkinsonHyperlegible', 'normal');
      doc.setFontSize(14);
      doc.endBlockQuote();

      doc.beginStructureElement('P');
      doc.setFontSize(10);
      doc.text('— Dr. Hans Müller', 30, 130);
      doc.setFontSize(14);
      doc.endStructureElement();
    doc.endAside();

    doc.beginStructureElement('P');
    doc.text('Diese Aussage unterstreicht seine Vision für die Branche.', 10, 155);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-aside-2-pullquote.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Article with pull quote using Aside + BlockQuote');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 4: DocumentFragment with different language
console.log('[Test 4] DocumentFragment with different language');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Multi-language DocumentFragment');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Internationale Dokumente', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Auszug aus der UN-Menschenrechtserklärung (Englisch):', 10, 40);
    doc.endStructureElement();

    // English excerpt in German document
    doc.beginDocumentFragment({ lang: 'en-US' });
      doc.beginStructureElement('H2');
      doc.text('Universal Declaration of Human Rights', 10, 60);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.setFont('AtkinsonHyperlegible', 'bold');
      doc.text('Article 1', 10, 75);
      doc.setFont('AtkinsonHyperlegible', 'normal');
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('All human beings are born free and equal in dignity and rights.', 10, 90);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('They are endowed with reason and conscience and should act', 10, 105);
      doc.text('towards one another in a spirit of brotherhood.', 10, 115);
      doc.endStructureElement();
    doc.endDocumentFragment();

    doc.beginStructureElement('P');
    doc.text('Der vollständige Text ist auf der UN-Website verfügbar.', 10, 140);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-docfragment-2-multilang.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  German document with English excerpt');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 5: Aside for author bio
console.log('[Test 5] Aside for author biography');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Article with Author Bio');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Die Zukunft der künstlichen Intelligenz', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Künstliche Intelligenz wird unsere Welt grundlegend verändern.', 10, 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Von autonomen Fahrzeugen bis zu medizinischen Diagnosen -', 10, 55);
    doc.text('die Anwendungen sind vielfältig.', 10, 65);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Experten prognostizieren weitreichende Veränderungen.', 10, 85);
    doc.endStructureElement();

    // Author bio box at the end
    doc.beginAside();
      doc.beginStructureElement('H2');
      doc.setFontSize(12);
      doc.text('Über den Autor', 10, 120);
      doc.setFontSize(14);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.setFontSize(10);
      doc.text('Dr. Maria Schmidt ist Professorin für Informatik an der', 10, 135);
      doc.text('Technischen Universität München. Sie forscht seit 15 Jahren', 10, 145);
      doc.text('im Bereich der künstlichen Intelligenz und hat zahlreiche', 10, 155);
      doc.text('Publikationen zu diesem Thema veröffentlicht.', 10, 165);
      doc.setFontSize(14);
      doc.endStructureElement();
    doc.endAside();
  doc.endStructureElement();

  const filename = 'examples/temp/test-aside-3-author.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Article with author biography box');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 6: Complete document with both elements
console.log('[Test 6] Complete document with DocumentFragment and Aside');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Complete PDF 2.0 Elements Demo');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('PDF 2.0 Strukturelemente', 10, 20);
    doc.endStructureElement();

    // Section 1: DocumentFragment
    doc.beginSect();
      doc.beginStructureElement('H2');
      doc.text('1. DocumentFragment', 10, 40);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('DocumentFragment kennzeichnet Auszüge aus anderen Dokumenten:', 10, 55);
      doc.endStructureElement();

      doc.beginDocumentFragment();
        doc.beginStructureElement('P');
        doc.setFont('AtkinsonHyperlegible', 'italic');
        doc.text('Dies ist ein Auszug aus einem externen Dokument.', 15, 70);
        doc.text('Die Überschriftenebenen müssen nicht mit dem', 15, 80);
        doc.text('Hauptdokument übereinstimmen.', 15, 90);
        doc.setFont('AtkinsonHyperlegible', 'normal');
        doc.endStructureElement();
      doc.endDocumentFragment();
    doc.endSect();

    // Section 2: Aside
    doc.beginSect();
      doc.beginStructureElement('H2');
      doc.text('2. Aside', 10, 115);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Aside ist für Nebeninhalte wie Sidebars und Hinweise:', 10, 130);
      doc.endStructureElement();

      doc.beginAside();
        doc.beginStructureElement('P');
        doc.setFontSize(10);
        doc.text('Hinweis: PDF 2.0 Elemente werden von neueren', 15, 145);
        doc.text('PDF-Readern unterstützt. Ältere Reader zeigen', 15, 153);
        doc.text('den Inhalt trotzdem lesbar an.', 15, 161);
        doc.setFontSize(14);
        doc.endStructureElement();
      doc.endAside();
    doc.endSect();

    // Summary
    doc.beginStructureElement('H2');
    doc.text('Zusammenfassung', 10, 185);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Beide Elemente verbessern die semantische Struktur von PDFs.', 10, 200);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-docfragment-aside-complete.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Complete document demonstrating both PDF 2.0 elements');
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
console.log('  - test-docfragment-1-simple.pdf');
console.log('  - test-aside-1-sidebar.pdf');
console.log('  - test-aside-2-pullquote.pdf');
console.log('  - test-docfragment-2-multilang.pdf');
console.log('  - test-aside-3-author.pdf');
console.log('  - test-docfragment-aside-complete.pdf');
console.log('');
console.log('PDF 2.0 (ISO 32000-2) Elements:');
console.log('');
console.log('  DocumentFragment:');
console.log('    - Identifies content as excerpt from another document');
console.log('    - Heading levels may differ from main document');
console.log('    - Use for: legal citations, spec quotes, embedded docs');
console.log('    - Do NOT use for regular quotations (use BlockQuote)');
console.log('');
console.log('  Aside:');
console.log('    - Content tangentially related to main flow');
console.log('    - Use for: sidebars, pull quotes, author bios, ads');
console.log('    - Solves pre-PDF 2.0 sidebar heading problem');
console.log('');
console.log('Compatibility Note:');
console.log('  These are PDF 2.0 elements (PDF/UA-2). Older readers may not');
console.log('  announce them specially, but content remains fully accessible.');
console.log('');
console.log('veraPDF Validation:');
console.log('  docker run --rm -v $(pwd)/examples/temp:/data verapdf/verapdf:latest --flavour ua1 /data/test-aside-1-sidebar.pdf');
console.log('======================================================================');
