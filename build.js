'use strict'

var fs = require('fs')
const rollup = require('rollup');
const rollupConfig = require('./rollup.config');
var uglify = require('uglify-js')
var execSync = require('child_process').execSync

bundle({
  minified: 'dist/jspdf.min.js',
  debug: 'dist/jspdf.debug.js'
})

function bundle(paths) {
  rollup.rollup({
    input: './main.js',
    context: 'window',
    plugins: rollupConfig.plugins,
  }).then((bundle) => {
    return bundle.generate({
      format: 'umd',
      name: 'jsPDF'
    })
  }).then(output => {
    let code = output.code
    code = code.replace(
      /Permission\s+is\s+hereby\s+granted[\S\s]+?IN\s+THE\s+SOFTWARE\./,
      'Licensed under the MIT License'
    )
    code = code.replace(
      /Permission\s+is\s+hereby\s+granted[\S\s]+?IN\s+THE\s+SOFTWARE\./g,
      ''
    )
    fs.writeFileSync(paths.debug, renew(code))

    var minified = uglify.minify(code, {
      output: {
        comments: /@preserve|@license|copyright/i
      }
    })
    fs.writeFileSync(paths.minified, renew(minified.code))
  }).catch((err) => {
    console.error(err)
  })
}

function renew(code) {
  var date = new Date().toISOString()
  var version = require('./package.json').version
  var whoami = execSync('whoami').toString().trim()
  var commit = '00000000';
  try {
    commit = execSync('git rev-parse --short=10 HEAD').toString().trim()
  } catch (e) {}
  code = code.replace(/\$\{versionID\}/g, version)
  code = code.replace(/\$\{builtOn\}/g, date)
  code = code.replace('${commitID}', commit)
  code = code.replace(/1\.0\.0-trunk/, version + ' ' + date + ':' + whoami)

  return code
}
