/**
 * @license
 * Copyright (c) 2018 Erik Koopmans
 * Released under the MIT License.
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

import { jsPDF } from "../jspdf.js";
import { normalizeFontFace } from "../libs/fontFace.js";
import { globalObject } from "../libs/globalObject.js";
import type { FontFaceInput, NormalizedFontFace } from "../libs/fontFace.js";
import type {
  jsPDFAPI as JsPDFAPI,
  jsPDFDocument,
  OutputOptions,
  PageFormats
} from "../types.js";

// Ambient declarations for the module-format-specific branches kept inside
// "@if MODULE_FORMAT" preprocess directive blocks.
declare const require: ((id: string) => unknown) &
  ((deps: string[], callback: (mod: unknown) => unknown) => unknown);
declare const module: { exports: unknown } | undefined;
declare const exports: unknown;
declare const define:
  (((...args: unknown[]) => unknown) & { amd?: unknown }) | undefined;

/** Minimal call surface of the lazily loaded html2canvas library. */
type Html2CanvasStatic = (
  element: HTMLElement,
  options?: Html2CanvasOptions
) => Promise<HTMLCanvasElement>;

/** Shape returned by the html2canvas loader before unwrapping `default`. */
type Html2CanvasModule = Html2CanvasStatic & { default?: Html2CanvasStatic };

/** Minimal call surface of the lazily loaded dompurify library. */
type DOMPurifyStatic = {
  sanitize(source: string): string;
};

/** Shape returned by the dompurify loader before unwrapping `default`. */
type DOMPurifyModule = DOMPurifyStatic & { default?: DOMPurifyStatic };

/** html2canvas options (adapted from types/index.d.ts `Html2CanvasOptions`). */
type Html2CanvasOptions = {
  async?: boolean;
  allowTaint?: boolean;
  backgroundColor?: string | null;
  canvas?: unknown;
  foreignObjectRendering?: boolean;
  ignoreElements?: (element: HTMLElement) => boolean;
  imageTimeout?: number;
  letterRendering?: boolean;
  logging?: boolean;
  onclone?: (doc: Document) => void;
  proxy?: string | null;
  removeContainer?: boolean;
  scale?: number;
  svgRendering?: boolean;
  taintTest?: boolean;
  useCORS?: boolean;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  scrollX?: number;
  scrollY?: number;
  windowWidth?: number;
  windowHeight?: number;
  /** Legacy html2canvas option handled explicitly by this plugin. */
  onrendered?: (canvas: HTMLCanvasElement) => void;
  /** Consumed by `cloneNode` when duplicating the source element. */
  javascriptEnabled?: boolean;
};

/** Image settings used when converting HTML to an image (types/index.d.ts `HTMLOptionImage`). */
type HTMLOptionImage = {
  type: "jpeg" | "png" | "webp";
  quality: number;
};

/** Page-size descriptor produced by `jsPDF.getPageSize` (plus the derived `inner` field). */
type HTMLWorkerPageSize = {
  width: number;
  height: number;
  unit: string;
  k: number;
  orientation: string;
  inner?: {
    width: number;
    height: number;
    px?: { width: number; height: number };
    ratio?: number;
  };
};

/** Internal state stored on `worker.prop`. */
type HTMLWorkerProp = {
  src: HTMLElement | null;
  container: HTMLElement | null;
  overlay: HTMLElement | null;
  canvas: HTMLCanvasElement | null;
  img: HTMLImageElement | null;
  pdf: jsPDFDocument | null;
  pageSize: HTMLWorkerPageSize | null;
  callback: (pdf: jsPDFDocument) => void;
};

/** Progress bookkeeping stored on `worker.progress`. */
type HTMLWorkerProgress = {
  val: number;
  /** Holds the pending callback (or the Worker itself); only ever used for bookkeeping. */
  state: unknown;
  n: number;
  stack: unknown[];
  ratio?: number;
};

/** Normalized options stored on `worker.opt`. */
type HTMLWorkerOptions = {
  filename: string;
  margin: number[];
  enableLinks: boolean;
  x: number;
  y: number;
  html2canvas: Html2CanvasOptions;
  jsPDF: jsPDFDocument;
  backgroundColor: string;
  width?: number;
  windowWidth?: number;
  scrollX?: number;
  scrollY?: number;
  autoPaging?: boolean | "slice" | "text";
  image?: HTMLOptionImage;
  fontFaces?: NormalizedFontFace[] | null;
  worker?: boolean;
};

/**
 * User-facing options accepted by `doc.html()` (adapted from
 * types/index.d.ts `HTMLOptions`).
 */
type HTMLOptions = {
  callback?: (doc: jsPDFDocument) => void;
  margin?: number | number[];
  autoPaging?: boolean | "slice" | "text";
  filename?: string;
  enableLinks?: boolean;
  image?: HTMLOptionImage;
  html2canvas?: Html2CanvasOptions;
  jsPDF?: jsPDFDocument;
  x?: number;
  y?: number;
  width?: number;
  windowWidth?: number;
  scrollX?: number;
  scrollY?: number;
  backgroundColor?: string;
  fontFaces?: FontFaceInput[] | null;
  worker?: boolean;
  pageSize?: HTMLWorkerPageSize | null;
};

/** Input accepted by `worker.set()`: predefined props and arbitrary options. */
type HTMLWorkerSetInput = HTMLOptions & Partial<HTMLWorkerProp>;

/** Snapshot template cloned into every new Worker. */
type HTMLWorkerTemplate = {
  prop: HTMLWorkerProp;
  progress: HTMLWorkerProgress;
  opt: HTMLWorkerOptions;
};

/** Promise-chain callback invoked with `this` bound to the Worker. */
type HTMLWorkerCallback = (this: HTMLWorker, value?: unknown) => unknown;

/** Base `then` implementation swapped in by `Worker.prototype.then`. */
type HTMLWorkerThenBase = (
  this: Promise<unknown>,
  onFulfilled?: HTMLWorkerCallback,
  onRejected?: HTMLWorkerCallback
) => Promise<unknown>;

