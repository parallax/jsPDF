/* global describe, it, expect, comparePdf jsPDF */

describe("Module: Cell", () => {
  beforeAll(loadGlobals);
  it("getTextDimensions", () => {
    var doc = new jsPDF("p", "pt", "a4");
    expect(
      doc.getTextDimensions(doc.splitTextToSize("Octocat loves jsPDF", 50)).w
    ).toEqual(43.35999999999999);
    expect(
      doc.getTextDimensions(doc.splitTextToSize("Octocat loves jsPDF", 50)).h
    ).toEqual(71.19999999999999);
    expect(doc.getTextDimensions("Octocat loves jsPDF").w).toEqual(
      144.48000000000002
    );
    expect(doc.getTextDimensions("Octocat loves jsPDF").h).toEqual(16);
    expect(
      doc.getTextDimensions("Octocat loves jsPDF", { maxWidth: 150 }).w
    ).toEqual(144.48000000000002);
    expect(
      doc.getTextDimensions("Octocat loves jsPDF", { maxWidth: 150 }).h
    ).toEqual(16);
    expect(
      doc.getTextDimensions("Octocat loves jsPDF", { maxWidth: 100 }).h
    ).toEqual(34.4);
    expect(
      doc.getTextDimensions("Octocat loves jsPDF", { maxWidth: 100 }).w
    ).toEqual(96.64000000000001);
    expect(
      doc.getTextDimensions("Octocat loves jsPDF\njsPDF loves Octocat", { maxWidth: 100 }).h
    ).toEqual(71.19999999999999);
    expect(
      doc.getTextDimensions("Octocat loves jsPDF\njsPDF loves Octocat", { maxWidth: 100 }).w
    ).toEqual(96.64000000000001);
    expect(doc.getTextDimensions("").w).toEqual(0);
    expect(doc.getTextDimensions("").h).toEqual(0);
    expect(doc.getTextDimensions([""]).w).toEqual(0);
    expect(doc.getTextDimensions([""]).h).toEqual(0);
    expect(function() {
      doc.getTextDimensions();
    }).toThrow(
      new Error(
        "getTextDimensions expects text-parameter to be of type String or type Number or an Array of Strings."
      )
    );
  });

  var generateData = function(amount) {
    var result = [];
    var data = {
      coin: "100",
      game_group: "GameGroup",
      game_name: "XPTO2",
      game_version: "25",
      machine: "20485861",
      vlt: "0"
    };
    for (var i = 0; i < amount; i += 1) {
      result.push(data);
    }
    return result;
  };

  function createHeaders(keys) {
    return keys.map(key => ({
      name: key,
      prompt: key,
      width: 65,
      align: "center",
      padding: 0
    }));
  }

  var header = createHeaders([
    "coin",
    "game_group",
    "game_name",
    "game_version",
    "machine",
    "vlt"
  ]);

  it("table", () => {
    var doc = new jsPDF({
      putOnlyUsedFonts: true,
      orientation: "landscape",
      floatPrecision: 2
    });
    doc.table(1, 1, generateData(100), header);
    comparePdf(doc.output(), "table.pdf");
  });

  it("table-autoSize", () => {
    var doc = new jsPDF({
      putOnlyUsedFonts: true,
      orientation: "landscape",
      floatPrecision: 2
    });
    doc.table(1, 1, generateData(100), header, { autoSize: true });
    comparePdf(doc.output(), "table-autoSize.pdf");
  });

  it("table error handling", () => {
    var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape" });
    expect(function() {
      doc.table(1, 1, undefined, header, { autoSize: true });
    }).toThrow(new Error("No data for PDF table."));
    expect(function() {
      doc.printHeaderRow(1, false);
    }).toThrow(new Error("Property tableHeaderRow does not exist."));
  });
});
