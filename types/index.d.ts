/** @license
 *
 * jsPDF - PDF Document creation from JavaScript
 *
 * Copyright (c) 2010-2020 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
 *               2015-2020 yWorks GmbH, http://www.yworks.com
 *               2015-2020 Lukas Holländer <lukas.hollaender@yworks.com>, https://github.com/HackbrettXXX
 *               2016-2018 Aras Abbasi <aras.abbasi@gmail.com>
 *               2018 Amber Schühmacher <https://github.com/amberjs>
 *               2018 Kevin Gonnord <https://github.com/lleios>
 *               2018 Jackie Weng <https://github.com/jemerald>
 *               2010 Aaron Spike, https://github.com/acspike
 *               2012 Willow Systems Corporation, willow-systems.com
 *               2012 Pablo Hess, https://github.com/pablohess
 *               2012 Florian Jenett, https://github.com/fjenett
 *               2013 Warren Weckesser, https://github.com/warrenweckesser
 *               2013 Youssef Beddad, https://github.com/lifof
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2013 Stefan Slonevskiy, https://github.com/stefslon
 *               2013 Jeremy Morel, https://github.com/jmorel
 *               2013 Christoph Hartmann, https://github.com/chris-rock
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Makes, https://github.com/dollaruw
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 Steven Spungin, https://github.com/Flamenco
 *               2014 Kenneth Glassey, https://github.com/Gavvers
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Contributor(s):
 *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
 *    kim3er, mfo, alnorth, Flamenco
 */

declare module "jspdf" {
  export interface Annotation {
    type: "text" | "freetext" | "link";
    title?: string;
    bounds: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
    contents: string;
    open?: boolean;
    color?: string;
    name?: string;
    top?: number;
    pageNumber?: number;
  }

  export interface TextWithLinkOptions {
    pageNumber?: number;
    magFactor?: "Fit" | "FitH" | "FitV" | "XYZ";
    zoom?: number;
  }

  //jsPDF plugin:AutoPrint

  export interface AutoPrintInput {
    variant: "non-conform" | "javascript";
  }

  //jsPDF plugn: HTML
  export interface Html2CanvasOptions {
    /** Whether to parse and render the element asynchronously */
    async?: boolean;

    /** Whether to allow cross-origin images to taint the canvas */
    allowTaint?: boolean;

    /** Canvas background color, if none is specified in DOM. Set null for transparent */
    backgroundColor?: string | null;

    /** Existing canvas element to use as a base for drawing on */
    canvas?: any;

    /** Whether to use ForeignObject rendering if the browser supports it */
    foreignObjectRendering?: boolean;

    /** Predicate function which removes the matching elements from the render. */
    ignoreElements?: (element: HTMLElement) => boolean;

    /** Timeout for loading images, in milliseconds. Setting it to 0 will result in no timeout. */
    imageTimeout?: number;

    /** Whether to render each letter seperately. Necessary if letter-spacing is used. */
    letterRendering?: boolean;

    /** Whether to log events in the console. */
    logging?: boolean;

    /** Callback function which is called when the Document has been cloned for rendering, can be used to modify the contents that will be rendered without affecting the original source document. */
    onclone?: { (doc: HTMLDocument): void };

    /** Url to the proxy which is to be used for loading cross-origin images. If left empty, cross-origin images won't be loaded. */
    proxy?: string;

    /** Whether to cleanup the cloned DOM elements html2canvas creates temporarily */
    removeContainer?: boolean;

    /** The scale to use for rendering. Defaults to the browsers device pixel ratio. */
    scale?: number;

    /** Use svg powered rendering where available (FF11+). */
    svgRendering?: boolean;

    /** Whether to test each image if it taints the canvas before drawing them */
    taintTest?: boolean;

    /** Whether to attempt to load cross-origin images as CORS served, before reverting back to proxy. */
    useCORS?: boolean;

    /** Define the width of the canvas in pixels. If null, renders with full width of the window. */
    width?: number;

    /** Define the heigt of the canvas in pixels. If null, renders with full height of the window. */
    height?: number;

    /** Crop canvas x-coordinate */
    x?: number;

    /** Crop canvas y-coordinate */
    y?: number;

    /** The x-scroll position to used when rendering element, (for example if the Element uses position: fixed ) */
    scrollX?: number;

    /** The y-scroll position to used when rendering element, (for example if the Element uses position: fixed ) */
    scrollY?: number;

