/* global describe, it, jsPDF, expect, loadGlobals */
/**
 * jsPDF javascript plugin tests
 */

describe("Module: JavaScript", () => {
  beforeAll(loadGlobals);

  it("should correctly escape parentheses in addJS", () => {
    const doc = new jsPDF();
    doc.addJS("alert('Hello (world)');");
    const output = doc.output();
    expect(output).toContain("/JS (alert\\('Hello \\(world\\)'\\);)");
  });

  it("should correctly escape nested parentheses in addJS", () => {
    const doc = new jsPDF();
    doc.addJS("function test() { alert('((nested))'); }");
    const output = doc.output();
    expect(output).toContain(
      "/JS (function test\\(\\) { alert\\('\\(\\(nested\\)\\)'\\); })"
    );
  });

  it("should not double-escape parentheses in addJS", () => {
    const doc = new jsPDF();
    doc.addJS("alert('Hello \\(world\\)');");
    const output = doc.output();
    expect(output).toContain("/JS (alert\\('Hello \\(world\\)'\\);)");
  });

  it("should not double-escape parentheses at the start in addJS", () => {
    const doc = new jsPDF();
    doc.addJS("\\(");
    const output = doc.output();
    expect(output).toContain("/JS (\\()");
  });

  it("should escape parentheses at the start in addJS", () => {
    const doc = new jsPDF();
    doc.addJS("(");
    const output = doc.output();
    expect(output).toContain("/JS (\\()");
  });

  it("should escape parentheses after escaped backslash in addJS", () => {
    const doc = new jsPDF();
    doc.addJS("\\\\(\\\\)");
    const output = doc.output();

    expect(output).toContain("/JS (\\\\\\(\\\\\\))");
  });
});
