//https://www.freejapanesefont.com/mouhitsu-bold-font-download/

const fs = require("fs");
const jsPDF = require("../../dist/jspdf.node.min");

var MouhitsuBold = fs.readFileSync("../../test/reference/MouhitsuBold.ttf", {
  encoding: "latin1"
});

var doc = new jsPDF({ compress: true });

doc.addFileToVFS("MouhitsuBold.ttf", MouhitsuBold);
doc.addFont("MouhitsuBold.ttf", "Mouhitsu", "bold");

doc.setFont("Mouhitsu", "bold"); // set font
doc.setFontSize(20);

doc.text("なに", 20, 20);

fs.writeFileSync("japanese.pdf", doc.output(), "ascii");
