/**
 * jsPDF ICC Profile Plugin
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

 /**
 *
 * @returns {jsPDF}
 * @name iccProfile
 * @example
 * var doc = new jsPDF();
 * doc.iccProfile({name: "sRGB IEC61966-2.1"});
 * doc.save("iccProfile.pdf");
 */

(function (jsPDFAPI) {
  "use strict";

  jsPDFAPI.iccProfile = function (options) {

    var vFSTemplate = {
      "sRGB IEC61966-2.1": {type: "RGB", file: "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"}
    };

    /**
     * Convert the Buffer to a Binary String
     */
    function arrayBufferToBinaryString(buffer) {
      if (typeof(window.atob) === "function") {
        return atob(buffer);
      } else {
        var b;
        var c;
        var d;
        var e = {};
        var f = 0;
        var g = 0;
        var binary_string = "";
        var i = String.fromCharCode;
        var j = buffer.length;
        for (b = 0; 64 > b; b += 1) { 
      e["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(b)] = b;
      }
      for (c = 0; j > c; c += 1) {
        for (b = e[buffer.charAt(c)], f = (f << 6) + b, g += 6; g >= 8; ) ((d = 255 & f >>> (g -= 8)) || j - 2 > c) && (binary_string += i(d));
      }
        return binary_string;
      }
    };

    function iccTypeToNumber(type) {
      var result;
      switch (type) {
      case "GRAY":
        result = 1;
        break;
      case "CMYK":
        result = 4;
        break;
      case "RGB":
        result = 3;
        break;
      default:
        result = 3;
      }
      return result;
    }

    var type = options.type;
    var iccFile = options.iccFile;
    var name = options.name;

    if (this.internal.iccProfiles === undefined) {
      this.internal.iccProfiles = {};
      this.internal.iccProfiles.vFS = JSON.parse(JSON.stringify(vFSTemplate));
      this.internal.iccProfiles.activeProfile = "sRGB IEC61966-2.1";
    }
    var vFS = this.internal.iccProfiles.vFS;

    if (name !== undefined && iccFile !== undefined && type !== undefined) {
      vFS[name] = {file: iccFile, type: iccTypeToNumber(type)};
    }
    if (vFS[name] !== undefined) {
      this.internal.iccProfiles.activeProfile = name;
    } else {
      this.internal.iccProfiles.activeProfile = "sRGB IEC61966-2.1";
    }

    this.internal.events.subscribe("postResources", function () {
      var putStream = this.internal.putStream;
      var out = this.internal.write;

      var objId = this.internal.newObject();
      this.internal.iccProfiles.objId = objId;
      var vFS = this.internal.iccProfiles.vFS;
      var activeProfile = this.internal.iccProfiles.activeProfile;
      var data = vFS[activeProfile].file;
      var binICC = arrayBufferToBinaryString(data);

      out("<</N " + iccTypeToNumber(vFS[activeProfile].type) + " /Length " + binICC.length + ">>");
      putStream(binICC);
      out("endobj");

      this.internal.newObject();
      out("[/ICCBased " + objId + " 0 R]");
      out("endobj");
    });

    this.internal.events.subscribe("postCatalog", function () {

      var objId = this.internal.iccProfiles.objId;
      var out = this.internal.write;
      var vFS = this.internal.iccProfiles.vFS;
      var activeProfile = this.internal.iccProfiles.activeProfile;

      out("/OutputIntents [<<");
      out("/Type /OutputIntent");
      out("/S /GTS_PDFA1");
      out("/OutputCondition " + activeProfile);
      out("/OutputConditionIdentifier " + activeProfile);
      out("/RegistryName http://www.color.org");
      out("/Info " + activeProfile);
      out("/DestOutputProfile " + objId + " 0 R");
      out(">>]");
    });
    return this;
  };
})(jsPDF.API);