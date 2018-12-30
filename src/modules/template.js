/**
 * @license
 * Copyright (c) 2018 Robert Wolke     r.wolke-jspdf@aestima.de
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * @typedef {Object} TemplateSize
 * @property {number} width width of template
 * @property {number} height height of template
 */
/**
 * jsPDF Template PlugIn
 *
 * @name template
 * @module
 */
(function(jsPDFAPI) {
	'use strict';
	
	var templatePrefix = 'TPL';
	//! need to link resource dictionary in XObject
	var resourceDictionaryObjId;
	
	function _getTemplates() {
		var tList = this.internal.collections['template_list'];
		var tStack =  this.internal.collections['template_stack'];
		//first run, so initialise stuff
		if(!tList) {
			this.internal.collections['template_list'] = tList = {};
			this.internal.collections['template_stack'] = tStack = [];
			this.internal.events.subscribe(
				'putXobjectDict', 
				function() {
					for(var name in tList) 
						/* istanbul ignore else - this is a simple sanity check that _putTemplate was successful */
						if(tList[name].objId)
							this.internal.write(tList[name].id, tList[name].objId, '0 R');
				},
				true
			);
			this.internal.events.subscribe(
				'putResources', 
				function() {
					for(var name in tList) 
						_putTemplate.call(this, tList[name]);
				},
				true
			);
			//! this is a very ugly hack !!!
			this.internal.events.subscribe(
				'putPage',
				function(opts) {
					resourceDictionaryObjId = opts.objId - 1
				},
				true
			)
			this.internal.events.subscribe(
				'addPage', 
				function() {
					if(tStack.length)
						throw new Error('jsPDF.template: addPage is not supported before endTemplate has been called!');
				}
			);
			this.internal.events.subscribe(
				'buildDocument', 
				function() {
					if(tStack.length)
						throw new Error('jsPDF.template: endTemplate has to be called before document can be saved!');
				},
				true
			);
		}
		return {
			list: tList,
			stack: tStack
		};
	}
	function _putTemplate(t) {
		t.objId =  this.internal.newObject();
		
		var keyValues = [];
		keyValues.push({ key: 'Type', value: '/XObject' });
		keyValues.push({ key: 'Subtype', value: '/Form' });
		keyValues.push({ key: 'FormType', value: '1' });
		keyValues.push({ key: 'Resources', value: resourceDictionaryObjId + ' 0 R' });
		keyValues.push({ key: 'Matrix', value: '[1 0 0 1 0 0]' });
		keyValues.push({
			key: 'BBox',
			value: '[' + [
				this.internal.f2(t.bbox.bottomLeftX),
				this.internal.f2(t.bbox.bottomLeftY),
				this.internal.f2(t.bbox.topRightX),
				this.internal.f2(t.bbox.topRightY)
			].join(' ') + ']'
		});
		
		this.internal.putStream({
			data: t.data.join('\n'),
			additionalKeyValues: keyValues
		});
		this.internal.out('endobj');
	}
	
	/**
	 * Begin a template context
	 *
	 * @name beginTemplate
	 * @function
	 * @public
	 * @param {string} name Name of the template context
	 * @param {number} [width=paperSize.Width] - width of template (in units declared at inception of PDF document
	 * @param {number} [height=pageSize.Height] - height of template (in units declared at inception of PDF document
	 */
	jsPDFAPI.beginTemplate = function(name, width, height) {
		var t = _getTemplates.call(this, true);
		var id = Object.keys(t.list).length + 1;
		if(!name)
			name = 'tmpl_' + id;
		if(t.list.hasOwnProperty(name) || t.list[name])
			throw new Error('jsPDF.beginTemplate: name is already used!');
		
		width = parseFloat(width) || this.internal.pageSize.getWidth(),
		height =  parseFloat(height) || this.internal.pageSize.getHeight(),
		
		t.list[name] = {
			id: '/' + templatePrefix + id,
			data: [],
			width: width,
			height: height,
			bbox: {
				bottomLeftX: 0,
				bottomLeftY: 0,
				topRightX: this.internal.getHorizontalCoordinate(width),
				topRightY: this.internal.getHorizontalCoordinate(height)
			},
			previousMediaBox: {},
			complete: false
		};
		
		/*
			* all uses of getVerticalCoordinate() use the page height:
			* to get positioning in template (with different height) working, 
			* it must be changed to template height.
			* But the state is saved and later restored...
			*/
		var pi = this.internal.getCurrentPageInfo();
		Object.assign(t.list[name].previousMediaBox, pi.pageContext.mediaBox);
		Object.assign(pi.pageContext.mediaBox, t.list[name].bbox);
		
		t.stack.unshift(t.list[name]);
		/*
			* out() calls have to be captured and redirected, otherwise
			* all of the template contents would be directly put on the page
			*/
		this.internal.setCustomOutputDestination(t.stack[0].data);
		return name;
	};
	
	/**
	 * End a template context
	 *
	 * @name endTemplate
	 * @function
	 * @public
	 */
	jsPDFAPI.endTemplate = function() {
		var t = _getTemplates.call(this);
		if(!t.stack.length)
			throw new Error('jsPDF.endTemplate: call jsPDF.beginTemplate first!');
		
		var o = t.stack.shift();
		o.complete = true;
		
		// restore page (or previous template) bounding box
		var pi = this.internal.getCurrentPageInfo();
		Object.assign(pi.pageContext.mediaBox, o.previousMediaBox);
		
		// restore output destination
		if(t.stack.length)
			this.internal.setCustomOutputDestination(t.stack[0].data);
		else
			this.internal.resetCustomOutputDestination();
	};
	
	/**
	 * Use a declared template
	 *
	 * @name useTemplate
	 * @function
	 * 
	 * @public
	 * @param {string} name Name of the template context
	 * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page.
	 * @param {number} y Coordinate (in units declared at inception of PDF document) against left edge of the page.
	 * @param {number} [scaleX=1] - scale x-axis by this factor
	 * @param {number} [scaleY=scaleX] - scale y-axis by this factor
	 * @return {TemplateSize} final size of template
	 * 
	 * @example <caption>Simple Template</caption>
	 * doc.beginTemplate('rect');
	 *   doc.setDrawColor(0);
	 *   doc.setFillColor(255,0,0);
	 *   doc.rect(0, 0, 10, 10, 'FD');
	 * doc.endTemplate();
	 * 
	 * // draws rect at (10/10)
	 * doc.useTemplate('rect', 10, 10);
	 * // draws rect at (30/10) but scaled by 2x (on each axis)
	 * doc.useTemplate('rect', 10, 40, 2);
	 * // draws rect at (30/10) but scaled by 2x on x-axis and 3x on y-axis
	 * doc.useTemplate('rect', 10, 70, 2, 3);
	 */
	jsPDFAPI.useTemplate = function(name, x, y, scaleX, scaleY) {
		var t = _getTemplates.call(this);
		if(!t.list.hasOwnProperty(name) || !t.list[name])
			throw new Error('jsPDF.useTemplate: template by the name of "' + name + '" not found!');
		if(!t.list[name].complete)
			throw new Error('jsPDF.useTemplate: you have to call endTemplate before you can use the template!');
		if(isNaN(x) || isNaN(y))
			throw new Error('jsPDF.useTemplate: Invalid coordinates passed');
		
		scaleX = scaleX ? parseFloat(scaleX) : 1;
		scaleY = scaleY ? parseFloat(scaleY) : scaleX;
		
		this.internal.write(
			"q " + this.roundToPrecision(scaleX, 4) + ' 0 0 ' + this.roundToPrecision(scaleY, 4),
			this.internal.getCoordinateString(x), 
			this.internal.getVerticalCoordinateString(y + parseFloat(t.list[name].height*scaleY)),
			'cm ' + t.list[name].id + ' Do Q'
		);
		return {
			width:  t.list[name].width  * scaleX,
			height: t.list[name].height * scaleY
		};
	};
})(jsPDF.API);