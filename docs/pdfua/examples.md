# PDF/UA Examples

This document provides complete, real-world examples of accessible PDF documents.

## Simple Report

A basic business report with headings, paragraphs, and a list.

```javascript
const { jsPDF } = require('jspdf');

const doc = new jsPDF({ pdfUA: true });

// Required metadata
doc.setDocumentTitle('Q4 2024 Sales Report');
doc.setLanguage('en-US');

// Document structure
doc.beginStructureElement('Document');

  // Title
  doc.beginStructureElement('H1');
  doc.setFontSize(24);
  doc.text('Q4 2024 Sales Report', 20, 25);
  doc.endStructureElement();

  // Introduction
  doc.beginStructureElement('P');
  doc.setFontSize(12);
  doc.text('This report summarizes sales performance for the fourth quarter of 2024.', 20, 40);
  doc.endStructureElement();

  // Section heading
  doc.beginStructureElement('H2');
  doc.setFontSize(16);
  doc.text('Key Highlights', 20, 60);
  doc.endStructureElement();

  // Bullet list
  doc.beginStructureElement('L');

    doc.beginStructureElement('LI');
      doc.beginStructureElement('Lbl');
      doc.setFontSize(12);
      doc.text('•', 20, 75);
      doc.endStructureElement();
      doc.beginStructureElement('LBody');
      doc.text('Revenue increased by 15% compared to Q3', 28, 75);
      doc.endStructureElement();
    doc.endStructureElement();

    doc.beginStructureElement('LI');
      doc.beginStructureElement('Lbl');
      doc.text('•', 20, 85);
      doc.endStructureElement();
      doc.beginStructureElement('LBody');
      doc.text('Customer acquisition up 20% year-over-year', 28, 85);
      doc.endStructureElement();
    doc.endStructureElement();

    doc.beginStructureElement('LI');
      doc.beginStructureElement('Lbl');
      doc.text('•', 20, 95);
      doc.endStructureElement();
      doc.beginStructureElement('LBody');
      doc.text('Net promoter score improved to 72', 28, 95);
      doc.endStructureElement();
    doc.endStructureElement();

  doc.endStructureElement();

  // Footer as artifact (not read by screen readers)
  doc.beginArtifact({ type: 'Pagination', subtype: 'Footer' });
  doc.setFontSize(10);
  doc.text('Confidential - Internal Use Only', 20, 280);
  doc.text('Page 1', 180, 280);
  doc.endArtifact();

doc.endStructureElement();

doc.save('sales-report.pdf');
```

---

## Data Table

A table with proper header associations for accessibility.

```javascript
const { jsPDF } = require('jspdf');

const doc = new jsPDF({ pdfUA: true });

doc.setDocumentTitle('Employee Directory');
doc.setLanguage('en-US');

doc.beginStructureElement('Document');

  doc.beginStructureElement('H1');
  doc.setFontSize(18);
  doc.text('Employee Directory', 20, 20);
  doc.endStructureElement();

  // Table
  doc.beginStructureElement('Table');

    // Table header
    doc.beginTableHead();
      doc.beginStructureElement('TR');

        doc.beginStructureElement('TH', { scope: 'Column' });
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Name', 20, 40);
        doc.endStructureElement();

        doc.beginStructureElement('TH', { scope: 'Column' });
        doc.text('Department', 70, 40);
        doc.endStructureElement();

        doc.beginStructureElement('TH', { scope: 'Column' });
        doc.text('Email', 130, 40);
        doc.endStructureElement();

      doc.endStructureElement();
    doc.endTableHead();

    // Table body
    doc.beginTableBody();
      doc.setFont(undefined, 'normal');

      // Row 1
      doc.beginStructureElement('TR');
        doc.beginStructureElement('TD');
        doc.text('Alice Johnson', 20, 52);
        doc.endStructureElement();
        doc.beginStructureElement('TD');
        doc.text('Engineering', 70, 52);
        doc.endStructureElement();
        doc.beginStructureElement('TD');
        doc.text('alice@example.com', 130, 52);
        doc.endStructureElement();
      doc.endStructureElement();

      // Row 2
      doc.beginStructureElement('TR');
        doc.beginStructureElement('TD');
        doc.text('Bob Smith', 20, 62);
        doc.endStructureElement();
        doc.beginStructureElement('TD');
        doc.text('Marketing', 70, 62);
        doc.endStructureElement();
        doc.beginStructureElement('TD');
        doc.text('bob@example.com', 130, 62);
        doc.endStructureElement();
      doc.endStructureElement();

      // Row 3
      doc.beginStructureElement('TR');
        doc.beginStructureElement('TD');
        doc.text('Carol Davis', 20, 72);
        doc.endStructureElement();
        doc.beginStructureElement('TD');
        doc.text('Finance', 70, 72);
        doc.endStructureElement();
        doc.beginStructureElement('TD');
        doc.text('carol@example.com', 130, 72);
        doc.endStructureElement();
      doc.endStructureElement();

    doc.endTableBody();

  doc.endStructureElement();

doc.endStructureElement();

doc.save('employee-directory.pdf');
```

