/**
 * PDF/UA Caption Element Test Suite
 * Tests caption elements for figures, tables, and other content
 *
 * Sprint 18: Caption for figure/table descriptions
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Caption Element Test Suite');
console.log('======================================================================\n');

// Helper: Create a simple test image (1x1 red pixel PNG)
const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

// Test 1: Simple figure with caption
console.log('[Test 1] Simple figure with caption');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Figure with Caption Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Abbildung mit Bildunterschrift', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Das folgende Bild zeigt ein Beispiel:', 10, 35);
    doc.endStructureElement();

    // Figure with caption - use alt on Figure element for PDF/UA compliance
    doc.beginFigure({ alt: 'Ein blaues Rechteck als Beispielbild mit Bildunterschrift' });
      // The image itself with alt text
      doc.addImage({
        imageData: testImageBase64,
        format: 'PNG',
        x: 10,
        y: 45,
        width: 80,
        height: 50,
        alt: 'Ein blaues Rechteck als Beispielbild'
      });

      // Caption below the image
      doc.beginCaption();
        doc.setFontSize(10);
        doc.setFont("AtkinsonHyperlegible", "italic");
        doc.text('Abbildung 1: Ein einfaches Beispielbild zur Demonstration.', 10, 105);
        doc.setFont("AtkinsonHyperlegible", "normal");
        doc.setFontSize(12);
      doc.endCaption();
    doc.endFigure();

    doc.beginStructureElement('P');
    doc.text('Der Text geht hier weiter nach der Abbildung.', 10, 120);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-caption-1-simple.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Simple figure with italic caption below');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: Table with caption
console.log('[Test 2] Table with caption');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Table with Caption Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Tabelle mit Beschriftung', 10, 20);
    doc.endStructureElement();

    // Table with caption above
    doc.beginStructureElement('Table');
      // Caption above table
      doc.beginCaption();
        doc.setFontSize(10);
        doc.setFont("AtkinsonHyperlegible", "bold");
        doc.text('Tabelle 1: Quartalsumsätze 2024', 10, 40);
        doc.setFont("AtkinsonHyperlegible", "normal");
        doc.setFontSize(12);
      doc.endCaption();

      // Table header
      doc.beginTableHead();
        doc.beginTableRow();
          doc.beginTableHeaderCell('Column');
          doc.text('Quartal', 10, 55);
          doc.endStructureElement();

          doc.beginTableHeaderCell('Column');
          doc.text('Umsatz', 50, 55);
          doc.endStructureElement();

          doc.beginTableHeaderCell('Column');
          doc.text('Gewinn', 90, 55);
          doc.endStructureElement();
        doc.endStructureElement();
      doc.endStructureElement();

      // Table body
      doc.beginTableBody();
        doc.beginTableRow();
          doc.beginTableHeaderCell('Row');
          doc.text('Q1', 10, 65);
          doc.endStructureElement();
          doc.beginTableDataCell();
          doc.text('10.000', 50, 65);
          doc.endStructureElement();
          doc.beginTableDataCell();
          doc.text('2.000', 90, 65);
          doc.endStructureElement();
        doc.endStructureElement();

        doc.beginTableRow();
          doc.beginTableHeaderCell('Row');
          doc.text('Q2', 10, 75);
          doc.endStructureElement();
          doc.beginTableDataCell();
          doc.text('12.500', 50, 75);
          doc.endStructureElement();
          doc.beginTableDataCell();
          doc.text('3.100', 90, 75);
          doc.endStructureElement();
        doc.endStructureElement();
      doc.endStructureElement();
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-caption-2-table.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Table with bold caption above');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 3: Multiple figures with numbered captions
console.log('[Test 3] Multiple figures with numbered captions');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Multiple Figures Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Mehrere Abbildungen', 10, 20);
    doc.endStructureElement();

    // Figure 1
    doc.beginFigure({ alt: 'Erstes Beispielbild (rot) mit Bildunterschrift' });
      doc.addImage({
        imageData: testImageBase64,
        format: 'PNG',
        x: 10, y: 35, width: 60, height: 40,
        alt: 'Rotes Rechteck - erstes Beispiel'
      });
      doc.beginCaption();
        doc.setFontSize(10);
        doc.text('Abb. 1: Erstes Beispielbild (rot)', 10, 82);
        doc.setFontSize(12);
      doc.endCaption();
    doc.endFigure();

    // Figure 2
    doc.beginFigure({ alt: 'Zweites Beispielbild (grün) mit Bildunterschrift' });
      doc.addImage({
        imageData: testImageBase64,
        format: 'PNG',
        x: 10, y: 95, width: 60, height: 40,
        alt: 'Grünes Rechteck - zweites Beispiel'
      });
      doc.beginCaption();
        doc.setFontSize(10);
        doc.text('Abb. 2: Zweites Beispielbild (grün)', 10, 142);
        doc.setFontSize(12);
      doc.endCaption();
    doc.endFigure();

    // Figure 3
    doc.beginFigure({ alt: 'Drittes Beispielbild (blau) mit Bildunterschrift' });
      doc.addImage({
        imageData: testImageBase64,
        format: 'PNG',
        x: 10, y: 155, width: 60, height: 40,
        alt: 'Blaues Rechteck - drittes Beispiel'
      });
      doc.beginCaption();
        doc.setFontSize(10);
        doc.text('Abb. 3: Drittes Beispielbild (blau)', 10, 202);
        doc.setFontSize(12);
      doc.endCaption();
    doc.endFigure();
  doc.endStructureElement();

  const filename = 'examples/temp/test-caption-3-multiple.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Three figures with numbered captions');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 4: Figure with long multi-line caption
console.log('[Test 4] Figure with long multi-line caption');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Long Caption Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Abbildung mit langer Beschreibung', 10, 20);
    doc.endStructureElement();

    doc.beginFigure({ alt: 'Komplexes Diagramm mit detaillierter Beschreibung' });
      doc.addImage({
        imageData: testImageBase64,
        format: 'PNG',
        x: 10, y: 35, width: 100, height: 60,
        alt: 'Komplexes Diagramm zur Datenvisualisierung'
      });

      doc.beginCaption();
        doc.setFontSize(10);
        doc.text('Abbildung 1: Detaillierte Darstellung der Ergebnisse aus der', 10, 105);
        doc.text('Langzeitstudie zur Benutzerfreundlichkeit. Die Grafik zeigt', 10, 112);
        doc.text('den Zusammenhang zwischen Barrierefreiheit und Nutzerzufriedenheit', 10, 119);
        doc.text('über einen Zeitraum von fünf Jahren (2019-2024).', 10, 126);
        doc.setFontSize(12);
      doc.endCaption();
    doc.endFigure();
  doc.endStructureElement();

  const filename = 'examples/temp/test-caption-4-long.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Figure with multi-line caption');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 5: Caption with different language
console.log('[Test 5] Caption with different language (English in German doc)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Multilingual Caption Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Mehrsprachige Bildunterschriften', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Die folgende Abbildung stammt aus einer englischen Publikation:', 10, 35);
    doc.endStructureElement();

    doc.beginFigure({ alt: 'Abbildung aus englischer Publikation mit englischer Bildunterschrift' });
      doc.addImage({
        imageData: testImageBase64,
        format: 'PNG',
        x: 10, y: 45, width: 80, height: 50,
        alt: 'A grayscale placeholder image'
      });

      // English caption in German document
      doc.beginCaption({ lang: 'en-US' });
        doc.setFontSize(10);
        doc.setFont("AtkinsonHyperlegible", "italic");
        doc.text('Figure 1: Sample visualization from the accessibility study.', 10, 105);
        doc.text('Source: International Journal of Accessible Design, 2024.', 10, 112);
        doc.setFont("AtkinsonHyperlegible", "normal");
        doc.setFontSize(12);
      doc.endCaption();
    doc.endFigure();

    doc.beginStructureElement('P');
    doc.text('Der deutsche Text wird hier fortgesetzt.', 10, 130);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-caption-5-language.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  English caption in German document');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 6: Figure without caption (for comparison)
console.log('[Test 6] Figure without caption (decorative grouping)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Figure without Caption Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Abbildung ohne Bildunterschrift', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Manche Abbildungen benötigen keine separate Bildunterschrift,', 10, 35);
    doc.text('wenn der Alt-Text ausreichend beschreibend ist:', 10, 43);
    doc.endStructureElement();

    // Simple image without explicit caption (alt text is sufficient)
    doc.addImage({
      imageData: testImageBase64,
      format: 'PNG',
      x: 10, y: 55, width: 50, height: 30,
      alt: 'Logo der Firma XYZ - ein stilisiertes blaues X mit grünem Akzent'
    });

    doc.beginStructureElement('P');
    doc.text('Das Firmenlogo oben benötigt keine zusätzliche Bildunterschrift.', 10, 95);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-caption-6-no-caption.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Image with alt text but no caption');
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
console.log('  - test-caption-1-simple.pdf      (figure with caption)');
console.log('  - test-caption-2-table.pdf       (table with caption)');
console.log('  - test-caption-3-multiple.pdf    (multiple figures)');
console.log('  - test-caption-4-long.pdf        (multi-line caption)');
console.log('  - test-caption-5-language.pdf    (multilingual caption)');
console.log('  - test-caption-6-no-caption.pdf  (image without caption)');
console.log('');
console.log('API Usage:');
console.log('');
console.log('  // Figure with caption');
console.log('  doc.beginFigure();');
console.log('    doc.addImage({ imageData, x, y, width, height, alt: "..." });');
console.log('    doc.beginCaption();');
console.log('      doc.text("Abbildung 1: Beschreibung", x, y);');
console.log('    doc.endCaption();');
console.log('  doc.endFigure();');
console.log('');
console.log('  // Table with caption');
console.log('  doc.beginStructureElement("Table");');
console.log('    doc.beginCaption();');
console.log('      doc.text("Tabelle 1: Titel", x, y);');
console.log('    doc.endCaption();');
console.log('    // ... table content ...');
console.log('  doc.endStructureElement();');
console.log('');
console.log('  // Caption with different language');
console.log('  doc.beginCaption({ lang: "en-US" });');
console.log('    doc.text("Figure 1: English caption", x, y);');
console.log('  doc.endCaption();');
console.log('');
console.log('Screenreader Testing:');
console.log('  - Caption should be announced as part of the figure/table');
console.log('  - Alt text describes the image content');
console.log('  - Caption provides additional context (numbering, source)');
console.log('');
console.log('veraPDF Validation:');
console.log('  docker run --rm -v $(pwd)/examples/temp:/data verapdf/verapdf:latest --flavour ua1 /data/test-caption-1-simple.pdf');
console.log('======================================================================');
