/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  jsPDF,
  GState,
  TilingPattern,
  ShadingPattern,
  AcroFormPasswordField,
  AcroFormChoiceField,
  AcroFormButton,
  AcroFormComboBox,
  AcroFormCheckBox,
  AcroFormRadioButton,
  AcroFormEditBox,
  AcroFormPushButton,
  AcroFormListBox,
  AcroFormTextField
} from "jspdf";

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

function test_nullStyleArgument() {
  const doc = new jsPDF();
  doc.rect(0, 0, 0, 0, null);
  doc.roundedRect(0, 0, 0, 0, 0, 0, null);
  doc.line(0, 0, 0, 0, null);
  doc.triangle(0, 0, 0, 0, 0, 0, null);
  doc.lines([], 0, 0, 0, null, false);
  doc.ellipse(0, 0, 0, 0, null);
  doc.circle(0, 0, 0, null);
}

function test_addImageWithRGBAData() {
  const doc = new jsPDF();
  const rgbaData = new Uint8ClampedArray(16);
  const imageData = {
    data: rgbaData,
    width: 2,
    height: 2
  };

  doc.addImage({
    imageData: imageData,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    compression: "FAST"
  });
}

// PDF/UA (Universal Accessibility) Tests

function test_pdfua_enable_disable() {
  // Test constructor option
  const doc1 = new jsPDF({ pdfUA: true });

  // Test enable/disable methods
  const doc2 = new jsPDF();
  doc2.enablePDFUA();
  const isEnabled: boolean = doc2.isPDFUAEnabled();
  doc2.disablePDFUA();

  // Test document title
  doc1.setDocumentTitle("Accessible Document");

  // Test language
  doc1.setLanguage("en-US");
  const lang: string = doc1.getLanguage();
}

function test_pdfua_structure_elements() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  // Basic structure element
  doc.beginStructureElement("Document");
  doc.beginStructureElement("H1", { lang: "en-US" });
  doc.text("Heading", 20, 20);
  doc.endStructureElement();

  doc.beginStructureElement("P", {
    lang: "de-DE",
    actualText: "Actual text content"
  });
  doc.text("Paragraph", 20, 40);
  doc.endStructureElement();
  doc.endStructureElement();

  // Get current element
  const current = doc.getCurrentStructureElement();
}

function test_pdfua_figure() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  doc.beginFigure({
    alt: "A descriptive alt text for the image",
    bbox: [20, 20, 100, 100],
    placement: "Block"
  });
  // Add image here
  doc.endFigure();

  // With language
  doc.beginFigure({
    alt: "German image description",
    lang: "de-DE"
  });
  doc.endFigure();
}

function test_pdfua_table() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  doc.beginTable({ summary: "Sales data for Q1 2024" });

  // Header row
  doc.beginTableRow();
  doc.beginTableHeader({ scope: "Column" });
  doc.text("Product", 20, 20);
  doc.endTableHeader();
  doc.beginTableHeader({ scope: "Column", lang: "en-US" });
  doc.text("Sales", 60, 20);
  doc.endTableHeader();
  doc.endTableRow();

  // Data row
  doc.beginTableRow();
  doc.beginTableHeader({ scope: "Row" });
  doc.text("Widget", 20, 30);
  doc.endTableHeader();
  doc.beginTableCell();
  doc.text("100", 60, 30);
  doc.endTableCell();
  doc.endTableRow();

  doc.endTable();
}

function test_pdfua_list() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  // Unordered list
  doc.beginList({ listNumbering: "Disc" });
  doc.beginListItem();
  doc.beginListLabel();
  doc.text("•", 20, 20);
  doc.endListLabel();
  doc.beginListBody();
  doc.text("First item", 30, 20);
  doc.endListBody();
  doc.endListItem();
  doc.endList();

  // Ordered list
  doc.beginList({ listNumbering: "Decimal", lang: "en-US" });
  doc.beginListItem();
  doc.beginListLabel();
  doc.text("1.", 20, 40);
  doc.endListLabel();
  doc.beginListBody();
  doc.text("Numbered item", 30, 40);
  doc.endListBody();
  doc.endListItem();
  doc.endList();
}

function test_pdfua_link() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  // Inline link
  doc.beginLink();
  doc.text("Click here", 20, 20);
  doc.endLink();

  // Block link with placement
  doc.beginLink({ placement: "Block", lang: "en-US" });
  doc.text("Block link", 20, 40);
  doc.endLink();
}

function test_pdfua_note_and_footnote() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  // Manual note
  doc.beginReference();
  doc.text("1", 100, 20);
  doc.endReference();

  doc.beginNote({
    id: "note1",
    noteType: "Footnote",
    placement: "Block"
  });
  doc.text("This is the footnote text", 20, 280);
  doc.endNote();

  // Convenience method
  doc.addFootnote({
    id: "fn1",
    label: "1",
    text: "Footnote created with addFootnote",
    x: 20,
    y: 290,
    labelX: 100,
    labelY: 30,
    placement: "Block",
    announceText: "Footnote 1"
  });
}

function test_pdfua_caption() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  doc.beginFigure({ alt: "Chart showing data" });
  doc.beginCaption({ lang: "en-US", placement: "Block" });
  doc.text("Figure 1: Data Chart", 20, 120);
  doc.endCaption();
  doc.endFigure();
}

