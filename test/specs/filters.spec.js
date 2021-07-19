"use strict";
/* global describe, it, jsPDF, expect */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe("Module: Filters", () => {
  beforeAll(loadGlobals);
  it("ASCIIHexDecode", () => {
    expect(
      jsPDF.API.processDataByFilters("61 62 2e6364 65", "ASCIIHexDecode").data
    ).toEqual("ab.cde");
    expect(
      jsPDF.API.processDataByFilters("61 62 2e6364 657>", "ASCIIHexDecode").data
    ).toEqual("ab.cdep");
    expect(jsPDF.API.processDataByFilters("7>", "ASCIIHexDecode").data).toEqual(
      "p"
    );
    expect(
      jsPDF.API.processDataByFilters("eRROR", "ASCIIHexDecode").data
    ).toEqual("");
  });

  it("ASCIIHexEncode", () => {
    expect(
      jsPDF.API.processDataByFilters("ab.cde", "ASCIIHexEncode").data
    ).toEqual("61622e636465>");
    expect(
      jsPDF.API.processDataByFilters("ab.cdep", "ASCIIHexEncode").data
    ).toEqual("61622e63646570>");
    expect(jsPDF.API.processDataByFilters("p", "ASCIIHexEncode").data).toEqual(
      "70>"
    );
  });

  it("ASCII85Encode", () => {
    expect(
      jsPDF.API.processDataByFilters("Man is distinguished", "ASCII85Encode")
        .data
    ).toEqual("9jqo^BlbD-BleB1DJ+*+F(f,q~>");
  });

  it("ASCII85Decode", () => {
    expect(
      jsPDF.API.processDataByFilters("E,9)oF*2M7/c~>", "ASCII85Decode").data
    ).toEqual("pleasure.");
    expect(
      jsPDF.API.processDataByFilters("E,9  )oF*2M  7/c~>", "ASCII85Decode").data
    ).toEqual("pleasure.");
  });

  it("Invalid", () => {
    expect(function() {
      jsPDF.API.processDataByFilters("Man is distinguished", ["invalid"]);
    }).toThrow(new Error('The filter: "invalid" is not implemented'));
  });

  it("FlateEncode", () => {
    expect(
      jsPDF.API.processDataByFilters("Man is distinguished", [
        "FlateEncode",
        "ASCIIHexEncode"
      ]).data
    ).toEqual("789cf34dcc53c82c5648c92c2ec9cc4b2fcd2cce484d01004c9c07ad>");
  });
});