---

## Contact Form

An accessible form with labeled fields.

```javascript
const { jsPDF } = require('jspdf');

const doc = new jsPDF({ pdfUA: true });

doc.setDocumentTitle('Contact Form');
doc.setLanguage('en-US');

doc.beginStructureElement('Document');

  doc.beginStructureElement('H1');
  doc.setFontSize(18);
  doc.text('Contact Us', 20, 20);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.setFontSize(11);
  doc.text('Please fill out this form and we will respond within 24 hours.', 20, 35);
  doc.endStructureElement();

  // Name field
  doc.beginStructureElement('P');
  doc.text('Full Name *', 20, 55);
  doc.endStructureElement();

  doc.beginForm({ label: 'Full Name', required: true });
  doc.createTextField('fullName', 20, 58, 100, 12, { required: true });
  doc.endForm();

  // Email field
  doc.beginStructureElement('P');
  doc.text('Email Address *', 20, 80);
  doc.endStructureElement();

  doc.beginForm({ label: 'Email Address', required: true });
  doc.createTextField('email', 20, 83, 100, 12, { required: true });
  doc.endForm();

  // Message field
  doc.beginStructureElement('P');
  doc.text('Message', 20, 105);
  doc.endStructureElement();

  doc.beginForm({ label: 'Message' });
  doc.createTextField('message', 20, 108, 170, 40, { multiline: true });
  doc.endForm();

  // Newsletter checkbox
  doc.beginForm({ label: 'Subscribe to newsletter' });
  doc.createCheckBox('newsletter', 20, 160, 10, 10, {});
  doc.endForm();

  doc.beginStructureElement('P');
  doc.text('Subscribe to our newsletter', 35, 168);
  doc.endStructureElement();

  // Required fields note
  doc.beginStructureElement('P');
  doc.setFontSize(9);
  doc.text('* Required fields', 20, 185);
  doc.endStructureElement();

doc.endStructureElement();

doc.save('contact-form.pdf');
```

---

## Academic Paper

A structured academic document with sections, footnotes, and bibliography.

```javascript
const { jsPDF } = require('jspdf');

const doc = new jsPDF({ pdfUA: true });

doc.setDocumentTitle('The Impact of AI on Modern Education');
doc.setLanguage('en-US');

// Add bookmarks for navigation
doc.addBookmark('Abstract', 1, 45);
doc.addBookmark('Introduction', 1, 75);
doc.addBookmark('Methodology', 1, 140);
doc.addBookmark('References', 1, 220);

doc.beginStructureElement('Document');

  // Title
  doc.beginStructureElement('H1');
  doc.setFontSize(16);
  doc.text('The Impact of AI on Modern Education', 105, 25, { align: 'center' });
  doc.endStructureElement();

  // Author
  doc.beginStructureElement('P');
  doc.setFontSize(11);
  doc.text('Dr. Jane Smith, University of Technology', 105, 35, { align: 'center' });
  doc.endStructureElement();

  // Abstract section
  doc.beginSect();
    doc.beginStructureElement('H2');
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Abstract', 20, 50);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(
      'This paper examines the transformative effects of artificial intelligence on educational',
      20, 60
    );
    doc.text(
      'methodologies in higher education institutions. We analyze data from 50 universities...',
      20, 67
    );
    doc.endStructureElement();
  doc.endSect();

  // Introduction section
  doc.beginSect();
    doc.beginStructureElement('H2');
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('1. Introduction', 20, 85);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(
      'The integration of artificial intelligence in education has accelerated significantly',
      20, 95
    );
    doc.text('in recent years', 20, 102);

    // Footnote reference
    doc.beginReference();
    doc.text('¹', 58, 100);
    doc.endReference();

    doc.text('. This transformation affects both teaching methodologies and', 61, 102);
    doc.text('learning outcomes across all academic disciplines.', 20, 109);
    doc.endStructureElement();
  doc.endSect();

  // Methodology section
  doc.beginSect();
    doc.beginStructureElement('H2');
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('2. Methodology', 20, 130);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text('Our research employed a mixed-methods approach combining:', 20, 140);
    doc.endStructureElement();

    // Numbered list
    doc.beginStructureElement('L');
      doc.beginStructureElement('LI');
        doc.beginStructureElement('Lbl');
        doc.text('1.', 25, 150);
        doc.endStructureElement();
        doc.beginStructureElement('LBody');
        doc.text('Quantitative analysis of student performance data', 33, 150);
        doc.endStructureElement();
      doc.endStructureElement();

      doc.beginStructureElement('LI');
        doc.beginStructureElement('Lbl');
        doc.text('2.', 25, 158);
        doc.endStructureElement();
        doc.beginStructureElement('LBody');
        doc.text('Qualitative interviews with 120 educators', 33, 158);
        doc.endStructureElement();
      doc.endStructureElement();

      doc.beginStructureElement('LI');
        doc.beginStructureElement('Lbl');
        doc.text('3.', 25, 166);
        doc.endStructureElement();
        doc.beginStructureElement('LBody');
        doc.text('Case studies from 10 pioneering institutions', 33, 166);
        doc.endStructureElement();
      doc.endStructureElement();
    doc.endStructureElement();
  doc.endSect();

  // Footnote
  doc.beginNote();
  doc.setFontSize(8);
  doc.text('¹ According to UNESCO report 2024, AI adoption in education increased by 340% since 2020.', 20, 200);
  doc.endNote();

  // References section
  doc.beginSect();
    doc.beginStructureElement('H2');
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('References', 20, 220);
    doc.endStructureElement();

    doc.beginBibliography();
      doc.beginBibEntry();
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      doc.text('[1] Brown, A. (2023). AI in Education: A Comprehensive Review. MIT Press.', 20, 230);
      doc.endBibEntry();

      doc.beginBibEntry();
      doc.text('[2] UNESCO. (2024). Global Education Monitoring Report. Paris: UNESCO.', 20, 238);
      doc.endBibEntry();

      doc.beginBibEntry();
      doc.text('[3] Zhang, L. & Wilson, R. (2024). Adaptive Learning Systems. Springer.', 20, 246);
      doc.endBibEntry();
    doc.endBibliography();
  doc.endSect();

doc.endStructureElement();

doc.save('academic-paper.pdf');
```

