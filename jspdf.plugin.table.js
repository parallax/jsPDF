/** ====================================================================
* jsPDF table plugin
* Copyright (c) 2014 Nelli.Prashanth,https://github.com/Prashanth-Nelli
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* ====================================================================
*/

(function(jsPDFAPI) {

var  rObj = {}
	,hObj = {}
	,data = []
	,dim = []
	,columnCount
	,rowCount
	,width
	,heigth
	,fdata = []
	,sdata = []
	,SplitIndex = []
	,cSplitIndex = []
	,indexHelper = 0
	,heights = []
	,fontSize
	,jg
	,i
	,tabledata = []
	,x
	,y
	,xOffset
	,yOffset
	,iTexts
	,start
	,end
	,ih
	,length
	,lengths
	,row
	,obj
	,value
	,nlines
	,nextStart
	,propObj={}
	,pageStart = 0;

// Inserts Table Head row

jsPDFAPI.insertHeader = function(data) {
	rObj = {}, hObj = {};
	rObj = data[0];
	for (var key in rObj) {
		hObj[key] = key;
	}
	data.unshift(hObj);
};

// intialize the dimension array, column count and row count

jsPDFAPI.initPDF = function(data,marginConfig,firstpage) {
	if(firstpage){
		dim = [marginConfig.xstart,marginConfig.tablestart,this.internal.pageSize.width-marginConfig.xstart-20-marginConfig.marginleft, 250,marginConfig.ystart,marginConfig.marginleft];
	}else{
		dim = [marginConfig.xstart,marginConfig.ystart,this.internal.pageSize.width-marginConfig.xstart-20-marginConfig.marginleft, 250,marginConfig.ystart,marginConfig.marginleft];	
	}
	columnCount = this.calColumnCount(data);
	rowCount = data.length;
	width = dim[2] / columnCount;
	height = dim[2] / rowCount;
	dim[3] = this.calrdim(data, dim);
};

//draws table on the document 

jsPDFAPI.drawTable = function(table_DATA, marginConfig) {
	fdata = [], sdata = [];
	SplitIndex = [], cSplitIndex = [], indexHelper = 0;
	heights = [];
	//this.setFont("times", "normal");
	fontSize = this.internal.getFontSize();
	if(!marginConfig){
		maringConfig={
			xstart:20,
			ystart:20,
			tablestart:20,
			marginleft:20,
			xOffset:10,
			yOffset:10
		}
	}else{
		propObj={
			xstart:20,
			ystart:20,
			tablestart:20,
			marginleft:20,
			xOffset:10,
			yOffset:10
		}
		for(var key in propObj){
			if(!marginConfig[key])
			{
			  	marginConfig[key] = propObj[key];
			}
		}
	}
	pageStart = marginConfig.tablestart;
	xOffset=marginConfig.xOffset;
	yOffset=marginConfig.yOffset;
	this.initPDF(table_DATA,marginConfig,true);
	if ((dim[3] + marginConfig.tablestart) > (this.internal.pageSize.height)) {
		jg = 0;
		cSplitIndex = SplitIndex;
		cSplitIndex.push(table_DATA.length);
		for (var ig = 0; ig < cSplitIndex.length; ig++) {
			tabledata = [];
			tabledata = table_DATA.slice(jg, cSplitIndex[ig]);
			this.insertHeader(tabledata);
			this.pdf(tabledata, dim, true, false);
			pageStart = marginConfig.ystart;
			this.initPDF(tabledata,marginConfig,false);
			jg = cSplitIndex[ig];
			if ((ig + 1) != cSplitIndex.length) {
				this.addPage();
			}
		}
	} else {
		this.insertHeader(table_DATA)
		this.pdf(table_DATA, dim, true, false);
	}
	return nextStart;
};

//calls methods in a sequence manner required to draw table

jsPDFAPI.pdf = function(table, rdim, hControl, bControl) {
	columnCount = this.calColumnCount(table);
	rowCount = table.length;
	rdim[3] = this.calrdim(table, rdim);
	width = rdim[2] / columnCount;
	height = rdim[2] / rowCount;
	this.drawRows(rowCount, rdim, hControl);
	this.drawColumns(columnCount, rdim);
	nextStart = this.insertData(rowCount, columnCount, rdim, table, bControl);
	return nextStart;
};

//inserts text into the table 

jsPDFAPI.insertData = function(iR, jC, rdim, data, brControl) {
	// xOffset = 10;
	// yOffset = 10;
	y = rdim[1] + yOffset;
	for ( i = 0; i < iR; i++) {
		obj = data[i];
		x = rdim[0] + xOffset;
		for (var key in obj) {
			if (key.charAt(0) !== '$') {
				if (obj[key] !== null) {
					cell = obj[key].toString();
				} else {
					cell = '-'; 
				}
				cell = cell + '';
				if (((cell.length * fontSize) + xOffset) > (width)) {
					iTexts=cell.length*fontSize;
					start = 0;
					end = 0;
					ih = 0;
					if ((brControl) && (i === 0)) {
						this.setFont(this.getFont().fontName, "bold");
					}
					for ( j = 0; j < iTexts; j++) {
						end+=Math.ceil(2*width/fontSize);
						this.text(x, y + ih, cell.substring(start, end));
						start = end;
						ih += fontSize;
					}
				} else {
					if ((brControl) && (i === 0)) {
						this.setFont("times", "bold");
					}
					this.text(x, y, cell);
				}
				x += rdim[2] / jC;
			}
		}
		this.setFont("times", "normal");
		y += heights[i];
	}
	return y;
};

//calculates no.of based on the data array

jsPDFAPI.calColumnCount = function(data) {
	var obj = data[0];
	var i = 0;
	for (var key in obj) {
		if (key.charAt(0) !== '$') {++i;
		}
	}
	return i;
};

//draws columns based on the caluclated dimensions

jsPDFAPI.drawColumns = function(i, rdim) {
	x = rdim[0];
	y = rdim[1];
	w = rdim[2] / i;
	h = rdim[3];
	for (var j = 0; j < i; j++) {
		this.rect(x, y, w, h);
		x += w;
	}
};

//calculates dimensions based on the data array and returns y position for further editing of document 

jsPDFAPI.calrdim = function(data, rdim) {
	row = 0;
	x = rdim[0];
	y = rdim[1];
	lengths = [];
	for (var i = 0; i < data.length > 0; i++) {
		obj = data[i];
		length = 0;
		for (var key in obj) {
			if (obj[key] !== null) {
				if (length < obj[key].length) {
					lengths[row] = obj[key].length;
					length = lengths[row];
				}
			}
		}++row;
	}
	heights = [];
	for (var i = 0; i < lengths.length; i++) {
		if ((lengths[i] * (fontSize)) > height) {
			nlines = Math.ceil((lengths[i] * (fontSize)) / width);
			heights[i] = (nlines) * (fontSize / 2) + fontSize;
		} else {
			heights[i] = (fontSize + (fontSize / 2));
		}
	}
	value = 0;
	indexHelper = 0;
	SplitIndex = [];
	for (var i = 0; i < heights.length; i++) {
		value += heights[i];
		indexHelper += heights[i];
		if (indexHelper > (this.internal.pageSize.height - pageStart-30)) {
			SplitIndex.push(i);
			indexHelper = 0;
			pageStart = rdim[4]+30;
		}
	}
	return value;
};

//draw rows based on the length of data array

jsPDFAPI.drawRows = function(i, rdim, hrControl) {
	x = rdim[0];
	y = rdim[1];
	w = rdim[2];
	h = rdim[3] / i;
	for (var j = 0; j < i; j++) {
		if (j === 0 && hrControl) {
			this.setFillColor(182, 192, 192);//colour combination for table header
			this.rect(x, y, w, heights[j], 'F');
		} else {
			this.setDrawColor(0, 0, 0);//colour combination for table borders you
			this.rect(x, y, w, heights[j]);
		}
		y += heights[j];
	}
};

//converts table to json

jsPDFAPI.tableToJson=function(id){
	var table = document.getElementById(id)
		,keys=[]
		,rows=table.rows
		,noOfRows = rows.length
		,noOfCells = table.rows[0].cells.length
		,i=0
		,j=0
		,data =[]
		,obj={}
		;
	
	for(i=0;i<noOfCells;i++){
		keys.push(rows[0].cells[i].textContent);
	}
	
	for(j=0;j<noOfRows;j++){
		obj={};
		for(i=0;i<noOfCells;i++){
			try{
				obj[keys[i]]=rows[j].cells[i].textContent;
			}catch(ex){
				obj[keys[i]]='';
			}	
		}
		data.push(obj);
	}
	return data.splice(1);
};

}(jsPDF.API));

