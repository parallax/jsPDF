var doc = new jsPDF();

doc.triangle(60, 100, 60, 120, 80, 110, 'FD');

doc.setLineWidth(1);
doc.setDrawColor(255,0,0);
doc.setFillColor(0,0,255);
doc.triangle(100, 100, 110, 100, 120, 130, 'FD');