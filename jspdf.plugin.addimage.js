/** @preserve 
 * jsPDF addImage plugin (JPEG only at this time)
 * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
 *               2013 Chris Dowling, https://github.com/gingerchris
 *               2013 Trinh Ho, https://github.com/ineedfat
 *               2013 Edwin Alejandro Perez, https://github.com/eaparango
 *               2013 Norah Smith, https://github.com/burnburnrocket
 *               2014 Diego Casorran, https://github.com/diegocr
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
 */

;(function(jsPDFAPI) {
'use strict'

var namespace = 'addImage_',
	supported_image_types = ['jpg', 'jpeg', 'png'],
	color_spaces = ['DeviceRGB', 'DeviceGray', 'DeviceCMYK', 'Indexed'],
	filter_methods = ['DCTDecode', 'FlateDecode', 'LZWDecode'];
	

// takes a string imgData containing the raw bytes of
// a jpeg image and returns [width, height]
// Algorithm from: http://www.64lines.com/jpeg-width-height
var getJpegSize = function(imgData) {
	'use strict'
	var width, height;
	// Verify we have a valid jpeg header 0xff,0xd8,0xff,0xe0,?,?,'J','F','I','F',0x00
	if (!imgData.charCodeAt(0) === 0xff ||
		!imgData.charCodeAt(1) === 0xd8 ||
		!imgData.charCodeAt(2) === 0xff ||
		!imgData.charCodeAt(3) === 0xe0 ||
		!imgData.charCodeAt(6) === 'J'.charCodeAt(0) ||
		!imgData.charCodeAt(7) === 'F'.charCodeAt(0) ||
		!imgData.charCodeAt(8) === 'I'.charCodeAt(0) ||
		!imgData.charCodeAt(9) === 'F'.charCodeAt(0) ||
		!imgData.charCodeAt(10) === 0x00) {
			throw new Error('getJpegSize requires a binary string jpeg file')
	}
	var blockLength = imgData.charCodeAt(4)*256 + imgData.charCodeAt(5);
	var i = 4, len = imgData.length;
	while ( i < len ) {
		i += blockLength;
		if (imgData.charCodeAt(i) !== 0xff) {
			throw new Error('getJpegSize could not find the size of the image');
		}
		if (imgData.charCodeAt(i+1) === 0xc0 || //(SOF) Huffman  - Baseline DCT
		    imgData.charCodeAt(i+1) === 0xc1 || //(SOF) Huffman  - Extended sequential DCT 
		    imgData.charCodeAt(i+1) === 0xc2 || // Progressive DCT (SOF2)
		    imgData.charCodeAt(i+1) === 0xc3 || // Spatial (sequential) lossless (SOF3)
		    imgData.charCodeAt(i+1) === 0xc4 || // Differential sequential DCT (SOF5)
		    imgData.charCodeAt(i+1) === 0xc5 || // Differential progressive DCT (SOF6)
		    imgData.charCodeAt(i+1) === 0xc6 || // Differential spatial (SOF7)
		    imgData.charCodeAt(i+1) === 0xc7) {
			height = imgData.charCodeAt(i+5)*256 + imgData.charCodeAt(i+6);
			width = imgData.charCodeAt(i+7)*256 + imgData.charCodeAt(i+8);
			return [width, height];
		} else {
			i += 2;
			blockLength = imgData.charCodeAt(i)*256 + imgData.charCodeAt(i+1)
		}
	}
}
// Image functionality ported from pdf.js
, putImage = function(img) {
	//console.log(img);
	var objectNumber = this.internal.newObject()
	, out = this.internal.write
	, putStream = this.internal.putStream

	img['n'] = objectNumber

	out('<</Type /XObject')
	out('/Subtype /Image')
	out('/Width ' + img['w'])
	out('/Height ' + img['h'])
	if (img['cs'] === 'Indexed') {
		out('/ColorSpace [/Indexed /DeviceRGB '
				+ (img['pal'].length / 3 - 1) + ' ' + (objectNumber + 1)
				+ ' 0 R]');
	} else {
		out('/ColorSpace /' + img['cs']);
		if (img['cs'] === 'DeviceCMYK') {
			out('/Decode [1 0 1 0 1 0 1 0]');
		}
	}
	out('/BitsPerComponent ' + img['bpc']);
	if ('f' in img) {
		out('/Filter /' + img['f']);
	}
	if ('dp' in img) {
		out('/DecodeParms <<' + img['dp'] + '>>');
	}
	if ('trns' in img && img['trns'].constructor == Array) {
		var trns = '';
		for ( var i = 0; i < img['trns'].length; i++) {
			trns += (img['trns'][i] + ' ' + img['trns'][i] + ' ');
			out('/Mask [' + trns + ']');
		}
	}
	if ('smask' in img) {
		out('/SMask ' + (objectNumber + 1) + ' 0 R');
	}
	out('/Length ' + img['data'].length + '>>');

	putStream(img['data']);

	out('endobj');
	
	// Soft mask
	if ('smask' in img) {
		var dp = '/Predictor 15 /Colors 1 /BitsPerComponent 8 /Columns ' + img['w'];
		var smask = {'w': img['w'], 'h': img['h'], 'cs': 'DeviceGray', 'bpc': 8, 'dp': dp, 'data': img['smask']};
		if ('f' in img) 
			smask.f = img['f'];
		putImage.call(this, smask);
	}
    
    //Palette
	if (img['cs'] === 'Indexed') {
		
		this.internal.newObject();
		//out('<< /Filter / ' + img['f'] +' /Length ' + img['pal'].length + '>>');
		//putStream(zlib.compress(img['pal']));
		out('<< /Length ' + img['pal'].length + '>>');
		putStream(img['pal']);
		out('endobj');
	}
}
, putResourcesCallback = function() {
	var images = this.internal.collections[namespace + 'images']
	for ( var i in images ) {
		putImage.call(this, images[i])
	}
}
, putXObjectsDictCallback = function(){
	var images = this.internal.collections[namespace + 'images']
	, out = this.internal.write
	, image
	for (var i in images) {
		image = images[i]
		out(
			'/I' + image['i']
			, image['n']
			, '0'
			, 'R'
		)
	}
}
, extractBase64Info = function(dataURL) {
	return /^(data:image\/([\w]+?);base64,)(.+?)$/g.exec(dataURL);
}
, supportsArrayBuffer = function() {
	return typeof ArrayBuffer == 'function';
}
, isArrayBuffer = function(object) {
	if(!supportsArrayBuffer())
        return false;
	return object instanceof ArrayBuffer;
}
, isArrayBufferView = function(object) {
	if(!supportsArrayBuffer())
        return false;
	return (object instanceof Int8Array ||
			object instanceof Uint8Array ||
			object instanceof Uint8ClampedArray ||
			object instanceof Int16Array ||
			object instanceof Uint16Array ||
			object instanceof Int32Array ||
			object instanceof Uint32Array ||
			object instanceof Float32Array ||
			object instanceof Float64Array );
}
, binaryStringToUint8Array = function(binary_string) {
	/*
	 * not sure how efficient this will be will bigger files. Is there a native method?
	 */
	var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}
, arrayBufferToBinaryString = function( array_buffer ) {
	/*
	 * @see this discussion
	 * http://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
	 * 
	 * As stated, i imagine the method below is highly inefficent for large files. Also of note from Mozilla,
	 * 
	 * "However, this is slow and error-prone, due to the need for multiple conversions (especially if the binary data is not actually byte-format data, but, for example, 32-bit integers or floats)."
	 * 
	 * https://developer.mozilla.org/en-US/Add-ons/Code_snippets/StringView
	 * 
	 * Although i'm strugglig to see how it solves this issue? Doesn't appear to be a direct method for conversion?
	 * 
	 * Async method using Blob and FileReader could be best, but i'm not sure how to fit it into this flow?
	 */
    /*var binary_string = '';
    //var bytes = new Uint8Array( array_buffer );
    var bytes = array_buffer;
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary_string += String.fromCharCode( bytes[ i ] );
    }
    return binary_string;*/
	
	if(isArrayBufferView())
		array_buffer = array_buffer.buffer;
	
	return window.atob(base64ArrayBuffer(array_buffer));
}
, createImageInfo = function(data, wd, ht, cs, bpc, f, imageIndex, alias, dp, trns, pal, smask) {
	var info = {
			alias:alias,
			w : wd,
			h : ht,
			cs : cs,
			bpc : bpc,
			i : imageIndex,
			data : data
			// n: objectNumber will be added by putImage code
		};
	
	if(f)
		info.f = f;
	
	if(dp)
		info.dp = dp;
	
	if(trns)
		info.trns = trns;
	
	if(pal)
		info.pal = pal;
	
	if(smask)
		info.smask = smask;
	
	return info;
};

jsPDFAPI.addImage = function(imageData, format, x, y, w, h, alias, transparency) {
	'use strict'
	var images = this.internal.collections[namespace + 'images'],
		cached_info,
		binaryStringData;
	
	transparency = transparency || false;

	if(typeof format === 'number') {
		var tmp = h;
		h = w;
		w = y;
		y = x;
		x = format;
		format = tmp || 'jpeg';
	}
	
	if(typeof alias === 'undefined') {
		// TODO: Alias dynamic generation from imageData's checksum/hash
	}

	if (typeof imageData === 'object' && imageData.nodeType === 1) {
        var canvas = document.createElement('canvas');
        canvas.width = imageData.clientWidth || imageData.width;
	    canvas.height = imageData.clientHeight || imageData.height;

        var ctx = canvas.getContext('2d');
        if (!ctx) {
            throw ('addImage requires canvas to be supported by browser.');
        }
        ctx.drawImage(imageData, 0, 0, canvas.width, canvas.height);
        imageData = canvas.toDataURL(transparency ? 'image/png' : 'image/jpeg');
	    format = "png";
	}
	
	if(typeof imageData === 'string') {
		if(imageData.charCodeAt(0) !== 0xff && imageData.substr(0,5) !== 'data:') {
			// This is neither raw jpeg-data nor a data uri; alias?
			if(images) {

				for(var e in images) {

					if(imageData === images[e].alias) {
						cached_info = images[e];
						break;
					}
				}
			}

		} else {
			
			var base64Info = extractBase64Info(imageData);
			
			if(base64Info) {
				
				format = base64Info[2];
				imageData = atob(base64Info[3]);//convert to binary string
				
				/*
				 * need to test if it's more efficent to convert all binary strings
				 * to TypedArray - or should we just leave and process as string?
				 */
				if(supportsArrayBuffer()) {
					binaryStringData = imageData;
					imageData = binaryStringToUint8Array(imageData);
				}
					
			}
		}
	}
	
	if( supported_image_types.indexOf(format.toLowerCase()) == -1 )
		throw new Error('addImage currently only supports formats ' + supported_image_types + ', not \''+format+'\'');

	var imageIndex
	, coord = this.internal.getCoordinateString
	, vcoord = this.internal.getVerticalCoordinateString;

	if (images){
		// this is NOT the first time this method is ran on this instance of jsPDF object.
		imageIndex = Object.keys ? 
		Object.keys(images).length :
		(function(o){
			var i = 0
			for (var e in o){if(o.hasOwnProperty(e)){ i++ }}
			return i
		})(images)
	} else {
		// this is the first time this method is ran on this instance of jsPDF object.
		imageIndex = 0
		this.internal.collections[namespace + 'images'] = images = {}
		this.internal.events.subscribe('putResources', putResourcesCallback)
		this.internal.events.subscribe('putXobjectDict', putXObjectsDictCallback)
	}

	var info = cached_info;
	
	if(!info) {
		
		var img,
			dims,
			dp,
			trns,
			colorSpace = color_spaces[0],
			filter = filter_methods[0],
			bpc = 8,
			colors,
			pal,
			smask;
		
		format = format.toLocaleLowerCase();
		
		/*
		 * we have a binary string
		 */
		if(typeof imageData === 'string') {
			
			if(['jpeg', 'jpg'].indexOf(format) !== -1) {
				
				dims = getJpegSize(imageData);
				info = createImageInfo(imageData, dims[0], dims[1], colorSpace, bpc, filter, imageIndex, alias);
			}
			
			if(format === 'png') {
				
			}
		}
		
		if(isArrayBuffer(imageData))
			imageData = new Uint8Array(imageData);
		
		if(isArrayBufferView(imageData)) {
			
			if(['jpeg', 'jpg'].indexOf(format) !== -1) {
				img = new JpegImage();
				img.parse(imageData);
				
				/*
				 * check if already have a stored binary string rep
				 */
				imageData = binaryStringData || arrayBufferToBinaryString(imageData);
				
				info = createImageInfo(imageData, img.width, img.height, colorSpace, bpc, filter, imageIndex, alias);
			}
			
			if(format === 'png') {
				
				img = new PNG(imageData);
				imageData = img.imgData;
				bpc = img.bits;
				colorSpace = img.colorSpace;
				colors = img.colors;
				filter = filter_methods[1];//FlateDecode as png pixels are compressed
				
				/*
				 * we need to extract alpha layer and add it as a smask
				 */
				if(img.colorType === 6 &&
				   img.pixelBitlength === 32) {
					
					var //pixels = new DataView(img.decode().buffer),
						pixels = new Uint32Array(img.decode().buffer),
						//len = pixels.byteLength / 4,
						len = pixels.length,
						colorData = new Uint8Array(len * 3),
						transData = new Uint8Array(len),
						pixel,
						i = 0,
						n = 0;
					
					for(; i < len; i++) {
						//pixel = pixels.getInt32(i);
						pixel = pixels[i];
						
						colorData[n++] = ( pixel >> 0 ) & 0xff;
						colorData[n++] = ( pixel >> 8 ) & 0xff;
						colorData[n++] = ( pixel >> 16 ) & 0xff;
						
						transData[i] = ( pixel >> 24 ) & 0xff;
					}
					
					imageData = colorData;
					smask = arrayBufferToBinaryString(transData);
					filter = null;
				}
				
				if(filter === filter_methods[1])
					dp = '/Predictor 15 /Colors '+ colors +' /BitsPerComponent '+ bpc +' /Columns '+ img.width;
				
				if(img.palette && img.palette.length > 0)
					pal = img.palette;
				
				//I'm not sure the output from png.js is correct for this?
				/*if(img.transparency.indexed)
					trns = img.transparency.indexed;*/
				
				info = createImageInfo(arrayBufferToBinaryString(imageData),
									   img.width,
									   img.height,
									   colorSpace,
									   bpc,
									   filter,
									   imageIndex,
									   alias,
									   dp,
									   trns,
									   pal,
									   smask);
			}
		}
		
	}
	
	if( !info )
		throw new Error('Something went wrong, theres no image info');
	
	images[imageIndex] = info;
	
	if (!w && !h) {
		w = -96;
		h = -96;
	}
	if (w < 0) {
		w = (-1) * info['w'] * 72 / w / this.internal.scaleFactor;
	}
	if (h < 0) {
		h = (-1) * info['h'] * 72 / h / this.internal.scaleFactor;
	}
	if (w === 0) {
		w = h * info['w'] / info['h'];
	}
	if (h === 0) {
		h = w * info['h'] / info['w'];
	}

	this.internal.write(
		'q'
		, coord(w)
		, '0 0'
		, coord(h) // TODO: check if this should be shifted by vcoord
		, coord(x)
		, vcoord(y + h)
		, 'cm /I'+info['i']
		, 'Do Q'
	)

	return this 
}
})(jsPDF.API);
