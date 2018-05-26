'use strict'
/* global describe, it, jsPDF, comparePdf, expect */
/**
 * Standard spec tests
 */

describe('Plugin: addimage bas64Validation', () => {

  it('addImage: base64 validation in use with addImage-Call', () => {
    var doc = new jsPDF();
    var canvas = document.createElement('canvas');
    canvas.width = 2000;
    canvas.height = 2000;
    var ctx = canvas.getContext("2d");
    var image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = image.data;
    for( var i = 0; i < data.length; i++ ) {
      data[i]= Math.random()*255;
    }
    ctx.putImageData(image, 0, 0);

    
    expect(function () {doc.addImage(canvas, 10, 10)}).not.toThrow();
  });

})
