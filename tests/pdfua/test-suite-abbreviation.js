/**
 * PDF/UA Abbreviation Element Test Suite
 * Tests abbreviations with expansion text (/E attribute)
 *
 * Sprint 22: Abbreviations (BITi 02.2.3.1)
 *
 * The /E (Expansion) attribute provides the full form of abbreviations
 * for screen readers. According to PDF 1.7 spec (14.9.5), this helps
 * users understand acronyms and short forms.
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Abbreviation Element Test Suite');
console.log('======================================================================\n');

// Test 1: Basic abbreviation
console.log('[Test 1] Basic abbreviation');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Basic Abbreviation Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Abkürzungen Test', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Die ', x, 40);
    x += doc.getTextWidth('Die ');

    // Abbreviation with expansion
    doc.beginAbbreviation('Europäische Union');
    doc.text('EU', x, 40);
    x += doc.getTextWidth('EU');
    doc.endAbbreviation();

    doc.text(' hat 27 Mitgliedsstaaten.', x, 40);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-abbr-1-basic.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Basic abbreviation "EU" with expansion "Europäische Union"');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: Multiple abbreviations in one paragraph
console.log('[Test 2] Multiple abbreviations');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Multiple Abbreviations Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Technische Dokumentation', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Das ', x, 40);
    x += doc.getTextWidth('Das ');

    doc.beginAbbreviation('Portable Document Format');
    doc.text('PDF', x, 40);
    x += doc.getTextWidth('PDF');
    doc.endAbbreviation();

    doc.text('-Format unterstützt ', x, 40);
    x += doc.getTextWidth('-Format unterstützt ');

    doc.beginAbbreviation('Hypertext Markup Language');
    doc.text('HTML', x, 40);
    x += doc.getTextWidth('HTML');
    doc.endAbbreviation();

    doc.text(' und ', x, 40);
    x += doc.getTextWidth(' und ');

    doc.beginAbbreviation('Cascading Style Sheets');
    doc.text('CSS', x, 40);
    x += doc.getTextWidth('CSS');
    doc.endAbbreviation();

    doc.text('.', x, 40);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-abbr-2-multiple.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Multiple abbreviations: PDF, HTML, CSS');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 3: Abbreviation in table header
console.log('[Test 3] Abbreviation in table header');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Table Abbreviations Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Quartalsbericht', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('Table');
      // Header row
      doc.beginTableHead();
        doc.beginTableRow();
          // Monat header
          doc.beginTableHeaderCell('Column');
          doc.text('Monat', 20, 45);
          doc.endStructureElement();

          // Jan header with abbreviation
          doc.beginTableHeaderCell('Column');
          doc.beginAbbreviation('Januar');
          doc.text('Jan', 50, 45);
          doc.endAbbreviation();
          doc.endStructureElement();

          // Feb header
          doc.beginTableHeaderCell('Column');
          doc.beginAbbreviation('Februar');
          doc.text('Feb', 75, 45);
          doc.endAbbreviation();
          doc.endStructureElement();

          // Mär header
          doc.beginTableHeaderCell('Column');
          doc.beginAbbreviation('März');
          doc.text('Mär', 100, 45);
          doc.endAbbreviation();
          doc.endStructureElement();
        doc.endStructureElement();
      doc.endTableHead();

      // Body row
      doc.beginTableBody();
        doc.beginTableRow();
          doc.beginTableHeaderCell('Row');
          doc.text('Umsatz', 20, 60);
          doc.endStructureElement();

          doc.beginTableDataCell();
          doc.text('1.200', 50, 60);
          doc.endStructureElement();

          doc.beginTableDataCell();
          doc.text('1.350', 75, 60);
          doc.endStructureElement();

          doc.beginTableDataCell();
          doc.text('1.100', 100, 60);
          doc.endStructureElement();
        doc.endStructureElement();
      doc.endTableBody();
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-abbr-3-table.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Table with abbreviated month names: Jan, Feb, Mär');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 4: Units and measurements
console.log('[Test 4] Units and measurements');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Units Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Produktspezifikationen', 10, 20);
    doc.endStructureElement();

    // Weight
    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Gewicht: 5 ', x, 40);
    x += doc.getTextWidth('Gewicht: 5 ');
    doc.beginAbbreviation('Kilogramm');
    doc.text('kg', x, 40);
    doc.endAbbreviation();
    doc.endStructureElement();

    // Size
    doc.beginStructureElement('P');
    x = 10;
    doc.text('Größe: 120 x 80 ', x, 55);
    x += doc.getTextWidth('Größe: 120 x 80 ');
    doc.beginAbbreviation('Zentimeter');
    doc.text('cm', x, 55);
    doc.endAbbreviation();
    doc.endStructureElement();

    // Temperature
    doc.beginStructureElement('P');
    x = 10;
    doc.text('Betriebstemperatur: -10 bis 40 ', x, 70);
    x += doc.getTextWidth('Betriebstemperatur: -10 bis 40 ');
    doc.beginAbbreviation('Grad Celsius');
    doc.text('°C', x, 70);
    doc.endAbbreviation();
    doc.endStructureElement();

    // Power
    doc.beginStructureElement('P');
    x = 10;
    doc.text('Leistung: 2.500 ', x, 85);
    x += doc.getTextWidth('Leistung: 2.500 ');
    doc.beginAbbreviation('Watt');
    doc.text('W', x, 85);
    x += doc.getTextWidth('W');
    doc.text(' (entspricht 2,5 ', x, 85);
    x += doc.getTextWidth(' (entspricht 2,5 ');
    doc.beginAbbreviation('Kilowatt');
    doc.text('kW', x, 85);
    doc.endAbbreviation();
    doc.text(')', x + doc.getTextWidth('kW'), 85);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-abbr-4-units.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Units: kg, cm, °C, W, kW');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 5: English abbreviations with language change
console.log('[Test 5] English abbreviations with language change');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('English Abbreviations in German Document');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Internationale Standards', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Der ', x, 40);
    x += doc.getTextWidth('Der ');

    // English abbreviation with language tag
    doc.beginAbbreviation('World Wide Web Consortium', { lang: 'en-US' });
    doc.text('W3C', x, 40);
    x += doc.getTextWidth('W3C');
    doc.endAbbreviation();

    doc.text(' entwickelt ', x, 40);
    x += doc.getTextWidth(' entwickelt ');

    doc.beginAbbreviation('Hypertext Markup Language', { lang: 'en-US' });
    doc.text('HTML', x, 40);
    x += doc.getTextWidth('HTML');
    doc.endAbbreviation();

    doc.text('-Standards.', x, 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    x = 10;
    doc.text('Die ', x, 60);
    x += doc.getTextWidth('Die ');

    doc.beginAbbreviation('International Organization for Standardization', { lang: 'en-US' });
    doc.text('ISO', x, 60);
    x += doc.getTextWidth('ISO');
    doc.endAbbreviation();

    doc.text(' definiert den ', x, 60);
    x += doc.getTextWidth(' definiert den ');

    doc.beginAbbreviation('Portable Document Format', { lang: 'en-US' });
    doc.text('PDF', x, 60);
    x += doc.getTextWidth('PDF');
    doc.endAbbreviation();

    doc.text('-Standard.', x, 60);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-abbr-5-english.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  English abbreviations (W3C, HTML, ISO, PDF) with lang="en-US"');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 6: Academic/professional titles
console.log('[Test 6] Academic and professional titles');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Professional Titles Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Kontaktdaten', 10, 20);
    doc.endStructureElement();

    // Dr.
    doc.beginStructureElement('P');
    let x = 10;
    doc.beginAbbreviation('Doktor');
    doc.text('Dr.', x, 40);
    x += doc.getTextWidth('Dr.');
    doc.endAbbreviation();
    doc.text(' Maria Schmidt', x, 40);
    doc.endStructureElement();

    // Prof. Dr.
    doc.beginStructureElement('P');
    x = 10;
    doc.beginAbbreviation('Professor');
    doc.text('Prof.', x, 55);
    x += doc.getTextWidth('Prof.');
    doc.endAbbreviation();
    doc.text(' ', x, 55);
    x += doc.getTextWidth(' ');
    doc.beginAbbreviation('Doktor');
    doc.text('Dr.', x, 55);
    x += doc.getTextWidth('Dr.');
    doc.endAbbreviation();
    doc.text(' Hans Müller', x, 55);
    doc.endStructureElement();

    // Dipl.-Ing.
    doc.beginStructureElement('P');
    x = 10;
    doc.beginAbbreviation('Diplom-Ingenieur');
    doc.text('Dipl.-Ing.', x, 70);
    x += doc.getTextWidth('Dipl.-Ing.');
    doc.endAbbreviation();
    doc.text(' Thomas Weber', x, 70);
    doc.endStructureElement();

    // RA
    doc.beginStructureElement('P');
    x = 10;
    doc.beginAbbreviation('Rechtsanwalt');
    doc.text('RA', x, 85);
    x += doc.getTextWidth('RA');
    doc.endAbbreviation();
    doc.text(' Klaus Becker', x, 85);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-abbr-6-titles.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Professional titles: Dr., Prof., Dipl.-Ing., RA');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 7: Validation - missing expansion should throw error
console.log('[Test 7] Validation - missing expansion');
try {
  const doc = new jsPDF({ pdfUA: true });
  doc.setLanguage('de-DE');
  doc.beginStructureElement('Document');
  doc.beginStructureElement('P');

  // This should throw an error
  doc.beginAbbreviation(); // Missing expansion text

  console.log('  FAILED: Should have thrown an error for missing expansion');
  console.log('');
} catch (error) {
  if (error.message.includes('expansion')) {
    console.log('  PASSED: Correctly threw error for missing expansion');
    console.log('  Error:', error.message);
  } else {
    console.log('  FAILED: Wrong error:', error.message);
  }
  console.log('');
}

console.log('======================================================================');
console.log('Test Summary');
console.log('======================================================================');
console.log('All test PDFs generated in examples/temp/');
console.log('');
console.log('Files created:');
console.log('  - test-abbr-1-basic.pdf');
console.log('  - test-abbr-2-multiple.pdf');
console.log('  - test-abbr-3-table.pdf');
console.log('  - test-abbr-4-units.pdf');
console.log('  - test-abbr-5-english.pdf');
console.log('  - test-abbr-6-titles.pdf');
console.log('');
console.log('Screenreader Testing:');
console.log('  - NVDA/JAWS should read the expansion instead of/alongside the abbreviation');
console.log('  - Example: "EU" should be read as "Europäische Union" or "EU, Europäische Union"');
console.log('');
console.log('PDF Structure:');
console.log('  - Abbreviations use Span element with /E attribute');
console.log('  - Format: /S /Span /E (expansion text)');
console.log('');
console.log('veraPDF Validation:');
console.log('  docker run --rm -v $(pwd)/examples/temp:/data verapdf/verapdf:latest --flavour ua1 /data/test-abbr-1-basic.pdf');
console.log('======================================================================');
