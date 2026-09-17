import { WebPDecoder } from "../../src/libs/WebPDecoder.js";

describe("Lib: WebPDecoder", () => {
  // 1x1 white lossy (VP8) WebP image.
  var oneByOneWhiteWebP =
    "UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=";

  function base64ToUint8Array(base64) {
    var binary = atob(base64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  it("throws for data that is not a RIFF/WebP container", () => {
    expect(function() {
      new WebPDecoder(new Uint8Array([0x01, 0x02, 0x03, 0x04]), false);
    }).toThrow();
  });

  it("decodes the dimensions of a 1x1 lossy WebP", () => {
    var decoder = new WebPDecoder(base64ToUint8Array(oneByOneWhiteWebP), false);

    // width and height are reported as single-element arrays
    expect(decoder.width[0]).toBe(1);
    expect(decoder.height[0]).toBe(1);
  });

  it("decodes a 1x1 white WebP to opaque white RGBA pixel data", () => {
    var decoder = new WebPDecoder(base64ToUint8Array(oneByOneWhiteWebP), false);
    var pixels = decoder.getData();

    expect(pixels.length).toBe(1 * 1 * 4);
    expect(pixels[0]).toBe(255);
    expect(pixels[1]).toBe(255);
    expect(pixels[2]).toBe(255);
    expect(pixels[3]).toBe(255);
  });

  it("getData returns the decoded data property", () => {
    var decoder = new WebPDecoder(base64ToUint8Array(oneByOneWhiteWebP), false);

    expect(decoder.getData()).toBe(decoder.data);
  });
});
