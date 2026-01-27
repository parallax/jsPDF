/**
 * PDF/UA Artifacts Test Suite
 * Sprint 20 - Artifacts for headers, footers, and decorative content
 *
 * Tests BITi 01.0: Getaggter realer Inhalt / Artefakte
 * Tests BITi 01.1: Artefakte / Kopfzeile und Fußzeile auf Seiten
 *
 * Artifacts are content that should be IGNORED by screen readers:
 * - Headers and footers (Type=Pagination, Subtype=Header/Footer)
 * - Page numbers
 * - Decorative lines, borders, backgrounds
 * - Watermarks
 */

const { jsPDF } = require("../../dist/jspdf.node.js");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "../../examples/temp");

/**
 * Test 1: Simple document with header and footer artifacts
 */
function testHeaderFooterArtifacts() {
  const doc = new jsPDF({
    pdfUA: true,
  });

  doc.setLanguage("de-DE");
  doc.setDocumentProperties({
    title: "Test: Kopf- und Fußzeilen als Artefakte",
  });

  // === Page 1 ===

  // Header (artifact - not read by screen reader)
  doc.beginHeader();
  doc.setFontSize(10);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.text("Beispieldokument - Kapitel 1", 20, 15);
  doc.endHeader();

  // Main content (real content - read by screen reader)
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Willkommen zum Testdokument", 20, 35);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Dies ist der Hauptinhalt des Dokuments. Dieser Text wird", 20, 55);
  doc.text("vom Screenreader vorgelesen.", 20, 63);
  doc.endStructureElement();

  doc.beginStructureElement("P");
  doc.text("Die Kopf- und Fußzeilen oben und unten auf der Seite", 20, 80);
  doc.text("werden als Artefakte markiert und vom Screenreader ignoriert.", 20, 88);
  doc.endStructureElement();

  // Footer (artifact - not read by screen reader)
  doc.beginFooter();
  doc.setFontSize(10);
  doc.text("Seite 1", 100, 285, { align: "center" });
  doc.endFooter();

  // === Page 2 ===
  doc.addPage();

  // Header
  doc.beginHeader();
  doc.setFontSize(10);
  doc.text("Beispieldokument - Kapitel 1", 20, 15);
  doc.endHeader();

  // Content
  doc.beginStructureElement("H2");
  doc.setFontSize(16);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Fortsetzung", 20, 35);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Dies ist die zweite Seite mit weiterem Inhalt.", 20, 55);
  doc.endStructureElement();

  // Footer
  doc.beginFooter();
  doc.setFontSize(10);
  doc.text("Seite 2", 100, 285, { align: "center" });
  doc.endFooter();

  const outputPath = path.join(OUTPUT_DIR, "test-artifact-1-header-footer.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log("✓ Test 1: Header/Footer Artifacts - " + outputPath);
  return outputPath;
}

/**
 * Test 2: Decorative artifacts (lines, backgrounds)
 */
function testDecorativeArtifacts() {
  const doc = new jsPDF({
    pdfUA: true,
  });

  doc.setLanguage("de-DE");
  doc.setDocumentProperties({
    title: "Test: Dekorative Artefakte",
  });

  // Decorative line at top (artifact)
  doc.beginArtifact({ type: "Layout" });
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.5);
  doc.line(20, 20, 190, 20);
  doc.endArtifact();

  // Title (real content)
  doc.beginStructureElement("H1");
  doc.setFontSize(20);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Dokument mit dekorativen Elementen", 20, 35);
  doc.endStructureElement();

  // Decorative separator line (artifact)
  doc.beginArtifact({ type: "Layout" });
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 42, 190, 42);
  doc.endArtifact();

  // Main content
  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Die dekorativen Linien oben und unter der Überschrift", 20, 55);
  doc.text("sind als Artefakte markiert.", 20, 63);
  doc.endStructureElement();

  doc.beginStructureElement("P");
  doc.text("Der Screenreader liest nur diesen Text vor, nicht die", 20, 80);
  doc.text("dekorativen Elemente.", 20, 88);
  doc.endStructureElement();

  // Decorative line at bottom (artifact)
  doc.beginArtifact({ type: "Layout" });
  doc.setDrawColor(100, 100, 100);
  doc.line(20, 280, 190, 280);
  doc.endArtifact();

  const outputPath = path.join(OUTPUT_DIR, "test-artifact-2-decorative.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log("✓ Test 2: Decorative Artifacts - " + outputPath);
  return outputPath;
}

/**
 * Test 3: Page numbers as artifacts
 */
