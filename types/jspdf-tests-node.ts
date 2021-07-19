/* eslint-disable @typescript-eslint/no-unused-vars */

import jspdf = require("jspdf");
const {
  jsPDF,
  AcroFormButton,
  AcroFormCheckBox,
  AcroFormChoiceField,
  AcroFormComboBox,
  AcroFormEditBox,
  AcroFormListBox,
  AcroFormPasswordField,
  AcroFormPushButton,
  AcroFormRadioButton,
  AcroFormTextField,
  GState,
  ShadingPattern,
  TilingPattern
} = jspdf;

function pubsub() {
  const doc = new jsPDF();
  const token = doc.internal.events.subscribe("topic", (a, b) => {}, true);
  doc.internal.events.unsubscribe(token);
  doc.internal.events.publish("topic", 1, "foo");
  const topics = doc.internal.events.getTopics();
  if (topics["topic"][token][1]) {
    topics["topic"][token][0](1, "foo");
  }
}

function classes() {
  new GState({});
  new TilingPattern([], 0, 0);
  new ShadingPattern("axial", [], []);
  new AcroFormChoiceField();
  new AcroFormListBox();
  new AcroFormComboBox();
  new AcroFormEditBox();
  new AcroFormButton();
  new AcroFormPushButton();
  new AcroFormRadioButton();
  new AcroFormCheckBox();
  new AcroFormTextField();
  new AcroFormPasswordField();
}

function test_simple_two_page_document() {
  const doc = new jsPDF();
  doc.text("Hello world!", 20, 20);
  doc.text("This is client-side Javascript, pumping out a PDF.", 20, 20);
  doc.addPage();
  doc.text("Do you like that?", 20, 20);
  doc.save("Test.pdf");
}

function test_add_pages_with_different_format() {
  const doc = new jsPDF();
  doc.text("Hello world!", 20, 20);
  doc.addPage("a5", "l");
  doc.text("Do you like that?", 20, 20);
  doc.addPage("c6");
  doc.text("Do you like that?", 20, 20);
  doc.addPage([595.28, 841.89]);
  doc.text("Do you like that?", 20, 20);
  doc.save("Test.pdf");
}

function test_landscape() {
  const doc = new jsPDF("landscape");
  doc.text("Hello landscape world!", 20, 20);
  doc.save("Test.pdf");
}

function test_metadata() {
  const doc = new jsPDF();
  doc.text(
    "This PDF has a title, subject, author, keywords and a creator.",
    20,
    20
  );
  doc.setProperties({
    title: "Title",
    subject: "This is the subject",
    author: "James Hall",
    keywords: "generated, javascript, web 2.0, ajax",
    creator: "MEEE"
  });
  doc.save("Test.pdf");
}

function test_user_input() {
  const doc = new jsPDF();
  doc.text(
    "This PDF has a title, subject, author, keywords and a creator.",
    20,
    20
  );
  doc.setProperties({
    title: "Title",
    subject: "This is the subject",
    author: "James Hall",
    keywords: "generated, javascript, web 2.0, ajax",
    creator: "MEEE"
  });
  doc.save("Test.pdf");
}

function test_font_sizes() {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.text("This is a title", 20, 20);
  doc.setFontSize(16);
  doc.text("This is some normal sized text underneath.", 20, 30);
  doc.save("Test.pdf");
}

function test_font() {
  const doc = new jsPDF();
  doc.text("This is the default font.", 20, 20);
  doc.setFont("courier");
}

function test_text_colors() {
  const doc = new jsPDF();
  doc.setTextColor(100);
  doc.setTextColor(150);
  doc.setTextColor(255, 0, 0);
  doc.setTextColor(0, 255, 0);
  doc.setTextColor(0, 0, 255);
  doc.setTextColor("red");
  doc.save("Test.pdf");
}

function test_font_metrics_based_line_sizing_split() {
  const pdf = new jsPDF("p", "in", "letter");
  const sizes: number[] = [12, 16, 20];
  const fonts = [
    ["Times", "Roman"],
    ["Helvetica", ""],
    ["Times", "Italic"]
  ];
  let font: string[];
  let size: number;
  let lines: any[];
  let verticalOffset = 0.5; // inches on a 8.5 x 11 inch sheet.
  const loremipsum = "Lorem ipsum dolor sit amet, ...";
  for (const i in fonts) {
    if (fonts.hasOwnProperty(i)) {
      font = fonts[i];
      size = sizes[i];
      lines = pdf
        .setFont(font[0], font[1])
        .setFontSize(size)
        .splitTextToSize(loremipsum, 7.5);
      pdf.text(lines, 0.5, verticalOffset + size / 72);
      verticalOffset += ((lines.length + 0.5) * size) / 72;
    }
  }
  pdf.save("Test.pdf");
}

