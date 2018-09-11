
describe('vFS', () => {
  it('addFileToVFS and positive getFileFromVFS', () => {
    var doc = new jsPDF('p','pt', 'a4');
	doc.addFileToVFS('test.pdf', 'BADFACE');
    expect(doc.getFileFromVFS('test.pdf')).toEqual('BADFACE');
  })
  it('getFileFromVFS null', () => {
    var doc = new jsPDF('p','pt', 'a4');
    expect(doc.getFileFromVFS('test.pdf')).toEqual(null);
  })
  it('existsFileInVFS false', () => {
    var doc = new jsPDF('p','pt', 'a4');
    expect(doc.existsFileInVFS('test.pdf')).toEqual(false);
  })
  it('existsFileInVFS true', () => {
    var doc = new jsPDF('p','pt', 'a4');
	doc.addFileToVFS('test.pdf', 'BADFACE');
    expect(doc.existsFileInVFS('test.pdf')).toEqual(true);
  })
});
