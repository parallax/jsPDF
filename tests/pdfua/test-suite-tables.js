/**
 * PDF/UA Table Structures Test Suite
 *
 * Tests accessible table support with proper header scope
 *
 * Run: node tests/pdfua/test-suite-tables.js
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('='.repeat(70));
console.log('PDF/UA Table Structures Test Suite');
console.log('='.repeat(70));

// Test 1: Simple table with column headers only
console.log('\n[Test 1] Simple table with column headers');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Simple Table Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
  doc.beginStructureElement('H1');
  doc.text('Product Price List', 10, 10);
  doc.endStructureElement();

  doc.beginStructureElement('Table');
    // Header row with column headers
    doc.beginTableRow();
      doc.beginTableHeaderCell('Column');
      doc.text('Product', 20, 25);
      doc.endStructureElement();

      doc.beginTableHeaderCell('Column');
      doc.text('Price', 80, 25);
      doc.endStructureElement();

      doc.beginTableHeaderCell('Column');
      doc.text('Stock', 120, 25);
      doc.endStructureElement();
    doc.endStructureElement();

    // Data row 1
    doc.beginTableRow();
      doc.beginTableDataCell();
      doc.text('Widget A', 20, 35);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$19.99', 80, 35);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('150', 120, 35);
      doc.endStructureElement();
    doc.endStructureElement();

    // Data row 2
    doc.beginTableRow();
      doc.beginTableDataCell();
      doc.text('Widget B', 20, 45);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$29.99', 80, 45);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('85', 120, 45);
      doc.endStructureElement();
    doc.endStructureElement();
  doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-table-1-column-headers.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);

  const pdfContent = fs.readFileSync(filename, 'utf8');
  if (pdfContent.includes('/Table')) {
    console.log('✓ Table structure element found');
  }
  if (pdfContent.includes('/Scope')) {
    console.log('✓ Scope attribute present');
  }
  if (pdfContent.includes('/Scope /Column')) {
    console.log('✓ Column scope found');
  }

} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log(error.stack);
}

// Test 2: Table with row headers
console.log('\n[Test 2] Table with row headers');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Table with Row Headers');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
  doc.beginStructureElement('H1');
  doc.text('Quarterly Sales', 10, 10);
  doc.endStructureElement();

  doc.beginStructureElement('Table');
    // Header row
    doc.beginTableRow();
      doc.beginTableHeaderCell('Both');
      doc.text('Product', 20, 25);
      doc.endStructureElement();

      doc.beginTableHeaderCell('Column');
      doc.text('Q1', 80, 25);
      doc.endStructureElement();

      doc.beginTableHeaderCell('Column');
      doc.text('Q2', 120, 25);
      doc.endStructureElement();

      doc.beginTableHeaderCell('Column');
      doc.text('Q3', 160, 25);
      doc.endStructureElement();
    doc.endStructureElement();

    // Data row 1 with row header
    doc.beginTableRow();
      doc.beginTableHeaderCell('Row');
      doc.text('Widget A', 20, 35);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$10,000', 80, 35);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$12,000', 120, 35);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$15,000', 160, 35);
      doc.endStructureElement();
    doc.endStructureElement();

    // Data row 2 with row header
    doc.beginTableRow();
      doc.beginTableHeaderCell('Row');
      doc.text('Widget B', 20, 45);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$8,000', 80, 45);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$9,500', 120, 45);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$11,000', 160, 45);
      doc.endStructureElement();
    doc.endStructureElement();
  doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-table-2-row-headers.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);

  const pdfContent = fs.readFileSync(filename, 'utf8');
  if (pdfContent.includes('/Scope /Row')) {
    console.log('✓ Row scope found');
  }
  if (pdfContent.includes('/Scope /Column')) {
    console.log('✓ Column scope found');
  }
  if (pdfContent.includes('/Scope /Both')) {
    console.log('✓ Both scope found (top-left cell)');
  }

} catch (error) {
  console.log('✗ Failed:', error.message);
}

// Test 3: Complex table with mixed headers
console.log('\n[Test 3] Complex table with nested headers');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Complex Table Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
  doc.beginStructureElement('H1');
  doc.text('Annual Revenue Report', 10, 10);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('Revenue breakdown by product and quarter:', 10, 20);
  doc.endStructureElement();

  doc.beginStructureElement('Table');
    // Header row
    doc.beginTableRow();
      doc.beginTableHeaderCell('Both');
      doc.text('Product', 20, 35);
      doc.endStructureElement();

      doc.beginTableHeaderCell('Column');
      doc.text('Q1 2024', 70, 35);
      doc.endStructureElement();

      doc.beginTableHeaderCell('Column');
      doc.text('Q2 2024', 110, 35);
      doc.endStructureElement();

      doc.beginTableHeaderCell('Column');
      doc.text('Total', 150, 35);
      doc.endStructureElement();
    doc.endStructureElement();

    // Data rows
    doc.beginTableRow();
      doc.beginTableHeaderCell('Row');
      doc.text('Widget A', 20, 45);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$25,000', 70, 45);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$30,000', 110, 45);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$55,000', 150, 45);
      doc.endStructureElement();
    doc.endStructureElement();

    doc.beginTableRow();
      doc.beginTableHeaderCell('Row');
      doc.text('Widget B', 20, 55);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$18,000', 70, 55);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$22,000', 110, 55);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$40,000', 150, 55);
      doc.endStructureElement();
    doc.endStructureElement();

    // Total row
    doc.beginTableRow();
      doc.beginTableHeaderCell('Row');
      doc.text('Total', 20, 65);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$43,000', 70, 65);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$52,000', 110, 65);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('$95,000', 150, 65);
      doc.endStructureElement();
    doc.endStructureElement();
  doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-table-3-complex.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);

  const pdfContent = fs.readFileSync(filename, 'utf8');
  const trCount = (pdfContent.match(/\/TR/g) || []).length;
  const thCount = (pdfContent.match(/\/TH/g) || []).length;
  const tdCount = (pdfContent.match(/\/TD/g) || []).length;
  console.log(`✓ Structure elements: ${trCount} rows, ${thCount} headers, ${tdCount} data cells`);

} catch (error) {
  console.log('✗ Failed:', error.message);
}

// Test 4: German language table
console.log('\n[Test 4] German language table');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Deutsche Tabelle');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
  doc.beginStructureElement('H1');
  doc.text('Produktpreisliste', 10, 10);
  doc.endStructureElement();

  doc.beginStructureElement('Table');
    // Header row
    doc.beginTableRow();
      doc.beginTableHeaderCell('Column');
      doc.text('Produkt', 20, 25);
      doc.endStructureElement();

      doc.beginTableHeaderCell('Column');
      doc.text('Preis', 80, 25);
      doc.endStructureElement();

      doc.beginTableHeaderCell('Column');
      doc.text('Lager', 120, 25);
      doc.endStructureElement();
    doc.endStructureElement();

    // Data row
    doc.beginTableRow();
      doc.beginTableDataCell();
      doc.text('Widget A', 20, 35);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('19,99 €', 80, 35);
      doc.endStructureElement();

      doc.beginTableDataCell();
      doc.text('150', 120, 35);
      doc.endStructureElement();
    doc.endStructureElement();
  doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-table-4-german.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);

  const pdfContent = fs.readFileSync(filename, 'utf8');
  if (pdfContent.includes('de-DE')) {
    console.log('✓ German language tag present');
  }

} catch (error) {
  console.log('✗ Failed:', error.message);
}

// Test 5: Invalid scope should throw error
console.log('\n[Test 5] Invalid scope validation');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.beginStructureElement('Document');
  doc.beginStructureElement('Table');
    doc.beginTableRow();
      // This should throw error (invalid scope)
      doc.beginTableHeaderCell('Invalid');

  console.log('✗ Should have thrown error for invalid scope');

} catch (error) {
  if (error.message.includes('scope must be')) {
    console.log('✓ Error thrown for invalid scope');
    console.log('✓ Error message:', error.message);
  } else {
    console.log('✗ Unexpected error:', error.message);
  }
}

console.log('\n' + '='.repeat(70));
console.log('Test Suite Complete');
console.log('='.repeat(70));
console.log('\nGenerated PDFs:');
console.log('  examples/temp/test-table-1-column-headers.pdf - Simple table');
console.log('  examples/temp/test-table-2-row-headers.pdf - Row headers');
console.log('  examples/temp/test-table-3-complex.pdf - Complex table');
console.log('  examples/temp/test-table-4-german.pdf - German language');
console.log('\nNext steps:');
console.log('  1. Open PDFs in Acrobat Reader');
console.log('  2. Test with screen reader navigation:');
console.log('     - Navigate through table cells');
console.log('     - Verify headers are announced');
console.log('     - Test both horizontal and vertical navigation');
console.log('  3. Run veraPDF validation');
console.log('  4. Verify /Scope attributes in PDF structure');
console.log('\nScreen Reader Expected Behavior:');
console.log('  When navigating to cell (2,2) in test-table-2:');
console.log('  Screen reader should announce: "Widget A, Q2, $12,000"');
console.log('                                    ↑        ↑      ↑    ');
console.log('                                  Row     Column  Cell  ');
console.log('                                 header   header  value ');
