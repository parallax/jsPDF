import terser from "@rollup/plugin-terser";
import { babel } from "@rollup/plugin-babel";
import RollupPluginPreprocess from "rollup-plugin-preprocess";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import replace from "@rollup/plugin-replace";
import license from "rollup-plugin-license";
import pkg from "./package.json";
import fs from "fs";
import path from "path";

// TypeScript sources keep their original ".js" (or extensionless) import
// specifiers; resolve them to the ".ts" file when it exists.
function tsResolve() {
  return {
    name: "ts-resolve",
    resolveId(source, importer) {
      if (!importer || !/^\.\.?\//.test(source)) {
        return null;
      }
      const base = source.endsWith(".js") ? source.slice(0, -3) : source;
      const ts = path.resolve(path.dirname(importer), base + ".ts");
      return fs.existsSync(ts) ? ts : null;
    }
  };
}

// Type-stripping only, and only for .ts files — .js sources pass through
// untouched.
function babelStripTypes() {
  return babel({
    babelHelpers: "bundled",
    babelrc: false,
    configFile: false,
    include: ["**/*.ts"],
    presets: [["@babel/preset-typescript", { allowDeclareFields: true }]],
    extensions: BABEL_EXTENSIONS,
    skipPreflightCheck: true
  });
}

const BABEL_EXTENSIONS = [".js", ".mjs", ".ts"];

// rollup-plugin-preprocess defaults to include: ["**/*.js"] and infers the
// preprocess rule set from the file extension (there is no "ts" rule), so
// both must be set explicitly or directives in .ts files are silently skipped.
function preprocessPlugin(format) {
  return RollupPluginPreprocess({
    include: ["**/*.js", "**/*.ts"],
    options: { type: "js" },
    context: { MODULE_FORMAT: format }
  });
}

function replaceVersion() {
  return replace({
    delimiters: ["", ""],
    "0.0.0": pkg.version
  });
}

function licenseBanner() {
  let commit = "00000000";
  try {
    commit = execSync("git rev-parse --short=10 HEAD")
      .toString()
      .trim();
  } catch (e) {}
  return license({
    banner: {
      content: { file: "./src/license.js" },
      data: {
        versionID: pkg.version,
        builtOn: new Date().toISOString(),
        commitID: commit
      }
    }
  });
}

const umdExternals = matchSubmodules([
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.optionalDependencies || {})
]);

const terserOptions = {
  ecma: 2023,
  module: true,
  compress: {
    ecma: 2023,
    passes: 2
  },
  mangle: {
    safari10: true
  }
};

const externals = matchSubmodules([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.optionalDependencies || {})
]);

const umd = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/jspdf.umd.js",
      format: "umd",
      name: "jspdf",
      exports: "named",
      sourcemap: true
    },
    {
      file: "dist/jspdf.umd.min.js",
      format: "umd",
      name: "jspdf",
      plugins: [terser(terserOptions)],
      exports: "named",
      sourcemap: true
    }
  ],
  external: umdExternals,
  plugins: [
    tsResolve(),
    resolve(),
    commonjs(),
    preprocessPlugin("umd"),
    replaceVersion(),
    babel({
      babelHelpers: "bundled",
      configFile: "./.babelrc.json",
      extensions: BABEL_EXTENSIONS
    }),
    licenseBanner()
  ]
};

const es = {
  input: "src/index.ts",
  output: [
    {
      file: pkg.module.replace(".min", ""),
      format: "es",
      name: "jspdf",
      sourcemap: true,
      plugins: []
    },
    {
      file: pkg.module,
      format: "es",
      name: "jspdf",
      sourcemap: true,
      plugins: [terser(terserOptions)]
    }
  ],
  external: externals,
  plugins: [
    tsResolve(),
    resolve(),
    preprocessPlugin("es"),
    replaceVersion(),
    babel({
      babelHelpers: "runtime",
      configFile: "./.babelrc.esm.json",
      extensions: BABEL_EXTENSIONS
    }),
    licenseBanner()
  ]
};
const node = {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main.replace(".min", ""),
      format: "cjs",
      name: "jspdf",
      exports: "named",
      sourcemap: true,
      plugins: []
    },
    {
      file: pkg.main,
      format: "cjs",
      name: "jspdf",
      exports: "named",
      sourcemap: true,
      plugins: [terser(terserOptions)]
    }
  ],
  external: externals,
  plugins: [
    tsResolve(),
    resolve(),
    preprocessPlugin("cjs"),
    replaceVersion(),
    babelStripTypes(),
    licenseBanner()
  ]
};

const umdPolyfills = {
  input: "src/polyfills.js",
  output: [
    {
      file: "dist/polyfills.umd.js",
      format: "umd",
      name: "jspdf-polyfills",
      plugins: [terser(terserOptions)]
    }
  ],
  external: [],
  plugins: [
    tsResolve(),
    resolve(),
    commonjs(),
    babelStripTypes(),
    license({
      banner: {
        content: { file: "./node_modules/core-js/LICENSE" }
      }
    }),
    licenseBanner()
  ]
};

const esPolyfills = {
  input: "src/polyfills.js",
  output: [
    {
      file: "dist/polyfills.es.js",
      format: "es",
      name: "jspdf-polyfills",
      plugins: [terser(terserOptions)]
    }
  ],
  external: externals,
  plugins: [tsResolve(), babelStripTypes(), licenseBanner()]
};

function matchSubmodules(externals) {
  return externals.map(e => new RegExp(`^${e}(?:[/\\\\]|$)`));
}

export default [umd, es, node, umdPolyfills, esPolyfills];
