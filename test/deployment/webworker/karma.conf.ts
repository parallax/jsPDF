const karmaConfig = require("../../karma.common.conf.ts");

module.exports = config => {
  config.set({
    ...karmaConfig,

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "../../..",

    // list of files / patterns to load in the browser
    files: [
      "node_modules/regenerator-runtime/runtime.js",

      {
        pattern: "dist/jspdf.umd*.js",
        included: false
      },
      {
        pattern: "test/deployment/webworker/worker.ts",
        included: false
      },

      "test/utils/compare.ts",

      {
        pattern: "test/deployment/webworker/*.spec.ts",
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

    browsers: ["Chrome", "Firefox"],

    preprocessors: {
      "test/**/!(acroform|unicode)*.spec.ts": "babel",
      "test/utils/compare.ts": "babel"
    }
  });
};