    /** Window width to use when rendering Element, which may affect things like Media queries */
    windowWidth?: number;

    /** Window height to use when rendering Element, which may affect things like Media queries */
    windowHeight?: number;
  }

  export interface HTMLWorkerProgress extends Promise<any> {
    val: number;
    n: number;
    ratio: number;
    state: any;
    stack: Function[];
  }

  export interface HTMLWorker extends Promise<any> {
    from(
      src: HTMLElement | string,
      type: "container" | "canvas" | "img" | "pdf" | "context2d"
    ): HTMLWorker;
    progress: HTMLWorkerProgress;
    error(msg: string): void;
    save(filename: string): void;
    set(opt: HTMLOptions): HTMLWorker;
    get(key: "string"): HTMLWorker;
    get(key: "string", cbk: (value: string) => void): string;
  }

  export interface HTMLOptionImage {
    type: "jpeg" | "png" | "webp";
    quality: number;
  }

  export interface HTMLFontFace {
    family: string;
    style?: "italic" | "oblique" | "normal";
    stretch?:
      | "ultra-condensed"
      | "extra-condensed"
      | "condensed"
      | "semi-condensed"
      | "normal"
      | "semi-expanded"
      | "expanded"
      | "extra-expanded"
      | "ultra-expanded";
    weight?:
      | "normal"
      | "bold"
      | 100
      | 200
      | 300
      | 400
      | 500
      | 600
      | 700
      | 800
      | 900
      | "100"
      | "200"
      | "300"
      | "400"
      | "500"
      | "600"
      | "700"
      | "800"
      | "900";
    src: Array<{
      url: string;
      format: "truetype";
    }>;
  }

  export interface HTMLOptions {
    callback?: (doc: jsPDF) => void;
    margin?: number | number[];
    filename?: string;
    image?: HTMLOptionImage;
    html2canvas?: Html2CanvasOptions;
    jsPDF?: jsPDF;
    x?: number;
    y?: number;
    fontFaces?: HTMLFontFace[];
  }

  //jsPDF plugin: viewerPreferences

  export interface ViewerPreferencesInput {
    HideToolbar?: boolean;
    HideMenubar?: boolean;
    HideWindowUI?: boolean;
    FitWindow?: boolean;
    CenterWindow?: boolean;
    DisplayDocTitle?: boolean;
    NonFullScreenPageMode?: "UseNone" | "UseOutlines" | "UseThumbs" | "UseOC";
    Direction?: "L2R" | "R2L";
    ViewArea?: "MediaBox" | "CropBox" | "TrimBox" | "BleedBox" | "ArtBox";
    ViewClip?: "MediaBox" | "CropBox" | "TrimBox" | "BleedBox" | "ArtBox";
    PrintArea?: "MediaBox" | "CropBox" | "TrimBox" | "BleedBox" | "ArtBox";
    PrintClip?: "MediaBox" | "CropBox" | "TrimBox" | "BleedBox" | "ArtBox";
    PrintScaling?: "AppDefault" | "None";
    Duplex?: "Simplex" | "DuplexFlipShortEdge" | "DuplexFlipLongEdge" | "none";
    PickTrayByPDFSize?: boolean;
    PrintPageRange?: number[][];
    NumCopies?: number;
  }

  //jsPDF plugin: Outline

  export interface Outline {
    add(parent: any, title: string, options: OutlineOptions): OutlineItem;
  }
  export interface OutlineItem {
    title: string;
    options: any;
    children: any[];
  }
  export interface OutlineOptions {
    pageNumber: number;
  }
  // jsPDF plugin: AcroForm
  export abstract class AcroFormField {}
  export interface AcroFormField {
    constructor(): AcroFormField;
    showWhenPrinted: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    fieldName: string;
    fontName: string;
    fontStyle: string;
    fontSize: number;
    maxFontSize: number;
    color: string;
    defaultValue: string;
    value: string;
    hasAnnotation: boolean;
    readOnly: boolean;
    required: boolean;
    noExport: boolean;
    textAlign: "left" | "center" | "right";
  }

  export class AcroFormChoiceField {}
  export interface AcroFormChoiceField extends AcroFormField {
    topIndex: number;
    getOptions(): string[];
    setOptions(value: string[]): void;
    addOption(value: string): void;
    removeOption(value: string, allEntries: boolean): void;
    combo: boolean;
    edit: boolean;
    sort: boolean;
    multiSelect: boolean;
    doNotSpellCheck: boolean;
    commitOnSelChange: boolean;
  }

