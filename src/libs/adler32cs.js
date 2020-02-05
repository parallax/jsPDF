/* global jsPDF */
/*
 * Copyright (c) 2012 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

(function(jsPDF, callback) {
  jsPDF.API.adler32cs = callback();
})(jsPDF, function() {
  var _hasArrayBuffer =
    typeof ArrayBuffer === "function" && typeof Uint8Array === "function";

  var _Buffer = null,
    _isBuffer = (function() {
      if (!_hasArrayBuffer)
        return function _isBuffer() {
          return false;
        };

      try {
        var buffer = {};
        if (typeof buffer.Buffer === "function") _Buffer = buffer.Buffer;
        // eslint-disable-next-line no-empty
      } catch (error) {}

      return function _isBuffer(value) {
        return (
          value instanceof ArrayBuffer ||
          (_Buffer !== null && value instanceof _Buffer)
        );
      };
    })();

  var _utf8ToBinary = (function() {
    if (_Buffer !== null) {
      return function _utf8ToBinary(utf8String) {
        return new _Buffer(utf8String, "utf8").toString("binary");
      };
    } else {
      return function _utf8ToBinary(utf8String) {
        return unescape(encodeURIComponent(utf8String));
      };
    }
  })();

  var MOD = 65521;

  var _update = function _update(checksum, binaryString) {
    var a = checksum & 0xffff,
      b = checksum >>> 16;
    for (var i = 0, length = binaryString.length; i < length; i++) {
      a = (a + (binaryString.charCodeAt(i) & 0xff)) % MOD;
      b = (b + a) % MOD;
    }
    return ((b << 16) | a) >>> 0;
  };

  var _updateUint8Array = function _updateUint8Array(checksum, uint8Array) {
    var a = checksum & 0xffff,
      b = checksum >>> 16;
    for (var i = 0, length = uint8Array.length; i < length; i++) {
      a = (a + uint8Array[i]) % MOD;
      b = (b + a) % MOD;
    }
    return ((b << 16) | a) >>> 0;
  };

  var exports = {};

  var Adler32 = (exports.Adler32 = (function() {
    var ctor = function Adler32(checksum) {
      if (!(this instanceof ctor)) {
        throw new TypeError("Constructor cannot called be as a function.");
      }
      if (!isFinite((checksum = checksum === null ? 1 : +checksum))) {
        throw new Error("First arguments needs to be a finite number.");
      }
      this.checksum = checksum >>> 0;
    };

    var proto = (ctor.prototype = {});
    proto.constructor = ctor;

    ctor.from = (function(from) {
      from.prototype = proto;
      return from;
    })(function from(binaryString) {
      if (!(this instanceof ctor)) {
        throw new TypeError("Constructor cannot called be as a function.");
      }
      if (binaryString === null)
        throw new Error("First argument needs to be a string.");
      this.checksum = _update(1, binaryString.toString());
    });

    ctor.fromUtf8 = (function(fromUtf8) {
      fromUtf8.prototype = proto;
      return fromUtf8;
    })(function fromUtf8(utf8String) {
      if (!(this instanceof ctor)) {
        throw new TypeError("Constructor cannot called be as a function.");
      }
      if (utf8String === null)
        throw new Error("First argument needs to be a string.");
      var binaryString = _utf8ToBinary(utf8String.toString());
      this.checksum = _update(1, binaryString);
    });

    if (_hasArrayBuffer) {
      ctor.fromBuffer = (function(fromBuffer) {
        fromBuffer.prototype = proto;
        return fromBuffer;
      })(function fromBuffer(buffer) {
        if (!(this instanceof ctor)) {
          throw new TypeError("Constructor cannot called be as a function.");
        }
        if (!_isBuffer(buffer))
          throw new Error("First argument needs to be ArrayBuffer.");
        var array = new Uint8Array(buffer);
        return (this.checksum = _updateUint8Array(1, array));
      });
    }

    proto.update = function update(binaryString) {
      if (binaryString === null)
        throw new Error("First argument needs to be a string.");
      binaryString = binaryString.toString();
      return (this.checksum = _update(this.checksum, binaryString));
    };

    proto.updateUtf8 = function updateUtf8(utf8String) {
      if (utf8String === null)
        throw new Error("First argument needs to be a string.");
      var binaryString = _utf8ToBinary(utf8String.toString());
      return (this.checksum = _update(this.checksum, binaryString));
    };

    if (_hasArrayBuffer) {
      proto.updateBuffer = function updateBuffer(buffer) {
        if (!_isBuffer(buffer))
          throw new Error("First argument needs to be ArrayBuffer.");
        var array = new Uint8Array(buffer);
        return (this.checksum = _updateUint8Array(this.checksum, array));
      };
    }

    proto.clone = function clone() {
      return new Adler32(this.checksum);
    };

    return ctor;
  })());

  exports.from = function from(binaryString) {
    if (binaryString === null)
      throw new Error("First argument needs to be a string.");
    return _update(1, binaryString.toString());
  };

  exports.fromUtf8 = function fromUtf8(utf8String) {
    if (utf8String === null)
      throw new Error("First argument needs to be a string.");
    var binaryString = _utf8ToBinary(utf8String.toString());
    return _update(1, binaryString);
  };

  if (_hasArrayBuffer) {
    exports.fromBuffer = function fromBuffer(buffer) {
      if (!_isBuffer(buffer))
        throw new Error("First argument need to be ArrayBuffer.");
      var array = new Uint8Array(buffer);
      return _updateUint8Array(1, array);
    };
  }

  return exports;
});
