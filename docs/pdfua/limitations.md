# Known Limitations

This document describes known limitations of the PDF/UA implementation in jsPDF.

## Annotations

### Reading Order Limitation

**Issue:** When using `Annot` structure elements for PDF annotations (Text, FreeText), screen readers may not read the annotations at their logical position in the document structure.

**Behavior:** Annotations may be announced after surrounding content blocks rather than inline at the position where they were defined in the structure tree.

**Technical Reason:** PDF annotations are stored separately from the content stream. While the structure tree correctly references annotations via OBJR (Object Reference), screen readers may process annotations after the main content stream regardless of their structural position.

**Example:**
```javascript
// Even though the annotation is placed between two paragraphs
// in the structure tree, it may be read after both paragraphs

doc.beginStructureElement('P');
doc.text('First paragraph.', 10, 20);
doc.endStructureElement();

doc.beginAnnot({ alt: 'Comment on first paragraph' });
const id = doc.createAnnotation({
  type: 'text',
  contents: 'This is a comment',
  bounds: { x: 180, y: 15, w: 20, h: 20 }
});
doc.addAnnotationRef(id);
doc.endAnnot();

doc.beginStructureElement('P');
doc.text('Second paragraph.', 10, 40);
doc.endStructureElement();

// Screen reader may read: "First paragraph. Second paragraph. [Annotation]"
// Instead of: "First paragraph. [Annotation] Second paragraph."
```

**Workaround:** If precise reading order is critical, use the `Note` element instead of PDF annotations. Notes are rendered as regular text content and follow the structure tree order exactly:

```javascript
doc.beginStructureElement('P');
doc.text('First paragraph.', 10, 20);
doc.endStructureElement();

doc.beginNote();
doc.text('[Comment: This is a note]', 10, 30);
doc.endNote();

doc.beginStructureElement('P');
doc.text('Second paragraph.', 10, 45);
doc.endStructureElement();
```

### Widget Annotations (Form Fields)

Widget annotations are handled by the `Form` structure element, not `Annot`. See [Form Fields](#form-fields) below.

### Link Annotations

Link annotations are handled by the `Link` structure element, not `Annot`. Links follow reading order correctly.

---

## Form Fields

### Limited Field Types

Currently supported form field types:
- Text fields (`createTextField`)
- Checkboxes (`createCheckBox`)
- Combo boxes/dropdowns (`createComboBox`)

Not yet fully supported:
- Radio buttons (basic support, may have accessibility issues)
- List boxes
- Signature fields

### Tab Order

Form fields follow the structure tree order for tabbing. Complex form layouts may require careful attention to the order in which fields are created.

---

## Fonts

### Custom Fonts

Custom fonts must be embedded as TrueType fonts. The font file must include a proper Unicode cmap table for text extraction to work correctly.

### Font Subsetting

While jsPDF supports font subsetting, subsetting may affect the `/ToUnicode` mapping. For maximum compatibility, consider embedding full fonts for documents with complex text requirements.

---

## Images

### Alternative Text Required

All images in PDF/UA documents must have alternative text. Decorative images should use an empty alt text with explicit marking:

```javascript
// Content image - alt text required
doc.beginStructureElement('Figure', { alt: 'Description of the image' });
doc.addImage(imageData, 'PNG', x, y, w, h);
doc.endStructureElement();

// Decorative image - use artifact instead
doc.beginArtifact();
doc.addImage(decorativeImage, 'PNG', x, y, w, h);
doc.endArtifact();
```

### Image Formats

Supported formats: JPEG, PNG, GIF, BMP, WebP

Note: Some image formats may increase file size significantly when embedded.

---

## Tables

### Complex Tables

For tables with merged cells (colspan/rowspan), proper header associations become complex. The current implementation supports:
- Simple tables with column headers
- Simple tables with row headers
- Tables with both column and row headers

For complex table layouts with irregular cell spans, manual header ID associations may be needed (not currently supported in the high-level API).

### Nested Tables

Nested tables are not recommended for accessibility. Consider restructuring data to avoid table nesting.

---

## PDF 2.0 Elements

### DocumentFragment and Aside

These elements are part of PDF 2.0 (ISO 32000-2) and may not be fully recognized by older PDF readers or screen readers. Content remains accessible as regular content, but the semantic meaning may not be announced.

### Ruby and Warichu

CJK typography elements (Ruby, Warichu) are structurally supported but require appropriate fonts and may have limited screen reader support depending on the assistive technology.

---

## Optional Content (OCG)

### Not Supported

jsPDF does not currently support Optional Content Groups (layers/OCG).

**Important for Future Implementers:** If OCG support is added to jsPDF, the following PDF/UA requirements must be considered (BITi 11):

1. All optional content must be tagged in the structure tree
2. Default visibility state must ensure all content is accessible
3. Screen readers must be able to access all content regardless of visibility state
4. Layer names should be descriptive and accessible

---

## Multi-page Documents

### Page Breaks in Structure Elements

When a structure element spans multiple pages, ensure content is properly structured on each page. The structure tree automatically handles page references.

### Reading Order Across Pages

Content is read in structure tree order, which follows creation order. For multi-column layouts or complex page designs, create content in logical reading order, not visual order.

---

## Validation

### Matterhorn Protocol

This implementation targets compliance with the Matterhorn Protocol (PDF/UA-1). Some advanced Matterhorn checkpoints may not be fully automated and require manual verification:

- Checkpoint 01-003: Logical reading order
- Checkpoint 01-004: Character mappings
- Checkpoint 07-001: Appropriate language tagging

### Testing Tools

Recommended validation tools:
- **PAC (PDF Accessibility Checker)**: Free, comprehensive PDF/UA validation
- **veraPDF**: Open-source, command-line validation
- **Adobe Acrobat Pro**: Built-in accessibility checker

See [Testing](./testing.md) for detailed testing guidance.
