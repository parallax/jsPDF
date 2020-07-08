const jsPDF = window.jsPDF;
const canvg = window.canvg;

describe("globals are defined", () => {
  it("jsPDF", () => {
    expect(jsPDF).toBeDefined();
  });
  it("TextField", () => {
    expect(TextField).toBeDefined();
  });
  it("canvg", () => {
    expect(Canvg).toBeDefined();
  });
});
