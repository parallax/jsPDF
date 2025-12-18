/**
 * PDF/UA Form Field Test Suite
 * Tests accessible form fields (BITi 02.4.2)
 *
 * Run with: node tests/pdfua/test-forms.js
 */

const { jsPDF } = require("../../dist/jspdf.node.js");
const fs = require("fs");
const path = require("path");

// Ensure output directory exists
const outputDir = path.join(__dirname, "../../examples/temp");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Test 1: Simple Text Field
 */
function testSimpleTextField() {
  console.log("Test 1: Simple Text Field");

  const doc = new jsPDF({ pdfUA: true });
  doc.setLanguage("de-DE");
  doc.setDocumentTitle("Einfaches Textfeld Test");

  // Title
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.text("Einfaches Textfeld Test", 20, 30);
  doc.endStructureElement();

  // Text field using high-level API
  doc.setFontSize(12);
  doc.addAccessibleTextField({
    x: 20,
    y: 60,
    width: 100,
    height: 20,
    name: "vorname",
    tooltip: "Geben Sie Ihren Vornamen ein",
    label: "Vorname:"
  });

  const outputPath = path.join(outputDir, "test-form-1-textfield.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log(`  Created: ${outputPath}`);
}

/**
 * Test 2: Required Text Field
 */
function testRequiredTextField() {
  console.log("Test 2: Required Text Field");

  const doc = new jsPDF({ pdfUA: true });
  doc.setLanguage("de-DE");
  doc.setDocumentTitle("Pflichtfeld Test");

  // Title
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.text("Pflichtfeld Test", 20, 30);
  doc.endStructureElement();

  // Required text field
  doc.setFontSize(12);
  doc.addAccessibleTextField({
    x: 20,
    y: 60,
    width: 100,
    height: 20,
    name: "nachname",
    tooltip: "Geben Sie Ihren Nachnamen ein",
    label: "Nachname:",
    required: true
  });

  const outputPath = path.join(outputDir, "test-form-2-required.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log(`  Created: ${outputPath}`);
}

/**
 * Test 3: Checkbox
 */
function testCheckbox() {
  console.log("Test 3: Checkbox");

  const doc = new jsPDF({ pdfUA: true });
  doc.setLanguage("de-DE");
  doc.setDocumentTitle("Checkbox Test");

  // Title
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.text("Checkbox Test", 20, 30);
  doc.endStructureElement();

  // Checkbox
  doc.setFontSize(12);
  doc.addAccessibleCheckBox({
    x: 20,
    y: 60,
    name: "agb",
    tooltip: "Ich akzeptiere die Allgemeinen Geschäftsbedingungen",
    label: "AGB akzeptieren",
    required: true
  });

  // Second checkbox (checked by default)
  doc.addAccessibleCheckBox({
    x: 20,
    y: 90,
    name: "newsletter",
    tooltip: "Ich möchte den Newsletter erhalten",
    label: "Newsletter abonnieren",
    checked: true
  });

  const outputPath = path.join(outputDir, "test-form-3-checkbox.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log(`  Created: ${outputPath}`);
}

/**
 * Test 4: ComboBox (Dropdown)
 */
function testComboBox() {
  console.log("Test 4: ComboBox (Dropdown)");

  const doc = new jsPDF({ pdfUA: true });
  doc.setLanguage("de-DE");
  doc.setDocumentTitle("Dropdown Test");

  // Title
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.text("Dropdown Test", 20, 30);
  doc.endStructureElement();

  // ComboBox
  doc.setFontSize(12);
  doc.addAccessibleComboBox({
    x: 20,
    y: 60,
    width: 100,
    height: 20,
    name: "land",
    tooltip: "Wählen Sie Ihr Land aus",
    label: "Land:",
    options: ["Deutschland", "Österreich", "Schweiz", "Luxemburg"],
    required: true
  });

  const outputPath = path.join(outputDir, "test-form-4-combobox.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log(`  Created: ${outputPath}`);
}

/**
 * Test 5: Complete Form
 */
function testCompleteForm() {
  console.log("Test 5: Complete Form");

  const doc = new jsPDF({ pdfUA: true });
  doc.setLanguage("de-DE");
  doc.setDocumentTitle("Kontaktformular");

  // Title
  doc.beginStructureElement("H1");
  doc.setFontSize(20);
  doc.text("Kontaktformular", 20, 25);
  doc.endStructureElement();

  // Introduction
  doc.beginStructureElement("P");
  doc.setFontSize(11);
  doc.text("Bitte füllen Sie alle Pflichtfelder (*) aus.", 20, 40);
  doc.endStructureElement();

  // Personal Information Section
  doc.beginStructureElement("H2");
  doc.setFontSize(14);
  doc.text("Persönliche Daten", 20, 55);
  doc.endStructureElement();

  doc.setFontSize(11);

  // First name
  doc.addAccessibleTextField({
    x: 20,
    y: 75,
    width: 80,
    height: 15,
    name: "vorname",
    tooltip: "Geben Sie Ihren Vornamen ein",
    label: "Vorname:",
    required: true
  });

  // Last name
  doc.addAccessibleTextField({
    x: 110,
    y: 75,
    width: 80,
    height: 15,
    name: "nachname",
    tooltip: "Geben Sie Ihren Nachnamen ein",
    label: "Nachname:",
    required: true
  });

  // Email
  doc.addAccessibleTextField({
    x: 20,
    y: 110,
    width: 170,
    height: 15,
    name: "email",
    tooltip: "Geben Sie Ihre E-Mail-Adresse ein",
    label: "E-Mail:",
    required: true
  });

  // Country
  doc.addAccessibleComboBox({
    x: 20,
    y: 145,
    width: 80,
    height: 15,
    name: "land",
    tooltip: "Wählen Sie Ihr Land",
    label: "Land:",
    options: ["Deutschland", "Österreich", "Schweiz"],
    required: true
  });

  // Message
  doc.beginStructureElement("H2");
  doc.setFontSize(14);
  doc.text("Ihre Nachricht", 20, 180);
  doc.endStructureElement();

  doc.setFontSize(11);
  doc.addAccessibleTextField({
    x: 20,
    y: 200,
    width: 170,
    height: 50,
    name: "nachricht",
    tooltip: "Geben Sie Ihre Nachricht ein",
    label: "Nachricht:",
    multiline: true,
    required: true
  });

  // Consent
  doc.beginStructureElement("H2");
  doc.setFontSize(14);
  doc.text("Einwilligungen", 20, 270);
  doc.endStructureElement();

  doc.setFontSize(11);
  doc.addAccessibleCheckBox({
    x: 20,
    y: 283,
    name: "datenschutz",
    tooltip: "Ich habe die Datenschutzerklärung gelesen und akzeptiere sie",
    label: "Datenschutzerklärung akzeptieren",
    required: true
  });

  const outputPath = path.join(outputDir, "test-form-5-complete.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log(`  Created: ${outputPath}`);
}

/**
 * Test 6: Validation Test - Missing Tooltip
 */
function testValidationMissingTooltip() {
  console.log("Test 6: Validation - Missing Tooltip");

  const doc = new jsPDF({ pdfUA: true });
  doc.setLanguage("de-DE");

  try {
    // This should throw an error
    doc.addAccessibleTextField({
      x: 20,
      y: 60,
      width: 100,
      height: 20,
      name: "test"
      // tooltip is missing!
    });
    console.log("  ERROR: Expected validation error was not thrown!");
  } catch (e) {
    if (e.message.includes("PDF/UA: tooltip is required")) {
      console.log("  PASS: Validation correctly rejects missing tooltip");
    } else {
      console.log("  ERROR: Wrong error message: " + e.message);
    }
  }
}

/**
 * Test 7: Low-Level API with TU attribute
 */
function testLowLevelAPIWithTU() {
  console.log("Test 7: Low-Level API with TU attribute");

  const doc = new jsPDF({ pdfUA: true });
  doc.setLanguage("de-DE");
  doc.setDocumentTitle("Low-Level API Test");

  // Title
  doc.beginStructureElement("H1");
  doc.setFontSize(18);
  doc.text("Low-Level API Test", 20, 30);
  doc.endStructureElement();

  // Create field using low-level API
  const textField = new doc.AcroForm.TextField();
  textField.x = 20;
  textField.y = 60;
  textField.width = 100;
  textField.height = 20;
  textField.fieldName = "testField";
  textField.tooltip = "Test tooltip for screen readers"; // Using the alias

  // Wrap in Form structure element manually
  doc.beginFormField();
  doc.beginStructureElement("P");
  doc.setFontSize(12);
  doc.text("Test Field:", 20, 55);
  doc.endStructureElement();

  doc.addField(textField);
  doc.addFormFieldRef(textField._pdfuaInternalId);
  doc.endFormField();

  const outputPath = path.join(outputDir, "test-form-7-lowlevel.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log(`  Created: ${outputPath}`);
}

// Run all tests
console.log("\n=== PDF/UA Form Field Tests ===\n");

testSimpleTextField();
testRequiredTextField();
testCheckbox();
testComboBox();
testCompleteForm();
testValidationMissingTooltip();
testLowLevelAPIWithTU();

console.log("\n=== Tests Complete ===\n");
console.log("Please verify the generated PDFs with:");
console.log("1. veraPDF for PDF/UA validation");
console.log("2. Screen reader (NVDA + Adobe Acrobat) for accessibility");
console.log("\nPDF files are in: examples/temp/test-form-*.pdf");
