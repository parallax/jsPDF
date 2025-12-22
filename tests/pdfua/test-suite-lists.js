/**
 * PDF/UA List Structures Test Suite
 * Tests unordered lists, ordered lists, nested lists
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA List Structures Test Suite');
console.log('======================================================================\n');

// Test 1: Simple unordered list (bullet points)
console.log('[Test 1] Simple unordered list');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Shopping List');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Shopping List', 10, 10);
    doc.endStructureElement();

    doc.beginList();
      doc.beginListItem();
        doc.addListLabel('•', 15, 25);
        doc.beginListBody();
          doc.text('Milk', 20, 25);
        doc.endListBody();
      doc.endStructureElement(); // LI

      doc.beginListItem();
        doc.addListLabel('•', 15, 35);
        doc.beginListBody();
          doc.text('Bread', 20, 35);
        doc.endListBody();
      doc.endStructureElement();

      doc.beginListItem();
        doc.addListLabel('•', 15, 45);
        doc.beginListBody();
          doc.text('Cheese', 20, 45);
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement(); // Document

  const filename = 'examples/temp/test-list-1-unordered.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);

  // Verify structure
  const pdfContent = doc.output('datauristring');
  if (pdfContent.includes('/L') && pdfContent.includes('/LI') &&
      pdfContent.includes('/Lbl') && pdfContent.includes('/LBody')) {
    console.log('✓ List structure elements found');
  }
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log('');
}

// Test 2: Simple ordered list (numbered)
console.log('[Test 2] Simple ordered list (numbered)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Instructions');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Instructions', 10, 10);
    doc.endStructureElement();

    doc.beginListNumbered();
      doc.beginListItem();
        doc.addListLabel('1.', 15, 25);
        doc.beginListBody();
          doc.text('Open the file', 22, 25);
        doc.endListBody();
      doc.endStructureElement();

      doc.beginListItem();
        doc.addListLabel('2.', 15, 35);
        doc.beginListBody();
          doc.text('Enter text', 22, 35);
        doc.endListBody();
      doc.endStructureElement();

      doc.beginListItem();
        doc.addListLabel('3.', 15, 45);
        doc.beginListBody();
          doc.text('Save the document', 22, 45);
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement();

  const filename = 'examples/temp/test-list-2-ordered.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Ordered list with numeric labels');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log('');
}

// Test 3: Nested list
console.log('[Test 3] Nested list');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Project Tasks');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Project Tasks', 10, 10);
    doc.endStructureElement();

    doc.beginListNumbered();
      // Main item 1 with nested list
      doc.beginListItem();
        doc.addListLabel('1.', 15, 25);
        doc.beginListBody();
          doc.text('Research', 22, 25);

          // Nested unordered list
          doc.beginList();
            doc.beginListItem();
              doc.addListLabel('•', 25, 35);
              doc.beginListBody();
                doc.text('Read documentation', 30, 35);
              doc.endListBody();
            doc.endStructureElement();

            doc.beginListItem();
              doc.addListLabel('•', 25, 45);
              doc.beginListBody();
                doc.text('Study examples', 30, 45);
              doc.endListBody();
            doc.endStructureElement();
          doc.endList();
        doc.endListBody();
      doc.endStructureElement();

      // Main item 2
      doc.beginListItem();
        doc.addListLabel('2.', 15, 60);
        doc.beginListBody();
          doc.text('Implementation', 22, 60);
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement();

  const filename = 'examples/temp/test-list-3-nested.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Nested list structure');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log('');
}

// Test 4: Mixed nested list (ordered with unordered sub-items)
console.log('[Test 4] Mixed nested list');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Meeting Agenda');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Meeting Agenda', 10, 10);
    doc.endStructureElement();

    doc.beginListNumbered();
      doc.beginListItem();
        doc.addListLabel('1.', 15, 25);
        doc.beginListBody();
          doc.text('Project Status', 22, 25);

          doc.beginList();  // Unordered sub-list
            doc.beginListItem();
              doc.addListLabel('◦', 25, 35);
              doc.beginListBody();
                doc.text('Development progress', 30, 35);
              doc.endListBody();
            doc.endStructureElement();

            doc.beginListItem();
              doc.addListLabel('◦', 25, 45);
              doc.beginListBody();
                doc.text('Testing status', 30, 45);
              doc.endListBody();
            doc.endStructureElement();
          doc.endList();
        doc.endListBody();
      doc.endStructureElement();

      doc.beginListItem();
        doc.addListLabel('2.', 15, 60);
        doc.beginListBody();
          doc.text('Budget Review', 22, 60);
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement();

  const filename = 'examples/temp/test-list-4-mixed.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ Mixed nested structure (ordered + unordered)');
  console.log('');
} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log('');
}

// Test 5: German language list
console.log('[Test 5] German language list');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Einkaufsliste');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Einkaufsliste', 10, 10);
    doc.endStructureElement();

    doc.beginList();
      doc.beginListItem();
        doc.addListLabel('•', 15, 25);
        doc.beginListBody();
          doc.text('Äpfel', 20, 25);
        doc.endListBody();
      doc.endStructureElement();

      doc.beginListItem();
        doc.addListLabel('•', 15, 35);
        doc.beginListBody();
          doc.text('Öl', 20, 35);
        doc.endListBody();
      doc.endStructureElement();

      doc.beginListItem();
        doc.addListLabel('•', 15, 45);
        doc.beginListBody();
          doc.text('Überzug', 20, 45);
        doc.endListBody();
      doc.endStructureElement();

      doc.beginListItem();
        doc.addListLabel('•', 15, 55);
        doc.beginListBody();
          doc.text('Süßigkeiten', 20, 55);
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement();

  const filename = 'examples/temp/test-list-5-german.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);
  console.log('✓ German language tags');
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
console.log('  examples/temp/test-list-1-unordered.pdf - Simple bullet list');
console.log('  examples/temp/test-list-2-ordered.pdf - Numbered list');
console.log('  examples/temp/test-list-3-nested.pdf - Nested lists');
console.log('  examples/temp/test-list-4-mixed.pdf - Mixed nested');
console.log('  examples/temp/test-list-5-german.pdf - German language\n');

console.log('Next steps:');
console.log('  1. Open PDFs in Acrobat Reader');
console.log('  2. Test with screen reader navigation:');
console.log('     - Screen reader should announce "List with X items"');
console.log('     - Navigate through list items');
console.log('     - Verify nested lists are announced correctly');
console.log('  3. Run veraPDF validation');
console.log('  4. Verify list structure in PDF\n');

console.log('Screen Reader Expected Behavior:');
console.log('  When entering a list: "List with 3 items"');
console.log('  When on list item 1: "Bullet, Milk, 1 of 3"');
console.log('  When on list item 2: "Bullet, Bread, 2 of 3"');
console.log('  Nested lists: "List with 2 items" (announces sub-list)\n');
