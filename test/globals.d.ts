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
declare const jsPDF: jsPDFCtor &
  (new (...args: Parameters<jsPDFCtor>) => ReturnType<jsPDFCtor>);
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

declare const isNode: boolean;

declare function loadGlobals(): void;

declare const Canvg: unknown;