  export class AcroFormListBox {}
  export interface AcroFormListBox extends AcroFormChoiceField {}

  export class AcroFormComboBox {}
  export interface AcroFormComboBox extends AcroFormListBox {}

  export class AcroFormEditBox {}
  export interface AcroFormEditBox extends AcroFormComboBox {}

  export class AcroFormButton {}
  export interface AcroFormButton extends AcroFormField {
    noToggleToOff: boolean;
    radio: boolean;
    pushButton: boolean;
    radioIsUnison: boolean;
    caption: string;
    appearanceState: any;
  }

  export class AcroFormPushButton {}
  export interface AcroFormPushButton extends AcroFormButton {}

  export class AcroFormChildClass {}
  export interface AcroFormChildClass extends AcroFormField {
    Parent: any;
    optionName: string;
    caption: string;
    appearanceState: "On" | "Off";
  }

  export class AcroFormRadioButton {}
  export interface AcroFormRadioButton extends AcroFormButton {
    setAppearance(appearance: string): void;
    createOption(name: string): AcroFormChildClass;
  }

  export class AcroFormCheckBox {}
  export interface AcroFormCheckBox extends AcroFormButton {
    appearanceState: "On" | "Off";
  }

  export class AcroFormTextField {}
  export interface AcroFormTextField extends AcroFormField {
    multiline: boolean;
    fileSelect: boolean;
    doNotSpellCheck: boolean;
    doNotScroll: boolean;
    comb: boolean;
    richText: boolean;
    maxLength: number;
    hasAppearanceStream: boolean;
  }

  export class AcroFormPasswordField {}
  export interface AcroFormPasswordField extends AcroFormTextField {}
  // jsPDF plugin: Context2D

  export interface Gradient {
    addColorStop(position: number, color: string): void;
    getColor(): string;
  }

  export interface Context2d {
    autoPaging: boolean;
    fillStyle: string | Gradient;
    filter: string;
    font: string;
    globalAlpha: number;
    globalCompositeOperation: "source-over";
    imageSmoothingEnabled: boolean;
    imageSmoothingQuality: "low" | "high";
    ignoreClearRect: boolean;
    lastBreak: number;
    lineCap: "butt" | "round" | "square";
    lineDashOffset: number;
    lineJoin: "bevel" | "round" | "miter";
    lineWidth: number;
    miterLimit: number;
    pageBreaks: number[];
    pageWrapXEnabled: boolean;
    pageWrapYEnabled: boolean;
    posX: number;
    posY: number;
    shadowBlur: number;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
    strokeStyle: string | Gradient;
    textAlign: "right" | "end" | "center" | "left" | "start";
    textBaseline:
      | "alphabetic"
      | "bottom"
      | "top"
      | "hanging"
      | "middle"
      | "ideographic";
    arc(
      x: number,
      y: number,
      radius: number,
      startAngle: number,
      endAngle: number,
      counterclockwise: boolean
    ): void;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    beginPath(): void;
    bezierCurveTo(
      cp1x: number,
      cp1y: number,
      cp2x: number,
      cp2y: number,
      x: number,
      y: number
    ): void;
    clearRect(x: number, y: number, w: number, h: number): void;
    clip(): jsPDF;
    clipEvenOdd(): jsPDF;
    closePath(): void;
    createLinearGradient(
      x0: number,
      y0: number,
      x1: number,
      y1: number
    ): Gradient;
    createPattern(): Gradient;
    createRadialGradient(): Gradient;
    drawImage(
      img: string,
      x: number,
      y: number,
      width: number,
      height: number
    ): void;
    drawImage(
      img: string,
      sx: number,
      sy: number,
      swidth: number,
      sheight: number,
      x: number,
      y: number,
      width: number,
      height: number
    ): void;
    fill(): void;
    fillRect(x: number, y: number, w: number, h: number): void;
    fillText(text: string, x: number, y: number, maxWidth?: number): void;
    lineTo(x: number, y: number): void;
    measureText(text: string): number;
    moveTo(x: number, y: number): void;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    rect(x: number, y: number, w: number, h: number): void;
    restore(): void;
    rotate(angle: number): void;
    save(): void;
    scale(scalewidth: number, scaleheight: number): void;
    setTransform(
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
      f: number
    ): void;
    stroke(): void;
    strokeRect(x: number, y: number, w: number, h: number): void;
    strokeText(text: string, x: number, y: number, maxWidth?: number): void;
    transform(
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
      f: number
    ): void;
    translate(x: number, y: number): void;
  }

