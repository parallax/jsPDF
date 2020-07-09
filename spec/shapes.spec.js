/* global describe, it, jsPDF, comparePdf */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe("Core: Shapes", () => {
  it("should draw circles", () => {
    const doc = jsPDF({ floatPrecision: 2 });

    doc.ellipse(40, 20, 10, 5);

    doc.setFillColor(0, 0, 255);
    doc.ellipse(80, 20, 10, 5, "F");

    doc.setLineWidth(1);
    doc.setDrawColor(0);
    doc.setFillColor(255, 0, 0);
    doc.circle(120, 20, 5, "FD");
    comparePdf(doc.output(), "circles.pdf", "shapes");
  });

  it("should draw rectangles (colors directly passed by channels)", () => {
    const doc = jsPDF({ floatPrecision: 2 });

    // Empty square
    doc.rect(20, 20, 10, 10);

    // Filled square
    doc.rect(40, 20, 10, 10, "F");

    // Empty red square
    doc.setDrawColor(255, 0, 0);
    doc.rect(60, 20, 10, 10);
    // Filled square with red borders
    doc.setDrawColor(255, 0, 0);
    doc.rect(80, 20, 10, 10, "FD");

    // Filled red square
    doc.setDrawColor(0);
    doc.setFillColor(255, 0, 0);
    doc.rect(100, 20, 10, 10, "F");

    // Filled red square with black borders
    doc.setDrawColor(0);
    doc.setFillColor(255, 0, 0);
    doc.rect(120, 20, 10, 10, "FD");

    // Black square with rounded corners
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(140, 20, 10, 10, 3, 3, "FD");

    comparePdf(doc.output(), "rectangles.pdf", "shapes");
  });

  it("should draw rectangles (colors directly passed by short rgb)", () => {
    const doc = jsPDF({ floatPrecision: 2 });

    // Empty square
    doc.rect(20, 20, 10, 10);

    // Filled square
    doc.rect(40, 20, 10, 10, "F");

    // Empty red square
    doc.setDrawColor("#f00");
    doc.rect(60, 20, 10, 10);

    // Filled square with red borders
    doc.setDrawColor("#f00");
    doc.rect(80, 20, 10, 10, "FD");

    // Filled red square
    doc.setDrawColor("#000");
    doc.setFillColor("#f00");
    doc.rect(100, 20, 10, 10, "F");

    // Filled red square with black borders
    doc.setDrawColor("#000");
    doc.setFillColor("#f00");
    doc.rect(120, 20, 10, 10, "FD");

    // Black square with rounded corners
    doc.setDrawColor("#000");
    doc.setFillColor("#fff");
    doc.roundedRect(140, 20, 10, 10, 3, 3, "FD");

    comparePdf(doc.output(), "rectangles.pdf", "shapes");
  });

  it("should draw rectangles (colors directly passed by rgb)", () => {
    const doc = jsPDF({ floatPrecision: 2 });

    // Empty square
    doc.rect(20, 20, 10, 10);

    // Filled square
    doc.rect(40, 20, 10, 10, "F");

    // Empty red square
    doc.setDrawColor("#ff0000");
    doc.rect(60, 20, 10, 10);

    // Filled square with red borders
    doc.setDrawColor("#ff0000");
    doc.rect(80, 20, 10, 10, "FD");

    // Filled red square
    doc.setDrawColor("#000000");
    doc.setFillColor("#ff0000");
    doc.rect(100, 20, 10, 10, "F");

    // Filled red square with black borders
    doc.setDrawColor("#000000");
    doc.setFillColor("#ff0000");
    doc.rect(120, 20, 10, 10, "FD");

    // Black square with rounded corners
    doc.setDrawColor("#000000");
    doc.setFillColor("#ffffff");
    doc.roundedRect(140, 20, 10, 10, 3, 3, "FD");

    comparePdf(doc.output(), "rectangles.pdf", "shapes");
  });

  it("should draw rectangles (colors directly passed by colorNames)", () => {
    const doc = jsPDF({ floatPrecision: 2 });

    // Empty square
    doc.rect(20, 20, 10, 10);

    // Filled square
    doc.rect(40, 20, 10, 10, "F");

    // Empty red square
    doc.setDrawColor("red");
    doc.rect(60, 20, 10, 10);

    // Filled square with red borders
    doc.setDrawColor("red");
    doc.rect(80, 20, 10, 10, "FD");

    // Filled red square
    doc.setDrawColor("black");
    doc.setFillColor("red");
    doc.rect(100, 20, 10, 10, "F");

    // Filled red square with black borders
    doc.setDrawColor("black");
    doc.setFillColor("red");
    doc.rect(120, 20, 10, 10, "FD");

    // Black square with rounded corners
    doc.setDrawColor("black");
    doc.setFillColor("white");
    doc.roundedRect(140, 20, 10, 10, 3, 3, "FD");

    comparePdf(doc.output(), "rectangles.pdf", "shapes");
  });

  it("should draw a line", () => {
    const doc = jsPDF({ floatPrecision: 3 });

    // horizontal line
    doc.line(20, 20, 60, 20);
    comparePdf(doc.output(), "line.pdf", "shapes");
  });

  it("should draw lines", () => {
    const doc = jsPDF({ floatPrecision: 3 });

    // horizontal line
    doc.line(20, 20, 60, 20);

    doc.setLineWidth(0.5);
    doc.line(20, 25, 60, 25);

    doc.setLineWidth(1);
    doc.line(20, 30, 60, 30);

    doc.setLineWidth(1.5);
    doc.line(20, 35, 60, 35);

    // draw red lines
    doc.setDrawColor(255, 0, 0);

    doc.setLineWidth(0.1);

    // vertical line
    doc.line(100, 20, 100, 60);

    doc.setLineWidth(0.5);
    doc.line(105, 20, 105, 60);

    doc.setLineWidth(1);
    doc.line(110, 20, 110, 60);

    doc.setLineWidth(1.5);
    doc.line(115, 20, 115, 60);

    comparePdf(doc.output(), "lines.pdf", "shapes");
  });

  it("should use grey color mode", () => {
    const doc = jsPDF({ floatPrecision: 2 });
    doc.setFillColor(22);
    doc.rect(20, 20, 10, 10, "F");

    comparePdf(doc.output(), "fill-color.pdf", "shapes");
  });
});