function test_rect_squares() {
  const doc = new jsPDF();
  doc.rect(20, 20, 10, 10); // empty square
  doc.rect(40, 20, 10, 10, "F"); // filled square
  doc.setDrawColor(255, 0, 0);
  doc.rect(60, 20, 10, 10); // empty red square
  doc.setDrawColor(255, 0, 0);
  doc.rect(80, 20, 10, 10, "FD"); // filled square with red borders
  doc.setDrawColor(0);
  doc.setFillColor(255, 0, 0);
  doc.rect(100, 20, 10, 10, "F"); // filled red square
  doc.setDrawColor(0);
  doc.setFillColor(255, 0, 0);
  doc.rect(120, 20, 10, 10, "FD"); // filled red square with black borders
  doc.setDrawColor(0);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(140, 20, 10, 10, 3, 3, "FD"); //  Black sqaure with rounded corners
  doc.save("Test.pdf");
}

function test_lines() {
  const doc = new jsPDF();
  doc.line(20, 20, 60, 20); // horizontal line
  doc.setLineWidth(0.5);
  doc.line(20, 25, 60, 25);
  doc.setLineWidth(1);
  doc.line(20, 30, 60, 30);
  doc.setLineWidth(1.5);
  doc.line(20, 35, 60, 35);
  doc.setDrawColor(255, 0, 0); // draw red lines
  doc.setLineWidth(0.1);
  doc.line(100, 20, 100, 60); // vertical line
  doc.setLineWidth(0.5);
  doc.line(105, 20, 105, 60);
  doc.setLineWidth(1);
  doc.line(110, 20, 110, 60);
  doc.setLineWidth(1.5);
  doc.line(115, 20, 115, 60);
  doc.save("Test.pdf");
}

function test_circles_ellipses() {
  const doc = new jsPDF();
  doc.ellipse(40, 20, 10, 5);
  doc.setFillColor(0, 0, 255);
  doc.ellipse(80, 20, 10, 5, "F");
  doc.setLineWidth(1);
  doc.setDrawColor(0);
  doc.setFillColor(255, 0, 0);
  doc.circle(120, 20, 5, "FD");
  doc.save("Test.pdf");
}

function test_triangles() {
  const doc = new jsPDF();
  doc.triangle(60, 100, 60, 120, 80, 110, "FD");
  doc.setLineWidth(1);
  doc.setDrawColor(255, 0, 0);
  doc.setFillColor(0, 0, 255);
  doc.triangle(100, 100, 110, 100, 120, 130, "FD");
  doc.save("My file.pdf");
}

function test_images() {
  const getImageFromUrl = function(url: string, callback: Function) {
    const img = new Image();
    img.onerror = function() {
      alert('Cannot load image: "' + url + '"');
    };
    img.onload = function() {
      callback(img);
    };
    img.src = url;
  };

  const createPDF = function(imgData: string) {
    const doc = new jsPDF();
    doc.addImage(imgData, "JPEG", 10, 10, 50, 50, "monkey"); // Cache the image using the alias 'monkey'
    doc.addImage("monkey", 70, 10, 100, 120); // use the cached 'monkey' image, JPEG is optional regardless
    doc.addImage({
      imageData: imgData,
      rotation: -20,
      x: 10,
      y: 78,
      width: 45,
      height: 58
    });
    doc.output("datauri", { filename: "test.pdf" });
  };
  getImageFromUrl("thinking-monkey.jpg", createPDF);
}

function test_context2d_smiley() {
  const doc = new jsPDF("p", "pt", "a4");
  const ctx = doc.context2d;

  ctx.beginPath();
  ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
  ctx.moveTo(110, 75);
  ctx.arc(75, 75, 35, 0, Math.PI, false); // Mund
  ctx.moveTo(65, 65);
  ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // Linkes Auge
  ctx.moveTo(95, 65);
  ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // Rechtes Auge
  ctx.stroke();
}

