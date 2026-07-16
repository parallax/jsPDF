/**
 * Internal type system for jsPDF.
 *
 * This module is types-only: it contains no runtime code and is fully
 * erasable (it compiles to nothing). It declares the shapes used by the
 * jsPDF core (`src/jspdf.ts`) and consumed by the plugin modules in
 * `src/modules/*.ts`. The declarations were derived from the actual
 * implementation in `src/jspdf.ts` (ground truth) and cross-checked
 * against the shipped public declarations in `types/index.d.ts`.
 *
 * ## Plugin augmentation mechanism
 *
 * Plugins attach their methods to the shared `jsPDF.API` object (which
 * becomes the method surface of every document instance) and stash their
 * state on `doc.internal`. To get full typing for that, plugin modules
 * extend the exported interfaces via TypeScript module augmentation:
 *
 * ```ts
 * // in src/modules/cell.ts
 * import type { jsPDFDocument } from "../types.js";
 *
 * declare module "../types.js" {
 *   interface jsPDFAPI {
 *     cell(
 *       x: number,
 *       y: number,
 *       w: number,
 *       h: number,
 *       txt: string,
 *       ln: number,
 *       align: string
 *     ): jsPDFDocument;
 *   }
 *   interface jsPDFInternal {
 *     __cell__: Record<string, unknown>;
 *   }
 * }
 * ```
 *
 * This mechanism was verified to compile under the repository tsconfig
 * (moduleResolution "bundler", verbatimModuleSyntax, erasableSyntaxOnly).
 * Because `jsPDFDocument` extends `jsPDFAPI`, methods merged into
 * `jsPDFAPI` automatically show up on typed document instances.
 */

// ---------------------------------------------------------------------------
// Constructor options
// ---------------------------------------------------------------------------

export type Orientation = "p" | "portrait" | "l" | "landscape";

/** Measurement unit accepted by the constructor. A bare number is used as a custom scale factor. */
export type Unit = "pt" | "px" | "in" | "mm" | "cm" | "ex" | "em" | "pc";

/** A named page format (e.g. "a4") or explicit `[width, height]` in unit-space. */
export type PageFormat = string | number[];

/** Map of named page formats to `[width, height]` in points (see `pageFormats` in src/jspdf.ts). */
export type PageFormats = Record<string, [number, number]>;

export type UserPermission = "print" | "modify" | "copy" | "annot-forms";

export interface EncryptionOptions {
  userPassword?: string;
  ownerPassword?: string;
  userPermissions?: UserPermission[];
}

export interface jsPDFOptions {
  orientation?: Orientation;
  unit?: Unit | number;
  format?: PageFormat;
  compress?: boolean;
  /** Alias of `compress` kept for backwards compatibility (see the constructor in src/jspdf.ts). */
  compressPdf?: boolean;
  precision?: number;
  filters?: string[];
  userUnit?: number;
  encryption?: EncryptionOptions;
  putOnlyUsedFonts?: boolean;
  hotfixes?: string[];
  floatPrecision?: number | "smart";
  /** Default path painting operator, e.g. "S" (stroke). */
  defaultPathOperation?: string;

  // Undocumented options honored by the constructor in src/jspdf.ts.
  /** Initial font size in points (default 16). */
  fontSize?: number;
  /** Initial right-to-left mode (default false). */
  R2L?: boolean;
  /** Initial line width in unit-space (default 0.200025). */
  lineWidth?: number;
  /** Initial stroke color as an encoded PDF color string (default "0 G"). */
  strokeColor?: string;
  /** Initial fill color as an encoded PDF color string (default "0 g"). */
  fillColor?: string;
  /** Initial text color as an encoded PDF color string (default "0 g"). */
  textColor?: string;
  /** Initial character spacing. */
  charSpace?: number;
  /** Initial line height factor (default 1.15). */
  lineHeight?: number;
}

export interface DocumentProperties {
  title?: string;
  subject?: string;
  author?: string;
  keywords?: string;
  creator?: string;
}

// ---------------------------------------------------------------------------
// PubSub
// ---------------------------------------------------------------------------

/**
 * Callback stored in the event system. Parameters are declared as `never[]`
 * so that every concrete handler signature is assignable to this type
 * (function parameters are contravariant); the payload of each topic is
 * dynamic and owned by the publisher.
 */
export type PubSubCallback = (...args: never[]) => unknown;

/**
 * Topics published by the jsPDF core (plugins may publish additional ones).
 * Kept as documentation and for autocomplete; the PubSub methods accept
 * arbitrary strings since plugins define their own topics.
 */
