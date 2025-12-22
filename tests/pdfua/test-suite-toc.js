/**
 * PDF/UA TOC (Table of Contents) Test Suite
 * Sprint 19 - Part 1: Basic TOC structure without links
 *
 * Tests BITi 02.1.1: Gruppierende Strukturelemente / Inhaltsverzeichnis
 *
 * Structure based on reference-bookchapter-german.pdf:
 *   TOC
 *   ├── TOCI
 *   │   └── Reference → text content
 *   └── TOCI
 *       ├── Reference → text content
 *       └── TOC (nested)
 *           └── TOCI → sub-entry
 */

const { jsPDF } = require("../../dist/jspdf.node.js");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "../../examples/temp");

/**
 * Test 1: Simple TOC with flat structure
 * Basic table of contents with three chapters
 */
function testSimpleTOC() {
  const doc = new jsPDF({
    pdfUA: true,
  });

  doc.setLanguage("de-DE");
  doc.setDocumentProperties({
    title: "Test: Einfaches Inhaltsverzeichnis",
  });

  // Title
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Inhaltsverzeichnis", 20, 25);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");

  // Table of Contents
  doc.beginTOC();

  // Entry 1
  doc.beginTOCI();
  doc.beginReference();
  doc.text("1. Einleitung .......................... 3", 20, 45);
  doc.endReference();
  doc.endTOCI();

  // Entry 2
  doc.beginTOCI();
  doc.beginReference();
  doc.text("2. Hauptteil ........................... 7", 20, 55);
  doc.endReference();
  doc.endTOCI();

  // Entry 3
  doc.beginTOCI();
  doc.beginReference();
  doc.text("3. Zusammenfassung ..................... 15", 20, 65);
  doc.endReference();
  doc.endTOCI();

  doc.endTOC();

  // Add content pages
  doc.addPage();
  doc.beginStructureElement("H1");
  doc.setFontSize(16);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("1. Einleitung", 20, 25);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Dies ist der Einleitungstext.", 20, 40);
  doc.endStructureElement();

  doc.addPage();
  doc.beginStructureElement("H1");
  doc.setFontSize(16);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("2. Hauptteil", 20, 25);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Dies ist der Hauptteil des Dokuments.", 20, 40);
  doc.endStructureElement();

  doc.addPage();
  doc.beginStructureElement("H1");
  doc.setFontSize(16);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("3. Zusammenfassung", 20, 25);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Dies ist die Zusammenfassung.", 20, 40);
  doc.endStructureElement();

  const outputPath = path.join(OUTPUT_DIR, "test-toc-1-simple.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log("✓ Test 1: Simple TOC - " + outputPath);
  return outputPath;
}

/**
 * Test 2: Nested TOC with subsections
 * Table of contents with nested sub-entries
 */
function testNestedTOC() {
  const doc = new jsPDF({
    pdfUA: true,
  });

  doc.setLanguage("de-DE");
  doc.setDocumentProperties({
    title: "Test: Verschachteltes Inhaltsverzeichnis",
  });

  // Title
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Inhaltsverzeichnis", 20, 25);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");

  // Table of Contents
  doc.beginTOC();

  // Entry 1 (simple)
  doc.beginTOCI();
  doc.beginReference();
  doc.text("1. Einleitung .......................... 3", 20, 45);
  doc.endReference();
  doc.endTOCI();

  // Entry 2 (with sub-entries)
  doc.beginTOCI();
  doc.beginReference();
  doc.text("2. Grundlagen .......................... 5", 20, 55);
  doc.endReference();

  // Nested TOC for subsections
  doc.beginTOC();

  doc.beginTOCI();
  doc.beginReference();
  doc.text("2.1 Begriffsdefinitionen ............. 5", 30, 65);
  doc.endReference();
  doc.endTOCI();

  doc.beginTOCI();
  doc.beginReference();
  doc.text("2.2 Theoretischer Rahmen ............. 8", 30, 75);
  doc.endReference();
  doc.endTOCI();

  doc.endTOC(); // End nested TOC

  doc.endTOCI(); // End main entry 2

  // Entry 3 (simple)
  doc.beginTOCI();
  doc.beginReference();
  doc.text("3. Fazit ............................... 12", 20, 85);
  doc.endReference();
  doc.endTOCI();

  doc.endTOC();

  const outputPath = path.join(OUTPUT_DIR, "test-toc-2-nested.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log("✓ Test 2: Nested TOC - " + outputPath);
  return outputPath;
}

