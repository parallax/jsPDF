/* eslint-disable no-empty */
/* eslint-disable no-console */
"use strict";

var fs = require("fs");
const rollup = require("rollup");
const rollupConfig = require("./rollup.config");
var uglify = require("uglify-js");
var execSync = require("child_process").execSync;

const args = process.argv
  .slice(2)
  .map(arg => arg.split("="))
  .reduce((args, [value, key]) => {
    args[value] = key;
    return args;
  }, {});

switch (args.type) {
  case "worker":
    bundle({
      type: args.type,
      distFolder: "dist",
      config: "./build.worker.conf.js",
      context: "global",
      minify: args.minify || true,
      format: "cjs",
      filename: "jspdf.worker"
    });
    break;
  case "node":
    bundle({
      type: args.type,
      distFolder: "dist",
      config: "./build.node.conf.js",
      context: "global",
      minify: args.minify || true,
      format: "cjs",
      filename: "jspdf.node"
    });
    break;
  case "browser":
  default:
    bundle({
      type: args.type,
      distFolder: "dist",
      config: "./build.browser.conf.js",
      minify: args.minify || true,
      format: "umd",
      context: "window",
      filename: "jspdf"
    });
    break;
}

function bundle(options) {
  console.log(
    "Start Bundling " +
      options.distFolder +
      "/" +
      options.filename +
      ".debug.js"
  );
  const plugins =
    options.type === "node" ? rollupConfig.nodePlugins : rollupConfig.plugins;
  rollup
    .rollup({
      input: options.config,
      context: options.context,
      plugins: plugins
    })
    .then(bundle => {
      return bundle.generate({
        format: options.format,
        name: "jsPDF"
      });
    })
    .then(output => {
      let code = output["output"][0].code;
      code = code.replace(
        /Permission\s+is\s+hereby\s+granted[\S\s]+?IN\s+THE\s+SOFTWARE\./,
        "Licensed under the MIT License"
      );
      code = code.replace(
        /Permission\s+is\s+hereby\s+granted[\S\s]+?IN\s+THE\s+SOFTWARE\./g,
        ""
      );

      code = renew(code);

      code = code.replace(/}\)\);\s*$/, "return jsPDF;\n$&");
      code = code + "\ntry {\nmodule.exports = jsPDF;\n}\ncatch (e) {}\n"; // inserted by build.js make require('jspdf.debug') work in node\n
      fs.writeFileSync(
        options.distFolder + "/" + options.filename + ".debug.js",
        code
      );

      console.log(
        "Finish Bundling " +
          options.distFolder +
          "/" +
          options.filename +
          ".debug.js"
      );
      if (options.minify === true) {
        console.log(
          "Minifiying " +
            options.distFolder +
            "/" +
            options.filename +
            ".debug.js to " +
            options.filename +
            ".min.js"
        );
        var minified = uglify.minify(code, {
          output: {
            comments: /@preserve|@license|copyright/i
          }
        });
        fs.writeFileSync(
          options.distFolder + "/" + options.filename + ".min.js",
          minified.code
        );
      }
    })
    .catch(err => {
      console.error(err);
    });
}

function renew(code) {
  var date = new Date().toISOString();
  var version = require("./package.json").version;
  var commit = "00000000";
  try {
    commit = execSync("git rev-parse --short=10 HEAD")
      .toString()
      .trim();
  } catch (e) {}
  code = code.replace(
    /jsPDF\.version\s*=\s*['"]0\.0\.0['"]/g,
    `jsPDF.version = '${version}'`
  );
  code = code.replace(/\$\{versionID\}/g, version);
  code = code.replace(/\$\{builtOn\}/g, date);
  code = code.replace("${commitID}", commit);
  code = code.replace(/1\.0\.0-trunk/, version + " " + date);

  return code;
}
