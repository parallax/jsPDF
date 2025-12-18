/**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * jsPDF Annotations PlugIn
 *
 * There are many types of annotations in a PDF document. Annotations are placed
 * on a page at a particular location. They are not 'attached' to an object.
 * <br />
 * This plugin current supports <br />
 * <li> Goto Page (set pageNumber and top in options)
 * <li> Goto Name (set name and top in options)
 * <li> Goto URL (set url in options)
 * <p>
 * 	The destination magnification factor can also be specified when goto is a page number or a named destination. (see documentation below)
 *  (set magFactor in options).  XYZ is the default.
 * </p>
 * <p>
 *  Links, Text, Popup, and FreeText are supported.
 * </p>
 * <p>
 * Options In PDF spec Not Implemented Yet
 * <li> link border
 * <li> named target
 * <li> page coordinates
 * <li> destination page scaling and layout
 * <li> actions other than URL and GotoPage
 * <li> background / hover actions
 * </p>
 * @name annotations
 * @module
 */

/*
    Destination Magnification Factors
    See PDF 1.3 Page 386 for meanings and options

    [supported]
	XYZ (options; left top zoom)
	Fit (no options)
	FitH (options: top)
	FitV (options: left)

	[not supported]
	FitR
	FitB
	FitBH
	FitBV
 */

import { jsPDF } from "../jspdf.js";

