/* global describe, it jsPDF, expect */
describe("Module: Context2D autoPaging", () => {
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
      "0.2 w",
      "1. 0. 0. RG",
      "0. 0. 0. rg",
      "1. 0. 0. RG",
      "0 J",
      "1. w",
      "0 j",
      "0.2 w",
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
      "20. 821.89 l",
      "170. 821.89 l",
      "20. 821.89 l",
      "S",
      "0. 0. 0. rg",
      "1. 0. 0. RG",
      "0 J",
      "1. w",
      "0 j",
      "20. 1663.78 m",
      "170. 1663.78 l",
      "170. -1336.22 l",
      "20. -1336.22 l",
      "20. 1663.78 l",
      "170. 1663.78 l",
      "20. 1663.78 l",
      "S",
      "0. 0. 0. rg",
      "1. 0. 0. RG",
      "0 J",
      "1. w",
      "0 j",
      "20. 2505.67 m",
      "170. 2505.67 l",
      "170. -494.33 l",
      "20. -494.33 l",
      "20. 2505.67 l",
      "170. 2505.67 l",
      "20. 2505.67 l",
      "S",
      "0. 0. 0. rg",
      "1. 0. 0. RG",
      "0 J",
      "1. w",
      "0 j",
      "20. 3347.56 m",
      "170. 3347.56 l",
      "170. 347.56 l",
      "20. 347.56 l",
      "20. 3347.56 l",
      "170. 3347.56 l",
      "20. 3347.56 l",
      "S",
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
      "180. 821.89 l",
      "330. 821.89 l",
      "180. 821.89 l",
      "S",
      "0. 0. 0. rg",
      "0. G",
      "0 J",
      "1. w",
      "0 j",
      "180. 1663.78 m",
      "330. 1663.78 l",
      "330. -1336.22 l",
      "180. -1336.22 l",
      "180. 1663.78 l",
      "330. 1663.78 l",
      "180. 1663.78 l",
      "S",
      "0. 0. 0. rg",
      "0. G",
      "0 J",
      "1. w",
      "0 j",
      "180. 2505.67 m",
      "330. 2505.67 l",
      "330. -494.33 l",
      "180. -494.33 l",
      "180. 2505.67 l",
      "330. 2505.67 l",
      "180. 2505.67 l",
      "S",
      "0. 0. 0. rg",
      "0. G",
      "0 J",
      "1. w",
      "0 j",
      "180. 3347.56 m",
      "330. 3347.56 l",
      "330. 347.56 l",
      "180. 347.56 l",
      "180. 3347.56 l",
      "330. 3347.56 l",
      "180. 3347.56 l",
      "S"
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
      "BT\n/F1 10 Tf\n11.5 TL\n0. 0. 0. rg\n0. 683.78 Td\n(test) Tj\nET"
    ]);
  });
});
