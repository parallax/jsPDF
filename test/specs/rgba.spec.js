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
      const width = 150;
      const height = 60;
      const data = new Uint8ClampedArray(width * height * 4);
      for (let i = 0; i < data.length; i += 4) {
        // Color is constant
        data[i] = 0xAA;
        data[i+1] = 0x00;
        data[i+2] = 0xFF;
        
        // Vary the alpha channel to get a linear gradient effect
        // from the top left corner (fully transparent) to the bottom
        // right corner (fully opaque)
        const pixelIndex = i / 4;
        const row = Math.floor(pixelIndex / width)
        const col = pixelIndex - (row * width)
        data[i+3] = Math.round((row / height + col / width) * 255 / 2)
      }
      const imageData = new ImageData(data, width, height, {colorSpace: 'srgb', pixelFormat: 'rgba-unorm8'})

      const doc = new jsPDF({
        orientation: "p",
        unit: "px",
        format: "a4",
        floatPrecision: 2
      });
      doc.addImage(imageData, 10, 10, 150, 60);

      comparePdf(doc.output(), "rgba_alpha.pdf", "addimage");
    });

    it("rgba_compression_NONE", () => {
      const doc = new jsPDF({
        orientation: "p",
        unit: "px",
        format: "a4",
        floatPrecision: 2
      });

      // Create test data with semi-transparent pixels
      const rgbaData = new Uint8ClampedArray(150 * 60 * 4);
      for (let i = 0; i < rgbaData.length; i += 4) {
        rgbaData[i] = 255; // R
        rgbaData[i + 1] = 102; // G
        rgbaData[i + 2] = 0; // B
        rgbaData[i + 3] = 128; // A (semi-transparent)
      }

      doc.addImage(
        { data: rgbaData, width: 150, height: 60 },
        "RGBA",
        10,
        10,
        150,
        60,
        undefined,
        "NONE"
      );

      comparePdf(doc.output(), "rgba_compression_NONE.pdf", "addimage");
    });

    it("rgba_compression_FAST", () => {
      const doc = new jsPDF({
        orientation: "p",
        unit: "px",
        format: "a4",
        floatPrecision: 2
      });

      // Create test data with semi-transparent pixels
      const rgbaData = new Uint8ClampedArray(150 * 60 * 4);
      for (let i = 0; i < rgbaData.length; i += 4) {
        rgbaData[i] = 255; // R
        rgbaData[i + 1] = 102; // G
        rgbaData[i + 2] = 0; // B
        rgbaData[i + 3] = 128; // A (semi-transparent)
      }

      doc.addImage(
        { data: rgbaData, width: 150, height: 60 },
        "RGBA",
        10,
        10,
        150,
        60,
        undefined,
        "FAST"
      );

      comparePdf(doc.output(), "rgba_compression_FAST.pdf", "addimage");
    });

    it("rgba_compression_MEDIUM", () => {
      const doc = new jsPDF({
        orientation: "p",
        unit: "px",
        format: "a4",
        floatPrecision: 2
      });

      // Create test data with semi-transparent pixels
      const rgbaData = new Uint8ClampedArray(150 * 60 * 4);
      for (let i = 0; i < rgbaData.length; i += 4) {
        rgbaData[i] = 255; // R
        rgbaData[i + 1] = 102; // G
        rgbaData[i + 2] = 0; // B
        rgbaData[i + 3] = 128; // A (semi-transparent)
      }

      doc.addImage(
        { data: rgbaData, width: 150, height: 60 },
        "RGBA",
        10,
        10,
        150,
        60,
        undefined,
        "MEDIUM"
      );

      comparePdf(doc.output(), "rgba_compression_MEDIUM.pdf", "addimage");
    });

    it("rgba_compression_SLOW", () => {
      const doc = new jsPDF({
        orientation: "p",
        unit: "px",
        format: "a4",
        floatPrecision: 2
      });

      // Create test data with semi-transparent pixels
      const rgbaData = new Uint8ClampedArray(150 * 60 * 4);
      for (let i = 0; i < rgbaData.length; i += 4) {
        rgbaData[i] = 255; // R
        rgbaData[i + 1] = 102; // G
        rgbaData[i + 2] = 0; // B
        rgbaData[i + 3] = 128; // A (semi-transparent)
      }

      doc.addImage(
        { data: rgbaData, width: 150, height: 60 },
        "RGBA",
        10,
        10,
        150,
        60,
        undefined,
        "SLOW"
      );

      comparePdf(doc.output(), "rgba_compression_SLOW.pdf", "addimage");
    });
  }
});
