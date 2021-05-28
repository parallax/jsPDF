/**
 * Convert string to `PDF Name Object`.
 * Detail: PDF Reference 1.3 - Chapter 3.2.4 Name Object
 * @param str
 */
function toPDFName(str) {
  // eslint-disable-next-line no-control-regex
  if (/[^\u0000-\u00ff]/.test(str)) {
    // non ascii string
    throw new Error(
      "Invalid PDF Name Object: " + str + ", Only accept ASCII characters."
    );
  }
  var result = "",
    strLength = str.length;
  for (var i = 0; i < strLength; i++) {
    var charCode = str.charCodeAt(i);
    if (
      charCode < 0x21 ||
      charCode === 0x23 /* # */ ||
      charCode === 0x25 /* % */ ||
      charCode === 0x28 /* ( */ ||
      charCode === 0x29 /* ) */ ||
      charCode === 0x2f /* / */ ||
      charCode === 0x3c /* < */ ||
      charCode === 0x3e /* > */ ||
      charCode === 0x5b /* [ */ ||
      charCode === 0x5d /* ] */ ||
      charCode === 0x7b /* { */ ||
      charCode === 0x7d /* } */ ||
      charCode > 0x7e
    ) {
      // Char    CharCode    hexStr   paddingHexStr    Result
      // "\t"    9           9        09               #09
      // " "     32          20       20               #20
      // "©"     169         a9       a9               #a9
      var hexStr = charCode.toString(16),
        paddingHexStr = ("0" + hexStr).slice(-2);

      result += "#" + paddingHexStr;
    } else {
      // Other ASCII printable characters between 0x21 <= X <= 0x7e
      result += str[i];
    }
  }
  return result;
}

export { toPDFName };
