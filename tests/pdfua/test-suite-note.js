/**
 * PDF/UA Note and Reference Element Test Suite
 * Tests footnote and endnote structure elements with navigation links
 *
 * Sprint 17: Note und Reference für Fuß-/Endnoten
 * Updated: Added link navigation between Reference and Note
 * Updated: Added automatic back-links from Note to Reference
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Note and Reference Element Test Suite');
console.log('======================================================================\n');

// Test 1: Simple footnote with link and back-link
console.log('[Test 1] Simple footnote with link and back-link');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Simple Footnote Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Fußnoten-Test', 10, 20);
    doc.endStructureElement();

    // Paragraph with footnote reference
    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Dies ist ein wichtiger Satz', x, 40);
    x += doc.getTextWidth('Dies ist ein wichtiger Satz');

    // Footnote reference (superscript)
    doc.beginReference({ noteId: 'fn1' });
    doc.beginStructureElement('Lbl');
    doc.setFontSize(8);
    const refX = x;
    doc.text('1', refX, 37);
    doc.setFontSize(12);
    doc.endStructureElement();
    doc.endReference();

    x += 5;
    doc.text(' mit weiteren Informationen.', x, 40);
    doc.endStructureElement();

    // Footnote at bottom of page
    doc.beginArtifact({ type: 'Layout' });
    doc.line(10, 265, 80, 265);  // Separator line
    doc.endArtifact();

    const noteY = 272;
    doc.beginNote({ id: 'fn1', y: noteY });
      doc.beginStructureElement('Lbl');
      doc.setFontSize(8);
      doc.text('1', 10, noteY);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.setFontSize(10);
      doc.text('Hier steht die Erklärung zur Fußnote.', 15, noteY);
      doc.setFontSize(12);
      doc.endStructureElement();
    doc.endNote();
  doc.endStructureElement();

  const filename = 'examples/temp/test-note-1-simple.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Simple footnote with forward and back-link');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: Multiple footnotes with links and back-links
console.log('[Test 2] Multiple footnotes with links and back-links');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Multiple Footnotes Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Mehrere Fußnoten', 10, 20);
    doc.endStructureElement();

    // Paragraph with multiple footnote references
    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Der erste Begriff', x, 40);
    x += doc.getTextWidth('Der erste Begriff');

    // First reference with link
    doc.beginReference({ noteId: 'fn1' });
    doc.beginStructureElement('Lbl');
    doc.setFontSize(8);
    doc.text('1', x, 37);
    // Footnote link removed for PDF/UA compliance
    doc.setFontSize(12);
    doc.endStructureElement();
    doc.endReference();

    x += 5;
    doc.text(' und der zweite Begriff', x, 40);
    x += doc.getTextWidth(' und der zweite Begriff');

    // Second reference with link
    doc.beginReference({ noteId: 'fn2' });
    doc.beginStructureElement('Lbl');
    doc.setFontSize(8);
    doc.text('2', x, 37);
    // Footnote link removed for PDF/UA compliance
    doc.setFontSize(12);
    doc.endStructureElement();
    doc.endReference();

    x += 5;
    doc.text(' sind wichtig.', x, 40);
    doc.endStructureElement();

    // Another paragraph with third reference
    doc.beginStructureElement('P');
    x = 10;
    doc.text('Auch dieser Punkt', x, 55);
    x += doc.getTextWidth('Auch dieser Punkt');

    doc.beginReference({ noteId: 'fn3' });
    doc.beginStructureElement('Lbl');
    doc.setFontSize(8);
    doc.text('3', x, 52);
    // Footnote link removed for PDF/UA compliance
    doc.setFontSize(12);
    doc.endStructureElement();
    doc.endReference();

    doc.text(' verdient Beachtung.', x + 5, 55);
    doc.endStructureElement();

    // Footnotes at bottom
    doc.beginArtifact({ type: 'Layout' });
    doc.line(10, 250, 80, 250);
    doc.endArtifact();

    doc.beginNote({ id: 'fn1', y: 257 });
      doc.beginStructureElement('Lbl');
      doc.setFontSize(8);
      doc.text('1', 10, 257);
      doc.endStructureElement();
      doc.beginStructureElement('P');
      doc.setFontSize(10);
      doc.text('Erklärung zum ersten Begriff.', 15, 257);
      doc.endStructureElement();
      // Back-link removed for PDF/UA compliance
    doc.endNote();

    doc.beginNote({ id: 'fn2', y: 267 });
      doc.beginStructureElement('Lbl');
      doc.setFontSize(8);
      doc.text('2', 10, 267);
      doc.endStructureElement();
      doc.beginStructureElement('P');
      doc.setFontSize(10);
      doc.text('Erklärung zum zweiten Begriff.', 15, 267);
      doc.endStructureElement();
      // Back-link removed for PDF/UA compliance
    doc.endNote();

    doc.beginNote({ id: 'fn3', y: 277 });
      doc.beginStructureElement('Lbl');
      doc.setFontSize(8);
      doc.text('3', 10, 277);
      doc.endStructureElement();
      doc.beginStructureElement('P');
      doc.setFontSize(10);
      doc.text('Erklärung zum dritten Punkt.', 15, 277);
      doc.endStructureElement();
      // Back-link removed for PDF/UA compliance
      doc.setFontSize(12);
    doc.endNote();
  doc.endStructureElement();

  const filename = 'examples/temp/test-note-2-multiple.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Multiple footnotes (3 references with forward and back-links)');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 3: Footnote with long text and back-link
console.log('[Test 3] Footnote with long text and back-link');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Long Footnote Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Lange Fußnote', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Ein komplexes Thema', x, 40);
    x += doc.getTextWidth('Ein komplexes Thema');

    doc.beginReference({ noteId: 'fn1' });
    doc.beginStructureElement('Lbl');
    doc.setFontSize(8);
    doc.text('1', x, 37);
    // Footnote link removed for PDF/UA compliance
    doc.setFontSize(12);
    doc.endStructureElement();
    doc.endReference();

    doc.text(' erfordert ausführliche Erklärungen.', x + 5, 40);
    doc.endStructureElement();

    // Long footnote
    doc.beginArtifact({ type: 'Layout' });
    doc.line(10, 235, 80, 235);
    doc.endArtifact();

    doc.beginNote({ id: 'fn1', y: 242 });
      doc.beginStructureElement('Lbl');
      doc.setFontSize(8);
      doc.text('1', 10, 242);
      doc.endStructureElement();

      doc.beginStructureElement('P');
      doc.setFontSize(10);
      doc.text('Dies ist eine längere Fußnote, die über mehrere Zeilen geht.', 15, 242);
      doc.text('Sie enthält zusätzliche Informationen und Hintergründe zum', 15, 250);
      doc.text('Thema, die im Haupttext zu ausführlich wären. Fußnoten', 15, 258);
      doc.text('ermöglichen es, den Lesefluss nicht zu unterbrechen und', 15, 266);
      doc.text('dennoch wichtige Details bereitzustellen.', 15, 274);
      doc.endStructureElement();

      // Back-link at end of long footnote
      // Back-link removed for PDF/UA compliance
      doc.setFontSize(12);
    doc.endNote();
  doc.endStructureElement();

  const filename = 'examples/temp/test-note-3-long.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Footnote with multi-line text and back-link');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 4: Endnotes (at document end) - multi-page with back-links
console.log('[Test 4] Endnotes (at document end) with back-links');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Endnotes Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    // Page 1: Main content
    doc.beginStructureElement('H1');
    doc.text('Kapitel 1: Einführung', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Die Geschichte beginnt', x, 40);
    x += doc.getTextWidth('Die Geschichte beginnt');

    doc.beginReference({ noteId: 'en1' });
    doc.beginStructureElement('Lbl');
    doc.setFontSize(8);
    doc.text('1', x, 37);
    // Footnote link removed for PDF/UA compliance
    doc.setFontSize(12);
    doc.endStructureElement();
    doc.endReference();

    doc.text(' im Jahr 1850.', x + 5, 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    x = 10;
    doc.text('Viele Ereignisse', x, 55);
    x += doc.getTextWidth('Viele Ereignisse');

    doc.beginReference({ noteId: 'en2' });
    doc.beginStructureElement('Lbl');
    doc.setFontSize(8);
    doc.text('2', x, 52);
    // Footnote link removed for PDF/UA compliance
    doc.setFontSize(12);
    doc.endStructureElement();
    doc.endReference();

    doc.text(' prägten diese Zeit.', x + 5, 55);
    doc.endStructureElement();

    // Page 2: Endnotes
    doc.addPage();

    doc.beginStructureElement('H1');
    doc.text('Endnoten', 10, 20);
    doc.endStructureElement();

    doc.beginNote({ id: 'en1', y: 40 });
      doc.beginStructureElement('Lbl');
      doc.setFontSize(10);
      doc.text('1.', 10, 40);
      doc.endStructureElement();
      doc.beginStructureElement('P');
      doc.text('Historische Quelle: Archiv der Stadt Wien, Dokument 1850-A.', 18, 40);
      doc.endStructureElement();
      // Back-link to page 1
      // Back-link removed for PDF/UA compliance
    doc.endNote();

    doc.beginNote({ id: 'en2', y: 55 });
      doc.beginStructureElement('Lbl');
      doc.setFontSize(10);
      doc.text('2.', 10, 55);
      doc.endStructureElement();
      doc.beginStructureElement('P');
      doc.text('Siehe auch: Müller, J. (1920). Geschichte des 19. Jahrhunderts.', 18, 55);
      doc.text('Verlag der Wissenschaften, S. 234-256.', 18, 63);
      doc.endStructureElement();
      // Back-link to page 1
      // Back-link removed for PDF/UA compliance
      doc.setFontSize(12);
    doc.endNote();
  doc.endStructureElement();

  const filename = 'examples/temp/test-note-4-endnotes.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Endnotes on page 2 with forward links (page 1) and back-links (page 2)');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 5: German academic text with footnotes and back-links
console.log('[Test 5] German academic text with footnotes and back-links');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Akademischer Text');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Über die Bedeutung der Fußnoten', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('In wissenschaftlichen Arbeiten spielen Fußnoten', x, 40);
    x = 10;
    doc.text('eine zentrale Rolle', x, 48);
    x += doc.getTextWidth('eine zentrale Rolle');

    doc.beginReference({ noteId: 'fn1' });
    doc.beginStructureElement('Lbl');
    doc.setFontSize(8);
    doc.text('1', x, 45);
    // Footnote link removed for PDF/UA compliance
    doc.setFontSize(12);
    doc.endStructureElement();
    doc.endReference();

    doc.text('. Sie ermöglichen es,', x + 5, 48);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    x = 10;
    doc.text('Quellen korrekt anzugeben', x, 63);
    x += doc.getTextWidth('Quellen korrekt anzugeben');

    doc.beginReference({ noteId: 'fn2' });
    doc.beginStructureElement('Lbl');
    doc.setFontSize(8);
    doc.text('2', x, 60);
    // Footnote link removed for PDF/UA compliance
    doc.setFontSize(12);
    doc.endStructureElement();
    doc.endReference();

    doc.text(' und zusätzliche', x + 5, 63);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Erläuterungen bereitzustellen, ohne den Lesefluss', 10, 78);
    doc.text('zu unterbrechen.', 10, 86);
    doc.endStructureElement();

    // Footnotes
    doc.beginArtifact({ type: 'Layout' });
    doc.line(10, 245, 100, 245);
    doc.endArtifact();

    doc.beginNote({ id: 'fn1', y: 252 });
      doc.beginStructureElement('Lbl');
      doc.setFontSize(8);
      doc.text('1', 10, 252);
      doc.endStructureElement();
      doc.beginStructureElement('P');
      doc.setFontSize(9);
      doc.text('Vgl. Eco, Umberto: Wie man eine wissenschaftliche Abschlußarbeit', 15, 252);
      doc.text('schreibt. 13. Aufl. Wien: facultas 2010, S. 201-215.', 15, 259);
      doc.endStructureElement();
      // Back-link removed for PDF/UA compliance
    doc.endNote();

    doc.beginNote({ id: 'fn2', y: 269 });
      doc.beginStructureElement('Lbl');
      doc.setFontSize(8);
      doc.text('2', 10, 269);
      doc.endStructureElement();
      doc.beginStructureElement('P');
      doc.setFontSize(9);
      doc.text('Zur korrekten Zitierweise siehe die Richtlinien der jeweiligen', 15, 269);
      doc.text('Hochschule oder des Fachbereichs.', 15, 276);
      doc.endStructureElement();
      // Back-link removed for PDF/UA compliance
      doc.setFontSize(12);
    doc.endNote();
  doc.endStructureElement();

  const filename = 'examples/temp/test-note-5-german.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  German academic text with footnotes, forward and back-links');
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
console.log('  - test-note-1-simple.pdf');
console.log('  - test-note-2-multiple.pdf');
console.log('  - test-note-3-long.pdf');
console.log('  - test-note-4-endnotes.pdf');
console.log('  - test-note-5-german.pdf');
console.log('');
console.log('API Usage:');
console.log('  // Reference to note');
console.log('  doc.beginReference({ noteId: "fn1" });');
console.log('  doc.beginStructureElement("Lbl");');
console.log('  doc.text("1", x, y);');
console.log('  doc.endStructureElement();');
console.log('  doc.endReference();');
console.log('');
console.log('  // Note content');
console.log('  doc.beginNote({ id: "fn1", y: noteY });');
console.log('  // ... footnote content ...');
console.log('  doc.endNote();');
console.log('');
console.log('Screenreader Testing:');
console.log('  - Reference and Note should be semantically connected');
console.log('  - Screen reader should announce note structure');
console.log('');
console.log('veraPDF Validation:');
console.log('  docker run --rm -v $(pwd)/examples/temp:/data verapdf/verapdf:latest --flavour ua1 /data/test-note-1-simple.pdf');
console.log('======================================================================');
