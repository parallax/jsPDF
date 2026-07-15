/**
 * @license
 * Blob.js
 * A Blob, File, FileReader & URL implementation.
 * 2018-08-09
 *
 * By Eli Grey, http://eligrey.com
 * By Jimmy Wärting, https://github.com/jimmywarting
 * License: MIT
 *   See https://github.com/eligrey/Blob.js/blob/master/LICENSE.md
 */

import { globalObject } from "./globalObject.js";

// The polyfill installs (and reads back) implementations on the global,
// including vendor-prefixed and pre-standard slots the DOM lib does not
// declare, and deliberately overwrites standard slots with fakes. A loose
// writable view at this single boundary keeps the rest of the file typed.
type PolyfillCtor = {
  // Loose constructable/callable shape shared by the native constructors and
  // the polyfill replacements this file installs.
  new (...args: never[]): unknown;
  prototype: Record<string | symbol, unknown>;
} & Record<string, unknown>;

const global = globalObject as unknown as Record<string, unknown> & {
  URL: {
    createObjectURL(obj: unknown): string;
    revokeObjectURL(url: string): void;
  } & Record<string, unknown>;
  webkitURL?: unknown;
  Blob: PolyfillCtor;
  File: PolyfillCtor;
  FileReader: PolyfillCtor;
  Symbol?: { toStringTag?: symbol } & Record<string, unknown>;
  ArrayBuffer?: unknown;
  XMLHttpRequest?: PolyfillCtor;
};

/** Internal shape of the polyfilled Blob: raw bytes plus Blob metadata. */
interface FakeBlob {
  _buffer: number[];
  size: number;
  type: string;
}

interface FakeFile extends FakeBlob {
  name: string;
  lastModifiedDate: Date;
  lastModified: number;
}

interface FakeFileReader {
  addEventListener: EventTarget["addEventListener"];
  removeEventListener: EventTarget["removeEventListener"];
  dispatchEvent: (evt: Event) => void;
  result: string | number[];
  [handler: string]: unknown;
}

// Vendor-prefixed pre-standard builders; constructable with no arguments.
var BlobBuilder = (global.BlobBuilder ||
  global.WebKitBlobBuilder ||
  global.MSBlobBuilder ||
  global.MozBlobBuilder) as unknown as {
  new (): { append(part: unknown): void; getBlob(type?: string): Blob };
  prototype: Record<string, unknown>;
};

global.URL = (global.URL ||
  global.webkitURL ||
  function (href: string, a?: HTMLAnchorElement) {
    a = document.createElement("a");
    a.href = href;
    return a;
    // the anchor-based fallback only ever has createObjectURL called on it
  }) as typeof global.URL;

// The native constructor captured before this file installs replacements.
var origBlob = global.Blob as unknown as {
  new (parts: unknown[], options?: BlobPropertyBag): Blob;
};
var createObjectURL = URL.createObjectURL;
var revokeObjectURL = URL.revokeObjectURL;
var strTag = (global.Symbol && global.Symbol.toStringTag) as symbol;
var blobSupported = false;
var blobSupportsArrayBufferView = false;
var arrayBufferSupported = !!global.ArrayBuffer;
var blobBuilderSupported =
  BlobBuilder && BlobBuilder.prototype.append && BlobBuilder.prototype.getBlob;

try {
  // Check if Blob constructor is supported
  blobSupported = new Blob(["ä"]).size === 2;

  // Check if Blob constructor supports ArrayBufferViews
  // Fails in Safari 6, so we need to map to ArrayBuffers there.
  blobSupportsArrayBufferView = new Blob([new Uint8Array([1, 2])]).size === 2;
} catch (e) {}

/**
 * Helper function that maps ArrayBufferViews to ArrayBuffers
 * Used by BlobBuilder constructor and old browsers that didn't
 * support it in the Blob constructor.
 */
function mapArrayBufferViews(ary: BlobPart[]): BlobPart[] {
  return ary.map(function (chunk) {
    // Structural probe: non-view parts simply fail the instanceof test below.
    var view = chunk as ArrayBufferView;
    if (view.buffer instanceof ArrayBuffer) {
      var buf = view.buffer;

      // if this is a subarray, make a copy so we only
      // include the subarray region from the underlying buffer
      if (view.byteLength !== buf.byteLength) {
        var copy = new Uint8Array(view.byteLength);
        copy.set(new Uint8Array(buf, view.byteOffset, view.byteLength));
        buf = copy.buffer;
      }

      return buf;
    }

    return chunk;
  });
}