  export type ImageCompression = "NONE" | "FAST" | "MEDIUM" | "SLOW";
  export type ColorSpace =
    | "DeviceRGB"
    | "DeviceGray"
    | "DeviceCMYK"
    | "CalGray"
    | "CalRGB"
    | "Lab"
    | "ICCBased"
    | "Indexed"
    | "Pattern"
    | "Separation"
    | "DeviceN";

  export interface ImageOptions {
    imageData: string | HTMLImageElement | HTMLCanvasElement | Uint8Array;
    x: number;
    y: number;
    width: number;
    height: number;
    alias?: string;
    compression?: ImageCompression;
    rotation?: number;
  }
  export interface ImageProperties {
    alias: number;
    width: number;
    height: number;
    colorSpace: ColorSpace;
    bitsPerComponent: number;
    filter: string;
    decodeParameters?: string;
    transparency?: any;
    palette?: any;
    sMask?: any;
    predictor?: number;
    index: number;
    data: string;
  }

  export interface TextOptionsLight {
    align?: "left" | "center" | "right" | "justify";
    angle?: number | Matrix;
    baseline?:
      | "alphabetic"
      | "ideographic"
      | "bottom"
      | "top"
      | "middle"
      | "hanging";
    flags?: {
      noBOM: boolean;
      autoencode: boolean;
    };
    rotationDirection?: 0 | 1;
    charSpace?: number;
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

  export interface TableConfig {
    printHeaders?: boolean;
    autoSize?: boolean;
    margins?: number;
    fontSize?: number;
    padding?: number;
    headerBackgroundColor?: string;
    css?: {
      "font-size": number;
    };
  }

  export interface CellConfig {
    name: string;
    prompt: string;
    align: "left" | "center" | "right";
    padding: number;
    width: number;
  }

  export interface EncryptionOptions {
    userPassword?: string;
    ownerPassword?: string;
    userPermissions?: ("print" | "modify" | "copy" | "annot-forms")[];
  }

  export interface jsPDFOptions {
    orientation?: "p" | "portrait" | "l" | "landscape";
    unit?: "pt" | "px" | "in" | "mm" | "cm" | "ex" | "em" | "pc";
    format?: string | number[];
    compress?: boolean;
    precision?: number;
    filters?: string[];
    userUnit?: number;
    encryption?: EncryptionOptions;
  }

  export interface Point {
    x: number;
    y: number;
  }

  export interface Rectangle extends Point {
    w: number;
    h: number;
  }

  export interface PageInfo {
    objId: number;
    pageNumber: number;
    pageContext: any;
  }

  export interface Font {
    id: number;
    encoding: string;
    fontName: string;
    fontStyle: string;
    isStandardFont: boolean;
    metadata: any;
    objectNumber: number;
    postScriptName: string;
  }

  export interface DocumentProperties {
    title?: string;
    subject?: string;
    author?: string;
    keywords?: string;
    creator?: string;
  }

  export interface PatternData {
    key: string;
    matrix?: Matrix;
    boundingBox?: number[];
    xStep?: number;
    yStep?: number;
  }

  export interface PubSub {
    subscribe(
      topic: string,
      callback: (...args: any[]) => void,
      once?: boolean
    ): string;
    unsubscribe(token: string): boolean;
    publish(topic: string, ...args: any[]): void;
    getTopics(): Record<
      string,
      Record<string, [(...args: any[]) => void, boolean]>
    >;
  }

  export class jsPDF {
    constructor(options?: jsPDFOptions);
    constructor(
      orientation?: "p" | "portrait" | "l" | "landscape",
      unit?: "pt" | "px" | "in" | "mm" | "cm" | "ex" | "em" | "pc",
      format?: string | number[],
      compressPdf?: boolean
    );

    CapJoinStyles: any;
    version: string;

