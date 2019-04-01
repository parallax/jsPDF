
/* global describe, it, jsPDF, expect */
/**
 * Standard spec tests
 *
 */

describe('Module: split_text_to_size', () => {

  it('getStringUnitWidth', () => {
    var doc = new jsPDF();
    doc.setFont("Courier");

    expect(doc.getStringUnitWidth("Lorem Ipsum")).toEqual(6.599999999999999);
    expect(doc.getStringUnitWidth("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.")).toEqual(92.99999999999983);

    doc.setFont("Helvetica");

    expect(doc.getStringUnitWidth("Lorem Ipsum")).toEqual(5.8);
    expect(doc.getStringUnitWidth("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.")).toEqual(69.5499999999999);
  })
  
  it('getTextWidth', () => {
    var doc = new jsPDF();
    doc.setFont("Courier");

    expect(doc.getTextWidth("Lorem Ipsum")).toEqual(37.25333333333332);
    expect(doc.getTextWidth("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.")).toEqual(524.9333333333324);

    doc.setFont("Helvetica");

    expect(doc.getTextWidth("Lorem Ipsum")).toEqual(32.73777777777777);
    expect(doc.getTextWidth("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.")).toEqual(392.5711111111105);
  })
  
  it('getCharWidthsArray', () => {
    var doc = new jsPDF();
    doc.setFont("Courier");

    for (var i = 0; i < "Lorem Ipsum".length; i++) {
        expect(doc.getCharWidthsArray("Lorem Ipsum")[i]).toEqual(0.6);
    }

    doc.setFont("Helvetica");

    expect(doc.getCharWidthsArray("Lorem Ipsum")[0]).toEqual(0.55);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[1]).toEqual(0.55);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[2]).toEqual(0.33);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[3]).toEqual(0.55);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[4]).toEqual(0.83);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[5]).toEqual(0.28);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[6]).toEqual(0.28);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[7]).toEqual(0.55);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[8]).toEqual(0.5);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[9]).toEqual(0.55);
    expect(doc.getCharWidthsArray("Lorem Ipsum")[10]).toEqual(0.83);
  })
  
  it('splitTextToSize', () => {
    var doc = new jsPDF();
    doc.setFont("Courier");

    expect(doc.splitTextToSize("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.", 100).length).toEqual(6);
    expect(doc.splitTextToSize("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.", 100)[0]).toEqual("Lorem ipsum dolor sit amet,");
    expect(doc.splitTextToSize("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.", 100)[1]).toEqual("consetetur sadipscing elitr,");
    expect(doc.splitTextToSize("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.", 100)[2]).toEqual("sed diam nonumy eirmod tempor");
    expect(doc.splitTextToSize("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.", 100)[3]).toEqual("invidunt ut labore et dolore");
    expect(doc.splitTextToSize("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.", 100)[4]).toEqual("magna aliquyam erat, sed diam");
    expect(doc.splitTextToSize("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.", 100)[5]).toEqual("voluptua.");

    doc.setFont("Helvetica");

    expect(doc.splitTextToSize("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.", 100).length).toEqual(5);
    expect(doc.splitTextToSize("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.", 100)[0]).toEqual("Lorem ipsum dolor sit amet, consetetur");
    expect(doc.splitTextToSize("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.", 100)[1]).toEqual("sadipscing elitr, sed diam nonumy");
    expect(doc.splitTextToSize("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.", 100)[2]).toEqual("eirmod tempor invidunt ut labore et");
    expect(doc.splitTextToSize("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.", 100)[3]).toEqual("dolore magna aliquyam erat, sed diam");
    expect(doc.splitTextToSize("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.", 100)[4]).toEqual("voluptua.");
  })


})
