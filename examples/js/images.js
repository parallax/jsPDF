// This example doesn't currently work on IE 
// However, you can convert your images to JSON. 
// We'll post some examples and tools soon!

// Because of security restrictions, getImageFromUrl will
// not load images from other domains.  Chrome has added
// security restrictions that prevent it from loading images
// when running local files.  Run with: chromium --allow-file-access-from-files --allow-file-access
// to temporarily get around this issue.
var getImageFromUrl = function(url, callback) {
	var img = new Image, data, ret={data: null, pending: true};
	
	img.onError = function() {
		throw new Error('Cannot load image: "'+url+'"');
	}
	img.onload = function() {
		var canvas = document.createElement('canvas');
		document.body.appendChild(canvas);
		canvas.width = img.width;
		canvas.height = img.height;

		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);
		// Grab the image as a jpeg encoded in base64, but only the data
		data = canvas.toDataURL('image/jpeg').slice('data:image/jpeg;base64,'.length);
		// Convert the data to binary form
		data = atob(data)
		document.body.removeChild(canvas);

		ret['data'] = data;
		ret['pending'] = false;
		if (typeof callback === 'function') {
			callback(data);
		}
	}
	img.src = url;

	return ret;
}

doc = new jsPDF();

// Since images are loaded asyncronously, we must wait to create
// the pdf until we actually have the image data.
// If we already had the jpeg image binary data loaded into
// a string, we create the pdf without delay.
var createPDF = function(imgData) {
	

	doc.addImage(imgData, 'JPEG', 10, 10, 50, 50);
	doc.addImage(imgData, 'JPEG', 70, 10, 100, 120);

	// You'd usually call doc.save() here

}

getImageFromUrl('./examples/thinking-monkey.jpg', createPDF);