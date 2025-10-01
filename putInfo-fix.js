  var putInfo = (API.__private__.putInfo = function() {
    var objectId = newObject();
    var encryptor = function(data) {
      return data;
    };
    if (encryptionOptions !== null) {
      encryptor = encryption.encryptor(objectId, 0);
    }
    out("<<");
    
    // Use configurable producer or default to jsPDF version
    var producerValue = documentProperties.producer || ("jsPDF " + jsPDF.version);
    if (producerValue) {
      out("/Producer (" + pdfEscape(encryptor(producerValue)) + ")");
    }
    
    for (var key in documentProperties) {
      if (documentProperties.hasOwnProperty(key) && documentProperties[key] && key !== "producer") {
        out(
          "/" +
            key.substr(0, 1).toUpperCase() +
            key.substr(1) +
            " (" +
            pdfEscape(encryptor(documentProperties[key])) +
            ")"
        );
      }
    }
    out("/CreationDate (" + pdfEscape(encryptor(creationDate)) + ")");
    out(">>");
    out("endobj");
  });