---

## Multi-language Document

A document with content in multiple languages.

```javascript
const { jsPDF } = require('jspdf');

const doc = new jsPDF({ pdfUA: true });

doc.setDocumentTitle('Product Manual / Produkthandbuch');
doc.setLanguage('en-US');  // Primary language

doc.beginStructureElement('Document');

  // English section
  doc.beginSect();
    doc.beginStructureElement('H1');
    doc.setFontSize(18);
    doc.text('Product Manual', 20, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFontSize(11);
    doc.text('Thank you for purchasing our product. This manual contains', 20, 35);
    doc.text('important safety information and operating instructions.', 20, 42);
    doc.endStructureElement();

    doc.beginStructureElement('H2');
    doc.setFontSize(14);
    doc.text('Safety Warnings', 20, 58);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Always disconnect from power before cleaning.', 20, 70);
    doc.endStructureElement();
  doc.endSect();

  // German section
  doc.beginSect();
    doc.beginStructureElement('H1', { lang: 'de-DE' });
    doc.text('Produkthandbuch', 20, 95);
    doc.endStructureElement();

    doc.beginStructureElement('P', { lang: 'de-DE' });
    doc.text('Vielen Dank für den Kauf unseres Produkts. Dieses Handbuch enthält', 20, 110);
    doc.text('wichtige Sicherheitsinformationen und Bedienungsanleitungen.', 20, 117);
    doc.endStructureElement();

    doc.beginStructureElement('H2', { lang: 'de-DE' });
    doc.text('Sicherheitshinweise', 20, 133);
    doc.endStructureElement();

    doc.beginStructureElement('P', { lang: 'de-DE' });
    doc.text('Trennen Sie das Gerät vor der Reinigung immer vom Stromnetz.', 20, 145);
    doc.endStructureElement();
  doc.endSect();

  // Mixed language paragraph
  doc.beginStructureElement('P');
  doc.text('For support, contact us at support@example.com or visit ', 20, 170);
  doc.beginSpan({ lang: 'de-DE' });
  doc.text('unsere Webseite', 147, 170);
  doc.endSpan();
  doc.text('.', 183, 170);
  doc.endStructureElement();

doc.endStructureElement();

doc.save('multilang-manual.pdf');
```

---

## Document with Images

Properly tagged images with alternative text.

