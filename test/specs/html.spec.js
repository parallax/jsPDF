/* global describe, it, jsPDF, comparePdf */
describe("Module: html", function() {
  if (
    (typeof isNode != "undefined" && isNode) ||
    navigator.userAgent.indexOf("Chrome") < 0
  ) {
    return;
  }
  beforeAll(loadGlobals);
  it("html loads html2canvas asynchronously", async () => {
    const doc = jsPDF({ floatPrecision: 2 });
    await new Promise(resolve =>
      doc.html("<h1>Basic HTML</h1>", { callback: resolve })
    );
    comparePdf(doc.output(), "html-basic.pdf", "html");
  });

  it("html margin insets properly", async () => {
    const doc = jsPDF({ floatPrecision: 2 });
    await new Promise(resolve =>
      doc.html("<h1>Basic HTML</h1><h2>Heading 2</h2>", { callback: resolve, margin: [10, 10] })
    );
    comparePdf(doc.output(), "html-margin.pdf", "html");
  });

  it("html x, y offsets properly", async () => {
    const doc = jsPDF({ floatPrecision: 2 });
    await new Promise(resolve =>
      doc.html("<h1>Basic HTML</h1><h2>Heading 2</h2>", { callback: resolve, x: 30, y: 40 })
    );
    comparePdf(doc.output(), "html-x-y.pdf", "html");
  });
});
