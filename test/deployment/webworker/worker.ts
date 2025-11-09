importScripts("/base/dist/jspdf.umd.js");

var doc = new jspdf.jsPDF();
doc.text("Webworker test", 30, 30);
var output = doc.output();

postMessage(output);