function test_context2d_warnsign() {
  const doc = new jsPDF("p", "pt", "a4");
  const context = doc.context2d;

  const primaryColor = "#ffc821";
  const secondaryColor = "black";
  const tertiaryColor = "black";
  const lineWidth = 10;
  // Dimensions of the triangle
  const width = 125;
  const height = 100;
  const padding = 20;

  // Create a triangluar path
  context.beginPath();
  context.moveTo(padding + width / 2, padding);
  context.lineTo(padding + width, height + padding);
  context.lineTo(padding, height + padding);
  context.closePath();

  // Create fill gradient
  let gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, primaryColor);
  gradient.addColorStop(1, secondaryColor);

  // Add a shadow around the object
  context.shadowBlur = 10;
  context.shadowColor = "black";

  // Stroke the outer outline
  context.lineWidth = lineWidth * 2;
  context.lineJoin = "round";
  context.strokeStyle = gradient;
  context.stroke();

  // Turn off the shadow, or all future fills will have shadows
  context.shadowColor = "transparent";

  // Fill the path
  context.fillStyle = gradient;
  context.fill();

  // Add a horizon reflection with a gradient to transparent
  gradient = context.createLinearGradient(0, padding, 0, padding + height);
  gradient.addColorStop(0, "transparent");
  gradient.addColorStop(0.5, "transparent");
  gradient.addColorStop(0.5, tertiaryColor);
  gradient.addColorStop(1, secondaryColor);

  context.fillStyle = gradient;
  context.fill();

  // Stroke the inner outline
  context.lineWidth = lineWidth;
  context.lineJoin = "round";
  context.strokeStyle = "#333";
  context.stroke();

  // Draw the text exclamation point
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "bold 60px 'Times New Roman', Times, serif";
  context.fillStyle = "#333";
  context.fillText("!", padding + width / 2, padding + height / 1.5);
}

function test_context2d_fields() {
  const doc = new jsPDF();

  const ctx = doc.canvas.getContext("2d");

  ctx.fillStyle = "#000000";
  ctx.filter = "none";
  ctx.font = "10px sans-serif";
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "low";
  ctx.lineCap = "butt";
  ctx.lineDashOffset = 0;
  ctx.lineJoin = "miter";
  ctx.lineWidth = 1;
  ctx.miterLimit = 10;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "rgba(0, 0, 0, 0)";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = "#000000";
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}

function test_context2d_functions() {
  const doc = new jsPDF();
  doc.context2d.moveTo(1, 1);
  doc.context2d.lineTo(1, 1);
  doc.context2d.quadraticCurveTo(1, 1, 1, 1);
  doc.context2d.bezierCurveTo(1, 1, 1, 1, 1, 1);
  doc.context2d.arc(1, 1, 1, 1, 1, false);
  doc.context2d.rect(1, 1, 1, 1);
  doc.context2d.fillRect(1, 1, 1, 1);
  doc.context2d.strokeRect(1, 1, 1, 1);
  doc.context2d.clearRect(1, 1, 1, 1);
  doc.context2d.fillText("valid", 1, 1, 1);
  doc.context2d.strokeText("valid", 1, 1, 1);
  doc.context2d.measureText("valid");
  doc.context2d.scale(1, 1);
  doc.context2d.rotate(1);
  doc.context2d.translate(1, 1);
  doc.context2d.transform(1, 1, 1, 1, 1, 1);
}

function test_add_font() {
  const doc = new jsPDF("p", "pt", "a4");

  doc.addFont("helvetica", "helvetica", "normal", "StandardEncoding");
}
function test_vfs() {
  const doc = new jsPDF("p", "pt", "a4");
  doc.addFileToVFS("test.pdf", "BADFACE");
  doc.getFileFromVFS("test.pdf");
  doc.existsFileInVFS("test.pdf");
}

function test_outline() {
  const doc = new jsPDF({ unit: "pt" });
  doc.outline.add(null, "Page 1", { pageNumber: 1 });
  doc.addPage();
}

function test_page_operations() {
  const doc = new jsPDF();
  doc.text("Text that will end up on page 2", 20, 20);
  doc.addPage();
  doc.text("Text that will end up on page 1", 20, 20);
  doc.movePage(2, 1);

  doc.addPage();
  doc.text("Text that will end up on page 3", 20, 20);
  doc.deletePage(3);
}

function test_displayMode() {
  const doc = new jsPDF();
  doc.setDisplayMode("fullheight");
  doc.setDisplayMode("fullwidth");
  doc.setDisplayMode("fullpage");
  doc.setDisplayMode("original");
  doc.setDisplayMode("300%");
  doc.setDisplayMode(2);
  doc.setDisplayMode(null, "continuous");
  doc.setDisplayMode(null, "single");
  doc.setDisplayMode(null, "twoleft");
  doc.setDisplayMode(null, "two");
  doc.setDisplayMode(null, "tworight");
  doc.setDisplayMode(null, null, "UseOutlines");
  doc.setDisplayMode(null, null, "UseThumbs");
  doc.setDisplayMode(null, null, "FullScreen");
}

function test_put_total_pages() {
  const doc = new jsPDF();
  const totalPagesExp = "{totalPages}";

  doc.text("Page 1 of {totalPages}", 10, 10);
  doc.addPage();

  doc.text("Page 2 of {totalPages}", 10, 10);

  if (typeof doc.putTotalPages === "function") {
    doc.putTotalPages(totalPagesExp);
  }
}

function test_autoprint() {
  const doc = new jsPDF();
  doc.text("This is a test", 10, 10);
  doc.autoPrint();
  doc.autoPrint({ variant: "javascript" });
}

