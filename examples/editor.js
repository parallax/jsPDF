
var jsPDFEditor = function() {
		
	return {
		init: function() {


			var editor = ace.edit("editor");

			editor.setTheme("ace/theme/monokai");
			editor.getSession().setMode("ace/mode/javascript");		

			console.log('hello');
			var doc = new jsPDF();
			doc.text(10, 10, 'Hello world.');
			var string = pdf.output('datauristring');

			$('iframe').attr('src', string);

		},
		update: function() {


		}
	};

}();

$(document).ready(function() {
	jsPDFEditor.init();
});
