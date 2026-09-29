/* global describe, it, jsPDF, expect */

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

  it("ignores an orientation value outside 1-8", function() {
    var plain = newDoc();
    var invalid = newDoc();
    plain.addImage(jpegWithOrientation(null, 20, 10), "JPEG", 10, 20, 30, 40);
    invalid.addImage(jpegWithOrientation(9, 20, 10), "JPEG", 10, 20, 30, 40);

    expect(placementLines(invalid.output())).toEqual(
      placementLines(plain.output())
    );
  });
});
