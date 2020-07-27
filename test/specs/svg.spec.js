/* global jsPDF, loadBinaryResource */
describe("Module: svg", function() {
  if (
    (typeof isNode !== "undefined" && isNode) ||
    navigator.userAgent.indexOf("Chrome") < 0
  ) {
    return;
  }
  beforeAll(loadGlobals);
  xit("addSvgAsImage loads canvg asynchronously", async () => {
    // gives different results in all browsers
    const doc = jsPDF({
      unit: "px",
      format: [900, 500],
      orientation: "l",
      floatPrecision: 2
    });
    const svg = loadBinaryResource("reference/piechart.svg");
    await doc.addSvgAsImage(svg, 0, 0, 815, 481);
    comparePdf(doc.output(), "addSvgAsImage.pdf", "svg");
  });
});
