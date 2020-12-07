const karmaConfig = require("../../karma.common.conf.js");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");

module.exports = config => {
  config.set({
    ...karmaConfig,

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "../../..",

    // list of files / patterns to load in the browser
    files: [
      "node_modules/regenerator-runtime/runtime.js",
      "node_modules/canvg/lib/umd.js",
      "node_modules/html2canvas/dist/html2canvas.js", // load html2canvas globally - can't test dynamic import without symbolic name resolution
      "node_modules/dompurify/dist/purify.js",

      "test/utils/compare.js",
      "test/deployment/esm/loadGlobals.js",

      {
        pattern: "test/deployment/esm/asyncImportHelper.js",
        included: true,
        watched: true,
        type: "module"
      },

      "test/deployment/esm/esm.spec.js",

      {
        pattern: "test/specs/*.spec.js",
        included: true,
        watched: true,
        served: true
      },
      {
        pattern: "test/**/*.+(svg|png|jpg|jpeg|ttf|txt)",
        included: false,
        served: true
      },
      {
        pattern: "test/reference/**/*.pdf",
        included: false,
        watched: false,
        served: true
      }
    ],

    preprocessors: {
      "test/deployment/esm/asyncImportHelper.js": ["rollup"]
    },

    rollupPreprocessor: {
      plugins: [resolve(), commonjs()],
      output: {
        format: "iife",
        name: "jspdf",
        sourcemap: "inline"
      },
      external: Object.keys(
        require("../../../package.json").optionalDependencies
      )
    },

    browsers: ["Chrome", "Firefox"]
  });
};
