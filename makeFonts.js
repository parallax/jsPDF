'use strict'

const fs = require('fs');
const path = './fonts/';
fs.readdir(path, (err, files) => {
    if (err) console.log(err);
    const fontList = files.map(file => `jsPDFAPI.addFileToVFS('${file}','${new Buffer(fs.readFileSync(path + file)).toString('base64')}');`);
    fs.writeFileSync('./dist/default_vfs.js', `(function (jsPDFAPI) { \n"use strict";\n${fontList.join('\n')}\n})(jsPDF.API);`);
})