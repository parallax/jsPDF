$(document).ready(function(){

var datestringregex = /\/CreationDate \(D:\d+\)/
, replacementdatestring = '/CreationDate (D:0)'
, removeMinorDiffs = function(t){
	return t.replace(datestringregex, replacementdatestring).trim()
}

asyncTest("001_blankpdf", function() {
	//QUnit.stop()
	require(['text!001_blankpdf.txt'])
	.then(function(thetext){
		var doc = new jsPDF()
		, t1 = removeMinorDiffs( doc.output() ) 
		, t2 = removeMinorDiffs( thetext )
				
		QUnit.expect(1)
		QUnit.equal(
			t1,t2
		)
		QUnit.start()
		//stop()
	})
})

}) // end of document.ready(