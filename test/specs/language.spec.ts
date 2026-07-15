/* global describe, it, jsPDF, comparePdf */
/**
 * Standard spec tests
 */

describe("Module: SetLanguage", () => {
  beforeAll(loadGlobals);
  it("set english (US)", () => {
    const doc = new jsPDF({ floatPrecision: 2 });
    doc.setLanguage("en-US");

    comparePdf(doc.output(), "enUS.pdf", "setlanguage");
  });

  it("refuse non-existing-language", () => {
    const doc = new jsPDF({ floatPrecision: 2 });
    doc.setLanguage("zz");

    comparePdf(doc.output(), "blank.pdf", "text");
  });
});