    compatAPI(body?: (pdf: jsPDF) => void): void;
    advancedAPI(body?: (pdf: jsPDF) => void): void;
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
        | "StandardEncoding"
        | "MacRomanEncoding"
        | "Identity-H"
        | "WinAnsiEncoding"
    ): string;
    addGState(key: string, gState: GState): jsPDF;
    addPage(
      format?: string | number[],
      orientation?: "p" | "portrait" | "l" | "landscape"
    ): jsPDF;
    beginFormObject(
      x: number,
      y: number,
      width: number,
      height: number,
      matrix: any
    ): jsPDF;
    circle(x: number, y: number, r: number, style: string): jsPDF;
    clip(rule?: "evenodd"): jsPDF;
    discardPath(): jsPDF;
    deletePage(targetPage: number): jsPDF;
    doFormObject(key: any, matrix: any): jsPDF;
    ellipse(
      x: number,
      y: number,
      rx: number,
      ry: number,
      style?: string
    ): jsPDF;
    endFormObject(key: any): jsPDF;
    f2(number: number): string;
    f3(number: number): string;
    getCharSpace(): number;
    getCreationDate(type: string): Date;
    getCurrentPageInfo(): PageInfo;
    getFileId(): string;
    getFillColor(): string;
    getFont(): Font;
    getFontList(): { [key: string]: string[] };
    getFontSize(): number;
    getFormObject(key: any): any;
    getLineHeight(): number;
    getLineHeightFactor(): number;
    getNumberOfPages(): number;
    getPageInfo(pageNumberOneBased: number): PageInfo;
    getR2L(): boolean;
    getStyle(style: string): string;
    getTextColor(): string;
    insertPage(beforePage: number): jsPDF;
    line(x1: number, y1: number, x2: number, y2: number): jsPDF;
    lines(
      lines: any[],
      x: any,
      y: any,
      scale?: any,
      style?: string,
      closed?: boolean
    ): jsPDF;
    clip(): jsPDF;
    clipEvenOdd(): jsPDF;
    discardPath(): jsPDF;
    close(): jsPDF;
    stroke(): jsPDF;
    fill(pattern?: PatternData): jsPDF;
    fillEvenOdd(pattern?: PatternData): jsPDF;
    fillStroke(pattern?: PatternData): jsPDF;
    fillStrokeEvenOdd(pattern?: PatternData): jsPDF;
    moveTo(x: number, y: number): jsPDF;
    lineTo(x: number, y: number): jsPDF;
    curveTo(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      x3: number,
      y3: number
    ): jsPDF;
    movePage(targetPage: number, beforePage: number): jsPDF;
    output(): string;
    output(type: "arraybuffer"): ArrayBuffer;
    output(type: "blob"): Blob;
    output(type: "bloburi" | "bloburl"): URL;
    output(
      type: "datauristring" | "dataurlstring",
      options?: { filename?: string }
    ): string;
    output(
      type: "pdfobjectnewwindow" | "pdfjsnewwindow" | "dataurlnewwindow"
    ): Window;
    output(
      type: "dataurl" | "datauri",
      options?: { filename?: string }
    ): boolean;
    pdfEscape(text: string, flags: any): string;
    path(lines?: any[], style?: string): jsPDF;
    rect(x: number, y: number, w: number, h: number, style?: string): jsPDF;
    restoreGraphicsState(): jsPDF;
    roundedRect(
      x: number,
      y: number,
      w: number,
      h: number,
      rx: number,
      ry: number,
      style: string
    ): jsPDF;
    save(filename?: string, options?: { returnPromise?: boolean }): jsPDF;
    saveGraphicsState(): jsPDF;
    setCharSpace(charSpace: number): jsPDF;
    setCreationDate(date?: Date | string): jsPDF;
    setCurrentTransformationMatrix(matrix: Matrix): jsPDF;
    setDisplayMode(
      zoom:
        | undefined
        | null
        | number
        | "fullheight"
        | "fullwidth"
        | "fullpage"
        | "original"
        | string,
      layout?:
        | undefined
        | null
        | "continuous"
        | "single"
        | "twoleft"
        | "tworight"
        | "two",
      pmode?: undefined | null | "UseOutlines" | "UseThumbs" | "FullScreen"
    ): jsPDF;
    setDocumentProperties(properties: DocumentProperties): jsPDF;
    setProperties(properties: DocumentProperties): jsPDF;
    setDrawColor(ch1: string): jsPDF;
    setDrawColor(ch1: number): jsPDF;
    setDrawColor(ch1: number, ch2: number, ch3: number, ch4?: number): jsPDF;
    setFileId(value: string): jsPDF;
    setFillColor(ch1: string): jsPDF;
    setFillColor(ch1: number, ch2: number, ch3: number, ch4?: number): jsPDF;
    setFont(
      fontName: string,
      fontStyle?: string,
      fontWeight?: string | number
    ): jsPDF;
    setFontSize(size: number): jsPDF;
    setGState(gState: any): jsPDF;
    setLineCap(style: string | number): jsPDF;
    setLineDashPattern(dashArray: number[], dashPhase: number): jsPDF;
    setLineHeightFactor(value: number): jsPDF;
    setLineJoin(style: string | number): jsPDF;
    setLineMiterLimit(length: number): jsPDF;
    setLineWidth(width: number): jsPDF;
    setPage(pageNumber: number): jsPDF;
    setR2L(value: boolean): jsPDF;
    setTextColor(ch1: string): jsPDF;
    setTextColor(ch1: number): jsPDF;
    setTextColor(ch1: number, ch2: number, ch3: number, ch4?: number): jsPDF;
    text(
      text: string | string[],
      x: number,
      y: number,
      options?: TextOptionsLight,
      transform?: number | any
    ): jsPDF;
    triangle(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      x3: number,
      y3: number,
      style: string
    ): jsPDF;
    getHorizontalCoordinateString(value: number): number;
    getVerticalCoordinateString(value: number): number;

