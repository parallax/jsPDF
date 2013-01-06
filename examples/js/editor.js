/**
 * jsPDFEditor
 * @return {[type]} [description]
 */
var jsPDFEditor = function() {
	
	var editor;

	var demos = {
		'circles.js': 'Cicle',
		'font-faces.js': 'Font faces',
		'font-size.js': 'Font sizes',
		'from-html.js': 'From HTML Plugin',
		'images.js': 'Images',
		//'kitchen-sink.js': 'Kitchen Sink', // @TODO
		'landscape.js': 'Landscape',
		'lines.js': 'Lines',
		'rectangles.js': 'Rectangles',
		'string-splitting.js': 'String Splitting',
		'text-colors.js': 'Text colors',
		'triangles.js': 'Triangles',
		'two-page.js': 'Two page',
		'user-input.js': 'User input'
	};

	var aceEditor = function() {
		editor = ace.edit("editor");
		editor.setTheme("ace/theme/twilight");
		//editor.setTheme("ace/theme/ambiance");
		editor.getSession().setMode("ace/mode/javascript");
		
		var timeout = setTimeout(function(){ }, 0);

		editor.getSession().on('change', function() {
			if ($('#auto-refresh').is(':checked')) {
				clearTimeout(timeout);
				timeout = setTimeout(function() {
					jsPDFEditor.update();

				}, 200);
			}

		});
	}

	return {
		/**
		 * Start the editor demo
		 * @return {void}
		 */
		init: function() {

			// Init the ACE editor
			aceEditor();

			// Do the first update on init
			jsPDFEditor.update();

		},
		/**
		 * Updates the preview iframe
		 * @return {void}
		 */
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
