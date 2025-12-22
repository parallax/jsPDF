/* global describe, it, jsPDF, expect */
/**
 * PDF/UA (Universal Accessibility) spec tests
 * Tests for Sprint 1 implementation
 */

describe("Module: PDF/UA", () => {
  beforeAll(loadGlobals);

  describe("US-1.1: PDF/UA Mode", () => {
    it("should enable PDF/UA mode via constructor option", () => {
      const doc = jsPDF({ pdfUA: true });
      expect(doc.isPDFUAEnabled()).toBe(true);
      expect(doc.internal.pdfUA).toBeDefined();
      expect(doc.internal.pdfUA.enabled).toBe(true);
      expect(doc.internal.pdfUA.conformance).toBe("A");
    });

    it("should not enable PDF/UA mode by default", () => {
      const doc = jsPDF();
      expect(doc.isPDFUAEnabled()).toBeFalsy();
      expect(doc.internal.pdfUA).toBeNull();
    });

    it("should enable PDF/UA mode via enablePDFUA() method", () => {
      const doc = jsPDF();
      expect(doc.isPDFUAEnabled()).toBeFalsy();

      doc.enablePDFUA();
      expect(doc.isPDFUAEnabled()).toBe(true);
      expect(doc.internal.pdfUA).toBeDefined();
      expect(doc.internal.pdfUA.enabled).toBe(true);
    });

    it("should disable PDF/UA mode via disablePDFUA() method", () => {
      const doc = jsPDF({ pdfUA: true });
      expect(doc.isPDFUAEnabled()).toBe(true);

      doc.disablePDFUA();
      expect(doc.isPDFUAEnabled()).toBe(false);
      expect(doc.internal.pdfUA.enabled).toBe(false);
    });

    it("should support method chaining for enablePDFUA()", () => {
      const doc = jsPDF();
      const result = doc.enablePDFUA();
      expect(result).toBe(doc);
      expect(doc.isPDFUAEnabled()).toBe(true);
    });

    it("should support method chaining for disablePDFUA()", () => {
      const doc = jsPDF({ pdfUA: true });
      const result = doc.disablePDFUA();
      expect(result).toBe(doc);
    });

    it("should allow toggling PDF/UA mode multiple times", () => {
      const doc = jsPDF();

      doc.enablePDFUA();
      expect(doc.isPDFUAEnabled()).toBe(true);

      doc.disablePDFUA();
      expect(doc.isPDFUAEnabled()).toBe(false);

      doc.enablePDFUA();
      expect(doc.isPDFUAEnabled()).toBe(true);
    });
  });

  describe("US-1.2: XMP Metadata", () => {
    it("should initialize XMP metadata for PDF/UA documents", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("Test Document");

      expect(doc.internal.__metadata__).toBeDefined();
      expect(doc.internal.__metadata__.pdfUA).toBe(true);
      expect(doc.internal.__metadata__.title).toBe("Test Document");
    });

    it("should set document title via setDocumentTitle()", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("My Accessible PDF");

      expect(doc.internal.__metadata__.title).toBe("My Accessible PDF");
    });

    it("should support method chaining for setDocumentTitle()", () => {
      const doc = jsPDF({ pdfUA: true });
      const result = doc.setDocumentTitle("Test");
      expect(result).toBe(doc);
    });

    it("should generate PDF with XMP metadata stream", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("Test PDF/UA");
      doc.text("Hello", 10, 10);

      const pdfOutput = doc.output();

      // Check for XMP metadata markers
      expect(pdfOutput).toContain("/Type /Metadata");
      expect(pdfOutput).toContain("/Subtype /XML");
    });

    it("should include PDF/UA identification in XMP", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("Test");
      doc.text("Hello", 10, 10);

      const pdfOutput = doc.output();

      // Check for PDF/UA namespace and identification
      expect(pdfOutput).toContain("pdfuaid");
      expect(pdfOutput).toContain("<pdfuaid:part>1</pdfuaid:part>");
      expect(pdfOutput).toContain("<pdfuaid:conformance>A</pdfuaid:conformance>");
    });

    it("should include dc:title in XMP metadata", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("My Test Document");
      doc.text("Hello", 10, 10);

      const pdfOutput = doc.output();

      expect(pdfOutput).toContain("dc:title");
      expect(pdfOutput).toContain("My Test Document");
    });

    it("should escape XML special characters in title", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("Test <with> & \"special\" 'chars'");
      doc.text("Hello", 10, 10);

      const pdfOutput = doc.output();

      // Should contain escaped versions
      expect(pdfOutput).toContain("&lt;");
      expect(pdfOutput).toContain("&gt;");
      expect(pdfOutput).toContain("&amp;");
      expect(pdfOutput).toContain("&quot;");
      expect(pdfOutput).toContain("&apos;");
    });

    it("should work without PDF/UA mode for legacy metadata", () => {
      const doc = jsPDF();
      doc.addMetadata("Custom metadata", "http://example.com/");

      expect(doc.internal.__metadata__).toBeDefined();
      expect(doc.internal.__metadata__.customMetadata).toBe("Custom metadata");
    });
  });

  describe("US-1.3: ViewerPreferences DisplayDocTitle", () => {
    it("should automatically set DisplayDocTitle for PDF/UA documents", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.text("Hello", 10, 10);

      expect(doc.internal.viewerpreferences).toBeDefined();
      expect(doc.internal.viewerpreferences.configuration).toBeDefined();
      expect(doc.internal.viewerpreferences.configuration.DisplayDocTitle.value).toBe(true);
    });

    it("should include ViewerPreferences in PDF output", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("Test");
      doc.text("Hello", 10, 10);

      const pdfOutput = doc.output();

      expect(pdfOutput).toContain("/ViewerPreferences");
      expect(pdfOutput).toContain("/DisplayDocTitle true");
    });

    it("should not set DisplayDocTitle for non-PDF/UA documents", () => {
      const doc = jsPDF();
      doc.text("Hello", 10, 10);

      // ViewerPreferences should not be initialized automatically
      expect(doc.internal.viewerpreferences).toBeUndefined();
    });

    it("should allow manual ViewerPreferences override", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.viewerPreferences({
        DisplayDocTitle: true,
        FitWindow: true
      });

      expect(doc.internal.viewerpreferences.configuration.DisplayDocTitle.value).toBe(true);
      expect(doc.internal.viewerpreferences.configuration.FitWindow.value).toBe(true);
    });
  });

  describe("Integration Tests", () => {
    it("should create a complete PDF/UA document", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("Complete Test Document");
      doc.text("This is a PDF/UA document", 10, 10);
      doc.text("with proper metadata", 10, 20);

      const pdfOutput = doc.output();

      // Check all PDF/UA requirements from Sprint 1
      expect(pdfOutput).toContain("/Type /Metadata");
      expect(pdfOutput).toContain("pdfuaid:part");
      expect(pdfOutput).toContain("pdfuaid:conformance");
      expect(pdfOutput).toContain("dc:title");
      expect(pdfOutput).toContain("/ViewerPreferences");
      expect(pdfOutput).toContain("/DisplayDocTitle true");
      expect(pdfOutput).toContain("Complete Test Document");
    });

    it("should maintain backward compatibility for non-PDF/UA documents", () => {
      const doc = jsPDF();
      doc.text("Regular PDF", 10, 10);

      const pdfOutput = doc.output();

      // Should NOT contain PDF/UA metadata
      expect(pdfOutput).not.toContain("pdfuaid");
      expect(pdfOutput).not.toContain("dc:title");
    });

    it("should handle enabling PDF/UA after document creation", () => {
      const doc = jsPDF();
      doc.text("First text", 10, 10);

      doc.enablePDFUA();
      doc.setDocumentTitle("Late PDF/UA");
      doc.text("Second text", 10, 20);

      expect(doc.isPDFUAEnabled()).toBe(true);
      expect(doc.internal.__metadata__.title).toBe("Late PDF/UA");
    });

    it("should generate valid PDF output", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("Valid PDF Test");
      doc.text("Content", 10, 10);

      const pdfOutput = doc.output("arraybuffer");

      // Check PDF header
      const header = new Uint8Array(pdfOutput.slice(0, 5));
      const headerString = String.fromCharCode.apply(null, header);
      expect(headerString).toBe("%PDF-");

      // Should be a valid ArrayBuffer
      expect(pdfOutput).toBeInstanceOf(ArrayBuffer);
      expect(pdfOutput.byteLength).toBeGreaterThan(0);
    });
  });

  describe("US-2.1: Structure Tree (StructTreeRoot)", () => {
    it("should automatically create StructTreeRoot for PDF/UA documents", () => {
      const doc = jsPDF({ pdfUA: true });

      expect(doc.internal.structureTree).toBeDefined();
      expect(doc.internal.structureTree.root).toBeDefined();
      expect(doc.internal.structureTree.root.type).toBe("StructTreeRoot");
    });

    it("should not create StructTreeRoot for non-PDF/UA documents", () => {
      const doc = jsPDF();

      expect(doc.internal.structureTree).toBeUndefined();
    });

    it("should include StructTreeRoot in PDF output", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("Test");
      doc.beginStructureElement("P");
      doc.text("Hello", 10, 10);
      doc.endStructureElement();

      const pdfOutput = doc.output();

      expect(pdfOutput).toContain("/StructTreeRoot");
      expect(pdfOutput).toContain("/Type /StructTreeRoot");
    });

    it("should create MarkInfo dictionary with Marked flag", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("Test");
      doc.beginStructureElement("P");
      doc.text("Hello", 10, 10);
      doc.endStructureElement();

      const pdfOutput = doc.output();

      expect(pdfOutput).toContain("/MarkInfo");
      expect(pdfOutput).toContain("/Marked true");
    });

    it("should reference StructTreeRoot in Catalog", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("Test");
      doc.beginStructureElement("P");
      doc.text("Hello", 10, 10);
      doc.endStructureElement();

      const pdfOutput = doc.output();

      // Should have reference to StructTreeRoot in Catalog
      expect(pdfOutput).toMatch(/\/StructTreeRoot \d+ 0 R/);
      // Should have reference to MarkInfo in Catalog
      expect(pdfOutput).toMatch(/\/MarkInfo \d+ 0 R/);
    });
  });

  describe("US-2.2: Standard Structure Elements", () => {
    it("should allow adding Document structure element", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.beginStructureElement("Document");
      doc.endStructureElement();

      expect(doc.internal.structureTree.elements.length).toBe(1);
      expect(doc.internal.structureTree.elements[0].type).toBe("Document");
    });

    it("should allow adding Paragraph (P) structure element", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.beginStructureElement("P");
      doc.endStructureElement();

      expect(doc.internal.structureTree.elements.length).toBe(1);
      expect(doc.internal.structureTree.elements[0].type).toBe("P");
    });

    it("should allow adding Heading (H1-H6) structure elements", () => {
      const doc = jsPDF({ pdfUA: true });

      doc.beginStructureElement("H1");
      doc.endStructureElement();

      doc.beginStructureElement("H2");
      doc.endStructureElement();

      doc.beginStructureElement("H6");
      doc.endStructureElement();

      expect(doc.internal.structureTree.elements.length).toBe(3);
      expect(doc.internal.structureTree.elements[0].type).toBe("H1");
      expect(doc.internal.structureTree.elements[1].type).toBe("H2");
      expect(doc.internal.structureTree.elements[2].type).toBe("H6");
    });

    it("should support nested structure elements", () => {
      const doc = jsPDF({ pdfUA: true });

      doc.beginStructureElement("Document");
      doc.beginStructureElement("H1");
      doc.endStructureElement();
      doc.beginStructureElement("P");
      doc.endStructureElement();
      doc.endStructureElement();

      expect(doc.internal.structureTree.elements.length).toBe(3);

      const documentElem = doc.internal.structureTree.elements[0];
      expect(documentElem.type).toBe("Document");
      expect(documentElem.children.length).toBe(2);
      expect(documentElem.children[0].type).toBe("H1");
      expect(documentElem.children[1].type).toBe("P");
    });

    it("should support method chaining for structure elements", () => {
      const doc = jsPDF({ pdfUA: true });

      const result = doc
        .beginStructureElement("Document")
        .beginStructureElement("P")
        .endStructureElement()
        .endStructureElement();

      expect(result).toBe(doc);
      expect(doc.internal.structureTree.elements.length).toBe(2);
    });

    it("should write StructElem objects to PDF", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("Test");

      doc.beginStructureElement("Document");
      doc.beginStructureElement("H1");
      doc.endStructureElement();
      doc.endStructureElement();

      doc.text("Hello", 10, 10);

      const pdfOutput = doc.output();

      expect(pdfOutput).toContain("/Type /StructElem");
      expect(pdfOutput).toContain("/S /Document");
      expect(pdfOutput).toContain("/S /H1");
    });

    it("should correctly establish parent-child relationships", () => {
      const doc = jsPDF({ pdfUA: true });

      doc.beginStructureElement("Document");
      doc.beginStructureElement("P");

      const currentElem = doc.getCurrentStructureElement();
      expect(currentElem.type).toBe("P");
      expect(currentElem.parent.type).toBe("Document");

      doc.endStructureElement();
      doc.endStructureElement();
    });

    it("should handle multiple document structures", () => {
      const doc = jsPDF({ pdfUA: true });

      // First structure
      doc.beginStructureElement("Document");
      doc.beginStructureElement("H1");
      doc.endStructureElement();
      doc.endStructureElement();

      // Second structure
      doc.beginStructureElement("Document");
      doc.beginStructureElement("P");
      doc.endStructureElement();
      doc.endStructureElement();

      expect(doc.internal.structureTree.elements.length).toBe(4);
      expect(doc.internal.structureTree.root.children.length).toBe(2);
    });
  });

  describe("Sprint 2 Integration Tests", () => {
    it("should create a complete PDF/UA document with structure tree", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("Sprint 2 Complete Test");

      doc.beginStructureElement("Document");
      doc.beginStructureElement("H1");
      doc.text("Title", 10, 10);
      doc.endStructureElement();

      doc.beginStructureElement("P");
      doc.text("Paragraph text", 10, 20);
      doc.endStructureElement();
      doc.endStructureElement();

      const pdfOutput = doc.output();

      // Check all Sprint 2 requirements
      expect(pdfOutput).toContain("/StructTreeRoot");
      expect(pdfOutput).toContain("/MarkInfo");
      expect(pdfOutput).toContain("/Marked true");
      expect(pdfOutput).toContain("/Type /StructElem");
      expect(pdfOutput).toContain("/S /Document");
      expect(pdfOutput).toContain("/S /H1");
      expect(pdfOutput).toContain("/S /P");

      // Sprint 1 requirements should still be met
      expect(pdfOutput).toContain("pdfuaid");
      expect(pdfOutput).toContain("/ViewerPreferences");
      expect(pdfOutput).toContain("/DisplayDocTitle true");
    });

    it("should maintain backward compatibility with Sprint 1", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("Backward Compatibility Test");
      doc.beginStructureElement("P");
      doc.text("Content", 10, 10);
      doc.endStructureElement();

      const pdfOutput = doc.output();

      // Sprint 1 features
      expect(pdfOutput).toContain("pdfuaid:part");
      expect(pdfOutput).toContain("dc:title");
      expect(pdfOutput).toContain("/DisplayDocTitle true");

      // Sprint 2 features
      expect(pdfOutput).toContain("/StructTreeRoot");
      expect(pdfOutput).toContain("/MarkInfo");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty title", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("");
      doc.text("Hello", 10, 10);

      // Should not crash
      const pdfOutput = doc.output();
      expect(pdfOutput).toBeDefined();
    });

    it("should handle very long title", () => {
      const doc = jsPDF({ pdfUA: true });
      const longTitle = "A".repeat(1000);
      doc.setDocumentTitle(longTitle);
      doc.text("Hello", 10, 10);

      const pdfOutput = doc.output();
      expect(pdfOutput).toContain(longTitle);
    });

    it("should handle Unicode characters in title", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("Test 日本語 Тест ñ é ü");
      doc.text("Hello", 10, 10);

      const pdfOutput = doc.output();
      // Should contain the title (may be encoded)
      expect(pdfOutput).toBeDefined();
    });

    it("should handle multiple setDocumentTitle calls", () => {
      const doc = jsPDF({ pdfUA: true });
      doc.setDocumentTitle("First Title");
      doc.setDocumentTitle("Second Title");
      doc.setDocumentTitle("Final Title");

      expect(doc.internal.__metadata__.title).toBe("Final Title");
    });
  });
});
