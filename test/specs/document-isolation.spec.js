/* global describe, it, expect, beforeAll, jsPDF, loadGlobals */

describe("Document isolation", () => {
  beforeAll(loadGlobals);

  ["setLineDash", "setLineDashPattern"].forEach(method => {
    it(`preserves the ${method} plugin when creating documents`, () => {
      const previous = jsPDF.API[method];
      const calls = [];
      jsPDF.API[method] = function() {
        calls.push(this);
        return this;
      };
      try {
        const first = new jsPDF();
        const second = new jsPDF();
        expect(first[method]([1, 2], 0)).toBe(first);
        expect(second[method]([3, 4], 0)).toBe(second);
        expect(calls).toEqual([first, second]);
      } finally {
        if (previous === undefined) {
          delete jsPDF.API[method];
        } else {
          jsPDF.API[method] = previous;
        }
      }
    });
  });

  it("keeps canvas state and saved state in their own document", () => {
    const first = new jsPDF().context2d;
    first.margin = [1, 2, 3, 4];
    first.fillStyle = "#123456";
    first.setLineDash([1, 2]);
    first.moveTo(5, 6);
    const path = first.path.slice();
    first.save();
    first.margin = 9;

    const second = new jsPDF().context2d;
    expect(second.margin).toEqual([0, 0, 0, 0]);
    expect(second.path).toEqual([]);
    second.margin = 7;
    second.fillStyle = "#abcdef";
    second.moveTo(10, 20);

    expect(first.margin).toEqual([9, 9, 9, 9]);
    expect(first.path).toEqual(path);
    expect(first.getLineDash()).toEqual([1, 2]);
    first.restore();
    expect(first.margin).toEqual([1, 2, 3, 4]);
    expect(first.fillStyle).toBe("#123456");
    expect(second.margin).toEqual([7, 7, 7, 7]);
    expect(second.fillStyle).toBe("#abcdef");
  });

  it("uses the owning document's units and page size for canvas output", () => {
    const options = { unit: "pt", format: [200, 300], floatPrecision: 3 };
    const draw = doc => {
      const ctx = doc.context2d;
      ctx.save();
      ctx.translate(3, 4);
      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(20, 20);
      ctx.bezierCurveTo(30, 5, 40, 35, 50, 15);
      ctx.quadraticCurveTo(60, 40, 70, 10);
      ctx.arc(80, 30, 5, 0, Math.PI * 1.5);
      ctx.stroke();
      ctx.fillText("Document-local canvas", 10, 50);
      ctx.restore();
      return doc.internal.pages.slice(1).map(page => page.join("\n"));
    };
    const expected = draw(new jsPDF(options));
    const actual = new jsPDF(options);
    new jsPDF({ unit: "mm", format: "a5", floatPrecision: 1 });
    expect(draw(actual)).toEqual(expected);
  });
});