(function(jsPDFAPI) {
  "use strict";

  var notEmpty = function(obj) {
    if (typeof obj != "undefined") {
      if (obj != "") {
        return true;
      }
    }
  };

  jsPDF.API.events.push([
    "addPage",
    function(addPageData) {
      var pageInfo = this.internal.getPageInfo(addPageData.pageNumber);
      pageInfo.pageContext.annotations = [];
    }
  ]);

  jsPDFAPI.events.push([
    "putPage",
    function(putPageData) {
      var getHorizontalCoordinateString = this.internal.getCoordinateString;
      var getVerticalCoordinateString = this.internal
        .getVerticalCoordinateString;
      var pageInfo = this.internal.getPageInfoByObjId(putPageData.objId);
      var pageAnnos = putPageData.pageContext.annotations;

      var anno, rect, line;
      var found = false;
      for (var a = 0; a < pageAnnos.length && !found; a++) {
        anno = pageAnnos[a];
        switch (anno.type) {
          case "link":
            if (
              notEmpty(anno.options.url) ||
              notEmpty(anno.options.pageNumber)
            ) {
              found = true;
            }
            break;
          case "reference":
          case "text":
          case "freetext":
            found = true;
            break;
        }
      }
      if (found == false) {
        return;
      }

      this.internal.write("/Annots [");
      for (var i = 0; i < pageAnnos.length; i++) {
        anno = pageAnnos[i];
        var escape = this.internal.pdfEscape;
        var encryptor = this.internal.getEncryptor(putPageData.objId);

        switch (anno.type) {
          case "reference":
            // References to Widget Annotations (for AcroForm Fields)
            this.internal.write(" " + anno.object.objId + " 0 R ");
            break;
          case "text":
            // Create a an object for both the text and the popup
            var objText = this.internal.newAdditionalObject();
            var objPopup = this.internal.newAdditionalObject();
            var encryptorText = this.internal.getEncryptor(objText.objId);

            var title = anno.title || "Note";
            rect =
              "/Rect [" +
              getHorizontalCoordinateString(anno.bounds.x) +
              " " +
              getVerticalCoordinateString(anno.bounds.y + anno.bounds.h) +
              " " +
              getHorizontalCoordinateString(anno.bounds.x + anno.bounds.w) +
              " " +
              getVerticalCoordinateString(anno.bounds.y) +
              "] ";

            line =
              "<</Type /Annot /Subtype /" +
              "Text" +
              " " +
              rect +
              "/Contents (" +
              escape(encryptorText(anno.contents)) +
              ")";
            line += " /Popup " + objPopup.objId + " 0 R";
            line += " /P " + pageInfo.objId + " 0 R";
            line += " /T (" + escape(encryptorText(title)) + ")";
            // PDF/UA: Add /F 4 flag (print flag) for proper annotation handling
            if (this.isPDFUAEnabled && this.isPDFUAEnabled()) {
              line += " /F 4";
              // Add StructParent for PDF/UA compliance
              // Use indices starting at 2000 to avoid conflicts with pages (0-n) and form fields (1000+)
              if (anno.internalId) {
                if (!this.internal.pdfuaAnnotStructParentCounter) {
                  this.internal.pdfuaAnnotStructParentCounter = 2000;
                }
                var structParentIndex = this.internal.pdfuaAnnotStructParentCounter++;
                line += " /StructParent " + structParentIndex;
                // Store the mapping for ParentTree
                if (!this.internal.pdfuaAnnotStructParentMap) {
                  this.internal.pdfuaAnnotStructParentMap = {};
                }
                this.internal.pdfuaAnnotStructParentMap[anno.internalId] = structParentIndex;
              }
            }
            line += " >>";
            objText.content = line;

            var parent = objText.objId + " 0 R";
            var popoff = 30;
            rect =
              "/Rect [" +
              getHorizontalCoordinateString(anno.bounds.x + popoff) +
              " " +
              getVerticalCoordinateString(anno.bounds.y + anno.bounds.h) +
              " " +
              getHorizontalCoordinateString(
                anno.bounds.x + anno.bounds.w + popoff
              ) +
              " " +
              getVerticalCoordinateString(anno.bounds.y) +
              "] ";
            line =
              "<</Type /Annot /Subtype /" +
              "Popup" +
              " " +
              rect +
              " /Parent " +
              parent;
            if (anno.open) {
              line += " /Open true";
            }
            // PDF/UA: Add hidden flag (F 2) to popup so it doesn't require structure
            if (this.isPDFUAEnabled && this.isPDFUAEnabled()) {
              line += " /F 2";
            }
            line += " >>";
            objPopup.content = line;

            this.internal.write(objText.objId, "0 R", objPopup.objId, "0 R");

            // PDF/UA: Store object ID and page for OBJR reference in structure tree
            if (this.isPDFUAEnabled && this.isPDFUAEnabled() && anno.internalId) {
              if (!this.internal.pdfuaAnnotIdMap) {
                this.internal.pdfuaAnnotIdMap = {};
              }
              this.internal.pdfuaAnnotIdMap[anno.internalId] = objText.objId;

              // Store page number for /Pg reference
              if (!this.internal.pdfuaAnnotPageMap) {
                this.internal.pdfuaAnnotPageMap = {};
              }
              this.internal.pdfuaAnnotPageMap[anno.internalId] = putPageData.pageNumber;
            }

            break;
          case "freetext":
            rect =
              "/Rect [" +
              getHorizontalCoordinateString(anno.bounds.x) +
              " " +
              getVerticalCoordinateString(anno.bounds.y) +
              " " +
              getHorizontalCoordinateString(anno.bounds.x + anno.bounds.w) +
              " " +
              getVerticalCoordinateString(anno.bounds.y + anno.bounds.h) +
              "] ";
            var color = anno.color || "#000000";

            // PDF/UA: Create as indirect object for OBJR reference
            if (this.isPDFUAEnabled && this.isPDFUAEnabled()) {
              var objFreeText = this.internal.newAdditionalObject();
              var encryptorFreeText = this.internal.getEncryptor(objFreeText.objId);
              line =
                "<</Type /Annot /Subtype /" +
                "FreeText" +
                " " +
                rect +
                "/Contents (" +
                escape(encryptorFreeText(anno.contents)) +
                ")";
              line +=
                " /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#" +
                color +
                ")";
              line += " /Border [0 0 0]";
              line += " /F 4"; // Print flag for PDF/UA
              // Add StructParent for PDF/UA compliance
              if (anno.internalId) {
                if (!this.internal.pdfuaAnnotStructParentCounter) {
                  this.internal.pdfuaAnnotStructParentCounter = 2000;
                }
                var structParentIdx = this.internal.pdfuaAnnotStructParentCounter++;
                line += " /StructParent " + structParentIdx;
                // Store the mapping for ParentTree
                if (!this.internal.pdfuaAnnotStructParentMap) {
                  this.internal.pdfuaAnnotStructParentMap = {};
                }
                this.internal.pdfuaAnnotStructParentMap[anno.internalId] = structParentIdx;
              }
              line += " >>";
              objFreeText.content = line;
              this.internal.write(objFreeText.objId + " 0 R");

              // Store object ID and page for OBJR reference in structure tree
              if (anno.internalId) {
                if (!this.internal.pdfuaAnnotIdMap) {
                  this.internal.pdfuaAnnotIdMap = {};
                }
                this.internal.pdfuaAnnotIdMap[anno.internalId] = objFreeText.objId;

                // Store page number for /Pg reference
                if (!this.internal.pdfuaAnnotPageMap) {
                  this.internal.pdfuaAnnotPageMap = {};
                }
                this.internal.pdfuaAnnotPageMap[anno.internalId] = putPageData.pageNumber;
              }
            } else {
              line =
                "<</Type /Annot /Subtype /" +
                "FreeText" +
                " " +
                rect +
                "/Contents (" +
                escape(encryptor(anno.contents)) +
                ")";
              line +=
                " /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#" +
                color +
                ")";
              line += " /Border [0 0 0]";
              line += " >>";
              this.internal.write(line);
            }
            break;
          case "link":
            if (anno.options.name) {
              var loc = this.annotations._nameMap[anno.options.name];
              anno.options.pageNumber = loc.page;
              anno.options.top = loc.y;
            } else {
              if (!anno.options.top) {
                anno.options.top = 0;
              }
            }

            rect =
              "/Rect [" +
              anno.finalBounds.x +
              " " +
              anno.finalBounds.y +
              " " +
              anno.finalBounds.w +
              " " +
              anno.finalBounds.h +
              "] ";

            line = "";
            if (anno.options.url) {
              line =
                "<</Type /Annot /Subtype /Link " +
                rect +
                "/Border [0 0 0] /A <</S /URI /URI (" +
                escape(encryptor(anno.options.url)) +
                ") >>";
            } else if (anno.options.pageNumber) {
              // first page is 0
              var info = this.internal.getPageInfo(anno.options.pageNumber);
              line =
                "<</Type /Annot /Subtype /Link " +
                rect +
                "/Border [0 0 0] /Dest [" +
                info.objId +
                " 0 R";
              anno.options.magFactor = anno.options.magFactor || "XYZ";
              switch (anno.options.magFactor) {
                case "Fit":
                  line += " /Fit]";
                  break;
                case "FitH":
                  line += " /FitH " + anno.options.top + "]";
                  break;
                case "FitV":
                  anno.options.left = anno.options.left || 0;
                  line += " /FitV " + anno.options.left + "]";
                  break;
                case "XYZ":
                default:
                  var top = getVerticalCoordinateString(anno.options.top);
                  anno.options.left = anno.options.left || 0;
                  // 0 or null zoom will not change zoom factor
                  if (typeof anno.options.zoom === "undefined") {
                    anno.options.zoom = 0;
                  }
                  line +=
                    " /XYZ " +
                    anno.options.left +
                    " " +
                    top +
                    " " +
                    anno.options.zoom +
                    "]";
                  break;
              }
            }

            if (line != "") {
              // For PDF/UA: Create link annotation as indirect object
              // so it can be referenced by the Link structure element via OBJR
              if (anno.needsObjId) {
                // PDF/UA 7.18.5: Add /Contents key for alternate description
                if (anno.contentsText) {
                  line += " /Contents (" + escape(encryptor(anno.contentsText)) + ")";
                }
                // PDF/UA: Add /F 4 flag (print flag) for proper annotation handling
                line += " /F 4";
                // PDF/UA: Add /StructParent for structure tree connection
                if (!this.internal.pdfuaLinkStructParentCounter) {
                  this.internal.pdfuaLinkStructParentCounter = 3000; // Use 3000+ range to avoid conflicts
                }
                var linkStructParentIndex = this.internal.pdfuaLinkStructParentCounter++;
                line += " /StructParent " + linkStructParentIndex;
                // Store the mapping for ParentTree
                if (!this.internal.pdfuaLinkStructParentMap) {
                  this.internal.pdfuaLinkStructParentMap = {};
                }
                this.internal.pdfuaLinkStructParentMap[anno.internalId] = linkStructParentIndex;

                line += " >>";

                // Reserve object ID now (during putPage, after pages are created)
                var linkObjId = this.internal.newObjectDeferred();

                // Store the mapping from internal ID to object ID
                if (!this.internal.pdfuaLinkIdMap) {
                  this.internal.pdfuaLinkIdMap = {};
                }
                this.internal.pdfuaLinkIdMap[anno.internalId] = linkObjId;

                // Store annotation content to be written later as indirect object
                if (!this.internal.pdfuaLinkAnnotations) {
                  this.internal.pdfuaLinkAnnotations = [];
                }
                this.internal.pdfuaLinkAnnotations.push({
                  objId: linkObjId,
                  content: line
                });
                // Reference the indirect object in the Annots array
                this.internal.write(linkObjId + " 0 R");
              } else {
                // Inline annotation (backwards compatible)
                line += " >>";
                this.internal.write(line);
              }
            }
            break;
        }
      }
      this.internal.write("]");
    }
  ]);

  /**
   * Write PDF/UA link annotations as indirect objects
   * This is needed so they can be referenced by Link structure elements via OBJR
   */
  jsPDFAPI.events.push([
    "postPutResources",
    function() {
      if (!this.internal.pdfuaLinkAnnotations) {
        return;
      }

      var annotations = this.internal.pdfuaLinkAnnotations;
      for (var i = 0; i < annotations.length; i++) {
        var anno = annotations[i];
        this.internal.newObjectDeferredBegin(anno.objId, true);
        this.internal.write(anno.content);
        this.internal.write("endobj");
      }

      // Clear the list after writing
      this.internal.pdfuaLinkAnnotations = [];
    }
  ]);

  /**
   * Create an annotation.
   * For PDF/UA mode, returns an internal ID that can be used with addAnnotationRef()
   * to link the annotation to an Annot structure element.
   *
   * @name createAnnotation
   * @function
   * @param {Object} options - Annotation options
   * @param {string} options.type - Annotation type: 'link', 'text', or 'freetext'
   * @param {Object} options.bounds - Bounding box {x, y, w, h}
   * @param {string} [options.contents] - Text content (for text/freetext)
   * @param {string} [options.title] - Title/author (for text annotations)
   * @param {boolean} [options.open] - Whether popup is open (for text annotations)
   * @param {string} [options.color] - Text color (for freetext)
   * @returns {number|undefined} - Internal ID for PDF/UA (use with addAnnotationRef), or undefined
   */
  jsPDFAPI.createAnnotation = function(options) {
    var pageInfo = this.internal.getCurrentPageInfo();
    var internalId;

    switch (options.type) {
      case "link":
        return this.link(
          options.bounds.x,
          options.bounds.y,
          options.bounds.w,
          options.bounds.h,
          options
        );
      case "text":
      case "freetext":
        // PDF/UA: Assign internal ID for OBJR reference
        if (this.isPDFUAEnabled && this.isPDFUAEnabled()) {
          if (!this.internal.pdfuaAnnotCounter) {
            this.internal.pdfuaAnnotCounter = 0;
          }
          internalId = ++this.internal.pdfuaAnnotCounter;
          options.internalId = internalId;
        }
        pageInfo.pageContext.annotations.push(options);
        return internalId;
    }
  };

  /**
   * Create a link
   *
   * valid options
   * <li> pageNumber or url [required]
   * <p>If pageNumber is specified, top and zoom may also be specified</p>
   * @name link
   * @function
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @param {Object} options
   * @returns {number|undefined} - Object ID of the link annotation (for PDF/UA), or undefined
   */
  jsPDFAPI.link = function(x, y, w, h, options) {
    var pageInfo = this.internal.getCurrentPageInfo();
    var getHorizontalCoordinateString = this.internal.getCoordinateString;
    var getVerticalCoordinateString = this.internal.getVerticalCoordinateString;

    var annotation = {
      finalBounds: {
        x: getHorizontalCoordinateString(x),
        y: getVerticalCoordinateString(y),
        w: getHorizontalCoordinateString(x + w),
        h: getVerticalCoordinateString(y + h)
      },
      options: options,
      type: "link"
    };

    // For PDF/UA: Mark that this annotation needs an object ID
    // The actual ID will be assigned later during postPutResources
    // to avoid object number conflicts
    if (this.isPDFUAEnabled && this.isPDFUAEnabled()) {
      annotation.needsObjId = true;
      // Generate a unique internal ID for tracking
      if (!this.internal.pdfuaLinkCounter) {
        this.internal.pdfuaLinkCounter = 0;
      }
      annotation.internalId = ++this.internal.pdfuaLinkCounter;

      // PDF/UA 7.18.5: Links MUST have Contents key for alternate description
      // Use the linkText option if provided, otherwise use the URL as fallback
      if (options.linkText) {
        annotation.contentsText = options.linkText;
      } else if (options.url) {
        annotation.contentsText = options.url;
      } else if (options.pageNumber) {
        annotation.contentsText = "Go to page " + options.pageNumber;
      }
    }

    pageInfo.pageContext.annotations.push(annotation);

    // Return the internal ID so it can be passed to addLinkAnnotationRef()
    return annotation.internalId;
  };

  /**
   * Currently only supports single line text.
   * Returns the width of the text/link
   *
   * @name textWithLink
   * @function
   * @param {string} text
   * @param {number} x
   * @param {number} y
   * @param {Object} options
   * @returns {number} width the width of the text/link
   */
  jsPDFAPI.textWithLink = function(text, x, y, options) {
    var totalLineWidth = this.getTextWidth(text);
    var lineHeight = this.internal.getLineHeight() / this.internal.scaleFactor;
    var linkHeight, linkWidth;

    // Checking if maxWidth option is passed to determine lineWidth and number of lines for each line
    if (options.maxWidth !== undefined) {
      var { maxWidth } = options;
      linkWidth = maxWidth;
      var numOfLines = this.splitTextToSize(text, linkWidth).length;
      linkHeight = Math.ceil(lineHeight * numOfLines);
    } else {
      linkWidth = totalLineWidth;
      linkHeight = lineHeight;
    }

    this.text(text, x, y, options);

    //TODO We really need the text baseline height to do this correctly.
    // Or ability to draw text on top, bottom, center, or baseline.
    y += lineHeight * 0.2;
    //handle x position based on the align option
    if (options.align === "center") {
      x = x - totalLineWidth / 2; //since starting from center move the x position by half of text width
    }
    if (options.align === "right") {
      x = x - totalLineWidth;
    }

    // PDF/UA: Pass link text for Contents key (required for accessibility)
    var linkOptions = Object.assign({}, options, { linkText: text });
    var linkId = this.link(x, y - lineHeight, linkWidth, linkHeight, linkOptions);

    // PDF/UA: If we're inside a Link structure element, add the annotation reference
    if (this.isPDFUAEnabled && this.isPDFUAEnabled() && linkId) {
      // Check if we're in a Link structure element
      if (this.internal.structureTree && this.internal.structureTree.currentParent) {
        var currentElem = this.internal.structureTree.currentParent;
        if (currentElem.type === 'Link') {
          // Add annotation reference to the Link structure element
          if (this.addLinkAnnotationRef) {
            this.addLinkAnnotationRef(linkId);
          }
        }
      }
    }

    return totalLineWidth;
  };

  //TODO move into external library
  /**
   * @name getTextWidth
   * @function
   * @param {string} text
   * @returns {number} txtWidth
   */
  jsPDFAPI.getTextWidth = function(text) {
    var fontSize = this.internal.getFontSize();
    var txtWidth =
      (this.getStringUnitWidth(text) * fontSize) / this.internal.scaleFactor;
    return txtWidth;
  };

  return this;
})(jsPDF.API);
