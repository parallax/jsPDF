/**
 * jsPDF [NAME] PlugIn
 * Copyright (c) 2014 [YOUR NAME HERE] [WAY TO CONTACT YOU HERE]
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

(function (jsPDFAPI) {
	'use strict';
	
	/**
	* @name loadImageFile
	* @function
	* @param {string} path
	* @param {boolean} sync
	* @param {function} callback
	*/
	jsPDFAPI.loadFile = function (path, sync, callback) {
		sync = sync || true;
		callback = callback || function () {};
		var isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
		
		var xhrMethod = function (url, sync, callback) {
			var req = new XMLHttpRequest();
			var byteArray = [];
			var i = 0;
			
			var sanitizeUnicode = function (data) {
				var dataLength = data.length;
				var StringFromCharCode = String.fromCharCode;
				
				//Transform Unicode to ASCII
				for (i = 0; i < dataLength; i += 1) {
					byteArray.push(StringFromCharCode(data.charCodeAt(i) & 0xff))
				}
				return byteArray.join("");
			}
			
			req.open('GET', url, !sync)
			// XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
			req.overrideMimeType('text\/plain; charset=x-user-defined');
			
			if (sync === false) {
				req.onload = function () {
					return sanitizeUnicode(this.responseText);
				};
			}
			req.send(null)
			
			if (req.status !== 200) {
				console.warn('Unable to load file "' + url + '"');
				return;
			}
			
			if (sync) {
				return sanitizeUnicode(req.responseText);
			}
		};
	};
	
	jsPDFAPI.loadImageFile = jsPDFAPI.loadFile;
})(jsPDF.API);
