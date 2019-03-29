
/* global describe, xit, jsPDF, expect */
/**
 * Standard spec tests
 */

describe('Module: Context2D: HTML comparison tests', () => {
    xit('default values like a real 2d-context', () => {
		var doc = new jsPDF();
		
		var ctx = doc.canvas.getContext('2d');
		
		expect(ctx.fillStyle).toEqual('#000000');
		expect(ctx.filter).toEqual('none');
		expect(ctx.font).toEqual('10px sans-serif');
		expect(ctx.globalAlpha).toEqual(1);
		expect(ctx.globalCompositeOperation).toEqual("source-over");
		expect(ctx.imageSmoothingEnabled).toEqual(true);
		expect(ctx.imageSmoothingQuality).toEqual("low");
		expect(ctx.lineCap).toEqual("butt");
		expect(ctx.lineDashOffset).toEqual(0);
		expect(ctx.lineJoin).toEqual("miter");
		expect(ctx.lineWidth).toEqual(1);
		expect(ctx.miterLimit).toEqual(10);
		expect(ctx.shadowBlur).toEqual(0);
		expect(ctx.shadowColor).toEqual("rgba(0, 0, 0, 0)");
		expect(ctx.shadowOffsetX).toEqual(0);
		expect(ctx.shadowOffsetY).toEqual(0);
		expect(ctx.strokeStyle).toEqual('#000000');
		expect(ctx.textAlign).toEqual('start');
		expect(ctx.textBaseline).toEqual('alphabetic');
		
	});
	
})
