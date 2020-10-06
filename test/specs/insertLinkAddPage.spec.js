/* global describe, it, jsPDF, comparePdf, loadBinaryResource */
/**
 * Standard spec tests
 */

describe("Module: Insert Link after AddPage", () => {
  beforeAll(loadGlobals);
  it("insert link after add page", () => {
    const doc = new jsPDF({
      unit: "px",
      format: [200, 300],
    });

    doc.textWithLink("Hello world!", 10, 10, {
      url: "https://parall.ax/",
    });

    doc.addPage("a4");

    doc.text("Format??", 10, 10);

    comparePdf(doc.output(), "insertLinkAddPage.pdf", "annotations");
  });
});
