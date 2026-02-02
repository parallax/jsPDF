/* global describe, it, jsPDF, comparePdf */

describe("Module: xmp_metadata", () => {
  beforeAll(loadGlobals);

  it("make some metadata var. 1", () => {
    var doc = new jsPDF({ putOnlyUsedFonts: true, floatPrecision: 2 });
    doc.addMetadata("My metadata as a string.", "http://my.namespace.uri/");
    comparePdf(doc.output(), "xmpmetadata.pdf");
  });

  it("make some metadata var. 2", () => {
    var doc = new jsPDF({ putOnlyUsedFonts: true, floatPrecision: 2 });
    doc.addMetadata("My metadata as a string.");
    comparePdf(doc.output(), "xmpmetadata-defaultNS.pdf");
  });

  it("should support rawXml overload", () => {
    const doc = new jsPDF();
    const rawXml =
      '<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:custom="http://custom.ns/"><custom:data>Raw XML Data</custom:data></rdf:Description></rdf:RDF></x:xmpmeta>';
    doc.addMetadata(rawXml, true);
    comparePdf(doc.output(), "xmpmetadata-rawXml.pdf");
  });

  it("should escape XML content when rawXml is not used", () => {
    const doc = new jsPDF();
    const metadataWithXml = 'Some metadata with <xml> & "special" characters';
    doc.addMetadata(metadataWithXml);
    comparePdf(doc.output(), "xmpmetadata-escaped.pdf");
  });
});
