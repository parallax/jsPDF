/* global describe, it, expect, jsPDF */
describe("Module: Context2D Input Validation", () => {
  beforeAll(loadGlobals);
  // Explicitly typed: the initializer references `global` itself, which
  // TypeScript cannot infer (TS7022). Only `console` is accessed on it.
  var global: { console: Console } =
    (typeof self !== "undefined" && self) ||
    (typeof window !== "undefined" && window) ||
    (typeof globalThis !== "undefined" && globalThis) ||
    Function('return typeof this === "object" && this.content')() ||
    Function("return this")();

  var tmpConsoleError = global.console.error;

  beforeEach(function () {
    global.console.error = function () {};
  });
  afterEach(function () {
    global.console.error = tmpConsoleError;
  });
  it("context2d: moveTo", () => {
    var doc = new jsPDF();
    // Deliberately mistyped arguments (via invalidArg) to assert the
    // runtime input validation throws.
    expect(function () {
      doc.context2d.moveTo(1, 1);
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.moveTo")
    );
    expect(function () {
      doc.context2d.moveTo(invalidArg<number>("invalid"), 1);
    }).toThrow(new Error("Invalid arguments passed to jsPDF.context2d.moveTo"));
    expect(function () {
      doc.context2d.moveTo(1, invalidArg<number>("invalid"));
    }).toThrow(new Error("Invalid arguments passed to jsPDF.context2d.moveTo"));
  });

  it("context2d: lineTo ", () => {
    var doc = new jsPDF();
    // Deliberately mistyped arguments (via invalidArg) to assert the
    // runtime input validation throws.
    expect(function () {
      doc.context2d.lineTo(1, 1);
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.lineTo")
    );
    expect(function () {
      doc.context2d.lineTo(invalidArg<number>("invalid"), 1);
    }).toThrow(new Error("Invalid arguments passed to jsPDF.context2d.lineTo"));
    expect(function () {
      doc.context2d.lineTo(1, invalidArg<number>("invalid"));
    }).toThrow(new Error("Invalid arguments passed to jsPDF.context2d.lineTo"));
  });

  it("context2d: quadraticCurveTo", () => {
    var doc = new jsPDF();
    // Deliberately mistyped arguments (via invalidArg) to assert the
    // runtime input validation throws.
    expect(function () {
      doc.context2d.quadraticCurveTo(1, 1, 1, 1);
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.quadraticCurveTo")
    );
    expect(function () {
      doc.context2d.quadraticCurveTo(invalidArg<number>("invalid"), 1, 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.quadraticCurveTo")
    );
    expect(function () {
      doc.context2d.quadraticCurveTo(1, invalidArg<number>("invalid"), 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.quadraticCurveTo")
    );
    expect(function () {
      doc.context2d.quadraticCurveTo(1, 1, invalidArg<number>("invalid"), 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.quadraticCurveTo")
    );
    expect(function () {
      doc.context2d.quadraticCurveTo(1, 1, 1, invalidArg<number>("invalid"));
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.quadraticCurveTo")
    );
  });

  it("context2d: bezierCurveTo", () => {
    var doc = new jsPDF();
    // Deliberately mistyped arguments (via invalidArg) to assert the
    // runtime input validation throws.
    expect(function () {
      doc.context2d.bezierCurveTo(1, 1, 1, 1, 1, 1);
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.bezierCurveTo")
    );
    expect(function () {
      doc.context2d.bezierCurveTo(invalidArg<number>("invalid"), 1, 1, 1, 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.bezierCurveTo")
    );
    expect(function () {
      doc.context2d.bezierCurveTo(1, invalidArg<number>("invalid"), 1, 1, 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.bezierCurveTo")
    );
    expect(function () {
      doc.context2d.bezierCurveTo(1, 1, invalidArg<number>("invalid"), 1, 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.bezierCurveTo")
    );
    expect(function () {
      doc.context2d.bezierCurveTo(1, 1, 1, invalidArg<number>("invalid"), 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.bezierCurveTo")
    );
    expect(function () {
      doc.context2d.bezierCurveTo(1, 1, 1, 1, invalidArg<number>("invalid"), 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.bezierCurveTo")
    );
    expect(function () {
      doc.context2d.bezierCurveTo(1, 1, 1, 1, 1, invalidArg<number>("invalid"));
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.bezierCurveTo")
    );
  });

  it("context2d: arc", () => {
    var doc = new jsPDF();
    // Deliberately mistyped arguments (via invalidArg) to assert the
    // runtime input validation throws.
    expect(function () {
      doc.context2d.arc(1, 1, 1, 1, 1, invalidArg<boolean>(1));
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.arc")
    );
    expect(function () {
      doc.context2d.arc(
        invalidArg<number>("invalid"),
        1,
        1,
        1,
        1,
        invalidArg<boolean>(1)
      );
    }).toThrow(new Error("Invalid arguments passed to jsPDF.context2d.arc"));
    expect(function () {
      doc.context2d.arc(
        1,
        invalidArg<number>("invalid"),
        1,
        1,
        1,
        invalidArg<boolean>(1)
      );
    }).toThrow(new Error("Invalid arguments passed to jsPDF.context2d.arc"));
    expect(function () {
      doc.context2d.arc(
        1,
        1,
        invalidArg<number>("invalid"),
        1,
        1,
        invalidArg<boolean>(1)
      );
    }).toThrow(new Error("Invalid arguments passed to jsPDF.context2d.arc"));
    expect(function () {
      doc.context2d.arc(
        1,
        1,
        1,
        invalidArg<number>("invalid"),
        1,
        invalidArg<boolean>(1)
      );
    }).toThrow(new Error("Invalid arguments passed to jsPDF.context2d.arc"));
    expect(function () {
      doc.context2d.arc(
        1,
        1,
        1,
        1,
        invalidArg<number>("invalid"),
        invalidArg<boolean>(1)
      );
    }).toThrow(new Error("Invalid arguments passed to jsPDF.context2d.arc"));
    expect(function () {
      doc.context2d.arc(1, 1, 1, 1, 1, invalidArg<boolean>("invalid"));
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.arc")
    );
  });

  it("context2d: rect", () => {
    var doc = new jsPDF();
    // Deliberately mistyped arguments (via invalidArg) to assert the
    // runtime input validation throws.
    expect(function () {
      doc.context2d.rect(1, 1, 1, 1);
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.rect")
    );
    expect(function () {
      doc.context2d.rect(invalidArg<number>("invalid"), 1, 1, 1);
    }).toThrow(new Error("Invalid arguments passed to jsPDF.context2d.rect"));
    expect(function () {
      doc.context2d.rect(1, invalidArg<number>("invalid"), 1, 1);
    }).toThrow(new Error("Invalid arguments passed to jsPDF.context2d.rect"));
    expect(function () {
      doc.context2d.rect(1, 1, invalidArg<number>("invalid"), 1);
    }).toThrow(new Error("Invalid arguments passed to jsPDF.context2d.rect"));
    expect(function () {
      doc.context2d.rect(1, 1, 1, invalidArg<number>("invalid"));
    }).toThrow(new Error("Invalid arguments passed to jsPDF.context2d.rect"));
  });

  it("context2d: fillRect", () => {
    var doc = new jsPDF();
    // Deliberately mistyped arguments (via invalidArg) to assert the
    // runtime input validation throws.
    expect(function () {
      doc.context2d.fillRect(1, 1, 1, 1);
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.fillRect")
    );
    expect(function () {
      doc.context2d.fillRect(invalidArg<number>("invalid"), 1, 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.fillRect")
    );
    expect(function () {
      doc.context2d.fillRect(1, invalidArg<number>("invalid"), 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.fillRect")
    );
    expect(function () {
      doc.context2d.fillRect(1, 1, invalidArg<number>("invalid"), 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.fillRect")
    );
    expect(function () {
      doc.context2d.fillRect(1, 1, 1, invalidArg<number>("invalid"));
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.fillRect")
    );
  });

  it("context2d: strokeRect", () => {
    var doc = new jsPDF();
    // Deliberately mistyped arguments (via invalidArg) to assert the
    // runtime input validation throws.
    expect(function () {
      doc.context2d.strokeRect(1, 1, 1, 1);
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.strokeRect")
    );
    expect(function () {
      doc.context2d.strokeRect(invalidArg<number>("invalid"), 1, 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.strokeRect")
    );
    expect(function () {
      doc.context2d.strokeRect(1, invalidArg<number>("invalid"), 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.strokeRect")
    );
    expect(function () {
      doc.context2d.strokeRect(1, 1, invalidArg<number>("invalid"), 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.strokeRect")
    );
    expect(function () {
      doc.context2d.strokeRect(1, 1, 1, invalidArg<number>("invalid"));
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.strokeRect")
    );
  });

  it("context2d: clearRect", () => {
    var doc = new jsPDF();
    // Deliberately mistyped arguments (via invalidArg) to assert the
    // runtime input validation throws.
    expect(function () {
      doc.context2d.clearRect(1, 1, 1, 1);
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.clearRect")
    );
    expect(function () {
      doc.context2d.clearRect(invalidArg<number>("invalid"), 1, 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.clearRect")
    );
    expect(function () {
      doc.context2d.clearRect(1, invalidArg<number>("invalid"), 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.clearRect")
    );
    expect(function () {
      doc.context2d.clearRect(1, 1, invalidArg<number>("invalid"), 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.clearRect")
    );
    expect(function () {
      doc.context2d.clearRect(1, 1, 1, invalidArg<number>("invalid"));
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.clearRect")
    );
    doc = new jsPDF();
    doc.context2d.ignoreClearRect = true;
    expect(doc.context2d.clearRect(1, 1, 1, 1)).toEqual(undefined);
  });

  it("context2d: fillText", () => {
    var doc = new jsPDF();
    // Deliberately mistyped arguments (via invalidArg) to assert the
    // runtime input validation throws.
    expect(function () {
      doc.context2d.fillText("valid", 1, 1, 1);
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.fillText")
    );
    expect(function () {
      doc.context2d.fillText(invalidArg<string>(false), 1, 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.fillText")
    );
    expect(function () {
      doc.context2d.fillText("valid", invalidArg<number>("invalid"), 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.fillText")
    );
    expect(function () {
      doc.context2d.fillText("valid", 1, invalidArg<number>("invalid"), 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.fillText")
    );
  });

  it("context2d: strokeText", () => {
    var doc = new jsPDF();
    // Deliberately mistyped arguments (via invalidArg) to assert the
    // runtime input validation throws.
    expect(function () {
      doc.context2d.strokeText("valid", 1, 1, 1);
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.strokeText")
    );
    expect(function () {
      doc.context2d.strokeText(invalidArg<string>(false), 1, 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.strokeText")
    );
    expect(function () {
      doc.context2d.strokeText("valid", invalidArg<number>("invalid"), 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.strokeText")
    );
    expect(function () {
      doc.context2d.strokeText("valid", 1, invalidArg<number>("invalid"), 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.strokeText")
    );
  });

  it("context2d: measureText", () => {
    var doc = new jsPDF();
    // Deliberately mistyped arguments (via invalidArg) to assert the
    // runtime input validation throws.
    expect(function () {
      doc.context2d.measureText("valid");
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.measureText")
    );
    expect(function () {
      doc.context2d.measureText(invalidArg<string>(false));
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.measureText")
    );
  });

  it("context2d: scale", () => {
    var doc = new jsPDF();
    // Deliberately mistyped arguments (via invalidArg) to assert the
    // runtime input validation throws.
    expect(function () {
      doc.context2d.scale(1, 1);
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.scale")
    );
    expect(function () {
      doc.context2d.scale(invalidArg<number>("invalid"), 1);
    }).toThrow(new Error("Invalid arguments passed to jsPDF.context2d.scale"));
    expect(function () {
      doc.context2d.scale(1, invalidArg<number>("invalid"));
    }).toThrow(new Error("Invalid arguments passed to jsPDF.context2d.scale"));
  });

  it("context2d: rotate", () => {
    var doc = new jsPDF();
    // Deliberately mistyped arguments (via invalidArg) to assert the
    // runtime input validation throws.
    expect(function () {
      doc.context2d.rotate(1);
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.rotate")
    );
    expect(function () {
      doc.context2d.rotate(invalidArg<number>("invalid"));
    }).toThrow(new Error("Invalid arguments passed to jsPDF.context2d.rotate"));
  });

  it("context2d: translate", () => {
    var doc = new jsPDF();
    // Deliberately mistyped arguments (via invalidArg) to assert the
    // runtime input validation throws.
    expect(function () {
      doc.context2d.translate(1, 1);
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.translate")
    );
    expect(function () {
      doc.context2d.translate(invalidArg<number>("invalid"), 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.translate")
    );
    expect(function () {
      doc.context2d.translate(1, invalidArg<number>("invalid"));
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.translate")
    );
  });

  it("context2d: transform", () => {
    var doc = new jsPDF();
    // Deliberately mistyped arguments (via invalidArg) to assert the
    // runtime input validation throws.
    expect(function () {
      doc.context2d.transform(1, 1, 1, 1, 1, 1);
    }).not.toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.transform")
    );
    expect(function () {
      doc.context2d.transform(invalidArg<number>("invalid"), 1, 1, 1, 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.transform")
    );
    expect(function () {
      doc.context2d.transform(1, invalidArg<number>("invalid"), 1, 1, 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.transform")
    );
    expect(function () {
      doc.context2d.transform(1, 1, invalidArg<number>("invalid"), 1, 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.transform")
    );
    expect(function () {
      doc.context2d.transform(1, 1, 1, invalidArg<number>("invalid"), 1, 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.transform")
    );
    expect(function () {
      doc.context2d.transform(1, 1, 1, 1, invalidArg<number>("invalid"), 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.transform")
    );
    expect(function () {
      doc.context2d.transform(1, 1, 1, 1, 1, invalidArg<number>("invalid"));
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.context2d.transform")
    );
  });

  it("context2d: toDataURL", () => {
    var doc = new jsPDF();
    expect(function () {
      doc.context2d.toDataURL();
    }).toThrow(new Error("toDataUrl not implemented."));
  });
});
