# PDF/UA Support in jsPDF

This directory contains documentation for the PDF/UA (Universal Accessibility) implementation in jsPDF.

## Contents

- [Getting Started](./getting-started.md) - Introduction and basic usage
- [API Reference](./api-reference.md) - Complete API documentation
- [Structure Elements](./structure-elements.md) - Available structure elements
- [Examples](./examples.md) - Complete real-world examples
- [Known Limitations](./limitations.md) - Current limitations and workarounds
- [Testing](./testing.md) - How to test PDF/UA compliance

## What is PDF/UA?

PDF/UA (ISO 14289) is the international standard for accessible PDF documents. It ensures that PDF files can be read by assistive technologies like screen readers.

## Quick Start

```javascript
const { jsPDF } = require('jspdf');

// Create a PDF/UA compliant document
const doc = new jsPDF({ pdfUA: true });

// Set required metadata
doc.setDocumentTitle('My Accessible Document');
doc.setLanguage('en-US');

// Create structured content
doc.beginStructureElement('Document');
  doc.beginStructureElement('H1');
  doc.text('Welcome', 10, 20);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.text('This is an accessible paragraph.', 10, 35);
  doc.endStructureElement();
doc.endStructureElement();

// Save the document
doc.save('accessible.pdf');
```

## Compliance

This implementation targets PDF/UA-1 (ISO 14289-1) compliance and follows the Matterhorn Protocol for validation.

## Testing Tools

- **veraPDF**: Open-source PDF/UA validator
- **PAC (PDF Accessibility Checker)**: Free tool from PDF/UA Foundation
- **Adobe Acrobat Pro**: Built-in accessibility checker

## Resources

- [PDF/UA in a Nutshell](https://pdfa.org/resource/pdfua-in-a-nutshell/)
- [Matterhorn Protocol](https://pdfa.org/resource/the-matterhorn-protocol/)
- [BITi Prüfschritte](https://biti-wiki.de/index.php?title=Prüfschritte) (German)
