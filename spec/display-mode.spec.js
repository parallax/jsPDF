/* global describe, it, jsPDF, comparePdf, expect */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe("Core: Display modes", () => {
  it("should set zoom mode to full height", () => {
    const doc = new jsPDF({ floatPrecision: 2 });
    doc.setDisplayMode("fullheight");
    doc.text(10, 10, "This is a test");
    comparePdf(doc.output(), "zoom-full-height.pdf", "pages");
  });

  it("should set zoom mode to full width", () => {
    const doc = new jsPDF({ floatPrecision: 2 });
    doc.setDisplayMode("fullwidth");
    doc.text(10, 10, "This is a test");
    comparePdf(doc.output(), "zoom-full-width.pdf", "pages");
  });

  it("should set zoom mode to full page", () => {
    const doc = new jsPDF({ orientation: "landscape", floatPrecision: 2 });
    doc.setDisplayMode("fullpage");
    doc.text(10, 10, "This is a test");
    comparePdf(doc.output(), "zoom-full-page.pdf", "pages");
  });

  it("should set zoom mode to original", () => {
    const doc = new jsPDF({ orientation: "landscape", floatPrecision: 2 });
    doc.setDisplayMode("original");
    doc.text(10, 10, "This is a test");
    comparePdf(doc.output(), "zoom-original.pdf", "pages");
  });

  it("should set zoom mode to 2x", () => {
    const doc = new jsPDF({ orientation: "landscape", floatPrecision: 2 });
    doc.setDisplayMode(2);
    doc.text(20, 20, "This is a test");
    comparePdf(doc.output(), "zoom-2x.pdf", "pages");
  });

  it("should set zoom mode to 3x", () => {
    const doc = new jsPDF({ orientation: "landscape", floatPrecision: 2 });
    doc.setDisplayMode(3);
    doc.text(20, 20, "This is a test");
    comparePdf(doc.output(), "zoom-3x.pdf", "pages");
  });

  it("should set zoom mode to 3x", () => {
    const doc = new jsPDF({ orientation: "landscape", floatPrecision: 2 });
    doc.setDisplayMode("300%");
    doc.text(20, 20, "This is a test");
    comparePdf(doc.output(), "zoom-3x.pdf", "pages");
  });

  it("should display in continuous mode", () => {
    const doc = new jsPDF({ floatPrecision: 2 });
    doc.text(10, 10, "Page 1");
    doc.addPage();
    doc.text(10, 10, "Page 2");
    doc.addPage();
    doc.text(10, 10, "Page 3");
    doc.addPage();
    doc.text(10, 10, "Page 4");
    doc.setDisplayMode(null, "continuous");
    comparePdf(doc.output(), "continuous.pdf", "pages");
  });

  it("should display in single page mode", () => {
    const doc = new jsPDF({ floatPrecision: 2 });
    doc.text(10, 10, "Page 1");
    doc.addPage();
    doc.text(10, 10, "Page 2");
    doc.addPage();
    doc.text(10, 10, "Page 3");
    doc.addPage();
    doc.text(10, 10, "Page 4");
    doc.setDisplayMode(null, "single");
    comparePdf(doc.output(), "single.pdf", "pages");
  });

  it("should display in two column left mode", () => {
    const doc = new jsPDF({ floatPrecision: 2 });
    doc.text(10, 10, "Page 1");
    doc.addPage();
    doc.text(10, 10, "Page 2");
    doc.addPage();
    doc.text(10, 10, "Page 3");
    doc.addPage();
    doc.text(10, 10, "Page 4");
    doc.setDisplayMode(null, "twoleft");
    comparePdf(doc.output(), "twoleft.pdf", "pages");
  });

  it("should display in two column left mode with shorter syntax", () => {
    const doc = new jsPDF({ floatPrecision: 2 });
    doc.text(10, 10, "Page 1");
    doc.addPage();
    doc.text(10, 10, "Page 2");
    doc.addPage();
    doc.text(10, 10, "Page 3");
    doc.addPage();
    doc.text(10, 10, "Page 4");
    doc.setDisplayMode(null, "two");
    comparePdf(doc.output(), "twoleft.pdf", "pages");
  });

  it("should display in two column right mode", () => {
    const doc = new jsPDF({ floatPrecision: 2 });
    doc.text(10, 10, "Page 1");
    doc.addPage();
    doc.text(10, 10, "Page 2");
    doc.addPage();
    doc.text(10, 10, "Page 3");
    doc.addPage();
    doc.text(10, 10, "Page 4");
    doc.setDisplayMode(null, "tworight");
    comparePdf(doc.output(), "tworight.pdf", "pages");
  });

  it("should use outline display mode", () => {
    const doc = new jsPDF({ floatPrecision: 2 });
    doc.text(10, 10, "Page 1");
    doc.addPage();
    doc.text(10, 10, "Page 2");
    doc.addPage();
    doc.text(10, 10, "Page 3");
    doc.addPage();
    doc.text(10, 10, "Page 4");
    doc.setDisplayMode(null, null, "UseOutlines");
    comparePdf(doc.output(), "outlines.pdf", "pages");
  });

  it("should use thumbnail display mode", () => {
    const doc = new jsPDF({ floatPrecision: 2 });
    doc.text(10, 10, "Page 1");
    doc.addPage();
    doc.text(10, 10, "Page 2");
    doc.addPage();
    doc.text(10, 10, "Page 3");
    doc.addPage();
    doc.text(10, 10, "Page 4");
    doc.setDisplayMode(null, null, "UseThumbs");
    comparePdf(doc.output(), "thumbs.pdf", "pages");
  });

  it("should use fullscreen display mode", () => {
    const doc = new jsPDF({ floatPrecision: 2 });
    doc.text(10, 10, "Page 1");
    doc.addPage();
    doc.text(10, 10, "Page 2");
    doc.addPage();
    doc.text(10, 10, "Page 3");
    doc.addPage();
    doc.text(10, 10, "Page 4");
    doc.setDisplayMode(null, null, "FullScreen");
    comparePdf(doc.output(), "fullscreen.pdf", "pages");
  });

  it("should throw an error for invalid page modes", () => {
    const doc = new jsPDF({ floatPrecision: 2 });
    expect(() => {
      doc.setDisplayMode(null, null, "MadeUp");
    }).toThrow(
      new Error(
        `Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "MadeUp" is not recognized.`
      )
    );
  });
});
