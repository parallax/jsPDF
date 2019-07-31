/* global html2canvas, jsPDF */
/**
 * html2pdf.js
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */


(function (jsPDFAPI, globalObj) {

	globalObj.html2pdf = function (html, pdf, callback) {
		var canvas = pdf.canvas;
		if (!canvas) {
			alert('jsPDF canvas plugin not installed');
			return;
		}
		canvas.pdf = pdf;
		pdf.annotations = {

			_nameMap: [],

			createAnnotation: function (href, bounds) {
				var x = pdf.context2d._wrapX(bounds.left);
				var y = pdf.context2d._wrapY(bounds.top);
				var options;
				var index = href.indexOf('#');
				if (index >= 0) {
					options = {
						name: href.substring(index + 1)
					};
				} else {
					options = {
						url: href
					};
				}
				pdf.link(x, y, bounds.right - bounds.left, bounds.bottom - bounds.top, options);
			},

			setName: function (name, bounds) {
				var x = pdf.context2d._wrapX(bounds.left);
				var y = pdf.context2d._wrapY(bounds.top);
				var page = pdf.context2d._page(bounds.top);
				this._nameMap[name] = {
					page: page,
					x: x,
					y: y
				};
			}

		};
		canvas.annotations = pdf.annotations;

		pdf.context2d._pageBreakAt = function (y) {
			this.pageBreaks.push(y);
		};

		pdf.context2d._gotoPage = function (pageOneBased) {
			while (pdf.internal.getNumberOfPages() < pageOneBased) {
				pdf.addPage();
			}
			pdf.setPage(pageOneBased);
		};

		var htmlElement;
		var height;
		if (typeof html === 'string') {
			// remove all scripts
			html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
			var iframe = document.createElement('iframe'); //iframe.style.width = canvas.width;
			//iframe.src = "";
			//iframe.document.domain =

			document.body.appendChild(iframe);
			var doc;

			doc = iframe.contentDocument || iframe.contentWindow.document;

			doc.open();
			doc.write(html);
			doc.close();
			htmlElement = doc.body;
		} else {
			htmlElement = html;
		}
		height = pdf.internal.pageSize.getHeight();


		var options = {
			async: true,
			allowTaint: true,
			backgroundColor: '#ffffff',
			canvas: canvas,
			imageTimeout: 15000,
			logging: true,
			proxy: null,
			removeContainer: true,
			foreignObjectRendering: false,
			useCORS: false,

			windowHeight: height,
			scrollY: height,

		};
		pdf.context2d.pageWrapYEnabled = true;
		pdf.context2d.pageWrapY = pdf.internal.pageSize.getHeight();
		var promise = html2canvas(htmlElement, options).then(function () {
			if (callback) {
				if (iframe) {
					iframe.parentElement.removeChild(iframe);
				}

				callback(pdf);
			}
		});
		return promise;

	};

})(jsPDF.API, (typeof window !== "undefined" && window || typeof global !== "undefined" && global));