export type KnownPubSubTopic =
  | "addFont"
  | "addFonts"
  | "addFormObject"
  | "addGState"
  | "addPage"
  | "addPattern"
  | "buildDocument"
  | "deletePage"
  | "endTilingPattern"
  | "initialized"
  | "postProcessText"
  | "postPutAdditionalObjects"
  | "postPutPages"
  | "postPutResources"
  | "preProcessText"
  | "putAdditionalObjects"
  | "putCatalog"
  | "putFont"
  | "putGStateDict"
  | "putPage"
  | "putResources"
  | "putShadingPatternDict"
  | "putTilingPatternDict"
  | "putXobjectDict";

/** topic -> token -> [callback, runOnce] */
export type PubSubTopics = Record<
  string,
  Record<string, [PubSubCallback, boolean]>
>;

export interface PubSubInterface {
  subscribe(topic: string, callback: PubSubCallback, once?: boolean): string;
  unsubscribe(token: string): boolean;
  publish(topic: string, ...args: unknown[]): void;
  getTopics(): PubSubTopics;
}

// ---------------------------------------------------------------------------
// Geometry: Point, Rectangle, Matrix
// ---------------------------------------------------------------------------

export interface PointType {
  x: number;
  y: number;
  /** "pt" for points, "rect" for rectangles (see `Point`/`Rectangle` in src/jspdf.ts). */
  type?: string;
}

export interface RectangleType extends PointType {
  w: number;
  h: number;
}

/** Constructor exposed as `internal.Point` (an ES class; requires `new`). */
export interface PointConstructor {
  new (x?: number, y?: number): PointType;
}

/** Constructor exposed as `internal.Rectangle` (an ES class; requires `new`). */
export interface RectangleConstructor {
  new (x?: number, y?: number, w?: number, h?: number): RectangleType;
}

/** The plain numeric fields of a matrix, without its methods. */
export interface MatrixLike {
  sx: number;
  shy: number;
  shx: number;
  sy: number;
  tx: number;
  ty: number;
}

/**
 * A matrix for 2D homogeneous transformations, as produced by
 * `doc.Matrix(...)` / `internal.Matrix`. `a`-`f` alias `sx`-`ty`.
 */
export interface Matrix extends MatrixLike {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;

  readonly rotation: number;
  readonly scaleX: number;
  readonly scaleY: number;
  readonly isIdentity: boolean;

  join(separator?: string): string;
  multiply(matrix: Matrix): Matrix;
  decompose(): {
    scale: Matrix;
    translate: Matrix;
    rotate: Matrix;
    skew: Matrix;
  };
  toString(precision?: number): string;
  inversed(): Matrix;
  applyToPoint(pt: PointType): PointType;
  applyToRectangle(rect: RectangleType): RectangleType;
  clone(): Matrix;
}

/** Constructor exposed as `doc.Matrix` / `internal.Matrix` (an ES class; requires `new`). */
export interface MatrixConstructor {
  new (
    sx?: number,
    shy?: number,
    shx?: number,
    sy?: number,
    tx?: number,
    ty?: number
  ): Matrix;
}

// ---------------------------------------------------------------------------
// Graphics state and patterns
// ---------------------------------------------------------------------------

export interface GStateOptions {
  opacity?: number;
  "stroke-opacity"?: number;
}

export interface GState extends GStateOptions {
  /** Set by addGState(). */
  id: string;
  /** Set by putGState(); -1 until then. */
  objectNumber: number;
  /** Handles a null comparand (e.g. no active graphics state). */
  equals(other: GState | null): boolean;
}

/** Constructor exposed as `doc.GState` (an ES class; requires `new`). */
export interface GStateConstructor {
  new (parameters?: GStateOptions): GState;
}

export interface Pattern {
  gState?: GState;
  matrix?: Matrix;
  /** Set by addPattern(). */
  id: string;
  /** Set by putPattern(); -1 until then. */
  objectNumber: number;
}

export type ShadingPatternType = "axial" | "radial";

export interface ShadingPatternStop {
  offset: number;
  color: number[];
}

export interface ShadingPatternObject extends Pattern {
  /** 2 for axial, 3 for radial (numeric PDF shading type, set from the "axial"/"radial" constructor argument). */
  type: 2 | 3;
  coords: number[];
  colors: ShadingPatternStop[];
}

export interface TilingPatternObject extends Pattern {
  boundingBox: number[];
  xStep: number;
  yStep: number;
  /** Set by endTilingPattern(). */
  stream: string;
  cloneIndex: number;
}