    internal: {
      events: PubSub;
      scaleFactor: number;
      pageSize: {
        width: number;
        getWidth: () => number;
        height: number;
        getHeight: () => number;
      };
      pages: number[];
      getEncryptor(objectId: number): (data: string) => string;
    };

    /**
     * jsPDF plugins below:
     *
     *  - AcroForm
     *  - AddImage
     *  - Annotations
     *  - AutoPrint
     *  - Canvas
     *  - Cell
     *  - Context2D
     *  - fileloading
     *  - html
     *  - JavaScript
     *  - split_text_to_size
     *  - SVG
     *  - total_pages
     *  - utf8
     *  - vfs
     *  - xmp_metadata
     */

    // jsPDF plugin: addImage
    addImage(
      imageData: string | HTMLImageElement | HTMLCanvasElement | Uint8Array,
      format: string,
      x: number,
      y: number,
      w: number,
      h: number,
      alias?: string,
      compression?: ImageCompression,
      rotation?: number
    ): jsPDF;
    addImage(
      imageData: string | HTMLImageElement | HTMLCanvasElement | Uint8Array,
      x: number,
      y: number,
      w: number,
      h: number,
      alias?: string,
      compression?: ImageCompression,
      rotation?: number
    ): jsPDF;
    addImage(options: ImageOptions): jsPDF;
    getImageProperties(
      imageData: string | HTMLImageElement | HTMLCanvasElement | Uint8Array
    ): ImageProperties;

    // jsPDF plugin: arabic
    processArabic(text: string): string;

    // jsPDF plugin: Annotations
    createAnnotation(options: Annotation): void;
    link(x: number, y: number, w: number, h: number, options: any): void;
    textWithLink(text: string, x: number, y: number, options: any): number;
    getTextWidth(text: string): number;

    // jsPDF plugin: AutoPrint
    autoPrint(options?: AutoPrintInput): jsPDF;

    // jsPDF plugin: AcroForm
    addField(field: AcroFormField): jsPDF;

    AcroForm: {
      ChoiceField(): AcroFormChoiceField;
      ListBox(): AcroFormListBox;
      ComboBox(): AcroFormComboBox;
      EditBox(): AcroFormEditBox;
      Button(): AcroFormButton;
      PushButton(): AcroFormPushButton;
      RadioButton(): AcroFormRadioButton;
      CheckBox(): AcroFormCheckBox;
      TextField(): AcroFormTextField;
      PasswordField(): AcroFormPasswordField;
      Appearance(): any;
    };

    // jsPDF plugin: Canvas
    canvas: {
      pdf: jsPDF;
      width: number;
      height: number;
      getContext(type?: string): Context2d;
      style: any;
    };

    // jsPDF plugin: Cell
    setHeaderFunction(
      func: (jsPDFInstance: jsPDF, pages: number) => number[]
    ): jsPDF;
    getTextDimensions(
      text: string,
      options?: {
        font?: string;
        fontSize?: number;
        maxWidth?: number;
        scaleFactor?: number;
      }
    ): { w: number; h: number };

