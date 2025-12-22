# Getting Started with PDF/UA in jsPDF

## Enabling PDF/UA Mode

To create PDF/UA compliant documents, enable PDF/UA mode when creating the jsPDF instance:

```javascript
const doc = new jsPDF({ pdfUA: true });
```

## Required Setup

Every PDF/UA document must have:

1. **Document Title**: Displayed in the title bar
2. **Language**: Primary language of the document
3. **Structure Tree**: Proper tagging of all content

```javascript
const doc = new jsPDF({ pdfUA: true });

// Required: Set document title
doc.setDocumentTitle('Annual Report 2024');

// Required: Set document language
doc.setLanguage('en-US');  // or 'de-DE', 'fr-FR', etc.
```

## Basic Document Structure

All content must be wrapped in structure elements:

```javascript
doc.beginStructureElement('Document');

  // Heading
  doc.beginStructureElement('H1');
  doc.text('Chapter 1: Introduction', 10, 20);
  doc.endStructureElement();

  // Paragraph
  doc.beginStructureElement('P');
  doc.text('This is the first paragraph of the document.', 10, 35);
  doc.endStructureElement();

  // Another paragraph
  doc.beginStructureElement('P');
  doc.text('This is the second paragraph.', 10, 50);
  doc.endStructureElement();

doc.endStructureElement();
```

## Font Requirements

PDF/UA requires embedded fonts. jsPDF automatically embeds the Atkinson Hyperlegible font (designed for accessibility) when PDF/UA mode is enabled.

To use custom fonts:

```javascript
// Load and add your font
doc.addFileToVFS('MyFont.ttf', base64EncodedFont);
doc.addFont('MyFont.ttf', 'MyFont', 'normal');
doc.setFont('MyFont');
```

## Images with Alternative Text

All images must have alternative text:

```javascript
doc.beginStructureElement('Figure', { alt: 'Company logo showing a blue globe' });
doc.addImage(imageData, 'PNG', 10, 100, 50, 50);
doc.endStructureElement();
```

## Complete Example

```javascript
const { jsPDF } = require('jspdf');

const doc = new jsPDF({ pdfUA: true });

// Metadata
doc.setDocumentTitle('Quarterly Report Q4 2024');
doc.setLanguage('en-US');

// Content
doc.beginStructureElement('Document');

  // Title
  doc.beginStructureElement('H1');
  doc.setFontSize(24);
  doc.text('Quarterly Report', 10, 25);
  doc.endStructureElement();

  // Subtitle
  doc.beginStructureElement('H2');
  doc.setFontSize(16);
  doc.text('Q4 2024 Financial Summary', 10, 40);
  doc.endStructureElement();

  // Introduction
  doc.beginStructureElement('P');
  doc.setFontSize(12);
  doc.text('This report summarizes our financial performance for the fourth quarter.', 10, 55);
  doc.endStructureElement();

  // Key metrics section
  doc.beginStructureElement('H2');
  doc.text('Key Metrics', 10, 75);
  doc.endStructureElement();

  // List of metrics
  doc.beginStructureElement('L');  // List
    doc.beginStructureElement('LI');
      doc.beginStructureElement('LBody');
      doc.text('• Revenue: $2.5M (+15%)', 15, 90);
      doc.endStructureElement();
    doc.endStructureElement();
    doc.beginStructureElement('LI');
      doc.beginStructureElement('LBody');
      doc.text('• Customers: 1,250 (+8%)', 15, 105);
      doc.endStructureElement();
    doc.endStructureElement();
  doc.endStructureElement();

doc.endStructureElement();

// Save
doc.save('quarterly-report.pdf');
```

## Next Steps

- See [API Reference](./api-reference.md) for all available methods
- See [Structure Elements](./structure-elements.md) for available element types
- See [Known Limitations](./limitations.md) for current constraints
