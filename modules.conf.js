var configuration = {
  license: {
    name: "License",
    folder: "",
    description: "MIT License Header",
    deps: []
  },

  polyfill: {
    name: "Polyfill",
    folder: "libs",
    description: "Adds missing functions to older browsers",
    deps: []
  },

  jspdf: {
    name: "Core",
    folder: "",
    description: "",
    deps: ["license", "rgbcolor"]
  },

  rgbcolor: {
    name: "rgbcolor",
    folder: "libs",
    description: "RGBcolor",
    deps: []
  },

  standard_fonts_metrics: {
    name: "Standard Font Metrics Plugin",
    folder: "modules",
    description: "Adds the Font metrics of the 14 Standard Fonts",
    deps: ["jspdf"]
  },

  split_text_to_size: {
    name: "Split text to size Plugin",
    folder: "modules",
    description: "",
    deps: ["jspdf", "standard_fonts_metrics"]
  },

  acroform: {
    name: "AcroForm Plugin",
    folder: "modules",
    description: "",
    deps: ["jspdf", "annotations"]
  },

  addimage: {
    name: "AddImage Plugin",
    folder: "modules",
    description: "",
    deps: ["jspdf"]
  },

  jpeg_support: {
    name: "JPEG Support",
    folder: "modules",
    description: "",
    deps: ["jspdf", "modules/addimage", "libs/JPEGEncoder"]
  },

  JPEGEncoder: {
    name: "JPEG Encoder",
    folder: "libs",
    description: "",
    deps: []
  },

  bmp_support: {
    name: "BMP Support",
    folder: "modules",
    description: "",
    deps: ["jspdf", "jpeg_support", "BMPDecoder"]
  },

  BMPDecoder: {
    name: "BMP Encoder",
    folder: "libs",
    description: "",
    deps: []
  },

  png: {
    name: "PNG Encoder",
    folder: "libs",
    description: "",
    deps: []
  },
  zlib: {
    name: "zlib",
    folder: "libs",
    description: "",
    deps: []
  },
  gif_support: {
    name: "Gif Support",
    folder: "modules",
    description: "",
    deps: ["jspdf", "jpeg_support", "omggif"]
  },
  omggif: {
    name: "omggif",
    folder: "libs",
    description: "",
    deps: []
  },

  webp_support: {
    name: "WebP Support",
    folder: "modules",
    description: "",
    deps: ["jspdf", "jpeg_support", "WebPDecoder"]
  },
  WebPDecoder: {
    name: "WebPDecoder",
    folder: "libs",
    description: "",
    deps: []
  },

  annotations: {
    name: "Annotations Plugin",
    folder: "modules",
    description: "",
    deps: ["jspdf", "standard_fonts_metrics", "split_text_to_size"]
  },

  autoprint: {
    name: "AutoPrint Plugin",
    folder: "modules",
    description: "",
    deps: ["jspdf"]
  },

  cell: {
    name: "cell Plugin",
    folder: "modules",
    description: "",
    deps: ["jspdf"]
  },

  filters: {
    name: "Filter Plugin",
    description: "",
    deps: ["jspdf"]
  },

  fileloading: {
    name: "FileLoading Plugin",
    folder: "modules",
    description: "",
    deps: ["jspdf"]
  },

  outline: {
    name: "Outline Plugin",
    folder: "modules",
    deps: ["jspdf"]
  },

  javascript: {
    name: "Javascript Plugin",
    folder: "modules",
    description: "",
    deps: ["jspdf"]
  },
  canvas: {
    name: "Canvas Plugin",
    folder: "modules",
    description: "",
    deps: ["jspdf"]
  },

  context2d: {
    name: "Context2D Plugin",
    folder: "modules",
    deps: [
      "jspdf",
      "canvas",
      "addimage",
      "standard_fonts_metrics",
      "split_text_to_size",
      "rgbcolor"
    ]
  },

  total_pages: {
    name: "TotalPages Plugin",
    folder: "modules",
    deps: ["jspdf"]
  },

  setlanguage: {
    name: "Language Tag Plugin",
    folder: "modules",
    deps: ["jspdf"]
  },

  svg: {
    name: "SVG Plugin",
    folder: "modules",
    deps: ["jspdf"]
  },

  viewerpreferences: {
    name: "ViewerPreferences Plugin",
    folder: "modules",
    deps: ["jspdf"]
  },

  html: {
    name: "HTML Plugin",
    folder: "modules",
    description: "",
    deps: ["jspdf", "context2d", "annotations"]
  },

  ttfsupport: {
    name: "TTFFont Support",
    folder: "modules",
    description: "",
    deps: ["jspdf", "vfs", "ttffont"]
  },
  ttffont: {
    name: "TTFFont Class",
    folder: "libs",
    description: "",
    deps: []
  },

  "modules/utf8": {
    name: "UTF8 Plugin",
    folder: "modules",
    description: "",
    deps: ["jspdf", "ttfsupport", "bidiEngine"]
  },

  bidiEngine: {
    name: "BiDiEngine",
    folder: "libs",
    description: "",
    deps: []
  },

  arabic: {
    name: "Arabic Plugin",
    folder: "modules",
    description: "",
    deps: ["utf8"]
  },

  vfs: {
    name: "virtual FileSystem Plugin",
    folder: "modules",
    description: "",
    deps: ["jspdf"]
  },

  xmp_metadata: {
    name: "XMP Metadata Plugin",
    folder: "modules",
    description: "",
    deps: ["jspdf"]
  },

  FileSaver: {
    name: "FileSaver",
    folder: "libs",
    description: "",
    deps: ["Blob"]
  },

  Blob: {
    name: "Blob",
    folder: "libs",
    description: "",
    deps: []
  },
  md5: {
    name: "md5",
    folder: "libs",
    description: "Implementation of MD5 hashing",
    deps: []
  },
  rc4: {
    name: "rc4",
    folder: "libs",
    description: "Implementation of RC4 encryption",
    deps: []
  },
  pdfsecurity: {
    name: "pdfsecurity",
    folder: "libs",
    description: "",
    deps: ["md5", "rc4"]
  }
};

module.exports = configuration;
