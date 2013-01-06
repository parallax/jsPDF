/**
 * jsPDFEditor
 * @return {[type]} [description]
 */
var jsPDFEditor = function() {
	
	var editor;

	return {
		init: function() {

			var timeout = setTimeout(function(){ }, 0);

			editor = ace.edit("editor");

			editor.setTheme("ace/theme/monokai");
			editor.getSession().setMode("ace/mode/javascript");

			editor.getSession().on('change', function() {
				if ($('#auto-refresh').is(':checked')) {
					clearTimeout(timeout);
					timeout = setTimeout(function() {
						jsPDFEditor.update();

					}, 200);
				}

			});


		},
		update: function() {
			setTimeout(function() {
				eval(editor.getValue());
				var string = doc.output('datauristring');

				$('iframe').attr('src', string);
			}, 0);

		}
	};

}();

$(document).ready(function() {
	jsPDFEditor.init();
});
