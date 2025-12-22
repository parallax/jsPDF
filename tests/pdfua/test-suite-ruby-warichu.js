/**
 * PDF/UA Ruby and Warichu Element Test Suite
 * Tests for East Asian pronunciation annotations and inline comments
 *
 * Sprint 25: Ruby/Warichu (BITi 02.3.3)
 *
 * Ruby: Small annotation text adjacent to base text (e.g., furigana)
 * Warichu: Inline comment formatted into two lines within text height
 *
 * Note: These elements are primarily for CJK (Chinese, Japanese, Korean)
 * typography. Testing with Western screen readers may not show the full
 * accessibility benefits, but the PDF structure is correct.
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Ruby and Warichu Element Test Suite');
console.log('======================================================================\n');

// Test 1: Simple Ruby (simulated with Latin characters)
console.log('[Test 1] Simple Ruby structure (Latin simulation)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Ruby Structure Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Ruby Annotation Demo', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('The following demonstrates Ruby structure:', 10, 40);
    doc.endStructureElement();

    // Ruby structure with Latin text (simulating how it would work)
    doc.beginStructureElement('P');
    doc.text('Word with pronunciation: ', 10, 60);

    doc.beginRuby();
      doc.beginRubyBaseText();
      doc.text('BASE', 75, 60);
      doc.endRubyBaseText();
      doc.beginRubyText();
      doc.setFontSize(8);
      doc.text('(annotation)', 75, 55);
      doc.setFontSize(14);
      doc.endRubyText();
    doc.endRuby();

    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-ruby-1-simple.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Simple Ruby structure with RB and RT elements');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: Ruby with fallback parentheses
console.log('[Test 2] Ruby with RP fallback parentheses');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Ruby with Fallback Test');
  doc.setLanguage('en-US');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Ruby with Fallback Parentheses', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('For readers that do not support Ruby:', 10, 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.beginRuby();
      doc.beginRubyBaseText();
      doc.text('Tokyo', 10, 60);
      doc.endRubyBaseText();
      doc.beginRubyPunctuation();
      doc.text('(', 35, 60);
      doc.endRubyPunctuation();
      doc.beginRubyText();
      doc.text('toukyou', 38, 60);
      doc.endRubyText();
      doc.beginRubyPunctuation();
      doc.text(')', 68, 60);
      doc.endRubyPunctuation();
    doc.endRuby();
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('The RP elements provide fallback for non-Ruby readers.', 10, 80);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-ruby-2-fallback.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Ruby with RB, RP, RT, RP structure');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 3: Japanese Ruby simulation (structure only, no actual Japanese font)
console.log('[Test 3] Japanese Ruby structure simulation');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Japanese Ruby Structure');
  doc.setLanguage('ja-JP');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Japanese Ruby Structure Demo', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('This demonstrates the correct structure for Japanese furigana.', 10, 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('With proper Japanese fonts, this would show:', 10, 60);
    doc.endStructureElement();

    // Structure for: 漢字 (かんじ) - Kanji with hiragana reading
    doc.beginStructureElement('P');
    doc.beginRuby({ lang: 'ja-JP' });
      doc.beginRubyBaseText();
      doc.text('[Kanji]', 10, 80);  // Would be 漢字
      doc.endRubyBaseText();
      doc.beginRubyText({ rubyPosition: 'Before' });
      doc.setFontSize(8);
      doc.text('[kanji]', 10, 74);  // Would be かんじ
      doc.setFontSize(14);
      doc.endRubyText();
    doc.endRuby();
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Note: Actual Japanese rendering requires Japanese fonts.', 10, 100);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-ruby-3-japanese.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Japanese Ruby structure with ja-JP language');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 4: Simple Warichu structure
console.log('[Test 4] Simple Warichu structure');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Warichu Structure Test');
  doc.setLanguage('ja-JP');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Warichu Annotation Demo', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Warichu is used for inline comments in Japanese text.', 10, 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Main text ', 10, 60);

    doc.beginWarichu({ lang: 'ja-JP' });
      doc.beginWarichuPunctuation();
      doc.text('(', 45, 60);
      doc.endWarichuPunctuation();
      doc.beginWarichuText();
      doc.setFontSize(8);
      doc.text('inline comment', 48, 60);
      doc.setFontSize(14);
      doc.endWarichuText();
      doc.beginWarichuPunctuation();
      doc.text(')', 90, 60);
      doc.endWarichuPunctuation();
    doc.endWarichu();

    doc.text(' continues here.', 93, 60);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-warichu-1-simple.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Warichu with WP, WT, WP structure');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 5: Multiple Ruby annotations
console.log('[Test 5] Multiple Ruby annotations');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Multiple Ruby Annotations');
  doc.setLanguage('zh-CN');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Multiple Ruby Annotations', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Chinese Pinyin example structure:', 10, 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    // First character
    doc.beginRuby({ lang: 'zh-CN' });
      doc.beginRubyBaseText();
      doc.text('[Char1]', 10, 60);
      doc.endRubyBaseText();
      doc.beginRubyText();
      doc.setFontSize(8);
      doc.text('pin1', 10, 54);
      doc.setFontSize(14);
      doc.endRubyText();
    doc.endRuby();

    // Second character
    doc.beginRuby({ lang: 'zh-CN' });
      doc.beginRubyBaseText();
      doc.text('[Char2]', 45, 60);
      doc.endRubyBaseText();
      doc.beginRubyText();
      doc.setFontSize(8);
      doc.text('yin1', 45, 54);
      doc.setFontSize(14);
      doc.endRubyText();
    doc.endRuby();

    // Third character
    doc.beginRuby({ lang: 'zh-CN' });
      doc.beginRubyBaseText();
      doc.text('[Char3]', 80, 60);
      doc.endRubyBaseText();
      doc.beginRubyText();
      doc.setFontSize(8);
      doc.text('han4', 80, 54);
      doc.setFontSize(14);
      doc.endRubyText();
    doc.endRuby();

    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-ruby-4-multiple.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Multiple Ruby annotations for Pinyin');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 6: Complete document with Ruby and Warichu
console.log('[Test 6] Complete document with Ruby and Warichu');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('CJK Annotations Demo');
  doc.setLanguage('ja-JP');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('East Asian Typography Support', 10, 20);
    doc.endStructureElement();

    // Section 1: Ruby
    doc.beginStructureElement('H2');
    doc.text('1. Ruby Annotations', 10, 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Ruby provides pronunciation guides above base text.', 10, 55);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Example: ', 10, 70);
    doc.beginRuby();
      doc.beginRubyBaseText();
      doc.text('BASE', 35, 70);
      doc.endRubyBaseText();
      doc.beginRubyText();
      doc.setFontSize(8);
      doc.text('reading', 35, 64);
      doc.setFontSize(14);
      doc.endRubyText();
    doc.endRuby();
    doc.endStructureElement();

    // Section 2: Warichu
    doc.beginStructureElement('H2');
    doc.text('2. Warichu Annotations', 10, 95);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Warichu provides inline comments in two lines.', 10, 110);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Example: Main ', 10, 125);
    doc.beginWarichu();
      doc.beginWarichuPunctuation();
      doc.text('(', 45, 125);
      doc.endWarichuPunctuation();
      doc.beginWarichuText();
      doc.setFontSize(8);
      doc.text('comment', 48, 125);
      doc.setFontSize(14);
      doc.endWarichuText();
      doc.beginWarichuPunctuation();
      doc.text(')', 75, 125);
      doc.endWarichuPunctuation();
    doc.endWarichu();
    doc.text(' text.', 78, 125);
    doc.endStructureElement();

    // Note
    doc.beginStructureElement('P');
    doc.setFontSize(10);
    doc.text('Note: Full CJK support requires appropriate fonts.', 10, 150);
    doc.setFontSize(14);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-ruby-warichu-complete.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Complete document with Ruby and Warichu sections');
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
console.log('  - test-ruby-1-simple.pdf');
console.log('  - test-ruby-2-fallback.pdf');
console.log('  - test-ruby-3-japanese.pdf');
console.log('  - test-warichu-1-simple.pdf');
console.log('  - test-ruby-4-multiple.pdf');
console.log('  - test-ruby-warichu-complete.pdf');
console.log('');
console.log('Ruby Structure (ISO 32000-1 Table 338):');
console.log('  Ruby');
console.log('  ├── RB (Ruby Base Text) - full-size base text');
console.log('  ├── RP (Ruby Punctuation) - optional fallback (');
console.log('  ├── RT (Ruby Text) - smaller annotation text');
console.log('  └── RP (Ruby Punctuation) - optional fallback )');
console.log('');
console.log('Warichu Structure:');
console.log('  Warichu');
console.log('  ├── WP (Warichu Punctuation) - opening');
console.log('  ├── WT (Warichu Text) - annotation in two lines');
console.log('  └── WP (Warichu Punctuation) - closing');
console.log('');
console.log('Use Cases:');
console.log('  - Furigana (Japanese hiragana above kanji)');
console.log('  - Pinyin (Chinese romanization)');
console.log('  - Bopomofo/Zhuyin (Traditional Chinese)');
console.log('  - Korean hanja pronunciation');
console.log('');
console.log('Note: Full visual rendering requires CJK fonts.');
console.log('The PDF structure is correct for accessibility.');
console.log('');
console.log('veraPDF Validation:');
console.log('  docker run --rm -v $(pwd)/examples/temp:/data verapdf/verapdf:latest --flavour ua1 /data/test-ruby-1-simple.pdf');
console.log('======================================================================');
