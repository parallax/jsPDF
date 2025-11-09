/* global jsPDF */

describe("Form objects", () => {
  beforeAll(loadGlobals);

  it("should use correct bounding box for scale factors other than 1", () => {
    const doc = new jsPDF({ unit: "mm", format: [200, 200], orientation: "p" });

    doc.advancedAPI();

    doc.beginFormObject(-50, -50, 100, 100, doc.unitMatrix);
    doc.rect(-50, -50, 100, 100).fill();
    doc.endFormObject("0");

    doc.doFormObject("0", new doc.Matrix(1, 0, 0, 1, 100, 100));

    doc.setDrawColor(255, 0, 0);
    doc.rect(50, 50, 100, 100).stroke();
    doc.rect(0, 0, 200, 200).stroke();

    doc.compatAPI();

    comparePdf(doc.output(), "form-objects-scale-factor.pdf", "form-objects");
  });
});
