/**
 * jsPDF Annotations PlugIn
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * There are many types of annotations in a PDF document. Annotations are placed
 * on a page at a particular location. They are not 'attached' to an object'
 * <br />
 * This plugin current supports <br />
 * <li> Goto Page (set pageNumber in options)
 * <li> Goto URL (set url in options)
 * 
 * <p>
 * Options In PDF spec Not Implemented Yet
 * <li> link border
 * <li> named target
 * <li> page coordinates
 * <li> destination page scaling and layout
 * <li> actions other than URL and GotoPage
 * <li> background / hover actions
 * </p>
 */

(function(jsPDFAPI) {
	'use strict';

	jsPDFAPI.initAnnotationPlugin = function() {
		this.annotationPlugin = {};

		this.annotationPlugin.annotations = [];
		// TODO remove this after we find a way to subscribe before the
		// first page is created.
		this.annotationPlugin.annotations[1] = [];

		this.annotationPlugin.f2 = function(number) {
			return number.toFixed(2);
		};

		this.internal.events.subscribe('addPage', function(info) {
			this.annotationPlugin.annotations[info.pageNumber] = [];
		});

		this.internal.events.subscribe('render/page', function(info) {
			var pageAnnos = this.annotationPlugin.annotations[info.pageNumber];
			
			var found = false;
			for (var a = 0; a < pageAnnos.length; a++) {
				if (pageAnnos[a].type === 'link'){
					found = true;
					break;
				}
			}
			if (found == false){
				return;
			}

			this.internal.write("/Annots [");
			for (var a = 0; a < pageAnnos.length; a++) {
				var anno = pageAnnos[a];
				var k = this.internal.scaleFactor;
				var pageHeight = this.internal.pageSize.height;
				var rect = "/Rect [" + this.annotationPlugin.f2(anno.x * k) + " " + this.annotationPlugin.f2((pageHeight - anno.y) * k) + " " + this.annotationPlugin.f2(anno.x + anno.w * k) + " " + this.annotationPlugin.f2(pageHeight - (anno.y + anno.h) * k) + "] ";
				if (anno.options.url) {
					this.internal.write('<</Type /Annot /Subtype /Link ' + rect + '/Border [0 0 0] /A <</S /URI /URI (http://www.twelvetone.tv) >> >>')
				} else if (anno.options.pageNumber) {
					// first page is 0
					this.internal.write('<</Type /Annot /Subtype /Link ' + rect + '/Border [0 0 0] /Dest [' + (anno.options.pageNumber-1) + ' /XYZ 0 ' + pageHeight + ' 0] >>')
				} else {
					// TODO error - not supported or not indicated
				}
			}
			this.internal.write("]");
		});
	};

	/**
	 * An array of arrays, indexed by <em>pageNumber</em>.
	 */
	// this.internal.annotations = [];
	/**
	 * valid options
	 * <li> pageNumber or url [required]
	 */
	jsPDFAPI.link = function(x,y,w,h,options) {
		'use strict';
		this.annotationPlugin.annotations[this.internal.getNumberOfPages()].push({
			x : x,
			y : y,
			w : w,
			h : h,
			options : options,
			type : 'link'
		});
	};

	/**
	 * Currently only supports single line text.
	 */
	jsPDFAPI.textWithLink = function(text,x,y,options) {
		'use strict';
		var width = this.getTextWidth(text);
		var height = this.internal.getLineHeight();
		this.text(text, x, y);
		this.link(x, y - height, width, height, options);
		return this;
	};

	jsPDFAPI.getTextWidth = function(text) {
		'use strict';
		var fontSize = this.internal.getFontSize();
		var txtWidth = this.getStringUnitWidth(text) * fontSize / this.internal.scaleFactor;
		return txtWidth;
	};

	jsPDFAPI.getLineHeight = function() {
		return this.internal.getLineHeight();
	};

	return this;
})(jsPDF.API);
