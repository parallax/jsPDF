const karmaConfig = require("../../karma.common.conf.js");
const { babel } = require("@rollup/plugin-babel");
const replace = require("@rollup/plugin-replace");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");

module.exports = config => {
  config.set({
    ...karmaConfig,

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
        // Type-stripping only; type-checking runs separately via
        // `tsc --noEmit -p test/deployment/typescript/tsconfig.json`
        // (the TypeScript 7 native compiler has no JS API for bundlers).
        babel({
          babelHelpers: "bundled",
          babelrc: false,
          configFile: false,
          presets: [
            ["@babel/preset-typescript", { allowDeclareFields: true }]
          ],
          extensions: [".js", ".mjs", ".ts"]
        }),
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
