/**
 * Ambient declarations for the globals available inside spec files.
 *
 * Browser runs: `test/unit/loadGlobals.js` + `test/utils/compare.js` attach
 * these to `window`. Node runs: `test/deployment/node/loadGlobals.js` +
 * `test/utils/compare.js` attach them to `global`.
 */

type jsPDFModule = typeof import("../src/index.js");

// jsPDF is a function-constructor supporting both `jsPDF(...)` and
// `new jsPDF(...)`; the intersection adds the construct signature the
// inferred function type lacks.
type jsPDFCtor = jsPDFModule["jsPDF"];
// Legacy pre-August-2012 positional signature jsPDF(orientation, unit,
// format, compressPdf); still supported at runtime via the arguments-based
// shim at the top of the jsPDF constructor in src/jspdf.ts.
type jsPDFLegacyArgs = [
  orientation?: string,
  unit?: import("../src/types.js").Unit | number,
  format?: import("../src/types.js").PageFormat,
  compressPdf?: boolean
];
declare const jsPDF: jsPDFCtor &
  ((...args: jsPDFLegacyArgs) => ReturnType<jsPDFCtor>) &
  (new (...args: Parameters<jsPDFCtor>) => ReturnType<jsPDFCtor>) &
  (new (...args: jsPDFLegacyArgs) => ReturnType<jsPDFCtor>);
declare const AcroForm: jsPDFModule["AcroForm"];
declare const ChoiceField: jsPDFModule["AcroFormChoiceField"];
declare const ListBox: jsPDFModule["AcroFormListBox"];
declare const ComboBox: jsPDFModule["AcroFormComboBox"];
declare const EditBox: jsPDFModule["AcroFormEditBox"];
declare const Button: jsPDFModule["AcroFormButton"];
declare const PushButton: jsPDFModule["AcroFormPushButton"];
declare const RadioButton: jsPDFModule["AcroFormRadioButton"];
declare const CheckBox: jsPDFModule["AcroFormCheckBox"];
declare const TextField: jsPDFModule["AcroFormTextField"];
declare const PasswordField: jsPDFModule["AcroFormPasswordField"];
declare const Appearance: jsPDFModule["AcroFormAppearance"];

/** Compares a produced PDF against a reference file in test/reference/. */
declare function comparePdf(
  actual: string,
  expectedFile: string,
  suite?: string
): void;

/** Loads a binary fixture served from test/reference/. */
declare function loadBinaryResource(url: string, unicode?: boolean): string;

declare function sendReference(filename: string, data: string): void;

// Declared with `var` so it is visible both as a bare global and as a
// property of `globalThis`/`global` (specs probe `global.isNode`).
declare var isNode: boolean;

declare function loadGlobals(): void;

/**
 * Deliberately defeats the type system for negative tests (defined in
 * test/utils/compare.ts). The only sanctioned type-laundering primitive;
 * the double-assertion-through-unknown pattern is banned by lint.
 */
declare function invalidArg<T>(value: unknown): T;

/**
 * canvg's UMD global, loaded by the browser test runner. Minimal surface
 * used by the context2d specs.
 */
declare const Canvg: {
  fromString(
    ctx: unknown,
    svg: string,
    options?: Record<string, unknown>
  ): { render(options?: Record<string, unknown>): Promise<void> };
};