/** Constructor exposed as `doc.ShadingPattern` (an ES class; requires `new`). */
export interface ShadingPatternConstructor {
  new (
    type: ShadingPatternType,
    coords: number[],
    colors: ShadingPatternStop[],
    gState?: GState,
    matrix?: Matrix
  ): ShadingPatternObject;
}

/** Constructor exposed as `doc.TilingPattern` (an ES class; requires `new`). */
export interface TilingPatternConstructor {
  new (
    boundingBox: number[],
    xStep: number,
    yStep: number,
    gState?: GState,
    matrix?: Matrix
  ): TilingPatternObject;
}

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

/**
 * Populated dynamically by font plugins (standard_fonts_metrics, ttfsupport,
 * utf8): metric tables, glyph data, unicode maps etc. The concrete shape
 * depends on which plugin owns the font, hence the `unknown` values.
 */
export type FontMetadata = Record<string, unknown>;

export interface Font {
  /** Font key, e.g. "F1" (note: a string, unlike the numeric `id` in types/index.d.ts). */
  id: string;
  postScriptName: string;
  fontName: string;
  fontStyle: string;
  /** Honestly nullable: the ZapfDingbats and Symbol standard fonts have no encoding. */
  encoding: string | null;
  isStandardFont: boolean;
  metadata: FontMetadata;
  /** Assigned while the font dictionary is written (putFont); absent before. */
  objectNumber?: number;
}

/** Collection of font objects keyed by font key ("F1", "F2", ...). */
export type FontMap = Record<string, Font>;

/** fontName -> fontStyle -> font key. */
export type FontDictionary = Record<string, Record<string, string>>;

// ---------------------------------------------------------------------------
// Static side of the jsPDF constructor
// ---------------------------------------------------------------------------

/**
 * The static surface of the `jsPDF` function/class as modules see it
 * (src/jspdf.ts assigns `jsPDF.API` and `jsPDF.version` as expando statics).
 * Useful for typing plugin IIFE parameters that receive the class itself.
 */
export interface jsPDFConstructor {
  /**
   * src/jspdf.ts declares jsPDF as a classic constructor *function*, so its
   * inferred type carries a call signature rather than a construct signature;
   * a `new` signature here would make the real value unassignable.
   */
  (options?: jsPDFOptions): jsPDFDocument;
  API: jsPDFAPI;
  version: string;
}

// ---------------------------------------------------------------------------
// TTF font boundary (vendored src/libs/ttffont.ts, which is @ts-nocheck)
// ---------------------------------------------------------------------------

/**
 * Boundary interface for the vendored TTF font library
 * (`src/libs/ttffont.ts`, compiled CoffeeScript, checked with @ts-nocheck).
 * Only the members actually consumed by the plugin modules are declared;
 * everything else is reachable through the index signature as `unknown`.
 */
export interface TTFFontUnicodeTable {
  encoding: Record<string, unknown>;
  kerning: Record<string, unknown>;
  /** Interleaved glyph-id / width-array entries as written by pdfEscape16. */
  widths: Array<number | string | number[]>;
}

export interface TTFFontInstance {
  rawData: Uint8Array;
  Unicode: TTFFontUnicodeTable;
  glyIdsUsed: Array<number | string>;
  toUnicode: Record<string, number>;
  /** Returns the glyph id for a character code (0 when unmapped). */
  characterToGlyph(code: number): number | string;
  /**
   * Glyph advance width. Declared as string because every consumer feeds the
   * result straight into parseInt(), which coerces; the vendored library is
   * unchecked so the runtime value may be a number.
   */
  widthOfGlyph(glyph: number | string): string;
  subset: {
    encode(glyphIds: Array<number | string>, one?: number): ArrayLike<number>;
  };
  bbox: unknown;
  flags: number;
  stemV: number;
  italicAngle: number;
  ascender: number;
  decender: number;
  capHeight: number;
  hmtx: { widths: number[] };
  head: { unitsPerEm: number };
  cmap?: { unicode: { codeMap: Record<number, number> } };
  [member: string]: unknown;
}

/** Static surface of `jsPDF.API.TTFFont` (installed by src/libs/ttffont.ts). */
export interface TTFFontConstructor {
  new (rawData: Uint8Array): TTFFontInstance;
  open(file: Uint8Array): TTFFontInstance;
}

// ---------------------------------------------------------------------------
// Core event payloads consumed by plugins
// ---------------------------------------------------------------------------

