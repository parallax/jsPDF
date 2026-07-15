/**
 * Compares the public API surface of two CommonJS jsPDF bundles.
 *
 * Usage:
 *   node test/utils/api-parity.js <reference-bundle> <candidate-bundle>
 *   node test/utils/api-parity.js --dump <bundle>
 *
 * Compared surfaces:
 *   - named exports of the bundle (incl. AcroForm classes)
 *   - static keys of the jsPDF constructor (version, API, ...)
 *   - keys of jsPDF.API (the plugin surface)
 *   - own + prototype keys of a jsPDF instance
 *
 * Exits non-zero when the candidate differs from the reference.
 */
"use strict";

const path = require("path");

function surface(bundlePath) {
  const mod = require(path.resolve(bundlePath));
  const jsPDF = mod.jsPDF;
  if (typeof jsPDF !== "function") {
    throw new Error(bundlePath + " does not export a jsPDF constructor");
  }
  const doc = new jsPDF();
  const instanceKeys = new Set(Object.keys(doc));
  let proto = Object.getPrototypeOf(doc);
  while (proto && proto !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      instanceKeys.add(key);
    }
    proto = Object.getPrototypeOf(proto);
  }
  return {
    exports: Object.keys(mod).sort(),
    statics: Object.keys(jsPDF).sort(),
    api: Object.keys(jsPDF.API).sort(),
    instance: Array.from(instanceKeys).sort()
  };
}

function diff(name, ref, cand) {
  const refSet = new Set(ref);
  const candSet = new Set(cand);
  const missing = ref.filter(k => !candSet.has(k));
  const added = cand.filter(k => !refSet.has(k));
  if (missing.length || added.length) {
    console.error("API MISMATCH in " + name + ":");
    if (missing.length) console.error("  missing: " + missing.join(", "));
    if (added.length) console.error("  added:   " + added.join(", "));
    return false;
  }
  console.log(name + ": OK (" + ref.length + " keys)");
  return true;
}

function main() {
  const args = process.argv.slice(2);
  if (args[0] === "--dump") {
    console.log(JSON.stringify(surface(args[1]), null, 2));
    return;
  }
  if (args.length !== 2) {
    console.error(
      "usage: node test/utils/api-parity.js <reference-bundle> <candidate-bundle>"
    );
    process.exit(2);
  }
  const ref = args[0].endsWith(".json")
    ? JSON.parse(require("fs").readFileSync(args[0], "utf8"))
    : surface(args[0]);
  const cand = surface(args[1]);
  let ok = true;
  for (const name of ["exports", "statics", "api", "instance"]) {
    ok = diff(name, ref[name], cand[name]) && ok;
  }
  if (!ok) process.exit(1);
  console.log("API surface identical.");
}

main();
