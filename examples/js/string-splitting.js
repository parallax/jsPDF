/*
 * Let's demonstrate string splitting with the first page of Shakespeare's Romeo and Juliet!
 * We'll use a 8.5 x 11 inch sheet, measuring everything in inches.
 */
var pageWidth = 8.5,
  lineHeight = 1.2,
  margin = 0.5,
  maxLineWidth = pageWidth - margin * 2,
  fontSize = 24,
  ptsPerInch = 72,
  oneLineHeight = (fontSize * lineHeight) / ptsPerInch,
  text =
    "Two households, both alike in dignity,\n" +
    "In fair Verona, where we lay our scene,\n" +
    "From ancient grudge break to new mutiny,\n" +
    "Where civil blood makes civil hands unclean.\n" +
    "From forth the fatal loins of these two foes\n" +
    "A pair of star-cross'd lovers take their life;\n" +
    "Whole misadventured piteous overthrows\n" +
    "Do with their death bury their parents' strife.\n" +
    "The fearful passage of their death-mark'd love,\n" +
    "And the continuance of their parents' rage,\n" +
    // Notice that the following will be wrapped to two lines automatically!
    "Which, but their children's end, nought could remove, Is now the two hours' traffic of our stage;\n" +
    "The which if you with patient ears attend,\n" +
    "What here shall miss, our toil shall strive to mend.",
  doc = new jsPDF({
    unit: "in",
    lineHeight: lineHeight
  }).setProperties({ title: "String Splitting" });

// splitTextToSize takes your string and turns it in to an array of strings,
// each of which can be displayed within the specified maxLineWidth.
var textLines = doc
  .setFont("helvetica")
  .setFontSize(fontSize)
  .splitTextToSize(text, maxLineWidth);

// doc.text can now add those lines easily; otherwise, it would have run text off the screen!
doc.text(textLines, margin, margin + 2 * oneLineHeight);

// You can also calculate the height of the text very simply:
var textHeight = (textLines.length * fontSize * lineHeight) / ptsPerInch;
doc
  .setFont("Helvetica", "bold")
  .text(
    "Text Height: " + textHeight + " inches",
    margin,
    margin + oneLineHeight
  );
