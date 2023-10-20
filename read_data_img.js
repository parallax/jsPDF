// Default export is a4 paper, portrait, using millimeters for units
const doc = new jsPDF();

const IMG_LINK = "https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"

const img = new Image()
img.src = IMG_LINK

doc.text("Hello world!", 10, 10);
doc.addImage(img, 0, 0, 200, 200);

doc.save("a4.pdf");
