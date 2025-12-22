/**
 * PDF/UA Bookmarks (Lesezeichen) Test
 * Sprint 19.2 - Navigation via Bookmarks
 *
 * Tests BITi 13: Navigation - Lesezeichen für mehrseitige Dokumente
 *
 * Uses existing jsPDF outline API: doc.outline.add(parent, title, { pageNumber })
 */

const { jsPDF } = require("../../dist/jspdf.node.js");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "../../examples/temp");

/**
 * Test: Document with bookmarks matching TOC structure
 */
function testBookmarksWithTOC() {
  const doc = new jsPDF({
    pdfUA: true,
  });

  doc.setLanguage("de-DE");
  doc.setDocumentTitle("Test: Dokument mit Lesezeichen");
  doc.setDocumentProperties({
    title: "Test: Dokument mit Lesezeichen",
  });

  // === Page 1: Title and TOC ===
  doc.beginStructureElement("H1");
  doc.setFontSize(20);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Beispieldokument mit Lesezeichen", 20, 25);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Dieses Dokument demonstriert die Verwendung von Lesezeichen", 20, 40);
  doc.text("für die Navigation in PDF/UA-konformen Dokumenten.", 20, 48);
  doc.endStructureElement();

  // TOC heading
  doc.beginStructureElement("H2");
  doc.setFontSize(16);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Inhaltsverzeichnis", 20, 70);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");

  // TOC structure
  doc.beginTOC();

  doc.beginTOCI();
  doc.beginReference();
  doc.text("1. Einleitung .......................... 2", 20, 85);
  doc.endReference();
  doc.endTOCI();

  doc.beginTOCI();
  doc.beginReference();
  doc.text("2. Hauptteil ........................... 3", 20, 95);
  doc.endReference();
  doc.endTOCI();

  doc.beginTOCI();
  doc.beginReference();
  doc.text("3. Zusammenfassung ..................... 4", 20, 105);
  doc.endReference();
  doc.endTOCI();

  doc.endTOC();

  // === Page 2: Chapter 1 ===
  doc.addPage();
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("1. Einleitung", 20, 25);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Dies ist die Einleitung des Dokuments. Hier wird das Thema", 20, 45);
  doc.text("vorgestellt und der Kontext erläutert.", 20, 53);
  doc.endStructureElement();

  doc.beginStructureElement("P");
  doc.text("Die Einleitung gibt einen Überblick über die folgenden Kapitel", 20, 68);
  doc.text("und erklärt die Zielsetzung des Dokuments.", 20, 76);
  doc.endStructureElement();

  // === Page 3: Chapter 2 ===
  doc.addPage();
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("2. Hauptteil", 20, 25);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Der Hauptteil enthält die wesentlichen Inhalte des Dokuments.", 20, 45);
  doc.text("Hier werden die Argumente und Informationen präsentiert.", 20, 53);
  doc.endStructureElement();

  doc.beginStructureElement("P");
  doc.text("Dieser Abschnitt ist typischerweise der längste Teil eines", 20, 68);
  doc.text("Dokuments und enthält die Kernaussagen.", 20, 76);
  doc.endStructureElement();

  // === Page 4: Chapter 3 ===
  doc.addPage();
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("3. Zusammenfassung", 20, 25);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Die Zusammenfassung fasst die wichtigsten Punkte zusammen.", 20, 45);
  doc.text("Sie bietet einen schnellen Überblick über das Dokument.", 20, 53);
  doc.endStructureElement();

  doc.beginStructureElement("P");
  doc.text("Hier können auch Schlussfolgerungen und Ausblicke gegeben werden.", 20, 68);
  doc.endStructureElement();

  // === Add Bookmarks ===
  // Bookmarks should match the document structure
  const chap1 = doc.outline.add(null, "1. Einleitung", { pageNumber: 2 });
  const chap2 = doc.outline.add(null, "2. Hauptteil", { pageNumber: 3 });
  const chap3 = doc.outline.add(null, "3. Zusammenfassung", { pageNumber: 4 });

  const outputPath = path.join(OUTPUT_DIR, "test-bookmarks-1-simple.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log("✓ Test 1: Simple Bookmarks - " + outputPath);
  return outputPath;
}

/**
 * Test: Nested bookmarks (hierarchical structure)
 */
