import { GifReader, GifWriter } from "../../src/libs/omggif.js";

describe("Lib: omggif", () => {
  // Minimal 2x2 GIF89a with a two-color global palette (red, green) and
  // indexed pixels [0, 1, 1, 0]:
  //   top row:    red,   green
  //   bottom row: green, red
  // prettier-ignore
  var minimalGif = new Uint8Array([
    71, 73, 70, 56, 57, 97, // "GIF89a"
    2, 0, 2, 0, // logical screen 2x2
    128, 0, 0, // global palette of 2 colors
    255, 0, 0, // palette[0]: red
    0, 255, 0, // palette[1]: green
    44, 0, 0, 0, 0, 2, 0, 2, 0, 0, // image descriptor
    2, 3, 68, 2, 5, 0, // LZW min code size + data sub-blocks
    59 // trailer
  ]);

  describe("GifReader", () => {
    it("throws for an invalid header", () => {
      expect(function() {
        new GifReader(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));
      }).toThrowError("Invalid GIF 87a/89a header.");
    });

    it("parses width, height and frame count of a 2x2 GIF", () => {
      var reader = new GifReader(minimalGif);

      expect(reader.width).toBe(2);
      expect(reader.height).toBe(2);
      expect(reader.numFrames()).toBe(1);
    });

    it("reports frame info", () => {
      var reader = new GifReader(minimalGif);
      var info = reader.frameInfo(0);

      expect(info.x).toBe(0);
      expect(info.y).toBe(0);
      expect(info.width).toBe(2);
      expect(info.height).toBe(2);
      expect(info.has_local_palette).toBe(false);
      expect(info.interlaced).toBe(false);
      expect(info.transparent_index).toBe(null);
    });

    it("throws for an out of range frame index", () => {
      var reader = new GifReader(minimalGif);

      expect(function() {
        reader.frameInfo(1);
      }).toThrowError("Frame index out of range.");
      expect(function() {
        reader.frameInfo(-1);
      }).toThrowError("Frame index out of range.");
    });

    it("decodes RGBA pixel data", () => {
      var reader = new GifReader(minimalGif);
      var pixels = new Uint8Array(2 * 2 * 4);
      reader.decodeAndBlitFrameRGBA(0, pixels);

      expect(Array.from(pixels)).toEqual([
        // top row: red, green
        255,
        0,
        0,
        255,
        0,
        255,
        0,
        255,
        // bottom row: green, red
        0,
        255,
        0,
        255,
        255,
        0,
        0,
        255
      ]);
    });

    it("decodes BGRA pixel data", () => {
      var reader = new GifReader(minimalGif);
      var pixels = new Uint8Array(2 * 2 * 4);
      reader.decodeAndBlitFrameBGRA(0, pixels);

      expect(Array.from(pixels)).toEqual([
        0,
        0,
        255,
        255,
        0,
        255,
        0,
        255,
        0,
        255,
        0,
        255,
        0,
        0,
        255,
        255
      ]);
    });
  });

  describe("GifWriter", () => {
    it("throws for a palette size that is not a power of two", () => {
      expect(function() {
        new GifWriter(new Uint8Array(64), 2, 2, {
          palette: [0xff0000, 0x00ff00, 0x0000ff]
        });
      }).toThrowError(
        "Invalid code/color length, must be power of 2 and 2 .. 256."
      );
    });

    it("throws for invalid dimensions", () => {
      expect(function() {
        new GifWriter(new Uint8Array(64), 0, 2, {});
      }).toThrowError("Width/Height invalid.");
      expect(function() {
        new GifWriter(new Uint8Array(64), 2, 65536, {});
      }).toThrowError("Width/Height invalid.");
    });

    it("throws when there are not enough pixels for the frame size", () => {
      var writer = new GifWriter(new Uint8Array(128), 2, 2, {});

      expect(function() {
        writer.addFrame(0, 0, 2, 2, [0, 1, 1], {
          palette: [0xff0000, 0x00ff00]
        });
      }).toThrowError("Not enough pixels for the frame size.");
    });

    it("round-trips a 2x2 image through GifWriter and GifReader", () => {
      var buf = new Uint8Array(1024);
      var writer = new GifWriter(buf, 2, 2, {
        palette: [0xff0000, 0x00ff00]
      });
      writer.addFrame(0, 0, 2, 2, [0, 1, 1, 0], {});
      var gifBytes = buf.subarray(0, writer.end());

      expect(Array.from(gifBytes)).toEqual(Array.from(minimalGif));

      var reader = new GifReader(gifBytes);
      var pixels = new Uint8Array(2 * 2 * 4);
      reader.decodeAndBlitFrameRGBA(0, pixels);

      expect(reader.width).toBe(2);
      expect(reader.height).toBe(2);
      expect(Array.from(pixels)).toEqual([
        255,
        0,
        0,
        255,
        0,
        255,
        0,
        255,
        0,
        255,
        0,
        255,
        255,
        0,
        0,
        255
      ]);
    });
  });
});
