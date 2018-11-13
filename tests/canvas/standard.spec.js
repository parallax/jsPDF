
describe('Context2D: standard tests', () => {
	it('width', () => {
		var doc = new jsPDF();
		doc.canvas.width = undefined;
		expect(doc.canvas.width).toEqual(0);
		doc.canvas.width = 1;
		expect(doc.canvas.width).toEqual(1);
		
	});
	it('height', () => {
		var doc = new jsPDF();
		
		doc.canvas.height = undefined;
		expect(doc.canvas.height).toEqual(0);
		doc.canvas.height = 1;
		expect(doc.canvas.height).toEqual(1);
		
	});
	
	it('getContext', () => {
		var doc = new jsPDF();
		expect(doc.canvas.getContext('fantasy')).toEqual(null);
		expect(doc.canvas.getContext('2d')).toEqual(doc.context2d);
		expect(doc.canvas.getContext()).toEqual(doc.context2d);
	});
});