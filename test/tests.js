$(document).ready(function(){

var datestringregex = /\/CreationDate \(D:\d+\)/
, replacementdatestring = '/CreationDate (D:0)'
, removeMinorDiffs = function(t){
	return t.replace(datestringregex, replacementdatestring).trim()
}
, testinventory = {
	"001_blankpdf.txt": function(){
		var doc = new jsPDF()
		return doc.output()
	}
	, "002_twopagedoc.txt":function(){
		var doc = new jsPDF();
		doc.text(20, 20, 'Hello world!');
		doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
		doc.addPage();
		doc.text(20, 20, 'Do you like that?');
		return doc.output()
	} 
}
, testrunner = function(reference_file_name, test_data_yielder){
	asyncTest(reference_file_name, function() {
		//QUnit.stop()
		require(['text!'+reference_file_name])
		.then(function(expectedtext){					
			QUnit.expect(1)
			QUnit.equal(
				removeMinorDiffs( expectedtext )
				, removeMinorDiffs( test_data_yielder() )
			)
			QUnit.start()
			//stop()
		})
	})
}

for (var filename in testinventory){
	if (testinventory.hasOwnProperty(filename)){
		testrunner(
			filename
			, testinventory[filename]
		)
	}
}

}) // end of document.ready(