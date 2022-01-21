/* global describe, it, jsPDF, comparePdf */

const render = (markup, opts = {}) =>
  new Promise(resolve => {
    const doc = jsPDF({ floatPrecision: 2 });

    doc.html(markup, { ...opts, callback: resolve });
  });

function toFontFaceRule(fontFace) {
  const srcs = fontFace.src.map(
    src => `url('${src.url}') format('${src.format}')`
  );

  const cssProps = [
    `font-family: ${fontFace.family}`,
    fontFace.stretch && `font-stretch: ${fontFace.stretch}`,
    fontFace.style && `font-style: ${fontFace.style}`,
    fontFace.weight && `font-weight: ${fontFace.weight}`,
    `src: ${srcs.join("\n")}`
  ];

  return `
    @font-face {
      ${cssProps.filter(a => a).join(";\n")} 
    }
  `;
}

describe("Module: html", () => {
  if (
    (typeof isNode != "undefined" && isNode) ||
    navigator.userAgent.indexOf("Chrome") < 0
  ) {
    return;
  }
  beforeAll(loadGlobals);
  it("html loads html2canvas asynchronously", async () => {
    const doc = await render("<h1>Basic HTML</h1>");

    comparePdf(doc.output(), "html-basic.pdf", "html");
  });

  it("respects width and windowWidth options", async () => {
    const markup =
      "<div>" +
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet reprehenderit nihil natus magnam doloremque voluptate ab, laborum officiis corrupti eius voluptatibus quisquam illum esse corporis quod fugit quibusdam minima provident." +
      "</div>";

    const doc210$250 = await render(markup, { width: 210, windowWidth: 250 });
    comparePdf(
      doc210$250.output(),
      "html-width-210-windowWidth-250.pdf",
      "html"
    );

    const doc210$500 = await render(markup, { width: 210, windowWidth: 500 });
    comparePdf(
      doc210$500.output(),
      "html-width-210-windowWidth-500.pdf",
      "html"
    );

    const doc210$1000 = await render(markup, { width: 210, windowWidth: 1000 });
    comparePdf(
      doc210$1000.output(),
      "html-width-210-windowWidth-1000.pdf",
      "html"
    );

    const doc100$500 = await render(markup, { width: 100, windowWidth: 500 });
    comparePdf(
      doc100$500.output(),
      "html-width-100-windowWidth-500.pdf",
      "html"
    );

    const doc300$500 = await render(markup, { width: 300, windowWidth: 500 });
    comparePdf(
      doc300$500.output(),
      "html-width-300-windowWidth-500.pdf",
      "html"
    );
  });

  it("width should not overwrite user-provided html2canvas.scale option", async () => {
    const markup =
      "<div>" +
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet reprehenderit nihil natus magnam doloremque voluptate ab, laborum officiis corrupti eius voluptatibus quisquam illum esse corporis quod fugit quibusdam minima provident." +
      "</div>";
    const doc = await render(markup, {
      width: 300,
      windowWidth: 500,
      html2canvas: { scale: 2 }
    });
    comparePdf(
      doc.output(),
      "html-width-300-windowWidth-500-scale-2.pdf",
      "html"
    );
  });

  it("width and windowWidth should only have an effect if both are supplied", async () => {
    const markup =
      "<div>" +
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet reprehenderit nihil natus magnam doloremque voluptate ab, laborum officiis corrupti eius voluptatibus quisquam illum esse corporis quod fugit quibusdam minima provident." +
      "</div>";
    const docWidthOnly = await render(markup, {
      width: 300
    });
    comparePdf(
      docWidthOnly.output(),
      "html-width-default-windowWidth-default.pdf",
      "html"
    );

    const docWindowWidthOnly = await render(markup, {
      windowWidth: 500
    });
    comparePdf(
      docWindowWidthOnly.output(),
      "html-width-default-windowWidth-default.pdf",
      "html"
    );
  });

  it("renders font-faces", async () => {
    const opts = {
      fontFaces: [
        {
          family: "Roboto",
          weight: 400,
          src: [
            {
              url: "base/test/reference/fonts/Roboto/Roboto-Regular.ttf",
              format: "truetype"
            }
          ]
        },
        {
          family: "Roboto",
          weight: 700,
          src: [
            {
              url: "base/test/reference/fonts/Roboto/Roboto-Bold.ttf",
              format: "truetype"
            }
          ]
        },
        {
          family: "Roboto",
          weight: "bold",
          style: "italic",
          src: [
            {
              url: "base/test/reference/fonts/Roboto/Roboto-BoldItalic.ttf",
              format: "truetype"
            }
          ]
        },
        {
          family: "Roboto",
          style: "italic",
          src: [
            {
              url: "base/test/reference/fonts/Roboto/Roboto-Italic.ttf",
              format: "truetype"
            }
          ]
        }
      ]
    };

    const doc = await render(
      `
      <div style="width: 200px; height: 200px;"> 
        <style>
          ${opts.fontFaces.map(toFontFaceRule)}

          body {
            font-size: 14px;
          }
 
          .sans-serif {
            font-family: sans-serif;
          }

          .roboto {
            font-family: 'Roboto'
          }
          
          .generic {
            font-family: monospace; 
          } 

          .default {
            font-family: serif;
          }

          .bold {
            font-weight: bold;
          }
 
          .italic {
            font-style: italic;
          }
        </style>

        <p class="default">
        The quick brown fox jumps over the lazy dog (default)
        <p>
        <p class="generic">
        The quick brown fox jumps over the lazy dog (generic)
        <p>
        <p class="sans-serif">
        The quick brown fox jumps over the lazy dog (sans-serif)
        <p>

        <div class="roboto">
          <p>
          The quick brown fox jumps over the lazy dog (roboto)
          <p>
          <p class="bold">
          The quick brown fox jumps over the lazy dog (roboto bold)
          <p>
          <p class="italic">
          The quick brown fox jumps over the lazy dog (roboto italic)
          <p>
          <p class="bold italic">
          The quick brown fox jumps over the lazy dog (roboto bold italic)
          <p> 
        </div>
      </div>
    `,
      opts
    );

    comparePdf(doc.output(), "html-font-faces.pdf", "html");
  });

  it("html margin insets properly", async () => {
    const doc = jsPDF({ floatPrecision: 2, unit: "pt" });
    doc.line(30, 10, 100, 10);
    doc.line(30, 10, 30, 100);
    await new Promise(resolve =>
      doc.html(
        "<div style='background: red; width: 10px; height: 10px;'></div>",
        {
          callback: resolve,
          margin: [10, 30]
        }
      )
    );
    comparePdf(doc.output(), "html-margin.pdf", "html");
  });

  it("html margin on page break", async () => {
    const doc = jsPDF({ floatPrecision: 2, unit: "pt", format: [100, 100] });
    await new Promise(resolve =>
      doc.html(
        "<div style='background: red; width: 10px; height: 200px;'></div>",
        {
          callback: resolve,
          margin: [10, 30, 10, 30]
        }
      )
    );
    const numberOfPages = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= numberOfPages; i++) {
      doc.setPage(i);
      doc.rect(30, 10, pageWidth - 60, pageHeight - 20);
    }
    doc.line(0, 50, 100, 50);
    comparePdf(doc.output(), "html-margin-page-break.pdf", "html");
  });

  it("page break with image", async () => {
    const doc = jsPDF({ floatPrecision: 2, unit: "pt", format: [100, 100], lineWidth: 1 });
    await new Promise(resolve =>
      doc.html(
        '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==" width="10" height="200">',
        {
          callback: resolve,
          margin: [10, 30, 10, 30]
        }
      )
    );
    const numberOfPages = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= numberOfPages; i++) {
      doc.setPage(i);
      doc.rect(30, 10, pageWidth - 60, pageHeight - 20);
    }
    doc.line(0, 50, 100, 50);
    comparePdf(doc.output(), "html-margin-page-break-image.pdf", "html");
  });

  it("html x, y offsets properly", async () => {
    const doc = jsPDF({ floatPrecision: 2, unit: "pt" });
    doc.line(30, 10, 100, 10);
    doc.line(30, 10, 30, 100);
    await new Promise(resolve =>
      doc.html(
        "<div style='background: red; width: 10px; height: 10px;'></div>",
        {
          callback: resolve,
          x: 30,
          y: 10
        }
      )
    );
    comparePdf(doc.output(), "html-x-y.pdf", "html");
  });

  it("is able to render html multiple times", async () => {
    const doc = jsPDF({ floatPrecision: 2, unit: "pt" });
    await doc.html("<div style='background: red; width: 10px; height: 10px;'></div>", { x: 30, y: 10 });
    await doc.html("<div style='background: red; width: 10px; height: 10px;'></div>", { x: 50, y: 10 });
    await doc.html("<div style='background: red; width: 10px; height: 10px;'></div>", { x: 10, y: 10 });
    comparePdf(doc.output(), "html-multiple.pdf", "html");
  });

  it("html x, y + margin offsets properly", async () => {
    const doc = jsPDF({ floatPrecision: 2, unit: "pt" });
    doc.line(30, 10, 100, 10);
    doc.line(30, 10, 30, 100);
    await new Promise(resolve =>
      doc.html(
        "<div style='background: red; width: 10px; height: 10px;'></div>",
        {
          callback: resolve,
          x: 10,
          y: 3,
          margin: [7, 20]
        }
      )
    );
    comparePdf(doc.output(), "html-margin-x-y.pdf", "html");
  });

  it("html x, y + margin offsets properly", async () => {
    const doc = jsPDF({ floatPrecision: 2, unit: "pt" });
    doc.line(30, 10, 100, 10);
    doc.line(30, 10, 30, 100);
    await new Promise(resolve =>
      doc.html("<span>Lorem Ipsum</span>", {
        callback: resolve,
        x: 10,
        y: 3,
        margin: [7, 20]
      })
    );
    comparePdf(doc.output(), "html-margin-x-y-text.pdf", "html");
  });

  it("page break with autoPaging: 'text'", async () => {
    const text = Array.from({ length: 200 })
      .map((_, i) => `ABC${i}`)
      .join(" ");

    const doc = jsPDF({ floatPrecision: 2, unit: "pt" });
    await new Promise(resolve =>
      doc.html(`<span>${text}</span>`, {
        callback: resolve,
        margin: [10, 30, 10, 30],
        autoPaging: "text"
      })
    );

    const numberOfPages = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= numberOfPages; i++) {
      doc.setPage(i);
      doc.rect(30, 10, pageWidth - 60, pageHeight - 20);
    }
    comparePdf(doc.output(), "html-margin-page-break-text.pdf", "html");
  });

  it("page break with autoPaging: 'slice'", async () => {
    const text = Array.from({ length: 200 })
      .map((_, i) => `ABC${i}`)
      .join(" ");

    const doc = jsPDF({ floatPrecision: 2, unit: "pt" });
    await new Promise(resolve =>
      doc.html(`<span>${text}</span>`, {
        callback: resolve,
        margin: [10, 30, 10, 30],
        autoPaging: "slice"
      })
    );

    const numberOfPages = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= numberOfPages; i++) {
      doc.setPage(i);
      doc.rect(30, 10, pageWidth - 60, pageHeight - 20);
    }
    comparePdf(doc.output(), "html-margin-page-break-slice.pdf", "html");
  });
});