function BlobBuilderConstructor(ary: BlobPart[], options?: BlobPropertyBag) {
  options = options || {};

  var bb = new BlobBuilder();
  mapArrayBufferViews(ary).forEach(function (part) {
    bb.append(part);
  });

  return options.type ? bb.getBlob(options.type) : bb.getBlob();
}

function BlobConstructor(ary: BlobPart[], options?: BlobPropertyBag) {
  return new origBlob(mapArrayBufferViews(ary), options || {});
}

if (global.Blob) {
  BlobBuilderConstructor.prototype = Blob.prototype;
  BlobConstructor.prototype = Blob.prototype;
}

function FakeBlobBuilder() {
  function toUTF8Array(str: string): number[] {
    var utf8: number[] = [];
    for (var i = 0; i < str.length; i++) {
      var charcode = str.charCodeAt(i);
      if (charcode < 0x80) utf8.push(charcode);
      else if (charcode < 0x800) {
        utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
      } else if (charcode < 0xd800 || charcode >= 0xe000) {
        utf8.push(
          0xe0 | (charcode >> 12),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f)
        );
      }
      // surrogate pair
      else {
        i++;
        // UTF-16 encodes 0x10000-0x10FFFF by
        // subtracting 0x10000 and splitting the
        // 20 bits of 0x0-0xFFFFF into two halves
        charcode =
          0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
        utf8.push(
          0xf0 | (charcode >> 18),
          0x80 | ((charcode >> 12) & 0x3f),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f)
        );
      }
    }
    return utf8;
  }
  function fromUtf8Array(array: number[]): string {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
      c = array[i++];
      switch (c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
        case 12:
        case 13:
          // 110x xxxx   10xx xxxx
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = array[i++];
          char3 = array[i++];
          out += String.fromCharCode(
            ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
          );
          break;
      }
    }
    return out;
  }
  function isDataView(obj: unknown): boolean {
    return !!obj && DataView.prototype.isPrototypeOf(obj as object);
  }
  function bufferClone(buf: ArrayBufferLike): number[] {
    var view = new Array(buf.byteLength);
    var array = new Uint8Array(buf);
    var i = view.length;
    while (i--) {
      view[i] = array[i];
    }
    return view;
  }
  function encodeByteArray(input: number[]): string {
    var byteToCharMap =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    var output = [];

    for (var i = 0; i < input.length; i += 3) {
      var byte1 = input[i];
      var haveByte2 = i + 1 < input.length;
      var byte2 = haveByte2 ? input[i + 1] : 0;
      var haveByte3 = i + 2 < input.length;
      var byte3 = haveByte3 ? input[i + 2] : 0;

      var outByte1 = byte1 >> 2;
      var outByte2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
      var outByte3 = ((byte2 & 0x0f) << 2) | (byte3 >> 6);
      var outByte4 = byte3 & 0x3f;

      if (!haveByte3) {
        outByte4 = 64;

        if (!haveByte2) {
          outByte3 = 64;
        }
      }

      output.push(
        byteToCharMap[outByte1],
        byteToCharMap[outByte2],
        byteToCharMap[outByte3],
        byteToCharMap[outByte4]
      );
    }

    return output.join("");
  }

  var create =
    Object.create ||
    function (a: object) {
      function c() {}
      c.prototype = a;
      // ES5 constructor-function pattern: a plain function declaration has no
      // construct signature, so cast to a constructor type for `new`.
      return new (c as unknown as { new (): object })();
    };

  if (arrayBufferSupported) {
    var viewClasses = [
      "[object Int8Array]",
      "[object Uint8Array]",
      "[object Uint8ClampedArray]",
      "[object Int16Array]",
      "[object Uint16Array]",
      "[object Int32Array]",
      "[object Uint32Array]",
      "[object Float32Array]",
      "[object Float64Array]"
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function (obj: unknown): boolean {
        return (
          !!obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
        );
      };
  }

  /********************************************************/
  /*                   Blob constructor                   */
  /********************************************************/
  function Blob(this: FakeBlob, chunks?: unknown[], opts?: BlobPropertyBag) {
    chunks = chunks || [];
    for (var i = 0, len = chunks.length; i < len; i++) {
      var chunk = chunks[i];
      if (chunk instanceof Blob) {
        chunks[i] = (chunk as unknown as FakeBlob)._buffer;
      } else if (typeof chunk === "string") {
        chunks[i] = toUTF8Array(chunk);
      } else if (
        arrayBufferSupported &&
        (ArrayBuffer.prototype.isPrototypeOf(chunk as object) ||
          isArrayBufferView(chunk))
      ) {
        // Guarded by the isPrototypeOf/isView checks on the previous lines.
        chunks[i] = bufferClone(chunk as ArrayBufferLike);
      } else if (arrayBufferSupported && isDataView(chunk)) {
        chunks[i] = bufferClone((chunk as DataView).buffer);
      } else {
        chunks[i] = toUTF8Array(String(chunk));
      }
    }

    // Every chunk has been normalized to number[] by the loop above.
    this._buffer = ([] as number[]).concat.apply([], chunks as number[][]);
    this.size = this._buffer.length;
    this.type = opts ? opts.type || "" : "";
  }

  // The fake constructors below are ES5 constructor functions; plain function
  // declarations have no construct signature, so cast for `new` call sites.
  var FakeBlobConstructor = Blob as unknown as {
    new (chunks?: unknown[], opts?: BlobPropertyBag): FakeBlob;
  };

  Blob.prototype.slice = function (
    this: FakeBlob,
    start?: number,
    end?: number,
    type?: string
  ) {
    var slice = this._buffer.slice(start || 0, end || this._buffer.length);
    return new FakeBlobConstructor([slice], { type: type });
  };

  Blob.prototype.toString = function () {
    return "[object Blob]";
  };

  /********************************************************/
  /*                   File constructor                   */
  /********************************************************/
  function File(
    this: FakeFile,
    chunks: unknown[],
    name: string,
    opts?: FilePropertyBag
  ) {
    opts = opts || {};
    // `Blob.call` returns void per its signature but may return an object at
    // runtime; keep the original `|| this` fallback via a cast.
    var a = (Blob.call(this, chunks, opts) as unknown as FakeFile) || this;
    a.name = name;
    a.lastModifiedDate = opts.lastModified
      ? new Date(opts.lastModified)
      : new Date();
    a.lastModified = +a.lastModifiedDate;

    return a;
  }

  File.prototype = create(Blob.prototype);
  File.prototype.constructor = File;

  if (Object.setPrototypeOf) Object.setPrototypeOf(File, Blob);
  else {
    try {
      // Legacy engines without setPrototypeOf; __proto__ is not in lib.dom.
      (File as unknown as { __proto__: unknown }).__proto__ = Blob;
    } catch (e) {}
  }

  File.prototype.toString = function () {
    return "[object File]";
  };

  /********************************************************/
  /*                FileReader constructor                */
  /********************************************************/
  function FileReader(this: FakeFileReader) {
    if (!(this instanceof FileReader))
      throw new TypeError(
        "Failed to construct 'FileReader': Please use the 'new' operator, this DOM object constructor cannot be called as a function."
      );

    var delegate = document.createDocumentFragment();
    this.addEventListener = delegate.addEventListener;
    this.dispatchEvent = function (this: FakeFileReader, evt: Event) {
      var local = this["on" + evt.type];
      if (typeof local === "function") local(evt);
      delegate.dispatchEvent(evt);
    };
    this.removeEventListener = delegate.removeEventListener;
  }

  function _read(fr: FakeFileReader, blob: FakeBlob, kind: string) {
    if (!(blob instanceof Blob))
      throw new TypeError(
        "Failed to execute '" +
          kind +
          "' on 'FileReader': parameter 1 is not of type 'Blob'."
      );

    fr.result = "";

    setTimeout(function (this: { readyState?: number }) {
      this.readyState = FileReader.LOADING;
      fr.dispatchEvent(new Event("load"));
      fr.dispatchEvent(new Event("loadend"));
    });
  }

  FileReader.EMPTY = 0;
  FileReader.LOADING = 1;
  FileReader.DONE = 2;
  FileReader.prototype.error = null;
  FileReader.prototype.onabort = null;
  FileReader.prototype.onerror = null;
  FileReader.prototype.onload = null;
  FileReader.prototype.onloadend = null;
  FileReader.prototype.onloadstart = null;
  FileReader.prototype.onprogress = null;

  FileReader.prototype.readAsDataURL = function (
    this: FakeFileReader,
    blob: FakeBlob
  ) {
    _read(this, blob, "readAsDataURL");
    this.result =
      "data:" + blob.type + ";base64," + encodeByteArray(blob._buffer);
  };

  FileReader.prototype.readAsText = function (
    this: FakeFileReader,
    blob: FakeBlob
  ) {
    _read(this, blob, "readAsText");
    this.result = fromUtf8Array(blob._buffer);
  };

  FileReader.prototype.readAsArrayBuffer = function (
    this: FakeFileReader,
    blob: FakeBlob
  ) {
    _read(this, blob, "readAsText");
    this.result = blob._buffer.slice();
  };

  FileReader.prototype.abort = function () {};

  /********************************************************/
  /*                         URL                          */
  /********************************************************/
  URL.createObjectURL = function (blob: Blob | MediaSource): string {
    return blob instanceof Blob
      ? "data:" +
          // The fake Blob polyfill stores its bytes on `_buffer`; the DOM
          // Blob type has no such member, hence the cast.
          (blob as unknown as FakeBlob).type +
          ";base64," +
          encodeByteArray((blob as unknown as FakeBlob)._buffer)
      : createObjectURL.call(URL, blob);
  };

  URL.revokeObjectURL = function (url: string) {
    revokeObjectURL && revokeObjectURL.call(URL, url);
  };

  /********************************************************/
  /*                         XHR                          */
  /********************************************************/
  var _send = (global.XMLHttpRequest &&
    global.XMLHttpRequest.prototype.send) as unknown as (
    this: XMLHttpRequest,
    data?: Document | XMLHttpRequestBodyInit | null
  ) => void;
  if (_send) {
    XMLHttpRequest.prototype.send = function (
      this: XMLHttpRequest,
      data?: Document | XMLHttpRequestBodyInit | null
    ) {
      if (data instanceof Blob) {
        // The fake Blob polyfill stores its bytes on `_buffer`; the DOM
        // Blob type has no such member, hence the cast.
        this.setRequestHeader(
          "Content-Type",
          (data as unknown as FakeBlob).type
        );
        _send.call(this, fromUtf8Array((data as unknown as FakeBlob)._buffer));
      } else {
        _send.call(this, data);
      }
    };
  }

  // Installing the fakes over the (differently-shaped) native slots.
  global.FileReader = FileReader as unknown as PolyfillCtor;
  global.File = File as unknown as PolyfillCtor;
  global.Blob = Blob as unknown as PolyfillCtor;
}

