/* global describe, it, jsPDF, loadBinaryResource, comparePdf */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe("TTFSupport", () => {
  beforeAll(loadGlobals);
  it("should parse directly the file", () => {
    var doc = new jsPDF({
      filters: ["ASCIIHexEncode"],
      putOnlyUsedFonts: true,
      floatPrecision: 2
    });
    var PTSans;
    if (typeof global === "object" && global.isNode === true) {
      doc.allowFsRead = ["./test/reference/PTSans.ttf"];
      PTSans = doc.loadFile("./test/reference/PTSans.ttf");
    } else {
      PTSans = doc.loadFile("base/test/reference/PTSans.ttf");
    }
    doc.addFileToVFS("PTSans.ttf", PTSans);
    doc.addFont("PTSans.ttf", "PTSans", "normal");

    doc.setFont("PTSans"); // set font
    doc.setFontSize(10);
    doc.text("А ну чики брики и в дамки!", 10, 10);
    comparePdf(doc.output(), "russian-1line.pdf", "unicode");
  });

  it("should parse directly the file var 2", () => {
    var doc = new jsPDF({
      filters: ["ASCIIHexEncode"],
      putOnlyUsedFonts: true,
      floatPrecision: 2
    });

    if (typeof global === "object" && global.isNode === true) {
      doc.allowFsRead = ["./test/reference/PTSans.ttf"];
      doc.addFont("./test/reference/PTSans.ttf", "PTSans", "normal");
    } else {
      doc.addFont("base/test/reference/PTSans.ttf", "PTSans", "normal");
    }
    doc.setFont("PTSans"); // set font
    doc.setFontSize(10);
    doc.text("А ну чики брики и в дамки!", 10, 10);
    comparePdf(doc.output(), "russian-1line.pdf", "unicode");
  });

  describe("embedded font dictionaries", () => {
    function robotoDoc() {
      var doc = new jsPDF({ putOnlyUsedFonts: true });
      var faces = [
        ["Roboto-Regular.ttf", "normal"],
        ["Roboto-Bold.ttf", "bold"],
        ["Roboto-Italic.ttf", "italic"]
      ];
      faces.forEach(function(face) {
        var path = "test/reference/fonts/Roboto/" + face[0];
        if (typeof global === "object" && global.isNode === true) {
          doc.allowFsRead = ["./" + path];
          doc.addFont("./" + path, "Roboto", face[1]);
        } else {
          doc.addFont("base/" + path, "Roboto", face[1]);
        }
        doc.setFont("Roboto", face[1]);
        doc.text("Roboto " + face[1], 10, 10 + 10 * faces.indexOf(face));
      });
      return doc.output();
    }

    function dictionaries(pdf, marker) {
      return pdf
        .split("endobj")
        .filter(object => object.indexOf(marker) !== -1);
    }

    function value(dictionary, key) {
      var match = dictionary.match(new RegExp("/" + key + " /?([^\\s/>]+)"));
      return match && match[1];
    }

    it("declares the Adobe-Identity character collection", () => {
      var cidFonts = dictionaries(robotoDoc(), "/CIDFontType2");
      expect(cidFonts.length).toBe(3);
      cidFonts.forEach(font => {
        expect(font).toContain("/Registry (Adobe)");
        expect(font).toContain("/Ordering (Identity)");
      });
    });

    it("names each face by its subset-tagged PostScript name", () => {
      var names = dictionaries(robotoDoc(), "/CIDFontType2").map(font =>
        value(font, "BaseFont")
      );
      names.forEach(name => expect(name).toMatch(/^[A-Z]{6}\+Roboto-/));
      expect(names.map(name => name.slice(7)).sort()).toEqual([
        "Roboto-Bold",
        "Roboto-Italic",
        "Roboto-Regular"
      ]);
    });

    it("writes font descriptor metrics in glyph space", () => {
      var descriptors = dictionaries(robotoDoc(), "/Type /FontDescriptor");
      expect(descriptors.length).toBe(3);
      descriptors.forEach(descriptor => {
        var name = value(descriptor, "FontName");
        var italic = /Italic$/.test(name);
        expect(+value(descriptor, "CapHeight")).toBe(711);
        expect(+value(descriptor, "CapHeight")).toBeLessThan(
          +value(descriptor, "Ascent")
        );
        expect(+value(descriptor, "StemV")).toBe(/Bold$/.test(name) ? 166 : 88);
        expect(+value(descriptor, "ItalicAngle")).toBe(italic ? -12 : 0);
        expect((+value(descriptor, "Flags") & 64) !== 0).toBe(italic);
      });
    });
  });
});
