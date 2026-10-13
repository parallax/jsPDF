/* global describe, it, jsPDF, expect, loadBinaryResource */

describe("Module: JPEG EXIF orientation", function() {
  function u16be(value) {
    return String.fromCharCode((value >> 8) & 255, value & 255);
  }

  function exifApp1(orientation, littleEndian) {
    var tiff =
      (littleEndian ? "II" : "MM") +
      (littleEndian ? "\x2a\x00" : "\x00\x2a") +
      (littleEndian ? "\x08\x00\x00\x00" : "\x00\x00\x00\x08") +
      (littleEndian ? "\x01\x00" : "\x00\x01") +
      (littleEndian ? "\x12\x01" : "\x01\x12") +
      (littleEndian ? "\x03\x00" : "\x00\x03") +
      (littleEndian ? "\x01\x00\x00\x00" : "\x00\x00\x00\x01") +
      (littleEndian
        ? String.fromCharCode(orientation & 255, 0, 0, 0)
        : String.fromCharCode(0, orientation & 255, 0, 0)) +
      "\x00\x00\x00\x00";
    var payload = "Exif\x00\x00" + tiff;
    return "\xff\xe1" + u16be(payload.length + 2) + payload;
  }

  function jfifApp0() {
    var payload = "JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00";
    return "\xff\xe0" + u16be(payload.length + 2) + payload;
  }

  function sof0(width, height) {
    var body = "\x08" + u16be(height) + u16be(width) + "\x01\x01\x11\x00";
    return "\xff\xc0" + u16be(body.length + 2) + body;
  }

  function jpegWithOrientation(orientation, width, height, littleEndian) {
    var app =
      orientation == null
        ? jfifApp0()
        : exifApp1(orientation, littleEndian !== false);
    return "\xff\xd8" + app + sof0(width, height) + "\xff\xd9";
  }

  function xmpThenExif(orientation, width, height) {
    var xmp = "http://ns.adobe.com/xap/1.0/\x00<x:xmpmeta/>";
    var app = "\xff\xe1" + u16be(xmp.length + 2) + xmp;
    return (
      "\xff\xd8" +
      app +
      exifApp1(orientation, true) +
      sof0(width, height) +
      "\xff\xd9"
    );
  }

  function newDoc() {
    return new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
      floatPrecision: 2
    });
  }

  function validJpegWithOrientation(orientation, littleEndian) {
    var binary = loadBinaryResource("reference/jpeg-exif-corners.jpg", true);
    if (orientation == null) {
      return binary;
    }
    return (
      binary.slice(0, 2) +
      exifApp1(orientation, littleEndian !== false) +
      binary.slice(2)
    );
  }

  function placementLines(pdf) {
    var lines = pdf.split("\n");
    var doIndex = -1;
    var i;
    for (i = 0; i < lines.length; i += 1) {
      if (lines[i].indexOf(" Do") !== -1) {
        doIndex = i;
      }
    }
    var matrices = [];
    for (i = doIndex - 1; i >= 0; i -= 1) {
      if (lines[i] === "q") {
        break;
      }
      if (lines[i].slice(-3) === " cm") {
        matrices.unshift(lines[i]);
      }
    }
    return matrices;
  }

  function cmNumbers(line) {
    return line
      .replace(/ cm$/, "")
      .split(" ")
      .map(function(part) {
        return Number(part);
      });
  }

  // TIFF tag 0x0112, with the JPEG's first sample row at the top of the unit square.
  function expectedExifMatrix(orientation, width, height) {
    switch (orientation) {
      case 2:
        return [-width, 0, 0, height, width, 0];
      case 3:
        return [-width, 0, 0, -height, width, height];
      case 4:
        return [width, 0, 0, -height, 0, height];
      case 5:
        return [0, -height, -width, 0, width, height];
      case 6:
        return [0, -height, width, 0, 0, height];
      case 7:
        return [0, height, width, 0, 0, 0];
      case 8:
        return [0, height, -width, 0, width, 0];
      default:
        return null;
    }
  }

  beforeAll(loadGlobals);

  it("leaves a JPEG without an orientation tag unrotated", function() {
    var plain = newDoc();
    var upright = newDoc();
    plain.addImage(jpegWithOrientation(null, 20, 10), "JPEG", 10, 20, 30, 40);
    upright.addImage(jpegWithOrientation(1, 20, 10), "JPEG", 10, 20, 30, 40);

    expect(placementLines(plain.output())).toEqual(
      placementLines(upright.output())
    );
    expect(placementLines(plain.output()).length).toBe(1);
  });

  it("maps orientations 2-8 into the caller rectangle", function() {
    var orientation;
    for (orientation = 2; orientation <= 8; orientation += 1) {
      var doc = newDoc();
      doc.addImage(
        jpegWithOrientation(orientation, 20, 10),
        "JPEG",
        10,
        20,
        30,
        40
      );
      var lines = placementLines(doc.output());
      var plain = newDoc();
      plain.addImage(jpegWithOrientation(null, 20, 10), "JPEG", 10, 20, 30, 40);
      var base = cmNumbers(placementLines(plain.output())[0]);

      expect(lines.length).toBe(2);
      expect(cmNumbers(lines[0])).toEqual([1, 0, 0, 1, base[4], base[5]]);
      expect(cmNumbers(lines[1])).toEqual(
        expectedExifMatrix(orientation, 30, 40)
      );
      expect(doc.output()).toContain("/Width 20");
      expect(doc.output()).toContain("/Height 10");
    }
  });

  it("reads a big-endian orientation tag", function() {
    var little = newDoc();
    var big = newDoc();
    little.addImage(
      jpegWithOrientation(6, 20, 10, true),
      "JPEG",
      10,
      20,
      30,
      40
    );
    big.addImage(jpegWithOrientation(6, 20, 10, false), "JPEG", 10, 20, 30, 40);

    expect(placementLines(big.output())).toEqual(
      placementLines(little.output())
    );
  });

  it("reads Exif after an XMP APP1 segment", function() {
    var binary = xmpThenExif(6, 20, 10);
    var bytes = new Uint8Array(binary.length);
    var i;
    for (i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    var doc = newDoc();
    doc.addImage(bytes, "JPEG", 10, 20, 30, 40);
    var lines = placementLines(doc.output());

    expect(cmNumbers(lines[1])).toEqual(expectedExifMatrix(6, 30, 40));
  });

  it("keeps an explicit rotation instead of also applying Exif", function() {
    var doc = newDoc();
    doc.addImage(
      jpegWithOrientation(6, 20, 10),
      "JPEG",
      10,
      20,
      30,
      40,
      undefined,
      undefined,
      90
    );
    var lines = placementLines(doc.output());

    expect(lines.length).toBe(3);
    expect(lines[1]).toBe("0.0000 1.0000 -1.0000 0.0000 0 0 cm");
  });

  it("uses the oriented pixel size when one side is derived", function() {
    var doc = newDoc();
    doc.addImage(jpegWithOrientation(6, 20, 10), "JPEG", 10, 20, 20, 0);
    var lines = placementLines(doc.output());

    expect(cmNumbers(lines[1])).toEqual(expectedExifMatrix(6, 20, 40));
  });

  it("accepts the same JPEG as a byte array", function() {
    var binary = jpegWithOrientation(8, 8, 4);
    var bytes = new Uint8Array(binary.length);
    var i;
    for (i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    var fromString = newDoc();
    var fromBytes = newDoc();
    fromString.addImage(binary, "JPEG", 10, 20, 4, 8);
    fromBytes.addImage(bytes, "JPEG", 10, 20, 4, 8);

    expect(placementLines(fromBytes.output())).toEqual(
      placementLines(fromString.output())
    );
    expect(cmNumbers(placementLines(fromBytes.output())[1])).toEqual(
      expectedExifMatrix(8, 4, 8)
    );
  });

  [
    { name: "automatic dimensions", width: undefined, height: undefined },
    { name: "96 DPI dimensions", width: -96, height: -96 },
    { name: "derived height", width: 20, height: 0 },
    { name: "derived width", width: 0, height: 20 }
  ].forEach(function(size) {
    it(
      "keeps raw pixel dimensions with explicit rotation and " + size.name,
      function() {
        [90, 270, -90, 45, 450].forEach(function(rotation) {
          for (var orientation = 1; orientation <= 8; orientation += 1) {
            var plain = newDoc();
            var tagged = newDoc();
            [plain, tagged].forEach(function(doc, index) {
              doc.addImage(
                validJpegWithOrientation(index === 0 ? null : orientation),
                "JPEG",
                10,
                20,
                size.width,
                size.height,
                undefined,
                undefined,
                rotation
              );
            });
            expect(placementLines(tagged.output())).toEqual(
              placementLines(plain.output())
            );
          }
        });
      }
    );
  });

  it("keeps zero rotation equivalent to omitted rotation with automatic size", function() {
    var omitted = newDoc();
    var zero = newDoc();
    omitted.addImage(validJpegWithOrientation(6), "JPEG", 10, 20);
    zero.addImage(
      validJpegWithOrientation(6),
      "JPEG",
      10,
      20,
      undefined,
      undefined,
      undefined,
      undefined,
      0
    );
    expect(placementLines(zero.output())).toEqual(
      placementLines(omitted.output())
    );
    expect(cmNumbers(placementLines(zero.output())[1])).toEqual(
      expectedExifMatrix(6, 7.5, 15)
    );
  });

  [
    { name: "BYTE type", type: 1, count: 1 },
    { name: "LONG type", type: 4, count: 1 },
    { name: "zero count", type: 3, count: 0 },
    { name: "multiple values", type: 3, count: 2 }
  ].forEach(function(tag) {
    it("ignores malformed orientation with " + tag.name, function() {
      [true, false].forEach(function(little) {
        var segment = exifApp1(6, little);
        var typeBytes = little
          ? String.fromCharCode(tag.type, 0)
          : String.fromCharCode(0, tag.type);
        var countBytes = little
          ? String.fromCharCode(tag.count, 0, 0, 0)
          : String.fromCharCode(0, 0, 0, tag.count);
        // APP1 header + Exif identifier + TIFF header + IFD entry count.
        var entry = 4 + 6 + 8 + 2;
        segment =
          segment.slice(0, entry + 2) +
          typeBytes +
          countBytes +
          segment.slice(entry + 8);
        var binary = validJpegWithOrientation(null);
        var malformed = binary.slice(0, 2) + segment + binary.slice(2);
        var doc = newDoc();
        var plain = newDoc();
        doc.addImage(malformed, "JPEG", 10, 20, 30, 40);
        plain.addImage(binary, "JPEG", 10, 20, 30, 40);
        expect(placementLines(doc.output())).toEqual(
          placementLines(plain.output())
        );
      });
    });
  });

  it("ignores an orientation value outside 1-8", function() {
    var plain = newDoc();
    var invalid = newDoc();
    plain.addImage(jpegWithOrientation(null, 20, 10), "JPEG", 10, 20, 30, 40);
    invalid.addImage(jpegWithOrientation(9, 20, 10), "JPEG", 10, 20, 30, 40);

    expect(placementLines(invalid.output())).toEqual(
      placementLines(plain.output())
    );
  });

  it("keeps every EXIF orientation inside the caller rectangle in advanced mode", function() {
    for (var orientation = 1; orientation <= 8; orientation += 1) {
      var doc = newDoc();
      doc.advancedAPI();
      doc.addImage(
        validJpegWithOrientation(orientation),
        "JPEG",
        10,
        20,
        30,
        40
      );
      var matrices = placementLines(doc.output()).map(cmNumbers);
      var points = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1]
      ].map(function(point) {
        return matrices
          .slice()
          .reverse()
          .reduce(function(p, m) {
            return [
              m[0] * p[0] + m[2] * p[1] + m[4],
              m[1] * p[0] + m[3] * p[1] + m[5]
            ];
          }, point);
      });
      var xs = points.map(function(point) {
        return point[0];
      });
      var ys = points.map(function(point) {
        return point[1];
      });
      expect(Math.min.apply(null, xs)).toBe(10);
      expect(Math.max.apply(null, xs)).toBe(40);
      expect(Math.min.apply(null, ys)).toBe(20);
      expect(Math.max.apply(null, ys)).toBe(60);
    }
  });
});