    cellAddPage(): jsPDF;
    cell(
      x: number,
      y: number,
      w: number,
      h: number,
      txt: string,
      ln: number,
      align: string
    ): jsPDF;
    table(
      x: number,
      y: number,
      data: { [key: string]: string }[],
      headers: string[] | CellConfig[],
      config: TableConfig
    ): jsPDF;
    calculateLineHeight(
      headerNames: string[],
      columnWidths: number[],
      model: any[]
    ): number;
    setTableHeaderRow(config: CellConfig[]): void;
    printHeaderRow(lineNumber: number, new_page?: boolean): void;

    context2d: Context2d;

    //jsPDF plugin: Outline
    outline: Outline;
    // jsPDF plugin: fileloading
    loadFile(url: string, sync?: true): string;
    loadFile(
      url: string,
      sync: false,
      callback: (data: string) => string
    ): void;

    // jsPDF plugin: html
    html(src: string | HTMLElement, options?: HTMLOptions): Promise<HTMLWorker>;

    // jsPDF plugin: JavaScript
    addJS(javascript: string): jsPDF;

    // jsPDF plugin: split_text_to_size
    getCharWidthsArray(text: string, options?: any): any[];
    getStringUnitWidth(text: string, options?: any): number;
    splitTextToSize(text: string, maxlen: number, options?: any): any;

    // jsPDF plugin: SVG
    addSvgAsImage(
      svg: string,
      x: number,
      y: number,
      w: number,
      h: number,
      alias?: string,
      compression?: boolean,
      rotation?: number
    ): jsPDF;
    // jsPDF plugin: setlanguage
    setLanguage(
      langCode:
        | "af"
        | "sq"
        | "ar"
        | "ar-DZ"
        | "ar-BH"
        | "ar-EG"
        | "ar-IQ"
        | "ar-JO"
        | "ar-KW"
        | "ar-LB"
        | "ar-LY"
        | "ar-MA"
        | "ar-OM"
        | "ar-QA"
        | "ar-SA"
        | "ar-SY"
        | "ar-TN"
        | "ar-AE"
        | "ar-YE"
        | "an"
        | "hy"
        | "as"
        | "ast"
        | "az"
        | "eu"
        | "be"
        | "bn"
        | "bs"
        | "br"
        | "bg"
        | "my"
        | "ca"
        | "ch"
        | "ce"
        | "zh"
        | "zh-HK"
        | "zh-CN"
        | "zh-SG"
        | "zh-TW"
        | "cv"
        | "co"
        | "cr"
        | "hr"
        | "cs"
        | "da"
        | "nl"
        | "nl-BE"
        | "en"
        | "en-AU"
        | "en-BZ"
        | "en-CA"
        | "en-IE"
        | "en-JM"
        | "en-NZ"
        | "en-PH"
        | "en-ZA"
        | "en-TT"
        | "en-GB"
        | "en-US"
        | "en-ZW"
        | "eo"
        | "et"
        | "fo"
        | "fj"
        | "fi"
        | "fr"
        | "fr-BE"
        | "fr-CA"
        | "fr-FR"
        | "fr-LU"
        | "fr-MC"
        | "fr-CH"
        | "fy"
        | "fur"
        | "gd"
        | "gd-IE"
        | "gl"
        | "ka"
        | "de"
        | "de-AT"
        | "de-DE"
        | "de-LI"
        | "de-LU"
        | "de-CH"
        | "el"
        | "gu"
        | "ht"
        | "he"
        | "hi"
        | "hu"
        | "is"
        | "id"
        | "iu"
        | "ga"
        | "it"
        | "it-CH"
        | "ja"
        | "kn"
        | "ks"
        | "kk"
        | "km"
        | "ky"
        | "tlh"
        | "ko"
        | "ko-KP"
        | "ko-KR"
        | "la"
        | "lv"
        | "lt"
        | "lb"
        | "mk"
        | "ms"
        | "ml"
        | "mt"
        | "mi"
        | "mr"
        | "mo"
        | "nv"
        | "ng"
        | "ne"
        | "no"
        | "nb"
        | "nn"
        | "oc"
        | "or"
        | "om"
        | "fa"
        | "fa-IR"
        | "pl"
        | "pt"
        | "pt-BR"
        | "pa"
        | "pa-IN"
        | "pa-PK"
        | "qu"
        | "rm"
        | "ro"
        | "ro-MO"
        | "ru"
        | "ru-MO"
        | "sz"
        | "sg"
        | "sa"
        | "sc"
        | "sd"
        | "si"
        | "sr"
        | "sk"
        | "sl"
        | "so"
        | "sb"
        | "es"
        | "es-AR"
        | "es-BO"
        | "es-CL"
        | "es-CO"
        | "es-CR"
        | "es-DO"
        | "es-EC"
        | "es-SV"
        | "es-GT"
        | "es-HN"
        | "es-MX"
        | "es-NI"
        | "es-PA"
        | "es-PY"
        | "es-PE"
        | "es-PR"
        | "es-ES"
        | "es-UY"
        | "es-VE"
        | "sx"
        | "sw"
        | "sv"
        | "sv-FI"
        | "sv-SV"
        | "ta"
        | "tt"
        | "te"
        | "th"
        | "tig"
        | "ts"
        | "tn"
        | "tr"
        | "tk"
        | "uk"
        | "hsb"
        | "ur"
        | "ve"
        | "vi"
        | "vo"
        | "wa"
        | "cy"
        | "xh"
        | "ji"
        | "zu"
    ): jsPDF;

