const rollupResolve = require('rollup-plugin-node-resolve');
const rollupBabel = require('rollup-plugin-babel');

// Monkey patching filesaver and html2canvas
function monkeyPatch() {
  return {
    transform: (code, id) => {
      const file = id.split('/').pop();

      // Only one define call per module is allowed by requirejs so
      // we have to remove calls that other libraries make
      if (file === 'FileSaver.js') {
        code = code.replace(/define !== null\) && \(define.amd != null/g, '0');
      } else if (file === 'html2canvas.js') {
        code = code.replace(/&&\s+define.amd/g, '&& define.amd && false');
      }

      return code;
    },
  };
}

// Rollup removes local variables unless used within a module.
// This plugin makes sure specified local variables are preserved
// and kept local. This plugin wouldn't be necessary if es2015
// modules would be used.
function rawjs(opts) {
  opts = opts || {};
  return {
    transform: (code, id) => {
      const variable = opts[id.split('/').pop()];
      if (!variable) {
        return code;
      }

      const keepStr =
        '/*rollup-keeper-start*/window.tmp=' +
        variable +
        ';/*rollup-keeper-end*/';
      return code + keepStr;
    },
    transformBundle: code => {
      for (const file in opts) {
        const r = new RegExp(opts[file] + '\\$\\d+', 'g');
        code = code.replace(r, opts[file]);
      }
      const re = /\/\*rollup-keeper-start\*\/.*\/\*rollup-keeper-end\*\//g;
      return code.replace(re, '');
    },
  };
}

module.exports = [
  rollupResolve(),
  monkeyPatch(),
  rawjs({
    'jspdf.js': 'jsPDF',
    'filesaver.tmp.js': 'saveAs',
    'filesaver.js': 'saveAs',
    'deflate.js': 'Deflater',
    'zlib.js': 'FlateStream',
    'BMPDecoder.js': 'BmpDecoder',
    'omggif.js': 'GifReader',
    'JPEGEncoder.js': 'JPEGEncoder',
    'html2pdf.js': 'html2pdf',
  }),
  rollupBabel(),
];