/**
 * One entry of a text argument once the core/plugins are done reshaping it:
 * a string, a character code, or an array mixing text with per-line
 * coordinates (e.g. `[text, x, y]`).
 */
export type TextEntry = string | number | Array<string | number>;

/** `mutex` member of the pre/postProcessText payloads (see src/jspdf.ts). */
export interface TextProcessingMutex {
  /** The core's internal pdfEscape; some plugins pass a font key as second argument. */
  pdfEscape(text: string, flags?: unknown): string;
  activeFontKey: string;
  fonts: FontMap;
  activeFontSize: number;
  /** Set by encoding plugins when `text` has been converted to hex. */
  isHex?: boolean;
}

/** Payload published with the "preProcessText"/"postProcessText" topics. */
export interface TextProcessingPayload {
  text: TextEntry | TextEntry[];
  x: number;
  y: number;
  options: TextOptionsLight;
  mutex: TextProcessingMutex;
}

/** Payload published with the "putFont" topic (see putFont in src/jspdf.ts). */
export interface PutFontPayload {
  font: Font;
  out: (...data: Array<string | number>) => string[];
  newObject: () => number;
  putStream: (options?: PutStreamOptions) => void;
}

/** Payload published with the "addFont" topic (see addFont in src/jspdf.ts). */
export interface AddFontPayload {
  font: Font;
  instance?: jsPDFDocument;
}

/** Payload published with the "putPage" topic (see putPage in src/jspdf.ts). */
export interface PutPagePayload {
  objId: number;
  pageContext: PageContext;
  pageNumber: number;
  /** The page's content stream lines. */
  page: string[];
}

