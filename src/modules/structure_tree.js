/**
 * @license
 * Copyright (c) 2025 Heiko Folkerts and contributors
 * Licensed under the MIT License.
 * https://github.com/parallax/jsPDF
 *
 * Structure Tree Module for PDF/UA
 *
 * This module implements the PDF structure tree (StructTreeRoot and StructElems)
 * which is required for PDF/UA compliance. The structure tree provides the logical
 * document structure that assistive technologies use to navigate the document.
 */

import { jsPDF } from "../jspdf.js";

(function(jsPDFAPI) {
  "use strict";

  /**
   * StructElement class - represents a structure element in the PDF structure tree
   */
  function StructElement(type, parent, api) {
    this.type = type; // e.g. 'Document', 'P', 'H1', 'H2', etc.
    this.parent = parent; // Parent structure element
    this.children = []; // Child structure elements
    this.attributes = {}; // Element attributes
    this.mcids = []; // Marked Content IDs (references to page content)
    this.objectNumber = null; // PDF object number (assigned during output)
    this.id = null; // Unique ID within the document
    this.api = api; // Reference to jsPDF API
  }

  /**
   * Add a marked content ID to this structure element
   */
  StructElement.prototype.addMCID = function(pageNumber, mcid) {
    this.mcids.push({
      page: pageNumber,
      mcid: mcid
    });
  };

  /**
   * Add a child structure element
   */
  StructElement.prototype.addChild = function(child) {
    this.children.push(child);
    child.parent = this;
  };

  /**
   * Initialize the structure tree
   * This is called automatically when PDF/UA mode is enabled
   */
  var initStructureTree = function() {
    if (!this.internal.structureTree) {
      this.internal.structureTree = {
        root: null, // StructTreeRoot
        currentParent: null, // Current parent for new elements
        elements: [], // All structure elements
        mcidCounter: {}, // MCID counter per page
        nextStructId: 0, // Next unique structure ID
        stack: [] // Stack for nested elements
      };

      // Create root if PDF/UA is enabled
      if (this.isPDFUAEnabled && this.isPDFUAEnabled()) {
        createStructTreeRoot.call(this);
      }
    }
  };

  /**
   * Create the StructTreeRoot object
   * This is the top-level structure element that contains all other structure elements
   */
  var createStructTreeRoot = function() {
    if (this.internal.structureTree.root) {
      return this.internal.structureTree.root;
    }

    var root = {
      type: "StructTreeRoot",
      id: this.internal.structureTree.nextStructId++,
      children: [],
      objectNumber: null, // Will be assigned later
      api: this
    };

    this.internal.structureTree.root = root;
    this.internal.structureTree.currentParent = root;

    return root;
  };

  /**
   * Begin a structure element
   * @param {string} type - Structure element type (e.g. 'Document', 'P', 'H1')
   * @param {object} attributes - Optional attributes for the element
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginStructureElement = function(type, attributes) {
    initStructureTree.call(this);

    var parent = this.internal.structureTree.currentParent;
    if (!parent) {
      parent = this.internal.structureTree.root;
    }

    var element = new StructElement(type, parent, this);
    attributes = attributes || {};

    // Extract special attributes that are stored directly on the element
    if (attributes.alt) {
      element.alt = attributes.alt;
    }
    if (attributes.expansion) {
      element.expansion = attributes.expansion;
    }

    // Store remaining attributes
    element.attributes = attributes;
    element.id = this.internal.structureTree.nextStructId++;
    // Object number will be assigned later in reserveStructObjectNumbers

    if (parent && parent.children) {
      parent.children.push(element);
    } else if (parent && parent.addChild) {
      parent.addChild(element);
    }

    // Push current parent to stack and set new parent
    this.internal.structureTree.stack.push(parent);
    this.internal.structureTree.currentParent = element;
    this.internal.structureTree.elements.push(element);

    return this;
  };

  /**
   * End the current structure element
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endStructureElement = function() {
    if (
      !this.internal.structureTree ||
      this.internal.structureTree.stack.length === 0
    ) {
      return this;
    }

    // Pop parent from stack
    this.internal.structureTree.currentParent = this.internal.structureTree.stack.pop();

    return this;
  };

  /**
   * Get the current structure element
   * @returns {StructElement|null} - Current structure element or null
   */
  jsPDFAPI.getCurrentStructureElement = function() {
    if (!this.internal.structureTree) {
      return null;
    }
    return this.internal.structureTree.currentParent;
  };

  /**
   * Get next MCID for current page
   * @returns {number} - Next MCID for the current page
   */
  jsPDFAPI.getNextMCID = function() {
    initStructureTree.call(this);
    var pageNumber = this.internal.getCurrentPageInfo().pageNumber;
    if (!this.internal.structureTree.mcidCounter[pageNumber]) {
      this.internal.structureTree.mcidCounter[pageNumber] = 0;
    }
    return this.internal.structureTree.mcidCounter[pageNumber]++;
  };

  /**
   * Add MCID to current structure element
   * @param {number} mcid - Marked Content ID
   * @param {number} pageNumber - Page number
   */
  jsPDFAPI.addMCIDToCurrentStructure = function(mcid, pageNumber) {
    if (
      !this.internal.structureTree ||
      !this.internal.structureTree.currentParent
    ) {
      return;
    }
    var currentElem = this.internal.structureTree.currentParent;
    if (currentElem.type !== "StructTreeRoot") {
      currentElem.addMCID(pageNumber, mcid);
    }
  };

  /**
   * Write ParentTree - maps page MCIDs to structure elements
   */
  var writeParentTree = function() {
    if (!this.internal.structureTree || !this.internal.structureTree.root) {
      return;
    }

    // Build mapping: page -> mcid -> structElement
    var parentTree = {};
    var elements = this.internal.structureTree.elements;

    for (var i = 0; i < elements.length; i++) {
      var elem = elements[i];
      if (elem.mcids && elem.mcids.length > 0) {
        for (var j = 0; j < elem.mcids.length; j++) {
          var mcidInfo = elem.mcids[j];
          var pageKey = mcidInfo.page - 1; // Pages are 0-indexed in ParentTree

          if (!parentTree[pageKey]) {
            parentTree[pageKey] = [];
          }

          if (!parentTree[pageKey][mcidInfo.mcid]) {
            parentTree[pageKey][mcidInfo.mcid] = elem.objectNumber;
          }
        }
      }
    }

    // First, create indirect array objects for each page
    var pageKeys = Object.keys(parentTree).sort(function(a, b) {
      return a - b;
    });
    var pageArrayObjects = {};

    for (var k = 0; k < pageKeys.length; k++) {
      var pageNum = pageKeys[k];
      var mcidMap = parentTree[pageNum];

      // Build the array for this page
      var pageArray = [];
      var maxMcid = 0;

      for (var mcid in mcidMap) {
        if (parseInt(mcid) > maxMcid) maxMcid = parseInt(mcid);
      }

      for (var m = 0; m <= maxMcid; m++) {
        if (mcidMap[m]) {
          pageArray.push(mcidMap[m] + " 0 R");
        } else {
          pageArray.push("null");
        }
      }

      // Create an indirect object for this array
      var arrayObjNum = this.internal.newObject();
      this.internal.write("[" + pageArray.join(" ") + "]");
      this.internal.write("endobj");

      pageArrayObjects[pageNum] = arrayObjNum;
    }

    // Now write ParentTree as NumberTree with references to the array objects
    var parentTreeObj = this.internal.newObject();
    this.internal.write("<< /Nums [");

    for (var k = 0; k < pageKeys.length; k++) {
      var pageNum = pageKeys[k];
      this.internal.write(pageNum + " " + pageArrayObjects[pageNum] + " 0 R");
    }

    // Add form field StructParent entries to ParentTree
    // Form fields have StructParent indices starting at 1000
    // Each must point to the Form structure element that contains the OBJR
    var formFieldParentMap = this.internal.structureTree.formFieldParentMap;
    var structParentMap = this.internal.pdfuaFormFieldStructParentMap;

    if (formFieldParentMap && structParentMap) {
      for (var internalId in formFieldParentMap) {
        if (formFieldParentMap.hasOwnProperty(internalId)) {
          var formElement = formFieldParentMap[internalId];
          var structParentIndex = structParentMap[internalId];

          if (
            formElement &&
            formElement.objectNumber &&
            structParentIndex !== undefined
          ) {
            // Add entry: StructParent index -> Form element object number
            this.internal.write(
              structParentIndex + " " + formElement.objectNumber + " 0 R"
            );
          }
        }
      }
    }

    // Add annotation StructParent entries to ParentTree
    // Annotations (Text/FreeText) have StructParent indices starting at 2000
    // Each must point to the Annot structure element that contains the OBJR
    var annotParentMap = this.internal.structureTree.annotParentMap;
    var annotStructParentMap = this.internal.pdfuaAnnotStructParentMap;

    if (annotParentMap && annotStructParentMap) {
      for (var annotId in annotParentMap) {
        if (annotParentMap.hasOwnProperty(annotId)) {
          var annotElement = annotParentMap[annotId];
          var annotStructParentIndex = annotStructParentMap[annotId];

          if (
            annotElement &&
            annotElement.objectNumber &&
            annotStructParentIndex !== undefined
          ) {
            // Add entry: StructParent index -> Annot element object number
            this.internal.write(
              annotStructParentIndex + " " + annotElement.objectNumber + " 0 R"
            );
          }
        }
      }
    }

    // Add link annotation StructParent entries to ParentTree
    // Link annotations have StructParent indices starting at 3000
    // Each must point to the Link structure element that contains the OBJR
    var linkParentMap = this.internal.structureTree.linkParentMap;
    var linkStructParentMap = this.internal.pdfuaLinkStructParentMap;

    if (linkParentMap && linkStructParentMap) {
      for (var linkId in linkParentMap) {
        if (linkParentMap.hasOwnProperty(linkId)) {
          var linkElement = linkParentMap[linkId];
          var linkStructParentIndex = linkStructParentMap[linkId];

          if (
            linkElement &&
            linkElement.objectNumber &&
            linkStructParentIndex !== undefined
          ) {
            // Add entry: StructParent index -> Link element object number
            this.internal.write(
              linkStructParentIndex + " " + linkElement.objectNumber + " 0 R"
            );
          }
        }
      }
    }

    this.internal.write("]");
    this.internal.write(">>");
    this.internal.write("endobj");

    // Store reference for StructTreeRoot
    this.internal.structureTree.parentTreeObj = parentTreeObj;
  };

  /**
   * Write the structure tree to the PDF
   * This is called during PDF generation after all content is written
   */
  /**
   * Reserve object numbers for structure tree
   * Called at the right time to avoid collisions with page/resource objects
   */
  var reserveStructObjectNumbers = function() {
    if (!this.internal.structureTree || !this.internal.structureTree.root) {
      return;
    }

    var root = this.internal.structureTree.root;
    var elements = this.internal.structureTree.elements;

    // Reserve root object number if not already done
    if (!root.objectNumber) {
      root.objectNumber = this.internal.newObjectDeferred();
    }

    // Reserve object numbers for all elements
    for (var i = 0; i < elements.length; i++) {
      if (!elements[i].objectNumber) {
        elements[i].objectNumber = this.internal.newObjectDeferred();
      }
    }
  };

  var writeStructTree = function() {
    if (!this.internal.structureTree || !this.internal.structureTree.root) {
      return;
    }

    // CRITICAL FIX: Only write structure tree if there are actual structure elements
    // If we write an empty StructTreeRoot with Marked=true, Acrobat treats all content as artifacts
    if (this.internal.structureTree.root.children.length === 0) {
      return;
    }

    // Make sure object numbers are reserved before writing
    reserveStructObjectNumbers.call(this);

    var root = this.internal.structureTree.root;
    var elements = this.internal.structureTree.elements;

    // Now write all structure elements with correct references
    for (var i = 0; i < elements.length; i++) {
      var elem = elements[i];
      this.internal.newObjectDeferredBegin(elem.objectNumber, true);
      this.internal.write("<< /Type /StructElem");
      this.internal.write("/S /" + elem.type);

      // Parent reference
      if (elem.parent && elem.parent.objectNumber) {
        this.internal.write("/P " + elem.parent.objectNumber + " 0 R");
      }

      // Alternative text (for images and formulas, required for PDF/UA)
      if (elem.alt) {
        // Escape special characters in alt text
        var escapedAlt = elem.alt
          .replace(/\\/g, "\\\\")
          .replace(/\(/g, "\\(")
          .replace(/\)/g, "\\)");
        this.internal.write("/Alt (" + escapedAlt + ")");
      }

      // Expansion text (for abbreviations - PDF 1.7, 14.9.5)
      if (elem.expansion) {
        // Escape special characters in expansion text
        var escapedE = elem.expansion
          .replace(/\\/g, "\\\\")
          .replace(/\(/g, "\\(")
          .replace(/\)/g, "\\)");
        this.internal.write("/E (" + escapedE + ")");
      }

      // ID attribute (required for Note elements per PDF/UA - MP 19-003)
      if (elem.attributes && elem.attributes.id) {
        // Escape special characters in ID
        var escapedId = elem.attributes.id
          .replace(/\\/g, "\\\\")
          .replace(/\(/g, "\\(")
          .replace(/\)/g, "\\)");
        this.internal.write("/ID (" + escapedId + ")");
      }

      // Ref attribute (for Reference elements pointing to Note elements - PDF/UA requirement)
      // Per ISO 14289-1, Reference elements should have /Ref pointing to the referenced structure element
      if (
        elem.type === "Reference" &&
        elem.refNoteId &&
        this.internal.pdfuaFootnotes &&
        this.internal.pdfuaFootnotes.noteElements
      ) {
        var noteElem = this.internal.pdfuaFootnotes.noteElements[
          elem.refNoteId
        ];
        if (noteElem && noteElem.objectNumber) {
          this.internal.write("/Ref [" + noteElem.objectNumber + " 0 R]");
        }
      }

      // Attribute dictionary (for table headers, formula placement, form role, bbox, etc.)
      if (
        elem.attributes &&
        (elem.attributes.scope ||
          elem.attributes.placement ||
          elem.attributes.role ||
          elem.attributes.bbox)
      ) {
        var attrParts = [];

        // Table scope attribute
        if (elem.attributes.scope) {
          attrParts.push("/O /Table /Scope /" + elem.attributes.scope);
        }

        // Layout attributes (Placement and BBox can be combined in one dictionary)
        var layoutParts = [];
        if (elem.attributes.placement) {
          layoutParts.push("/Placement /" + elem.attributes.placement);
        }
        if (elem.attributes.bbox) {
          // BBox format: [x1 y1 x2 y2] in default user space units
          // bbox can be array [x, y, width, height] or [x1, y1, x2, y2]
          var bbox = elem.attributes.bbox;
          var bboxArray;
          if (bbox.x !== undefined) {
            // Object format: {x, y, width, height}
            bboxArray = [
              bbox.x,
              bbox.y,
              bbox.x + bbox.width,
              bbox.y + bbox.height
            ];
          } else if (bbox.length === 4) {
            // Array format: [x, y, width, height] - convert to [x1, y1, x2, y2]
            bboxArray = [
              bbox[0],
              bbox[1],
              bbox[0] + bbox[2],
              bbox[1] + bbox[3]
            ];
          } else {
            bboxArray = bbox;
          }
          layoutParts.push("/BBox [" + bboxArray.join(" ") + "]");
        }
        if (layoutParts.length > 0) {
          attrParts.push("/O /Layout " + layoutParts.join(" "));
        }

        // Role attribute (for Form elements per ISO 32000-1:2008, Table 348)
        // Rb = radio button, Cb = checkbox, Pb = push button, Tv = text value, Lb = list box
        if (elem.attributes.role) {
          attrParts.push("/O /PrintField /Role /" + elem.attributes.role);
        }

        if (attrParts.length === 1) {
          this.internal.write("/A << " + attrParts[0] + " >>");
        } else if (attrParts.length > 1) {
          // Multiple attribute dictionaries
          this.internal.write("/A [");
          for (var a = 0; a < attrParts.length; a++) {
            this.internal.write("<< " + attrParts[a] + " >>");
          }
          this.internal.write("]");
        }
      }

      // Page reference (required when element has MCIDs)
      if (elem.mcids.length > 0) {
        var pageNum = elem.mcids[0].page;
        // CRITICAL FIX: Use getPageInfo to get the correct page object ID
        // The old calculation (2 + pageNum) assumed page objects start at obj 3,
        // but this is incorrect when fonts and other objects are added before pages.
        var pageInfo = this.getPageInfo(pageNum);
        this.internal.write("/Pg " + pageInfo.objId + " 0 R");
      }

      // Children (K entry)
      // An element can have MCIDs, child elements, OBJR references, or combinations
      var hasAnnotationRefs =
        elem.annotationInternalIds && elem.annotationInternalIds.length > 0;
      var hasFormFieldRefs =
        elem.formFieldInternalIds && elem.formFieldInternalIds.length > 0;
      var hasAnnotRefs = elem.annotRefs && elem.annotRefs.length > 0; // For Text/FreeText annotations
      var hasContent =
        elem.children.length > 0 ||
        elem.mcids.length > 0 ||
        hasAnnotationRefs ||
        hasFormFieldRefs ||
        hasAnnotRefs;

      if (hasContent) {
        var kArray = [];
        var self = this;

        // Add MCIDs first
        elem.mcids.forEach(function(m) {
          kArray.push(m.mcid);
        });

        // Add OBJR references for link annotations (PDF/UA requirement)
        // Format: << /Type /OBJR /Obj <annotation-objId> 0 R >>
        if (hasAnnotationRefs) {
          elem.annotationInternalIds.forEach(function(internalId) {
            // Resolve internal ID to actual object ID using the mapping
            var objId =
              self.internal.pdfuaLinkIdMap &&
              self.internal.pdfuaLinkIdMap[internalId];
            if (objId) {
              kArray.push("<< /Type /OBJR /Obj " + objId + " 0 R >>");
            }
          });
        }

        // Add OBJR references for form field widget annotations (PDF/UA requirement)
        // Format: << /Type /OBJR /Obj <widget-objId> 0 R /Pg <page-objId> 0 R >>
        if (hasFormFieldRefs) {
          elem.formFieldInternalIds.forEach(function(internalId) {
            // Resolve internal ID to actual object ID using the mapping
            var objId =
              self.internal.pdfuaFormFieldIdMap &&
              self.internal.pdfuaFormFieldIdMap[internalId];
            if (objId) {
              // Get page reference for this form field
              var fieldPage =
                self.internal.pdfuaFormFieldPageMap &&
                self.internal.pdfuaFormFieldPageMap[internalId];
              var objrStr = "<< /Type /OBJR /Obj " + objId + " 0 R";
              if (fieldPage) {
                var pageInfo = self.internal.getPageInfo(fieldPage);
                if (pageInfo && pageInfo.objId) {
                  objrStr += " /Pg " + pageInfo.objId + " 0 R";
                }
              }
              objrStr += " >>";
              kArray.push(objrStr);
            }
          });
        }

        // Add OBJR references for Text/FreeText annotations (PDF/UA requirement)
        // Format: << /Type /OBJR /Obj <annotation-objId> 0 R /Pg <page-objId> 0 R >>
        if (hasAnnotRefs) {
          elem.annotRefs.forEach(function(internalId) {
            // Resolve internal ID to actual object ID using the mapping
            var objId =
              self.internal.pdfuaAnnotIdMap &&
              self.internal.pdfuaAnnotIdMap[internalId];
            if (objId) {
              // Get page reference for this annotation
              var annotPage =
                self.internal.pdfuaAnnotPageMap &&
                self.internal.pdfuaAnnotPageMap[internalId];
              var objrStr = "<< /Type /OBJR /Obj " + objId + " 0 R";
              if (annotPage) {
                var pageInfo = self.internal.getPageInfo(annotPage);
                if (pageInfo && pageInfo.objId) {
                  objrStr += " /Pg " + pageInfo.objId + " 0 R";
                }
              }
              objrStr += " >>";
              kArray.push(objrStr);
            }
          });
        }

        // Add child structure elements
        elem.children.forEach(function(c) {
          kArray.push(c.objectNumber + " 0 R");
        });

        this.internal.write("/K [" + kArray.join(" ") + "]");
      }

      this.internal.write(">>");
      this.internal.write("endobj");
    }

    // Write ParentTree
    writeParentTree.call(this);

    // Write RoleMap - map non-standard structure types to standard types
    // Required for PDF/UA-1 compliance (ISO 14289-1, clause 7.1, test 5)
    var roleMapObj = this.internal.newObject();
    this.internal.write("<<");
    // PDF 2.0 elements mapped to PDF 1.7 standard types
    this.internal.write("/DocumentFragment /Sect"); // Document excerpt -> Section
    this.internal.write("/Aside /Sect"); // Sidebar content -> Section (Note requires /ID)
    // Semantic inline elements mapped to Span (closest standard equivalent)
    this.internal.write("/Strong /Span"); // Bold/important text
    this.internal.write("/Em /Span"); // Emphasized/italic text
    // Ensure Em is also mapped (alternative name)
    this.internal.write("/Emphasis /Span"); // Alternative emphasis name
    this.internal.write(">>");
    this.internal.write("endobj");

    // Write StructTreeRoot (objectNumber was reserved earlier)
    // CRITICAL FIX: Use newObjectDeferredBegin instead of out() for deferred objects
    this.internal.newObjectDeferredBegin(root.objectNumber, true);
    this.internal.write("<< /Type /StructTreeRoot");

    if (root.children.length > 0) {
      var rootKids = root.children
        .map(function(c) {
          return c.objectNumber + " 0 R";
        })
        .join(" ");
      this.internal.write("/K [" + rootKids + "]");
    }

    // Add ParentTree reference
    if (this.internal.structureTree.parentTreeObj) {
      this.internal.write(
        "/ParentTree " + this.internal.structureTree.parentTreeObj + " 0 R"
      );
    }

    // Add RoleMap reference
    this.internal.write("/RoleMap " + roleMapObj + " 0 R");

    this.internal.write(">>");
    this.internal.write("endobj");
  };

  /**
   * Add StructTreeRoot reference to Catalog
   */
  var putCatalog = function() {
    if (this.internal.structureTree && this.internal.structureTree.root) {
      var root = this.internal.structureTree.root;
      if (root.objectNumber) {
        this.internal.write("/StructTreeRoot " + root.objectNumber + " 0 R");
      }
    }
  };

  /**
   * Write MarkInfo dictionary to PDF
   * MarkInfo is required for PDF/UA and contains the Marked flag
   */
  var writeMarkInfo = function() {
    if (!this.isPDFUAEnabled || !this.isPDFUAEnabled()) {
      return;
    }

    // CRITICAL FIX: Only write MarkInfo if there are actual structure elements
    // Marked=true without tagged content causes Acrobat to treat everything as artifacts
    if (
      !this.internal.structureTree ||
      !this.internal.structureTree.root ||
      this.internal.structureTree.root.children.length === 0
    ) {
      return;
    }

    if (!this.internal.markInfo) {
      this.internal.markInfo = {};
    }

    // Create MarkInfo dictionary
    var markInfoObjId = this.internal.newObject();
    this.internal.write("<< /Marked true");
    this.internal.write(">>");
    this.internal.write("endobj");

    // Store reference for Catalog
    this.internal.markInfo.objectNumber = markInfoObjId;
  };

  /**
   * Add MarkInfo reference to Catalog for PDF/UA
   */
  var putCatalogMarkInfo = function() {
    if (this.isPDFUAEnabled && this.isPDFUAEnabled()) {
      if (this.internal.markInfo && this.internal.markInfo.objectNumber) {
        this.internal.write(
          "/MarkInfo " + this.internal.markInfo.objectNumber + " 0 R"
        );
      }
    }
  };

  /**
   * Initialize structure tree when PDF/UA is enabled
   */
  jsPDFAPI.events.push([
    "initialized",
    function() {
      if (this.isPDFUAEnabled && this.isPDFUAEnabled()) {
        initStructureTree.call(this);
        createStructTreeRoot.call(this);
      }
    }
  ]);

  /**
   * Write MarkInfo dictionary before structure tree
   */
  jsPDFAPI.events.push(["postPutResources", writeMarkInfo]);

  /**
   * Write structure tree before finalizing PDF
   */
  jsPDFAPI.events.push(["postPutResources", writeStructTree]);

  /**
   * Add MarkInfo reference to Catalog
   */
  jsPDFAPI.events.push(["putCatalog", putCatalogMarkInfo]);

  /**
   * Add StructTreeRoot to Catalog
   */
  jsPDFAPI.events.push(["putCatalog", putCatalog]);

  /**
   * Set document language for PDF/UA
   * Note: This extends the setlanguage.js module to also store language for PDF/UA
   * @param {string} lang - Language code (e.g., 'en-US', 'de-DE')
   * @returns {jsPDF}
   */
  var originalSetLanguage = jsPDFAPI.setLanguage;
  jsPDFAPI.setLanguage = function(lang) {
    // Store for PDF/UA usage
    if (!this.internal.pdfUA) {
      this.internal.pdfUA = {};
    }
    this.internal.pdfUA.language = lang;

    // Call original setLanguage if it exists (for non-PDF/UA documents)
    if (originalSetLanguage) {
      originalSetLanguage.call(this, lang);
    }
    return this;
  };

  /**
   * Get document language for PDF/UA
   * @returns {string} - Language code (default: 'en-US')
   */
  jsPDFAPI.getLanguage = function() {
    if (this.internal.pdfUA && this.internal.pdfUA.language) {
      return this.internal.pdfUA.language;
    }
    return "en-US"; // Default language
  };

  /**
   * Add /Lang to Catalog for document language
   */
  var putCatalogLang = function() {
    if (this.isPDFUAEnabled && this.isPDFUAEnabled()) {
      var lang = this.getLanguage();
      this.internal.write("/Lang (" + lang + ")");
    }
  };

  jsPDFAPI.events.push(["putCatalog", putCatalogLang]);

  /**
   * Add StructParents to each page
   * @param {object} putPageData - Event data containing pageNumber and pageContext
   */
  var putStructParentsInPage = function(putPageData) {
    if (!this.isPDFUAEnabled || !this.isPDFUAEnabled()) {
      return;
    }

    // CRITICAL FIX: Only add page structure properties if there are actual structure elements
    // These properties signal to Acrobat that content should be tagged
    if (
      !this.internal.structureTree ||
      !this.internal.structureTree.root ||
      this.internal.structureTree.root.children.length === 0
    ) {
      return;
    }

    // CRITICAL FIX: Use pageNumber from event data, not getCurrentPageInfo()
    // When putPage is called during PDF generation, currentPage may not match
    // the page actually being written. The event data contains the correct page number.
    var pageNumber = putPageData.pageNumber;
    this.internal.write("/StructParents " + (pageNumber - 1));

    // Add Tabs entry for proper reading order
    this.internal.write("/Tabs /S");

    // Add transparency group for proper color space handling
    this.internal.write(
      "/Group << /Type /Group /S /Transparency /CS /DeviceRGB >>"
    );
  };

  jsPDFAPI.events.push(["putPage", putStructParentsInPage]);

  /**
   * Begin a table header section
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginTableHead = function() {
    return this.beginStructureElement("THead");
  };

  /**
   * Begin a table body section
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginTableBody = function() {
    return this.beginStructureElement("TBody");
  };

  /**
   * Begin a table footer section
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginTableFoot = function() {
    return this.beginStructureElement("TFoot");
  };

  /**
   * End table head section
   * Convenience method for doc.endStructureElement()
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endTableHead = function() {
    return this.endStructureElement();
  };

  /**
   * End table body section
   * Convenience method for doc.endStructureElement()
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endTableBody = function() {
    return this.endStructureElement();
  };

  /**
   * End table footer section
   * Convenience method for doc.endStructureElement()
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endTableFoot = function() {
    return this.endStructureElement();
  };

  /**
   * Begin a table row structure element
   * Convenience method for doc.beginStructureElement('TR')
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginTableRow = function() {
    return this.beginStructureElement("TR");
  };

  /**
   * Begin a table header cell with scope
   * @param {string} scope - 'Row', 'Column', or 'Both'
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginTableHeaderCell = function(scope) {
    if (!scope || !["Row", "Column", "Both"].includes(scope)) {
      throw new Error('Table header scope must be "Row", "Column", or "Both"');
    }

    // Begin TH element with scope attribute
    this.beginStructureElement("TH", { scope: scope });

    return this;
  };

  /**
   * Begin a table data cell
   * Convenience method for doc.beginStructureElement('TD')
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginTableDataCell = function() {
    return this.beginStructureElement("TD");
  };

  /**
   * Begin a list structure element
   * @param {boolean} numbered - Optional: true for ordered list (ol), false for unordered (ul)
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginList = function(numbered) {
    return this.beginStructureElement("L", { numbered: numbered || false });
  };

  /**
   * Begin a numbered list (ordered list / ol)
   * Convenience method for doc.beginList(true)
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginListNumbered = function() {
    return this.beginList(true);
  };

  /**
   * Begin a list item structure element
   * Convenience method for doc.beginStructureElement('LI')
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginListItem = function() {
    return this.beginStructureElement("LI");
  };

  /**
   * Add a list label (bullet point or number)
   * Automatically wraps the label in an Lbl structure element
   * @param {string} label - The label text (e.g., "•", "1.", "a)")
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.addListLabel = function(label, x, y) {
    this.beginStructureElement("Lbl");
    this.text(label, x, y);
    this.endStructureElement();
    return this;
  };

  /**
   * Begin list body (content of list item)
   * Convenience method for doc.beginStructureElement('LBody')
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginListBody = function() {
    return this.beginStructureElement("LBody");
  };

  /**
   * End list body
   * Convenience method for doc.endStructureElement()
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endListBody = function() {
    return this.endStructureElement();
  };

  /**
   * End list
   * Convenience method for doc.endStructureElement()
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endList = function() {
    return this.endStructureElement();
  };

  /**
   * Begin a link structure element
   * Links must be wrapped in Link elements for PDF/UA accessibility
   *
   * @param {string|Object} [options] - URL string or options object
   * @param {string} [options.url] - External URL
   * @param {number} [options.pageNumber] - Internal page number (1-based)
   * @param {string} [options.placement] - 'Block' for standalone links, omit for inline.
   *        Use 'Block' when link is not inside a paragraph (P) element.
   *        Required by PAC for correct alternate presentations.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // External link (inline in paragraph)
   * doc.beginStructureElement('P');
   * doc.text('Visit ', 20, 50);
   * doc.beginLink('https://example.com');
   * doc.text('our website', 35, 50);
   * doc.endLink();
   * doc.endStructureElement();
   *
   * @example
   * // Standalone link (block-level)
   * doc.beginLink({ url: 'https://example.com', placement: 'Block' });
   * doc.text('Click here', 20, 50);
   * doc.endLink();
   */
  jsPDFAPI.beginLink = function(options) {
    // Store link options for endLink to create the annotation
    if (!this.internal.pdfuaLinkState) {
      this.internal.pdfuaLinkState = [];
    }

    var linkData = {
      startX: null,
      startY: null,
      options: null
    };

    var attributes = {};

    // Parse options
    if (typeof options === "string") {
      linkData.options = { url: options };
    } else if (
      options &&
      (options.url || options.pageNumber || options.placement)
    ) {
      linkData.options = options;
      // Placement attribute for standalone (block-level) links
      if (options.placement) {
        attributes.placement = options.placement;
      }
    }

    // Store current position as link start
    // We'll capture text position when text is rendered
    this.internal.pdfuaLinkState.push(linkData);

    return this.beginStructureElement("Link", attributes);
  };

  /**
   * End a link structure element and create the link annotation
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endLink = function() {
    // Get link data
    var linkState = this.internal.pdfuaLinkState;
    if (linkState && linkState.length > 0) {
      var linkData = linkState.pop();

      // Create link annotation if we have options and text bounds
      if (linkData.options && linkData.textBounds) {
        var bounds = linkData.textBounds;
        this.link(
          bounds.x,
          bounds.y,
          bounds.width,
          bounds.height,
          linkData.options
        );
      }
    }

    return this.endStructureElement();
  };

  /**
   * Begin a Strong (important) text section
   * For text that has semantic importance (not just visual bold)
   * Screen readers may announce this text with emphasis or different intonation
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginStrong = function() {
    return this.beginStructureElement("Strong");
  };

  /**
   * End a Strong text section
   * Convenience method for doc.endStructureElement()
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endStrong = function() {
    return this.endStructureElement();
  };

  /**
   * Begin an Em (emphasis) text section
   * For text that has semantic emphasis (not just visual italic)
   * Screen readers may announce this text with changed intonation
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginEmphasis = function() {
    return this.beginStructureElement("Em");
  };

  /**
   * End an Em text section
   * Convenience method for doc.endStructureElement()
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endEmphasis = function() {
    return this.endStructureElement();
  };

  /**
   * Begin a Span (generic inline container) element
   * Used for formatting changes without semantic meaning,
   * or for language changes within a paragraph.
   *
   * Unlike Strong/Em, Span has no inherent semantic significance.
   * Use it for:
   * - Visual formatting (color, size changes)
   * - Language changes within text
   * - Grouping inline content
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code (e.g., 'en-US', 'de-DE') for text within span
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginSpan = function(options) {
    options = options || {};
    var attributes = {};

    // If language is specified, store it for BDC operator
    if (options.lang) {
      attributes.lang = options.lang;
    }

    return this.beginStructureElement("Span", attributes);
  };

  /**
   * End a Span element
   * Convenience method for doc.endStructureElement()
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endSpan = function() {
    return this.endStructureElement();
  };

  /**
   * Begin a Quote (inline quotation) element
   * For short quotes within a paragraph, attributed to another author.
   * Corresponds to HTML <q> element.
   *
   * Use Quote for:
   * - Short quotations within flowing text
   * - Inline citations
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code (e.g., 'en-US', 'de-DE') for quoted text
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginQuote = function(options) {
    options = options || {};
    var attributes = {};

    // If language is specified, store it for BDC operator
    if (options.lang) {
      attributes.lang = options.lang;
    }

    return this.beginStructureElement("Quote", attributes);
  };

  /**
   * End a Quote element
   * Convenience method for doc.endStructureElement()
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endQuote = function() {
    return this.endStructureElement();
  };

  /**
   * Begin a BlockQuote (block-level quotation) element
   * For longer quotes that stand as separate paragraphs.
   * Corresponds to HTML <blockquote> element.
   *
   * Use BlockQuote for:
   * - Longer quotations that are visually set apart
   * - Multi-paragraph quotes
   * - Block-level citations
   *
   * BlockQuote can contain P, L (lists), and other block-level elements.
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code (e.g., 'en-US', 'de-DE') for quoted text
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginBlockQuote = function(options) {
    options = options || {};
    var attributes = {};

    // If language is specified, store it for BDC operator
    if (options.lang) {
      attributes.lang = options.lang;
    }

    return this.beginStructureElement("BlockQuote", attributes);
  };

  /**
   * End a BlockQuote element
   * Convenience method for doc.endStructureElement()
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endBlockQuote = function() {
    return this.endStructureElement();
  };

  /**
   * Begin a Caption element
   * For figure captions, table captions, or other descriptive labels.
   * Corresponds to HTML <figcaption> or <caption> elements.
   *
   * Use Caption for:
   * - Image/figure descriptions ("Abbildung 1: ...")
   * - Table titles or descriptions
   * - Diagram labels
   * - Chart descriptions
   *
   * Typical structure:
   *   Figure (container)
   *   ├── (image content)
   *   └── Caption
   *       └── "Abbildung 1: Beschreibung des Bildes"
   *
   * Or for tables:
   *   Table
   *   ├── Caption
   *   │   └── "Tabelle 1: Übersicht der Ergebnisse"
   *   └── (table content)
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code for caption text
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginCaption = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    return this.beginStructureElement("Caption", attributes);
  };

  /**
   * End a Caption element
   * Convenience method for doc.endStructureElement()
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endCaption = function() {
    return this.endStructureElement();
  };

  /**
   * Begin a Figure container element
   * Use this to group an image with its caption.
   *
   * Note: This is different from adding an image with addImage().
   * Use beginFigure() when you need to:
   * - Add a caption to an image
   * - Group multiple related images
   * - Create a figure with complex content
   *
   * For simple images without captions, use addImage() directly.
   *
   * Typical structure:
   *   doc.beginFigure({
   *     alt: 'Description of image',
   *     bbox: [x, y, width, height]  // Bounding box in points
   *   });
   *     doc.addImage({...});  // Image with alt text
   *     doc.beginCaption();
   *       doc.text('Figure 1: Description', x, y);
   *     doc.endCaption();
   *   doc.endFigure();
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code for figure content
   * @param {string} [options.alt] - Alternative text for the figure (required for PDF/UA)
   * @param {Array|Object} [options.bbox] - Bounding box for the figure.
   *        Can be array [x, y, width, height] or object {x, y, width, height}.
   *        Coordinates are in points from bottom-left of page.
   *        Recommended for accessibility (PAC checker).
   * @param {string} [options.placement] - 'Block' (default) or 'Inline'. Figures are
   *        typically block-level. Required by PAC for correct alternate presentations.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginFigure = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    // PDF/UA requires Figure elements to have Alt or ActualText
    if (options.alt) {
      attributes.alt = options.alt;
    }

    // BBox (Bounding Box) for figure positioning in alternate presentations
    // Recommended by PAC (PDF Accessibility Checker) for better accessibility
    if (options.bbox) {
      attributes.bbox = options.bbox;
    }

    // Placement attribute - Figure is typically a block-level element.
    // Default to 'Block' for PAC compliance in alternate presentations.
    attributes.placement =
      options.placement !== undefined ? options.placement : "Block";

    return this.beginStructureElement("Figure", attributes);
  };

  /**
   * End a Figure container element
   * Convenience method for doc.endStructureElement()
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endFigure = function() {
    return this.endStructureElement();
  };

  /**
   * Begin a TOC (Table of Contents) container element.
   * Groups all table of contents items (TOCI elements).
   *
   * According to BITi 02.1.1, a TOC element may only contain:
   * - TOCI elements (table of contents items)
   * - Nested TOC elements (for sub-sections)
   *
   * Structure example:
   *   TOC
   *   ├── TOCI (Chapter 1)
   *   │   └── Reference → "1. Einleitung .......... 5"
   *   ├── TOCI (Chapter 2)
   *   │   ├── Reference → "2. Hauptteil .......... 12"
   *   │   └── TOC (nested for subsections)
   *   │       └── TOCI → "2.1 Abschnitt .......... 13"
   *   └── TOCI (Chapter 3)
   *       └── Reference → "3. Schluss .......... 25"
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code for TOC content
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginTOC = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    return this.beginStructureElement("TOC", attributes);
  };

  /**
   * End a TOC container element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endTOC = function() {
    return this.endStructureElement();
  };

  /**
   * Begin a TOCI (Table of Contents Item) element.
   * Represents a single entry in the table of contents.
   *
   * According to BITi 02.1.1, a TOCI may contain:
   * - Lbl (label/number)
   * - Reference (link to document content)
   * - NonStruct (for decorative elements like dotted lines)
   * - P (paragraph)
   * - TOC (nested table of contents for sub-items)
   *
   * Typical structure:
   *   TOCI
   *   └── Reference
   *       └── "1. Kapitelname .......... 5"
   *
   * Or with nested sub-sections:
   *   TOCI
   *   ├── Reference → "2. Hauptteil"
   *   └── TOC
   *       ├── TOCI → "2.1 Unterabschnitt"
   *       └── TOCI → "2.2 Weiterer Abschnitt"
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code for this entry
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginTOCI = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    return this.beginStructureElement("TOCI", attributes);
  };

  /**
   * End a TOCI element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endTOCI = function() {
    return this.endStructureElement();
  };

  /**
   * Begin a Code (computer code) element
   * For inline code snippets or block-level code sections.
   * Corresponds to HTML <code> element.
   *
   * Use Code for:
   * - Inline code snippets (variable names, function calls)
   * - Block-level code examples
   * - Command-line instructions
   * - File paths and URLs in technical context
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code (e.g., 'en-US', 'de-DE') for code comments
   * @param {string} [options.placement] - 'Block' for block-level code, omit for inline.
   *        Required by PAC for correct alternate presentations.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginCode = function(options) {
    options = options || {};
    var attributes = {};

    // If language is specified, store it for BDC operator
    if (options.lang) {
      attributes.lang = options.lang;
    }

    // Placement attribute for block-level code sections
    if (options.placement) {
      attributes.placement = options.placement;
    }

    return this.beginStructureElement("Code", attributes);
  };

  /**
   * End a Code element
   * Convenience method for doc.endStructureElement()
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endCode = function() {
    return this.endStructureElement();
  };

  /**
   * Begin a Reference element (citation to footnote/endnote)
   * For the superscript number or symbol in the main text that
   * refers to a footnote or endnote.
   *
   * Use Reference for:
   * - Footnote numbers in running text
   * - Endnote references
   * - Cross-references to notes
   *
   * If label, labelX, and labelY are provided, an Lbl element is automatically
   * created with the label text rendered as superscript.
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.noteId] - ID of the Note to link to (creates clickable link)
   * @param {string} [options.label] - Label text (e.g., '¹', '²', '*'). If provided with
   *                                   labelX and labelY, automatically creates Lbl element.
   * @param {number} [options.labelX] - X position for the label
   * @param {number} [options.labelY] - Y position for the label (baseline)
   * @param {number} [options.labelFontSize] - Font size for label (default: 70% of current)
   * @param {number} [options.labelYOffset] - Y offset for superscript (default: -2)
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginReference = function(options) {
    options = options || {};
    var attributes = {};

    // Store noteId for creating link in endReference
    if (options.noteId) {
      if (!this.internal.pdfuaFootnotes) {
        this.internal.pdfuaFootnotes = {
          noteDestinations: {}, // Maps noteId -> { page, y }
          pendingReferences: [] // References waiting for link creation
        };
      }
      this.internal.pdfuaFootnotes.currentReferenceNoteId = options.noteId;
    }

    this.beginStructureElement("Reference", attributes);

    // Store noteId on the Reference element for /Ref attribute (PDF/UA requirement)
    if (
      options.noteId &&
      this.internal.structureTree &&
      this.internal.structureTree.currentParent
    ) {
      this.internal.structureTree.currentParent.refNoteId = options.noteId;
    }

    // Automatic Lbl element if label is provided with position
    if (
      options.label &&
      options.labelX !== undefined &&
      options.labelY !== undefined
    ) {
      var originalFontSize = this.getFontSize();
      var labelFontSize = options.labelFontSize || originalFontSize * 0.7;
      var labelYOffset =
        options.labelYOffset !== undefined ? options.labelYOffset : -2;

      this.beginStructureElement("Lbl");
      this.setFontSize(labelFontSize);
      this.text(options.label, options.labelX, options.labelY + labelYOffset);
      this.setFontSize(originalFontSize);
      this.endStructureElement(); // /Lbl
    }

    return this;
  };

  /**
   * End a Reference element
   * Convenience method for doc.endStructureElement()
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endReference = function() {
    return this.endStructureElement();
  };

  /**
   * Add a complete footnote reference (superscript number) in one call
   * Creates the structure: Reference > Lbl > text
   *
   * This is a convenience method that combines beginReference, Lbl element,
   * text rendering, and endReference into a single call.
   *
   * @param {string} label - The label text (e.g., '¹', '²', '*', '†')
   * @param {number} x - X position for the label
   * @param {number} y - Y position (baseline) for the label
   * @param {Object} [options] - Optional settings
   * @param {string} [options.noteId] - ID of the associated Note for linking
   * @param {number} [options.fontSize] - Font size for the label (default: 70% of current)
   * @param {number} [options.yOffset] - Y offset for superscript effect (default: -2)
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Simple footnote reference
   * doc.text('Some important text', 20, 40);
   * doc.addFootnoteRef('¹', 80, 40, { noteId: 'fn1' });
   *
   * // With custom formatting
   * doc.addFootnoteRef('*', 100, 50, { noteId: 'fn2', fontSize: 8, yOffset: -3 });
   */
  jsPDFAPI.addFootnoteRef = function(label, x, y, options) {
    options = options || {};

    var originalFontSize = this.getFontSize();
    var labelFontSize = options.fontSize || originalFontSize * 0.7;
    var yOffset = options.yOffset !== undefined ? options.yOffset : -2;

    this.beginReference({ noteId: options.noteId });

    this.beginStructureElement("Lbl");
    this.setFontSize(labelFontSize);
    this.text(label, x, y + yOffset);
    this.setFontSize(originalFontSize);
    this.endStructureElement(); // /Lbl

    this.endReference();

    return this;
  };

  /**
   * Add a link from the current Reference to its Note
   * Call this after adding the reference content (e.g., the superscript number)
   *
   * @param {number} x - X coordinate of link area
   * @param {number} y - Y coordinate of link area
   * @param {number} width - Width of link area
   * @param {number} height - Height of link area
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.addFootnoteLink = function(x, y, width, height, label) {
    if (
      !this.internal.pdfuaFootnotes ||
      !this.internal.pdfuaFootnotes.currentReferenceNoteId
    ) {
      return this;
    }

    var noteId = this.internal.pdfuaFootnotes.currentReferenceNoteId;
    var pageNumber = this.internal.getCurrentPageInfo().pageNumber;

    // Store pending reference link info (includes label for back-link)
    this.internal.pdfuaFootnotes.pendingReferences.push({
      noteId: noteId,
      page: pageNumber,
      x: x,
      y: y,
      width: width,
      height: height,
      label: label || noteId // Use label for back-link text, fallback to noteId
    });

    // Clear current reference
    this.internal.pdfuaFootnotes.currentReferenceNoteId = null;

    return this;
  };

  /**
   * Begin a Note element (footnote/endnote content)
   * For the actual footnote or endnote text.
   *
   * Use Note for:
   * - Footnotes at the bottom of the page
   * - Endnotes at the end of a chapter or document
   * - Explanatory notes referenced from the main text
   *
   * PDF/UA requires:
   * - Each Note must have a unique ID
   * - Note should contain Lbl (label) element
   *
   * By default, a back-link to the reference is automatically added when
   * endNote() is called. Use noBackLink: true to disable this.
   *
   * A visually hidden announcement text ("Fußnote: " or "Footnote: ") is
   * automatically added for screen readers. This text is positioned off-page
   * and invisible to sighted users but readable by assistive technology.
   *
   * If label is provided with labelX and labelY, an Lbl element is automatically
   * created and a P element is opened for the note content. The P element will
   * be automatically closed when endNote() is called.
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.id] - Unique ID (required for PDF/UA compliance)
   * @param {string} [options.placement] - 'Block' for block-level notes (footnotes/endnotes).
   *        Note is inline by default. Use 'Block' for footnotes at page bottom.
   *        Required by PAC for correct presentation in alternate formats.
   * @param {number} [options.y] - Y position of the note (for link destination)
   * @param {boolean} [options.noBackLink] - Set to true to disable automatic back-link
   * @param {string|null|false} [options.announceText] - Custom announcement text for screen readers.
   *        Defaults to "Fußnote: " (German) or "Footnote: " (other languages).
   *        Set to null or false to disable announcement.
   * @param {string} [options.label] - Label text (e.g., '¹'). If provided with labelX and labelY,
   *                                   automatically creates Lbl element and opens P element.
   * @param {number} [options.labelX] - X position for the label
   * @param {number} [options.labelY] - Y position for the label
   * @param {number} [options.labelFontSize] - Font size for label (default: 80% of current)
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginNote = function(options) {
    options = options || {};
    var attributes = {};

    // Auto-generate ID if not provided (required for PDF/UA compliance)
    var noteId = options.id;
    if (!noteId) {
      if (!this.internal.pdfuaNoteCounter) {
        this.internal.pdfuaNoteCounter = 0;
      }
      this.internal.pdfuaNoteCounter++;
      noteId = "note-" + this.internal.pdfuaNoteCounter;
    }
    attributes.id = noteId;

    // Placement attribute - Note is inline by default, but footnotes/endnotes
    // are typically block-level elements and need /Placement /Block
    // This is required by PAC for correct presentation in alternate formats
    if (options.placement) {
      attributes.placement = options.placement;
    }

    // Register note destination for footnote links
    if (!this.internal.pdfuaFootnotes) {
      this.internal.pdfuaFootnotes = {
        noteDestinations: {},
        pendingReferences: [],
        pendingBackLinks: []
      };
    }

    var pageNumber = this.internal.getCurrentPageInfo().pageNumber;
    this.internal.pdfuaFootnotes.noteDestinations[noteId] = {
      page: pageNumber,
      y: options.y || 0 // Y position for destination
    };

    // Store current note info for back-link generation
    this.internal.pdfuaFootnotes.currentNoteId = noteId;
    this.internal.pdfuaFootnotes.currentNoteNoBackLink =
      options.noBackLink || false;

    this.beginStructureElement("Note", attributes);

    // Store Note structure element reference for /Ref attribute in Reference elements (PDF/UA requirement)
    if (!this.internal.pdfuaFootnotes.noteElements) {
      this.internal.pdfuaFootnotes.noteElements = {};
    }
    this.internal.pdfuaFootnotes.noteElements[
      noteId
    ] = this.internal.structureTree.currentParent;

    // Add screen reader announcement (visually hidden)
    // Determine announcement text based on document language or option
    var announceText = options.announceText;
    if (announceText === undefined) {
      // Auto-detect based on document language
      var lang = this.getLanguage ? this.getLanguage() : "en";
      if (lang && lang.toLowerCase().startsWith("de")) {
        announceText = "Fußnote: ";
      } else {
        announceText = "Footnote: ";
      }
    }

    if (
      announceText !== null &&
      announceText !== false &&
      announceText !== ""
    ) {
      // Render announcement text with minimal font size (visually hidden but readable by screen reader)
      var originalFontSize = this.getFontSize();
      this.setFontSize(0.5); // Very small but still readable by screen readers

      this.beginSpan();
      this.text(announceText, -1000, -1000); // Position off-page (invisible)
      this.endSpan();

      this.setFontSize(originalFontSize);
    }

    // Automatic Lbl element and P opening if label is provided with position
    if (
      options.label &&
      options.labelX !== undefined &&
      options.labelY !== undefined
    ) {
      var originalFontSize = this.getFontSize();
      var labelFontSize = options.labelFontSize || originalFontSize * 0.8;

      this.beginStructureElement("Lbl");
      this.setFontSize(labelFontSize);
      this.text(options.label, options.labelX, options.labelY);
      this.setFontSize(originalFontSize);
      this.endStructureElement(); // /Lbl

      // Open P element for note content - will be closed in endNote()
      this.beginStructureElement("P");
      this.internal.pdfuaNoteAutoP = true;
    }

    return this;
  };

  /**
   * End a Note element
   * Automatically closes P element if it was opened by beginNote({ label }).
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endNote = function() {
    // Automatically close P if it was opened by beginNote({ label })
    if (this.internal.pdfuaNoteAutoP) {
      this.endStructureElement(); // /P
      this.internal.pdfuaNoteAutoP = false;
    }
    return this.endStructureElement(); // /Note
  };

  /**
   * Add a complete footnote in one call
   * Creates the structure: Note > [SR-announcement] > Lbl > P > text
   *
   * This is a convenience method that creates a complete footnote with
   * proper PDF/UA structure in a single call.
   *
   * @param {Object} options - Footnote configuration
   * @param {string} options.id - Unique ID for the Note (required for PDF/UA)
   * @param {string} options.label - The label text (e.g., '¹', '²', '*')
   * @param {string|string[]} options.text - The footnote text (string or array for multiline)
   * @param {number} options.x - X position for the text
   * @param {number} options.y - Y position for the first line
   * @param {number} [options.labelX] - X position for the label (default: x - 5)
   * @param {number} [options.lineHeight] - Line spacing for multiline text (default: 8)
   * @param {number} [options.labelFontSize] - Font size for label (default: 80% of current)
   * @param {string} [options.placement] - 'Block' (default) or 'Inline'. Footnotes are block-level by default.
   * @param {string|null|false} [options.announceText] - Custom SR announcement (default: auto)
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Simple footnote
   * doc.addFootnote({
   *   id: 'fn1',
   *   label: '¹',
   *   text: 'ISO 14289-1:2014, Document management',
   *   x: 25,
   *   y: 260
   * });
   *
   * // Multiline footnote
   * doc.addFootnote({
   *   id: 'fn2',
   *   label: '²',
   *   text: ['First line of the footnote.', 'Second line continues here.'],
   *   x: 25,
   *   y: 275,
   *   lineHeight: 10
   * });
   */
  jsPDFAPI.addFootnote = function(options) {
    options = options || {};

    var labelX = options.labelX !== undefined ? options.labelX : options.x - 5;
    var textArray = Array.isArray(options.text) ? options.text : [options.text];
    var lineHeight = options.lineHeight || 8;

    this.beginNote({
      id: options.id,
      y: options.y,
      placement: options.placement !== undefined ? options.placement : "Block", // Footnotes are block-level by default
      announceText: options.announceText
    });

    // Lbl element
    var originalFontSize = this.getFontSize();
    var labelFontSize = options.labelFontSize || originalFontSize * 0.8;

    this.beginStructureElement("Lbl");
    this.setFontSize(labelFontSize);
    this.text(options.label, labelX, options.y);
    this.setFontSize(originalFontSize);
    this.endStructureElement(); // /Lbl

    // P element with text
    this.beginStructureElement("P");
    var currentY = options.y;
    for (var i = 0; i < textArray.length; i++) {
      this.text(textArray[i], options.x, currentY);
      currentY += lineHeight;
    }
    this.endStructureElement(); // /P

    this.endNote();

    return this;
  };

  /**
   * Add a back-link from the current Note to its Reference
   * Call this at the end of the note content, before endNote()
   *
   * @param {number} x - X coordinate for back-link
   * @param {number} y - Y coordinate for back-link
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.addNoteBackLink = function(x, y) {
    if (
      !this.internal.pdfuaFootnotes ||
      !this.internal.pdfuaFootnotes.currentNoteId
    ) {
      return this;
    }

    var noteId = this.internal.pdfuaFootnotes.currentNoteId;

    // Find the reference that points to this note
    var ref = null;
    for (
      var i = 0;
      i < this.internal.pdfuaFootnotes.pendingReferences.length;
      i++
    ) {
      if (this.internal.pdfuaFootnotes.pendingReferences[i].noteId === noteId) {
        ref = this.internal.pdfuaFootnotes.pendingReferences[i];
        break;
      }
    }

    if (!ref) {
      return this; // No reference found for this note
    }

    var pageNumber = this.internal.getCurrentPageInfo().pageNumber;

    // Only create back-links for cross-page references (same page has no effect)
    if (pageNumber === ref.page) {
      return this; // Skip same-page back-links entirely (no text, no link)
    }

    var label = ref.label;

    // Render the back-link label (small, superscript-like)
    var originalFontSize = this.getFontSize();
    this.setFontSize(8);

    // Create Link structure element for the back-link
    this.beginLink();
    this.text(label, x, y);
    this.endLink();

    // Calculate link dimensions
    var linkWidth = this.getTextWidth(label) + 2;
    var linkHeight = 10;

    // Store pending back-link info (includes target Y for precise navigation)
    this.internal.pdfuaFootnotes.pendingBackLinks =
      this.internal.pdfuaFootnotes.pendingBackLinks || [];
    this.internal.pdfuaFootnotes.pendingBackLinks.push({
      targetPage: ref.page,
      targetY: ref.y, // Y position of the reference for precise back-navigation
      sourcePage: pageNumber,
      x: x - 1,
      y: y - 3,
      width: linkWidth,
      height: linkHeight
    });

    this.setFontSize(originalFontSize);

    return this;
  };

  /**
   * Create all pending footnote links and back-links
   * Called internally before PDF output to resolve note destinations
   */
  var createFootnoteLinks = function() {
    if (!this.internal.pdfuaFootnotes) {
      return;
    }

    var footnotes = this.internal.pdfuaFootnotes;
    var self = this;
    var getHorizontalCoordinateString = this.internal.getCoordinateString;
    var getVerticalCoordinateString = this.internal.getVerticalCoordinateString;

    // Create forward links (Reference -> Note)
    footnotes.pendingReferences.forEach(function(ref) {
      var dest = footnotes.noteDestinations[ref.noteId];
      if (dest) {
        // Get the page where the reference is located (NOT current page)
        var refPageInfo = self.internal.getPageInfo(ref.page);

        // Create annotation object with PDF/UA compliance
        // Generate unique internal ID for this annotation
        if (!self.internal.pdfuaLinkCounter) {
          self.internal.pdfuaLinkCounter = 0;
        }
        var internalId = ++self.internal.pdfuaLinkCounter;

        var annotation = {
          finalBounds: {
            x: getHorizontalCoordinateString(ref.x),
            y: getVerticalCoordinateString(ref.y),
            w: getHorizontalCoordinateString(ref.x + ref.width),
            h: getVerticalCoordinateString(ref.y + ref.height)
          },
          options: {
            pageNumber: dest.page
          },
          type: "link",
          // PDF/UA compliance properties
          needsObjId: true,
          internalId: internalId,
          contentsText: "Zur Fußnote " + ref.label
        };

        // Add annotation to the REFERENCE's page, not the current page
        refPageInfo.pageContext.annotations.push(annotation);
      }
    });

    // Create back-links (Note -> Reference)
    if (footnotes.pendingBackLinks) {
      footnotes.pendingBackLinks.forEach(function(backLink) {
        // Only create back-links for cross-page references (same page has no effect)
        if (backLink.sourcePage === backLink.targetPage) {
          return; // Skip same-page back-links
        }

        // Get the page where the back-link is located (the note's page)
        var notePageInfo = self.internal.getPageInfo(backLink.sourcePage);

        // Create annotation object for back-link with Y position for precise navigation
        // Generate unique internal ID for this annotation
        if (!self.internal.pdfuaLinkCounter) {
          self.internal.pdfuaLinkCounter = 0;
        }
        var backLinkInternalId = ++self.internal.pdfuaLinkCounter;

        var annotation = {
          finalBounds: {
            x: getHorizontalCoordinateString(backLink.x),
            y: getVerticalCoordinateString(backLink.y),
            w: getHorizontalCoordinateString(backLink.x + backLink.width),
            h: getVerticalCoordinateString(backLink.y + backLink.height)
          },
          options: {
            pageNumber: backLink.targetPage,
            top: backLink.targetY // Y position of reference for precise back-navigation
          },
          type: "link",
          // PDF/UA compliance properties
          needsObjId: true,
          internalId: backLinkInternalId,
          contentsText: "Zurück zum Text"
        };

        // Add annotation to the NOTE's page
        notePageInfo.pageContext.annotations.push(annotation);
      });

      // Clear pending back-links
      footnotes.pendingBackLinks = [];
    }

    // Clear pending references
    footnotes.pendingReferences = [];
  };

  /**
   * Hook into PDF output to create footnote links
   * Use 'buildDocument' event which fires before pages are written
   */
  jsPDFAPI.events.push(["buildDocument", createFootnoteLinks]);

  /**
   * Add a link annotation reference (OBJR) to the current Link structure element
   * This connects the Link structure element to the actual Link annotation
   * Required for PDF/UA accessibility
   * @param {number} annotationInternalId - Internal ID of the link annotation (from link())
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.addLinkAnnotationRef = function(annotationInternalId) {
    if (
      !this.internal.structureTree ||
      !this.internal.structureTree.currentParent
    ) {
      return this;
    }

    var currentElem = this.internal.structureTree.currentParent;

    // Only add to Link elements
    if (currentElem.type !== "Link") {
      console.warn("addLinkAnnotationRef called outside of Link element");
      return this;
    }

    // Store the internal ID - the actual object ID will be resolved later
    // during writeStructTree when pdfuaLinkIdMap is available
    if (!currentElem.annotationInternalIds) {
      currentElem.annotationInternalIds = [];
    }
    currentElem.annotationInternalIds.push(annotationInternalId);

    // Track which Link structure element owns this link annotation's StructParent
    // This is needed for the ParentTree to correctly reference the Link element
    if (!this.internal.structureTree.linkParentMap) {
      this.internal.structureTree.linkParentMap = {};
    }
    // Store reference: internalId -> Link element
    this.internal.structureTree.linkParentMap[
      annotationInternalId
    ] = currentElem;

    return this;
  };

  // ============================================================
  // FORM FIELD API - For accessible form fields (BITi 02.4.2)
  // ============================================================

  /**
   * Begin a Form structure element for accessible form fields.
   * Each form field widget annotation must be wrapped in a Form element
   * for PDF/UA compliance.
   *
   * The Form element provides:
   * - Screen reader access to the field
   * - Proper structure tree hierarchy
   * - Connection to the widget annotation via OBJR
   *
   * @param {Object} [options] - Options for the form element
   * @param {string} [options.lang] - Language code for form field labels
   * @param {string} [options.placement] - 'Block' (default) or 'Inline'. Form fields are
   *        typically block-level. Required by PAC for correct alternate presentations.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * doc.beginFormField();
   *   // Add the actual AcroForm field
   *   doc.addField(textField);
   *   // Add OBJR reference
   *   doc.addFormFieldRef(textField._pdfuaInternalId);
   * doc.endFormField();
   */
  jsPDFAPI.beginFormField = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    // Placement attribute - Form fields are typically block-level elements.
    // Default to 'Block' for PAC compliance in alternate presentations.
    attributes.placement =
      options.placement !== undefined ? options.placement : "Block";

    // PDF/UA requires either:
    // 1. Form has exactly one child (OBJR to widget) - OR
    // 2. Form has a Role attribute
    // Since we may add label text as children, we add Role attribute
    // Role can be: Rb (radio button), Cb (checkbox), Pb (push button),
    //              Tv (text value), Lb (list box)
    attributes.role = options.role || "Tv"; // Default to text value

    return this.beginStructureElement("Form", attributes);
  };

  /**
   * End a Form structure element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endFormField = function() {
    return this.endStructureElement();
  };

  /**
   * Add a form field annotation reference (OBJR) to the current Form structure element.
   * This connects the Form structure element to the widget annotation.
   * Required for PDF/UA accessibility.
   *
   * @param {number} fieldInternalId - Internal ID of the form field (from _pdfuaInternalId)
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.addFormFieldRef = function(fieldInternalId) {
    if (
      !this.internal.structureTree ||
      !this.internal.structureTree.currentParent
    ) {
      return this;
    }

    var currentElem = this.internal.structureTree.currentParent;

    // Only add to Form elements
    if (currentElem.type !== "Form") {
      console.warn("addFormFieldRef called outside of Form element");
      return this;
    }

    // Store the internal ID - the actual object ID will be resolved later
    // during writeStructTree when pdfuaFormFieldIdMap is available
    if (!currentElem.formFieldInternalIds) {
      currentElem.formFieldInternalIds = [];
    }
    currentElem.formFieldInternalIds.push(fieldInternalId);

    // Track which Form structure element owns this form field's StructParent
    // This is needed for the ParentTree to correctly reference the Form element
    if (!this.internal.structureTree.formFieldParentMap) {
      this.internal.structureTree.formFieldParentMap = {};
    }
    // Store reference: internalId -> Form element
    this.internal.structureTree.formFieldParentMap[
      fieldInternalId
    ] = currentElem;

    return this;
  };

  // ============================================================
  // ARTIFACT API - For content that should be ignored by screen readers
  // ============================================================

  /**
   * Begin an artifact block.
   * Content within artifacts is ignored by screen readers (BITi 01.0, 01.1).
   *
   * Use artifacts for:
   * - Headers and footers (use type: 'Pagination', subtype: 'Header'/'Footer')
   * - Page numbers (use type: 'Pagination')
   * - Decorative images, lines, borders
   * - Background colors and patterns
   * - Watermarks
   *
   * PDF/UA Requirements:
   * - Headers/footers MUST be marked as artifacts with Type=Pagination
   * - Subtype MUST be Header or Footer for headers/footers
   *
   * @param {Object} [options] - Artifact options
   * @param {string} [options.type] - Artifact type: 'Pagination', 'Layout', 'Page', 'Background'
   * @param {string} [options.subtype] - Artifact subtype: 'Header', 'Footer' (for Pagination type)
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Simple decorative artifact
   * doc.beginArtifact();
   * doc.line(20, 100, 190, 100);  // Decorative line
   * doc.endArtifact();
   *
   * @example
   * // Header artifact (required format for PDF/UA)
   * doc.beginArtifact({ type: 'Pagination', subtype: 'Header' });
   * doc.text('Document Title', 20, 15);
   * doc.endArtifact();
   *
   * @example
   * // Footer with page number
   * doc.beginArtifact({ type: 'Pagination', subtype: 'Footer' });
   * doc.text('Page ' + pageNum, 100, 285);
   * doc.endArtifact();
   */
  jsPDFAPI.beginArtifact = function(options) {
    options = options || {};

    // Initialize artifact state if needed
    if (!this.internal.pdfuaArtifact) {
      this.internal.pdfuaArtifact = {
        active: false,
        type: null,
        subtype: null,
        depth: 0
      };
    }

    // Store artifact properties
    this.internal.pdfuaArtifact.active = true;
    this.internal.pdfuaArtifact.type = options.type || null;
    this.internal.pdfuaArtifact.subtype = options.subtype || null;
    this.internal.pdfuaArtifact.depth++;

    return this;
  };

  /**
   * End an artifact block.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endArtifact = function() {
    if (this.internal.pdfuaArtifact && this.internal.pdfuaArtifact.depth > 0) {
      this.internal.pdfuaArtifact.depth--;
      if (this.internal.pdfuaArtifact.depth === 0) {
        this.internal.pdfuaArtifact.active = false;
        this.internal.pdfuaArtifact.type = null;
        this.internal.pdfuaArtifact.subtype = null;
      }
    }
    return this;
  };

  /**
   * Check if currently inside an artifact block
   * @returns {boolean} - True if inside artifact block
   */
  jsPDFAPI.isInArtifact = function() {
    return this.internal.pdfuaArtifact && this.internal.pdfuaArtifact.active;
  };

  /**
   * Get current artifact properties (type and subtype)
   * @returns {Object|null} - Artifact properties or null if not in artifact
   */
  jsPDFAPI.getArtifactProperties = function() {
    if (!this.isInArtifact()) {
      return null;
    }
    return {
      type: this.internal.pdfuaArtifact.type,
      subtype: this.internal.pdfuaArtifact.subtype
    };
  };

  /**
   * Convenience method for header artifact
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginHeader = function() {
    return this.beginArtifact({ type: "Pagination", subtype: "Header" });
  };

  /**
   * End header artifact
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endHeader = function() {
    return this.endArtifact();
  };

  /**
   * Convenience method for footer artifact
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginFooter = function() {
    return this.beginArtifact({ type: "Pagination", subtype: "Footer" });
  };

  /**
   * End footer artifact
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endFooter = function() {
    return this.endArtifact();
  };

  // ============================================================
  // ABBREVIATION API - For abbreviations with expansion text
  // BITi 02.2.3.1 - Abkürzungen
  // ============================================================

  /**
   * Begin an abbreviation element with expansion text.
   * The /E (Expansion) attribute provides the full form of the abbreviation
   * for screen readers to announce.
   *
   * According to PDF 1.7 spec (14.9.5):
   * - The E entry contains the expansion of the abbreviation
   * - Format recommendation: "expansion, abbreviation" (e.g., "December, Dec")
   *
   * Use abbreviations for:
   * - Acronyms (PDF -> Portable Document Format)
   * - Short forms (Dr. -> Doktor, lb -> pound)
   * - Technical abbreviations (HTML, CSS, API)
   * - Units (kg, mm, °C)
   *
   * @param {string} expansion - The full expansion text (e.g., "Portable Document Format")
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code for the abbreviation
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Simple abbreviation
   * doc.beginStructureElement('P');
   * doc.text('Die ', 10, 30);
   * doc.beginAbbreviation('Europäische Union');
   * doc.text('EU', x, 30);
   * doc.endAbbreviation();
   * doc.text(' hat 27 Mitgliedsstaaten.', x, 30);
   * doc.endStructureElement();
   *
   * @example
   * // Abbreviation in table header
   * doc.beginTableHeaderCell('Column');
   * doc.beginAbbreviation('December');
   * doc.text('Dec', x, y);
   * doc.endAbbreviation();
   * doc.endStructureElement();
   *
   * @example
   * // Technical abbreviation with language
   * doc.beginAbbreviation('Hypertext Markup Language', { lang: 'en-US' });
   * doc.text('HTML', x, y);
   * doc.endAbbreviation();
   */
  jsPDFAPI.beginAbbreviation = function(expansion, options) {
    if (!expansion || typeof expansion !== "string") {
      throw new Error("Abbreviation requires expansion text");
    }

    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    // Begin Span element (abbreviations use Span with /E attribute)
    this.beginStructureElement("Span", attributes);

    // Store expansion text on the current element
    var currentElem = this.internal.structureTree.currentParent;
    if (currentElem) {
      currentElem.expansion = expansion;
    }

    return this;
  };

  /**
   * End an abbreviation element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endAbbreviation = function() {
    return this.endStructureElement();
  };

  // ============================================================
  // FORMULA API - For mathematical expressions
  // BITi 02.4.0 - Mathematische Ausdrücke
  // ============================================================

  /**
   * Begin a Formula element for mathematical expressions.
   * Required for PDF/UA compliance when including formulas.
   *
   * PDF/UA Requirements:
   * - All formulas MUST have an /Alt attribute (alternative text)
   * - Formula is inline by default; use placement: 'Block' for block-level
   * - Alt text should describe the formula in readable form
   *
   * In PDF/UA-1, MathML is not supported, so alt text is the primary
   * accessibility mechanism. The alt text should be a readable
   * description that a screen reader can announce.
   *
   * Use Formula for:
   * - Mathematical equations (E = mc², a² + b² = c²)
   * - Chemical formulas (H₂O, CO₂)
   * - Physics formulas (F = ma)
   * - Statistical expressions (μ, σ, Σ)
   *
   * @param {string} alt - Alternative text describing the formula (REQUIRED)
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.placement] - 'Block' for block-level, omit for inline
   * @param {string} [options.lang] - Language code for the formula description
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Inline formula
   * doc.beginStructureElement('P');
   * doc.text('Die berühmte Formel ', 10, 30);
   * doc.beginFormula('E gleich m c Quadrat');
   * doc.text('E = mc²', x, 30);
   * doc.endFormula();
   * doc.text(' von Einstein.', x, 30);
   * doc.endStructureElement();
   *
   * @example
   * // Block-level formula
   * doc.beginStructureElement('P');
   * doc.text('Der Satz des Pythagoras:', 10, 30);
   * doc.endStructureElement();
   *
   * doc.beginFormula('a Quadrat plus b Quadrat gleich c Quadrat', { placement: 'Block' });
   * doc.text('a² + b² = c²', 50, 50);
   * doc.endFormula();
   *
   * @example
   * // Chemical formula
   * doc.beginFormula('Wasser, H 2 O');
   * doc.text('H₂O', x, y);
   * doc.endFormula();
   *
   * @example
   * // Complex formula with subscripts/superscripts
   * doc.beginFormula('Summe von i gleich 1 bis n von x Index i', { placement: 'Block' });
   * doc.text('Σᵢ₌₁ⁿ xᵢ', 50, y);
   * doc.endFormula();
   */
  jsPDFAPI.beginFormula = function(alt, options) {
    if (!alt || typeof alt !== "string") {
      throw new Error(
        "Formula requires alternative text (alt) for PDF/UA compliance"
      );
    }

    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    // Add placement attribute for block-level formulas
    if (options.placement === "Block") {
      attributes.placement = "Block";
    }

    // Begin Formula element
    this.beginStructureElement("Formula", attributes);

    // Store alt text on the current element
    var currentElem = this.internal.structureTree.currentParent;
    if (currentElem) {
      currentElem.alt = alt;
    }

    return this;
  };

  /**
   * End a Formula element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endFormula = function() {
    return this.endStructureElement();
  };

  // ============================================================
  // BIBENTRY API - For bibliography entries
  // BITi 02.3.4 - Span, Quote, BibEntry, Code
  // ============================================================

  /**
   * Begin a BibEntry (Bibliography Entry) element.
   * Used to identify individual entries in a bibliography or reference list.
   *
   * According to PDF 1.7 spec:
   * - BibEntry is a reference identifying the external source of cited content
   * - May contain a label (Lbl) as a child
   * - No standard structure types are defined for author, title, etc.
   *
   * Note: BibEntry is an inline-level element in PDF/UA-1.
   * In PDF 2.0, BibEntry is no longer encouraged but still valid.
   * When used as block-level (standalone entries), set placement: 'Block'.
   *
   * Use BibEntry for:
   * - Academic paper references
   * - Book citations
   * - Journal article references
   * - Web resource citations
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code for the entry
   * @param {string} [options.placement] - 'Block' (default) or 'Inline'. Bibliography entries
   *        are typically block-level. Required by PAC for correct alternate presentations.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Simple bibliography entry
   * doc.beginStructureElement('P');
   * doc.beginBibEntry();
   * doc.text('Smith, J. (2023). "PDF Accessibility". Publisher.', 10, y);
   * doc.endBibEntry();
   * doc.endStructureElement();
   *
   * @example
   * // Bibliography entry with label
   * doc.beginBibEntry();
   * doc.beginStructureElement('Lbl');
   * doc.text('[1]', 10, y);
   * doc.endStructureElement();
   * doc.text(' Miller, A. (2022). "Accessible Documents". Press.', 20, y);
   * doc.endBibEntry();
   *
   * @example
   * // Bibliography list
   * doc.beginStructureElement('H2');
   * doc.text('Literaturverzeichnis', 10, 100);
   * doc.endStructureElement();
   *
   * doc.beginListUnordered();
   *   doc.beginListItem();
   *     doc.beginListBody();
   *       doc.beginBibEntry();
   *       doc.text('Reference text...', 20, y);
   *       doc.endBibEntry();
   *     doc.endListBody();
   *   doc.endStructureElement();
   * doc.endList();
   */
  jsPDFAPI.beginBibEntry = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    // Placement attribute - BibEntry is inline by default per PDF spec,
    // but bibliography entries are typically block-level elements.
    // Default to 'Block' for PAC compliance in alternate presentations.
    attributes.placement =
      options.placement !== undefined ? options.placement : "Block";

    return this.beginStructureElement("BibEntry", attributes);
  };

  /**
   * End a BibEntry element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endBibEntry = function() {
    return this.endStructureElement();
  };

  // ============================================================
  // INDEX API - For document indexes (subject index, keyword index)
  // BITi 02.1.2 - Gruppierende Strukturelemente / BlockQuote, Index
  // ============================================================

  /**
   * Begin an Index element for a document index (subject index, keyword index).
   *
   * According to PDF 1.7 spec:
   * - Index is a sequence of entries containing identifying text
   * - Each entry has reference elements pointing to occurrences in the document
   * - Typically organized as lists (L, LI)
   *
   * Best practices (PDF/UA):
   * - Avoid heading elements (H1-H6) inside Index
   * - The heading "Index" should be BEFORE the Index element, not inside
   * - Use lists (L, LI) to organize entries
   * - Can contain Reference elements for cross-references
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code for the index
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Simple index
   * doc.beginStructureElement('H2');
   * doc.text('Stichwortverzeichnis', 10, 100);
   * doc.endStructureElement();
   *
   * doc.beginIndex();
   *   doc.beginListUnordered();
   *     doc.beginListItem();
   *       doc.addListLabel('A', 10, 120);
   *       doc.beginListBody();
   *         doc.text('Accessibility, 12, 45, 78', 20, 120);
   *       doc.endListBody();
   *     doc.endStructureElement();
   *     // ... more entries
   *   doc.endList();
   * doc.endIndex();
   *
   * @example
   * // Index with nested sublists (alphabetical sections)
   * doc.beginIndex();
   *   // Section A
   *   doc.beginStructureElement('P');
   *   doc.text('A', 10, y);
   *   doc.endStructureElement();
   *
   *   doc.beginListUnordered();
   *     doc.beginListItem();
   *       doc.beginListBody();
   *         doc.text('Artikel, 5', 15, y);
   *       doc.endListBody();
   *     doc.endStructureElement();
   *   doc.endList();
   *
   *   // Section B
   *   doc.beginStructureElement('P');
   *   doc.text('B', 10, y);
   *   doc.endStructureElement();
   *   // ... more entries
   * doc.endIndex();
   */
  jsPDFAPI.beginIndex = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    return this.beginStructureElement("Index", attributes);
  };

  /**
   * End an Index element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endIndex = function() {
    return this.endStructureElement();
  };

  /**
   * Add an index entry with term and page references.
   * Convenience method that creates a list item with the term and references.
   *
   * @param {string} term - The index term
   * @param {string} pageRefs - Page references (e.g., "12, 45, 78")
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * doc.beginIndex();
   *   doc.beginListUnordered();
   *     doc.addIndexEntry('Accessibility', '12, 45, 78', 10, 120);
   *     doc.addIndexEntry('Barrierefreiheit', '23, 56', 10, 135);
   *   doc.endList();
   * doc.endIndex();
   */
  jsPDFAPI.addIndexEntry = function(term, pageRefs, x, y, options) {
    options = options || {};

    this.beginListItem();
    this.beginListBody();
    var text = term + ", " + pageRefs;
    this.text(text, x, y);
    this.endListBody();
    this.endStructureElement(); // end LI

    return this;
  };

  // ============================================================
  // NONSTRUCT API - For elements with no semantic meaning
  // BITi 02.1.2 - Gruppierende Strukturelemente / NonStruct
  // ============================================================

  /**
   * Begin a NonStruct (non-structural) element.
   * Used for content that has no semantic meaning but should still be
   * included in the structure tree.
   *
   * According to PDF 1.7 spec:
   * - NonStruct has no substantive role or meaning
   * - Its value is primarily for role mapping custom structure types
   * - Content and child elements ARE passed to assistive technology
   * - Unlike Private, the content IS accessible to screen readers
   *
   * Use NonStruct for:
   * - Custom structure types with no standard equivalent
   * - Layout containers that don't convey semantics
   * - Grouping elements for formatting purposes
   * - Role mapping custom element types
   *
   * Important: NonStruct is NOT the same as Artifact:
   * - Artifact content is IGNORED by screen readers
   * - NonStruct content IS READ by screen readers
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code for content
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Grouping content without semantic meaning
   * doc.beginNonStruct();
   *   doc.beginStructureElement('P');
   *   doc.text('This content is accessible but the grouping has no meaning.', 10, 30);
   *   doc.endStructureElement();
   * doc.endNonStruct();
   *
   * @example
   * // Layout wrapper
   * doc.beginNonStruct();
   *   doc.beginStructureElement('P');
   *   doc.text('Column 1 content', 10, 30);
   *   doc.endStructureElement();
   *   doc.beginStructureElement('P');
   *   doc.text('Column 2 content', 110, 30);
   *   doc.endStructureElement();
   * doc.endNonStruct();
   */
  jsPDFAPI.beginNonStruct = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    return this.beginStructureElement("NonStruct", attributes);
  };

  /**
   * End a NonStruct element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endNonStruct = function() {
    return this.endStructureElement();
  };

  // ============================================================
  // PRIVATE API - For private/proprietary content
  // BITi 02.1.2 - Gruppierende Strukturelemente / Private
  // ============================================================

  /**
   * Begin a Private element for proprietary content.
   * Content within Private elements is IGNORED by assistive technology.
   *
   * According to PDF 1.7 spec (ISO 32000-1, 14.8.4.2):
   * - Private is useful only for private purposes
   * - Consuming processors SHOULD ignore the element AND its contents
   * - This is different from NonStruct where content is accessible
   *
   * According to BITi 02.1.2:
   * - "Private spielt in der Praxis keine Rolle und kann mitsamt seinem
   *    Inhalt ignoriert werden."
   * - "wird weder interpretiert noch beim Konvertieren in andere
   *    Dokumentformate exportiert. Auch die von Private gruppierten
   *    Elemente werden weder exportiert noch interpretiert."
   *
   * Implementation note:
   * We create a proper /S /Private structure element for PDF/UA compliance,
   * but ALSO mark child content as Artifact in the content stream. This is
   * necessary because some screen readers (e.g., NVDA) do not correctly
   * ignore Private content when only the structure element is present.
   * This dual approach ensures:
   * 1. PDF/UA validators see correct /S /Private structure
   * 2. Screen readers reliably ignore the content via Artifact marking
   *
   * Reference: https://biti-wiki.de/index.php?title=BITi_02.1.2
   *
   * Use Private for:
   * - Application-specific metadata
   * - Processing instructions
   * - Internal markers or tags
   * - Content that should not be exposed to users
   *
   * Warning: Private elements and their children are NOT accessible!
   * For decorative content, use Artifact instead (beginArtifact()).
   * For content that should be read but has no semantic meaning, use NonStruct.
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code (rarely needed)
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Application-specific metadata
   * doc.beginPrivate();
   *   doc.text('Internal processing note: reviewed 2024-01-15', 10, 30);
   * doc.endPrivate();
   */
  jsPDFAPI.beginPrivate = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    // Create proper /S /Private structure element for PDF/UA compliance
    this.beginStructureElement("Private", attributes);

    // Also start Artifact mode so content is ignored by screen readers
    // This is needed because screen readers don't always respect Private
    this.beginArtifact({ type: "Layout" });

    return this;
  };

  /**
   * End a Private element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endPrivate = function() {
    // End Artifact mode first
    this.endArtifact();
    // Then end the Private structure element
    return this.endStructureElement();
  };

  // ============================================================
  // ART/SECT/DIV API - Document grouping elements
  // BITi 02.1.0 - Gruppierende Strukturelemente / Rootelemente
  // ============================================================

  /**
   * Begin an Art (Article) element.
   * Identifies a self-contained body of text within a document.
   *
   * According to PDF 1.7 spec:
   * - Art identifies an article or distinct portion of content
   * - Articles are self-contained units that can be read independently
   * - Useful for magazine-style layouts with multiple articles
   *
   * Use Art for:
   * - Magazine/newspaper articles
   * - Blog posts in a collection
   * - News items
   * - Self-contained content sections
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code for the article
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Magazine with multiple articles
   * doc.beginStructureElement('Document');
   *
   *   doc.beginArt();
   *     doc.beginStructureElement('H1');
   *     doc.text('First Article Title', 10, 30);
   *     doc.endStructureElement();
   *     doc.beginStructureElement('P');
   *     doc.text('Article content...', 10, 45);
   *     doc.endStructureElement();
   *   doc.endArt();
   *
   *   doc.beginArt();
   *     doc.beginStructureElement('H1');
   *     doc.text('Second Article Title', 10, 100);
   *     doc.endStructureElement();
   *     doc.beginStructureElement('P');
   *     doc.text('Another article...', 10, 115);
   *     doc.endStructureElement();
   *   doc.endArt();
   *
   * doc.endStructureElement();
   */
  jsPDFAPI.beginArt = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    return this.beginStructureElement("Art", attributes);
  };

  /**
   * End an Art element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endArt = function() {
    return this.endStructureElement();
  };

  /**
   * Begin a Sect (Section) element.
   * Identifies a section within a document, part, or article.
   *
   * According to PDF 1.7 spec:
   * - Sect identifies sections of a document, part, or article
   * - Sections can be nested to create hierarchical structure
   * - Useful for organizing content into logical divisions
   *
   * Use Sect for:
   * - Book chapters or chapter sections
   * - Document sections
   * - Sidebar content
   * - Pull quotes
   * - Boxed text
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code for the section
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Document with nested sections
   * doc.beginStructureElement('Document');
   *
   *   doc.beginSect();
   *     doc.beginStructureElement('H1');
   *     doc.text('Chapter 1: Introduction', 10, 30);
   *     doc.endStructureElement();
   *
   *     doc.beginSect();
   *       doc.beginStructureElement('H2');
   *       doc.text('1.1 Background', 10, 50);
   *       doc.endStructureElement();
   *       doc.beginStructureElement('P');
   *       doc.text('Section content...', 10, 65);
   *       doc.endStructureElement();
   *     doc.endSect();
   *
   *     doc.beginSect();
   *       doc.beginStructureElement('H2');
   *       doc.text('1.2 Overview', 10, 100);
   *       doc.endStructureElement();
   *       doc.beginStructureElement('P');
   *       doc.text('More content...', 10, 115);
   *       doc.endStructureElement();
   *     doc.endSect();
   *   doc.endSect();
   *
   * doc.endStructureElement();
   */
  jsPDFAPI.beginSect = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    return this.beginStructureElement("Sect", attributes);
  };

  /**
   * End a Sect element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endSect = function() {
    return this.endStructureElement();
  };

  /**
   * Begin a Div (Division) element.
   * A generic container for grouping content.
   *
   * According to PDF 1.7 spec:
   * - Div is a generic block-level element or group of elements
   * - Has no inherent semantic significance
   * - Similar to HTML <div> element
   *
   * Important: Div does not convey semantics and is generally discouraged
   * in favor of more meaningful elements like Sect or Art. However, it's
   * useful when no other element is appropriate.
   *
   * Use Div for:
   * - Generic layout grouping
   * - Styling containers
   * - When no other element is appropriate
   *
   * Prefer using:
   * - Sect for logical sections
   * - Art for self-contained articles
   * - Part for major document divisions
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code for content
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Generic content grouping
   * doc.beginDiv();
   *   doc.beginStructureElement('P');
   *   doc.text('Grouped content paragraph 1', 10, 30);
   *   doc.endStructureElement();
   *   doc.beginStructureElement('P');
   *   doc.text('Grouped content paragraph 2', 10, 45);
   *   doc.endStructureElement();
   * doc.endDiv();
   */
  jsPDFAPI.beginDiv = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    return this.beginStructureElement("Div", attributes);
  };

  /**
   * End a Div element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endDiv = function() {
    return this.endStructureElement();
  };

  /**
   * Begin a Part element.
   * Identifies a large division of a document.
   *
   * According to PDF 1.7 spec:
   * - Part is intended to subdivide a large document into smaller elements
   * - Typically used for major divisions like book parts or volumes
   * - Parts can contain Art, Sect, and other grouping elements
   *
   * Use Part for:
   * - Book parts (Part I, Part II)
   * - Major document divisions
   * - Volumes in a multi-volume work
   * - Large-scale organization
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code for the part
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Multi-part document
   * doc.beginStructureElement('Document');
   *
   *   doc.beginPart();
   *     doc.beginStructureElement('H1');
   *     doc.text('Part I: Foundations', 10, 30);
   *     doc.endStructureElement();
   *
   *     doc.beginSect();
   *       doc.beginStructureElement('H2');
   *       doc.text('Chapter 1: Basics', 10, 50);
   *       doc.endStructureElement();
   *       // Chapter content...
   *     doc.endSect();
   *   doc.endPart();
   *
   *   doc.beginPart();
   *     doc.beginStructureElement('H1');
   *     doc.text('Part II: Advanced Topics', 10, 150);
   *     doc.endStructureElement();
   *     // More chapters...
   *   doc.endPart();
   *
   * doc.endStructureElement();
   */
  jsPDFAPI.beginPart = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    return this.beginStructureElement("Part", attributes);
  };

  /**
   * End a Part element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endPart = function() {
    return this.endStructureElement();
  };

  // ============================================================
  // RUBY API - For East Asian pronunciation annotations
  // BITi 02.3.3 - Inlinelevel Strukturelemente / Ruby
  // ============================================================

  /**
   * Begin a Ruby annotation assembly.
   * Ruby is a small annotation text placed adjacent to base text,
   * typically used for pronunciation guides in East Asian languages.
   *
   * According to ISO 32000-1 Table 338:
   * - Ruby is the wrapper around the entire ruby assembly
   * - It shall contain one RB element followed by either an RT element
   *   or a three-element group consisting of RP, RT, and RP
   *
   * Structure:
   *   Ruby
   *   ├── RB (base text)
   *   └── RT (annotation text)
   *
   * Or with fallback parentheses:
   *   Ruby
   *   ├── RB (base text)
   *   ├── RP (opening parenthesis)
   *   ├── RT (annotation text)
   *   └── RP (closing parenthesis)
   *
   * Use cases:
   * - Furigana in Japanese (hiragana above kanji)
   * - Pinyin in Chinese (romanization above hanzi)
   * - Bopomofo/Zhuyin in Traditional Chinese
   * - Korean hanja pronunciation
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code (e.g., 'ja-JP', 'zh-CN')
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Japanese kanji with furigana
   * doc.beginRuby();
   *   doc.beginRubyBaseText();
   *   doc.text('漢字', 10, 30);  // Kanji
   *   doc.endRubyBaseText();
   *   doc.beginRubyText();
   *   doc.text('かんじ', 10, 25);  // Hiragana reading
   *   doc.endRubyText();
   * doc.endRuby();
   *
   * @example
   * // With fallback parentheses for non-ruby-aware readers
   * doc.beginRuby();
   *   doc.beginRubyBaseText();
   *   doc.text('東京', 10, 30);
   *   doc.endRubyBaseText();
   *   doc.beginRubyPunctuation();
   *   doc.text('(', 30, 30);
   *   doc.endRubyPunctuation();
   *   doc.beginRubyText();
   *   doc.text('とうきょう', 35, 30);
   *   doc.endRubyText();
   *   doc.beginRubyPunctuation();
   *   doc.text(')', 70, 30);
   *   doc.endRubyPunctuation();
   * doc.endRuby();
   */
  jsPDFAPI.beginRuby = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    return this.beginStructureElement("Ruby", attributes);
  };

  /**
   * End a Ruby annotation assembly.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endRuby = function() {
    return this.endStructureElement();
  };

  /**
   * Begin Ruby Base Text (RB) element.
   * The full-size text to which the ruby annotation is applied.
   *
   * According to ISO 32000-1:
   * - RB may contain text, other inline elements, or a mixture of both
   * - May have RubyAlign attribute
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.rubyAlign] - Alignment: 'Start', 'Center', 'End',
   *                                       'Justify', 'Distribute' (default: 'Distribute')
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginRubyBaseText = function(options) {
    options = options || {};
    var attributes = {};

    if (options.rubyAlign) {
      attributes.RubyAlign = options.rubyAlign;
    }

    return this.beginStructureElement("RB", attributes);
  };

  /**
   * End Ruby Base Text (RB) element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endRubyBaseText = function() {
    return this.endStructureElement();
  };

  /**
   * Begin Ruby Text (RT) element.
   * The smaller-size annotation text placed adjacent to the base text.
   *
   * According to ISO 32000-1:
   * - RT may contain text, other inline elements, or a mixture of both
   * - May have RubyAlign and RubyPosition attributes
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.rubyAlign] - Alignment: 'Start', 'Center', 'End',
   *                                       'Justify', 'Distribute' (default: 'Distribute')
   * @param {string} [options.rubyPosition] - Position: 'Before', 'After', 'Warichu',
   *                                          'Inline' (default: 'Before')
   * @param {string} [options.placement] - 'Block' or 'Inline' (default: 'Inline').
   *        RT is inline by default. Required by PAC for correct alternate presentations.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginRubyText = function(options) {
    options = options || {};
    var attributes = {};

    if (options.rubyAlign) {
      attributes.RubyAlign = options.rubyAlign;
    }
    if (options.rubyPosition) {
      attributes.RubyPosition = options.rubyPosition;
    }

    // Placement attribute - RT is inline by default per PDF spec.
    // Required by PAC for correct presentation in alternate formats.
    if (options.placement) {
      attributes.placement = options.placement;
    }

    return this.beginStructureElement("RT", attributes);
  };

  /**
   * End Ruby Text (RT) element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endRubyText = function() {
    return this.endStructureElement();
  };

  /**
   * Begin Ruby Punctuation (RP) element.
   * Punctuation surrounding the annotation text, used as fallback
   * when ruby formatting cannot be properly applied.
   *
   * According to ISO 32000-1:
   * - RP contains text, typically a single LEFT or RIGHT PARENTHESIS
   *   or similar bracketing character
   *
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginRubyPunctuation = function() {
    return this.beginStructureElement("RP");
  };

  /**
   * End Ruby Punctuation (RP) element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endRubyPunctuation = function() {
    return this.endStructureElement();
  };

  // ============================================================
  // WARICHU API - For East Asian inline annotations
  // BITi 02.3.3 - Inlinelevel Strukturelemente / Warichu
  // ============================================================

  /**
   * Begin a Warichu annotation assembly.
   * Warichu is a comment or annotation in smaller text formatted into
   * two lines within the height of the containing text line.
   *
   * According to ISO 32000-1 Table 338:
   * - Warichu is the wrapper around the entire warichu assembly
   * - It may contain a three-element group consisting of WP, WT, and WP
   * - Warichu elements and their content may wrap across multiple lines
   *   according to JIS X 4051-1995
   *
   * Structure:
   *   Warichu
   *   ├── WP (opening punctuation, optional)
   *   ├── WT (warichu text)
   *   └── WP (closing punctuation, optional)
   *
   * Use cases:
   * - Inline comments in Japanese text
   * - Annotations that should appear as two smaller lines
   * - Traditional Japanese typographic presentations
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code (e.g., 'ja-JP')
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Simple warichu annotation
   * doc.beginWarichu();
   *   doc.beginWarichuPunctuation();
   *   doc.text('(', 50, 30);
   *   doc.endWarichuPunctuation();
   *   doc.beginWarichuText();
   *   doc.text('注釈テキスト', 55, 30);  // Annotation text
   *   doc.endWarichuText();
   *   doc.beginWarichuPunctuation();
   *   doc.text(')', 100, 30);
   *   doc.endWarichuPunctuation();
   * doc.endWarichu();
   */
  jsPDFAPI.beginWarichu = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    return this.beginStructureElement("Warichu", attributes);
  };

  /**
   * End a Warichu annotation assembly.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endWarichu = function() {
    return this.endStructureElement();
  };

  /**
   * Begin Warichu Text (WT) element.
   * The smaller-size text formatted into two lines within the
   * containing text line height.
   *
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginWarichuText = function() {
    return this.beginStructureElement("WT");
  };

  /**
   * End Warichu Text (WT) element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endWarichuText = function() {
    return this.endStructureElement();
  };

  /**
   * Begin Warichu Punctuation (WP) element.
   * Punctuation surrounding the WT text, typically parentheses
   * or similar bracketing characters.
   *
   * According to ISO 32000-1:
   * - WP contains text, typically punctuation
   * - May be converted to appropriate spacing by the formatter
   *
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.beginWarichuPunctuation = function() {
    return this.beginStructureElement("WP");
  };

  /**
   * End Warichu Punctuation (WP) element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endWarichuPunctuation = function() {
    return this.endStructureElement();
  };

  // ============================================================
  // DOCUMENTFRAGMENT API - For document excerpts (PDF 2.0)
  // ISO 32000-2:2020, 14.8.4.3
  // ============================================================

  /**
   * Begin a DocumentFragment element.
   * Represents a logical document fragment - an excerpt from another document.
   *
   * NOTE: This is a PDF 2.0 (ISO 32000-2) structure element, introduced for
   * PDF/UA-2. Older PDF readers may not fully support it, but the content
   * remains accessible as it falls back gracefully.
   *
   * According to ISO 32000-2:2020, 14.8.4.3:
   * - DocumentFragment identifies content as an extract from another document
   * - Heading levels within a fragment may not align with the overall document
   * - Headings within the fragment should be self-consistent
   *
   * Use DocumentFragment for:
   * - Excerpts from other documents
   * - Quoted passages from external sources
   * - Embedded document sections
   * - Legal document citations
   *
   * Do NOT use DocumentFragment for:
   * - Regular quotations (use BlockQuote instead)
   * - Content that doesn't represent an actual document extract
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code for the fragment
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Excerpt from a legal document
   * doc.beginDocumentFragment({ lang: 'de-DE' });
   *   doc.beginStructureElement('H1');
   *   doc.text('Auszug aus dem Grundgesetz', 10, 30);
   *   doc.endStructureElement();
   *   doc.beginStructureElement('P');
   *   doc.text('Artikel 1: Die Würde des Menschen ist unantastbar.', 10, 45);
   *   doc.endStructureElement();
   * doc.endDocumentFragment();
   *
   * @example
   * // Technical specification excerpt
   * doc.beginStructureElement('P');
   * doc.text('The following is from ISO 32000-2:', 10, 20);
   * doc.endStructureElement();
   *
   * doc.beginDocumentFragment();
   *   doc.beginStructureElement('P');
   *   doc.text('[Specification text here...]', 10, 35);
   *   doc.endStructureElement();
   * doc.endDocumentFragment();
   */
  jsPDFAPI.beginDocumentFragment = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    return this.beginStructureElement("DocumentFragment", attributes);
  };

  /**
   * End a DocumentFragment element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endDocumentFragment = function() {
    return this.endStructureElement();
  };

  // ============================================================
  // ASIDE API - For sidebars and related content (PDF 2.0)
  // ISO 32000-2:2020, 14.8.4.3
  // ============================================================

  /**
   * Begin an Aside element.
   * Represents content that is tangentially related to the main content,
   * such as sidebars, pull quotes, or advertising.
   *
   * NOTE: This is a PDF 2.0 (ISO 32000-2) structure element, introduced for
   * PDF/UA-2. Older PDF readers may not fully support it, but the content
   * remains accessible as it falls back gracefully.
   *
   * According to ISO 32000-2:2020:
   * - Aside is for content outside the main flow
   * - Examples: sidebars, advertising, side notes in textbooks
   * - If related to main content, parent should be the deepest related element
   *
   * Historical context (pre-PDF 2.0):
   * Before Aside existed, sidebars were problematic because heading tags
   * within them would break the document's logical structure. Caption
   * elements were sometimes used as a workaround.
   *
   * Use Aside for:
   * - Sidebars with supplementary information
   * - Pull quotes
   * - Advertising content
   * - Side notes in educational materials
   * - Related links sections
   * - Author bio boxes
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.lang] - Language code for the aside content
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Sidebar with additional information
   * doc.beginStructureElement('P');
   * doc.text('Main article content here...', 10, 30);
   * doc.endStructureElement();
   *
   * doc.beginAside();
   *   doc.beginStructureElement('H2');
   *   doc.text('Did You Know?', 120, 30);
   *   doc.endStructureElement();
   *   doc.beginStructureElement('P');
   *   doc.text('Interesting fact related to the article.', 120, 45);
   *   doc.endStructureElement();
   * doc.endAside();
   *
   * @example
   * // Pull quote
   * doc.beginAside();
   *   doc.beginBlockQuote();
   *   doc.text('"This is an important statement."', 10, 80);
   *   doc.endBlockQuote();
   * doc.endAside();
   *
   * @example
   * // Author information box
   * doc.beginAside({ lang: 'en-US' });
   *   doc.beginStructureElement('H3');
   *   doc.text('About the Author', 10, 200);
   *   doc.endStructureElement();
   *   doc.beginStructureElement('P');
   *   doc.text('John Doe is a software developer...', 10, 215);
   *   doc.endStructureElement();
   * doc.endAside();
   */
  jsPDFAPI.beginAside = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    return this.beginStructureElement("Aside", attributes);
  };

  /**
   * End an Aside element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endAside = function() {
    return this.endStructureElement();
  };

  // ============================================================
  // ANNOT API - For accessible annotations (PDF/UA BITi 02.3.2)
  // Matterhorn Protocol Checkpoint 28-002, 28-004
  // ============================================================

  /**
   * Begin an Annot structure element.
   * Used to wrap annotations (except Link, Widget, Popup) for PDF/UA compliance.
   *
   * According to the Matterhorn Protocol:
   * - 28-002: Annotations (except Widget, Popup, Link) must be nested in <Annot>
   * - 28-004: Annotations need /Contents or /Alt for accessibility
   *
   * The Annot element can contain:
   * - The marked-up content (for markup annotations like highlights)
   * - An OBJR reference to the annotation object
   *
   * @param {Object} [options] - Optional attributes
   * @param {string} [options.alt] - Alternative text for the annotation
   * @param {string} [options.lang] - Language code for the annotation content
   * @param {string} [options.placement] - 'Block' (default) or 'Inline'. Annotations are
   *        typically block-level. Required by PAC for correct alternate presentations.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   *
   * @example
   * // Text annotation (sticky note) with accessible structure
   * doc.beginAnnot({ alt: 'Comment: Important note about this section' });
   * doc.createAnnotation({
   *   type: 'text',
   *   title: 'Author',
   *   contents: 'This is an important note',
   *   bounds: { x: 10, y: 50, w: 20, h: 20 }
   * });
   * doc.endAnnot();
   */
  jsPDFAPI.beginAnnot = function(options) {
    options = options || {};
    var attributes = {};

    if (options.lang) {
      attributes.lang = options.lang;
    }

    // Placement attribute - Annot is inline by default per PDF spec,
    // but annotations are typically standalone block-level elements.
    // Default to 'Block' for PAC compliance in alternate presentations.
    attributes.placement =
      options.placement !== undefined ? options.placement : "Block";

    var element = this.beginStructureElement("Annot", attributes);

    // Store alt text for the annotation on the current structure element
    if (
      options.alt &&
      this.internal.structureTree &&
      this.internal.structureTree.currentParent
    ) {
      this.internal.structureTree.currentParent.alt = options.alt;
    }

    return element;
  };

  /**
   * End an Annot structure element.
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.endAnnot = function() {
    return this.endStructureElement();
  };

  /**
   * Add an annotation object reference (OBJR) to the current structure element.
   * This links an annotation object to its structure element for PDF/UA compliance.
   *
   * @param {number} annotObjId - The object ID of the annotation
   * @returns {jsPDF} - Returns jsPDF instance for method chaining
   */
  jsPDFAPI.addAnnotationRef = function(annotObjId) {
    if (
      !this.internal.structureTree ||
      !this.internal.structureTree.currentParent
    ) {
      return this;
    }

    var currentElem = this.internal.structureTree.currentParent;

    // Store the annotation object reference to be written later
    if (!currentElem.annotRefs) {
      currentElem.annotRefs = [];
    }
    currentElem.annotRefs.push(annotObjId);

    // Store mapping from annotation internal ID to Annot structure element
    // This is needed for ParentTree entries (similar to formFieldParentMap)
    if (!this.internal.structureTree.annotParentMap) {
      this.internal.structureTree.annotParentMap = {};
    }
    this.internal.structureTree.annotParentMap[annotObjId] = currentElem;

    return this;
  };
})(jsPDF.API);

export default jsPDF;
