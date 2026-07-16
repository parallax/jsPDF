/** @license
 * jsPDF addImage plugin
 * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
 *               2013 Chris Dowling, https://github.com/gingerchris
 *               2013 Trinh Ho, https://github.com/ineedfat
 *               2013 Edwin Alejandro Perez, https://github.com/eaparango
 *               2013 Norah Smith, https://github.com/burnburnrocket
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 James Robb, https://github.com/jamesbrobb
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
 */
/**
 * @name addImage
 * @module
 */

import { jsPDF } from "../jspdf.js";
import { atob } from "../libs/AtobBtoa.js";
import type { jsPDFAPI as jsPDFAPIType, jsPDFDocument } from "../types.js";

/** The typed-array flavours accepted as raw image data. */
export type ImageTypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

/** Single dimensional array of RGBA values with size. For example from canvas getImageData. */
export interface RGBAData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export type ImageCompression = "NONE" | "FAST" | "MEDIUM" | "SLOW";

/** Everything `addImage` accepts as its imageData argument. */
export type ImageInput =
  string | HTMLImageElement | HTMLCanvasElement | Uint8Array | RGBAData;

/** Options-object form of `addImage` (adapted from types/index.d.ts). */
export interface ImageOptions {
  imageData: ImageInput;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  width?: number;
  height?: number;
  alias?: string;
  compression?: ImageCompression;
  rotation?: number;
  /** Alias of `rotation`. */
  angle?: number;
  format?: string;
}

/**
 * The decoded image object produced by the format plugins
 * (`processPNG`/`processJPEG`/...) and consumed by `putImage`. Adapted from
 * `ImageProperties` in types/index.d.ts, extended with the internal members
 * this plugin reads and writes (`objectId`, `sMaskBitsPerComponent`, ...).
 */
export interface ImageProperties {
  alias?: number | string;
  width: number;
  height: number;
  colorSpace: string;
  bitsPerComponent: number;
  filter?: string;
  decodeParameters?: string;
  transparency?: number[];
  palette?: number[] | Uint8Array;
  sMask?: string;
  sMaskBitsPerComponent?: number;
  /** null when the PNG is stored uncompressed. */
  predictor?: number | null;
  index?: number;
  data: string;
  fileType?: string;
  /** Assigned by putImage() while the image XObject is written. */
  objectId?: number;
}

/**
 * Signature of the dynamically dispatched format processors
 * (`processPNG` etc.) contributed by the image-format plugins.
 */
export type ImageFormatProcessor = (
  imageData?: unknown,
  index?: number,
  alias?: number | string,
  compression?: ImageCompression,
  dataAsBinaryString?: string
) => ImageProperties | undefined;

/** The helper namespace this plugin exposes as `jsPDF.API.__addimage__`. */
export interface AddImageNamespace {
  getImageFileTypeByImageData(
    imageData: ImageInput | ImageTypedArray | ArrayBuffer,
    fallbackFormat?: string
  ): string;
  /** `data` is optional at runtime: absent/unrecognized input hashes to 0. */
  sHashCode(data?: string | ImageTypedArray): number;
  /** Called without an argument, validates the empty string (returns false). */
  validateStringAsBase64(possibleBase64String?: string): boolean;
  /** Returns null for absent or non-data-URL input. */
  extractImageFromDataUrl(dataUrl?: string | null): string | null;
  isArrayBuffer(object: unknown): object is ArrayBuffer;
  isArrayBufferView(object: unknown): object is ImageTypedArray;
  binaryStringToUint8Array(binary_string: string): Uint8Array;
  arrayBufferToBinaryString(buffer: ArrayBuffer | ImageTypedArray): string;
  convertBase64ToBinaryString(stringData: string, throwError?: boolean): string;
}

declare module "../types.js" {
  interface jsPDFAPI {
    __addimage__: AddImageNamespace;
    color_spaces: Record<string, string>;
    decode: Record<string, string>;
    image_compression: Record<ImageCompression, ImageCompression>;
    addImage(
      imageData: ImageInput,
      format: string,
      x: number,
      y: number,
      w?: number,
      h?: number,
      alias?: string,
      compression?: ImageCompression,
      rotation?: number
    ): jsPDFDocument;
    addImage(
      imageData: ImageInput,
      x: number,
      y: number,
      w?: number,
      h?: number,
      alias?: string,
      // `number` admitted honestly: addSvgAsImage (src/modules/svg.ts) has
      // always passed its arguments one slot early (latent bug preserved for
      // parity), so its numeric `rotation` arrives in this parameter.
      compression?: ImageCompression | number,
      rotation?: number
    ): jsPDFDocument;
    addImage(options: ImageOptions): jsPDFDocument;
    getImageProperties(imageData: ImageInput): ImageProperties;

