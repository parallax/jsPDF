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

	jsPDFAPI.initOutlinePlugin = function() {

		this.outline = {};
		this.outline.root = {
			children : []
		};

		this.internal.events.subscribe('postPutResources', function() {
			if (this.outline.root.children.length > 0) {
				var lines = this.outline.render().split(/\r\n/);
				for (var int = 0; int < lines.length; int++) {
					var line = lines[int];
					if (line.endsWith('obj')){
						var oid = line.split(' ')[0];
						this.internal.newObjectDeferredBegin(oid);
					}
					this.internal.write(line);
				}
			}
		});

		this.internal.events.subscribe('putCatalog', function() {
			if (this.outline.root.children.length > 0) {
				this.internal.write("/Outlines", this.outline.makeRef(this.outline.root));
			}
		});

		/**
		 * Options: pageNumber
		 */
		this.outline.add = function(parent,title,options) {
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

		this.outline.render = function() {
			this.outline.ctx = {};
			this.outline.nextId = 1000;
			this.outline.ctx.val = '';
			this.outline.ctx.pdf = this;

			this.outline.genIds_r(this.outline.root);
			this.outline.renderRoot(this.outline.root);
			this.outline.renderItems(this.outline.root);

			return this.outline.ctx.val;
		}.bind(this);

		this.outline.genIds_r = function(node) {
			node.id = this.internal.newObjectDeferred();
			for (var i = 0; i < node.children.length; i++) {
				this.outline.genIds_r(node.children[i]);
			}
		}.bind(this);

		this.outline.renderRoot = function(node) {
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
		}

		this.outline.renderItems = function(node) {
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
						//this.line('/Dest ' + '[' + (item.options.pageNumber - 1) + ' /Fit]');
					}
				}
				this.objEnd();
			}
			for (var i = 0; i < node.children.length; i++) {
				var item = node.children[i];
				this.renderItems(item);
			}
		}

		this.outline.line = function(text) {
			this.ctx.val += text + '\r\n';
		}

		this.outline.makeRef = function(node) {
			return node.id + ' 0 R';
		}

		this.outline.makeString = function(val) {
			return '(' + this.internal.pdfEscape(val) + ')';
		}.bind(this);

		this.outline.objStart = function(node) {
			this.ctx.val += '\r\n' + node.id + ' 0 obj' + '\r\n<<\r\n';
		}

		this.outline.objEnd = function(node) {
			this.ctx.val += '>> \r\n' + 'endobj' + '\r\n';
		}

		this.outline.count_r = function(ctx,node) {
			for (var i = 0; i < node.children.length; i++) {
				ctx.count++;
				this.count_r(ctx, node.children[i]);
			}
			return ctx.count;
		}
	}

	return this;
})(jsPDF.API);
