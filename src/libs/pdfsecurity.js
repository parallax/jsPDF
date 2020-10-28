/**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 * Author: Owen Leong (@owenl131)
 * Date: 15 Oct 2020
 * References:
 * https://www.cs.cmu.edu/~dst/Adobe/Gallery/anon21jul01-pdf-encryption.txt
 * https://github.com/foliojs/pdfkit/blob/master/lib/security.js
 * http://www.fpdf.org/en/script/script37.php
 */

import { md5Bin } from "./md5.js";
import { rc4 } from "./rc4.js";

var permissionOptions = {
  print: 4,
  modify: 8,
  copy: 16,
  "annot-forms": 32
};

/**
 * Initializes encryption settings
 *
 * @name constructor
 * @function
 * @param {Array} permissions Permissions allowed for user, "print", "modify", "copy" and "annot-forms".
 * @param {String} userPassword Permissions apply to this user. Leaving this empty means the document
 *                              is not password protected but viewer has the above permissions.
 * @param {String} ownerPassword Owner has full functionalities to the file.
 * @param {String} fileId As hex string, should be same as the file ID in the trailer.
 * @example
 * var security = new PDFSecurity(["print"])
 */
function PDFSecurity(permissions, userPassword, ownerPassword, fileId) {
  this.v = 1; // algorithm 1, future work can add in more recent encryption schemes
  this.r = 2; // revision 2

  // set flags for what functionalities the user can access
  let protection = 192;
  permissions.forEach(function(perm) {
    if (typeof permissionOptions.perm !== "undefined") {
      throw new Error("Invalid permission: " + perm);
    }
    protection += permissionOptions[perm];
  });

  // padding is used to pad the passwords to 32 bytes, also is hashed and stored in the final PDF
  this.padding =
    "\x28\xBF\x4E\x5E\x4E\x75\x8A\x41\x64\x00\x4E\x56\xFF\xFA\x01\x08" +
    "\x2E\x2E\x00\xB6\xD0\x68\x3E\x80\x2F\x0C\xA9\xFE\x64\x53\x69\x7A";
  let paddedUserPassword = (userPassword + this.padding).substr(0, 32);
  let paddedOwnerPassword = (ownerPassword + this.padding).substr(0, 32);

  this.O = this.processOwnerPassword(paddedUserPassword, paddedOwnerPassword);
  this.P = -((protection ^ 255) + 1);
  this.encryptionKey = md5Bin(
    paddedUserPassword +
      this.O +
      this.lsbFirstWord(this.P) +
      this.hexToBytes(fileId)
  ).substr(0, 5);
  this.U = rc4(this.encryptionKey, this.padding);
}

/**
 * Breaks down a 4-byte number into its individual bytes, with the least significant bit first
 *
 * @name lsbFirstWord
 * @function
 * @param {number} data 32-bit number
 * @returns {Array}
 */
PDFSecurity.prototype.lsbFirstWord = function(data) {
  return String.fromCharCode(
    (data >> 0) & 0xff,
    (data >> 8) & 0xff,
    (data >> 16) & 0xff,
    (data >> 24) & 0xff
  );
};

/**
 * Converts a byte string to a hex string
 *
 * @name toHexString
 * @function
 * @param {String} byteString Byte string
 * @returns {String}
 */
PDFSecurity.prototype.toHexString = function(byteString) {
  return byteString
    .split("")
    .map(function(byte) {
      return ("0" + (byte.charCodeAt(0) & 0xff).toString(16)).slice(-2);
    })
    .join("");
};

/**
 * Converts a hex string to a byte string
 *
 * @name hexToBytes
 * @function
 * @param {String} hex Hex string
 * @returns {String}
 */
PDFSecurity.prototype.hexToBytes = function(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(String.fromCharCode(parseInt(hex.substr(c, 2), 16)));
  return bytes.join("");
};

/**
 * Computes the 'O' field in the encryption dictionary
 *
 * @name processOwnerPassword
 * @function
 * @param {String} paddedUserPassword Byte string of padded user password
 * @param {String} paddedOwnerPassword Byte string of padded owner password
 * @returns {String}
 */
PDFSecurity.prototype.processOwnerPassword = function(
  paddedUserPassword,
  paddedOwnerPassword
) {
  let key = md5Bin(paddedOwnerPassword).substr(0, 5);
  return rc4(key, paddedUserPassword);
};

/**
 * Returns an encryptor function which can take in a byte string and returns the encrypted version
 *
 * @name encryptor
 * @function
 * @param {number} objectId
 * @param {number} generation Not sure what this is for, you can set it to 0
 * @returns {Function}
 * @example
 * out("stream");
 * encryptor = security.encryptor(object.id, 0);
 * out(encryptor(data));
 * out("endstream");
 */
PDFSecurity.prototype.encryptor = function(objectId, generation) {
  let key = md5Bin(
    this.encryptionKey +
      String.fromCharCode(
        objectId & 0xff,
        (objectId >> 8) & 0xff,
        (objectId >> 16) & 0xff,
        generation & 0xff,
        (generation >> 8) & 0xff
      )
  ).substr(0, 10);
  return function(data) {
    return rc4(key, data);
  };
};

export { PDFSecurity };
