/**
 * PDF/UA Annotation Test Suite
 * Tests for accessible Text and FreeText annotations (BITi 02.3.2)
 *
 * Sprint 27: Accessible Annotations
 *
 * Matterhorn Protocol Requirements:
 * - 28-002: Annotations (except Widget, Popup, Link) must be nested in <Annot>
 * - 28-004: Annotations need /Contents or /Alt for accessibility
 *
 * Note: Link annotations are already handled by the Link structure element (Sprint 9).
 * This sprint adds support for Text (sticky notes) and FreeText annotations.
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Annotation Test Suite');
console.log('======================================================================\n');

// Test 1: Simple Text Annotation (Sticky Note)
console.log('[Test 1] Simple Text Annotation (Sticky Note)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Text Annotation Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Dokument mit Kommentar', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Dieser Absatz enthält einen wichtigen Punkt.', 10, 40);
    doc.endStructureElement();

    // Accessible text annotation with Annot structure element
    doc.beginAnnot({ alt: 'Kommentar: Dieser Punkt muss noch überprüft werden' });
    const annotId = doc.createAnnotation({
      type: 'text',
      title: 'Prüfer',
      contents: 'Dieser Punkt muss noch überprüft werden.',
      bounds: { x: 180, y: 35, w: 20, h: 20 },
      open: false
    });
    if (annotId) {
      doc.addAnnotationRef(annotId);
    }
    doc.endAnnot();

    doc.beginStructureElement('P');
    doc.text('Der Text wird hier fortgesetzt.', 10, 60);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-annot-1-text.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Sticky note annotation with Annot structure element');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: FreeText Annotation
console.log('[Test 2] FreeText Annotation');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('FreeText Annotation Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Dokument mit FreeText-Annotation', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Ein Absatz mit einer inline Anmerkung daneben.', 10, 40);
    doc.endStructureElement();

    // Accessible freetext annotation
    doc.beginAnnot({ alt: 'Anmerkung: Wichtiger Hinweis für den Leser' });
    const annotId = doc.createAnnotation({
      type: 'freetext',
      contents: 'Wichtiger Hinweis!',
      bounds: { x: 150, y: 35, w: 50, h: 15 },
      color: 'FF0000'
    });
    if (annotId) {
      doc.addAnnotationRef(annotId);
    }
    doc.endAnnot();

    doc.beginStructureElement('P');
    doc.text('Weiterer Text im Dokument.', 10, 60);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-annot-2-freetext.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  FreeText annotation with Annot structure element');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 3: Multiple Annotations
console.log('[Test 3] Multiple Annotations');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Multiple Annotations Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Dokument mit mehreren Kommentaren', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Erster Absatz mit Kommentar.', 10, 40);
    doc.endStructureElement();

    // First annotation
    doc.beginAnnot({ alt: 'Kommentar 1: Gut formuliert' });
    const annotId1 = doc.createAnnotation({
      type: 'text',
      title: 'Lektor',
      contents: 'Gut formuliert!',
      bounds: { x: 180, y: 35, w: 20, h: 20 }
    });
    if (annotId1) doc.addAnnotationRef(annotId1);
    doc.endAnnot();

    doc.beginStructureElement('P');
    doc.text('Zweiter Absatz mit anderem Kommentar.', 10, 60);
    doc.endStructureElement();

    // Second annotation
    doc.beginAnnot({ alt: 'Kommentar 2: Bitte überarbeiten' });
    const annotId2 = doc.createAnnotation({
      type: 'text',
      title: 'Lektor',
      contents: 'Bitte überarbeiten.',
      bounds: { x: 180, y: 55, w: 20, h: 20 }
    });
    if (annotId2) doc.addAnnotationRef(annotId2);
    doc.endAnnot();

    doc.beginStructureElement('P');
    doc.text('Dritter Absatz mit FreeText-Anmerkung.', 10, 80);
    doc.endStructureElement();

    // Third annotation (FreeText)
    doc.beginAnnot({ alt: 'Hinweis: TODO Liste' });
    const annotId3 = doc.createAnnotation({
      type: 'freetext',
      contents: 'TODO: Referenz hinzufügen',
      bounds: { x: 150, y: 75, w: 50, h: 12 }
    });
    if (annotId3) doc.addAnnotationRef(annotId3);
    doc.endAnnot();
  doc.endStructureElement();

  const filename = 'examples/temp/test-annot-3-multiple.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Multiple annotations with proper structure');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 4: Annotation with language attribute
console.log('[Test 4] Annotation with language attribute');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Multilingual Annotation Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Dokument mit englischem Kommentar', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Deutscher Text im Hauptdokument.', 10, 40);
    doc.endStructureElement();

    // English annotation in German document
    doc.beginAnnot({ lang: 'en-US', alt: 'Comment: Please review this section' });
    const annotId = doc.createAnnotation({
      type: 'text',
      title: 'Reviewer',
      contents: 'Please review this section for accuracy.',
      bounds: { x: 180, y: 35, w: 20, h: 20 }
    });
    if (annotId) doc.addAnnotationRef(annotId);
    doc.endAnnot();

    doc.beginStructureElement('P');
    doc.text('Weiterer deutscher Text.', 10, 60);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-annot-4-language.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  English annotation in German document');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 5: Open annotation (popup visible)
console.log('[Test 5] Open annotation (popup visible)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Open Annotation Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Dokument mit offenem Kommentar', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Dieser Kommentar ist standardmäßig geöffnet.', 10, 40);
    doc.endStructureElement();

    // Open annotation
    doc.beginAnnot({ alt: 'Wichtiger Kommentar: Sofort lesen!' });
    const annotId = doc.createAnnotation({
      type: 'text',
      title: 'System',
      contents: 'WICHTIG: Dieser Kommentar muss sofort beachtet werden!',
      bounds: { x: 180, y: 35, w: 20, h: 20 },
      open: true
    });
    if (annotId) doc.addAnnotationRef(annotId);
    doc.endAnnot();
  doc.endStructureElement();

  const filename = 'examples/temp/test-annot-5-open.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Annotation with popup open by default');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 6: Complete document with various annotations
console.log('[Test 6] Complete document with various annotations');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Kommentiertes Dokument');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Projektbericht 2024', 10, 20);
    doc.endStructureElement();

    // Introduction with comment
    doc.beginStructureElement('H2');
    doc.text('1. Einleitung', 10, 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Dieser Bericht fasst die wichtigsten Ergebnisse des Projekts zusammen.', 10, 55);
    doc.endStructureElement();

    doc.beginAnnot({ alt: 'Redaktioneller Hinweis: Einleitung erweitern' });
    const a1 = doc.createAnnotation({
      type: 'text',
      title: 'Redaktion',
      contents: 'Die Einleitung könnte noch ausführlicher sein.',
      bounds: { x: 180, y: 50, w: 20, h: 20 }
    });
    if (a1) doc.addAnnotationRef(a1);
    doc.endAnnot();

    // Results section
    doc.beginStructureElement('H2');
    doc.text('2. Ergebnisse', 10, 80);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Die Projektziele wurden zu 95% erreicht.', 10, 95);
    doc.endStructureElement();

    // FreeText highlight
    doc.beginAnnot({ alt: 'Hervorhebung: Sehr gutes Ergebnis' });
    const a2 = doc.createAnnotation({
      type: 'freetext',
      contents: 'Sehr gut!',
      bounds: { x: 150, y: 92, w: 30, h: 10 },
      color: '00AA00'
    });
    if (a2) doc.addAnnotationRef(a2);
    doc.endAnnot();

    doc.beginStructureElement('P');
    doc.text('Besonders hervorzuheben sind die folgenden Punkte:', 10, 115);
    doc.endStructureElement();

    // List
    doc.beginStructureElement('L');
      doc.beginStructureElement('LI');
        doc.beginStructureElement('LBody');
        doc.text('• Termingerechte Lieferung', 15, 130);
        doc.endStructureElement();
      doc.endStructureElement();
      doc.beginStructureElement('LI');
        doc.beginStructureElement('LBody');
        doc.text('• Budgeteinhaltung', 15, 145);
        doc.endStructureElement();
      doc.endStructureElement();
      doc.beginStructureElement('LI');
        doc.beginStructureElement('LBody');
        doc.text('• Hohe Kundenzufriedenheit', 15, 160);
        doc.endStructureElement();
      doc.endStructureElement();
    doc.endStructureElement();

    doc.beginAnnot({ alt: 'Frage: Gibt es Zahlen zur Kundenzufriedenheit?' });
    const a3 = doc.createAnnotation({
      type: 'text',
      title: 'Leser',
      contents: 'Gibt es konkrete Zahlen zur Kundenzufriedenheit?',
      bounds: { x: 180, y: 155, w: 20, h: 20 }
    });
    if (a3) doc.addAnnotationRef(a3);
    doc.endAnnot();

    // Conclusion
    doc.beginStructureElement('H2');
    doc.text('3. Fazit', 10, 185);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Das Projekt war ein voller Erfolg.', 10, 200);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-annot-6-complete.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Complete annotated document');
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
console.log('  - test-annot-1-text.pdf');
console.log('  - test-annot-2-freetext.pdf');
console.log('  - test-annot-3-multiple.pdf');
console.log('  - test-annot-4-language.pdf');
console.log('  - test-annot-5-open.pdf');
console.log('  - test-annot-6-complete.pdf');
console.log('');
console.log('PDF/UA Annotation Structure:');
console.log('');
console.log('  <Annot>');
console.log('    └── OBJR (reference to annotation object)');
console.log('');
console.log('Usage:');
console.log('  doc.beginAnnot({ alt: "Description for screen reader" });');
console.log('  const id = doc.createAnnotation({ type: "text", ... });');
console.log('  doc.addAnnotationRef(id);');
console.log('  doc.endAnnot();');
console.log('');
console.log('Matterhorn Protocol Compliance:');
console.log('  - 28-002: Annotations nested in <Annot> structure element');
console.log('  - 28-004: /Contents provides accessible text');
console.log('');
console.log('veraPDF Validation:');
console.log('  docker run --rm -v $(pwd)/examples/temp:/data verapdf/verapdf:latest --flavour ua1 /data/test-annot-1-text.pdf');
console.log('======================================================================');
