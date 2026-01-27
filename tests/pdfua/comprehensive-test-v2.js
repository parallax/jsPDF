/**
 * PDF/UA Comprehensive Test Document (Version 2 - Compact)
 * Demonstrates all implemented features in a compact, well-structured document
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Comprehensive Test Document V2');
console.log('======================================================================\n');

try {
  const doc = new jsPDF({ pdfUA: true });

  // Document metadata
  doc.setDocumentTitle('PDF/UA Test - Alle Features');
  doc.setLanguage('de-DE');
  doc.setProperties({
    subject: 'Demonstration aller PDF/UA-Features',
    creator: 'jsPDF-UA Library'
  });

  doc.beginStructureElement('Document');

  // ========================================================================
  // PAGE 1: Title and Font Styles
  // ========================================================================
  let y = 20;

  doc.beginStructureElement('H1');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.setFontSize(20);
  doc.text('PDF/UA Testdokument', 105, y, { align: 'center' });
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  y += 20;

  // Font Styles Section
  doc.beginStructureElement('H2');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.setFontSize(14);
  doc.text('1. Schriftstile', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  y += 8;

  doc.beginStructureElement('P');
  doc.text('Normal: Äpfel, Öl, Übung, ß', 20, y);
  doc.endStructureElement();
  y += 6;

  doc.beginStructureElement('P');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text('Fett: Äpfel, Öl, Übung, ß', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.endStructureElement();
  y += 6;

  doc.beginStructureElement('P');
  doc.setFont("AtkinsonHyperlegible", "italic");
  doc.text('Kursiv: Äpfel, Öl, Übung, ß', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.endStructureElement();
  y += 6;

  doc.beginStructureElement('P');
  doc.setFont("AtkinsonHyperlegible", "bolditalic");
  doc.text('Fett Kursiv: Äpfel, Öl, Übung, ß', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.endStructureElement();

  y += 12;

  // Lists Section
  doc.beginStructureElement('H2');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.setFontSize(14);
  doc.text('2. Listen', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  y += 8;

  // Simple list
  doc.beginList();
    doc.beginListItem();
      doc.addListLabel('•', 25, y);
      doc.beginListBody();
        doc.text('Erster Punkt', 30, y);
      doc.endListBody();
    doc.endStructureElement();
    y += 6;

    doc.beginListItem();
      doc.addListLabel('•', 25, y);
      doc.beginListBody();
        doc.text('Zweiter Punkt mit Unterliste:', 30, y);
        y += 6;

        // Nested list
        doc.beginList();
          doc.beginListItem();
            doc.addListLabel('○', 35, y);
            doc.beginListBody();
              doc.text('Unterpunkt A', 40, y);
            doc.endListBody();
          doc.endStructureElement();
          y += 6;

          doc.beginListItem();
            doc.addListLabel('○', 35, y);
            doc.beginListBody();
              doc.text('Unterpunkt B', 40, y);
            doc.endListBody();
          doc.endStructureElement();
          y += 6;
        doc.endList();
      doc.endListBody();
    doc.endStructureElement();

    doc.beginListItem();
      doc.addListLabel('•', 25, y);
      doc.beginListBody();
        doc.text('Dritter Punkt', 30, y);
      doc.endListBody();
    doc.endStructureElement();
    y += 6;
  doc.endList();

  y += 12;

  // Mixed content
  doc.beginStructureElement('H2');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.setFontSize(14);
  doc.text('3. Gemischte Stile', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  y += 8;

  doc.beginStructureElement('P');
  doc.text('Text mit ', 20, y);
  const w1 = doc.getTextWidth('Text mit ');

  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text('fett', 20 + w1, y);
  const w2 = doc.getTextWidth('fett');
  doc.setFont("AtkinsonHyperlegible", "normal");

  doc.text(' und ', 20 + w1 + w2, y);
  const w3 = doc.getTextWidth(' und ');

  doc.setFont("AtkinsonHyperlegible", "italic");
  doc.text('kursiv', 20 + w1 + w2 + w3, y);
  const w4 = doc.getTextWidth('kursiv');
  doc.setFont("AtkinsonHyperlegible", "normal");

  doc.text(' gemischt.', 20 + w1 + w2 + w3 + w4, y);
  doc.endStructureElement();

  // ========================================================================
  // PAGE 2: Tables
  // ========================================================================
  doc.addPage();
  y = 20;

  doc.beginStructureElement('H2');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.setFontSize(14);
  doc.text('4. Tabellen', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  y += 10;

  // Simple but complete table
  doc.beginStructureElement('Table');
    // Table Head
    doc.beginTableHead();
      doc.beginTableRow();
        doc.beginTableHeaderCell('Column');
        doc.setFont("AtkinsonHyperlegible", "bold");
        doc.text('Produkt', 25, y);
        doc.setFont("AtkinsonHyperlegible", "normal");
        doc.endStructureElement();

        doc.beginTableHeaderCell('Column');
        doc.setFont("AtkinsonHyperlegible", "bold");
        doc.text('Q1', 90, y);
        doc.setFont("AtkinsonHyperlegible", "normal");
        doc.endStructureElement();

        doc.beginTableHeaderCell('Column');
        doc.setFont("AtkinsonHyperlegible", "bold");
        doc.text('Q2', 120, y);
        doc.setFont("AtkinsonHyperlegible", "normal");
        doc.endStructureElement();

        doc.beginTableHeaderCell('Column');
        doc.setFont("AtkinsonHyperlegible", "bold");
        doc.text('Q3', 150, y);
        doc.setFont("AtkinsonHyperlegible", "normal");
        doc.endStructureElement();
      doc.endStructureElement();
    doc.endTableHead();

    y += 8;

    // Table Body
    doc.beginTableBody();
      // Row 1
      doc.beginTableRow();
        doc.beginTableHeaderCell('Row');
        doc.setFont("AtkinsonHyperlegible", "bold");
        doc.text('Widget A', 25, y);
        doc.setFont("AtkinsonHyperlegible", "normal");
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('15.000 €', 90, y);
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('16.200 €', 120, y);
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('17.500 €', 150, y);
        doc.endStructureElement();
      doc.endStructureElement();
      y += 7;

      // Row 2
      doc.beginTableRow();
        doc.beginTableHeaderCell('Row');
        doc.setFont("AtkinsonHyperlegible", "bold");
        doc.text('Widget B', 25, y);
        doc.setFont("AtkinsonHyperlegible", "normal");
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('12.500 €', 90, y);
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('13.100 €', 120, y);
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('14.000 €', 150, y);
        doc.endStructureElement();
      doc.endStructureElement();
      y += 7;

      // Row 3
      doc.beginTableRow();
        doc.beginTableHeaderCell('Row');
        doc.setFont("AtkinsonHyperlegible", "bold");
        doc.text('Widget C', 25, y);
        doc.setFont("AtkinsonHyperlegible", "normal");
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('8.200 €', 90, y);
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('9.000 €', 120, y);
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('9.800 €', 150, y);
        doc.endStructureElement();
      doc.endStructureElement();
      y += 7;
    doc.endTableBody();
  doc.endStructureElement();

  y += 12;

  // Links Section
  doc.beginStructureElement('H2');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.setFontSize(14);
  doc.text('5. Links', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  y += 8;

  doc.beginStructureElement('P');
  doc.text('Mehr Info auf ', 20, y);
  const linkX = 20 + doc.getTextWidth('Mehr Info auf ');

  doc.beginLink();
  doc.setFont("AtkinsonHyperlegible", "italic");
  doc.text('unserer Webseite', linkX, y);
  doc.setFont("AtkinsonHyperlegible", "normal");

  const linkWidth = doc.getTextWidth('unserer Webseite');

  // Add annotation and connect it to the Link structure element (PDF/UA requirement)
  const linkObjId = doc.link(linkX, y - 4, linkWidth, 6, { url: 'https://github.com/MrRio/jsPDF' });
  if (linkObjId) {
    doc.addLinkAnnotationRef(linkObjId);
  }
  doc.endLink();

  doc.text('.', linkX + linkWidth, y);
  doc.endStructureElement();

  y += 6;

  doc.beginStructureElement('P');
  doc.setFont("AtkinsonHyperlegible", "italic");
  doc.setFontSize(10);
  doc.text('Link mit OBJR-Verknüpfung (PDF/UA-konform)', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  y += 12;

  // ========================================================================
  // Feature Summary
  // ========================================================================
  doc.beginStructureElement('H2');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.setFontSize(14);
  doc.text('Status-Übersicht', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  y += 8;

  doc.beginStructureElement('H3');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text('Implementiert:', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.endStructureElement();

  y += 7;

  const features = [
    'PDF/UA Grundstruktur',
    'Überschriften (H1-H6)',
    'Font-Stile (4 Varianten)',
    'Listen (verschachtelt)',
    'Tabellen (Row/Column)',
    'Bilder mit Alt-Text'
  ];

  doc.beginList();
  features.forEach(feature => {
    doc.beginListItem();
      doc.addListLabel('✓', 25, y);
      doc.beginListBody();
        doc.text(feature, 32, y);
      doc.endListBody();
    doc.endStructureElement();
    y += 6;
  });
  doc.endList();

  y += 6;

  doc.beginStructureElement('H3');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text('Geplant:', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.endStructureElement();

  y += 7;

  const planned = [
    'Links (vollständig)',
    'Strong/Em-Elemente',
    'Font-Subsetting'
  ];

  doc.beginList();
  planned.forEach(item => {
    doc.beginListItem();
      doc.addListLabel('○', 25, y);
      doc.beginListBody();
        doc.text(item, 32, y);
      doc.endListBody();
    doc.endStructureElement();
    y += 6;
  });
  doc.endList();

  doc.endStructureElement(); // End Document

  // Save the PDF
  const filename = 'examples/temp/comprehensive-test-v2.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));

  console.log('✓ Generiert:', filename);
  console.log('');
  console.log('======================================================================');
  console.log('Umfassendes Testdokument V2 erfolgreich erstellt');
  console.log('======================================================================\n');

  console.log('Das Dokument enthält:');
  console.log('  • 2 Seiten (kompakt)');
  console.log('  • H1, H2, H3 Überschriften');
  console.log('  • Alle 4 Font-Stile');
  console.log('  • Deutsche Umlauts');
  console.log('  • Verschachtelte Listen');
  console.log('  • Tabelle mit Row/Column Headers');
  console.log('  • Gemischte Font-Stile');
  console.log('  • Links (mit Struktur)');
  console.log('  • Feature-Übersicht\n');

  console.log('Bitte mit Screenreader testen!');
  console.log('');

} catch (error) {
  console.log('✗ Fehler:', error.message);
  console.log(error.stack);
}
