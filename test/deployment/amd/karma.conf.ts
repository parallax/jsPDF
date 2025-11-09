const karmaConfig = require("../../karma.common.conf.ts");

module.exports = config => {
  config.set({
    ...karmaConfig,

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "../../..",

    // list of files / patterns to load in the browser
    files: [
      "dist/polyfills.umd.js",
      "node_modules/requirejs/require.js",
      "node_modules/regenerator-runtime/runtime.js",
      {
        pattern: "dist/jspdf.umd*.js",
        included: false
      },
      {
        pattern: "node_modules/canvg/lib/umd.js*",
        included: false
      },
      {
        pattern: "node_modules/html2canvas/dist/html2canvas.js",
        included: false
      },
      {
        pattern: "node_modules/dompurify/dist/purify.js",
        included: false
      },

      "test/utils/compare.ts",
      "test/deployment/amd/loadGlobals.ts",

      "test/deployment/amd/amd.spec.ts",

      {
        pattern: "test/specs/*.spec.ts",
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
      "test/**/!(acroform|unicode)*.spec.ts": "babel",
      "test/utils/compare.ts": "babel"
    }
  });
};
