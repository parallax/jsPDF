const fs = require("fs");
const jsPDF = require("../../dist/jspdf.node.debug");

var AmiriRegular = fs.readFileSync("../../spec/reference/Amiri-Regular.ttf", {
  encoding: "latin1"
});

var doc = new jsPDF({ compress: true });
doc.addFileToVFS("Amiri-Regular.ttf", AmiriRegular);
doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");

doc.setFont("Amiri"); // set font
doc.setFontSize(10);

doc.text("إذا لم تستح فاصنع ما شئت", 200, 10, { align: "right" });

fs.writeFileSync("arabic.pdf", doc.output(), "ascii");
