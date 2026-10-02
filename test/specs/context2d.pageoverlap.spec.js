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
      "20. 821.89 l",
      "170. 821.89 l",
      "20. 821.89 l",
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
      "20. 1663.78 l",
      "170. 1663.78 l",
      "20. 1663.78 l",
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
      "20. 2505.67 l",
      "170. 2505.67 l",
      "20. 2505.67 l",
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
      "20. 3347.56 l",
      "170. 3347.56 l",
      "20. 3347.56 l",
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
      "180. 821.89 l",
      "330. 821.89 l",
      "180. 821.89 l",
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
      "180. 1663.78 l",
      "330. 1663.78 l",
      "180. 1663.78 l",
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
      "180. 2505.67 l",
      "330. 2505.67 l",
      "180. 2505.67 l",
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
      "180. 3347.56 l",
      "330. 3347.56 l",
      "180. 3347.56 l",
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

  // Returns the page and the baseline (from the top of the page) of every text, page by page.
  function getTextPositions(doc) {
    var positions = [];
    var pageHeight = doc.internal.pageSize.getHeight();
    for (var page = 1; page <= doc.getNumberOfPages(); page++) {
      var content = doc.internal.pages[page].join("\n");
      var regex = /([\d.-]+) Td\n\((.*)\) Tj/g;
      var match;
      while ((match = regex.exec(content)) !== null) {
        positions.push({
          text: match[2],
          page: page,
          y: Math.round((pageHeight - parseFloat(match[1])) * 100) / 100
        });
      }
    }
    return positions;
  }

  function createTextPagingDoc() {
    var doc = new jsPDF({ unit: "pt", format: "a4", floatPrecision: 2 });
    doc.context2d.autoPaging = "text";
    doc.context2d.margin = [30, 20, 30, 20];
    doc.context2d.font = "12px Arial";
    return doc;
  }

  // 260 lines, 22pt apart, about 35 per page
  function drawLines(ctx, reverse) {
    for (var i = 1; i <= 260; i++) {
      var line = reverse ? 261 - i : i;
      ctx.fillText("Line " + line, 0, line * 22);
    }
  }

  it("context2d autoPaging: 'text' draws every line of a long text once", () => {
    var doc = createTextPagingDoc();
    drawLines(doc.context2d);

    var positions = getTextPositions(doc);
    expect(positions.length).toEqual(260);
    for (var i = 0; i < positions.length; i++) {
      expect(positions[i].text).toEqual("Line " + (i + 1));
      if (i > 0 && positions[i].page === positions[i - 1].page) {
        expect(positions[i].y - positions[i - 1].y).toBeCloseTo(22, 5);
      } else if (i > 0) {
        expect(positions[i].page).toEqual(positions[i - 1].page + 1);
      }
    }
    expect(doc.getNumberOfPages()).toEqual(8);
  });

  it("context2d autoPaging: 'text' draws a line that starts exactly at a page break", () => {
    var doc = createTextPagingDoc();
    // the top of this line is the top of page 8
    doc.context2d.fillText("top", 0, 5483.429999999999);

    expect(getTextPositions(doc)).toEqual([{ text: "top", page: 8, y: 40.2 }]);
  });

  it("context2d autoPaging: 'text' keeps text above a moved line in place", () => {
    var doc = createTextPagingDoc();
    var ctx = doc.context2d;
    ctx.fillText("cut", 0, 785); // crosses the bottom margin, moves to page 2
    ctx.fillText("above", 0, 500);

    expect(getTextPositions(doc)).toEqual([
      { text: "above", page: 1, y: 530 },
      { text: "cut", page: 2, y: 40.2 }
    ]);
  });

  it("context2d autoPaging: 'text' keeps a moved line's offset after restore()", () => {
    var doc = createTextPagingDoc();
    var ctx = doc.context2d;
    ctx.save();
    ctx.fillText("cut", 0, 785);
    ctx.restore();
    ctx.fillText("below", 0, 807);

    expect(getTextPositions(doc)).toEqual([
      { text: "cut", page: 2, y: 40.2 },
      { text: "below", page: 2, y: 62.2 }
    ]);
  });

  it("context2d autoPaging: 'text' places text drawn out of order like text drawn in order after measuring", () => {
    var inOrder = createTextPagingDoc();
    drawLines(inOrder.context2d);

    var doc = createTextPagingDoc();
    var ctx = doc.context2d;
    ctx.measureOnly = true;
    drawLines(ctx, true);
    ctx.measureOnly = false;
    drawLines(ctx, true);

    var byPosition = function(a, b) {
      return a.page - b.page || a.y - b.y;
    };
    expect(getTextPositions(doc).sort(byPosition)).toEqual(
      getTextPositions(inOrder)
    );
    expect(doc.getNumberOfPages()).toEqual(8);
  });
});
