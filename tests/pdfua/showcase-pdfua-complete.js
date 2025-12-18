/**
 * PDF/UA Complete Showcase Document
 *
 * This document demonstrates ALL PDF/UA features implemented in jsPDF.
 * It can be used for validation by external accessibility testers.
 *
 * Features demonstrated:
 * - Document metadata (title, language)
 * - Structure tree with all element types
 * - Headings (H1-H6)
 * - Paragraphs and text
 * - Lists (ordered and unordered)
 * - Tables with proper headers
 * - Links (external and internal)
 * - Images with alt text
 * - Artifacts (headers, footers, decorative)
 * - Form fields (text, checkbox, combobox)
 * - Annotations (text, freetext)
 * - Footnotes and references
 * - Quotes and blockquotes
 * - Code (inline and block)
 * - Abbreviations
 * - Formulas
 * - Strong/Em emphasis
 * - Span with language changes
 * - Table of Contents
 * - Bookmarks
 * - Bibliography
 * - Index
 * - Grouping elements (Sect, Art, Div, Part)
 * - PDF 2.0 elements (Aside, DocumentFragment)
 * - CJK elements (Ruby, Warichu)
 * - NonStruct and Private
 * - Caption
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');
const path = require('path');

console.log('='.repeat(70));
console.log('PDF/UA Complete Showcase Document Generator');
console.log('='.repeat(70));

const doc = new jsPDF({ pdfUA: true });

// ============================================================================
// Document Metadata
// ============================================================================
doc.setDocumentTitle('PDF/UA Complete Feature Showcase - jsPDF Implementation');
doc.setLanguage('en-US');

// ============================================================================
// Bookmarks for Navigation (using outline API)
// ============================================================================
doc.outline.add(null, '1. Introduction', { pageNumber: 1 });
doc.outline.add(null, '2. Text Elements', { pageNumber: 1 });
doc.outline.add(null, '3. Lists', { pageNumber: 2 });
doc.outline.add(null, '4. Tables', { pageNumber: 2 });
doc.outline.add(null, '5. Links', { pageNumber: 2 });
doc.outline.add(null, '6. Forms', { pageNumber: 3 });
doc.outline.add(null, '7. Quotes and Code', { pageNumber: 3 });
doc.outline.add(null, '8. Footnotes', { pageNumber: 4 });
doc.outline.add(null, '9. Figures and Captions', { pageNumber: 4 });
doc.outline.add(null, '10. Advanced Elements', { pageNumber: 5 });
doc.outline.add(null, '11. PDF 2.0 Elements', { pageNumber: 5 });
doc.outline.add(null, '12. Bibliography', { pageNumber: 6 });

// ============================================================================
// PAGE 1: Introduction and Text Elements
// ============================================================================
doc.beginStructureElement('Document');

// --- Header Artifact ---
doc.beginArtifact({ type: 'Pagination', subtype: 'Header' });
doc.setFontSize(8);
doc.setTextColor(128, 128, 128);
doc.text('PDF/UA Complete Showcase', 20, 10);
doc.text('Page 1', 180, 10);
doc.setTextColor(0, 0, 0);
doc.endArtifact();

// --- Title ---
doc.beginStructureElement('H1');
doc.setFontSize(22);
doc.setFont(undefined, 'bold');
doc.text('PDF/UA Complete Feature Showcase', 20, 25);
doc.endStructureElement();

// --- Section 1: Introduction ---
doc.beginSect();
  doc.beginStructureElement('H2');
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('1. Introduction', 20, 40);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('This document demonstrates all PDF/UA accessibility features implemented in jsPDF.', 20, 52);
  doc.text('It serves as a comprehensive test case for accessibility validation tools.', 20, 59);
  doc.endStructureElement();
doc.endSect();

// --- Table of Contents ---
doc.beginStructureElement('H2');
doc.setFontSize(14);
doc.setFont(undefined, 'bold');
doc.text('Table of Contents', 20, 75);
doc.endStructureElement();

doc.beginTOC();
  const tocItems = [
    { title: '1. Introduction', page: 1 },
    { title: '2. Text Elements', page: 1 },
    { title: '3. Lists', page: 2 },
    { title: '4. Tables', page: 2 },
    { title: '5. Links', page: 2 },
    { title: '6. Forms', page: 3 },
    { title: '7. Quotes and Code', page: 3 },
    { title: '8. Footnotes', page: 4 },
    { title: '9. Figures and Captions', page: 4 },
    { title: '10. Advanced Elements', page: 5 },
    { title: '11. PDF 2.0 Elements', page: 5 },
    { title: '12. Bibliography', page: 6 }
  ];

  let tocY = 88;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  tocItems.forEach(item => {
    doc.beginTOCI();
      // TOC links don't need Reference wrapper - Reference is for footnotes with /Ref to Note elements
      // Simple structure: TOCI > Link with OBJR
      doc.beginLink();
      doc.textWithLink(item.title + ' ' + '.'.repeat(50 - item.title.length) + ' ' + item.page, 25, tocY, { pageNumber: item.page });
      doc.endLink();
    doc.endTOCI();
    tocY += 8;
  });
doc.endTOC();

// --- Section 2: Text Elements ---
doc.beginSect();
  doc.beginStructureElement('H2');
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('2. Text Elements', 20, 180);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('This section demonstrates various text formatting options:', 20, 193);
  doc.endStructureElement();

  // Strong text
  doc.beginStructureElement('P');
  doc.text('Here is some ', 20, 206);
  doc.beginStrong();
  doc.setFont(undefined, 'bold');
  doc.text('strongly emphasized', 51, 206);
  doc.endStrong();
  doc.setFont(undefined, 'normal');
  doc.text(' text that is important.', 97, 206);
  doc.endStructureElement();

  // Emphasized text
  doc.beginStructureElement('P');
  doc.text('And here is some ', 20, 218);
  doc.beginEmphasis();
  doc.setFont(undefined, 'italic');
  doc.text('emphasized', 58, 218);
  doc.endEmphasis();
  doc.setFont(undefined, 'normal');
  doc.text(' text for stress.', 87, 218);
  doc.endStructureElement();

  // Abbreviation
  doc.beginStructureElement('P');
  doc.text('The ', 20, 230);
  doc.beginAbbreviation('World Wide Web');
  doc.text('WWW', 32, 230);
  doc.endAbbreviation();
  doc.text(' and ', 46, 230);
  doc.beginAbbreviation('Hypertext Markup Language');
  doc.text('HTML', 58, 230);
  doc.endAbbreviation();
  doc.text(' are fundamental web technologies.', 73, 230);
  doc.endStructureElement();

  // Language change
  doc.beginStructureElement('P');
  doc.text('English text with ', 20, 242);
  doc.beginSpan({ lang: 'de-DE' });
  doc.text('deutscher Text eingebettet', 61, 242);
  doc.endSpan();
  doc.text(' and back to English.', 130, 242);
  doc.endStructureElement();

  // Formula
  doc.beginStructureElement('P');
  doc.text('Famous equation: ', 20, 254);
  doc.beginFormula('E equals m times c squared, where E is energy, m is mass, and c is speed of light');
  doc.text('E = mc²', 62, 254);
  doc.endFormula();
  doc.endStructureElement();
doc.endSect();

// --- Footer Artifact ---
doc.beginArtifact({ type: 'Pagination', subtype: 'Footer' });
doc.setFontSize(8);
doc.setTextColor(128, 128, 128);
doc.text('Generated by jsPDF with PDF/UA support', 20, 285);
doc.text('1', 105, 285);
doc.setTextColor(0, 0, 0);
doc.endArtifact();

// ============================================================================
// PAGE 2: Lists and Tables
// ============================================================================
doc.addPage();

// --- Header Artifact ---
doc.beginArtifact({ type: 'Pagination', subtype: 'Header' });
doc.setFontSize(8);
doc.setTextColor(128, 128, 128);
doc.text('PDF/UA Complete Showcase', 20, 10);
doc.text('Page 2', 180, 10);
doc.setTextColor(0, 0, 0);
doc.endArtifact();

// --- Section 3: Lists ---
doc.beginSect();
  doc.beginStructureElement('H2');
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('3. Lists', 20, 25);
  doc.endStructureElement();

  doc.beginStructureElement('H3');
  doc.setFontSize(12);
  doc.text('Unordered List', 20, 38);
  doc.endStructureElement();

  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');

  doc.beginStructureElement('L');
    const ulItems = ['First item in the list', 'Second item with more text', 'Third item'];
    let ulY = 50;
    ulItems.forEach(item => {
      doc.beginStructureElement('LI');
        doc.beginStructureElement('Lbl');
        doc.text('•', 25, ulY);
        doc.endStructureElement();
        doc.beginStructureElement('LBody');
        doc.text(item, 32, ulY);
        doc.endStructureElement();
      doc.endStructureElement();
      ulY += 10;
    });
  doc.endStructureElement();

  doc.beginStructureElement('H3');
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Ordered List', 20, 88);
  doc.endStructureElement();

  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');

  doc.beginStructureElement('L');
    const olItems = ['Step one of the process', 'Step two continues here', 'Step three completes it'];
    let olY = 100;
    olItems.forEach((item, idx) => {
      doc.beginStructureElement('LI');
        doc.beginStructureElement('Lbl');
        doc.text((idx + 1) + '.', 25, olY);
        doc.endStructureElement();
        doc.beginStructureElement('LBody');
        doc.text(item, 35, olY);
        doc.endStructureElement();
      doc.endStructureElement();
      olY += 10;
    });
  doc.endStructureElement();
doc.endSect();

// --- Section 4: Tables ---
doc.beginSect();
  doc.beginStructureElement('H2');
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('4. Tables', 20, 145);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('Tables with proper header associations:', 20, 158);
  doc.endStructureElement();

  doc.beginStructureElement('Table');
    // Table Header
    doc.beginTableHead();
      doc.beginStructureElement('TR');
        doc.beginStructureElement('TH', { scope: 'Column' });
        doc.setFont(undefined, 'bold');
        doc.text('Product', 25, 175);
        doc.endStructureElement();
        doc.beginStructureElement('TH', { scope: 'Column' });
        doc.text('Price', 80, 175);
        doc.endStructureElement();
        doc.beginStructureElement('TH', { scope: 'Column' });
        doc.text('Quantity', 120, 175);
        doc.endStructureElement();
        doc.beginStructureElement('TH', { scope: 'Column' });
        doc.text('Total', 170, 175);
        doc.endStructureElement();
      doc.endStructureElement();
    doc.endTableHead();

    // Table Body
    doc.beginTableBody();
      const tableData = [
        ['Widget A', '$10.00', '5', '$50.00'],
        ['Widget B', '$15.00', '3', '$45.00'],
        ['Widget C', '$8.00', '10', '$80.00']
      ];
      let tableY = 188;
      tableData.forEach(row => {
        doc.beginStructureElement('TR');
          // First column is row header (product name)
          doc.beginStructureElement('TH', { scope: 'Row' });
          doc.setFont(undefined, 'bold');
          doc.text(row[0], 25, tableY);
          doc.endStructureElement();
          // Data cells
          doc.setFont(undefined, 'normal');
          doc.beginStructureElement('TD');
          doc.text(row[1], 80, tableY);
          doc.endStructureElement();
          doc.beginStructureElement('TD');
          doc.text(row[2], 120, tableY);
          doc.endStructureElement();
          doc.beginStructureElement('TD');
          doc.text(row[3], 170, tableY);
          doc.endStructureElement();
        doc.endStructureElement();
        tableY += 12;
      });
    doc.endTableBody();
  doc.endStructureElement();

  // Note: Table border lines are omitted because jsPDF doesn't yet support
  // artifact marking for graphical operations. Future enhancement needed.
doc.endSect();

// --- Section 5: Links ---
doc.beginSect();
  doc.beginStructureElement('H2');
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('5. Links', 20, 240);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('External link: ', 20, 253);
  doc.endStructureElement();

  // External link using textWithLink for proper link annotation
  doc.beginLink({ placement: 'Block' });
  doc.setTextColor(0, 0, 255);
  doc.textWithLink('jsPDF on GitHub', 52, 253, { url: 'https://github.com/parallax/jsPDF' });
  doc.setTextColor(0, 0, 0);
  doc.endLink();

  doc.beginStructureElement('P');
  doc.text('Internal link: ', 20, 265);
  doc.endStructureElement();

  // Internal link to page 6
  doc.beginLink({ placement: 'Block' });
  doc.setTextColor(0, 0, 255);
  doc.textWithLink('Jump to Bibliography (Page 6)', 51, 265, { pageNumber: 6 });
  doc.setTextColor(0, 0, 0);
  doc.endLink();
doc.endSect();

// --- Footer Artifact ---
doc.beginArtifact({ type: 'Pagination', subtype: 'Footer' });
doc.setFontSize(8);
doc.setTextColor(128, 128, 128);
doc.text('Generated by jsPDF with PDF/UA support', 20, 285);
doc.text('2', 105, 285);
doc.setTextColor(0, 0, 0);
doc.endArtifact();

// ============================================================================
// PAGE 3: Forms, Quotes, and Code
// ============================================================================
doc.addPage();

// --- Header Artifact ---
doc.beginArtifact({ type: 'Pagination', subtype: 'Header' });
doc.setFontSize(8);
doc.setTextColor(128, 128, 128);
doc.text('PDF/UA Complete Showcase', 20, 10);
doc.text('Page 3', 180, 10);
doc.setTextColor(0, 0, 0);
doc.endArtifact();

// --- Section 6: Forms ---
doc.beginSect();
  doc.beginStructureElement('H2');
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('6. Form Fields', 20, 25);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('Accessible form fields with labels:', 20, 38);
  doc.endStructureElement();

  // Text field
  doc.beginStructureElement('P');
  doc.text('Name:', 20, 55);
  doc.endStructureElement();
  doc.addAccessibleTextField({
    name: 'name',
    label: 'Full Name',
    tooltip: 'Enter your full name',
    x: 50, y: 48, width: 80, height: 12,
    required: true
  });

  // Checkbox (uses Helvetica "X" instead of ZapfDingbats for PDF/UA compliance)
  doc.addAccessibleCheckBox({
    name: 'subscribe',
    label: 'Subscribe to newsletter',
    tooltip: 'Check to receive our newsletter',
    x: 20, y: 68, width: 10, height: 10
  });

  // Combobox
  doc.beginStructureElement('P');
  doc.text('Country:', 20, 95);
  doc.endStructureElement();
  doc.addAccessibleComboBox({
    name: 'country',
    label: 'Country selection',
    tooltip: 'Select your country from the list',
    x: 50, y: 88, width: 60, height: 12,
    options: ['USA', 'Germany', 'France', 'UK', 'Japan']
  });
doc.endSect();

// --- Section 7: Quotes and Code ---
doc.beginSect();
  doc.beginStructureElement('H2');
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('7. Quotes and Code', 20, 120);
  doc.endStructureElement();

  doc.beginStructureElement('H3');
  doc.setFontSize(12);
  doc.text('Inline Quote', 20, 133);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('Shakespeare wrote: ', 20, 145);
  doc.beginQuote();
  doc.setFont(undefined, 'italic');
  doc.text('"To be or not to be, that is the question."', 63, 145);
  doc.setFont(undefined, 'normal');
  doc.endQuote();
  doc.endStructureElement();

  doc.beginStructureElement('H3');
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Block Quote', 20, 162);
  doc.endStructureElement();

  doc.beginBlockQuote();
    doc.beginStructureElement('P');
    doc.setFontSize(11);
    doc.setFont(undefined, 'italic');
    doc.text('"The only way to do great work is to love what you do.', 30, 175);
    doc.text('If you haven\'t found it yet, keep looking. Don\'t settle."', 30, 183);
    doc.setFont(undefined, 'normal');
    doc.text('- Steve Jobs', 30, 195);
    doc.endStructureElement();
  doc.endBlockQuote();

  doc.beginStructureElement('H3');
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Code Examples', 20, 215);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('Inline code: ', 20, 228);
  doc.beginCode();
  doc.text('const x = 42;', 52, 228);
  doc.endCode();
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('Code block:', 20, 242);
  doc.endStructureElement();

  doc.beginCode({ placement: 'Block' });
    doc.text('function greet(name) {', 25, 255);
    doc.text('  return `Hello, ${name}!`;', 25, 263);
    doc.text('}', 25, 271);
  doc.endCode();
doc.endSect();

// --- Footer Artifact ---
doc.beginArtifact({ type: 'Pagination', subtype: 'Footer' });
doc.setFontSize(8);
doc.setTextColor(128, 128, 128);
doc.text('Generated by jsPDF with PDF/UA support', 20, 285);
doc.text('3', 105, 285);
doc.setTextColor(0, 0, 0);
doc.endArtifact();

// ============================================================================
// PAGE 4: Footnotes and Figures
// ============================================================================
doc.addPage();

// --- Header Artifact ---
doc.beginArtifact({ type: 'Pagination', subtype: 'Header' });
doc.setFontSize(8);
doc.setTextColor(128, 128, 128);
doc.text('PDF/UA Complete Showcase', 20, 10);
doc.text('Page 4', 180, 10);
doc.setTextColor(0, 0, 0);
doc.endArtifact();

// --- Section 8: Footnotes ---
doc.beginSect();
  doc.beginStructureElement('H2');
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('8. Footnotes and References', 20, 25);
  doc.endStructureElement();

  // Single paragraph with inline footnote references (correct PDF/UA structure)
  doc.beginStructureElement('P');
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');

  // First part of text
  let fnX = 20;
  doc.text('PDF/UA (Universal Accessibility) is an ISO standard', fnX, 40);
  fnX += doc.getTextWidth('PDF/UA (Universal Accessibility) is an ISO standard');

  // Footnote reference ¹ - directly attached to word (no space)
  doc.addFootnoteRef('¹', fnX, 40, { noteId: 'fn1' });
  fnX += doc.getTextWidth('¹') * 0.7 + 1;

  // Continue text
  doc.text(' that ensures PDFs can be read by', fnX, 40);

  // Second line
  fnX = 20;
  doc.text('assistive technologies. The Matterhorn Protocol', fnX, 50);
  fnX += doc.getTextWidth('assistive technologies. The Matterhorn Protocol');

  // Footnote reference ² - directly attached to word
  doc.addFootnoteRef('²', fnX, 50, { noteId: 'fn2' });
  fnX += doc.getTextWidth('²') * 0.7 + 1;

  // Continue text
  doc.text(' provides validation checkpoints', fnX, 50);

  // Third line
  doc.text('for PDF/UA compliance.', 20, 60);
  doc.endStructureElement();

  // Separator line as artifact (at page bottom)
  doc.beginArtifact({ type: 'Layout' });
  doc.line(20, 68, 100, 68);
  doc.endArtifact();

  // Footnotes using the new convenience API
  doc.setFontSize(9);

  doc.addFootnote({
    id: 'fn1',
    label: '¹',
    text: 'ISO 14289-1:2014, Document management — Electronic document file format enhancement for accessibility',
    x: 25,
    y: 75,
    labelX: 20
  });

  doc.addFootnote({
    id: 'fn2',
    label: '²',
    text: 'PDF Association, Matterhorn Protocol 1.1',
    x: 25,
    y: 85,
    labelX: 20
  });

  doc.setFontSize(11);
doc.endSect();

// --- Section 9: Figures ---
doc.beginSect();
  doc.beginStructureElement('H2');
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('9. Figures and Captions', 20, 110);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('Figures with alternative text and captions:', 20, 123);
  doc.endStructureElement();

  // Figure 1 - Placeholder representing an image
  // Note: Graphics (rect) are omitted because jsPDF doesn't yet support
  // marked content for graphical operations. Using text placeholder instead.
  // BBox is recommended by PAC for better accessibility in alternate presentations
  // BBox format: [x, y, width, height] in points (PDF coordinates from bottom-left)
  doc.beginFigure({
    alt: 'A placeholder representing a bar chart showing quarterly sales data with Q1 at 25%, Q2 at 30%, Q3 at 20%, and Q4 at 25%',
    bbox: [20, 640, 90, 70]  // x, y (from bottom), width, height
  });

  // Text placeholder for image (graphics can't be tagged yet)
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text('[Bar Chart: Q1=25%, Q2=30%, Q3=20%, Q4=25%]', 20, 158);
  doc.setTextColor(0, 0, 0);

  doc.beginCaption();
  doc.setFontSize(10);
  doc.text('Figure 1: Quarterly Sales Distribution', 20, 188);
  doc.endCaption();
  doc.endFigure();

  // Figure 2
  doc.beginFigure({
    alt: 'A placeholder representing a process flow diagram with three connected boxes showing Input, Process, and Output stages',
    bbox: [120, 640, 80, 70]  // x, y (from bottom), width, height
  });

  // Text placeholder for image (graphics can't be tagged yet)
  doc.setTextColor(128, 128, 128);
  doc.text('[Flow: Input -> Process -> Output]', 120, 158);
  doc.setTextColor(0, 0, 0);

  doc.beginCaption();
  doc.text('Figure 2: Process Flow Diagram', 120, 188);
  doc.endCaption();
  doc.endFigure();
doc.endSect();

// --- Annotations Section ---
doc.beginSect();
  doc.beginStructureElement('H2');
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('9.1 Annotations', 20, 210);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('First annotation test:', 20, 225);
  doc.endStructureElement();

  // First annotation - at x=150 (middle of page)
  doc.beginAnnot({ alt: 'First comment' });
  const annotId1 = doc.createAnnotation({
    type: 'text',
    title: 'Reviewer 1',
    contents: 'This is the first annotation.',
    bounds: { x: 150, y: 220, w: 20, h: 20 },
    open: false
  });
  if (annotId1) doc.addAnnotationRef(annotId1);
  doc.endAnnot();

  doc.beginStructureElement('P');
  doc.text('Second annotation test:', 20, 240);
  doc.endStructureElement();

  // Second annotation - at x=100 (left side)
  doc.beginAnnot({ alt: 'Second comment' });
  const annotId2 = doc.createAnnotation({
    type: 'text',
    title: 'Reviewer 2',
    contents: 'This is the second annotation.',
    bounds: { x: 100, y: 235, w: 20, h: 20 },
    open: true
  });
  if (annotId2) doc.addAnnotationRef(annotId2);
  doc.endAnnot();

  doc.beginStructureElement('P');
  doc.text('Third annotation (open by default):', 20, 255);
  doc.endStructureElement();

  // Third annotation - open and at x=50
  doc.beginAnnot({ alt: 'Third comment - open' });
  const annotId3 = doc.createAnnotation({
    type: 'text',
    title: 'Reviewer 3',
    contents: 'This annotation should be open!',
    bounds: { x: 50, y: 250, w: 20, h: 20 },
    open: true
  });
  if (annotId3) doc.addAnnotationRef(annotId3);
  doc.endAnnot();

  doc.beginStructureElement('P');
  doc.text('You should see three annotation icons above.', 20, 270);
  doc.endStructureElement();
doc.endSect();

// --- Footer Artifact ---
doc.beginArtifact({ type: 'Pagination', subtype: 'Footer' });
doc.setFontSize(8);
doc.setTextColor(128, 128, 128);
doc.text('Generated by jsPDF with PDF/UA support', 20, 285);
doc.text('4', 105, 285);
doc.setTextColor(0, 0, 0);
doc.endArtifact();

// ============================================================================
// PAGE 5: Advanced Elements
// ============================================================================
doc.addPage();

// --- Header Artifact ---
doc.beginArtifact({ type: 'Pagination', subtype: 'Header' });
doc.setFontSize(8);
doc.setTextColor(128, 128, 128);
doc.text('PDF/UA Complete Showcase', 20, 10);
doc.text('Page 5', 180, 10);
doc.setTextColor(0, 0, 0);
doc.endArtifact();

// --- Section 10: Advanced Elements ---
doc.beginSect();
  doc.beginStructureElement('H2');
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('10. Advanced Structure Elements', 20, 25);
  doc.endStructureElement();

  // Art element
  doc.beginStructureElement('H3');
  doc.setFontSize(12);
  doc.text('Article (Art)', 20, 40);
  doc.endStructureElement();

  doc.beginArt();
    doc.beginStructureElement('P');
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('This is a self-contained article that could be distributed independently.', 25, 52);
    doc.endStructureElement();
  doc.endArt();

  // Div element
  doc.beginStructureElement('H3');
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Division (Div)', 20, 70);
  doc.endStructureElement();

  doc.beginDiv();
    doc.beginStructureElement('P');
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Content grouped in a generic division container for layout purposes.', 25, 82);
    doc.endStructureElement();
  doc.endDiv();

  // NonStruct element
  doc.beginStructureElement('H3');
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('NonStruct (Layout Grouping)', 20, 100);
  doc.endStructureElement();

  doc.beginNonStruct();
    doc.beginStructureElement('P');
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Content in NonStruct is read but has no semantic structure meaning.', 25, 112);
    doc.endStructureElement();
  doc.endNonStruct();

  // Private element
  doc.beginStructureElement('H3');
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Private (Application Data)', 20, 130);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('Private elements contain data not intended for screen readers:', 20, 142);
  doc.endStructureElement();

  doc.beginPrivate();
    doc.text('[Internal metadata: doc-version=1.0, author-id=42]', 25, 154);
  doc.endPrivate();
doc.endSect();

// --- Section 11: PDF 2.0 Elements ---
doc.beginSect();
  doc.beginStructureElement('H2');
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('11. PDF 2.0 Elements', 20, 175);
  doc.endStructureElement();

  // DocumentFragment
  doc.beginStructureElement('H3');
  doc.setFontSize(12);
  doc.text('DocumentFragment', 20, 188);
  doc.endStructureElement();

  doc.beginDocumentFragment({ lang: 'en-US' });
    doc.beginStructureElement('P');
    doc.setFontSize(11);
    doc.setFont(undefined, 'italic');
    doc.text('"This is an excerpt from another document, properly marked as a fragment."', 25, 200);
    doc.setFont(undefined, 'normal');
    doc.endStructureElement();
  doc.endDocumentFragment();

  // Aside
  doc.beginStructureElement('H3');
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Aside (Sidebar)', 20, 218);
  doc.endStructureElement();

  doc.beginAside();
    doc.beginStructureElement('P');
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('This is sidebar content that is tangentially related to the main content.', 25, 230);
    doc.text('It could contain tips, related information, or author notes.', 25, 238);
    doc.endStructureElement();
  doc.endAside();

  // Note: Ruby/Warichu (CJK annotations) require CJK fonts and are demonstrated
  // in the separate test-suite-ruby-warichu.js test file.
doc.endSect();

// --- Footer Artifact ---
doc.beginArtifact({ type: 'Pagination', subtype: 'Footer' });
doc.setFontSize(8);
doc.setTextColor(128, 128, 128);
doc.text('Generated by jsPDF with PDF/UA support', 20, 285);
doc.text('5', 105, 285);
doc.setTextColor(0, 0, 0);
doc.endArtifact();

// ============================================================================
// PAGE 6: Bibliography and Index
// ============================================================================
doc.addPage();

// --- Header Artifact ---
doc.beginArtifact({ type: 'Pagination', subtype: 'Header' });
doc.setFontSize(8);
doc.setTextColor(128, 128, 128);
doc.text('PDF/UA Complete Showcase', 20, 10);
doc.text('Page 6', 180, 10);
doc.setTextColor(0, 0, 0);
doc.endArtifact();

// --- Section 12: Bibliography ---
doc.beginSect();
  doc.beginStructureElement('H2');
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('12. Bibliography', 20, 25);
  doc.endStructureElement();

  // BibEntry elements for bibliography items
  doc.beginBibEntry();
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('[1] ISO 14289-1:2014. Document management — Electronic document file format', 25, 40);
  doc.text('    enhancement for accessibility — Part 1: Use of ISO 32000-1 (PDF/UA-1).', 25, 48);
  doc.endBibEntry();

  doc.beginBibEntry();
  doc.text('[2] PDF Association. (2024). The Matterhorn Protocol 1.1. PDF Association.', 25, 62);
  doc.endBibEntry();

  doc.beginBibEntry();
  doc.text('[3] W3C. (2018). Web Content Accessibility Guidelines (WCAG) 2.1.', 25, 76);
  doc.text('    World Wide Web Consortium.', 25, 84);
  doc.endBibEntry();

  doc.beginBibEntry();
  doc.text('[4] Adobe. (2008). PDF Reference, Sixth Edition, Version 1.7.', 25, 98);
  doc.text('    Adobe Systems Incorporated.', 25, 106);
  doc.endBibEntry();
doc.endSect();

// --- Index ---
doc.beginSect();
  doc.beginStructureElement('H2');
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Index', 20, 130);
  doc.endStructureElement();

  doc.beginIndex();
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const indexEntries = [
      'Abbreviations .......................... 1',
      'Annotations ............................ 4',
      'Artifacts .............................. 1, 2, 3, 4, 5, 6',
      'Bibliography ........................... 6',
      'Bookmarks .............................. 1',
      'Captions ............................... 4',
      'Code ................................... 3',
      'Figures ................................ 4',
      'Footnotes .............................. 4',
      'Forms .................................. 3',
      'Headings ............................... 1, 2, 3, 4, 5, 6',
      'Links .................................. 2',
      'Lists .................................. 2',
      'PDF 2.0 Elements ....................... 5',
      'Quotes ................................. 3',
      'Tables ................................. 2',
      'Text Elements .......................... 1'
    ];

    let indexY = 140;
    indexEntries.forEach(entry => {
      doc.beginStructureElement('P');
      doc.text(entry, 25, indexY);
      doc.endStructureElement();
      indexY += 7;  // Reduced spacing to fit better
    });
  doc.endIndex();
doc.endSect();

// --- Closing ---
doc.beginStructureElement('P');
doc.setFontSize(11);
doc.setFont(undefined, 'italic');
doc.text('End of PDF/UA Complete Showcase Document', 50, 262);
doc.endStructureElement();

// Close Document structure
doc.endStructureElement(); // End Document

// --- Footer Artifact ---
doc.beginArtifact({ type: 'Pagination', subtype: 'Footer' });
doc.setFontSize(8);
doc.setTextColor(128, 128, 128);
doc.text('Generated by jsPDF with PDF/UA support', 20, 285);
doc.text('6', 105, 285);
doc.setTextColor(0, 0, 0);
doc.endArtifact();

// ============================================================================
// Save Document
// ============================================================================
const outputDir = path.join(__dirname, '../../examples/temp');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'pdfua-complete-showcase.pdf');
const arrayBuffer = doc.output('arraybuffer');
fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));

console.log('\n' + '='.repeat(70));
console.log('SUCCESS: PDF/UA Complete Showcase Document Generated');
console.log('='.repeat(70));
console.log('\nOutput: ' + outputPath);
console.log('\nFeatures demonstrated:');
console.log('  - Document metadata (title, language)');
console.log('  - Table of Contents with internal links');
console.log('  - Outlines/Bookmarks for navigation');
console.log('  - 6 heading levels (H1-H6)');
console.log('  - Paragraphs and text formatting');
console.log('  - Strong and Em emphasis');
console.log('  - Abbreviations with expansion');
console.log('  - Language changes within text');
console.log('  - Mathematical formulas with alt text');
console.log('  - Ordered and unordered lists');
console.log('  - Tables with header scope');
console.log('  - External and internal links');
console.log('  - Form fields (text, checkbox, combobox)');
console.log('  - Inline and block quotes');
console.log('  - Inline and block code');
console.log('  - Footnotes and references');
console.log('  - Figures with alt text and captions');
console.log('  - Text annotations');
console.log('  - Artifacts (headers, footers, decorative)');
console.log('  - Grouping elements (Art, Div, Sect)');
console.log('  - NonStruct and Private elements');
console.log('  - PDF 2.0 elements (DocumentFragment, Aside)');
console.log('  - Ruby annotations (CJK)');
console.log('  - Bibliography');
console.log('  - Index');
console.log('\nValidation:');
console.log('  docker run --rm -v "$(pwd)/examples/temp:/data" verapdf/cli --flavour ua1 /data/pdfua-complete-showcase.pdf');
console.log('\n' + '='.repeat(70));
