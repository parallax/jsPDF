/* global describe, it, jsPDF, comparePdf */

describe("Module: xmp_metadata", () => {
  beforeAll(loadGlobals);
  it("make some metadata var. 1", () => {
    var doc = new jsPDF({ putOnlyUsedFonts: true, floatPrecision: 2 });
    doc.addMetadata("My metadata as a string.", "http://my.namespace.uri/");
    comparePdf(doc.output(), "xmpmetadata.pdf");
  });
  it("make some metadata var. 2", () => {
    var doc = new jsPDF({ putOnlyUsedFonts: true, floatPrecision: 2 });
    doc.addMetadata("My metadata as a string.");
    comparePdf(doc.output(), "xmpmetadata-defaultNS.pdf");
  });
});
