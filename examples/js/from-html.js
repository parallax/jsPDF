var pdf = new jsPDF('p','in','letter')

// source can be HTML-formatted string, or a reference
// to an actual DOM element from which the text will be scraped.
, source = $('#fromHTMLtestdiv')[0]

// we support special element handlers. Register them with jQuery-style 
// ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
// There is no support for any other type of selectors 
// (class, of compound) at this time.
, specialElementHandlers = {
	// element with id of "bypass" - jQuery style selector
	'#bypassme': function(element, renderer){
		// true = "handled elsewhere, bypass text extraction"
		return true
	}
};

// all coords and widths are in jsPDF instance's declared units
// 'inches' in this case
pdf.fromHTML(
	source // HTML string or DOM elem ref.
	, 0.5 // x coord
	, 0.5 // y coord
	, {
		'width':7.5 // max width of content on PDF
		, 'elementHandlers': specialElementHandlers
	}
);