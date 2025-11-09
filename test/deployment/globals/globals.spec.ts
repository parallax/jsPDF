describe("globals are defined", () => {
  beforeAll(loadGlobals);
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
