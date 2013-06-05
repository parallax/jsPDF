(function(jsPDFAPI) {
'use strict'

jsPDFAPI.autoPrint = function() {
  'use strict'
  // `this` is _jsPDF object returned when jsPDF is inited (new jsPDF())
  // `this.internal` is a collection of useful, specific-to-raw-PDF-stream functions.
  // for example, `this.internal.write` function allowing you to write directly to PDF stream.
  // `this.line`, `this.text` etc are available directly.
  // so if your plugin just wraps complex series of this.line or this.text or other public API calls,
  // you don't need to look into `this.internal`
  // See _jsPDF object in jspdf.js for complete list of what's available to you.
  var refAutoPrintTag;

  this.internal.events.subscribe('postPutResources', function(){
    refAutoPrintTag = this.internal.newObject()
    this.internal.write("<< /S/Named /Type/Action /N/Print >>", "endobj");
  })

  this.internal.events.subscribe("putCatalog", function(){
    this.internal.write("/OpenAction " + refAutoPrintTag + " 0" + " R");
  });

  // it is good practice to return ref to jsPDF instance to make
  // the calls chainable.
  return this;
}

})(jsPDF.API)
