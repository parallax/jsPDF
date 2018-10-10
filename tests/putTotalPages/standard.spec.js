
/* global describe, it, jsPDF, comparePdf, expect */
/**
 * Standard spec tests
 */

describe('Plugin: putTotalPages', () => {
  it('standardfont', () => {
	const doc = new jsPDF();
	const totalPagesExp = '{totalPages}';
	  

	doc.text(10, 10, "Page 1 of {totalPages}");
	doc.addPage();

	doc.text(10, 10, "Page 2 of {totalPages}");

	doc.putTotalPages(totalPagesExp);
    comparePdf(doc.output(), 'standardfont.pdf', 'putTotalPages');
  });
})
