/* global describe, beforeAll, it, expect, jsPDF */
describe("Lib: Bidi Engine", function() {
  var options = {
    isInputVisual: true,
    isSymmetricSwapping: true,
    isInputRtl: false,
    isOutputRtl: false
  };
  var sourceString = "a(b)c\u05d0<\u05d5>\u05ea& 123";
  var bidiEngine;
  beforeAll(function() {
    bidiEngine = new jsPDF.__bidiEngine__(options);
  });

  it("Visual left-to-right ->Logical left-to-right conversion", function() {
    var options = {
      isInputVisual: true,
      isSymmetricSwapping: true,
      isInputRtl: false,
      isOutputRtl: false
    };
    var levels = [],
      sourceToTargetMap = [];

    bidiEngine.setOptions(options);
    var reorderedString = bidiEngine.doBidiReorder(
      sourceString,
      sourceToTargetMap,
      levels
    );
    expect(reorderedString).toEqual("a(b)c123 &\u05ea<\u05d5>\u05d0");
    expect(sourceToTargetMap).toEqual([
      0,
      1,
      2,
      3,
      4,
      12,
      13,
      14,
      11,
      10,
      9,
      8,
      7,
      6,
      5
    ]);
    expect(levels).toEqual([0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2]);
  });

  it("Logical right-to-left -> Visual left-to-right conversion", function() {
    var levels = [],
      sourceToTargetMap = [];
    options = {};
    options.isOutputVisual = true;
    options.isInputRtl = true;
    options.isOutputRtl = false;
    options.isSymmetricSwapping = true;
    bidiEngine.setOptions(options);

    var reorderedString = bidiEngine.doBidiReorder(
      sourceString,
      sourceToTargetMap,
      levels
    );
    expect(reorderedString).toEqual("123 &\u05ea<\u05d5>\u05d0a(b)c");
    expect(sourceToTargetMap).toEqual([
      12,
      13,
      14,
      11,
      10,
      9,
      8,
      7,
      6,
      5,
      0,
      1,
      2,
      3,
      4
    ]);
    expect(levels).toEqual([2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2]);
  });
  it("Logical left-to-right -> Logical right-to-left conversion", function() {
    var levels = [],
      sourceToTargetMap = [];

    options.isInputVisual = options.isOutputVisual = false;
    options.isInputRtl = false;
    options.isOutputRtl = true;
    options.isSymmetricSwapping = false;
    bidiEngine.setOptions(options);

    var reorderedString = bidiEngine.doBidiReorder(
      sourceString,
      sourceToTargetMap,
      levels
    );
    expect(reorderedString).toEqual("\u05d0<\u05d5>\u05ea& a(b)c123");
    expect(sourceToTargetMap).toEqual([
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      0,
      1,
      2,
      3,
      4,
      12,
      13,
      14
    ]);
    expect(levels).toEqual([1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2]);
  });

  it("Logical right-to-left -> Logical  left-to-right conversion", function() {
    var levels = [],
      sourceToTargetMap = [];

    options.isInputVisual = options.isOutputVisual = false;
    options.isInputRtl = true;
    options.isOutputRtl = false;
    options.isSymmetricSwapping = false;
    bidiEngine.setOptions(options);

    var reorderedString = bidiEngine.doBidiReorder(
      sourceString,
      sourceToTargetMap,
      levels
    );
    expect(reorderedString).toEqual("123 &\u05d0<\u05d5>\u05eaa(b)c");
    expect(sourceToTargetMap).toEqual([
      12,
      13,
      14,
      11,
      10,
      5,
      6,
      7,
      8,
      9,
      0,
      1,
      2,
      3,
      4
    ]);
    expect(levels).toEqual([0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]);
  });

  it("Visual right-to-left -> Visual left-to-right conversion", function() {
    var levels = [],
      sourceToTargetMap = [];

    options.isInputVisual = options.isOutputVisual = true;
    options.isInputRtl = true;
    options.isOutputRtl = false;
    options.isSymmetricSwapping = false;
    bidiEngine.setOptions(options);

    var reorderedString = bidiEngine.doBidiReorder(
      sourceString,
      sourceToTargetMap,
      levels
    );
    expect(reorderedString).toEqual("321 &\u05ea>\u05d5<\u05d0c)b(a");
    expect(sourceToTargetMap).toEqual([
      14,
      13,
      12,
      11,
      10,
      9,
      8,
      7,
      6,
      5,
      4,
      3,
      2,
      1,
      0
    ]);
    expect(levels).toEqual([2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2]);
  });

  it("Logical contextual -> Visual right-to-left conversion", function() {
    var levels = [],
      sourceToTargetMap = [];

    options = {};
    options.isInputVisual = false;
    options.isOutputVisual = true;
    options.isOutputRtl = true;
    options.isSymmetricSwapping = true;
    bidiEngine.setOptions(options);

    var reorderedString = bidiEngine.doBidiReorder(
      "\u05ea<\u05d5>\u05d0a)b(c",
      sourceToTargetMap,
      levels
    );
    expect(reorderedString).toEqual("\u05ea>\u05d5<\u05d0c(b)a");
    expect(sourceToTargetMap).toEqual([0, 1, 2, 3, 4, 9, 8, 7, 6, 5]);
    expect(levels).toEqual([1, 1, 1, 1, 1, 2, 2, 2, 2, 2]);
  });
  it("Logical left-to-right -> Visual right-to-left conversion", function() {
    var levels = [],
      sourceToTargetMap = [];

    options.isInputVisual = false;
    options.isOutputVisual = true;
    options.isInputRtl = false;
    options.isOutputRtl = true;
    options.isSymmetricSwapping = true;
    bidiEngine.setOptions(options);

    var reorderedString = bidiEngine.doBidiReorder(
      sourceString,
      sourceToTargetMap,
      levels
    );
    expect(reorderedString).toEqual("\u05d0>\u05d5<\u05ea& 321c)b(a");
    expect(sourceToTargetMap).toEqual([
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      14,
      13,
      12,
      4,
      3,
      2,
      1,
      0
    ]);
    expect(levels).toEqual([0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2]);
  });

  it("Visual right-to-left  -> Logical right-to-left conversion", function() {
    var levels = [],
      sourceToTargetMap = [];

    options.isInputVisual = true;
    options.isOutputVisual = false;
    options.isOutputRtl = options.isInputRtl = true;
    options.isSymmetricSwapping = true;
    bidiEngine.setOptions(options);

    var reorderedString = bidiEngine.doBidiReorder(
      sourceString,
      sourceToTargetMap,
      levels
    );
    expect(reorderedString).toEqual("c)b(a\u05d0>\u05d5<\u05ea& 321");
    expect(sourceToTargetMap).toEqual([
      4,
      3,
      2,
      1,
      0,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      14,
      13,
      12
    ]);
    expect(levels).toEqual([2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2]);
  });
});
