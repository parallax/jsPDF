/* global jsPDF */
/**
 * Standard spec tests
 */

describe("Module: RGBASupport", () => {
  beforeAll(loadGlobals);
  it("black pixel", () => {
    var blackpixel = new Uint8ClampedArray([0, 0, 0, 255]);
    var blackpixelData = {
      data: blackpixel,
      width: 1,
      height: 1
    };

    const doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
      floatPrecision: 2
    });
    doc.addImage(blackpixelData, "RGBA", 15, 40, 1, 1);

    comparePdf(doc.output(), "blackpixel_rgba.pdf", "addimage");
  });

  it("without format", () => {
    var blackpixel = new Uint8ClampedArray([0, 0, 0, 255]);
    var blackpixelData = {
      data: blackpixel,
      width: 1,
      height: 1
    };

    const doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
      floatPrecision: 2
    });
    doc.addImage(blackpixelData, "RGBA", 15, 40, 1, 1);

    comparePdf(doc.output(), "blackpixel_rgba.pdf", "addimage");
  });

  if (
    (typeof isNode === "undefined" || !isNode) &&
    navigator.userAgent.indexOf("Chrome") >= 0
  ) {
    it("from canvas", () => {
      const c = document.createElement("canvas");
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#FF6600";
      ctx.fillRect(0, 0, 150, 75);
      const dataFromCanvas = ctx.getImageData(0, 0, 150, 75);
      const doc = new jsPDF({
        orientation: "p",
        unit: "pt",
        format: "a4",
        floatPrecision: 2
      });
      doc.addImage(
        dataFromCanvas,
        "RGBA",
        100,
        200,
        280,
        210,
        undefined,
        undefined
      );

      comparePdf(doc.output(), "rgba.pdf", "addimage");
    });

    it("with alpha", () => {
      const c = document.createElement("canvas");
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 150, 60);
      ctx.fillStyle = "#AA00FF77";
      ctx.fillRect(10, 10, 130, 40);
      const dataFromCanvas = ctx.getImageData(0, 0, 150, 60);

      const doc = new jsPDF({
        orientation: "p",
        unit: "px",
        format: "a4",
        floatPrecision: 2
      });
      doc.addImage(dataFromCanvas, 10, 10, 150, 60);

      comparePdf(doc.output(), "rgba_alpha.pdf", "addimage");
    });
  }
});
