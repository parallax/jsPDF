#!/usr/bin/env node

'use strict'

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

const minimistOptions = {
  string: ['out'],
  alias: {
    o: 'out'
  },
  'default': {
    'out': './dist/default_vfs.js'
  }
};

const cliOptions = minimist(process.argv.slice(2), minimistOptions);

const inputPath = path.resolve((cliOptions._ && cliOptions._[0]) || './fonts');
const outputPath = cliOptions.out;

fs.readdir(inputPath, (err, files) => {
  if (err) console.log(err);
  const fontList = files.map(file => `jsPDFAPI.addFileToVFS('${file}','${new Buffer(fs.readFileSync(path.join(inputPath, file))).toString('base64')}');`);
  fs.writeFileSync(outputPath, `(function (jsPDFAPI) { \n"use strict";\n${fontList.join('\n')}\n})(jsPDF.API);`);
});
