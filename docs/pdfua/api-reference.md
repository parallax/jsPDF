# PDF/UA API Reference

## Document Setup

### Constructor Option

```javascript
const doc = new jsPDF({ pdfUA: true });
```

### setDocumentTitle(title)

Sets the document title (required for PDF/UA).

```javascript
doc.setDocumentTitle('My Document Title');
```

### setLanguage(lang)

Sets the document language (required for PDF/UA).

```javascript
doc.setLanguage('en-US');  // English (US)
doc.setLanguage('de-DE');  // German
doc.setLanguage('fr-FR');  // French
```

---

## Structure Elements

### beginStructureElement(type, attributes) / endStructureElement()

Creates a structure element. All content must be within structure elements.

```javascript
doc.beginStructureElement('P');
doc.text('Paragraph text', 10, 20);
doc.endStructureElement();
```

**Available types:**
- Document structure: `Document`, `Part`, `Art`, `Sect`, `Div`
- Headings: `H1`, `H2`, `H3`, `H4`, `H5`, `H6`
- Block elements: `P`, `L`, `LI`, `Lbl`, `LBody`
- Tables: `Table`, `THead`, `TBody`, `TFoot`, `TR`, `TH`, `TD`
- Inline elements: `Span`, `Link`, `Quote`, `Code`, `Note`, `Reference`
- Special: `Figure`, `Formula`, `Form`, `TOC`, `TOCI`, `Index`, `BibEntry`
- PDF 2.0: `DocumentFragment`, `Aside`

**Attributes:**
- `alt`: Alternative text (for Figure, Formula)
- `lang`: Language override
- `expansion`: Expansion text (for abbreviations)

---

## Convenience Methods

### Headings

```javascript
// These are equivalent:
doc.beginStructureElement('H1');
// ... content ...
doc.endStructureElement();
```

### Lists

```javascript
doc.beginStructureElement('L');          // List
  doc.beginStructureElement('LI');       // List Item
    doc.beginStructureElement('Lbl');    // Label (bullet/number)
    doc.text('1.', 10, 20);
    doc.endStructureElement();
    doc.beginStructureElement('LBody');  // List Body
    doc.text('First item', 20, 20);
    doc.endStructureElement();
  doc.endStructureElement();
doc.endStructureElement();
```

### Tables

```javascript
doc.beginStructureElement('Table');
  doc.beginTableHead();
    doc.beginStructureElement('TR');
      doc.beginStructureElement('TH', { scope: 'Column' });
      doc.text('Header', 10, 20);
      doc.endStructureElement();
    doc.endStructureElement();
  doc.endTableHead();
  doc.beginTableBody();
    doc.beginStructureElement('TR');
      doc.beginStructureElement('TD');
      doc.text('Data', 10, 35);
      doc.endStructureElement();
    doc.endStructureElement();
  doc.endTableBody();
doc.endStructureElement();
```

### Links

```javascript
doc.beginLink('https://example.com');
doc.text('Click here', 10, 20);
doc.endLink();

// Internal link
doc.beginLink({ pageNumber: 2, top: 100 });
doc.text('Go to page 2', 10, 35);
doc.endLink();
```

### Images

```javascript
doc.beginStructureElement('Figure', { alt: 'Description of the image' });
doc.addImage(imageData, 'PNG', x, y, width, height);
doc.endStructureElement();

// With caption
doc.beginStructureElement('Figure', { alt: 'Chart showing sales data' });
doc.addImage(chartImage, 'PNG', 10, 50, 100, 80);
doc.beginCaption();
doc.text('Figure 1: Quarterly Sales', 10, 135);
doc.endCaption();
doc.endStructureElement();
```

---

## Inline Elements

### Span (with language change)

```javascript
doc.beginStructureElement('P');
doc.text('This is English text with ', 10, 20);
doc.beginSpan({ lang: 'fr-FR' });
doc.text('un peu de français', 80, 20);
doc.endSpan();
doc.text(' mixed in.', 140, 20);
doc.endStructureElement();
```

### Strong / Emphasis

```javascript
doc.beginStrong();
doc.text('Important text', 10, 20);
doc.endStrong();

doc.beginEm();
doc.text('Emphasized text', 10, 35);
doc.endEm();
```

### Quotes

```javascript
// Inline quote
doc.beginQuote();
doc.text('To be or not to be', 10, 20);
doc.endQuote();

// Block quote
doc.beginBlockQuote();
doc.beginStructureElement('P');
doc.text('A longer quotation...', 10, 35);
doc.endStructureElement();
doc.endBlockQuote();
```

### Code

```javascript
// Inline code
doc.beginCode();
doc.text('const x = 42;', 10, 20);
doc.endCode();

// Code block
doc.beginCodeBlock();
doc.text('function hello() {', 10, 35);
doc.text('  console.log("Hi");', 10, 45);
doc.text('}', 10, 55);
doc.endCodeBlock();
```

### Abbreviations

```javascript
doc.beginAbbreviation('World Wide Web');
doc.text('WWW', 10, 20);
doc.endAbbreviation();
```

### Formulas

```javascript
doc.beginFormula({ alt: 'E equals m times c squared' });
doc.text('E = mc²', 10, 20);
doc.endFormula();
```

---

## Footnotes and References

```javascript
// In main text
doc.beginStructureElement('P');
doc.text('Einstein developed relativity', 10, 20);
doc.beginReference();
doc.text('¹', 95, 20);
doc.endReference();
doc.endStructureElement();

// Footnote
doc.beginNote();
doc.text('¹ Albert Einstein, 1905', 10, 250);
doc.endNote();
```

