/**
 * PDF/UA Comprehensive Test Document
 * Demonstrates all implemented features in a single document
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Comprehensive Test Document');
console.log('======================================================================\n');

try {
  const doc = new jsPDF({ pdfUA: true });

  // Document metadata
  doc.setDocumentTitle('PDF/UA Comprehensive Test Document');
  doc.setLanguage('de-DE');
  doc.setProperties({
    subject: 'Test aller implementierten PDF/UA-Features',
    creator: 'jsPDF-UA Library',
    keywords: 'PDF/UA, Barrierefreiheit, Accessibility, Test'
  });

  doc.beginStructureElement('Document');

  // ========================================================================
  // Title Page with different heading levels
  // ========================================================================
  let y = 20;

  doc.beginStructureElement('H1');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.setFontSize(24);
  doc.text('Umfassender PDF/UA Test', 105, y, { align: 'center' });
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  y += 15;

  doc.beginStructureElement('P');
  doc.setFont("AtkinsonHyperlegible", "italic");
  doc.text('Dieses Dokument demonstriert alle implementierten Features', 105, y, { align: 'center' });
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.endStructureElement();

  y += 20;

  // ========================================================================
  // Section 1: Font Styles
  // ========================================================================
  doc.beginStructureElement('H2');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.setFontSize(16);
  doc.text('1. Schriftstile', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  y += 10;

  doc.beginStructureElement('P');
  doc.text('Atkinson Hyperlegible unterstützt vier Stile:', 20, y);
  doc.endStructureElement();

  y += 8;

  doc.beginStructureElement('P');
  doc.text('Regular: Äpfel, Öl, Übung, Größe, ß', 20, y);
  doc.endStructureElement();

  y += 6;

  doc.beginStructureElement('P');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text('Fett: Äpfel, Öl, Übung, Größe, ß', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.endStructureElement();

  y += 6;

  doc.beginStructureElement('P');
  doc.setFont("AtkinsonHyperlegible", "italic");
  doc.text('Kursiv: Äpfel, Öl, Übung, Größe, ß', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.endStructureElement();

  y += 6;

  doc.beginStructureElement('P');
  doc.setFont("AtkinsonHyperlegible", "bolditalic");
  doc.text('Fett Kursiv: Äpfel, Öl, Übung, Größe, ß', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.endStructureElement();

  y += 12;

  // ========================================================================
  // Section 2: Lists
  // ========================================================================
  doc.beginStructureElement('H2');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.setFontSize(16);
  doc.text('2. Listen', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  y += 10;

  doc.beginStructureElement('H3');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text('Einfache Liste:', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.endStructureElement();

  y += 8;

  doc.beginList();
    doc.beginListItem();
      doc.addListLabel('•', 25, y);
      doc.beginListBody();
        doc.text('Erster Eintrag', 30, y);
      doc.endListBody();
    doc.endStructureElement();
    y += 6;

    doc.beginListItem();
      doc.addListLabel('•', 25, y);
      doc.beginListBody();
        doc.text('Zweiter Eintrag', 30, y);
      doc.endListBody();
    doc.endStructureElement();
    y += 6;

    doc.beginListItem();
      doc.addListLabel('•', 25, y);
      doc.beginListBody();
        doc.text('Dritter Eintrag', 30, y);
      doc.endListBody();
    doc.endStructureElement();
    y += 6;
  doc.endList();

  y += 6;

  doc.beginStructureElement('H3');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text('Verschachtelte Liste:', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.endStructureElement();

  y += 8;

  doc.beginList();
    doc.beginListItem();
      doc.addListLabel('1.', 25, y);
      doc.beginListBody();
        doc.text('Hauptpunkt mit Unterpunkten:', 32, y);
        y += 6;

        // Nested list
        doc.beginList();
          doc.beginListItem();
            doc.addListLabel('•', 35, y);
            doc.beginListBody();
              doc.text('Unterpunkt A', 40, y);
            doc.endListBody();
          doc.endStructureElement();
          y += 6;

          doc.beginListItem();
            doc.addListLabel('•', 35, y);
            doc.beginListBody();
              doc.text('Unterpunkt B', 40, y);
            doc.endListBody();
          doc.endStructureElement();
          y += 6;
        doc.endList();
      doc.endListBody();
    doc.endStructureElement();

    doc.beginListItem();
      doc.addListLabel('2.', 25, y);
      doc.beginListBody();
        doc.text('Zweiter Hauptpunkt', 32, y);
      doc.endListBody();
    doc.endStructureElement();
    y += 6;
  doc.endList();

  y += 10;

  // ========================================================================
  // New Page: Tables
  // ========================================================================
  doc.addPage();
  y = 20;

  doc.beginStructureElement('H2');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.setFontSize(16);
  doc.text('3. Tabellen', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  y += 10;

  doc.beginStructureElement('H3');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text('Produktkatalog:', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.endStructureElement();

  y += 8;

  // Table with column and row headers
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
        doc.text('Q1', 80, y);
        doc.setFont("AtkinsonHyperlegible", "normal");
        doc.endStructureElement();

        doc.beginTableHeaderCell('Column');
        doc.setFont("AtkinsonHyperlegible", "bold");
        doc.text('Q2', 110, y);
        doc.setFont("AtkinsonHyperlegible", "normal");
        doc.endStructureElement();

        doc.beginTableHeaderCell('Column');
        doc.setFont("AtkinsonHyperlegible", "bold");
        doc.text('Q3', 140, y);
        doc.setFont("AtkinsonHyperlegible", "normal");
        doc.endStructureElement();

        doc.beginTableHeaderCell('Column');
        doc.setFont("AtkinsonHyperlegible", "bold");
        doc.text('Q4', 170, y);
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
        doc.text('12.500 €', 80, y);
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('13.200 €', 110, y);
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('14.100 €', 140, y);
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('15.300 €', 170, y);
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
        doc.text('8.900 €', 80, y);
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('9.300 €', 110, y);
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('9.800 €', 140, y);
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('10.500 €', 170, y);
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
        doc.text('6.200 €', 80, y);
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('6.700 €', 110, y);
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('7.100 €', 140, y);
        doc.endStructureElement();

        doc.beginTableDataCell();
        doc.text('7.800 €', 170, y);
        doc.endStructureElement();
      doc.endStructureElement();

      y += 7;
    doc.endTableBody();
  doc.endStructureElement();

  y += 12;

  // ========================================================================
  // Section 4: Mixed Content
  // ========================================================================
  doc.beginStructureElement('H2');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.setFontSize(16);
  doc.text('4. Gemischter Inhalt', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  y += 10;

  doc.beginStructureElement('P');
  doc.text('Dieser Absatz enthält ', 20, y);
  const w1 = doc.getTextWidth('Dieser Absatz enthält ');

  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text('fetten Text', 20 + w1, y);
  const w2 = doc.getTextWidth('fetten Text');
  doc.setFont("AtkinsonHyperlegible", "normal");

  doc.text(' und ', 20 + w1 + w2, y);
  const w3 = doc.getTextWidth(' und ');

  doc.setFont("AtkinsonHyperlegible", "italic");
  doc.text('kursiven Text', 20 + w1 + w2 + w3, y);
  const w4 = doc.getTextWidth('kursiven Text');
  doc.setFont("AtkinsonHyperlegible", "normal");

  doc.text(' in einem Satz.', 20 + w1 + w2 + w3 + w4, y);
  doc.endStructureElement();

  y += 10;

  // ========================================================================
  // Section 5: Links (Partial Implementation)
  // ========================================================================
  doc.beginStructureElement('H2');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.setFontSize(16);
  doc.text('5. Links (teilweise implementiert)', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  y += 10;

  doc.beginStructureElement('P');
  doc.text('Weitere Informationen finden Sie auf ', 20, y);
  const linkX = 20 + doc.getTextWidth('Weitere Informationen finden Sie auf ');

  doc.beginLink();
  doc.setFont("AtkinsonHyperlegible", "italic");
  doc.text('unserer Webseite', linkX, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.endLink();

  const linkWidth = doc.getTextWidth('unserer Webseite');
  doc.text('.', linkX + linkWidth, y);

  // Add clickable annotation
  doc.link(linkX, y - 4, linkWidth, 6, { url: 'https://github.com/MrRio/jsPDF' });
  doc.endStructureElement();

  y += 8;

  doc.beginStructureElement('P');
  doc.setFont("AtkinsonHyperlegible", "italic");
  doc.setFontSize(10);
  doc.text('Hinweis: Link-Struktur vorhanden, Annotation-Verknüpfung fehlt noch.', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  y += 15;

  // ========================================================================
  // New Page: Feature Summary
  // ========================================================================
  doc.addPage();
  y = 20;

  doc.beginStructureElement('H2');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.setFontSize(16);
  doc.text('Zusammenfassung der Features', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  y += 10;

  doc.beginStructureElement('H3');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text('Implementierte Features:', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.endStructureElement();

  y += 8;

  const features = [
    { status: '✓', text: 'PDF/UA Grundstruktur (XMP Metadata, DisplayDocTitle)' },
    { status: '✓', text: 'Structure Tree mit Marked Content System' },
    { status: '✓', text: 'Überschriften (H1-H6) und Absätze (P)' },
    { status: '✓', text: 'Font Embedding (Atkinson Hyperlegible)' },
    { status: '✓', text: 'Alle Font-Stile (Regular, Bold, Italic, BoldItalic)' },
    { status: '✓', text: 'Deutsche Umlauts und Sonderzeichen' },
    { status: '✓', text: 'Bilder mit Alt-Text und Decorative-Flag' },
    { status: '✓', text: 'Listen (einfach und verschachtelt)' },
    { status: '✓', text: 'Tabellen mit Row/Column Scope' },
    { status: '⚠', text: 'Links (Struktur vorhanden, Annotation-Verknüpfung fehlt)' }
  ];

  doc.beginList();
  features.forEach(feature => {
    doc.beginListItem();
      doc.addListLabel(feature.status, 25, y);
      doc.beginListBody();
        doc.text(feature.text, 35, y);
      doc.endListBody();
    doc.endStructureElement();
    y += 6;
  });
  doc.endList();

  y += 10;

  doc.beginStructureElement('H3');
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text('Geplante Features:', 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.endStructureElement();

  y += 8;

  const planned = [
    'Link-Annotation-Verknüpfung (/StructParent)',
    'Semantische Hervorhebungen (Strong/Em)',
    'Font-Subsetting zur Größenreduzierung (optional)'
  ];

  doc.beginList();
  planned.forEach(item => {
    doc.beginListItem();
      doc.addListLabel('○', 25, y);
      doc.beginListBody();
        doc.text(item, 35, y);
      doc.endListBody();
    doc.endStructureElement();
    y += 6;
  });
  doc.endList();

  y += 15;

  // ========================================================================
  // Footer
  // ========================================================================
  doc.beginStructureElement('P');
  doc.setFont("AtkinsonHyperlegible", "italic");
  doc.setFontSize(10);
  doc.text('Generiert mit jsPDF-UA Library', 105, y, { align: 'center' });
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.setFontSize(12);
  doc.endStructureElement();

  doc.endStructureElement(); // End Document

  // Save the PDF
  const filename = 'examples/temp/comprehensive-test.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));

  console.log('✓ Generiert:', filename);
  console.log('');
  console.log('======================================================================');
  console.log('Umfassendes Testdokument erfolgreich erstellt');
  console.log('======================================================================\n');

  console.log('Das Dokument enthält:');
  console.log('  • 3 Seiten');
  console.log('  • Überschriften (H1, H2, H3)');
  console.log('  • Alle 4 Font-Stile');
  console.log('  • Deutsche Umlauts und Sonderzeichen');
  console.log('  • Einfache und verschachtelte Listen');
  console.log('  • Komplexe Tabelle mit Row/Column Headers');
  console.log('  • Gemischte Font-Stile in einem Absatz');
  console.log('  • Links (mit Struktur, ohne Annotation-Verknüpfung)');
  console.log('  • Feature-Übersicht\n');

  console.log('Nächste Schritte:');
  console.log('  1. PDF in Acrobat Reader öffnen');
  console.log('  2. Mit Screenreader testen (NVDA/JAWS)');
  console.log('  3. Navigation durch alle Elemente prüfen');
  console.log('  4. veraPDF-Validierung durchführen\n');

} catch (error) {
  console.log('✗ Fehler:', error.message);
  console.log(error.stack);
}
