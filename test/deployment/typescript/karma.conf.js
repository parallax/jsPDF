const karmaConfig = require("../../karma.common.conf.js");
const typescript = require("@rollup/plugin-typescript");
const replace = require("@rollup/plugin-replace");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");

module.exports = config => {
  config.set({
    ...karmaConfig,

    frameworks: [...karmaConfig.frameworks, "karma-typescript"],

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "../../..",

    // list of files / patterns to load in the browser
    files: [
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

    preprocessors: {
      "test/deployment/typescript/*.spec.ts": "rollup"
    },

    rollupPreprocessor: {
      plugins: [
        typescript({ tsconfig: "test/deployment/typescript/tsconfig.json" }),
        replace({
          delimiters: ["", ""],
          '"jspdf"': '"../../../dist/jspdf.es.js"'
        }),
        resolve(),
        commonjs()
      ],
      output: {
        format: "iife",
        name: "jspdf",
        sourcemap: "inline"
      },
      external: Object.keys(
        require("../../../package.json").optionalDependencies
      )
    }
  });
};
