const karmaConfig = require("../../karma.common.conf.js");

module.exports = config => {
  config.set({
    ...karmaConfig,

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "../../..",

    // list of files / patterns to load in the browser
    files: [
      "dist/polyfills.umd.js",
      "node_modules/regenerator-runtime/runtime.js",

      "dist/jspdf.umd.js",
      "node_modules/canvg/lib/umd.js",
      "node_modules/html2canvas/dist/html2canvas.js",
      "node_modules/dompurify/dist/purify.js",

      { pattern: "test/deployment/globals/loadGlobals.ts", type: "js" },
      { pattern: "test/utils/compare.ts", type: "js" },

      { pattern: "test/deployment/globals/globals.spec.ts", type: "js" },

      {
        pattern: "test/specs/*.spec.ts",
        included: true,
        watched: true,
        served: true,
        type: "js"
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
      "test/**/*.spec.ts": "babel",
      "test/utils/compare.ts": "babel",
      "test/**/loadGlobals.ts": "babel"
    }
  });
};
