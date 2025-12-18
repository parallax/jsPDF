/** ====================================================================
 * @license
 * jsPDF XMP metadata plugin
 * Copyright (c) 2016 Jussi Utunen, u-jussi@suomi24.fi
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

import { jsPDF } from "../jspdf.js";

/**
 * @name xmp_metadata
 * @module
 */
(function(jsPDFAPI) {
  "use strict";

  var postPutResources = function() {
    var metadata = this.internal.__metadata__;

    // Build XMP packet
    var xmpmeta_beginning = '<x:xmpmeta xmlns:x="adobe:ns:meta/">';
    var xmpmeta_ending = "</x:xmpmeta>";

    // Build RDF structure with all metadata
    var rdf_content = '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">';

    // Main Description element with all namespaces
    // Only include namespaces that are actually used
    var namespaces = '';
    var needsDC = metadata.title || metadata.pdfUA;

    if (needsDC) {
      namespaces += 'xmlns:dc="http://purl.org/dc/elements/1.1/"';
    }

    if (metadata.pdfUA) {
      if (namespaces) namespaces += ' ';
      namespaces += 'xmlns:pdfuaid="http://www.aiim.org/pdfua/ns/id/"';
    }

    if (metadata.customMetadata) {
      if (namespaces) namespaces += ' ';
      namespaces += 'xmlns:jspdf="' + (metadata.namespaceuri || "http://jspdf.default.namespaceuri/") + '"';
    }

    rdf_content += '<rdf:Description rdf:about=""' + (namespaces ? ' ' + namespaces : '') + '>';

    // Add dc:title - required for PDF/UA (ISO 14289-1, clause 7.1, test 9)
    // Use provided title, or default to "Untitled Document" for PDF/UA compliance
    var title = metadata.title;
    if (!title && metadata.pdfUA) {
      title = 'Untitled Document';  // Fallback for PDF/UA compliance
    }
    if (title) {
      rdf_content += '<dc:title><rdf:Alt><rdf:li xml:lang="x-default">' +
                     escapeXML(title) +
                     '</rdf:li></rdf:Alt></dc:title>';
    }

    // Add PDF/UA identification if enabled
    if (metadata.pdfUA) {
      rdf_content += '<pdfuaid:part>1</pdfuaid:part>';
      rdf_content += '<pdfuaid:conformance>A</pdfuaid:conformance>';
    }

    // Add custom metadata if provided (legacy support)
    if (metadata.customMetadata) {
      rdf_content += '<jspdf:metadata>' + escapeXML(metadata.customMetadata) + '</jspdf:metadata>';
    }

    rdf_content += '</rdf:Description></rdf:RDF>';

    // Complete XMP packet
    var xmp_packet = xmpmeta_beginning + rdf_content + xmpmeta_ending;
    var utf8_xmp_packet = unescape(encodeURIComponent(xmp_packet));

    metadata.metadata_object_number = this.internal.newObject();
    this.internal.write(
      "<< /Type /Metadata /Subtype /XML /Length " + utf8_xmp_packet.length + " >>"
    );
    this.internal.write("stream");
    this.internal.write(utf8_xmp_packet);
    this.internal.write("endstream");
    this.internal.write("endobj");
  };

  // Helper function to escape XML special characters
  function escapeXML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  var putCatalog = function() {
    if (this.internal.__metadata__.metadata_object_number) {
      this.internal.write(
        "/Metadata " +
          this.internal.__metadata__.metadata_object_number +
          " 0 R"
      );
    }
  };

  /**
   * Initialize metadata structure
   * @private
   */
  function initMetadata(doc) {
    if (typeof doc.internal.__metadata__ === "undefined") {
      doc.internal.__metadata__ = {};
      doc.internal.events.subscribe("putCatalog", putCatalog);
      doc.internal.events.subscribe("postPutResources", postPutResources);
    }
  }

  /**
   * Adds XMP formatted metadata to PDF
   *
   * @name addMetadata
   * @function
   * @param {String} metadata The actual metadata to be added. The metadata shall be stored as XMP simple value. Note that if the metadata string contains XML markup characters "<", ">" or "&", those characters should be written using XML entities.
   * @param {String} namespaceuri Sets the namespace URI for the metadata. Last character should be slash or hash.
   * @returns {jsPDF} jsPDF-instance
   */
  jsPDFAPI.addMetadata = function(metadata, namespaceuri) {
    initMetadata(this);
    this.internal.__metadata__.customMetadata = metadata;
    this.internal.__metadata__.namespaceuri = namespaceuri || "http://jspdf.default.namespaceuri/";
    return this;
  };

  /**
   * Set document title (will be used in XMP dc:title and for DisplayDocTitle)
   *
   * @name setDocumentTitle
   * @function
   * @param {String} title The document title
   * @returns {jsPDF} jsPDF-instance
   */
  jsPDFAPI.setDocumentTitle = function(title) {
    initMetadata(this);
    this.internal.__metadata__.title = title;

    // Also set in document properties for consistency
    this.setProperties({ title: title });

    return this;
  };

  // Automatically initialize XMP metadata for PDF/UA documents
  jsPDFAPI.events.push([
    "initialized",
    function() {
      if (this.isPDFUAEnabled && this.isPDFUAEnabled()) {
        initMetadata(this);
        this.internal.__metadata__.pdfUA = true;

        // Get title from properties if set
        if (this.internal.title) {
          this.internal.__metadata__.title = this.internal.title;
        }
      }
    }
  ]);
})(jsPDF.API);
