describe("Producer Configuration", function() {
  var jsPDF = require("../../dist/jspdf.node.js");

  it("should use default producer when none is set", function() {
    var doc = new jsPDF();
    var pdfOutput = doc.output();
    
    // Check that default producer contains jsPDF version
    expect(pdfOutput).toContain("/Producer (jsPDF");
  });

  it("should use custom producer when set via setDocumentProperty", function() {
    var doc = new jsPDF();
    doc.setDocumentProperty("producer", "Custom Producer");
    var pdfOutput = doc.output();
    
    // Check that custom producer is used
    expect(pdfOutput).toContain("/Producer (Custom Producer)");
    expect(pdfOutput).not.toContain("/Producer (jsPDF");
  });

  it("should remove producer field when set to empty string", function() {
    var doc = new jsPDF();
    doc.setDocumentProperty("producer", "");
    var pdfOutput = doc.output();
    
    // Check that no producer field is present
    expect(pdfOutput).not.toContain("/Producer");
  });

  it("should use custom producer when set via setDocumentProperties", function() {
    var doc = new jsPDF();
    doc.setDocumentProperties({
      title: "Test Document",
      producer: "Custom PDF Generator v1.0"
    });
    var pdfOutput = doc.output();
    
    // Check that custom producer is used
    expect(pdfOutput).toContain("/Producer (Custom PDF Generator v1.0)");
    expect(pdfOutput).toContain("/Title (Test Document)");
  });

  it("should maintain backward compatibility when producer is not set", function() {
    var doc = new jsPDF();
    // Don't set any producer
    var pdfOutput = doc.output();
    
    // Should still have default jsPDF producer
    expect(pdfOutput).toContain("/Producer (jsPDF");
  });
});