function testPageNumberArtifacts() {
  const doc = new jsPDF({
    pdfUA: true,
  });

  doc.setLanguage("de-DE");
  doc.setDocumentProperties({
    title: "Test: Seitenzahlen als Artefakte",
  });

  const totalPages = 3;

  for (let page = 1; page <= totalPages; page++) {
    if (page > 1) doc.addPage();

    // Content
    doc.beginStructureElement("H1");
    doc.setFontSize(18);
    doc.setFont("AtkinsonHyperlegible", "bold");
    doc.text("Seite " + page + " von " + totalPages, 20, 35);
    doc.endStructureElement();

    doc.setFontSize(12);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.beginStructureElement("P");
    doc.text("Dies ist der Inhalt auf Seite " + page + ".", 20, 55);
    doc.text("Die Seitenzahl unten ist ein Artefakt.", 20, 63);
    doc.endStructureElement();

    // Page number (artifact)
    doc.beginArtifact({ type: "Pagination" });
    doc.setFontSize(10);
    doc.text("- " + page + " -", 105, 285, { align: "center" });
    doc.endArtifact();
  }

  const outputPath = path.join(OUTPUT_DIR, "test-artifact-3-page-numbers.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log("✓ Test 3: Page Number Artifacts - " + outputPath);
  return outputPath;
}

/**
 * Test 4: Minimal test for screenreader verification
 * Simple document where only the main content should be read
 */
function testMinimalArtifact() {
  const doc = new jsPDF({
    pdfUA: true,
  });

  doc.setLanguage("de-DE");
  doc.setDocumentProperties({
    title: "Test: Minimales Artefakt-Beispiel",
  });

  // Header (artifact - should NOT be read)
  doc.beginHeader();
  doc.setFontSize(10);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.text("KOPFZEILE - NICHT VORLESEN", 20, 15);
  doc.endHeader();

  // Main content (should be read)
  doc.beginStructureElement("H1");
  doc.setFontSize(16);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Hauptinhalt", 20, 40);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Dieser Text sollte vorgelesen werden.", 20, 55);
  doc.endStructureElement();

  doc.beginStructureElement("P");
  doc.text("Kopf- und Fußzeile sollten ignoriert werden.", 20, 70);
  doc.endStructureElement();

  // Footer (artifact - should NOT be read)
  doc.beginFooter();
  doc.setFontSize(10);
  doc.text("FUSSZEILE - NICHT VORLESEN", 20, 285);
  doc.endFooter();

  const outputPath = path.join(OUTPUT_DIR, "test-artifact-4-minimal.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log("✓ Test 4: Minimal Artifact - " + outputPath);
  return outputPath;
}

/**
 * Test 5: Academic document with proper header/footer structure
 */
function testAcademicDocument() {
  const doc = new jsPDF({
    pdfUA: true,
  });

  doc.setLanguage("de-DE");
  doc.setDocumentProperties({
    title: "Test: Akademisches Dokument mit Artefakten",
  });

  const pages = [
    { chapter: "1. Einleitung", content: "Die Einleitung beschreibt das Thema der Arbeit." },
    { chapter: "2. Methodik", content: "Die Methodik erklärt das Vorgehen der Untersuchung." },
    { chapter: "3. Ergebnisse", content: "Die Ergebnisse präsentieren die Forschungsdaten." },
  ];

  pages.forEach((pageData, index) => {
    if (index > 0) doc.addPage();
    const pageNum = index + 1;

    // Header with document title and chapter
    doc.beginHeader();
    doc.setFontSize(9);
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text("Masterarbeit: Barrierefreie PDF-Dokumente", 20, 12);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.text(pageData.chapter, 190, 12, { align: "right" });
    // Separator line
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.3);
    doc.line(20, 16, 190, 16);
    doc.endHeader();

    // Chapter heading
    doc.beginStructureElement("H1");
    doc.setFontSize(16);
    doc.setFont("AtkinsonHyperlegible", "bold");
    doc.text(pageData.chapter, 20, 30);
    doc.endStructureElement();

    // Content
    doc.setFontSize(12);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.beginStructureElement("P");
    doc.text(pageData.content, 20, 45);
    doc.endStructureElement();

    // Footer with page number
    doc.beginFooter();
    doc.setDrawColor(150, 150, 150);
    doc.line(20, 278, 190, 278);
    doc.setFontSize(10);
    doc.text(String(pageNum), 105, 285, { align: "center" });
    doc.endFooter();
  });

  const outputPath = path.join(OUTPUT_DIR, "test-artifact-5-academic.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log("✓ Test 5: Academic Document - " + outputPath);
  return outputPath;
}

// Run all tests
console.log("\n=== PDF/UA Artifacts Test Suite (Sprint 20) ===\n");

try {
  testHeaderFooterArtifacts();
  testDecorativeArtifacts();
  testPageNumberArtifacts();
  testMinimalArtifact();
  testAcademicDocument();

  console.log("\n✓ All artifact tests completed successfully!\n");
  console.log("Verification steps:");
  console.log("1. Open test-artifact-4-minimal.pdf in Acrobat Reader");
  console.log("2. Test with NVDA screenreader");
  console.log("3. Verify that ONLY 'Hauptinhalt' and paragraph text are read");
  console.log("4. Header and footer text should NOT be announced\n");
} catch (error) {
  console.error("\n✗ Test failed:", error.message);
  console.error(error.stack);
  process.exit(1);
}
