# PDF/UA Test Suite

This directory contains tests and utilities for PDF/UA (Universal Accessibility) implementation.

## Active Test Files

### Test Suites

#### Structure Tree & Language Testing
- **`test-suite-lang-fix.js`** - Main test suite verifying /Lang fix
  - Generates 5 test PDFs with varying complexity
  - Tests: minimal, paragraphs, headings, complex structure, multi-page
  - Run: `node tests/pdfua/test-suite-lang-fix.js`

#### Font Embedding Testing
- **`test-suite-font-embedding.js`** - Font embedding verification suite
  - Generates 5 test PDFs to verify Atkinson Hyperlegible embedding
  - Tests: simple text, no standard fonts, complex document, regular PDF, German text
  - Run: `node tests/pdfua/test-suite-font-embedding.js`
  - Verifies: FontFile2 present, font names, character distinction

### Utilities
- **`decompress-pdf.py`** - Decompresses PDF for inspection
  - Usage: `python3 tests/pdfua/decompress-pdf.py input.pdf output.pdf`
  - Extracts structure tree information

- **`analyze-reference-structure.py`** - Analyzes reference PDFs
  - Usage: `python3 tests/pdfua/analyze-reference-structure.py reference.pdf`

- **`verify-font-embedding.sh`** - Verifies font embedding in test PDFs
  - Usage: `bash tests/pdfua/verify-font-embedding.sh`
  - Checks: Font names, FontFile2, standard font references, file sizes

## Test Outputs

Test PDFs are generated in `examples/temp/`:

### Structure Tree Tests:
- `test1-minimal.pdf` - Single word test
- `test2-paragraphs.pdf` - Multiple paragraphs
- `test3-headings.pdf` - Document with H1, H2
- `test4-complex.pdf` - Complex German document
- `test5-multipage.pdf` - Multi-page document

### Font Embedding Tests:
- `test-font-embedding-1.pdf` - Simple text with embedded font
- `test-font-embedding-2.pdf` - Verify no standard fonts
- `test-font-embedding-3.pdf` - Complex document with headings
- `test-font-embedding-4-regular.pdf` - Regular PDF (no font embedding)
- `test-font-embedding-5-german.pdf` - German text with umlauts

Each structure tree test has a corresponding `*_decompressed.pdf` for inspection.

## Old Iterations

Historical test files from development iterations are archived in:
- `old-iterations/` - Previous test scripts from Sprint 1-3 debugging

## Reference Files

Reference PDFs are stored in `examples/temp/reference/`:
- Working PDF/UA documents for comparison
- Used to verify correct implementation

## Archive

Old test outputs and debugging files are in `examples/temp/archive/`:
- Historical PDF outputs from development
- Debugging iterations
- No longer actively used

## Testing Protocol

1. **Generate Test PDFs:**
   ```bash
   node tests/pdfua/test-suite-lang-fix.js
   ```

2. **Verify in Acrobat Reader:**
   - Open each test PDF
   - Enable screen reader
   - Verify content is readable (not "AVPageView Textrahmen")

3. **Inspect PDF Structure:**
   ```bash
   python3 tests/pdfua/decompress-pdf.py examples/temp/test1-minimal.pdf output.pdf
   ```

4. **Check BDC Operators:**
   ```bash
   grep "BDC" output.pdf
   ```
   Should show: `/StructType <</Lang (language)/MCID n>> BDC`

## Key Findings

### Critical Requirements for PDF/UA:
- ✅ `/Lang` attribute MUST be in every BDC operator
- ✅ Structure tree with proper parent hierarchy
- ✅ ParentTree with indirect array objects
- ✅ /StructParents in page dictionaries
- ✅ /Tabs /S for reading order
- ✅ MarkInfo with /Marked true
- ✅ Font embedding with Atkinson Hyperlegible (Sprint 4/5 completed)

### Common Issues:
- Missing `/Lang` in BDC → "AVPageView Textrahmen" in Acrobat
- Incorrect structure types → Screen reader navigation problems
- Missing ParentTree → Content not associated with structure

## Related Documentation

- `CLAUDE.md` - Project overview and PDF/UA status
- `TEST_RESULTS_LANG_FIX.md` - Detailed test results and analysis
