/* global describe, it, jsPDF, comparePdf */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe("Module: Annotations", () => {
  beforeAll(loadGlobals);
  it("should draw a closed annotation", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.createAnnotation({
      type: "text",
      title: "note",
      bounds: {
        x: 10,
        y: 10,
        w: 200,
        h: 80
      },
      contents: "This is text annotation (closed by default)",
      open: false
    });
    comparePdf(doc.output(), "closed.pdf", "annotations");
  });
  it("should draw an open annotation", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.createAnnotation({
      type: "text",
      title: "note",
      bounds: {
        x: 10,
        y: 10,
        w: 200,
        h: 80
      },
      contents: "This is text annotation (open by default)",
      open: true
    });
    comparePdf(doc.output(), "open.pdf", "annotations");
  });
  it("should draw a free text annotation", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.createAnnotation({
      type: "freetext",
      bounds: {
        x: 0,
        y: 10,
        w: 200,
        h: 20
      },
      contents: "This is a freetext annotation",
      color: "#ff0000"
    });
    comparePdf(doc.output(), "freetext.pdf", "annotations");
  });
  it("should draw a link on the text with link after add page", () => {
    const doc = new jsPDF({
      unit: "px",
      format: [200, 300],
      floatPrecision: 2
    });

    doc.textWithLink("Click me!", 10, 10, {
      url: "https://parall.ax/"
    });

    doc.addPage("a4");

    doc.text("New page with difference size", 10, 10);

    comparePdf(doc.output(), "insertLinkAddPage.pdf", "annotations");
  });
  it("should add a multline link to the page", () => {
    var doc = new jsPDF({
      floatPrecision: 2
    });

    doc.textWithLink("This is a very long link text!", 10, 10, {
      url: "https://parall.ax/",
      maxWidth: 20
    });

    comparePdf(doc.output(), "multiLineLinkWithText.pdf", "annotations");
  });
  it("should align text link based on the align option", () => {
    var doc = new jsPDF({
      unit: "px",
      format: [200, 300],
      floatPrecision: 2
    });

    doc.textWithLink(
      "Left aligned Link",
      doc.internal.pageSize.getWidth() / 2,
      10,
      { align: "left", url: "https://www.google.com" }
    );
    doc.textWithLink(
      "Center aligned Link",
      doc.internal.pageSize.getWidth() / 2,
      30,
      { align: "center", url: "https://www.google.com" }
    );
    doc.textWithLink(
      "Justify aligned Link",
      doc.internal.pageSize.getWidth() / 2,
      50,
      { align: "justify", url: "https://www.google.com" }
    );
    doc.textWithLink(
      "Right aligned Link",
      doc.internal.pageSize.getWidth() / 2,
      70,
      { align: "right", url: "https://www.google.com" }
    );

    comparePdf(doc.output(), "textLinkWithAlignOptions.pdf", "annotations");
  });
});
