var doc = new jsPDF({
  unit: "px",
  format: [200, 300],
  floatPrecision: 2
});

doc.textWithLink("Click me!", 10, 10, {
  url: "https://parall.ax/"
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
  contents: "This is text annotation (closed by default)",
  open: false
});
