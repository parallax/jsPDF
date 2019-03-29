
describe('Context2D: standard tests', () => {
	it('width', () => {
		var doc = new jsPDF();
		doc.canvas.width = undefined;
		expect(doc.canvas.width).toEqual(150);
		doc.canvas.width = 1;
		expect(doc.canvas.width).toEqual(1);
		
	});
	it('height', () => {
		var doc = new jsPDF();
		
		doc.canvas.height = undefined;
		expect(doc.canvas.height).toEqual(300);
		doc.canvas.height = 1;
		expect(doc.canvas.height).toEqual(1);
		
	});
	it('style', () => {
		var doc = new jsPDF();
		
		doc.canvas.style.textAlign = 'right';
		expect(doc.canvas.style.textAlign).toEqual('right');
		doc.canvas.style = {}
		
	});
	
	it('getContext', () => {
		var doc = new jsPDF();
		expect(doc.canvas.getContext('fantasy')).toEqual(null);
		expect(doc.canvas.getContext('2d')).toEqual(doc.context2d);
		expect(doc.canvas.getContext()).toEqual(doc.context2d);
	});
	
	it('toDataURL', () => {
		var doc = new jsPDF();
		expect(function () {doc.canvas.toDataURL()}).toThrow(new Error('toDataURL is not implemented.'));
	});
	
	it('getContext contextAttributes', () => {
		var doc = new jsPDF();
		doc.canvas.getContext('2d', {pageWrapYEnabled: true});
		expect(doc.context2d.pageWrapYEnabled).toEqual(true);
		doc.canvas.height = 300;
		expect(doc.context2d.pageWrapY).toEqual(301);
		doc.canvas.getContext('2d', {pageWrapYEnabled: false});
		expect(doc.context2d.pageWrapYEnabled).toEqual(false);
		
		var doc = new jsPDF();
		doc.canvas.getContext('2d', {pageWrapXEnabled: true});
		expect(doc.context2d.pageWrapXEnabled).toEqual(true);
		doc.canvas.width = 150;
		expect(doc.context2d.pageWrapX).toEqual(151);
		doc.canvas.getContext('2d', {pageWrapXEnabled: false});
		expect(doc.context2d.pageWrapXEnabled).toEqual(false);
		doc.canvas.getContext('2d', {abcdefgh: true});
		expect(doc.context2d.hasOwnProperty('abcdefgh')).toEqual(false);
	});
	
	it('childNodes', () => {
		var doc = new jsPDF();
		doc.canvas.childNodes = ["a", "ba"];
		expect(doc.canvas.childNodes).toEqual(["a", "ba"]);
		doc.canvas.childNodes = [];
	});
});