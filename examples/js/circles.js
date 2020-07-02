/* global jsPDF */
var doc = new jsPDF();

doc.ellipse(40, 20, 10, 5);

doc.setFillColor(0, 0, 255);
doc.ellipse(80, 20, 10, 5, "F");

doc.setLineWidth(1);
doc.setDrawColor(0);
doc.setFillColor(255, 0, 0);
doc.circle(120, 20, 5, "FD");