```javascript
const { jsPDF } = require('jspdf');

const doc = new jsPDF({ pdfUA: true });

doc.setDocumentTitle('Company Profile');
doc.setLanguage('en-US');

// Assume we have image data loaded
const logoData = '...'; // Base64 encoded image
const chartData = '...'; // Base64 encoded chart

doc.beginStructureElement('Document');

  // Company logo (decorative - use artifact)
  doc.beginArtifact();
  // doc.addImage(logoData, 'PNG', 150, 10, 40, 20);
  doc.endArtifact();

  doc.beginStructureElement('H1');
  doc.setFontSize(20);
  doc.text('TechCorp Inc.', 20, 25);
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.setFontSize(11);
  doc.text('Leading innovation in sustainable technology since 1995.', 20, 40);
  doc.endStructureElement();

  // Content image with alt text
  doc.beginStructureElement('Figure', {
    alt: 'Bar chart showing revenue growth from 2020 to 2024. Revenue increased from $10M in 2020 to $25M in 2024, with the largest growth occurring between 2022 and 2023.'
  });
  // doc.addImage(chartData, 'PNG', 20, 55, 150, 80);
  doc.rect(20, 55, 150, 80); // Placeholder rectangle

  doc.beginCaption();
  doc.setFontSize(10);
  doc.text('Figure 1: Revenue Growth 2020-2024', 20, 145);
  doc.endCaption();
  doc.endStructureElement();

  doc.beginStructureElement('P');
  doc.setFontSize(11);
  doc.text('As shown in Figure 1, our revenue has grown consistently over the past five years,', 20, 160);
  doc.text('with a compound annual growth rate of 25%.', 20, 167);
  doc.endStructureElement();

doc.endStructureElement();

doc.save('company-profile.pdf');
```

---

## Table of Contents

A document with navigable table of contents.

```javascript
const { jsPDF } = require('jspdf');

const doc = new jsPDF({ pdfUA: true });

doc.setDocumentTitle('User Guide');
doc.setLanguage('en-US');

// Page 1: Table of Contents
doc.beginStructureElement('Document');

  doc.beginStructureElement('H1');
  doc.setFontSize(18);
  doc.text('User Guide', 20, 20);
  doc.endStructureElement();

  doc.beginTOC();
    doc.beginTOCI();
      doc.beginReference();
      doc.beginLink({ pageNumber: 2, top: 20 });
      doc.setFontSize(11);
      doc.text('1. Getting Started .......................... 2', 25, 45);
      doc.endLink();
      doc.endReference();
    doc.endTOCI();

    doc.beginTOCI();
      doc.beginReference();
      doc.beginLink({ pageNumber: 2, top: 80 });
      doc.text('2. Installation .............................. 2', 25, 55);
      doc.endLink();
      doc.endReference();
    doc.endTOCI();

    doc.beginTOCI();
      doc.beginReference();
      doc.beginLink({ pageNumber: 3, top: 20 });
      doc.text('3. Configuration ............................. 3', 25, 65);
      doc.endLink();
      doc.endReference();
    doc.endTOCI();

    doc.beginTOCI();
      doc.beginReference();
      doc.beginLink({ pageNumber: 3, top: 100 });
      doc.text('4. Troubleshooting ........................... 3', 25, 75);
      doc.endLink();
      doc.endReference();
    doc.endTOCI();
  doc.endTOC();

// Page 2
doc.addPage();

  doc.beginSect();
    doc.beginStructureElement('H2');
    doc.setFontSize(14);
    doc.text('1. Getting Started', 20, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.setFontSize(11);
    doc.text('Welcome to the User Guide. This section covers the basics...', 20, 35);
    doc.endStructureElement();
  doc.endSect();

  doc.beginSect();
    doc.beginStructureElement('H2');
    doc.text('2. Installation', 20, 80);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Follow these steps to install the software...', 20, 95);
    doc.endStructureElement();
  doc.endSect();

// Page 3
doc.addPage();

  doc.beginSect();
    doc.beginStructureElement('H2');
    doc.text('3. Configuration', 20, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Configure the application settings as follows...', 20, 35);
    doc.endStructureElement();
  doc.endSect();

  doc.beginSect();
    doc.beginStructureElement('H2');
    doc.text('4. Troubleshooting', 20, 100);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Common issues and their solutions...', 20, 115);
    doc.endStructureElement();
  doc.endSect();

doc.endStructureElement();

// Add bookmarks for navigation
doc.addBookmark('Table of Contents', 1, 0);
doc.addBookmark('1. Getting Started', 2, 20);
doc.addBookmark('2. Installation', 2, 80);
doc.addBookmark('3. Configuration', 3, 20);
doc.addBookmark('4. Troubleshooting', 3, 100);

doc.save('user-guide.pdf');
```

---

## Best Practices Summary

1. **Always set metadata**: `setDocumentTitle()` and `setLanguage()` are required
2. **Use semantic structure**: Choose the right element type (H1-H6, P, L, Table, etc.)
3. **Provide alt text**: All content images need descriptive alternative text
4. **Mark decorative content**: Use `beginArtifact()` for headers, footers, and decorations
5. **Maintain heading hierarchy**: Don't skip heading levels (H1 → H2 → H3)
6. **Label form fields**: Every form field needs a label
7. **Use proper table headers**: Mark TH cells with appropriate scope
8. **Tag language changes**: Use `lang` attribute for foreign language content
9. **Add bookmarks**: For documents longer than a few pages
10. **Test with screen readers**: Validate with actual assistive technology
