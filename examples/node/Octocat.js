const fs = require("fs");
const jsPDF = require("../../dist/jspdf.node.min");

var Octocat = fs.readFileSync("../images/Octocat.png", { encoding: "latin1" });

var doc = new jsPDF();

doc.setFontSize(40);
doc.text("Octocat loves jsPDF", 40, 30, 4);
doc.addImage(Octocat, "test", 10, 40, 180, 180, undefined, "SLOW");

fs.writeFileSync("./Octocat.pdf", doc.output(), "ascii");
