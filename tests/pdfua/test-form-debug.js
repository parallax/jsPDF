/**
 * Debug test for form fields - compare PDF/UA vs non-PDF/UA
 */

const { jsPDF } = require("../../dist/jspdf.node.js");
const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "../../examples/temp");

// Test 1: Non-PDF/UA form (should work)
function testNonPDFUA() {
  console.log("Test: Non-PDF/UA Form Field");

  const doc = new jsPDF();

  doc.text("Test Form (Non-PDF/UA)", 20, 30);

  // Create text field using low-level API
  const textField = new doc.AcroForm.TextField();
  textField.x = 20;
  textField.y = 50;
  textField.width = 100;
  textField.height = 20;
  textField.fieldName = "testField";
  textField.value = "";

  doc.addField(textField);

  const outputPath = path.join(outputDir, "test-form-debug-nonpdfua.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log(`  Created: ${outputPath}`);
}

// Test 2: PDF/UA form with minimal setup
function testPDFUAMinimal() {
  console.log("Test: PDF/UA Form Field (Minimal)");

  const doc = new jsPDF({ pdfUA: true });
  doc.setLanguage("de-DE");

  doc.beginStructureElement("H1");
  doc.text("Test Form (PDF/UA)", 20, 30);
  doc.endStructureElement();

  // Create text field using low-level API
  const textField = new doc.AcroForm.TextField();
  textField.x = 20;
  textField.y = 50;
  textField.width = 100;
  textField.height = 20;
  textField.fieldName = "testField";
  textField.tooltip = "Enter text here";
  textField.value = "";

  // Wrap in Form structure element
  doc.beginFormField();
  doc.addField(textField);
  if (textField._pdfuaInternalId) {
    doc.addFormFieldRef(textField._pdfuaInternalId);
  }
  doc.endFormField();

  const outputPath = path.join(outputDir, "test-form-debug-pdfua.pdf");
  fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log(`  Created: ${outputPath}`);
}

// Test 3: Check what properties the field has
function testFieldProperties() {
  console.log("\nTest: Field Properties Comparison");

  const docNormal = new jsPDF();
  const docPDFUA = new jsPDF({ pdfUA: true });

  const fieldNormal = new docNormal.AcroForm.TextField();
  fieldNormal.x = 20;
  fieldNormal.y = 50;
  fieldNormal.width = 100;
  fieldNormal.height = 20;
  fieldNormal.fieldName = "test";

  const fieldPDFUA = new docPDFUA.AcroForm.TextField();
  fieldPDFUA.x = 20;
  fieldPDFUA.y = 50;
  fieldPDFUA.width = 100;
  fieldPDFUA.height = 20;
  fieldPDFUA.fieldName = "test";
  fieldPDFUA.tooltip = "Test tooltip";

  console.log("Normal field properties:");
  console.log("  hasAppearanceStream:", fieldNormal.hasAppearanceStream);
  console.log("  FT:", fieldNormal.FT);

  console.log("\nPDF/UA field properties:");
  console.log("  hasAppearanceStream:", fieldPDFUA.hasAppearanceStream);
  console.log("  FT:", fieldPDFUA.FT);
  console.log("  TU:", fieldPDFUA.TU);
  console.log("  tooltip:", fieldPDFUA.tooltip);
}

testNonPDFUA();
testPDFUAMinimal();
testFieldProperties();

console.log("\n=== Debug Tests Complete ===");
console.log("Compare test-form-debug-nonpdfua.pdf with test-form-debug-pdfua.pdf");
