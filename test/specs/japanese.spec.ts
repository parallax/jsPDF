/* global describe, it, jsPDF,loadBinaryResource, comparePdf */

describe("Module: Unicode: Japanese", function() {
  beforeAll(loadGlobals);
  it("Unicode: Japanese - Kana", function() {
    //https://www.freejapanesefont.com/mouhitsu-bold-font-download/

    var MouhitsuBold = loadBinaryResource("reference/MouhitsuBold.ttf");

    const doc = new jsPDF({ filters: ["ASCIIHexEncode"], floatPrecision: 2 });

    doc.addFileToVFS("MouhitsuBold.ttf", MouhitsuBold);
    doc.addFont("MouhitsuBold.ttf", "Mouhitsu", "bold");

    doc.setFont("Mouhitsu", "bold"); // set font
    doc.setFontSize(20);

    doc.text("なに", 20, 20);

    comparePdf(doc.output(), "japanese-kana-nani.pdf", "unicode");
  });
});
