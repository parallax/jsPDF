var fs = require('fs');
var glob = require('glob');
GLOBAL.jsPDF = require('./jspdf.js').jsPDF;

// Load all the plugins
fs.readdir(__dirname + '/plugins', function (err, files) {
  files.map(function (plugin) {
    require(__dirname + '/plugins/' + plugin);
  });
});

//Modify the save function to save to disk
jsPDF.API.save = function(filename, callback){
    fs.writeFile(filename, this.output(), callback);
};

module.exports = jsPDF;