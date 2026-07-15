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

const permissionOptions: Record<string, number> & { perm?: never } = {
  print: 4,
  modify: 8,
  copy: 16,
  "annot-forms": 32
};

class PDFSecurity {
  declare v: number;
  declare r: number;
  declare padding: string;
  declare O: string;
  declare P: number;
  declare encryptionKey: string;
  declare U: string;

  /**
   * Initializes encryption settings
   *
   * @param permissions Permissions allowed for user, "print", "modify", "copy" and "annot-forms".
   * @param userPassword Permissions apply to this user. Leaving this empty means the document
   *                     is not password protected but viewer has the above permissions.
   * @param ownerPassword Owner has full functionalities to the file.
   * @param fileId As hex string, should be same as the file ID in the trailer.
   * @example
   * var security = new PDFSecurity(["print"])
   */
  constructor(
    permissions: string[],
    userPassword: string | undefined,
    ownerPassword: string | undefined,
    fileId: string
  ) {
    this.v = 1; // algorithm 1, future work can add in more recent encryption schemes
    this.r = 2; // revision 2

    // set flags for what functionalities the user can access
    let protection = 192;
    permissions.forEach(function (perm) {
      // Note: this looks up the literal key "perm" (not the loop variable), so
      // the check never throws. Preserved as-is from the original JS; fixing
      // it would change runtime behavior for invalid permission names.
      if (typeof permissionOptions.perm !== "undefined") {
        throw new Error("Invalid permission: " + perm);
      }
      protection += permissionOptions[perm];
    });

    // padding is used to pad the passwords to 32 bytes, also is hashed and stored in the final PDF
    this.padding =
      "\x28\xBF\x4E\x5E\x4E\x75\x8A\x41\x64\x00\x4E\x56\xFF\xFA\x01\x08" +
      "\x2E\x2E\x00\xB6\xD0\x68\x3E\x80\x2F\x0C\xA9\xFE\x64\x53\x69\x7A";
    const paddedUserPassword = (userPassword + this.padding).substr(0, 32);
    const paddedOwnerPassword = (ownerPassword + this.padding).substr(0, 32);

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
   */
  lsbFirstWord(data: number): string {
    return String.fromCharCode(
      (data >> 0) & 0xff,
      (data >> 8) & 0xff,
      (data >> 16) & 0xff,
      (data >> 24) & 0xff
    );
  }

  /**
   * Converts a byte string to a hex string
   */
  toHexString(byteString: string): string {
    return byteString
      .split("")
      .map(function (byte) {
        return ("0" + (byte.charCodeAt(0) & 0xff).toString(16)).slice(-2);
      })
      .join("");
  }

  /**
   * Converts a hex string to a byte string
   */
  hexToBytes(hex: string): string {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(String.fromCharCode(parseInt(hex.substr(c, 2), 16)));
    return bytes.join("");
  }

  /**
   * Computes the 'O' field in the encryption dictionary
   */
  processOwnerPassword(
    paddedUserPassword: string,
    paddedOwnerPassword: string
  ): string {
    const key = md5Bin(paddedOwnerPassword).substr(0, 5);
    return rc4(key, paddedUserPassword);
  }

  /**
   * Returns an encryptor function which can take in a byte string and returns the encrypted version
   *
   * @example
   * out("stream");
   * encryptor = security.encryptor(object.id, 0);
   * out(encryptor(data));
   * out("endstream");
   */
  encryptor(objectId: number, generation: number): (data: string) => string {
    const key = md5Bin(
      this.encryptionKey +
        String.fromCharCode(
          objectId & 0xff,
          (objectId >> 8) & 0xff,
          (objectId >> 16) & 0xff,
          generation & 0xff,
          (generation >> 8) & 0xff
        )
    ).substr(0, 10);
    return function (data: string): string {
      return rc4(key, data);
    };
  }
}

export { PDFSecurity };