/** Payload published with the "addPage" topic (see _addPage in src/jspdf.ts). */
export interface AddPagePayload {
  pageNumber: number;
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export interface PageBox {
  bottomLeftX: number;
  bottomLeftY: number;
  topRightX: number;
  topRightY: number;
}

/**
 * Per-page context created by beginPage() in src/jspdf.ts. Plugins may
 * attach additional state (e.g. the annotations plugin adds `annotations`);
 * such members should be merged in via module augmentation.
 */
export interface PageContext {
  objId: number;
  contentsObjId: number;
  userUnit: number;
  mediaBox: PageBox;
  artBox: PageBox | null;
  bleedBox: PageBox | null;
  cropBox: PageBox | null;
  trimBox: PageBox | null;
  /** Last text rendering mode written for this page (see `text()` in src/jspdf.ts). */
  usedRenderingMode?: number;
}

export interface PageInfo {
  objId: number;
  pageNumber: number;
  pageContext: PageContext;
}

/** Deferred object handle returned by `internal.newAdditionalObject()`. */
export interface AdditionalObject {
  objId: number;
  content: string;
}

export interface PageSize {
  width: number;
  height: number;
  getWidth(): number;
  setWidth(value: number): void;
  getHeight(): number;
  setHeight(value: number): void;
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

export type OutputType =
  | "save"
  | "arraybuffer"
  | "blob"
  | "bloburi"
  | "bloburl"
  | "datauristring"
  | "dataurlstring"
  | "pdfobjectnewwindow"
  | "pdfjsnewwindow"
  | "dataurlnewwindow"
  | "datauri"
  | "dataurl";

export interface OutputOptions {
  filename?: string;
  /** Only used by "pdfobjectnewwindow". */
  pdfObjectUrl?: string;
  /** Only used by "pdfjsnewwindow". */
  pdfJsUrl?: string;
  /**
   * "pdfobjectnewwindow" forwards the whole options object to PDFObject.embed,
   * so arbitrary additional options are allowed and passed through.
   */
  [option: string]: unknown;
}

// ---------------------------------------------------------------------------
// Streams and encryption
// ---------------------------------------------------------------------------

export interface PutStreamOptions {
  data?: string;
  filters?: string[] | true;
  alreadyAppliedFilters?: string[] | string;
  addLength1?: boolean;
  /** Required when the document is encrypted. */
  objectId?: number;
  additionalKeyValues?: Array<{ key: string; value: string | number }>;
}

/** A function encrypting stream data for a specific object id. */
export type Encryptor = (data: string) => string;

/** Result shape of `jsPDF.API.processDataByFilters` (filters plugin). */
export interface ProcessedData {
  data: string;
  /** Space-joined chain of decode filter names, e.g. "/FlateDecode". */
  reverseChain: string;
}

/**
 * Surface of the PDFSecurity helper (`src/libs/pdfsecurity.ts`) that the
 * core relies on, matching the class members declared there.
 */
export interface PDFSecurityInterface {
  encryptor(objectId: number, generation: number): Encryptor;
  /** Encryption algorithm version. */
  v: number;
  /** Encryption revision. */
  r: number;
  padding: string;
  O: string;
  U: string;
  P: number;
  encryptionKey: string;
  /** Object id of the encryption dictionary; attached by putEncryptionDict in src/jspdf.ts. */
  oid?: number;
  toHexString(byteString: string): string;
}

// ---------------------------------------------------------------------------
// internal API (doc.internal) — the surface plugins consume
// ---------------------------------------------------------------------------

/**
 * The `internal` object assigned in src/jspdf.ts (`API.internal = { ... }`).
 * Every member below was verified against that assignment. Plugins that
 * stash their own state on `internal` (e.g. `__cell__`, `acroformPlugin`,
 * `vFS`, `viewerpreferences`, `__metadata__`, `languageSettings`) must add
 * those members via module augmentation of this interface (see the header
 * comment).
 */
export interface jsPDFInternal {
  pdfEscape(
    text: string,
    flags?: { autoencode?: boolean; noBOM?: boolean }
  ): string;
  getStyle(style?: string): string;
  /** Resolves a font entry; without arguments returns the active font. */
  getFont(
    fontName?: string,
    fontStyle?: string,
    options?: { disableWarning?: boolean }
  ): Font;
  getFontSize(): number;
  getCharSpace(): number;
  getTextColor(): string;
  getLineHeight(): number;
  getLineHeightFactor(): number;
  getLineWidth(): number;
  /** Appends one or more strings (joined by spaces) to the current page stream. */
  write(value: string | number, ...rest: Array<string | number>): string[];
  getHorizontalCoordinate(value: number): number;
  getVerticalCoordinate(value: number): number;
  /** Returns the scaled horizontal coordinate formatted as a PDF number string. */
  getCoordinateString(value: number): string;
  /** Returns the scaled, flipped vertical coordinate formatted as a PDF number string. */
  getVerticalCoordinateString(value: number): string;
  /**
   * Scratch space shared between plugins; each plugin owns the entries it
   * creates (e.g. the addimage plugin stores its image dictionary here),
   * so values are opaque to the core.
   */
  collections: Record<string, unknown>;
  newObject(): number;
  newAdditionalObject(): AdditionalObject;
  newObjectDeferred(): number;
  newObjectDeferredBegin(oid: number, doOutput?: boolean): number;
  getFilters(): string[];
  putStream(options?: PutStreamOptions): void;
  events: PubSubInterface;
  scaleFactor: number;
  pageSize: PageSize;
  encryptionOptions: EncryptionOptions | null;
  encryption: PDFSecurityInterface | null;
  getEncryptor(objectId: number): Encryptor;
  output(
    type?: OutputType,
    options?: OutputOptions | string
  ): string | ArrayBuffer | Blob | Window | null | undefined;
  getNumberOfPages(): number;
  /** Page content streams; index 0 is unused, page n lives at index n. */
  readonly pages: string[][];
  /** Appends a single line to the current output destination and returns it. */
  out(data: string | number): string[];
  /** Formats a number with two decimals. */
  f2(value: number): string;
  /** Formats a number with three decimals. */
  f3(value: number): string;
  getPageInfo(pageNumberOneBased: number): PageInfo;
  getPageInfoByObjId(objId: number): PageInfo;
  getCurrentPageInfo(): PageInfo;
  getPDFVersion(): string;
  Point: PointConstructor;
  Rectangle: RectangleConstructor;
  Matrix: MatrixConstructor;
  hasHotfix(hotfixName: string): boolean;
}

/**
 * The `__private__` helper surface (`jsPDF.API.__private__`, copied onto every
 * document instance). It exists for tests and internal plugin use; only the
 * members consumed by typed plugin modules are declared, everything else is
 * reachable through the index signature.
 */
export interface jsPDFPrivate {
  encodeColorString(
    options:
      | string
      | number[]
      | {
          ch1: string | number;
          ch2?: string | number;
          ch3?: string | number;
          /** An `{ a: alpha }` descriptor is accepted as the fourth channel (RGBA). */
          ch4?: string | number | { a: number };
          pdfColorType?: "draw" | "fill" | "text";
          precision?: number;
        }
  ): string;
  /** Redirects PDF stream writes into `destination` (used by specs to capture output). */
  setCustomOutputDestination(destination: string[]): void;
  /** Restores the default output destination after setCustomOutputDestination. */
  resetCustomOutputDestination(): void;
  /** Sets the /ID of the document; used by specs for deterministic output. */
  setFileId(value?: string): string;
  /** Sets the creation date; used by specs for deterministic output. */
  setCreationDate(date?: Date | string): string;
  /** Resolves a CSS-style fontStyle/fontWeight pair to a jsPDF style name. */
  combineFontStyleAndFontWeight(
    fontStyle?: string,
    fontWeight?: string | number
    // Undefined when fontStyle is undefined and no fontWeight is given.
  ): string | undefined;
  [member: string]: unknown;
}

// ---------------------------------------------------------------------------
// Plugin surface (jsPDF.API)
// ---------------------------------------------------------------------------

/**
 * An entry of `jsPDF.API.events`: `[topic, handler]` or
 * `[topic, [handler, runOnce]]` (see the plugin wiring loop in src/jspdf.ts).
 */
export type jsPDFAPIEvent = [
  string,
  PubSubCallback | [PubSubCallback, boolean]
];

/**
 * The static plugin surface (`jsPDF.API`). Its members are copied onto every
 * new document instance, so `jsPDFDocument` extends this interface.
 *
 * Deliberately has NO index signature: plugin modules declare the methods
 * they add through module augmentation (see the header comment), keeping the
 * whole surface strictly typed. Only the members the core itself relies on
 * are declared here.
 */
export interface jsPDFAPI {
  /** Event subscriptions registered by plugins; wired into every new instance's PubSub. */
  events: jsPDFAPIEvent[];
  /**
   * Installed by the filters plugin (src/modules/filters.ts) and consumed by
   * the core's putStream. Optional because the core guards for its presence.
   */
  processDataByFilters?(
    origData?: string,
    filterChain?: string | string[] | true
  ): ProcessedData;
  /**
   * Core alias pair installed directly on `jsPDF.API` by src/jspdf.ts
   * (setLineDash is the legacy name of setLineDashPattern). Optional because
   * they are attached during core initialization.
   */
  setLineDash?(dashArray?: number[], dashPhase?: number): jsPDFDocument;
  setLineDashPattern?(dashArray?: number[], dashPhase?: number): jsPDFDocument;
}

// ---------------------------------------------------------------------------
// Document instance
// ---------------------------------------------------------------------------

/**
 * The public surface of a jsPDF document instance as constructed in
 * src/jspdf.ts (core only; plugin methods arrive through `jsPDFAPI`
 * augmentation). Adapted from types/index.d.ts and corrected against the
 * implementation where the two disagreed.
 */
export interface jsPDFDocument extends jsPDFAPI {
  version: string;
  CapJoinStyles: Record<string, number>;
  internal: jsPDFInternal;
  /** Test/plugin backdoor surface (see src/jspdf.ts `API.__private__`). */
  __private__: jsPDFPrivate;
  /** Computes the width of a string in font units (see `getStringUnitWidth` in src/jspdf.ts). */
  getStringUnitWidth(
    text: string,
    options?: {
      font?: Font;
      fontSize?: number;
      charSpace?: number;
      doKerning?: boolean;
    }
  ): number;
  /** Rounds a number to the given (or configured) precision (see src/jspdf.ts). */
  roundToPrecision(number: number, parmPrecision?: number): string;
  /** Sets the global coordinate precision. */
  setPrecision(value: string): void;
  /** Sets the default path painting operator (see `getStyle`). */
  setDefaultPathOperation(operator: string): jsPDFDocument;
  /** Inserts a debug comment into the generated pdf. */
  comment(text: string): jsPDFDocument;
  /** Alias of `unitMatrix`. */
  identityMatrix: Matrix;

