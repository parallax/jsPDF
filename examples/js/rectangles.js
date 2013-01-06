var doc = new jsPDF();

doc.rect(20, 20, 10, 10); // empty square

doc.rect(40, 20, 10, 10, 'F'); // filled square

doc.setDrawColor(255,0,0);
doc.rect(60, 20, 10, 10); // empty red square

doc.setDrawColor(255,0,0);
doc.rect(80, 20, 10, 10, 'FD'); // filled square with red borders

doc.setDrawColor(0);
doc.setFillColor(255,0,0);
doc.rect(100, 20, 10, 10, 'F'); // filled red square

doc.setDrawColor(0);
doc.setFillColor(255,0,0);
doc.rect(120, 20, 10, 10, 'FD'); // filled red square with black borders

doc.setDrawColor(0);
doc.setFillColor(255, 255, 255);
doc.roundedRect(140, 20, 10, 10, 3, 3, 'FD'); //  Black sqaure with rounded corners