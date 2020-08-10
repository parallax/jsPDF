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
});
