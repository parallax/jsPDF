// Type definitions for jsPDF 1.5.2
// Project: https://github.com/MrRio/jsPDF
// Definitions by: Amber Schühmacher <https://github.com/amberjs>
//                 Kevin Gonnord <https://github.com/lleios>
//                 Jackie Weng <https://github.com/jemerald>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'jspdf' {
    class jsPDF {
        constructor(options?:any);
        constructor(orientation?:'p'|'portrait'|'l'|'landscape',
                    unit?:string,
                    format?:string,
                    compressPdf?:number);

        CapJoinStyles:any;
        version:string;

        addFont(postScriptName:string, id:string, fontStyle:string, encoding:string):string;
        addGState(key: any, gState: any): jsPDF;
        addPage(format?: string | number[], orientation?: 'p'|'portrait'|'l'|'landscape'): jsPDF;
		beginFormObject(x:number, y:number, width:number, height:number, matrix:any): jsPDF;
        circle(x:number, y:number, r:number, style:string):jsPDF;
        clip(rule?:string):jsPDF;
        deletePage(targetPage:number):jsPDF;
		doFormObject(key:any, matrix:any):jsPDF;
        ellipse(x:number, y:number, rx:number, ry:number, style?:string):jsPDF;
		endFormObject(key:any):jsPDF;
		getCharSpace():number;
		getCreationDate(type:string):date;
		getFileId():string;
		getFillColor():string;
		getFontList():any[];
		getFontSize():number;
		getFormObject(key):any;
		getLineHeightFactor():number;
		getR2L():boolean;
		getTextColor():string;
		insertPage(beforePage:number):jsPDF;
        line(x1:number, y1:number, x2:number, y2:number):any;
        lines(lines:any[], x:any, y:any, scale?:any, style?:string, closed?:boolean):jsPDF;
        movePage(targetPage:number, beforePage:number):jsPDF;
        output(type?:string, options?:any):any;
		path(lines?:any[], style?:string, patternKey?string, patternData:any):jsPDF;
        rect(x:number, y:number, w:number, h:number, style?:string):jsPDF;
		restoreGraphicsState():jsPDF;
        roundedRect(x:number, y:number, w:number, h:number, rx:number, ry:number, style:string):jsPDF;
        save(filename?:string, options:any):jsPDF;
		saveGraphicsState():jsPDF;
		setCharSpace(charSpace:number):jsPDF;
		setCreationDate(date?:any):jsPDF;
		setCurrentTransformationMatrix(matrix:any):jsPDF;
		setDisplayMode(zoom:number|string, layout:'continuous'|'single'|'twoleft'|'tworight', pmode:'UseOutlines'|'UseThumbs'|'FullScreen');
		setDocumentProperties(properties:any):jsPDF;
		setProperties(properties:any):jsPDF;
        setDrawColor(ch1:string):jsPDF;
        setDrawColor(ch1:number, ch2:number, ch3:number, ch4?:number):jsPDF;
		setFileId(value:string):jsPDF;
        setFillColor(ch1:string):jsPDF;
        setFillColor(ch1:number, ch2:number, ch3:number, ch4?:number):jsPDF;
        setFont(fontName:string, fontStyle:string):jsPDF;
        setFontSize(size:number):jsPDF;
		setGState(gState:any):jsPDF;
        setLineCap(style:string|number):jsPDF;
		setLineDashPattern(dashArray:number[], dashPhase:number):jsPDF;
		setLineHeightFactor(value:number):jsPDF;
        setLineJoin(style:string|number):jsPDF;
		setLineMiterLimit(length:number):jsPDF;
        setLineWidth(width:number):jsPDF;
        setPage(pageNumber:number):jsPDF;
		setR2L(value:boolean):jsPDF;
        setTextColor(ch1:string):jsPDF;
        setTextColor(ch1:number, ch2:number, ch3:number, ch4?:number):jsPDF;
        text(text:string|string[], x:number, y:number, options?:any, transform:number|any):jsPDF;
        triangle(x1:number, y1:number, x2:number, y2:number, x3:number, y3:number, style:string):jsPDF;
		
        internal: {
            'pdfEscape'(text:string, flags:any): any;
            'getStyle'(style:string) : any;
            'getFont'(): any;
            'getFontSize'():number;
            'getLineHeight'():number;
            'write'(string1:string):any;
            'getCoordinateString'(value:number):number;
            'getVerticalCoordinateString'(value:number):number;
            'collections':any;
            'newObject'():number;
            'newAdditionalObject'():any;
            'newObjectDeferred'():number;
            'newObjectDeferredBegin'(oid:number):void;
            'putStream'(str:string):void;
            'events':any;
            'scaleFactor':number;
            'pageSize': {
                width:number;
                getWidth: () => number;
                height:number;
                getHeight: () => number;
            };
            'output'(type:any, options:any):any;
            'getNumberOfPages'():number;
            'pages':number[];
            'out'(string:string):void;
            'f2'(number:number):number;
            'getPageInfo'(pageNumberOneBased:number):any;
            'getCurrentPageInfo'():any;
        };

        /**
         * jsPDF plugins below:
         *
		 *  - AcroForm
         *  - AddHTML
         *  - AddImage
         *  - Annotations
         *  - AutoPrint
         *  - Canvas
         *  - Cell
         *  - Context2D
         *  - FromHTML
         *  - JavaScript
         *  - split_text_to_size
         *  - SVG
         *  - total_pages
		 *  - utf8
         *  - vfs
         */

        // jsPDF plugin: addHTML
        addHTML(element:any, x:number, y:number, options:any, callback:Function):jsPDF;
        addHTML(element:any, callback:Function):jsPDF;

        // jsPDF plugin: addImage
        color_spaces:any;
        decode:any;
        image_compression:any;

        sHashCode(str:string):any;
        extractInfoFromBase64DataURI(dataURI:string):any[];
        supportsArrayBuffer():boolean;
        isArrayBuffer(object:any):boolean;
        isArrayBufferView(object:any):boolean;
        binaryStringToUint8Array(binary_string:string):Uint8Array;
        arrayBufferToBinaryString(buffer:any):string;
        arrayBufferToBase64(arrayBuffer:ArrayBuffer):string;
        createImageInfo(data:any, wd:any, ht:any, cs:any, bpc:any, imageIndex:number, alias:any, f?:any, dp?:any, trns?:any, pal?:any, smask?:any):any;
        addImage(imageData:any, format:any, x:number, y:number, w:number, h:number, alias?:any, compression?:any, rotation?:any):jsPDF;

        // jsPDF plugin: Annotations
        annotationPlugin:any;
        createAnnotation(options:any):void;
        link(x:number, y:number, w:number, h:number, options:any):void;
        textWithLink(text:string, x:number, y:number, options:any):number;
        getTextWidth(text:string):number;
        getLineHeight():number;

        // jsPDF plugin: AutoPrint
        autoPrint(options?:any):jsPDF;

        // jsPDF plugin: AcroForm
		AcroForm : {
			ChoiceField : any,
			ListBox : any,
			ComboBox : any,
			EditBox : any,
			Button : any,
			PushButton : any,
			RadioButton : any,
			CheckBox : any,
			TextField : any,
			PasswordField : any,
			Appearance: any
		};

        // jsPDF plugin: Canvas
        canvas: {
            getContext():any;
            style:any;
        };

        // jsPDF plugin: Cell
        setHeaderFunction(func:Function):void;
        getTextDimensions(txt:string):any;
        cellAddPage():void;
        cellInitialize():void;
        cell(x:number, y:number, w:number, h:number, txt:string, ln:number, align:string):jsPDF;
        arrayMax(array:any[], comparisonFn?:Function):number;
        table(x:number, y:number, data:any, headers:string[], config:any):jsPDF;
        calculateLineHeight(headerNames:string[], columnWidths:number[], model:any[]):number;
        setTableHeaderRow(config:any[]):void;
        printHeaderRow(lineNumber:number, new_page?:boolean):void;

        // jsPDF plugin: Context2D
        context2d: {
			autoPaging: boolean;
			ctx: any;
			ctxStack: any[];
            fillStyle: string;
			font: string;
            lastBreak: number;
            lineCap: string;
			lineJoin: string;
			lineWidth: number;
			miterLimit: number;
			pageBreaks: number[];
            pageWrapXEnabled: boolean;
            pageWrapYEnabled: boolean;
			path: any[];
			posX: number;
			posY: number;
			strokeStyle: string;
			textAlign: string;
			textBaseline: string;
            arc(x:number, y:number, radius:number, startAngle:number, endAngle:number, counterclockwise:boolean):void;
            arcTo(x1:number, y1:number, x2:number, y2:number, radius:number):void;
            beginPath():void;
			bezierCurveTo(cp1x:number, cp1y:number, cp2x:number, cp2y:number, x:number, y:number):void;
            clearRect(x:number, y:number, w:number, h:number):void;
			clip(): void;
            closePath():void;
            drawImage(img:string, x:number, y:number, width:number, height:number):void;
            drawImage(img:string, sx:number, sy:number, swidth:number, sheight:number, x:number, y:number, width:number, height:number):void;
            fill():void;
            fillRect(x:number, y:number, w:number, h:number):void;
            fillText(text:string, x:number, y:number, maxWidth:number):void;
            lineTo(x:number, y:number):void;
            measureText(text:string):number;
            moveTo(x:number, y:number):void;
            quadraticCurveTo(cpx:number, cpy:number, x:number, y:number):void;
            rect(x:number, y:number, w:number, h:number):void;
            restore():void;
			rotate(angle:number):void;
            save():void;
			scale(scalewidth:number, scaleheight:number):void;
			setTransform(a:number, b:number, c:number, d:number, e:number, f:number):void;
            stroke():void;
            strokeRect(x:number, y:number, w:number, h:number):void;
            strokeText(text:string, x:number, y:number, maxWidth:number):void;
			transform(a:number, b:number, c:number, d:number, e:number, f:number):void;
            translate(x:number, y:number):void;
        };

        // jsPDF plugin: fromHTML
        fromHTML(HTML:string | HTMLElement, x:number, y:number, settings?:any, callback?:Function, margins?:any):jsPDF;

        // jsPDF plugin: JavaScript
        addJS(txt:string):jsPDF;

        // jsPDF plugin: split_text_to_size
        getCharWidthsArray(text:string, options?:any):any[];
        getStringUnitWidth(text:string, options?:any):number;
        splitTextToSize(text:string, maxlen:number, options?:any):any;

        // jsPDF plugin: SVG
        addSVG(svgtext:string, x:number, y:number, w?:number, h?:number):jsPDF;

        // jsPDF plugin: setlanguage
        setLanguage(langCode:string):jsPDF;

        // jsPDF plugin: total_pages
        putTotalPages(pageExpression:string):jsPDF;

		// jsPDF plugin: utf8
		pdfEscape16(text:string, font:string);
		
		// jsPDF plugin: viewerpreferences
		viewerPreferences(options:any, doReset?:boolean):jsPDF
		
        // jsPDF plugin: vfs
        existsFileInVFS(filename:string):boolean;
        addFileToVFS(filename:string, filecontent:string):jsPDF;
        getFileFromVFS(filename:string):string;
    }

    namespace jsPDF {}

    export = jsPDF;
}
