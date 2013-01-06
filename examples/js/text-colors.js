var doc = new jsPDF();

// I know the proper spelling is colour ;)
doc.setTextColor(100);
doc.text(20, 20, 'This is gray.');

doc.setTextColor(150);
doc.text(20, 30, 'This is light gray.');

doc.setTextColor(255, 0, 0);
doc.text(20, 40, 'This is red.');

doc.setTextColor(0, 255, 0);
doc.text(20, 50, 'This is green.');

doc.setTextColor(0, 0, 255);
doc.text(20, 60, 'This is blue.');