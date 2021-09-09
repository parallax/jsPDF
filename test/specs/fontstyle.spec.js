describe("Font style and font weight", () => {
  beforeAll(loadGlobals);

  it("combine font style and font weight correctly", () => {
    const doc = new jsPDF();

    const combine = doc.__private__.combineFontStyleAndFontWeight;

    expect(combine("normal", "normal")).toEqual("normal");
    expect(combine("normal", "400")).toEqual("normal");
    expect(combine("normal", 400)).toEqual("normal");

    expect(combine("italic", "normal")).toEqual("italic");
    expect(combine("italic", "400")).toEqual("italic");
    expect(combine("italic", 400)).toEqual("italic");

    expect(combine("normal", "bold")).toEqual("bold");
    expect(combine("normal", "700")).toEqual("bold");
    expect(combine("normal", 700)).toEqual("bold");

    expect(combine("italic", "bold")).toEqual("bolditalic");
    expect(combine("italic", "700")).toEqual("bolditalic");
    expect(combine("italic", 700)).toEqual("bolditalic");

    expect(combine("normal", "300")).toEqual("300normal");
    expect(combine("normal", 300)).toEqual("300normal");

    expect(combine("italic", "300")).toEqual("300italic");
    expect(combine("italic", 300)).toEqual("300italic");
  });
});