if (strTag) {
  try {
    // Symbol.toStringTag is not part of the declared Blob/File/FileReader
    // prototype shapes in lib.dom, so widen via a symbol-keyed record.
    (File.prototype as unknown as Record<symbol, string>)[strTag] = "File";
    (Blob.prototype as unknown as Record<symbol, string>)[strTag] = "Blob";
    (FileReader.prototype as unknown as Record<symbol, string>)[strTag] =
      "FileReader";
  } catch (e) {}
}

function fixFileAndXHR() {
  try {
    new File([], "");
  } catch (e) {
    try {
      var klass = new Function(
        "class File extends Blob {" +
          "constructor(chunks, name, opts) {" +
          "opts = opts || {};" +
          "super(chunks, opts || {});" +
          "this.name = name;" +
          "this.lastModifiedDate = opts.lastModified ? new Date(opts.lastModified) : new Date;" +
          "this.lastModified = +this.lastModifiedDate;" +
          "}};" +
          'return new File([], ""), File'
      )();
      global.File = klass as unknown as PolyfillCtor;
    } catch (e) {
      global.File = function (b: BlobPart[], d: string, c?: FilePropertyBag) {
        var blob = new Blob(b, c) as Blob & {
          name?: string;
          lastModifiedDate?: Date;
          lastModified?: number;
          [key: symbol]: unknown;
        };
        var t =
          c && void 0 !== c.lastModified
            ? new Date(c.lastModified)
            : new Date();

        blob.name = d;
        blob.lastModifiedDate = t;
        blob.lastModified = +t;
        blob.toString = function () {
          return "[object File]";
        };

        if (strTag) blob[strTag] = "File";

        return blob;
      } as unknown as PolyfillCtor;
    }
  }
}

if (blobSupported) {
  fixFileAndXHR();
  global.Blob = (blobSupportsArrayBufferView
    ? global.Blob
    : BlobConstructor) as unknown as PolyfillCtor;
} else if (blobBuilderSupported) {
  fixFileAndXHR();
  global.Blob = BlobBuilderConstructor as unknown as PolyfillCtor;
} else {
  FakeBlobBuilder();
}
