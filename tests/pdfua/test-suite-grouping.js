/**
 * PDF/UA Grouping Elements Test Suite
 * Tests for Art, Sect, Div, Part document structure elements
 *
 * Sprint 24: Art/Sect/Div/Part (BITi 02.1.0)
 *
 * These elements organize document content into logical divisions:
 * - Part: Major divisions (book parts, volumes)
 * - Art: Self-contained articles
 * - Sect: Sections within parts/articles
 * - Div: Generic container (use sparingly)
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Grouping Elements Test Suite (Art, Sect, Div, Part)');
console.log('======================================================================\n');

// Test 1: Simple Sect usage
console.log('[Test 1] Simple Sect usage');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Simple Section Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginSect();
      doc.beginStructureElement('H1');
      doc.text('Kapitel 1: Einführung', 10, 20);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Dies ist der Inhalt des ersten Kapitels.', 10, 35);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Es enthält wichtige Grundlagen.', 10, 50);
      doc.endStructureElement();
    doc.endSect();

    doc.beginSect();
      doc.beginStructureElement('H1');
      doc.text('Kapitel 2: Hauptteil', 10, 75);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Der Hauptteil behandelt das Kernthema.', 10, 90);
      doc.endStructureElement();
    doc.endSect();

    doc.beginSect();
      doc.beginStructureElement('H1');
      doc.text('Kapitel 3: Zusammenfassung', 10, 115);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Hier werden die Ergebnisse zusammengefasst.', 10, 130);
      doc.endStructureElement();
    doc.endSect();
  doc.endStructureElement();

  const filename = 'examples/temp/test-grouping-1-sect.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Document with three Sect elements (chapters)');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: Nested Sect elements
console.log('[Test 2] Nested Sect elements');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Nested Sections Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginSect();
      doc.beginStructureElement('H1');
      doc.text('1. Kapitel', 10, 20);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Einleitung zum Kapitel.', 10, 35);
      doc.endStructureElement();

      // Nested section 1.1
      doc.beginSect();
        doc.beginStructureElement('H2');
        doc.text('1.1 Unterabschnitt', 10, 55);
        doc.endStructureElement();

        doc.beginStructureElement('P');
        doc.text('Inhalt des ersten Unterabschnitts.', 10, 70);
        doc.endStructureElement();
      doc.endSect();

      // Nested section 1.2
      doc.beginSect();
        doc.beginStructureElement('H2');
        doc.text('1.2 Weiterer Unterabschnitt', 10, 95);
        doc.endStructureElement();

        doc.beginStructureElement('P');
        doc.text('Inhalt des zweiten Unterabschnitts.', 10, 110);
        doc.endStructureElement();

        // Deeply nested section 1.2.1
        doc.beginSect();
          doc.beginStructureElement('H3');
          doc.text('1.2.1 Tiefe Verschachtelung', 10, 130);
          doc.endStructureElement();

          doc.beginStructureElement('P');
          doc.text('Sehr detaillierter Inhalt.', 10, 145);
          doc.endStructureElement();
        doc.endSect();

      doc.endSect();

    doc.endSect();
  doc.endStructureElement();

  const filename = 'examples/temp/test-grouping-2-nested-sect.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Deeply nested Sect elements (1 -> 1.1, 1.2 -> 1.2.1)');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 3: Art for articles
console.log('[Test 3] Art for magazine-style articles');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Magazine Articles');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Technologie-Magazin', 10, 20);
    doc.endStructureElement();

    // Article 1
    doc.beginArt();
      doc.beginStructureElement('H2');
      doc.text('Künstliche Intelligenz im Alltag', 10, 45);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('KI-Systeme werden immer präsenter in unserem täglichen Leben.', 10, 60);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Von Sprachassistenten bis zu Empfehlungssystemen.', 10, 75);
      doc.endStructureElement();
    doc.endArt();

    // Article 2
    doc.beginArt();
      doc.beginStructureElement('H2');
      doc.text('Nachhaltige Technologien', 10, 100);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Grüne Technologien gewinnen an Bedeutung.', 10, 115);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Solarenergie und Elektromobilität führen den Wandel.', 10, 130);
      doc.endStructureElement();
    doc.endArt();

    // Article 3
    doc.beginArt();
      doc.beginStructureElement('H2');
      doc.text('Cybersicherheit 2024', 10, 155);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Neue Herausforderungen für die IT-Sicherheit.', 10, 170);
      doc.endStructureElement();
    doc.endArt();
  doc.endStructureElement();

  const filename = 'examples/temp/test-grouping-3-art.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Magazine with three independent Art elements');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 4: Part for major divisions
console.log('[Test 4] Part for major document divisions');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Book with Parts');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    // Part I
    doc.beginPart();
      doc.beginStructureElement('H1');
      doc.text('Teil I: Grundlagen', 10, 20);
      doc.endStructureElement();

      doc.beginSect();
        doc.beginStructureElement('H2');
        doc.text('Kapitel 1: Einführung', 10, 40);
        doc.endStructureElement();

        doc.beginStructureElement('P');
        doc.text('Grundlegende Konzepte werden vorgestellt.', 10, 55);
        doc.endStructureElement();
      doc.endSect();

      doc.beginSect();
        doc.beginStructureElement('H2');
        doc.text('Kapitel 2: Theorie', 10, 80);
        doc.endStructureElement();

        doc.beginStructureElement('P');
        doc.text('Theoretische Grundlagen werden erklärt.', 10, 95);
        doc.endStructureElement();
      doc.endSect();
    doc.endPart();

    // Part II
    doc.beginPart();
      doc.beginStructureElement('H1');
      doc.text('Teil II: Anwendung', 10, 130);
      doc.endStructureElement();

      doc.beginSect();
        doc.beginStructureElement('H2');
        doc.text('Kapitel 3: Praxis', 10, 150);
        doc.endStructureElement();

        doc.beginStructureElement('P');
        doc.text('Praktische Anwendungen werden demonstriert.', 10, 165);
        doc.endStructureElement();
      doc.endSect();

      doc.beginSect();
        doc.beginStructureElement('H2');
        doc.text('Kapitel 4: Fallstudien', 10, 190);
        doc.endStructureElement();

        doc.beginStructureElement('P');
        doc.text('Reale Beispiele aus der Praxis.', 10, 205);
        doc.endStructureElement();
      doc.endSect();
    doc.endPart();
  doc.endStructureElement();

  const filename = 'examples/temp/test-grouping-4-part.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Book with two Parts, each containing Sect elements');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 5: Div for generic grouping
console.log('[Test 5] Div for generic grouping');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Div Element Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Dokument mit Div-Elementen', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Div ist ein generischer Container ohne semantische Bedeutung.', 10, 35);
    doc.endStructureElement();

    // Generic grouping with Div
    doc.beginDiv();
      doc.beginStructureElement('P');
      doc.text('Erster Absatz im Div-Container.', 10, 55);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Zweiter Absatz im Div-Container.', 10, 70);
      doc.endStructureElement();
    doc.endDiv();

    doc.beginDiv();
      doc.beginStructureElement('P');
      doc.text('Ein weiterer Div-Block.', 10, 95);
      doc.endStructureElement();
    doc.endDiv();

    doc.beginStructureElement('P');
    doc.text('Hinweis: Bevorzugen Sie Sect oder Art statt Div.', 10, 115);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-grouping-5-div.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Document using Div for generic grouping');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 6: Complete document structure
console.log('[Test 6] Complete document with all grouping elements');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Vollständige Dokumentstruktur');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Wissenschaftliche Arbeit', 10, 20);
    doc.endStructureElement();

    // Part I: Introduction
    doc.beginPart();
      doc.beginStructureElement('H2');
      doc.text('Teil I: Einleitung', 10, 40);
      doc.endStructureElement();

      doc.beginSect();
        doc.beginStructureElement('H3');
        doc.text('1. Motivation', 10, 55);
        doc.endStructureElement();

        doc.beginStructureElement('P');
        doc.text('Warum ist dieses Thema relevant?', 10, 70);
        doc.endStructureElement();
      doc.endSect();

      doc.beginSect();
        doc.beginStructureElement('H3');
        doc.text('2. Forschungsfragen', 10, 90);
        doc.endStructureElement();

        doc.beginStructureElement('P');
        doc.text('Welche Fragen werden untersucht?', 10, 105);
        doc.endStructureElement();
      doc.endSect();
    doc.endPart();

    // Part II: Main content with articles
    doc.beginPart();
      doc.beginStructureElement('H2');
      doc.text('Teil II: Hauptteil', 10, 130);
      doc.endStructureElement();

      doc.beginArt();
        doc.beginStructureElement('H3');
        doc.text('Artikel A: Methodik', 10, 145);
        doc.endStructureElement();

        doc.beginStructureElement('P');
        doc.text('Beschreibung der verwendeten Methoden.', 10, 160);
        doc.endStructureElement();
      doc.endArt();

      doc.beginArt();
        doc.beginStructureElement('H3');
        doc.text('Artikel B: Ergebnisse', 10, 185);
        doc.endStructureElement();

        doc.beginStructureElement('P');
        doc.text('Präsentation der Forschungsergebnisse.', 10, 200);
        doc.endStructureElement();
      doc.endArt();
    doc.endPart();

    // Appendix using Div
    doc.beginDiv();
      doc.beginStructureElement('H2');
      doc.text('Anhang', 10, 230);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.text('Zusätzliche Materialien und Daten.', 10, 245);
      doc.endStructureElement();
    doc.endDiv();
  doc.endStructureElement();

  const filename = 'examples/temp/test-grouping-6-complete.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Complete document: Part > Sect, Part > Art, Div');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 7: Multi-page with grouping
console.log('[Test 7] Multi-page document with grouping');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Multi-Page Grouping Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    // Part I - Page 1
    doc.beginPart();
      doc.beginStructureElement('H1');
      doc.text('Teil I', 10, 20);
      doc.endStructureElement();

      doc.beginSect();
        doc.beginStructureElement('H2');
        doc.text('Kapitel 1', 10, 40);
        doc.endStructureElement();

        doc.beginStructureElement('P');
        doc.text('Inhalt auf Seite 1.', 10, 55);
        doc.endStructureElement();
      doc.endSect();
    doc.endPart();

    // Part II - Page 2
    doc.addPage();
    doc.beginPart();
      doc.beginStructureElement('H1');
      doc.text('Teil II', 10, 20);
      doc.endStructureElement();

      doc.beginSect();
        doc.beginStructureElement('H2');
        doc.text('Kapitel 2', 10, 40);
        doc.endStructureElement();

        doc.beginStructureElement('P');
        doc.text('Inhalt auf Seite 2.', 10, 55);
        doc.endStructureElement();
      doc.endSect();
    doc.endPart();

    // Part III - Page 3
    doc.addPage();
    doc.beginPart();
      doc.beginStructureElement('H1');
      doc.text('Teil III', 10, 20);
      doc.endStructureElement();

      doc.beginSect();
        doc.beginStructureElement('H2');
        doc.text('Kapitel 3', 10, 40);
        doc.endStructureElement();

        doc.beginStructureElement('P');
        doc.text('Inhalt auf Seite 3.', 10, 55);
        doc.endStructureElement();
      doc.endSect();
    doc.endPart();
  doc.endStructureElement();

  const filename = 'examples/temp/test-grouping-7-multipage.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  3-page document with Part on each page');
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
console.log('  - test-grouping-1-sect.pdf');
console.log('  - test-grouping-2-nested-sect.pdf');
console.log('  - test-grouping-3-art.pdf');
console.log('  - test-grouping-4-part.pdf');
console.log('  - test-grouping-5-div.pdf');
console.log('  - test-grouping-6-complete.pdf');
console.log('  - test-grouping-7-multipage.pdf');
console.log('');
console.log('Screenreader Testing:');
console.log('  Part: Announces major document division');
console.log('  Art: Announces article/self-contained content');
console.log('  Sect: Announces section');
console.log('  Div: Generic container (content read, no special announcement)');
console.log('');
console.log('PDF Structure Hierarchy:');
console.log('  Document');
console.log('    └── Part (major division)');
console.log('        ├── Sect (chapter/section)');
console.log('        │   └── Sect (subsection)');
console.log('        └── Art (self-contained article)');
console.log('');
console.log('Best Practices:');
console.log('  - Use Part for book parts, volumes, major divisions');
console.log('  - Use Sect for chapters, sections, subsections');
console.log('  - Use Art for independent articles (magazines, news)');
console.log('  - Use Div sparingly - prefer semantic elements');
console.log('');
console.log('veraPDF Validation:');
console.log('  docker run --rm -v $(pwd)/examples/temp:/data verapdf/verapdf:latest --flavour ua1 /data/test-grouping-1-sect.pdf');
console.log('======================================================================');
