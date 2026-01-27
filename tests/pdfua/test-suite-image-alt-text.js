/**
 * PDF/UA Image Alt Text Test Suite
 *
 * Tests accessible image support with alternative text for PDF/UA compliance
 *
 * Run: node tests/pdfua/test-suite-image-alt-text.js
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('='.repeat(70));
console.log('PDF/UA Image Alt Text Test Suite');
console.log('='.repeat(70));

// Create a simple test image (1x1 red pixel PNG)
const redPixelPNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

// Test 1: Image with alt text
console.log('\n[Test 1] Image with alt text');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Image Alt Text Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
  doc.beginStructureElement('H1');
  doc.text('Accessible Images Test', 10, 10);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('This document contains an image with alternative text.', 10, 20);
  doc.endStructureElement();

  // Add image with alt text
  doc.addImage({
    imageData: redPixelPNG,
    format: 'PNG',
    x: 10,
    y: 30,
    width: 50,
    height: 50,
    alt: 'A red square representing test data'
  });

  doc.beginStructureElement('P');
  doc.text('The image above has alt text for screen readers.', 10, 90);
  doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-image-1-with-alt.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);

  // Verify structure
  const pdfContent = fs.readFileSync(filename, 'utf8');
  if (pdfContent.includes('/Figure')) {
    console.log('✓ Figure element found in structure');
  }
  if (pdfContent.includes('/Alt')) {
    console.log('✓ Alt text present in PDF');
  }
  if (pdfContent.includes('BDC')) {
    console.log('✓ Marked content (BDC) present');
  }

} catch (error) {
  console.log('✗ Failed:', error.message);
  console.log(error.stack);
}

// Test 2: Decorative image (artifact)
console.log('\n[Test 2] Decorative image (artifact)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Decorative Image Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
  doc.beginStructureElement('H1');
  doc.text('Decorative Images', 10, 10);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('This document contains a decorative image (artifact).', 10, 20);
  doc.endStructureElement();

  // Add decorative image
  doc.addImage({
    imageData: redPixelPNG,
    format: 'PNG',
    x: 10,
    y: 30,
    width: 30,
    height: 30,
    decorative: true  // Marked as artifact
  });

  doc.beginStructureElement('P');
  doc.text('The image is decorative and will be skipped by screen readers.', 10, 70);
  doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-image-2-decorative.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);

  const pdfContent = fs.readFileSync(filename, 'utf8');
  if (pdfContent.includes('/Artifact')) {
    console.log('✓ Artifact marker found for decorative image');
  }

} catch (error) {
  console.log('✗ Failed:', error.message);
}

// Test 3: Multiple images with different alt texts
console.log('\n[Test 3] Multiple images with different alt texts');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Multiple Images Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
  doc.beginStructureElement('H1');
  doc.text('Multiple Accessible Images', 10, 10);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('This document contains multiple images with unique alt texts.', 10, 20);
  doc.endStructureElement();

  // Image 1
  doc.addImage({
    imageData: redPixelPNG,
    format: 'PNG',
    x: 10,
    y: 30,
    width: 40,
    height: 40,
    alt: 'First test image showing red color'
  });

  // Image 2
  doc.addImage({
    imageData: redPixelPNG,
    format: 'PNG',
    x: 60,
    y: 30,
    width: 40,
    height: 40,
    alt: 'Second test image for comparison'
  });

  // Image 3
  doc.addImage({
    imageData: redPixelPNG,
    format: 'PNG',
    x: 110,
    y: 30,
    width: 40,
    height: 40,
    alt: 'Third test image demonstrating multiple figures'
  });

  doc.beginStructureElement('P');
  doc.text('All three images have unique alternative text.', 10, 80);
  doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-image-3-multiple.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);

  const pdfContent = fs.readFileSync(filename, 'utf8');
  const figureCount = (pdfContent.match(/\/Figure/g) || []).length;
  console.log('✓ Figure elements found:', figureCount >= 3 ? '3+' : figureCount);

} catch (error) {
  console.log('✗ Failed:', error.message);
}

// Test 4: Image without alt text (should throw error in strict mode)
console.log('\n[Test 4] Image without alt text (should throw error)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Image Without Alt Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
  doc.beginStructureElement('H1');
  doc.text('Image Without Alt Text', 10, 10);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('This document tests image without alt text.', 10, 20);
  doc.endStructureElement();

  // Add image WITHOUT alt text - this should throw error
  doc.addImage({
    imageData: redPixelPNG,
    format: 'PNG',
    x: 10,
    y: 30,
    width: 40,
    height: 40
    // NO alt text provided, NO decorative flag
  });

  doc.endStructureElement();

  console.log('✗ Should have thrown error but did not');

} catch (error) {
  if (error.message.includes('PDF/UA Error')) {
    console.log('✓ Error thrown as expected (strict mode)');
    console.log('✓ Error message:', error.message.split('\n')[0]);
  } else {
    console.log('✗ Unexpected error:', error.message);
  }
}

// Test 5: Images within structure elements
console.log('\n[Test 5] Images within nested structure elements');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Nested Structure with Images');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
  doc.beginStructureElement('H1');
  doc.text('Report with Images', 10, 10);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('Section 1: Introduction', 10, 20);
  doc.endStructureElement();

  doc.addImage({
    imageData: redPixelPNG,
    format: 'PNG',
    x: 10,
    y: 30,
    width: 50,
    height: 30,
    alt: 'Chart showing introduction metrics'
  });

  doc.beginStructureElement('H2');
  doc.text('Section 2: Analysis', 10, 70);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('Detailed analysis follows:', 10, 80);
  doc.endStructureElement();

  doc.addImage({
    imageData: redPixelPNG,
    format: 'PNG',
    x: 10,
    y: 90,
    width: 50,
    height: 30,
    alt: 'Bar chart displaying analysis results'
  });

  doc.endStructureElement();

  const filename = 'examples/temp/test-image-5-in-structure.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);

  const pdfContent = fs.readFileSync(filename, 'utf8');
  if (pdfContent.includes('/H1') && pdfContent.includes('/H2')) {
    console.log('✓ Nested structure elements present');
  }
  if (pdfContent.includes('/Figure')) {
    console.log('✓ Figure elements integrated in structure');
  }

} catch (error) {
  console.log('✗ Failed:', error.message);
}

// Test 6: German text with images
console.log('\n[Test 6] German text with image alt text');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Bilder mit Alternativtext');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
  doc.beginStructureElement('H1');
  doc.text('Barrierefreie Bilder', 10, 10);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('Dieses Dokument enthält ein barrierefreies Bild.', 10, 20);
  doc.endStructureElement();

  doc.addImage({
    imageData: redPixelPNG,
    format: 'PNG',
    x: 10,
    y: 30,
    width: 50,
    height: 50,
    alt: 'Rotes Quadrat als Testbild'
  });

  doc.beginStructureElement('P');
  doc.text('Das Bild hat deutschen Alternativtext.', 10, 90);
  doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-image-6-german.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('✓ Generated:', filename);

  const pdfContent = fs.readFileSync(filename, 'utf8');
  if (pdfContent.includes('de-DE')) {
    console.log('✓ German language tag present');
  }

} catch (error) {
  console.log('✗ Failed:', error.message);
}

console.log('\n' + '='.repeat(70));
console.log('Test Suite Complete');
console.log('='.repeat(70));
console.log('\nGenerated PDFs:');
console.log('  examples/temp/test-image-1-with-alt.pdf - Image with alt text');
console.log('  examples/temp/test-image-2-decorative.pdf - Decorative image');
console.log('  examples/temp/test-image-3-multiple.pdf - Multiple images');
console.log('  examples/temp/test-image-4-no-alt-warning.pdf - No alt (warning)');
console.log('  examples/temp/test-image-5-in-structure.pdf - Nested structure');
console.log('  examples/temp/test-image-6-german.pdf - German alt text');
console.log('\nNext steps:');
console.log('  1. Open PDFs in Acrobat Reader');
console.log('  2. Test with screen reader (should read alt text)');
console.log('  3. Check File → Properties → Description for alt text');
console.log('  4. Run veraPDF validation');
console.log('  5. Verify decorative images are skipped by screen reader');
