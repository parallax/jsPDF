import { JPEGEncoder } from "../../../src/libs/JPEGEncoder.js";

interface RGBAImageData {
  width: number;
  height: number;
  data: Uint8Array;
}

describe("Lib: JPEGEncoder", () => {
  function createImageData(
    width: number,
    height: number,
    rgba: number[]
  ): RGBAImageData {
    var data = new Uint8Array(width * height * 4);
    for (var i = 0; i < width * height; i++) {
      data[i * 4] = rgba[0];
      data[i * 4 + 1] = rgba[1];
      data[i * 4 + 2] = rgba[2];
      data[i * 4 + 3] = rgba[3];
    }
    return { width: width, height: height, data: data };
  }

  it("encodes an 8x8 red image to a Uint8Array", () => {
    var encoder = new JPEGEncoder(80);
    var result = encoder.encode(createImageData(8, 8, [255, 0, 0, 255]));

    expect(result instanceof Uint8Array).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("output starts with the JPEG SOI marker (0xFFD8)", () => {
    var encoder = new JPEGEncoder(80);
    var result = encoder.encode(createImageData(8, 8, [255, 0, 0, 255]));

    expect(result[0]).toBe(0xff);
    expect(result[1]).toBe(0xd8);
  });

  it("output ends with the JPEG EOI marker (0xFFD9)", () => {
    var encoder = new JPEGEncoder(80);
    var result = encoder.encode(createImageData(8, 8, [255, 0, 0, 255]));

    expect(result[result.length - 2]).toBe(0xff);
    expect(result[result.length - 1]).toBe(0xd9);
  });

  it("is deterministic for fixed input and quality", () => {
    var imageData = createImageData(8, 8, [12, 128, 240, 255]);
    var first = new JPEGEncoder(80).encode(imageData);
    var second = new JPEGEncoder(80).encode(imageData);

    expect(first.length).toBe(second.length);
    expect(Array.from(first)).toEqual(Array.from(second));
  });

  it("produces different output for different qualities", () => {
    var imageData = createImageData(8, 8, [255, 0, 0, 255]);
    var high = new JPEGEncoder(80).encode(imageData);
    var low = new JPEGEncoder(10).encode(imageData);

    expect(Array.from(high)).not.toEqual(Array.from(low));
  });

  it("defaults to quality 50 when constructed without arguments", () => {
    var imageData = createImageData(8, 8, [255, 0, 0, 255]);
    var implicit = new JPEGEncoder().encode(imageData);
    var explicit = new JPEGEncoder(50).encode(imageData);

    expect(Array.from(implicit)).toEqual(Array.from(explicit));
  });

  it("encodes image dimensions that are not multiples of 8", () => {
    var encoder = new JPEGEncoder(75);
    var result = encoder.encode(createImageData(3, 5, [0, 255, 0, 255]));

    expect(result[0]).toBe(0xff);
    expect(result[1]).toBe(0xd8);
    expect(result[result.length - 2]).toBe(0xff);
    expect(result[result.length - 1]).toBe(0xd9);
  });

  it("writes the image dimensions into the SOF0 segment", () => {
    var width = 6;
    var height = 4;
    var result = new JPEGEncoder(80).encode(
      createImageData(width, height, [10, 20, 30, 255])
    );

    // Find the SOF0 marker (0xFFC0); height and width follow as
    // big-endian words after the marker, segment length and precision.
    var sofOffset = -1;
    for (var i = 0; i < result.length - 1; i++) {
      if (result[i] === 0xff && result[i + 1] === 0xc0) {
        sofOffset = i;
        break;
      }
    }
    expect(sofOffset).not.toBe(-1);
    var encodedHeight = (result[sofOffset + 5] << 8) | result[sofOffset + 6];
    var encodedWidth = (result[sofOffset + 7] << 8) | result[sofOffset + 8];
    expect(encodedHeight).toBe(height);
    expect(encodedWidth).toBe(width);
  });
});