/**
 * Test 3: TOC with Lbl (label) elements
 * Using separate label elements for chapter numbers
 */
function testTOCWithLabels() {
  const doc = new jsPDF({
    pdfUA: true,
  });

  doc.setLanguage("de-DE");
  doc.setDocumentProperties({
    title: "Test: Inhaltsverzeichnis mit Labels",
  });

  // Title
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Inhaltsverzeichnis", 20, 25);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");

  // Table of Contents
  doc.beginTOC();

  // Entry 1 with Lbl
  doc.beginTOCI();
  doc.beginStructureElement("Lbl");
  doc.text("1.", 20, 45);
  doc.endStructureElement();
  doc.beginReference();
  doc.text("Einleitung .......................... 3", 30, 45);
  doc.endReference();
  doc.endTOCI();

  // Entry 2 with Lbl
  doc.beginTOCI();
  doc.beginStructureElement("Lbl");
  doc.text("2.", 20, 55);
  doc.endStructureElement();
  doc.beginReference();
  doc.text("Hauptteil ........................... 7", 30, 55);
  doc.endReference();
  doc.endTOCI();

  // Entry 3 with Lbl
  doc.beginTOCI();
  doc.beginStructureElement("Lbl");
  doc.text("3.", 20, 65);
  doc.endStructureElement();
  doc.beginReference();
  doc.text("Zusammenfassung ..................... 15", 30, 65);
  doc.endReference();
  doc.endTOCI();

  doc.endTOC();

  const outputPath = path.join(OUTPUT_DIR, "test-toc-3-with-labels.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log("✓ Test 3: TOC with Labels - " + outputPath);
  return outputPath;
}

/**
 * Test 4: Academic document TOC
 * Realistic table of contents for an academic paper
 */