  compatAPI(body?: (pdf: jsPDFDocument) => void): jsPDFDocument;
  advancedAPI(body?: (pdf: jsPDFDocument) => void): jsPDFDocument;
  isAdvancedAPI(): boolean;

  addFont(
    postScriptName: string,
    id: string,
    fontStyle: string,
    fontWeight?: string | number,
    encoding?:
      | "StandardEncoding"
      | "MacRomanEncoding"
      | "Identity-H"
      | "WinAnsiEncoding",
    isStandardFont?: boolean
  ): string;
  addFont(
    url: URL,
    id: string,
    fontStyle: string,
    fontWeight?: string | number,
    encoding?:
      "StandardEncoding" | "MacRomanEncoding" | "Identity-H" | "WinAnsiEncoding"
  ): string;
  addGState(key: string, gState: GState): jsPDFDocument;
  addPage(format?: PageFormat, orientation?: Orientation): jsPDFDocument;
  beginFormObject(
    x: number,
    y: number,
    width: number,
    height: number,
    matrix: Matrix
  ): jsPDFDocument;
  circle(x: number, y: number, r: number, style?: string | null): jsPDFDocument;
  clip(rule?: "evenodd"): jsPDFDocument;
  clipEvenOdd(): jsPDFDocument;
  close(): jsPDFDocument;
  curveTo(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): jsPDFDocument;
  deletePage(targetPage: number): jsPDFDocument;
  discardPath(): jsPDFDocument;
  doFormObject(key: string, matrix: Matrix): jsPDFDocument;
  ellipse(
    x: number,
    y: number,
    rx: number,
    ry: number,
    style?: string | null
  ): jsPDFDocument;
  endFormObject(key: string): jsPDFDocument;
  f2(value: number): string;
  fill(pattern?: PatternData): jsPDFDocument;
  fillEvenOdd(pattern?: PatternData): jsPDFDocument;
  fillStroke(pattern?: PatternData): jsPDFDocument;
  fillStrokeEvenOdd(pattern?: PatternData): jsPDFDocument;
  getCharSpace(): number;
  getCreationDate(type: "jsDate"): Date;
  getCreationDate(type?: string): Date | string;
  getCurrentPageInfo(): PageInfo;
  getDrawColor(): string;
  getFileId(): string;
  getFillColor(): string;
  getFont(fontName?: string, fontStyle?: string): Font;
  getFontList(): Record<string, string[]>;
  getFontSize(): number;
  getFormObject(key: string): unknown;
  getHorizontalCoordinateString(value: number): string;
  getLineHeight(): number;
  getLineHeightFactor(): number;
  getLineWidth(): number;
  getNumberOfPages(): number;
  getPageInfo(pageNumberOneBased: number): PageInfo;
  getPageWidth(pageNumber?: number): number;
  getPageHeight(pageNumber?: number): number;
  getR2L(): boolean;
  getStyle(style?: string): string;
  getTextColor(): string;
  getVerticalCoordinateString(value: number): string;
  hpf(value: number): string;
  insertPage(beforePage: number): jsPDFDocument;
  line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    style?: string | null
  ): jsPDFDocument;
  lines(
    lines: Array<number[]>,
    x: number,
    y: number,
    scale?: [number, number] | number[],
    style?: string | null,
    closed?: boolean
  ): jsPDFDocument;
  lineTo(x: number, y: number): jsPDFDocument;
  movePage(targetPage: number, beforePage: number): jsPDFDocument;
  moveTo(x: number, y: number): jsPDFDocument;
  output(): string;
  output(type: "arraybuffer"): ArrayBuffer;
  output(type: "blob"): Blob;
  output(type: "bloburi" | "bloburl"): string | undefined;
  output(
    type: "datauristring" | "dataurlstring",
    options?: OutputOptions | string
  ): string;
  output(
    type: "pdfobjectnewwindow" | "pdfjsnewwindow" | "dataurlnewwindow",
    options?: OutputOptions | string
  ): Window | null;
  output(type: "dataurl" | "datauri", options?: OutputOptions | string): string;
  output(type: "save", options?: OutputOptions | string): void;
  path(
    // Required: the implementation iterates it unconditionally.
    lines: Array<{ op: string; c: number[] }>,
    style?: string
  ): jsPDFDocument;
  pdfEscape(
    text: string,
    flags?: { autoencode?: boolean; noBOM?: boolean }
  ): string;
  rect(
    x: number,
    y: number,
    w: number,
    h: number,
    style?: string | null
  ): jsPDFDocument;
  restoreGraphicsState(): jsPDFDocument;
  roundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    rx: number,
    ry: number,
    style?: string | null
  ): jsPDFDocument;
  save(filename: string, options: { returnPromise: true }): Promise<void>;
  save(filename?: string): jsPDFDocument;
  saveGraphicsState(): jsPDFDocument;
  scale(value: number): number;
  setCharSpace(charSpace: number): jsPDFDocument;
  setCreationDate(date?: Date | string): jsPDFDocument;
  setCurrentTransformationMatrix(matrix: Matrix): jsPDFDocument;
  setDisplayMode(
    zoom?:
      | number
      | "fullheight"
      | "fullwidth"
      | "fullpage"
      | "original"
      | string
      | null,
    layout?: "continuous" | "single" | "twoleft" | "tworight" | "two" | null,
    pmode?: "UseOutlines" | "UseThumbs" | "FullScreen" | null
  ): jsPDFDocument;
  setDocumentProperties(properties: DocumentProperties): jsPDFDocument;
  setProperties(properties: DocumentProperties): jsPDFDocument;
  setDrawColor(
    ch1: string | number,
    ch2?: number,
    ch3?: number,
    ch4?: number
  ): jsPDFDocument;
  setFileId(value: string): jsPDFDocument;
  setFillColor(
    ch1: string | number,
    ch2?: number,
    ch3?: number,
    ch4?: number
  ): jsPDFDocument;
  setFont(
    fontName: string,
    fontStyle?: string,
    fontWeight?: string | number
  ): jsPDFDocument;
  setFontSize(size: number): jsPDFDocument;
  /**
   * Accepts a GState object or the key of a previously added one. Note: the
   * implementation returns undefined (not `this`), so the declared return
   * type is void.
   */
  setGState(gState: string | GState): void;
  setLineCap(style: string | number): jsPDFDocument;
  setLineDashPattern(dashArray?: number[], dashPhase?: number): jsPDFDocument;
  /** An omitted/falsy value falls back to the default of 1.15. */
  setLineHeightFactor(value?: number): jsPDFDocument;
  setLineJoin(style: string | number): jsPDFDocument;
  setLineMiterLimit(length: number): jsPDFDocument;
  setLineWidth(width: number): jsPDFDocument;
  setPage(pageNumber: number): jsPDFDocument;
  setPageWidth(pageNumber: number, value: number): void;
  setPageHeight(pageNumber: number, value: number): void;
  setR2L(value: boolean): jsPDFDocument;
  setTextColor(
    ch1: string | number,
    ch2?: number,
    ch3?: number,
    ch4?: number
  ): jsPDFDocument;
  stroke(): jsPDFDocument;
  text(
    text: string | string[],
    x: number,
    y: number,
    options?: TextOptionsLight,
    transform?: number | Matrix
  ): jsPDFDocument;
  /**
   * @deprecated Legacy pre-August-2012 argument order
   * `text(x, y, text, flags, angle, align)`; still supported by the
   * implementation in src/jspdf.ts (see the argument-swapping shim there).
   */
  text(
    x: number,
    y: number,
    text: string | string[],
    flags?: TextOptionsLight["flags"] | null,
    angle?: number | null,
    align?: string
  ): jsPDFDocument;
  triangle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    style?: string | null
  ): jsPDFDocument;

  Matrix: MatrixConstructor;
  matrixMult(m1: Matrix, m2: Matrix): Matrix;
  unitMatrix: Matrix;

  GState: GStateConstructor;
  ShadingPattern: ShadingPatternConstructor;
  TilingPattern: TilingPatternConstructor;

  addShadingPattern(key: string, pattern: ShadingPatternObject): jsPDFDocument;
  beginTilingPattern(pattern: TilingPatternObject): void;
  endTilingPattern(key: string, pattern: TilingPatternObject): void;
}

