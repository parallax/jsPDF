'use strict';

const fs = require('fs');
const rollup = require('rollup');
const rollupConfig = require('./rollup.config');
const uglify = require('uglify-js');
const execSync = require('child_process').execSync;

const args = process.argv
    .slice(2)
    .map(arg => arg.split('='))
    .reduce((args, [value, key]) => {
        args[value] = key;
        return args;
    }, {});

switch (args.type) {
    case 'node':
        bundle({
          distFolder : 'dist',
          config: './build.node.conf.js',
          context: 'global',
          minify: true,
          format: 'cjs',
          filename: 'jspdf.node'
        })
        break;
    case 'browser':
    default:
        bundle({
          distFolder : 'dist',
          config: './build.browser.conf.js',
          minify: true,
          format: 'umd',
          filename: 'jspdf'
        });
        break;
}

function bundle(options) {
  console.log('Start Bundling ' + options.distFolder + '/' + options.filename + '.debug.js');
  rollup.rollup({
    input: options.config,
    context: options.context,
    plugins: rollupConfig.plugins,
  }).then((bundle) => {
    return bundle.generate({
      format: options.format,
      name: 'jsPDF'
    })
  }).then(output => {
    let code = output.code
    code = code.replace(
      /Permission\s+is\s+hereby\s+granted[\S\s]+?IN\s+THE\s+SOFTWARE\./,
      'Licensed under the MIT License'
    );
    code = code.replace(
      /Permission\s+is\s+hereby\s+granted[\S\s]+?IN\s+THE\s+SOFTWARE\./g,
      ''
    )

    code = renew(code);

    code = code + "\ntry {\nmodule.exports = jsPDF;\n}\ncatch (e) {}\n";  // inserted by build.js make require('jspdf.debug') work in node\n
    fs.writeFileSync(options.distFolder + '/' + options.filename + '.debug.js', code)

    console.log('Finish Bundling ' + options.distFolder + '/' + options.filename + '.debug.js');
    if (options.minify === true) {

    console.log('Minifiying ' + options.distFolder + '/' + options.filename + '.debug.js to ' + options.filename + '.min.js');
        var minified = uglify.minify(code, {
          output: {
            comments: /@preserve|@license|copyright/i
          }
        })
        fs.writeFileSync(options.distFolder + '/' + options.filename + '.min.js', minified.code)
    }
  }).catch((err) => {
    console.error(err)
  })
}

function renew(code) {
  const date = new Date().toISOString();
  const version = require('./package.json').version;
  let whoami = 'anonymous';
  let commit = '00000000';
  try {
    commit = execSync('git rev-parse --short=10 HEAD').toString().trim();
    whoami = execSync('whoami').toString().trim();
  } catch (e) {}

  return code
    .replace(/jsPDF.version = '0.0.0'/g, "jsPDF.version = '" + version + "'")
    .replace(/\$\{builtOn\}/g, date)
    .replace(/\$\{versionID\}/g, version)
    .replace('${commitID}', commit)
    .replace(/1\.0\.0-trunk/, version + ' ' + date + ':' + whoami);
}
