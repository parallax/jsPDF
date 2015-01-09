var doc = new jsPDF();

// Empty square
doc.rect(20, 20, 10, 10); 

// Filled square
doc.rect(40, 20, 10, 10, 'F');

// Empty red square
doc.setDrawColor(255,0,0);
doc.rect(60, 20, 10, 10);

// Filled square with red borders
doc.setDrawColor(255,0,0);
doc.rect(80, 20, 10, 10, 'FD'); 

// Filled red square
doc.setDrawColor(0);
doc.setFillColor(255,0,0);
doc.rect(100, 20, 10, 10, 'F'); 

 // Filled red square with black borders
doc.setDrawColor(0);
doc.setFillColor(255,0,0);
doc.rect(120, 20, 10, 10, 'FD');

// Black square with rounded corners
doc.setDrawColor(0);
doc.setFillColor(255, 255, 255);
doc.roundedRect(140, 20, 10, 10, 3, 3, 'FD'); 
