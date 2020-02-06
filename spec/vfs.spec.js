describe("Module: vFS", () => {
  it("addFileToVFS and positive getFileFromVFS", () => {
    var doc = new jsPDF("p", "pt", "a4");
    doc.addFileToVFS("test.pdf", "BADFACE");
    expect(doc.getFileFromVFS("test.pdf")).toEqual("BADFACE");
    doc.addFileToVFS("test2.pdf", "BADFACE2");
    expect(doc.getFileFromVFS("test2.pdf")).toEqual("BADFACE2");
    doc.addFileToVFS("test.pdf", "BADFACE");
    expect(doc.getFileFromVFS("test.pdf")).toEqual("BADFACE");
  });
  it("addFileToVFS and check if getFileFromVFS works...", () => {
    var doc = new jsPDF("p", "pt", "a4");
    doc.addFileToVFS("test.pdf", "BADFACE");
    expect(doc.getFileFromVFS("test.pdf")).toEqual("BADFACE");
    var doc = new jsPDF("p", "pt", "a4");
    doc.addFileToVFS("test.pdf", "BADFACE");
    expect(doc.getFileFromVFS("test.pdf")).toEqual("BADFACE");
    doc.addFileToVFS("test2.pdf", "BADFACE2");
    expect(doc.getFileFromVFS("test2.pdf")).toEqual("BADFACE2");
  });
  it("getFileFromVFS null", () => {
    var doc = new jsPDF("p", "pt", "a4");
    expect(doc.getFileFromVFS("test.pdf")).toEqual(null);
  });
  it("existsFileInVFS false", () => {
    var doc = new jsPDF("p", "pt", "a4");
    expect(doc.existsFileInVFS("test.pdf")).toEqual(false);
  });
  it("existsFileInVFS true", () => {
    var doc = new jsPDF("p", "pt", "a4");
    doc.addFileToVFS("test.pdf", "BADFACE");
    expect(doc.existsFileInVFS("test.pdf")).toEqual(true);
  });
});