function test_pdfua_code() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  doc.beginCode({ language: "javascript", placement: "Block" });
  doc.text("const x = 42;", 20, 20);
  doc.endCode();
}

function test_pdfua_quote_and_blockquote() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  // Inline quote
  doc.beginQuote({ cite: "Famous Author", lang: "en-US" });
  doc.text("To be or not to be", 20, 20);
  doc.endQuote();

  // Block quote
  doc.beginBlockQuote({ cite: "Source Book" });
  doc.text("A longer quotation that spans", 20, 40);
  doc.text("multiple lines of text.", 20, 50);
  doc.endBlockQuote();
}

function test_pdfua_bibentry_and_index() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  // Bibliography entry
  doc.beginBibEntry({ lang: "en-US", placement: "Block" });
  doc.text("Smith, J. (2024). Title of Work.", 20, 20);
  doc.endBibEntry();

  // Index
  doc.beginIndex({ lang: "en-US" });
  doc.text("A", 20, 40);
  doc.text("  Algorithm, 12", 20, 50);
  doc.endIndex();
}

function test_pdfua_formula() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  doc.beginFormula({
    alt: "E equals m c squared",
    lang: "en-US",
    placement: "Block"
  });
  doc.text("E = mc²", 20, 20);
  doc.endFormula();
}

function test_pdfua_toc() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  doc.beginTOC({ lang: "en-US" });
  doc.beginTOCI();
  doc.text("Chapter 1 .......... 1", 20, 20);
  doc.endTOCI();
  doc.beginTOCI();
  doc.text("Chapter 2 .......... 5", 20, 30);
  doc.endTOCI();
  doc.endTOC();
}

function test_pdfua_abbreviation() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  doc.beginAbbreviation({ expansion: "World Wide Web", lang: "en-US" });
  doc.text("WWW", 20, 20);
  doc.endAbbreviation();
}

function test_pdfua_artifact() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  // Header artifact
  doc.beginArtifact({ type: "Pagination", subtype: "Header" });
  doc.text("Page Header", 20, 10);
  doc.endArtifact();

  // Footer with page number
  doc.beginArtifact({
    type: "Pagination",
    subtype: "Footer",
    bbox: [20, 280, 100, 10]
  });
  doc.text("Page 1", 20, 285);
  doc.endArtifact();
}

function test_pdfua_annot() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  doc.beginAnnot({
    alt: "Comment about this section",
    lang: "en-US",
    placement: "Block"
  });
  // Add annotation content
  doc.endAnnot();
}

function test_pdfua_form_field() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  doc.beginFormField({
    description: "Enter your name",
    lang: "en-US",
    placement: "Block"
  });
  // Add form field
  doc.endFormField();
}

function test_pdfua_ruby_warichu() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  // Ruby annotation (for CJK)
  doc.beginRuby({ lang: "ja" });
  doc.beginRubyBase();
  doc.text("漢字", 20, 20);
  doc.endRubyBase();
  doc.beginRubyText({ placement: "Inline" });
  doc.text("かんじ", 20, 15);
  doc.endRubyText();
  doc.endRuby();

  // Warichu (inline annotation)
  doc.beginWarichu({ lang: "ja" });
  doc.beginWarichuText();
  doc.text("annotation", 20, 40);
  doc.endWarichuText();
  doc.endWarichu();
}

function test_pdfua_grouping_elements() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  // Art (Article)
  doc.beginArt({ lang: "en-US", title: "Main Article" });
  doc.text("Article content", 20, 20);
  doc.endArt();

  // Sect (Section)
  doc.beginSect({ title: "Introduction" });
  doc.text("Section content", 20, 40);
  doc.endSect();

  // Div (Division)
  doc.beginDiv();
  doc.text("Division content", 20, 60);
  doc.endDiv();

  // Part
  doc.beginPart({ title: "Part One" });
  doc.text("Part content", 20, 80);
  doc.endPart();
}

function test_pdfua_pdf2_elements() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  // DocumentFragment (PDF 2.0)
  doc.beginDocumentFragment({ lang: "en-US" });
  doc.text("Fragment content", 20, 20);
  doc.endDocumentFragment();

  // Aside (PDF 2.0)
  doc.beginAside({ lang: "en-US" });
  doc.text("Sidebar content", 150, 20);
  doc.endAside();
}

function test_pdfua_emphasis() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  doc.beginStructureElement("P");

  // Strong emphasis (bold)
  doc.beginStrong();
  doc.text("Important", 20, 20);
  doc.endStrong();

  // Emphasis (italic)
  doc.beginEm();
  doc.text("emphasized", 60, 20);
  doc.endEm();

  doc.endStructureElement();
}

function test_pdfua_span() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  doc.beginSpan({ lang: "fr-FR" });
  doc.text("Bonjour", 20, 20);
  doc.endSpan();
}

function test_pdfua_nonstruct_private() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  // NonStruct (non-structural grouping)
  doc.beginNonStruct();
  doc.text("Grouped content", 20, 20);
  doc.endNonStruct();

  // Private (private content)
  doc.beginPrivate();
  doc.text("Private content", 20, 40);
  doc.endPrivate();
}

function test_pdfua_bookmark() {
  const doc = new jsPDF({ pdfUA: true });
  doc.setDocumentTitle("Test");

  doc.addBookmark("Chapter 1", { pageNumber: 1 });
  doc.addPage();
  doc.addBookmark("Chapter 2", { pageNumber: 2 });
}
