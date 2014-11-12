/**
 * jsPDF Outline PlugIn
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * Generates a PDF Outline
 */
;
(function(jsPDFAPI) {
	'use strict';
	var outline = {
			
		onInitialize : function(pdf) {
			
			this.installOutlinePlugin(pdf);
			
			pdf.internal.events.subscribe('postPutResources', function() {
				
				var rx = /^(\d+) 0 obj$/;
				
				if (this.outline.root.children.length > 0) {
					var lines = pdf.outline.render().split(/\r\n/);
					for (var i = 0; i < lines.length; i++) {
						var line = lines[i];
						var m = rx.exec(line);
						if (m != null) {
							var oid = m[1];
							pdf.internal.newObjectDeferredBegin(oid);
						}
						pdf.internal.write(line);
					}
				}
			});
			
			pdf.internal.events.subscribe('putCatalog', function() {
				if (pdf.outline.root.children.length > 0) {
					pdf.internal.write("/Outlines", this.outline.makeRef(this.outline.root));
				}
			});
		},
		
		installOutlinePlugin : function(pdf) {

			pdf.outline = {};
			pdf.outline.root = {
				children : []
			};

			/**
			 * Options: pageNumber
			 */
			pdf.outline.add = function(parent,title,options) {
				var item = {
					title : title,
					options : options,
					children : []
				};
				if (parent == null) {
					parent = this.root;
				}
				parent.children.push(item);
				return item;
			}

			pdf.outline.render = function() {
				this.ctx = {};
				this.ctx.val = '';
				this.ctx.pdf = pdf;

				this.genIds_r(this.root);
				this.renderRoot(this.root);
				this.renderItems(this.root);

				return this.ctx.val;
			};

			pdf.outline.genIds_r = function(node) {
				node.id = pdf.internal.newObjectDeferred();
				for (var i = 0; i < node.children.length; i++) {
					this.genIds_r(node.children[i]);
				}
			};

			pdf.outline.renderRoot = function(node) {
				this.objStart(node);
				this.line('/Type /Outlines');
				if (node.children.length > 0) {
					this.line('/First ' + this.makeRef(node.children[0]));
					this.line('/Last ' + this.makeRef(node.children[node.children.length - 1]));
				}
				this.line('/Count ' + this.count_r({
					count : 0
				}, node));
				this.objEnd();
			};

			pdf.outline.renderItems = function(node) {
				for (var i = 0; i < node.children.length; i++) {
					var item = node.children[i];
					this.objStart(item);

					this.line('/Title ' + this.makeString(item.title));

					this.line('/Parent ' + this.makeRef(node));
					if (i > 0) {
						this.line('/Prev ' + this.makeRef(node.children[i - 1]));
					}
					if (i < node.children.length - 1) {
						this.line('/Next ' + this.makeRef(node.children[i + 1]));
					}
					if (item.children.length > 0) {
						this.line('/First ' + this.makeRef(item.children[0]));
						this.line('/Last ' + this.makeRef(item.children[item.children.length - 1]));
					}

					var count = this.count = this.count_r({
						count : 0
					}, item);
					if (count > 0) {
						this.line('/Count ' + count);
					}

					if (item.options) {
						if (item.options.pageNumber) {
							this.line('/Dest ' + '[' + (item.options.pageNumber - 1) + ' /XYZ 0 ' + this.ctx.pdf.internal.pageSize.height + ' 0]');
							// this.line('/Dest ' + '[' +
							// (item.options.pageNumber -
							// 1) + ' /Fit]');
						}
					}
					this.objEnd();
				}
				for (var i = 0; i < node.children.length; i++) {
					var item = node.children[i];
					this.renderItems(item);
				}
			};

			pdf.outline.line = function(text) {
				this.ctx.val += text + '\r\n';
			};

			pdf.outline.makeRef = function(node) {
				return node.id + ' 0 R';
			};

			pdf.outline.makeString = function(val) {
				return '(' + pdf.internal.pdfEscape(val) + ')';
			};

			pdf.outline.objStart = function(node) {
				this.ctx.val += '\r\n' + node.id + ' 0 obj' + '\r\n<<\r\n';
			};

			pdf.outline.objEnd = function(node) {
				this.ctx.val += '>> \r\n' + 'endobj' + '\r\n';
			};

			pdf.outline.count_r = function(ctx,node) {
				for (var i = 0; i < node.children.length; i++) {
					ctx.count++;
					this.count_r(ctx, node.children[i]);
				}
				return ctx.count;
			};
		}
	}
	jsPDF.API.outline = outline;
	jsPDF.plugins.register(outline);

	return this;
})(jsPDF.API);