function testAcademicTOC() {
  const doc = new jsPDF({
    pdfUA: true,
  });

  doc.setLanguage("de-DE");
  doc.setDocumentProperties({
    title: "Test: Akademisches Inhaltsverzeichnis",
  });

  // Title
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Inhaltsverzeichnis", 20, 25);
  doc.endStructureElement();

  doc.setFontSize(11);
  doc.setFont("AtkinsonHyperlegible", "normal");

  let y = 45;
  const lineHeight = 8;

  // Table of Contents
  doc.beginTOC();

  // Abstract
  doc.beginTOCI();
  doc.beginReference();
  doc.text("Zusammenfassung", 20, y);
  doc.text("ii", 180, y, { align: "right" });
  doc.endReference();
  doc.endTOCI();
  y += lineHeight;

  // 1. Einleitung
  doc.beginTOCI();
  doc.beginReference();
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("1  Einleitung", 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.text("1", 180, y, { align: "right" });
  doc.endReference();
  doc.endTOCI();
  y += lineHeight;

  // 2. Stand der Forschung with subsections
  doc.beginTOCI();
  doc.beginReference();
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("2  Stand der Forschung", 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.text("5", 180, y, { align: "right" });
  doc.endReference();

  // Nested subsections
  doc.beginTOC();

  y += lineHeight;
  doc.beginTOCI();
  doc.beginReference();
  doc.text("2.1  Historische Entwicklung", 30, y);
  doc.text("5", 180, y, { align: "right" });
  doc.endReference();
  doc.endTOCI();

  y += lineHeight;
  doc.beginTOCI();
  doc.beginReference();
  doc.text("2.2  Aktuelle Ansätze", 30, y);
  doc.text("9", 180, y, { align: "right" });
  doc.endReference();
  doc.endTOCI();

  y += lineHeight;
  doc.beginTOCI();
  doc.beginReference();
  doc.text("2.3  Forschungslücken", 30, y);
  doc.text("14", 180, y, { align: "right" });
  doc.endReference();
  doc.endTOCI();

  doc.endTOC(); // End nested TOC
  doc.endTOCI(); // End section 2
  y += lineHeight;

  // 3. Methodik
  doc.beginTOCI();
  doc.beginReference();
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("3  Methodik", 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.text("18", 180, y, { align: "right" });
  doc.endReference();
  doc.endTOCI();
  y += lineHeight;

  // 4. Ergebnisse
  doc.beginTOCI();
  doc.beginReference();
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("4  Ergebnisse", 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.text("25", 180, y, { align: "right" });
  doc.endReference();
  doc.endTOCI();
  y += lineHeight;

  // 5. Diskussion
  doc.beginTOCI();
  doc.beginReference();
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("5  Diskussion", 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.text("35", 180, y, { align: "right" });
  doc.endReference();
  doc.endTOCI();
  y += lineHeight;

  // 6. Fazit
  doc.beginTOCI();
  doc.beginReference();
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("6  Fazit und Ausblick", 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.text("42", 180, y, { align: "right" });
  doc.endReference();
  doc.endTOCI();
  y += lineHeight;

  // Literaturverzeichnis
  doc.beginTOCI();
  doc.beginReference();
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Literaturverzeichnis", 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.text("45", 180, y, { align: "right" });
  doc.endReference();
  doc.endTOCI();
  y += lineHeight;

  // Anhang
  doc.beginTOCI();
  doc.beginReference();
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Anhang", 20, y);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.text("52", 180, y, { align: "right" });
  doc.endReference();
  doc.endTOCI();

  doc.endTOC();

  const outputPath = path.join(OUTPUT_DIR, "test-toc-4-academic.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log("✓ Test 4: Academic TOC - " + outputPath);
  return outputPath;
}

/**
 * Test 5: Minimal TOC for screenreader verification
 * Very simple TOC for easy screenreader testing
 * Now with introductory text before TOC for navigation testing
 */
function testMinimalTOC() {
  const doc = new jsPDF({
    pdfUA: true,
  });

  doc.setLanguage("de-DE");
  doc.setDocumentProperties({
    title: "Test: Minimales Inhaltsverzeichnis",
  });

  // Document title (H1)
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Testdokument für Inhaltsverzeichnis", 20, 25);
  doc.endStructureElement();

  // Introductory paragraph before TOC
  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Dies ist ein Testdokument zur Überprüfung der Barrierefreiheit", 20, 40);
  doc.text("von Inhaltsverzeichnissen in PDF/UA-Dokumenten.", 20, 48);
  doc.endStructureElement();

  doc.beginStructureElement("P");
  doc.text("Das folgende Inhaltsverzeichnis enthält zwei Kapiteleinträge.", 20, 60);
  doc.text("Verwenden Sie die Überschriftennavigation, um zum Inhaltsverzeichnis", 20, 68);
  doc.text("zu springen.", 20, 76);
  doc.endStructureElement();

  // TOC heading (H2)
  doc.beginStructureElement("H2");
  doc.setFontSize(16);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Inhaltsverzeichnis", 20, 95);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");

  // Simple TOC with just two entries
  doc.beginTOC();

  doc.beginTOCI();
  doc.beginReference();
  doc.text("Kapitel Eins", 20, 110);
  doc.endReference();
  doc.endTOCI();

  doc.beginTOCI();
  doc.beginReference();
  doc.text("Kapitel Zwei", 20, 120);
  doc.endReference();
  doc.endTOCI();

  doc.endTOC();

  const outputPath = path.join(OUTPUT_DIR, "test-toc-5-minimal.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log("✓ Test 5: Minimal TOC - " + outputPath);
  return outputPath;
}

// Run all tests
console.log("\n=== PDF/UA TOC Test Suite (Sprint 19 - Part 1) ===\n");

try {
  testSimpleTOC();
  testNestedTOC();
  testTOCWithLabels();
  testAcademicTOC();
  testMinimalTOC();

  console.log("\n✓ All TOC tests completed successfully!\n");
  console.log("Next steps:");
  console.log("1. Open test-toc-5-minimal.pdf in Acrobat Reader");
  console.log("2. Test with NVDA screenreader");
  console.log("3. Verify TOC structure is recognized");
  console.log("4. Check that entries are announced correctly\n");
} catch (error) {
  console.error("\n✗ Test failed:", error.message);
  console.error(error.stack);
  process.exit(1);
}
