/**
 * Jasmine helper (must be first in the helpers list): lets the Node test run
 * load TypeScript spec files.
 *
 * - @babel/register strips types and rewrites ES modules to CommonJS for
 *   required ".ts" files (CI still runs Node 20, which has no native type
 *   stripping).
 * - The Module._resolveFilename patch resolves the repo convention of ".js"
 *   import specifiers pointing at ".ts" files (see CONTRIBUTING.md).
 */
"use strict";

const Module = require("module");

require("@babel/register")({
  extensions: [".ts"],
  babelrc: false,
  configFile: false,
  presets: [
    [
      "@babel/preset-typescript",
      { allExtensions: true, allowDeclareFields: true }
    ]
  ],
  plugins: ["@babel/plugin-transform-modules-commonjs"],
  cache: true
});

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function(request, ...rest) {
  try {
    return originalResolveFilename.call(this, request, ...rest);
  } catch (error) {
    if (request.endsWith(".js")) {
      try {
        return originalResolveFilename.call(
          this,
          request.slice(0, -3) + ".ts",
          ...rest
        );
      } catch (ignored) {
        throw error;
      }
    }
    throw error;
  }
};
