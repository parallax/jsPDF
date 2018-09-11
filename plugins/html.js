/**
 * Copyright (c) 2018 Erik Koopmans
 * Released under the MIT License.
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * jsPDF html PlugIn
 *
 * @name html
 * @module
 */
(function (jsPDFAPI, global) {
	'use strict';
	
	/**
	* Determine the type of a variable/object.
	* 
	* @private
	* @ignore
	*/
	var objType = function(obj) {
	  var type = typeof obj;
	  if (type === 'undefined')                                 return 'undefined';
	  else if (type === 'string' || obj instanceof String)      return 'string';
	  else if (type === 'number' || obj instanceof Number)      return 'number';
	  else if (type === 'function' || obj instanceof Function)  return 'function';
	  else if (!!obj && obj.constructor === Array)              return 'array';
	  else if (obj && obj.nodeType === 1)                       return 'element';
	  else if (type === 'object')                               return 'object';
	  else                                                      return 'unknown';
	};
	
	/**
	* Create an HTML element with optional className, innerHTML, and style.
	* 
	* @private
	* @ignore
	*/
	var createElement = function(tagName, opt) {
	  var el = document.createElement(tagName);
	  if (opt.className)  el.className = opt.className;
	  if (opt.innerHTML) {
		el.innerHTML = opt.innerHTML;
		var scripts = el.getElementsByTagName('script');
		for (var i = scripts.length; i-- > 0; null) {
		  scripts[i].parentNode.removeChild(scripts[i]);
		}
	  }
	  for (var key in opt.style) {
		el.style[key] = opt.style[key];
	  }
	  return el;
	};

	/**
	* Deep-clone a node and preserve contents/properties.
	* 
	* @private
	* @ignore
	*/
	var cloneNode = function(node, javascriptEnabled) {
	  // Recursively clone the node.
	  var clone = node.nodeType === 3 ? document.createTextNode(node.nodeValue) : node.cloneNode(false);
	  for (var child = node.firstChild; child; child = child.nextSibling) {
		if (javascriptEnabled === true || child.nodeType !== 1 || child.nodeName !== 'SCRIPT') {
		  clone.appendChild(cloneNode(child, javascriptEnabled));
		}
	  }

	  if (node.nodeType === 1) {
		// Preserve contents/properties of special nodes.
		if (node.nodeName === 'CANVAS') {
		  clone.width = node.width;
		  clone.height = node.height;
		  clone.getContext('2d').drawImage(node, 0, 0);
		} else if (node.nodeName === 'TEXTAREA' || node.nodeName === 'SELECT') {
		  clone.value = node.value;
		}

		// Preserve the node's scroll position when it loads.
		clone.addEventListener('load', function() {
		  clone.scrollTop = node.scrollTop;
		  clone.scrollLeft = node.scrollLeft;
		}, true);
	  }

	  // Return the cloned node.
	  return clone;
	}
	
	/**
	* Convert units using the conversion value 'k' from jsPDF.
	*
	* @private
	* @ignore
	*/
	var unitConvert = function(obj, k) {
	  var newObj = {};
	  for (var key in obj) {
		newObj[key] = obj[key] * 72 / 96 / k;
	  }
	  return newObj;
	};
		
		
		
	/* ----- CONSTRUCTOR ----- */

	var Worker = function Worker(opt) {
	  // Create the root parent for the proto chain, and the starting Worker.
	  var root = Object.assign(Worker.convert(Promise.resolve()),
							   JSON.parse(JSON.stringify(Worker.template)));
	  var self = Worker.convert(Promise.resolve(), root);

	  // Set progress, optional settings, and return.
	  self = self.setProgress(1, Worker, 1, [Worker]);
	  self = self.set(opt);
	  return self;
	};

	// Boilerplate for subclassing Promise.
	Worker.prototype = Object.create(Promise.prototype);
	Worker.prototype.constructor = Worker;

	// Converts/casts promises into Workers.
	Worker.convert = function convert(promise, inherit) {
	  // Uses prototypal inheritance to receive changes made to ancestors' properties.
	  promise.__proto__ = inherit || Worker.prototype;
	  return promise;
	};

	Worker.template = {
	  prop: {
		src: null,
		container: null,
		overlay: null,
		canvas: null,
		img: null,
		pdf: null,
		pageSize: null,
		callback: function () {}
	  },
	  progress: {
		val: 0,
		state: null,
		n: 0,
		stack: []
	  },
	  opt: {
		filename: 'file.pdf',
		margin: [0,0,0,0],
		enableLinks: true,
		html2canvas: {},
		jsPDF: {}
	  }
	};

	/* ----- FROM / TO ----- */

	Worker.prototype.from = function from(src, type) {
	  function getType(src) {
		switch (objType(src)) {
		  case 'string':  return 'string';
		  case 'element': return src.nodeName.toLowerCase === 'canvas' ? 'canvas' : 'element';
		  default:        return 'unknown';
		}
	  }

	  return this.then(function from_main() {
		type = type || getType(src);
		switch (type) {
		  case 'string':  return this.set({ src: createElement('div', {innerHTML: src}) });
		  case 'element': return this.set({ src: src });
		  case 'canvas':  return this.set({ canvas: src });
		  case 'img':     return this.set({ img: src });
		  default:        return this.error('Unknown source type.');
		}
	  });
	};

	Worker.prototype.to = function to(target) {
	  // Route the 'to' request to the appropriate method.
	  switch (target) {
		case 'container':
		  return this.toContainer();
		case 'canvas':
		  return this.toCanvas();
		case 'img':
		  return this.toImg();
		case 'pdf':
		  return this.toPdf();
		default:
		  return this.error('Invalid target.');
	  }
	};
	
          Worker.prototype.toContainer = function toContainer() {
        // Set up function prerequisites.
        var prereqs = [function checkSrc() {
          return this.prop.src || this.error('Cannot duplicate - no source HTML.');
        }, function checkPageSize() {
          return this.prop.pageSize || this.setPageSize();
        }];
        return this.thenList(prereqs).then(function toContainer_main() {
          // Define the CSS styles for the container and its overlay parent.
          var overlayCSS = {
            position: 'fixed',
            overflow: 'hidden',
            zIndex: 1000,
            left: '-100000px',
            right: 0,
            bottom: 0,
            top: 0
          };
          var containerCSS = {
            position: 'relative',
            display: 'inline-block',
            width: Math.max(this.prop.src.clientWidth, this.prop.src.scrollWidth, this.prop.src.offsetWidth)+ 'px',	
            left: 0,
            right: 0,
            top: 0,
            margin: 'auto',
            backgroundColor: 'white'
          }; // Set the overlay to hidden (could be changed in the future to provide a print preview).

          var source = cloneNode(this.prop.src, this.opt.html2canvas.javascriptEnabled);

          if (source.tagName === 'BODY') {
            containerCSS.height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) + 'px';
          }

          this.prop.overlay = createElement('div', {
            className: 'html2pdf__overlay',
            style: overlayCSS
          });
          this.prop.container = createElement('div', {
            className: 'html2pdf__container',
            style: containerCSS
          });
          this.prop.container.appendChild(source);
          this.prop.container.firstChild.appendChild(createElement('div', {
            style: {
              clear: 'both',
                  border: '0 none transparent',
                  margin: 0,
                  padding: 0,
                  height: 0
            }
          }));
          this.prop.container.style.float = 'none';
          this.prop.overlay.appendChild(this.prop.container);
          document.body.appendChild(this.prop.overlay);
          this.prop.container.firstChild.style.position = 'relative';
              this.prop.container.height = Math.max(this.prop.container.firstChild.clientHeight, this.prop.container.firstChild.scrollHeight, this.prop.container.firstChild.offsetHeight) + 'px';
        });
    };

	Worker.prototype.toCanvas = function toCanvas() {
	  // Set up function prerequisites.
	  var prereqs = [
		function checkContainer() { return document.body.contains(this.prop.container)
								   || this.toContainer(); }
	  ];

	  // Fulfill prereqs then create the canvas.
	  return this.thenList(prereqs).then(function toCanvas_main() {
		// Handle old-fashioned 'onrendered' argument.
		var options = Object.assign({}, this.opt.html2canvas);
		delete options.onrendered;

		  if (!this.isHtml2CanvasLoaded()) {
			  return;
		  }		
		return html2canvas(this.prop.container, options);
	  }).then(function toCanvas_post(canvas) {
		// Handle old-fashioned 'onrendered' argument.
		var onRendered = this.opt.html2canvas.onrendered || function () {};
		onRendered(canvas);

		this.prop.canvas = canvas;
		document.body.removeChild(this.prop.overlay);
	  });
	};
	
	Worker.prototype.toContext2d = function toContext2d() {
	  // Set up function prerequisites.
	  var prereqs = [
		function checkContainer() { return document.body.contains(this.prop.container)
								   || this.toContainer(); }
	  ];

	  // Fulfill prereqs then create the canvas.
	  return this.thenList(prereqs).then(function toContext2d_main() {
		// Handle old-fashioned 'onrendered' argument.
		
		var pdf = this.opt.jsPDF;
		var options = Object.assign({
          async: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          imageTimeout: 15000,
          logging: true,
          proxy: null,
          removeContainer: true,
          foreignObjectRendering: false,
          useCORS: false
        }, this.opt.html2canvas);
		delete options.onrendered;

		
		options.windowHeight = options.windowHeight || 0;
		options.windowHeight = (options.windowHeight == 0) ? Math.max(this.prop.container.clientHeight, this.prop.container.scrollHeight, this.prop.container.offsetHeight) : options.windowHeight;
		
		if (!this.isHtml2CanvasLoaded()) {
		  return;
		}
		
		return html2canvas(this.prop.container, options);
	  }).then(function toContext2d_post(canvas) {
		// Handle old-fashioned 'onrendered' argument.
		var onRendered = this.opt.html2canvas.onrendered || function () {};
		onRendered(canvas);

		this.prop.canvas = canvas;
		document.body.removeChild(this.prop.overlay);
	  });
	};

	Worker.prototype.toImg = function toImg() {
	  // Set up function prerequisites.
	  var prereqs = [
		function checkCanvas() { return this.prop.canvas || this.toCanvas(); }
	  ];

	  // Fulfill prereqs then create the image.
	  return this.thenList(prereqs).then(function toImg_main() {
		var imgData = this.prop.canvas.toDataURL('image/' + this.opt.image.type, this.opt.image.quality);
		this.prop.img = document.createElement('img');
		this.prop.img.src = imgData;
	  });
	};

	Worker.prototype.toPdf = function toPdf() {
	  // Set up function prerequisites.
	  var prereqs = [
		function checkContext2d() { return this.toContext2d(); }
		//function checkCanvas() { return this.prop.canvas || this.toCanvas(); }
	  ];

	  // Fulfill prereqs then create the image.
	  return this.thenList(prereqs).then(function toPdf_main() {
		// Create local copies of frequently used properties.
		this.prop.pdf = this.prop.pdf || this.opt.jsPDF;
	  });
	};


	/* ----- OUTPUT / SAVE ----- */

	Worker.prototype.output = function output(type, options, src) {
	  // Redirect requests to the correct function (outputPdf / outputImg).
	  src = src || 'pdf';
	  if (src.toLowerCase() === 'img' || src.toLowerCase() === 'image') {
		return this.outputImg(type, options);
	  } else {
		return this.outputPdf(type, options);
	  }
	};

	Worker.prototype.outputPdf = function outputPdf(type, options) {
	  // Set up function prerequisites.
	  var prereqs = [
		function checkPdf() { return this.prop.pdf || this.toPdf(); }
	  ];

	  // Fulfill prereqs then perform the appropriate output.
	  return this.thenList(prereqs).then(function outputPdf_main() {
		/* Currently implemented output types:
		 *    https://rawgit.com/MrRio/jsPDF/master/docs/jspdf.js.html#line992
		 *  save(options), arraybuffer, blob, bloburi/bloburl,
		 *  datauristring/dataurlstring, dataurlnewwindow, datauri/dataurl
		 */
		return this.prop.pdf.output(type, options);
	  });
	};

	Worker.prototype.outputImg = function outputImg(type, options) {
	  // Set up function prerequisites.
	  var prereqs = [
		function checkImg() { return this.prop.img || this.toImg(); }
	  ];

	  // Fulfill prereqs then perform the appropriate output.
	  return this.thenList(prereqs).then(function outputImg_main() {
		switch (type) {
		  case undefined:
		  case 'img':
			return this.prop.img;
		  case 'datauristring':
		  case 'dataurlstring':
			return this.prop.img.src;
		  case 'datauri':
		  case 'dataurl':
			return document.location.href = this.prop.img.src;
		  default:
			throw 'Image output type "' + type + '" is not supported.';
		}
	  });
	};
	
	Worker.prototype.isHtml2CanvasLoaded = function () {
		var result = typeof global.html2canvas !== "undefined";
		if (!result) {
			console.error("html2canvas not loaded.");
		}
		return result;
	}

	Worker.prototype.save = function save(filename) {
	  // Set up function prerequisites.
	  var prereqs = [
		function checkPdf() { return this.prop.pdf || this.toPdf(); }
	  ];
	  
	  if (!this.isHtml2CanvasLoaded()) {
		  return;
	  }

	  // Fulfill prereqs, update the filename (if provided), and save the PDF.
	  return this.thenList(prereqs).set(
		filename ? { filename: filename } : null
	  ).then(function save_main() {
		this.prop.pdf.save(this.opt.filename);
	  });
	};

	Worker.prototype.doCallback = function doCallback(filename) {
	  // Set up function prerequisites.
	  var prereqs = [
		function checkPdf() { return this.prop.pdf || this.toPdf(); }
	  ];

	  if (!this.isHtml2CanvasLoaded()) {
		  return;
	  }
	  // Fulfill prereqs, update the filename (if provided), and save the PDF.
	  return this.thenList(prereqs)
	  .then(function doCallback_main() {
		this.prop.callback(this.prop.pdf);
	  });
	};

	/* ----- SET / GET ----- */

	Worker.prototype.set = function set(opt) {
	  // TODO: Implement ordered pairs?

	  // Silently ignore invalid or empty input.
	  if (objType(opt) !== 'object') {
		return this;
	  }

	  // Build an array of setter functions to queue.
	  var fns = Object.keys(opt || {}).map(function (key) {
		  if (key in Worker.template.prop) {
			// Set pre-defined properties.
			return function set_prop() { this.prop[key] = opt[key]; }
		  } else {
			switch (key) {
			  case 'margin':
				return this.setMargin.bind(this, opt.margin);
			  case 'jsPDF':
				return function set_jsPDF() { this.opt.jsPDF = opt.jsPDF; return this.setPageSize(); }
			  case 'pageSize':
				return this.setPageSize.bind(this, opt.pageSize);
			  default:
				// Set any other properties in opt.
				return function set_opt() { this.opt[key] = opt[key] };
			}
		  }
	  }, this);

	  // Set properties within the promise chain.
	  return this.then(function set_main() {
		return this.thenList(fns);
	  });
	};

	Worker.prototype.get = function get(key, cbk) {
	  return this.then(function get_main() {
		// Fetch the requested property, either as a predefined prop or in opt.
		var val = (key in Worker.template.prop) ? this.prop[key] : this.opt[key];
		return cbk ? cbk(val) : val;
	  });
	};

	Worker.prototype.setMargin = function setMargin(margin) {
	  return this.then(function setMargin_main() {
		// Parse the margin property.
		switch (objType(margin)) {
		  case 'number':
			margin = [margin, margin, margin, margin];
		  case 'array':
			if (margin.length === 2) {
			  margin = [margin[0], margin[1], margin[0], margin[1]];
			}
			if (margin.length === 4) {
			  break;
			}
		  default:
			return this.error('Invalid margin array.');
		}

		// Set the margin property, then update pageSize.
		this.opt.margin = margin;
	  }).then(this.setPageSize);
	}

	Worker.prototype.setPageSize = function setPageSize(pageSize) {
	  function toPx(val, k) {
		return Math.floor(val * k / 72 * 96);
	  }

	  return this.then(function setPageSize_main() {
		// Retrieve page-size based on jsPDF settings, if not explicitly provided.
		pageSize = pageSize || jsPDF.getPageSize(this.opt.jsPDF);

		// Add 'inner' field if not present.
		if (!pageSize.hasOwnProperty('inner')) {
		  pageSize.inner = {
			width:  pageSize.width - this.opt.margin[1] - this.opt.margin[3],
			height: pageSize.height - this.opt.margin[0] - this.opt.margin[2]
		  };
		  pageSize.inner.px = {
			width:  toPx(pageSize.inner.width, pageSize.k),
			height: toPx(pageSize.inner.height, pageSize.k)
		  };
		  pageSize.inner.ratio = pageSize.inner.height / pageSize.inner.width;
		}

		// Attach pageSize to this.
		this.prop.pageSize = pageSize;
	  });
	}

	Worker.prototype.setProgress = function setProgress(val, state, n, stack) {
	  // Immediately update all progress values.
	  if (val != null)    this.progress.val = val;
	  if (state != null)  this.progress.state = state;
	  if (n != null)      this.progress.n = n;
	  if (stack != null)  this.progress.stack = stack;
	  this.progress.ratio = this.progress.val / this.progress.state;

	  // Return this for command chaining.
	  return this;
	};

	Worker.prototype.updateProgress = function updateProgress(val, state, n, stack) {
	  // Immediately update all progress values, using setProgress.
	  return this.setProgress(
		val ? this.progress.val + val : null,
		state ? state : null,
		n ? this.progress.n + n : null,
		stack ? this.progress.stack.concat(stack) : null
	  );
	};

	/* ----- PROMISE MAPPING ----- */

	Worker.prototype.then = function then(onFulfilled, onRejected) {
	  // Wrap `this` for encapsulation.
	  var self = this;

	  return this.thenCore(onFulfilled, onRejected, function then_main(onFulfilled, onRejected) {
		// Update progress while queuing, calling, and resolving `then`.
		self.updateProgress(null, null, 1, [onFulfilled]);
		return Promise.prototype.then.call(this, function then_pre(val) {
		  self.updateProgress(null, onFulfilled);
		  return val;
		}).then(onFulfilled, onRejected).then(function then_post(val) {
		  self.updateProgress(1);
		  return val;
		});
	  });
	};

	Worker.prototype.thenCore = function thenCore(onFulfilled, onRejected, thenBase) {
	  // Handle optional thenBase parameter.
	  thenBase = thenBase || Promise.prototype.then;

	  // Wrap `this` for encapsulation and bind it to the promise handlers.
	  var self = this;
	  if (onFulfilled)  { onFulfilled = onFulfilled.bind(self); }
	  if (onRejected)   { onRejected = onRejected.bind(self); }

	  // Cast self into a Promise to avoid polyfills recursively defining `then`.
	  var isNative = Promise.toString().indexOf('[native code]') !== -1 && Promise.name === 'Promise';
	  var selfPromise = isNative ? self : Worker.convert(Object.assign({}, self), Promise.prototype);

	  // Return the promise, after casting it into a Worker and preserving props.
	  var returnVal = thenBase.call(selfPromise, onFulfilled, onRejected);
	  return Worker.convert(returnVal, self.__proto__);
	};

	Worker.prototype.thenExternal = function thenExternal(onFulfilled, onRejected) {
	  // Call `then` and return a standard promise (exits the Worker chain).
	  return Promise.prototype.then.call(this, onFulfilled, onRejected);
	};

	Worker.prototype.thenList = function thenList(fns) {
	  // Queue a series of promise 'factories' into the promise chain.
	  var self = this;
	  fns.forEach(function thenList_forEach(fn) {
		self = self.thenCore(fn);
	  });
	  return self;
	};

	Worker.prototype['catch'] = function (onRejected) {
	  // Bind `this` to the promise handler, call `catch`, and return a Worker.
	  if (onRejected)   { onRejected = onRejected.bind(this); }
	  var returnVal = Promise.prototype['catch'].call(this, onRejected);
	  return Worker.convert(returnVal, this);
	};

	Worker.prototype.catchExternal = function catchExternal(onRejected) {
	  // Call `catch` and return a standard promise (exits the Worker chain).
	  return Promise.prototype['catch'].call(this, onRejected);
	};

	Worker.prototype.error = function error(msg) {
	  // Throw the error in the Promise chain.
	  return this.then(function error_main() {
		throw new Error(msg);
	  });
	};


	/* ----- ALIASES ----- */

	Worker.prototype.using = Worker.prototype.set;
	Worker.prototype.saveAs = Worker.prototype.save;
	Worker.prototype.export = Worker.prototype.output;
	Worker.prototype.run = Worker.prototype.then;
	
	// Get dimensions of a PDF page, as determined by jsPDF.
	jsPDF.getPageSize = function(orientation, unit, format) {
	  // Decode options object
	  if (typeof orientation === 'object') {
		var options = orientation;
		orientation = options.orientation;
		unit = options.unit || unit;
		format = options.format || format;
	  }

	  // Default options
	  unit        = unit || 'mm';
	  format      = format || 'a4';
	  orientation = ('' + (orientation || 'P')).toLowerCase();
	  var format_as_string = ('' + format).toLowerCase();

	  // Size in pt of various paper formats
	  var pageFormats = {
		'a0'  : [2383.94, 3370.39], 'a1'  : [1683.78, 2383.94],
		'a2'  : [1190.55, 1683.78], 'a3'  : [ 841.89, 1190.55],
		'a4'  : [ 595.28,  841.89], 'a5'  : [ 419.53,  595.28],
		'a6'  : [ 297.64,  419.53], 'a7'  : [ 209.76,  297.64],
		'a8'  : [ 147.40,  209.76], 'a9'  : [ 104.88,  147.40],
		'a10' : [  73.70,  104.88], 'b0'  : [2834.65, 4008.19],
		'b1'  : [2004.09, 2834.65], 'b2'  : [1417.32, 2004.09],
		'b3'  : [1000.63, 1417.32], 'b4'  : [ 708.66, 1000.63],
		'b5'  : [ 498.90,  708.66], 'b6'  : [ 354.33,  498.90],
		'b7'  : [ 249.45,  354.33], 'b8'  : [ 175.75,  249.45],
		'b9'  : [ 124.72,  175.75], 'b10' : [  87.87,  124.72],
		'c0'  : [2599.37, 3676.54], 'c1'  : [1836.85, 2599.37],
		'c2'  : [1298.27, 1836.85], 'c3'  : [ 918.43, 1298.27],
		'c4'  : [ 649.13,  918.43], 'c5'  : [ 459.21,  649.13],
		'c6'  : [ 323.15,  459.21], 'c7'  : [ 229.61,  323.15],
		'c8'  : [ 161.57,  229.61], 'c9'  : [ 113.39,  161.57],
		'c10' : [  79.37,  113.39], 'dl'  : [ 311.81,  623.62],
		'letter'            : [612,   792],
		'government-letter' : [576,   756],
		'legal'             : [612,  1008],
		'junior-legal'      : [576,   360],
		'ledger'            : [1224,  792],
		'tabloid'           : [792,  1224],
		'credit-card'       : [153,   243]
	  };

	  // Unit conversion
	  switch (unit) {
		case 'pt':  var k = 1;          break;
		case 'mm':  var k = 72 / 25.4;  break;
		case 'cm':  var k = 72 / 2.54;  break;
		case 'in':  var k = 72;         break;
		case 'px':  var k = 72 / 96;    break;
		case 'pc':  var k = 12;         break;
		case 'em':  var k = 12;         break;
		case 'ex':  var k = 6;          break;
		default:
		  throw ('Invalid unit: ' + unit);
	  }

	  // Dimensions are stored as user units and converted to points on output
	  if (pageFormats.hasOwnProperty(format_as_string)) {
		var pageHeight = pageFormats[format_as_string][1] / k;
		var pageWidth = pageFormats[format_as_string][0] / k;
	  } else {
		try {
		  var pageHeight = format[1];
		  var pageWidth = format[0];
		} catch (err) {
		  throw new Error('Invalid format: ' + format);
		}
	  }

	  // Handle page orientation
	  if (orientation === 'p' || orientation === 'portrait') {
		orientation = 'p';
		if (pageWidth > pageHeight) {
		  var tmp = pageWidth;
		  pageWidth = pageHeight;
		  pageHeight = tmp;
		}
	  } else if (orientation === 'l' || orientation === 'landscape') {
		orientation = 'l';
		if (pageHeight > pageWidth) {
		  var tmp = pageWidth;
		  pageWidth = pageHeight;
		  pageHeight = tmp;
		}
	  } else {
		throw('Invalid orientation: ' + orientation);
	  }

	  // Return information (k is the unit conversion ratio from pts)
	  var info = { 'width': pageWidth, 'height': pageHeight, 'unit': unit, 'k': k };
	  return info;
	};

	/**
	 * Generate a PDF from an HTML element or string using.
	 *
	 * @name html
	 * @function
	 * @param {Element|string} source The source element or HTML string.
	 * @param {Object=} options An object of optional settings.
	 * @description The Plugin needs html2canvas from niklasvh
	 */
	jsPDFAPI.html = function (src, options) {
		'use strict';
		
        options = options || {};
		options.callback = options.callback || function () {};
		options.html2canvas = options.html2canvas || {};
		options.html2canvas.canvas = options.html2canvas.canvas || this.canvas;
		options.jsPDF = options.jsPDF || this;
		  // Create a new worker with the given options.
		  
		var pdf = options.jsPDF;
        pdf.annotations = {
          _nameMap: [],
          createAnnotation: function createAnnotation(href, bounds) {
            var x = pdf.context2d._wrapX(bounds.left);

            var y = pdf.context2d._wrapY(bounds.top);

            var page = pdf.context2d._page(bounds.top);

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
          setName: function setName(name, bounds) {
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

        pdf.context2d._pageBreakAt = function (y) {
          this.pageBreaks.push(y);
        };

        pdf.context2d._gotoPage = function (pageOneBased) {
          while (pdf.internal.getNumberOfPages() < pageOneBased) {
            pdf.addPage();
          }

          pdf.setPage(pageOneBased);
        };

        pdf.context2d.pageWrapYEnabled = true;
        pdf.context2d.pageWrapY = pdf.internal.pageSize.getHeight() / pdf.internal.scaleFactor + 1;
		
		pdf.canvas.autoContext2dResizeY = false;
		
		var worker = new Worker(options);

		if (!options.worker) {
		// If worker is not set to true, perform the traditional 'simple' operation.
			return worker.from(src).doCallback();
		} else {
		// Otherwise, return the worker for new Promise-based operation.
			return worker;
		}
        return this;
      };
})(jsPDF.API, (typeof window !== "undefined" && window || typeof global !== "undefined" && global));
