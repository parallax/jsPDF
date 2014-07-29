(function(jsPDFAPI) {

var 	rObj = {}
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
	,fontSize = 10
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
	,pageStart = 0;

jsPDFAPI.insertHeader = function(data) {
	rObj = {}, hObj = {};
	rObj = data[0];
	for (var key in rObj) {
		hObj[key] = key;
	}
	data.splice(0, 0, hObj);
};

jsPDFAPI.initPDF = function(data) {
	dim = [50, 50, 500, 250];
	columnCount = this.calColumnCount(data);
	rowCount = data.length;
	width = dim[2] / columnCount;
	height = dim[2] / rowCount;
	dim[3] = this.calrdim(data, dim);
}

jsPDFAPI.drawTable = function(table_DATA, start) {
	fdata = [], sdata = [];
	SplitIndex = [], cSplitIndex = [], indexHelper = 0;
	heights = [];
	this.setFont("times", "normal");
	fontSize = 10;
	this.setFontSize(fontSize);
	pageStart = start;
	this.initPDF(table_DATA);
	dim[1] = start;
	if ((dim[3] + start) > (this.internal.pageSize.height)) {
		jg = 0;
		cSplitIndex = SplitIndex;
		cSplitIndex.push(table_DATA.length);
		for (var ig = 0; ig < cSplitIndex.length; ig++) {
			tabledata = [];
			tabledata = table_DATA.slice(jg, cSplitIndex[ig]);
			this.insertHeader(tabledata);
			if (ig === 0) {
				dim[1] = start;
			}
			this.pdf(tabledata, dim, true, false);
			pageStart = 80;
			this.initPDF(tabledata);
			jg = cSplitIndex[ig];
			if ((ig + 1) != cSplitIndex.length) {
				this.addPage();
			}
		}
	} else {
		this.pdf(table_DATA, dim, true, false);
	}
	return nextStart;
};

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

jsPDFAPI.insertData = function(iR, jC, rdim, data, brControl) {
	xOffset = 10;
	yOffset = 10;
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
					iTexts = (cell.length * (fontSize)) / (width * 2);
					iTexts = Math.ceil(iTexts);
					start = 0;
					end = 0;
					ih = 0;
					if ((brControl) && (i === 0)) {
						this.setFont("times", "bold");
					}
					for ( j = 0; j < iTexts; j++) {
						end += Math.ceil((width / (Math.ceil((fontSize) - fontSize * 0.4))));
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

jsPDFAPI.calColumnCount = function(data) {
	var obj = data[0];
	var i = 0;
	for (var key in obj) {
		if (key.charAt(0) !== '$') {++i;
		}
	}
	return i;
};

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
		if (indexHelper > (this.internal.pageSize.height - pageStart - 20)) {
			SplitIndex.push(i);
			indexHelper = 0;
			pageStart = 80;
		}
	}
	return value;
};

jsPDFAPI.drawRows = function(i, rdim, hrControl) {
	x = rdim[0];
	y = rdim[1];
	w = rdim[2];
	h = rdim[3] / i;
	for (var j = 0; j < i; j++) {
		if (j === 0 && hrControl) {
			this.setFillColor(182, 192, 192);
			this.rect(x, y, w, heights[j], 'F');
		} else {
			this.setDrawColor(0, 0, 0);
			this.rect(x, y, w, heights[j]);
		}
		y += heights[j];
	}
};

}(jsPDF.API));

