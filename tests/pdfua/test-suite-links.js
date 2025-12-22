/**
 * PDF/UA Link Structures Test Suite
 * Tests external links, internal links, and links in various contexts
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Link Structures Test Suite');
console.log('======================================================================\n');

// Test 1: Simple external link
console.log('[Test 1] Simple external link');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('External Link Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('External Links', 10, 10);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Visit our website: ', 10, 30);

    doc.beginLink();
    doc.setTextColor(0, 0, 255); // Blue color for link
    doc.textWithLink('example.com', 52, 30, { url: 'https://example.com' });
    doc.setTextColor(0, 0, 0); // Reset to black
    doc.endLink();

    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-link-1-external.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ External link with URL');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log('');
}

// Test 2: Internal link (to another page)
console.log('[Test 2] Internal link to another page');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Internal Link Test');
  doc.setLanguage('en-US');

  // Page 1 - Table of Contents
  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Table of Contents', 10, 10);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.beginLink();
    doc.setTextColor(0, 0, 255);
    doc.textWithLink('Go to Chapter 1 (Page 2)', 10, 30, { pageNumber: 2 });
    doc.setTextColor(0, 0, 0);
    doc.endLink();
    doc.endStructureElement();

    doc.addPage();

    // Page 2 - Chapter 1
    doc.beginStructureElement('H1');
    doc.text('Chapter 1', 10, 10);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('This is chapter 1 content.', 10, 30);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.beginLink();
    doc.setTextColor(0, 0, 255);
    doc.textWithLink('Back to Table of Contents (Page 1)', 10, 50, { pageNumber: 1 });
    doc.setTextColor(0, 0, 0);
    doc.endLink();
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-link-2-internal.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Internal links between pages');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log('');
}

// Test 3: Links in a list
console.log('[Test 3] Links in a list');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Links in List');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Useful Links', 10, 10);
    doc.endStructureElement();

    doc.beginList();
      doc.beginListItem();
        doc.addListLabel('•', 15, 25);
        doc.beginListBody();
          doc.text('Visit ', 20, 25);
          doc.beginLink();
          doc.setTextColor(0, 0, 255);
          doc.textWithLink('Google', 35, 25, { url: 'https://google.com' });
          doc.setTextColor(0, 0, 0);
          doc.endLink();
        doc.endListBody();
      doc.endStructureElement();

      doc.beginListItem();
        doc.addListLabel('•', 15, 35);
        doc.beginListBody();
          doc.text('Visit ', 20, 35);
          doc.beginLink();
          doc.setTextColor(0, 0, 255);
          doc.textWithLink('GitHub', 35, 35, { url: 'https://github.com' });
          doc.setTextColor(0, 0, 0);
          doc.endLink();
        doc.endListBody();
      doc.endStructureElement();

      doc.beginListItem();
        doc.addListLabel('•', 15, 45);
        doc.beginListBody();
          doc.text('Visit ', 20, 45);
          doc.beginLink();
          doc.setTextColor(0, 0, 255);
          doc.textWithLink('PDF Association', 35, 45, { url: 'https://pdfa.org' });
          doc.setTextColor(0, 0, 0);
          doc.endLink();
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement();

  const filename = 'examples/temp/test-link-3-in-list.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Links embedded in list items');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log('');
}

// Test 4: Links in a table
console.log('[Test 4] Links in a table');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Links in Table');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Resource Table', 10, 10);
    doc.endStructureElement();

    doc.beginStructureElement('Table');
      doc.beginTableHead();
        doc.beginTableRow();
          doc.beginTableHeaderCell('Column');
          doc.text('Resource', 20, 25);
          doc.endStructureElement();

          doc.beginTableHeaderCell('Column');
          doc.text('Link', 80, 25);
          doc.endStructureElement();
        doc.endStructureElement();
      doc.endStructureElement();

      doc.beginTableBody();
        doc.beginTableRow();
          doc.beginTableDataCell();
          doc.text('PDF/UA Standard', 20, 35);
          doc.endStructureElement();

          doc.beginTableDataCell();
          doc.beginLink();
          doc.setTextColor(0, 0, 255);
          doc.textWithLink('View', 80, 35, { url: 'https://pdfa.org/resource/iso-14289-pdfua/' });
          doc.setTextColor(0, 0, 0);
          doc.endLink();
          doc.endStructureElement();
        doc.endStructureElement();

        doc.beginTableRow();
          doc.beginTableDataCell();
          doc.text('veraPDF Validator', 20, 45);
          doc.endStructureElement();

          doc.beginTableDataCell();
          doc.beginLink();
          doc.setTextColor(0, 0, 255);
          doc.textWithLink('Download', 80, 45, { url: 'https://verapdf.org' });
          doc.setTextColor(0, 0, 0);
          doc.endLink();
          doc.endStructureElement();
        doc.endStructureElement();
      doc.endTableBody();
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-link-4-in-table.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Links embedded in table cells');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log('');
}

// Test 5: German language links
console.log('[Test 5] German language links');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Deutsche Links');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Nützliche Verweise', 10, 10);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Besuchen Sie unsere ', 10, 30);
    doc.beginLink();
    doc.setTextColor(0, 0, 255);
    doc.textWithLink('Webseite', 60, 30, { url: 'https://beispiel.de' });
    doc.setTextColor(0, 0, 0);
    doc.endLink();
    doc.text(' für mehr Informationen.', 87, 30);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Weitere Ressourcen:', 10, 50);
    doc.endStructureElement();

    doc.beginList();
      doc.beginListItem();
        doc.addListLabel('•', 15, 60);
        doc.beginListBody();
          doc.beginLink();
          doc.setTextColor(0, 0, 255);
          doc.textWithLink('PDF/UA Übersicht', 20, 60, { url: 'https://pdfa.org' });
          doc.setTextColor(0, 0, 0);
          doc.endLink();
        doc.endListBody();
      doc.endStructureElement();

      doc.beginListItem();
        doc.addListLabel('•', 15, 70);
        doc.beginListBody();
          doc.beginLink();
          doc.setTextColor(0, 0, 255);
          doc.textWithLink('Barrierefreiheit-Richtlinien', 20, 70, { url: 'https://www.w3.org/WAI/' });
          doc.setTextColor(0, 0, 0);
          doc.endLink();
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement();

  const filename = 'examples/temp/test-link-5-german.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ German language links');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log('');
}

// Summary
console.log('======================================================================');
console.log('Test Suite Complete');
console.log('======================================================================\n');

console.log('Generated PDFs:');
console.log('  examples/temp/test-link-1-external.pdf - Simple external link');
console.log('  examples/temp/test-link-2-internal.pdf - Internal page links');
console.log('  examples/temp/test-link-3-in-list.pdf - Links in lists');
console.log('  examples/temp/test-link-4-in-table.pdf - Links in tables');
console.log('  examples/temp/test-link-5-german.pdf - German language\n');

console.log('Next steps:');
console.log('  1. Open PDFs in Acrobat Reader');
console.log('  2. Test with screen reader:');
console.log('     - Screen reader should announce "Link, example.com"');
console.log('     - Links should be keyboard navigable (Tab key)');
console.log('     - External links should open in browser');
console.log('     - Internal links should jump to target page');
console.log('  3. Run veraPDF validation');
console.log('  4. Verify link structure in PDF\n');

console.log('Screen Reader Expected Behavior:');
console.log('  When focusing on a link: "Link, example.com"');
console.log('  When activating link: Opens URL or jumps to page');
console.log('  Links should be in tab order for keyboard navigation\n');
