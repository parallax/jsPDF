/* global describe, it, expect, jsPDF, comparePdf */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe("Core: Standard Text", () => {
  beforeAll(loadGlobals);
  it("should load", () => {
    // assertions here]
    expect(typeof jsPDF).toBe("function");
  });
  it("should generate blank page", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    comparePdf(doc.output(), "blank.pdf", "text");
  });
  it("should allow text insertion", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.text(10, 10, "This is a test!");
    comparePdf(doc.output(), "standard.pdf", "text");
  });
  it("should allow text insertion at an angle", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.text(20, 20, "This is a test!", null, 20);
    comparePdf(doc.output(), "angle.pdf", "text");
  });
  it("should render different font faces", () => {
    const doc = jsPDF({ floatPrecision: 2 });

    doc.text(20, 20, "This is the default font.");

    doc.setFont("courier");
    doc.setFont(undefined, "normal");
    doc.text(20, 30, "This is courier normal.");

    doc.setFont("times");
    doc.setFont(undefined, "italic");
    doc.text(20, 40, "This is times italic.");

    doc.setFont("helvetica");
    doc.setFont(undefined, "bold");
    doc.text(20, 50, "This is helvetica bold.");

    doc.setFont("courier");
    doc.setFont(undefined, "bolditalic");
    doc.text(20, 60, "This is courier bolditalic.");

    comparePdf(doc.output(), "font-faces.pdf", "text");
  });
  it("should support multiple pages", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.text(20, 20, "Hello world!");
    doc.text(20, 30, "This is client-side JavaScript, pumping out a PDF.");
    doc.addPage();
    doc.text(20, 20, "Do you like that?");
    comparePdf(doc.output(), "two-page.pdf", "text");
  });
  it("should support different size fonts", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.setFontSize(22);
    doc.text(20, 20, "This is a title");

    doc.setFontSize(16);
    doc.text(20, 30, "This is some normal sized text underneath.");
    comparePdf(doc.output(), "different-sizes.pdf", "text");
  });
  it("should support multiline text", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.text(
      20,
      20,
      `This is a line
break`
    );
    comparePdf(doc.output(), "line-break.pdf", "text");
  });

  it("should support strokes", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.text("Stroke on", 20, 20, { stroke: true });
    doc.text("Stroke on", 20, 40, { stroke: true });
    doc.text("Stroke off", 20, 60, { stroke: false });
    doc.text("Stroke on", 20, 80, { stroke: true });

    comparePdf(doc.output(), "stroke.pdf", "text");
  });

  it("should display two red lines of text by rgb", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.setTextColor("#FF0000");
    doc.text("Red on", 20, 20);
    doc.setTextColor(255, 0, 0);
    doc.text("Red on", 20, 40);

    comparePdf(doc.output(), "color.pdf", "text");
  });

  it("should display two red lines of text by colorname", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.setTextColor("red");
    doc.text("Red on", 20, 20);
    doc.setTextColor(255, 0, 0);
    doc.text("Red on", 20, 40);

    comparePdf(doc.output(), "color.pdf", "text");
  });

  it("should display one line of red, one black by rgb", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.setTextColor("#FF0000");
    doc.text("Red", 20, 20);
    doc.setTextColor("#000000");
    doc.text("Black", 20, 40);

    comparePdf(doc.output(), "red-black.pdf", "text");
  });

  it("should display one line of red, one black by colorname", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.setTextColor("red");
    doc.text("Red", 20, 20);
    doc.setTextColor("black");
    doc.text("Black", 20, 40);

    comparePdf(doc.output(), "red-black.pdf", "text");
  });

  it("should display alternating styles when using getter functions", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.setTextColor("#FF0000");
    doc.setFontSize(20);
    doc.text("Red", 20, 20);
    var previousColor = doc.internal.getTextColor();
    var previousSize = doc.internal.getFontSize();
    doc.setTextColor("#000000");
    doc.setFontSize(10);
    doc.text("Black", 20, 40);
    doc.setTextColor(previousColor);
    doc.setFontSize(previousSize);
    doc.text("Red", 20, 60);
    // test grayscale and text styles
    doc.setTextColor(200);
    doc.setFont(undefined, "bold");
    doc.text("Bold Gray", 20, 80);
    var previousColor = doc.internal.getTextColor();
    var previousStyle = doc.internal.getFont()["fontStyle"];
    doc.setTextColor(155);
    doc.setFont(undefined, "italic");
    doc.text("Italic Dark Gray", 20, 100);
    doc.setTextColor(previousColor);
    doc.setFont(undefined, previousStyle);
    doc.text("Bold Gray", 20, 120);
    comparePdf(doc.output(), "alternating-text-styling.pdf", "text");
  });

  // @TODO: Document alignment
  it("should center align text", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.setFont("times", "normal");
    doc.text(105, 80, "This is centred text.", null, null, "center");
    doc.text(
      105,
      90,
      "And a little bit more underneath it.",
      null,
      null,
      "center"
    );
    doc.text(200, 100, "This is right aligned text", null, null, "right");
    doc.text(200, 110, "And some more", null, null, "right");
    doc.text(20, 120, "Back to left");

    comparePdf(doc.output(), "alignment.pdf", "text");
  });

  it("should justify custom font", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    var PTSans;
    if (typeof global === "object" && global.isNode === true) {
      PTSans = doc.loadFile("./test/reference/PTSans.ttf");
    } else {
      PTSans = doc.loadFile("base/test/reference/PTSans.ttf");
    }
    doc.addFileToVFS("PTSans.ttf", PTSans);
    doc.addFont("PTSans.ttf", "PTSans", "normal");
    doc.setFont("PTSans");
    doc.setFontSize(10);
    doc.text("А ну чики брики и в дамки! А ну чики брики и в дамки! А ну чики брики и в дамки! А ну чики брики и в дамки! А ну чики брики и в дамки! А ну чики брики и в дамки! А ну чики брики и в дамки! А ну чики брики и в дамки! А ну чики брики и в дамки! ", 10, 10, {
      align: "justify",
      maxWidth: 100,
    });
    comparePdf(doc.output(), "justify-custom-font.pdf", "text");
  });

  it("should throw an error if not a string", () => {
    expect(() => {
      const doc = jsPDF({ floatPrecision: 2 });
      doc.text(10, 10, 43290943);
    }).toThrow(
      new Error('Type of text must be string or Array. "10" is not recognized.')
    );
  });

  it("should throw an error when passed incorrect alignment", () => {
    expect(() => {
      const doc = jsPDF({ floatPrecision: 2 });
      doc.text(
        105,
        80,
        "This is text with a moose alignment.",
        null,
        null,
        "moose"
      );
    }).toThrow(
      new Error(
        'Unrecognized alignment option, use "left", "center", "right" or "justify".'
      )
    );
  });

  it("should render letter spaced text", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.text("hello", 10, 10, { charSpace: 0 });
    doc.text("hello", 10, 20, { charSpace: 2 });
    doc.text("hello", 10, 30, { charSpace: 5 });
    doc.text("hello", 10, 40, { charSpace: 10 });
    comparePdf(doc.output(), "letter-spacing.pdf", "text");
  });

  it("should render horizontally scaled text", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.text("hello", 10, 10, { horizontalScale: 0.5 });
    doc.text("hello", 10, 20, { horizontalScale: 0.75 });
    doc.text("hello", 10, 30, { horizontalScale: 1 });
    doc.text("hello", 10, 40, { horizontalScale: 1.5 });
    comparePdf(doc.output(), "text-horizontal-scaling.pdf", "text");
  });

  it("should respect autoencode and noBOM flags", () => {
    const doc = jsPDF({ floatPrecision: 2 });

    doc.text("Default:", 10, 10);
    doc.text("é'\"´`'\u2019", 150, 10);

    doc.text("autoencode=false:", 10, 30);
    doc.text("é'\"´`'\u2019", 150, 30, { flags: { autoencode: false } });

    doc.text("noBOM=false:", 10, 60);
    doc.text("é'\"´`'\u2019", 150, 60, { flags: { noBOM: false } });

    doc.text("noBOM=false,autoencode=false (garbled):", 10, 90);
    doc.text("é'\"´`'\u2019", 150, 90, {
      flags: { autoencode: false, noBOM: false }
    });

    comparePdf(doc.output(), "text-encoding-flags.pdf", "text");
  });
});
