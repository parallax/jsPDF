
describe('cell', () => {
  it('getTextDimensions', () => {
    var doc = new jsPDF('p','pt', 'a4');
    expect(doc.getTextDimensions(doc.splitTextToSize("Octocat loves jsPDF", 50)).w).toEqual(43.36000000000001)
    expect(doc.getTextDimensions(doc.splitTextToSize("Octocat loves jsPDF", 50)).h).toEqual(73.6)
    expect(doc.getTextDimensions(doc.splitTextToSize("Octocat loves jsPDF", 150)).w).toEqual(144.48)
    expect(doc.getTextDimensions(doc.splitTextToSize("Octocat loves jsPDF", 150)).h).toEqual(18.4)
    expect(doc.getTextDimensions("Octocat loves jsPDF").w).toEqual(144.48)
    expect(doc.getTextDimensions("Octocat loves jsPDF").h).toEqual(18.4)
    expect(doc.getTextDimensions("").w).toEqual(0)
    expect(doc.getTextDimensions("").h).toEqual(0))
    expect(doc.getTextDimensions([""]).w).toEqual(0)
    expect(doc.getTextDimensions([""]).h).toEqual(0)
  })