    // jsPDF plugin: total_pages
    putTotalPages(pageExpression: string): jsPDF;

    // jsPDF plugin: viewerpreferences
    viewerPreferences(
      options: ViewerPreferencesInput,
      doReset?: boolean
    ): jsPDF;
    viewerPreferences(arg: "reset"): jsPDF;

    // jsPDF plugin: vfs
    existsFileInVFS(filename: string): boolean;
    addFileToVFS(filename: string, filecontent: string): jsPDF;
    getFileFromVFS(filename: string): string;

    // jsPDF plugin: xmp_metadata
    addMetadata(metadata: string, namespaceuri?: string): jsPDF;

    Matrix(
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
      f: number
    ): Matrix;
    matrixMult(m1: Matrix, m2: Matrix): Matrix;
    unitMatrix: Matrix;

    GState(parameters: GState): GState;

    ShadingPattern(
      type: ShadingPatternType,
      coords: number[],
      colors: ShadingPatterStop[],
      gState?: GState,
      matrix?: Matrix
    ): ShadingPattern;
    TilingPattern(
      boundingBox: number[],
      xStep: number,
      yStep: number,
      gState?: GState,
      matrix?: Matrix
    ): TilingPattern;

    addShadingPattern(key: string, pattern: ShadingPattern): jsPDF;
    beginTilingPattern(pattern: TilingPattern): void;
    endTilingPattern(key: string, pattern: TilingPattern): void;

    static API: jsPDFAPI;
    static version: string;
  }

  export class GState {
    constructor(parameters: GState);
  }

  export interface GState {
    opacity?: number;
    "stroke-opacity"?: number;
  }

  export interface Matrix {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;

    sx: number;
    shy: number;
    shx: number;
    sy: number;
    tx: number;
    ty: number;

    join(separator?: string): string;
    multiply(matrix: Matrix): Matrix;
    decompose(): {
      scale: Matrix;
      translate: Matrix;
      rotate: Matrix;
      skew: Matrix;
    };
    toString(): string;
    inversed(): Matrix;
    applyToPoint(point: Point): Point;
    applyToRectangle(rect: Rectangle): Rectangle;
    clone(): Matrix;
  }

  export interface Pattern {
    gState?: GState;
    matrix?: Matrix;
  }

  export interface ShadingPatterStop {
    offset: number;
    color: number[];
  }

  export type ShadingPatternType = "axial" | "radial";

  export class ShadingPattern {
    constructor(
      type: ShadingPatternType,
      coords: number[],
      colors: ShadingPatterStop[],
      gState?: GState,
      matrix?: Matrix
    );
  }
  export interface ShadingPattern extends Pattern {
    coords: number[];
    colors: ShadingPatterStop[];
  }

  export class TilingPattern {
    constructor(
      boundingBox: number[],
      xStep: number,
      yStep: number,
      gState?: GState,
      matrix?: Matrix
    );
  }

  export interface TilingPattern extends Pattern {
    boundingBox: number[];
    xStep: number;
    yStep: number;
  }

  export interface jsPDFAPI {
    events: any[];
  }

  export default jsPDF;
}
