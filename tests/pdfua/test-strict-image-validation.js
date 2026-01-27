/**
 * PDF/UA Strict Image Validation Test
 *
 * Tests that images without alt text or decorative flag throw errors
 *
 * Run: node tests/pdfua/test-strict-image-validation.js
 */

const { jsPDF } = require('../../dist/jspdf.node.js');

console.log('='.repeat(70));
console.log('PDF/UA Strict Image Validation Test');
console.log('='.repeat(70));

// Create a simple test image (1x1 red pixel PNG)
const redPixelPNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

// Test 1: Image WITHOUT alt text or decorative flag should FAIL
console.log('\n[Test 1] Image without alt text or decorative flag (should throw error)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.beginStructureElement('Document');
  doc.beginStructureElement('P');
  doc.text('This will fail:', 10, 10);
  doc.endStructureElement();

  // This should throw an error
  doc.addImage({
    imageData: redPixelPNG,
    format: 'PNG',
    x: 10,
    y: 20,
    width: 50,
    height: 50
    // NO alt text, NO decorative flag
  });

  doc.endStructureElement();

  console.log('❌ FAILED: Should have thrown an error but did not');

} catch (error) {
  if (error.message.includes('PDF/UA Error')) {
    console.log('✅ PASS: Error thrown as expected');
    console.log('   Error message:', error.message.split('\n')[0]);
  } else {
    console.log('❌ FAILED: Wrong error type:', error.message);
  }
}

// Test 2: Image with EMPTY alt text should FAIL
console.log('\n[Test 2] Image with empty alt text (should throw error)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.beginStructureElement('Document');
  doc.beginStructureElement('P');
  doc.text('This will fail:', 10, 10);
  doc.endStructureElement();

  // This should throw an error (empty string)
  doc.addImage({
    imageData: redPixelPNG,
    format: 'PNG',
    x: 10,
    y: 20,
    width: 50,
    height: 50,
    alt: ''  // Empty string
  });

  doc.endStructureElement();

  console.log('❌ FAILED: Should have thrown an error but did not');

} catch (error) {
  if (error.message.includes('PDF/UA Error')) {
    console.log('✅ PASS: Error thrown as expected');
    console.log('   Error message:', error.message.split('\n')[0]);
  } else {
    console.log('❌ FAILED: Wrong error type:', error.message);
  }
}

// Test 3: Image with whitespace-only alt text should FAIL
console.log('\n[Test 3] Image with whitespace-only alt text (should throw error)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.beginStructureElement('Document');
  doc.beginStructureElement('P');
  doc.text('This will fail:', 10, 10);
  doc.endStructureElement();

  // This should throw an error (whitespace only)
  doc.addImage({
    imageData: redPixelPNG,
    format: 'PNG',
    x: 10,
    y: 20,
    width: 50,
    height: 50,
    alt: '   '  // Whitespace only
  });

  doc.endStructureElement();

  console.log('❌ FAILED: Should have thrown an error but did not');

} catch (error) {
  if (error.message.includes('PDF/UA Error')) {
    console.log('✅ PASS: Error thrown as expected');
    console.log('   Error message:', error.message.split('\n')[0]);
  } else {
    console.log('❌ FAILED: Wrong error type:', error.message);
  }
}

// Test 4: Image with valid alt text should PASS
console.log('\n[Test 4] Image with valid alt text (should succeed)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.beginStructureElement('Document');
  doc.beginStructureElement('P');
  doc.text('This should work:', 10, 10);
  doc.endStructureElement();

  doc.addImage({
    imageData: redPixelPNG,
    format: 'PNG',
    x: 10,
    y: 20,
    width: 50,
    height: 50,
    alt: 'Valid description'  // Valid alt text
  });

  doc.endStructureElement();

  console.log('✅ PASS: Image with alt text accepted');

} catch (error) {
  console.log('❌ FAILED: Should not have thrown error:', error.message);
}

// Test 5: Image explicitly marked as decorative should PASS
console.log('\n[Test 5] Image marked as decorative (should succeed)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.beginStructureElement('Document');
  doc.beginStructureElement('P');
  doc.text('This should work:', 10, 10);
  doc.endStructureElement();

  doc.addImage({
    imageData: redPixelPNG,
    format: 'PNG',
    x: 10,
    y: 20,
    width: 50,
    height: 50,
    decorative: true  // Explicitly decorative
  });

  doc.endStructureElement();

  console.log('✅ PASS: Decorative image accepted');

} catch (error) {
  console.log('❌ FAILED: Should not have thrown error:', error.message);
}

// Test 6: Regular PDF (non-PDF/UA) should allow images without alt text
console.log('\n[Test 6] Regular PDF without PDF/UA (should succeed without alt)');
try {
  const doc = new jsPDF();  // NO pdfUA: true

  doc.text('Regular PDF', 10, 10);

  doc.addImage({
    imageData: redPixelPNG,
    format: 'PNG',
    x: 10,
    y: 20,
    width: 50,
    height: 50
    // NO alt text, but that's OK for regular PDFs
  });

  console.log('✅ PASS: Regular PDF accepts images without alt text');

} catch (error) {
  console.log('❌ FAILED: Regular PDF should not require alt text:', error.message);
}

// Test 7: Decorative flag with alt text (decorative should take precedence)
console.log('\n[Test 7] Image with both decorative flag and alt text');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.beginStructureElement('Document');
  doc.beginStructureElement('P');
  doc.text('Testing precedence:', 10, 10);
  doc.endStructureElement();

  doc.addImage({
    imageData: redPixelPNG,
    format: 'PNG',
    x: 10,
    y: 20,
    width: 50,
    height: 50,
    alt: 'This will be ignored',
    decorative: true  // Decorative takes precedence
  });

  doc.endStructureElement();

  console.log('✅ PASS: Decorative flag accepted (alt text ignored)');
  console.log('   Note: When decorative=true, alt text is ignored');

} catch (error) {
  console.log('❌ FAILED:', error.message);
}

console.log('\n' + '='.repeat(70));
console.log('Test Suite Complete');
console.log('='.repeat(70));
console.log('\nSummary:');
console.log('  PDF/UA mode enforces strict image accessibility:');
console.log('  ✅ Images MUST have alt text OR be marked decorative');
console.log('  ✅ Alt text cannot be empty or whitespace-only');
console.log('  ✅ Regular PDFs are not affected by these restrictions');
console.log('\nBest Practices:');
console.log('  • Use meaningful alt text: "Chart showing sales growth"');
console.log('  • Mark decorative images explicitly: decorative: true');
console.log('  • Avoid generic text like "image" or "picture"');
console.log('  • Keep alt text concise but descriptive');
