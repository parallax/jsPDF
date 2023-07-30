var doc = new jsPDF();

doc.addFont("test/reference/THSarabunNew.ttf", "THSarabunNew", "normal");

doc.setFont("THSarabunNew", "normal"); // set font
doc.setFontSize(20);

doc.text("สวัสดีครับ", 20, 20);
