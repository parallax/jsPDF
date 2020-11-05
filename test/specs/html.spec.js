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
    const doc = jsPDF({ floatPrecision: 2, unit: "pt" });
    doc.line(30, 10, 100, 10);
    doc.line(30, 10, 30, 100);
    await new Promise(resolve =>
      doc.html(
        "<div style='background: red; width: 10px; height: 10px;'></div>",
        {
          callback: resolve,
          margin: [10, 30]
        }
      )
    );
    comparePdf(doc.output(), "html-margin.pdf", "html");
  });

  it("html margin on page break", async () => {
    const doc = jsPDF({ floatPrecision: 2, unit: "pt" });
    doc.rect(
      30,
      10,
      doc.internal.pageSize.getWidth() - 60,
      doc.internal.pageSize.getHeight() - 20
    );
    await new Promise(resolve =>
      doc.html(
        "<div style='background: red; width: 10px; height: 1000px;'></div>",
        {
          callback: resolve,
          margin: [10, 30, 10, 30]
        }
      )
    );
    doc.rect(
      30,
      10,
      doc.internal.pageSize.getWidth() - 60,
      doc.internal.pageSize.getHeight() - 20
    );
    comparePdf(doc.output(), "html-margin-page-break.pdf", "html");
  });

  it("html x, y offsets properly", async () => {
    const doc = jsPDF({ floatPrecision: 2, unit: "pt" });
    doc.line(30, 10, 100, 10);
    doc.line(30, 10, 30, 100);
    await new Promise(resolve =>
      doc.html(
        "<div style='background: red; width: 10px; height: 10px;'></div>",
        {
          callback: resolve,
          x: 30,
          y: 10
        }
      )
    );
    comparePdf(doc.output(), "html-x-y.pdf", "html");
  });

  it("html x, y + margin offsets properly", async () => {
    const doc = jsPDF({ floatPrecision: 2, unit: "pt" });
    doc.line(30, 10, 100, 10);
    doc.line(30, 10, 30, 100);
    await new Promise(resolve =>
      doc.html(
        "<div style='background: red; width: 10px; height: 10px;'></div>",
        {
          callback: resolve,
          x: 10,
          y: 3,
          margin: [7, 20]
        }
      )
    );
    comparePdf(doc.output(), "html-margin-x-y.pdf", "html");
  });

  it("page break with text", async () => {
    const doc = jsPDF({ floatPrecision: 2, unit: "pt" });
    doc.rect(
      30,
      10,
      doc.internal.pageSize.getWidth() - 60,
      doc.internal.pageSize.getHeight() - 20
    );
    await new Promise(resolve =>
      doc.html(
        "<span>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</span>",
        {
          callback: resolve,
          margin: [10, 30, 10, 30]
        }
      )
    );
    doc.rect(
      30,
      10,
      doc.internal.pageSize.getWidth() - 60,
      doc.internal.pageSize.getHeight() - 20
    );
    comparePdf(doc.output(), "html-margin-page-break-text.pdf", "html");
  });
});
