/* global describe, it, expect, jsPDF, comparePdf */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe("Core: Standard Encryption", () => {
  beforeAll(loadGlobals);
  it("should allow text insertion", () => {
    const doc = jsPDF({ 
      floatPrecision: 2,
      encryption: {
        userPassword: "password"
      }
    });
    doc.__private__.setFileId("0000000000000000000000000BADFACE");
    doc.text(10, 10, "This is a test!");
    comparePdf(doc.output(), "encrypted_standard.pdf", "encryption");
  });
  it("should be printable", () => {
    const doc = jsPDF({ 
      floatPrecision: 2,
      encryption: {
        userPassword: "password",
        userPermissions: ["print"]
      }
    });
    doc.__private__.setFileId("0000000000000000000000000BADFACE");
    doc.text(10, 10, "This is a test!");
    comparePdf(doc.output(), "encrypted_printable.pdf", "encryption");
  });
  it("colortype_3_indexed_single_colour_alpha_4_bit_png", () => {
    var colortype_3_indexed_single_colour_alpha_4_bit_png =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAG1BMVEX/////AAD/pQD//wAA/wAAgAAAgIAAAP+BAIC08EFzAAAAAXRSTlMAQObYZgAAAJtJREFUCB0BkABv/wAREQAAAAAAAAAiIhEQAAAAAAAzMyIhEAAAAABERDMyIQAAAABVVUQzIhAAAABmZlVEMyEAAAB3d2ZVQzIQAACIh3dlVDIhAAAACId2VUMhAAAAAAiHZUMyEAAAAACHdlQyEAAAAAAIdlQyEAAAAAAId2VDIQAAAAAAh2VDIQAAAAAAh2VDIQAAAAAAh2VDIWfgFTHZzlYNAAAAAElFTkSuQmCC";
    var doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
      filters: ["ASCIIHexEncode"],
      floatPrecision: 2,
      encryption: {
        userPassword: "password"
      }
    });
    doc.__private__.setFileId("0000000000000000000000000BADFACE");
    doc.addImage(
      colortype_3_indexed_single_colour_alpha_4_bit_png,
      "PNG",
      100,
      200,
      280,
      210,
      undefined,
      undefined
    );
    comparePdf(
      doc.output(),
      "encrypted_withImage.pdf",
      "encryption"
    );
  });
});
