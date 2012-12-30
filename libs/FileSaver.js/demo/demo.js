/* FileSaver.js demo script
 * 2011-08-02
 * 
 * By Eli Grey, http://eligrey.com
 * License: X11/MIT
 *   See LICENSE.md
 */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/demo/demo.js */

(function(view) {
"use strict";
// The canvas drawing portion of the demo is based off the demo at
// http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/
var
	  document = view.document
	, $ = function(id) {
		return document.getElementById(id);
	}
	, session = view.sessionStorage
	// only get URL when necessary in case BlobBuilder.js hasn't defined it yet
	, get_blob_builder = function() {
		return view.BlobBuilder || view.WebKitBlobBuilder || view.MozBlobBuilder;
	}

	, canvas = $("canvas")
	, canvas_options_form = $("canvas-options")
	, canvas_filename = $("canvas-filename")
	, canvas_clear_button = $("canvas-clear")
	
	, text = $("text")
	, text_options_form = $("text-options")
	, text_filename = $("text-filename")
	
	, html = $("html")
	, html_options_form = $("html-options")
	, html_filename = $("html-filename")
	
	, ctx = canvas.getContext("2d")
	, drawing = false
	, x_points = session.x_points || []
	, y_points = session.y_points || []
	, drag_points = session.drag_points || []
	, add_point = function(x, y, dragging) {
		x_points.push(x);
		y_points.push(y);
		drag_points.push(dragging);
	}
	, draw = function(){
		canvas.width = canvas.width;
		ctx.lineWidth = 6;
		ctx.lineJoin = "round";
		ctx.strokeStyle = "#000000";
		var
			  i = 0
			, len = x_points.length
		;
		for(; i < len; i++) {
			ctx.beginPath();
			if (i && drag_points[i]) {
				ctx.moveTo(x_points[i-1], y_points[i-1]);
			} else {
				ctx.moveTo(x_points[i]-1, y_points[i]);
			}
			ctx.lineTo(x_points[i], y_points[i]);
			ctx.closePath();
			ctx.stroke();
		}
	}
	, stop_drawing = function() {
		drawing = false;
	}
	
	// Title guesser and document creator available at https://gist.github.com/1059648
	, guess_title = function(doc) {
		var
			  h = "h6 h5 h4 h3 h2 h1".split(" ")
			, i = h.length
			, headers
			, header_text
		;
		while (i--) {
			headers = doc.getElementsByTagName(h[i]);
			for (var j = 0, len = headers.length; j < len; j++) {
				header_text = headers[j].textContent.trim();
				if (header_text) {
					return header_text;
				}
			}
		}
	}
	, doc_impl = document.implementation
	, create_html_doc = function(html) {
		var
			  dt = doc_impl.createDocumentType('html', null, null)
			, doc = doc_impl.createDocument("http://www.w3.org/1999/xhtml", "html", dt)
			, doc_el = doc.documentElement
			, head = doc_el.appendChild(doc.createElement("head"))
			, charset_meta = head.appendChild(doc.createElement("meta"))
			, title = head.appendChild(doc.createElement("title"))
			, body = doc_el.appendChild(doc.createElement("body"))
			, i = 0
			, len = html.childNodes.length
		;
		charset_meta.setAttribute("charset", html.ownerDocument.characterSet);
		for (; i < len; i++) {
			body.appendChild(doc.importNode(html.childNodes.item(i), true));
		}
		var title_text = guess_title(doc);
		if (title_text) {
			title.appendChild(doc.createTextNode(title_text));
		}
		return doc;
	}
;
canvas.width = 500;
canvas.height = 300;

  if (typeof x_points === "string") {
	x_points = JSON.parse(x_points);
} if (typeof y_points === "string") {
	y_points = JSON.parse(y_points);
} if (typeof drag_points === "string") {
	drag_points = JSON.parse(drag_points);
} if (session.canvas_filename) {
	canvas_filename.value = session.canvas_filename;
} if (session.text) {
	text.value = session.text;
} if (session.text_filename) {
	text_filename.value = session.text_filename;
} if (session.html) {
	html.innerHTML = session.html;
} if (session.html_filename) {
	html_filename.value = session.html_filename;
}

drawing = true;
draw();
drawing = false;

canvas_clear_button.addEventListener("click", function() {
	canvas.width = canvas.width;
	x_points.length =
	y_points.length =
	drag_points.length =
		0;
}, false);
canvas.addEventListener("mousedown", function(event) {
	drawing = true;
	add_point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop, false);
	draw();
}, false);
canvas.addEventListener("mousemove", function(event) {
	if (drawing) {
		add_point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop, true);
		draw();
	}
}, false);
canvas.addEventListener("mouseup", stop_drawing, false);
canvas.addEventListener("mouseout", stop_drawing, false);

canvas_options_form.addEventListener("submit", function(event) {
	event.preventDefault();
	canvas.toBlob(function(blob) {
		saveAs(
			  blob
			, (canvas_filename.value || canvas_filename.placeholder) + ".png"
		);
	}, "image/png");
}, false);

text_options_form.addEventListener("submit", function(event) {
	event.preventDefault();
	var BB = get_blob_builder();
	var bb = new BB;
	bb.append(text.value || text.placeholder);
	saveAs(
		  bb.getBlob("text/plain;charset=" + document.characterSet)
		, (text_filename.value || text_filename.placeholder) + ".txt"
	);
}, false);

html_options_form.addEventListener("submit", function(event) {
	event.preventDefault();
	var
		  BB = get_blob_builder()
		, bb = new BB
		, xml_serializer = new XMLSerializer
		, doc = create_html_doc(html)
	;
	bb.append(xml_serializer.serializeToString(doc));
	saveAs(
		  bb.getBlob("application/xhtml+xml;charset=" + document.characterSet)
		, (html_filename.value || html_filename.placeholder) + ".xhtml"
	);
}, false);

view.addEventListener("unload", function() {
	session.x_points = JSON.stringify(x_points);
	session.y_points = JSON.stringify(y_points);
	session.drag_points = JSON.stringify(drag_points);
	session.canvas_filename = canvas_filename.value;
	
	session.text = text.value;
	session.text_filename = text_filename.value;
	
	session.html = html.innerHTML;
	session.html_filename = html_filename.value;
}, false);
}(self));