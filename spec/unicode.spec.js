/* global describe, it, jsPDF, loadBinaryResource, comparePdf */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe("Module: Unicode: Russian", function() {
  var PTSans = loadBinaryResource("reference/PTSans.ttf");

  it("simple pdf with russian text (1 line)", function() {
    const doc = new jsPDF({
      filters: ["ASCIIHexEncode"],
      putOnlyUsedFonts: true,
      floatPrecision: 2
    });

    doc.addFileToVFS("PTSans.ttf", PTSans);
    doc.addFont("PTSans.ttf", "PTSans", "normal");

    doc.setFont("PTSans"); // set font
    doc.setFontSize(10);
    doc.text("А ну чики брики и в дамки!", 10, 10);

    comparePdf(doc.output(), "russian-1line.pdf", "unicode");
  });

  it("simple pdf with russian text (2 line)", function() {
    const doc = new jsPDF({
      filters: ["ASCIIHexEncode"],
      putOnlyUsedFonts: true,
      floatPrecision: 2
    });

    doc.addFileToVFS("PTSans.ttf", PTSans);
    doc.addFont("PTSans.ttf", "PTSans", "normal");

    doc.setFont("PTSans"); // set font
    doc.setFontSize(10);
    doc.text(["А ну чики брики", "и в дамки!"], 10, 10);

    comparePdf(doc.output(), "russian-2line.pdf", "unicode");
  });
});
