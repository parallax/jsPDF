var doc = new jsPDF();

// I know the proper spelling is colour ;)
doc.setTextColor(100);
doc.text('This is gray.', 20, 20);

doc.setTextColor(150);
doc.text('This is light gray.', 20, 30);

doc.setTextColor(255, 0, 0);
doc.text('This is red.', 20, 40);

doc.setTextColor(0, 255, 0);
doc.text('This is green.', 20, 50);

doc.setTextColor(0, 0, 255);
doc.text('This is blue.', 20, 60);

doc.setTextColor('red');
doc.text('This is red.', 60, 40);

doc.setTextColor('green');
doc.text('This is green.', 60, 50);

doc.setTextColor('blue');
doc.text('This is blue.', 60, 60);