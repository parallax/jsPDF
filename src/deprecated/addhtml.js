/* global jsPDF, rasterizeHTML, html2canvas */
/**
 * jsPDF addHTML PlugIn
 * Copyright (c) 2014 Diego Casorran
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

(function(jsPDFAPI) {
  "use strict";

  /**
   * Renders an HTML element to canvas object which added to the PDF
   *
   * This feature requires [html2canvas](https://github.com/niklasvh/html2canvas)
   * or [rasterizeHTML](https://github.com/cburgmer/rasterizeHTML.js)
   *
   * @returns {jsPDF}
   * @name addHTML
   * @param element {Mixed} HTML Element, or anything supported by html2canvas.
   * @param x {Number} starting X coordinate in jsPDF instance's declared units.
   * @param y {Number} starting Y coordinate in jsPDF instance's declared units.
   * @param options {Object} Additional options, check the code below.
   * @param callback {Function} to call when the rendering has finished.
   * NOTE: Every parameter is optional except 'element' and 'callback', in such
   *       case the image is positioned at 0x0 covering the whole PDF document
   *       size. Ie, to easily take screenshots of webpages saving them to PDF.
   * @deprecated This is being replace with a vector-supporting API. See
   * [this link](https://cdn.rawgit.com/MrRio/jsPDF/master/examples/html2pdf/showcase_supported_html.html)
   */
  jsPDFAPI.addHTML = function(element, x, y, options, callback) {
    "use strict";

    if (
      typeof html2canvas === "undefined" &&
      typeof rasterizeHTML === "undefined"
    )
      throw new Error(
        "You need either " +
          "https://github.com/niklasvh/html2canvas" +
          " or https://github.com/cburgmer/rasterizeHTML.js"
      );

    if (typeof x !== "number") {
      options = x;
      callback = y;
    }

    if (typeof options === "function") {
      callback = options;
      options = null;
    }

    if (typeof callback !== "function") {
      callback = function() {};
    }

    var I = this.internal,
      K = I.scaleFactor,
      W = I.pageSize.getWidth(),
      H = I.pageSize.getHeight();

    options = options || {};
    options.onrendered = function(obj) {
      x = parseInt(x) || 0;
      y = parseInt(y) || 0;
      var dim = options.dim || {};
      var margin = Object.assign(
        { top: 0, right: 0, bottom: 0, left: 0, useFor: "content" },
        options.margin
      );
      var h = dim.h || Math.min(H, obj.height / K);
      var w = dim.w || Math.min(W, obj.width / K) - x;

      var format = options.format || "JPEG";
      var imageCompression = options.imageCompression || "SLOW";

      var notFittingHeight = obj.height > H - margin.top - margin.bottom;

      if (notFittingHeight && options.pagesplit) {
        var cropArea = function(parmObj, parmX, parmY, parmWidth, parmHeight) {
          var canvas = document.createElement("canvas");
          canvas.height = parmHeight;
          canvas.width = parmWidth;
          var ctx = canvas.getContext("2d");
          ctx.mozImageSmoothingEnabled = false;
          ctx.webkitImageSmoothingEnabled = false;
          ctx.msImageSmoothingEnabled = false;
          ctx.imageSmoothingEnabled = false;
          ctx.fillStyle = options.backgroundColor || "#ffffff";
          ctx.fillRect(0, 0, parmWidth, parmHeight);
          ctx.drawImage(
            parmObj,
            parmX,
            parmY,
            parmWidth,
            parmHeight,
            0,
            0,
            parmWidth,
            parmHeight
          );
          return canvas;
        };

        var crop = function() {
          var cy = 0;
          var cx = 0;
          var position = {};
          var isOverWide = false;
          var width;
          var height;
          var canvas;
          var args;
          while (1) {
            cx = 0;
            position.top = cy !== 0 ? margin.top : y;
            position.left = cy !== 0 ? margin.left : x;
            isOverWide = (W - margin.left - margin.right) * K < obj.width;
            if (margin.useFor === "content") {
              if (cy === 0) {
                width = Math.min((W - margin.left) * K, obj.width);
                height = Math.min((H - margin.top) * K, obj.height - cy);
              } else {
                width = Math.min(W * K, obj.width);
                height = Math.min(H * K, obj.height - cy);
                position.top = 0;
              }
            } else {
              width = Math.min((W - margin.left - margin.right) * K, obj.width);
              height = Math.min(
                (H - margin.bottom - margin.top) * K,
                obj.height - cy
              );
            }
            if (isOverWide) {
              while (1) {
                if (margin.useFor === "content") {
                  if (cx === 0) {
                    width = Math.min((W - margin.left) * K, obj.width);
                  } else {
                    width = Math.min(W * K, obj.width - cx);
                    position.left = 0;
                  }
                }
                canvas = cropArea(obj, cx, cy, width, height);
                args = [
                  canvas,
                  position.left,
                  position.top,
                  canvas.width / K,
                  canvas.height / K,
                  format,
                  null,
                  imageCompression
                ];
                this.addImage.apply(this, args);
                cx += width;
                if (cx >= obj.width) {
                  break;
                }
                this.addPage();
              }
            } else {
              canvas = cropArea(obj, 0, cy, width, height);
              args = [
                canvas,
                position.left,
                position.top,
                canvas.width / K,
                canvas.height / K,
                format,
                null,
                imageCompression
              ];
              this.addImage.apply(this, args);
            }
            cy += height;
            if (cy >= obj.height) {
              break;
            }
            this.addPage();
          }
          callback(w, cy, null, args);
        }.bind(this);
        if (obj.nodeName === "CANVAS") {
          var img = new Image();
          img.onload = crop;
          img.src = obj.toDataURL("image/png");
          obj = img;
        } else {
          crop();
        }
      } else {
        var alias = Math.random().toString(35);
        var args = [obj, x, y, w, h, format, alias, imageCompression];

        this.addImage.apply(this, args);

        callback(w, h, alias, args);
      }
    }.bind(this);

    if (typeof html2canvas !== "undefined" && !options.rstz) {
      return html2canvas(element, options);
    }

    if (typeof rasterizeHTML !== "undefined") {
      var meth = "drawDocument";
      if (typeof element === "string") {
        meth = /^http/.test(element) ? "drawURL" : "drawHTML";
      }
      options.width = options.width || W * K;
      return rasterizeHTML[meth](element, void 0, options).then(
        function(r) {
          options.onrendered(r.image);
        },
        function(e) {
          callback(null, e);
        }
      );
    }

    return null;
  };
})(jsPDF.API);
