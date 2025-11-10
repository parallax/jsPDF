const karmaConfig = require("../../karma.common.conf.js");

module.exports = config => {
  config.set({
    ...karmaConfig,

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "../../..",

    // list of files / patterns to load in the browser
    files: [
      "node_modules/regenerator-runtime/runtime.js",
      "dist/polyfills.umd.js",
      "dist/jspdf.umd.js",
      "node_modules/canvg/lib/umd.js",
      "node_modules/html2canvas/dist/html2canvas.js",
      "node_modules/dompurify/dist/purify.js",

      "test/compiled/utils/compare.js",

      "test/compiled/deployment/esm/*.spec.js",

      {
        pattern: "test/compiled/specs/*.spec.js",
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
      ...karmaConfig.preprocessors
    },

    browsers: ["Chrome", "Firefox"]
  });
};