function testNestedBookmarks() {
  const doc = new jsPDF({
    pdfUA: true,
  });

  doc.setLanguage("de-DE");
  doc.setDocumentTitle("Test: Verschachtelte Lesezeichen");
  doc.setDocumentProperties({
    title: "Test: Verschachtelte Lesezeichen",
  });

  // === Page 1: Title ===
  doc.beginStructureElement("H1");
  doc.setFontSize(20);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Dokument mit verschachtelten Lesezeichen", 20, 25);
  doc.endStructureElement();

  // === Page 2: Chapter 1 ===
  doc.addPage();
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("1. Grundlagen", 20, 25);
  doc.endStructureElement();

  // === Page 3: Section 1.1 ===
  doc.addPage();
  doc.beginStructureElement("H2");
  doc.setFontSize(16);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("1.1 Definitionen", 20, 25);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Hier werden wichtige Begriffe definiert.", 20, 45);
  doc.endStructureElement();

  // === Page 4: Section 1.2 ===
  doc.addPage();
  doc.beginStructureElement("H2");
  doc.setFontSize(16);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("1.2 Theoretischer Hintergrund", 20, 25);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Der theoretische Rahmen wird erläutert.", 20, 45);
  doc.endStructureElement();

  // === Page 5: Chapter 2 ===
  doc.addPage();
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("2. Methodik", 20, 25);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Die verwendete Methodik wird beschrieben.", 20, 45);
  doc.endStructureElement();

  // === Add Nested Bookmarks ===
  const chap1 = doc.outline.add(null, "1. Grundlagen", { pageNumber: 2 });
  doc.outline.add(chap1, "1.1 Definitionen", { pageNumber: 3 });
  doc.outline.add(chap1, "1.2 Theoretischer Hintergrund", { pageNumber: 4 });

  const chap2 = doc.outline.add(null, "2. Methodik", { pageNumber: 5 });

  const outputPath = path.join(OUTPUT_DIR, "test-bookmarks-2-nested.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log("✓ Test 2: Nested Bookmarks - " + outputPath);
  return outputPath;
}

/**
 * Test: Minimal bookmarks for screenreader verification
 */
function testMinimalBookmarks() {
  const doc = new jsPDF({
    pdfUA: true,
  });

  doc.setLanguage("de-DE");
  doc.setDocumentTitle("Test: Minimale Lesezeichen");
  doc.setDocumentProperties({
    title: "Test: Minimale Lesezeichen",
  });

  // === Page 1 ===
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Startseite", 20, 25);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Dies ist die erste Seite.", 20, 45);
  doc.text("Verwenden Sie die Lesezeichen zur Navigation.", 20, 53);
  doc.endStructureElement();

  // === Page 2 ===
  doc.addPage();
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.setFont("AtkinsonHyperlegible", "bold");
  doc.text("Zweite Seite", 20, 25);
  doc.endStructureElement();

  doc.setFontSize(12);
  doc.setFont("AtkinsonHyperlegible", "normal");
  doc.beginStructureElement("P");
  doc.text("Dies ist die zweite Seite.", 20, 45);
  doc.endStructureElement();

  // === Add Bookmarks ===
  doc.outline.add(null, "Startseite", { pageNumber: 1 });
  doc.outline.add(null, "Zweite Seite", { pageNumber: 2 });

  const outputPath = path.join(OUTPUT_DIR, "test-bookmarks-3-minimal.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log("✓ Test 3: Minimal Bookmarks - " + outputPath);
  return outputPath;
}

// Run all tests
console.log("\n=== PDF/UA Bookmarks Test Suite (Sprint 19.2) ===\n");

try {
  testBookmarksWithTOC();
  testNestedBookmarks();
  testMinimalBookmarks();

  console.log("\n✓ All bookmark tests completed successfully!\n");
  console.log("Verification steps:");
  console.log("1. Open test-bookmarks-3-minimal.pdf in Acrobat Reader");
  console.log("2. Check if bookmarks panel shows entries");
  console.log("3. Test with NVDA: Strg+Shift+L to list bookmarks");
  console.log("4. Click bookmarks to verify navigation works\n");
} catch (error) {
  console.error("\n✗ Test failed:", error.message);
  console.error(error.stack);
  process.exit(1);
}
