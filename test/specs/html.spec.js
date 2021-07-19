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
    const doc = jsPDF({ floatPrecision: 2, unit: "pt", format: [100, 100] });
    await new Promise(resolve =>
      doc.html(
        "<div style='background: red; width: 10px; height: 200px;'></div>",
        {
          callback: resolve,
          margin: [10, 30, 10, 30]
        }
      )
    );
    const numberOfPages = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= numberOfPages; i++) {
      doc.setPage(i);
      doc.rect(30, 10, pageWidth - 60, pageHeight - 20);
    }
    doc.line(0, 50, 100, 50);
    comparePdf(doc.output(), "html-margin-page-break.pdf", "html");
  });

  it("page break with image", async () => {
    const doc = jsPDF({ floatPrecision: 2, unit: "pt", format: [100, 100] });
    await new Promise(resolve =>
      doc.html(
        '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==" width="10" height="200">',
        {
          callback: resolve,
          margin: [10, 30, 10, 30]
        }
      )
    );
    const numberOfPages = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= numberOfPages; i++) {
      doc.setPage(i);
      doc.rect(30, 10, pageWidth - 60, pageHeight - 20);
    }
    doc.line(0, 50, 100, 50);
    comparePdf(doc.output(), "html-margin-page-break-image.pdf", "html");
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

  it("html x, y + margin offsets properly", async () => {
    const doc = jsPDF({ floatPrecision: 2, unit: "pt" });
    doc.line(30, 10, 100, 10);
    doc.line(30, 10, 30, 100);
    await new Promise(resolve =>
      doc.html("<span>Lorem Ipsum</span>", {
        callback: resolve,
        x: 10,
        y: 3,
        margin: [7, 20]
      })
    );
    comparePdf(doc.output(), "html-margin-x-y-text.pdf", "html");
  });

  it("page break with autoPaging: 'text'", async () => {
    const text = Array.from({ length: 200 })
      .map((_, i) => `ABC${i}`)
      .join(" ");

    const doc = jsPDF({ floatPrecision: 2, unit: "pt" });
    await new Promise(resolve =>
      doc.html(`<span>${text}</span>`, {
        callback: resolve,
        margin: [10, 30, 10, 30],
        autoPaging: "text"
      })
    );

    const numberOfPages = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= numberOfPages; i++) {
      doc.setPage(i);
      doc.rect(30, 10, pageWidth - 60, pageHeight - 20);
    }
    comparePdf(doc.output(), "html-margin-page-break-text.pdf", "html");
  });

  it("page break with autoPaging: 'slice'", async () => {
    const text = Array.from({ length: 200 })
      .map((_, i) => `ABC${i}`)
      .join(" ");

    const doc = jsPDF({ floatPrecision: 2, unit: "pt" });
    await new Promise(resolve =>
      doc.html(`<span>${text}</span>`, {
        callback: resolve,
        margin: [10, 30, 10, 30],
        autoPaging: "slice"
      })
    );

    const numberOfPages = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= numberOfPages; i++) {
      doc.setPage(i);
      doc.rect(30, 10, pageWidth - 60, pageHeight - 20);
    }
    comparePdf(doc.output(), "html-margin-page-break-text-slice.pdf", "html");
  });
});
