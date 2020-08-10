const karmaConfig = require("../../karma.common.conf.js");

module.exports = config => {
  config.set({
    ...karmaConfig,

    frameworks: [...karmaConfig.frameworks, "karma-typescript"],

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "../../..",

    // list of files / patterns to load in the browser
    files: [
      {
        pattern: "dist/jspdf.es*.js",
        included: false
      },

      "test/utils/compare.js",
      {
        pattern: "test/deployment/typescript/*.spec.ts",
        type: "module"
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

    karmaTypescriptConfig: {
      tsconfig: "test/deployment/typescript/tsconfig.json",
      bundlerOptions: {
        transforms: [
          function(context, callback) {
            if (/\.spec\.ts/.test(context.module)) {
              context.ts.transpiled = context.ts.transpiled.replace(
                /["']jspdf["']/g,
                "'/base/dist/jspdf.es.js'"
              );
              return callback(undefined, true, false);
            }
            return callback(undefined, false);
          }
        ]
      }
    },

    preprocessors: {
      "test/deployment/typescript/*.spec.ts": "karma-typescript"
    }
  });
};
