var doc = new jsPDF();

doc.line(20, 20, 60, 20); // horizontal line
	
doc.setLineWidth(0.5);
doc.line(20, 25, 60, 25);

doc.setLineWidth(1);
doc.line(20, 30, 60, 30);

doc.setLineWidth(1.5);
doc.line(20, 35, 60, 35);

doc.setDrawColor(255,0,0); // draw red lines

doc.setLineWidth(0.1);
doc.line(100, 20, 100, 60); // vertical line

doc.setLineWidth(0.5);
doc.line(105, 20, 105, 60);

doc.setLineWidth(1);
doc.line(110, 20, 110, 60);

doc.setLineWidth(1.5);
doc.line(115, 20, 115, 60);