# Testing PDF/UA Compliance

This guide covers how to test PDF/UA documents created with jsPDF for accessibility compliance.

## Validation Tools

### PAC (PDF Accessibility Checker)

**Recommended for comprehensive testing**

PAC is a free tool from the PDF/UA Foundation that provides detailed PDF/UA validation.

- Download: [PDF Accessibility Checker](https://pdfua.foundation/en/pac-download)
- Platform: Windows (Wine on Linux/Mac)

**Usage:**
1. Open PAC
2. Drag and drop your PDF file
3. Review the results report
4. Check both "PDF/UA" and "WCAG" sections

### veraPDF

**Recommended for automation and CI/CD**

Open-source PDF/UA validator with command-line interface.

- Download: [veraPDF](https://verapdf.org/)
- Platform: Cross-platform (Java)

**Command-line usage:**
```bash
# Validate PDF/UA-1 compliance
verapdf --flavour ua1 document.pdf

# Generate detailed report
verapdf --flavour ua1 --format html document.pdf > report.html
```

### Adobe Acrobat Pro

Built-in accessibility checker with detailed reports.

1. Open document in Acrobat Pro
2. Tools > Accessibility > Accessibility Check
3. Review and address any issues

### Screen Readers

**Essential for real-world testing**

- **NVDA** (Windows): Free, open-source - [nvaccess.org](https://www.nvaccess.org/)
- **JAWS** (Windows): Commercial - [freedomscientific.com](https://www.freedomscientific.com/)
- **VoiceOver** (macOS): Built-in, activate with Cmd+F5
- **Orca** (Linux): Open-source

---

## Manual Testing Checklist

### Document Structure

- [ ] Document has a title (check PDF properties)
- [ ] Document has a language set
- [ ] Structure tree is present (check Tags panel in Acrobat)
- [ ] All content is tagged (no untagged content)
- [ ] Heading hierarchy is correct (H1 > H2 > H3, no skipped levels)

### Reading Order

- [ ] Content reads in logical order with screen reader
- [ ] Multi-column layouts read in correct sequence
- [ ] Headers/footers are marked as artifacts (not read inline)
- [ ] Page numbers are artifacts

### Images

- [ ] All content images have alternative text
- [ ] Decorative images are marked as artifacts
- [ ] Alt text is meaningful and descriptive
- [ ] Complex images (charts, diagrams) have adequate descriptions

### Tables

- [ ] Tables have proper header cells (TH)
- [ ] Header scope is set correctly (Column/Row)
- [ ] Table can be navigated with screen reader
- [ ] Data cells are associated with headers

### Links

- [ ] All links are properly tagged
- [ ] Link text is meaningful (not "click here")
- [ ] Links are navigable with keyboard

### Forms

- [ ] All form fields have labels
- [ ] Required fields are indicated
- [ ] Tab order follows logical sequence
- [ ] Form can be completed with keyboard only

### Text

- [ ] Text can be selected and copied
- [ ] Text extraction produces correct content
- [ ] Special characters are properly encoded
- [ ] Language changes are marked for foreign phrases

---

## Testing with jsPDF Test Suite

### Running PDF/UA Tests

```bash
# Build the library
npm run build

# Run PDF/UA test suite
node tests/pdfua/test-suite-code.js

# Run specific test file
node tests/pdfua/test-suite-annotations.js
```

### Test Output Location

Generated test PDFs are saved to `examples/temp/`:

```
examples/temp/
├── test-annot-1-text.pdf
├── test-annot-2-freetext.pdf
├── test-form-1-textfield.pdf
├── test-link-minimal.pdf
└── ...
```

### Inspecting PDF Structure

Use `qpdf` to inspect PDF internals:

```bash
# Linearize for easier reading
qpdf --qdf input.pdf output_qdf.pdf

# View structure in text editor
cat output_qdf.pdf | less
```

---

## Common Issues and Solutions

### "Document is not tagged"

**Cause:** Missing structure tree or content not within structure elements.

**Solution:** Ensure all content is wrapped in structure elements:
```javascript
doc.beginStructureElement('P');
doc.text('Content here', x, y);
doc.endStructureElement();
```

### "Alternative text missing for Figure"

**Cause:** Image added without alt text.

**Solution:** Wrap images in Figure element with alt attribute:
```javascript
doc.beginStructureElement('Figure', { alt: 'Description' });
doc.addImage(img, 'PNG', x, y, w, h);
doc.endStructureElement();
```

### "Document title not set"

**Cause:** Missing document title or DisplayDocTitle not enabled.

**Solution:** Set document title:
```javascript
doc.setDocumentTitle('My Document');
```

### "Language not specified"

**Cause:** Document language not set.

**Solution:** Set language at document level:
```javascript
doc.setLanguage('en-US');
```

### "Table header cells not marked"

**Cause:** Using TD instead of TH for header cells.

**Solution:** Use TH with scope attribute:
```javascript
doc.beginStructureElement('TH', { scope: 'Column' });
doc.text('Header', x, y);
doc.endStructureElement();
```

### "Untagged content" (headers/footers)

**Cause:** Headers/footers not marked as artifacts.

**Solution:** Use artifact marking:
```javascript
doc.beginArtifact({ type: 'Pagination', subtype: 'Header' });
doc.text('Header text', x, y);
doc.endArtifact();
```

---

## BITi Test Steps Reference

For German accessibility testing requirements, refer to the BITi Prüfschritte:

- [BITi Wiki - Prüfschritte](https://biti-wiki.de/index.php?title=Prüfschritte)

Key test steps for PDF/UA:

| Step | Focus Area |
|------|------------|
| 00.1 | Structure tree hierarchy |
| 01.0 | Tagged content vs artifacts |
| 02.2.0 | Heading structure |
| 02.2.1 | List structure |
| 02.2.2 | Table structure |
| 02.3.1 | Link accessibility |
| 02.4.1 | Image accessibility |
| 06 | Document metadata |
| 07 | Language specification |
| 08.0 | Reading order |

---

## Automated Testing Integration

### CI/CD Pipeline Example

```yaml
# GitHub Actions example
- name: Validate PDF/UA
  run: |
    npm run build
    node tests/pdfua/test-suite-code.js
    for pdf in examples/temp/test-*.pdf; do
      verapdf --flavour ua1 "$pdf" || exit 1
    done
```

### Custom Validation Script

```javascript
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tempDir = 'examples/temp';
const pdfs = fs.readdirSync(tempDir).filter(f => f.endsWith('.pdf'));

pdfs.forEach(pdf => {
  const filePath = path.join(tempDir, pdf);
  try {
    execSync(`verapdf --flavour ua1 "${filePath}"`, { stdio: 'pipe' });
    console.log(`✓ ${pdf} - PASS`);
  } catch (e) {
    console.log(`✗ ${pdf} - FAIL`);
    console.log(e.stdout.toString());
  }
});
```

---

## Resources

- [PDF/UA in a Nutshell](https://pdfa.org/resource/pdfua-in-a-nutshell/)
- [Matterhorn Protocol](https://pdfa.org/resource/the-matterhorn-protocol/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [PDF Techniques for WCAG](https://www.w3.org/WAI/WCAG21/Techniques/#pdf)