    // Provided by src/modules/fileloading.ts; declared here so this module
    // typechecks independently (merged declarations become overloads).
    loadFile(
      url: string,
      sync?: boolean,
      callback?: (data?: string) => unknown
    ): string | undefined;
  }
}

(function (jsPDFAPI: jsPDFAPIType) {
  "use strict";

  var namespace = "addImage_";
  // Filled member by member directly below.
  jsPDFAPI.__addimage__ = {} as AddImageNamespace;

  var UNKNOWN = "UNKNOWN";

  // Heuristic selection of a good batch for large array .apply. Not limiting make the call overflow.
  // With too small batch iteration will be slow as more calls are made,
  // higher values cause larger and slower garbage collection.
  var ARRAY_APPLY_BATCH = 8192;

  var imageFileTypeHeaders: Record<string, Array<Array<number | undefined>>> = {
    PNG: [[0x89, 0x50, 0x4e, 0x47]],
    TIFF: [
      [0x4d, 0x4d, 0x00, 0x2a], //Motorola
      [0x49, 0x49, 0x2a, 0x00] //Intel
    ],
    JPEG: [
      [
        0xff,
        0xd8,
        0xff,
        0xe0,
        undefined,
        undefined,
        0x4a,
        0x46,
        0x49,
        0x46,
        0x00
      ], //JFIF
      [
        0xff,
        0xd8,
        0xff,
        0xe1,
        undefined,
        undefined,
        0x45,
        0x78,
        0x69,
        0x66,
        0x00,
        0x00
      ], //Exif
      [0xff, 0xd8, 0xff, 0xdb], //JPEG RAW
      [0xff, 0xd8, 0xff, 0xee] //EXIF RAW
    ],
    JPEG2000: [[0x00, 0x00, 0x00, 0x0c, 0x6a, 0x50, 0x20, 0x20]],
    GIF87a: [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61]],
    GIF89a: [[0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
    WEBP: [
      [
        0x52,
        0x49,
        0x46,
        0x46,
        undefined,
        undefined,
        undefined,
        undefined,
        0x57,
        0x45,
        0x42,
        0x50
      ]
    ],
    BMP: [
      [0x42, 0x4d], //BM - Windows 3.1x, 95, NT, ... etc.
      [0x42, 0x41], //BA - OS/2 struct bitmap array
      [0x43, 0x49], //CI - OS/2 struct color icon
      [0x43, 0x50], //CP - OS/2 const color pointer
      [0x49, 0x43], //IC - OS/2 struct icon
      [0x50, 0x54] //PT - OS/2 pointer
    ]
  };

  /**
   * Recognize filetype of Image by magic-bytes
   *
   * https://en.wikipedia.org/wiki/List_of_file_signatures
   *
   * @name getImageFileTypeByImageData
   * @public
   * @function
   * @param {string|arraybuffer} imageData imageData as binary String or arraybuffer
   * @param {string} format format of file if filetype-recognition fails, e.g. 'JPEG'
   *
   * @returns {string} filetype of Image
   */
  var getImageFileTypeByImageData =
    (jsPDFAPI.__addimage__.getImageFileTypeByImageData = function (
      imageData: ImageInput | ImageTypedArray | ArrayBuffer,
      fallbackFormat?: string
    ) {
      fallbackFormat = fallbackFormat || UNKNOWN;
      var i;
      var j;
      var result = UNKNOWN;
      var headerSchemata;
      var compareResult;
      var fileType;

      // Duck-typed RGBA check, mirroring the legacy untyped behavior (a string
      // or typed array simply has no `data` member).
      var imageDataAsRGBA = imageData as RGBAData;
      if (
        fallbackFormat === "RGBA" ||
        (imageDataAsRGBA.data !== undefined &&
          imageDataAsRGBA.data instanceof Uint8ClampedArray &&
          "height" in imageDataAsRGBA &&
          "width" in imageDataAsRGBA)
      ) {
        return "RGBA";
      }

      if (isArrayBufferView(imageData)) {
        for (fileType in imageFileTypeHeaders) {
          headerSchemata = imageFileTypeHeaders[fileType];
          for (i = 0; i < headerSchemata.length; i += 1) {
            compareResult = true;
            for (j = 0; j < headerSchemata[i].length; j += 1) {
              if (headerSchemata[i][j] === undefined) {
                continue;
              }
              if (headerSchemata[i][j] !== imageData[j]) {
                compareResult = false;
                break;
              }
            }
            if (compareResult === true) {
              result = fileType;
              break;
            }
          }
        }
      } else {
        for (fileType in imageFileTypeHeaders) {
          headerSchemata = imageFileTypeHeaders[fileType];
          for (i = 0; i < headerSchemata.length; i += 1) {
            compareResult = true;
            for (j = 0; j < headerSchemata[i].length; j += 1) {
              if (headerSchemata[i][j] === undefined) {
                continue;
              }
              if (
                headerSchemata[i][j] !== (imageData as string).charCodeAt(j)
              ) {
                compareResult = false;
                break;
              }
            }
            if (compareResult === true) {
              result = fileType;
              break;
            }
          }
        }
      }

      if (result === UNKNOWN && fallbackFormat !== UNKNOWN) {
        result = fallbackFormat;
      }
      return result;
    });

  // Image functionality ported from pdf.js
  var putImage = function (this: jsPDFDocument, image: ImageProperties) {
    var out = this.internal.write;
    var putStream = this.internal.putStream;
    var getFilters = this.internal.getFilters;

    var filter = getFilters();
    while (filter.indexOf("FlateEncode") !== -1) {
      filter.splice(filter.indexOf("FlateEncode"), 1);
    }

    image.objectId = this.internal.newObject();

    var additionalKeyValues: Array<{ key: string; value: string | number }> =
      [];
    additionalKeyValues.push({ key: "Type", value: "/XObject" });
    additionalKeyValues.push({ key: "Subtype", value: "/Image" });
    additionalKeyValues.push({ key: "Width", value: image.width });
    additionalKeyValues.push({ key: "Height", value: image.height });

    if (image.colorSpace === color_spaces.INDEXED) {
      additionalKeyValues.push({
        key: "ColorSpace",
        value:
          "[/Indexed /DeviceRGB " +
          // if an indexed png defines more than one colour with transparency, we've created a sMask
          // An INDEXED image always carries a palette.
          (image.palette!.length / 3 - 1) +
          " " +
          ("sMask" in image && typeof image.sMask !== "undefined"
            ? image.objectId + 2
            : image.objectId + 1) +
          " 0 R]"
      });
    } else {
      additionalKeyValues.push({
        key: "ColorSpace",
        value: "/" + image.colorSpace
      });
      if (image.colorSpace === color_spaces.DEVICE_CMYK) {
        additionalKeyValues.push({ key: "Decode", value: "[1 0 1 0 1 0 1 0]" });
      }
    }
    additionalKeyValues.push({
      key: "BitsPerComponent",
      value: image.bitsPerComponent
    });
    if (
      "decodeParameters" in image &&
      typeof image.decodeParameters !== "undefined"
    ) {
      additionalKeyValues.push({
        key: "DecodeParms",
        value: "<<" + image.decodeParameters + ">>"
      });
    }
    if (
      "transparency" in image &&
      Array.isArray(image.transparency) &&
      image.transparency.length > 0
    ) {
      var transparency = "",
        i = 0,
        len = image.transparency.length;
      for (; i < len; i++)
        transparency +=
          image.transparency[i] + " " + image.transparency[i] + " ";

      additionalKeyValues.push({
        key: "Mask",
        value: "[" + transparency + "]"
      });
    }
    if (typeof image.sMask !== "undefined") {
      additionalKeyValues.push({
        key: "SMask",
        value: image.objectId + 1 + " 0 R"
      });
    }

    var alreadyAppliedFilters =
      typeof image.filter !== "undefined" ? ["/" + image.filter] : undefined;

    putStream({
      data: image.data,
      additionalKeyValues: additionalKeyValues,
      alreadyAppliedFilters: alreadyAppliedFilters,
      objectId: image.objectId
    });

    out("endobj");

    // Soft mask
    if ("sMask" in image && typeof image.sMask !== "undefined") {
      const sMaskBitsPerComponent =
        image.sMaskBitsPerComponent ?? image.bitsPerComponent;
      const sMask: ImageProperties = {
        width: image.width,
        height: image.height,
        colorSpace: "DeviceGray",
        bitsPerComponent: sMaskBitsPerComponent,
        data: image.sMask
      };
      if ("filter" in image) {
        sMask.decodeParameters = `/Predictor ${image.predictor} /Colors 1 /BitsPerComponent ${sMaskBitsPerComponent} /Columns ${image.width}`;
        sMask.filter = image.filter;
      }
      putImage.call(this, sMask);
    }

    //Palette
    if (image.colorSpace === color_spaces.INDEXED) {
      var objId = this.internal.newObject();
      //out('<< /Filter / ' + img['f'] +' /Length ' + img['pal'].length + '>>');
      //putStream(zlib.compress(img['pal']));
      putStream({
        // An INDEXED image always carries a palette.
        data: arrayBufferToBinaryString(new Uint8Array(image.palette!)),
        objectId: objId
      });
      out("endobj");
    }
  };
  var putResourcesCallback = function (this: jsPDFDocument) {
    var images = this.internal.collections[namespace + "images"] as Record<
      string,
      ImageProperties
    >;
    for (var i in images) {
      putImage.call(this, images[i]);
    }
  };
  var putXObjectsDictCallback = function (this: jsPDFDocument) {
    var images = this.internal.collections[namespace + "images"] as Record<
        string,
        ImageProperties
      >,
      out = this.internal.write,
      image;
    for (var i in images) {
      image = images[i];
      // objectId is assigned by putImage() during putResources, which runs
      // before putXobjectDict.
      out("/I" + image.index, image.objectId!, "0", "R");
    }
  };

  var checkCompressValue = function (
    value?: string | number | null
  ): ImageCompression {
    if (value && typeof value === "string") value = value.toUpperCase();
    return typeof value === "string" && value in jsPDFAPI.image_compression
      ? (value as ImageCompression)
      : image_compression.NONE;
  };

  var initialize = function (this: jsPDFDocument) {
    if (!this.internal.collections[namespace + "images"]) {
      this.internal.collections[namespace + "images"] = {};
      this.internal.events.subscribe("putResources", putResourcesCallback);
      this.internal.events.subscribe("putXobjectDict", putXObjectsDictCallback);
    }
  };

  var getImages = function (this: jsPDFDocument) {
    var images = this.internal.collections[namespace + "images"] as Record<
      string,
      ImageProperties
    >;
    initialize.call(this);
    return images;
  };
  var getImageIndex = function (this: jsPDFDocument) {
    return Object.keys(
      this.internal.collections[namespace + "images"] as Record<
        string,
        ImageProperties
      >
    ).length;
  };
  var notDefined = function (value?: string | number | null) {
    return (
      typeof value === "undefined" ||
      value === null ||
      (value as string).length === 0
    );
  };
  var generateAliasFromImageData = function (
    imageData: ImageInput | ImageTypedArray
  ) {
    if (typeof imageData === "string" || isArrayBufferView(imageData)) {
      return sHashCode(imageData);
    } else if (isArrayBufferView((imageData as RGBAData).data)) {
      return sHashCode((imageData as RGBAData).data);
    }

    return null;
  };

  var isImageTypeSupported = function (type: string) {
    // Dynamic plugin dispatch: the processXXX methods are contributed by
    // the individual image-format plugins, so look them up reflectively
    // through an opaque view of the API object.
    var api: unknown = jsPDFAPI;
    return (
      typeof (api as Record<string, unknown>)[
        "process" + type.toUpperCase()
      ] === "function"
    );
  };

  var isDOMElement = function (object: unknown): object is HTMLElement {
    return typeof object === "object" && (object as HTMLElement).nodeType === 1;
  };

  var getImageDataFromElement = function (
    element: HTMLElement,
    format?: string
    // Latent bug preserved for parity: an IMG element whose src could not be
    // loaded (or a non-IMG/CANVAS element) falls off the end and yields
    // undefined; callers assert it away below.
  ): string | undefined {
    //if element is an image which uses data url definition, just return the dataurl
    if (element.nodeName === "IMG" && element.hasAttribute("src")) {
      var src = "" + element.getAttribute("src");

      //is base64 encoded dataUrl, directly process it
      if (src.indexOf("data:image/") === 0) {
        // split() always yields at least one element.
        return atob(unescape(src).split("base64,").pop()!);
      }

      //it is probably an url, try to load it
      var tmpImageData = jsPDFAPI.loadFile(src, true);
      if (tmpImageData !== undefined) {
        return tmpImageData;
      }
    }

    if (element.nodeName === "CANVAS") {
      var canvas = element as HTMLCanvasElement;
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error(
          "Given canvas must have data. Canvas width: " +
            canvas.width +
            ", height: " +
            canvas.height
        );
      }
      var mimeType;
      switch (format) {
        case "PNG":
          mimeType = "image/png";
          break;
        case "WEBP":
          mimeType = "image/webp";
          break;
        case "JPEG":
        case "JPG":
        default:
          mimeType = "image/jpeg";
          break;
      }
      // split() always yields at least one element.
      return atob(canvas.toDataURL(mimeType, 1.0).split("base64,").pop()!);
    }
  };

  var checkImagesForAlias = function (
    this: jsPDFDocument,
    alias?: number | string
  ): ImageProperties | undefined {
    var images = this.internal.collections[namespace + "images"] as Record<
      string,
      ImageProperties
    >;
    if (images) {
      for (var e in images) {
        if (alias === images[e].alias) {
          return images[e];
        }
      }
    }
  };

  var determineWidthAndHeight = function (
    this: jsPDFDocument,
    width: number,
    height: number,
    image: ImageProperties
  ) {
    if (!width && !height) {
      width = -96;
      height = -96;
    }
    if (width < 0) {
      width = (-1 * image.width * 72) / width / this.internal.scaleFactor;
    }
    if (height < 0) {
      height = (-1 * image.height * 72) / height / this.internal.scaleFactor;
    }
    if (width === 0) {
      width = (height * image.width) / image.height;
    }
    if (height === 0) {
      height = (width * image.height) / image.width;
    }

    return [width, height];
  };

  var writeImageToPDF = function (
    this: jsPDFDocument,
    x: number,
    y: number,
    width: number,
    height: number,
    image: ImageProperties,
    rotation?: number
  ) {
    var dims = determineWidthAndHeight.call(this, width, height, image),
      coord = this.internal.getCoordinateString,
      vcoord = this.internal.getVerticalCoordinateString;

    var images = getImages.call(this);

    width = dims[0];
    height = dims[1];
    // Format processors always stamp an index on the images they produce.
    images[image.index!] = image;

    // Definite-assignment assertion: assigned below whenever `rotation` is
    // truthy, which is also the only condition under which it is read.
    var rotationTransformationMatrix!: Array<string | number>;
    if (rotation) {
      rotation *= Math.PI / 180;
      var c = Math.cos(rotation);
      var s = Math.sin(rotation);
      //like in pdf Reference do it 4 digits instead of 2
      var f4 = function (number: number) {
        return number.toFixed(4);
      };
      rotationTransformationMatrix = [
        f4(c),
        f4(s),
        f4(s * -1),
        f4(c),
        0,
        0,
        "cm"
      ];
    }
    this.internal.write("q"); //Save graphics state
    if (rotation) {
      this.internal.write(
        [1, "0", "0", 1, coord(x), vcoord(y + height), "cm"].join(" ")
      ); //Translate
      this.internal.write(rotationTransformationMatrix.join(" ")); //Rotate
      this.internal.write(
        [coord(width), "0", "0", coord(height), "0", "0", "cm"].join(" ")
      ); //Scale
    } else {
      this.internal.write(
        [
          coord(width),
          "0",
          "0",
          coord(height),
          coord(x),
          vcoord(y + height),
          "cm"
        ].join(" ")
      ); //Translate and Scale
    }

    if (this.isAdvancedAPI()) {
      // draw image bottom up when in "advanced" API mode
      this.internal.write([1, 0, 0, -1, 0, 0, "cm"].join(" "));
    }

    this.internal.write("/I" + image.index + " Do"); //Paint Image
    this.internal.write("Q"); //Restore graphics state
  };

  /**
   * COLOR SPACES
   */
  var color_spaces = (jsPDFAPI.color_spaces = {
    DEVICE_RGB: "DeviceRGB",
    DEVICE_GRAY: "DeviceGray",
    DEVICE_CMYK: "DeviceCMYK",
    CAL_GREY: "CalGray",
    CAL_RGB: "CalRGB",
    LAB: "Lab",
    ICC_BASED: "ICCBased",
    INDEXED: "Indexed",
    PATTERN: "Pattern",
    SEPARATION: "Separation",
    DEVICE_N: "DeviceN"
  });

  /**
   * DECODE METHODS
   */
  jsPDFAPI.decode = {
    DCT_DECODE: "DCTDecode",
    FLATE_DECODE: "FlateDecode",
    LZW_DECODE: "LZWDecode",
    JPX_DECODE: "JPXDecode",
    JBIG2_DECODE: "JBIG2Decode",
    ASCII85_DECODE: "ASCII85Decode",
    ASCII_HEX_DECODE: "ASCIIHexDecode",
    RUN_LENGTH_DECODE: "RunLengthDecode",
    CCITT_FAX_DECODE: "CCITTFaxDecode"
  };

  /**
   * IMAGE COMPRESSION TYPES
   */
  var image_compression = (jsPDFAPI.image_compression = {
    NONE: "NONE",
    FAST: "FAST",
    MEDIUM: "MEDIUM",
    SLOW: "SLOW"
  });

  /**
   * @name sHashCode
   * @function
   * @param {string} data
   * @returns {string}
   */
  var sHashCode = (jsPDFAPI.__addimage__.sHashCode = function (
    data?: string | ImageTypedArray
  ) {
    var hash = 0,
      i,
      len;

    if (typeof data === "string") {
      len = data.length;
      for (i = 0; i < len; i++) {
        hash = (hash << 5) - hash + data.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
    } else if (isArrayBufferView(data)) {
      len = data.byteLength / 2;
      for (i = 0; i < len; i++) {
        hash = (hash << 5) - hash + data[i];
        hash |= 0; // Convert to 32bit integer
      }
    }
    return hash;
  });

  /**
   * Validates if given String is a valid Base64-String
   *
   * @name validateStringAsBase64
   * @public
   * @function
   * @param {String} possible Base64-String
   *
   * @returns {boolean}
   */
  var validateStringAsBase64 = (jsPDFAPI.__addimage__.validateStringAsBase64 =
    function (possibleBase64String?: string) {
      possibleBase64String = possibleBase64String || "";
      possibleBase64String.toString().trim();

      var result = true;

      if (possibleBase64String.length === 0) {
        result = false;
      }

      if (possibleBase64String.length % 4 !== 0) {
        result = false;
      }

      if (
        /^[A-Za-z0-9+/]+$/.test(
          possibleBase64String.substr(0, possibleBase64String.length - 2)
        ) === false
      ) {
        result = false;
      }

      if (
        /^[A-Za-z0-9/][A-Za-z0-9+/]|[A-Za-z0-9+/]=|==$/.test(
          possibleBase64String.substr(-2)
        ) === false
      ) {
        result = false;
      }
      return result;
    });

  /**
   * Strips out and returns info from a valid base64 data URI
   *
   * @name extractImageFromDataUrl
   * @function
   * @param {string} dataUrl a valid data URI of format 'data:[<MIME-type>][;base64],<data>'
   * @returns {string} The raw Base64-encoded data.
   */
  var extractImageFromDataUrl = (jsPDFAPI.__addimage__.extractImageFromDataUrl =
    function (dataUrl?: string | null) {
      if (dataUrl == null) {
        return null;
      }

      // avoid using a regexp for parsing because it might be vulnerable against ReDoS attacks

      dataUrl = dataUrl.trim();

      if (!dataUrl.startsWith("data:")) {
        return null;
      }

      const commaIndex = dataUrl.indexOf(",");
      if (commaIndex < 0) {
        return null;
      }

      const dataScheme = dataUrl.substring(0, commaIndex).trim();
      if (!dataScheme.endsWith("base64")) {
        return null;
      }

      return dataUrl.substring(commaIndex + 1);
    });

  /**
   * Tests supplied object to determine if ArrayBuffer
   *
   * @name isArrayBuffer
   * @function
   * @param {Object} object an Object
   *
   * @returns {boolean}
   */
  jsPDFAPI.__addimage__.isArrayBuffer = function (
    object: unknown
  ): object is ArrayBuffer {
    return object instanceof ArrayBuffer;
  };

  /**
   * Tests supplied object to determine if it implements the ArrayBufferView (TypedArray) interface
   *
   * @name isArrayBufferView
   * @function
   * @param {Object} object an Object
   * @returns {boolean}
   */
  var isArrayBufferView = (jsPDFAPI.__addimage__.isArrayBufferView = function (
    object: unknown
  ): object is ImageTypedArray {
    return (
      object instanceof Int8Array ||
      object instanceof Uint8Array ||
      object instanceof Uint8ClampedArray ||
      object instanceof Int16Array ||
      object instanceof Uint16Array ||
      object instanceof Int32Array ||
      object instanceof Uint32Array ||
      object instanceof Float32Array ||
      object instanceof Float64Array
    );
  });

  /**
   * Convert Binary String to ArrayBuffer
   *
   * @name binaryStringToUint8Array
   * @public
   * @function
   * @param {string} BinaryString with ImageData
   * @returns {Uint8Array}
   */
  var binaryStringToUint8Array =
    (jsPDFAPI.__addimage__.binaryStringToUint8Array = function (
      binary_string: string
    ) {
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes;
    });

  /**
   * Convert the Buffer to a Binary String
   *
   * @name arrayBufferToBinaryString
   * @public
   * @function
   * @param {ArrayBuffer|ArrayBufferView} ArrayBuffer buffer or bufferView with ImageData
   *
   * @returns {String}
   */
  var arrayBufferToBinaryString =
    (jsPDFAPI.__addimage__.arrayBufferToBinaryString = function (
      buffer: ArrayBuffer | ImageTypedArray
    ) {
      var out = "";
      // There are calls with both ArrayBuffer and already converted Uint8Array or other BufferView.
      // Do not copy the array if input is already an array.
      var buf = isArrayBufferView(buffer) ? buffer : new Uint8Array(buffer);
      for (var i = 0; i < buf.length; i += ARRAY_APPLY_BATCH) {
        // Limit the amount of characters being parsed to prevent overflow.
        // Note that while TextDecoder would be faster, it does not have the same
        // functionality as fromCharCode with any provided encodings as of 3/2021.
        // fromCharCode is declared to take number[], but accepts any
        // array-like of char codes at runtime; assert the opaque batch once.
        var batch: unknown = buf.subarray(i, i + ARRAY_APPLY_BATCH);
        out += String.fromCharCode.apply(null, batch as number[]);
      }
      return out;
    });

  /**
   * Possible parameter for addImage, an RGBA buffer with size.
   *
   * @typedef {Object} RGBAData
   * @property {Uint8ClampedArray} data - Single dimensional array of RGBA values. For example from canvas getImageData.
   * @property {number} width - Image width as the data does not carry this information in itself.
   * @property {number} height - Image height as the data does not carry this information in itself.
   */

  /**
   * Adds an Image to the PDF.
   *
   * @name addImage
   * @public
   * @function
   * @param {string|HTMLImageElement|HTMLCanvasElement|Uint8Array|RGBAData} imageData imageData as base64 encoded DataUrl or Image-HTMLElement or Canvas-HTMLElement or object containing RGBA array (like output from canvas.getImageData).
   * @param {string} format format of file if filetype-recognition fails or in case of a Canvas-Element needs to be specified (default for Canvas is JPEG), e.g. 'JPEG', 'PNG', 'WEBP'
   * @param {number} x x Coordinate (in units declared at inception of PDF document) against left edge of the page
   * @param {number} y y Coordinate (in units declared at inception of PDF document) against upper edge of the page
   * @param {number} width width of the image (in units declared at inception of PDF document)
   * @param {number} height height of the Image (in units declared at inception of PDF document)
   * @param {string} alias alias of the image (if used multiple times)
   * @param {string} compression compression of the generated JPEG, can have the values 'NONE', 'FAST', 'MEDIUM' and 'SLOW'
   * @param {number} rotation rotation of the image in degrees (0-359)
   *
   * @throws {Error} if the input is invalid, such as invalid image data.
   *
   * @returns jsPDF
   */
  jsPDFAPI.addImage = function (
    this: jsPDFDocument,
    arg0: ImageInput | ImageOptions,
    arg1?: string | number,
    arg2?: number,
    arg3?: number,
    arg4?: number,
    arg5?: number | string,
    // `number` admitted honestly: in the no-format overload this slot is the
    // compression parameter, which addSvgAsImage passes its numeric rotation
    // into (latent arg-shift bug preserved for parity; see the overload
    // declaration above). `null` admitted for parity with the context2d
    // drawImage() overload, which declares alias as string | null.
    arg6?: string | number | null,
    // null admitted for parity with the context2d drawImage() overload of
    // addImage, which declares alias/compression as string | null.
    arg7?: string | number | null,
    arg8?: number
  ) {
    var imageData, format, x, y, w, h, alias, compression, rotation;

    imageData = arg0;
    if (typeof arg1 === "number") {
      format = UNKNOWN;
      x = arg1;
      y = arg2;
      w = arg3;
      h = arg4;
      alias = arg5 as string;
      compression = arg6;
      rotation = arg7 as number;
    } else {
      format = arg1;
      x = arg2;
      y = arg3;
      w = arg4;
      h = arg5 as number;
      // The assertion only satisfies the declared signature; the svg.ts
      // number / context2d null call shapes flow on unchanged, as ever.
      alias = arg6 as string;
      compression = arg7 as string;
      rotation = arg8;
    }

    if (
      typeof imageData === "object" &&
      !isDOMElement(imageData) &&
      "imageData" in imageData
    ) {
      var options = imageData;

      imageData = options.imageData;
      format = options.format || format || UNKNOWN;
      x = options.x || x || 0;
      y = options.y || y || 0;
      w = options.w || options.width || w;
      h = options.h || options.height || h;
      alias = options.alias || alias;
      compression = options.compression || compression;
      rotation = options.rotation || options.angle || rotation;
    }

    //If compression is not explicitly set, determine if we should use compression
    var filter = this.internal.getFilters();
    if (compression === undefined && filter.indexOf("FlateEncode") !== -1) {
      compression = "SLOW";
    }

    // isNaN() coerces at runtime, so undefined yields true and throws here,
    // exactly as before; the assertions only satisfy the declared signature.
    if (isNaN(x as number) || isNaN(y as number)) {
      throw new Error("Invalid coordinates passed to jsPDF.addImage");
    }

    initialize.call(this);

    var image = processImageData.call(
      this,
      imageData as ImageInput,
      format,
      alias,
      compression
    );

    // Latent parity: w/h (and x/y for the non-throwing NaN paths) may be
    // undefined at runtime; determineWidthAndHeight only defaults them when
    // both are falsy, exactly as the untyped code did.
    writeImageToPDF.call(
      this,
      x as number,
      y as number,
      w as number,
      h as number,
      image,
      rotation
    );

    return this;
  };

  var processImageData = function (
    this: jsPDFDocument,
    imageData: ImageInput,
    format: string | undefined,
    alias?: number | string,
    // `number` honestly admitted for the svg.ts arg-shift call shape and
    // `null` for the context2d drawImage() call shape; checkCompressValue
    // maps every non-string to NONE, as it always has.
    compression?: string | number | null
  ) {
    var result, dataAsBinaryString;

    if (
      typeof imageData === "string" &&
      getImageFileTypeByImageData(imageData) === UNKNOWN
    ) {
      imageData = unescape(imageData);
      var tmpImageData: string | undefined = convertBase64ToBinaryString(
        imageData,
        false
      );

      if (tmpImageData !== "") {
        imageData = tmpImageData;
      } else {
        tmpImageData = jsPDFAPI.loadFile(imageData, true);
        if (tmpImageData !== undefined) {
          imageData = tmpImageData;
        }
      }
    }

    if (isDOMElement(imageData)) {
      // Latent parity: may be undefined for an unloadable IMG; downstream
      // code then fails just as it did before typing.
      imageData = getImageDataFromElement(imageData, format)!;
    }

    format = getImageFileTypeByImageData(imageData, format);
    if (!isImageTypeSupported(format)) {
      throw new Error(
        "addImage does not support files of type '" +
          format +
          "', please ensure that a plugin for '" +
          format +
          "' support is added."
      );
    }

    // now do the heavy lifting

    if (notDefined(alias)) {
      // Latent parity: null is possible for exotic input and flows on
      // unchanged; the assertion only fits the declared parameter type.
      alias = generateAliasFromImageData(imageData)!;
    }
    result = checkImagesForAlias.call(this, alias);

    if (!result) {
      // no need to convert if imageData is already uint8array
      if (!(imageData instanceof Uint8Array) && format !== "RGBA") {
        dataAsBinaryString = imageData as string;
        imageData = binaryStringToUint8Array(imageData as string);
      }

      // Dynamic plugin dispatch: the processXXX methods are contributed by
      // the individual image-format plugins; invoke through an opaque view
      // of the document so `this` binding is preserved.
      var host: unknown = this;
      result = (host as Record<string, ImageFormatProcessor>)[
        "process" + format.toUpperCase()
      ](
        imageData,
        getImageIndex.call(this),
        alias,
        checkCompressValue(compression),
        dataAsBinaryString
      );
    }

    if (!result) {
      throw new Error("An unknown error occurred whilst processing the image.");
    }
    return result;
  };

  /**
   * @name convertBase64ToBinaryString
   * @function
   * @param {string} stringData
   * @returns {string} binary string
   */
  var convertBase64ToBinaryString =
    (jsPDFAPI.__addimage__.convertBase64ToBinaryString = function (
      stringData: string,
      throwError?: boolean
    ) {
      throwError = typeof throwError === "boolean" ? throwError : true;
      var imageData = "";
      var rawData;

      if (typeof stringData === "string") {
        rawData = extractImageFromDataUrl(stringData) ?? stringData;

        try {
          imageData = atob(rawData);
        } catch (e) {
          if (throwError) {
            if (!validateStringAsBase64(rawData)) {
              throw new Error(
                "Supplied Data is not a valid base64-String jsPDF.convertBase64ToBinaryString "
              );
            } else {
              throw new Error(
                "atob-Error in jsPDF.convertBase64ToBinaryString " +
                  (e as Error).message
              );
            }
          }
        }
      }
      return imageData;
    });

  /**
   * @name getImageProperties
   * @function
   * @param {Object} imageData
   * @returns {Object}
   */
  jsPDFAPI.getImageProperties = function (
    this: jsPDFDocument,
    imageData: ImageInput
  ) {
    var image;
    var tmpImageData = "";
    var format;

    if (isDOMElement(imageData)) {
      // Latent parity: may be undefined for an unloadable IMG; downstream
      // code then fails just as it did before typing.
      imageData = getImageDataFromElement(imageData)!;
    }

    if (
      typeof imageData === "string" &&
      getImageFileTypeByImageData(imageData) === UNKNOWN
    ) {
      tmpImageData = convertBase64ToBinaryString(imageData, false);

      if (tmpImageData === "") {
        tmpImageData = jsPDFAPI.loadFile(imageData) || "";
      }
      imageData = tmpImageData;
    }

    format = getImageFileTypeByImageData(imageData);
    if (!isImageTypeSupported(format)) {
      throw new Error(
        "addImage does not support files of type '" +
          format +
          "', please ensure that a plugin for '" +
          format +
          "' support is added."
      );
    }

    if (!(imageData instanceof Uint8Array)) {
      imageData = binaryStringToUint8Array(imageData as string);
    }

    // Dynamic plugin dispatch: the processXXX methods are contributed by
    // the individual image-format plugins; invoke through an opaque view
    // of the document so `this` binding is preserved.
    var host: unknown = this;
    image = (host as Record<string, ImageFormatProcessor>)[
      "process" + format.toUpperCase()
    ](imageData);

    if (!image) {
      throw new Error("An unknown error occurred whilst processing the image");
    }

    image.fileType = format;

    return image;
  };
})(jsPDF.API);
