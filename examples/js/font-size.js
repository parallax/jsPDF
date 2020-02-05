var doc = new jsPDF();
doc.setFontSize(22);
doc.text("This is a title", 20, 20);

doc.setFontSize(16);
doc.text("This is some normal sized text underneath.", 20, 30);
