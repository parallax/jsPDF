"use strict";
/* global describe, it, jsPDF, comparePdf */
/**
 * Standard spec tests
 *
 */

describe("split_text_to_size", () => {
  it("getArraySum", () => {
    expect(jsPDF.API.getArraySum([1])).toEqual(1);
    expect(jsPDF.API.getArraySum([1.5, 3.5])).toEqual(5);
  });

  it("getStringUnitWidth", () => {
    var doc = new jsPDF();
    doc.setFont("Courier");

    expect(doc.getStringUnitWidth("Lorem Ipsum")).toBeCloseTo(6.599999999999999);
    expect(
      doc.getStringUnitWidth(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
      )
    ).toBeCloseTo(92.99999999999983);

    doc.setFont("Helvetica");

    expect(doc.getStringUnitWidth("Lorem Ipsum")).toBeCloseTo(5.8);
    expect(
      doc.getStringUnitWidth(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
      )
    ).toBeCloseTo(69.54999999999991);
  });

  it("getTextWidth", () => {
    var doc = new jsPDF();
    doc.setFont("Courier");

    expect(doc.getTextWidth("Lorem Ipsum")).toBeCloseTo(37.25333333333332);
    expect(
      doc.getTextWidth(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
      )
    ).toBeCloseTo(524.9333333333324);

    doc.setFont("Helvetica");

    expect(doc.getTextWidth("Lorem Ipsum")).toBeCloseTo(32.73777777777777);
    expect(
      doc.getTextWidth(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
      )
    ).toBeCloseTo(392.57111111111055);
  });

  it("getCharWidthsArray", () => {
    var doc = new jsPDF();
    doc.setFont("Courier");

    for (var i = 0; i < "Lorem Ipsum".length; i++) {
      expect(doc.getCharWidthsArray("Lorem Ipsum")[i]).toBeCloseTo(0.6);
    }

    doc.setFont("Helvetica");

    expect(doc.getCharWidthsArray("Lorem Ipsum")[0]).toBeCloseTo(0.55);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[1]).toBeCloseTo(0.55);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[2]).toBeCloseTo(0.33);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[3]).toBeCloseTo(0.55);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[4]).toBeCloseTo(0.83);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[5]).toBeCloseTo(0.28);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[6]).toBeCloseTo(0.28);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[7]).toBeCloseTo(0.55);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[8]).toBeCloseTo(0.5);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[9]).toBeCloseTo(0.55);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[10]).toBeCloseTo(0.83);
  });

  it("splitTextToSize", () => {
    var doc = new jsPDF();
    doc.setFont("Courier");

    expect(
      doc.splitTextToSize(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        100
      ).length
    ).toEqual(6);
    expect(
      doc.splitTextToSize(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        100
      )[0]
    ).toEqual("Lorem ipsum dolor sit amet,");
    expect(
      doc.splitTextToSize(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        100
      )[1]
    ).toEqual("consetetur sadipscing elitr,");
    expect(
      doc.splitTextToSize(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        100
      )[2]
    ).toEqual("sed diam nonumy eirmod tempor");
    expect(
      doc.splitTextToSize(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        100
      )[3]
    ).toEqual("invidunt ut labore et dolore");
    expect(
      doc.splitTextToSize(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        100
      )[4]
    ).toEqual("magna aliquyam erat, sed diam");
    expect(
      doc.splitTextToSize(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        100
      )[5]
    ).toEqual("voluptua.");

    doc.setFont("Helvetica");

    expect(
      doc.splitTextToSize(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        100
      ).length
    ).toEqual(5);
    expect(
      doc.splitTextToSize(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        100
      )[0]
    ).toEqual("Lorem ipsum dolor sit amet, consetetur");
    expect(
      doc.splitTextToSize(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        100
      )[1]
    ).toEqual("sadipscing elitr, sed diam nonumy");
    expect(
      doc.splitTextToSize(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        100
      )[2]
    ).toEqual("eirmod tempor invidunt ut labore et");
    expect(
      doc.splitTextToSize(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        100
      )[3]
    ).toEqual("dolore magna aliquyam erat, sed diam");
    expect(
      doc.splitTextToSize(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        100
      )[4]
    ).toEqual("voluptua.");
  });
});
