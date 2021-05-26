var doc = new jsPDF();
doc.addFont("https://cdn.jsdelivr.net/npm/rubik-font@0.0.3/fonts/Rubik-Regular.ttf", "Rubik", "normal");

doc.setFont("Rubik"); // set font
doc.setFontSize(50);
doc.setR2L(true);

var mixedRtlLtrText = "";

doc.text("hello world ", 10, 20)
doc.text("1234 ", 10, 40)
doc.text(" שלום עליכם ", 10, 60)