---

## Table of Contents

```javascript
doc.beginTOC();
  doc.beginTOCI();
  doc.beginReference();
  doc.beginLink({ pageNumber: 1 });
  doc.text('Chapter 1 ..... 1', 10, 20);
  doc.endLink();
  doc.endReference();
  doc.endTOCI();
doc.endTOC();
```

---

## Grouping Elements

### Document Structure Hierarchy

Use these elements to organize document content hierarchically:

```javascript
// Part - Major division (books, volumes)
doc.beginPart();
  // Part content...
doc.endPart();

// Art - Self-contained article
doc.beginArt();
  // Article content...
doc.endArt();

// Sect - Section within a part
doc.beginSect();
  doc.beginStructureElement('H2');
  doc.text('Section Title', 10, 20);
  doc.endStructureElement();
  // Section content...
doc.endSect();

// Div - Generic container for layout grouping
doc.beginDiv();
  // Grouped content...
doc.endDiv();
```

### Sections

```javascript
doc.beginSect();
  doc.beginStructureElement('H2');
  doc.text('Section Title', 10, 20);
  doc.endStructureElement();
  // Section content...
doc.endSect();
```

### Document Fragment (PDF 2.0)

For excerpts from other documents:

```javascript
doc.beginDocumentFragment({ lang: 'en-US' });
  doc.beginStructureElement('P');
  doc.text('Excerpt from another document...', 10, 20);
  doc.endStructureElement();
doc.endDocumentFragment();
```

### Aside (PDF 2.0)

For sidebars and tangentially related content:

```javascript
doc.beginAside();
  doc.beginStructureElement('H3');
  doc.text('Did You Know?', 120, 20);
  doc.endStructureElement();
  doc.beginStructureElement('P');
  doc.text('Interesting fact...', 120, 35);
  doc.endStructureElement();
doc.endAside();
```

### NonStruct (Layout Grouping)

For grouping elements without semantic meaning. Content IS read by screen readers:

```javascript
doc.beginNonStruct();
  // Layout-grouped content that should be read
  doc.beginStructureElement('P');
  doc.text('This content is read normally', 10, 20);
  doc.endStructureElement();
doc.endNonStruct();
```

### Private (Application-specific)

For content that should be ignored by screen readers:

```javascript
doc.beginPrivate();
  // Internal processing content - NOT read by screen readers
  doc.text('Internal metadata', 10, 20);
doc.endPrivate();
```

**Note:** Use `Private` sparingly. Most content should be accessible.

---

## Artifacts

For decorative content not meant for screen readers:

```javascript
// Simple artifact
doc.beginArtifact();
doc.text('Page decoration', 10, 290);
doc.endArtifact();

// Typed artifact (header/footer)
doc.beginArtifact({ type: 'Pagination', subtype: 'Header' });
doc.text('Company Name', 10, 10);
doc.endArtifact();

doc.beginArtifact({ type: 'Pagination', subtype: 'Footer' });
doc.text('Page 1', 100, 290);
doc.endArtifact();
```

---

## Form Fields

```javascript
doc.beginForm({ label: 'Full Name', required: true });
doc.createTextField('name', 50, 100, 100, 20, {
  value: '',
  required: true
});
doc.endForm();

// Checkbox
doc.beginForm({ label: 'I agree to the terms' });
doc.createCheckBox('agree', 50, 130, 15, 15, {});
doc.endForm();
```

---

## Annotations

```javascript
// Text annotation (sticky note)
doc.beginAnnot({ alt: 'Comment about this section' });
const annotId = doc.createAnnotation({
  type: 'text',
  title: 'Reviewer',
  contents: 'Please verify this information',
  bounds: { x: 180, y: 35, w: 20, h: 20 }
});
if (annotId) doc.addAnnotationRef(annotId);
doc.endAnnot();
```

**Note:** See [Limitations](./limitations.md#annotations) for information about annotation reading order.

---

## Bookmarks

```javascript
// Add bookmarks for navigation
doc.addBookmark('Chapter 1', 1, 0);      // Page 1, top
doc.addBookmark('Section 1.1', 1, 100);  // Page 1, y=100
doc.addBookmark('Chapter 2', 2, 0);      // Page 2, top
```

---

## Bibliography

```javascript
doc.beginBibliography();
  doc.beginBibEntry();
  doc.text('[1] Smith, J. (2024). Title. Publisher.', 10, 20);
  doc.endBibEntry();
doc.endBibliography();
```

---

## Index

```javascript
doc.beginIndex();
  doc.beginStructureElement('P');
  doc.text('Accessibility, 12, 45, 67', 10, 20);
  doc.endStructureElement();
doc.endIndex();
```

---

## CJK Support (Ruby/Warichu)

For East Asian typography:

```javascript
// Ruby (pronunciation guide)
doc.beginRuby();
  doc.beginRubyBaseText();
  doc.text('漢字', 10, 20);
  doc.endRubyBaseText();
  doc.beginRubyText();
  doc.text('かんじ', 10, 15);
  doc.endRubyText();
doc.endRuby();

// Warichu (inline annotation)
doc.beginWarichu();
  doc.beginWarichuPunctuation();
  doc.text('(', 10, 20);
  doc.endWarichuPunctuation();
  doc.beginWarichuText();
  doc.text('annotation', 15, 20);
  doc.endWarichuText();
  doc.beginWarichuPunctuation();
  doc.text(')', 50, 20);
  doc.endWarichuPunctuation();
doc.endWarichu();
```
