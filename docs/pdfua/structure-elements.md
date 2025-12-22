# PDF/UA Structure Elements

This document describes all structure elements available in jsPDF's PDF/UA implementation.

## Document Structure

| Element | Description | Usage |
|---------|-------------|-------|
| `Document` | Root element for document content | Required wrapper for all content |
| `Part` | Major division of a document | Books, volumes |
| `Art` | Article or self-contained content | Magazine articles, blog posts |
| `Sect` | Section of content | Chapters, numbered sections |
| `Div` | Generic container | Layout grouping |

## Headings

| Element | Description | Level |
|---------|-------------|-------|
| `H1` | Primary heading | 1 (highest) |
| `H2` | Secondary heading | 2 |
| `H3` | Tertiary heading | 3 |
| `H4` | Fourth-level heading | 4 |
| `H5` | Fifth-level heading | 5 |
| `H6` | Sixth-level heading | 6 (lowest) |

**Best Practice:** Use headings in proper hierarchical order. Don't skip levels.

## Block-Level Elements

### Paragraphs

| Element | Description |
|---------|-------------|
| `P` | Paragraph of text |
| `BlockQuote` | Extended quotation |

### Lists

| Element | Description |
|---------|-------------|
| `L` | List container |
| `LI` | List item |
| `Lbl` | Label (bullet or number) |
| `LBody` | List item content |

**Structure:**
```
L
├── LI
│   ├── Lbl (optional)
│   └── LBody
├── LI
│   ├── Lbl
│   └── LBody
└── ...
```

### Tables

| Element | Description |
|---------|-------------|
| `Table` | Table container |
| `THead` | Table header section |
| `TBody` | Table body section |
| `TFoot` | Table footer section |
| `TR` | Table row |
| `TH` | Table header cell |
| `TD` | Table data cell |

**Attributes for TH:**
- `scope: 'Column'` - Header applies to column
- `scope: 'Row'` - Header applies to row
- `scope: 'Both'` - Header applies to both

**Structure:**
```
Table
├── THead
│   └── TR
│       ├── TH (scope: Column)
│       └── TH (scope: Column)
├── TBody
│   ├── TR
│   │   ├── TH (scope: Row)
│   │   └── TD
│   └── TR
│       ├── TH (scope: Row)
│       └── TD
└── TFoot (optional)
```

## Inline Elements

| Element | Description | API Method |
|---------|-------------|------------|
| `Span` | Generic inline container | `beginSpan()` / `endSpan()` |
| `Quote` | Inline quotation | `beginQuote()` / `endQuote()` |
| `Code` | Inline code | `beginCode()` / `endCode()` |
| `Link` | Hyperlink | `beginLink()` / `endLink()` |
| `Note` | Footnote/endnote | `beginNote()` / `endNote()` |
| `Reference` | Reference to note | `beginReference()` / `endReference()` |
| `BibEntry` | Bibliography entry | `beginBibEntry()` / `endBibEntry()` |

### Text Emphasis

| Element | Description | API Method |
|---------|-------------|------------|
| `Strong` | Strong importance | `beginStrong()` / `endStrong()` |
| `Em` | Emphasis | `beginEm()` / `endEm()` |

## Special Elements

### Figure

For images and illustrations:

```javascript
doc.beginStructureElement('Figure', {
  alt: 'Description of the image content'
});
doc.addImage(imageData, 'PNG', x, y, w, h);
doc.endStructureElement();
```

**Required:** `alt` attribute for accessibility.

### Formula

For mathematical expressions:

```javascript
doc.beginFormula({
  alt: 'Description of the formula'
});
doc.text('E = mc²', x, y);
doc.endFormula();
```

### Caption

For figure/table captions:

```javascript
doc.beginStructureElement('Figure', { alt: '...' });
doc.addImage(...);
doc.beginCaption();
doc.text('Figure 1: Description', x, y);
doc.endCaption();
doc.endStructureElement();
```

### Form

For form fields:

```javascript
doc.beginForm({
  label: 'Field label',
  required: true
});
doc.createTextField('fieldName', x, y, w, h, options);
doc.endForm();
```

## Navigation Elements

### Table of Contents

| Element | Description |
|---------|-------------|
| `TOC` | Table of contents container |
| `TOCI` | Table of contents item |

### Index

| Element | Description |
|---------|-------------|
| `Index` | Index container |

## PDF 2.0 Elements

These elements are part of PDF 2.0 (ISO 32000-2) and may not be fully supported by older PDF readers. Content remains accessible but may not be announced specially.

### DocumentFragment

For excerpts from other documents:

```javascript
doc.beginDocumentFragment({ lang: 'en-US' });
// Content from external document
doc.endDocumentFragment();
```

**Use cases:**
- Legal document citations
- Specification excerpts
- Embedded content from other sources

### Aside

For tangentially related content:

```javascript
doc.beginAside();
// Sidebar content
doc.endAside();
```

**Use cases:**
- Sidebars
- Pull quotes
- Author biographies
- Advertising
- Related links

## CJK Typography Elements

For East Asian languages (Chinese, Japanese, Korean):

### Ruby

Pronunciation guides (furigana, pinyin):

| Element | Description |
|---------|-------------|
| `Ruby` | Ruby container |
| `RB` | Ruby base text |
| `RT` | Ruby annotation text |
| `RP` | Ruby punctuation (fallback) |

### Warichu

Inline annotations:

| Element | Description |
|---------|-------------|
| `Warichu` | Warichu container |
| `WT` | Warichu text |
| `WP` | Warichu punctuation |

## Layout Elements

### NonStruct

Grouping without semantic meaning (content IS read):

```javascript
doc.beginNonStruct();
// Layout grouped content
doc.endNonStruct();
```

### Private

Content for application use (ignored by screen readers):

```javascript
doc.beginPrivate();
// Internal processing content
doc.endPrivate();
```

## Annotation Element

### Annot

For non-link annotations (comments, notes):

```javascript
doc.beginAnnot({ alt: 'Annotation description' });
const id = doc.createAnnotation({
  type: 'text',
  contents: 'Comment text',
  bounds: { x, y, w, h }
});
doc.addAnnotationRef(id);
doc.endAnnot();
```

**Note:** Link and Widget annotations are handled separately by `Link` and `Form` elements.

## Element Hierarchy Rules

1. `Document` should be the root container
2. Headings (`H1`-`H6`) should follow proper hierarchy
3. `LI` must be direct children of `L`
4. `TR` must be direct children of `THead`, `TBody`, `TFoot`, or `Table`
5. `TH` and `TD` must be direct children of `TR`
6. Inline elements should be within block elements

## BITi Prüfschritte Reference

| BITi Step | Elements |
|-----------|----------|
| 02.1.0 | Document, Part, Art, Sect, Div |
| 02.1.1 | TOC, TOCI |
| 02.1.2 | BlockQuote, Index, NonStruct, Private |
| 02.2.0 | H1-H6 |
| 02.2.1 | L, LI, Lbl, LBody |
| 02.2.2 | Table, THead, TBody, TFoot, TR, TH, TD |
| 02.2.3 | P |
| 02.3.0 | Note, Reference |
| 02.3.1 | Link |
| 02.3.2 | Annot |
| 02.3.3 | Ruby, RB, RT, RP, Warichu, WT, WP |
| 02.3.4 | Span, Quote, BibEntry, Code |
| 02.4.0 | Formula |
| 02.4.1 | Figure, Caption |
| 02.4.2 | Form |
