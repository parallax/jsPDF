
/* global describe, it, jsPDF, comparePdf, expect */

describe('Module: FileLoad', () => {
  var global = (typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global || Function('return typeof this === "object" && this.content')() || Function('return this')());
  
  if (global.isNode === true) {
    return;
  }
  it('should load a file (sync)', () => {
    const doc = jsPDF()
    var file = doc.loadFile('/base/spec/reference/success.txt', true, 1);
    expect(file).toEqual('success');
  })
  it('should load a file (async)', (done) => {
    const doc = jsPDF()
    doc.loadFile('/base/spec/reference/success.txt', false, function (data) {
      expect(data).toEqual('success');
      done();
    });
  })
})