// ---------------------------------------------------------------------------
// Shared option shapes used by core drawing methods
// ---------------------------------------------------------------------------

/** Reference to a previously registered pattern, used by fill()/fillEvenOdd()/... */
export interface PatternData {
  key: string;
  matrix?: Matrix;
  boundingBox?: number[];
  xStep?: number;
  yStep?: number;
}

export interface TextOptionsLight {
  align?: "left" | "center" | "right" | "justify";
  angle?: number | Matrix;
  baseline?:
    "alphabetic" | "ideographic" | "bottom" | "top" | "middle" | "hanging";
  flags?: {
    noBOM?: boolean;
    autoencode?: boolean;
  };
  rotationDirection?: 0 | 1;
  /** @deprecated Legacy alias for `renderingMode` (see text() in src/jspdf.ts). */
  stroke?: boolean | number | string;
  charSpace?: number;
  horizontalScale?: number;
  lineHeightFactor?: number;
  maxWidth?: number;
  renderingMode?:
    | "fill"
    | "stroke"
    | "fillThenStroke"
    | "invisible"
    | "fillAndAddForClipping"
    | "strokeAndAddPathForClipping"
    | "fillThenStrokeAndAddToPathForClipping"
    | "addToPathForClipping";
  isInputVisual?: boolean;
  isOutputVisual?: boolean;
  isInputRtl?: boolean;
  isOutputRtl?: boolean;
  isSymmetricSwapping?: boolean;
}

export interface TextOptions extends TextOptionsLight {
  text: string | string[];
  x: number;
  y: number;
}
