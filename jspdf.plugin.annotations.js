/**
 * jsPDF Annotations PlugIn
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * There are many types of annotations in a PDF document. Annotations are placed
 * on a page at a particular location. They are not 'attached' to an object.
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

function notEmpty(obj) {
	if (typeof obj != 'undefined') {
		if (obj != '') {
			return true;
		}
	}
}

(function(jsPDFAPI) {
	'use strict';

	var annotationPlugin = {

		/**
		 * An array of arrays, indexed by <em>pageNumber</em>.
		 */
		annotations : [],

		f2 : function(number) {
			return number.toFixed(2);
		}
	};

	jsPDF.API.annotationPlugin = annotationPlugin;

	jsPDF.API.events.push([
			'addPage', function(info) {
				this.annotationPlugin.annotations[info.pageNumber] = [];
			}
	]);

	jsPDFAPI.events.push([
			'putPage', function(info) {
				var pageAnnos = this.annotationPlugin.annotations[info.pageNumber];

				var found = false;
				for (var a = 0; a < pageAnnos.length; a++) {
					var anno = pageAnnos[a];
					if (anno.type === 'link') {
						if (notEmpty(anno.options.url) || notEmpty(anno.options.pageNumber)) {
							found = true;
							break;
						}
					}
				}
				if (found == false) {
					return;
				}

				this.internal.write("/Annots [");
				var f2 = this.annotationPlugin.f2;
				for (var a = 0; a < pageAnnos.length; a++) {
					var anno = pageAnnos[a];
					var k = this.internal.scaleFactor;
					var pageHeight = this.internal.pageSize.height;
					var rect = "/Rect [" + f2(anno.x * k) + " " + f2((pageHeight - anno.y) * k) + " " + f2(anno.x + anno.w * k) + " " + f2(pageHeight - (anno.y + anno.h) * k) + "] ";
					if (anno.options.url) {
						this.internal.write('<</Type /Annot /Subtype /Link ' + rect + '/Border [0 0 0] /A <</S /URI /URI (' + anno.options.url + ') >> >>')
					} else if (anno.options.pageNumber) {
						// first page is 0
						this.internal.write('<</Type /Annot /Subtype /Link ' + rect + '/Border [0 0 0] /Dest [' + (anno.options.pageNumber - 1) + ' /XYZ 0 ' + pageHeight + ' 0] >>')
					} else {
						// TODO error - should not be here
					}
				}
				this.internal.write("]");
			}
	]);

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
		//TODO We really need the text baseline height to do this correctly.
		// Or ability to draw text on top, bottom, center, or baseline.
		y += height * .2;
		this.link(x, y - height, width, height, options);
		return this;
	};

	//TODO move into external library
	jsPDFAPI.getTextWidth = function(text) {
		'use strict';
		var fontSize = this.internal.getFontSize();
		var txtWidth = this.getStringUnitWidth(text) * fontSize / this.internal.scaleFactor;
		return txtWidth;
	};

	//TODO move into external library
	jsPDFAPI.getLineHeight = function() {
		return this.internal.getLineHeight();
	};

	return this;

})(jsPDF.API);
