import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";
import RollupPluginPreprocess from "rollup-plugin-preprocess";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import replace from "@rollup/plugin-replace";
import license from "rollup-plugin-license";
import pkg from "./package.json";

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
const externals = matchSubmodules([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.optionalDependencies || {})
]);

const umd = {
  input: "src/index.js",
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
      plugins: [terser({})],
      exports: "named",
      sourcemap: true
    }
  ],
  external: umdExternals,
  plugins: [
    resolve(),
    commonjs(),
    RollupPluginPreprocess({ context: { MODULE_FORMAT: "umd" } }),
    replaceVersion(),
    babel({ babelHelpers: "bundled", configFile: "./.babelrc.json" }),
    licenseBanner()
  ]
};

const es = {
  input: "src/index.js",
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
      plugins: [terser({})]
    }
  ],
  external: externals,
  plugins: [
    resolve(),
    RollupPluginPreprocess({ context: { MODULE_FORMAT: "es" } }),
    replaceVersion(),
    babel({ babelHelpers: "runtime", configFile: "./.babelrc.esm.json" }),
    licenseBanner()
  ]
};
const node = {
  input: "src/index.js",
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
      plugins: [terser({})]
    }
  ],
  external: externals,
  plugins: [
    resolve(),
    RollupPluginPreprocess({ context: { MODULE_FORMAT: "cjs" } }),
    replaceVersion(),
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
      plugins: [terser({})]
    }
  ],
  external: [],
  plugins: [
    resolve(),
    commonjs(),
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
      plugins: [terser({})]
    }
  ],
  external: externals,
  plugins: [licenseBanner()]
};

function matchSubmodules(externals) {
  return externals.map(e => new RegExp(`^${e}(?:[/\\\\]|$)`));
}

export default [umd, es, node, umdPolyfills, esPolyfills];
