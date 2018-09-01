import './node_modules/cf-blob.js/Blob.js';
import './node_modules/file-saver/FileSaver.js';
import './node_modules/omggif/omggif.js';
import './node_modules/html2canvas/dist/html2canvas.js';

//patch for html2canvas
(function ( globalObj) {
	globalObj.html2canvas = exports.html2canvas;
} (typeof window !== "undefined" && window || typeof global !== "undefined" && global));