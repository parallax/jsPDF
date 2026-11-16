/* global describe, it jsPDF, expect */
describe("Module: Context2D autoPaging", () => {
  beforeAll(loadGlobals);
  it("context2d autoPaging: rect", () => {
    var doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
      floatPrecision: 3
    });
    var ctx = doc.context2d;
    doc.context2d.autoPaging = true;

    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    ctx.strokeStyle = "#FF0000";
    ctx.strokeRect(20, 20, 150, 3000);
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(180, 20, 150, 3000);

    expect(writeArray).toEqual([
      "1. 0. 0. RG",
      "0.2 w",
      "1. 0. 0. RG",
      "0. 0. 0. rg",
      "1. 0. 0. RG",
      "0 J",
      "1. w",
      "0 j",
      "1. w",
      "1. 0. 0. RG",
      "0. 0. 0. rg",
      "1. 0. 0. RG",
      "0 J",
      "1. w",
      "0 j",
      "1. w",
      "1. 0. 0. RG",
      "0. 0. 0. rg",
      "1. 0. 0. RG",
      "0 J",
      "1. w",
      "0 j",
      "0. 0. 0. rg",
      "1. 0. 0. RG",
      "0 J",
      "1. w",
      "0 j",
      "20. 821.89 m",
      "170. 821.89 l",
      "170. -2178.11 l",
      "20. -2178.11 l",
      "h",
      "20. 821.89 m",
      "S",
      "1. w",
      "0. 0. 0. rg",
      "1. 0. 0. RG",
      "0 J",
      "1. w",
      "0 j",
      "20. 1663.78 m",
      "170. 1663.78 l",
      "170. -1336.22 l",
      "20. -1336.22 l",
      "h",
      "20. 1663.78 m",
      "S",
      "1. w",
      "0. 0. 0. rg",
      "1. 0. 0. RG",
      "0 J",
      "1. w",
      "0 j",
      "20. 2505.67 m",
      "170. 2505.67 l",
      "170. -494.33 l",
      "20. -494.33 l",
      "h",
      "20. 2505.67 m",
      "S",
      "1. w",
      "0. 0. 0. rg",
      "1. 0. 0. RG",
      "0 J",
      "1. w",
      "0 j",
      "20. 3347.56 m",
      "170. 3347.56 l",
      "170. 347.56 l",
      "20. 347.56 l",
      "h",
      "20. 3347.56 m",
      "S",
      "1. w",
      "0. G",
      "0. 0. 0. rg",
      "0. G",
      "0 J",
      "1. w",
      "0 j",
      "180. 821.89 m",
      "330. 821.89 l",
      "330. -2178.11 l",
      "180. -2178.11 l",
      "h",
      "180. 821.89 m",
      "S",
      "1. w",
      "0. 0. 0. rg",
      "0. G",
      "0 J",
      "1. w",
      "0 j",
      "180. 1663.78 m",
      "330. 1663.78 l",
      "330. -1336.22 l",
      "180. -1336.22 l",
      "h",
      "180. 1663.78 m",
      "S",
      "1. w",
      "0. 0. 0. rg",
      "0. G",
      "0 J",
      "1. w",
      "0 j",
      "180. 2505.67 m",
      "330. 2505.67 l",
      "330. -494.33 l",
      "180. -494.33 l",
      "h",
      "180. 2505.67 m",
      "S",
      "1. w",
      "0. 0. 0. rg",
      "0. G",
      "0 J",
      "1. w",
      "0 j",
      "180. 3347.56 m",
      "330. 3347.56 l",
      "330. 347.56 l",
      "180. 347.56 l",
      "h",
      "180. 3347.56 m",
      "S",
      "1. w"
    ]);
  });

  it("context2d autoPaging: text", () => {
    var doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
      floatPrecision: 2
    });
    var ctx = doc.context2d;
    doc.context2d.autoPaging = true;

    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    ctx.fillText("test", 0, 1000);

    expect(writeArray).toEqual([
      "0.2 w",
      "0 G",
      "0. 0. 0. rg",
      "0. G",
      "0 J",
      "1. w",
      "0 j",
      "1. w",
      "BT\n/F1 10 Tf\n11.5 TL\n0. 0. 0. rg\n0. 683.78 Td\n(test) Tj\nET",
      "1. w"
    ]);
  });
});

describe("Module: Context2D rect path", () => {
  beforeAll(loadGlobals);
  it("context2d rect: adds one closed subpath with four corners", () => {
    var doc = new jsPDF({ unit: "pt", format: "a4", floatPrecision: 3 });
    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    var ctx = doc.context2d;
    ctx.beginPath();
    ctx.rect(10, 10, 50, 20);
    ctx.stroke();
    var path = writeArray.filter(function(line) {
      return /( m| l| c)$|^[hSf]$/.test(line);
    });
    expect(path).toEqual([
      "10. 831.89 m",
      "60. 831.89 l",
      "60. 811.89 l",
      "10. 811.89 l",
      "h",
      "10. 831.89 m",
      "S"
    ]);
  });
  it("context2d rect: a following lineTo starts at the rectangle origin", () => {
    var doc = new jsPDF({ unit: "pt", format: "a4", floatPrecision: 3 });
    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    var ctx = doc.context2d;
    ctx.beginPath();
    ctx.rect(10, 10, 50, 20);
    ctx.lineTo(100, 100);
    ctx.stroke();
    expect(writeArray).toContain("100. 741.89 l");
  });
});
