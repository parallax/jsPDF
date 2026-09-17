import { BmpDecoder } from "../../src/libs/BMPDecoder.js";

describe("Lib: BMPDecoder", () => {
  function u32(value) {
    return [
      value & 255,
      (value >> 8) & 255,
      (value >> 16) & 255,
      (value >> 24) & 255
    ];
  }

  function u16(value) {
    return [value & 255, (value >> 8) & 255];
  }

  // Minimal 2x2 24-bit bottom-up BMP:
  //   top row:    red   (255,0,0), green (0,255,0)
  //   bottom row: blue  (0,0,255), white (255,255,255)
  function create2x2Bmp24() {
    return new Uint8Array(
      [].concat(
        [0x42, 0x4d], // "BM"
        u32(70), // file size
        u32(0), // reserved
        u32(54), // pixel data offset
        u32(40), // DIB header size
        u32(2), // width
        u32(2), // height (positive: bottom-up)
        u16(1), // planes
        u16(24), // bits per pixel
        u32(0), // compression
        u32(16), // raw size
        u32(2835), // horizontal resolution
        u32(2835), // vertical resolution
        u32(0), // colors
        u32(0), // important colors
        // bottom row (stored first): blue, white as BGR + 2 bytes row padding
        [0xff, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00],
        // top row: red, green as BGR + 2 bytes row padding
        [0x00, 0x00, 0xff, 0x00, 0xff, 0x00, 0x00, 0x00]
      )
    );
  }

  it("throws 'Invalid BMP File' for wrong magic bytes", () => {
    expect(function() {
      new BmpDecoder(new Uint8Array([0x00, 0x01, 0x02, 0x03]), false);
    }).toThrowError("Invalid BMP File");
  });

  it("parses the header of a 2x2 24-bit BMP", () => {
    var decoder = new BmpDecoder(create2x2Bmp24(), false);

    expect(decoder.flag).toBe("BM");
    expect(decoder.width).toBe(2);
    expect(decoder.height).toBe(2);
    expect(decoder.bitPP).toBe(24);
    expect(decoder.bottom_up).toBe(true);
  });

  it("decodes a 2x2 24-bit BMP to top-down RGBA pixel data", () => {
    var decoder = new BmpDecoder(create2x2Bmp24(), false);
    var data = decoder.getData();

    expect(data instanceof Uint8Array).toBe(true);
    expect(data.length).toBe(2 * 2 * 4);
    expect(Array.from(data)).toEqual([
      // top row: red, green
      255,
      0,
      0,
      255,
      0,
      255,
      0,
      255,
      // bottom row: blue, white
      0,
      0,
      255,
      255,
      255,
      255,
      255,
      255
    ]);
  });

  it("decodes a top-down BMP (negative height) to the same pixel data", () => {
    var bytes = create2x2Bmp24();
    var view = new DataView(bytes.buffer);
    view.setInt32(22, -2, true); // negative height marks a top-down BMP
    // rows are now stored top-first: red/green first, then blue/white
    bytes.set(
      [
        0x00,
        0x00,
        0xff,
        0x00,
        0xff,
        0x00,
        0x00,
        0x00,
        0xff,
        0x00,
        0x00,
        0xff,
        0xff,
        0xff,
        0x00,
        0x00
      ],
      54
    );
    var decoder = new BmpDecoder(bytes, false);

    expect(decoder.height).toBe(2);
    expect(decoder.bottom_up).toBe(false);
    expect(Array.from(decoder.getData())).toEqual([
      255,
      0,
      0,
      255,
      0,
      255,
      0,
      255,
      0,
      0,
      255,
      255,
      255,
      255,
      255,
      255
    ]);
  });

  it("getData returns the decoded data property", () => {
    var decoder = new BmpDecoder(create2x2Bmp24(), false);

    expect(decoder.getData()).toBe(decoder.data);
  });
});
