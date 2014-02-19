/** ==================================================================== 
 * jsPDF [NAME] plugin
 * Copyright (c) 2013 [YOUR NAME HERE] [WAY TO CONTACT YOU HERE]
 * 
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
'use strict'
	
	/*
	 * @see http://www.w3.org/TR/PNG-Chunks.html
	 * 
	 Color    Allowed      Interpretation
	 Type     Bit Depths
	   
	   0       1,2,4,8,16  Each pixel is a grayscale sample.
	   
	   2       8,16        Each pixel is an R,G,B triple.
	   
	   3       1,2,4,8     Each pixel is a palette index;
	                       a PLTE chunk must appear.
	   
	   4       8,16        Each pixel is a grayscale sample,
	                       followed by an alpha sample.
	   
	   6       8,16        Each pixel is an R,G,B triple,
	                       followed by an alpha sample.
	*/
	
	/*
	 * PNG filter method types
	 * 
	 * @see http://www.w3.org/TR/PNG-Filters.html
	 * @see http://www.libpng.org/pub/png/book/chapter09.html
	 * 
	 * This is what the value 'Predictor' in decode params relates to
	 * 
	 * 15 is "optimal prediction", which means the prediction algorithm can change from line to line. In that case, you actually have to read the first byte off each line for the prediction algorthim (which should be 0-4, corresponding to PDF 10-14) and select the appropriate unprediction algorithm based on that byte
	 *
	   0       None
	   1       Sub
	   2       Up
	   3       Average
	   4       Paeth
	 */
	
	var doesNotHavePngJS = function() {
		return typeof PNG !== 'function' || typeof FlateStream !== 'function';
	}
	, hasCompressionJS = function() {
		var inst = typeof zpipe === 'object';
		if(!inst)
			console.log("requires zpipe.js for compression")
		return inst;
	}
	, compressBytes = function(bytes, width, colors) {
		
		bytes = applyPngFilterMethod(bytes, width, colors);
		
		return zpipe.deflate(this.arrayBufferToBinaryString(bytes));
	}
	, applyPngFilterMethod = function(bytes, width, colors){
		
		/*
		 * TODO - this is only filter method 0 - None
		 * 
		 * implement all 5
		 */
		var lines = bytes.length / (width * colors),
			arr = new Uint8Array(bytes.length + lines),
			i = 0, offset;
		
		for(; i < lines; i++) {
			offset = i * width * colors;
			arr[offset + i] = 0;
			arr.set(bytes.subarray(offset, (offset + width ) * colors), offset + i + 1);
		}
		
		return arr;
	}
	, logImg = function(img) {
		console.log("width: " + img.width);
		console.log("height: " + img.height);
		console.log("bits: " + img.bits);
		console.log("colorType: " + img.colorType);
		console.log("transparency:");
		console.log(img.transparency);
		console.log("text:");
		console.log(img.text);
		console.log("compressionMethod: " + img.compressionMethod);
		console.log("filterMethod: " + img.filterMethod);
		console.log("interlaceMethod: " + img.interlaceMethod);
		console.log("imgData:");
		console.log(img.imgData);
		console.log("palette:");
		console.log(img.palette);
		console.log("colors: " + img.colors);
		console.log("colorSpace: " + img.colorSpace);
		console.log("pixelBitlength: " + img.pixelBitlength);
		console.log("hasAlphaChannel: " + img.hasAlphaChannel);
	};
	
	
	
	
	jsPDFAPI.processPNG = function(imageData, imageIndex, alias, compress, dataAsBinaryString) {
		'use strict'
		
		var colorSpace = this.DEVICE_RGB,
			compression = this.FLATE_DECODE,
			bpc = 8,
			img, dp, trns,
			colors, pal, smask;
		
		if(this.isString(imageData)) {
			
		}
		
		if(this.isArrayBuffer(imageData))
			imageData = new Uint8Array(imageData);
		
		if(this.isArrayBufferView(imageData)) {
			
			if(doesNotHavePngJS())
				throw new Error("PNG support requires png.js and zlib.js");
				
			img = new PNG(imageData);
			imageData = img.imgData;
			bpc = img.bits;
			colorSpace = img.colorType != 3 ? img.colorSpace : this.INDEXED;
			colors = img.colors;
			
			//logImg(img);
			
			/*
			 * we need to extract alpha layer and add it as a smask
			 */
			if(img.colorType === 6 &&
			   img.pixelBitlength === 32) {
				
				var pixels = new Uint32Array(img.decodePixels().buffer),
					len = pixels.length,
					colorData = new Uint8Array(len * 3),
					transData = new Uint8Array(len),
					pixel,
					i = 0,
					n = 0;
				
				for(; i < len; i++) {
					pixel = pixels[i];
					
					colorData[n++] = ( pixel >> 0 ) & 0xff;
					colorData[n++] = ( pixel >> 8 ) & 0xff;
					colorData[n++] = ( pixel >> 16 ) & 0xff;
					
					transData[i] = ( pixel >> 24 ) & 0xff;
				}
				
				if(compress && hasCompressionJS()) {
										
					imageData = compressBytes.call(this, colorData, img.width, img.colors);
					//smask = compressBytes.call(this, transData);
					smask = this.arrayBufferToBinaryString(transData);
					compression = this.FLATE_DECODE;
					
				}else{
					
					imageData = colorData;
					smask = this.arrayBufferToBinaryString(transData);
					compression = null;
				}
			}
			
			if(compression === this.FLATE_DECODE)
				dp = '/Predictor 15 /Colors '+ colors +' /BitsPerComponent '+ bpc +' /Columns '+ img.width;
			else
				//remove 'Predictor' as it applies to the type of png filter applied to its IDAT - we only apply with compression
				dp = '/Colors '+ colors +' /BitsPerComponent '+ bpc +' /Columns '+ img.width;
			
			if(img.palette && img.palette.length > 0)
				pal = img.palette;
			
			//I'm not sure the output from png.js is correct for this
			/*if(img.transparency.indexed)
				trns = img.transparency.indexed;*/
			
			if(this.isArrayBuffer(imageData) || this.isArrayBufferView(imageData))
				imageData = this.arrayBufferToBinaryString(imageData);
			
			return this.createImageInfo(imageData, img.width, img.height, colorSpace,
										bpc, compression, imageIndex, alias, dp, trns, pal, smask);
		}
		
		return info;
	}

})(jsPDF.API)
