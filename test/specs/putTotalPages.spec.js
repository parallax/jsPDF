/* global describe, it, jsPDF, comparePdf, loadBinaryResource */
/**
 * Standard spec tests
 */

describe("Module: putTotalPages", () => {
  beforeAll(loadGlobals);
  it("standardfont", () => {
    const doc = new jsPDF({ floatPrecision: 2 });
    const totalPagesExp = "{totalPages}";

    doc.text(10, 10, "Page 1 of {totalPages}");
    doc.addPage();

    doc.text(10, 10, "Page 2 of {totalPages}");

    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPagesExp);
    }
    comparePdf(doc.output(), "standardfont.pdf", "putTotalPages");
  });

  it("customfont", () => {
    var PTSans = loadBinaryResource("reference/PTSans.ttf");
    var doc = new jsPDF({ filters: ["ASCIIHexEncode"], floatPrecision: 2 });
    var totalPagesExp = "{totalPages}";

    doc.addFileToVFS("PTSans.ttf", PTSans);
    doc.addFont("PTSans.ttf", "PTSans", "normal");

    doc.setFont("PTSans");

    doc.text(10, 10, "Page 1 of {totalPages}");
    doc.addPage();

    doc.text(10, 10, "Page 2 of {totalPages}");

    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPagesExp);
    }

    comparePdf(doc.output(), "customfont.pdf", "putTotalPages");
  });
});
