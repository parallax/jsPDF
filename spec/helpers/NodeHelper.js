/* eslint-disable no-unused-vars */
/* global beforeAll */

beforeAll(function() {
  require("../../src/node");
  global.jsPDF = require("../../dist/jspdf.node.debug.js");
  global.jsPDF.version = "0.0.0";

  global.jsPDF.API.loadFile = function(url, sync, callback) {
    sync = sync === false ? false : true;
    callback = typeof callback === "function" ? callback : function() {};
    var result = undefined;

    var fs = require("fs");
    var path = require("path");

    url = path.resolve(__dirname + url);
    if (sync) {
      result = fs.readFileSync(url, { encoding: "latin1" });
    } else {
      fs.readFile(url, { encoding: "latin1" }, callback);
    }

    return result;
  };
});
global.isNode = true;
