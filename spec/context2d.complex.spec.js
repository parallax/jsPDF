/* global describe, it, jsPDF, comparePdf, expect */
/**
 * Standard spec tests
 */

describe("Module: Context2D Complex Examples", () => {
  it("context2d: smiley", () => {
    var doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      floatPrecision: 3
    });
    var ctx = doc.context2d;

    ctx.beginPath();
    ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
    ctx.moveTo(110, 75);
    ctx.arc(75, 75, 35, 0, Math.PI, false); // Mund
    ctx.moveTo(65, 65);
    ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // Linkes Auge
    ctx.moveTo(95, 65);
    ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // Rechtes Auge
    ctx.stroke();
    comparePdf(doc.output(), "smiley.pdf", "context2d");
  });

  //http://www.williammalone.com/articles/html5-canvas-example/
  it("context2d: warnsign", () => {
    var doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      floatPrecision: 3
    });
    var context = doc.context2d;

    var primaryColor = "#ffc821";
    var secondaryColor = "black";
    var tertiaryColor = "black";
    var lineWidth = 10;
    // Dimensions of the triangle
    var width = 125;
    var height = 100;
    var padding = 20;

    // Create a triangluar path
    context.beginPath();
    context.moveTo(padding + width / 2, padding);
    context.lineTo(padding + width, height + padding);
    context.lineTo(padding, height + padding);
    context.closePath();

    // Create fill gradient
    var gradient = context.createLinearGradient(0, 0, 0, height);
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
    comparePdf(doc.output(), "warnsign.pdf", "context2d");
  });

  if (typeof navigator === "undefined") {
    return;
  }
  if (navigator.userAgent.indexOf("Trident") !== -1) {
    console.warn("Skipping IE for context2d");
    return;
  }
  //http://curran.github.io/HTML5Examples/canvas/sierpinskiTriangle/index.html
  it("context2d: sierpinski", () => {
    var doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      floatPrecision: 3
    });
    var c = doc.context2d;

    var width = 400;
    var height = 300;
    var centerX = width / 2;

    var x1 = centerX;
    var y1 = 0;
    var x2 = width;
    var y2 = height;
    var x3 = 0;
    var y3 = height;
    var depth = 6;

    function sierpinski(x1, y1, x2, y2, x3, y3, depth) {
      if (depth == 0) drawTriangle(x1, y1, x2, y2, x3, y3);
      else {
        var x12 = (x1 + x2) / 2;
        var y12 = (y1 + y2) / 2;
        var x13 = (x1 + x3) / 2;
        var y13 = (y1 + y3) / 2;
        var x23 = (x2 + x3) / 2;
        var y23 = (y2 + y3) / 2;

        sierpinski(x1, y1, x12, y12, x13, y13, depth - 1);
        sierpinski(x12, y12, x2, y2, x23, y23, depth - 1);
        sierpinski(x13, y13, x23, y23, x3, y3, depth - 1);
      }
    }

    function drawTriangle(x1, y1, x2, y2, x3, y3) {
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.lineTo(x3, y3);
      c.closePath();
      c.fill();
    }

    sierpinski(x1, y1, x2, y2, x3, y3, depth);
    comparePdf(doc.output(), "sierpinski.pdf", "context2d");
  });

  //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing#A_clip_example
  xit("context2d: stars", () => {
    var doc = new jsPDF("p", "pt", "a4");

    var ctx = doc.context2d;
    ctx.fillRect(0, 0, 150, 150);
    ctx.translate(75, 75);

    // Create a circular clipping path
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, Math.PI * 2, true);
    ctx.clip();

    // draw background
    var lingrad = ctx.createLinearGradient(0, -75, 0, 75);
    lingrad.addColorStop(0, "#232256");
    lingrad.addColorStop(1, "#143778");

    ctx.fillStyle = lingrad;
    ctx.fillRect(-75, -75, 150, 150);

    // draw stars
    for (var j = 1; j < 50; j++) {
      ctx.save();
      ctx.fillStyle = "#fff";
      ctx.translate(
        75 - Math.floor(Math.random() * 150),
        75 - Math.floor(Math.random() * 150)
      );
      drawStar(ctx, Math.floor(Math.random() * 4) + 2);
      ctx.restore();
    }

    function drawStar(ctx, r) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(r, 0);
      for (var i = 0; i < 9; i++) {
        ctx.rotate(Math.PI / 5);
        if (i % 2 === 0) {
          ctx.lineTo((r / 0.525731) * 0.200811, 0);
        } else {
          ctx.lineTo(r, 0);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  });
});
