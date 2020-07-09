var doc = new jsPDF();

doc.line(20, 20, 60, 20); // horizontal line

doc.setLineWidth(0.5);
doc.line(20, 25, 60, 25);

doc.setLineWidth(1);
doc.line(20, 30, 60, 30);

doc.setLineWidth(1.5);
doc.line(20, 35, 60, 35);

doc.setDrawColor(255, 0, 0); // draw red lines

doc.setLineWidth(0.1);
doc.line(100, 20, 100, 60); // vertical line

doc.setLineWidth(0.5);
doc.line(105, 20, 105, 60);

doc.setLineWidth(1);
doc.line(110, 20, 110, 60);

doc.setLineWidth(1.5);
doc.line(115, 20, 115, 60);

doc.text(10, 110, "setLineDash");

doc.setLineWidth(0.1);
doc.setDrawColor(0, 0, 0);

doc.setLineDash([2.5]);
doc.line(10, 120, 200, 120);

doc.setLineDash([1, 1.5, 1, 1.5, 1, 1.5, 3, 2, 3, 2, 3, 2]);
doc.line(10, 125, 200, 125);

doc.setLineDash([1, 1.5, 1, 1.5, 1, 1.5, 3, 2, 3, 2, 3, 2], 7.5);
doc.line(10, 130, 200, 130);
