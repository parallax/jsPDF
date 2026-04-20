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

function postPutResources() {
  const metadata = this.internal.__metadata__.metadata;
  const utf8Metadata = unescape(encodeURIComponent(metadata));

  const rawXml = this.internal.__metadata__.rawXml;
  let content;
  if (rawXml) {
    content = utf8Metadata;
  } else {
    const xmpmetaBeginning = '<x:xmpmeta xmlns:x="adobe:ns:meta/">';
    const rdfBeginning =
      '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:jspdf="' +
      this.internal.__metadata__.namespaceUri +
      '"><jspdf:metadata>';
    const rdfEnding = "</jspdf:metadata></rdf:Description></rdf:RDF>";
    const xmpmetaEnding = "</x:xmpmeta>";

    content =
      xmpmetaBeginning +
      rdfBeginning +
      escapeXml(utf8Metadata) +
      rdfEnding +
      xmpmetaEnding;
  }

  this.internal.__metadata__.metadataObjectNumber = this.internal.newObject();
  this.internal.write(
    "<< /Type /Metadata /Subtype /XML /Length " + content.length + " >>"
  );
  this.internal.write("stream");
  this.internal.write(content);
  this.internal.write("endstream");
  this.internal.write("endobj");
}

function putCatalog() {
  if (this.internal.__metadata__.metadataObjectNumber) {
    this.internal.write(
      "/Metadata " + this.internal.__metadata__.metadataObjectNumber + " 0 R"
    );
  }
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Adds XMP formatted metadata to PDF.
 *
 * WARNING: Passing raw XML is potentially insecure! Always sanitize user input before passing it to this function!
 * @name addMetadata
 * @function
 * @param {string} metadata The actual metadata to be added. The interpretation of this parameter depends on the
 *   second parameter.
 * @param {boolean|string|undefined} rawXmlOrNamespaceUri If a string is passed it sets the namespace URI for the
 *   metadata and the metadata shall be stored as XMP simple value. The last character should be a slash or hash.
 *
 *   If this argument is omitted, a string is passed, or `false` is passed, the `metadata` argument will be
 *   XML-escaped before including it in the PDF.
 *
 *   If `true` is passed, the `metadata` argument will be interpreted as raw XMP and will be included verbatim
 *   in the PDF. The passed metadata must be complete (including surrounding `xmpmeta` and `RDF` tags).
 * @returns {jsPDF} jsPDF-instance
 */
jsPDF.API.addMetadata = function(metadata, rawXmlOrNamespaceUri) {
  if (typeof this.internal.__metadata__ === "undefined") {
    this.internal.__metadata__ = {
      metadata: metadata,
      namespaceUri:
        rawXmlOrNamespaceUri ?? "http://jspdf.default.namespaceuri/",
      rawXml:
        typeof rawXmlOrNamespaceUri === "boolean" ? rawXmlOrNamespaceUri : false
    };
    this.internal.events.subscribe("putCatalog", putCatalog);

    this.internal.events.subscribe("postPutResources", postPutResources);
  }
  return this;
};
