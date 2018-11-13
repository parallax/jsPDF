
describe('cell', () => {
  it('getTextDimensions', () => {
    var doc = new jsPDF('p','pt', 'a4');
    expect(doc.getTextDimensions(doc.splitTextToSize("Octocat loves jsPDF", 50)).w).toEqual(43.36000000000001)
    expect(doc.getTextDimensions(doc.splitTextToSize("Octocat loves jsPDF", 50)).h).toEqual(71.19999999999999)
    expect(doc.getTextDimensions(doc.splitTextToSize("Octocat loves jsPDF", 150)).w).toEqual(144.48)
    expect(doc.getTextDimensions(doc.splitTextToSize("Octocat loves jsPDF", 150)).h).toEqual(16)
    expect(doc.getTextDimensions("Octocat loves jsPDF").w).toEqual(144.48)
    expect(doc.getTextDimensions("Octocat loves jsPDF").h).toEqual(16)
    expect(doc.getTextDimensions("").w).toEqual(0)
    expect(doc.getTextDimensions("").h).toEqual(0)
    expect(doc.getTextDimensions([""]).w).toEqual(0)
    expect(doc.getTextDimensions([""]).h).toEqual(0)
	expect(function () {doc.getTextDimensions()}).toThrow(new Error('getTextDimensions expects text-parameter to be of type String or an Array of Strings.'));
  })
  it('arrayMax', () => {
    var doc = new jsPDF('p','pt', 'a4');
    expect(doc.arrayMax([1,2,3,4,5])).toEqual(5);
    expect(doc.arrayMax([1,2,3,4,5,4,3,2,1])).toEqual(5);
  })
});