function test_viewerpreferences() {
  const doc = new jsPDF();
  doc.text("This is a test", 10, 10);
  doc.viewerPreferences({ HideToolbar: true });
  doc.viewerPreferences({ HideMenubar: true });
  doc.viewerPreferences({ HideWindowUI: true });
  doc.viewerPreferences({ NumCopies: 9 });
  doc.viewerPreferences({ HideWindowUI: true });
  doc.viewerPreferences({ FitWindow: true }, true);
  doc.viewerPreferences({ ViewArea: "MediaBox" });
  doc.viewerPreferences({
    PrintPageRange: [
      [1, 3],
      [5, 9]
    ]
  });
  doc.viewerPreferences({ HideWindowUI: true });
  doc.viewerPreferences("reset");
  doc.viewerPreferences({ FitWindow: true });
}

function test_arabic() {
  const doc = new jsPDF();
  doc.processArabic("ددد");
}

function test_split_text_to_size() {
  const doc = new jsPDF();
  doc.setFont("Courier");

  doc.getTextWidth("Lorem Ipsum");
  doc.getStringUnitWidth("Lorem Ipsum");
  doc.getCharWidthsArray("Lorem Ipsum");
  doc.splitTextToSize(
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
    100
  );
}

function test_setlanguage() {
  const doc = new jsPDF();
  doc.setLanguage("en-US");
  doc.setLanguage("de-DE");
}

function test_annotations() {
  const doc = new jsPDF();
  doc.createAnnotation({
    type: "text",
    title: "note",
    bounds: {
      x: 10,
      y: 10,
      w: 200,
      h: 80
    },
    contents: "This is text annotation (closed by default)",
    open: false
  });
  doc.createAnnotation({
    type: "text",
    title: "note",
    bounds: {
      x: 10,
      y: 10,
      w: 200,
      h: 80
    },
    contents: "This is text annotation (open by default)",
    open: true
  });

  doc.createAnnotation({
    type: "freetext",
    bounds: {
      x: 0,
      y: 10,
      w: 200,
      h: 20
    },
    contents: "This is a freetext annotation",
    color: "#ff0000"
  });

  const pdf = new jsPDF();
  const x = 1,
    y = 1,
    i = 1;
  var width = pdf.textWithLink(" [100%]", x, y, {
    pageNumber: i,
    magFactor: "XYZ",
    zoom: 1
  });
  var width = pdf.textWithLink(" [200%]", x, y, {
    pageNumber: i,
    magFactor: "XYZ",
    zoom: 2
  });
  var width = pdf.textWithLink(" [50%]", x, y, {
    pageNumber: i,
    magFactor: "XYZ",
    zoom: 0.5
  });
  var width = pdf.textWithLink(" [Fit]", x, y, {
    pageNumber: i,
    magFactor: "Fit"
  });
  var width = pdf.textWithLink(" [FitH]", x, y, {
    pageNumber: i,
    magFactor: "FitH"
  });
  var width = pdf.textWithLink(" [FitV]", x, y, {
    pageNumber: i,
    magFactor: "FitV"
  });
}

function test_AcroForm() {
  const doc = new jsPDF();
  const checkBox = doc.AcroForm.CheckBox();
  checkBox.value = "Off";

  const radioGroup = doc.AcroForm.RadioButton();
  radioGroup.createOption("Test");

  const textField = doc.AcroForm.TextField();
  textField.value = "Test";
  textField.defaultValue = "";
}

function test_html() {
  const doc = new jsPDF();

  doc.html(document.body, {
    callback: function(doc) {},
    html2canvas: {
      allowTaint: false
    },
    jsPDF: doc
  });
}

function test_addImage() {
  const doc = new jsPDF();
  doc.addImage({
    imageData: "/image.png",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    compression: "FAST"
  });
}

function test_loadFile() {
  const doc = new jsPDF();
  doc.loadFile("../image.png");
  doc.loadFile("../image.png", false, function(data) {
    return data;
  });
}

function test_simpleTwoPageDocumentWithEncryption() {
  const doc = new jsPDF({
    encryption: {
      userPassword: "longpassword",
      userPermissions: ["print", "copy"]
    }
  });
  doc.text("Hello world!", 20, 20);
  doc.text("This is client-side Javascript, pumping out a PDF.", 20, 20);
  doc.addPage();
  doc.text("Do you like that?", 20, 20);
  doc.save("Test.pdf");
}

function test_addImageWithEncryption() {
  const doc = new jsPDF({
    encryption: {
      userPassword: "password",
      ownerPassword: "password"
    }
  });
  doc.addImage({
    imageData: "/image.png",
    x: 0,
    y: 0,
    width: 100,
    height: 100
  });
}
