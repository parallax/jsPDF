/**
 * PDF/UA Formula Element Test Suite
 * Tests mathematical expressions with alternative text
 *
 * Sprint 22: Formula (BITi 02.4.0 - Mathematische Ausdrücke)
 *
 * PDF/UA Requirements:
 * - All formulas MUST have an /Alt attribute
 * - Formula is inline by default; use placement: 'Block' for block-level
 * - In PDF/UA-1, alt text is the primary accessibility mechanism
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Formula Element Test Suite');
console.log('======================================================================\n');

// Test 1: Famous inline formula
console.log('[Test 1] Famous inline formula (E=mc²)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Einstein Formula Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Einsteins berühmte Formel', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Die Formel ', x, 40);
    x += doc.getTextWidth('Die Formel ');

    // Inline formula
    doc.beginFormula('E gleich m mal c Quadrat');
    doc.text('E = mc²', x, 40);
    x += doc.getTextWidth('E = mc²');
    doc.endFormula();

    doc.text(' beschreibt die Äquivalenz von Masse und Energie.', x, 40);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-formula-1-einstein.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Inline formula E=mc² with alt text');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: Block-level formula (Pythagoras)
console.log('[Test 2] Block-level formula (Pythagoras)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Pythagoras Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Der Satz des Pythagoras', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('In einem rechtwinkligen Dreieck gilt:', 10, 40);
    doc.endStructureElement();

    // Block-level formula with Placement attribute
    doc.beginFormula('a Quadrat plus b Quadrat gleich c Quadrat', { placement: 'Block' });
    doc.setFontSize(16);
    doc.text('a² + b² = c²', 80, 65);
    doc.setFontSize(12);
    doc.endFormula();

    doc.beginStructureElement('P');
    doc.text('wobei c die Hypotenuse ist.', 10, 90);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-formula-2-pythagoras.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Block-level formula with Placement=Block');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 3: Chemical formulas
console.log('[Test 3] Chemical formulas');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Chemical Formulas Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Chemische Formeln', 10, 20);
    doc.endStructureElement();

    // Water
    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Wasser hat die Formel ', x, 40);
    x += doc.getTextWidth('Wasser hat die Formel ');

    doc.beginFormula('H 2 O, zwei Wasserstoffatome und ein Sauerstoffatom');
    doc.text('H₂O', x, 40);
    x += doc.getTextWidth('H₂O');
    doc.endFormula();

    doc.text('.', x, 40);
    doc.endStructureElement();

    // Carbon dioxide
    doc.beginStructureElement('P');
    x = 10;
    doc.text('Kohlenstoffdioxid: ', x, 55);
    x += doc.getTextWidth('Kohlenstoffdioxid: ');

    doc.beginFormula('C O 2, ein Kohlenstoffatom und zwei Sauerstoffatome');
    doc.text('CO₂', x, 55);
    doc.endFormula();
    doc.endStructureElement();

    // Photosynthesis equation
    doc.beginStructureElement('P');
    doc.text('Die Photosynthese-Reaktion:', 10, 75);
    doc.endStructureElement();

    doc.beginFormula('6 C O 2 plus 6 H 2 O ergibt C 6 H 12 O 6 plus 6 O 2, Kohlenstoffdioxid und Wasser reagieren zu Glukose und Sauerstoff', { placement: 'Block' });
    doc.text('6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', 40, 95);
    doc.endFormula();

    doc.beginStructureElement('P');
    doc.text('Diese Reaktion wandelt Lichtenergie in chemische Energie um.', 10, 115);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-formula-3-chemical.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Chemical formulas: H₂O, CO₂, photosynthesis');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 4: Physics formulas
console.log('[Test 4] Physics formulas');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Physics Formulas Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Physikalische Grundformeln', 10, 20);
    doc.endStructureElement();

    // Force formula
    doc.beginStructureElement('H2');
    doc.text('Newtonsches Kraftgesetz', 10, 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Die Kraft berechnet sich als:', 10, 55);
    doc.endStructureElement();

    doc.beginFormula('F gleich m mal a, Kraft gleich Masse mal Beschleunigung', { placement: 'Block' });
    doc.setFontSize(14);
    doc.text('F = m · a', 80, 75);
    doc.setFontSize(12);
    doc.endFormula();

    // Velocity formula
    doc.beginStructureElement('H2');
    doc.text('Geschwindigkeit', 10, 100);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Die Geschwindigkeit ', x, 115);
    x += doc.getTextWidth('Die Geschwindigkeit ');

    doc.beginFormula('v gleich s durch t, Geschwindigkeit gleich Strecke durch Zeit');
    doc.text('v = s/t', x, 115);
    x += doc.getTextWidth('v = s/t');
    doc.endFormula();

    doc.text(' ist der Quotient aus Strecke und Zeit.', x, 115);
    doc.endStructureElement();

    // Kinetic energy
    doc.beginStructureElement('H2');
    doc.text('Kinetische Energie', 10, 135);
    doc.endStructureElement();

    doc.beginFormula('E kinetisch gleich ein halb m v Quadrat', { placement: 'Block' });
    doc.setFontSize(14);
    doc.text('Eₖ = ½mv²', 80, 155);
    doc.setFontSize(12);
    doc.endFormula();
  doc.endStructureElement();

  const filename = 'examples/temp/test-formula-4-physics.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Physics formulas: F=ma, v=s/t, Ek=½mv²');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 5: Mathematical operations
console.log('[Test 5] Mathematical operations');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Math Operations Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Mathematische Operationen', 10, 20);
    doc.endStructureElement();

    // Quadratic formula
    doc.beginStructureElement('H2');
    doc.text('Quadratische Gleichung', 10, 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Die Lösungsformel für ax² + bx + c = 0:', 10, 55);
    doc.endStructureElement();

    doc.beginFormula('x gleich minus b plus minus Wurzel aus b Quadrat minus 4 a c, geteilt durch 2 a', { placement: 'Block' });
    doc.setFontSize(12);
    doc.text('x = (-b ± √(b² - 4ac)) / 2a', 50, 75);
    doc.endFormula();

    // Sum formula
    doc.beginStructureElement('H2');
    doc.text('Summenformel', 10, 100);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Die Summe der ersten n natürlichen Zahlen:', 10, 115);
    doc.endStructureElement();

    doc.beginFormula('Summe von i gleich 1 bis n von i gleich n mal n plus 1 geteilt durch 2', { placement: 'Block' });
    doc.text('∑ᵢ₌₁ⁿ i = n(n+1)/2', 60, 135);
    doc.endFormula();

    // Pi formula
    doc.beginStructureElement('H2');
    doc.text('Kreiszahl', 10, 160);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Der Kreisumfang ist ', x, 175);
    x += doc.getTextWidth('Der Kreisumfang ist ');

    doc.beginFormula('U gleich 2 mal Pi mal r');
    doc.text('U = 2πr', x, 175);
    x += doc.getTextWidth('U = 2πr');
    doc.endFormula();

    doc.text(', die Fläche ist ', x, 175);
    x += doc.getTextWidth(', die Fläche ist ');

    doc.beginFormula('A gleich Pi mal r Quadrat');
    doc.text('A = πr²', x, 175);
    doc.endFormula();

    doc.text('.', x + doc.getTextWidth('A = πr²'), 175);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-formula-5-math.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Math: Quadratic formula, sum, circle formulas');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 6: Formulas with English alt text
console.log('[Test 6] Formulas with English alt text');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('English Formula Alt Text');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Mathematical Formulas', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('The fundamental theorem of calculus:', 10, 40);
    doc.endStructureElement();

    doc.beginFormula('The integral from a to b of f of x dx equals F of b minus F of a', { placement: 'Block', lang: 'en-US' });
    doc.setFontSize(14);
    doc.text('∫ₐᵇ f(x)dx = F(b) - F(a)', 50, 60);
    doc.setFontSize(12);
    doc.endFormula();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('where ', x, 85);
    x += doc.getTextWidth('where ');

    doc.beginFormula('F prime of x equals f of x', { lang: 'en-US' });
    doc.text("F'(x) = f(x)", x, 85);
    doc.endFormula();

    doc.text('.', x + doc.getTextWidth("F'(x) = f(x)"), 85);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-formula-6-english.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  English alt text for integral formula');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 7: Validation - missing alt text should throw error
console.log('[Test 7] Validation - missing alt text');
try {
  const doc = new jsPDF({ pdfUA: true });
  doc.setLanguage('de-DE');
  doc.beginStructureElement('Document');
  doc.beginStructureElement('P');

  // This should throw an error
  doc.beginFormula(); // Missing alt text

  console.log('  FAILED: Should have thrown an error for missing alt text');
  console.log('');
} catch (error) {
  if (error.message.includes('alt') || error.message.includes('alternative')) {
    console.log('  PASSED: Correctly threw error for missing alt text');
    console.log('  Error:', error.message);
  } else {
    console.log('  FAILED: Wrong error:', error.message);
  }
  console.log('');
}

// Test 8: Complete formula as single unit
console.log('[Test 8] Complete formula as single unit');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Trigonometric Identity');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Trigonometrische Identitäten', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Es gilt ', x, 40);
    x += doc.getTextWidth('Es gilt ');

    // CORRECT: The entire equation is ONE formula with ONE alt text
    doc.beginFormula('Sinus Quadrat x plus Kosinus Quadrat x gleich eins');
    doc.text('sin²x + cos²x = 1', x, 40);
    x += doc.getTextWidth('sin²x + cos²x = 1');
    doc.endFormula();

    doc.text('.', x, 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    x = 10;
    doc.text('Daraus folgt: ', x, 60);
    x += doc.getTextWidth('Daraus folgt: ');

    // Another complete formula as single unit
    doc.beginFormula('Tangens x gleich Sinus x durch Kosinus x');
    doc.text('tan x = sin x / cos x', x, 60);
    doc.endFormula();

    doc.text('.', x + doc.getTextWidth('tan x = sin x / cos x'), 60);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-formula-8-multiple.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Complete formulas: sin²x + cos²x = 1 and tan x = sin x / cos x');
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
console.log('  - test-formula-1-einstein.pdf');
console.log('  - test-formula-2-pythagoras.pdf');
console.log('  - test-formula-3-chemical.pdf');
console.log('  - test-formula-4-physics.pdf');
console.log('  - test-formula-5-math.pdf');
console.log('  - test-formula-6-english.pdf');
console.log('  - test-formula-8-multiple.pdf');
console.log('');
console.log('PDF/UA Requirements:');
console.log('  - Formula MUST have /Alt attribute (alternative text)');
console.log('  - Formula is inline by default');
console.log('  - Use placement: "Block" for block-level formulas');
console.log('');
console.log('Screenreader Testing:');
console.log('  - Screen reader reads the alt text instead of the formula');
console.log('  - Example: "E = mc²" is read as "E gleich m mal c Quadrat"');
console.log('  - Block formulas may be announced as separate elements');
console.log('');
console.log('veraPDF Validation:');
console.log('  docker run --rm -v $(pwd)/examples/temp:/data verapdf/verapdf:latest --flavour ua1 /data/test-formula-1-einstein.pdf');
console.log('======================================================================');
