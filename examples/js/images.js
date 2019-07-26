// Don't forget, that there are CORS-Restrictions. So if you want to run it without a Server in your Browser you need to transform the image to a dataURL
// Use http://dataurl.net/#dataurlmaker
var doc = new jsPDF();

doc.setFontSize(40);
doc.text("Octonyan loves jsPDF", 35, 25);
doc.addImage('examples/images/Octonyan.jpg', 'JPEG', 15, 40, 180, 180);
