/* global describe, it, jsPDF, comparePdf, jasmine, expect */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe("Core: Initialization Options", () => {
  beforeAll(loadGlobals);
  var global =
    (typeof self !== "undefined" && self) ||
    (typeof window !== "undefined" && window) ||
    (typeof global !== "undefined" && global) ||
    Function('return typeof this === "object" && this.content')() ||
    Function("return this")();

  it("should make a compressed document", () => {
    const doc = jsPDF({
      compress: true,
      floatPrecision: 2
    });
    doc.text(10, 10, "This is a test");

    comparePdf(doc.output(), "compress.pdf", "init");
  });

  it("should make a landscape document", () => {
    const doc = jsPDF({
      orientation: "landscape",
      floatPrecision: 2
    });
    doc.text(10, 10, "This is a test!");
    comparePdf(doc.output(), "landscape.pdf", "init");
  });

  it("should set document properties", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.setProperties({
      title: "Title",
      subject: "This is the subject",
      author: "James Hall",
      keywords: "generated, javascript, parallax",
      creator: "jsPDF"
    });
    comparePdf(doc.output(), "properties.pdf", "init");
  });

  it("should return font list", () => {
    const doc = jsPDF();
    const fontList = doc.getFontList();
    expect(fontList).toEqual({
      helvetica: ["normal", "bold", "italic", "bolditalic"],
      Helvetica: ["", "Bold", "Oblique", "BoldOblique"],
      courier: ["normal", "bold", "italic", "bolditalic"],
      Courier: ["", "Bold", "Oblique", "BoldOblique"],
      times: ["normal", "bold", "italic", "bolditalic"],
      Times: ["Roman", "Bold", "Italic", "BoldItalic"],
      zapfdingbats: ["normal"],
      ZapfDingbats: [""],
      symbol: ["normal"],
      Symbol: [""]
    });
  });

  it("should return an ArrayBuffer", () => {
    const doc = jsPDF();
    expect(doc.output("arraybuffer")).toEqual(jasmine.any(ArrayBuffer));
  });

  if (global.isNode !== true) {
    it("should return a Blob", () => {
      const doc = jsPDF();
      expect(doc.output("blob")).toEqual(jasmine.any(window.Blob));
    });

    it("should return a bloburl", () => {
      const doc = jsPDF();
      expect(doc.output("bloburl")).toContain("blob:");
      expect(doc.output("bloburi")).toContain("blob:");
    });
  }

  it("should return a datauri", () => {
    const doc = jsPDF();
    expect(doc.output("datauristring")).toContain("data:");
    expect(doc.output("dataurlstring")).toContain("data:");
  });

  if (global.isNode !== true) {
    xit("should open a new window", () => {
      if (navigator.userAgent.indexOf("Trident") !== -1) {
        console.warn("Skipping IE for new window test");
        return;
      }
      const doc = jsPDF();
      doc.text(10, 10, "This is a test");
      doc.output("dataurlnewwindow");
      // expect(doc.output('dataurlnewwindow').Window).toEqual(jasmine.any(Function))
    });
  }

  const renderBoxes = doc => {
    for (let i = 0; i < 100; i++) {
      doc.rect(0, 0, i, i);
    }
  };

  it("should render text 100pt away from the top left", () => {
    const doc = jsPDF({
      orientation: "portrait",
      unit: "pt",
      floatPrecision: 2
    });
    renderBoxes(doc);
    comparePdf(doc.output(), "pt.pdf", "init");
  });

  it("should render text 100mm away from the top left", () => {
    const doc = jsPDF({
      orientation: "portrait",
      unit: "mm",
      floatPrecision: 2
    });
    renderBoxes(doc);
    comparePdf(doc.output(), "mm.pdf", "init");
  });

  it("should render text 100cm away from the top left", () => {
    const doc = jsPDF({
      orientation: "portrait",
      unit: "cm",
      floatPrecision: 2
    });
    renderBoxes(doc);
    comparePdf(doc.output(), "cm.pdf", "init");
  });

  it("should render text 2in away from the top left", () => {
    const doc = jsPDF({
      orientation: "portrait",
      unit: "in",
      floatPrecision: 2
    });
    renderBoxes(doc);
    comparePdf(doc.output(), "in.pdf", "init");
  });

  it("should render text 2px away from the top left", () => {
    const doc = jsPDF({
      orientation: "portrait",
      unit: "px",
      floatPrecision: 2
    });
    renderBoxes(doc);
    comparePdf(doc.output(), "px.pdf", "init");
  });

  it("should render text 2px away from the top left", () => {
    const doc = jsPDF({
      orientation: "portrait",
      unit: "pc",
      floatPrecision: 2
    });
    renderBoxes(doc);
    comparePdf(doc.output(), "pc.pdf", "init");
  });

  it("should render text 2px away from the top left with alternative syntax", () => {
    const doc = jsPDF({ unit: "pc", floatPrecision: 2 });
    renderBoxes(doc);
    comparePdf(doc.output(), "pc.pdf", "init");
  });

  it("should render text 2em away from the top left with alternative syntax", () => {
    const doc = jsPDF({ unit: "em", floatPrecision: 2 });
    renderBoxes(doc);
    comparePdf(doc.output(), "em.pdf", "init");
  });

  it("should render text 2ex away from the top left with alternative syntax", () => {
    const doc = jsPDF({ unit: "ex", floatPrecision: 2 });
    renderBoxes(doc);
    comparePdf(doc.output(), "ex.pdf", "init");
  });

  it("should warn me about an invalid unit", () => {
    expect(() => {
      jsPDF({ unit: "invalid" });
    }).toThrow(new Error("Invalid unit: invalid"));
  });

  it("should warn me about an invalid unit when passed as second argument", () => {
    expect(() => {
      jsPDF("portrait", "invalid");
    }).toThrow(new Error("Invalid unit: invalid"));
  });

  it("getCreationDate", () => {
    const doc = jsPDF("portrait", "cm");
    var creationDate = new Date();
    doc.setCreationDate(creationDate);
    expect(doc.getCreationDate("jsDate").getFullYear()).toEqual(
      creationDate.getFullYear()
    );
    expect(doc.getCreationDate("jsDate").getMonth()).toEqual(
      creationDate.getMonth()
    );
    expect(doc.getCreationDate("jsDate").getDate()).toEqual(
      creationDate.getDate()
    );
    expect(doc.getCreationDate("jsDate").getHours()).toEqual(
      creationDate.getHours()
    );
    expect(doc.getCreationDate("jsDate").getMinutes()).toEqual(
      creationDate.getMinutes()
    );
    expect(doc.getCreationDate("jsDate").getSeconds()).toEqual(
      creationDate.getSeconds()
    );
  });

  it("setCreationDate", () => {
    const doc = jsPDF("portrait", "cm");
    var creationDate = new Date(1987, 11, 10, 0, 0, 0);
    var pdfDateString = "D:19871210000000+00'00'";
    doc.setCreationDate(pdfDateString);
    expect(doc.getCreationDate("jsDate").getFullYear()).toEqual(
      creationDate.getFullYear()
    );
    expect(doc.getCreationDate("jsDate").getMonth()).toEqual(
      creationDate.getMonth()
    );
    expect(doc.getCreationDate("jsDate").getDate()).toEqual(
      creationDate.getDate()
    );
    expect(doc.getCreationDate("jsDate").getHours()).toEqual(
      creationDate.getHours()
    );
    expect(doc.getCreationDate("jsDate").getMinutes()).toEqual(
      creationDate.getMinutes()
    );
    expect(doc.getCreationDate("jsDate").getSeconds()).toEqual(
      creationDate.getSeconds()
    );
  });
});