/**
 * The Worker returned by `doc.html()`: a Promise whose prototype chain has
 * been hijacked to expose the chainable conversion methods below (adapted
 * from types/index.d.ts `HTMLWorker`).
 */
interface HTMLWorker {
  prop: HTMLWorkerProp;
  progress: HTMLWorkerProgress;
  opt: HTMLWorkerOptions;
  from(src: string | HTMLElement, type?: string): HTMLWorker;
  to(target: string): HTMLWorker;
  toContainer(): HTMLWorker;
  toCanvas(): HTMLWorker;
  toContext2d(): HTMLWorker;
  toImg(): HTMLWorker;
  toPdf(): HTMLWorker;
  output(
    type?: string,
    options?: OutputOptions | string,
    src?: string
  ): HTMLWorker;
  outputPdf(type?: string, options?: OutputOptions | string): HTMLWorker;
  outputImg(type?: string, options?: unknown): HTMLWorker;
  save(filename?: string): HTMLWorker;
  doCallback(): HTMLWorker;
  set(opt?: HTMLWorkerSetInput | null): HTMLWorker;
  get(key: string, cbk?: (value: unknown) => unknown): HTMLWorker;
  setMargin(margin: number | number[]): HTMLWorker;
  setPageSize(pageSize?: HTMLWorkerPageSize | null): HTMLWorker;
  setProgress(
    val?: number | null,
    state?: unknown,
    n?: number | null,
    stack?: unknown[] | null
  ): HTMLWorker;
  updateProgress(
    val?: number | null,
    state?: unknown,
    n?: number | null,
    stack?: unknown[] | null
  ): HTMLWorker;
  then<T = unknown>(
    onFulfilled?: (this: HTMLWorker, value: T) => unknown,
    onRejected?: HTMLWorkerCallback
  ): HTMLWorker;
  thenCore(
    onFulfilled?: HTMLWorkerCallback,
    onRejected?: HTMLWorkerCallback,
    thenBase?: HTMLWorkerThenBase
  ): HTMLWorker;
  thenExternal(
    onFulfilled?: (value: unknown) => unknown,
    onRejected?: (reason: unknown) => unknown
  ): Promise<unknown>;
  thenList(fns: Array<(this: HTMLWorker) => unknown>): HTMLWorker;
  catch(onRejected?: HTMLWorkerCallback): HTMLWorker;
  catchExternal(onRejected?: (reason: unknown) => unknown): Promise<unknown>;
  error(msg: string): HTMLWorker;
  using: HTMLWorker["set"];
  saveAs: HTMLWorker["save"];
  export: HTMLWorker["output"];
  run: HTMLWorker["then"];
}

/** Static surface of the classic function-constructor `Worker` below. */
interface HTMLWorkerConstructor {
  (this: HTMLWorker, opt?: HTMLOptions | null): HTMLWorker;
  new (opt?: HTMLOptions | null): HTMLWorker;
  prototype: HTMLWorker;
  convert(
    promise: Promise<unknown> | object,
    inherit?: object | null
  ): HTMLWorker;
  template: HTMLWorkerTemplate;
}

/** Options-object form of the first `jsPDF.getPageSize` parameter. */
type GetPageSizeOptions = {
  orientation?: string;
  unit?: string;
  format?: string | number[];
};

/** `jsPDF.getPageSize` static installed by this plugin. */
type GetPageSizeFn = (
  orientation?: string | GetPageSizeOptions | jsPDFDocument,
  unit?: string,
  format?: string | number[]
) => HTMLWorkerPageSize;

declare module "../types.js" {
  interface jsPDFAPI {
    /**
     * Generate a PDF from an HTML element or string (html plugin,
     * src/modules/html.ts). See the JSDoc on the implementation for details.
     */
    html(
      this: jsPDFDocument,
      src: string | HTMLElement,
      options?: HTMLOptions
    ): HTMLWorker;
  }
}

/**
 * jsPDF html PlugIn
 *
 * @name html
 * @module
 */
