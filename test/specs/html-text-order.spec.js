/* global describe, it, jsPDF */

const render = (markup, opts = {}) =>
  new Promise(resolve => {
    const doc = jsPDF({ floatPrecision: 2 });

    doc.html(markup, { ...opts, callback: resolve });
  });

/**
 * Extracts the text drawn on a page in content-stream order, by pulling
 * every `(...) Tj` operand out of the raw page content stream and joining
 * them. This reflects the *logical* order a PDF text-extraction tool or a
 * copy-paste from a strict PDF viewer would produce - which is the thing
 * issue #4000 reported as broken, independent of whether the text is
 * visually positioned correctly on the page.
 */
function extractTextInStreamOrder(doc, pageNumber) {
  const raw = doc.internal.pages[pageNumber].join("\n");
  const matches = raw.match(/\(((?:[^()\\]|\\.)*)\)\s*Tj/g) || [];
  return matches
    .map(m => {
      const inner = m.match(/\(((?:[^()\\]|\\.)*)\)\s*Tj/)[1];
      // Undo the minimal PDF string escaping jsPDF applies.
      return inner.replace(/\\([()\\])/g, "$1");
    })
    .join("");
}

describe("Module: html - text extraction order (#4000)", () => {
  if (
    (typeof isNode != "undefined" && isNode) ||
    navigator.userAgent.indexOf("Chrome") < 0
  ) {
    return;
  }
  beforeAll(loadGlobals);

  it("keeps a styled inline run in its correct sentence position", async () => {
    const markup =
      '<div style="width:1060px;font-family:Arial,sans-serif;font-size:16px;">' +
      "<p>The <strong>Treynor</strong> <em>ratio</em> is a performance metric.</p>" +
      "</div>";

    const doc = await render(markup, {
      width: 180,
      margin: [16, 15, 16, 15],
      windowWidth: 1060,
      autoPaging: "text"
    });

    const text = extractTextInStreamOrder(doc, 1);

    expect(text).toContain("The Treynor ratio is a performance metric.");
  });

  it("writes multiple mixed-style paragraphs in top-to-bottom reading order", async () => {
    const markup =
      '<div style="width:1060px;font-family:Arial,sans-serif;font-size:16px;">' +
      "<p>Plain: The Treynor ratio is a performance metric.</p>" +
      "<p>Span-split: The <span>Treynor</span> <span>ratio</span> is a metric.</p>" +
      "<p>Nested inline: The <strong>Treynor</strong> <em>ratio</em> combines inputs.</p>" +
      "<p>Bold whole phrase: The <strong>Treynor ratio</strong> combines inputs.</p>" +
      "</div>";

    const doc = await render(markup, {
      width: 180,
      margin: [16, 15, 16, 15],
      windowWidth: 1060,
      autoPaging: "text"
    });

    const text = extractTextInStreamOrder(doc, 1);

    const plainIndex = text.indexOf("Plain:");
    const spanIndex = text.indexOf("Span-split:");
    const nestedIndex = text.indexOf("Nested inline:");
    const boldIndex = text.indexOf("Bold whole phrase:");

    expect(plainIndex).not.toBe(-1);
    expect(spanIndex).not.toBe(-1);
    expect(nestedIndex).not.toBe(-1);
    expect(boldIndex).not.toBe(-1);

    expect(plainIndex).toBeLessThan(spanIndex);
    expect(spanIndex).toBeLessThan(nestedIndex);
    expect(nestedIndex).toBeLessThan(boldIndex);

    expect(text.slice(plainIndex, spanIndex)).toContain(
      "Plain: The Treynor ratio is a performance metric."
    );
    expect(text.slice(nestedIndex, boldIndex)).toContain(
      "Nested inline: The Treynor ratio combines inputs."
    );
  });
});