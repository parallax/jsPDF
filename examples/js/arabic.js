var doc = new jsPDF();
doc.addFont("spec/reference/Amiri-Regular.ttf", "Amiri", "normal");

doc.setFont("Amiri"); // set font
doc.setFontSize(50);

var arabicText = "إذا لم تستح فاصنع ما شئت";

doc.text(arabicText, 10, 60);