(function (jsPDFAPI: JsPDFAPI) {
  "use strict";

  function loadHtml2Canvas(): Promise<Html2CanvasStatic> {
    return (
      (function (): Promise<unknown> {
        if (globalObject["html2canvas"]) {
          return Promise.resolve(globalObject["html2canvas"]);
        }

        // @if MODULE_FORMAT='es'
        return import("html2canvas");
        // @endif

        // @if MODULE_FORMAT!='es'
        if (typeof exports === "object" && typeof module !== "undefined") {
          return new Promise(function (resolve, reject) {
            try {
              resolve(require("html2canvas"));
            } catch (e) {
              reject(e);
            }
          });
        }
        if (typeof define === "function" && define.amd) {
          return new Promise(function (resolve, reject) {
            try {
              require(["html2canvas"], resolve);
            } catch (e) {
              reject(e);
            }
          });
        }
        return Promise.reject(new Error("Could not load html2canvas"));
        // @endif
      })() as Promise<Html2CanvasModule>
    )
      .catch(function (e) {
        return Promise.reject(new Error("Could not load html2canvas: " + e));
      })
      .then(function (html2canvas) {
        return html2canvas.default ? html2canvas.default : html2canvas;
      });
  }

  function loadDomPurify(): Promise<DOMPurifyStatic> {
    return (
      (function (): Promise<unknown> {
        if (globalObject["DOMPurify"]) {
          return Promise.resolve(globalObject["DOMPurify"]);
        }

        // @if MODULE_FORMAT='es'
        return import("dompurify");
        // @endif

        // @if MODULE_FORMAT!='es'
        if (typeof exports === "object" && typeof module !== "undefined") {
          return new Promise(function (resolve, reject) {
            try {
              resolve(require("dompurify"));
            } catch (e) {
              reject(e);
            }
          });
        }
        if (typeof define === "function" && define.amd) {
          return new Promise(function (resolve, reject) {
            try {
              require(["dompurify"], resolve);
            } catch (e) {
              reject(e);
            }
          });
        }
        return Promise.reject(new Error("Could not load dompurify"));
        // @endif
      })() as Promise<DOMPurifyModule>
    )
      .catch(function (e) {
        return Promise.reject(new Error("Could not load dompurify: " + e));
      })
      .then(function (dompurify) {
        return dompurify.default ? dompurify.default : dompurify;
      });
  }

  /**
   * Determine the type of a variable/object.
   *
   * @private
   * @ignore
   */
  var objType = function (obj: unknown) {
    var type = typeof obj;
    if (type === "undefined") return "undefined";
    else if (type === "string" || obj instanceof String) return "string";
    else if (type === "number" || obj instanceof Number) return "number";
    else if (type === "function" || obj instanceof Function) return "function";
    else if (!!obj && (obj as { constructor: unknown }).constructor === Array)
      return "array";
    else if (obj && (obj as { nodeType?: number }).nodeType === 1)
      return "element";
    else if (type === "object") return "object";
    else return "unknown";
  };

  /**
   * Create an HTML element with optional className, innerHTML, and style.
   *
   * @private
   * @ignore
   */
  var createElement = function (
    tagName: string,
    opt: {
      className?: string;
      innerHTML?: string;
      dompurify?: DOMPurifyStatic;
      style?: Record<string, string | number>;
    }
  ): HTMLElement {
    var el = document.createElement(tagName);
    if (opt.className) el.className = opt.className;
    if (opt.innerHTML && opt.dompurify) {
      el.innerHTML = opt.dompurify.sanitize(opt.innerHTML);
    }
    for (var key in opt.style) {
      // The style templates use raw numbers for some properties (historical
      // behavior); CSSStyleDeclaration declares no string index signature, so
      // widen at this boundary.
      (el.style as unknown as Record<string, string | number>)[key] =
        opt.style[key];
    }
    return el;
  };

  /**
   * Deep-clone a node and preserve contents/properties.
   *
   * @private
   * @ignore
   */
  var cloneNode = function (node: Node, javascriptEnabled?: boolean): Node {
    // Recursively clone the node.
    var clone =
      node.nodeType === 3
        ? document.createTextNode(node.nodeValue)
        : node.cloneNode(false);
    for (var child = node.firstChild; child; child = child.nextSibling) {
      if (
        javascriptEnabled === true ||
        child.nodeType !== 1 ||
        child.nodeName !== "SCRIPT"
      ) {
        clone.appendChild(cloneNode(child, javascriptEnabled));
      }
    }

    if (node.nodeType === 1) {
      // Preserve contents/properties of special nodes.
      if (node.nodeName === "CANVAS") {
        (clone as HTMLCanvasElement).width = (node as HTMLCanvasElement).width;
        (clone as HTMLCanvasElement).height = (
          node as HTMLCanvasElement
        ).height;
        (clone as HTMLCanvasElement)
          .getContext("2d")
          .drawImage(node as HTMLCanvasElement, 0, 0);
      } else if (node.nodeName === "TEXTAREA" || node.nodeName === "SELECT") {
        (clone as HTMLTextAreaElement).value = (
          node as HTMLTextAreaElement
        ).value;
      }

      // Preserve the node's scroll position when it loads.
      clone.addEventListener(
        "load",
        function () {
          (clone as HTMLElement).scrollTop = (node as HTMLElement).scrollTop;
          (clone as HTMLElement).scrollLeft = (node as HTMLElement).scrollLeft;
        },
        true
      );
    }

    // Return the cloned node.
    return clone;
  };

  /* ----- CONSTRUCTOR ----- */

  var Worker = function Worker(
    this: HTMLWorker,
    opt?: HTMLOptions | null
  ): HTMLWorker {
    // Create the root parent for the proto chain, and the starting Worker.
    var root: HTMLWorker = Object.assign(
      (Worker as HTMLWorkerConstructor).convert(Promise.resolve()),
      JSON.parse(
        JSON.stringify((Worker as HTMLWorkerConstructor).template)
      ) as HTMLWorkerTemplate
    );
    var self = (Worker as HTMLWorkerConstructor).convert(
      Promise.resolve(),
      root
    );

    // Set progress, optional settings, and return.
    self = self.setProgress(1, Worker, 1, [Worker]);
    self = self.set(opt);
    return self;
    // The classic function-constructor pattern is invisible to the type
    // system; assert the assembled constructor type at this single boundary.
  } as HTMLWorkerConstructor;

  // Boilerplate for subclassing Promise.
  Worker.prototype = Object.create(Promise.prototype);
  Worker.prototype.constructor = Worker;

  // Converts/casts promises into Workers.
  Worker.convert = function convert(promise, inherit) {
    // Uses prototypal inheritance to receive changes made to ancestors' properties.
    (promise as { __proto__: object | null }).__proto__ =
      inherit || Worker.prototype;
    return promise as HTMLWorker;
  };

  Worker.template = {
    prop: {
      src: null,
      container: null,
      overlay: null,
      canvas: null,
      img: null,
      pdf: null,
      pageSize: null,
      callback: function () {}
    },
    progress: {
      val: 0,
      state: null,
      n: 0,
      stack: []
    },
    opt: {
      filename: "file.pdf",
      margin: [0, 0, 0, 0],
      enableLinks: true,
      x: 0,
      y: 0,
      html2canvas: {},
      // Placeholder only; a real document instance is injected via
      // `set({ jsPDF })` before any use.
      jsPDF: {} as jsPDFDocument,
      backgroundColor: "transparent"
    }
  };

  /* ----- FROM / TO ----- */

  Worker.prototype.from = function from(
    this: HTMLWorker,
    src: string | HTMLElement,
    type?: string
  ) {
    function getType(src: string | HTMLElement) {
      switch (objType(src)) {
        case "string":
          return "string";
        case "element":
          return (src as HTMLElement).nodeName.toLowerCase() === "canvas"
            ? "canvas"
            : "element";
        default:
          return "unknown";
      }
    }

    return this.then(function from_main(this: HTMLWorker) {
      type = type || getType(src);
      switch (type) {
        case "string":
          return this.then(loadDomPurify).then(function (
            this: HTMLWorker,
            dompurify: DOMPurifyStatic
          ) {
            return this.set({
              src: createElement("div", {
                innerHTML: src as string,
                dompurify: dompurify
              })
            });
          });
        case "element":
          return this.set({ src: src as HTMLElement });
        case "canvas":
          return this.set({ canvas: src as HTMLCanvasElement });
        case "img":
          return this.set({ img: src as HTMLImageElement });
        default:
          return this.error("Unknown source type.");
      }
    });
  };

  Worker.prototype.to = function to(this: HTMLWorker, target: string) {
    // Route the 'to' request to the appropriate method.
    switch (target) {
      case "container":
        return this.toContainer();
      case "canvas":
        return this.toCanvas();
      case "img":
        return this.toImg();
      case "pdf":
        return this.toPdf();
      default:
        return this.error("Invalid target.");
    }
  };

  Worker.prototype.toContainer = function toContainer(this: HTMLWorker) {
    // Set up function prerequisites.
    var prereqs = [
      function checkSrc(this: HTMLWorker) {
        return (
          this.prop.src || this.error("Cannot duplicate - no source HTML.")
        );
      },
      function checkPageSize(this: HTMLWorker) {
        return this.prop.pageSize || this.setPageSize();
      }
    ];
    return this.thenList(prereqs).then(function toContainer_main(
      this: HTMLWorker
    ) {
      // Define the CSS styles for the container and its overlay parent.
      var overlayCSS = {
        position: "fixed",
        overflow: "hidden",
        zIndex: 1000,
        left: "-100000px",
        right: 0,
        bottom: 0,
        top: 0
      };
      var containerCSS: Record<string, string | number> = {
        position: "relative",
        display: "inline-block",
        width:
          (typeof this.opt.width === "number" &&
          !isNaN(this.opt.width) &&
          typeof this.opt.windowWidth === "number" &&
          !isNaN(this.opt.windowWidth)
            ? this.opt.windowWidth
            : Math.max(
                this.prop.src.clientWidth,
                this.prop.src.scrollWidth,
                this.prop.src.offsetWidth
              )) + "px",
        left: 0,
        right: 0,
        top: 0,
        margin: "auto",
        backgroundColor: this.opt.backgroundColor
      }; // Set the overlay to hidden (could be changed in the future to provide a print preview).

      var source = cloneNode(
        this.prop.src,
        this.opt.html2canvas.javascriptEnabled
      );

      if ((source as HTMLElement).tagName === "BODY") {
        containerCSS.height =
          Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
          ) + "px";
      }

      this.prop.overlay = createElement("div", {
        className: "html2pdf__overlay",
        style: overlayCSS
      });
      this.prop.container = createElement("div", {
        className: "html2pdf__container",
        style: containerCSS
      });
      this.prop.container.appendChild(source);
      this.prop.container.firstChild.appendChild(
        createElement("div", {
          style: {
            clear: "both",
            border: "0 none transparent",
            margin: 0,
            padding: 0,
            height: 0
          }
        })
      );
      this.prop.container.style.float = "none";
      this.prop.overlay.appendChild(this.prop.container);
      document.body.appendChild(this.prop.overlay);
      (this.prop.container.firstChild as HTMLElement).style.position =
        "relative";
      // Historical expando: `height` is not a real HTMLElement property.
      (this.prop.container as HTMLElement & { height?: string }).height =
        Math.max(
          (this.prop.container.firstChild as HTMLElement).clientHeight,
          (this.prop.container.firstChild as HTMLElement).scrollHeight,
          (this.prop.container.firstChild as HTMLElement).offsetHeight
        ) + "px";
    });
  };

  Worker.prototype.toCanvas = function toCanvas(this: HTMLWorker) {
    // Set up function prerequisites.
    var prereqs = [
      function checkContainer(this: HTMLWorker) {
        return (
          document.body.contains(this.prop.container) || this.toContainer()
        );
      }
    ];

    // Fulfill prereqs then create the canvas.
    return this.thenList(prereqs)
      .then(loadHtml2Canvas)
      .then(function toCanvas_main(
        this: HTMLWorker,
        html2canvas: Html2CanvasStatic
      ) {
        // Handle old-fashioned 'onrendered' argument.
        var options = Object.assign({}, this.opt.html2canvas);
        delete options.onrendered;

        return html2canvas(this.prop.container, options);
      })
      .then(function toCanvas_post(
        this: HTMLWorker,
        canvas: HTMLCanvasElement
      ) {
        // Handle old-fashioned 'onrendered' argument.
        var onRendered = this.opt.html2canvas.onrendered || function () {};
        onRendered(canvas);

        this.prop.canvas = canvas;
        document.body.removeChild(this.prop.overlay);
      });
  };

  Worker.prototype.toContext2d = function toContext2d(this: HTMLWorker) {
    // Set up function prerequisites.
    var prereqs = [
      function checkContainer(this: HTMLWorker) {
        return (
          document.body.contains(this.prop.container) || this.toContainer()
        );
      }
    ];

    // Fulfill prereqs then create the canvas.
    return this.thenList(prereqs)
      .then(loadHtml2Canvas)
      .then(function toContext2d_main(
        this: HTMLWorker,
        html2canvas: Html2CanvasStatic
      ) {
        // Handle old-fashioned 'onrendered' argument.

        var pdf = this.opt.jsPDF;
        var fontFaces = this.opt.fontFaces;

        var scale =
          typeof this.opt.width === "number" &&
          !isNaN(this.opt.width) &&
          typeof this.opt.windowWidth === "number" &&
          !isNaN(this.opt.windowWidth)
            ? this.opt.width / this.opt.windowWidth
            : 1;

        var options = Object.assign(
          {
            async: true,
            allowTaint: true,
            scale: scale,
            scrollX: this.opt.scrollX || 0,
            scrollY: this.opt.scrollY || 0,
            backgroundColor: "#ffffff",
            imageTimeout: 15000,
            logging: true,
            proxy: null,
            removeContainer: true,
            foreignObjectRendering: false,
            useCORS: false
          },
          this.opt.html2canvas
        );
        delete options.onrendered;

        pdf.context2d.autoPaging =
          typeof this.opt.autoPaging === "undefined"
            ? true
            : this.opt.autoPaging;
        pdf.context2d.posX = this.opt.x;
        pdf.context2d.posY = this.opt.y;
        pdf.context2d.margin = this.opt.margin;
        pdf.context2d.fontFaces = fontFaces;

        if (fontFaces) {
          for (var i = 0; i < fontFaces.length; ++i) {
            var font = fontFaces[i];
            var src = font.src.find(function (src) {
              return src.format === "truetype";
            });

            if (src) {
              pdf.addFont(src.url, font.ref.name, font.ref.style);
            }
          }
        }

        options.windowHeight = options.windowHeight || 0;
        options.windowHeight =
          options.windowHeight == 0
            ? Math.max(
                this.prop.container.clientHeight,
                this.prop.container.scrollHeight,
                this.prop.container.offsetHeight
              )
            : options.windowHeight;

        pdf.context2d.save(true);
        return html2canvas(this.prop.container, options);
      })
      .then(function toContext2d_post(
        this: HTMLWorker,
        canvas: HTMLCanvasElement
      ) {
        this.opt.jsPDF.context2d.restore(true);

        // Handle old-fashioned 'onrendered' argument.
        var onRendered = this.opt.html2canvas.onrendered || function () {};
        onRendered(canvas);

        this.prop.canvas = canvas;
        document.body.removeChild(this.prop.overlay);
      });
  };

  Worker.prototype.toImg = function toImg(this: HTMLWorker) {
    // Set up function prerequisites.
    var prereqs = [
      function checkCanvas(this: HTMLWorker) {
        return this.prop.canvas || this.toCanvas();
      }
    ];

    // Fulfill prereqs then create the image.
    return this.thenList(prereqs).then(function toImg_main(this: HTMLWorker) {
      var imgData = this.prop.canvas.toDataURL(
        "image/" + this.opt.image.type,
        this.opt.image.quality
      );
      this.prop.img = document.createElement("img");
      this.prop.img.src = imgData;
    });
  };

  Worker.prototype.toPdf = function toPdf(this: HTMLWorker) {
    // Set up function prerequisites.
    var prereqs = [
      function checkContext2d(this: HTMLWorker) {
        return this.toContext2d();
      }
      //function checkCanvas() { return this.prop.canvas || this.toCanvas(); }
    ];

    // Fulfill prereqs then create the image.
    return this.thenList(prereqs).then(function toPdf_main(this: HTMLWorker) {
      // Create local copies of frequently used properties.
      this.prop.pdf = this.prop.pdf || this.opt.jsPDF;
    });
  };

  /* ----- OUTPUT / SAVE ----- */

  Worker.prototype.output = function output(
    this: HTMLWorker,
    type?: string,
    options?: OutputOptions | string,
    src?: string
  ) {
    // Redirect requests to the correct function (outputPdf / outputImg).
    src = src || "pdf";
    if (src.toLowerCase() === "img" || src.toLowerCase() === "image") {
      return this.outputImg(type, options);
    } else {
      return this.outputPdf(type, options);
    }
  };

  Worker.prototype.outputPdf = function outputPdf(
    this: HTMLWorker,
    type?: string,
    options?: OutputOptions | string
  ) {
    // Set up function prerequisites.
    var prereqs = [
      function checkPdf(this: HTMLWorker) {
        return this.prop.pdf || this.toPdf();
      }
    ];

    // Fulfill prereqs then perform the appropriate output.
    return this.thenList(prereqs).then(function outputPdf_main(
      this: HTMLWorker
    ) {
      /* Currently implemented output types:
       *    https://rawgit.com/MrRio/jsPDF/master/docs/jspdf.js.html#line992
       *  save(options), arraybuffer, blob, bloburi/bloburl,
       *  datauristring/dataurlstring, dataurlnewwindow, datauri/dataurl
       */
      // The core `output` is declared as per-literal-type overloads; the
      // dynamic type string is forwarded verbatim at runtime, so pick a
      // representative overload for the type check.
      return this.prop.pdf.output(type as "datauristring", options);
    });
  };

  Worker.prototype.outputImg = function outputImg(
    this: HTMLWorker,
    type?: string
  ) {
    // Set up function prerequisites.
    var prereqs = [
      function checkImg(this: HTMLWorker) {
        return this.prop.img || this.toImg();
      }
    ];

    // Fulfill prereqs then perform the appropriate output.
    return this.thenList(prereqs).then(function outputImg_main(
      this: HTMLWorker
    ) {
      switch (type) {
        case undefined:
        case "img":
          return this.prop.img;
        case "datauristring":
        case "dataurlstring":
          return this.prop.img.src;
        case "datauri":
        case "dataurl":
          return (document.location.href = this.prop.img.src);
        default:
          throw 'Image output type "' + type + '" is not supported.';
      }
    });
  };

  Worker.prototype.save = function save(this: HTMLWorker, filename?: string) {
    // Set up function prerequisites.
    var prereqs = [
      function checkPdf(this: HTMLWorker) {
        return this.prop.pdf || this.toPdf();
      }
    ];

    // Fulfill prereqs, update the filename (if provided), and save the PDF.
    return this.thenList(prereqs)
      .set(filename ? { filename: filename } : null)
      .then(function save_main(this: HTMLWorker) {
        this.prop.pdf.save(this.opt.filename);
      });
  };

  Worker.prototype.doCallback = function doCallback(this: HTMLWorker) {
    // Set up function prerequisites.
    var prereqs = [
      function checkPdf(this: HTMLWorker) {
        return this.prop.pdf || this.toPdf();
      }
    ];

    // Fulfill prereqs, update the filename (if provided), and save the PDF.
    return this.thenList(prereqs).then(function doCallback_main(
      this: HTMLWorker
    ) {
      this.prop.callback(this.prop.pdf);
    });
  };

  /* ----- SET / GET ----- */

  Worker.prototype.set = function set(
    this: HTMLWorker,
    opt?: HTMLWorkerSetInput | null
  ) {
    // TODO: Implement ordered pairs?

    // Silently ignore invalid or empty input.
    if (objType(opt) !== "object") {
      return this;
    }

    // Build an array of setter functions to queue.
    var fns = Object.keys(opt || {}).map(function (this: HTMLWorker, key) {
      if (key in Worker.template.prop) {
        // Set pre-defined properties.
        return function set_prop(this: HTMLWorker) {
          (this.prop as Record<string, unknown>)[key] = (
            opt as Record<string, unknown>
          )[key];
        };
      } else {
        switch (key) {
          case "margin":
            return this.setMargin.bind(this, opt.margin);
          case "jsPDF":
            return function set_jsPDF(this: HTMLWorker) {
              this.opt.jsPDF = opt.jsPDF;
              return this.setPageSize();
            };
          case "pageSize":
            return this.setPageSize.bind(this, opt.pageSize);
          default:
            // Set any other properties in opt.
            return function set_opt(this: HTMLWorker) {
              (this.opt as Record<string, unknown>)[key] = (
                opt as Record<string, unknown>
              )[key];
            };
        }
      }
    }, this);

    // Set properties within the promise chain.
    return this.then(function set_main(this: HTMLWorker) {
      return this.thenList(fns);
    });
  };

  Worker.prototype.get = function get(
    this: HTMLWorker,
    key: string,
    cbk?: (value: unknown) => unknown
  ) {
    return this.then(function get_main(this: HTMLWorker) {
      // Fetch the requested property, either as a predefined prop or in opt.
      var val =
        key in Worker.template.prop
          ? (this.prop as Record<string, unknown>)[key]
          : (this.opt as Record<string, unknown>)[key];
      return cbk ? cbk(val) : val;
    });
  };

  Worker.prototype.setMargin = function setMargin(
    this: HTMLWorker,
    margin: number | number[]
  ) {
    return this.then(function setMargin_main(this: HTMLWorker) {
      // Parse the margin property.
      switch (objType(margin)) {
        case "number":
          margin = [
            margin as number,
            margin as number,
            margin as number,
            margin as number
          ];
        // eslint-disable-next-line no-fallthrough
        case "array":
          if ((margin as number[]).length === 2) {
            margin = [
              (margin as number[])[0],
              (margin as number[])[1],
              (margin as number[])[0],
              (margin as number[])[1]
            ];
          }
          if ((margin as number[]).length === 4) {
            break;
          }
        // eslint-disable-next-line no-fallthrough
        default:
          return this.error("Invalid margin array.");
      }

      // Set the margin property, then update pageSize.
      this.opt.margin = margin as number[];
    }).then(this.setPageSize);
  };

  Worker.prototype.setPageSize = function setPageSize(
    this: HTMLWorker,
    pageSize?: HTMLWorkerPageSize | null
  ) {
    function toPx(val: number, k: number) {
      return Math.floor(((val * k) / 72) * 96);
    }

    return this.then(function setPageSize_main(this: HTMLWorker) {
      // Retrieve page-size based on jsPDF settings, if not explicitly provided.
      pageSize =
        pageSize ||
        // `getPageSize` is an expando static installed on the imported
        // constructor function below; it is invisible to jsPDF's own type.
        (jsPDF as unknown as { getPageSize: GetPageSizeFn }).getPageSize(
          this.opt.jsPDF
        );

      // Add 'inner' field if not present.
      if (!pageSize.hasOwnProperty("inner")) {
        pageSize.inner = {
          width: pageSize.width - this.opt.margin[1] - this.opt.margin[3],
          height: pageSize.height - this.opt.margin[0] - this.opt.margin[2]
        };
        pageSize.inner.px = {
          width: toPx(pageSize.inner.width, pageSize.k),
          height: toPx(pageSize.inner.height, pageSize.k)
        };
        pageSize.inner.ratio = pageSize.inner.height / pageSize.inner.width;
      }

      // Attach pageSize to this.
      this.prop.pageSize = pageSize;
    });
  };

  Worker.prototype.setProgress = function setProgress(
    this: HTMLWorker,
    val?: number | null,
    state?: unknown,
    n?: number | null,
    stack?: unknown[] | null
  ) {
    // Immediately update all progress values.
    if (val != null) this.progress.val = val;
    if (state != null) this.progress.state = state;
    if (n != null) this.progress.n = n;
    if (stack != null) this.progress.stack = stack;
    // `state` holds callbacks/the Worker at runtime; the division has always
    // yielded NaN and is preserved as-is.
    this.progress.ratio = this.progress.val / (this.progress.state as number);

    // Return this for command chaining.
    return this;
  };

  Worker.prototype.updateProgress = function updateProgress(
    this: HTMLWorker,
    val?: number | null,
    state?: unknown,
    n?: number | null,
    stack?: unknown[] | null
  ) {
    // Immediately update all progress values, using setProgress.
    return this.setProgress(
      val ? this.progress.val + val : null,
      state ? state : null,
      n ? this.progress.n + n : null,
      stack ? this.progress.stack.concat(stack) : null
    );
  };

  /* ----- PROMISE MAPPING ----- */

  Worker.prototype.then = function then<T>(
    this: HTMLWorker,
    onFulfilled?: (this: HTMLWorker, value: T) => unknown,
    onRejected?: HTMLWorkerCallback
  ) {
    // Wrap `this` for encapsulation.
    var self = this;

    return this.thenCore(
      onFulfilled as HTMLWorkerCallback,
      onRejected,
      function then_main(onFulfilled, onRejected) {
        // Update progress while queuing, calling, and resolving `then`.
        self.updateProgress(null, null, 1, [onFulfilled]);
        return Promise.prototype.then
          .call(this, function then_pre(val) {
            self.updateProgress(null, onFulfilled);
            return val;
          })
          .then(onFulfilled, onRejected)
          .then(function then_post(val) {
            self.updateProgress(1);
            return val;
          });
      }
    );
  };

  Worker.prototype.thenCore = function thenCore(
    this: HTMLWorker,
    onFulfilled?: HTMLWorkerCallback,
    onRejected?: HTMLWorkerCallback,
    thenBase?: HTMLWorkerThenBase
  ) {
    // Handle optional thenBase parameter.
    thenBase = thenBase || Promise.prototype.then;

    // Wrap `this` for encapsulation and bind it to the promise handlers.
    var self = this;
    if (onFulfilled) {
      onFulfilled = onFulfilled.bind(self);
    }
    if (onRejected) {
      onRejected = onRejected.bind(self);
    }

    // Cast self into a Promise to avoid polyfills recursively defining `then`.
    var isNative =
      Promise.toString().indexOf("[native code]") !== -1 &&
      Promise.name === "Promise";
    var selfPromise = isNative
      ? self
      : Worker.convert(Object.assign({}, self), Promise.prototype);

    // Return the promise, after casting it into a Worker and preserving props.
    // The Worker hijacks the Promise prototype chain, so the nominal types
    // diverge at this boundary.
    var returnVal = thenBase.call(
      selfPromise as unknown as Promise<unknown>,
      onFulfilled,
      onRejected
    );
    return Worker.convert(
      returnVal,
      (self as unknown as { __proto__: object }).__proto__
    );
  };

  Worker.prototype.thenExternal = function thenExternal(
    this: HTMLWorker,
    onFulfilled?: (value: unknown) => unknown,
    onRejected?: (reason: unknown) => unknown
  ) {
    // Call `then` and return a standard promise (exits the Worker chain).
    // The Worker is a Promise at runtime despite its hijacked prototype.
    return Promise.prototype.then.call(
      this as unknown as Promise<unknown>,
      onFulfilled,
      onRejected
    );
  };

  Worker.prototype.thenList = function thenList(
    this: HTMLWorker,
    fns: Array<(this: HTMLWorker) => unknown>
  ) {
    // Queue a series of promise 'factories' into the promise chain.
    var self = this;
    fns.forEach(function thenList_forEach(fn) {
      self = self.thenCore(fn);
    });
    return self;
  };

  Worker.prototype["catch"] = function (
    this: HTMLWorker,
    onRejected?: HTMLWorkerCallback
  ) {
    // Bind `this` to the promise handler, call `catch`, and return a Worker.
    if (onRejected) {
      onRejected = onRejected.bind(this);
    }
    // The Worker is a Promise at runtime despite its hijacked prototype.
    var returnVal = Promise.prototype["catch"].call(
      this as unknown as Promise<unknown>,
      onRejected
    );
    return Worker.convert(returnVal, this);
  };

  Worker.prototype.catchExternal = function catchExternal(
    this: HTMLWorker,
    onRejected?: (reason: unknown) => unknown
  ) {
    // Call `catch` and return a standard promise (exits the Worker chain).
    // The Worker is a Promise at runtime despite its hijacked prototype.
    return Promise.prototype["catch"].call(
      this as unknown as Promise<unknown>,
      onRejected
    );
  };

  Worker.prototype.error = function error(this: HTMLWorker, msg: string) {
    // Throw the error in the Promise chain.
    return this.then(function error_main() {
      throw new Error(msg);
    });
  };

  /* ----- ALIASES ----- */

  Worker.prototype.using = Worker.prototype.set;
  Worker.prototype.saveAs = Worker.prototype.save;
  Worker.prototype.export = Worker.prototype.output;
  Worker.prototype.run = Worker.prototype.then;

  // Get dimensions of a PDF page, as determined by jsPDF.
  // `getPageSize` is an expando static assigned onto the imported constructor
  // function, which is invisible to jsPDF's own type.
  (jsPDF as unknown as { getPageSize: GetPageSizeFn }).getPageSize = function (
    orientation,
    unit,
    format
  ) {
    // Decode options object
    if (typeof orientation === "object") {
      var options = orientation;
      orientation = (options as GetPageSizeOptions).orientation;
      unit = (options as GetPageSizeOptions).unit || unit;
      format = (options as GetPageSizeOptions).format || format;
    }

    // Default options
    unit = unit || "mm";
    format = format || "a4";
    orientation = ("" + (orientation || "P")).toLowerCase();
    var format_as_string = ("" + format).toLowerCase();

    // Size in pt of various paper formats
    var pageFormats: PageFormats = {
      a0: [2383.94, 3370.39],
      a1: [1683.78, 2383.94],
      a2: [1190.55, 1683.78],
      a3: [841.89, 1190.55],
      a4: [595.28, 841.89],
      a5: [419.53, 595.28],
      a6: [297.64, 419.53],
      a7: [209.76, 297.64],
      a8: [147.4, 209.76],
      a9: [104.88, 147.4],
      a10: [73.7, 104.88],
      b0: [2834.65, 4008.19],
      b1: [2004.09, 2834.65],
      b2: [1417.32, 2004.09],
      b3: [1000.63, 1417.32],
      b4: [708.66, 1000.63],
      b5: [498.9, 708.66],
      b6: [354.33, 498.9],
      b7: [249.45, 354.33],
      b8: [175.75, 249.45],
      b9: [124.72, 175.75],
      b10: [87.87, 124.72],
      c0: [2599.37, 3676.54],
      c1: [1836.85, 2599.37],
      c2: [1298.27, 1836.85],
      c3: [918.43, 1298.27],
      c4: [649.13, 918.43],
      c5: [459.21, 649.13],
      c6: [323.15, 459.21],
      c7: [229.61, 323.15],
      c8: [161.57, 229.61],
      c9: [113.39, 161.57],
      c10: [79.37, 113.39],
      dl: [311.81, 623.62],
      letter: [612, 792],
      "government-letter": [576, 756],
      legal: [612, 1008],
      "junior-legal": [576, 360],
      ledger: [1224, 792],
      tabloid: [792, 1224],
      "credit-card": [153, 243]
    };

    var k;
    // Unit conversion
    switch (unit) {
      case "pt":
        k = 1;
        break;
      case "mm":
        k = 72 / 25.4;
        break;
      case "cm":
        k = 72 / 2.54;
        break;
      case "in":
        k = 72;
        break;
      case "px":
        k = 72 / 96;
        break;
      case "pc":
        k = 12;
        break;
      case "em":
        k = 12;
        break;
      case "ex":
        k = 6;
        break;
      default:
        throw "Invalid unit: " + unit;
    }
    var pageHeight = 0;
    var pageWidth = 0;

    // Dimensions are stored as user units and converted to points on output
    if (pageFormats.hasOwnProperty(format_as_string)) {
      pageHeight = pageFormats[format_as_string][1] / k;
      pageWidth = pageFormats[format_as_string][0] / k;
    } else {
      try {
        pageHeight = (format as number[])[1];
        pageWidth = (format as number[])[0];
      } catch (err) {
        throw new Error("Invalid format: " + format);
      }
    }

    var tmp;
    // Handle page orientation
    if (orientation === "p" || orientation === "portrait") {
      orientation = "p";
      if (pageWidth > pageHeight) {
        tmp = pageWidth;
        pageWidth = pageHeight;
        pageHeight = tmp;
      }
    } else if (orientation === "l" || orientation === "landscape") {
      orientation = "l";
      if (pageHeight > pageWidth) {
        tmp = pageWidth;
        pageWidth = pageHeight;
        pageHeight = tmp;
      }
    } else {
      throw "Invalid orientation: " + orientation;
    }

    // Return information (k is the unit conversion ratio from pts)
    var info = {
      width: pageWidth,
      height: pageHeight,
      unit: unit,
      k: k,
      orientation: orientation
    };
    return info;
  };

  /**
   * @typedef FontFace
   *
   * The font-face type implements an interface similar to that of the font-face CSS rule,
   * and is used by jsPDF to match fonts when the font property of CanvasRenderingContext2D
   * is updated.
   *
   * All properties expect values similar to those in the font-face CSS rule. A difference
   * is the font-family, which do not need to be enclosed in double-quotes when containing
   * spaces like in CSS.
   *
   * @property {string} family The name of the font-family.
   * @property {string|undefined} style The style that this font-face defines, e.g. 'italic'.
   * @property {string|number|undefined} weight The weight of the font, either as a string or a number (400, 500, 600, e.g.)
   * @property {string|undefined} stretch The stretch of the font, e.g. condensed, normal, expanded.
   * @property {Object[]} src A list of URLs from where fonts of various formats can be fetched.
   * @property {string} [src] url A URL to a font of a specific format.
   * @property {string} [src] format Format of the font referenced by the URL.
   */

  /**
   * Generate a PDF from an HTML element or string using.
   *
   * @name html
   * @function
   * @param {HTMLElement|string} source The source HTMLElement or a string containing HTML.
   * @param {Object} [options] Collection of settings
   * @param {function} [options.callback] The mandatory callback-function gets as first parameter the current jsPDF instance
   * @param {(number|number[])=} [options.margin] Page margins [top, right, bottom, left]. Default is 0.
   * @param {(boolean|'slice'|'text')=} [options.autoPaging] The auto paging mode.
   * <ul>
   * <li>
   *   <code>false</code>: Auto paging is disabled.
   * </li>
   * <li>
   *   <code>true</code> or <code>'slice'</code>: Will cut shapes or text chunks across page breaks. Will possibly
   *   slice text in half, making it difficult to read.
   * </li>
   * <li>
   *   <code>'text'</code>: Trys not to cut text in half across page breaks. Works best for documents consisting
   *   mostly of a single column of text.
   * </li>
   * </ul>
   * Default is <code>true</code>.
   * @param {string} [options.filename] name of the file
   * @param {HTMLOptionImage} [options.image] image settings when converting HTML to image
   * @param {Html2CanvasOptions} [options.html2canvas] html2canvas options
   * @param {FontFace[]} [options.fontFaces] A list of font-faces to match when resolving fonts. Fonts will be added to the PDF based on the specified URL. If omitted, the font match algorithm falls back to old algorithm.
   * @param {jsPDF} [options.jsPDF] jsPDF instance
   * @param {number=} [options.x] x position on the PDF document in jsPDF units.
   * @param {number=} [options.y] y position on the PDF document in jsPDF units.
   * @param {number=} [options.width] The target width in the PDF document in jsPDF units. The rendered element will be
   * scaled such that it fits into the specified width. Has no effect if either the <code>html2canvas.scale<code> is
   * specified or the <code>windowWidth</code> option is NOT specified.
   * @param {number=} [options.windowWidth] The window width in CSS pixels. In contrast to the
   * <code>html2canvas.windowWidth</code> option, this option affects the actual container size while rendering and
   * does NOT affect CSS media queries. This option only has an effect, if the <code>width<code> option is also specified.
   *
   * @example
   * var doc = new jsPDF();
   *
   * doc.html(document.body, {
   *    callback: function (doc) {
   *      doc.save();
   *    },
   *    x: 10,
   *    y: 10
   * });
   */
  jsPDFAPI.html = function (
    this: jsPDFDocument,
    src: string | HTMLElement,
    options?: HTMLOptions
  ) {
    "use strict";

    options = options || {};
    options.callback = options.callback || function () {};
    options.html2canvas = options.html2canvas || {};
    options.html2canvas.canvas =
      options.html2canvas.canvas ||
      // The canvas plugin (src/modules/canvas.ts) installs `canvas` as an
      // expando on the document instance; it is not part of the typed core
      // surface yet.
      (this as unknown as { canvas?: unknown }).canvas;
    options.jsPDF = options.jsPDF || this;
    options.fontFaces = options.fontFaces
      ? options.fontFaces.map(normalizeFontFace)
      : null;

    // Create a new worker with the given options.
    var worker = new Worker(options);

    if (!options.worker) {
      // If worker is not set to true, perform the traditional 'simple' operation.
      return worker.from(src).doCallback();
    } else {
      // Otherwise, return the worker for new Promise-based operation.
      return worker;
    }
  };
})(jsPDF.API);
