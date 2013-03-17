var arguments_ = [];

var ENVIRONMENT_IS_NODE = typeof process === "object";

var ENVIRONMENT_IS_WEB = typeof window === "object";

var ENVIRONMENT_IS_WORKER = typeof importScripts === "function";

var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (ENVIRONMENT_IS_NODE) {
  var print = (function(x) {
    process["stdout"].write(x + "\n");
  });
  var printErr = (function(x) {
    process["stderr"].write(x + "\n");
  });
  var nodeFS = require("fs");
  read = (function(filename) {
    var ret = nodeFS["readFileSync"](filename).toString();
    if (!ret && filename[0] != "/") {
      filename = __dirname.split("/").slice(0, -1).join("/") + "/src/" + filename;
      ret = nodeFS["readFileSync"](filename).toString();
    }
    return ret;
  });
  arguments_ = process["argv"].slice(2);
} else if (ENVIRONMENT_IS_WEB) {
  var print = printErr = (function(x) {
    console.log(x);
  });
  var read = (function(url) {
    var xhr = new XMLHttpRequest;
    xhr.open("GET", url, false);
    xhr.send(null);
    return xhr.responseText;
  });
} else if (ENVIRONMENT_IS_WORKER) {
  var load = importScripts;
} else {
  throw "Unknown runtime environment. Where are we?";
}

function globalEval(x) {
  eval.call(null, x);
}

if (typeof load == "undefined" && typeof read != "undefined") {
  var load = (function(f) {
    globalEval(read(f));
  });
}

if (typeof printErr === "undefined") {
  var printErr = (function() {});
}

if (typeof print === "undefined") {
  var print = printErr;
}

var Module = {};

var Runtime = {
  stackSave: (function() {
    return STACKTOP;
  }),
  stackRestore: (function(stackTop) {
    STACKTOP = stackTop;
  }),
  forceAlign: (function(target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target / quantum) * quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      var logg = log2(quantum);
      return "((((" + target + ")+" + (quantum - 1) + ")>>" + logg + ")<<" + logg + ")";
    }
    return "Math.ceil((" + target + ")/" + quantum + ")*" + quantum;
  }),
  isNumberType: (function(type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  }),
  isPointerType: function isPointerType(type) {
    return type[type.length - 1] == "*";
  },
  isStructType: function isStructType(type) {
    if (isPointerType(type)) return false;
    if (/^\[\d+\ x\ (.*)\]/.test(type)) return true;
    if (/<?{ [^}]* }>?/.test(type)) return true;
    return type[0] == "%";
  },
  INT_TYPES: {
    "i1": 0,
    "i8": 0,
    "i16": 0,
    "i32": 0,
    "i64": 0
  },
  FLOAT_TYPES: {
    "float": 0,
    "double": 0
  },
  bitshift64: (function(low, high, op, bits) {
    var ander = Math.pow(2, bits) - 1;
    if (bits < 32) {
      switch (op) {
       case "shl":
        return [ low << bits, high << bits | (low & ander << 32 - bits) >>> 32 - bits ];
       case "ashr":
        return [ (low >>> bits | (high & ander) << 32 - bits) >> 0 >>> 0, high >> bits >>> 0 ];
       case "lshr":
        return [ (low >>> bits | (high & ander) << 32 - bits) >>> 0, high >>> bits ];
      }
    } else if (bits == 32) {
      switch (op) {
       case "shl":
        return [ 0, low ];
       case "ashr":
        return [ high, (high | 0) < 0 ? ander : 0 ];
       case "lshr":
        return [ high, 0 ];
      }
    } else {
      switch (op) {
       case "shl":
        return [ 0, low << bits - 32 ];
       case "ashr":
        return [ high >> bits - 32 >>> 0, (high | 0) < 0 ? ander : 0 ];
       case "lshr":
        return [ high >>> bits - 32, 0 ];
      }
    }
    abort("unknown bitshift64 op: " + [ value, op, bits ]);
  }),
  or64: (function(x, y) {
    var l = x | 0 | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  }),
  and64: (function(x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  }),
  xor64: (function(x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  }),
  getNativeTypeSize: (function(type, quantumSize) {
    if (Runtime.QUANTUM_SIZE == 1) return 1;
    var size = {
      "%i1": 1,
      "%i8": 1,
      "%i16": 2,
      "%i32": 4,
      "%i64": 8,
      "%float": 4,
      "%double": 8
    }["%" + type];
    if (!size) {
      if (type[type.length - 1] == "*") {
        size = Runtime.QUANTUM_SIZE;
      } else if (type[0] == "i") {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 == 0);
        size = bits / 8;
      }
    }
    return size;
  }),
  getNativeFieldSize: (function(type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  }),
  dedup: function dedup(items, ident) {
    var seen = {};
    if (ident) {
      return items.filter((function(item) {
        if (seen[item[ident]]) return false;
        seen[item[ident]] = true;
        return true;
      }));
    } else {
      return items.filter((function(item) {
        if (seen[item]) return false;
        seen[item] = true;
        return true;
      }));
    }
  },
  set: function set() {
    var args = typeof arguments[0] === "object" ? arguments[0] : arguments;
    var ret = {};
    for (var i = 0; i < args.length; i++) {
      ret[args[i]] = 0;
    }
    return ret;
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    type.flatIndexes = type.fields.map((function(field) {
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field);
        alignSize = size;
      } else if (Runtime.isStructType(field)) {
        size = Types.types[field].flatSize;
        alignSize = Types.types[field].alignSize;
      } else {
        throw "Unclear type in struct: " + field + ", in " + type.name_ + " :: " + dump(Types.types[type.name_]);
      }
      alignSize = type.packed ? 1 : Math.min(alignSize, Runtime.QUANTUM_SIZE);
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize);
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr - prev);
      }
      prev = curr;
      return curr;
    }));
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = type.flatFactor != 1;
    return type.flatIndexes;
  },
  generateStructInfo: (function(struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === "undefined" ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      assert(type.fields.length === struct.length, "Number of named fields must match the type for " + typeName);
      alignment = type.flatIndexes;
    } else {
      var type = {
        fields: struct.map((function(item) {
          return item[0];
        }))
      };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach((function(item, i) {
        if (typeof item === "string") {
          ret[item] = alignment[i] + offset;
        } else {
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      }));
    } else {
      struct.forEach((function(item, i) {
        ret[item[1]] = alignment[i];
      }));
    }
    return ret;
  }),
  stackAlloc: function stackAlloc(size) {
    var ret = STACKTOP;
    STACKTOP += size;
    STACKTOP = STACKTOP + 3 >> 2 << 2;
    return ret;
  },
  staticAlloc: function staticAlloc(size) {
    var ret = STATICTOP;
    STATICTOP += size;
    STATICTOP = STATICTOP + 3 >> 2 << 2;
    if (STATICTOP >= TOTAL_MEMORY) enlargeMemory();
    return ret;
  },
  alignMemory: function alignMemory(size, quantum) {
    var ret = size = Math.ceil(size / (quantum ? quantum : 4)) * (quantum ? quantum : 4);
    return ret;
  },
  makeBigInt: function makeBigInt(low, high, unsigned) {
    var ret = unsigned ? (low >>> 0) + (high >>> 0) * 4294967296 : (low >>> 0) + (high | 0) * 4294967296;
    return ret;
  },
  QUANTUM_SIZE: 4,
  __dummy__: 0
};

var CorrectionsMonitor = {
  MAX_ALLOWED: 0,
  corrections: 0,
  sigs: {},
  note: (function(type, succeed, sig) {
    if (!succeed) {
      this.corrections++;
      if (this.corrections >= this.MAX_ALLOWED) abort("\n\nToo many corrections!");
    }
  }),
  print: (function() {})
};

var __THREW__ = false;

var ABORT = false;

var undef = 0;

var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD;

var tempI64, tempI64b;

function abort(text) {
  print(text + ":\n" + (new Error).stack);
  ABORT = true;
  throw "Assertion: " + text;
}

function assert(condition, text) {
  if (!condition) {
    abort("Assertion failed: " + text);
  }
}

var globalScope = this;

function ccall(ident, returnType, argTypes, args) {
  function toC(value, type) {
    if (type == "string") {
      var ret = STACKTOP;
      Runtime.stackAlloc(value.length + 1);
      writeStringToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == "string") {
      return Pointer_stringify(value);
    }
    return value;
  }
  try {
    var func = eval("_" + ident);
  } catch (e) {
    try {
      func = globalScope["Module"]["_" + ident];
    } catch (e) {}
  }
  assert(func, "Cannot call unknown function " + ident + " (perhaps LLVM optimizations or closure removed it?)");
  var i = 0;
  var cArgs = args ? args.map((function(arg) {
    return toC(arg, argTypes[i++]);
  })) : [];
  return fromC(func.apply(null, cArgs), returnType);
}

Module["ccall"] = ccall;

function cwrap(ident, returnType, argTypes) {
  return (function() {
    return ccall(ident, returnType, argTypes, Array.prototype.slice.call(arguments));
  });
}

function setValue(ptr, value, type, noSafe) {
  type = type || "i8";
  if (type[type.length - 1] === "*") type = "i32";
  switch (type) {
   case "i1":
    HEAP8[ptr] = value;
    break;
   case "i8":
    HEAP8[ptr] = value;
    break;
   case "i16":
    HEAP16[ptr >> 1] = value;
    break;
   case "i32":
    HEAP32[ptr >> 2] = value;
    break;
   case "i64":
    HEAP32[ptr >> 2] = value;
    break;
   case "float":
    HEAPF32[ptr >> 2] = value;
    break;
   case "double":
    tempDoubleF64[0] = value, HEAP32[ptr >> 2] = tempDoubleI32[0], HEAP32[ptr + 4 >> 2] = tempDoubleI32[1];
    break;
   default:
    abort("invalid type for setValue: " + type);
  }
}

Module["setValue"] = setValue;

function getValue(ptr, type, noSafe) {
  type = type || "i8";
  if (type[type.length - 1] === "*") type = "i32";
  switch (type) {
   case "i1":
    return HEAP8[ptr];
   case "i8":
    return HEAP8[ptr];
   case "i16":
    return HEAP16[ptr >> 1];
   case "i32":
    return HEAP32[ptr >> 2];
   case "i64":
    return HEAP32[ptr >> 2];
   case "float":
    return HEAPF32[ptr >> 2];
   case "double":
    return tempDoubleI32[0] = HEAP32[ptr >> 2], tempDoubleI32[1] = HEAP32[ptr + 4 >> 2], tempDoubleF64[0];
   default:
    abort("invalid type for setValue: " + type);
  }
  return null;
}

Module["getValue"] = getValue;

var ALLOC_NORMAL = 0;

var ALLOC_STACK = 1;

var ALLOC_STATIC = 2;

Module["ALLOC_NORMAL"] = ALLOC_NORMAL;

Module["ALLOC_STACK"] = ALLOC_STACK;

Module["ALLOC_STATIC"] = ALLOC_STATIC;

function allocate(slab, types, allocator) {
  var zeroinit, size;
  if (typeof slab === "number") {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === "string" ? types : null;
  var ret = [ _malloc, Runtime.stackAlloc, Runtime.staticAlloc ][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  if (zeroinit) {
    _memset(ret, 0, size);
    return ret;
  }
  var i = 0, type;
  while (i < size) {
    var curr = slab[i];
    if (typeof curr === "function") {
      curr = Runtime.getFunctionIndex(curr);
    }
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    if (type == "i64") type = "i32";
    setValue(ret + i, curr, type);
    i += Runtime.getNativeTypeSize(type);
  }
  return ret;
}

Module["allocate"] = allocate;

function Pointer_stringify(ptr, length) {
  var nullTerminated = typeof length == "undefined";
  var ret = "";
  var i = 0;
  var t;
  var nullByte = String.fromCharCode(0);
  while (1) {
    t = String.fromCharCode(HEAPU8[ptr + i]);
    if (nullTerminated && t == nullByte) {
      break;
    } else {}
    ret += t;
    i += 1;
    if (!nullTerminated && i == length) {
      break;
    }
  }
  return ret;
}

Module["Pointer_stringify"] = Pointer_stringify;

function Array_stringify(array) {
  var ret = "";
  for (var i = 0; i < array.length; i++) {
    ret += String.fromCharCode(array[i]);
  }
  return ret;
}

Module["Array_stringify"] = Array_stringify;

var FUNCTION_TABLE;

var PAGE_SIZE = 4096;

function alignMemoryPage(x) {
  return x + 4095 >> 12 << 12;
}

var HEAP;

var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32;

var STACK_ROOT, STACKTOP, STACK_MAX;

var STATICTOP;

function enlargeMemory() {
  while (TOTAL_MEMORY <= STATICTOP) {
    TOTAL_MEMORY = alignMemoryPage(2 * TOTAL_MEMORY);
  }
  var oldHEAP8 = HEAP8;
  var buffer = new ArrayBuffer(TOTAL_MEMORY);
  HEAP8 = new Int8Array(buffer);
  HEAP16 = new Int16Array(buffer);
  HEAP32 = new Int32Array(buffer);
  HEAPU8 = new Uint8Array(buffer);
  HEAPU16 = new Uint16Array(buffer);
  HEAPU32 = new Uint32Array(buffer);
  HEAPF32 = new Float32Array(buffer);
  HEAP8.set(oldHEAP8);
}

var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;

var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 10485760;

var FAST_MEMORY = Module["FAST_MEMORY"] || 2097152;

assert(!!Int32Array && !!Float64Array && !!(new Int32Array(1))["subarray"] && !!(new Int32Array(1))["set"], "Cannot fallback to non-typed array case: Code is too specialized");

var buffer = new ArrayBuffer(TOTAL_MEMORY);

HEAP8 = new Int8Array(buffer);

HEAP16 = new Int16Array(buffer);

HEAP32 = new Int32Array(buffer);

HEAPU8 = new Uint8Array(buffer);

HEAPU16 = new Uint16Array(buffer);

HEAPU32 = new Uint32Array(buffer);

HEAPF32 = new Float32Array(buffer);

HEAP32[0] = 255;

assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, "Typed arrays 2 must be run on a little-endian system");

var base = intArrayFromString("(null)");

STATICTOP = base.length;

for (var i = 0; i < base.length; i++) {
  HEAP8[i] = base[i];
}

Module["HEAP"] = HEAP;

Module["HEAP8"] = HEAP8;

Module["HEAP16"] = HEAP16;

Module["HEAP32"] = HEAP32;

Module["HEAPU8"] = HEAPU8;

Module["HEAPU16"] = HEAPU16;

Module["HEAPU32"] = HEAPU32;

Module["HEAPF32"] = HEAPF32;

STACK_ROOT = STACKTOP = Runtime.alignMemory(STATICTOP);

STACK_MAX = STACK_ROOT + TOTAL_STACK;

var tempDoublePtr = Runtime.alignMemory(STACK_MAX, 8);

var tempDoubleI8 = HEAP8.subarray(tempDoublePtr);

var tempDoubleI32 = HEAP32.subarray(tempDoublePtr >> 2);

var tempDoubleF32 = HEAPF32.subarray(tempDoublePtr >> 2);

var tempDoubleF64 = (new Float64Array(HEAP8.buffer)).subarray(tempDoublePtr >> 3);

function copyTempFloat(ptr) {
  tempDoubleI8[0] = HEAP8[ptr];
  tempDoubleI8[1] = HEAP8[ptr + 1];
  tempDoubleI8[2] = HEAP8[ptr + 2];
  tempDoubleI8[3] = HEAP8[ptr + 3];
}

function copyTempDouble(ptr) {
  tempDoubleI8[0] = HEAP8[ptr];
  tempDoubleI8[1] = HEAP8[ptr + 1];
  tempDoubleI8[2] = HEAP8[ptr + 2];
  tempDoubleI8[3] = HEAP8[ptr + 3];
  tempDoubleI8[4] = HEAP8[ptr + 4];
  tempDoubleI8[5] = HEAP8[ptr + 5];
  tempDoubleI8[6] = HEAP8[ptr + 6];
  tempDoubleI8[7] = HEAP8[ptr + 7];
}

STACK_MAX = tempDoublePtr + 8;

STATICTOP = alignMemoryPage(STACK_MAX);

function callRuntimeCallbacks(callbacks) {
  while (callbacks.length > 0) {
    var callback = callbacks.shift();
    var func = callback.func;
    if (typeof func === "number") {
      func = FUNCTION_TABLE[func];
    }
    func(callback.arg === undefined ? null : callback.arg);
  }
}

var __ATINIT__ = [];

var __ATEXIT__ = [];

function initRuntime() {
  callRuntimeCallbacks(__ATINIT__);
}

function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
  CorrectionsMonitor.print();
}

function Array_copy(ptr, num) {
  return Array.prototype.slice.call(HEAP8.subarray(ptr, ptr + num));
  return HEAP.slice(ptr, ptr + num);
}

Module["Array_copy"] = Array_copy;

function TypedArray_copy(ptr, num) {
  var arr = new Uint8Array(num);
  for (var i = 0; i < num; ++i) {
    arr[i] = HEAP8[ptr + i];
  }
  return arr.buffer;
}

Module["TypedArray_copy"] = TypedArray_copy;

function String_len(ptr) {
  var i = 0;
  while (HEAP8[ptr + i]) i++;
  return i;
}

Module["String_len"] = String_len;

function String_copy(ptr, addZero) {
  var len = String_len(ptr);
  if (addZero) len++;
  var ret = Array_copy(ptr, len);
  if (addZero) ret[len - 1] = 0;
  return ret;
}

Module["String_copy"] = String_copy;

function intArrayFromString(stringy, dontAddNull) {
  var ret = [];
  var t;
  var i = 0;
  while (i < stringy.length) {
    var chr = stringy.charCodeAt(i);
    if (chr > 255) {
      chr &= 255;
    }
    ret.push(chr);
    i = i + 1;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}

Module["intArrayFromString"] = intArrayFromString;

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 255) {
      chr &= 255;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join("");
}

Module["intArrayToString"] = intArrayToString;

function writeStringToMemory(string, buffer, dontAddNull) {
  var i = 0;
  while (i < string.length) {
    var chr = string.charCodeAt(i);
    if (chr > 255) {
      chr &= 255;
    }
    HEAP8[buffer + i] = chr;
    i = i + 1;
  }
  if (!dontAddNull) {
    HEAP8[buffer + i] = 0;
  }
}

Module["writeStringToMemory"] = writeStringToMemory;

var STRING_TABLE = [];

function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2 * Math.abs(1 << bits - 1) + value : Math.pow(2, bits) + value;
}

function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << bits - 1) : Math.pow(2, bits - 1);
  if (value >= half && (bits <= 32 || value > half)) {
    value = -2 * half + value;
  }
  return value;
}

function _def($source, $dest) {
  var $avail_out$s2;
  var $strm$s2;
  var __stackBase__ = STACKTOP;
  STACKTOP += 32824;
  var __label__;
  var $strm = __stackBase__, $strm$s2 = $strm >> 2;
  var $in = __stackBase__ + 56;
  var $out = __stackBase__ + 16440;
  HEAP32[$strm$s2 + 8] = 0;
  HEAP32[$strm$s2 + 9] = 0;
  HEAP32[$strm$s2 + 10] = 0;
  var $0 = $strm;
  var $call = _deflateInit2_($0);
  var $cmp = ($call | 0) == 0;
  $do_body_preheader$$return$2 : do {
    if ($cmp) {
      var $arraydecay = $in | 0;
      var $avail_in = $strm + 4 | 0;
      var $next_in = $strm | 0;
      var $avail_out$s2 = ($strm + 16 | 0) >> 2;
      var $arraydecay10 = $out | 0;
      var $next_out = $strm + 12 | 0;
      $do_body$4 : while (1) {
        var $call1 = _fread($arraydecay, 1, 16384, $source);
        HEAP32[$avail_in >> 2] = $call1;
        var $call2 = _ferror($source);
        if (($call2 | 0) != 0) {
          _deflateEnd($0);
          var $retval_0 = -1;
          break $do_body_preheader$$return$2;
        }
        var $call6 = _feof($source);
        var $tobool7 = ($call6 | 0) != 0;
        var $cond = $tobool7 ? 4 : 1;
        HEAP32[$next_in >> 2] = $arraydecay;
        $do_body9$8 : while (1) {
          HEAP32[$avail_out$s2] = 16384;
          HEAP32[$next_out >> 2] = $arraydecay10;
          var $call11 = _deflate($0, $cond);
          if (($call11 | 0) == -2) {
            ___assert_func(STRING_TABLE.__str1 | 0, 75, STRING_TABLE.___func___def | 0, STRING_TABLE.__str2 | 0);
          }
          var $sub = 16384 - HEAP32[$avail_out$s2] | 0;
          var $call15 = _fwrite($arraydecay10, 1, $sub, $dest);
          var $cmp16 = ($call15 | 0) == ($sub | 0);
          do {
            if ($cmp16) {
              var $call17 = _ferror($dest);
              if (($call17 | 0) != 0) {
                break;
              }
              if ((HEAP32[$avail_out$s2] | 0) == 0) {
                continue $do_body9$8;
              }
              if ((HEAP32[$avail_in >> 2] | 0) == 0) {
                __label__ = 13;
              } else {
                ___assert_func(STRING_TABLE.__str1 | 0, 82, STRING_TABLE.___func___def | 0, STRING_TABLE.__str3 | 0);
              }
              if (!$tobool7) {
                continue $do_body$4;
              }
              if (($call11 | 0) != 1) {
                ___assert_func(STRING_TABLE.__str1 | 0, 86, STRING_TABLE.___func___def | 0, STRING_TABLE.__str4 | 0);
              }
              _deflateEnd($0);
              var $retval_0 = 0;
              break $do_body_preheader$$return$2;
            }
          } while (0);
          _deflateEnd($0);
          var $retval_0 = -1;
          break $do_body_preheader$$return$2;
        }
      }
    } else {
      var $retval_0 = $call;
    }
  } while (0);
  var $retval_0;
  STACKTOP = __stackBase__;
  return $retval_0;
  return null;
}

_def["X"] = 1;

function _inf($source, $dest) {
  var $avail_out$s2;
  var $strm$s2;
  var __stackBase__ = STACKTOP;
  STACKTOP += 32824;
  var $strm = __stackBase__, $strm$s2 = $strm >> 2;
  var $in = __stackBase__ + 56;
  var $out = __stackBase__ + 16440;
  HEAP32[$strm$s2 + 8] = 0;
  HEAP32[$strm$s2 + 9] = 0;
  HEAP32[$strm$s2 + 10] = 0;
  var $avail_in = $strm + 4 | 0;
  HEAP32[$avail_in >> 2] = 0;
  var $next_in = $strm | 0;
  HEAP32[$next_in >> 2] = 0;
  var $call = _inflateInit_($strm);
  var $cmp = ($call | 0) == 0;
  $do_body_preheader$$return$28 : do {
    if ($cmp) {
      var $arraydecay = $in | 0;
      var $avail_out$s2 = ($strm + 16 | 0) >> 2;
      var $arraydecay14 = $out | 0;
      var $next_out = $strm + 12 | 0;
      var $ret_0 = 0;
      $do_body$30 : while (1) {
        var $ret_0;
        var $call1 = _fread($arraydecay, 1, 16384, $source);
        HEAP32[$avail_in >> 2] = $call1;
        var $call3 = _ferror($source);
        if (($call3 | 0) == 0) {
          var $cmp8 = ($call1 | 0) == 0;
          $do_end32$$if_end10$34 : do {
            if ($cmp8) {
              var $ret_2 = $ret_0;
            } else {
              HEAP32[$next_in >> 2] = $arraydecay;
              $do_body13$36 : while (1) {
                HEAP32[$avail_out$s2] = 16384;
                HEAP32[$next_out >> 2] = $arraydecay14;
                var $call15 = _inflate($strm);
                if ($call15 == -2) {
                  ___assert_func(STRING_TABLE.__str1 | 0, 133, STRING_TABLE.___func___inf | 0, STRING_TABLE.__str2 | 0);
                } else if ($call15 == 2) {
                  var $ret_1 = -3;
                  break $do_body$30;
                } else if ($call15 == -3 || $call15 == -4) {
                  var $ret_1 = $call15;
                  break $do_body$30;
                }
                var $sub = 16384 - HEAP32[$avail_out$s2] | 0;
                var $call21 = _fwrite($arraydecay14, 1, $sub, $dest);
                var $cmp22 = ($call21 | 0) == ($sub | 0);
                do {
                  if ($cmp22) {
                    var $call23 = _ferror($dest);
                    if (($call23 | 0) != 0) {
                      break;
                    }
                    if ((HEAP32[$avail_out$s2] | 0) == 0) {
                      continue $do_body13$36;
                    }
                    if (($call15 | 0) == 1) {
                      var $ret_2 = 1;
                      break $do_end32$$if_end10$34;
                    }
                    var $ret_0 = $call15;
                    continue $do_body$30;
                  }
                } while (0);
                _inflateEnd($strm);
                var $retval_0 = -1;
                break $do_body_preheader$$return$28;
              }
            }
          } while (0);
          var $ret_2;
          _inflateEnd($strm);
          var $cond = ($ret_2 | 0) == 1 ? 0 : -3;
          var $retval_0 = $cond;
          break $do_body_preheader$$return$28;
        }
        _inflateEnd($strm);
        var $retval_0 = -1;
        break $do_body_preheader$$return$28;
      }
      var $ret_1;
      _inflateEnd($strm);
      var $retval_0 = $ret_1;
    } else {
      var $retval_0 = $call;
    }
  } while (0);
  var $retval_0;
  STACKTOP = __stackBase__;
  return $retval_0;
  return null;
}

_inf["X"] = 1;

function _zerr($ret) {
  var $1 = HEAP32[HEAP32[__impure_ptr >> 2] + 12 >> 2];
  var $2 = _fwrite(STRING_TABLE.__str5 | 0, 7, 1, $1);
  do {
    if ($ret == -1) {
      var $3 = HEAP32[__impure_ptr >> 2];
      var $4 = HEAP32[$3 + 4 >> 2];
      var $call1 = _ferror($4);
      if (($call1 | 0) == 0) {
        var $7 = $3;
      } else {
        var $5 = HEAP32[$3 + 12 >> 2];
        var $6 = _fwrite(STRING_TABLE.__str6 | 0, 20, 1, $5);
        var $7 = HEAP32[__impure_ptr >> 2];
      }
      var $7;
      var $8 = HEAP32[$7 + 8 >> 2];
      var $call4 = _ferror($8);
      if (($call4 | 0) == 0) {
        break;
      }
      var $9 = HEAP32[$7 + 12 >> 2];
      var $10 = _fwrite(STRING_TABLE.__str7 | 0, 21, 1, $9);
    } else if ($ret == -2) {
      var $12 = HEAP32[HEAP32[__impure_ptr >> 2] + 12 >> 2];
      var $13 = _fwrite(STRING_TABLE.__str8 | 0, 26, 1, $12);
    } else if ($ret == -3) {
      var $15 = HEAP32[HEAP32[__impure_ptr >> 2] + 12 >> 2];
      var $16 = _fwrite(STRING_TABLE.__str9 | 0, 35, 1, $15);
    } else if ($ret == -4) {
      var $18 = HEAP32[HEAP32[__impure_ptr >> 2] + 12 >> 2];
      var $19 = _fwrite(STRING_TABLE.__str10 | 0, 14, 1, $18);
    } else if ($ret == -6) {
      var $21 = HEAP32[HEAP32[__impure_ptr >> 2] + 12 >> 2];
      var $22 = _fwrite(STRING_TABLE.__str11 | 0, 23, 1, $21);
    }
  } while (0);
  return;
  return;
}

function _main($argc, $argv) {
  var __label__;
  do {
    if ($argc == 1) {
      var $0 = HEAP32[__impure_ptr >> 2];
      var $1 = HEAP32[$0 + 4 >> 2];
      var $2 = HEAP32[$0 + 8 >> 2];
      var $call = _def($1, $2);
      if (($call | 0) == 0) {
        var $retval_0 = 0;
        __label__ = 7;
        break;
      }
      _zerr($call);
      var $retval_0 = $call;
      __label__ = 7;
      break;
    } else if ($argc == 2) {
      var $3 = HEAP32[$argv + 4 >> 2];
      var $call4 = _strcmp($3, STRING_TABLE.__str12 | 0);
      if (($call4 | 0) != 0) {
        __label__ = 6;
        break;
      }
      var $4 = HEAP32[__impure_ptr >> 2];
      var $5 = HEAP32[$4 + 4 >> 2];
      var $6 = HEAP32[$4 + 8 >> 2];
      var $call9 = _inf($5, $6);
      if (($call9 | 0) == 0) {
        var $retval_0 = 0;
        __label__ = 7;
        break;
      }
      _zerr($call9);
      var $retval_0 = $call9;
      __label__ = 7;
      break;
    } else {
      __label__ = 6;
    }
  } while (0);
  if (__label__ == 6) {
    var $8 = HEAP32[HEAP32[__impure_ptr >> 2] + 12 >> 2];
    var $9 = _fwrite(STRING_TABLE.__str13 | 0, 40, 1, $8);
    var $retval_0 = 1;
  }
  var $retval_0;
  return $retval_0;
  return null;
}

Module["_main"] = _main;

function _deflateInit2_($strm) {
  var $8$s2;
  var $opaque67$s2;
  var $zalloc$s2;
  var $cmp7 = ($strm | 0) == 0;
  $return$$if_end10$74 : do {
    if ($cmp7) {
      var $retval_0 = -2;
    } else {
      var $msg = $strm + 24 | 0;
      HEAP32[$msg >> 2] = 0;
      var $zalloc$s2 = ($strm + 32 | 0) >> 2;
      var $0 = HEAP32[$zalloc$s2];
      if (($0 | 0) == 0) {
        HEAP32[$zalloc$s2] = 2;
        HEAP32[$strm + 40 >> 2] = 0;
        var $1 = 2;
      } else {
        var $1 = $0;
      }
      var $1;
      var $zfree = $strm + 36 | 0;
      if ((HEAP32[$zfree >> 2] | 0) == 0) {
        HEAP32[$zfree >> 2] = 4;
      }
      var $opaque67$s2 = ($strm + 40 | 0) >> 2;
      var $3 = HEAP32[$opaque67$s2];
      var $call = FUNCTION_TABLE[$1]($3, 1, 5828);
      if (($call | 0) == 0) {
        var $retval_0 = -4;
        break;
      }
      var $4 = $call;
      HEAP32[$strm + 28 >> 2] = $4;
      var $strm72 = $call;
      HEAP32[$strm72 >> 2] = $strm;
      var $5 = $call + 24 | 0;
      HEAP32[$5 >> 2] = 1;
      var $6 = $call + 28 | 0;
      HEAP32[$6 >> 2] = 0;
      var $7 = $call + 48 | 0;
      HEAP32[$7 >> 2] = 15;
      var $8$s2 = ($call + 44 | 0) >> 2;
      HEAP32[$8$s2] = 32768;
      var $9 = $call + 52 | 0;
      HEAP32[$9 >> 2] = 32767;
      var $10 = $call + 80 | 0;
      HEAP32[$10 >> 2] = 15;
      var $11 = $call + 76 | 0;
      HEAP32[$11 >> 2] = 32768;
      var $12 = $call + 84 | 0;
      HEAP32[$12 >> 2] = 32767;
      var $13 = $call + 88 | 0;
      HEAP32[$13 >> 2] = 5;
      var $14 = HEAP32[$zalloc$s2];
      var $15 = HEAP32[$opaque67$s2];
      var $call87 = FUNCTION_TABLE[$14]($15, 32768, 2);
      var $16 = $call + 56 | 0;
      HEAP32[$16 >> 2] = $call87;
      var $17 = HEAP32[$zalloc$s2];
      var $18 = HEAP32[$opaque67$s2];
      var $19 = HEAP32[$8$s2];
      var $call91 = FUNCTION_TABLE[$17]($18, $19, 2);
      var $20 = $call91;
      var $21 = $call + 64 | 0;
      HEAP32[$21 >> 2] = $20;
      var $mul = HEAP32[$8$s2] << 1;
      _memset($call91, 0, $mul, 1);
      var $23 = HEAP32[$zalloc$s2];
      var $24 = HEAP32[$opaque67$s2];
      var $25 = HEAP32[$11 >> 2];
      var $call97 = FUNCTION_TABLE[$23]($24, $25, 2);
      var $26 = $call97;
      var $27 = $call + 68 | 0;
      HEAP32[$27 >> 2] = $26;
      var $28 = $call + 5824 | 0;
      HEAP32[$28 >> 2] = 0;
      var $29 = $call + 5788 | 0;
      HEAP32[$29 >> 2] = 16384;
      var $30 = HEAP32[$zalloc$s2];
      var $31 = HEAP32[$opaque67$s2];
      var $call103 = FUNCTION_TABLE[$30]($31, 16384, 4);
      var $32 = $call103;
      var $33 = $call + 8 | 0;
      HEAP32[$33 >> 2] = $call103;
      var $34 = HEAPU32[$29 >> 2];
      var $mul105 = $34 << 2;
      var $35 = $call + 12 | 0;
      HEAP32[$35 >> 2] = $mul105;
      var $cmp107 = (HEAP32[$16 >> 2] | 0) == 0;
      do {
        if (!$cmp107) {
          if ((HEAP32[$21 >> 2] | 0) == 0) {
            break;
          }
          if ((HEAP32[$27 >> 2] | 0) == 0 | ($call103 | 0) == 0) {
            break;
          }
          var $add_ptr = ($34 >>> 1 << 1) + $32 | 0;
          var $40 = $call + 5796 | 0;
          HEAP32[$40 >> 2] = $add_ptr;
          var $add_ptr130 = $call103 + $34 * 3 | 0;
          var $41 = $call + 5784 | 0;
          HEAP32[$41 >> 2] = $add_ptr130;
          var $42 = $call + 132 | 0;
          HEAP32[$42 >> 2] = 6;
          var $43 = $call + 136 | 0;
          HEAP32[$43 >> 2] = 0;
          HEAP8[$call + 36 | 0] = 8;
          var $call135 = _deflateReset($strm);
          var $retval_0 = $call135;
          break $return$$if_end10$74;
        }
      } while (0);
      var $39 = $call + 4 | 0;
      HEAP32[$39 >> 2] = 666;
      HEAP32[$msg >> 2] = STRING_TABLE.__str664 | 0;
      _deflateEnd($strm);
      var $retval_0 = -4;
    }
  } while (0);
  var $retval_0;
  return $retval_0;
  return null;
}

_deflateInit2_["X"] = 1;

function _deflateEnd($strm) {
  var $zfree47_pre_pre$s2;
  var $state$s2;
  var $strm$s2 = $strm >> 2;
  var $cmp = ($strm | 0) == 0;
  do {
    if (!$cmp) {
      var $state$s2 = ($strm + 28 | 0) >> 2;
      var $0 = HEAP32[$state$s2];
      if (($0 | 0) == 0) {
        break;
      }
      var $1 = HEAP32[$0 + 4 >> 2];
      if (!($1 == 666 || $1 == 113 || $1 == 103 || $1 == 91 || $1 == 73 || $1 == 69 || $1 == 42)) {
        break;
      }
      var $2 = HEAP32[$0 + 8 >> 2];
      if (($2 | 0) == 0) {
        var $5 = $0;
      } else {
        var $3 = HEAP32[$strm$s2 + 9];
        var $4 = HEAP32[$strm$s2 + 10];
        FUNCTION_TABLE[$3]($4, $2);
        var $5 = HEAP32[$state$s2];
      }
      var $5;
      var $6 = HEAP32[$5 + 68 >> 2];
      if (($6 | 0) == 0) {
        var $10 = $5;
      } else {
        var $7 = HEAP32[$strm$s2 + 9];
        var $8 = HEAP32[$strm$s2 + 10];
        var $9 = $6;
        FUNCTION_TABLE[$7]($8, $9);
        var $10 = HEAP32[$state$s2];
      }
      var $10;
      var $11 = HEAP32[$10 + 64 >> 2];
      var $zfree47_pre_pre$s2 = ($strm + 36 | 0) >> 2;
      if (($11 | 0) == 0) {
        var $15 = $10;
      } else {
        var $12 = HEAP32[$zfree47_pre_pre$s2];
        var $13 = HEAP32[$strm$s2 + 10];
        var $14 = $11;
        FUNCTION_TABLE[$12]($13, $14);
        var $15 = HEAP32[$state$s2];
      }
      var $15;
      var $16 = HEAP32[$15 + 56 >> 2];
      if (($16 | 0) == 0) {
        var $19 = $15;
        var $opaque48_pre_phi = $strm + 40 | 0;
      } else {
        var $17 = HEAP32[$zfree47_pre_pre$s2];
        var $opaque43 = $strm + 40 | 0;
        var $18 = HEAP32[$opaque43 >> 2];
        FUNCTION_TABLE[$17]($18, $16);
        var $19 = HEAP32[$state$s2];
        var $opaque48_pre_phi = $opaque43;
      }
      var $opaque48_pre_phi;
      var $19;
      var $20 = HEAP32[$zfree47_pre_pre$s2];
      var $21 = HEAP32[$opaque48_pre_phi >> 2];
      FUNCTION_TABLE[$20]($21, $19);
      HEAP32[$state$s2] = 0;
    }
  } while (0);
  return;
  return;
}

_deflateEnd["X"] = 1;

function _deflateReset($strm) {
  var $strm$s2 = $strm >> 2;
  var $cmp = ($strm | 0) == 0;
  do {
    if ($cmp) {
      var $retval_0 = -2;
    } else {
      var $0 = HEAP32[$strm$s2 + 7];
      if (($0 | 0) == 0) {
        var $retval_0 = -2;
        break;
      }
      if ((HEAP32[$strm$s2 + 8] | 0) == 0) {
        var $retval_0 = -2;
        break;
      }
      if ((HEAP32[$strm$s2 + 9] | 0) == 0) {
        var $retval_0 = -2;
        break;
      }
      HEAP32[$strm$s2 + 5] = 0;
      HEAP32[$strm$s2 + 2] = 0;
      HEAP32[$strm$s2 + 6] = 0;
      HEAP32[$strm$s2 + 11] = 2;
      var $pending = $0 + 20 | 0;
      HEAP32[$pending >> 2] = 0;
      var $3 = HEAP32[$0 + 8 >> 2];
      var $pending_out = $0 + 16 | 0;
      HEAP32[$pending_out >> 2] = $3;
      var $wrap = $0 + 24 | 0;
      var $4 = HEAP32[$wrap >> 2];
      if (($4 | 0) < 0) {
        var $sub = -$4 | 0;
        HEAP32[$wrap >> 2] = $sub;
        var $5 = $sub;
      } else {
        var $5 = $4;
      }
      var $5;
      var $cond = ($5 | 0) != 0 ? 42 : 113;
      var $status = $0 + 4 | 0;
      HEAP32[$status >> 2] = $cond;
      if (($5 | 0) == 2) {
        var $call = _crc32(0, 0, 0);
        var $cond16 = $call;
      } else {
        var $call15 = _adler32(0, 0, 0);
        var $cond16 = $call15;
      }
      var $cond16;
      HEAP32[$strm$s2 + 12] = $cond16;
      var $last_flush = $0 + 40 | 0;
      HEAP32[$last_flush >> 2] = 0;
      var $6 = $0;
      __tr_init($6);
      _lm_init($0);
      var $retval_0 = 0;
    }
  } while (0);
  var $retval_0;
  return $retval_0;
  return null;
}

_deflateReset["X"] = 1;

function _lm_init($s) {
  var $s$s2 = $s >> 2;
  var $mul = HEAP32[$s$s2 + 11] << 1;
  HEAP32[$s$s2 + 15] = $mul;
  var $hash_size = $s + 76 | 0;
  var $head = $s + 68 | 0;
  HEAP16[HEAP32[$head >> 2] + (HEAP32[$hash_size >> 2] - 1 << 1) >> 1] = 0;
  var $4 = HEAP32[$head >> 2];
  var $mul4 = (HEAP32[$hash_size >> 2] << 1) - 2 | 0;
  _memset($4, 0, $mul4, 1);
  var $6 = HEAPU32[$s$s2 + 33];
  HEAP32[$s$s2 + 32] = HEAPU16[(_configuration_table + 2 >> 1) + ($6 * 6 | 0)] & 65535;
  HEAP32[$s$s2 + 35] = HEAPU16[(_configuration_table >> 1) + ($6 * 6 | 0)] & 65535;
  HEAP32[$s$s2 + 36] = HEAPU16[(_configuration_table + 4 >> 1) + ($6 * 6 | 0)] & 65535;
  HEAP32[$s$s2 + 31] = HEAPU16[(_configuration_table + 6 >> 1) + ($6 * 6 | 0)] & 65535;
  HEAP32[$s$s2 + 27] = 0;
  HEAP32[$s$s2 + 23] = 0;
  HEAP32[$s$s2 + 29] = 0;
  HEAP32[$s$s2 + 30] = 2;
  HEAP32[$s$s2 + 24] = 2;
  HEAP32[$s$s2 + 28] = 0;
  HEAP32[$s$s2 + 26] = 0;
  HEAP32[$s$s2 + 18] = 0;
  return;
  return;
}

_lm_init["X"] = 1;

function _deflate($strm, $flush) {
  var $total_in$s2;
  var $pending_buf666$s2;
  var $adler661$s2;
  var $wrap652$s2;
  var $pending525$s2;
  var $adler502$s2;
  var $pending489$s2;
  var $pending_buf426$s2;
  var $adler425$s2;
  var $pending409$s2;
  var $gzindex360$s2;
  var $pending_buf345$s2;
  var $adler344$s2;
  var $pending330$s2;
  var $gzhead403_pre_phi$s2;
  var $gzhead324$s2;
  var $pending_buf267$s2;
  var $adler266$s2;
  var $gzindex248$s2;
  var $pending247$s2;
  var $gzhead242_pre_phi$s2;
  var $15$s2;
  var $gzhead$s2;
  var $pending_buf$s2;
  var $pending$s2;
  var $adler$s2;
  var $adler235_pre$s2;
  var $last_flush$s2;
  var $avail_out$s2;
  var $status$s2;
  var $0$s2;
  var $strm$s2 = $strm >> 2;
  var __label__;
  var $cmp = ($strm | 0) == 0;
  $return$$lor_lhs_false$2 : do {
    if ($cmp) {
      var $retval_0 = -2;
    } else {
      var $0 = HEAPU32[$strm$s2 + 7], $0$s2 = $0 >> 2;
      if (($0 | 0) == 0 | $flush >>> 0 > 5) {
        var $retval_0 = -2;
        break;
      }
      var $cmp7 = (HEAP32[$strm$s2 + 3] | 0) == 0;
      do {
        if (!$cmp7) {
          if ((HEAP32[$strm$s2] | 0) == 0) {
            if ((HEAP32[$strm$s2 + 1] | 0) != 0) {
              break;
            }
          }
          var $status$s2 = ($0 + 4 | 0) >> 2;
          var $5 = HEAPU32[$status$s2];
          var $cmp14 = ($flush | 0) == 4;
          if (!(($5 | 0) != 666 | $cmp14)) {
            break;
          }
          var $avail_out$s2 = ($strm + 16 | 0) >> 2;
          if ((HEAP32[$avail_out$s2] | 0) == 0) {
            HEAP32[$strm$s2 + 6] = STRING_TABLE.__str765 | 0;
            var $retval_0 = -5;
            break $return$$lor_lhs_false$2;
          }
          HEAP32[$0$s2] = $strm;
          var $last_flush$s2 = ($0 + 40 | 0) >> 2;
          var $7 = HEAP32[$last_flush$s2];
          HEAP32[$last_flush$s2] = $flush;
          var $cmp24 = ($5 | 0) == 42;
          do {
            if ($cmp24) {
              if ((HEAP32[$0$s2 + 6] | 0) != 2) {
                var $shl193 = (HEAP32[$0$s2 + 12] << 12) - 30720 | 0;
                var $cmp195 = (HEAP32[$0$s2 + 34] | 0) > 1;
                do {
                  if ($cmp195) {
                    var $level_flags_0 = 0;
                  } else {
                    var $79 = HEAP32[$0$s2 + 33];
                    if (($79 | 0) < 2) {
                      var $level_flags_0 = 0;
                      break;
                    }
                    if (($79 | 0) < 6) {
                      var $level_flags_0 = 64;
                      break;
                    }
                    var $_ = ($79 | 0) == 6 ? 128 : 192;
                    var $level_flags_0 = $_;
                  }
                } while (0);
                var $level_flags_0;
                var $or = $level_flags_0 | $shl193;
                var $strstart = $0 + 108 | 0;
                var $header_0 = (HEAP32[$strstart >> 2] | 0) == 0 ? $or : $or | 32;
                var $add223 = $header_0 | 31 - ($header_0 >>> 0) % 31;
                HEAP32[$status$s2] = 113;
                _putShortMSB($0, $add223);
                var $adler235_pre$s2 = ($strm + 48 | 0) >> 2;
                if ((HEAP32[$strstart >> 2] | 0) != 0) {
                  var $shr230 = HEAPU32[$adler235_pre$s2] >>> 16;
                  _putShortMSB($0, $shr230);
                  var $and232 = HEAP32[$adler235_pre$s2] & 65535;
                  _putShortMSB($0, $and232);
                }
                var $call234 = _adler32(0, 0, 0);
                HEAP32[$adler235_pre$s2] = $call234;
                var $84 = HEAP32[$status$s2];
                __label__ = 31;
                break;
              }
              var $call = _crc32(0, 0, 0);
              var $adler$s2 = ($strm + 48 | 0) >> 2;
              HEAP32[$adler$s2] = $call;
              var $pending$s2 = ($0 + 20 | 0) >> 2;
              var $9 = HEAP32[$pending$s2];
              var $inc = $9 + 1 | 0;
              HEAP32[$pending$s2] = $inc;
              var $pending_buf$s2 = ($0 + 8 | 0) >> 2;
              HEAP8[HEAP32[$pending_buf$s2] + $9 | 0] = 31;
              var $11 = HEAP32[$pending$s2];
              var $inc29 = $11 + 1 | 0;
              HEAP32[$pending$s2] = $inc29;
              HEAP8[HEAP32[$pending_buf$s2] + $11 | 0] = -117;
              var $13 = HEAP32[$pending$s2];
              var $inc33 = $13 + 1 | 0;
              HEAP32[$pending$s2] = $inc33;
              HEAP8[HEAP32[$pending_buf$s2] + $13 | 0] = 8;
              var $gzhead = $0 + 28 | 0, $gzhead$s2 = $gzhead >> 2;
              var $15 = HEAPU32[$gzhead$s2], $15$s2 = $15 >> 2;
              if (($15 | 0) == 0) {
                var $16 = HEAP32[$pending$s2];
                var $inc39 = $16 + 1 | 0;
                HEAP32[$pending$s2] = $inc39;
                HEAP8[HEAP32[$pending_buf$s2] + $16 | 0] = 0;
                var $18 = HEAP32[$pending$s2];
                var $inc43 = $18 + 1 | 0;
                HEAP32[$pending$s2] = $inc43;
                HEAP8[HEAP32[$pending_buf$s2] + $18 | 0] = 0;
                var $20 = HEAP32[$pending$s2];
                var $inc47 = $20 + 1 | 0;
                HEAP32[$pending$s2] = $inc47;
                HEAP8[HEAP32[$pending_buf$s2] + $20 | 0] = 0;
                var $22 = HEAP32[$pending$s2];
                var $inc51 = $22 + 1 | 0;
                HEAP32[$pending$s2] = $inc51;
                HEAP8[HEAP32[$pending_buf$s2] + $22 | 0] = 0;
                var $24 = HEAP32[$pending$s2];
                var $inc55 = $24 + 1 | 0;
                HEAP32[$pending$s2] = $inc55;
                HEAP8[HEAP32[$pending_buf$s2] + $24 | 0] = 0;
                var $26 = HEAP32[$0$s2 + 33];
                var $cmp58 = ($26 | 0) == 9;
                do {
                  if ($cmp58) {
                    var $cond62 = 2;
                  } else {
                    if ((HEAP32[$0$s2 + 34] | 0) > 1) {
                      var $cond62 = 4;
                      break;
                    }
                    var $phitmp4 = ($26 | 0) < 2 ? 4 : 0;
                    var $cond62 = $phitmp4;
                  }
                } while (0);
                var $cond62;
                var $28 = HEAP32[$pending$s2];
                var $inc64 = $28 + 1 | 0;
                HEAP32[$pending$s2] = $inc64;
                HEAP8[HEAP32[$pending_buf$s2] + $28 | 0] = $cond62;
                var $30 = HEAP32[$pending$s2];
                var $inc68 = $30 + 1 | 0;
                HEAP32[$pending$s2] = $inc68;
                HEAP8[HEAP32[$pending_buf$s2] + $30 | 0] = 3;
                HEAP32[$status$s2] = 113;
                __label__ = 92;
                break;
              }
              var $cond76 = (HEAP32[$15$s2 + 11] | 0) != 0 ? 2 : 0;
              var $cond80 = (HEAP32[$15$s2 + 4] | 0) == 0 ? 0 : 4;
              var $cond85 = (HEAP32[$15$s2 + 7] | 0) == 0 ? 0 : 8;
              var $cond90 = (HEAP32[$15$s2 + 9] | 0) == 0 ? 0 : 16;
              var $add91 = $cond76 | (HEAP32[$15$s2] | 0) != 0 & 1 | $cond80 | $cond85 | $cond90;
              var $37 = HEAP32[$pending$s2];
              var $inc94 = $37 + 1 | 0;
              HEAP32[$pending$s2] = $inc94;
              HEAP8[HEAP32[$pending_buf$s2] + $37 | 0] = $add91;
              var $conv98 = HEAP32[HEAP32[$gzhead$s2] + 4 >> 2] & 255;
              var $41 = HEAP32[$pending$s2];
              var $inc100 = $41 + 1 | 0;
              HEAP32[$pending$s2] = $inc100;
              HEAP8[HEAP32[$pending_buf$s2] + $41 | 0] = $conv98;
              var $conv106 = HEAPU32[HEAP32[$gzhead$s2] + 4 >> 2] >>> 8 & 255;
              var $45 = HEAPU32[$pending$s2];
              HEAP32[$pending$s2] = $45 + 1 | 0;
              HEAP8[HEAP32[$pending_buf$s2] + $45 | 0] = $conv106;
              var $conv115 = HEAPU32[HEAP32[$gzhead$s2] + 4 >> 2] >>> 16 & 255;
              var $49 = HEAPU32[$pending$s2];
              HEAP32[$pending$s2] = $49 + 1 | 0;
              HEAP8[HEAP32[$pending_buf$s2] + $49 | 0] = $conv115;
              var $conv124 = HEAPU32[HEAP32[$gzhead$s2] + 4 >> 2] >>> 24 & 255;
              var $53 = HEAPU32[$pending$s2];
              HEAP32[$pending$s2] = $53 + 1 | 0;
              HEAP8[HEAP32[$pending_buf$s2] + $53 | 0] = $conv124;
              var $55 = HEAP32[$0$s2 + 33];
              var $cmp130 = ($55 | 0) == 9;
              do {
                if ($cmp130) {
                  var $cond144 = 2;
                } else {
                  if ((HEAP32[$0$s2 + 34] | 0) > 1) {
                    var $cond144 = 4;
                    break;
                  }
                  var $phitmp = ($55 | 0) < 2 ? 4 : 0;
                  var $cond144 = $phitmp;
                }
              } while (0);
              var $cond144;
              var $57 = HEAP32[$pending$s2];
              var $inc147 = $57 + 1 | 0;
              HEAP32[$pending$s2] = $inc147;
              HEAP8[HEAP32[$pending_buf$s2] + $57 | 0] = $cond144;
              var $conv152 = HEAP32[HEAP32[$gzhead$s2] + 12 >> 2] & 255;
              var $61 = HEAP32[$pending$s2];
              var $inc154 = $61 + 1 | 0;
              HEAP32[$pending$s2] = $inc154;
              HEAP8[HEAP32[$pending_buf$s2] + $61 | 0] = $conv152;
              var $63 = HEAPU32[$gzhead$s2];
              if ((HEAP32[$63 + 16 >> 2] | 0) == 0) {
                var $72 = $63;
              } else {
                var $conv164 = HEAP32[$63 + 20 >> 2] & 255;
                var $66 = HEAP32[$pending$s2];
                var $inc166 = $66 + 1 | 0;
                HEAP32[$pending$s2] = $inc166;
                HEAP8[HEAP32[$pending_buf$s2] + $66 | 0] = $conv164;
                var $conv173 = HEAPU32[HEAP32[$gzhead$s2] + 20 >> 2] >>> 8 & 255;
                var $70 = HEAPU32[$pending$s2];
                HEAP32[$pending$s2] = $70 + 1 | 0;
                HEAP8[HEAP32[$pending_buf$s2] + $70 | 0] = $conv173;
                var $72 = HEAP32[$gzhead$s2];
              }
              var $72;
              if ((HEAP32[$72 + 44 >> 2] | 0) != 0) {
                var $74 = HEAP32[$adler$s2];
                var $75 = HEAP32[$pending_buf$s2];
                var $76 = HEAP32[$pending$s2];
                var $call186 = _crc32($74, $75, $76);
                HEAP32[$adler$s2] = $call186;
              }
              HEAP32[$0$s2 + 8] = 0;
              HEAP32[$status$s2] = 69;
              var $gzhead242_pre_phi = $gzhead, $gzhead242_pre_phi$s2 = $gzhead242_pre_phi >> 2;
              __label__ = 33;
              break;
            } else {
              var $84 = $5;
              __label__ = 31;
            }
          } while (0);
          do {
            if (__label__ == 31) {
              var $84;
              if (($84 | 0) != 69) {
                var $_pr12_pr = $84;
                __label__ = 50;
                break;
              }
              var $gzhead242_pre_phi = $0 + 28 | 0, $gzhead242_pre_phi$s2 = $gzhead242_pre_phi >> 2;
              __label__ = 33;
              break;
            }
          } while (0);
          do {
            if (__label__ == 33) {
              var $gzhead242_pre_phi;
              var $85 = HEAPU32[$gzhead242_pre_phi$s2];
              if ((HEAP32[$85 + 16 >> 2] | 0) == 0) {
                HEAP32[$status$s2] = 73;
                var $113 = $85;
                __label__ = 52;
                break;
              }
              var $pending247$s2 = ($0 + 20 | 0) >> 2;
              var $gzindex248$s2 = ($0 + 32 | 0) >> 2;
              var $pending_buf_size = $0 + 12 | 0;
              var $adler266$s2 = ($strm + 48 | 0) >> 2;
              var $pending_buf267$s2 = ($0 + 8 | 0) >> 2;
              var $beg_0 = HEAP32[$pending247$s2];
              var $89 = HEAP32[$gzindex248$s2];
              var $88 = $85;
              while (1) {
                var $88;
                var $89;
                var $beg_0;
                if ($89 >>> 0 >= (HEAP32[$88 + 20 >> 2] & 65535) >>> 0) {
                  var $beg_2 = $beg_0;
                  var $105 = $88;
                  break;
                }
                var $91 = HEAPU32[$pending247$s2];
                if (($91 | 0) == (HEAP32[$pending_buf_size >> 2] | 0)) {
                  if ((HEAP32[$88 + 44 >> 2] | 0) != 0 & $91 >>> 0 > $beg_0 >>> 0) {
                    var $94 = HEAP32[$adler266$s2];
                    var $add_ptr = HEAP32[$pending_buf267$s2] + $beg_0 | 0;
                    var $sub269 = $91 - $beg_0 | 0;
                    var $call270 = _crc32($94, $add_ptr, $sub269);
                    HEAP32[$adler266$s2] = $call270;
                  }
                  _flush_pending($strm);
                  var $96 = HEAPU32[$pending247$s2];
                  if (($96 | 0) == (HEAP32[$pending_buf_size >> 2] | 0)) {
                    var $beg_2 = $96;
                    var $105 = HEAP32[$gzhead242_pre_phi$s2];
                    break;
                  }
                  var $beg_1 = $96;
                  var $100 = $96;
                  var $99 = HEAP32[$gzindex248$s2];
                  var $98 = HEAP32[$gzhead242_pre_phi$s2];
                } else {
                  var $beg_1 = $beg_0;
                  var $100 = $91;
                  var $99 = $89;
                  var $98 = $88;
                }
                var $98;
                var $99;
                var $100;
                var $beg_1;
                var $102 = HEAP8[HEAP32[$98 + 16 >> 2] + $99 | 0];
                HEAP32[$pending247$s2] = $100 + 1 | 0;
                HEAP8[HEAP32[$pending_buf267$s2] + $100 | 0] = $102;
                var $inc290 = HEAP32[$gzindex248$s2] + 1 | 0;
                HEAP32[$gzindex248$s2] = $inc290;
                var $beg_0 = $beg_1;
                var $89 = $inc290;
                var $88 = HEAP32[$gzhead242_pre_phi$s2];
              }
              var $105;
              var $beg_2;
              var $tobool293 = (HEAP32[$105 + 44 >> 2] | 0) == 0;
              do {
                if ($tobool293) {
                  var $110 = $105;
                } else {
                  var $107 = HEAPU32[$pending247$s2];
                  if ($107 >>> 0 <= $beg_2 >>> 0) {
                    var $110 = $105;
                    break;
                  }
                  var $108 = HEAP32[$adler266$s2];
                  var $add_ptr301 = HEAP32[$pending_buf267$s2] + $beg_2 | 0;
                  var $sub303 = $107 - $beg_2 | 0;
                  var $call304 = _crc32($108, $add_ptr301, $sub303);
                  HEAP32[$adler266$s2] = $call304;
                  var $110 = HEAP32[$gzhead242_pre_phi$s2];
                }
              } while (0);
              var $110;
              if ((HEAP32[$gzindex248$s2] | 0) == (HEAP32[$110 + 20 >> 2] | 0)) {
                HEAP32[$gzindex248$s2] = 0;
                HEAP32[$status$s2] = 73;
                var $113 = $110;
                __label__ = 52;
                break;
              }
              var $_pr12_pr = HEAP32[$status$s2];
              __label__ = 50;
              break;
            }
          } while (0);
          do {
            if (__label__ == 50) {
              var $_pr12_pr;
              if (($_pr12_pr | 0) != 73) {
                var $135 = $_pr12_pr;
                __label__ = 67;
                break;
              }
              var $113 = HEAP32[$0$s2 + 7];
              __label__ = 52;
              break;
            }
          } while (0);
          do {
            if (__label__ == 52) {
              var $113;
              var $gzhead324 = $0 + 28 | 0, $gzhead324$s2 = $gzhead324 >> 2;
              if ((HEAP32[$113 + 28 >> 2] | 0) == 0) {
                HEAP32[$status$s2] = 91;
                var $gzhead403_pre_phi = $gzhead324, $gzhead403_pre_phi$s2 = $gzhead403_pre_phi >> 2;
                __label__ = 69;
                break;
              }
              var $pending330$s2 = ($0 + 20 | 0) >> 2;
              var $115 = HEAP32[$pending330$s2];
              var $pending_buf_size332 = $0 + 12 | 0;
              var $adler344$s2 = ($strm + 48 | 0) >> 2;
              var $pending_buf345$s2 = ($0 + 8 | 0) >> 2;
              var $gzindex360$s2 = ($0 + 32 | 0) >> 2;
              var $beg329_0 = $115;
              var $116 = $115;
              while (1) {
                var $116;
                var $beg329_0;
                if (($116 | 0) == (HEAP32[$pending_buf_size332 >> 2] | 0)) {
                  if ((HEAP32[HEAP32[$gzhead324$s2] + 44 >> 2] | 0) != 0 & $116 >>> 0 > $beg329_0 >>> 0) {
                    var $120 = HEAP32[$adler344$s2];
                    var $add_ptr346 = HEAP32[$pending_buf345$s2] + $beg329_0 | 0;
                    var $call349 = _crc32($120, $add_ptr346, $116 - $beg329_0 | 0);
                    HEAP32[$adler344$s2] = $call349;
                  }
                  _flush_pending($strm);
                  var $122 = HEAPU32[$pending330$s2];
                  if (($122 | 0) == (HEAP32[$pending_buf_size332 >> 2] | 0)) {
                    var $val_0 = 1;
                    var $beg329_2 = $122;
                    break;
                  }
                  var $beg329_1 = $122;
                  var $124 = $122;
                } else {
                  var $beg329_1 = $beg329_0;
                  var $124 = $116;
                }
                var $124;
                var $beg329_1;
                var $125 = HEAP32[$gzindex360$s2];
                var $inc361 = $125 + 1 | 0;
                HEAP32[$gzindex360$s2] = $inc361;
                var $128 = HEAPU8[HEAP32[HEAP32[$gzhead324$s2] + 28 >> 2] + $125 | 0];
                var $conv365 = $128 & 255;
                HEAP32[$pending330$s2] = $124 + 1 | 0;
                HEAP8[HEAP32[$pending_buf345$s2] + $124 | 0] = $128;
                if ($128 << 24 >> 24 == 0) {
                  var $val_0 = $conv365;
                  var $beg329_2 = $beg329_1;
                  break;
                }
                var $beg329_0 = $beg329_1;
                var $116 = HEAP32[$pending330$s2];
              }
              var $beg329_2;
              var $val_0;
              var $tobool375 = (HEAP32[HEAP32[$gzhead324$s2] + 44 >> 2] | 0) == 0;
              do {
                if (!$tobool375) {
                  var $132 = HEAPU32[$pending330$s2];
                  if ($132 >>> 0 <= $beg329_2 >>> 0) {
                    break;
                  }
                  var $133 = HEAP32[$adler344$s2];
                  var $add_ptr383 = HEAP32[$pending_buf345$s2] + $beg329_2 | 0;
                  var $sub385 = $132 - $beg329_2 | 0;
                  var $call386 = _crc32($133, $add_ptr383, $sub385);
                  HEAP32[$adler344$s2] = $call386;
                }
              } while (0);
              if (($val_0 | 0) == 0) {
                HEAP32[$gzindex360$s2] = 0;
                HEAP32[$status$s2] = 91;
                var $gzhead403_pre_phi = $gzhead324, $gzhead403_pre_phi$s2 = $gzhead403_pre_phi >> 2;
                __label__ = 69;
                break;
              }
              var $135 = HEAP32[$status$s2];
              __label__ = 67;
              break;
            }
          } while (0);
          do {
            if (__label__ == 67) {
              var $135;
              if (($135 | 0) != 91) {
                var $_pr16_pr = $135;
                __label__ = 84;
                break;
              }
              var $gzhead403_pre_phi = $0 + 28 | 0, $gzhead403_pre_phi$s2 = $gzhead403_pre_phi >> 2;
              __label__ = 69;
              break;
            }
          } while (0);
          do {
            if (__label__ == 69) {
              var $gzhead403_pre_phi;
              if ((HEAP32[HEAP32[$gzhead403_pre_phi$s2] + 36 >> 2] | 0) == 0) {
                HEAP32[$status$s2] = 103;
                var $gzhead485_pre_phi = $gzhead403_pre_phi;
                __label__ = 86;
                break;
              }
              var $pending409$s2 = ($0 + 20 | 0) >> 2;
              var $138 = HEAP32[$pending409$s2];
              var $pending_buf_size413 = $0 + 12 | 0;
              var $adler425$s2 = ($strm + 48 | 0) >> 2;
              var $pending_buf426$s2 = ($0 + 8 | 0) >> 2;
              var $gzindex441 = $0 + 32 | 0;
              var $beg408_0 = $138;
              var $139 = $138;
              while (1) {
                var $139;
                var $beg408_0;
                if (($139 | 0) == (HEAP32[$pending_buf_size413 >> 2] | 0)) {
                  if ((HEAP32[HEAP32[$gzhead403_pre_phi$s2] + 44 >> 2] | 0) != 0 & $139 >>> 0 > $beg408_0 >>> 0) {
                    var $143 = HEAP32[$adler425$s2];
                    var $add_ptr427 = HEAP32[$pending_buf426$s2] + $beg408_0 | 0;
                    var $call430 = _crc32($143, $add_ptr427, $139 - $beg408_0 | 0);
                    HEAP32[$adler425$s2] = $call430;
                  }
                  _flush_pending($strm);
                  var $145 = HEAPU32[$pending409$s2];
                  if (($145 | 0) == (HEAP32[$pending_buf_size413 >> 2] | 0)) {
                    var $val410_0 = 1;
                    var $beg408_2 = $145;
                    break;
                  }
                  var $beg408_1 = $145;
                  var $147 = $145;
                } else {
                  var $beg408_1 = $beg408_0;
                  var $147 = $139;
                }
                var $147;
                var $beg408_1;
                var $148 = HEAP32[$gzindex441 >> 2];
                var $inc442 = $148 + 1 | 0;
                HEAP32[$gzindex441 >> 2] = $inc442;
                var $151 = HEAPU8[HEAP32[HEAP32[$gzhead403_pre_phi$s2] + 36 >> 2] + $148 | 0];
                var $conv446 = $151 & 255;
                HEAP32[$pending409$s2] = $147 + 1 | 0;
                HEAP8[HEAP32[$pending_buf426$s2] + $147 | 0] = $151;
                if ($151 << 24 >> 24 == 0) {
                  var $val410_0 = $conv446;
                  var $beg408_2 = $beg408_1;
                  break;
                }
                var $beg408_0 = $beg408_1;
                var $139 = HEAP32[$pending409$s2];
              }
              var $beg408_2;
              var $val410_0;
              var $tobool458 = (HEAP32[HEAP32[$gzhead403_pre_phi$s2] + 44 >> 2] | 0) == 0;
              do {
                if (!$tobool458) {
                  var $155 = HEAPU32[$pending409$s2];
                  if ($155 >>> 0 <= $beg408_2 >>> 0) {
                    break;
                  }
                  var $156 = HEAP32[$adler425$s2];
                  var $add_ptr466 = HEAP32[$pending_buf426$s2] + $beg408_2 | 0;
                  var $sub468 = $155 - $beg408_2 | 0;
                  var $call469 = _crc32($156, $add_ptr466, $sub468);
                  HEAP32[$adler425$s2] = $call469;
                }
              } while (0);
              if (($val410_0 | 0) == 0) {
                HEAP32[$status$s2] = 103;
                var $gzhead485_pre_phi = $gzhead403_pre_phi;
                __label__ = 86;
                break;
              }
              var $_pr16_pr = HEAP32[$status$s2];
              __label__ = 84;
              break;
            }
          } while (0);
          do {
            if (__label__ == 84) {
              var $_pr16_pr;
              if (($_pr16_pr | 0) != 103) {
                __label__ = 92;
                break;
              }
              var $gzhead485_pre_phi = $0 + 28 | 0;
              __label__ = 86;
              break;
            }
          } while (0);
          do {
            if (__label__ == 86) {
              var $gzhead485_pre_phi;
              if ((HEAP32[HEAP32[$gzhead485_pre_phi >> 2] + 44 >> 2] | 0) == 0) {
                HEAP32[$status$s2] = 113;
              } else {
                var $pending489$s2 = ($0 + 20 | 0) >> 2;
                var $160 = HEAPU32[$pending489$s2];
                var $pending_buf_size491 = $0 + 12 | 0;
                var $161 = HEAPU32[$pending_buf_size491 >> 2];
                if (($160 + 2 | 0) >>> 0 > $161 >>> 0) {
                  _flush_pending($strm);
                  var $163 = HEAP32[$pending489$s2];
                  var $162 = HEAP32[$pending_buf_size491 >> 2];
                } else {
                  var $163 = $160;
                  var $162 = $161;
                }
                var $162;
                var $163;
                if (($163 + 2 | 0) >>> 0 > $162 >>> 0) {
                  break;
                }
                var $adler502$s2 = ($strm + 48 | 0) >> 2;
                var $conv504 = HEAP32[$adler502$s2] & 255;
                HEAP32[$pending489$s2] = $163 + 1 | 0;
                var $pending_buf507 = $0 + 8 | 0;
                HEAP8[HEAP32[$pending_buf507 >> 2] + $163 | 0] = $conv504;
                var $conv512 = HEAPU32[$adler502$s2] >>> 8 & 255;
                var $167 = HEAPU32[$pending489$s2];
                HEAP32[$pending489$s2] = $167 + 1 | 0;
                HEAP8[HEAP32[$pending_buf507 >> 2] + $167 | 0] = $conv512;
                var $call517 = _crc32(0, 0, 0);
                HEAP32[$adler502$s2] = $call517;
                HEAP32[$status$s2] = 113;
              }
            }
          } while (0);
          var $pending525$s2 = ($0 + 20 | 0) >> 2;
          var $cmp526 = (HEAP32[$pending525$s2] | 0) == 0;
          do {
            if ($cmp526) {
              var $171 = HEAP32[$strm$s2 + 1];
              if (($171 | 0) != 0) {
                var $172 = $171;
                break;
              }
              if (!(($7 | 0) >= ($flush | 0) & ($flush | 0) != 4)) {
                var $172 = $171;
                break;
              }
              HEAP32[$strm$s2 + 6] = STRING_TABLE.__str765 | 0;
              var $retval_0 = -5;
              break $return$$lor_lhs_false$2;
            }
            _flush_pending($strm);
            if ((HEAP32[$avail_out$s2] | 0) == 0) {
              HEAP32[$last_flush$s2] = -1;
              var $retval_0 = 0;
              break $return$$lor_lhs_false$2;
            }
            var $172 = HEAP32[$strm$s2 + 1];
          } while (0);
          var $172;
          var $cmp550 = (HEAP32[$status$s2] | 0) == 666;
          var $cmp554 = ($172 | 0) == 0;
          do {
            if ($cmp550) {
              if ($cmp554) {
                __label__ = 103;
                break;
              }
              HEAP32[$strm$s2 + 6] = STRING_TABLE.__str765 | 0;
              var $retval_0 = -5;
              break $return$$lor_lhs_false$2;
            }
            if ($cmp554) {
              __label__ = 103;
              break;
            }
            __label__ = 106;
            break;
          } while (0);
          do {
            if (__label__ == 103) {
              if ((HEAP32[$0$s2 + 29] | 0) != 0) {
                __label__ = 106;
                break;
              }
              if (($flush | 0) == 0) {
                var $retval_0 = 0;
                break $return$$lor_lhs_false$2;
              }
              if ($cmp550) {
                __label__ = 122;
                break;
              }
              __label__ = 106;
              break;
            }
          } while (0);
          do {
            if (__label__ == 106) {
              var $175 = HEAP32[$0$s2 + 34];
              if ($175 == 2) {
                var $call577 = _deflate_huff($0, $flush);
                var $cond591 = $call577;
              } else if ($175 == 3) {
                var $call583 = _deflate_rle($0, $flush);
                var $cond591 = $call583;
              } else {
                var $177 = HEAP32[(_configuration_table + 8 >> 2) + (HEAP32[$0$s2 + 33] * 3 | 0)];
                var $call587 = FUNCTION_TABLE[$177]($0, $flush);
                var $cond591 = $call587;
              }
              var $cond591;
              if (($cond591 - 2 | 0) >>> 0 < 2) {
                HEAP32[$status$s2] = 666;
              } else {
                __label__ = 112;
              }
              if ($cond591 == 2 || $cond591 == 0) {
                if ((HEAP32[$avail_out$s2] | 0) != 0) {
                  var $retval_0 = 0;
                  break $return$$lor_lhs_false$2;
                }
                HEAP32[$last_flush$s2] = -1;
                var $retval_0 = 0;
                break $return$$lor_lhs_false$2;
              } else if ($cond591 == 1) {
                do {
                  if ($flush == 1) {
                    var $180 = $0;
                    __tr_align($180);
                  } else if ($flush != 5) {
                    var $181 = $0;
                    __tr_stored_block($181, 0, 0, 0);
                    if (($flush | 0) != 3) {
                      break;
                    }
                    var $hash_size = $0 + 76 | 0;
                    var $head = $0 + 68 | 0;
                    HEAP16[HEAP32[$head >> 2] + (HEAP32[$hash_size >> 2] - 1 << 1) >> 1] = 0;
                    var $185 = HEAP32[$head >> 2];
                    var $mul = (HEAP32[$hash_size >> 2] << 1) - 2 | 0;
                    _memset($185, 0, $mul, 1);
                    if ((HEAP32[$0$s2 + 29] | 0) != 0) {
                      break;
                    }
                    HEAP32[$0$s2 + 27] = 0;
                    HEAP32[$0$s2 + 23] = 0;
                  }
                } while (0);
                _flush_pending($strm);
                if ((HEAP32[$avail_out$s2] | 0) != 0) {
                  break;
                }
                HEAP32[$last_flush$s2] = -1;
                var $retval_0 = 0;
                break $return$$lor_lhs_false$2;
              } else {
                break;
              }
            }
          } while (0);
          if (!$cmp14) {
            var $retval_0 = 0;
            break $return$$lor_lhs_false$2;
          }
          var $wrap652$s2 = ($0 + 24 | 0) >> 2;
          var $189 = HEAP32[$wrap652$s2];
          if (($189 | 0) < 1) {
            var $retval_0 = 1;
            break $return$$lor_lhs_false$2;
          }
          var $adler661$s2 = ($strm + 48 | 0) >> 2;
          var $190 = HEAPU32[$adler661$s2];
          if (($189 | 0) == 2) {
            var $conv663 = $190 & 255;
            var $191 = HEAP32[$pending525$s2];
            var $inc665 = $191 + 1 | 0;
            HEAP32[$pending525$s2] = $inc665;
            var $pending_buf666$s2 = ($0 + 8 | 0) >> 2;
            HEAP8[HEAP32[$pending_buf666$s2] + $191 | 0] = $conv663;
            var $conv671 = HEAPU32[$adler661$s2] >>> 8 & 255;
            var $194 = HEAPU32[$pending525$s2];
            HEAP32[$pending525$s2] = $194 + 1 | 0;
            HEAP8[HEAP32[$pending_buf666$s2] + $194 | 0] = $conv671;
            var $conv679 = HEAPU32[$adler661$s2] >>> 16 & 255;
            var $197 = HEAPU32[$pending525$s2];
            HEAP32[$pending525$s2] = $197 + 1 | 0;
            HEAP8[HEAP32[$pending_buf666$s2] + $197 | 0] = $conv679;
            var $conv687 = HEAPU32[$adler661$s2] >>> 24 & 255;
            var $200 = HEAPU32[$pending525$s2];
            HEAP32[$pending525$s2] = $200 + 1 | 0;
            HEAP8[HEAP32[$pending_buf666$s2] + $200 | 0] = $conv687;
            var $total_in$s2 = ($strm + 8 | 0) >> 2;
            var $conv693 = HEAP32[$total_in$s2] & 255;
            var $203 = HEAP32[$pending525$s2];
            var $inc695 = $203 + 1 | 0;
            HEAP32[$pending525$s2] = $inc695;
            HEAP8[HEAP32[$pending_buf666$s2] + $203 | 0] = $conv693;
            var $conv701 = HEAPU32[$total_in$s2] >>> 8 & 255;
            var $206 = HEAPU32[$pending525$s2];
            HEAP32[$pending525$s2] = $206 + 1 | 0;
            HEAP8[HEAP32[$pending_buf666$s2] + $206 | 0] = $conv701;
            var $conv709 = HEAPU32[$total_in$s2] >>> 16 & 255;
            var $209 = HEAPU32[$pending525$s2];
            HEAP32[$pending525$s2] = $209 + 1 | 0;
            HEAP8[HEAP32[$pending_buf666$s2] + $209 | 0] = $conv709;
            var $conv717 = HEAPU32[$total_in$s2] >>> 24 & 255;
            var $212 = HEAPU32[$pending525$s2];
            HEAP32[$pending525$s2] = $212 + 1 | 0;
            HEAP8[HEAP32[$pending_buf666$s2] + $212 | 0] = $conv717;
          } else {
            var $shr724 = $190 >>> 16;
            _putShortMSB($0, $shr724);
            var $and726 = HEAP32[$adler661$s2] & 65535;
            _putShortMSB($0, $and726);
          }
          _flush_pending($strm);
          var $215 = HEAP32[$wrap652$s2];
          if (($215 | 0) > 0) {
            var $sub733 = -$215 | 0;
            HEAP32[$wrap652$s2] = $sub733;
          }
          var $retval_0 = (HEAP32[$pending525$s2] | 0) == 0 & 1;
          break $return$$lor_lhs_false$2;
        }
      } while (0);
      HEAP32[$strm$s2 + 6] = STRING_TABLE.__str462 | 0;
      var $retval_0 = -2;
    }
  } while (0);
  var $retval_0;
  return $retval_0;
  return null;
}

_deflate["X"] = 1;

function _putShortMSB($s, $b) {
  var $pending$s2;
  var $conv = $b >>> 8 & 255;
  var $pending$s2 = ($s + 20 | 0) >> 2;
  var $0 = HEAPU32[$pending$s2];
  HEAP32[$pending$s2] = $0 + 1 | 0;
  var $pending_buf = $s + 8 | 0;
  HEAP8[HEAP32[$pending_buf >> 2] + $0 | 0] = $conv;
  var $conv1 = $b & 255;
  var $2 = HEAP32[$pending$s2];
  var $inc3 = $2 + 1 | 0;
  HEAP32[$pending$s2] = $inc3;
  HEAP8[HEAP32[$pending_buf >> 2] + $2 | 0] = $conv1;
  return;
  return;
}

function _flush_pending($strm) {
  var $next_out$s2;
  var $avail_out$s2;
  var $state$s2;
  var $state$s2 = ($strm + 28 | 0) >> 2;
  var $0 = HEAPU32[$state$s2];
  var $1 = HEAPU32[$0 + 20 >> 2];
  var $avail_out$s2 = ($strm + 16 | 0) >> 2;
  var $2 = HEAPU32[$avail_out$s2];
  var $len_0 = $1 >>> 0 > $2 >>> 0 ? $2 : $1;
  var $cmp2 = ($len_0 | 0) == 0;
  do {
    if (!$cmp2) {
      var $next_out$s2 = ($strm + 12 | 0) >> 2;
      var $3 = HEAP32[$next_out$s2];
      var $4 = HEAP32[$0 + 16 >> 2];
      _memcpy($3, $4, $len_0, 1);
      var $add_ptr = HEAP32[$next_out$s2] + $len_0 | 0;
      HEAP32[$next_out$s2] = $add_ptr;
      var $pending_out8 = HEAP32[$state$s2] + 16 | 0;
      var $add_ptr9 = HEAP32[$pending_out8 >> 2] + $len_0 | 0;
      HEAP32[$pending_out8 >> 2] = $add_ptr9;
      var $total_out = $strm + 20 | 0;
      var $add = HEAP32[$total_out >> 2] + $len_0 | 0;
      HEAP32[$total_out >> 2] = $add;
      var $sub = HEAP32[$avail_out$s2] - $len_0 | 0;
      HEAP32[$avail_out$s2] = $sub;
      var $pending12 = HEAP32[$state$s2] + 20 | 0;
      var $sub13 = HEAP32[$pending12 >> 2] - $len_0 | 0;
      HEAP32[$pending12 >> 2] = $sub13;
      var $12 = HEAP32[$state$s2];
      if ((HEAP32[$12 + 20 >> 2] | 0) != 0) {
        break;
      }
      var $14 = HEAP32[$12 + 8 >> 2];
      var $pending_out20 = $12 + 16 | 0;
      HEAP32[$pending_out20 >> 2] = $14;
    }
  } while (0);
  return;
  return;
}

function _deflate_huff($s, $flush) {
  var $strm$s2;
  var $block_start$s2;
  var $last_lit$s2;
  var $window$s2;
  var $strstart$s2;
  var $lookahead$s2;
  var $lookahead$s2 = ($s + 116 | 0) >> 2;
  var $match_length = $s + 96 | 0;
  var $strstart$s2 = ($s + 108 | 0) >> 2;
  var $window$s2 = ($s + 56 | 0) >> 2;
  var $last_lit$s2 = ($s + 5792 | 0) >> 2;
  var $d_buf = $s + 5796 | 0;
  var $l_buf = $s + 5784 | 0;
  var $lit_bufsize = $s + 5788 | 0;
  var $block_start$s2 = ($s + 92 | 0) >> 2;
  var $0 = $s;
  var $strm$s2 = ($s | 0) >> 2;
  $for_cond$8 : while (1) {
    var $cmp = (HEAP32[$lookahead$s2] | 0) == 0;
    do {
      if ($cmp) {
        _fill_window($s);
        if ((HEAP32[$lookahead$s2] | 0) != 0) {
          break;
        }
        if (($flush | 0) == 0) {
          var $retval_0 = 0;
          break $for_cond$8;
        }
        var $21 = HEAP32[$block_start$s2];
        if (($21 | 0) > -1) {
          var $cond44 = HEAP32[$window$s2] + $21 | 0;
        } else {
          var $cond44 = 0;
        }
        var $cond44;
        var $sub47 = HEAP32[$strstart$s2] - $21 | 0;
        var $cmp48 = ($flush | 0) == 4;
        var $conv49 = $cmp48 & 1;
        __tr_flush_block($0, $cond44, $sub47, $conv49);
        var $24 = HEAP32[$strstart$s2];
        HEAP32[$block_start$s2] = $24;
        var $25 = HEAP32[$strm$s2];
        _flush_pending($25);
        if ((HEAP32[HEAP32[$strm$s2] + 16 >> 2] | 0) == 0) {
          var $cond60 = $cmp48 ? 2 : 0;
          var $retval_0 = $cond60;
          break $for_cond$8;
        }
        var $cond64 = $cmp48 ? 3 : 1;
        var $retval_0 = $cond64;
        break $for_cond$8;
      }
    } while (0);
    HEAP32[$match_length >> 2] = 0;
    var $5 = HEAPU8[HEAP32[$window$s2] + HEAP32[$strstart$s2] | 0];
    HEAP16[HEAP32[$d_buf >> 2] + (HEAP32[$last_lit$s2] << 1) >> 1] = 0;
    var $8 = HEAP32[$last_lit$s2];
    var $inc = $8 + 1 | 0;
    HEAP32[$last_lit$s2] = $inc;
    HEAP8[HEAP32[$l_buf >> 2] + $8 | 0] = $5;
    var $freq = (($5 & 255) << 2) + $s + 148 | 0;
    var $inc12 = HEAP16[$freq >> 1] + 1 & 65535;
    HEAP16[$freq >> 1] = $inc12;
    var $cmp14 = (HEAP32[$last_lit$s2] | 0) == (HEAP32[$lit_bufsize >> 2] - 1 | 0);
    var $dec = HEAP32[$lookahead$s2] - 1 | 0;
    HEAP32[$lookahead$s2] = $dec;
    var $inc17 = HEAP32[$strstart$s2] + 1 | 0;
    HEAP32[$strstart$s2] = $inc17;
    if (!$cmp14) {
      continue;
    }
    var $15 = HEAP32[$block_start$s2];
    if (($15 | 0) > -1) {
      var $cond = HEAP32[$window$s2] + $15 | 0;
    } else {
      var $cond = 0;
    }
    var $cond;
    var $sub26 = $inc17 - $15 | 0;
    __tr_flush_block($0, $cond, $sub26, 0);
    var $17 = HEAP32[$strstart$s2];
    HEAP32[$block_start$s2] = $17;
    var $18 = HEAP32[$strm$s2];
    _flush_pending($18);
    if ((HEAP32[HEAP32[$strm$s2] + 16 >> 2] | 0) == 0) {
      var $retval_0 = 0;
      break;
    }
  }
  var $retval_0;
  return $retval_0;
  return null;
}

_deflate_huff["X"] = 1;

function _deflate_rle($s, $flush) {
  var $strm$s2;
  var $block_start$s2;
  var $window$s2;
  var $last_lit$s2;
  var $strstart$s2;
  var $match_length$s2;
  var $lookahead$s2;
  var __label__;
  var $lookahead$s2 = ($s + 116 | 0) >> 2;
  var $cmp3 = ($flush | 0) == 0;
  var $match_length$s2 = ($s + 96 | 0) >> 2;
  var $strstart$s2 = ($s + 108 | 0) >> 2;
  var $last_lit$s2 = ($s + 5792 | 0) >> 2;
  var $d_buf = $s + 5796 | 0;
  var $l_buf = $s + 5784 | 0;
  var $freq113 = $s + 2440 | 0;
  var $lit_bufsize = $s + 5788 | 0;
  var $window$s2 = ($s + 56 | 0) >> 2;
  var $block_start$s2 = ($s + 92 | 0) >> 2;
  var $0 = $s;
  var $strm$s2 = ($s | 0) >> 2;
  $for_cond$27 : while (1) {
    var $1 = HEAPU32[$lookahead$s2];
    var $cmp = $1 >>> 0 < 258;
    do {
      if (!$cmp) {
        HEAP32[$match_length$s2] = 0;
        var $3 = $1;
        __label__ = 7;
        break;
      }
      _fill_window($s);
      var $2 = HEAPU32[$lookahead$s2];
      if ($2 >>> 0 < 258 & $cmp3) {
        var $retval_0 = 0;
        break $for_cond$27;
      }
      if (($2 | 0) != 0) {
        HEAP32[$match_length$s2] = 0;
        if ($2 >>> 0 > 2) {
          var $3 = $2;
          __label__ = 7;
          break;
        }
        var $30 = HEAP32[$strstart$s2];
        __label__ = 22;
        break;
      }
      var $49 = HEAP32[$block_start$s2];
      if (($49 | 0) > -1) {
        var $cond182 = HEAP32[$window$s2] + $49 | 0;
      } else {
        var $cond182 = 0;
      }
      var $cond182;
      var $sub185 = HEAP32[$strstart$s2] - $49 | 0;
      var $cmp186 = ($flush | 0) == 4;
      var $conv187 = $cmp186 & 1;
      __tr_flush_block($0, $cond182, $sub185, $conv187);
      var $52 = HEAP32[$strstart$s2];
      HEAP32[$block_start$s2] = $52;
      var $53 = HEAP32[$strm$s2];
      _flush_pending($53);
      if ((HEAP32[HEAP32[$strm$s2] + 16 >> 2] | 0) == 0) {
        var $cond198 = $cmp186 ? 2 : 0;
        var $retval_0 = $cond198;
        break $for_cond$27;
      }
      var $cond202 = $cmp186 ? 3 : 1;
      var $retval_0 = $cond202;
      break $for_cond$27;
    } while (0);
    do {
      if (__label__ == 7) {
        var $3;
        var $4 = HEAPU32[$strstart$s2];
        if (($4 | 0) == 0) {
          var $30 = 0;
          __label__ = 22;
          break;
        }
        var $5 = HEAPU32[$window$s2];
        var $6 = HEAPU8[$5 + ($4 - 1) | 0];
        if ($6 << 24 >> 24 != HEAP8[$5 + $4 | 0] << 24 >> 24) {
          var $30 = $4;
          __label__ = 22;
          break;
        }
        if ($6 << 24 >> 24 != HEAP8[$4 + ($5 + 1) | 0] << 24 >> 24) {
          var $30 = $4;
          __label__ = 22;
          break;
        }
        var $incdec_ptr26 = $4 + ($5 + 2) | 0;
        if ($6 << 24 >> 24 != HEAP8[$incdec_ptr26] << 24 >> 24) {
          var $30 = $4;
          __label__ = 22;
          break;
        }
        var $add_ptr34 = $4 + ($5 + 258) | 0;
        var $scan_0 = $incdec_ptr26;
        while (1) {
          var $scan_0;
          var $incdec_ptr35 = $scan_0 + 1 | 0;
          if ($6 << 24 >> 24 != HEAP8[$incdec_ptr35] << 24 >> 24) {
            var $scan_1 = $incdec_ptr35;
            break;
          }
          var $incdec_ptr40 = $scan_0 + 2 | 0;
          if ($6 << 24 >> 24 != HEAP8[$incdec_ptr40] << 24 >> 24) {
            var $scan_1 = $incdec_ptr40;
            break;
          }
          var $incdec_ptr45 = $scan_0 + 3 | 0;
          if ($6 << 24 >> 24 != HEAP8[$incdec_ptr45] << 24 >> 24) {
            var $scan_1 = $incdec_ptr45;
            break;
          }
          var $incdec_ptr50 = $scan_0 + 4 | 0;
          if ($6 << 24 >> 24 != HEAP8[$incdec_ptr50] << 24 >> 24) {
            var $scan_1 = $incdec_ptr50;
            break;
          }
          var $incdec_ptr55 = $scan_0 + 5 | 0;
          if ($6 << 24 >> 24 != HEAP8[$incdec_ptr55] << 24 >> 24) {
            var $scan_1 = $incdec_ptr55;
            break;
          }
          var $incdec_ptr60 = $scan_0 + 6 | 0;
          if ($6 << 24 >> 24 != HEAP8[$incdec_ptr60] << 24 >> 24) {
            var $scan_1 = $incdec_ptr60;
            break;
          }
          var $incdec_ptr65 = $scan_0 + 7 | 0;
          if ($6 << 24 >> 24 != HEAP8[$incdec_ptr65] << 24 >> 24) {
            var $scan_1 = $incdec_ptr65;
            break;
          }
          var $incdec_ptr70 = $scan_0 + 8 | 0;
          if (!($6 << 24 >> 24 == HEAP8[$incdec_ptr70] << 24 >> 24 & $incdec_ptr70 >>> 0 < $add_ptr34 >>> 0)) {
            var $scan_1 = $incdec_ptr70;
            break;
          }
          var $scan_0 = $incdec_ptr70;
        }
        var $scan_1;
        var $sub = $scan_1 - $add_ptr34 + 258 | 0;
        var $storemerge = $sub >>> 0 > $3 >>> 0 ? $3 : $sub;
        HEAP32[$match_length$s2] = $storemerge;
        if ($storemerge >>> 0 <= 2) {
          var $30 = $4;
          __label__ = 22;
          break;
        }
        var $sub92 = $storemerge + 253 | 0;
        var $conv93 = $sub92 & 255;
        HEAP16[HEAP32[$d_buf >> 2] + (HEAP32[$last_lit$s2] << 1) >> 1] = 1;
        var $20 = HEAP32[$last_lit$s2];
        var $inc = $20 + 1 | 0;
        HEAP32[$last_lit$s2] = $inc;
        HEAP8[HEAP32[$l_buf >> 2] + $20 | 0] = $conv93;
        var $arrayidx96 = STRING_TABLE.__length_code + ($sub92 & 255) | 0;
        var $freq = ((HEAPU8[$arrayidx96] & 255 | 256) + 1 << 2) + $s + 148 | 0;
        var $inc100 = HEAP16[$freq >> 1] + 1 & 65535;
        HEAP16[$freq >> 1] = $inc100;
        var $inc114 = HEAP16[$freq113 >> 1] + 1 & 65535;
        HEAP16[$freq113 >> 1] = $inc114;
        var $conv118 = (HEAP32[$last_lit$s2] | 0) == (HEAP32[$lit_bufsize >> 2] - 1 | 0) & 1;
        var $27 = HEAP32[$match_length$s2];
        var $sub121 = HEAP32[$lookahead$s2] - $27 | 0;
        HEAP32[$lookahead$s2] = $sub121;
        var $add124 = HEAP32[$strstart$s2] + $27 | 0;
        HEAP32[$strstart$s2] = $add124;
        HEAP32[$match_length$s2] = 0;
        var $bflush_0 = $conv118;
        var $42 = $add124;
        __label__ = 23;
        break;
      }
    } while (0);
    if (__label__ == 22) {
      var $30;
      var $32 = HEAPU8[HEAP32[$window$s2] + $30 | 0];
      HEAP16[HEAP32[$d_buf >> 2] + (HEAP32[$last_lit$s2] << 1) >> 1] = 0;
      var $35 = HEAP32[$last_lit$s2];
      var $inc133 = $35 + 1 | 0;
      HEAP32[$last_lit$s2] = $inc133;
      HEAP8[HEAP32[$l_buf >> 2] + $35 | 0] = $32;
      var $freq140 = (($32 & 255) << 2) + $s + 148 | 0;
      var $inc141 = HEAP16[$freq140 >> 1] + 1 & 65535;
      HEAP16[$freq140 >> 1] = $inc141;
      var $conv146 = (HEAP32[$last_lit$s2] | 0) == (HEAP32[$lit_bufsize >> 2] - 1 | 0) & 1;
      var $dec148 = HEAP32[$lookahead$s2] - 1 | 0;
      HEAP32[$lookahead$s2] = $dec148;
      var $inc150 = HEAP32[$strstart$s2] + 1 | 0;
      HEAP32[$strstart$s2] = $inc150;
      var $bflush_0 = $conv146;
      var $42 = $inc150;
    }
    var $42;
    var $bflush_0;
    if (($bflush_0 | 0) == 0) {
      continue;
    }
    var $43 = HEAP32[$block_start$s2];
    if (($43 | 0) > -1) {
      var $cond161 = HEAP32[$window$s2] + $43 | 0;
    } else {
      var $cond161 = 0;
    }
    var $cond161;
    var $sub164 = $42 - $43 | 0;
    __tr_flush_block($0, $cond161, $sub164, 0);
    var $45 = HEAP32[$strstart$s2];
    HEAP32[$block_start$s2] = $45;
    var $46 = HEAP32[$strm$s2];
    _flush_pending($46);
    if ((HEAP32[HEAP32[$strm$s2] + 16 >> 2] | 0) == 0) {
      var $retval_0 = 0;
      break;
    }
  }
  var $retval_0;
  return $retval_0;
  return null;
}

_deflate_rle["X"] = 1;

function _fill_window($s) {
  var $high_water$s2;
  var $window37$s2;
  var $strstart$s2;
  var $lookahead$s2;
  var __label__;
  var $w_size = $s + 44 | 0;
  var $0 = HEAPU32[$w_size >> 2];
  var $window_size = $s + 60 | 0;
  var $lookahead$s2 = ($s + 116 | 0) >> 2;
  var $strstart$s2 = ($s + 108 | 0) >> 2;
  var $sub4 = $0 - 262 | 0;
  var $strm = $s | 0;
  var $window37$s2 = ($s + 56 | 0) >> 2;
  var $ins_h = $s + 72 | 0;
  var $hash_shift = $s + 88 | 0;
  var $hash_mask = $s + 84 | 0;
  var $match_start = $s + 112 | 0;
  var $block_start = $s + 92 | 0;
  var $hash_size = $s + 76 | 0;
  var $head = $s + 68 | 0;
  var $prev = $s + 64 | 0;
  var $2 = HEAP32[$lookahead$s2];
  var $1 = $0;
  $do_body$69 : while (1) {
    var $1;
    var $2;
    var $4 = HEAPU32[$strstart$s2];
    var $sub1 = HEAP32[$window_size >> 2] - $2 - $4 | 0;
    if ($4 >>> 0 < ($sub4 + $1 | 0) >>> 0) {
      var $more_0 = $sub1;
    } else {
      var $5 = HEAPU32[$window37$s2];
      var $add_ptr = $5 + $0 | 0;
      _memcpy($5, $add_ptr, $0, 1);
      var $sub6 = HEAP32[$match_start >> 2] - $0 | 0;
      HEAP32[$match_start >> 2] = $sub6;
      var $sub8 = HEAP32[$strstart$s2] - $0 | 0;
      HEAP32[$strstart$s2] = $sub8;
      var $sub9 = HEAP32[$block_start >> 2] - $0 | 0;
      HEAP32[$block_start >> 2] = $sub9;
      var $9 = HEAP32[$hash_size >> 2];
      var $n_0 = $9;
      var $p_0 = ($9 << 1) + HEAP32[$head >> 2] | 0;
      while (1) {
        var $p_0;
        var $n_0;
        var $incdec_ptr = $p_0 - 2 | 0;
        var $conv = HEAPU16[$incdec_ptr >> 1] & 65535;
        if ($conv >>> 0 < $0 >>> 0) {
          var $cond = 0;
        } else {
          var $cond = $conv - $0 & 65535;
        }
        var $cond;
        HEAP16[$incdec_ptr >> 1] = $cond;
        var $dec = $n_0 - 1 | 0;
        if (($dec | 0) == 0) {
          break;
        }
        var $n_0 = $dec;
        var $p_0 = $incdec_ptr;
      }
      var $n_1 = $0;
      var $p_1 = ($0 << 1) + HEAP32[$prev >> 2] | 0;
      while (1) {
        var $p_1;
        var $n_1;
        var $incdec_ptr17 = $p_1 - 2 | 0;
        var $conv18 = HEAPU16[$incdec_ptr17 >> 1] & 65535;
        if ($conv18 >>> 0 < $0 >>> 0) {
          var $cond25 = 0;
        } else {
          var $cond25 = $conv18 - $0 & 65535;
        }
        var $cond25;
        HEAP16[$incdec_ptr17 >> 1] = $cond25;
        var $dec28 = $n_1 - 1 | 0;
        if (($dec28 | 0) == 0) {
          break;
        }
        var $n_1 = $dec28;
        var $p_1 = $incdec_ptr17;
      }
      var $more_0 = $sub1 + $0 | 0;
    }
    var $more_0;
    var $14 = HEAP32[$strm >> 2];
    if ((HEAP32[$14 + 4 >> 2] | 0) == 0) {
      break;
    }
    var $add_ptr41 = HEAP32[$window37$s2] + HEAP32[$lookahead$s2] + HEAP32[$strstart$s2] | 0;
    var $call = _read_buf($14, $add_ptr41, $more_0);
    var $add43 = HEAP32[$lookahead$s2] + $call | 0;
    HEAP32[$lookahead$s2] = $add43;
    var $cmp45 = $add43 >>> 0 > 2;
    do {
      if ($cmp45) {
        var $20 = HEAPU32[$strstart$s2];
        var $21 = HEAPU32[$window37$s2];
        var $conv51 = HEAPU8[$21 + $20 | 0] & 255;
        HEAP32[$ins_h >> 2] = $conv51;
        var $and = (HEAPU8[$20 + ($21 + 1) | 0] & 255 ^ $conv51 << HEAP32[$hash_shift >> 2]) & HEAP32[$hash_mask >> 2];
        HEAP32[$ins_h >> 2] = $and;
        if ($add43 >>> 0 < 262) {
          __label__ = 14;
          break;
        }
        __label__ = 16;
        break;
      } else {
        __label__ = 14;
      }
    } while (0);
    do {
      if (__label__ == 14) {
        if ((HEAP32[HEAP32[$strm >> 2] + 4 >> 2] | 0) == 0) {
          break;
        }
        var $2 = $add43;
        var $1 = HEAP32[$w_size >> 2];
        continue $do_body$69;
      }
    } while (0);
    var $high_water$s2 = ($s + 5824 | 0) >> 2;
    var $28 = HEAPU32[$high_water$s2];
    var $29 = HEAPU32[$window_size >> 2];
    if ($28 >>> 0 >= $29 >>> 0) {
      break;
    }
    var $add75 = $add43 + HEAP32[$strstart$s2] | 0;
    if ($28 >>> 0 < $add75 >>> 0) {
      var $sub81 = $29 - $add75 | 0;
      var $init_0 = $sub81 >>> 0 > 258 ? 258 : $sub81;
      var $add_ptr87 = HEAP32[$window37$s2] + $add75 | 0;
      _memset($add_ptr87, 0, $init_0, 1);
      var $add88 = $init_0 + $add75 | 0;
      HEAP32[$high_water$s2] = $add88;
      break;
    }
    var $add91 = $add75 + 258 | 0;
    if ($28 >>> 0 >= $add91 >>> 0) {
      break;
    }
    var $sub97 = $add91 - $28 | 0;
    var $sub100 = $29 - $28 | 0;
    var $init_1 = $sub97 >>> 0 > $sub100 >>> 0 ? $sub100 : $sub97;
    var $add_ptr110 = HEAP32[$window37$s2] + $28 | 0;
    _memset($add_ptr110, 0, $init_1, 1);
    var $add112 = HEAP32[$high_water$s2] + $init_1 | 0;
    HEAP32[$high_water$s2] = $add112;
    break;
  }
  return;
  return;
}

_fill_window["X"] = 1;

function _read_buf($strm, $buf, $size) {
  var $avail_in = $strm + 4 | 0;
  var $0 = HEAPU32[$avail_in >> 2];
  var $len_0 = $0 >>> 0 > $size >>> 0 ? $size : $0;
  if (($len_0 | 0) == 0) {
    var $retval_0 = 0;
  } else {
    HEAP32[$avail_in >> 2] = $0 - $len_0 | 0;
    var $2 = HEAP32[HEAP32[$strm + 28 >> 2] + 24 >> 2];
    if ($2 == 1) {
      var $adler = $strm + 48 | 0;
      var $3 = HEAP32[$adler >> 2];
      var $4 = HEAP32[$strm >> 2];
      var $call = _adler32($3, $4, $len_0);
      HEAP32[$adler >> 2] = $call;
      var $7 = $4;
    } else if ($2 == 2) {
      var $adler12 = $strm + 48 | 0;
      var $5 = HEAP32[$adler12 >> 2];
      var $6 = HEAP32[$strm >> 2];
      var $call14 = _crc32($5, $6, $len_0);
      HEAP32[$adler12 >> 2] = $call14;
      var $7 = $6;
    } else {
      var $7 = HEAP32[$strm >> 2];
    }
    var $7;
    var $next_in18 = $strm | 0;
    _memcpy($buf, $7, $len_0, 1);
    var $add_ptr = HEAP32[$next_in18 >> 2] + $len_0 | 0;
    HEAP32[$next_in18 >> 2] = $add_ptr;
    var $total_in = $strm + 8 | 0;
    var $add = HEAP32[$total_in >> 2] + $len_0 | 0;
    HEAP32[$total_in >> 2] = $add;
    var $retval_0 = $len_0;
  }
  var $retval_0;
  return $retval_0;
  return null;
}

function _deflate_stored($s, $flush) {
  var $strm60$s2;
  var $window50$s2;
  var $block_start$s2;
  var $strstart$s2;
  var $lookahead$s2;
  var $sub = HEAP32[$s + 12 >> 2] - 5 | 0;
  var $max_block_size_0_ph = $sub >>> 0 < 65535 ? $sub : 65535;
  var $lookahead$s2 = ($s + 116 | 0) >> 2;
  var $strstart$s2 = ($s + 108 | 0) >> 2;
  var $block_start$s2 = ($s + 92 | 0) >> 2;
  var $w_size = $s + 44 | 0;
  var $window50$s2 = ($s + 56 | 0) >> 2;
  var $1 = $s;
  var $strm60$s2 = ($s | 0) >> 2;
  $for_cond$109 : while (1) {
    var $2 = HEAPU32[$lookahead$s2];
    var $cmp3 = $2 >>> 0 < 2;
    do {
      if ($cmp3) {
        _fill_window($s);
        var $3 = HEAPU32[$lookahead$s2];
        if (($3 | $flush | 0) == 0) {
          var $retval_0 = 0;
          break $for_cond$109;
        }
        if (($3 | 0) != 0) {
          var $6 = $3;
          break;
        }
        var $22 = HEAP32[$block_start$s2];
        if (($22 | 0) > -1) {
          var $cond75 = HEAP32[$window50$s2] + $22 | 0;
        } else {
          var $cond75 = 0;
        }
        var $cond75;
        var $sub78 = HEAP32[$strstart$s2] - $22 | 0;
        var $cmp79 = ($flush | 0) == 4;
        var $conv = $cmp79 & 1;
        __tr_flush_block($1, $cond75, $sub78, $conv);
        var $25 = HEAP32[$strstart$s2];
        HEAP32[$block_start$s2] = $25;
        var $26 = HEAP32[$strm60$s2];
        _flush_pending($26);
        if ((HEAP32[HEAP32[$strm60$s2] + 16 >> 2] | 0) == 0) {
          var $cond90 = $cmp79 ? 2 : 0;
          var $retval_0 = $cond90;
          break $for_cond$109;
        }
        var $cond94 = $cmp79 ? 3 : 1;
        var $retval_0 = $cond94;
        break $for_cond$109;
      } else {
        var $6 = $2;
      }
    } while (0);
    var $6;
    var $add = HEAP32[$strstart$s2] + $6 | 0;
    HEAP32[$strstart$s2] = $add;
    HEAP32[$lookahead$s2] = 0;
    var $8 = HEAPU32[$block_start$s2];
    var $add17 = $8 + $max_block_size_0_ph | 0;
    if (($add | 0) != 0 & $add >>> 0 < $add17 >>> 0) {
      var $15 = $add;
      var $14 = $8;
    } else {
      var $sub24 = $add - $add17 | 0;
      HEAP32[$lookahead$s2] = $sub24;
      HEAP32[$strstart$s2] = $add17;
      if (($8 | 0) > -1) {
        var $cond = HEAP32[$window50$s2] + $8 | 0;
      } else {
        var $cond = 0;
      }
      var $cond;
      __tr_flush_block($1, $cond, $max_block_size_0_ph, 0);
      var $10 = HEAP32[$strstart$s2];
      HEAP32[$block_start$s2] = $10;
      var $11 = HEAP32[$strm60$s2];
      _flush_pending($11);
      if ((HEAP32[HEAP32[$strm60$s2] + 16 >> 2] | 0) == 0) {
        var $retval_0 = 0;
        break;
      }
      var $15 = HEAP32[$strstart$s2];
      var $14 = HEAP32[$block_start$s2];
    }
    var $14;
    var $15;
    var $sub42 = $15 - $14 | 0;
    if ($sub42 >>> 0 < (HEAP32[$w_size >> 2] - 262 | 0) >>> 0) {
      continue;
    }
    if (($14 | 0) > -1) {
      var $cond54 = HEAP32[$window50$s2] + $14 | 0;
    } else {
      var $cond54 = 0;
    }
    var $cond54;
    __tr_flush_block($1, $cond54, $sub42, 0);
    var $18 = HEAP32[$strstart$s2];
    HEAP32[$block_start$s2] = $18;
    var $19 = HEAP32[$strm60$s2];
    _flush_pending($19);
    if ((HEAP32[HEAP32[$strm60$s2] + 16 >> 2] | 0) == 0) {
      var $retval_0 = 0;
      break;
    }
  }
  var $retval_0;
  return $retval_0;
  return null;
}

_deflate_stored["X"] = 1;

function _longest_match($s, $cur_match) {
  var $s$s2 = $s >> 2;
  var $0 = HEAPU32[$s$s2 + 31];
  var $1 = HEAPU32[$s$s2 + 14];
  var $2 = HEAPU32[$s$s2 + 27];
  var $add_ptr = $1 + $2 | 0;
  var $3 = HEAPU32[$s$s2 + 30];
  var $4 = HEAPU32[$s$s2 + 36];
  var $sub = HEAP32[$s$s2 + 11] - 262 | 0;
  var $sub6_ = $2 >>> 0 > $sub >>> 0 ? $2 - $sub | 0 : 0;
  var $6 = HEAP32[$s$s2 + 16];
  var $7 = HEAP32[$s$s2 + 13];
  var $add_ptr11 = $2 + ($1 + 258) | 0;
  var $chain_length_0 = $3 >>> 0 < HEAPU32[$s$s2 + 35] >>> 0 ? $0 : $0 >>> 2;
  var $11 = HEAPU32[$s$s2 + 29];
  var $nice_match_0_ph = $4 >>> 0 > $11 >>> 0 ? $11 : $4;
  var $match_start = $s + 112 | 0;
  var $arrayidx39 = $2 + ($1 + 1) | 0;
  var $add_ptr45 = $2 + ($1 + 2) | 0;
  var $sub_ptr_lhs_cast = $add_ptr11;
  var $sub113 = $2 + 257 | 0;
  var $scan_end_0 = HEAP8[$1 + $3 + $2 | 0];
  var $cur_match_addr_0 = $cur_match;
  var $chain_length_1 = $chain_length_0;
  var $scan_end1_0 = HEAP8[$1 + ($2 - 1) + $3 | 0];
  var $best_len_0 = $3;
  $do_body$101 : while (1) {
    var $best_len_0;
    var $scan_end1_0;
    var $chain_length_1;
    var $cur_match_addr_0;
    var $scan_end_0;
    var $add_ptr21 = $1 + $cur_match_addr_0 | 0;
    var $cmp24 = HEAP8[$1 + $cur_match_addr_0 + $best_len_0 | 0] << 24 >> 24 == $scan_end_0 << 24 >> 24;
    do {
      if ($cmp24) {
        if (HEAP8[$1 + ($best_len_0 - 1) + $cur_match_addr_0 | 0] << 24 >> 24 != $scan_end1_0 << 24 >> 24) {
          var $scan_end_1 = $scan_end_0;
          var $scan_end1_1 = $scan_end1_0;
          var $best_len_1 = $best_len_0;
          break;
        }
        if (HEAP8[$add_ptr21] << 24 >> 24 != HEAP8[$add_ptr] << 24 >> 24) {
          var $scan_end_1 = $scan_end_0;
          var $scan_end1_1 = $scan_end1_0;
          var $best_len_1 = $best_len_0;
          break;
        }
        if (HEAP8[$cur_match_addr_0 + ($1 + 1) | 0] << 24 >> 24 != HEAP8[$arrayidx39] << 24 >> 24) {
          var $scan_end_1 = $scan_end_0;
          var $scan_end1_1 = $scan_end1_0;
          var $best_len_1 = $best_len_0;
          break;
        }
        var $scan_1 = $add_ptr45;
        var $match_0 = $cur_match_addr_0 + ($1 + 2) | 0;
        while (1) {
          var $match_0;
          var $scan_1;
          var $incdec_ptr48 = $scan_1 + 1 | 0;
          if (HEAP8[$incdec_ptr48] << 24 >> 24 != HEAP8[$match_0 + 1 | 0] << 24 >> 24) {
            var $scan_2 = $incdec_ptr48;
            break;
          }
          var $incdec_ptr54 = $scan_1 + 2 | 0;
          if (HEAP8[$incdec_ptr54] << 24 >> 24 != HEAP8[$match_0 + 2 | 0] << 24 >> 24) {
            var $scan_2 = $incdec_ptr54;
            break;
          }
          var $incdec_ptr61 = $scan_1 + 3 | 0;
          if (HEAP8[$incdec_ptr61] << 24 >> 24 != HEAP8[$match_0 + 3 | 0] << 24 >> 24) {
            var $scan_2 = $incdec_ptr61;
            break;
          }
          var $incdec_ptr68 = $scan_1 + 4 | 0;
          if (HEAP8[$incdec_ptr68] << 24 >> 24 != HEAP8[$match_0 + 4 | 0] << 24 >> 24) {
            var $scan_2 = $incdec_ptr68;
            break;
          }
          var $incdec_ptr75 = $scan_1 + 5 | 0;
          if (HEAP8[$incdec_ptr75] << 24 >> 24 != HEAP8[$match_0 + 5 | 0] << 24 >> 24) {
            var $scan_2 = $incdec_ptr75;
            break;
          }
          var $incdec_ptr82 = $scan_1 + 6 | 0;
          if (HEAP8[$incdec_ptr82] << 24 >> 24 != HEAP8[$match_0 + 6 | 0] << 24 >> 24) {
            var $scan_2 = $incdec_ptr82;
            break;
          }
          var $incdec_ptr89 = $scan_1 + 7 | 0;
          if (HEAP8[$incdec_ptr89] << 24 >> 24 != HEAP8[$match_0 + 7 | 0] << 24 >> 24) {
            var $scan_2 = $incdec_ptr89;
            break;
          }
          var $incdec_ptr96 = $scan_1 + 8 | 0;
          var $incdec_ptr98 = $match_0 + 8 | 0;
          if (!(HEAP8[$incdec_ptr96] << 24 >> 24 == HEAP8[$incdec_ptr98] << 24 >> 24 & $incdec_ptr96 >>> 0 < $add_ptr11 >>> 0)) {
            var $scan_2 = $incdec_ptr96;
            break;
          }
          var $scan_1 = $incdec_ptr96;
          var $match_0 = $incdec_ptr98;
        }
        var $scan_2;
        var $sub_ptr_sub11 = $scan_2 - $sub_ptr_lhs_cast | 0;
        var $sub104 = $sub_ptr_sub11 + 258 | 0;
        if (($sub104 | 0) <= ($best_len_0 | 0)) {
          var $scan_end_1 = $scan_end_0;
          var $scan_end1_1 = $scan_end1_0;
          var $best_len_1 = $best_len_0;
          break;
        }
        HEAP32[$match_start >> 2] = $cur_match_addr_0;
        if (($sub104 | 0) >= ($nice_match_0_ph | 0)) {
          var $best_len_2 = $sub104;
          break $do_body$101;
        }
        var $scan_end_1 = HEAP8[$1 + $sub104 + $2 | 0];
        var $scan_end1_1 = HEAP8[$1 + $sub113 + $sub_ptr_sub11 | 0];
        var $best_len_1 = $sub104;
      } else {
        var $scan_end_1 = $scan_end_0;
        var $scan_end1_1 = $scan_end1_0;
        var $best_len_1 = $best_len_0;
      }
    } while (0);
    var $best_len_1;
    var $scan_end1_1;
    var $scan_end_1;
    var $conv119 = HEAPU16[$6 + (($cur_match_addr_0 & $7) << 1) >> 1] & 65535;
    if ($conv119 >>> 0 <= $sub6_ >>> 0) {
      var $best_len_2 = $best_len_1;
      break;
    }
    var $dec = $chain_length_1 - 1 | 0;
    if (($dec | 0) == 0) {
      var $best_len_2 = $best_len_1;
      break;
    }
    var $scan_end_0 = $scan_end_1;
    var $cur_match_addr_0 = $conv119;
    var $chain_length_1 = $dec;
    var $scan_end1_0 = $scan_end1_1;
    var $best_len_0 = $best_len_1;
  }
  var $best_len_2;
  var $_best_len_2 = $best_len_2 >>> 0 > $11 >>> 0 ? $11 : $best_len_2;
  return $_best_len_2;
  return null;
}

_longest_match["X"] = 1;

function _deflate_fast($s, $flush) {
  var $strm$s2;
  var $block_start$s2;
  var $last_lit$s2;
  var $match_length$s2;
  var $head$s2;
  var $hash_mask$s2;
  var $window$s2;
  var $strstart$s2;
  var $hash_shift$s2;
  var $ins_h$s2;
  var $lookahead$s2;
  var __label__;
  var $lookahead$s2 = ($s + 116 | 0) >> 2;
  var $cmp3 = ($flush | 0) == 0;
  var $ins_h$s2 = ($s + 72 | 0) >> 2;
  var $hash_shift$s2 = ($s + 88 | 0) >> 2;
  var $strstart$s2 = ($s + 108 | 0) >> 2;
  var $window$s2 = ($s + 56 | 0) >> 2;
  var $hash_mask$s2 = ($s + 84 | 0) >> 2;
  var $head$s2 = ($s + 68 | 0) >> 2;
  var $w_mask = $s + 52 | 0;
  var $prev = $s + 64 | 0;
  var $w_size = $s + 44 | 0;
  var $match_length$s2 = ($s + 96 | 0) >> 2;
  var $match_start = $s + 112 | 0;
  var $last_lit$s2 = ($s + 5792 | 0) >> 2;
  var $d_buf = $s + 5796 | 0;
  var $l_buf = $s + 5784 | 0;
  var $lit_bufsize = $s + 5788 | 0;
  var $max_lazy_match = $s + 128 | 0;
  var $block_start$s2 = ($s + 92 | 0) >> 2;
  var $0 = $s;
  var $strm$s2 = ($s | 0) >> 2;
  $for_cond$2 : while (1) {
    var $cmp = HEAPU32[$lookahead$s2] >>> 0 < 262;
    do {
      if ($cmp) {
        _fill_window($s);
        var $2 = HEAPU32[$lookahead$s2];
        if ($2 >>> 0 < 262 & $cmp3) {
          var $retval_0 = 0;
          break $for_cond$2;
        }
        if (($2 | 0) == 0) {
          var $73 = HEAP32[$block_start$s2];
          if (($73 | 0) > -1) {
            var $cond198 = HEAP32[$window$s2] + $73 | 0;
          } else {
            var $cond198 = 0;
          }
          var $cond198;
          var $sub201 = HEAP32[$strstart$s2] - $73 | 0;
          var $cmp202 = ($flush | 0) == 4;
          var $conv203 = $cmp202 & 1;
          __tr_flush_block($0, $cond198, $sub201, $conv203);
          var $76 = HEAP32[$strstart$s2];
          HEAP32[$block_start$s2] = $76;
          var $77 = HEAP32[$strm$s2];
          _flush_pending($77);
          if ((HEAP32[HEAP32[$strm$s2] + 16 >> 2] | 0) == 0) {
            var $cond214 = $cmp202 ? 2 : 0;
            var $retval_0 = $cond214;
            break $for_cond$2;
          }
          var $cond218 = $cmp202 ? 3 : 1;
          var $retval_0 = $cond218;
          break $for_cond$2;
        } else {
          if ($2 >>> 0 > 2) {
            __label__ = 5;
            break;
          }
          __label__ = 8;
          break;
        }
      } else {
        __label__ = 5;
      }
    } while (0);
    do {
      if (__label__ == 5) {
        var $5 = HEAPU32[$strstart$s2];
        var $and = (HEAPU8[HEAP32[$window$s2] + $5 + 2 | 0] & 255 ^ HEAP32[$ins_h$s2] << HEAP32[$hash_shift$s2]) & HEAP32[$hash_mask$s2];
        HEAP32[$ins_h$s2] = $and;
        var $10 = HEAPU16[HEAP32[$head$s2] + ($and << 1) >> 1];
        HEAP16[HEAP32[$prev >> 2] + ((HEAP32[$w_mask >> 2] & $5) << 1) >> 1] = $10;
        var $conv19 = $10 & 65535;
        HEAP16[HEAP32[$head$s2] + (HEAP32[$ins_h$s2] << 1) >> 1] = HEAP32[$strstart$s2] & 65535;
        if ($10 << 16 >> 16 == 0) {
          __label__ = 8;
          break;
        }
        if ((HEAP32[$strstart$s2] - $conv19 | 0) >>> 0 > (HEAP32[$w_size >> 2] - 262 | 0) >>> 0) {
          __label__ = 8;
          break;
        }
        var $call = _longest_match($s, $conv19);
        HEAP32[$match_length$s2] = $call;
        var $18 = $call;
        __label__ = 9;
        break;
      }
    } while (0);
    if (__label__ == 8) {
      var $18 = HEAP32[$match_length$s2];
    }
    var $18;
    if ($18 >>> 0 > 2) {
      var $sub40 = $18 + 253 | 0;
      var $conv44 = HEAP32[$strstart$s2] - HEAP32[$match_start >> 2] & 65535;
      HEAP16[HEAP32[$d_buf >> 2] + (HEAP32[$last_lit$s2] << 1) >> 1] = $conv44;
      var $23 = HEAP32[$last_lit$s2];
      var $inc = $23 + 1 | 0;
      HEAP32[$last_lit$s2] = $inc;
      HEAP8[HEAP32[$l_buf >> 2] + $23 | 0] = $sub40 & 255;
      var $dec = $conv44 - 1 & 65535;
      var $arrayidx48 = STRING_TABLE.__length_code + ($sub40 & 255) | 0;
      var $freq = ((HEAPU8[$arrayidx48] & 255 | 256) + 1 << 2) + $s + 148 | 0;
      var $inc53 = HEAP16[$freq >> 1] + 1 & 65535;
      HEAP16[$freq >> 1] = $inc53;
      var $conv54 = $dec & 65535;
      if (($dec & 65535) < 256) {
        var $conv54_pn = $conv54;
      } else {
        var $conv54_pn = ($conv54 >>> 7) + 256 | 0;
      }
      var $conv54_pn;
      var $cond_in_in = STRING_TABLE.__dist_code + $conv54_pn | 0;
      var $freq66 = ((HEAPU8[$cond_in_in] & 255) << 2) + $s + 2440 | 0;
      var $inc67 = HEAP16[$freq66 >> 1] + 1 & 65535;
      HEAP16[$freq66 >> 1] = $inc67;
      var $conv71 = (HEAP32[$last_lit$s2] | 0) == (HEAP32[$lit_bufsize >> 2] - 1 | 0) & 1;
      var $30 = HEAPU32[$match_length$s2];
      var $sub74 = HEAP32[$lookahead$s2] - $30 | 0;
      HEAP32[$lookahead$s2] = $sub74;
      if ($30 >>> 0 <= HEAPU32[$max_lazy_match >> 2] >>> 0 & $sub74 >>> 0 > 2) {
        HEAP32[$match_length$s2] = $30 - 1 | 0;
        while (1) {
          var $33 = HEAPU32[$strstart$s2];
          var $inc86 = $33 + 1 | 0;
          HEAP32[$strstart$s2] = $inc86;
          var $and97 = (HEAPU8[HEAP32[$window$s2] + $33 + 3 | 0] & 255 ^ HEAP32[$ins_h$s2] << HEAP32[$hash_shift$s2]) & HEAP32[$hash_mask$s2];
          HEAP32[$ins_h$s2] = $and97;
          var $40 = HEAP16[HEAP32[$head$s2] + ($and97 << 1) >> 1];
          HEAP16[HEAP32[$prev >> 2] + ((HEAP32[$w_mask >> 2] & $inc86) << 1) >> 1] = $40;
          HEAP16[HEAP32[$head$s2] + (HEAP32[$ins_h$s2] << 1) >> 1] = HEAP32[$strstart$s2] & 65535;
          var $dec114 = HEAP32[$match_length$s2] - 1 | 0;
          HEAP32[$match_length$s2] = $dec114;
          if (($dec114 | 0) == 0) {
            break;
          }
        }
        var $inc118 = HEAP32[$strstart$s2] + 1 | 0;
        HEAP32[$strstart$s2] = $inc118;
        var $bflush_0 = $conv71;
        var $66 = $inc118;
      } else {
        var $add121 = HEAP32[$strstart$s2] + $30 | 0;
        HEAP32[$strstart$s2] = $add121;
        HEAP32[$match_length$s2] = 0;
        var $49 = HEAPU32[$window$s2];
        var $conv126 = HEAPU8[$49 + $add121 | 0] & 255;
        HEAP32[$ins_h$s2] = $conv126;
        var $and138 = (HEAPU8[$add121 + ($49 + 1) | 0] & 255 ^ $conv126 << HEAP32[$hash_shift$s2]) & HEAP32[$hash_mask$s2];
        HEAP32[$ins_h$s2] = $and138;
        var $bflush_0 = $conv71;
        var $66 = $add121;
      }
    } else {
      var $56 = HEAPU8[HEAP32[$window$s2] + HEAP32[$strstart$s2] | 0];
      HEAP16[HEAP32[$d_buf >> 2] + (HEAP32[$last_lit$s2] << 1) >> 1] = 0;
      var $59 = HEAP32[$last_lit$s2];
      var $inc149 = $59 + 1 | 0;
      HEAP32[$last_lit$s2] = $inc149;
      HEAP8[HEAP32[$l_buf >> 2] + $59 | 0] = $56;
      var $freq156 = (($56 & 255) << 2) + $s + 148 | 0;
      var $inc157 = HEAP16[$freq156 >> 1] + 1 & 65535;
      HEAP16[$freq156 >> 1] = $inc157;
      var $conv162 = (HEAP32[$last_lit$s2] | 0) == (HEAP32[$lit_bufsize >> 2] - 1 | 0) & 1;
      var $dec164 = HEAP32[$lookahead$s2] - 1 | 0;
      HEAP32[$lookahead$s2] = $dec164;
      var $inc166 = HEAP32[$strstart$s2] + 1 | 0;
      HEAP32[$strstart$s2] = $inc166;
      var $bflush_0 = $conv162;
      var $66 = $inc166;
    }
    var $66;
    var $bflush_0;
    if (($bflush_0 | 0) == 0) {
      continue;
    }
    var $67 = HEAP32[$block_start$s2];
    if (($67 | 0) > -1) {
      var $cond177 = HEAP32[$window$s2] + $67 | 0;
    } else {
      var $cond177 = 0;
    }
    var $cond177;
    var $sub180 = $66 - $67 | 0;
    __tr_flush_block($0, $cond177, $sub180, 0);
    var $69 = HEAP32[$strstart$s2];
    HEAP32[$block_start$s2] = $69;
    var $70 = HEAP32[$strm$s2];
    _flush_pending($70);
    if ((HEAP32[HEAP32[$strm$s2] + 16 >> 2] | 0) == 0) {
      var $retval_0 = 0;
      break;
    }
  }
  var $retval_0;
  return $retval_0;
  return null;
}

_deflate_fast["X"] = 1;

function _deflate_slow($s, $flush) {
  var $strm$s2;
  var $block_start$s2;
  var $match_available$s2;
  var $l_buf$s2;
  var $d_buf$s2;
  var $last_lit$s2;
  var $prev_match$s2;
  var $match_start$s2;
  var $prev_length$s2;
  var $match_length$s2;
  var $head$s2;
  var $window$s2;
  var $strstart$s2;
  var $ins_h$s2;
  var $lookahead$s2;
  var __label__;
  var $lookahead$s2 = ($s + 116 | 0) >> 2;
  var $cmp3 = ($flush | 0) == 0;
  var $ins_h$s2 = ($s + 72 | 0) >> 2;
  var $hash_shift = $s + 88 | 0;
  var $strstart$s2 = ($s + 108 | 0) >> 2;
  var $window$s2 = ($s + 56 | 0) >> 2;
  var $hash_mask = $s + 84 | 0;
  var $head$s2 = ($s + 68 | 0) >> 2;
  var $w_mask = $s + 52 | 0;
  var $prev = $s + 64 | 0;
  var $match_length$s2 = ($s + 96 | 0) >> 2;
  var $prev_length$s2 = ($s + 120 | 0) >> 2;
  var $match_start$s2 = ($s + 112 | 0) >> 2;
  var $prev_match$s2 = ($s + 100 | 0) >> 2;
  var $last_lit$s2 = ($s + 5792 | 0) >> 2;
  var $d_buf$s2 = ($s + 5796 | 0) >> 2;
  var $l_buf$s2 = ($s + 5784 | 0) >> 2;
  var $lit_bufsize = $s + 5788 | 0;
  var $match_available$s2 = ($s + 104 | 0) >> 2;
  var $block_start$s2 = ($s + 92 | 0) >> 2;
  var $0 = $s;
  var $strm$s2 = ($s | 0) >> 2;
  var $max_lazy_match = $s + 128 | 0;
  var $w_size = $s + 44 | 0;
  var $strategy = $s + 136 | 0;
  $for_condthread_pre_split$42 : while (1) {
    var $1 = HEAP32[$lookahead$s2];
    while (1) {
      var $1;
      var $cmp = $1 >>> 0 < 262;
      do {
        if ($cmp) {
          _fill_window($s);
          var $2 = HEAPU32[$lookahead$s2];
          if ($2 >>> 0 < 262 & $cmp3) {
            var $retval_0 = 0;
            break $for_condthread_pre_split$42;
          }
          if (($2 | 0) != 0) {
            if ($2 >>> 0 > 2) {
              __label__ = 7;
              break;
            }
            var $3 = HEAP32[$match_length$s2];
            HEAP32[$prev_length$s2] = $3;
            var $4 = HEAP32[$match_start$s2];
            HEAP32[$prev_match$s2] = $4;
            HEAP32[$match_length$s2] = 2;
            var $26 = 2;
            __label__ = 15;
            break;
          }
          if ((HEAP32[$match_available$s2] | 0) != 0) {
            var $90 = HEAPU8[HEAP32[$window$s2] + (HEAP32[$strstart$s2] - 1) | 0];
            HEAP16[HEAP32[$d_buf$s2] + (HEAP32[$last_lit$s2] << 1) >> 1] = 0;
            var $93 = HEAP32[$last_lit$s2];
            var $inc247 = $93 + 1 | 0;
            HEAP32[$last_lit$s2] = $inc247;
            HEAP8[HEAP32[$l_buf$s2] + $93 | 0] = $90;
            var $freq254 = (($90 & 255) << 2) + $s + 148 | 0;
            var $inc255 = HEAP16[$freq254 >> 1] + 1 & 65535;
            HEAP16[$freq254 >> 1] = $inc255;
            HEAP32[$match_available$s2] = 0;
          }
          var $96 = HEAPU32[$block_start$s2];
          if (($96 | 0) > -1) {
            var $cond272 = HEAP32[$window$s2] + $96 | 0;
          } else {
            var $cond272 = 0;
          }
          var $cond272;
          var $sub275 = HEAP32[$strstart$s2] - $96 | 0;
          var $cmp276 = ($flush | 0) == 4;
          var $conv277 = $cmp276 & 1;
          __tr_flush_block($0, $cond272, $sub275, $conv277);
          var $99 = HEAP32[$strstart$s2];
          HEAP32[$block_start$s2] = $99;
          var $100 = HEAP32[$strm$s2];
          _flush_pending($100);
          if ((HEAP32[HEAP32[$strm$s2] + 16 >> 2] | 0) == 0) {
            var $cond288 = $cmp276 ? 2 : 0;
            var $retval_0 = $cond288;
            break $for_condthread_pre_split$42;
          }
          var $cond292 = $cmp276 ? 3 : 1;
          var $retval_0 = $cond292;
          break $for_condthread_pre_split$42;
        } else {
          __label__ = 7;
        }
      } while (0);
      do {
        if (__label__ == 7) {
          var $7 = HEAPU32[$strstart$s2];
          var $and = (HEAPU8[HEAP32[$window$s2] + $7 + 2 | 0] & 255 ^ HEAP32[$ins_h$s2] << HEAP32[$hash_shift >> 2]) & HEAP32[$hash_mask >> 2];
          HEAP32[$ins_h$s2] = $and;
          var $12 = HEAPU16[HEAP32[$head$s2] + ($and << 1) >> 1];
          HEAP16[HEAP32[$prev >> 2] + ((HEAP32[$w_mask >> 2] & $7) << 1) >> 1] = $12;
          var $conv19 = $12 & 65535;
          HEAP16[HEAP32[$head$s2] + (HEAP32[$ins_h$s2] << 1) >> 1] = HEAP32[$strstart$s2] & 65535;
          var $18 = HEAPU32[$match_length$s2];
          HEAP32[$prev_length$s2] = $18;
          var $19 = HEAP32[$match_start$s2];
          HEAP32[$prev_match$s2] = $19;
          HEAP32[$match_length$s2] = 2;
          if ($12 << 16 >> 16 == 0) {
            var $26 = 2;
            __label__ = 15;
            break;
          }
          if ($18 >>> 0 >= HEAPU32[$max_lazy_match >> 2] >>> 0) {
            var $28 = $18;
            var $27 = 2;
            __label__ = 16;
            break;
          }
          if ((HEAP32[$strstart$s2] - $conv19 | 0) >>> 0 > (HEAP32[$w_size >> 2] - 262 | 0) >>> 0) {
            var $26 = 2;
            __label__ = 15;
            break;
          }
          var $call = _longest_match($s, $conv19);
          HEAP32[$match_length$s2] = $call;
          if ($call >>> 0 >= 6) {
            var $26 = $call;
            __label__ = 15;
            break;
          }
          if ((HEAP32[$strategy >> 2] | 0) != 1) {
            if (($call | 0) != 3) {
              var $26 = $call;
              __label__ = 15;
              break;
            }
            if ((HEAP32[$strstart$s2] - HEAP32[$match_start$s2] | 0) >>> 0 <= 4096) {
              var $26 = 3;
              __label__ = 15;
              break;
            }
          }
          HEAP32[$match_length$s2] = 2;
          var $26 = 2;
          __label__ = 15;
          break;
        }
      } while (0);
      if (__label__ == 15) {
        var $26;
        var $28 = HEAP32[$prev_length$s2];
        var $27 = $26;
      }
      var $27;
      var $28;
      if (!($28 >>> 0 < 3 | $27 >>> 0 > $28 >>> 0)) {
        break;
      }
      if ((HEAP32[$match_available$s2] | 0) == 0) {
        HEAP32[$match_available$s2] = 1;
        var $inc230 = HEAP32[$strstart$s2] + 1 | 0;
        HEAP32[$strstart$s2] = $inc230;
        var $dec232 = HEAP32[$lookahead$s2] - 1 | 0;
        HEAP32[$lookahead$s2] = $dec232;
        var $1 = $dec232;
      } else {
        var $68 = HEAPU8[HEAP32[$window$s2] + (HEAP32[$strstart$s2] - 1) | 0];
        HEAP16[HEAP32[$d_buf$s2] + (HEAP32[$last_lit$s2] << 1) >> 1] = 0;
        var $71 = HEAP32[$last_lit$s2];
        var $inc184 = $71 + 1 | 0;
        HEAP32[$last_lit$s2] = $inc184;
        HEAP8[HEAP32[$l_buf$s2] + $71 | 0] = $68;
        var $freq191 = (($68 & 255) << 2) + $s + 148 | 0;
        var $inc192 = HEAP16[$freq191 >> 1] + 1 & 65535;
        HEAP16[$freq191 >> 1] = $inc192;
        if ((HEAP32[$last_lit$s2] | 0) == (HEAP32[$lit_bufsize >> 2] - 1 | 0)) {
          var $76 = HEAP32[$block_start$s2];
          if (($76 | 0) > -1) {
            var $cond209 = HEAP32[$window$s2] + $76 | 0;
          } else {
            var $cond209 = 0;
          }
          var $cond209;
          var $sub212 = HEAP32[$strstart$s2] - $76 | 0;
          __tr_flush_block($0, $cond209, $sub212, 0);
          var $79 = HEAP32[$strstart$s2];
          HEAP32[$block_start$s2] = $79;
          var $80 = HEAP32[$strm$s2];
          _flush_pending($80);
        }
        var $inc218 = HEAP32[$strstart$s2] + 1 | 0;
        HEAP32[$strstart$s2] = $inc218;
        var $dec220 = HEAP32[$lookahead$s2] - 1 | 0;
        HEAP32[$lookahead$s2] = $dec220;
        if ((HEAP32[HEAP32[$strm$s2] + 16 >> 2] | 0) == 0) {
          var $retval_0 = 0;
          break $for_condthread_pre_split$42;
        }
        var $1 = $dec220;
      }
    }
    var $29 = HEAPU32[$strstart$s2];
    var $sub71 = $29 - 3 + HEAP32[$lookahead$s2] | 0;
    var $sub73 = $28 + 253 | 0;
    var $conv79 = $29 + 65535 - HEAP32[$prev_match$s2] & 65535;
    HEAP16[HEAP32[$d_buf$s2] + (HEAP32[$last_lit$s2] << 1) >> 1] = $conv79;
    var $34 = HEAP32[$last_lit$s2];
    var $inc = $34 + 1 | 0;
    HEAP32[$last_lit$s2] = $inc;
    HEAP8[HEAP32[$l_buf$s2] + $34 | 0] = $sub73 & 255;
    var $dec = $conv79 - 1 & 65535;
    var $arrayidx83 = STRING_TABLE.__length_code + ($sub73 & 255) | 0;
    var $freq = ((HEAPU8[$arrayidx83] & 255 | 256) + 1 << 2) + $s + 148 | 0;
    var $inc88 = HEAP16[$freq >> 1] + 1 & 65535;
    HEAP16[$freq >> 1] = $inc88;
    var $conv89 = $dec & 65535;
    if (($dec & 65535) < 256) {
      var $conv89_pn = $conv89;
    } else {
      var $conv89_pn = ($conv89 >>> 7) + 256 | 0;
    }
    var $conv89_pn;
    var $cond_in_in = STRING_TABLE.__dist_code + $conv89_pn | 0;
    var $freq101 = ((HEAPU8[$cond_in_in] & 255) << 2) + $s + 2440 | 0;
    var $inc102 = HEAP16[$freq101 >> 1] + 1 & 65535;
    HEAP16[$freq101 >> 1] = $inc102;
    var $39 = HEAP32[$last_lit$s2];
    var $sub104 = HEAP32[$lit_bufsize >> 2] - 1 | 0;
    var $41 = HEAP32[$prev_length$s2];
    var $sub110 = 1 - $41 + HEAP32[$lookahead$s2] | 0;
    HEAP32[$lookahead$s2] = $sub110;
    var $sub112 = $41 - 2 | 0;
    HEAP32[$prev_length$s2] = $sub112;
    var $43 = $sub112;
    while (1) {
      var $43;
      var $44 = HEAPU32[$strstart$s2];
      var $inc114 = $44 + 1 | 0;
      HEAP32[$strstart$s2] = $inc114;
      if ($inc114 >>> 0 > $sub71 >>> 0) {
        var $57 = $43;
      } else {
        var $and128 = (HEAPU8[HEAP32[$window$s2] + $44 + 3 | 0] & 255 ^ HEAP32[$ins_h$s2] << HEAP32[$hash_shift >> 2]) & HEAP32[$hash_mask >> 2];
        HEAP32[$ins_h$s2] = $and128;
        var $51 = HEAP16[HEAP32[$head$s2] + ($and128 << 1) >> 1];
        HEAP16[HEAP32[$prev >> 2] + ((HEAP32[$w_mask >> 2] & $inc114) << 1) >> 1] = $51;
        HEAP16[HEAP32[$head$s2] + (HEAP32[$ins_h$s2] << 1) >> 1] = HEAP32[$strstart$s2] & 65535;
        var $57 = HEAP32[$prev_length$s2];
      }
      var $57;
      var $dec146 = $57 - 1 | 0;
      HEAP32[$prev_length$s2] = $dec146;
      if (($dec146 | 0) == 0) {
        break;
      }
      var $43 = $dec146;
    }
    var $cmp105 = ($39 | 0) == ($sub104 | 0);
    HEAP32[$match_available$s2] = 0;
    HEAP32[$match_length$s2] = 2;
    var $inc151 = HEAP32[$strstart$s2] + 1 | 0;
    HEAP32[$strstart$s2] = $inc151;
    if (!$cmp105) {
      continue;
    }
    var $59 = HEAP32[$block_start$s2];
    if (($59 | 0) > -1) {
      var $cond161 = HEAP32[$window$s2] + $59 | 0;
    } else {
      var $cond161 = 0;
    }
    var $cond161;
    var $sub164 = $inc151 - $59 | 0;
    __tr_flush_block($0, $cond161, $sub164, 0);
    var $61 = HEAP32[$strstart$s2];
    HEAP32[$block_start$s2] = $61;
    var $62 = HEAP32[$strm$s2];
    _flush_pending($62);
    if ((HEAP32[HEAP32[$strm$s2] + 16 >> 2] | 0) == 0) {
      var $retval_0 = 0;
      break;
    }
  }
  var $retval_0;
  return $retval_0;
  return null;
}

_deflate_slow["X"] = 1;

function _inflateReset($strm) {
  var $strm$s2 = $strm >> 2;
  var $cmp = ($strm | 0) == 0;
  do {
    if ($cmp) {
      var $retval_0 = -2;
    } else {
      var $0 = HEAP32[$strm$s2 + 7];
      if (($0 | 0) == 0) {
        var $retval_0 = -2;
        break;
      }
      var $1 = $0 + 28 | 0;
      HEAP32[$1 >> 2] = 0;
      HEAP32[$strm$s2 + 5] = 0;
      HEAP32[$strm$s2 + 2] = 0;
      HEAP32[$strm$s2 + 6] = 0;
      HEAP32[$strm$s2 + 12] = 1;
      var $mode = $0 | 0;
      HEAP32[$mode >> 2] = 0;
      var $2 = $0 + 4 | 0;
      HEAP32[$2 >> 2] = 0;
      var $3 = $0 + 12 | 0;
      HEAP32[$3 >> 2] = 0;
      var $4 = $0 + 20 | 0;
      HEAP32[$4 >> 2] = 32768;
      var $5 = $0 + 32 | 0;
      HEAP32[$5 >> 2] = 0;
      var $6 = $0 + 40 | 0;
      HEAP32[$6 >> 2] = 0;
      var $7 = $0 + 44 | 0;
      HEAP32[$7 >> 2] = 0;
      var $8 = $0 + 48 | 0;
      HEAP32[$8 >> 2] = 0;
      var $9 = $0 + 56 | 0;
      HEAP32[$9 >> 2] = 0;
      var $10 = $0 + 60 | 0;
      HEAP32[$10 >> 2] = 0;
      var $11 = $0 + 108 | 0;
      var $arraydecay_c = $0 + 1328 | 0;
      HEAP32[$11 >> 2] = $arraydecay_c;
      var $12 = $0 + 80 | 0;
      HEAP32[$12 >> 2] = $arraydecay_c;
      var $13 = $0 + 76 | 0;
      HEAP32[$13 >> 2] = $arraydecay_c;
      var $14 = $0 + 7104 | 0;
      HEAP32[$14 >> 2] = 1;
      var $15 = $0 + 7108 | 0;
      HEAP32[$15 >> 2] = -1;
      var $retval_0 = 0;
    }
  } while (0);
  var $retval_0;
  return $retval_0;
  return null;
}

_inflateReset["X"] = 1;

function _inflateReset2($strm) {
  var $cmp = ($strm | 0) == 0;
  do {
    if ($cmp) {
      var $retval_0 = -2;
    } else {
      var $0 = HEAP32[$strm + 28 >> 2];
      if (($0 | 0) == 0) {
        var $retval_0 = -2;
        break;
      }
      var $window = $0 + 52 | 0;
      var $2 = HEAP32[$window >> 2];
      var $cmp15 = ($2 | 0) == 0;
      var $_pre = $0 + 36 | 0;
      do {
        if (!$cmp15) {
          if ((HEAP32[$_pre >> 2] | 0) == 15) {
            break;
          }
          var $4 = HEAP32[$strm + 36 >> 2];
          var $5 = HEAP32[$strm + 40 >> 2];
          FUNCTION_TABLE[$4]($5, $2);
          var $6 = $window | 0;
          HEAP32[$6 >> 2] = 0;
        }
      } while (0);
      var $7 = $0 + 8 | 0;
      HEAP32[$7 >> 2] = 1;
      HEAP32[$_pre >> 2] = 15;
      var $call = _inflateReset($strm);
      var $retval_0 = $call;
    }
  } while (0);
  var $retval_0;
  return $retval_0;
  return null;
}

function _inflateInit2_($strm) {
  var $zfree$s2;
  var $cmp7 = ($strm | 0) == 0;
  do {
    if ($cmp7) {
      var $retval_0 = -2;
    } else {
      HEAP32[$strm + 24 >> 2] = 0;
      var $zalloc = $strm + 32 | 0;
      var $0 = HEAP32[$zalloc >> 2];
      if (($0 | 0) == 0) {
        HEAP32[$zalloc >> 2] = 2;
        HEAP32[$strm + 40 >> 2] = 0;
        var $1 = 2;
      } else {
        var $1 = $0;
      }
      var $1;
      var $zfree$s2 = ($strm + 36 | 0) >> 2;
      if ((HEAP32[$zfree$s2] | 0) == 0) {
        HEAP32[$zfree$s2] = 4;
      }
      var $opaque22 = $strm + 40 | 0;
      var $3 = HEAP32[$opaque22 >> 2];
      var $call = FUNCTION_TABLE[$1]($3, 1, 7116);
      if (($call | 0) == 0) {
        var $retval_0 = -4;
        break;
      }
      var $4 = $call;
      var $state27 = $strm + 28 | 0;
      HEAP32[$state27 >> 2] = $4;
      var $5 = $call + 52 | 0;
      HEAP32[$5 >> 2] = 0;
      var $call28 = _inflateReset2($strm);
      if (($call28 | 0) == 0) {
        var $retval_0 = 0;
        break;
      }
      var $6 = HEAP32[$zfree$s2];
      var $7 = HEAP32[$opaque22 >> 2];
      FUNCTION_TABLE[$6]($7, $call);
      HEAP32[$state27 >> 2] = 0;
      var $retval_0 = $call28;
    }
  } while (0);
  var $retval_0;
  return $retval_0;
  return null;
}

function _inflateInit_($strm) {
  var $call = _inflateInit2_($strm);
  return $call;
  return null;
}

function _inflate($strm) {
  var $78$s2;
  var $40$s1;
  var $39$s2;
  var $37$s2;
  var $36$s2;
  var $35$s2;
  var $total_out$s2;
  var $29$s2;
  var $27$s2;
  var $25$s2;
  var $24$s2;
  var $23$s2;
  var $21$s2;
  var $adler$s2;
  var $msg$s2;
  var $18$s2;
  var $17$s2;
  var $16$s2;
  var $15$s2;
  var $13$s2;
  var $11$s2;
  var $avail_in15$s2;
  var $avail_out$s2;
  var $mode$s2;
  var $next_in$s2;
  var $next_out$s2;
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var __label__;
  var $hbuf = __stackBase__;
  var $cmp = ($strm | 0) == 0;
  $return$$lor_lhs_false$2 : do {
    if ($cmp) {
      var $retval_0 = -2;
    } else {
      var $0 = HEAP32[$strm + 28 >> 2];
      if (($0 | 0) == 0) {
        var $retval_0 = -2;
        break;
      }
      var $next_out$s2 = ($strm + 12 | 0) >> 2;
      var $1 = HEAP32[$next_out$s2];
      if (($1 | 0) == 0) {
        var $retval_0 = -2;
        break;
      }
      var $next_in$s2 = ($strm | 0) >> 2;
      var $2 = HEAP32[$next_in$s2];
      if (($2 | 0) == 0) {
        if ((HEAP32[$strm + 4 >> 2] | 0) != 0) {
          var $retval_0 = -2;
          break;
        }
      }
      var $4 = $0;
      var $mode$s2 = ($0 | 0) >> 2;
      var $5 = HEAP32[$mode$s2];
      if (($5 | 0) == 11) {
        HEAP32[$mode$s2] = 12;
        var $8 = HEAP32[$next_out$s2];
        var $7 = HEAP32[$next_in$s2];
        var $6 = 12;
      } else {
        var $8 = $1;
        var $7 = $2;
        var $6 = $5;
      }
      var $6;
      var $7;
      var $8;
      var $avail_out$s2 = ($strm + 16 | 0) >> 2;
      var $9 = HEAP32[$avail_out$s2];
      var $avail_in15$s2 = ($strm + 4 | 0) >> 2;
      var $10 = HEAPU32[$avail_in15$s2];
      var $11$s2 = ($0 + 56 | 0) >> 2;
      var $13$s2 = ($0 + 60 | 0) >> 2;
      var $15$s2 = ($0 + 8 | 0) >> 2;
      var $16$s2 = ($0 + 24 | 0) >> 2;
      var $arrayidx = $hbuf | 0;
      var $arrayidx40 = $hbuf + 1 | 0;
      var $17$s2 = ($0 + 16 | 0) >> 2;
      var $18$s2 = ($0 + 32 | 0) >> 2;
      var $msg$s2 = ($strm + 24 | 0) >> 2;
      var $19 = $0 + 36 | 0;
      var $20 = $0 + 20 | 0;
      var $adler$s2 = ($strm + 48 | 0) >> 2;
      var $21$s2 = ($0 + 64 | 0) >> 2;
      var $22 = $0 + 12 | 0;
      var $23$s2 = ($0 + 4 | 0) >> 2;
      var $24$s2 = ($0 + 7108 | 0) >> 2;
      var $25 = $0 + 84 | 0, $25$s2 = $25 >> 2;
      var $26 = $0 + 76 | 0;
      var $27$s2 = ($0 + 72 | 0) >> 2;
      var $28 = $0 + 7112 | 0;
      var $29$s2 = ($0 + 68 | 0) >> 2;
      var $30 = $0 + 44 | 0;
      var $31 = $0 + 7104 | 0;
      var $32 = $0 + 48 | 0;
      var $33 = $0 + 52 | 0;
      var $34 = $0 + 40 | 0;
      var $total_out$s2 = ($strm + 20 | 0) >> 2;
      var $35$s2 = ($0 + 28 | 0) >> 2;
      var $arrayidx199 = $hbuf + 2 | 0;
      var $arrayidx202 = $hbuf + 3 | 0;
      var $36$s2 = ($0 + 96 | 0) >> 2;
      var $37$s2 = ($0 + 100 | 0) >> 2;
      var $38 = $0 + 92 | 0;
      var $39$s2 = ($0 + 104 | 0) >> 2;
      var $lens = $0 + 112 | 0;
      var $40$s1 = $lens >> 1;
      var $next861 = $0 + 108 | 0;
      var $41 = $next861;
      var $42 = $next861 | 0;
      var $arraydecay860_c = $0 + 1328 | 0;
      var $43 = $0 + 76 | 0;
      var $arraydecay864 = $lens;
      var $arraydecay867 = $0 + 752 | 0;
      var $44 = $0 + 624 | 0;
      var $45 = $0 + 80 | 0;
      var $46 = $0 + 88 | 0;
      var $47 = $0 + 80 | 0;
      var $ret_0 = 0;
      var $next_0 = $7;
      var $put_0 = $8;
      var $have_0 = $10;
      var $left_0 = $9;
      var $hold_0 = HEAP32[$11$s2];
      var $bits_0 = HEAP32[$13$s2];
      var $out_0 = $9;
      var $48 = $6;
      $for_cond$12 : while (1) {
        var $48;
        var $out_0;
        var $bits_0;
        var $hold_0;
        var $left_0;
        var $have_0;
        var $put_0;
        var $next_0;
        var $ret_0;
        $return_loopexit24$$sw_bb$$while_cond100$$while_cond163$$while_cond214$$sw_bb260$$sw_bb317$$for_cond_sw_bb373_crit_edge$$sw_bb433$$sw_bb496$$while_cond551$$sw_bb588$$sw_bb614$$do_body680$$sw_bb726$$sw_bb728$$while_cond754$$while_cond809$$while_cond877_preheader$$sw_bb1176$$sw_bb1178$$for_cond_sw_bb1344_crit_edge$$for_cond1390_preheader$$for_cond_sw_bb1505_crit_edge$$sw_bb1549$$sw_bb1614$$sw_bb1624$$sw_bb1700$$do_body1745_loopexit25$14 : do {
          if ($48 == 0) {
            var $49 = HEAPU32[$15$s2];
            if (($49 | 0) == 0) {
              HEAP32[$mode$s2] = 12;
              var $ret_0_be = $ret_0;
              var $next_0_be = $next_0;
              var $put_0_be = $put_0;
              var $have_0_be = $have_0;
              var $left_0_be = $left_0;
              var $hold_0_be = $hold_0;
              var $bits_0_be = $bits_0;
              var $out_0_be = $out_0;
              __label__ = 265;
              break;
            }
            var $next_1 = $next_0;
            var $have_1 = $have_0;
            var $hold_1 = $hold_0;
            var $bits_1 = $bits_0;
            while (1) {
              var $bits_1;
              var $hold_1;
              var $have_1;
              var $next_1;
              if ($bits_1 >>> 0 >= 16) {
                break;
              }
              if (($have_1 | 0) == 0) {
                var $ret_8 = $ret_0;
                var $next_58 = $next_1;
                var $have_58 = 0;
                var $hold_54 = $hold_1;
                var $bits_54 = $bits_1;
                var $out_4 = $out_0;
                break $for_cond$12;
              }
              var $add = ((HEAPU8[$next_1] & 255) << $bits_1) + $hold_1 | 0;
              var $next_1 = $next_1 + 1 | 0;
              var $have_1 = $have_1 - 1 | 0;
              var $hold_1 = $add;
              var $bits_1 = $bits_1 + 8 | 0;
            }
            if (($49 & 2 | 0) != 0 & ($hold_1 | 0) == 35615) {
              var $call = _crc32(0, 0, 0);
              HEAP32[$16$s2] = $call;
              HEAP8[$arrayidx] = 31;
              HEAP8[$arrayidx40] = -117;
              var $51 = HEAP32[$16$s2];
              var $call42 = _crc32($51, $arrayidx, 2);
              HEAP32[$16$s2] = $call42;
              HEAP32[$mode$s2] = 1;
              var $ret_0_be = $ret_0;
              var $next_0_be = $next_1;
              var $put_0_be = $put_0;
              var $have_0_be = $have_1;
              var $left_0_be = $left_0;
              var $hold_0_be = 0;
              var $bits_0_be = 0;
              var $out_0_be = $out_0;
              __label__ = 265;
              break;
            }
            HEAP32[$17$s2] = 0;
            var $52 = HEAP32[$18$s2];
            if (($52 | 0) == 0) {
              var $53 = $49;
            } else {
              var $done = $52 + 48 | 0;
              HEAP32[$done >> 2] = -1;
              var $53 = HEAP32[$15$s2];
            }
            var $53;
            var $tobool56 = ($53 & 1 | 0) == 0;
            do {
              if (!$tobool56) {
                if ((((($hold_1 << 8 & 65280) + ($hold_1 >>> 8) | 0) >>> 0) % 31 | 0) != 0) {
                  break;
                }
                if (($hold_1 & 15 | 0) == 8) {
                  var $shr74 = $hold_1 >>> 4;
                  var $sub = $bits_1 - 4 | 0;
                  var $add77 = ($shr74 & 15) + 8 | 0;
                  var $54 = HEAPU32[$19 >> 2];
                  var $cmp78 = ($54 | 0) == 0;
                  do {
                    if (!$cmp78) {
                      if ($add77 >>> 0 <= $54 >>> 0) {
                        break;
                      }
                      HEAP32[$msg$s2] = STRING_TABLE.__str317 | 0;
                      HEAP32[$mode$s2] = 29;
                      var $ret_0_be = $ret_0;
                      var $next_0_be = $next_1;
                      var $put_0_be = $put_0;
                      var $have_0_be = $have_1;
                      var $left_0_be = $left_0;
                      var $hold_0_be = $shr74;
                      var $bits_0_be = $sub;
                      var $out_0_be = $out_0;
                      __label__ = 265;
                      break $return_loopexit24$$sw_bb$$while_cond100$$while_cond163$$while_cond214$$sw_bb260$$sw_bb317$$for_cond_sw_bb373_crit_edge$$sw_bb433$$sw_bb496$$while_cond551$$sw_bb588$$sw_bb614$$do_body680$$sw_bb726$$sw_bb728$$while_cond754$$while_cond809$$while_cond877_preheader$$sw_bb1176$$sw_bb1178$$for_cond_sw_bb1344_crit_edge$$for_cond1390_preheader$$for_cond_sw_bb1505_crit_edge$$sw_bb1549$$sw_bb1614$$sw_bb1624$$sw_bb1700$$do_body1745_loopexit25$14;
                    }
                    HEAP32[$19 >> 2] = $add77;
                  } while (0);
                  HEAP32[$20 >> 2] = 1 << $add77;
                  var $call91 = _adler32(0, 0, 0);
                  HEAP32[$16$s2] = $call91;
                  HEAP32[$adler$s2] = $call91;
                  HEAP32[$mode$s2] = $hold_1 >>> 12 & 2 ^ 11;
                  var $ret_0_be = $ret_0;
                  var $next_0_be = $next_1;
                  var $put_0_be = $put_0;
                  var $have_0_be = $have_1;
                  var $left_0_be = $left_0;
                  var $hold_0_be = 0;
                  var $bits_0_be = 0;
                  var $out_0_be = $out_0;
                  __label__ = 265;
                  break $return_loopexit24$$sw_bb$$while_cond100$$while_cond163$$while_cond214$$sw_bb260$$sw_bb317$$for_cond_sw_bb373_crit_edge$$sw_bb433$$sw_bb496$$while_cond551$$sw_bb588$$sw_bb614$$do_body680$$sw_bb726$$sw_bb728$$while_cond754$$while_cond809$$while_cond877_preheader$$sw_bb1176$$sw_bb1178$$for_cond_sw_bb1344_crit_edge$$for_cond1390_preheader$$for_cond_sw_bb1505_crit_edge$$sw_bb1549$$sw_bb1614$$sw_bb1624$$sw_bb1700$$do_body1745_loopexit25$14;
                }
                HEAP32[$msg$s2] = STRING_TABLE.__str216 | 0;
                HEAP32[$mode$s2] = 29;
                var $ret_0_be = $ret_0;
                var $next_0_be = $next_1;
                var $put_0_be = $put_0;
                var $have_0_be = $have_1;
                var $left_0_be = $left_0;
                var $hold_0_be = $hold_1;
                var $bits_0_be = $bits_1;
                var $out_0_be = $out_0;
                __label__ = 265;
                break $return_loopexit24$$sw_bb$$while_cond100$$while_cond163$$while_cond214$$sw_bb260$$sw_bb317$$for_cond_sw_bb373_crit_edge$$sw_bb433$$sw_bb496$$while_cond551$$sw_bb588$$sw_bb614$$do_body680$$sw_bb726$$sw_bb728$$while_cond754$$while_cond809$$while_cond877_preheader$$sw_bb1176$$sw_bb1178$$for_cond_sw_bb1344_crit_edge$$for_cond1390_preheader$$for_cond_sw_bb1505_crit_edge$$sw_bb1549$$sw_bb1614$$sw_bb1624$$sw_bb1700$$do_body1745_loopexit25$14;
              }
            } while (0);
            HEAP32[$msg$s2] = STRING_TABLE.__str115 | 0;
            HEAP32[$mode$s2] = 29;
            var $ret_0_be = $ret_0;
            var $next_0_be = $next_1;
            var $put_0_be = $put_0;
            var $have_0_be = $have_1;
            var $left_0_be = $left_0;
            var $hold_0_be = $hold_1;
            var $bits_0_be = $bits_1;
            var $out_0_be = $out_0;
            __label__ = 265;
            break;
          } else if ($48 == 1) {
            var $next_2 = $next_0;
            var $have_2 = $have_0;
            var $hold_2 = $hold_0;
            var $bits_2 = $bits_0;
            while (1) {
              var $bits_2;
              var $hold_2;
              var $have_2;
              var $next_2;
              if ($bits_2 >>> 0 >= 16) {
                break;
              }
              if (($have_2 | 0) == 0) {
                var $ret_8 = $ret_0;
                var $next_58 = $next_2;
                var $have_58 = 0;
                var $hold_54 = $hold_2;
                var $bits_54 = $bits_2;
                var $out_4 = $out_0;
                break $for_cond$12;
              }
              var $add113 = ((HEAPU8[$next_2] & 255) << $bits_2) + $hold_2 | 0;
              var $next_2 = $next_2 + 1 | 0;
              var $have_2 = $have_2 - 1 | 0;
              var $hold_2 = $add113;
              var $bits_2 = $bits_2 + 8 | 0;
            }
            HEAP32[$17$s2] = $hold_2;
            if (($hold_2 & 255 | 0) != 8) {
              HEAP32[$msg$s2] = STRING_TABLE.__str216 | 0;
              HEAP32[$mode$s2] = 29;
              var $ret_0_be = $ret_0;
              var $next_0_be = $next_2;
              var $put_0_be = $put_0;
              var $have_0_be = $have_2;
              var $left_0_be = $left_0;
              var $hold_0_be = $hold_2;
              var $bits_0_be = $bits_2;
              var $out_0_be = $out_0;
              __label__ = 265;
              break;
            }
            if (($hold_2 & 57344 | 0) == 0) {
              var $58 = HEAPU32[$18$s2];
              if (($58 | 0) == 0) {
                var $59 = $hold_2;
              } else {
                HEAP32[($58 | 0) >> 2] = $hold_2 >>> 8 & 1;
                var $59 = HEAP32[$17$s2];
              }
              var $59;
              if (($59 & 512 | 0) != 0) {
                HEAP8[$arrayidx] = $hold_2 & 255;
                HEAP8[$arrayidx40] = $hold_2 >>> 8 & 255;
                var $60 = HEAP32[$16$s2];
                var $call154 = _crc32($60, $arrayidx, 2);
                HEAP32[$16$s2] = $call154;
              }
              HEAP32[$mode$s2] = 2;
              var $next_3 = $next_2;
              var $have_3 = $have_2;
              var $hold_3 = 0;
              var $bits_3 = 0;
              __label__ = 43;
              break;
            }
            HEAP32[$msg$s2] = STRING_TABLE.__str418 | 0;
            HEAP32[$mode$s2] = 29;
            var $ret_0_be = $ret_0;
            var $next_0_be = $next_2;
            var $put_0_be = $put_0;
            var $have_0_be = $have_2;
            var $left_0_be = $left_0;
            var $hold_0_be = $hold_2;
            var $bits_0_be = $bits_2;
            var $out_0_be = $out_0;
            __label__ = 265;
            break;
          } else if ($48 == 2) {
            var $next_3 = $next_0;
            var $have_3 = $have_0;
            var $hold_3 = $hold_0;
            var $bits_3 = $bits_0;
            __label__ = 43;
          } else if ($48 == 3) {
            var $next_4 = $next_0;
            var $have_4 = $have_0;
            var $hold_4 = $hold_0;
            var $bits_4 = $bits_0;
            __label__ = 51;
          } else if ($48 == 4) {
            var $next_5 = $next_0;
            var $have_5 = $have_0;
            var $hold_5 = $hold_0;
            var $bits_5 = $bits_0;
            __label__ = 59;
          } else if ($48 == 5) {
            var $next_8 = $next_0;
            var $have_8 = $have_0;
            var $hold_8 = $hold_0;
            var $bits_8 = $bits_0;
            __label__ = 70;
          } else if ($48 == 6) {
            var $next_11 = $next_0;
            var $have_11 = $have_0;
            var $hold_9 = $hold_0;
            var $bits_9 = $bits_0;
            var $88 = HEAP32[$17$s2];
            __label__ = 80;
            break;
          } else if ($48 == 7) {
            var $next_13 = $next_0;
            var $have_13 = $have_0;
            var $hold_10 = $hold_0;
            var $bits_10 = $bits_0;
            __label__ = 93;
          } else if ($48 == 8) {
            var $next_15 = $next_0;
            var $have_15 = $have_0;
            var $hold_11 = $hold_0;
            var $bits_11 = $bits_0;
            __label__ = 106;
          } else if ($48 == 9) {
            var $next_18 = $next_0;
            var $have_18 = $have_0;
            var $hold_14 = $hold_0;
            var $bits_14 = $bits_0;
            while (1) {
              var $bits_14;
              var $hold_14;
              var $have_18;
              var $next_18;
              if ($bits_14 >>> 0 >= 32) {
                break;
              }
              if (($have_18 | 0) == 0) {
                var $ret_8 = $ret_0;
                var $next_58 = $next_18;
                var $have_58 = 0;
                var $hold_54 = $hold_14;
                var $bits_54 = $bits_14;
                var $out_4 = $out_0;
                break $for_cond$12;
              }
              var $add564 = ((HEAPU8[$next_18] & 255) << $bits_14) + $hold_14 | 0;
              var $next_18 = $next_18 + 1 | 0;
              var $have_18 = $have_18 - 1 | 0;
              var $hold_14 = $add564;
              var $bits_14 = $bits_14 + 8 | 0;
            }
            var $add581 = _llvm_bswap_i32($hold_14);
            HEAP32[$16$s2] = $add581;
            HEAP32[$adler$s2] = $add581;
            HEAP32[$mode$s2] = 10;
            var $next_19 = $next_18;
            var $have_19 = $have_18;
            var $hold_15 = 0;
            var $bits_15 = 0;
            __label__ = 119;
            break;
          } else if ($48 == 10) {
            var $next_19 = $next_0;
            var $have_19 = $have_0;
            var $hold_15 = $hold_0;
            var $bits_15 = $bits_0;
            __label__ = 119;
          } else if ($48 == 11 || $48 == 12) {
            var $next_21 = $next_0;
            var $have_21 = $have_0;
            var $hold_17 = $hold_0;
            var $bits_17 = $bits_0;
            __label__ = 122;
          } else if ($48 == 13) {
            var $and681 = $bits_0 & 7;
            var $next_23 = $next_0;
            var $have_23 = $have_0;
            var $hold_19 = $hold_0 >>> ($and681 >>> 0);
            var $bits_19 = $bits_0 - $and681 | 0;
            while (1) {
              var $bits_19;
              var $hold_19;
              var $have_23;
              var $next_23;
              if ($bits_19 >>> 0 >= 32) {
                break;
              }
              if (($have_23 | 0) == 0) {
                var $ret_8 = $ret_0;
                var $next_58 = $next_23;
                var $have_58 = 0;
                var $hold_54 = $hold_19;
                var $bits_54 = $bits_19;
                var $out_4 = $out_0;
                break $for_cond$12;
              }
              var $add701 = ((HEAPU8[$next_23] & 255) << $bits_19) + $hold_19 | 0;
              var $next_23 = $next_23 + 1 | 0;
              var $have_23 = $have_23 - 1 | 0;
              var $hold_19 = $add701;
              var $bits_19 = $bits_19 + 8 | 0;
            }
            var $and708 = $hold_19 & 65535;
            if (($and708 | 0) == ($hold_19 >>> 16 ^ 65535 | 0)) {
              HEAP32[$21$s2] = $and708;
              HEAP32[$mode$s2] = 14;
              var $next_24 = $next_23;
              var $have_24 = $have_23;
              var $hold_20 = 0;
              var $bits_20 = 0;
              __label__ = 140;
              break;
            }
            HEAP32[$msg$s2] = STRING_TABLE.__str721 | 0;
            HEAP32[$mode$s2] = 29;
            var $ret_0_be = $ret_0;
            var $next_0_be = $next_23;
            var $put_0_be = $put_0;
            var $have_0_be = $have_23;
            var $left_0_be = $left_0;
            var $hold_0_be = $hold_19;
            var $bits_0_be = $bits_19;
            var $out_0_be = $out_0;
            __label__ = 265;
            break;
          } else if ($48 == 14) {
            var $next_24 = $next_0;
            var $have_24 = $have_0;
            var $hold_20 = $hold_0;
            var $bits_20 = $bits_0;
            __label__ = 140;
          } else if ($48 == 15) {
            var $next_25 = $next_0;
            var $have_25 = $have_0;
            var $hold_21 = $hold_0;
            var $bits_21 = $bits_0;
            __label__ = 141;
          } else if ($48 == 16) {
            var $next_26 = $next_0;
            var $have_26 = $have_0;
            var $hold_22 = $hold_0;
            var $bits_22 = $bits_0;
            while (1) {
              var $bits_22;
              var $hold_22;
              var $have_26;
              var $next_26;
              if ($bits_22 >>> 0 >= 14) {
                break;
              }
              if (($have_26 | 0) == 0) {
                var $ret_8 = $ret_0;
                var $next_58 = $next_26;
                var $have_58 = 0;
                var $hold_54 = $hold_22;
                var $bits_54 = $bits_22;
                var $out_4 = $out_0;
                break $for_cond$12;
              }
              var $add767 = ((HEAPU8[$next_26] & 255) << $bits_22) + $hold_22 | 0;
              var $next_26 = $next_26 + 1 | 0;
              var $have_26 = $have_26 - 1 | 0;
              var $hold_22 = $add767;
              var $bits_22 = $bits_22 + 8 | 0;
            }
            var $add775 = ($hold_22 & 31) + 257 | 0;
            HEAP32[$36$s2] = $add775;
            var $add782 = ($hold_22 >>> 5 & 31) + 1 | 0;
            HEAP32[$37$s2] = $add782;
            HEAP32[$38 >> 2] = ($hold_22 >>> 10 & 15) + 4 | 0;
            var $shr791 = $hold_22 >>> 14;
            var $sub792 = $bits_22 - 14 | 0;
            if ($add775 >>> 0 > 286 | $add782 >>> 0 > 30) {
              HEAP32[$msg$s2] = STRING_TABLE.__str822 | 0;
              HEAP32[$mode$s2] = 29;
              var $ret_0_be = $ret_0;
              var $next_0_be = $next_26;
              var $put_0_be = $put_0;
              var $have_0_be = $have_26;
              var $left_0_be = $left_0;
              var $hold_0_be = $shr791;
              var $bits_0_be = $sub792;
              var $out_0_be = $out_0;
              __label__ = 265;
              break;
            }
            HEAP32[$39$s2] = 0;
            HEAP32[$mode$s2] = 17;
            var $next_27 = $next_26;
            var $have_27 = $have_26;
            var $hold_23 = $shr791;
            var $bits_23 = $sub792;
            __label__ = 151;
            break;
          } else if ($48 == 17) {
            var $next_27 = $next_0;
            var $have_27 = $have_0;
            var $hold_23 = $hold_0;
            var $bits_23 = $bits_0;
            __label__ = 151;
          } else if ($48 == 18) {
            var $ret_1_ph = $ret_0;
            var $next_29_ph = $next_0;
            var $have_29_ph = $have_0;
            var $hold_25_ph = $hold_0;
            var $bits_25_ph = $bits_0;
            __label__ = 161;
          } else if ($48 == 19) {
            var $ret_2 = $ret_0;
            var $next_37 = $next_0;
            var $have_37 = $have_0;
            var $hold_33 = $hold_0;
            var $bits_33 = $bits_0;
            __label__ = 202;
          } else if ($48 == 20) {
            var $ret_3 = $ret_0;
            var $next_38 = $next_0;
            var $have_38 = $have_0;
            var $hold_34 = $hold_0;
            var $bits_34 = $bits_0;
            __label__ = 203;
          } else if ($48 == 21) {
            var $ret_4 = $ret_0;
            var $next_42 = $next_0;
            var $have_42 = $have_0;
            var $hold_38 = $hold_0;
            var $bits_38 = $bits_0;
            var $155 = HEAP32[$27$s2];
            __label__ = 224;
            break;
          } else if ($48 == 22) {
            var $ret_5_ph = $ret_0;
            var $next_45_ph = $next_0;
            var $have_45_ph = $have_0;
            var $hold_41_ph = $hold_0;
            var $bits_41_ph = $bits_0;
            __label__ = 231;
          } else if ($48 == 23) {
            var $ret_6 = $ret_0;
            var $next_48 = $next_0;
            var $have_48 = $have_0;
            var $hold_44 = $hold_0;
            var $bits_44 = $bits_0;
            var $166 = HEAP32[$27$s2];
            __label__ = 245;
            break;
          } else if ($48 == 24) {
            var $ret_7 = $ret_0;
            var $next_51 = $next_0;
            var $have_51 = $have_0;
            var $hold_47 = $hold_0;
            var $bits_47 = $bits_0;
            __label__ = 251;
          } else if ($48 == 25) {
            if (($left_0 | 0) == 0) {
              var $ret_8 = $ret_0;
              var $next_58 = $next_0;
              var $have_58 = $have_0;
              var $hold_54 = $hold_0;
              var $bits_54 = $bits_0;
              var $out_4 = $out_0;
              break $for_cond$12;
            }
            HEAP8[$put_0] = HEAP32[$21$s2] & 255;
            HEAP32[$mode$s2] = 20;
            var $ret_0_be = $ret_0;
            var $next_0_be = $next_0;
            var $put_0_be = $put_0 + 1 | 0;
            var $have_0_be = $have_0;
            var $left_0_be = $left_0 - 1 | 0;
            var $hold_0_be = $hold_0;
            var $bits_0_be = $bits_0;
            var $out_0_be = $out_0;
            __label__ = 265;
            break;
          } else if ($48 == 26) {
            var $tobool1626 = (HEAP32[$15$s2] | 0) == 0;
            do {
              if (!$tobool1626) {
                var $next_52 = $next_0;
                var $have_52 = $have_0;
                var $hold_48 = $hold_0;
                var $bits_48 = $bits_0;
                while (1) {
                  var $bits_48;
                  var $hold_48;
                  var $have_52;
                  var $next_52;
                  if ($bits_48 >>> 0 >= 32) {
                    break;
                  }
                  if (($have_52 | 0) == 0) {
                    var $ret_8 = $ret_0;
                    var $next_58 = $next_52;
                    var $have_58 = 0;
                    var $hold_54 = $hold_48;
                    var $bits_54 = $bits_48;
                    var $out_4 = $out_0;
                    break $for_cond$12;
                  }
                  var $add1642 = ((HEAPU8[$next_52] & 255) << $bits_48) + $hold_48 | 0;
                  var $next_52 = $next_52 + 1 | 0;
                  var $have_52 = $have_52 - 1 | 0;
                  var $hold_48 = $add1642;
                  var $bits_48 = $bits_48 + 8 | 0;
                }
                var $sub1649 = $out_0 - $left_0 | 0;
                var $add1650 = HEAP32[$total_out$s2] + $sub1649 | 0;
                HEAP32[$total_out$s2] = $add1650;
                var $add1651 = HEAP32[$35$s2] + $sub1649 | 0;
                HEAP32[$35$s2] = $add1651;
                if (($out_0 | 0) != ($left_0 | 0)) {
                  var $191 = HEAP32[$16$s2];
                  var $add_ptr1659 = $put_0 + -$sub1649 | 0;
                  if ((HEAP32[$17$s2] | 0) == 0) {
                    var $call1665 = _adler32($191, $add_ptr1659, $sub1649);
                    var $cond1667 = $call1665;
                  } else {
                    var $call1660 = _crc32($191, $add_ptr1659, $sub1649);
                    var $cond1667 = $call1660;
                  }
                  var $cond1667;
                  HEAP32[$16$s2] = $cond1667;
                  HEAP32[$adler$s2] = $cond1667;
                }
                if ((HEAP32[$17$s2] | 0) == 0) {
                  var $add1685 = _llvm_bswap_i32($hold_48);
                  var $cond1687 = $add1685;
                } else {
                  var $cond1687 = $hold_48;
                }
                var $cond1687;
                if (($cond1687 | 0) == (HEAP32[$16$s2] | 0)) {
                  var $next_53 = $next_52;
                  var $have_53 = $have_52;
                  var $hold_49 = 0;
                  var $bits_49 = 0;
                  var $out_1 = $left_0;
                  break;
                }
                HEAP32[$msg$s2] = STRING_TABLE.__str17 | 0;
                HEAP32[$mode$s2] = 29;
                var $ret_0_be = $ret_0;
                var $next_0_be = $next_52;
                var $put_0_be = $put_0;
                var $have_0_be = $have_52;
                var $left_0_be = $left_0;
                var $hold_0_be = $hold_48;
                var $bits_0_be = $bits_48;
                var $out_0_be = $left_0;
                __label__ = 265;
                break $return_loopexit24$$sw_bb$$while_cond100$$while_cond163$$while_cond214$$sw_bb260$$sw_bb317$$for_cond_sw_bb373_crit_edge$$sw_bb433$$sw_bb496$$while_cond551$$sw_bb588$$sw_bb614$$do_body680$$sw_bb726$$sw_bb728$$while_cond754$$while_cond809$$while_cond877_preheader$$sw_bb1176$$sw_bb1178$$for_cond_sw_bb1344_crit_edge$$for_cond1390_preheader$$for_cond_sw_bb1505_crit_edge$$sw_bb1549$$sw_bb1614$$sw_bb1624$$sw_bb1700$$do_body1745_loopexit25$14;
              }
              var $next_53 = $next_0;
              var $have_53 = $have_0;
              var $hold_49 = $hold_0;
              var $bits_49 = $bits_0;
              var $out_1 = $out_0;
            } while (0);
            var $out_1;
            var $bits_49;
            var $hold_49;
            var $have_53;
            var $next_53;
            HEAP32[$mode$s2] = 27;
            var $next_54 = $next_53;
            var $have_54 = $have_53;
            var $hold_50 = $hold_49;
            var $bits_50 = $bits_49;
            var $out_2 = $out_1;
            __label__ = 283;
            break;
          } else if ($48 == 27) {
            var $next_54 = $next_0;
            var $have_54 = $have_0;
            var $hold_50 = $hold_0;
            var $bits_50 = $bits_0;
            var $out_2 = $out_0;
            __label__ = 283;
          } else if ($48 == 28) {
            var $ret_8 = 1;
            var $next_58 = $next_0;
            var $have_58 = $have_0;
            var $hold_54 = $hold_0;
            var $bits_54 = $bits_0;
            var $out_4 = $out_0;
            break $for_cond$12;
          } else if ($48 == 29) {
            var $ret_8 = -3;
            var $next_58 = $next_0;
            var $have_58 = $have_0;
            var $hold_54 = $hold_0;
            var $bits_54 = $bits_0;
            var $out_4 = $out_0;
            break $for_cond$12;
          } else if ($48 == 30) {
            var $retval_0 = -4;
            break $return$$lor_lhs_false$2;
          } else {
            var $retval_0 = -2;
            break $return$$lor_lhs_false$2;
          }
        } while (0);
        $for_cond_backedge$$while_cond163$$while_cond214$$sw_bb260$$sw_bb317$$sw_bb373$$sw_bb433$$sw_bb496$$sw_bb588$$sw_bb614$$sw_bb726$$sw_bb728$$while_cond809$$while_cond877_preheader$$sw_bb1176$$sw_bb1178$$sw_bb1344$$for_cond1390_preheader$$sw_bb1505$$sw_bb1549$$sw_bb1700$106 : do {
          if (__label__ == 43) {
            while (1) {
              var $bits_3;
              var $hold_3;
              var $have_3;
              var $next_3;
              if ($bits_3 >>> 0 >= 32) {
                break;
              }
              if (($have_3 | 0) == 0) {
                var $ret_8 = $ret_0;
                var $next_58 = $next_3;
                var $have_58 = 0;
                var $hold_54 = $hold_3;
                var $bits_54 = $bits_3;
                var $out_4 = $out_0;
                break $for_cond$12;
              }
              var $add176 = ((HEAPU8[$next_3] & 255) << $bits_3) + $hold_3 | 0;
              var $next_3 = $next_3 + 1 | 0;
              var $have_3 = $have_3 - 1 | 0;
              var $hold_3 = $add176;
              var $bits_3 = $bits_3 + 8 | 0;
            }
            var $62 = HEAP32[$18$s2];
            if (($62 | 0) != 0) {
              var $time = $62 + 4 | 0;
              HEAP32[$time >> 2] = $hold_3;
            }
            if ((HEAP32[$17$s2] & 512 | 0) != 0) {
              HEAP8[$arrayidx] = $hold_3 & 255;
              HEAP8[$arrayidx40] = $hold_3 >>> 8 & 255;
              HEAP8[$arrayidx199] = $hold_3 >>> 16 & 255;
              HEAP8[$arrayidx202] = $hold_3 >>> 24 & 255;
              var $64 = HEAP32[$16$s2];
              var $call205 = _crc32($64, $arrayidx, 4);
              HEAP32[$16$s2] = $call205;
            }
            HEAP32[$mode$s2] = 3;
            var $next_4 = $next_3;
            var $have_4 = $have_3;
            var $hold_4 = 0;
            var $bits_4 = 0;
            __label__ = 51;
            break;
          } else if (__label__ == 119) {
            var $bits_15;
            var $hold_15;
            var $have_19;
            var $next_19;
            if ((HEAP32[$22 >> 2] | 0) == 0) {
              HEAP32[$next_out$s2] = $put_0;
              HEAP32[$avail_out$s2] = $left_0;
              HEAP32[$next_in$s2] = $next_19;
              HEAP32[$avail_in15$s2] = $have_19;
              HEAP32[$11$s2] = $hold_15;
              HEAP32[$13$s2] = $bits_15;
              var $retval_0 = 2;
              break $return$$lor_lhs_false$2;
            }
            var $call602 = _adler32(0, 0, 0);
            HEAP32[$16$s2] = $call602;
            HEAP32[$adler$s2] = $call602;
            HEAP32[$mode$s2] = 11;
            var $next_21 = $next_19;
            var $have_21 = $have_19;
            var $hold_17 = $hold_15;
            var $bits_17 = $bits_15;
            __label__ = 122;
            break;
          } else if (__label__ == 140) {
            var $bits_20;
            var $hold_20;
            var $have_24;
            var $next_24;
            HEAP32[$mode$s2] = 15;
            var $next_25 = $next_24;
            var $have_25 = $have_24;
            var $hold_21 = $hold_20;
            var $bits_21 = $bits_20;
            __label__ = 141;
            break;
          } else if (__label__ == 151) {
            while (1) {
              var $bits_23;
              var $hold_23;
              var $have_27;
              var $next_27;
              var $121 = HEAPU32[$39$s2];
              if ($121 >>> 0 >= HEAPU32[$38 >> 2] >>> 0) {
                break;
              }
              var $next_28 = $next_27;
              var $have_28 = $have_27;
              var $hold_24 = $hold_23;
              var $bits_24 = $bits_23;
              while (1) {
                var $bits_24;
                var $hold_24;
                var $have_28;
                var $next_28;
                if ($bits_24 >>> 0 >= 3) {
                  break;
                }
                if (($have_28 | 0) == 0) {
                  var $ret_8 = $ret_0;
                  var $next_58 = $next_28;
                  var $have_58 = 0;
                  var $hold_54 = $hold_24;
                  var $bits_54 = $bits_24;
                  var $out_4 = $out_0;
                  break $for_cond$12;
                }
                var $add829 = ((HEAPU8[$next_28] & 255) << $bits_24) + $hold_24 | 0;
                var $next_28 = $next_28 + 1 | 0;
                var $have_28 = $have_28 - 1 | 0;
                var $hold_24 = $add829;
                var $bits_24 = $bits_24 + 8 | 0;
              }
              HEAP32[$39$s2] = $121 + 1 | 0;
              HEAP16[((HEAPU16[_inflate_order + ($121 << 1) >> 1] & 65535) << 1 >> 1) + $40$s1] = $hold_24 & 65535 & 7;
              var $next_27 = $next_28;
              var $have_27 = $have_28;
              var $hold_23 = $hold_24 >>> 3;
              var $bits_23 = $bits_24 - 3 | 0;
            }
            var $cmp850111 = $121 >>> 0 < 19;
            $while_body852$$while_end859$131 : do {
              if ($cmp850111) {
                var $125 = $121;
                while (1) {
                  var $125;
                  HEAP32[$39$s2] = $125 + 1 | 0;
                  HEAP16[((HEAPU16[_inflate_order + ($125 << 1) >> 1] & 65535) << 1 >> 1) + $40$s1] = 0;
                  var $_pr = HEAPU32[$39$s2];
                  if ($_pr >>> 0 >= 19) {
                    break $while_body852$$while_end859$131;
                  }
                  var $125 = $_pr;
                }
              }
            } while (0);
            HEAP32[$42 >> 2] = $arraydecay860_c;
            HEAP32[$43 >> 2] = $arraydecay860_c;
            HEAP32[$25$s2] = 7;
            var $call868 = _inflate_table(0, $arraydecay864, 19, $41, $25, $arraydecay867);
            if (($call868 | 0) == 0) {
              HEAP32[$39$s2] = 0;
              HEAP32[$mode$s2] = 18;
              var $ret_1_ph = 0;
              var $next_29_ph = $next_27;
              var $have_29_ph = $have_27;
              var $hold_25_ph = $hold_23;
              var $bits_25_ph = $bits_23;
              __label__ = 161;
              break;
            }
            HEAP32[$msg$s2] = STRING_TABLE.__str923 | 0;
            HEAP32[$mode$s2] = 29;
            var $ret_0_be = $call868;
            var $next_0_be = $next_27;
            var $put_0_be = $put_0;
            var $have_0_be = $have_27;
            var $left_0_be = $left_0;
            var $hold_0_be = $hold_23;
            var $bits_0_be = $bits_23;
            var $out_0_be = $out_0;
            __label__ = 265;
            break;
          } else if (__label__ == 283) {
            var $out_2;
            var $bits_50;
            var $hold_50;
            var $have_54;
            var $next_54;
            var $tobool1702 = (HEAP32[$15$s2] | 0) == 0;
            do {
              if (!$tobool1702) {
                if ((HEAP32[$17$s2] | 0) == 0) {
                  var $next_56 = $next_54;
                  var $have_56 = $have_54;
                  var $hold_52 = $hold_50;
                  var $bits_52 = $bits_50;
                  break;
                }
                var $next_55 = $next_54;
                var $have_55 = $have_54;
                var $hold_51 = $hold_50;
                var $bits_51 = $bits_50;
                while (1) {
                  var $bits_51;
                  var $hold_51;
                  var $have_55;
                  var $next_55;
                  if ($bits_51 >>> 0 >= 32) {
                    break;
                  }
                  if (($have_55 | 0) == 0) {
                    var $ret_8 = $ret_0;
                    var $next_58 = $next_55;
                    var $have_58 = 0;
                    var $hold_54 = $hold_51;
                    var $bits_54 = $bits_51;
                    var $out_4 = $out_2;
                    break $for_cond$12;
                  }
                  var $add1721 = ((HEAPU8[$next_55] & 255) << $bits_51) + $hold_51 | 0;
                  var $next_55 = $next_55 + 1 | 0;
                  var $have_55 = $have_55 - 1 | 0;
                  var $hold_51 = $add1721;
                  var $bits_51 = $bits_51 + 8 | 0;
                }
                if (($hold_51 | 0) == (HEAP32[$35$s2] | 0)) {
                  var $next_56 = $next_55;
                  var $have_56 = $have_55;
                  var $hold_52 = 0;
                  var $bits_52 = 0;
                  break;
                }
                HEAP32[$msg$s2] = STRING_TABLE.__str18 | 0;
                HEAP32[$mode$s2] = 29;
                var $ret_0_be = $ret_0;
                var $next_0_be = $next_55;
                var $put_0_be = $put_0;
                var $have_0_be = $have_55;
                var $left_0_be = $left_0;
                var $hold_0_be = $hold_51;
                var $bits_0_be = $bits_51;
                var $out_0_be = $out_2;
                __label__ = 265;
                break $for_cond_backedge$$while_cond163$$while_cond214$$sw_bb260$$sw_bb317$$sw_bb373$$sw_bb433$$sw_bb496$$sw_bb588$$sw_bb614$$sw_bb726$$sw_bb728$$while_cond809$$while_cond877_preheader$$sw_bb1176$$sw_bb1178$$sw_bb1344$$for_cond1390_preheader$$sw_bb1505$$sw_bb1549$$sw_bb1700$106;
              }
              var $next_56 = $next_54;
              var $have_56 = $have_54;
              var $hold_52 = $hold_50;
              var $bits_52 = $bits_50;
            } while (0);
            var $bits_52;
            var $hold_52;
            var $have_56;
            var $next_56;
            HEAP32[$mode$s2] = 28;
            var $ret_8 = 1;
            var $next_58 = $next_56;
            var $have_58 = $have_56;
            var $hold_54 = $hold_52;
            var $bits_54 = $bits_52;
            var $out_4 = $out_2;
            break $for_cond$12;
          }
        } while (0);
        $for_cond_backedge$$while_cond214$$sw_bb260$$sw_bb317$$sw_bb373$$sw_bb433$$sw_bb496$$sw_bb614$$sw_bb728$$while_cond877_preheader$$sw_bb1176$$sw_bb1178$$sw_bb1344$$for_cond1390_preheader$$sw_bb1505$$sw_bb1549$148 : do {
          if (__label__ == 51) {
            while (1) {
              var $bits_4;
              var $hold_4;
              var $have_4;
              var $next_4;
              if ($bits_4 >>> 0 >= 16) {
                break;
              }
              if (($have_4 | 0) == 0) {
                var $ret_8 = $ret_0;
                var $next_58 = $next_4;
                var $have_58 = 0;
                var $hold_54 = $hold_4;
                var $bits_54 = $bits_4;
                var $out_4 = $out_0;
                break $for_cond$12;
              }
              var $add227 = ((HEAPU8[$next_4] & 255) << $bits_4) + $hold_4 | 0;
              var $next_4 = $next_4 + 1 | 0;
              var $have_4 = $have_4 - 1 | 0;
              var $hold_4 = $add227;
              var $bits_4 = $bits_4 + 8 | 0;
            }
            var $66 = HEAP32[$18$s2];
            if (($66 | 0) != 0) {
              var $xflags = $66 + 8 | 0;
              HEAP32[$xflags >> 2] = $hold_4 & 255;
              var $os = HEAP32[$18$s2] + 12 | 0;
              HEAP32[$os >> 2] = $hold_4 >>> 8;
            }
            if ((HEAP32[$17$s2] & 512 | 0) != 0) {
              HEAP8[$arrayidx] = $hold_4 & 255;
              HEAP8[$arrayidx40] = $hold_4 >>> 8 & 255;
              var $69 = HEAP32[$16$s2];
              var $call253 = _crc32($69, $arrayidx, 2);
              HEAP32[$16$s2] = $call253;
            }
            HEAP32[$mode$s2] = 4;
            var $next_5 = $next_4;
            var $have_5 = $have_4;
            var $hold_5 = 0;
            var $bits_5 = 0;
            __label__ = 59;
            break;
          } else if (__label__ == 122) {
            var $bits_17;
            var $hold_17;
            var $have_21;
            var $next_21;
            if ((HEAP32[$23$s2] | 0) == 0) {
              var $next_22 = $next_21;
              var $have_22 = $have_21;
              var $hold_18 = $hold_17;
              var $bits_18 = $bits_17;
              while (1) {
                var $bits_18;
                var $hold_18;
                var $have_22;
                var $next_22;
                if ($bits_18 >>> 0 >= 3) {
                  break;
                }
                if (($have_22 | 0) == 0) {
                  var $ret_8 = $ret_0;
                  var $next_58 = $next_22;
                  var $have_58 = 0;
                  var $hold_54 = $hold_18;
                  var $bits_54 = $bits_18;
                  var $out_4 = $out_0;
                  break $for_cond$12;
                }
                var $add641 = ((HEAPU8[$next_22] & 255) << $bits_18) + $hold_18 | 0;
                var $next_22 = $next_22 + 1 | 0;
                var $have_22 = $have_22 - 1 | 0;
                var $hold_18 = $add641;
                var $bits_18 = $bits_18 + 8 | 0;
              }
              HEAP32[$23$s2] = $hold_18 & 1;
              var $and655 = $hold_18 >>> 1 & 3;
              if ($and655 == 0) {
                HEAP32[$mode$s2] = 13;
              } else if ($and655 == 1) {
                _fixedtables($4);
                HEAP32[$mode$s2] = 19;
              } else if ($and655 == 2) {
                HEAP32[$mode$s2] = 16;
              } else if ($and655 == 3) {
                HEAP32[$msg$s2] = STRING_TABLE.__str620 | 0;
                HEAP32[$mode$s2] = 29;
              }
              var $ret_0_be = $ret_0;
              var $next_0_be = $next_22;
              var $put_0_be = $put_0;
              var $have_0_be = $have_22;
              var $left_0_be = $left_0;
              var $hold_0_be = $hold_18 >>> 3;
              var $bits_0_be = $bits_18 - 3 | 0;
              var $out_0_be = $out_0;
              __label__ = 265;
              break;
            }
            var $and619 = $bits_17 & 7;
            HEAP32[$mode$s2] = 26;
            var $ret_0_be = $ret_0;
            var $next_0_be = $next_21;
            var $put_0_be = $put_0;
            var $have_0_be = $have_21;
            var $left_0_be = $left_0;
            var $hold_0_be = $hold_17 >>> ($and619 >>> 0);
            var $bits_0_be = $bits_17 - $and619 | 0;
            var $out_0_be = $out_0;
            __label__ = 265;
            break;
          } else if (__label__ == 141) {
            var $bits_21;
            var $hold_21;
            var $have_25;
            var $next_25;
            var $118 = HEAPU32[$21$s2];
            if (($118 | 0) == 0) {
              HEAP32[$mode$s2] = 11;
              var $ret_0_be = $ret_0;
              var $next_0_be = $next_25;
              var $put_0_be = $put_0;
              var $have_0_be = $have_25;
              var $left_0_be = $left_0;
              var $hold_0_be = $hold_21;
              var $bits_0_be = $bits_21;
              var $out_0_be = $out_0;
              __label__ = 265;
              break;
            }
            var $copy_3 = $118 >>> 0 > $have_25 >>> 0 ? $have_25 : $118;
            var $copy_4 = $copy_3 >>> 0 > $left_0 >>> 0 ? $left_0 : $copy_3;
            if (($copy_4 | 0) == 0) {
              var $ret_8 = $ret_0;
              var $next_58 = $next_25;
              var $have_58 = $have_25;
              var $hold_54 = $hold_21;
              var $bits_54 = $bits_21;
              var $out_4 = $out_0;
              break $for_cond$12;
            }
            _memcpy($put_0, $next_25, $copy_4, 1);
            var $sub744 = $have_25 - $copy_4 | 0;
            var $add_ptr745 = $next_25 + $copy_4 | 0;
            var $sub746 = $left_0 - $copy_4 | 0;
            var $add_ptr747 = $put_0 + $copy_4 | 0;
            var $sub749 = HEAP32[$21$s2] - $copy_4 | 0;
            HEAP32[$21$s2] = $sub749;
            var $ret_0_be = $ret_0;
            var $next_0_be = $add_ptr745;
            var $put_0_be = $add_ptr747;
            var $have_0_be = $sub744;
            var $left_0_be = $sub746;
            var $hold_0_be = $hold_21;
            var $bits_0_be = $bits_21;
            var $out_0_be = $out_0;
            __label__ = 265;
            break;
          } else if (__label__ == 161) {
            var $bits_25_ph;
            var $hold_25_ph;
            var $have_29_ph;
            var $next_29_ph;
            var $ret_1_ph;
            var $next_29 = $next_29_ph;
            var $have_29 = $have_29_ph;
            var $hold_25 = $hold_25_ph;
            var $bits_25 = $bits_25_ph;
            $while_cond877$180 : while (1) {
              var $bits_25;
              var $hold_25;
              var $have_29;
              var $next_29;
              var $127 = HEAPU32[$39$s2];
              var $128 = HEAPU32[$36$s2];
              var $add881 = HEAP32[$37$s2] + $128 | 0;
              if ($127 >>> 0 < $add881 >>> 0) {
                var $sub888 = (1 << HEAP32[$25$s2]) - 1 | 0;
                var $131 = HEAPU32[$26 >> 2];
                var $next_30 = $next_29;
                var $have_30 = $have_29;
                var $hold_26 = $hold_25;
                var $bits_26 = $bits_25;
                while (1) {
                  var $bits_26;
                  var $hold_26;
                  var $have_30;
                  var $next_30;
                  var $and889 = $sub888 & $hold_26;
                  var $conv893 = HEAPU8[($and889 << 2) + $131 + 1 | 0] & 255;
                  if ($conv893 >>> 0 <= $bits_26 >>> 0) {
                    break;
                  }
                  if (($have_30 | 0) == 0) {
                    var $ret_8 = $ret_1_ph;
                    var $next_58 = $next_30;
                    var $have_58 = 0;
                    var $hold_54 = $hold_26;
                    var $bits_54 = $bits_26;
                    var $out_4 = $out_0;
                    break $for_cond$12;
                  }
                  var $add907 = ((HEAPU8[$next_30] & 255) << $bits_26) + $hold_26 | 0;
                  var $next_30 = $next_30 + 1 | 0;
                  var $have_30 = $have_30 - 1 | 0;
                  var $hold_26 = $add907;
                  var $bits_26 = $bits_26 + 8 | 0;
                }
                var $tmp26 = HEAPU16[$131 + ($and889 << 2) + 2 >> 1];
                if (($tmp26 & 65535) < 16) {
                  var $next_31 = $next_30;
                  var $have_31 = $have_30;
                  var $hold_27 = $hold_26;
                  var $bits_27 = $bits_26;
                  while (1) {
                    var $bits_27;
                    var $hold_27;
                    var $have_31;
                    var $next_31;
                    if ($bits_27 >>> 0 >= $conv893 >>> 0) {
                      break;
                    }
                    if (($have_31 | 0) == 0) {
                      var $ret_8 = $ret_1_ph;
                      var $next_58 = $next_31;
                      var $have_58 = 0;
                      var $hold_54 = $hold_27;
                      var $bits_54 = $bits_27;
                      var $out_4 = $out_0;
                      break $for_cond$12;
                    }
                    var $add931 = ((HEAPU8[$next_31] & 255) << $bits_27) + $hold_27 | 0;
                    var $next_31 = $next_31 + 1 | 0;
                    var $have_31 = $have_31 - 1 | 0;
                    var $hold_27 = $add931;
                    var $bits_27 = $bits_27 + 8 | 0;
                  }
                  var $shr941 = $hold_27 >>> ($conv893 >>> 0);
                  var $sub944 = $bits_27 - $conv893 | 0;
                  HEAP32[$39$s2] = $127 + 1 | 0;
                  HEAP16[($127 << 1 >> 1) + $40$s1] = $tmp26;
                  var $next_29 = $next_31;
                  var $have_29 = $have_31;
                  var $hold_25 = $shr941;
                  var $bits_25 = $sub944;
                } else {
                  if ($tmp26 == 16) {
                    var $add962 = $conv893 + 2 | 0;
                    var $next_32 = $next_30;
                    var $have_32 = $have_30;
                    var $hold_28 = $hold_26;
                    var $bits_28 = $bits_26;
                    while (1) {
                      var $bits_28;
                      var $hold_28;
                      var $have_32;
                      var $next_32;
                      if ($bits_28 >>> 0 >= $add962 >>> 0) {
                        break;
                      }
                      if (($have_32 | 0) == 0) {
                        var $ret_8 = $ret_1_ph;
                        var $next_58 = $next_32;
                        var $have_58 = 0;
                        var $hold_54 = $hold_28;
                        var $bits_54 = $bits_28;
                        var $out_4 = $out_0;
                        break $for_cond$12;
                      }
                      var $add975 = ((HEAPU8[$next_32] & 255) << $bits_28) + $hold_28 | 0;
                      var $next_32 = $next_32 + 1 | 0;
                      var $have_32 = $have_32 - 1 | 0;
                      var $hold_28 = $add975;
                      var $bits_28 = $bits_28 + 8 | 0;
                    }
                    var $shr985 = $hold_28 >>> ($conv893 >>> 0);
                    var $sub988 = $bits_28 - $conv893 | 0;
                    if (($127 | 0) == 0) {
                      HEAP32[$msg$s2] = STRING_TABLE.__str1024 | 0;
                      HEAP32[$mode$s2] = 29;
                      var $ret_0_be = $ret_1_ph;
                      var $next_0_be = $next_32;
                      var $put_0_be = $put_0;
                      var $have_0_be = $have_32;
                      var $left_0_be = $left_0;
                      var $hold_0_be = $shr985;
                      var $bits_0_be = $sub988;
                      var $out_0_be = $out_0;
                      __label__ = 265;
                      break $for_cond_backedge$$while_cond214$$sw_bb260$$sw_bb317$$sw_bb373$$sw_bb433$$sw_bb496$$sw_bb614$$sw_bb728$$while_cond877_preheader$$sw_bb1176$$sw_bb1178$$sw_bb1344$$for_cond1390_preheader$$sw_bb1505$$sw_bb1549$148;
                    }
                    var $len_0 = HEAP16[($127 - 1 << 1 >> 1) + $40$s1];
                    var $next_35 = $next_32;
                    var $have_35 = $have_32;
                    var $hold_31 = $shr985 >>> 2;
                    var $bits_31 = $sub988 - 2 | 0;
                    var $copy_5 = ($shr985 & 3) + 3 | 0;
                  } else if ($tmp26 == 17) {
                    var $add1020 = $conv893 + 3 | 0;
                    var $next_33 = $next_30;
                    var $have_33 = $have_30;
                    var $hold_29 = $hold_26;
                    var $bits_29 = $bits_26;
                    while (1) {
                      var $bits_29;
                      var $hold_29;
                      var $have_33;
                      var $next_33;
                      if ($bits_29 >>> 0 >= $add1020 >>> 0) {
                        break;
                      }
                      if (($have_33 | 0) == 0) {
                        var $ret_8 = $ret_1_ph;
                        var $next_58 = $next_33;
                        var $have_58 = 0;
                        var $hold_54 = $hold_29;
                        var $bits_54 = $bits_29;
                        var $out_4 = $out_0;
                        break $for_cond$12;
                      }
                      var $add1033 = ((HEAPU8[$next_33] & 255) << $bits_29) + $hold_29 | 0;
                      var $next_33 = $next_33 + 1 | 0;
                      var $have_33 = $have_33 - 1 | 0;
                      var $hold_29 = $add1033;
                      var $bits_29 = $bits_29 + 8 | 0;
                    }
                    var $shr1043 = $hold_29 >>> ($conv893 >>> 0);
                    var $len_0 = 0;
                    var $next_35 = $next_33;
                    var $have_35 = $have_33;
                    var $hold_31 = $shr1043 >>> 3;
                    var $bits_31 = -3 - $conv893 + $bits_29 | 0;
                    var $copy_5 = ($shr1043 & 7) + 3 | 0;
                  } else {
                    var $add1061 = $conv893 + 7 | 0;
                    var $next_34 = $next_30;
                    var $have_34 = $have_30;
                    var $hold_30 = $hold_26;
                    var $bits_30 = $bits_26;
                    while (1) {
                      var $bits_30;
                      var $hold_30;
                      var $have_34;
                      var $next_34;
                      if ($bits_30 >>> 0 >= $add1061 >>> 0) {
                        break;
                      }
                      if (($have_34 | 0) == 0) {
                        var $ret_8 = $ret_1_ph;
                        var $next_58 = $next_34;
                        var $have_58 = 0;
                        var $hold_54 = $hold_30;
                        var $bits_54 = $bits_30;
                        var $out_4 = $out_0;
                        break $for_cond$12;
                      }
                      var $add1074 = ((HEAPU8[$next_34] & 255) << $bits_30) + $hold_30 | 0;
                      var $next_34 = $next_34 + 1 | 0;
                      var $have_34 = $have_34 - 1 | 0;
                      var $hold_30 = $add1074;
                      var $bits_30 = $bits_30 + 8 | 0;
                    }
                    var $shr1084 = $hold_30 >>> ($conv893 >>> 0);
                    var $len_0 = 0;
                    var $next_35 = $next_34;
                    var $have_35 = $have_34;
                    var $hold_31 = $shr1084 >>> 7;
                    var $bits_31 = -7 - $conv893 + $bits_30 | 0;
                    var $copy_5 = ($shr1084 & 127) + 11 | 0;
                  }
                  var $copy_5;
                  var $bits_31;
                  var $hold_31;
                  var $have_35;
                  var $next_35;
                  var $len_0;
                  if (($127 + $copy_5 | 0) >>> 0 > $add881 >>> 0) {
                    HEAP32[$msg$s2] = STRING_TABLE.__str1024 | 0;
                    HEAP32[$mode$s2] = 29;
                    var $ret_0_be = $ret_1_ph;
                    var $next_0_be = $next_35;
                    var $put_0_be = $put_0;
                    var $have_0_be = $have_35;
                    var $left_0_be = $left_0;
                    var $hold_0_be = $hold_31;
                    var $bits_0_be = $bits_31;
                    var $out_0_be = $out_0;
                    __label__ = 265;
                    break $for_cond_backedge$$while_cond214$$sw_bb260$$sw_bb317$$sw_bb373$$sw_bb433$$sw_bb496$$sw_bb614$$sw_bb728$$while_cond877_preheader$$sw_bb1176$$sw_bb1178$$sw_bb1344$$for_cond1390_preheader$$sw_bb1505$$sw_bb1549$148;
                  }
                  var $copy_6127 = $copy_5;
                  var $138 = $127;
                  while (1) {
                    var $138;
                    var $copy_6127;
                    var $dec1111 = $copy_6127 - 1 | 0;
                    HEAP32[$39$s2] = $138 + 1 | 0;
                    HEAP16[($138 << 1 >> 1) + $40$s1] = $len_0;
                    if (($dec1111 | 0) == 0) {
                      var $next_29 = $next_35;
                      var $have_29 = $have_35;
                      var $hold_25 = $hold_31;
                      var $bits_25 = $bits_31;
                      continue $while_cond877$180;
                    }
                    var $copy_6127 = $dec1111;
                    var $138 = HEAP32[$39$s2];
                  }
                }
              } else {
                if ((HEAP32[$mode$s2] | 0) == 29) {
                  var $ret_0_be = $ret_1_ph;
                  var $next_0_be = $next_29;
                  var $put_0_be = $put_0;
                  var $have_0_be = $have_29;
                  var $left_0_be = $left_0;
                  var $hold_0_be = $hold_25;
                  var $bits_0_be = $bits_25;
                  var $out_0_be = $out_0;
                  __label__ = 265;
                  break $for_cond_backedge$$while_cond214$$sw_bb260$$sw_bb317$$sw_bb373$$sw_bb433$$sw_bb496$$sw_bb614$$sw_bb728$$while_cond877_preheader$$sw_bb1176$$sw_bb1178$$sw_bb1344$$for_cond1390_preheader$$sw_bb1505$$sw_bb1549$148;
                }
                if (HEAP16[$44 >> 1] << 16 >> 16 == 0) {
                  HEAP32[$msg$s2] = STRING_TABLE.__str1125 | 0;
                  HEAP32[$mode$s2] = 29;
                  var $ret_0_be = $ret_1_ph;
                  var $next_0_be = $next_29;
                  var $put_0_be = $put_0;
                  var $have_0_be = $have_29;
                  var $left_0_be = $left_0;
                  var $hold_0_be = $hold_25;
                  var $bits_0_be = $bits_25;
                  var $out_0_be = $out_0;
                  __label__ = 265;
                  break $for_cond_backedge$$while_cond214$$sw_bb260$$sw_bb317$$sw_bb373$$sw_bb433$$sw_bb496$$sw_bb614$$sw_bb728$$while_cond877_preheader$$sw_bb1176$$sw_bb1178$$sw_bb1344$$for_cond1390_preheader$$sw_bb1505$$sw_bb1549$148;
                }
                HEAP32[$42 >> 2] = $arraydecay860_c;
                HEAP32[$43 >> 2] = $arraydecay860_c;
                HEAP32[$25$s2] = 9;
                var $call1149 = _inflate_table(1, $arraydecay864, $128, $41, $25, $arraydecay867);
                if (($call1149 | 0) != 0) {
                  HEAP32[$msg$s2] = STRING_TABLE.__str1226 | 0;
                  HEAP32[$mode$s2] = 29;
                  var $ret_0_be = $call1149;
                  var $next_0_be = $next_29;
                  var $put_0_be = $put_0;
                  var $have_0_be = $have_29;
                  var $left_0_be = $left_0;
                  var $hold_0_be = $hold_25;
                  var $bits_0_be = $bits_25;
                  var $out_0_be = $out_0;
                  __label__ = 265;
                  break $for_cond_backedge$$while_cond214$$sw_bb260$$sw_bb317$$sw_bb373$$sw_bb433$$sw_bb496$$sw_bb614$$sw_bb728$$while_cond877_preheader$$sw_bb1176$$sw_bb1178$$sw_bb1344$$for_cond1390_preheader$$sw_bb1505$$sw_bb1549$148;
                }
                var $_c = HEAP32[$41 >> 2];
                HEAP32[$45 >> 2] = $_c;
                HEAP32[$46 >> 2] = 6;
                var $add_ptr1159 = (HEAP32[$36$s2] << 1) + $arraydecay864 | 0;
                var $142 = HEAP32[$37$s2];
                var $call1165 = _inflate_table(2, $add_ptr1159, $142, $41, $46, $arraydecay867);
                if (($call1165 | 0) == 0) {
                  HEAP32[$mode$s2] = 19;
                  var $ret_2 = 0;
                  var $next_37 = $next_29;
                  var $have_37 = $have_29;
                  var $hold_33 = $hold_25;
                  var $bits_33 = $bits_25;
                  __label__ = 202;
                  break $for_cond_backedge$$while_cond214$$sw_bb260$$sw_bb317$$sw_bb373$$sw_bb433$$sw_bb496$$sw_bb614$$sw_bb728$$while_cond877_preheader$$sw_bb1176$$sw_bb1178$$sw_bb1344$$for_cond1390_preheader$$sw_bb1505$$sw_bb1549$148;
                }
                HEAP32[$msg$s2] = STRING_TABLE.__str1327 | 0;
                HEAP32[$mode$s2] = 29;
                var $ret_0_be = $call1165;
                var $next_0_be = $next_29;
                var $put_0_be = $put_0;
                var $have_0_be = $have_29;
                var $left_0_be = $left_0;
                var $hold_0_be = $hold_25;
                var $bits_0_be = $bits_25;
                var $out_0_be = $out_0;
                __label__ = 265;
                break $for_cond_backedge$$while_cond214$$sw_bb260$$sw_bb317$$sw_bb373$$sw_bb433$$sw_bb496$$sw_bb614$$sw_bb728$$while_cond877_preheader$$sw_bb1176$$sw_bb1178$$sw_bb1344$$for_cond1390_preheader$$sw_bb1505$$sw_bb1549$148;
              }
            }
          }
        } while (0);
        do {
          if (__label__ == 59) {
            var $bits_5;
            var $hold_5;
            var $have_5;
            var $next_5;
            var $70 = HEAPU32[$17$s2];
            var $tobool263 = ($70 & 1024 | 0) == 0;
            do {
              if ($tobool263) {
                var $75 = HEAP32[$18$s2];
                if (($75 | 0) == 0) {
                  var $next_7 = $next_5;
                  var $have_7 = $have_5;
                  var $hold_7 = $hold_5;
                  var $bits_7 = $bits_5;
                  break;
                }
                var $extra = $75 + 16 | 0;
                HEAP32[$extra >> 2] = 0;
                var $next_7 = $next_5;
                var $have_7 = $have_5;
                var $hold_7 = $hold_5;
                var $bits_7 = $bits_5;
              } else {
                var $next_6 = $next_5;
                var $have_6 = $have_5;
                var $hold_6 = $hold_5;
                var $bits_6 = $bits_5;
                while (1) {
                  var $bits_6;
                  var $hold_6;
                  var $have_6;
                  var $next_6;
                  if ($bits_6 >>> 0 >= 16) {
                    break;
                  }
                  if (($have_6 | 0) == 0) {
                    var $ret_8 = $ret_0;
                    var $next_58 = $next_6;
                    var $have_58 = 0;
                    var $hold_54 = $hold_6;
                    var $bits_54 = $bits_6;
                    var $out_4 = $out_0;
                    break $for_cond$12;
                  }
                  var $add279 = ((HEAPU8[$next_6] & 255) << $bits_6) + $hold_6 | 0;
                  var $next_6 = $next_6 + 1 | 0;
                  var $have_6 = $have_6 - 1 | 0;
                  var $hold_6 = $add279;
                  var $bits_6 = $bits_6 + 8 | 0;
                }
                HEAP32[$21$s2] = $hold_6;
                var $72 = HEAP32[$18$s2];
                if (($72 | 0) == 0) {
                  var $73 = $70;
                } else {
                  var $extra_len = $72 + 20 | 0;
                  HEAP32[$extra_len >> 2] = $hold_6;
                  var $73 = HEAP32[$17$s2];
                }
                var $73;
                if (($73 & 512 | 0) == 0) {
                  var $next_7 = $next_6;
                  var $have_7 = $have_6;
                  var $hold_7 = 0;
                  var $bits_7 = 0;
                  break;
                }
                HEAP8[$arrayidx] = $hold_6 & 255;
                HEAP8[$arrayidx40] = $hold_6 >>> 8 & 255;
                var $74 = HEAP32[$16$s2];
                var $call302 = _crc32($74, $arrayidx, 2);
                HEAP32[$16$s2] = $call302;
                var $next_7 = $next_6;
                var $have_7 = $have_6;
                var $hold_7 = 0;
                var $bits_7 = 0;
              }
            } while (0);
            var $bits_7;
            var $hold_7;
            var $have_7;
            var $next_7;
            HEAP32[$mode$s2] = 5;
            var $next_8 = $next_7;
            var $have_8 = $have_7;
            var $hold_8 = $hold_7;
            var $bits_8 = $bits_7;
            __label__ = 70;
            break;
          } else if (__label__ == 202) {
            var $bits_33;
            var $hold_33;
            var $have_37;
            var $next_37;
            var $ret_2;
            HEAP32[$mode$s2] = 20;
            var $ret_3 = $ret_2;
            var $next_38 = $next_37;
            var $have_38 = $have_37;
            var $hold_34 = $hold_33;
            var $bits_34 = $bits_33;
            __label__ = 203;
            break;
          }
        } while (0);
        do {
          if (__label__ == 70) {
            var $bits_8;
            var $hold_8;
            var $have_8;
            var $next_8;
            var $76 = HEAPU32[$17$s2];
            if (($76 & 1024 | 0) == 0) {
              var $next_10 = $next_8;
              var $have_10 = $have_8;
              var $87 = $76;
            } else {
              var $77 = HEAPU32[$21$s2];
              var $copy_0 = $77 >>> 0 > $have_8 >>> 0 ? $have_8 : $77;
              if (($copy_0 | 0) == 0) {
                var $next_9 = $next_8;
                var $have_9 = $have_8;
                var $86 = $77;
                var $85 = $76;
              } else {
                var $78 = HEAPU32[$18$s2], $78$s2 = $78 >> 2;
                var $cmp330 = ($78 | 0) == 0;
                do {
                  if ($cmp330) {
                    var $82 = $76;
                  } else {
                    var $79 = HEAP32[$78$s2 + 4];
                    if (($79 | 0) == 0) {
                      var $82 = $76;
                      break;
                    }
                    var $sub341 = HEAP32[$78$s2 + 5] - $77 | 0;
                    var $add_ptr = $79 + $sub341 | 0;
                    var $81 = HEAPU32[$78$s2 + 6];
                    var $cond351 = ($sub341 + $copy_0 | 0) >>> 0 > $81 >>> 0 ? $81 - $sub341 | 0 : $copy_0;
                    _memcpy($add_ptr, $next_8, $cond351, 1);
                    var $82 = HEAP32[$17$s2];
                  }
                } while (0);
                var $82;
                if (($82 & 512 | 0) != 0) {
                  var $83 = HEAP32[$16$s2];
                  var $call358 = _crc32($83, $next_8, $copy_0);
                  HEAP32[$16$s2] = $call358;
                }
                var $sub361 = $have_8 - $copy_0 | 0;
                var $add_ptr362 = $next_8 + $copy_0 | 0;
                var $sub364 = HEAP32[$21$s2] - $copy_0 | 0;
                HEAP32[$21$s2] = $sub364;
                var $next_9 = $add_ptr362;
                var $have_9 = $sub361;
                var $86 = $sub364;
                var $85 = $82;
              }
              var $85;
              var $86;
              var $have_9;
              var $next_9;
              if (($86 | 0) != 0) {
                var $ret_8 = $ret_0;
                var $next_58 = $next_9;
                var $have_58 = $have_9;
                var $hold_54 = $hold_8;
                var $bits_54 = $bits_8;
                var $out_4 = $out_0;
                break $for_cond$12;
              }
              var $next_10 = $next_9;
              var $have_10 = $have_9;
              var $87 = $85;
            }
            var $87;
            var $have_10;
            var $next_10;
            HEAP32[$21$s2] = 0;
            HEAP32[$mode$s2] = 6;
            var $next_11 = $next_10;
            var $have_11 = $have_10;
            var $hold_9 = $hold_8;
            var $bits_9 = $bits_8;
            var $88 = $87;
            __label__ = 80;
            break;
          } else if (__label__ == 203) {
            var $bits_34;
            var $hold_34;
            var $have_38;
            var $next_38;
            var $ret_3;
            if ($have_38 >>> 0 > 5 & $left_0 >>> 0 > 257) {
              HEAP32[$next_out$s2] = $put_0;
              HEAP32[$avail_out$s2] = $left_0;
              HEAP32[$next_in$s2] = $next_38;
              HEAP32[$avail_in15$s2] = $have_38;
              HEAP32[$11$s2] = $hold_34;
              HEAP32[$13$s2] = $bits_34;
              _inflate_fast($strm, $out_0);
              var $143 = HEAP32[$next_out$s2];
              var $144 = HEAP32[$avail_out$s2];
              var $145 = HEAP32[$next_in$s2];
              var $146 = HEAP32[$avail_in15$s2];
              var $147 = HEAP32[$11$s2];
              var $148 = HEAP32[$13$s2];
              if ((HEAP32[$mode$s2] | 0) != 11) {
                var $ret_0_be = $ret_3;
                var $next_0_be = $145;
                var $put_0_be = $143;
                var $have_0_be = $146;
                var $left_0_be = $144;
                var $hold_0_be = $147;
                var $bits_0_be = $148;
                var $out_0_be = $out_0;
                __label__ = 265;
                break;
              }
              HEAP32[$24$s2] = -1;
              var $ret_0_be = $ret_3;
              var $next_0_be = $145;
              var $put_0_be = $143;
              var $have_0_be = $146;
              var $left_0_be = $144;
              var $hold_0_be = $147;
              var $bits_0_be = $148;
              var $out_0_be = $out_0;
              __label__ = 265;
              break;
            }
            HEAP32[$24$s2] = 0;
            var $sub1213 = (1 << HEAP32[$25$s2]) - 1 | 0;
            var $151 = HEAPU32[$26 >> 2];
            var $next_39 = $next_38;
            var $have_39 = $have_38;
            var $hold_35 = $hold_34;
            var $bits_35 = $bits_34;
            while (1) {
              var $bits_35;
              var $hold_35;
              var $have_39;
              var $next_39;
              var $and1214 = $sub1213 & $hold_35;
              var $tmp22 = HEAPU8[($and1214 << 2) + $151 + 1 | 0];
              var $conv1218 = $tmp22 & 255;
              if ($conv1218 >>> 0 <= $bits_35 >>> 0) {
                break;
              }
              if (($have_39 | 0) == 0) {
                var $ret_8 = $ret_3;
                var $next_58 = $next_39;
                var $have_58 = 0;
                var $hold_54 = $hold_35;
                var $bits_54 = $bits_35;
                var $out_4 = $out_0;
                break $for_cond$12;
              }
              var $add1232 = ((HEAPU8[$next_39] & 255) << $bits_35) + $hold_35 | 0;
              var $next_39 = $next_39 + 1 | 0;
              var $have_39 = $have_39 - 1 | 0;
              var $hold_35 = $add1232;
              var $bits_35 = $bits_35 + 8 | 0;
            }
            var $tmp21 = HEAPU8[($and1214 << 2) + $151 | 0];
            var $tmp23 = HEAPU16[$151 + ($and1214 << 2) + 2 >> 1];
            var $conv1237 = $tmp21 & 255;
            var $tobool1238 = $tmp21 << 24 >> 24 == 0;
            do {
              if ($tobool1238) {
                var $next_41 = $next_39;
                var $have_41 = $have_39;
                var $hold_37 = $hold_35;
                var $bits_37 = $bits_35;
                var $here_09_0 = 0;
                var $here_110_0 = $tmp22;
                var $here_211_0 = $tmp23;
                var $154 = 0;
              } else {
                if (($conv1237 & 240 | 0) != 0) {
                  var $next_41 = $next_39;
                  var $have_41 = $have_39;
                  var $hold_37 = $hold_35;
                  var $bits_37 = $bits_35;
                  var $here_09_0 = $tmp21;
                  var $here_110_0 = $tmp22;
                  var $here_211_0 = $tmp23;
                  var $154 = 0;
                  break;
                }
                var $conv1248 = $tmp23 & 65535;
                var $sub1255 = (1 << $conv1218 + $conv1237) - 1 | 0;
                var $next_40 = $next_39;
                var $have_40 = $have_39;
                var $hold_36 = $hold_35;
                var $bits_36 = $bits_35;
                while (1) {
                  var $bits_36;
                  var $hold_36;
                  var $have_40;
                  var $next_40;
                  var $add1260 = (($hold_36 & $sub1255) >>> ($conv1218 >>> 0)) + $conv1248 | 0;
                  var $tmp19 = HEAPU8[($add1260 << 2) + $151 + 1 | 0];
                  if ((($tmp19 & 255) + $conv1218 | 0) >>> 0 <= $bits_36 >>> 0) {
                    break;
                  }
                  if (($have_40 | 0) == 0) {
                    var $ret_8 = $ret_3;
                    var $next_58 = $next_40;
                    var $have_58 = 0;
                    var $hold_54 = $hold_36;
                    var $bits_54 = $bits_36;
                    var $out_4 = $out_0;
                    break $for_cond$12;
                  }
                  var $add1281 = ((HEAPU8[$next_40] & 255) << $bits_36) + $hold_36 | 0;
                  var $next_40 = $next_40 + 1 | 0;
                  var $have_40 = $have_40 - 1 | 0;
                  var $hold_36 = $add1281;
                  var $bits_36 = $bits_36 + 8 | 0;
                }
                var $tmp20 = HEAP16[$151 + ($add1260 << 2) + 2 >> 1];
                var $tmp18 = HEAP8[($add1260 << 2) + $151 | 0];
                var $shr1289 = $hold_36 >>> ($conv1218 >>> 0);
                var $sub1292 = $bits_36 - $conv1218 | 0;
                HEAP32[$24$s2] = $conv1218;
                var $next_41 = $next_40;
                var $have_41 = $have_40;
                var $hold_37 = $shr1289;
                var $bits_37 = $sub1292;
                var $here_09_0 = $tmp18;
                var $here_110_0 = $tmp19;
                var $here_211_0 = $tmp20;
                var $154 = $conv1218;
              }
            } while (0);
            var $154;
            var $here_211_0;
            var $here_110_0;
            var $here_09_0;
            var $bits_37;
            var $hold_37;
            var $have_41;
            var $next_41;
            var $conv1302 = $here_110_0 & 255;
            var $shr1303 = $hold_37 >>> ($conv1302 >>> 0);
            var $sub1306 = $bits_37 - $conv1302 | 0;
            HEAP32[$24$s2] = $154 + $conv1302 | 0;
            HEAP32[$21$s2] = $here_211_0 & 65535;
            var $conv1317 = $here_09_0 & 255;
            if ($here_09_0 << 24 >> 24 == 0) {
              HEAP32[$mode$s2] = 25;
              var $ret_0_be = $ret_3;
              var $next_0_be = $next_41;
              var $put_0_be = $put_0;
              var $have_0_be = $have_41;
              var $left_0_be = $left_0;
              var $hold_0_be = $shr1303;
              var $bits_0_be = $sub1306;
              var $out_0_be = $out_0;
              __label__ = 265;
              break;
            }
            if (($conv1317 & 32 | 0) != 0) {
              HEAP32[$24$s2] = -1;
              HEAP32[$mode$s2] = 11;
              var $ret_0_be = $ret_3;
              var $next_0_be = $next_41;
              var $put_0_be = $put_0;
              var $have_0_be = $have_41;
              var $left_0_be = $left_0;
              var $hold_0_be = $shr1303;
              var $bits_0_be = $sub1306;
              var $out_0_be = $out_0;
              __label__ = 265;
              break;
            }
            if (($conv1317 & 64 | 0) == 0) {
              var $and1341 = $conv1317 & 15;
              HEAP32[$27$s2] = $and1341;
              HEAP32[$mode$s2] = 21;
              var $ret_4 = $ret_3;
              var $next_42 = $next_41;
              var $have_42 = $have_41;
              var $hold_38 = $shr1303;
              var $bits_38 = $sub1306;
              var $155 = $and1341;
              __label__ = 224;
              break;
            }
            HEAP32[$msg$s2] = STRING_TABLE.__str255 | 0;
            HEAP32[$mode$s2] = 29;
            var $ret_0_be = $ret_3;
            var $next_0_be = $next_41;
            var $put_0_be = $put_0;
            var $have_0_be = $have_41;
            var $left_0_be = $left_0;
            var $hold_0_be = $shr1303;
            var $bits_0_be = $sub1306;
            var $out_0_be = $out_0;
            __label__ = 265;
            break;
          }
        } while (0);
        do {
          if (__label__ == 80) {
            var $88;
            var $bits_9;
            var $hold_9;
            var $have_11;
            var $next_11;
            var $tobool376 = ($88 & 2048 | 0) == 0;
            do {
              if ($tobool376) {
                var $97 = HEAP32[$18$s2];
                if (($97 | 0) == 0) {
                  var $next_12 = $next_11;
                  var $have_12 = $have_11;
                  break;
                }
                var $name428 = $97 + 28 | 0;
                HEAP32[$name428 >> 2] = 0;
                var $next_12 = $next_11;
                var $have_12 = $have_11;
              } else {
                if (($have_11 | 0) == 0) {
                  var $ret_8 = $ret_0;
                  var $next_58 = $next_11;
                  var $have_58 = 0;
                  var $hold_54 = $hold_9;
                  var $bits_54 = $bits_9;
                  var $out_4 = $out_0;
                  break $for_cond$12;
                }
                var $copy_1 = 0;
                while (1) {
                  var $copy_1;
                  var $inc = $copy_1 + 1 | 0;
                  var $89 = HEAP8[$next_11 + $copy_1 | 0];
                  var $90 = HEAP32[$18$s2];
                  var $cmp386 = ($90 | 0) == 0;
                  do {
                    if (!$cmp386) {
                      var $name = $90 + 28 | 0;
                      if ((HEAP32[$name >> 2] | 0) == 0) {
                        break;
                      }
                      var $92 = HEAPU32[$21$s2];
                      if ($92 >>> 0 >= HEAPU32[$90 + 32 >> 2] >>> 0) {
                        break;
                      }
                      HEAP32[$21$s2] = $92 + 1 | 0;
                      HEAP8[HEAP32[$name >> 2] + $92 | 0] = $89;
                    }
                  } while (0);
                  var $tobool405 = $89 << 24 >> 24 != 0;
                  if (!($tobool405 & $inc >>> 0 < $have_11 >>> 0)) {
                    break;
                  }
                  var $copy_1 = $inc;
                }
                if ((HEAP32[$17$s2] & 512 | 0) != 0) {
                  var $96 = HEAP32[$16$s2];
                  var $call414 = _crc32($96, $next_11, $inc);
                  HEAP32[$16$s2] = $call414;
                }
                var $sub417 = $have_11 - $inc | 0;
                var $add_ptr418 = $next_11 + $inc | 0;
                if ($tobool405) {
                  var $ret_8 = $ret_0;
                  var $next_58 = $add_ptr418;
                  var $have_58 = $sub417;
                  var $hold_54 = $hold_9;
                  var $bits_54 = $bits_9;
                  var $out_4 = $out_0;
                  break $for_cond$12;
                }
                var $next_12 = $add_ptr418;
                var $have_12 = $sub417;
              }
            } while (0);
            var $have_12;
            var $next_12;
            HEAP32[$21$s2] = 0;
            HEAP32[$mode$s2] = 7;
            var $next_13 = $next_12;
            var $have_13 = $have_12;
            var $hold_10 = $hold_9;
            var $bits_10 = $bits_9;
            __label__ = 93;
            break;
          } else if (__label__ == 224) {
            var $155;
            var $bits_38;
            var $hold_38;
            var $have_42;
            var $next_42;
            var $ret_4;
            if (($155 | 0) == 0) {
              var $next_44 = $next_42;
              var $have_44 = $have_42;
              var $hold_40 = $hold_38;
              var $bits_40 = $bits_38;
              var $159 = HEAP32[$21$s2];
            } else {
              var $next_43 = $next_42;
              var $have_43 = $have_42;
              var $hold_39 = $hold_38;
              var $bits_39 = $bits_38;
              while (1) {
                var $bits_39;
                var $hold_39;
                var $have_43;
                var $next_43;
                if ($bits_39 >>> 0 >= $155 >>> 0) {
                  break;
                }
                if (($have_43 | 0) == 0) {
                  var $ret_8 = $ret_4;
                  var $next_58 = $next_43;
                  var $have_58 = 0;
                  var $hold_54 = $hold_39;
                  var $bits_54 = $bits_39;
                  var $out_4 = $out_0;
                  break $for_cond$12;
                }
                var $add1363 = ((HEAPU8[$next_43] & 255) << $bits_39) + $hold_39 | 0;
                var $next_43 = $next_43 + 1 | 0;
                var $have_43 = $have_43 - 1 | 0;
                var $hold_39 = $add1363;
                var $bits_39 = $bits_39 + 8 | 0;
              }
              var $add1375 = HEAP32[$21$s2] + ((1 << $155) - 1 & $hold_39) | 0;
              HEAP32[$21$s2] = $add1375;
              var $add1385 = HEAP32[$24$s2] + $155 | 0;
              HEAP32[$24$s2] = $add1385;
              var $next_44 = $next_43;
              var $have_44 = $have_43;
              var $hold_40 = $hold_39 >>> ($155 >>> 0);
              var $bits_40 = $bits_39 - $155 | 0;
              var $159 = $add1375;
            }
            var $159;
            var $bits_40;
            var $hold_40;
            var $have_44;
            var $next_44;
            HEAP32[$28 >> 2] = $159;
            HEAP32[$mode$s2] = 22;
            var $ret_5_ph = $ret_4;
            var $next_45_ph = $next_44;
            var $have_45_ph = $have_44;
            var $hold_41_ph = $hold_40;
            var $bits_41_ph = $bits_40;
            __label__ = 231;
            break;
          }
        } while (0);
        do {
          if (__label__ == 93) {
            var $bits_10;
            var $hold_10;
            var $have_13;
            var $next_13;
            var $tobool436 = (HEAP32[$17$s2] & 4096 | 0) == 0;
            do {
              if ($tobool436) {
                var $107 = HEAP32[$18$s2];
                if (($107 | 0) == 0) {
                  var $next_14 = $next_13;
                  var $have_14 = $have_13;
                  break;
                }
                var $comment492 = $107 + 36 | 0;
                HEAP32[$comment492 >> 2] = 0;
                var $next_14 = $next_13;
                var $have_14 = $have_13;
              } else {
                if (($have_13 | 0) == 0) {
                  var $ret_8 = $ret_0;
                  var $next_58 = $next_13;
                  var $have_58 = 0;
                  var $hold_54 = $hold_10;
                  var $bits_54 = $bits_10;
                  var $out_4 = $out_0;
                  break $for_cond$12;
                }
                var $copy_2 = 0;
                while (1) {
                  var $copy_2;
                  var $inc443 = $copy_2 + 1 | 0;
                  var $99 = HEAP8[$next_13 + $copy_2 | 0];
                  var $100 = HEAP32[$18$s2];
                  var $cmp447 = ($100 | 0) == 0;
                  do {
                    if (!$cmp447) {
                      var $comment = $100 + 36 | 0;
                      if ((HEAP32[$comment >> 2] | 0) == 0) {
                        break;
                      }
                      var $102 = HEAPU32[$21$s2];
                      if ($102 >>> 0 >= HEAPU32[$100 + 40 >> 2] >>> 0) {
                        break;
                      }
                      HEAP32[$21$s2] = $102 + 1 | 0;
                      HEAP8[HEAP32[$comment >> 2] + $102 | 0] = $99;
                    }
                  } while (0);
                  var $tobool467 = $99 << 24 >> 24 != 0;
                  if (!($tobool467 & $inc443 >>> 0 < $have_13 >>> 0)) {
                    break;
                  }
                  var $copy_2 = $inc443;
                }
                if ((HEAP32[$17$s2] & 512 | 0) != 0) {
                  var $106 = HEAP32[$16$s2];
                  var $call478 = _crc32($106, $next_13, $inc443);
                  HEAP32[$16$s2] = $call478;
                }
                var $sub481 = $have_13 - $inc443 | 0;
                var $add_ptr482 = $next_13 + $inc443 | 0;
                if ($tobool467) {
                  var $ret_8 = $ret_0;
                  var $next_58 = $add_ptr482;
                  var $have_58 = $sub481;
                  var $hold_54 = $hold_10;
                  var $bits_54 = $bits_10;
                  var $out_4 = $out_0;
                  break $for_cond$12;
                }
                var $next_14 = $add_ptr482;
                var $have_14 = $sub481;
              }
            } while (0);
            var $have_14;
            var $next_14;
            HEAP32[$mode$s2] = 8;
            var $next_15 = $next_14;
            var $have_15 = $have_14;
            var $hold_11 = $hold_10;
            var $bits_11 = $bits_10;
            __label__ = 106;
            break;
          } else if (__label__ == 231) {
            var $bits_41_ph;
            var $hold_41_ph;
            var $have_45_ph;
            var $next_45_ph;
            var $ret_5_ph;
            var $sub1393 = (1 << HEAP32[$46 >> 2]) - 1 | 0;
            var $161 = HEAPU32[$47 >> 2];
            var $next_45 = $next_45_ph;
            var $have_45 = $have_45_ph;
            var $hold_41 = $hold_41_ph;
            var $bits_41 = $bits_41_ph;
            while (1) {
              var $bits_41;
              var $hold_41;
              var $have_45;
              var $next_45;
              var $and1394 = $sub1393 & $hold_41;
              var $tmp16 = HEAPU8[($and1394 << 2) + $161 + 1 | 0];
              var $conv1398 = $tmp16 & 255;
              if ($conv1398 >>> 0 <= $bits_41 >>> 0) {
                break;
              }
              if (($have_45 | 0) == 0) {
                var $ret_8 = $ret_5_ph;
                var $next_58 = $next_45;
                var $have_58 = 0;
                var $hold_54 = $hold_41;
                var $bits_54 = $bits_41;
                var $out_4 = $out_0;
                break $for_cond$12;
              }
              var $add1412 = ((HEAPU8[$next_45] & 255) << $bits_41) + $hold_41 | 0;
              var $next_45 = $next_45 + 1 | 0;
              var $have_45 = $have_45 - 1 | 0;
              var $hold_41 = $add1412;
              var $bits_41 = $bits_41 + 8 | 0;
            }
            var $tmp15 = HEAPU8[($and1394 << 2) + $161 | 0];
            var $tmp17 = HEAPU16[$161 + ($and1394 << 2) + 2 >> 1];
            var $conv1418 = $tmp15 & 255;
            if (($conv1418 & 240 | 0) == 0) {
              var $conv1425 = $tmp17 & 65535;
              var $sub1432 = (1 << $conv1398 + $conv1418) - 1 | 0;
              var $next_46 = $next_45;
              var $have_46 = $have_45;
              var $hold_42 = $hold_41;
              var $bits_42 = $bits_41;
              while (1) {
                var $bits_42;
                var $hold_42;
                var $have_46;
                var $next_46;
                var $add1437 = (($hold_42 & $sub1432) >>> ($conv1398 >>> 0)) + $conv1425 | 0;
                var $tmp13 = HEAPU8[($add1437 << 2) + $161 + 1 | 0];
                if ((($tmp13 & 255) + $conv1398 | 0) >>> 0 <= $bits_42 >>> 0) {
                  break;
                }
                if (($have_46 | 0) == 0) {
                  var $ret_8 = $ret_5_ph;
                  var $next_58 = $next_46;
                  var $have_58 = 0;
                  var $hold_54 = $hold_42;
                  var $bits_54 = $bits_42;
                  var $out_4 = $out_0;
                  break $for_cond$12;
                }
                var $add1458 = ((HEAPU8[$next_46] & 255) << $bits_42) + $hold_42 | 0;
                var $next_46 = $next_46 + 1 | 0;
                var $have_46 = $have_46 - 1 | 0;
                var $hold_42 = $add1458;
                var $bits_42 = $bits_42 + 8 | 0;
              }
              var $tmp14 = HEAP16[$161 + ($add1437 << 2) + 2 >> 1];
              var $tmp12 = HEAP8[($add1437 << 2) + $161 | 0];
              var $shr1466 = $hold_42 >>> ($conv1398 >>> 0);
              var $sub1469 = $bits_42 - $conv1398 | 0;
              var $add1475 = HEAP32[$24$s2] + $conv1398 | 0;
              HEAP32[$24$s2] = $add1475;
              var $next_47 = $next_46;
              var $have_47 = $have_46;
              var $hold_43 = $shr1466;
              var $bits_43 = $sub1469;
              var $here_09_1 = $tmp12;
              var $here_110_1 = $tmp13;
              var $here_211_1 = $tmp14;
              var $165 = $add1475;
            } else {
              var $next_47 = $next_45;
              var $have_47 = $have_45;
              var $hold_43 = $hold_41;
              var $bits_43 = $bits_41;
              var $here_09_1 = $tmp15;
              var $here_110_1 = $tmp16;
              var $here_211_1 = $tmp17;
              var $165 = HEAP32[$24$s2];
            }
            var $165;
            var $here_211_1;
            var $here_110_1;
            var $here_09_1;
            var $bits_43;
            var $hold_43;
            var $have_47;
            var $next_47;
            var $conv1479 = $here_110_1 & 255;
            var $shr1480 = $hold_43 >>> ($conv1479 >>> 0);
            var $sub1483 = $bits_43 - $conv1479 | 0;
            HEAP32[$24$s2] = $165 + $conv1479 | 0;
            var $conv1491 = $here_09_1 & 255;
            if (($conv1491 & 64 | 0) == 0) {
              HEAP32[$29$s2] = $here_211_1 & 65535;
              var $and1502 = $conv1491 & 15;
              HEAP32[$27$s2] = $and1502;
              HEAP32[$mode$s2] = 23;
              var $ret_6 = $ret_5_ph;
              var $next_48 = $next_47;
              var $have_48 = $have_47;
              var $hold_44 = $shr1480;
              var $bits_44 = $sub1483;
              var $166 = $and1502;
              __label__ = 245;
              break;
            }
            HEAP32[$msg$s2] = STRING_TABLE.__str154 | 0;
            HEAP32[$mode$s2] = 29;
            var $ret_0_be = $ret_5_ph;
            var $next_0_be = $next_47;
            var $put_0_be = $put_0;
            var $have_0_be = $have_47;
            var $left_0_be = $left_0;
            var $hold_0_be = $shr1480;
            var $bits_0_be = $sub1483;
            var $out_0_be = $out_0;
            __label__ = 265;
            break;
          }
        } while (0);
        $for_cond_backedge$$sw_bb496$$sw_bb1505$$sw_bb1549$357 : do {
          if (__label__ == 106) {
            var $bits_11;
            var $hold_11;
            var $have_15;
            var $next_15;
            var $108 = HEAPU32[$17$s2];
            var $tobool499 = ($108 & 512 | 0) == 0;
            do {
              if (!$tobool499) {
                var $next_16 = $next_15;
                var $have_16 = $have_15;
                var $hold_12 = $hold_11;
                var $bits_12 = $bits_11;
                while (1) {
                  var $bits_12;
                  var $hold_12;
                  var $have_16;
                  var $next_16;
                  if ($bits_12 >>> 0 >= 16) {
                    break;
                  }
                  if (($have_16 | 0) == 0) {
                    var $ret_8 = $ret_0;
                    var $next_58 = $next_16;
                    var $have_58 = 0;
                    var $hold_54 = $hold_12;
                    var $bits_54 = $bits_12;
                    var $out_4 = $out_0;
                    break $for_cond$12;
                  }
                  var $add515 = ((HEAPU8[$next_16] & 255) << $bits_12) + $hold_12 | 0;
                  var $next_16 = $next_16 + 1 | 0;
                  var $have_16 = $have_16 - 1 | 0;
                  var $hold_12 = $add515;
                  var $bits_12 = $bits_12 + 8 | 0;
                }
                if (($hold_12 | 0) == (HEAP32[$16$s2] & 65535 | 0)) {
                  var $next_17 = $next_16;
                  var $have_17 = $have_16;
                  var $hold_13 = 0;
                  var $bits_13 = 0;
                  break;
                }
                HEAP32[$msg$s2] = STRING_TABLE.__str519 | 0;
                HEAP32[$mode$s2] = 29;
                var $ret_0_be = $ret_0;
                var $next_0_be = $next_16;
                var $put_0_be = $put_0;
                var $have_0_be = $have_16;
                var $left_0_be = $left_0;
                var $hold_0_be = $hold_12;
                var $bits_0_be = $bits_12;
                var $out_0_be = $out_0;
                __label__ = 265;
                break $for_cond_backedge$$sw_bb496$$sw_bb1505$$sw_bb1549$357;
              }
              var $next_17 = $next_15;
              var $have_17 = $have_15;
              var $hold_13 = $hold_11;
              var $bits_13 = $bits_11;
            } while (0);
            var $bits_13;
            var $hold_13;
            var $have_17;
            var $next_17;
            var $111 = HEAPU32[$18$s2];
            if (($111 | 0) != 0) {
              HEAP32[($111 + 44 | 0) >> 2] = $108 >>> 9 & 1;
              var $done543 = HEAP32[$18$s2] + 48 | 0;
              HEAP32[$done543 >> 2] = 1;
            }
            var $call545 = _crc32(0, 0, 0);
            HEAP32[$16$s2] = $call545;
            HEAP32[$adler$s2] = $call545;
            HEAP32[$mode$s2] = 11;
            var $ret_0_be = $ret_0;
            var $next_0_be = $next_17;
            var $put_0_be = $put_0;
            var $have_0_be = $have_17;
            var $left_0_be = $left_0;
            var $hold_0_be = $hold_13;
            var $bits_0_be = $bits_13;
            var $out_0_be = $out_0;
            __label__ = 265;
            break;
          } else if (__label__ == 245) {
            var $166;
            var $bits_44;
            var $hold_44;
            var $have_48;
            var $next_48;
            var $ret_6;
            if (($166 | 0) == 0) {
              var $next_50 = $next_48;
              var $have_50 = $have_48;
              var $hold_46 = $hold_44;
              var $bits_46 = $bits_44;
            } else {
              var $next_49 = $next_48;
              var $have_49 = $have_48;
              var $hold_45 = $hold_44;
              var $bits_45 = $bits_44;
              while (1) {
                var $bits_45;
                var $hold_45;
                var $have_49;
                var $next_49;
                if ($bits_45 >>> 0 >= $166 >>> 0) {
                  break;
                }
                if (($have_49 | 0) == 0) {
                  var $ret_8 = $ret_6;
                  var $next_58 = $next_49;
                  var $have_58 = 0;
                  var $hold_54 = $hold_45;
                  var $bits_54 = $bits_45;
                  var $out_4 = $out_0;
                  break $for_cond$12;
                }
                var $add1524 = ((HEAPU8[$next_49] & 255) << $bits_45) + $hold_45 | 0;
                var $next_49 = $next_49 + 1 | 0;
                var $have_49 = $have_49 - 1 | 0;
                var $hold_45 = $add1524;
                var $bits_45 = $bits_45 + 8 | 0;
              }
              var $add1536 = HEAP32[$29$s2] + ((1 << $166) - 1 & $hold_45) | 0;
              HEAP32[$29$s2] = $add1536;
              var $add1546 = HEAP32[$24$s2] + $166 | 0;
              HEAP32[$24$s2] = $add1546;
              var $next_50 = $next_49;
              var $have_50 = $have_49;
              var $hold_46 = $hold_45 >>> ($166 >>> 0);
              var $bits_46 = $bits_45 - $166 | 0;
            }
            var $bits_46;
            var $hold_46;
            var $have_50;
            var $next_50;
            HEAP32[$mode$s2] = 24;
            var $ret_7 = $ret_6;
            var $next_51 = $next_50;
            var $have_51 = $have_50;
            var $hold_47 = $hold_46;
            var $bits_47 = $bits_46;
            __label__ = 251;
            break;
          }
        } while (0);
        $for_cond_backedge$$sw_bb1549$378 : do {
          if (__label__ == 251) {
            var $bits_47;
            var $hold_47;
            var $have_51;
            var $next_51;
            var $ret_7;
            if (($left_0 | 0) == 0) {
              var $ret_8 = $ret_7;
              var $next_58 = $next_51;
              var $have_58 = $have_51;
              var $hold_54 = $hold_47;
              var $bits_54 = $bits_47;
              var $out_4 = $out_0;
              break $for_cond$12;
            }
            var $sub1554 = $out_0 - $left_0 | 0;
            var $170 = HEAPU32[$29$s2];
            var $cmp1556 = $170 >>> 0 > $sub1554 >>> 0;
            do {
              if ($cmp1556) {
                var $sub1560 = $170 - $sub1554 | 0;
                var $cmp1561 = $sub1560 >>> 0 > HEAPU32[$30 >> 2] >>> 0;
                do {
                  if ($cmp1561) {
                    if ((HEAP32[$31 >> 2] | 0) == 0) {
                      break;
                    }
                    HEAP32[$msg$s2] = STRING_TABLE.__str53 | 0;
                    HEAP32[$mode$s2] = 29;
                    var $ret_0_be = $ret_7;
                    var $next_0_be = $next_51;
                    var $put_0_be = $put_0;
                    var $have_0_be = $have_51;
                    var $left_0_be = $left_0;
                    var $hold_0_be = $hold_47;
                    var $bits_0_be = $bits_47;
                    var $out_0_be = $out_0;
                    break $for_cond_backedge$$sw_bb1549$378;
                  }
                } while (0);
                var $173 = HEAPU32[$32 >> 2];
                if ($sub1560 >>> 0 > $173 >>> 0) {
                  var $sub1574 = $sub1560 - $173 | 0;
                  var $from_0 = HEAP32[$33 >> 2] + (HEAP32[$34 >> 2] - $sub1574) | 0;
                  var $copy_7 = $sub1574;
                } else {
                  var $from_0 = HEAP32[$33 >> 2] + ($173 - $sub1560) | 0;
                  var $copy_7 = $sub1560;
                }
                var $copy_7;
                var $from_0;
                var $177 = HEAPU32[$21$s2];
                if ($copy_7 >>> 0 <= $177 >>> 0) {
                  var $from_1 = $from_0;
                  var $copy_8 = $copy_7;
                  var $179 = $177;
                  break;
                }
                var $from_1 = $from_0;
                var $copy_8 = $177;
                var $179 = $177;
              } else {
                var $178 = HEAP32[$21$s2];
                var $from_1 = $put_0 + -$170 | 0;
                var $copy_8 = $178;
                var $179 = $178;
              }
            } while (0);
            var $179;
            var $copy_8;
            var $from_1;
            var $copy_9 = $copy_8 >>> 0 > $left_0 >>> 0 ? $left_0 : $copy_8;
            HEAP32[$21$s2] = $179 - $copy_9 | 0;
            var $180 = $copy_8 ^ -1;
            var $181 = $left_0 ^ -1;
            var $umax = $180 >>> 0 > $181 >>> 0 ? $180 : $181;
            var $from_2 = $from_1;
            var $put_1 = $put_0;
            var $copy_10 = $copy_9;
            while (1) {
              var $copy_10;
              var $put_1;
              var $from_2;
              var $183 = HEAP8[$from_2];
              HEAP8[$put_1] = $183;
              var $dec1605 = $copy_10 - 1 | 0;
              if (($dec1605 | 0) == 0) {
                break;
              }
              var $from_2 = $from_2 + 1 | 0;
              var $put_1 = $put_1 + 1 | 0;
              var $copy_10 = $dec1605;
            }
            var $sub1598 = $left_0 - $copy_9 | 0;
            var $scevgep632 = $put_0 + ($umax ^ -1) | 0;
            if ((HEAP32[$21$s2] | 0) != 0) {
              var $ret_0_be = $ret_7;
              var $next_0_be = $next_51;
              var $put_0_be = $scevgep632;
              var $have_0_be = $have_51;
              var $left_0_be = $sub1598;
              var $hold_0_be = $hold_47;
              var $bits_0_be = $bits_47;
              var $out_0_be = $out_0;
              break;
            }
            HEAP32[$mode$s2] = 20;
            var $ret_0_be = $ret_7;
            var $next_0_be = $next_51;
            var $put_0_be = $scevgep632;
            var $have_0_be = $have_51;
            var $left_0_be = $sub1598;
            var $hold_0_be = $hold_47;
            var $bits_0_be = $bits_47;
            var $out_0_be = $out_0;
          }
        } while (0);
        var $out_0_be;
        var $bits_0_be;
        var $hold_0_be;
        var $left_0_be;
        var $have_0_be;
        var $put_0_be;
        var $next_0_be;
        var $ret_0_be;
        var $ret_0 = $ret_0_be;
        var $next_0 = $next_0_be;
        var $put_0 = $put_0_be;
        var $have_0 = $have_0_be;
        var $left_0 = $left_0_be;
        var $hold_0 = $hold_0_be;
        var $bits_0 = $bits_0_be;
        var $out_0 = $out_0_be;
        var $48 = HEAP32[$mode$s2];
      }
      var $out_4;
      var $bits_54;
      var $hold_54;
      var $have_58;
      var $next_58;
      var $ret_8;
      HEAP32[$next_out$s2] = $put_0;
      HEAP32[$avail_out$s2] = $left_0;
      HEAP32[$next_in$s2] = $next_58;
      HEAP32[$avail_in15$s2] = $have_58;
      HEAP32[$11$s2] = $hold_54;
      HEAP32[$13$s2] = $bits_54;
      var $tobool1755 = (HEAP32[$34 >> 2] | 0) == 0;
      do {
        if ($tobool1755) {
          if (HEAPU32[$mode$s2] >>> 0 >= 26) {
            __label__ = 297;
            break;
          }
          if (($out_4 | 0) == (HEAP32[$avail_out$s2] | 0)) {
            __label__ = 297;
            break;
          }
          __label__ = 295;
          break;
        } else {
          __label__ = 295;
        }
      } while (0);
      do {
        if (__label__ == 295) {
          var $call1765 = _updatewindow($strm, $out_4);
          if (($call1765 | 0) == 0) {
            break;
          }
          HEAP32[$mode$s2] = 30;
          var $retval_0 = -4;
          break $return$$lor_lhs_false$2;
        }
      } while (0);
      var $201 = HEAPU32[$avail_in15$s2];
      var $202 = HEAPU32[$avail_out$s2];
      var $sub1774 = $out_4 - $202 | 0;
      var $total_in = $strm + 8 | 0;
      var $add1775 = $10 - $201 + HEAP32[$total_in >> 2] | 0;
      HEAP32[$total_in >> 2] = $add1775;
      var $add1777 = HEAP32[$total_out$s2] + $sub1774 | 0;
      HEAP32[$total_out$s2] = $add1777;
      var $add1779 = HEAP32[$35$s2] + $sub1774 | 0;
      HEAP32[$35$s2] = $add1779;
      var $tobool1783 = ($out_4 | 0) == ($202 | 0);
      if (!((HEAP32[$15$s2] | 0) == 0 | $tobool1783)) {
        var $208 = HEAP32[$16$s2];
        var $add_ptr1791 = HEAP32[$next_out$s2] + -$sub1774 | 0;
        if ((HEAP32[$17$s2] | 0) == 0) {
          var $call1798 = _adler32($208, $add_ptr1791, $sub1774);
          var $cond1800 = $call1798;
        } else {
          var $call1792 = _crc32($208, $add_ptr1791, $sub1774);
          var $cond1800 = $call1792;
        }
        var $cond1800;
        HEAP32[$16$s2] = $cond1800;
        HEAP32[$adler$s2] = $cond1800;
      }
      var $cond1807 = (HEAP32[$23$s2] | 0) != 0 ? 64 : 0;
      var $212 = HEAP32[$mode$s2];
      var $cond1812 = ($212 | 0) == 11 ? 128 : 0;
      if (($212 | 0) == 19) {
        var $213 = 256;
      } else {
        var $phitmp = ($212 | 0) == 14 ? 256 : 0;
        var $213 = $phitmp;
      }
      var $213;
      var $add1821 = $cond1807 + HEAP32[$13$s2] + $cond1812 + $213 | 0;
      HEAP32[$strm + 44 >> 2] = $add1821;
      var $ret_9 = ($10 | 0) == ($201 | 0) & $tobool1783 & ($ret_8 | 0) == 0 ? -5 : $ret_8;
      var $retval_0 = $ret_9;
    }
  } while (0);
  var $retval_0;
  STACKTOP = __stackBase__;
  return $retval_0;
  return null;
}

_inflate["X"] = 1;

function _fixedtables($state) {
  HEAP32[$state + 76 >> 2] = _fixedtables_lenfix | 0;
  HEAP32[$state + 84 >> 2] = 9;
  HEAP32[$state + 80 >> 2] = _fixedtables_distfix | 0;
  HEAP32[$state + 88 >> 2] = 5;
  return;
  return;
}

function _init_block($s) {
  var $n_03 = 0;
  while (1) {
    var $n_03;
    HEAP16[$s + ($n_03 << 2) + 148 >> 1] = 0;
    var $inc = $n_03 + 1 | 0;
    if (($inc | 0) == 286) {
      break;
    }
    var $n_03 = $inc;
  }
  HEAP16[$s + 2440 >> 1] = 0;
  HEAP16[$s + 2444 >> 1] = 0;
  HEAP16[$s + 2448 >> 1] = 0;
  HEAP16[$s + 2452 >> 1] = 0;
  HEAP16[$s + 2456 >> 1] = 0;
  HEAP16[$s + 2460 >> 1] = 0;
  HEAP16[$s + 2464 >> 1] = 0;
  HEAP16[$s + 2468 >> 1] = 0;
  HEAP16[$s + 2472 >> 1] = 0;
  HEAP16[$s + 2476 >> 1] = 0;
  HEAP16[$s + 2480 >> 1] = 0;
  HEAP16[$s + 2484 >> 1] = 0;
  HEAP16[$s + 2488 >> 1] = 0;
  HEAP16[$s + 2492 >> 1] = 0;
  HEAP16[$s + 2496 >> 1] = 0;
  HEAP16[$s + 2500 >> 1] = 0;
  HEAP16[$s + 2504 >> 1] = 0;
  HEAP16[$s + 2508 >> 1] = 0;
  HEAP16[$s + 2512 >> 1] = 0;
  HEAP16[$s + 2516 >> 1] = 0;
  HEAP16[$s + 2520 >> 1] = 0;
  HEAP16[$s + 2524 >> 1] = 0;
  HEAP16[$s + 2528 >> 1] = 0;
  HEAP16[$s + 2532 >> 1] = 0;
  HEAP16[$s + 2536 >> 1] = 0;
  HEAP16[$s + 2540 >> 1] = 0;
  HEAP16[$s + 2544 >> 1] = 0;
  HEAP16[$s + 2548 >> 1] = 0;
  HEAP16[$s + 2552 >> 1] = 0;
  HEAP16[$s + 2556 >> 1] = 0;
  HEAP16[$s + 2684 >> 1] = 0;
  HEAP16[$s + 2688 >> 1] = 0;
  HEAP16[$s + 2692 >> 1] = 0;
  HEAP16[$s + 2696 >> 1] = 0;
  HEAP16[$s + 2700 >> 1] = 0;
  HEAP16[$s + 2704 >> 1] = 0;
  HEAP16[$s + 2708 >> 1] = 0;
  HEAP16[$s + 2712 >> 1] = 0;
  HEAP16[$s + 2716 >> 1] = 0;
  HEAP16[$s + 2720 >> 1] = 0;
  HEAP16[$s + 2724 >> 1] = 0;
  HEAP16[$s + 2728 >> 1] = 0;
  HEAP16[$s + 2732 >> 1] = 0;
  HEAP16[$s + 2736 >> 1] = 0;
  HEAP16[$s + 2740 >> 1] = 0;
  HEAP16[$s + 2744 >> 1] = 0;
  HEAP16[$s + 2748 >> 1] = 0;
  HEAP16[$s + 2752 >> 1] = 0;
  HEAP16[$s + 2756 >> 1] = 0;
  HEAP16[$s + 1172 >> 1] = 1;
  HEAP32[$s + 5804 >> 2] = 0;
  HEAP32[$s + 5800 >> 2] = 0;
  HEAP32[$s + 5808 >> 2] = 0;
  HEAP32[$s + 5792 >> 2] = 0;
  return;
  return;
}

_init_block["X"] = 1;

function _bi_flush($s) {
  var $bi_buf15$s1;
  var $pending$s2;
  var $bi_buf$s1;
  var $bi_valid$s2;
  var $bi_valid$s2 = ($s + 5820 | 0) >> 2;
  var $0 = HEAPU32[$bi_valid$s2];
  var $cmp = ($0 | 0) == 16;
  do {
    if ($cmp) {
      var $bi_buf$s1 = ($s + 5816 | 0) >> 1;
      var $conv1 = HEAP16[$bi_buf$s1] & 255;
      var $pending$s2 = ($s + 20 | 0) >> 2;
      var $2 = HEAP32[$pending$s2];
      var $inc = $2 + 1 | 0;
      HEAP32[$pending$s2] = $inc;
      var $pending_buf = $s + 8 | 0;
      HEAP8[HEAP32[$pending_buf >> 2] + $2 | 0] = $conv1;
      var $conv4 = (HEAPU16[$bi_buf$s1] & 65535) >>> 8 & 255;
      var $5 = HEAPU32[$pending$s2];
      HEAP32[$pending$s2] = $5 + 1 | 0;
      HEAP8[HEAP32[$pending_buf >> 2] + $5 | 0] = $conv4;
      HEAP16[$bi_buf$s1] = 0;
      HEAP32[$bi_valid$s2] = 0;
    } else {
      if (($0 | 0) <= 7) {
        break;
      }
      var $bi_buf15$s1 = ($s + 5816 | 0) >> 1;
      var $conv16 = HEAP16[$bi_buf15$s1] & 255;
      var $pending17 = $s + 20 | 0;
      var $8 = HEAP32[$pending17 >> 2];
      var $inc18 = $8 + 1 | 0;
      HEAP32[$pending17 >> 2] = $inc18;
      HEAP8[HEAP32[$s + 8 >> 2] + $8 | 0] = $conv16;
      HEAP16[$bi_buf15$s1] = (HEAPU16[$bi_buf15$s1] & 65535) >>> 8;
      var $sub = HEAP32[$bi_valid$s2] - 8 | 0;
      HEAP32[$bi_valid$s2] = $sub;
    }
  } while (0);
  return;
  return;
}

function _detect_data_type($s) {
  var $s$s1 = $s >> 1;
  var __label__;
  var $n_0 = 0;
  var $black_mask_0 = -201342849;
  while (1) {
    var $black_mask_0;
    var $n_0;
    if (($n_0 | 0) >= 32) {
      __label__ = 5;
      break;
    }
    if (($black_mask_0 & 1 | 0) != 0) {
      if (HEAP16[(($n_0 << 2) + 148 >> 1) + $s$s1] << 16 >> 16 != 0) {
        var $retval_0 = 0;
        __label__ = 11;
        break;
      }
    }
    var $n_0 = $n_0 + 1 | 0;
    var $black_mask_0 = $black_mask_0 >>> 1;
  }
  $for_end$$return$105 : do {
    if (__label__ == 5) {
      if (HEAP16[$s$s1 + 92] << 16 >> 16 != 0) {
        var $retval_0 = 1;
        break;
      }
      if (HEAP16[$s$s1 + 94] << 16 >> 16 != 0) {
        var $retval_0 = 1;
        break;
      }
      if (HEAP16[$s$s1 + 100] << 16 >> 16 != 0) {
        var $retval_0 = 1;
        break;
      }
      var $n_1 = 32;
      while (1) {
        var $n_1;
        if (($n_1 | 0) >= 256) {
          var $retval_0 = 0;
          break $for_end$$return$105;
        }
        if (HEAP16[(($n_1 << 2) + 148 >> 1) + $s$s1] << 16 >> 16 != 0) {
          var $retval_0 = 1;
          break $for_end$$return$105;
        }
        var $n_1 = $n_1 + 1 | 0;
      }
    }
  } while (0);
  var $retval_0;
  return $retval_0;
  return null;
}

function _updatewindow($strm, $out) {
  var $21$s2;
  var $9$s2;
  var $0$s2;
  var $strm$s2 = $strm >> 2;
  var __label__;
  var $0 = HEAPU32[$strm$s2 + 7], $0$s2 = $0 >> 2;
  var $window = $0 + 52 | 0;
  var $1 = $window;
  var $2 = HEAP32[$1 >> 2];
  var $cmp = ($2 | 0) == 0;
  do {
    if ($cmp) {
      var $3 = HEAP32[$strm$s2 + 8];
      var $4 = HEAP32[$strm$s2 + 10];
      var $shl = 1 << HEAP32[$0$s2 + 9];
      var $call = FUNCTION_TABLE[$3]($4, $shl, 1);
      var $call_c = $call;
      HEAP32[$window >> 2] = $call_c;
      if (($call | 0) == 0) {
        var $retval_0 = 1;
        __label__ = 12;
        break;
      }
      var $8 = $call;
      __label__ = 2;
      break;
    } else {
      var $8 = $2;
      __label__ = 2;
    }
  } while (0);
  do {
    if (__label__ == 2) {
      var $8;
      var $9$s2 = ($0 + 40 | 0) >> 2;
      var $10 = HEAP32[$9$s2];
      if (($10 | 0) == 0) {
        var $shl10 = 1 << HEAP32[$0$s2 + 9];
        HEAP32[$9$s2] = $shl10;
        HEAP32[$0$s2 + 12] = 0;
        HEAP32[$0$s2 + 11] = 0;
        var $15 = $shl10;
      } else {
        var $15 = $10;
      }
      var $15;
      var $sub = $out - HEAP32[$strm$s2 + 4] | 0;
      if ($sub >>> 0 < $15 >>> 0) {
        var $21$s2 = ($0 + 48 | 0) >> 2;
        var $22 = HEAPU32[$21$s2];
        var $sub24 = $15 - $22 | 0;
        var $dist_0 = $sub24 >>> 0 > $sub >>> 0 ? $sub : $sub24;
        var $add_ptr30 = $8 + $22 | 0;
        var $next_out31 = $strm + 12 | 0;
        var $add_ptr33 = HEAP32[$next_out31 >> 2] + -$sub | 0;
        _memcpy($add_ptr30, $add_ptr33, $dist_0, 1);
        var $sub34 = $sub - $dist_0 | 0;
        if (($sub | 0) == ($dist_0 | 0)) {
          var $add = HEAP32[$21$s2] + $dist_0 | 0;
          HEAP32[$21$s2] = $add;
          var $29 = HEAPU32[$9$s2];
          if (($add | 0) == ($29 | 0)) {
            HEAP32[$21$s2] = 0;
          }
          var $30 = $0 + 44 | 0;
          var $31 = HEAPU32[$30 >> 2];
          if ($31 >>> 0 >= $29 >>> 0) {
            var $retval_0 = 0;
            break;
          }
          var $add56 = $31 + $dist_0 | 0;
          HEAP32[$30 >> 2] = $add56;
          var $retval_0 = 0;
        } else {
          var $24 = HEAP32[$1 >> 2];
          var $add_ptr39 = HEAP32[$next_out31 >> 2] + -$sub34 | 0;
          _memcpy($24, $add_ptr39, $sub34, 1);
          HEAP32[$21$s2] = $sub34;
          var $26 = HEAP32[$9$s2];
          HEAP32[$0$s2 + 11] = $26;
          var $retval_0 = 0;
        }
      } else {
        var $add_ptr = HEAP32[$strm$s2 + 3] + -$15 | 0;
        _memcpy($8, $add_ptr, $15, 1);
        HEAP32[$0$s2 + 12] = 0;
        var $19 = HEAP32[$9$s2];
        HEAP32[$0$s2 + 11] = $19;
        var $retval_0 = 0;
      }
    }
  } while (0);
  var $retval_0;
  return $retval_0;
  return null;
}

_updatewindow["X"] = 1;

function _inflateEnd($strm) {
  var $state1$s2;
  var $cmp = ($strm | 0) == 0;
  do {
    if (!$cmp) {
      var $state1$s2 = ($strm + 28 | 0) >> 2;
      var $0 = HEAP32[$state1$s2];
      if (($0 | 0) == 0) {
        break;
      }
      var $zfree = $strm + 36 | 0;
      var $1 = HEAP32[$zfree >> 2];
      if (($1 | 0) == 0) {
        break;
      }
      var $3 = HEAP32[$0 + 52 >> 2];
      var $opaque12_pre = $strm + 40 | 0;
      if (($3 | 0) == 0) {
        var $6 = $1;
        var $5 = $0;
      } else {
        var $4 = HEAP32[$opaque12_pre >> 2];
        FUNCTION_TABLE[$1]($4, $3);
        var $6 = HEAP32[$zfree >> 2];
        var $5 = HEAP32[$state1$s2];
      }
      var $5;
      var $6;
      var $7 = HEAP32[$opaque12_pre >> 2];
      FUNCTION_TABLE[$6]($7, $5);
      HEAP32[$state1$s2] = 0;
    }
  } while (0);
  return;
  return;
}

function __tr_init($s) {
  HEAP32[$s + 2840 >> 2] = $s + 148 | 0;
  HEAP32[$s + 2848 >> 2] = _static_l_desc;
  HEAP32[$s + 2852 >> 2] = $s + 2440 | 0;
  HEAP32[$s + 2860 >> 2] = _static_d_desc;
  HEAP32[$s + 2864 >> 2] = $s + 2684 | 0;
  HEAP32[$s + 2872 >> 2] = _static_bl_desc;
  HEAP16[$s + 5816 >> 1] = 0;
  HEAP32[$s + 5820 >> 2] = 0;
  HEAP32[$s + 5812 >> 2] = 8;
  _init_block($s);
  return;
  return;
}

function __tr_stored_block($s, $buf, $stored_len, $last) {
  var $pending$s2;
  var $bi_buf$s1;
  var $bi_valid$s2;
  var $bi_valid$s2 = ($s + 5820 | 0) >> 2;
  var $0 = HEAPU32[$bi_valid$s2];
  var $cmp = ($0 | 0) > 13;
  var $conv1 = $last & 65535;
  var $bi_buf$s1 = ($s + 5816 | 0) >> 1;
  var $or = HEAPU16[$bi_buf$s1] & 65535 | $conv1 << $0;
  HEAP16[$bi_buf$s1] = $or & 65535;
  if ($cmp) {
    var $conv7 = $or & 255;
    var $pending$s2 = ($s + 20 | 0) >> 2;
    var $2 = HEAP32[$pending$s2];
    var $inc = $2 + 1 | 0;
    HEAP32[$pending$s2] = $inc;
    var $pending_buf = $s + 8 | 0;
    HEAP8[HEAP32[$pending_buf >> 2] + $2 | 0] = $conv7;
    var $conv10 = (HEAPU16[$bi_buf$s1] & 65535) >>> 8 & 255;
    var $5 = HEAPU32[$pending$s2];
    HEAP32[$pending$s2] = $5 + 1 | 0;
    HEAP8[HEAP32[$pending_buf >> 2] + $5 | 0] = $conv10;
    var $7 = HEAPU32[$bi_valid$s2];
    HEAP16[$bi_buf$s1] = $conv1 >>> ((16 - $7 | 0) >>> 0) & 65535;
    var $storemerge = $7 - 13 | 0;
  } else {
    var $storemerge = $0 + 3 | 0;
  }
  var $storemerge;
  HEAP32[$bi_valid$s2] = $storemerge;
  _copy_block($s, $buf, $stored_len);
  return;
  return;
}

function _copy_block($s, $buf, $len) {
  var $pending_buf$s2;
  var $pending$s2;
  _bi_windup($s);
  HEAP32[$s + 5812 >> 2] = 8;
  var $conv2 = $len & 255;
  var $pending$s2 = ($s + 20 | 0) >> 2;
  var $0 = HEAP32[$pending$s2];
  var $inc = $0 + 1 | 0;
  HEAP32[$pending$s2] = $inc;
  var $pending_buf$s2 = ($s + 8 | 0) >> 2;
  HEAP8[HEAP32[$pending_buf$s2] + $0 | 0] = $conv2;
  var $conv5 = $len >>> 8 & 255;
  var $2 = HEAPU32[$pending$s2];
  HEAP32[$pending$s2] = $2 + 1 | 0;
  HEAP8[HEAP32[$pending_buf$s2] + $2 | 0] = $conv5;
  var $conv11 = $len & 65535 ^ 65535;
  var $conv13 = $conv11 & 255;
  var $4 = HEAP32[$pending$s2];
  var $inc15 = $4 + 1 | 0;
  HEAP32[$pending$s2] = $inc15;
  HEAP8[HEAP32[$pending_buf$s2] + $4 | 0] = $conv13;
  var $conv22 = $conv11 >>> 8 & 255;
  var $6 = HEAPU32[$pending$s2];
  HEAP32[$pending$s2] = $6 + 1 | 0;
  HEAP8[HEAP32[$pending_buf$s2] + $6 | 0] = $conv22;
  var $tobool273 = ($len | 0) == 0;
  $while_end$$while_body$41 : do {
    if (!$tobool273) {
      var $buf_addr_04 = $buf;
      var $len_addr_05 = $len;
      while (1) {
        var $len_addr_05;
        var $buf_addr_04;
        var $dec = $len_addr_05 - 1 | 0;
        var $8 = HEAP8[$buf_addr_04];
        var $9 = HEAP32[$pending$s2];
        var $inc29 = $9 + 1 | 0;
        HEAP32[$pending$s2] = $inc29;
        HEAP8[HEAP32[$pending_buf$s2] + $9 | 0] = $8;
        if (($dec | 0) == 0) {
          break $while_end$$while_body$41;
        }
        var $buf_addr_04 = $buf_addr_04 + 1 | 0;
        var $len_addr_05 = $dec;
      }
    }
  } while (0);
  return;
  return;
}

_copy_block["X"] = 1;

function __tr_align($s) {
  var $pending165$s2;
  var $pending112$s2;
  var $pending53$s2;
  var $pending$s2;
  var $bi_buf$s1;
  var $bi_valid$s2;
  var $bi_valid$s2 = ($s + 5820 | 0) >> 2;
  var $0 = HEAPU32[$bi_valid$s2];
  var $cmp = ($0 | 0) > 13;
  var $bi_buf$s1 = ($s + 5816 | 0) >> 1;
  var $or = HEAPU16[$bi_buf$s1] & 65535 | 2 << $0;
  var $conv4 = $or & 65535;
  HEAP16[$bi_buf$s1] = $conv4;
  if ($cmp) {
    var $conv7 = $or & 255;
    var $pending$s2 = ($s + 20 | 0) >> 2;
    var $2 = HEAP32[$pending$s2];
    var $inc = $2 + 1 | 0;
    HEAP32[$pending$s2] = $inc;
    var $pending_buf = $s + 8 | 0;
    HEAP8[HEAP32[$pending_buf >> 2] + $2 | 0] = $conv7;
    var $conv10 = (HEAPU16[$bi_buf$s1] & 65535) >>> 8 & 255;
    var $5 = HEAPU32[$pending$s2];
    HEAP32[$pending$s2] = $5 + 1 | 0;
    HEAP8[HEAP32[$pending_buf >> 2] + $5 | 0] = $conv10;
    var $7 = HEAPU32[$bi_valid$s2];
    var $conv20 = 2 >>> ((16 - $7 | 0) >>> 0) & 65535;
    HEAP16[$bi_buf$s1] = $conv20;
    var $storemerge = $7 - 13 | 0;
    var $8 = $conv20;
  } else {
    var $storemerge = $0 + 3 | 0;
    var $8 = $conv4;
  }
  var $8;
  var $storemerge;
  HEAP32[$bi_valid$s2] = $storemerge;
  if (($storemerge | 0) > 9) {
    var $pending53$s2 = ($s + 20 | 0) >> 2;
    var $9 = HEAP32[$pending53$s2];
    var $inc54 = $9 + 1 | 0;
    HEAP32[$pending53$s2] = $inc54;
    var $pending_buf55 = $s + 8 | 0;
    HEAP8[HEAP32[$pending_buf55 >> 2] + $9 | 0] = $8 & 255;
    var $conv60 = (HEAPU16[$bi_buf$s1] & 65535) >>> 8 & 255;
    var $12 = HEAPU32[$pending53$s2];
    HEAP32[$pending53$s2] = $12 + 1 | 0;
    HEAP8[HEAP32[$pending_buf55 >> 2] + $12 | 0] = $conv60;
    HEAP16[$bi_buf$s1] = 0;
    var $storemerge1 = HEAP32[$bi_valid$s2] - 9 | 0;
  } else {
    var $storemerge1 = $storemerge + 7 | 0;
  }
  var $storemerge1;
  HEAP32[$bi_valid$s2] = $storemerge1;
  _bi_flush($s);
  var $last_eob_len = $s + 5812 | 0;
  var $16 = HEAPU32[$bi_valid$s2];
  if ((HEAP32[$last_eob_len >> 2] + 11 - $16 | 0) < 9) {
    var $cmp96 = ($16 | 0) > 13;
    var $or106 = HEAPU16[$bi_buf$s1] & 65535 | 2 << $16;
    var $conv107 = $or106 & 65535;
    HEAP16[$bi_buf$s1] = $conv107;
    if ($cmp96) {
      var $conv111 = $or106 & 255;
      var $pending112$s2 = ($s + 20 | 0) >> 2;
      var $18 = HEAP32[$pending112$s2];
      var $inc113 = $18 + 1 | 0;
      HEAP32[$pending112$s2] = $inc113;
      var $pending_buf114 = $s + 8 | 0;
      HEAP8[HEAP32[$pending_buf114 >> 2] + $18 | 0] = $conv111;
      var $conv119 = (HEAPU16[$bi_buf$s1] & 65535) >>> 8 & 255;
      var $21 = HEAPU32[$pending112$s2];
      HEAP32[$pending112$s2] = $21 + 1 | 0;
      HEAP8[HEAP32[$pending_buf114 >> 2] + $21 | 0] = $conv119;
      var $23 = HEAPU32[$bi_valid$s2];
      var $conv129 = 2 >>> ((16 - $23 | 0) >>> 0) & 65535;
      HEAP16[$bi_buf$s1] = $conv129;
      var $storemerge2 = $23 - 13 | 0;
      var $24 = $conv129;
    } else {
      var $storemerge2 = $16 + 3 | 0;
      var $24 = $conv107;
    }
    var $24;
    var $storemerge2;
    HEAP32[$bi_valid$s2] = $storemerge2;
    if (($storemerge2 | 0) > 9) {
      var $pending165$s2 = ($s + 20 | 0) >> 2;
      var $25 = HEAP32[$pending165$s2];
      var $inc166 = $25 + 1 | 0;
      HEAP32[$pending165$s2] = $inc166;
      var $pending_buf167 = $s + 8 | 0;
      HEAP8[HEAP32[$pending_buf167 >> 2] + $25 | 0] = $24 & 255;
      var $conv172 = (HEAPU16[$bi_buf$s1] & 65535) >>> 8 & 255;
      var $28 = HEAPU32[$pending165$s2];
      HEAP32[$pending165$s2] = $28 + 1 | 0;
      HEAP8[HEAP32[$pending_buf167 >> 2] + $28 | 0] = $conv172;
      HEAP16[$bi_buf$s1] = 0;
      var $storemerge3 = HEAP32[$bi_valid$s2] - 9 | 0;
    } else {
      var $storemerge3 = $storemerge2 + 7 | 0;
    }
    var $storemerge3;
    HEAP32[$bi_valid$s2] = $storemerge3;
    _bi_flush($s);
  }
  HEAP32[$last_eob_len >> 2] = 7;
  return;
  return;
}

__tr_align["X"] = 1;

function __tr_flush_block($s, $buf, $stored_len, $last) {
  var $pending85$s2;
  var $bi_buf77$s1;
  var $pending$s2;
  var $bi_buf$s1;
  var $bi_valid$s2;
  var $s$s2 = $s >> 2;
  var $cmp = (HEAP32[$s$s2 + 33] | 0) > 0;
  do {
    if ($cmp) {
      var $data_type = HEAP32[$s$s2] + 44 | 0;
      if ((HEAP32[$data_type >> 2] | 0) == 2) {
        var $call = _detect_data_type($s);
        HEAP32[$data_type >> 2] = $call;
      }
      var $l_desc = $s + 2840 | 0;
      _build_tree($s, $l_desc);
      var $d_desc = $s + 2852 | 0;
      _build_tree($s, $d_desc);
      var $call5 = _build_bl_tree($s);
      var $shr = (HEAP32[$s$s2 + 1450] + 10 | 0) >>> 3;
      var $shr9 = (HEAP32[$s$s2 + 1451] + 10 | 0) >>> 3;
      if ($shr9 >>> 0 > $shr >>> 0) {
        var $max_blindex_0 = $call5;
        var $static_lenb_0 = $shr9;
        var $opt_lenb_0 = $shr;
        break;
      }
      var $max_blindex_0 = $call5;
      var $static_lenb_0 = $shr9;
      var $opt_lenb_0 = $shr9;
    } else {
      var $add13 = $stored_len + 5 | 0;
      var $max_blindex_0 = 0;
      var $static_lenb_0 = $add13;
      var $opt_lenb_0 = $add13;
    }
  } while (0);
  var $opt_lenb_0;
  var $static_lenb_0;
  var $max_blindex_0;
  if (($stored_len + 4 | 0) >>> 0 > $opt_lenb_0 >>> 0 | ($buf | 0) == 0) {
    var $bi_valid$s2 = ($s + 5820 | 0) >> 2;
    var $6 = HEAPU32[$bi_valid$s2];
    var $cmp23 = ($6 | 0) > 13;
    if ((HEAP32[$s$s2 + 34] | 0) == 4 | ($static_lenb_0 | 0) == ($opt_lenb_0 | 0)) {
      var $conv26 = $last + 2 & 65535;
      var $bi_buf$s1 = ($s + 5816 | 0) >> 1;
      var $or = HEAPU16[$bi_buf$s1] & 65535 | $conv26 << $6;
      HEAP16[$bi_buf$s1] = $or & 65535;
      if ($cmp23) {
        var $conv32 = $or & 255;
        var $pending$s2 = ($s + 20 | 0) >> 2;
        var $8 = HEAP32[$pending$s2];
        var $inc = $8 + 1 | 0;
        HEAP32[$pending$s2] = $inc;
        var $pending_buf = $s + 8 | 0;
        HEAP8[HEAP32[$pending_buf >> 2] + $8 | 0] = $conv32;
        var $conv36 = (HEAPU16[$bi_buf$s1] & 65535) >>> 8 & 255;
        var $11 = HEAPU32[$pending$s2];
        HEAP32[$pending$s2] = $11 + 1 | 0;
        HEAP8[HEAP32[$pending_buf >> 2] + $11 | 0] = $conv36;
        var $13 = HEAPU32[$bi_valid$s2];
        HEAP16[$bi_buf$s1] = $conv26 >>> ((16 - $13 | 0) >>> 0) & 65535;
        var $storemerge2 = $13 - 13 | 0;
      } else {
        var $storemerge2 = $6 + 3 | 0;
      }
      var $storemerge2;
      HEAP32[$bi_valid$s2] = $storemerge2;
      _compress_block($s, _static_ltree | 0, _static_dtree | 0);
    } else {
      var $conv74 = $last + 4 & 65535;
      var $bi_buf77$s1 = ($s + 5816 | 0) >> 1;
      var $or79 = HEAPU16[$bi_buf77$s1] & 65535 | $conv74 << $6;
      HEAP16[$bi_buf77$s1] = $or79 & 65535;
      if ($cmp23) {
        var $conv84 = $or79 & 255;
        var $pending85$s2 = ($s + 20 | 0) >> 2;
        var $15 = HEAP32[$pending85$s2];
        var $inc86 = $15 + 1 | 0;
        HEAP32[$pending85$s2] = $inc86;
        var $pending_buf87 = $s + 8 | 0;
        HEAP8[HEAP32[$pending_buf87 >> 2] + $15 | 0] = $conv84;
        var $conv92 = (HEAPU16[$bi_buf77$s1] & 65535) >>> 8 & 255;
        var $18 = HEAPU32[$pending85$s2];
        HEAP32[$pending85$s2] = $18 + 1 | 0;
        HEAP8[HEAP32[$pending_buf87 >> 2] + $18 | 0] = $conv92;
        var $20 = HEAPU32[$bi_valid$s2];
        HEAP16[$bi_buf77$s1] = $conv74 >>> ((16 - $20 | 0) >>> 0) & 65535;
        var $storemerge = $20 - 13 | 0;
      } else {
        var $storemerge = $6 + 3 | 0;
      }
      var $storemerge;
      HEAP32[$bi_valid$s2] = $storemerge;
      var $add121 = HEAP32[$s$s2 + 711] + 1 | 0;
      var $add124 = HEAP32[$s$s2 + 714] + 1 | 0;
      _send_all_trees($s, $add121, $add124, $max_blindex_0 + 1 | 0);
      var $arraydecay = $s + 148 | 0;
      var $arraydecay126 = $s + 2440 | 0;
      _compress_block($s, $arraydecay, $arraydecay126);
    }
  } else {
    __tr_stored_block($s, $buf, $stored_len, $last);
  }
  _init_block($s);
  if (($last | 0) != 0) {
    _bi_windup($s);
  }
  return;
  return;
}

__tr_flush_block["X"] = 1;

function _compress_block($s, $ltree, $dtree) {
  var $pending348$s2;
  var $bi_buf340$s1;
  var $pending_buf$s2;
  var $pending$s2;
  var $bi_buf$s1;
  var $bi_valid$s2;
  var $ltree$s1 = $ltree >> 1;
  var $last_lit = $s + 5792 | 0;
  var $cmp = (HEAP32[$last_lit >> 2] | 0) == 0;
  $entry_if_end320_crit_edge$$do_body_preheader$34 : do {
    if ($cmp) {
      var $62 = HEAP32[$s + 5820 >> 2];
      var $61 = HEAP16[$s + 5816 >> 1];
    } else {
      var $d_buf = $s + 5796 | 0;
      var $l_buf = $s + 5784 | 0;
      var $bi_valid$s2 = ($s + 5820 | 0) >> 2;
      var $bi_buf$s1 = ($s + 5816 | 0) >> 1;
      var $pending$s2 = ($s + 20 | 0) >> 2;
      var $pending_buf$s2 = ($s + 8 | 0) >> 2;
      var $lx_0 = 0;
      while (1) {
        var $lx_0;
        var $2 = HEAPU16[HEAP32[$d_buf >> 2] + ($lx_0 << 1) >> 1];
        var $conv = $2 & 65535;
        var $inc = $lx_0 + 1 | 0;
        var $conv2 = HEAPU8[HEAP32[$l_buf >> 2] + $lx_0 | 0] & 255;
        var $cmp3 = $2 << 16 >> 16 == 0;
        do {
          if ($cmp3) {
            var $conv8 = HEAPU16[(($conv2 << 2) + 2 >> 1) + $ltree$s1] & 65535;
            var $6 = HEAPU32[$bi_valid$s2];
            var $cmp9 = ($6 | 0) > (16 - $conv8 | 0);
            var $conv16 = HEAPU16[($conv2 << 2 >> 1) + $ltree$s1] & 65535;
            var $or = HEAPU16[$bi_buf$s1] & 65535 | $conv16 << $6;
            var $conv19 = $or & 65535;
            HEAP16[$bi_buf$s1] = $conv19;
            if ($cmp9) {
              var $conv22 = $or & 255;
              var $9 = HEAP32[$pending$s2];
              var $inc23 = $9 + 1 | 0;
              HEAP32[$pending$s2] = $inc23;
              HEAP8[HEAP32[$pending_buf$s2] + $9 | 0] = $conv22;
              var $conv27 = (HEAPU16[$bi_buf$s1] & 65535) >>> 8 & 255;
              var $12 = HEAPU32[$pending$s2];
              HEAP32[$pending$s2] = $12 + 1 | 0;
              HEAP8[HEAP32[$pending_buf$s2] + $12 | 0] = $conv27;
              var $14 = HEAPU32[$bi_valid$s2];
              var $conv37 = $conv16 >>> ((16 - $14 | 0) >>> 0) & 65535;
              HEAP16[$bi_buf$s1] = $conv37;
              var $add = $conv8 - 16 + $14 | 0;
              HEAP32[$bi_valid$s2] = $add;
              var $59 = $add;
              var $58 = $conv37;
            } else {
              var $add52 = $6 + $conv8 | 0;
              HEAP32[$bi_valid$s2] = $add52;
              var $59 = $add52;
              var $58 = $conv19;
            }
          } else {
            var $arrayidx54 = STRING_TABLE.__length_code + $conv2 | 0;
            var $conv55 = HEAPU8[$arrayidx54] & 255;
            var $add58 = ($conv55 | 256) + 1 | 0;
            var $conv62 = HEAPU16[(($add58 << 2) + 2 >> 1) + $ltree$s1] & 65535;
            var $17 = HEAPU32[$bi_valid$s2];
            var $cmp65 = ($17 | 0) > (16 - $conv62 | 0);
            var $conv76 = HEAPU16[($add58 << 2 >> 1) + $ltree$s1] & 65535;
            var $or81 = HEAPU16[$bi_buf$s1] & 65535 | $conv76 << $17;
            var $conv82 = $or81 & 65535;
            HEAP16[$bi_buf$s1] = $conv82;
            if ($cmp65) {
              var $conv86 = $or81 & 255;
              var $20 = HEAP32[$pending$s2];
              var $inc88 = $20 + 1 | 0;
              HEAP32[$pending$s2] = $inc88;
              HEAP8[HEAP32[$pending_buf$s2] + $20 | 0] = $conv86;
              var $conv94 = (HEAPU16[$bi_buf$s1] & 65535) >>> 8 & 255;
              var $23 = HEAPU32[$pending$s2];
              HEAP32[$pending$s2] = $23 + 1 | 0;
              HEAP8[HEAP32[$pending_buf$s2] + $23 | 0] = $conv94;
              var $25 = HEAPU32[$bi_valid$s2];
              var $conv104 = $conv76 >>> ((16 - $25 | 0) >>> 0) & 65535;
              HEAP16[$bi_buf$s1] = $conv104;
              var $27 = $conv62 - 16 + $25 | 0;
              var $26 = $conv104;
            } else {
              var $27 = $17 + $conv62 | 0;
              var $26 = $conv82;
            }
            var $26;
            var $27;
            HEAP32[$bi_valid$s2] = $27;
            var $28 = HEAPU32[_extra_lbits + ($conv55 << 2) >> 2];
            if (($conv55 - 8 | 0) >>> 0 < 20) {
              var $cmp134 = ($27 | 0) > (16 - $28 | 0);
              var $conv139 = $conv2 - HEAP32[_base_length + ($conv55 << 2) >> 2] & 65535;
              var $or144 = $conv139 << $27 | $26 & 65535;
              var $conv145 = $or144 & 65535;
              HEAP16[$bi_buf$s1] = $conv145;
              if ($cmp134) {
                var $conv149 = $or144 & 255;
                var $31 = HEAP32[$pending$s2];
                var $inc151 = $31 + 1 | 0;
                HEAP32[$pending$s2] = $inc151;
                HEAP8[HEAP32[$pending_buf$s2] + $31 | 0] = $conv149;
                var $conv157 = (HEAPU16[$bi_buf$s1] & 65535) >>> 8 & 255;
                var $34 = HEAPU32[$pending$s2];
                HEAP32[$pending$s2] = $34 + 1 | 0;
                HEAP8[HEAP32[$pending_buf$s2] + $34 | 0] = $conv157;
                var $36 = HEAPU32[$bi_valid$s2];
                var $conv167 = $conv139 >>> ((16 - $36 | 0) >>> 0) & 65535;
                HEAP16[$bi_buf$s1] = $conv167;
                var $add171 = $28 - 16 + $36 | 0;
                HEAP32[$bi_valid$s2] = $add171;
                var $38 = $add171;
                var $37 = $conv167;
              } else {
                var $add182 = $27 + $28 | 0;
                HEAP32[$bi_valid$s2] = $add182;
                var $38 = $add182;
                var $37 = $conv145;
              }
            } else {
              var $38 = $27;
              var $37 = $26;
            }
            var $37;
            var $38;
            var $dec = $conv - 1 | 0;
            if ($dec >>> 0 < 256) {
              var $dec_pn = $dec;
            } else {
              var $dec_pn = ($dec >>> 7) + 256 | 0;
            }
            var $dec_pn;
            var $cond_in_in = STRING_TABLE.__dist_code + $dec_pn | 0;
            var $cond = HEAPU8[$cond_in_in] & 255;
            var $conv197 = HEAPU16[$dtree + ($cond << 2) + 2 >> 1] & 65535;
            var $cmp200 = ($38 | 0) > (16 - $conv197 | 0);
            var $conv209 = HEAPU16[$dtree + ($cond << 2) >> 1] & 65535;
            var $or214 = $37 & 65535 | $conv209 << $38;
            var $conv215 = $or214 & 65535;
            HEAP16[$bi_buf$s1] = $conv215;
            if ($cmp200) {
              var $conv219 = $or214 & 255;
              var $41 = HEAP32[$pending$s2];
              var $inc221 = $41 + 1 | 0;
              HEAP32[$pending$s2] = $inc221;
              HEAP8[HEAP32[$pending_buf$s2] + $41 | 0] = $conv219;
              var $conv227 = (HEAPU16[$bi_buf$s1] & 65535) >>> 8 & 255;
              var $44 = HEAPU32[$pending$s2];
              HEAP32[$pending$s2] = $44 + 1 | 0;
              HEAP8[HEAP32[$pending_buf$s2] + $44 | 0] = $conv227;
              var $46 = HEAPU32[$bi_valid$s2];
              var $conv237 = $conv209 >>> ((16 - $46 | 0) >>> 0) & 65535;
              HEAP16[$bi_buf$s1] = $conv237;
              var $48 = $conv197 - 16 + $46 | 0;
              var $47 = $conv237;
            } else {
              var $48 = $38 + $conv197 | 0;
              var $47 = $conv215;
            }
            var $47;
            var $48;
            HEAP32[$bi_valid$s2] = $48;
            var $49 = HEAPU32[_extra_dbits + ($cond << 2) >> 2];
            if (($cond - 4 | 0) >>> 0 >= 26) {
              var $59 = $48;
              var $58 = $47;
              break;
            }
            var $cmp265 = ($48 | 0) > (16 - $49 | 0);
            var $conv270 = $dec - HEAP32[_base_dist + ($cond << 2) >> 2] & 65535;
            var $or275 = $conv270 << $48 | $47 & 65535;
            var $conv276 = $or275 & 65535;
            HEAP16[$bi_buf$s1] = $conv276;
            if ($cmp265) {
              var $conv280 = $or275 & 255;
              var $52 = HEAP32[$pending$s2];
              var $inc282 = $52 + 1 | 0;
              HEAP32[$pending$s2] = $inc282;
              HEAP8[HEAP32[$pending_buf$s2] + $52 | 0] = $conv280;
              var $conv288 = (HEAPU16[$bi_buf$s1] & 65535) >>> 8 & 255;
              var $55 = HEAPU32[$pending$s2];
              HEAP32[$pending$s2] = $55 + 1 | 0;
              HEAP8[HEAP32[$pending_buf$s2] + $55 | 0] = $conv288;
              var $57 = HEAPU32[$bi_valid$s2];
              var $conv298 = $conv270 >>> ((16 - $57 | 0) >>> 0) & 65535;
              HEAP16[$bi_buf$s1] = $conv298;
              var $add302 = $49 - 16 + $57 | 0;
              HEAP32[$bi_valid$s2] = $add302;
              var $59 = $add302;
              var $58 = $conv298;
            } else {
              var $add313 = $48 + $49 | 0;
              HEAP32[$bi_valid$s2] = $add313;
              var $59 = $add313;
              var $58 = $conv276;
            }
          }
        } while (0);
        var $58;
        var $59;
        if ($inc >>> 0 >= HEAPU32[$last_lit >> 2] >>> 0) {
          var $62 = $59;
          var $61 = $58;
          break $entry_if_end320_crit_edge$$do_body_preheader$34;
        }
        var $lx_0 = $inc;
      }
    }
  } while (0);
  var $61;
  var $62;
  var $len324 = $ltree + 1026 | 0;
  var $conv325 = HEAPU16[$len324 >> 1] & 65535;
  var $bi_valid326 = $s + 5820 | 0;
  var $cmp328 = ($62 | 0) > (16 - $conv325 | 0);
  var $conv337 = HEAPU16[$ltree$s1 + 512] & 65535;
  var $bi_buf340$s1 = ($s + 5816 | 0) >> 1;
  var $or342 = $61 & 65535 | $conv337 << $62;
  HEAP16[$bi_buf340$s1] = $or342 & 65535;
  if ($cmp328) {
    var $conv347 = $or342 & 255;
    var $pending348$s2 = ($s + 20 | 0) >> 2;
    var $65 = HEAP32[$pending348$s2];
    var $inc349 = $65 + 1 | 0;
    HEAP32[$pending348$s2] = $inc349;
    var $pending_buf350 = $s + 8 | 0;
    HEAP8[HEAP32[$pending_buf350 >> 2] + $65 | 0] = $conv347;
    var $conv355 = (HEAPU16[$bi_buf340$s1] & 65535) >>> 8 & 255;
    var $68 = HEAPU32[$pending348$s2];
    HEAP32[$pending348$s2] = $68 + 1 | 0;
    HEAP8[HEAP32[$pending_buf350 >> 2] + $68 | 0] = $conv355;
    var $70 = HEAPU32[$bi_valid326 >> 2];
    HEAP16[$bi_buf340$s1] = $conv337 >>> ((16 - $70 | 0) >>> 0) & 65535;
    var $storemerge = $conv325 - 16 + $70 | 0;
  } else {
    var $storemerge = $62 + $conv325 | 0;
  }
  var $storemerge;
  HEAP32[$bi_valid326 >> 2] = $storemerge;
  HEAP32[$s + 5812 >> 2] = HEAPU16[$len324 >> 1] & 65535;
  return;
  return;
}

_compress_block["X"] = 1;

function _bi_windup($s) {
  var $pending$s2;
  var $bi_valid = $s + 5820 | 0;
  var $0 = HEAPU32[$bi_valid >> 2];
  var $cmp = ($0 | 0) > 8;
  do {
    if ($cmp) {
      var $bi_buf = $s + 5816 | 0;
      var $conv1 = HEAP16[$bi_buf >> 1] & 255;
      var $pending$s2 = ($s + 20 | 0) >> 2;
      var $2 = HEAP32[$pending$s2];
      var $inc = $2 + 1 | 0;
      HEAP32[$pending$s2] = $inc;
      var $pending_buf = $s + 8 | 0;
      HEAP8[HEAP32[$pending_buf >> 2] + $2 | 0] = $conv1;
      var $conv4 = (HEAPU16[$bi_buf >> 1] & 65535) >>> 8 & 255;
      var $5 = HEAPU32[$pending$s2];
      HEAP32[$pending$s2] = $5 + 1 | 0;
      HEAP8[HEAP32[$pending_buf >> 2] + $5 | 0] = $conv4;
      var $bi_buf20_pre_phi = $bi_buf;
    } else {
      var $bi_buf13 = $s + 5816 | 0;
      if (($0 | 0) <= 0) {
        var $bi_buf20_pre_phi = $bi_buf13;
        break;
      }
      var $conv14 = HEAP16[$bi_buf13 >> 1] & 255;
      var $pending15 = $s + 20 | 0;
      var $8 = HEAP32[$pending15 >> 2];
      var $inc16 = $8 + 1 | 0;
      HEAP32[$pending15 >> 2] = $inc16;
      HEAP8[HEAP32[$s + 8 >> 2] + $8 | 0] = $conv14;
      var $bi_buf20_pre_phi = $bi_buf13;
    }
  } while (0);
  var $bi_buf20_pre_phi;
  HEAP16[$bi_buf20_pre_phi >> 1] = 0;
  HEAP32[$bi_valid >> 2] = 0;
  return;
  return;
}

function _build_tree($s, $desc) {
  var $arrayidx41$s2;
  var $opt_len$s2;
  var $heap_max$s2;
  var $heap_len$s2;
  var $0$s1;
  var __label__;
  var $dyn_tree = $desc | 0;
  var $0 = HEAPU32[$dyn_tree >> 2], $0$s1 = $0 >> 1;
  var $stat_desc = $desc + 8 | 0;
  var $1 = HEAP32[$stat_desc >> 2];
  var $2 = HEAP32[$1 >> 2];
  var $3 = HEAPU32[$1 + 12 >> 2];
  var $heap_len$s2 = ($s + 5200 | 0) >> 2;
  HEAP32[$heap_len$s2] = 0;
  var $heap_max$s2 = ($s + 5204 | 0) >> 2;
  HEAP32[$heap_max$s2] = 573;
  var $cmp7 = ($3 | 0) > 0;
  do {
    if ($cmp7) {
      var $n_08 = 0;
      var $max_code_09 = -1;
      while (1) {
        var $max_code_09;
        var $n_08;
        if (HEAP16[($n_08 << 2 >> 1) + $0$s1] << 16 >> 16 == 0) {
          HEAP16[(($n_08 << 2) + 2 >> 1) + $0$s1] = 0;
          var $max_code_1 = $max_code_09;
        } else {
          var $inc = HEAP32[$heap_len$s2] + 1 | 0;
          HEAP32[$heap_len$s2] = $inc;
          var $arrayidx6 = ($inc << 2) + $s + 2908 | 0;
          HEAP32[$arrayidx6 >> 2] = $n_08;
          HEAP8[$s + ($n_08 + 5208) | 0] = 0;
          var $max_code_1 = $n_08;
        }
        var $max_code_1;
        var $inc9 = $n_08 + 1 | 0;
        if (($inc9 | 0) == ($3 | 0)) {
          break;
        }
        var $n_08 = $inc9;
        var $max_code_09 = $max_code_1;
      }
      var $_pre = HEAP32[$heap_len$s2];
      if (($_pre | 0) < 2) {
        var $4 = $_pre;
        var $max_code_0_lcssa14 = $max_code_1;
        __label__ = 2;
        break;
      }
      var $max_code_2_lcssa = $max_code_1;
      __label__ = 9;
      break;
    } else {
      var $4 = 0;
      var $max_code_0_lcssa14 = -1;
      __label__ = 2;
    }
  } while (0);
  $while_body_lr_ph$$while_end$10 : do {
    if (__label__ == 2) {
      var $max_code_0_lcssa14;
      var $4;
      var $opt_len$s2 = ($s + 5800 | 0) >> 2;
      var $static_len = $s + 5804 | 0;
      if (($2 | 0) == 0) {
        var $max_code_26_us = $max_code_0_lcssa14;
        var $5 = $4;
        while (1) {
          var $5;
          var $max_code_26_us;
          var $cmp13_us = ($max_code_26_us | 0) < 2;
          var $inc15_us = $max_code_26_us + 1 | 0;
          var $max_code_3_us = $cmp13_us ? $inc15_us : $max_code_26_us;
          var $cond_us = $cmp13_us ? $inc15_us : 0;
          var $inc17_us = $5 + 1 | 0;
          HEAP32[$heap_len$s2] = $inc17_us;
          HEAP32[$s + ($inc17_us << 2) + 2908 >> 2] = $cond_us;
          HEAP16[($cond_us << 2 >> 1) + $0$s1] = 1;
          HEAP8[$s + ($cond_us + 5208) | 0] = 0;
          var $dec_us = HEAP32[$opt_len$s2] - 1 | 0;
          HEAP32[$opt_len$s2] = $dec_us;
          var $7 = HEAP32[$heap_len$s2];
          if (($7 | 0) >= 2) {
            var $max_code_2_lcssa = $max_code_3_us;
            break $while_body_lr_ph$$while_end$10;
          }
          var $max_code_26_us = $max_code_3_us;
          var $5 = $7;
        }
      } else {
        var $max_code_26 = $max_code_0_lcssa14;
        var $10 = $4;
        while (1) {
          var $10;
          var $max_code_26;
          var $cmp13 = ($max_code_26 | 0) < 2;
          var $inc15 = $max_code_26 + 1 | 0;
          var $max_code_3 = $cmp13 ? $inc15 : $max_code_26;
          var $cond = $cmp13 ? $inc15 : 0;
          var $inc17 = $10 + 1 | 0;
          HEAP32[$heap_len$s2] = $inc17;
          HEAP32[$s + ($inc17 << 2) + 2908 >> 2] = $cond;
          HEAP16[($cond << 2 >> 1) + $0$s1] = 1;
          HEAP8[$s + ($cond + 5208) | 0] = 0;
          var $dec = HEAP32[$opt_len$s2] - 1 | 0;
          HEAP32[$opt_len$s2] = $dec;
          var $sub = HEAP32[$static_len >> 2] - (HEAPU16[$2 + ($cond << 2) + 2 >> 1] & 65535) | 0;
          HEAP32[$static_len >> 2] = $sub;
          var $14 = HEAPU32[$heap_len$s2];
          if (($14 | 0) >= 2) {
            var $max_code_2_lcssa = $max_code_3;
            break $while_body_lr_ph$$while_end$10;
          }
          var $max_code_26 = $max_code_3;
          var $10 = $14;
        }
      }
    }
  } while (0);
  var $max_code_2_lcssa;
  var $max_code31 = $desc + 4 | 0;
  HEAP32[$max_code31 >> 2] = $max_code_2_lcssa;
  var $15 = HEAP32[$heap_len$s2];
  if (($15 | 0) > 1) {
    var $n_14 = $15 / 2 | 0;
    while (1) {
      var $n_14;
      _pqdownheap($s, $0, $n_14);
      var $dec38 = $n_14 - 1 | 0;
      if (($dec38 | 0) <= 0) {
        break;
      }
      var $n_14 = $dec38;
    }
    var $_pre11 = HEAP32[$heap_len$s2];
  } else {
    var $_pre11 = $15;
  }
  var $_pre11;
  var $arrayidx41$s2 = ($s + 2912 | 0) >> 2;
  var $node_0 = $3;
  var $16 = $_pre11;
  while (1) {
    var $16;
    var $node_0;
    var $17 = HEAPU32[$arrayidx41$s2];
    HEAP32[$heap_len$s2] = $16 - 1 | 0;
    var $18 = HEAP32[$s + ($16 << 2) + 2908 >> 2];
    HEAP32[$arrayidx41$s2] = $18;
    _pqdownheap($s, $0, 1);
    var $19 = HEAPU32[$arrayidx41$s2];
    var $dec51 = HEAP32[$heap_max$s2] - 1 | 0;
    HEAP32[$heap_max$s2] = $dec51;
    var $arrayidx53 = ($dec51 << 2) + $s + 2908 | 0;
    HEAP32[$arrayidx53 >> 2] = $17;
    var $dec55 = HEAP32[$heap_max$s2] - 1 | 0;
    HEAP32[$heap_max$s2] = $dec55;
    var $arrayidx57 = ($dec55 << 2) + $s + 2908 | 0;
    HEAP32[$arrayidx57 >> 2] = $19;
    var $add = HEAP16[($19 << 2 >> 1) + $0$s1] + HEAP16[($17 << 2 >> 1) + $0$s1] & 65535;
    HEAP16[($node_0 << 2 >> 1) + $0$s1] = $add;
    var $24 = HEAPU8[$s + ($17 + 5208) | 0];
    var $25 = HEAPU8[$s + ($19 + 5208) | 0];
    var $_ = ($24 & 255) < ($25 & 255) ? $25 : $24;
    HEAP8[$s + ($node_0 + 5208) | 0] = $_ + 1 & 255;
    var $conv92 = $node_0 & 65535;
    HEAP16[(($19 << 2) + 2 >> 1) + $0$s1] = $conv92;
    HEAP16[(($17 << 2) + 2 >> 1) + $0$s1] = $conv92;
    var $inc98 = $node_0 + 1 | 0;
    HEAP32[$arrayidx41$s2] = $node_0;
    _pqdownheap($s, $0, 1);
    var $26 = HEAPU32[$heap_len$s2];
    if (($26 | 0) <= 1) {
      break;
    }
    var $node_0 = $inc98;
    var $16 = $26;
  }
  var $27 = HEAP32[$arrayidx41$s2];
  var $dec107 = HEAP32[$heap_max$s2] - 1 | 0;
  HEAP32[$heap_max$s2] = $dec107;
  var $arrayidx109 = ($dec107 << 2) + $s + 2908 | 0;
  HEAP32[$arrayidx109 >> 2] = $27;
  var $desc_idx_val = HEAP32[$dyn_tree >> 2];
  var $desc_idx1_val = HEAP32[$max_code31 >> 2];
  var $desc_idx2_val = HEAP32[$stat_desc >> 2];
  _gen_bitlen($s, $desc_idx_val, $desc_idx1_val, $desc_idx2_val);
  var $arraydecay = $s + 2876 | 0;
  _gen_codes($0, $max_code_2_lcssa, $arraydecay);
  return;
  return;
}

_build_tree["X"] = 1;

function _build_bl_tree($s) {
  var $arraydecay = $s + 148 | 0;
  var $0 = HEAP32[$s + 2844 >> 2];
  _scan_tree($s, $arraydecay, $0);
  var $arraydecay1 = $s + 2440 | 0;
  var $1 = HEAP32[$s + 2856 >> 2];
  _scan_tree($s, $arraydecay1, $1);
  var $bl_desc = $s + 2864 | 0;
  _build_tree($s, $bl_desc);
  var $max_blindex_0 = 18;
  while (1) {
    var $max_blindex_0;
    if (($max_blindex_0 | 0) <= 2) {
      break;
    }
    var $arrayidx = STRING_TABLE._bl_order + $max_blindex_0 | 0;
    if (HEAP16[$s + ((HEAPU8[$arrayidx] & 255) << 2) + 2686 >> 1] << 16 >> 16 != 0) {
      break;
    }
    var $max_blindex_0 = $max_blindex_0 - 1 | 0;
  }
  var $opt_len = $s + 5800 | 0;
  var $add9 = $max_blindex_0 * 3 + HEAP32[$opt_len >> 2] + 17 | 0;
  HEAP32[$opt_len >> 2] = $add9;
  return $max_blindex_0;
  return null;
}

function _send_all_trees($s, $lcodes, $dcodes, $blcodes) {
  var $pending171$s2;
  var $pending111$s2;
  var $pending56$s2;
  var $pending$s2;
  var $bi_buf$s1;
  var $bi_valid$s2;
  var $bi_valid$s2 = ($s + 5820 | 0) >> 2;
  var $0 = HEAPU32[$bi_valid$s2];
  var $cmp = ($0 | 0) > 11;
  var $conv2 = $lcodes + 65279 & 65535;
  var $bi_buf$s1 = ($s + 5816 | 0) >> 1;
  var $or = HEAPU16[$bi_buf$s1] & 65535 | $conv2 << $0;
  var $conv5 = $or & 65535;
  HEAP16[$bi_buf$s1] = $conv5;
  if ($cmp) {
    var $conv8 = $or & 255;
    var $pending$s2 = ($s + 20 | 0) >> 2;
    var $2 = HEAP32[$pending$s2];
    var $inc = $2 + 1 | 0;
    HEAP32[$pending$s2] = $inc;
    var $pending_buf = $s + 8 | 0;
    HEAP8[HEAP32[$pending_buf >> 2] + $2 | 0] = $conv8;
    var $conv11 = (HEAPU16[$bi_buf$s1] & 65535) >>> 8 & 255;
    var $5 = HEAPU32[$pending$s2];
    HEAP32[$pending$s2] = $5 + 1 | 0;
    HEAP8[HEAP32[$pending_buf >> 2] + $5 | 0] = $conv11;
    var $7 = HEAPU32[$bi_valid$s2];
    var $conv21 = $conv2 >>> ((16 - $7 | 0) >>> 0) & 65535;
    HEAP16[$bi_buf$s1] = $conv21;
    var $9 = $7 - 11 | 0;
    var $8 = $conv21;
  } else {
    var $9 = $0 + 5 | 0;
    var $8 = $conv5;
  }
  var $8;
  var $9;
  HEAP32[$bi_valid$s2] = $9;
  var $sub43 = $dcodes - 1 | 0;
  var $conv45 = $sub43 & 65535;
  var $or50 = $8 & 65535 | $conv45 << $9;
  var $conv51 = $or50 & 65535;
  HEAP16[$bi_buf$s1] = $conv51;
  if (($9 | 0) > 11) {
    var $conv55 = $or50 & 255;
    var $pending56$s2 = ($s + 20 | 0) >> 2;
    var $10 = HEAP32[$pending56$s2];
    var $inc57 = $10 + 1 | 0;
    HEAP32[$pending56$s2] = $inc57;
    var $pending_buf58 = $s + 8 | 0;
    HEAP8[HEAP32[$pending_buf58 >> 2] + $10 | 0] = $conv55;
    var $conv63 = (HEAPU16[$bi_buf$s1] & 65535) >>> 8 & 255;
    var $13 = HEAPU32[$pending56$s2];
    HEAP32[$pending56$s2] = $13 + 1 | 0;
    HEAP8[HEAP32[$pending_buf58 >> 2] + $13 | 0] = $conv63;
    var $15 = HEAPU32[$bi_valid$s2];
    var $conv73 = $conv45 >>> ((16 - $15 | 0) >>> 0) & 65535;
    HEAP16[$bi_buf$s1] = $conv73;
    var $17 = $15 - 11 | 0;
    var $16 = $conv73;
  } else {
    var $17 = $9 + 5 | 0;
    var $16 = $conv51;
  }
  var $16;
  var $17;
  HEAP32[$bi_valid$s2] = $17;
  var $conv100 = $blcodes + 65532 & 65535;
  var $or105 = $16 & 65535 | $conv100 << $17;
  var $conv106 = $or105 & 65535;
  HEAP16[$bi_buf$s1] = $conv106;
  if (($17 | 0) > 12) {
    var $conv110 = $or105 & 255;
    var $pending111$s2 = ($s + 20 | 0) >> 2;
    var $18 = HEAP32[$pending111$s2];
    var $inc112 = $18 + 1 | 0;
    HEAP32[$pending111$s2] = $inc112;
    var $pending_buf113 = $s + 8 | 0;
    HEAP8[HEAP32[$pending_buf113 >> 2] + $18 | 0] = $conv110;
    var $conv118 = (HEAPU16[$bi_buf$s1] & 65535) >>> 8 & 255;
    var $21 = HEAPU32[$pending111$s2];
    HEAP32[$pending111$s2] = $21 + 1 | 0;
    HEAP8[HEAP32[$pending_buf113 >> 2] + $21 | 0] = $conv118;
    var $23 = HEAPU32[$bi_valid$s2];
    var $conv128 = $conv100 >>> ((16 - $23 | 0) >>> 0) & 65535;
    HEAP16[$bi_buf$s1] = $conv128;
    var $storemerge2 = $23 - 12 | 0;
    var $24 = $conv128;
  } else {
    var $storemerge2 = $17 + 4 | 0;
    var $24 = $conv106;
  }
  var $24;
  var $storemerge2;
  HEAP32[$bi_valid$s2] = $storemerge2;
  var $cmp1468 = ($blcodes | 0) > 0;
  $for_body_lr_ph$$for_end$85 : do {
    if ($cmp1468) {
      var $pending171$s2 = ($s + 20 | 0) >> 2;
      var $pending_buf173 = $s + 8 | 0;
      var $rank_09 = 0;
      var $26 = $storemerge2;
      var $25 = $24;
      while (1) {
        var $25;
        var $26;
        var $rank_09;
        var $arrayidx155 = STRING_TABLE._bl_order + $rank_09 | 0;
        var $conv160 = HEAPU16[$s + ((HEAPU8[$arrayidx155] & 255) << 2) + 2686 >> 1] & 65535;
        var $or165 = $25 & 65535 | $conv160 << $26;
        var $conv166 = $or165 & 65535;
        HEAP16[$bi_buf$s1] = $conv166;
        if (($26 | 0) > 13) {
          var $conv170 = $or165 & 255;
          var $29 = HEAP32[$pending171$s2];
          var $inc172 = $29 + 1 | 0;
          HEAP32[$pending171$s2] = $inc172;
          HEAP8[HEAP32[$pending_buf173 >> 2] + $29 | 0] = $conv170;
          var $conv178 = (HEAPU16[$bi_buf$s1] & 65535) >>> 8 & 255;
          var $32 = HEAPU32[$pending171$s2];
          HEAP32[$pending171$s2] = $32 + 1 | 0;
          HEAP8[HEAP32[$pending_buf173 >> 2] + $32 | 0] = $conv178;
          var $34 = HEAPU32[$bi_valid$s2];
          var $conv188 = $conv160 >>> ((16 - $34 | 0) >>> 0) & 65535;
          HEAP16[$bi_buf$s1] = $conv188;
          var $storemerge3 = $34 - 13 | 0;
          var $35 = $conv188;
        } else {
          var $storemerge3 = $26 + 3 | 0;
          var $35 = $conv166;
        }
        var $35;
        var $storemerge3;
        HEAP32[$bi_valid$s2] = $storemerge3;
        var $inc210 = $rank_09 + 1 | 0;
        if (($inc210 | 0) == ($blcodes | 0)) {
          break $for_body_lr_ph$$for_end$85;
        }
        var $rank_09 = $inc210;
        var $26 = $storemerge3;
        var $25 = $35;
      }
    }
  } while (0);
  var $arraydecay = $s + 148 | 0;
  var $sub211 = $lcodes - 1 | 0;
  _send_tree($s, $arraydecay, $sub211);
  var $arraydecay212 = $s + 2440 | 0;
  _send_tree($s, $arraydecay212, $sub43);
  return;
  return;
}

_send_all_trees["X"] = 1;

function _send_tree($s, $tree, $max_code) {
  var $pending_buf302$s2;
  var $pending300$s2;
  var $bi_buf292$s1;
  var $bi_valid277$s2;
  var $0 = HEAPU16[$tree + 2 >> 1];
  var $cmp = $0 << 16 >> 16 == 0;
  var $max_count_0 = $cmp ? 138 : 7;
  var $min_count_0 = $cmp ? 3 : 4;
  var $len275 = $s + 2754 | 0;
  var $bi_valid277$s2 = ($s + 5820 | 0) >> 2;
  var $code286 = $s + 2752 | 0;
  var $bi_buf292$s1 = ($s + 5816 | 0) >> 1;
  var $pending300$s2 = ($s + 20 | 0) >> 2;
  var $pending_buf302$s2 = ($s + 8 | 0) >> 2;
  var $len397 = $s + 2758 | 0;
  var $code408 = $s + 2756 | 0;
  var $len150 = $s + 2750 | 0;
  var $code161 = $s + 2748 | 0;
  var $min_count_1_ph = $min_count_0;
  var $max_count_1_ph = $max_count_0;
  var $n_0_ph = 0;
  var $prevlen_0_ph = -1;
  var $nextlen_0_ph = $0 & 65535;
  $for_cond_outer$2 : while (1) {
    var $nextlen_0_ph;
    var $prevlen_0_ph;
    var $n_0_ph;
    var $max_count_1_ph;
    var $min_count_1_ph;
    var $count_0 = 0;
    var $n_0 = $n_0_ph;
    var $nextlen_0 = $nextlen_0_ph;
    while (1) {
      var $nextlen_0;
      var $n_0;
      var $count_0;
      if (($n_0 | 0) > ($max_code | 0)) {
        break $for_cond_outer$2;
      }
      var $add = $n_0 + 1 | 0;
      var $1 = HEAPU16[$tree + ($add << 2) + 2 >> 1];
      var $conv7 = $1 & 65535;
      var $inc = $count_0 + 1 | 0;
      var $cmp10 = ($nextlen_0 | 0) == ($conv7 | 0);
      if (!(($inc | 0) < ($max_count_1_ph | 0) & $cmp10)) {
        break;
      }
      var $count_0 = $inc;
      var $n_0 = $add;
      var $nextlen_0 = $conv7;
    }
    var $cmp13 = ($inc | 0) < ($min_count_1_ph | 0);
    $do_body_preheader$$if_else71$8 : do {
      if ($cmp13) {
        var $len19 = ($nextlen_0 << 2) + $s + 2686 | 0;
        var $code = ($nextlen_0 << 2) + $s + 2684 | 0;
        var $count_1 = $inc;
        var $3 = HEAP32[$bi_valid277$s2];
        var $2 = HEAP16[$bi_buf292$s1];
        while (1) {
          var $2;
          var $3;
          var $count_1;
          var $conv20 = HEAPU16[$len19 >> 1] & 65535;
          var $cmp21 = ($3 | 0) > (16 - $conv20 | 0);
          var $conv28 = HEAPU16[$code >> 1] & 65535;
          var $or = $2 & 65535 | $conv28 << $3;
          var $conv31 = $or & 65535;
          HEAP16[$bi_buf292$s1] = $conv31;
          if ($cmp21) {
            var $conv34 = $or & 255;
            var $6 = HEAP32[$pending300$s2];
            var $inc35 = $6 + 1 | 0;
            HEAP32[$pending300$s2] = $inc35;
            HEAP8[HEAP32[$pending_buf302$s2] + $6 | 0] = $conv34;
            var $conv39 = (HEAPU16[$bi_buf292$s1] & 65535) >>> 8 & 255;
            var $9 = HEAPU32[$pending300$s2];
            HEAP32[$pending300$s2] = $9 + 1 | 0;
            HEAP8[HEAP32[$pending_buf302$s2] + $9 | 0] = $conv39;
            var $11 = HEAPU32[$bi_valid277$s2];
            var $conv49 = $conv28 >>> ((16 - $11 | 0) >>> 0) & 65535;
            HEAP16[$bi_buf292$s1] = $conv49;
            var $storemerge11 = $conv20 - 16 + $11 | 0;
            var $12 = $conv49;
          } else {
            var $storemerge11 = $3 + $conv20 | 0;
            var $12 = $conv31;
          }
          var $12;
          var $storemerge11;
          HEAP32[$bi_valid277$s2] = $storemerge11;
          var $dec = $count_1 - 1 | 0;
          if (($dec | 0) == 0) {
            break $do_body_preheader$$if_else71$8;
          }
          var $count_1 = $dec;
          var $3 = $storemerge11;
          var $2 = $12;
        }
      } else {
        if (($nextlen_0 | 0) == 0) {
          if (($inc | 0) < 11) {
            var $conv276 = HEAPU16[$len275 >> 1] & 65535;
            var $43 = HEAPU32[$bi_valid277$s2];
            var $cmp279 = ($43 | 0) > (16 - $conv276 | 0);
            var $conv289 = HEAPU16[$code286 >> 1] & 65535;
            var $or294 = HEAPU16[$bi_buf292$s1] & 65535 | $conv289 << $43;
            var $conv295 = $or294 & 65535;
            HEAP16[$bi_buf292$s1] = $conv295;
            if ($cmp279) {
              var $conv299 = $or294 & 255;
              var $46 = HEAP32[$pending300$s2];
              var $inc301 = $46 + 1 | 0;
              HEAP32[$pending300$s2] = $inc301;
              HEAP8[HEAP32[$pending_buf302$s2] + $46 | 0] = $conv299;
              var $conv307 = (HEAPU16[$bi_buf292$s1] & 65535) >>> 8 & 255;
              var $49 = HEAPU32[$pending300$s2];
              HEAP32[$pending300$s2] = $49 + 1 | 0;
              HEAP8[HEAP32[$pending_buf302$s2] + $49 | 0] = $conv307;
              var $51 = HEAPU32[$bi_valid277$s2];
              var $conv317 = $conv289 >>> ((16 - $51 | 0) >>> 0) & 65535;
              HEAP16[$bi_buf292$s1] = $conv317;
              var $53 = $conv276 - 16 + $51 | 0;
              var $52 = $conv317;
            } else {
              var $53 = $43 + $conv276 | 0;
              var $52 = $conv295;
            }
            var $52;
            var $53;
            HEAP32[$bi_valid277$s2] = $53;
            var $conv346 = $count_0 + 65534 & 65535;
            var $or351 = $52 & 65535 | $conv346 << $53;
            HEAP16[$bi_buf292$s1] = $or351 & 65535;
            if (($53 | 0) > 13) {
              var $54 = HEAP32[$pending300$s2];
              var $inc358 = $54 + 1 | 0;
              HEAP32[$pending300$s2] = $inc358;
              HEAP8[HEAP32[$pending_buf302$s2] + $54 | 0] = $or351 & 255;
              var $conv364 = (HEAPU16[$bi_buf292$s1] & 65535) >>> 8 & 255;
              var $57 = HEAPU32[$pending300$s2];
              HEAP32[$pending300$s2] = $57 + 1 | 0;
              HEAP8[HEAP32[$pending_buf302$s2] + $57 | 0] = $conv364;
              var $59 = HEAPU32[$bi_valid277$s2];
              HEAP16[$bi_buf292$s1] = $conv346 >>> ((16 - $59 | 0) >>> 0) & 65535;
              HEAP32[$bi_valid277$s2] = $59 - 13 | 0;
            } else {
              HEAP32[$bi_valid277$s2] = $53 + 3 | 0;
            }
          } else {
            var $conv398 = HEAPU16[$len397 >> 1] & 65535;
            var $61 = HEAPU32[$bi_valid277$s2];
            var $cmp401 = ($61 | 0) > (16 - $conv398 | 0);
            var $conv411 = HEAPU16[$code408 >> 1] & 65535;
            var $or416 = HEAPU16[$bi_buf292$s1] & 65535 | $conv411 << $61;
            var $conv417 = $or416 & 65535;
            HEAP16[$bi_buf292$s1] = $conv417;
            if ($cmp401) {
              var $conv421 = $or416 & 255;
              var $64 = HEAP32[$pending300$s2];
              var $inc423 = $64 + 1 | 0;
              HEAP32[$pending300$s2] = $inc423;
              HEAP8[HEAP32[$pending_buf302$s2] + $64 | 0] = $conv421;
              var $conv429 = (HEAPU16[$bi_buf292$s1] & 65535) >>> 8 & 255;
              var $67 = HEAPU32[$pending300$s2];
              HEAP32[$pending300$s2] = $67 + 1 | 0;
              HEAP8[HEAP32[$pending_buf302$s2] + $67 | 0] = $conv429;
              var $69 = HEAPU32[$bi_valid277$s2];
              var $conv439 = $conv411 >>> ((16 - $69 | 0) >>> 0) & 65535;
              HEAP16[$bi_buf292$s1] = $conv439;
              var $71 = $conv398 - 16 + $69 | 0;
              var $70 = $conv439;
            } else {
              var $71 = $61 + $conv398 | 0;
              var $70 = $conv417;
            }
            var $70;
            var $71;
            HEAP32[$bi_valid277$s2] = $71;
            var $conv468 = $count_0 + 65526 & 65535;
            var $or473 = $70 & 65535 | $conv468 << $71;
            HEAP16[$bi_buf292$s1] = $or473 & 65535;
            if (($71 | 0) > 9) {
              var $72 = HEAP32[$pending300$s2];
              var $inc480 = $72 + 1 | 0;
              HEAP32[$pending300$s2] = $inc480;
              HEAP8[HEAP32[$pending_buf302$s2] + $72 | 0] = $or473 & 255;
              var $conv486 = (HEAPU16[$bi_buf292$s1] & 65535) >>> 8 & 255;
              var $75 = HEAPU32[$pending300$s2];
              HEAP32[$pending300$s2] = $75 + 1 | 0;
              HEAP8[HEAP32[$pending_buf302$s2] + $75 | 0] = $conv486;
              var $77 = HEAPU32[$bi_valid277$s2];
              HEAP16[$bi_buf292$s1] = $conv468 >>> ((16 - $77 | 0) >>> 0) & 65535;
              HEAP32[$bi_valid277$s2] = $77 - 9 | 0;
            } else {
              HEAP32[$bi_valid277$s2] = $71 + 7 | 0;
            }
          }
        } else {
          if (($nextlen_0 | 0) == ($prevlen_0_ph | 0)) {
            var $count_2 = $inc;
            var $25 = HEAP32[$bi_valid277$s2];
            var $24 = HEAP16[$bi_buf292$s1];
          } else {
            var $conv83 = HEAPU16[$s + ($nextlen_0 << 2) + 2686 >> 1] & 65535;
            var $14 = HEAPU32[$bi_valid277$s2];
            var $cmp86 = ($14 | 0) > (16 - $conv83 | 0);
            var $conv96 = HEAPU16[$s + ($nextlen_0 << 2) + 2684 >> 1] & 65535;
            var $or101 = HEAPU16[$bi_buf292$s1] & 65535 | $conv96 << $14;
            var $conv102 = $or101 & 65535;
            HEAP16[$bi_buf292$s1] = $conv102;
            if ($cmp86) {
              var $conv106 = $or101 & 255;
              var $17 = HEAP32[$pending300$s2];
              var $inc108 = $17 + 1 | 0;
              HEAP32[$pending300$s2] = $inc108;
              HEAP8[HEAP32[$pending_buf302$s2] + $17 | 0] = $conv106;
              var $conv114 = (HEAPU16[$bi_buf292$s1] & 65535) >>> 8 & 255;
              var $20 = HEAPU32[$pending300$s2];
              HEAP32[$pending300$s2] = $20 + 1 | 0;
              HEAP8[HEAP32[$pending_buf302$s2] + $20 | 0] = $conv114;
              var $22 = HEAPU32[$bi_valid277$s2];
              var $conv124 = $conv96 >>> ((16 - $22 | 0) >>> 0) & 65535;
              HEAP16[$bi_buf292$s1] = $conv124;
              var $storemerge9 = $conv83 - 16 + $22 | 0;
              var $23 = $conv124;
            } else {
              var $storemerge9 = $14 + $conv83 | 0;
              var $23 = $conv102;
            }
            var $23;
            var $storemerge9;
            HEAP32[$bi_valid277$s2] = $storemerge9;
            var $count_2 = $count_0;
            var $25 = $storemerge9;
            var $24 = $23;
          }
          var $24;
          var $25;
          var $count_2;
          var $conv151 = HEAPU16[$len150 >> 1] & 65535;
          var $cmp154 = ($25 | 0) > (16 - $conv151 | 0);
          var $conv164 = HEAPU16[$code161 >> 1] & 65535;
          var $or169 = $24 & 65535 | $conv164 << $25;
          var $conv170 = $or169 & 65535;
          HEAP16[$bi_buf292$s1] = $conv170;
          if ($cmp154) {
            var $conv174 = $or169 & 255;
            var $28 = HEAP32[$pending300$s2];
            var $inc176 = $28 + 1 | 0;
            HEAP32[$pending300$s2] = $inc176;
            HEAP8[HEAP32[$pending_buf302$s2] + $28 | 0] = $conv174;
            var $conv182 = (HEAPU16[$bi_buf292$s1] & 65535) >>> 8 & 255;
            var $31 = HEAPU32[$pending300$s2];
            HEAP32[$pending300$s2] = $31 + 1 | 0;
            HEAP8[HEAP32[$pending_buf302$s2] + $31 | 0] = $conv182;
            var $33 = HEAPU32[$bi_valid277$s2];
            var $conv192 = $conv164 >>> ((16 - $33 | 0) >>> 0) & 65535;
            HEAP16[$bi_buf292$s1] = $conv192;
            var $35 = $conv151 - 16 + $33 | 0;
            var $34 = $conv192;
          } else {
            var $35 = $25 + $conv151 | 0;
            var $34 = $conv170;
          }
          var $34;
          var $35;
          HEAP32[$bi_valid277$s2] = $35;
          var $conv221 = $count_2 + 65533 & 65535;
          var $or226 = $34 & 65535 | $conv221 << $35;
          HEAP16[$bi_buf292$s1] = $or226 & 65535;
          if (($35 | 0) > 14) {
            var $36 = HEAP32[$pending300$s2];
            var $inc233 = $36 + 1 | 0;
            HEAP32[$pending300$s2] = $inc233;
            HEAP8[HEAP32[$pending_buf302$s2] + $36 | 0] = $or226 & 255;
            var $conv239 = (HEAPU16[$bi_buf292$s1] & 65535) >>> 8 & 255;
            var $39 = HEAPU32[$pending300$s2];
            HEAP32[$pending300$s2] = $39 + 1 | 0;
            HEAP8[HEAP32[$pending_buf302$s2] + $39 | 0] = $conv239;
            var $41 = HEAPU32[$bi_valid277$s2];
            HEAP16[$bi_buf292$s1] = $conv221 >>> ((16 - $41 | 0) >>> 0) & 65535;
            HEAP32[$bi_valid277$s2] = $41 - 14 | 0;
          } else {
            HEAP32[$bi_valid277$s2] = $35 + 2 | 0;
          }
        }
      }
    } while (0);
    if ($1 << 16 >> 16 == 0) {
      var $min_count_1_ph = 3;
      var $max_count_1_ph = 138;
      var $n_0_ph = $add;
      var $prevlen_0_ph = $nextlen_0;
      var $nextlen_0_ph = $conv7;
      continue;
    }
    var $_ = $cmp10 ? 6 : 7;
    var $_13 = $cmp10 ? 3 : 4;
    var $min_count_1_ph = $_13;
    var $max_count_1_ph = $_;
    var $n_0_ph = $add;
    var $prevlen_0_ph = $nextlen_0;
    var $nextlen_0_ph = $conv7;
  }
  return;
  return;
}

_send_tree["X"] = 1;

function _scan_tree($s, $tree, $max_code) {
  var $0 = HEAPU16[$tree + 2 >> 1];
  var $conv = $0 & 65535;
  var $cmp = $0 << 16 >> 16 == 0;
  var $max_count_0 = $cmp ? 138 : 7;
  var $min_count_0 = $cmp ? 3 : 4;
  HEAP16[$tree + ($max_code + 1 << 2) + 2 >> 1] = -1;
  var $freq49 = $s + 2752 | 0;
  var $freq55 = $s + 2756 | 0;
  var $freq40 = $s + 2748 | 0;
  var $min_count_1_ph = $min_count_0;
  var $max_count_1_ph = $max_count_0;
  var $n_0_ph = 0;
  var $prevlen_0_ph = -1;
  var $nextlen_0_ph = $conv;
  $for_cond_outer$56 : while (1) {
    var $nextlen_0_ph;
    var $prevlen_0_ph;
    var $n_0_ph;
    var $max_count_1_ph;
    var $min_count_1_ph;
    var $count_0 = 0;
    var $n_0 = $n_0_ph;
    var $nextlen_0 = $nextlen_0_ph;
    while (1) {
      var $nextlen_0;
      var $n_0;
      var $count_0;
      if (($n_0 | 0) > ($max_code | 0)) {
        break $for_cond_outer$56;
      }
      var $add7 = $n_0 + 1 | 0;
      var $1 = HEAPU16[$tree + ($add7 << 2) + 2 >> 1];
      var $conv11 = $1 & 65535;
      var $inc = $count_0 + 1 | 0;
      var $cmp14 = ($nextlen_0 | 0) == ($conv11 | 0);
      if (!(($inc | 0) < ($max_count_1_ph | 0) & $cmp14)) {
        break;
      }
      var $count_0 = $inc;
      var $n_0 = $add7;
      var $nextlen_0 = $conv11;
    }
    if (($inc | 0) < ($min_count_1_ph | 0)) {
      var $freq = ($nextlen_0 << 2) + $s + 2684 | 0;
      HEAP16[$freq >> 1] = (HEAPU16[$freq >> 1] & 65535) + $inc & 65535;
    } else {
      if (($nextlen_0 | 0) == 0) {
        if (($inc | 0) < 11) {
          var $inc50 = HEAP16[$freq49 >> 1] + 1 & 65535;
          HEAP16[$freq49 >> 1] = $inc50;
        } else {
          var $inc56 = HEAP16[$freq55 >> 1] + 1 & 65535;
          HEAP16[$freq55 >> 1] = $inc56;
        }
      } else {
        if (($nextlen_0 | 0) != ($prevlen_0_ph | 0)) {
          var $freq34 = ($nextlen_0 << 2) + $s + 2684 | 0;
          var $inc35 = HEAP16[$freq34 >> 1] + 1 & 65535;
          HEAP16[$freq34 >> 1] = $inc35;
        }
        var $inc41 = HEAP16[$freq40 >> 1] + 1 & 65535;
        HEAP16[$freq40 >> 1] = $inc41;
      }
    }
    if ($1 << 16 >> 16 == 0) {
      var $min_count_1_ph = 3;
      var $max_count_1_ph = 138;
      var $n_0_ph = $add7;
      var $prevlen_0_ph = $nextlen_0;
      var $nextlen_0_ph = $conv11;
      continue;
    }
    var $_ = $cmp14 ? 6 : 7;
    var $_1 = $cmp14 ? 3 : 4;
    var $min_count_1_ph = $_1;
    var $max_count_1_ph = $_;
    var $n_0_ph = $add7;
    var $prevlen_0_ph = $nextlen_0;
    var $nextlen_0_ph = $conv11;
  }
  return;
  return;
}

_scan_tree["X"] = 1;

function _pqdownheap($s, $tree, $k) {
  var $s$s2 = $s >> 2;
  var $0 = HEAPU32[(($k << 2) + 2908 >> 2) + $s$s2];
  var $arrayidx69 = $s + ($0 + 5208) | 0;
  var $heap_len = $s + 5200 | 0;
  var $freq44 = ($0 << 2) + $tree | 0;
  var $k_addr_0 = $k;
  while (1) {
    var $k_addr_0;
    var $j_0 = $k_addr_0 << 1;
    var $1 = HEAP32[$heap_len >> 2];
    if (($j_0 | 0) > ($1 | 0)) {
      break;
    }
    var $cmp2 = ($j_0 | 0) < ($1 | 0);
    do {
      if ($cmp2) {
        var $add1 = $j_0 | 1;
        var $2 = HEAPU32[(($add1 << 2) + 2908 >> 2) + $s$s2];
        var $3 = HEAPU16[$tree + ($2 << 2) >> 1];
        var $4 = HEAPU32[(($j_0 << 2) + 2908 >> 2) + $s$s2];
        var $5 = HEAPU16[$tree + ($4 << 2) >> 1];
        if (($3 & 65535) >= ($5 & 65535)) {
          if ($3 << 16 >> 16 != $5 << 16 >> 16) {
            var $j_1 = $j_0;
            break;
          }
          if ((HEAPU8[$s + ($2 + 5208) | 0] & 255) > (HEAPU8[$s + ($4 + 5208) | 0] & 255)) {
            var $j_1 = $j_0;
            break;
          }
        }
        var $j_1 = $add1;
      } else {
        var $j_1 = $j_0;
      }
    } while (0);
    var $j_1;
    var $8 = HEAPU16[$freq44 >> 1];
    var $9 = HEAPU32[(($j_1 << 2) + 2908 >> 2) + $s$s2];
    var $10 = HEAPU16[$tree + ($9 << 2) >> 1];
    if (($8 & 65535) < ($10 & 65535)) {
      break;
    }
    if ($8 << 16 >> 16 == $10 << 16 >> 16) {
      if ((HEAPU8[$arrayidx69] & 255) <= (HEAPU8[$s + ($9 + 5208) | 0] & 255)) {
        break;
      }
    }
    HEAP32[(($k_addr_0 << 2) + 2908 >> 2) + $s$s2] = $9;
    var $k_addr_0 = $j_1;
  }
  HEAP32[(($k_addr_0 << 2) + 2908 >> 2) + $s$s2] = $0;
  return;
  return;
}

_pqdownheap["X"] = 1;

function _gen_bitlen($s, $desc_0_0_val, $desc_0_1_val, $desc_0_2_val) {
  var $opt_len$s2;
  var $desc_0_0_val$s1 = $desc_0_0_val >> 1;
  var $0 = HEAPU32[$desc_0_2_val >> 2];
  var $1 = HEAPU32[$desc_0_2_val + 4 >> 2];
  var $2 = HEAPU32[$desc_0_2_val + 8 >> 2];
  var $3 = HEAPU32[$desc_0_2_val + 16 >> 2];
  var $scevgep19 = $s + 2876 | 0;
  _memset($scevgep19, 0, 32, 2);
  var $heap_max = $s + 5204 | 0;
  HEAP16[((HEAP32[$s + (HEAP32[$heap_max >> 2] << 2) + 2908 >> 2] << 2) + 2 >> 1) + $desc_0_0_val$s1] = 0;
  var $h_06 = HEAP32[$heap_max >> 2] + 1 | 0;
  var $cmp107 = ($h_06 | 0) < 573;
  $for_body11_lr_ph$$for_end127$94 : do {
    if ($cmp107) {
      var $opt_len$s2 = ($s + 5800 | 0) >> 2;
      var $tobool = ($0 | 0) == 0;
      var $static_len = $s + 5804 | 0;
      $for_body11_us$$for_body11$96 : do {
        if ($tobool) {
          var $overflow_08_us = 0;
          var $h_09_us = $h_06;
          while (1) {
            var $h_09_us;
            var $overflow_08_us;
            var $7 = HEAPU32[$s + ($h_09_us << 2) + 2908 >> 2];
            var $dad_us = ($7 << 2) + $desc_0_0_val + 2 | 0;
            var $add19_us = (HEAPU16[(((HEAPU16[$dad_us >> 1] & 65535) << 2) + 2 >> 1) + $desc_0_0_val$s1] & 65535) + 1 | 0;
            var $cmp20_us = ($add19_us | 0) > ($3 | 0);
            var $inc22_overflow_0_us = ($cmp20_us & 1) + $overflow_08_us | 0;
            var $bits_1_us = $cmp20_us ? $3 : $add19_us;
            HEAP16[$dad_us >> 1] = $bits_1_us & 65535;
            if (($7 | 0) <= ($desc_0_1_val | 0)) {
              var $arrayidx32_us = ($bits_1_us << 1) + $s + 2876 | 0;
              var $inc33_us = HEAP16[$arrayidx32_us >> 1] + 1 & 65535;
              HEAP16[$arrayidx32_us >> 1] = $inc33_us;
              if (($7 | 0) < ($2 | 0)) {
                var $xbits_0_us = 0;
              } else {
                var $xbits_0_us = HEAP32[$1 + ($7 - $2 << 2) >> 2];
              }
              var $xbits_0_us;
              var $add42_us = (HEAPU16[($7 << 2 >> 1) + $desc_0_0_val$s1] & 65535) * ($xbits_0_us + $bits_1_us) + HEAP32[$opt_len$s2] | 0;
              HEAP32[$opt_len$s2] = $add42_us;
            }
            var $h_0_us = $h_09_us + 1 | 0;
            if (($h_0_us | 0) == 573) {
              var $overflow_0_lcssa = $inc22_overflow_0_us;
              break $for_body11_us$$for_body11$96;
            }
            var $overflow_08_us = $inc22_overflow_0_us;
            var $h_09_us = $h_0_us;
          }
        } else {
          var $overflow_08 = 0;
          var $h_09 = $h_06;
          while (1) {
            var $h_09;
            var $overflow_08;
            var $14 = HEAPU32[$s + ($h_09 << 2) + 2908 >> 2];
            var $dad = ($14 << 2) + $desc_0_0_val + 2 | 0;
            var $add19 = (HEAPU16[(((HEAPU16[$dad >> 1] & 65535) << 2) + 2 >> 1) + $desc_0_0_val$s1] & 65535) + 1 | 0;
            var $cmp20 = ($add19 | 0) > ($3 | 0);
            var $inc22_overflow_0 = ($cmp20 & 1) + $overflow_08 | 0;
            var $bits_1 = $cmp20 ? $3 : $add19;
            HEAP16[$dad >> 1] = $bits_1 & 65535;
            if (($14 | 0) <= ($desc_0_1_val | 0)) {
              var $arrayidx32 = ($bits_1 << 1) + $s + 2876 | 0;
              var $inc33 = HEAP16[$arrayidx32 >> 1] + 1 & 65535;
              HEAP16[$arrayidx32 >> 1] = $inc33;
              if (($14 | 0) < ($2 | 0)) {
                var $xbits_0 = 0;
              } else {
                var $xbits_0 = HEAP32[$1 + ($14 - $2 << 2) >> 2];
              }
              var $xbits_0;
              var $conv40 = HEAPU16[($14 << 2 >> 1) + $desc_0_0_val$s1] & 65535;
              var $add42 = $conv40 * ($xbits_0 + $bits_1) + HEAP32[$opt_len$s2] | 0;
              HEAP32[$opt_len$s2] = $add42;
              var $add51 = ((HEAPU16[$0 + ($14 << 2) + 2 >> 1] & 65535) + $xbits_0) * $conv40 + HEAP32[$static_len >> 2] | 0;
              HEAP32[$static_len >> 2] = $add51;
            }
            var $h_0 = $h_09 + 1 | 0;
            if (($h_0 | 0) == 573) {
              var $overflow_0_lcssa = $inc22_overflow_0;
              break $for_body11_us$$for_body11$96;
            }
            var $overflow_08 = $inc22_overflow_0;
            var $h_09 = $h_0;
          }
        }
      } while (0);
      var $overflow_0_lcssa;
      if (($overflow_0_lcssa | 0) == 0) {
        break;
      }
      var $arrayidx76 = ($3 << 1) + $s + 2876 | 0;
      var $overflow_2 = $overflow_0_lcssa;
      while (1) {
        var $overflow_2;
        var $bits_2_in = $3;
        while (1) {
          var $bits_2_in;
          var $bits_2 = $bits_2_in - 1 | 0;
          var $arrayidx62 = ($bits_2 << 1) + $s + 2876 | 0;
          var $23 = HEAP16[$arrayidx62 >> 1];
          if ($23 << 16 >> 16 != 0) {
            break;
          }
          var $bits_2_in = $bits_2;
        }
        var $dec68 = $23 - 1 & 65535;
        HEAP16[$arrayidx62 >> 1] = $dec68;
        var $arrayidx71 = ($bits_2_in << 1) + $s + 2876 | 0;
        var $add73 = HEAP16[$arrayidx71 >> 1] + 2 & 65535;
        HEAP16[$arrayidx71 >> 1] = $add73;
        var $dec77 = HEAP16[$arrayidx76 >> 1] - 1 & 65535;
        HEAP16[$arrayidx76 >> 1] = $dec77;
        var $sub78 = $overflow_2 - 2 | 0;
        if (($sub78 | 0) <= 0) {
          break;
        }
        var $overflow_2 = $sub78;
      }
      if (($3 | 0) == 0) {
        break;
      }
      var $h_13 = 573;
      var $bits_34 = $3;
      var $26 = $dec77;
      while (1) {
        var $26;
        var $bits_34;
        var $h_13;
        var $conv118 = $bits_34 & 65535;
        var $n_0_ph = $26 & 65535;
        var $h_2_ph = $h_13;
        while (1) {
          var $h_2_ph;
          var $n_0_ph;
          if (($n_0_ph | 0) == 0) {
            break;
          }
          var $h_2 = $h_2_ph;
          while (1) {
            var $h_2;
            var $dec92 = $h_2 - 1 | 0;
            var $27 = HEAPU32[$s + ($dec92 << 2) + 2908 >> 2];
            if (($27 | 0) <= ($desc_0_1_val | 0)) {
              break;
            }
            var $h_2 = $dec92;
          }
          var $len101 = ($27 << 2) + $desc_0_0_val + 2 | 0;
          var $conv102 = HEAPU16[$len101 >> 1] & 65535;
          if (($conv102 | 0) != ($bits_34 | 0)) {
            var $add117 = (HEAPU16[($27 << 2 >> 1) + $desc_0_0_val$s1] & 65535) * ($bits_34 - $conv102) + HEAP32[$opt_len$s2] | 0;
            HEAP32[$opt_len$s2] = $add117;
            HEAP16[$len101 >> 1] = $conv118;
          }
          var $n_0_ph = $n_0_ph - 1 | 0;
          var $h_2_ph = $dec92;
        }
        var $dec126 = $bits_34 - 1 | 0;
        if (($dec126 | 0) == 0) {
          break $for_body11_lr_ph$$for_end127$94;
        }
        var $_pre = HEAP16[$s + ($dec126 << 1) + 2876 >> 1];
        var $h_13 = $h_2_ph;
        var $bits_34 = $dec126;
        var $26 = $_pre;
      }
    }
  } while (0);
  return;
  return;
}

_gen_bitlen["X"] = 1;

function _bi_reverse($code, $len) {
  var $code_addr_0 = $code;
  var $len_addr_0 = $len;
  var $res_0 = 0;
  while (1) {
    var $res_0;
    var $len_addr_0;
    var $code_addr_0;
    var $or = $code_addr_0 & 1 | $res_0;
    var $shl = $or << 1;
    var $dec = $len_addr_0 - 1 | 0;
    if (($dec | 0) <= 0) {
      break;
    }
    var $code_addr_0 = $code_addr_0 >>> 1;
    var $len_addr_0 = $dec;
    var $res_0 = $shl;
  }
  return $or & 2147483647;
  return null;
}

function _adler32($adler, $buf, $len) {
  var __label__;
  var $shr = $adler >>> 16;
  var $and1 = $adler & 65535;
  var $cmp = ($len | 0) == 1;
  do {
    if ($cmp) {
      var $add = (HEAPU8[$buf] & 255) + $and1 | 0;
      var $sub_add = $add >>> 0 > 65520 ? $add - 65521 | 0 : $add;
      var $add5 = $sub_add + $shr | 0;
      var $sum2_0 = $add5 >>> 0 > 65520 ? $add5 + 15 | 0 : $add5;
      var $retval_0 = $sum2_0 << 16 | $sub_add;
    } else {
      if (($buf | 0) == 0) {
        var $retval_0 = 1;
        break;
      }
      if ($len >>> 0 < 16) {
        var $tobool25 = ($len | 0) == 0;
        $while_end$$while_body$21 : do {
          if ($tobool25) {
            var $sum2_1_lcssa = $shr;
            var $adler_addr_1_lcssa = $and1;
          } else {
            var $sum2_126 = $shr;
            var $len_addr_027 = $len;
            var $buf_addr_028 = $buf;
            var $adler_addr_129 = $and1;
            while (1) {
              var $adler_addr_129;
              var $buf_addr_028;
              var $len_addr_027;
              var $sum2_126;
              var $dec = $len_addr_027 - 1 | 0;
              var $add20 = (HEAPU8[$buf_addr_028] & 255) + $adler_addr_129 | 0;
              var $add21 = $add20 + $sum2_126 | 0;
              if (($dec | 0) == 0) {
                var $sum2_1_lcssa = $add21;
                var $adler_addr_1_lcssa = $add20;
                break $while_end$$while_body$21;
              }
              var $sum2_126 = $add21;
              var $len_addr_027 = $dec;
              var $buf_addr_028 = $buf_addr_028 + 1 | 0;
              var $adler_addr_129 = $add20;
            }
          }
        } while (0);
        var $adler_addr_1_lcssa;
        var $sum2_1_lcssa;
        var $sub25_adler_addr_1 = $adler_addr_1_lcssa >>> 0 > 65520 ? $adler_addr_1_lcssa - 65521 | 0 : $adler_addr_1_lcssa;
        var $retval_0 = ($sum2_1_lcssa >>> 0) % 65521 << 16 | $sub25_adler_addr_1;
      } else {
        var $cmp3116 = $len >>> 0 > 5551;
        do {
          if ($cmp3116) {
            var $sum2_217 = $shr;
            var $len_addr_118 = $len;
            var $buf_addr_119 = $buf;
            var $adler_addr_320 = $and1;
            while (1) {
              var $adler_addr_320;
              var $buf_addr_119;
              var $len_addr_118;
              var $sum2_217;
              var $sub34 = $len_addr_118 - 5552 | 0;
              var $adler_addr_4 = $adler_addr_320;
              var $buf_addr_2 = $buf_addr_119;
              var $sum2_3 = $sum2_217;
              var $n_0 = 347;
              while (1) {
                var $n_0;
                var $sum2_3;
                var $buf_addr_2;
                var $adler_addr_4;
                var $add37 = (HEAPU8[$buf_addr_2] & 255) + $adler_addr_4 | 0;
                var $add41 = $add37 + (HEAPU8[$buf_addr_2 + 1 | 0] & 255) | 0;
                var $add45 = $add41 + (HEAPU8[$buf_addr_2 + 2 | 0] & 255) | 0;
                var $add49 = $add45 + (HEAPU8[$buf_addr_2 + 3 | 0] & 255) | 0;
                var $add53 = $add49 + (HEAPU8[$buf_addr_2 + 4 | 0] & 255) | 0;
                var $add57 = $add53 + (HEAPU8[$buf_addr_2 + 5 | 0] & 255) | 0;
                var $add61 = $add57 + (HEAPU8[$buf_addr_2 + 6 | 0] & 255) | 0;
                var $add65 = $add61 + (HEAPU8[$buf_addr_2 + 7 | 0] & 255) | 0;
                var $add69 = $add65 + (HEAPU8[$buf_addr_2 + 8 | 0] & 255) | 0;
                var $add73 = $add69 + (HEAPU8[$buf_addr_2 + 9 | 0] & 255) | 0;
                var $add77 = $add73 + (HEAPU8[$buf_addr_2 + 10 | 0] & 255) | 0;
                var $add81 = $add77 + (HEAPU8[$buf_addr_2 + 11 | 0] & 255) | 0;
                var $add85 = $add81 + (HEAPU8[$buf_addr_2 + 12 | 0] & 255) | 0;
                var $add89 = $add85 + (HEAPU8[$buf_addr_2 + 13 | 0] & 255) | 0;
                var $add93 = $add89 + (HEAPU8[$buf_addr_2 + 14 | 0] & 255) | 0;
                var $add97 = $add93 + (HEAPU8[$buf_addr_2 + 15 | 0] & 255) | 0;
                var $add98 = $add37 + $sum2_3 + $add41 + $add45 + $add49 + $add53 + $add57 + $add61 + $add65 + $add69 + $add73 + $add77 + $add81 + $add85 + $add89 + $add93 + $add97 | 0;
                var $dec99 = $n_0 - 1 | 0;
                if (($dec99 | 0) == 0) {
                  break;
                }
                var $adler_addr_4 = $add97;
                var $buf_addr_2 = $buf_addr_2 + 16 | 0;
                var $sum2_3 = $add98;
                var $n_0 = $dec99;
              }
              var $scevgep = $buf_addr_119 + 5552 | 0;
              var $rem101 = ($add97 >>> 0) % 65521;
              var $rem102 = ($add98 >>> 0) % 65521;
              if ($sub34 >>> 0 <= 5551) {
                break;
              }
              var $sum2_217 = $rem102;
              var $len_addr_118 = $sub34;
              var $buf_addr_119 = $scevgep;
              var $adler_addr_320 = $rem101;
            }
            if (($sub34 | 0) == 0) {
              var $adler_addr_7 = $rem101;
              var $sum2_6 = $rem102;
              __label__ = 17;
              break;
            }
            if ($sub34 >>> 0 > 15) {
              var $sum2_48 = $rem102;
              var $len_addr_29 = $sub34;
              var $buf_addr_310 = $scevgep;
              var $adler_addr_511 = $rem101;
              __label__ = 14;
              break;
            }
            var $sum2_52 = $rem102;
            var $len_addr_33 = $sub34;
            var $buf_addr_44 = $scevgep;
            var $adler_addr_65 = $rem101;
            __label__ = 15;
            break;
          } else {
            var $sum2_48 = $shr;
            var $len_addr_29 = $len;
            var $buf_addr_310 = $buf;
            var $adler_addr_511 = $and1;
            __label__ = 14;
          }
        } while (0);
        do {
          if (__label__ == 14) {
            while (1) {
              var $adler_addr_511;
              var $buf_addr_310;
              var $len_addr_29;
              var $sum2_48;
              var $sub110 = $len_addr_29 - 16 | 0;
              var $add113 = (HEAPU8[$buf_addr_310] & 255) + $adler_addr_511 | 0;
              var $add117 = $add113 + (HEAPU8[$buf_addr_310 + 1 | 0] & 255) | 0;
              var $add121 = $add117 + (HEAPU8[$buf_addr_310 + 2 | 0] & 255) | 0;
              var $add125 = $add121 + (HEAPU8[$buf_addr_310 + 3 | 0] & 255) | 0;
              var $add129 = $add125 + (HEAPU8[$buf_addr_310 + 4 | 0] & 255) | 0;
              var $add133 = $add129 + (HEAPU8[$buf_addr_310 + 5 | 0] & 255) | 0;
              var $add137 = $add133 + (HEAPU8[$buf_addr_310 + 6 | 0] & 255) | 0;
              var $add141 = $add137 + (HEAPU8[$buf_addr_310 + 7 | 0] & 255) | 0;
              var $add145 = $add141 + (HEAPU8[$buf_addr_310 + 8 | 0] & 255) | 0;
              var $add149 = $add145 + (HEAPU8[$buf_addr_310 + 9 | 0] & 255) | 0;
              var $add153 = $add149 + (HEAPU8[$buf_addr_310 + 10 | 0] & 255) | 0;
              var $add157 = $add153 + (HEAPU8[$buf_addr_310 + 11 | 0] & 255) | 0;
              var $add161 = $add157 + (HEAPU8[$buf_addr_310 + 12 | 0] & 255) | 0;
              var $add165 = $add161 + (HEAPU8[$buf_addr_310 + 13 | 0] & 255) | 0;
              var $add169 = $add165 + (HEAPU8[$buf_addr_310 + 14 | 0] & 255) | 0;
              var $add173 = $add169 + (HEAPU8[$buf_addr_310 + 15 | 0] & 255) | 0;
              var $add174 = $add113 + $sum2_48 + $add117 + $add121 + $add125 + $add129 + $add133 + $add137 + $add141 + $add145 + $add149 + $add153 + $add157 + $add161 + $add165 + $add169 + $add173 | 0;
              var $add_ptr175 = $buf_addr_310 + 16 | 0;
              if ($sub110 >>> 0 <= 15) {
                break;
              }
              var $sum2_48 = $add174;
              var $len_addr_29 = $sub110;
              var $buf_addr_310 = $add_ptr175;
              var $adler_addr_511 = $add173;
            }
            if (($sub110 | 0) == 0) {
              var $sum2_5_lcssa = $add174;
              var $adler_addr_6_lcssa = $add173;
              __label__ = 16;
              break;
            }
            var $sum2_52 = $add174;
            var $len_addr_33 = $sub110;
            var $buf_addr_44 = $add_ptr175;
            var $adler_addr_65 = $add173;
            __label__ = 15;
            break;
          }
        } while (0);
        $if_end188$$while_end185$$while_body180$38 : do {
          if (__label__ == 15) {
            while (1) {
              var $adler_addr_65;
              var $buf_addr_44;
              var $len_addr_33;
              var $sum2_52;
              var $dec178 = $len_addr_33 - 1 | 0;
              var $add183 = (HEAPU8[$buf_addr_44] & 255) + $adler_addr_65 | 0;
              var $add184 = $add183 + $sum2_52 | 0;
              if (($dec178 | 0) == 0) {
                var $sum2_5_lcssa = $add184;
                var $adler_addr_6_lcssa = $add183;
                __label__ = 16;
                break $if_end188$$while_end185$$while_body180$38;
              }
              var $sum2_52 = $add184;
              var $len_addr_33 = $dec178;
              var $buf_addr_44 = $buf_addr_44 + 1 | 0;
              var $adler_addr_65 = $add183;
            }
          }
        } while (0);
        if (__label__ == 16) {
          var $adler_addr_6_lcssa;
          var $sum2_5_lcssa;
          var $adler_addr_7 = ($adler_addr_6_lcssa >>> 0) % 65521;
          var $sum2_6 = ($sum2_5_lcssa >>> 0) % 65521;
        }
        var $sum2_6;
        var $adler_addr_7;
        var $retval_0 = $adler_addr_7 | $sum2_6 << 16;
      }
    }
  } while (0);
  var $retval_0;
  return $retval_0;
  return null;
}

_adler32["X"] = 1;

function _crc32_little($crc, $buf, $len) {
  var $buf4_010$s2;
  var __label__;
  var $buf_addr_0 = $buf;
  var $len_addr_0 = $len;
  var $c_0 = $crc ^ -1;
  while (1) {
    var $c_0;
    var $len_addr_0;
    var $buf_addr_0;
    if (($len_addr_0 | 0) == 0) {
      var $c_4 = $c_0;
      __label__ = 11;
      break;
    }
    if (($buf_addr_0 & 3 | 0) == 0) {
      __label__ = 4;
      break;
    }
    var $xor3 = HEAP32[_crc_table + ((HEAPU8[$buf_addr_0] & 255 ^ $c_0 & 255) << 2) >> 2] ^ $c_0 >>> 8;
    var $buf_addr_0 = $buf_addr_0 + 1 | 0;
    var $len_addr_0 = $len_addr_0 - 1 | 0;
    var $c_0 = $xor3;
  }
  $while_end$$if_end$54 : do {
    if (__label__ == 4) {
      var $3 = $buf_addr_0;
      var $cmp7 = $len_addr_0 >>> 0 > 31;
      $while_body6$$while_cond128_preheader$56 : do {
        if ($cmp7) {
          var $c_18 = $c_0;
          var $len_addr_19 = $len_addr_0;
          var $buf4_010 = $3, $buf4_010$s2 = $buf4_010 >> 2;
          while (1) {
            var $buf4_010;
            var $len_addr_19;
            var $c_18;
            var $xor8 = HEAP32[$buf4_010$s2] ^ $c_18;
            var $xor23 = HEAP32[_crc_table + (($xor8 >>> 8 & 255) << 2) + 2048 >> 2] ^ HEAP32[_crc_table + (($xor8 & 255) << 2) + 3072 >> 2] ^ HEAP32[_crc_table + (($xor8 >>> 16 & 255) << 2) + 1024 >> 2] ^ HEAP32[_crc_table + ($xor8 >>> 24 << 2) >> 2] ^ HEAP32[$buf4_010$s2 + 1];
            var $xor38 = HEAP32[_crc_table + (($xor23 >>> 8 & 255) << 2) + 2048 >> 2] ^ HEAP32[_crc_table + (($xor23 & 255) << 2) + 3072 >> 2] ^ HEAP32[_crc_table + (($xor23 >>> 16 & 255) << 2) + 1024 >> 2] ^ HEAP32[_crc_table + ($xor23 >>> 24 << 2) >> 2] ^ HEAP32[$buf4_010$s2 + 2];
            var $xor53 = HEAP32[_crc_table + (($xor38 >>> 8 & 255) << 2) + 2048 >> 2] ^ HEAP32[_crc_table + (($xor38 & 255) << 2) + 3072 >> 2] ^ HEAP32[_crc_table + (($xor38 >>> 16 & 255) << 2) + 1024 >> 2] ^ HEAP32[_crc_table + ($xor38 >>> 24 << 2) >> 2] ^ HEAP32[$buf4_010$s2 + 3];
            var $xor68 = HEAP32[_crc_table + (($xor53 >>> 8 & 255) << 2) + 2048 >> 2] ^ HEAP32[_crc_table + (($xor53 & 255) << 2) + 3072 >> 2] ^ HEAP32[_crc_table + (($xor53 >>> 16 & 255) << 2) + 1024 >> 2] ^ HEAP32[_crc_table + ($xor53 >>> 24 << 2) >> 2] ^ HEAP32[$buf4_010$s2 + 4];
            var $xor83 = HEAP32[_crc_table + (($xor68 >>> 8 & 255) << 2) + 2048 >> 2] ^ HEAP32[_crc_table + (($xor68 & 255) << 2) + 3072 >> 2] ^ HEAP32[_crc_table + (($xor68 >>> 16 & 255) << 2) + 1024 >> 2] ^ HEAP32[_crc_table + ($xor68 >>> 24 << 2) >> 2] ^ HEAP32[$buf4_010$s2 + 5];
            var $xor98 = HEAP32[_crc_table + (($xor83 >>> 8 & 255) << 2) + 2048 >> 2] ^ HEAP32[_crc_table + (($xor83 & 255) << 2) + 3072 >> 2] ^ HEAP32[_crc_table + (($xor83 >>> 16 & 255) << 2) + 1024 >> 2] ^ HEAP32[_crc_table + ($xor83 >>> 24 << 2) >> 2] ^ HEAP32[$buf4_010$s2 + 6];
            var $incdec_ptr112 = $buf4_010 + 32 | 0;
            var $xor113 = HEAP32[_crc_table + (($xor98 >>> 8 & 255) << 2) + 2048 >> 2] ^ HEAP32[_crc_table + (($xor98 & 255) << 2) + 3072 >> 2] ^ HEAP32[_crc_table + (($xor98 >>> 16 & 255) << 2) + 1024 >> 2] ^ HEAP32[_crc_table + ($xor98 >>> 24 << 2) >> 2] ^ HEAP32[$buf4_010$s2 + 7];
            var $xor126 = HEAP32[_crc_table + (($xor113 >>> 8 & 255) << 2) + 2048 >> 2] ^ HEAP32[_crc_table + (($xor113 & 255) << 2) + 3072 >> 2] ^ HEAP32[_crc_table + (($xor113 >>> 16 & 255) << 2) + 1024 >> 2] ^ HEAP32[_crc_table + ($xor113 >>> 24 << 2) >> 2];
            var $sub = $len_addr_19 - 32 | 0;
            if ($sub >>> 0 <= 31) {
              var $c_1_lcssa = $xor126;
              var $len_addr_1_lcssa = $sub;
              var $buf4_0_lcssa = $incdec_ptr112;
              break $while_body6$$while_cond128_preheader$56;
            }
            var $c_18 = $xor126;
            var $len_addr_19 = $sub;
            var $buf4_010 = $incdec_ptr112, $buf4_010$s2 = $buf4_010 >> 2;
          }
        } else {
          var $c_1_lcssa = $c_0;
          var $len_addr_1_lcssa = $len_addr_0;
          var $buf4_0_lcssa = $3;
        }
      } while (0);
      var $buf4_0_lcssa;
      var $len_addr_1_lcssa;
      var $c_1_lcssa;
      var $cmp1291 = $len_addr_1_lcssa >>> 0 > 3;
      $while_body131$$while_end148$60 : do {
        if ($cmp1291) {
          var $c_22 = $c_1_lcssa;
          var $len_addr_23 = $len_addr_1_lcssa;
          var $buf4_14 = $buf4_0_lcssa;
          while (1) {
            var $buf4_14;
            var $len_addr_23;
            var $c_22;
            var $incdec_ptr132 = $buf4_14 + 4 | 0;
            var $xor133 = HEAP32[$buf4_14 >> 2] ^ $c_22;
            var $xor146 = HEAP32[_crc_table + (($xor133 >>> 8 & 255) << 2) + 2048 >> 2] ^ HEAP32[_crc_table + (($xor133 & 255) << 2) + 3072 >> 2] ^ HEAP32[_crc_table + (($xor133 >>> 16 & 255) << 2) + 1024 >> 2] ^ HEAP32[_crc_table + ($xor133 >>> 24 << 2) >> 2];
            var $sub147 = $len_addr_23 - 4 | 0;
            if ($sub147 >>> 0 <= 3) {
              var $c_2_lcssa = $xor146;
              var $len_addr_2_lcssa = $sub147;
              var $buf4_1_lcssa = $incdec_ptr132;
              break $while_body131$$while_end148$60;
            }
            var $c_22 = $xor146;
            var $len_addr_23 = $sub147;
            var $buf4_14 = $incdec_ptr132;
          }
        } else {
          var $c_2_lcssa = $c_1_lcssa;
          var $len_addr_2_lcssa = $len_addr_1_lcssa;
          var $buf4_1_lcssa = $buf4_0_lcssa;
        }
      } while (0);
      var $buf4_1_lcssa;
      var $len_addr_2_lcssa;
      var $c_2_lcssa;
      if (($len_addr_2_lcssa | 0) == 0) {
        var $c_4 = $c_2_lcssa;
        break;
      }
      var $buf_addr_1 = $buf4_1_lcssa;
      var $len_addr_3 = $len_addr_2_lcssa;
      var $c_3 = $c_2_lcssa;
      while (1) {
        var $c_3;
        var $len_addr_3;
        var $buf_addr_1;
        var $xor156 = HEAP32[_crc_table + ((HEAPU8[$buf_addr_1] & 255 ^ $c_3 & 255) << 2) >> 2] ^ $c_3 >>> 8;
        var $dec157 = $len_addr_3 - 1 | 0;
        if (($dec157 | 0) == 0) {
          var $c_4 = $xor156;
          break $while_end$$if_end$54;
        }
        var $buf_addr_1 = $buf_addr_1 + 1 | 0;
        var $len_addr_3 = $dec157;
        var $c_3 = $xor156;
      }
    }
  } while (0);
  var $c_4;
  return $c_4 ^ -1;
  return null;
}

_crc32_little["X"] = 1;

function _gen_codes($tree, $max_code, $bl_count) {
  var $next_code$s1;
  var $bl_count$s1 = $bl_count >> 1;
  var __stackBase__ = STACKTOP;
  STACKTOP += 32;
  var $next_code = __stackBase__, $next_code$s1 = $next_code >> 1;
  var $shl = HEAP16[$bl_count$s1] << 1;
  HEAP16[$next_code$s1 + 1] = $shl;
  var $shl_1 = (HEAP16[$bl_count$s1 + 1] + $shl & 65535) << 1;
  HEAP16[$next_code$s1 + 2] = $shl_1;
  var $shl_2 = (HEAP16[$bl_count$s1 + 2] + $shl_1 & 65535) << 1;
  HEAP16[$next_code$s1 + 3] = $shl_2;
  var $shl_3 = (HEAP16[$bl_count$s1 + 3] + $shl_2 & 65535) << 1;
  HEAP16[$next_code$s1 + 4] = $shl_3;
  var $shl_4 = (HEAP16[$bl_count$s1 + 4] + $shl_3 & 65535) << 1;
  HEAP16[$next_code$s1 + 5] = $shl_4;
  var $shl_5 = (HEAP16[$bl_count$s1 + 5] + $shl_4 & 65535) << 1;
  HEAP16[$next_code$s1 + 6] = $shl_5;
  var $shl_6 = (HEAP16[$bl_count$s1 + 6] + $shl_5 & 65535) << 1;
  HEAP16[$next_code$s1 + 7] = $shl_6;
  var $shl_7 = (HEAP16[$bl_count$s1 + 7] + $shl_6 & 65535) << 1;
  HEAP16[$next_code$s1 + 8] = $shl_7;
  var $shl_8 = (HEAP16[$bl_count$s1 + 8] + $shl_7 & 65535) << 1;
  HEAP16[$next_code$s1 + 9] = $shl_8;
  var $shl_9 = (HEAP16[$bl_count$s1 + 9] + $shl_8 & 65535) << 1;
  HEAP16[$next_code$s1 + 10] = $shl_9;
  var $shl_10 = (HEAP16[$bl_count$s1 + 10] + $shl_9 & 65535) << 1;
  HEAP16[$next_code$s1 + 11] = $shl_10;
  var $shl_11 = (HEAP16[$bl_count$s1 + 11] + $shl_10 & 65535) << 1;
  HEAP16[$next_code$s1 + 12] = $shl_11;
  var $shl_12 = (HEAP16[$bl_count$s1 + 12] + $shl_11 & 65535) << 1;
  HEAP16[$next_code$s1 + 13] = $shl_12;
  var $shl_13 = (HEAP16[$bl_count$s1 + 13] + $shl_12 & 65535) << 1;
  HEAP16[$next_code$s1 + 14] = $shl_13;
  var $shl_14 = (HEAP16[$bl_count$s1 + 14] + $shl_13 & 65535) << 1;
  HEAP16[$next_code$s1 + 15] = $shl_14;
  var $cmp51 = ($max_code | 0) < 0;
  $for_end21$$for_body7_lr_ph$2 : do {
    if (!$cmp51) {
      var $15 = $max_code + 1 | 0;
      var $n_02 = 0;
      while (1) {
        var $n_02;
        var $16 = HEAPU16[$tree + ($n_02 << 2) + 2 >> 1];
        var $conv10 = $16 & 65535;
        if ($16 << 16 >> 16 != 0) {
          var $arrayidx13 = ($conv10 << 1) + $next_code | 0;
          var $17 = HEAPU16[$arrayidx13 >> 1];
          HEAP16[$arrayidx13 >> 1] = $17 + 1 & 65535;
          var $conv15 = $17 & 65535;
          var $call = _bi_reverse($conv15, $conv10);
          HEAP16[$tree + ($n_02 << 2) >> 1] = $call & 65535;
        }
        var $inc20 = $n_02 + 1 | 0;
        if (($inc20 | 0) == ($15 | 0)) {
          break $for_end21$$for_body7_lr_ph$2;
        }
        var $n_02 = $inc20;
      }
    }
  } while (0);
  STACKTOP = __stackBase__;
  return;
  return;
}

_gen_codes["X"] = 1;

function _crc32($crc, $buf, $len) {
  if (($buf | 0) == 0) {
    var $retval_0 = 0;
  } else {
    var $call = _crc32_little($crc, $buf, $len);
    var $retval_0 = $call;
  }
  var $retval_0;
  return $retval_0;
  return null;
}

function _inflate_table($type, $lens, $codes, $table, $bits, $work) {
  var $offs$s1;
  var $count$s1;
  var $table$s2 = $table >> 2;
  var __stackBase__ = STACKTOP;
  STACKTOP += 32;
  var __label__;
  var $count = __stackBase__, $count$s1 = $count >> 1;
  var $count89 = $count;
  var $offs = STACKTOP, $offs$s1 = $offs >> 1;
  STACKTOP += 32;
  _memset($count89, 0, 32, 2);
  var $cmp269 = ($codes | 0) == 0;
  $for_end9$$for_body3$2 : do {
    if (!$cmp269) {
      var $sym_070 = 0;
      while (1) {
        var $sym_070;
        var $arrayidx5 = ((HEAPU16[$lens + ($sym_070 << 1) >> 1] & 65535) << 1) + $count | 0;
        var $inc6 = HEAP16[$arrayidx5 >> 1] + 1 & 65535;
        HEAP16[$arrayidx5 >> 1] = $inc6;
        var $inc8 = $sym_070 + 1 | 0;
        if (($inc8 | 0) == ($codes | 0)) {
          break $for_end9$$for_body3$2;
        }
        var $sym_070 = $inc8;
      }
    }
  } while (0);
  var $2 = HEAPU32[$bits >> 2];
  var $max_0 = 15;
  while (1) {
    var $max_0;
    if (($max_0 | 0) == 0) {
      var $4 = HEAPU32[$table$s2];
      HEAP32[$table$s2] = $4 + 4 | 0;
      HEAP8[$4 | 0] = 64;
      HEAP8[$4 + 1 | 0] = 1;
      HEAP16[$4 + 2 >> 1] = 0;
      var $5 = HEAP32[$table$s2];
      var $incdec_ptr26 = $5 + 4 | 0;
      HEAP32[$table$s2] = $incdec_ptr26;
      HEAP8[$5 | 0] = 64;
      HEAP8[$5 + 1 | 0] = 1;
      HEAP16[$5 + 2 >> 1] = 0;
      HEAP32[$bits >> 2] = 1;
      var $retval_0 = 0;
      __label__ = 57;
      break;
    }
    if (HEAP16[($max_0 << 1 >> 1) + $count$s1] << 16 >> 16 != 0) {
      __label__ = 6;
      break;
    }
    var $max_0 = $max_0 - 1 | 0;
  }
  $for_end17$$return$12 : do {
    if (__label__ == 6) {
      var $root_0 = $2 >>> 0 > $max_0 >>> 0 ? $max_0 : $2;
      var $min_0 = 1;
      while (1) {
        var $min_0;
        if ($min_0 >>> 0 >= $max_0 >>> 0) {
          break;
        }
        if (HEAP16[($min_0 << 1 >> 1) + $count$s1] << 16 >> 16 != 0) {
          break;
        }
        var $min_0 = $min_0 + 1 | 0;
      }
      var $root_1 = $root_0 >>> 0 < $min_0 >>> 0 ? $min_0 : $root_0;
      var $len_1 = 1;
      var $left_0 = 1;
      while (1) {
        var $left_0;
        var $len_1;
        if ($len_1 >>> 0 >= 16) {
          break;
        }
        var $sub = ($left_0 << 1) - (HEAPU16[($len_1 << 1 >> 1) + $count$s1] & 65535) | 0;
        if (($sub | 0) < 0) {
          var $retval_0 = -1;
          break $for_end17$$return$12;
        }
        var $len_1 = $len_1 + 1 | 0;
        var $left_0 = $sub;
      }
      if (($left_0 | 0) > 0) {
        if (!(($type | 0) != 0 & ($max_0 | 0) == 1)) {
          var $retval_0 = -1;
          break;
        }
      }
      HEAP16[$offs$s1 + 1] = 0;
      var $8 = HEAP16[$count$s1 + 1];
      HEAP16[$offs$s1 + 2] = $8;
      var $add_1 = HEAP16[$count$s1 + 2] + $8 & 65535;
      HEAP16[$offs$s1 + 3] = $add_1;
      var $add_2 = HEAP16[$count$s1 + 3] + $add_1 & 65535;
      HEAP16[$offs$s1 + 4] = $add_2;
      var $add_3 = HEAP16[$count$s1 + 4] + $add_2 & 65535;
      HEAP16[$offs$s1 + 5] = $add_3;
      var $add_4 = HEAP16[$count$s1 + 5] + $add_3 & 65535;
      HEAP16[$offs$s1 + 6] = $add_4;
      var $add_5 = HEAP16[$count$s1 + 6] + $add_4 & 65535;
      HEAP16[$offs$s1 + 7] = $add_5;
      var $add_6 = HEAP16[$count$s1 + 7] + $add_5 & 65535;
      HEAP16[$offs$s1 + 8] = $add_6;
      var $add_7 = HEAP16[$count$s1 + 8] + $add_6 & 65535;
      HEAP16[$offs$s1 + 9] = $add_7;
      var $add_8 = HEAP16[$count$s1 + 9] + $add_7 & 65535;
      HEAP16[$offs$s1 + 10] = $add_8;
      var $add_9 = HEAP16[$count$s1 + 10] + $add_8 & 65535;
      HEAP16[$offs$s1 + 11] = $add_9;
      var $add_10 = HEAP16[$count$s1 + 11] + $add_9 & 65535;
      HEAP16[$offs$s1 + 12] = $add_10;
      var $add_11 = HEAP16[$count$s1 + 12] + $add_10 & 65535;
      HEAP16[$offs$s1 + 13] = $add_11;
      var $add_12 = HEAP16[$count$s1 + 13] + $add_11 & 65535;
      HEAP16[$offs$s1 + 14] = $add_12;
      var $add_13 = HEAP16[$count$s1 + 14] + $add_12 & 65535;
      HEAP16[$offs$s1 + 15] = $add_13;
      $for_end100$$for_body84$27 : do {
        if ($cmp269) {
          __label__ = 21;
        } else {
          var $sym_164 = 0;
          while (1) {
            var $sym_164;
            var $22 = HEAPU16[$lens + ($sym_164 << 1) >> 1];
            if ($22 << 16 >> 16 != 0) {
              var $arrayidx93 = (($22 & 65535) << 1) + $offs | 0;
              var $23 = HEAPU16[$arrayidx93 >> 1];
              HEAP16[$arrayidx93 >> 1] = $23 + 1 & 65535;
              HEAP16[$work + (($23 & 65535) << 1) >> 1] = $sym_164 & 65535;
            }
            var $inc99 = $sym_164 + 1 | 0;
            if (($inc99 | 0) == ($codes | 0)) {
              break $for_end100$$for_body84$27;
            }
            var $sym_164 = $inc99;
          }
        }
      } while (0);
      do {
        if ($type == 0) {
          var $cmp1053337_ph = 0;
          var $sub1043238_ph_in = 1 << $root_1;
          var $end_03039_ph = 19;
          var $extra_02940_ph = $work;
          var $base_02841_ph = $work;
          var $cmp11142_ph = 0;
          __label__ = 26;
          break;
        } else if ($type == 1) {
          var $end_0 = 256;
          var $extra_0 = _inflate_table_lext + 4294966782 | 0;
          var $base_0 = _inflate_table_lbase + 4294966782 | 0;
          __label__ = 24;
        } else {
          var $end_0 = -1;
          var $extra_0 = _inflate_table_dext | 0;
          var $base_0 = _inflate_table_dbase | 0;
          __label__ = 24;
          break;
        }
      } while (0);
      if (__label__ == 24) {
        var $base_0;
        var $extra_0;
        var $end_0;
        var $shl103 = 1 << $root_1;
        var $cmp105 = ($type | 0) == 1;
        if ($cmp105 & $shl103 >>> 0 > 851) {
          var $retval_0 = 1;
          break;
        }
        var $cmp111 = ($type | 0) == 2;
        if ($cmp111 & $shl103 >>> 0 > 591) {
          var $retval_0 = 1;
          break;
        }
        var $cmp1053337_ph = $cmp105;
        var $sub1043238_ph_in = $shl103;
        var $end_03039_ph = $end_0;
        var $extra_02940_ph = $extra_0;
        var $base_02841_ph = $base_0;
        var $cmp11142_ph = $cmp111;
      }
      var $cmp11142_ph;
      var $base_02841_ph;
      var $extra_02940_ph;
      var $end_03039_ph;
      var $sub1043238_ph_in;
      var $cmp1053337_ph;
      var $sub1043238_ph = $sub1043238_ph_in - 1 | 0;
      var $conv233 = $root_1 & 255;
      var $next_0_ph57 = HEAP32[$table$s2];
      var $low_0_ph = -1;
      var $len_3_ph = $min_0;
      var $sym_2_ph = 0;
      var $curr_0_ph = $root_1;
      var $drop_0_ph = 0;
      var $used_0_ph56 = $sub1043238_ph_in;
      var $huff_0_ph = 0;
      $for_cond118_outer$41 : while (1) {
        var $huff_0_ph;
        var $used_0_ph56;
        var $drop_0_ph;
        var $curr_0_ph;
        var $sym_2_ph;
        var $len_3_ph;
        var $low_0_ph;
        var $next_0_ph57;
        var $shl151 = 1 << $curr_0_ph;
        var $len_3 = $len_3_ph;
        var $sym_2 = $sym_2_ph;
        var $huff_0 = $huff_0_ph;
        while (1) {
          var $huff_0;
          var $sym_2;
          var $len_3;
          var $sub119 = $len_3 - $drop_0_ph | 0;
          var $conv120 = $sub119 & 255;
          var $24 = HEAPU16[$work + ($sym_2 << 1) >> 1];
          var $conv123 = $24 & 65535;
          var $cmp124 = ($conv123 | 0) < ($end_03039_ph | 0);
          do {
            if ($cmp124) {
              var $here_0_0 = 0;
              var $here_2_0 = $24;
            } else {
              if (($conv123 | 0) <= ($end_03039_ph | 0)) {
                var $here_0_0 = 96;
                var $here_2_0 = 0;
                break;
              }
              var $here_0_0 = HEAP16[$extra_02940_ph + ($conv123 << 1) >> 1] & 255;
              var $here_2_0 = HEAP16[$base_02841_ph + ($conv123 << 1) >> 1];
            }
          } while (0);
          var $here_2_0;
          var $here_0_0;
          var $shl150 = 1 << $sub119;
          var $shr = $huff_0 >>> ($drop_0_ph >>> 0);
          var $fill_0 = $shl151;
          while (1) {
            var $fill_0;
            var $sub152 = $fill_0 - $shl150 | 0;
            var $add153 = $sub152 + $shr | 0;
            HEAP8[($add153 << 2) + $next_0_ph57 | 0] = $here_0_0;
            HEAP8[($add153 << 2) + $next_0_ph57 + 1 | 0] = $conv120;
            HEAP16[$next_0_ph57 + ($add153 << 2) + 2 >> 1] = $here_2_0;
            if (($fill_0 | 0) == ($shl150 | 0)) {
              break;
            }
            var $fill_0 = $sub152;
          }
          var $shl158 = 1 << $len_3 - 1;
          var $tobool53 = ($shl158 & $huff_0 | 0) == 0;
          do {
            if ($tobool53) {
              var $incr_0_lcssa91 = $shl158;
              __label__ = 36;
            } else {
              var $incr_054 = $shl158;
              while (1) {
                var $incr_054;
                var $shr159 = $incr_054 >>> 1;
                if (($shr159 & $huff_0 | 0) == 0) {
                  break;
                }
                var $incr_054 = $shr159;
              }
              if (($shr159 | 0) == 0) {
                var $huff_1 = 0;
                __label__ = 37;
                break;
              }
              var $incr_0_lcssa91 = $shr159;
              __label__ = 36;
              break;
            }
          } while (0);
          if (__label__ == 36) {
            var $incr_0_lcssa91;
            var $huff_1 = ($incr_0_lcssa91 - 1 & $huff_0) + $incr_0_lcssa91 | 0;
          }
          var $huff_1;
          var $inc168 = $sym_2 + 1 | 0;
          var $arrayidx169 = ($len_3 << 1) + $count | 0;
          var $dec170 = HEAP16[$arrayidx169 >> 1] - 1 & 65535;
          HEAP16[$arrayidx169 >> 1] = $dec170;
          if ($dec170 << 16 >> 16 == 0) {
            if (($len_3 | 0) == ($max_0 | 0)) {
              break $for_cond118_outer$41;
            }
            var $len_4 = HEAPU16[$lens + ((HEAPU16[$work + ($inc168 << 1) >> 1] & 65535) << 1) >> 1] & 65535;
          } else {
            var $len_4 = $len_3;
          }
          var $len_4;
          if ($len_4 >>> 0 <= $root_1 >>> 0) {
            var $len_3 = $len_4;
            var $sym_2 = $inc168;
            var $huff_0 = $huff_1;
            continue;
          }
          var $and187 = $huff_1 & $sub1043238_ph;
          if (($and187 | 0) != ($low_0_ph | 0)) {
            break;
          }
          var $len_3 = $len_4;
          var $sym_2 = $inc168;
          var $huff_0 = $huff_1;
        }
        var $drop_1 = ($drop_0_ph | 0) == 0 ? $root_1 : $drop_0_ph;
        var $add_ptr195 = ($shl151 << 2) + $next_0_ph57 | 0;
        var $sub196 = $len_4 - $drop_1 | 0;
        var $curr_1 = $sub196;
        var $left_1 = 1 << $sub196;
        while (1) {
          var $left_1;
          var $curr_1;
          var $add199 = $curr_1 + $drop_1 | 0;
          if ($add199 >>> 0 >= $max_0 >>> 0) {
            break;
          }
          var $sub206 = $left_1 - (HEAPU16[($add199 << 1 >> 1) + $count$s1] & 65535) | 0;
          if (($sub206 | 0) < 1) {
            break;
          }
          var $shl212 = $sub206 << 1;
          var $curr_1 = $curr_1 + 1 | 0;
          var $left_1 = $shl212;
        }
        var $add215 = (1 << $curr_1) + $used_0_ph56 | 0;
        if ($cmp1053337_ph & $add215 >>> 0 > 851 | $cmp11142_ph & $add215 >>> 0 > 591) {
          var $retval_0 = 1;
          break $for_end17$$return$12;
        }
        HEAP8[($and187 << 2) + HEAP32[$table$s2] | 0] = $curr_1 & 255;
        HEAP8[($and187 << 2) + HEAP32[$table$s2] + 1 | 0] = $conv233;
        var $33 = HEAPU32[$table$s2];
        HEAP16[$33 + ($and187 << 2) + 2 >> 1] = ($add_ptr195 - $33 | 0) >>> 2 & 65535;
        var $next_0_ph57 = $add_ptr195;
        var $low_0_ph = $and187;
        var $len_3_ph = $len_4;
        var $sym_2_ph = $inc168;
        var $curr_0_ph = $curr_1;
        var $drop_0_ph = $drop_1;
        var $used_0_ph56 = $add215;
        var $huff_0_ph = $huff_1;
      }
      var $cmp24746 = ($huff_1 | 0) == 0;
      $while_end278$$while_body249$72 : do {
        if (!$cmp24746) {
          var $here_1_047 = $conv120;
          var $huff_248 = $huff_1;
          var $drop_249 = $drop_0_ph;
          var $len_550 = $len_3;
          var $next_151 = $next_0_ph57;
          while (1) {
            var $next_151;
            var $len_550;
            var $drop_249;
            var $huff_248;
            var $here_1_047;
            var $cmp250 = ($drop_249 | 0) == 0;
            do {
              if ($cmp250) {
                var $next_2 = $next_151;
                var $len_6 = $len_550;
                var $drop_3 = 0;
                var $here_1_1 = $here_1_047;
              } else {
                if (($huff_248 & $sub1043238_ph | 0) == ($low_0_ph | 0)) {
                  var $next_2 = $next_151;
                  var $len_6 = $len_550;
                  var $drop_3 = $drop_249;
                  var $here_1_1 = $here_1_047;
                  break;
                }
                var $next_2 = HEAP32[$table$s2];
                var $len_6 = $root_1;
                var $drop_3 = 0;
                var $here_1_1 = $conv233;
              }
            } while (0);
            var $here_1_1;
            var $drop_3;
            var $len_6;
            var $next_2;
            var $shr260 = $huff_248 >>> ($drop_3 >>> 0);
            HEAP8[($shr260 << 2) + $next_2 | 0] = 64;
            HEAP8[($shr260 << 2) + $next_2 + 1 | 0] = $here_1_1;
            HEAP16[$next_2 + ($shr260 << 2) + 2 >> 1] = 0;
            var $shl263 = 1 << $len_6 - 1;
            if (($shl263 & $huff_248 | 0) == 0) {
              var $incr_1_lcssa93 = $shl263;
            } else {
              var $incr_145 = $shl263;
              while (1) {
                var $incr_145;
                var $shr268 = $incr_145 >>> 1;
                if (($shr268 & $huff_248 | 0) == 0) {
                  break;
                }
                var $incr_145 = $shr268;
              }
              if (($shr268 | 0) == 0) {
                break $while_end278$$while_body249$72;
              }
              var $incr_1_lcssa93 = $shr268;
            }
            var $incr_1_lcssa93;
            var $add275 = ($incr_1_lcssa93 - 1 & $huff_248) + $incr_1_lcssa93 | 0;
            if (($add275 | 0) == 0) {
              break $while_end278$$while_body249$72;
            }
            var $here_1_047 = $here_1_1;
            var $huff_248 = $add275;
            var $drop_249 = $drop_3;
            var $len_550 = $len_6;
            var $next_151 = $next_2;
          }
        }
      } while (0);
      var $add_ptr279 = ($used_0_ph56 << 2) + HEAP32[$table$s2] | 0;
      HEAP32[$table$s2] = $add_ptr279;
      HEAP32[$bits >> 2] = $root_1;
      var $retval_0 = 0;
    }
  } while (0);
  var $retval_0;
  STACKTOP = __stackBase__;
  return $retval_0;
  return null;
}

_inflate_table["X"] = 1;

function _inflate_fast($strm, $start) {
  var $0$s2;
  var __label__;
  var $0 = HEAPU32[$strm + 28 >> 2], $0$s2 = $0 >> 2;
  var $next_in = $strm | 0;
  var $1 = HEAP32[$next_in >> 2];
  var $avail_in = $strm + 4 | 0;
  var $add_ptr2 = $1 + (HEAP32[$avail_in >> 2] - 6) | 0;
  var $next_out = $strm + 12 | 0;
  var $3 = HEAP32[$next_out >> 2];
  var $avail_out = $strm + 16 | 0;
  var $4 = HEAP32[$avail_out >> 2];
  var $add_ptr8 = $3 + ($4 - 258) | 0;
  var $8 = HEAPU32[$0$s2 + 11];
  var $10 = HEAPU32[$0$s2 + 12];
  var $12 = HEAPU32[$0$s2 + 13];
  var $13 = $0 + 56 | 0;
  var $15 = $0 + 60 | 0;
  var $18 = HEAP32[$0$s2 + 19];
  var $20 = HEAP32[$0$s2 + 20];
  var $sub15 = (1 << HEAP32[$0$s2 + 21]) - 1 | 0;
  var $sub17 = (1 << HEAP32[$0$s2 + 22]) - 1 | 0;
  var $sub_ptr_rhs_cast = $3 + $4 + ($start ^ -1) | 0;
  var $25 = $0 + 7104 | 0;
  var $add_ptr121 = $12 - 1 | 0;
  var $cmp122 = ($10 | 0) == 0;
  var $sub125 = HEAP32[$0$s2 + 10] - 1 | 0;
  var $sub143 = $sub125 + $10 | 0;
  var $sub174 = $10 - 1 | 0;
  var $26 = $sub_ptr_rhs_cast - 1 | 0;
  var $27 = $sub_ptr_rhs_cast - $10 | 0;
  var $in_0 = $1 - 1 | 0;
  var $out_0 = $3 - 1 | 0;
  var $bits_0 = HEAP32[$15 >> 2];
  var $hold_0 = HEAP32[$13 >> 2];
  $do_body$2 : while (1) {
    var $hold_0;
    var $bits_0;
    var $out_0;
    var $in_0;
    if ($bits_0 >>> 0 < 15) {
      var $incdec_ptr20 = $in_0 + 2 | 0;
      var $in_1 = $incdec_ptr20;
      var $bits_1 = $bits_0 + 16 | 0;
      var $hold_1 = ((HEAPU8[$in_0 + 1 | 0] & 255) << $bits_0) + ((HEAPU8[$incdec_ptr20] & 255) << $bits_0 + 8) + $hold_0 | 0;
    } else {
      var $in_1 = $in_0;
      var $bits_1 = $bits_0;
      var $hold_1 = $hold_0;
    }
    var $hold_1;
    var $bits_1;
    var $in_1;
    var $bits_2 = $bits_1;
    var $hold_2 = $hold_1;
    var $and_pn = $hold_1 & $sub15;
    while (1) {
      var $and_pn;
      var $hold_2;
      var $bits_2;
      var $here_0_0 = HEAPU8[($and_pn << 2) + $18 | 0];
      var $here_2_0 = HEAPU16[$18 + ($and_pn << 2) + 2 >> 1];
      var $conv26 = HEAPU8[($and_pn << 2) + $18 + 1 | 0] & 255;
      var $shr = $hold_2 >>> ($conv26 >>> 0);
      var $sub27 = $bits_2 - $conv26 | 0;
      var $conv29 = $here_0_0 & 255;
      if ($here_0_0 << 24 >> 24 == 0) {
        var $incdec_ptr34 = $out_0 + 1 | 0;
        HEAP8[$incdec_ptr34] = $here_2_0 & 255;
        var $in_6 = $in_1;
        var $out_7 = $incdec_ptr34;
        var $bits_8 = $sub27;
        var $hold_8 = $shr;
        __label__ = 57;
        break;
      }
      if (($conv29 & 16 | 0) != 0) {
        __label__ = 7;
        break;
      }
      if (($conv29 & 64 | 0) == 0) {
        var $add265 = ($shr & (1 << $conv29) - 1) + ($here_2_0 & 65535) | 0;
        var $bits_2 = $sub27;
        var $hold_2 = $shr;
        var $and_pn = $add265;
      } else {
        if (($conv29 & 32 | 0) == 0) {
          HEAP32[$strm + 24 >> 2] = STRING_TABLE.__str255 | 0;
          HEAP32[$0$s2] = 29;
          var $in_7 = $in_1;
          var $out_8 = $out_0;
          var $bits_9 = $sub27;
          var $hold_9 = $shr;
          break $do_body$2;
        }
        HEAP32[$0$s2] = 11;
        var $in_7 = $in_1;
        var $out_8 = $out_0;
        var $bits_9 = $sub27;
        var $hold_9 = $shr;
        break $do_body$2;
      }
    }
    do {
      if (__label__ == 7) {
        var $conv38 = $here_2_0 & 65535;
        var $and39 = $conv29 & 15;
        if (($and39 | 0) == 0) {
          var $len_0 = $conv38;
          var $in_3 = $in_1;
          var $bits_4 = $sub27;
          var $hold_4 = $shr;
        } else {
          if ($sub27 >>> 0 < $and39 >>> 0) {
            var $incdec_ptr45 = $in_1 + 1 | 0;
            var $in_2 = $incdec_ptr45;
            var $bits_3 = $sub27 + 8 | 0;
            var $hold_3 = ((HEAPU8[$incdec_ptr45] & 255) << $sub27) + $shr | 0;
          } else {
            var $in_2 = $in_1;
            var $bits_3 = $sub27;
            var $hold_3 = $shr;
          }
          var $hold_3;
          var $bits_3;
          var $in_2;
          var $len_0 = ($hold_3 & (1 << $and39) - 1) + $conv38 | 0;
          var $in_3 = $in_2;
          var $bits_4 = $bits_3 - $and39 | 0;
          var $hold_4 = $hold_3 >>> ($and39 >>> 0);
        }
        var $hold_4;
        var $bits_4;
        var $in_3;
        var $len_0;
        if ($bits_4 >>> 0 < 15) {
          var $incdec_ptr66 = $in_3 + 2 | 0;
          var $in_4 = $incdec_ptr66;
          var $bits_5 = $bits_4 + 16 | 0;
          var $hold_5 = ((HEAPU8[$in_3 + 1 | 0] & 255) << $bits_4) + ((HEAPU8[$incdec_ptr66] & 255) << $bits_4 + 8) + $hold_4 | 0;
        } else {
          var $in_4 = $in_3;
          var $bits_5 = $bits_4;
          var $hold_5 = $hold_4;
        }
        var $hold_5;
        var $bits_5;
        var $in_4;
        var $bits_6 = $bits_5;
        var $hold_6 = $hold_5;
        var $and72_pn = $hold_5 & $sub17;
        while (1) {
          var $and72_pn;
          var $hold_6;
          var $bits_6;
          var $here_2_1 = HEAPU16[$20 + ($and72_pn << 2) + 2 >> 1];
          var $conv75 = HEAPU8[($and72_pn << 2) + $20 + 1 | 0] & 255;
          var $shr76 = $hold_6 >>> ($conv75 >>> 0);
          var $sub77 = $bits_6 - $conv75 | 0;
          var $conv79 = HEAPU8[($and72_pn << 2) + $20 | 0] & 255;
          if (($conv79 & 16 | 0) != 0) {
            break;
          }
          if (($conv79 & 64 | 0) != 0) {
            HEAP32[$strm + 24 >> 2] = STRING_TABLE.__str154 | 0;
            HEAP32[$0$s2] = 29;
            var $in_7 = $in_4;
            var $out_8 = $out_0;
            var $bits_9 = $sub77;
            var $hold_9 = $shr76;
            break $do_body$2;
          }
          var $add249 = ($shr76 & (1 << $conv79) - 1) + ($here_2_1 & 65535) | 0;
          var $bits_6 = $sub77;
          var $hold_6 = $shr76;
          var $and72_pn = $add249;
        }
        var $conv84 = $here_2_1 & 65535;
        var $and85 = $conv79 & 15;
        var $cmp86 = $sub77 >>> 0 < $and85 >>> 0;
        do {
          if ($cmp86) {
            var $incdec_ptr89 = $in_4 + 1 | 0;
            var $add92 = ((HEAPU8[$incdec_ptr89] & 255) << $sub77) + $shr76 | 0;
            var $add93 = $sub77 + 8 | 0;
            if ($add93 >>> 0 >= $and85 >>> 0) {
              var $in_5 = $incdec_ptr89;
              var $bits_7 = $add93;
              var $hold_7 = $add92;
              break;
            }
            var $incdec_ptr97 = $in_4 + 2 | 0;
            var $in_5 = $incdec_ptr97;
            var $bits_7 = $sub77 + 16 | 0;
            var $hold_7 = ((HEAPU8[$incdec_ptr97] & 255) << $add93) + $add92 | 0;
          } else {
            var $in_5 = $in_4;
            var $bits_7 = $sub77;
            var $hold_7 = $shr76;
          }
        } while (0);
        var $hold_7;
        var $bits_7;
        var $in_5;
        var $and106 = $hold_7 & (1 << $and85) - 1;
        var $add107 = $and106 + $conv84 | 0;
        var $shr108 = $hold_7 >>> ($and85 >>> 0);
        var $sub109 = $bits_7 - $and85 | 0;
        var $sub_ptr_lhs_cast = $out_0;
        var $sub_ptr_sub = $sub_ptr_lhs_cast - $sub_ptr_rhs_cast | 0;
        if ($add107 >>> 0 > $sub_ptr_sub >>> 0) {
          var $sub113 = $add107 - $sub_ptr_sub | 0;
          var $cmp114 = $sub113 >>> 0 > $8 >>> 0;
          do {
            if ($cmp114) {
              if ((HEAP32[$25 >> 2] | 0) == 0) {
                break;
              }
              HEAP32[$strm + 24 >> 2] = STRING_TABLE.__str53 | 0;
              HEAP32[$0$s2] = 29;
              var $in_7 = $in_5;
              var $out_8 = $out_0;
              var $bits_9 = $sub109;
              var $hold_9 = $shr108;
              break $do_body$2;
            }
            __label__ = 22;
          } while (0);
          do {
            if ($cmp122) {
              var $add_ptr126 = $12 + ($sub125 - $sub113) | 0;
              if ($sub113 >>> 0 >= $len_0 >>> 0) {
                var $from_4_ph = $add_ptr126;
                var $len_1_ph = $len_0;
                var $out_5_ph = $out_0;
                break;
              }
              var $sub130 = $len_0 - $sub113 | 0;
              var $36 = $and106 - $sub_ptr_lhs_cast | 0;
              var $scevgep49_sum = $26 + $36 | 0;
              var $from_0 = $add_ptr126;
              var $op_0 = $sub113;
              var $out_1 = $out_0;
              while (1) {
                var $out_1;
                var $op_0;
                var $from_0;
                var $incdec_ptr132 = $from_0 + 1 | 0;
                var $37 = HEAP8[$incdec_ptr132];
                var $incdec_ptr133 = $out_1 + 1 | 0;
                HEAP8[$incdec_ptr133] = $37;
                var $dec = $op_0 - 1 | 0;
                if (($dec | 0) == 0) {
                  break;
                }
                var $from_0 = $incdec_ptr132;
                var $op_0 = $dec;
                var $out_1 = $incdec_ptr133;
              }
              var $from_4_ph = $out_0 + $scevgep49_sum + $conv84 + (1 - $add107) | 0;
              var $len_1_ph = $sub130;
              var $out_5_ph = $out_0 + $sub_ptr_rhs_cast + $36 + $conv84 | 0;
            } else {
              if ($10 >>> 0 < $sub113 >>> 0) {
                var $add_ptr144 = $12 + ($sub143 - $sub113) | 0;
                var $sub145 = $sub113 - $10 | 0;
                if ($sub145 >>> 0 >= $len_0 >>> 0) {
                  var $from_4_ph = $add_ptr144;
                  var $len_1_ph = $len_0;
                  var $out_5_ph = $out_0;
                  break;
                }
                var $sub149 = $len_0 - $sub145 | 0;
                var $38 = $and106 - $sub_ptr_lhs_cast | 0;
                var $from_1 = $add_ptr144;
                var $op_1 = $sub145;
                var $out_2 = $out_0;
                while (1) {
                  var $out_2;
                  var $op_1;
                  var $from_1;
                  var $incdec_ptr151 = $from_1 + 1 | 0;
                  var $39 = HEAP8[$incdec_ptr151];
                  var $incdec_ptr152 = $out_2 + 1 | 0;
                  HEAP8[$incdec_ptr152] = $39;
                  var $dec154 = $op_1 - 1 | 0;
                  if (($dec154 | 0) == 0) {
                    break;
                  }
                  var $from_1 = $incdec_ptr151;
                  var $op_1 = $dec154;
                  var $out_2 = $incdec_ptr152;
                }
                var $scevgep81 = $out_0 + $27 + $38 + $conv84 | 0;
                if ($10 >>> 0 >= $sub149 >>> 0) {
                  var $from_4_ph = $add_ptr121;
                  var $len_1_ph = $sub149;
                  var $out_5_ph = $scevgep81;
                  break;
                }
                var $sub161 = $sub149 - $10 | 0;
                var $scevgep63_sum = $26 + $38 | 0;
                var $from_2 = $add_ptr121;
                var $op_2 = $10;
                var $out_3 = $scevgep81;
                while (1) {
                  var $out_3;
                  var $op_2;
                  var $from_2;
                  var $incdec_ptr163 = $from_2 + 1 | 0;
                  var $40 = HEAP8[$incdec_ptr163];
                  var $incdec_ptr164 = $out_3 + 1 | 0;
                  HEAP8[$incdec_ptr164] = $40;
                  var $dec166 = $op_2 - 1 | 0;
                  if (($dec166 | 0) == 0) {
                    break;
                  }
                  var $from_2 = $incdec_ptr163;
                  var $op_2 = $dec166;
                  var $out_3 = $incdec_ptr164;
                }
                var $from_4_ph = $out_0 + $scevgep63_sum + $conv84 + (1 - $add107) | 0;
                var $len_1_ph = $sub161;
                var $out_5_ph = $out_0 + $sub_ptr_rhs_cast + $38 + $conv84 | 0;
              } else {
                var $add_ptr175 = $12 + ($sub174 - $sub113) | 0;
                if ($sub113 >>> 0 >= $len_0 >>> 0) {
                  var $from_4_ph = $add_ptr175;
                  var $len_1_ph = $len_0;
                  var $out_5_ph = $out_0;
                  break;
                }
                var $sub179 = $len_0 - $sub113 | 0;
                var $41 = $and106 - $sub_ptr_lhs_cast | 0;
                var $scevgep56_sum = $26 + $41 | 0;
                var $from_3 = $add_ptr175;
                var $op_3 = $sub113;
                var $out_4 = $out_0;
                while (1) {
                  var $out_4;
                  var $op_3;
                  var $from_3;
                  var $incdec_ptr181 = $from_3 + 1 | 0;
                  var $42 = HEAP8[$incdec_ptr181];
                  var $incdec_ptr182 = $out_4 + 1 | 0;
                  HEAP8[$incdec_ptr182] = $42;
                  var $dec184 = $op_3 - 1 | 0;
                  if (($dec184 | 0) == 0) {
                    break;
                  }
                  var $from_3 = $incdec_ptr181;
                  var $op_3 = $dec184;
                  var $out_4 = $incdec_ptr182;
                }
                var $from_4_ph = $out_0 + $scevgep56_sum + $conv84 + (1 - $add107) | 0;
                var $len_1_ph = $sub179;
                var $out_5_ph = $out_0 + $sub_ptr_rhs_cast + $41 + $conv84 | 0;
              }
            }
          } while (0);
          var $out_5_ph;
          var $len_1_ph;
          var $from_4_ph;
          var $cmp19234 = $len_1_ph >>> 0 > 2;
          $while_body$$while_end$70 : do {
            if ($cmp19234) {
              var $out_535 = $out_5_ph;
              var $len_136 = $len_1_ph;
              var $from_437 = $from_4_ph;
              while (1) {
                var $from_437;
                var $len_136;
                var $out_535;
                var $43 = HEAP8[$from_437 + 1 | 0];
                HEAP8[$out_535 + 1 | 0] = $43;
                var $44 = HEAP8[$from_437 + 2 | 0];
                HEAP8[$out_535 + 2 | 0] = $44;
                var $incdec_ptr198 = $from_437 + 3 | 0;
                var $45 = HEAP8[$incdec_ptr198];
                var $incdec_ptr199 = $out_535 + 3 | 0;
                HEAP8[$incdec_ptr199] = $45;
                var $sub200 = $len_136 - 3 | 0;
                if ($sub200 >>> 0 <= 2) {
                  var $out_5_lcssa = $incdec_ptr199;
                  var $len_1_lcssa = $sub200;
                  var $from_4_lcssa = $incdec_ptr198;
                  break $while_body$$while_end$70;
                }
                var $out_535 = $incdec_ptr199;
                var $len_136 = $sub200;
                var $from_437 = $incdec_ptr198;
              }
            } else {
              var $out_5_lcssa = $out_5_ph;
              var $len_1_lcssa = $len_1_ph;
              var $from_4_lcssa = $from_4_ph;
            }
          } while (0);
          var $from_4_lcssa;
          var $len_1_lcssa;
          var $out_5_lcssa;
          if (($len_1_lcssa | 0) == 0) {
            var $in_6 = $in_5;
            var $out_7 = $out_5_lcssa;
            var $bits_8 = $sub109;
            var $hold_8 = $shr108;
            break;
          }
          var $46 = HEAP8[$from_4_lcssa + 1 | 0];
          var $incdec_ptr204 = $out_5_lcssa + 1 | 0;
          HEAP8[$incdec_ptr204] = $46;
          if ($len_1_lcssa >>> 0 <= 1) {
            var $in_6 = $in_5;
            var $out_7 = $incdec_ptr204;
            var $bits_8 = $sub109;
            var $hold_8 = $shr108;
            break;
          }
          var $47 = HEAP8[$from_4_lcssa + 2 | 0];
          var $incdec_ptr209 = $out_5_lcssa + 2 | 0;
          HEAP8[$incdec_ptr209] = $47;
          var $in_6 = $in_5;
          var $out_7 = $incdec_ptr209;
          var $bits_8 = $sub109;
          var $hold_8 = $shr108;
        } else {
          var $from_5 = $out_0 + -$add107 | 0;
          var $len_2 = $len_0;
          var $out_6 = $out_0;
          while (1) {
            var $out_6;
            var $len_2;
            var $from_5;
            var $48 = HEAP8[$from_5 + 1 | 0];
            HEAP8[$out_6 + 1 | 0] = $48;
            var $49 = HEAP8[$from_5 + 2 | 0];
            HEAP8[$out_6 + 2 | 0] = $49;
            var $incdec_ptr220 = $from_5 + 3 | 0;
            var $50 = HEAP8[$incdec_ptr220];
            var $incdec_ptr221 = $out_6 + 3 | 0;
            HEAP8[$incdec_ptr221] = $50;
            var $sub222 = $len_2 - 3 | 0;
            if ($sub222 >>> 0 <= 2) {
              break;
            }
            var $from_5 = $incdec_ptr220;
            var $len_2 = $sub222;
            var $out_6 = $incdec_ptr221;
          }
          if (($sub222 | 0) == 0) {
            var $in_6 = $in_5;
            var $out_7 = $incdec_ptr221;
            var $bits_8 = $sub109;
            var $hold_8 = $shr108;
            break;
          }
          var $51 = HEAP8[$from_5 + 4 | 0];
          var $incdec_ptr230 = $out_6 + 4 | 0;
          HEAP8[$incdec_ptr230] = $51;
          if ($sub222 >>> 0 <= 1) {
            var $in_6 = $in_5;
            var $out_7 = $incdec_ptr230;
            var $bits_8 = $sub109;
            var $hold_8 = $shr108;
            break;
          }
          var $52 = HEAP8[$from_5 + 5 | 0];
          var $incdec_ptr235 = $out_6 + 5 | 0;
          HEAP8[$incdec_ptr235] = $52;
          var $in_6 = $in_5;
          var $out_7 = $incdec_ptr235;
          var $bits_8 = $sub109;
          var $hold_8 = $shr108;
        }
      }
    } while (0);
    var $hold_8;
    var $bits_8;
    var $out_7;
    var $in_6;
    if (!($in_6 >>> 0 < $add_ptr2 >>> 0 & $out_7 >>> 0 < $add_ptr8 >>> 0)) {
      var $in_7 = $in_6;
      var $out_8 = $out_7;
      var $bits_9 = $bits_8;
      var $hold_9 = $hold_8;
      break;
    }
    var $in_0 = $in_6;
    var $out_0 = $out_7;
    var $bits_0 = $bits_8;
    var $hold_0 = $hold_8;
  }
  var $hold_9;
  var $bits_9;
  var $out_8;
  var $in_7;
  var $shr283 = $bits_9 >>> 3;
  var $add_ptr285 = $in_7 + -$shr283 | 0;
  var $sub287 = $bits_9 & 7;
  HEAP32[$next_in >> 2] = $in_7 + (1 - $shr283) | 0;
  HEAP32[$next_out >> 2] = $out_8 + 1 | 0;
  if ($add_ptr285 >>> 0 < $add_ptr2 >>> 0) {
    var $cond_in = $add_ptr2 - $add_ptr285 | 0;
  } else {
    var $cond_in = $add_ptr2 - $add_ptr285 | 0;
  }
  var $cond_in;
  HEAP32[$avail_in >> 2] = $cond_in + 5 | 0;
  if ($out_8 >>> 0 < $add_ptr8 >>> 0) {
    var $cond319_in = $add_ptr8 - $out_8 | 0;
  } else {
    var $cond319_in = $add_ptr8 - $out_8 | 0;
  }
  var $cond319_in;
  HEAP32[$avail_out >> 2] = $cond319_in + 257 | 0;
  HEAP32[$13 >> 2] = (1 << $sub287) - 1 & $hold_9;
  HEAP32[$15 >> 2] = $sub287;
  return;
  return;
}

_inflate_fast["X"] = 1;

function _zcalloc($opaque, $items, $size) {
  var $mul = $size * $items | 0;
  var $call = _malloc($mul);
  return $call;
  return null;
}

function _zcfree($opaque, $ptr) {
  _free($ptr);
  return;
  return;
}

function _malloc($bytes) {
  var __label__;
  var $cmp = $bytes >>> 0 < 245;
  do {
    if ($cmp) {
      if ($bytes >>> 0 < 11) {
        var $cond = 16;
      } else {
        var $cond = $bytes + 11 & -8;
      }
      var $cond;
      var $shr = $cond >>> 3;
      var $0 = HEAPU32[__gm_ >> 2];
      var $shr3 = $0 >>> ($shr >>> 0);
      if (($shr3 & 3 | 0) != 0) {
        var $add8 = ($shr3 & 1 ^ 1) + $shr | 0;
        var $shl = $add8 << 1;
        var $1 = ($shl << 2) + __gm_ + 40 | 0;
        var $2 = ($shl + 2 << 2) + __gm_ + 40 | 0;
        var $3 = HEAPU32[$2 >> 2];
        var $fd9 = $3 + 8 | 0;
        var $4 = HEAPU32[$fd9 >> 2];
        if (($1 | 0) == ($4 | 0)) {
          HEAP32[__gm_ >> 2] = $0 & (1 << $add8 ^ -1);
        } else {
          if ($4 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
            _abort();
            throw "Reached an unreachable!";
          } else {
            HEAP32[$2 >> 2] = $4;
            HEAP32[$4 + 12 >> 2] = $1;
          }
        }
        var $shl20 = $add8 << 3;
        HEAP32[$3 + 4 >> 2] = $shl20 | 3;
        var $8 = $3 + ($shl20 | 4) | 0;
        var $or24 = HEAP32[$8 >> 2] | 1;
        HEAP32[$8 >> 2] = $or24;
        var $mem_0 = $fd9;
        __label__ = 37;
        break;
      }
      if ($cond >>> 0 <= HEAPU32[__gm_ + 8 >> 2] >>> 0) {
        var $nb_0 = $cond;
        __label__ = 29;
        break;
      }
      if (($shr3 | 0) != 0) {
        var $shl37 = 2 << $shr;
        var $and41 = $shr3 << $shr & ($shl37 | -$shl37);
        var $sub44 = ($and41 & -$and41) - 1 | 0;
        var $and46 = $sub44 >>> 12 & 16;
        var $shr47 = $sub44 >>> ($and46 >>> 0);
        var $and49 = $shr47 >>> 5 & 8;
        var $shr51 = $shr47 >>> ($and49 >>> 0);
        var $and53 = $shr51 >>> 2 & 4;
        var $shr55 = $shr51 >>> ($and53 >>> 0);
        var $and57 = $shr55 >>> 1 & 2;
        var $shr59 = $shr55 >>> ($and57 >>> 0);
        var $and61 = $shr59 >>> 1 & 1;
        var $add64 = ($and49 | $and46 | $and53 | $and57 | $and61) + ($shr59 >>> ($and61 >>> 0)) | 0;
        var $shl65 = $add64 << 1;
        var $12 = ($shl65 << 2) + __gm_ + 40 | 0;
        var $13 = ($shl65 + 2 << 2) + __gm_ + 40 | 0;
        var $14 = HEAPU32[$13 >> 2];
        var $fd69 = $14 + 8 | 0;
        var $15 = HEAPU32[$fd69 >> 2];
        if (($12 | 0) == ($15 | 0)) {
          HEAP32[__gm_ >> 2] = $0 & (1 << $add64 ^ -1);
        } else {
          if ($15 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
            _abort();
            throw "Reached an unreachable!";
          } else {
            HEAP32[$13 >> 2] = $15;
            HEAP32[$15 + 12 >> 2] = $12;
          }
        }
        var $shl87 = $add64 << 3;
        var $sub88 = $shl87 - $cond | 0;
        HEAP32[$14 + 4 >> 2] = $cond | 3;
        var $18 = $14;
        var $19 = $18 + $cond | 0;
        HEAP32[$18 + ($cond | 4) >> 2] = $sub88 | 1;
        HEAP32[$18 + $shl87 >> 2] = $sub88;
        var $21 = HEAPU32[__gm_ + 8 >> 2];
        if (($21 | 0) != 0) {
          var $22 = HEAP32[__gm_ + 20 >> 2];
          var $shl100 = $21 >>> 2 & 1073741822;
          var $24 = ($shl100 << 2) + __gm_ + 40 | 0;
          var $25 = HEAPU32[__gm_ >> 2];
          var $shl103 = 1 << ($21 >>> 3);
          var $tobool105 = ($25 & $shl103 | 0) == 0;
          do {
            if ($tobool105) {
              HEAP32[__gm_ >> 2] = $25 | $shl103;
              var $F102_0 = $24;
              var $_pre_phi = ($shl100 + 2 << 2) + __gm_ + 40 | 0;
            } else {
              var $26 = ($shl100 + 2 << 2) + __gm_ + 40 | 0;
              var $27 = HEAPU32[$26 >> 2];
              if ($27 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                var $F102_0 = $27;
                var $_pre_phi = $26;
                break;
              }
              _abort();
              throw "Reached an unreachable!";
            }
          } while (0);
          var $_pre_phi;
          var $F102_0;
          HEAP32[$_pre_phi >> 2] = $22;
          HEAP32[$F102_0 + 12 >> 2] = $22;
          var $fd122 = $22 + 8 | 0;
          HEAP32[$fd122 >> 2] = $F102_0;
          var $bk123 = $22 + 12 | 0;
          HEAP32[$bk123 >> 2] = $24;
        }
        HEAP32[__gm_ + 8 >> 2] = $sub88;
        HEAP32[__gm_ + 20 >> 2] = $19;
        var $mem_0 = $fd69;
        __label__ = 37;
        break;
      }
      if ((HEAP32[__gm_ + 4 >> 2] | 0) == 0) {
        var $nb_0 = $cond;
        __label__ = 29;
        break;
      }
      var $call = _tmalloc_small($cond);
      if (($call | 0) == 0) {
        var $nb_0 = $cond;
        __label__ = 29;
        break;
      }
      var $mem_0 = $call;
      __label__ = 37;
      break;
    } else {
      if ($bytes >>> 0 > 4294967231) {
        var $nb_0 = -1;
        __label__ = 29;
        break;
      }
      var $and143 = $bytes + 11 & -8;
      if ((HEAP32[__gm_ + 4 >> 2] | 0) == 0) {
        var $nb_0 = $and143;
        __label__ = 29;
        break;
      }
      var $call147 = _tmalloc_large($and143);
      if (($call147 | 0) == 0) {
        var $nb_0 = $and143;
        __label__ = 29;
        break;
      }
      var $mem_0 = $call147;
      __label__ = 37;
      break;
    }
  } while (0);
  if (__label__ == 29) {
    var $nb_0;
    var $33 = HEAPU32[__gm_ + 8 >> 2];
    if ($nb_0 >>> 0 > $33 >>> 0) {
      var $42 = HEAPU32[__gm_ + 12 >> 2];
      if ($nb_0 >>> 0 < $42 >>> 0) {
        var $sub186 = $42 - $nb_0 | 0;
        HEAP32[__gm_ + 12 >> 2] = $sub186;
        var $43 = HEAPU32[__gm_ + 24 >> 2];
        var $44 = $43;
        HEAP32[__gm_ + 24 >> 2] = $44 + $nb_0 | 0;
        HEAP32[$nb_0 + ($44 + 4) >> 2] = $sub186 | 1;
        HEAP32[$43 + 4 >> 2] = $nb_0 | 3;
        var $mem_0 = $43 + 8 | 0;
      } else {
        var $call198 = _sys_alloc($nb_0);
        var $mem_0 = $call198;
      }
    } else {
      var $sub158 = $33 - $nb_0 | 0;
      var $34 = HEAPU32[__gm_ + 20 >> 2];
      if ($sub158 >>> 0 > 15) {
        var $35 = $34;
        HEAP32[__gm_ + 20 >> 2] = $35 + $nb_0 | 0;
        HEAP32[__gm_ + 8 >> 2] = $sub158;
        HEAP32[$nb_0 + ($35 + 4) >> 2] = $sub158 | 1;
        HEAP32[$35 + $33 >> 2] = $sub158;
        HEAP32[$34 + 4 >> 2] = $nb_0 | 3;
      } else {
        HEAP32[__gm_ + 8 >> 2] = 0;
        HEAP32[__gm_ + 20 >> 2] = 0;
        HEAP32[$34 + 4 >> 2] = $33 | 3;
        var $39 = $33 + ($34 + 4) | 0;
        var $or178 = HEAP32[$39 >> 2] | 1;
        HEAP32[$39 >> 2] = $or178;
      }
      var $mem_0 = $34 + 8 | 0;
    }
  }
  var $mem_0;
  return $mem_0;
  return null;
}

_malloc["X"] = 1;

function _tmalloc_small($nb) {
  var $R_1$s2;
  var $v_0_ph$s2;
  var __label__;
  var $0 = HEAP32[__gm_ + 4 >> 2];
  var $sub2 = ($0 & -$0) - 1 | 0;
  var $and3 = $sub2 >>> 12 & 16;
  var $shr4 = $sub2 >>> ($and3 >>> 0);
  var $and6 = $shr4 >>> 5 & 8;
  var $shr7 = $shr4 >>> ($and6 >>> 0);
  var $and9 = $shr7 >>> 2 & 4;
  var $shr11 = $shr7 >>> ($and9 >>> 0);
  var $and13 = $shr11 >>> 1 & 2;
  var $shr15 = $shr11 >>> ($and13 >>> 0);
  var $and17 = $shr15 >>> 1 & 1;
  var $1 = HEAPU32[__gm_ + (($and6 | $and3 | $and9 | $and13 | $and17) + ($shr15 >>> ($and17 >>> 0)) << 2) + 304 >> 2];
  var $v_0_ph = $1, $v_0_ph$s2 = $v_0_ph >> 2;
  var $rsize_0_ph = (HEAP32[$1 + 4 >> 2] & -8) - $nb | 0;
  $while_cond_outer$2 : while (1) {
    var $rsize_0_ph;
    var $v_0_ph;
    var $t_0 = $v_0_ph;
    while (1) {
      var $t_0;
      var $3 = HEAP32[$t_0 + 16 >> 2];
      if (($3 | 0) == 0) {
        var $4 = HEAP32[$t_0 + 20 >> 2];
        if (($4 | 0) == 0) {
          break $while_cond_outer$2;
        }
        var $cond5 = $4;
      } else {
        var $cond5 = $3;
      }
      var $cond5;
      var $sub31 = (HEAP32[$cond5 + 4 >> 2] & -8) - $nb | 0;
      if ($sub31 >>> 0 < $rsize_0_ph >>> 0) {
        var $v_0_ph = $cond5, $v_0_ph$s2 = $v_0_ph >> 2;
        var $rsize_0_ph = $sub31;
        continue $while_cond_outer$2;
      }
      var $t_0 = $cond5;
    }
  }
  var $6 = $v_0_ph;
  var $7 = HEAPU32[__gm_ + 16 >> 2];
  var $cmp33 = $6 >>> 0 < $7 >>> 0;
  do {
    if (!$cmp33) {
      var $add_ptr = $6 + $nb | 0;
      var $8 = $add_ptr;
      if ($6 >>> 0 >= $add_ptr >>> 0) {
        break;
      }
      var $9 = HEAPU32[$v_0_ph$s2 + 6];
      var $10 = HEAPU32[$v_0_ph$s2 + 3];
      var $cmp40 = ($10 | 0) == ($v_0_ph | 0);
      do {
        if ($cmp40) {
          var $arrayidx55 = $v_0_ph + 20 | 0;
          var $13 = HEAP32[$arrayidx55 >> 2];
          if (($13 | 0) == 0) {
            var $arrayidx59 = $v_0_ph + 16 | 0;
            var $14 = HEAP32[$arrayidx59 >> 2];
            if (($14 | 0) == 0) {
              var $R_1 = 0, $R_1$s2 = $R_1 >> 2;
              break;
            }
            var $RP_0 = $arrayidx59;
            var $R_0 = $14;
          } else {
            var $RP_0 = $arrayidx55;
            var $R_0 = $13;
            __label__ = 13;
          }
          while (1) {
            var $R_0;
            var $RP_0;
            var $arrayidx65 = $R_0 + 20 | 0;
            var $15 = HEAP32[$arrayidx65 >> 2];
            if (($15 | 0) != 0) {
              var $RP_0 = $arrayidx65;
              var $R_0 = $15;
              continue;
            }
            var $arrayidx69 = $R_0 + 16 | 0;
            var $16 = HEAPU32[$arrayidx69 >> 2];
            if (($16 | 0) == 0) {
              break;
            }
            var $RP_0 = $arrayidx69;
            var $R_0 = $16;
          }
          if ($RP_0 >>> 0 < $7 >>> 0) {
            _abort();
            throw "Reached an unreachable!";
          } else {
            HEAP32[$RP_0 >> 2] = 0;
            var $R_1 = $R_0, $R_1$s2 = $R_1 >> 2;
          }
        } else {
          var $11 = HEAPU32[$v_0_ph$s2 + 2];
          if ($11 >>> 0 < $7 >>> 0) {
            _abort();
            throw "Reached an unreachable!";
          } else {
            HEAP32[$11 + 12 >> 2] = $10;
            HEAP32[$10 + 8 >> 2] = $11;
            var $R_1 = $10, $R_1$s2 = $R_1 >> 2;
          }
        }
      } while (0);
      var $R_1;
      var $cmp84 = ($9 | 0) == 0;
      $if_end167$$if_then86$29 : do {
        if (!$cmp84) {
          var $index = $v_0_ph + 28 | 0;
          var $arrayidx88 = (HEAP32[$index >> 2] << 2) + __gm_ + 304 | 0;
          var $cmp89 = ($v_0_ph | 0) == (HEAP32[$arrayidx88 >> 2] | 0);
          do {
            if ($cmp89) {
              HEAP32[$arrayidx88 >> 2] = $R_1;
              if (($R_1 | 0) != 0) {
                break;
              }
              var $and97 = HEAP32[__gm_ + 4 >> 2] & (1 << HEAP32[$index >> 2] ^ -1);
              HEAP32[__gm_ + 4 >> 2] = $and97;
              break $if_end167$$if_then86$29;
            }
            if ($9 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
              _abort();
              throw "Reached an unreachable!";
            } else {
              var $arrayidx107 = $9 + 16 | 0;
              if ((HEAP32[$arrayidx107 >> 2] | 0) == ($v_0_ph | 0)) {
                HEAP32[$arrayidx107 >> 2] = $R_1;
              } else {
                HEAP32[$9 + 20 >> 2] = $R_1;
              }
              if (($R_1 | 0) == 0) {
                break $if_end167$$if_then86$29;
              }
            }
          } while (0);
          if ($R_1 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
            _abort();
            throw "Reached an unreachable!";
          } else {
            HEAP32[$R_1$s2 + 6] = $9;
            var $27 = HEAPU32[$v_0_ph$s2 + 4];
            if (($27 | 0) != 0) {
              if ($27 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                _abort();
                throw "Reached an unreachable!";
              } else {
                HEAP32[$R_1$s2 + 4] = $27;
                HEAP32[$27 + 24 >> 2] = $R_1;
              }
            }
            var $30 = HEAPU32[$v_0_ph$s2 + 5];
            if (($30 | 0) == 0) {
              break;
            }
            if ($30 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
              _abort();
              throw "Reached an unreachable!";
            } else {
              HEAP32[$R_1$s2 + 5] = $30;
              HEAP32[$30 + 24 >> 2] = $R_1;
            }
          }
        }
      } while (0);
      if ($rsize_0_ph >>> 0 < 16) {
        var $add171 = $rsize_0_ph + $nb | 0;
        HEAP32[$v_0_ph$s2 + 1] = $add171 | 3;
        var $33 = $add171 + ($6 + 4) | 0;
        var $or177 = HEAP32[$33 >> 2] | 1;
        HEAP32[$33 >> 2] = $or177;
      } else {
        HEAP32[$v_0_ph$s2 + 1] = $nb | 3;
        HEAP32[$nb + ($6 + 4) >> 2] = $rsize_0_ph | 1;
        HEAP32[$6 + $rsize_0_ph + $nb >> 2] = $rsize_0_ph;
        var $36 = HEAPU32[__gm_ + 8 >> 2];
        if (($36 | 0) != 0) {
          var $37 = HEAPU32[__gm_ + 20 >> 2];
          var $shl189 = $36 >>> 2 & 1073741822;
          var $39 = ($shl189 << 2) + __gm_ + 40 | 0;
          var $40 = HEAPU32[__gm_ >> 2];
          var $shl192 = 1 << ($36 >>> 3);
          var $tobool194 = ($40 & $shl192 | 0) == 0;
          do {
            if ($tobool194) {
              HEAP32[__gm_ >> 2] = $40 | $shl192;
              var $F191_0 = $39;
              var $_pre_phi = ($shl189 + 2 << 2) + __gm_ + 40 | 0;
            } else {
              var $41 = ($shl189 + 2 << 2) + __gm_ + 40 | 0;
              var $42 = HEAPU32[$41 >> 2];
              if ($42 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                var $F191_0 = $42;
                var $_pre_phi = $41;
                break;
              }
              _abort();
              throw "Reached an unreachable!";
            }
          } while (0);
          var $_pre_phi;
          var $F191_0;
          HEAP32[$_pre_phi >> 2] = $37;
          HEAP32[$F191_0 + 12 >> 2] = $37;
          HEAP32[$37 + 8 >> 2] = $F191_0;
          HEAP32[$37 + 12 >> 2] = $39;
        }
        HEAP32[__gm_ + 8 >> 2] = $rsize_0_ph;
        HEAP32[__gm_ + 20 >> 2] = $8;
      }
      return $v_0_ph + 8 | 0;
    }
  } while (0);
  _abort();
  throw "Reached an unreachable!";
  return null;
}

_tmalloc_small["X"] = 1;

function _tmalloc_large($nb) {
  var $R_1$s2;
  var $10$s2;
  var $t_221$s2;
  var $v_3_lcssa$s2;
  var $t_0$s2;
  var $nb$s2 = $nb >> 2;
  var __label__;
  var $sub = -$nb | 0;
  var $shr = $nb >>> 8;
  var $cmp = ($shr | 0) == 0;
  do {
    if ($cmp) {
      var $idx_0 = 0;
    } else {
      if ($nb >>> 0 > 16777215) {
        var $idx_0 = 31;
        break;
      }
      var $and = ($shr + 1048320 | 0) >>> 16 & 8;
      var $shl = $shr << $and;
      var $and8 = ($shl + 520192 | 0) >>> 16 & 4;
      var $shl9 = $shl << $and8;
      var $and12 = ($shl9 + 245760 | 0) >>> 16 & 2;
      var $add17 = 14 - ($and8 | $and | $and12) + ($shl9 << $and12 >>> 15) | 0;
      var $idx_0 = $nb >>> (($add17 + 7 | 0) >>> 0) & 1 | $add17 << 1;
    }
  } while (0);
  var $idx_0;
  var $0 = HEAPU32[__gm_ + ($idx_0 << 2) + 304 >> 2];
  var $cmp24 = ($0 | 0) == 0;
  $if_end53$$if_then25$75 : do {
    if ($cmp24) {
      var $v_2 = 0;
      var $rsize_2 = $sub;
      var $t_1 = 0;
    } else {
      if (($idx_0 | 0) == 31) {
        var $cond = 0;
      } else {
        var $cond = 25 - ($idx_0 >>> 1) | 0;
      }
      var $cond;
      var $v_0 = 0;
      var $rsize_0 = $sub;
      var $t_0 = $0, $t_0$s2 = $t_0 >> 2;
      var $sizebits_0 = $nb << $cond;
      var $rst_0 = 0;
      while (1) {
        var $rst_0;
        var $sizebits_0;
        var $t_0;
        var $rsize_0;
        var $v_0;
        var $and32 = HEAP32[$t_0$s2 + 1] & -8;
        var $sub33 = $and32 - $nb | 0;
        if ($sub33 >>> 0 < $rsize_0 >>> 0) {
          if (($and32 | 0) == ($nb | 0)) {
            var $v_2 = $t_0;
            var $rsize_2 = $sub33;
            var $t_1 = $t_0;
            break $if_end53$$if_then25$75;
          }
          var $v_1 = $t_0;
          var $rsize_1 = $sub33;
        } else {
          var $v_1 = $v_0;
          var $rsize_1 = $rsize_0;
        }
        var $rsize_1;
        var $v_1;
        var $2 = HEAPU32[$t_0$s2 + 5];
        var $3 = HEAPU32[(($sizebits_0 >>> 31 << 2) + 16 >> 2) + $t_0$s2];
        var $rst_1 = ($2 | 0) == 0 | ($2 | 0) == ($3 | 0) ? $rst_0 : $2;
        if (($3 | 0) == 0) {
          var $v_2 = $v_1;
          var $rsize_2 = $rsize_1;
          var $t_1 = $rst_1;
          break $if_end53$$if_then25$75;
        }
        var $v_0 = $v_1;
        var $rsize_0 = $rsize_1;
        var $t_0 = $3, $t_0$s2 = $t_0 >> 2;
        var $sizebits_0 = $sizebits_0 << 1;
        var $rst_0 = $rst_1;
      }
    }
  } while (0);
  var $t_1;
  var $rsize_2;
  var $v_2;
  var $or_cond16 = ($t_1 | 0) == 0 & ($v_2 | 0) == 0;
  do {
    if ($or_cond16) {
      var $shl59 = 2 << $idx_0;
      var $and63 = HEAP32[__gm_ + 4 >> 2] & ($shl59 | -$shl59);
      if (($and63 | 0) == 0) {
        var $t_2_ph = $t_1;
        break;
      }
      var $sub69 = ($and63 & -$and63) - 1 | 0;
      var $and72 = $sub69 >>> 12 & 16;
      var $shr74 = $sub69 >>> ($and72 >>> 0);
      var $and76 = $shr74 >>> 5 & 8;
      var $shr78 = $shr74 >>> ($and76 >>> 0);
      var $and80 = $shr78 >>> 2 & 4;
      var $shr82 = $shr78 >>> ($and80 >>> 0);
      var $and84 = $shr82 >>> 1 & 2;
      var $shr86 = $shr82 >>> ($and84 >>> 0);
      var $and88 = $shr86 >>> 1 & 1;
      var $t_2_ph = HEAP32[__gm_ + (($and76 | $and72 | $and80 | $and84 | $and88) + ($shr86 >>> ($and88 >>> 0)) << 2) + 304 >> 2];
    } else {
      var $t_2_ph = $t_1;
    }
  } while (0);
  var $t_2_ph;
  var $cmp9620 = ($t_2_ph | 0) == 0;
  $while_end$$while_body$91 : do {
    if ($cmp9620) {
      var $rsize_3_lcssa = $rsize_2;
      var $v_3_lcssa = $v_2, $v_3_lcssa$s2 = $v_3_lcssa >> 2;
    } else {
      var $t_221 = $t_2_ph, $t_221$s2 = $t_221 >> 2;
      var $rsize_322 = $rsize_2;
      var $v_323 = $v_2;
      while (1) {
        var $v_323;
        var $rsize_322;
        var $t_221;
        var $sub100 = (HEAP32[$t_221$s2 + 1] & -8) - $nb | 0;
        var $cmp101 = $sub100 >>> 0 < $rsize_322 >>> 0;
        var $rsize_4 = $cmp101 ? $sub100 : $rsize_322;
        var $v_4 = $cmp101 ? $t_221 : $v_323;
        var $7 = HEAPU32[$t_221$s2 + 4];
        if (($7 | 0) != 0) {
          var $t_221 = $7, $t_221$s2 = $t_221 >> 2;
          var $rsize_322 = $rsize_4;
          var $v_323 = $v_4;
          continue;
        }
        var $8 = HEAPU32[$t_221$s2 + 5];
        if (($8 | 0) == 0) {
          var $rsize_3_lcssa = $rsize_4;
          var $v_3_lcssa = $v_4, $v_3_lcssa$s2 = $v_3_lcssa >> 2;
          break $while_end$$while_body$91;
        }
        var $t_221 = $8, $t_221$s2 = $t_221 >> 2;
        var $rsize_322 = $rsize_4;
        var $v_323 = $v_4;
      }
    }
  } while (0);
  var $v_3_lcssa;
  var $rsize_3_lcssa;
  var $cmp115 = ($v_3_lcssa | 0) == 0;
  $return$$land_lhs_true116$96 : do {
    if ($cmp115) {
      var $retval_0 = 0;
    } else {
      if ($rsize_3_lcssa >>> 0 >= (HEAP32[__gm_ + 8 >> 2] - $nb | 0) >>> 0) {
        var $retval_0 = 0;
        break;
      }
      var $10 = $v_3_lcssa, $10$s2 = $10 >> 2;
      var $11 = HEAPU32[__gm_ + 16 >> 2];
      var $cmp120 = $10 >>> 0 < $11 >>> 0;
      do {
        if (!$cmp120) {
          var $add_ptr = $10 + $nb | 0;
          var $12 = $add_ptr;
          if ($10 >>> 0 >= $add_ptr >>> 0) {
            break;
          }
          var $13 = HEAPU32[$v_3_lcssa$s2 + 6];
          var $14 = HEAPU32[$v_3_lcssa$s2 + 3];
          var $cmp127 = ($14 | 0) == ($v_3_lcssa | 0);
          do {
            if ($cmp127) {
              var $arrayidx143 = $v_3_lcssa + 20 | 0;
              var $17 = HEAP32[$arrayidx143 >> 2];
              if (($17 | 0) == 0) {
                var $arrayidx147 = $v_3_lcssa + 16 | 0;
                var $18 = HEAP32[$arrayidx147 >> 2];
                if (($18 | 0) == 0) {
                  var $R_1 = 0, $R_1$s2 = $R_1 >> 2;
                  break;
                }
                var $RP_0 = $arrayidx147;
                var $R_0 = $18;
              } else {
                var $RP_0 = $arrayidx143;
                var $R_0 = $17;
                __label__ = 27;
              }
              while (1) {
                var $R_0;
                var $RP_0;
                var $arrayidx153 = $R_0 + 20 | 0;
                var $19 = HEAP32[$arrayidx153 >> 2];
                if (($19 | 0) != 0) {
                  var $RP_0 = $arrayidx153;
                  var $R_0 = $19;
                  continue;
                }
                var $arrayidx157 = $R_0 + 16 | 0;
                var $20 = HEAPU32[$arrayidx157 >> 2];
                if (($20 | 0) == 0) {
                  break;
                }
                var $RP_0 = $arrayidx157;
                var $R_0 = $20;
              }
              if ($RP_0 >>> 0 < $11 >>> 0) {
                _abort();
                throw "Reached an unreachable!";
              } else {
                HEAP32[$RP_0 >> 2] = 0;
                var $R_1 = $R_0, $R_1$s2 = $R_1 >> 2;
              }
            } else {
              var $15 = HEAPU32[$v_3_lcssa$s2 + 2];
              if ($15 >>> 0 < $11 >>> 0) {
                _abort();
                throw "Reached an unreachable!";
              } else {
                HEAP32[$15 + 12 >> 2] = $14;
                HEAP32[$14 + 8 >> 2] = $15;
                var $R_1 = $14, $R_1$s2 = $R_1 >> 2;
              }
            }
          } while (0);
          var $R_1;
          var $cmp172 = ($13 | 0) == 0;
          $if_end256$$if_then174$118 : do {
            if (!$cmp172) {
              var $index = $v_3_lcssa + 28 | 0;
              var $arrayidx176 = (HEAP32[$index >> 2] << 2) + __gm_ + 304 | 0;
              var $cmp177 = ($v_3_lcssa | 0) == (HEAP32[$arrayidx176 >> 2] | 0);
              do {
                if ($cmp177) {
                  HEAP32[$arrayidx176 >> 2] = $R_1;
                  if (($R_1 | 0) != 0) {
                    break;
                  }
                  var $and186 = HEAP32[__gm_ + 4 >> 2] & (1 << HEAP32[$index >> 2] ^ -1);
                  HEAP32[__gm_ + 4 >> 2] = $and186;
                  break $if_end256$$if_then174$118;
                }
                if ($13 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                  _abort();
                  throw "Reached an unreachable!";
                } else {
                  var $arrayidx196 = $13 + 16 | 0;
                  if ((HEAP32[$arrayidx196 >> 2] | 0) == ($v_3_lcssa | 0)) {
                    HEAP32[$arrayidx196 >> 2] = $R_1;
                  } else {
                    HEAP32[$13 + 20 >> 2] = $R_1;
                  }
                  if (($R_1 | 0) == 0) {
                    break $if_end256$$if_then174$118;
                  }
                }
              } while (0);
              if ($R_1 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                _abort();
                throw "Reached an unreachable!";
              } else {
                HEAP32[$R_1$s2 + 6] = $13;
                var $31 = HEAPU32[$v_3_lcssa$s2 + 4];
                if (($31 | 0) != 0) {
                  if ($31 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                    _abort();
                    throw "Reached an unreachable!";
                  } else {
                    HEAP32[$R_1$s2 + 4] = $31;
                    HEAP32[$31 + 24 >> 2] = $R_1;
                  }
                }
                var $34 = HEAPU32[$v_3_lcssa$s2 + 5];
                if (($34 | 0) == 0) {
                  break;
                }
                if ($34 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                  _abort();
                  throw "Reached an unreachable!";
                } else {
                  HEAP32[$R_1$s2 + 5] = $34;
                  HEAP32[$34 + 24 >> 2] = $R_1;
                }
              }
            }
          } while (0);
          var $cmp257 = $rsize_3_lcssa >>> 0 < 16;
          $if_then259$$if_else268$146 : do {
            if ($cmp257) {
              var $add260 = $rsize_3_lcssa + $nb | 0;
              HEAP32[$v_3_lcssa$s2 + 1] = $add260 | 3;
              var $37 = $add260 + ($10 + 4) | 0;
              var $or267 = HEAP32[$37 >> 2] | 1;
              HEAP32[$37 >> 2] = $or267;
            } else {
              HEAP32[$v_3_lcssa$s2 + 1] = $nb | 3;
              HEAP32[$nb$s2 + ($10$s2 + 1)] = $rsize_3_lcssa | 1;
              HEAP32[($rsize_3_lcssa >> 2) + $10$s2 + $nb$s2] = $rsize_3_lcssa;
              if ($rsize_3_lcssa >>> 0 < 256) {
                var $shl280 = $rsize_3_lcssa >>> 2 & 1073741822;
                var $41 = ($shl280 << 2) + __gm_ + 40 | 0;
                var $42 = HEAPU32[__gm_ >> 2];
                var $shl283 = 1 << ($rsize_3_lcssa >>> 3);
                var $tobool285 = ($42 & $shl283 | 0) == 0;
                do {
                  if ($tobool285) {
                    HEAP32[__gm_ >> 2] = $42 | $shl283;
                    var $F282_0 = $41;
                    var $_pre_phi = ($shl280 + 2 << 2) + __gm_ + 40 | 0;
                  } else {
                    var $43 = ($shl280 + 2 << 2) + __gm_ + 40 | 0;
                    var $44 = HEAPU32[$43 >> 2];
                    if ($44 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                      var $F282_0 = $44;
                      var $_pre_phi = $43;
                      break;
                    }
                    _abort();
                    throw "Reached an unreachable!";
                  }
                } while (0);
                var $_pre_phi;
                var $F282_0;
                HEAP32[$_pre_phi >> 2] = $12;
                HEAP32[$F282_0 + 12 >> 2] = $12;
                HEAP32[$nb$s2 + ($10$s2 + 2)] = $F282_0;
                HEAP32[$nb$s2 + ($10$s2 + 3)] = $41;
              } else {
                var $49 = $add_ptr;
                var $shr310 = $rsize_3_lcssa >>> 8;
                var $cmp311 = ($shr310 | 0) == 0;
                do {
                  if ($cmp311) {
                    var $I308_0 = 0;
                  } else {
                    if ($rsize_3_lcssa >>> 0 > 16777215) {
                      var $I308_0 = 31;
                      break;
                    }
                    var $and323 = ($shr310 + 1048320 | 0) >>> 16 & 8;
                    var $shl325 = $shr310 << $and323;
                    var $and328 = ($shl325 + 520192 | 0) >>> 16 & 4;
                    var $shl330 = $shl325 << $and328;
                    var $and333 = ($shl330 + 245760 | 0) >>> 16 & 2;
                    var $add338 = 14 - ($and328 | $and323 | $and333) + ($shl330 << $and333 >>> 15) | 0;
                    var $I308_0 = $rsize_3_lcssa >>> (($add338 + 7 | 0) >>> 0) & 1 | $add338 << 1;
                  }
                } while (0);
                var $I308_0;
                var $arrayidx347 = ($I308_0 << 2) + __gm_ + 304 | 0;
                HEAP32[$nb$s2 + ($10$s2 + 7)] = $I308_0;
                var $child349 = $nb + ($10 + 16) | 0;
                HEAP32[$nb$s2 + ($10$s2 + 5)] = 0;
                HEAP32[$child349 >> 2] = 0;
                var $52 = HEAP32[__gm_ + 4 >> 2];
                var $shl354 = 1 << $I308_0;
                if (($52 & $shl354 | 0) == 0) {
                  var $or360 = $52 | $shl354;
                  HEAP32[__gm_ + 4 >> 2] = $or360;
                  HEAP32[$arrayidx347 >> 2] = $49;
                  HEAP32[$nb$s2 + ($10$s2 + 6)] = $arrayidx347;
                  HEAP32[$nb$s2 + ($10$s2 + 3)] = $49;
                  HEAP32[$nb$s2 + ($10$s2 + 2)] = $49;
                } else {
                  if (($I308_0 | 0) == 31) {
                    var $cond375 = 0;
                  } else {
                    var $cond375 = 25 - ($I308_0 >>> 1) | 0;
                  }
                  var $cond375;
                  var $K365_0 = $rsize_3_lcssa << $cond375;
                  var $T_0 = HEAP32[$arrayidx347 >> 2];
                  while (1) {
                    var $T_0;
                    var $K365_0;
                    if ((HEAP32[$T_0 + 4 >> 2] & -8 | 0) == ($rsize_3_lcssa | 0)) {
                      var $fd405 = $T_0 + 8 | 0;
                      var $65 = HEAPU32[$fd405 >> 2];
                      var $67 = HEAPU32[__gm_ + 16 >> 2];
                      var $cmp407 = $T_0 >>> 0 < $67 >>> 0;
                      do {
                        if (!$cmp407) {
                          if ($65 >>> 0 < $67 >>> 0) {
                            break;
                          }
                          HEAP32[$65 + 12 >> 2] = $49;
                          HEAP32[$fd405 >> 2] = $49;
                          HEAP32[$nb$s2 + ($10$s2 + 2)] = $65;
                          HEAP32[$nb$s2 + ($10$s2 + 3)] = $T_0;
                          HEAP32[$nb$s2 + ($10$s2 + 6)] = 0;
                          break $if_then259$$if_else268$146;
                        }
                      } while (0);
                      _abort();
                      throw "Reached an unreachable!";
                    } else {
                      var $arrayidx386 = ($K365_0 >>> 31 << 2) + $T_0 + 16 | 0;
                      var $59 = HEAPU32[$arrayidx386 >> 2];
                      if (($59 | 0) == 0) {
                        if ($arrayidx386 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                          HEAP32[$arrayidx386 >> 2] = $49;
                          HEAP32[$nb$s2 + ($10$s2 + 6)] = $T_0;
                          HEAP32[$nb$s2 + ($10$s2 + 3)] = $49;
                          HEAP32[$nb$s2 + ($10$s2 + 2)] = $49;
                          break $if_then259$$if_else268$146;
                        }
                        _abort();
                        throw "Reached an unreachable!";
                      } else {
                        var $K365_0 = $K365_0 << 1;
                        var $T_0 = $59;
                      }
                    }
                  }
                }
              }
            }
          } while (0);
          var $retval_0 = $v_3_lcssa + 8 | 0;
          break $return$$land_lhs_true116$96;
        }
      } while (0);
      _abort();
      throw "Reached an unreachable!";
    }
  } while (0);
  var $retval_0;
  return $retval_0;
  return null;
}

_tmalloc_large["X"] = 1;

function _sys_alloc($nb) {
  var $sp_0$s2;
  var __label__;
  if ((HEAP32[_mparams >> 2] | 0) == 0) {
    _init_mparams();
  }
  var $tobool11 = (HEAP32[__gm_ + 440 >> 2] & 4 | 0) == 0;
  do {
    if ($tobool11) {
      var $2 = HEAP32[__gm_ + 24 >> 2];
      var $cmp13 = ($2 | 0) == 0;
      do {
        if ($cmp13) {
          __label__ = 5;
        } else {
          var $3 = $2;
          var $call15 = _segment_holding($3);
          if (($call15 | 0) == 0) {
            __label__ = 5;
            break;
          }
          var $8 = HEAP32[_mparams + 8 >> 2];
          var $and50 = $nb + 47 - HEAP32[__gm_ + 12 >> 2] + $8 & -$8;
          if ($and50 >>> 0 >= 2147483647) {
            __label__ = 13;
            break;
          }
          var $call53 = _sbrk($and50);
          if (($call53 | 0) == (HEAP32[$call15 >> 2] + HEAP32[$call15 + 4 >> 2] | 0)) {
            var $tbase_0 = $call53;
            var $asize_1 = $and50;
            var $br_0 = $call53;
            __label__ = 12;
            break;
          }
          var $br_07 = $call53;
          var $asize_18 = $and50;
          __label__ = 14;
          break;
        }
      } while (0);
      do {
        if (__label__ == 5) {
          var $call18 = _sbrk(0);
          if (($call18 | 0) == -1) {
            __label__ = 13;
            break;
          }
          var $4 = HEAP32[_mparams + 8 >> 2];
          var $and23 = $4 + ($nb + 47) & -$4;
          var $5 = $call18;
          var $6 = HEAP32[_mparams + 4 >> 2];
          var $sub24 = $6 - 1 | 0;
          if (($sub24 & $5 | 0) == 0) {
            var $asize_0 = $and23;
          } else {
            var $asize_0 = $and23 - $5 + ($sub24 + $5 & -$6) | 0;
          }
          var $asize_0;
          if ($asize_0 >>> 0 >= 2147483647) {
            __label__ = 13;
            break;
          }
          var $call38 = _sbrk($asize_0);
          if (($call38 | 0) == ($call18 | 0)) {
            var $tbase_0 = $call18;
            var $asize_1 = $asize_0;
            var $br_0 = $call38;
            __label__ = 12;
            break;
          }
          var $br_07 = $call38;
          var $asize_18 = $asize_0;
          __label__ = 14;
          break;
        }
      } while (0);
      if (__label__ == 13) {
        var $or31 = HEAP32[__gm_ + 440 >> 2] | 4;
        HEAP32[__gm_ + 440 >> 2] = $or31;
        __label__ = 22;
        break;
      } else if (__label__ == 12) {
        var $br_0;
        var $asize_1;
        var $tbase_0;
        if (($tbase_0 | 0) != -1) {
          var $tsize_220 = $asize_1;
          var $tbase_221 = $tbase_0;
          __label__ = 25;
          break;
        }
        var $br_07 = $br_0;
        var $asize_18 = $asize_1;
      }
      var $asize_18;
      var $br_07;
      var $sub82 = -$asize_18 | 0;
      var $or_cond = ($br_07 | 0) != -1 & $asize_18 >>> 0 < 2147483647;
      do {
        if ($or_cond) {
          if ($asize_18 >>> 0 >= ($nb + 48 | 0) >>> 0) {
            var $asize_2 = $asize_18;
            __label__ = 20;
            break;
          }
          var $12 = HEAP32[_mparams + 8 >> 2];
          var $and74 = $nb + 47 - $asize_18 + $12 & -$12;
          if ($and74 >>> 0 >= 2147483647) {
            var $asize_2 = $asize_18;
            __label__ = 20;
            break;
          }
          var $call77 = _sbrk($and74);
          if (($call77 | 0) == -1) {
            var $call83 = _sbrk($sub82);
            __label__ = 21;
            break;
          }
          var $asize_2 = $and74 + $asize_18 | 0;
          __label__ = 20;
          break;
        } else {
          var $asize_2 = $asize_18;
          __label__ = 20;
        }
      } while (0);
      if (__label__ == 20) {
        var $asize_2;
        if (($br_07 | 0) != -1) {
          var $tsize_220 = $asize_2;
          var $tbase_221 = $br_07;
          __label__ = 25;
          break;
        }
      }
      var $or = HEAP32[__gm_ + 440 >> 2] | 4;
      HEAP32[__gm_ + 440 >> 2] = $or;
      __label__ = 22;
      break;
    }
    __label__ = 22;
  } while (0);
  do {
    if (__label__ == 22) {
      var $14 = HEAP32[_mparams + 8 >> 2];
      var $and103 = $14 + ($nb + 47) & -$14;
      if ($and103 >>> 0 >= 2147483647) {
        __label__ = 48;
        break;
      }
      var $call108 = _sbrk($and103);
      var $call109 = _sbrk(0);
      if (!(($call109 | 0) != -1 & ($call108 | 0) != -1 & $call108 >>> 0 < $call109 >>> 0)) {
        __label__ = 48;
        break;
      }
      var $sub_ptr_sub = $call109 - $call108 | 0;
      if ($sub_ptr_sub >>> 0 <= ($nb + 40 | 0) >>> 0 | ($call108 | 0) == -1) {
        __label__ = 48;
        break;
      }
      var $tsize_220 = $sub_ptr_sub;
      var $tbase_221 = $call108;
      __label__ = 25;
      break;
    }
  } while (0);
  $if_end241$$if_then124$36 : do {
    if (__label__ == 25) {
      var $tbase_221;
      var $tsize_220;
      var $add125 = HEAP32[__gm_ + 432 >> 2] + $tsize_220 | 0;
      HEAP32[__gm_ + 432 >> 2] = $add125;
      if ($add125 >>> 0 > HEAPU32[__gm_ + 436 >> 2] >>> 0) {
        HEAP32[__gm_ + 436 >> 2] = $add125;
      }
      var $17 = HEAPU32[__gm_ + 24 >> 2];
      var $cmp132 = ($17 | 0) == 0;
      $if_then133$$while_cond$41 : do {
        if ($cmp132) {
          var $18 = HEAPU32[__gm_ + 16 >> 2];
          if (($18 | 0) == 0 | $tbase_221 >>> 0 < $18 >>> 0) {
            HEAP32[__gm_ + 16 >> 2] = $tbase_221;
          }
          HEAP32[__gm_ + 444 >> 2] = $tbase_221;
          HEAP32[__gm_ + 448 >> 2] = $tsize_220;
          HEAP32[__gm_ + 456 >> 2] = 0;
          var $19 = HEAP32[_mparams >> 2];
          HEAP32[__gm_ + 36 >> 2] = $19;
          HEAP32[__gm_ + 32 >> 2] = -1;
          _init_bins();
          _init_top($tbase_221, $tsize_220 - 40 | 0);
        } else {
          var $sp_0 = __gm_ + 444 | 0, $sp_0$s2 = $sp_0 >> 2;
          while (1) {
            var $sp_0;
            if (($sp_0 | 0) == 0) {
              break;
            }
            var $21 = HEAPU32[$sp_0$s2];
            var $size162 = $sp_0 + 4 | 0;
            var $22 = HEAPU32[$size162 >> 2];
            var $add_ptr163 = $21 + $22 | 0;
            if (($tbase_221 | 0) == ($add_ptr163 | 0)) {
              if ((HEAP32[$sp_0$s2 + 3] & 8 | 0) != 0) {
                break;
              }
              var $25 = $17;
              if (!($25 >>> 0 >= $21 >>> 0 & $25 >>> 0 < $add_ptr163 >>> 0)) {
                break;
              }
              HEAP32[$size162 >> 2] = $22 + $tsize_220 | 0;
              var $26 = HEAP32[__gm_ + 24 >> 2];
              var $add189 = HEAP32[__gm_ + 12 >> 2] + $tsize_220 | 0;
              _init_top($26, $add189);
              break $if_then133$$while_cond$41;
            }
            var $sp_0 = HEAP32[$sp_0$s2 + 2], $sp_0$s2 = $sp_0 >> 2;
          }
          if ($tbase_221 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
            HEAP32[__gm_ + 16 >> 2] = $tbase_221;
          }
          var $add_ptr201 = $tbase_221 + $tsize_220 | 0;
          var $sp_1 = __gm_ + 444 | 0;
          while (1) {
            var $sp_1;
            if (($sp_1 | 0) == 0) {
              break;
            }
            var $base200 = $sp_1 | 0;
            var $29 = HEAPU32[$base200 >> 2];
            if (($29 | 0) == ($add_ptr201 | 0)) {
              if ((HEAP32[$sp_1 + 12 >> 2] & 8 | 0) != 0) {
                break;
              }
              HEAP32[$base200 >> 2] = $tbase_221;
              var $size219 = $sp_1 + 4 | 0;
              var $add220 = HEAP32[$size219 >> 2] + $tsize_220 | 0;
              HEAP32[$size219 >> 2] = $add220;
              var $call221 = _prepend_alloc($tbase_221, $29, $nb);
              var $retval_0 = $call221;
              __label__ = 49;
              break $if_end241$$if_then124$36;
            }
            var $sp_1 = HEAP32[$sp_1 + 8 >> 2];
          }
          _add_segment($tbase_221, $tsize_220);
        }
      } while (0);
      var $33 = HEAPU32[__gm_ + 12 >> 2];
      if ($33 >>> 0 <= $nb >>> 0) {
        __label__ = 48;
        break;
      }
      var $sub230 = $33 - $nb | 0;
      HEAP32[__gm_ + 12 >> 2] = $sub230;
      var $34 = HEAPU32[__gm_ + 24 >> 2];
      var $35 = $34;
      HEAP32[__gm_ + 24 >> 2] = $35 + $nb | 0;
      HEAP32[$nb + ($35 + 4) >> 2] = $sub230 | 1;
      HEAP32[$34 + 4 >> 2] = $nb | 3;
      var $retval_0 = $34 + 8 | 0;
      __label__ = 49;
      break;
    }
  } while (0);
  if (__label__ == 48) {
    var $call242 = ___errno();
    HEAP32[$call242 >> 2] = 12;
    var $retval_0 = 0;
  }
  var $retval_0;
  return $retval_0;
  return null;
}

_sys_alloc["X"] = 1;

function _release_unused_segments() {
  var $sp_01 = HEAP32[__gm_ + 452 >> 2];
  var $cmp2 = ($sp_01 | 0) == 0;
  $while_end256$$if_end255$195 : do {
    if (!$cmp2) {
      var $sp_03 = $sp_01;
      while (1) {
        var $sp_03;
        var $sp_0 = HEAP32[$sp_03 + 8 >> 2];
        if (($sp_0 | 0) == 0) {
          break $while_end256$$if_end255$195;
        }
        var $sp_03 = $sp_0;
      }
    }
  } while (0);
  HEAP32[__gm_ + 32 >> 2] = -1;
  return;
  return;
}

function _sys_trim() {
  var $size$s2;
  if ((HEAP32[_mparams >> 2] | 0) == 0) {
    _init_mparams();
  }
  var $1 = HEAPU32[__gm_ + 24 >> 2];
  var $cmp2 = ($1 | 0) == 0;
  $if_end51$$if_then$183 : do {
    if (!$cmp2) {
      var $2 = HEAPU32[__gm_ + 12 >> 2];
      var $cmp3 = $2 >>> 0 > 40;
      do {
        if ($cmp3) {
          var $3 = HEAPU32[_mparams + 8 >> 2];
          var $add7 = $2 - 41 + $3 | 0;
          var $div = Math.floor(($add7 >>> 0) / ($3 >>> 0));
          var $mul = ($div - 1) * $3 | 0;
          var $4 = $1;
          var $call10 = _segment_holding($4);
          if ((HEAP32[$call10 + 12 >> 2] & 8 | 0) != 0) {
            break;
          }
          var $call20 = _sbrk(0);
          var $size$s2 = ($call10 + 4 | 0) >> 2;
          if (($call20 | 0) != (HEAP32[$call10 >> 2] + HEAP32[$size$s2] | 0)) {
            break;
          }
          var $sub19_mul = $mul >>> 0 > 2147483646 ? -2147483648 - $3 | 0 : $mul;
          var $sub23 = -$sub19_mul | 0;
          var $call24 = _sbrk($sub23);
          var $call25 = _sbrk(0);
          if (!(($call24 | 0) != -1 & $call25 >>> 0 < $call20 >>> 0)) {
            break;
          }
          var $sub_ptr_sub = $call20 - $call25 | 0;
          if (($call20 | 0) == ($call25 | 0)) {
            break;
          }
          var $sub37 = HEAP32[$size$s2] - $sub_ptr_sub | 0;
          HEAP32[$size$s2] = $sub37;
          var $sub38 = HEAP32[__gm_ + 432 >> 2] - $sub_ptr_sub | 0;
          HEAP32[__gm_ + 432 >> 2] = $sub38;
          var $10 = HEAP32[__gm_ + 24 >> 2];
          var $sub41 = HEAP32[__gm_ + 12 >> 2] - $sub_ptr_sub | 0;
          _init_top($10, $sub41);
          break $if_end51$$if_then$183;
        }
      } while (0);
      if (HEAPU32[__gm_ + 12 >> 2] >>> 0 <= HEAPU32[__gm_ + 28 >> 2] >>> 0) {
        break;
      }
      HEAP32[__gm_ + 28 >> 2] = -1;
    }
  } while (0);
  return;
  return;
}

_sys_trim["X"] = 1;

function _free($mem) {
  var $R288_1$s2;
  var $R_1$s2;
  var $p_0$s2;
  var $48$s2;
  var $add_ptr_sum1$s2;
  var $and5$s2;
  var $mem$s2 = $mem >> 2;
  var __label__;
  var $cmp = ($mem | 0) == 0;
  $if_end586$$if_then$2 : do {
    if (!$cmp) {
      var $add_ptr = $mem - 8 | 0;
      var $0 = $add_ptr;
      var $1 = HEAPU32[__gm_ + 16 >> 2];
      var $cmp1 = $add_ptr >>> 0 < $1 >>> 0;
      $erroraction$$land_rhs$4 : do {
        if (!$cmp1) {
          var $3 = HEAPU32[$mem - 4 >> 2];
          var $and = $3 & 3;
          if (($and | 0) == 1) {
            break;
          }
          var $and5 = $3 & -8, $and5$s2 = $and5 >> 2;
          var $add_ptr6 = $mem + ($and5 - 8) | 0;
          var $4 = $add_ptr6;
          var $tobool9 = ($3 & 1 | 0) == 0;
          $if_then10$$if_end198$7 : do {
            if ($tobool9) {
              var $5 = HEAPU32[$add_ptr >> 2];
              if (($and | 0) == 0) {
                break $if_end586$$if_then$2;
              }
              var $add_ptr_sum1 = -8 - $5 | 0, $add_ptr_sum1$s2 = $add_ptr_sum1 >> 2;
              var $add_ptr16 = $mem + $add_ptr_sum1 | 0;
              var $6 = $add_ptr16;
              var $add17 = $5 + $and5 | 0;
              if ($add_ptr16 >>> 0 < $1 >>> 0) {
                break $erroraction$$land_rhs$4;
              }
              if (($6 | 0) == (HEAP32[__gm_ + 20 >> 2] | 0)) {
                var $48$s2 = ($mem + ($and5 - 4) | 0) >> 2;
                if ((HEAP32[$48$s2] & 3 | 0) != 3) {
                  var $p_0 = $6, $p_0$s2 = $p_0 >> 2;
                  var $psize_0 = $add17;
                  break;
                }
                HEAP32[__gm_ + 8 >> 2] = $add17;
                var $and189 = HEAP32[$48$s2] & -2;
                HEAP32[$48$s2] = $and189;
                HEAP32[$add_ptr_sum1$s2 + ($mem$s2 + 1)] = $add17 | 1;
                HEAP32[$add_ptr6 >> 2] = $add17;
                break $if_end586$$if_then$2;
              }
              if ($5 >>> 0 < 256) {
                var $9 = HEAPU32[$add_ptr_sum1$s2 + ($mem$s2 + 2)];
                var $11 = HEAPU32[$add_ptr_sum1$s2 + ($mem$s2 + 3)];
                if (($9 | 0) == ($11 | 0)) {
                  var $and32 = HEAP32[__gm_ >> 2] & (1 << ($5 >>> 3) ^ -1);
                  HEAP32[__gm_ >> 2] = $and32;
                  var $p_0 = $6, $p_0$s2 = $p_0 >> 2;
                  var $psize_0 = $add17;
                } else {
                  var $14 = (($5 >>> 2 & 1073741822) << 2) + __gm_ + 40 | 0;
                  var $or_cond = ($9 | 0) != ($14 | 0) & $9 >>> 0 < $1 >>> 0;
                  do {
                    if (!$or_cond) {
                      if (!(($11 | 0) == ($14 | 0) | $11 >>> 0 >= $1 >>> 0)) {
                        break;
                      }
                      HEAP32[$9 + 12 >> 2] = $11;
                      HEAP32[$11 + 8 >> 2] = $9;
                      var $p_0 = $6, $p_0$s2 = $p_0 >> 2;
                      var $psize_0 = $add17;
                      break $if_then10$$if_end198$7;
                    }
                  } while (0);
                  _abort();
                  throw "Reached an unreachable!";
                }
              } else {
                var $17 = $add_ptr16;
                var $19 = HEAPU32[$add_ptr_sum1$s2 + ($mem$s2 + 6)];
                var $21 = HEAPU32[$add_ptr_sum1$s2 + ($mem$s2 + 3)];
                var $cmp57 = ($21 | 0) == ($17 | 0);
                do {
                  if ($cmp57) {
                    var $25 = $add_ptr_sum1 + ($mem + 20) | 0;
                    var $26 = HEAP32[$25 >> 2];
                    if (($26 | 0) == 0) {
                      var $arrayidx78 = $add_ptr_sum1 + ($mem + 16) | 0;
                      var $27 = HEAP32[$arrayidx78 >> 2];
                      if (($27 | 0) == 0) {
                        var $R_1 = 0, $R_1$s2 = $R_1 >> 2;
                        break;
                      }
                      var $RP_0 = $arrayidx78;
                      var $R_0 = $27;
                    } else {
                      var $RP_0 = $25;
                      var $R_0 = $26;
                      __label__ = 20;
                    }
                    while (1) {
                      var $R_0;
                      var $RP_0;
                      var $arrayidx83 = $R_0 + 20 | 0;
                      var $28 = HEAP32[$arrayidx83 >> 2];
                      if (($28 | 0) != 0) {
                        var $RP_0 = $arrayidx83;
                        var $R_0 = $28;
                        continue;
                      }
                      var $arrayidx88 = $R_0 + 16 | 0;
                      var $29 = HEAPU32[$arrayidx88 >> 2];
                      if (($29 | 0) == 0) {
                        break;
                      }
                      var $RP_0 = $arrayidx88;
                      var $R_0 = $29;
                    }
                    if ($RP_0 >>> 0 < $1 >>> 0) {
                      _abort();
                      throw "Reached an unreachable!";
                    } else {
                      HEAP32[$RP_0 >> 2] = 0;
                      var $R_1 = $R_0, $R_1$s2 = $R_1 >> 2;
                    }
                  } else {
                    var $23 = HEAPU32[$add_ptr_sum1$s2 + ($mem$s2 + 2)];
                    if ($23 >>> 0 < $1 >>> 0) {
                      _abort();
                      throw "Reached an unreachable!";
                    } else {
                      HEAP32[$23 + 12 >> 2] = $21;
                      HEAP32[$21 + 8 >> 2] = $23;
                      var $R_1 = $21, $R_1$s2 = $R_1 >> 2;
                    }
                  }
                } while (0);
                var $R_1;
                if (($19 | 0) == 0) {
                  var $p_0 = $6, $p_0$s2 = $p_0 >> 2;
                  var $psize_0 = $add17;
                  break;
                }
                var $31 = $add_ptr_sum1 + ($mem + 28) | 0;
                var $arrayidx104 = (HEAP32[$31 >> 2] << 2) + __gm_ + 304 | 0;
                var $cmp105 = ($17 | 0) == (HEAP32[$arrayidx104 >> 2] | 0);
                do {
                  if ($cmp105) {
                    HEAP32[$arrayidx104 >> 2] = $R_1;
                    if (($R_1 | 0) != 0) {
                      break;
                    }
                    var $and114 = HEAP32[__gm_ + 4 >> 2] & (1 << HEAP32[$31 >> 2] ^ -1);
                    HEAP32[__gm_ + 4 >> 2] = $and114;
                    var $p_0 = $6, $p_0$s2 = $p_0 >> 2;
                    var $psize_0 = $add17;
                    break $if_then10$$if_end198$7;
                  }
                  if ($19 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                    _abort();
                    throw "Reached an unreachable!";
                  } else {
                    var $arrayidx123 = $19 + 16 | 0;
                    if ((HEAP32[$arrayidx123 >> 2] | 0) == ($17 | 0)) {
                      HEAP32[$arrayidx123 >> 2] = $R_1;
                    } else {
                      HEAP32[$19 + 20 >> 2] = $R_1;
                    }
                    if (($R_1 | 0) == 0) {
                      var $p_0 = $6, $p_0$s2 = $p_0 >> 2;
                      var $psize_0 = $add17;
                      break $if_then10$$if_end198$7;
                    }
                  }
                } while (0);
                if ($R_1 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                  _abort();
                  throw "Reached an unreachable!";
                } else {
                  HEAP32[$R_1$s2 + 6] = $19;
                  var $41 = HEAPU32[$add_ptr_sum1$s2 + ($mem$s2 + 4)];
                  if (($41 | 0) != 0) {
                    if ($41 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                      _abort();
                      throw "Reached an unreachable!";
                    } else {
                      HEAP32[$R_1$s2 + 4] = $41;
                      HEAP32[$41 + 24 >> 2] = $R_1;
                    }
                  }
                  var $45 = HEAPU32[$add_ptr_sum1$s2 + ($mem$s2 + 5)];
                  if (($45 | 0) == 0) {
                    var $p_0 = $6, $p_0$s2 = $p_0 >> 2;
                    var $psize_0 = $add17;
                    break;
                  }
                  if ($45 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                    _abort();
                    throw "Reached an unreachable!";
                  } else {
                    HEAP32[$R_1$s2 + 5] = $45;
                    HEAP32[$45 + 24 >> 2] = $R_1;
                    var $p_0 = $6, $p_0$s2 = $p_0 >> 2;
                    var $psize_0 = $add17;
                  }
                }
              }
            } else {
              var $p_0 = $0, $p_0$s2 = $p_0 >> 2;
              var $psize_0 = $and5;
            }
          } while (0);
          var $psize_0;
          var $p_0;
          var $52 = $p_0;
          if ($52 >>> 0 >= $add_ptr6 >>> 0) {
            break;
          }
          var $53 = $mem + ($and5 - 4) | 0;
          var $54 = HEAPU32[$53 >> 2];
          if (($54 & 1 | 0) == 0) {
            break;
          }
          var $tobool212 = ($54 & 2 | 0) == 0;
          do {
            if ($tobool212) {
              if (($4 | 0) == (HEAP32[__gm_ + 24 >> 2] | 0)) {
                var $add217 = HEAP32[__gm_ + 12 >> 2] + $psize_0 | 0;
                HEAP32[__gm_ + 12 >> 2] = $add217;
                HEAP32[__gm_ + 24 >> 2] = $p_0;
                var $or218 = $add217 | 1;
                HEAP32[$p_0$s2 + 1] = $or218;
                if (($p_0 | 0) == (HEAP32[__gm_ + 20 >> 2] | 0)) {
                  HEAP32[__gm_ + 20 >> 2] = 0;
                  HEAP32[__gm_ + 8 >> 2] = 0;
                }
                if ($add217 >>> 0 <= HEAPU32[__gm_ + 28 >> 2] >>> 0) {
                  break $if_end586$$if_then$2;
                }
                _sys_trim();
                break $if_end586$$if_then$2;
              }
              if (($4 | 0) == (HEAP32[__gm_ + 20 >> 2] | 0)) {
                var $add232 = HEAP32[__gm_ + 8 >> 2] + $psize_0 | 0;
                HEAP32[__gm_ + 8 >> 2] = $add232;
                HEAP32[__gm_ + 20 >> 2] = $p_0;
                var $or233 = $add232 | 1;
                HEAP32[$p_0$s2 + 1] = $or233;
                var $prev_foot236 = $52 + $add232 | 0;
                HEAP32[$prev_foot236 >> 2] = $add232;
                break $if_end586$$if_then$2;
              }
              var $add240 = ($54 & -8) + $psize_0 | 0;
              var $shr241 = $54 >>> 3;
              var $cmp242 = $54 >>> 0 < 256;
              $if_then244$$if_else284$82 : do {
                if ($cmp242) {
                  var $62 = HEAPU32[$mem$s2 + $and5$s2];
                  var $64 = HEAPU32[(($and5 | 4) >> 2) + $mem$s2];
                  if (($62 | 0) == ($64 | 0)) {
                    var $and256 = HEAP32[__gm_ >> 2] & (1 << $shr241 ^ -1);
                    HEAP32[__gm_ >> 2] = $and256;
                  } else {
                    var $67 = (($54 >>> 2 & 1073741822) << 2) + __gm_ + 40 | 0;
                    var $cmp260 = ($62 | 0) == ($67 | 0);
                    do {
                      if ($cmp260) {
                        __label__ = 62;
                      } else {
                        if ($62 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                          __label__ = 65;
                          break;
                        }
                        __label__ = 62;
                        break;
                      }
                    } while (0);
                    do {
                      if (__label__ == 62) {
                        if (($64 | 0) != ($67 | 0)) {
                          if ($64 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                            break;
                          }
                        }
                        HEAP32[$62 + 12 >> 2] = $64;
                        HEAP32[$64 + 8 >> 2] = $62;
                        break $if_then244$$if_else284$82;
                      }
                    } while (0);
                    _abort();
                    throw "Reached an unreachable!";
                  }
                } else {
                  var $72 = $add_ptr6;
                  var $74 = HEAPU32[$and5$s2 + ($mem$s2 + 4)];
                  var $76 = HEAPU32[(($and5 | 4) >> 2) + $mem$s2];
                  var $cmp290 = ($76 | 0) == ($72 | 0);
                  do {
                    if ($cmp290) {
                      var $81 = $and5 + ($mem + 12) | 0;
                      var $82 = HEAP32[$81 >> 2];
                      if (($82 | 0) == 0) {
                        var $arrayidx313 = $and5 + ($mem + 8) | 0;
                        var $83 = HEAP32[$arrayidx313 >> 2];
                        if (($83 | 0) == 0) {
                          var $R288_1 = 0, $R288_1$s2 = $R288_1 >> 2;
                          break;
                        }
                        var $RP306_0 = $arrayidx313;
                        var $R288_0 = $83;
                      } else {
                        var $RP306_0 = $81;
                        var $R288_0 = $82;
                        __label__ = 72;
                      }
                      while (1) {
                        var $R288_0;
                        var $RP306_0;
                        var $arrayidx320 = $R288_0 + 20 | 0;
                        var $84 = HEAP32[$arrayidx320 >> 2];
                        if (($84 | 0) != 0) {
                          var $RP306_0 = $arrayidx320;
                          var $R288_0 = $84;
                          continue;
                        }
                        var $arrayidx325 = $R288_0 + 16 | 0;
                        var $85 = HEAPU32[$arrayidx325 >> 2];
                        if (($85 | 0) == 0) {
                          break;
                        }
                        var $RP306_0 = $arrayidx325;
                        var $R288_0 = $85;
                      }
                      if ($RP306_0 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                        _abort();
                        throw "Reached an unreachable!";
                      } else {
                        HEAP32[$RP306_0 >> 2] = 0;
                        var $R288_1 = $R288_0, $R288_1$s2 = $R288_1 >> 2;
                      }
                    } else {
                      var $78 = HEAPU32[$mem$s2 + $and5$s2];
                      if ($78 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                        _abort();
                        throw "Reached an unreachable!";
                      } else {
                        HEAP32[$78 + 12 >> 2] = $76;
                        HEAP32[$76 + 8 >> 2] = $78;
                        var $R288_1 = $76, $R288_1$s2 = $R288_1 >> 2;
                      }
                    }
                  } while (0);
                  var $R288_1;
                  if (($74 | 0) == 0) {
                    break;
                  }
                  var $88 = $and5 + ($mem + 20) | 0;
                  var $arrayidx345 = (HEAP32[$88 >> 2] << 2) + __gm_ + 304 | 0;
                  var $cmp346 = ($72 | 0) == (HEAP32[$arrayidx345 >> 2] | 0);
                  do {
                    if ($cmp346) {
                      HEAP32[$arrayidx345 >> 2] = $R288_1;
                      if (($R288_1 | 0) != 0) {
                        break;
                      }
                      var $and355 = HEAP32[__gm_ + 4 >> 2] & (1 << HEAP32[$88 >> 2] ^ -1);
                      HEAP32[__gm_ + 4 >> 2] = $and355;
                      break $if_then244$$if_else284$82;
                    }
                    if ($74 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                      _abort();
                      throw "Reached an unreachable!";
                    } else {
                      var $arrayidx364 = $74 + 16 | 0;
                      if ((HEAP32[$arrayidx364 >> 2] | 0) == ($72 | 0)) {
                        HEAP32[$arrayidx364 >> 2] = $R288_1;
                      } else {
                        HEAP32[$74 + 20 >> 2] = $R288_1;
                      }
                      if (($R288_1 | 0) == 0) {
                        break $if_then244$$if_else284$82;
                      }
                    }
                  } while (0);
                  if ($R288_1 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                    _abort();
                    throw "Reached an unreachable!";
                  } else {
                    HEAP32[$R288_1$s2 + 6] = $74;
                    var $98 = HEAPU32[$and5$s2 + ($mem$s2 + 2)];
                    if (($98 | 0) != 0) {
                      if ($98 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                        _abort();
                        throw "Reached an unreachable!";
                      } else {
                        HEAP32[$R288_1$s2 + 4] = $98;
                        HEAP32[$98 + 24 >> 2] = $R288_1;
                      }
                    }
                    var $102 = HEAPU32[$and5$s2 + ($mem$s2 + 3)];
                    if (($102 | 0) == 0) {
                      break;
                    }
                    if ($102 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                      _abort();
                      throw "Reached an unreachable!";
                    } else {
                      HEAP32[$R288_1$s2 + 5] = $102;
                      HEAP32[$102 + 24 >> 2] = $R288_1;
                    }
                  }
                }
              } while (0);
              HEAP32[$p_0$s2 + 1] = $add240 | 1;
              HEAP32[$52 + $add240 >> 2] = $add240;
              if (($p_0 | 0) != (HEAP32[__gm_ + 20 >> 2] | 0)) {
                var $psize_1 = $add240;
                break;
              }
              HEAP32[__gm_ + 8 >> 2] = $add240;
              break $if_end586$$if_then$2;
            } else {
              HEAP32[$53 >> 2] = $54 & -2;
              HEAP32[$p_0$s2 + 1] = $psize_0 | 1;
              HEAP32[$52 + $psize_0 >> 2] = $psize_0;
              var $psize_1 = $psize_0;
            }
          } while (0);
          var $psize_1;
          if ($psize_1 >>> 0 < 256) {
            var $shl450 = $psize_1 >>> 2 & 1073741822;
            var $107 = ($shl450 << 2) + __gm_ + 40 | 0;
            var $108 = HEAPU32[__gm_ >> 2];
            var $shl453 = 1 << ($psize_1 >>> 3);
            var $tobool455 = ($108 & $shl453 | 0) == 0;
            do {
              if ($tobool455) {
                HEAP32[__gm_ >> 2] = $108 | $shl453;
                var $F452_0 = $107;
                var $_pre_phi = ($shl450 + 2 << 2) + __gm_ + 40 | 0;
              } else {
                var $109 = ($shl450 + 2 << 2) + __gm_ + 40 | 0;
                var $110 = HEAPU32[$109 >> 2];
                if ($110 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                  var $F452_0 = $110;
                  var $_pre_phi = $109;
                  break;
                }
                _abort();
                throw "Reached an unreachable!";
              }
            } while (0);
            var $_pre_phi;
            var $F452_0;
            HEAP32[$_pre_phi >> 2] = $p_0;
            HEAP32[$F452_0 + 12 >> 2] = $p_0;
            HEAP32[$p_0$s2 + 2] = $F452_0;
            HEAP32[$p_0$s2 + 3] = $107;
            break $if_end586$$if_then$2;
          }
          var $113 = $p_0;
          var $shr477 = $psize_1 >>> 8;
          var $cmp478 = ($shr477 | 0) == 0;
          do {
            if ($cmp478) {
              var $I476_0 = 0;
            } else {
              if ($psize_1 >>> 0 > 16777215) {
                var $I476_0 = 31;
                break;
              }
              var $and487 = ($shr477 + 1048320 | 0) >>> 16 & 8;
              var $shl488 = $shr477 << $and487;
              var $and491 = ($shl488 + 520192 | 0) >>> 16 & 4;
              var $shl493 = $shl488 << $and491;
              var $and496 = ($shl493 + 245760 | 0) >>> 16 & 2;
              var $add501 = 14 - ($and491 | $and487 | $and496) + ($shl493 << $and496 >>> 15) | 0;
              var $I476_0 = $psize_1 >>> (($add501 + 7 | 0) >>> 0) & 1 | $add501 << 1;
            }
          } while (0);
          var $I476_0;
          var $arrayidx509 = ($I476_0 << 2) + __gm_ + 304 | 0;
          HEAP32[$p_0$s2 + 7] = $I476_0;
          HEAP32[$p_0$s2 + 5] = 0;
          HEAP32[$p_0$s2 + 4] = 0;
          var $115 = HEAP32[__gm_ + 4 >> 2];
          var $shl515 = 1 << $I476_0;
          var $tobool517 = ($115 & $shl515 | 0) == 0;
          $if_then518$$if_else524$154 : do {
            if ($tobool517) {
              var $or520 = $115 | $shl515;
              HEAP32[__gm_ + 4 >> 2] = $or520;
              HEAP32[$arrayidx509 >> 2] = $113;
              HEAP32[$p_0$s2 + 6] = $arrayidx509;
              HEAP32[$p_0$s2 + 3] = $p_0;
              HEAP32[$p_0$s2 + 2] = $p_0;
            } else {
              if (($I476_0 | 0) == 31) {
                var $cond = 0;
              } else {
                var $cond = 25 - ($I476_0 >>> 1) | 0;
              }
              var $cond;
              var $K525_0 = $psize_1 << $cond;
              var $T_0 = HEAP32[$arrayidx509 >> 2];
              while (1) {
                var $T_0;
                var $K525_0;
                if ((HEAP32[$T_0 + 4 >> 2] & -8 | 0) == ($psize_1 | 0)) {
                  var $fd559 = $T_0 + 8 | 0;
                  var $121 = HEAPU32[$fd559 >> 2];
                  var $123 = HEAPU32[__gm_ + 16 >> 2];
                  var $cmp560 = $T_0 >>> 0 < $123 >>> 0;
                  do {
                    if (!$cmp560) {
                      if ($121 >>> 0 < $123 >>> 0) {
                        break;
                      }
                      HEAP32[$121 + 12 >> 2] = $113;
                      HEAP32[$fd559 >> 2] = $113;
                      HEAP32[$p_0$s2 + 2] = $121;
                      HEAP32[$p_0$s2 + 3] = $T_0;
                      HEAP32[$p_0$s2 + 6] = 0;
                      break $if_then518$$if_else524$154;
                    }
                  } while (0);
                  _abort();
                  throw "Reached an unreachable!";
                } else {
                  var $arrayidx541 = ($K525_0 >>> 31 << 2) + $T_0 + 16 | 0;
                  var $118 = HEAPU32[$arrayidx541 >> 2];
                  if (($118 | 0) == 0) {
                    if ($arrayidx541 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                      HEAP32[$arrayidx541 >> 2] = $113;
                      HEAP32[$p_0$s2 + 6] = $T_0;
                      HEAP32[$p_0$s2 + 3] = $p_0;
                      HEAP32[$p_0$s2 + 2] = $p_0;
                      break $if_then518$$if_else524$154;
                    }
                    _abort();
                    throw "Reached an unreachable!";
                  } else {
                    var $K525_0 = $K525_0 << 1;
                    var $T_0 = $118;
                  }
                }
              }
            }
          } while (0);
          var $dec = HEAP32[__gm_ + 32 >> 2] - 1 | 0;
          HEAP32[__gm_ + 32 >> 2] = $dec;
          if (($dec | 0) != 0) {
            break $if_end586$$if_then$2;
          }
          _release_unused_segments();
          break $if_end586$$if_then$2;
        }
      } while (0);
      _abort();
      throw "Reached an unreachable!";
    }
  } while (0);
  return;
  return;
}

_free["X"] = 1;

function _segment_holding($addr) {
  var $sp_0$s2;
  var $sp_0 = __gm_ + 444 | 0, $sp_0$s2 = $sp_0 >> 2;
  while (1) {
    var $sp_0;
    var $0 = HEAPU32[$sp_0$s2];
    if ($0 >>> 0 <= $addr >>> 0) {
      if (($0 + HEAP32[$sp_0$s2 + 1] | 0) >>> 0 > $addr >>> 0) {
        var $retval_0 = $sp_0;
        break;
      }
    }
    var $2 = HEAPU32[$sp_0$s2 + 2];
    if (($2 | 0) == 0) {
      var $retval_0 = 0;
      break;
    }
    var $sp_0 = $2, $sp_0$s2 = $sp_0 >> 2;
  }
  var $retval_0;
  return $retval_0;
  return null;
}

function _init_top($p, $psize) {
  var $0 = $p;
  var $1 = $p + 8 | 0;
  if (($1 & 7 | 0) == 0) {
    var $cond = 0;
  } else {
    var $cond = -$1 & 7;
  }
  var $cond;
  var $sub5 = $psize - $cond | 0;
  HEAP32[__gm_ + 24 >> 2] = $0 + $cond | 0;
  HEAP32[__gm_ + 12 >> 2] = $sub5;
  HEAP32[$cond + ($0 + 4) >> 2] = $sub5 | 1;
  HEAP32[$psize + ($0 + 4) >> 2] = 40;
  var $6 = HEAP32[_mparams + 16 >> 2];
  HEAP32[__gm_ + 28 >> 2] = $6;
  return;
  return;
}

function _init_bins() {
  var $i_02 = 0;
  while (1) {
    var $i_02;
    var $shl = $i_02 << 1;
    var $0 = ($shl << 2) + __gm_ + 40 | 0;
    HEAP32[__gm_ + ($shl + 3 << 2) + 40 >> 2] = $0;
    HEAP32[__gm_ + ($shl + 2 << 2) + 40 >> 2] = $0;
    var $inc = $i_02 + 1 | 0;
    if (($inc | 0) == 32) {
      break;
    }
    var $i_02 = $inc;
  }
  return;
  return;
}

function _init_mparams() {
  if ((HEAP32[_mparams >> 2] | 0) == 0) {
    var $call = _sysconf(8);
    if (($call - 1 & $call | 0) == 0) {
      HEAP32[_mparams + 8 >> 2] = $call;
      HEAP32[_mparams + 4 >> 2] = $call;
      HEAP32[_mparams + 12 >> 2] = -1;
      HEAP32[_mparams + 16 >> 2] = 2097152;
      HEAP32[_mparams + 20 >> 2] = 0;
      HEAP32[__gm_ + 440 >> 2] = 0;
      var $call6 = _time(0);
      HEAP32[_mparams >> 2] = $call6 & -16 ^ 1431655768;
    } else {
      _abort();
      throw "Reached an unreachable!";
    }
  }
  return;
  return;
}

function _prepend_alloc($newbase, $oldbase, $nb) {
  var $R_1$s2;
  var $add_ptr4_sum$s2;
  var $cond15$s2;
  var $oldbase$s2 = $oldbase >> 2;
  var $newbase$s2 = $newbase >> 2;
  var __label__;
  var $0 = $newbase + 8 | 0;
  if (($0 & 7 | 0) == 0) {
    var $cond = 0;
  } else {
    var $cond = -$0 & 7;
  }
  var $cond;
  var $2 = $oldbase + 8 | 0;
  if (($2 & 7 | 0) == 0) {
    var $cond15 = 0, $cond15$s2 = $cond15 >> 2;
  } else {
    var $cond15 = -$2 & 7, $cond15$s2 = $cond15 >> 2;
  }
  var $cond15;
  var $add_ptr16 = $oldbase + $cond15 | 0;
  var $4 = $add_ptr16;
  var $add_ptr4_sum = $cond + $nb | 0, $add_ptr4_sum$s2 = $add_ptr4_sum >> 2;
  var $add_ptr17 = $newbase + $add_ptr4_sum | 0;
  var $5 = $add_ptr17;
  var $sub18 = $add_ptr16 - ($newbase + $cond) - $nb | 0;
  HEAP32[($cond + 4 >> 2) + $newbase$s2] = $nb | 3;
  var $cmp20 = ($4 | 0) == (HEAP32[__gm_ + 24 >> 2] | 0);
  $if_then$$if_else$30 : do {
    if ($cmp20) {
      var $add = HEAP32[__gm_ + 12 >> 2] + $sub18 | 0;
      HEAP32[__gm_ + 12 >> 2] = $add;
      HEAP32[__gm_ + 24 >> 2] = $5;
      var $or22 = $add | 1;
      HEAP32[$add_ptr4_sum$s2 + ($newbase$s2 + 1)] = $or22;
    } else {
      if (($4 | 0) == (HEAP32[__gm_ + 20 >> 2] | 0)) {
        var $add26 = HEAP32[__gm_ + 8 >> 2] + $sub18 | 0;
        HEAP32[__gm_ + 8 >> 2] = $add26;
        HEAP32[__gm_ + 20 >> 2] = $5;
        var $or28 = $add26 | 1;
        HEAP32[$add_ptr4_sum$s2 + ($newbase$s2 + 1)] = $or28;
        var $prev_foot = $newbase + $add26 + $add_ptr4_sum | 0;
        HEAP32[$prev_foot >> 2] = $add26;
      } else {
        var $14 = HEAPU32[$cond15$s2 + ($oldbase$s2 + 1)];
        if (($14 & 3 | 0) == 1) {
          var $and37 = $14 & -8;
          var $shr = $14 >>> 3;
          var $cmp38 = $14 >>> 0 < 256;
          $if_then39$$if_else59$38 : do {
            if ($cmp38) {
              var $16 = HEAPU32[(($cond15 | 8) >> 2) + $oldbase$s2];
              var $18 = HEAPU32[$cond15$s2 + ($oldbase$s2 + 3)];
              if (($16 | 0) == ($18 | 0)) {
                var $and43 = HEAP32[__gm_ >> 2] & (1 << $shr ^ -1);
                HEAP32[__gm_ >> 2] = $and43;
              } else {
                var $21 = (($14 >>> 2 & 1073741822) << 2) + __gm_ + 40 | 0;
                var $cmp46 = ($16 | 0) == ($21 | 0);
                do {
                  if ($cmp46) {
                    __label__ = 14;
                  } else {
                    if ($16 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                      __label__ = 17;
                      break;
                    }
                    __label__ = 14;
                    break;
                  }
                } while (0);
                do {
                  if (__label__ == 14) {
                    if (($18 | 0) != ($21 | 0)) {
                      if ($18 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                        break;
                      }
                    }
                    HEAP32[$16 + 12 >> 2] = $18;
                    HEAP32[$18 + 8 >> 2] = $16;
                    break $if_then39$$if_else59$38;
                  }
                } while (0);
                _abort();
                throw "Reached an unreachable!";
              }
            } else {
              var $26 = $add_ptr16;
              var $28 = HEAPU32[(($cond15 | 24) >> 2) + $oldbase$s2];
              var $30 = HEAPU32[$cond15$s2 + ($oldbase$s2 + 3)];
              var $cmp61 = ($30 | 0) == ($26 | 0);
              do {
                if ($cmp61) {
                  var $add_ptr16_sum56 = $cond15 | 16;
                  var $35 = $add_ptr16_sum56 + ($oldbase + 4) | 0;
                  var $36 = HEAP32[$35 >> 2];
                  if (($36 | 0) == 0) {
                    var $arrayidx81 = $oldbase + $add_ptr16_sum56 | 0;
                    var $37 = HEAP32[$arrayidx81 >> 2];
                    if (($37 | 0) == 0) {
                      var $R_1 = 0, $R_1$s2 = $R_1 >> 2;
                      break;
                    }
                    var $RP_0 = $arrayidx81;
                    var $R_0 = $37;
                  } else {
                    var $RP_0 = $35;
                    var $R_0 = $36;
                    __label__ = 24;
                  }
                  while (1) {
                    var $R_0;
                    var $RP_0;
                    var $arrayidx86 = $R_0 + 20 | 0;
                    var $38 = HEAP32[$arrayidx86 >> 2];
                    if (($38 | 0) != 0) {
                      var $RP_0 = $arrayidx86;
                      var $R_0 = $38;
                      continue;
                    }
                    var $arrayidx91 = $R_0 + 16 | 0;
                    var $39 = HEAPU32[$arrayidx91 >> 2];
                    if (($39 | 0) == 0) {
                      break;
                    }
                    var $RP_0 = $arrayidx91;
                    var $R_0 = $39;
                  }
                  if ($RP_0 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                    _abort();
                    throw "Reached an unreachable!";
                  } else {
                    HEAP32[$RP_0 >> 2] = 0;
                    var $R_1 = $R_0, $R_1$s2 = $R_1 >> 2;
                  }
                } else {
                  var $32 = HEAPU32[(($cond15 | 8) >> 2) + $oldbase$s2];
                  if ($32 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                    _abort();
                    throw "Reached an unreachable!";
                  } else {
                    HEAP32[$32 + 12 >> 2] = $30;
                    HEAP32[$30 + 8 >> 2] = $32;
                    var $R_1 = $30, $R_1$s2 = $R_1 >> 2;
                  }
                }
              } while (0);
              var $R_1;
              if (($28 | 0) == 0) {
                break;
              }
              var $42 = $cond15 + ($oldbase + 28) | 0;
              var $arrayidx108 = (HEAP32[$42 >> 2] << 2) + __gm_ + 304 | 0;
              var $cmp109 = ($26 | 0) == (HEAP32[$arrayidx108 >> 2] | 0);
              do {
                if ($cmp109) {
                  HEAP32[$arrayidx108 >> 2] = $R_1;
                  if (($R_1 | 0) != 0) {
                    break;
                  }
                  var $and118 = HEAP32[__gm_ + 4 >> 2] & (1 << HEAP32[$42 >> 2] ^ -1);
                  HEAP32[__gm_ + 4 >> 2] = $and118;
                  break $if_then39$$if_else59$38;
                }
                if ($28 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                  _abort();
                  throw "Reached an unreachable!";
                } else {
                  var $arrayidx128 = $28 + 16 | 0;
                  if ((HEAP32[$arrayidx128 >> 2] | 0) == ($26 | 0)) {
                    HEAP32[$arrayidx128 >> 2] = $R_1;
                  } else {
                    HEAP32[$28 + 20 >> 2] = $R_1;
                  }
                  if (($R_1 | 0) == 0) {
                    break $if_then39$$if_else59$38;
                  }
                }
              } while (0);
              if ($R_1 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                _abort();
                throw "Reached an unreachable!";
              } else {
                HEAP32[$R_1$s2 + 6] = $28;
                var $add_ptr16_sum2627 = $cond15 | 16;
                var $52 = HEAPU32[($add_ptr16_sum2627 >> 2) + $oldbase$s2];
                if (($52 | 0) != 0) {
                  if ($52 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                    _abort();
                    throw "Reached an unreachable!";
                  } else {
                    HEAP32[$R_1$s2 + 4] = $52;
                    HEAP32[$52 + 24 >> 2] = $R_1;
                  }
                }
                var $56 = HEAPU32[($add_ptr16_sum2627 + 4 >> 2) + $oldbase$s2];
                if (($56 | 0) == 0) {
                  break;
                }
                if ($56 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                  _abort();
                  throw "Reached an unreachable!";
                } else {
                  HEAP32[$R_1$s2 + 5] = $56;
                  HEAP32[$56 + 24 >> 2] = $R_1;
                }
              }
            }
          } while (0);
          var $oldfirst_0 = $oldbase + ($and37 | $cond15) | 0;
          var $qsize_0 = $and37 + $sub18 | 0;
        } else {
          var $oldfirst_0 = $4;
          var $qsize_0 = $sub18;
        }
        var $qsize_0;
        var $oldfirst_0;
        var $head193 = $oldfirst_0 + 4 | 0;
        var $and194 = HEAP32[$head193 >> 2] & -2;
        HEAP32[$head193 >> 2] = $and194;
        HEAP32[$add_ptr4_sum$s2 + ($newbase$s2 + 1)] = $qsize_0 | 1;
        HEAP32[($qsize_0 >> 2) + $newbase$s2 + $add_ptr4_sum$s2] = $qsize_0;
        if ($qsize_0 >>> 0 < 256) {
          var $shl206 = $qsize_0 >>> 2 & 1073741822;
          var $63 = ($shl206 << 2) + __gm_ + 40 | 0;
          var $64 = HEAPU32[__gm_ >> 2];
          var $shl211 = 1 << ($qsize_0 >>> 3);
          var $tobool213 = ($64 & $shl211 | 0) == 0;
          do {
            if ($tobool213) {
              HEAP32[__gm_ >> 2] = $64 | $shl211;
              var $F209_0 = $63;
              var $_pre_phi = ($shl206 + 2 << 2) + __gm_ + 40 | 0;
            } else {
              var $65 = ($shl206 + 2 << 2) + __gm_ + 40 | 0;
              var $66 = HEAPU32[$65 >> 2];
              if ($66 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                var $F209_0 = $66;
                var $_pre_phi = $65;
                break;
              }
              _abort();
              throw "Reached an unreachable!";
            }
          } while (0);
          var $_pre_phi;
          var $F209_0;
          HEAP32[$_pre_phi >> 2] = $5;
          HEAP32[$F209_0 + 12 >> 2] = $5;
          HEAP32[$add_ptr4_sum$s2 + ($newbase$s2 + 2)] = $F209_0;
          HEAP32[$add_ptr4_sum$s2 + ($newbase$s2 + 3)] = $63;
        } else {
          var $71 = $add_ptr17;
          var $shr238 = $qsize_0 >>> 8;
          var $cmp239 = ($shr238 | 0) == 0;
          do {
            if ($cmp239) {
              var $I237_0 = 0;
            } else {
              if ($qsize_0 >>> 0 > 16777215) {
                var $I237_0 = 31;
                break;
              }
              var $and249 = ($shr238 + 1048320 | 0) >>> 16 & 8;
              var $shl250 = $shr238 << $and249;
              var $and253 = ($shl250 + 520192 | 0) >>> 16 & 4;
              var $shl255 = $shl250 << $and253;
              var $and258 = ($shl255 + 245760 | 0) >>> 16 & 2;
              var $add263 = 14 - ($and253 | $and249 | $and258) + ($shl255 << $and258 >>> 15) | 0;
              var $I237_0 = $qsize_0 >>> (($add263 + 7 | 0) >>> 0) & 1 | $add263 << 1;
            }
          } while (0);
          var $I237_0;
          var $arrayidx272 = ($I237_0 << 2) + __gm_ + 304 | 0;
          HEAP32[$add_ptr4_sum$s2 + ($newbase$s2 + 7)] = $I237_0;
          var $child274 = $add_ptr4_sum + ($newbase + 16) | 0;
          HEAP32[$add_ptr4_sum$s2 + ($newbase$s2 + 5)] = 0;
          HEAP32[$child274 >> 2] = 0;
          var $74 = HEAP32[__gm_ + 4 >> 2];
          var $shl279 = 1 << $I237_0;
          if (($74 & $shl279 | 0) == 0) {
            var $or285 = $74 | $shl279;
            HEAP32[__gm_ + 4 >> 2] = $or285;
            HEAP32[$arrayidx272 >> 2] = $71;
            HEAP32[$add_ptr4_sum$s2 + ($newbase$s2 + 6)] = $arrayidx272;
            HEAP32[$add_ptr4_sum$s2 + ($newbase$s2 + 3)] = $71;
            HEAP32[$add_ptr4_sum$s2 + ($newbase$s2 + 2)] = $71;
          } else {
            if (($I237_0 | 0) == 31) {
              var $cond300 = 0;
            } else {
              var $cond300 = 25 - ($I237_0 >>> 1) | 0;
            }
            var $cond300;
            var $K290_0 = $qsize_0 << $cond300;
            var $T_0 = HEAP32[$arrayidx272 >> 2];
            while (1) {
              var $T_0;
              var $K290_0;
              if ((HEAP32[$T_0 + 4 >> 2] & -8 | 0) == ($qsize_0 | 0)) {
                var $fd329 = $T_0 + 8 | 0;
                var $87 = HEAPU32[$fd329 >> 2];
                var $89 = HEAPU32[__gm_ + 16 >> 2];
                var $cmp331 = $T_0 >>> 0 < $89 >>> 0;
                do {
                  if (!$cmp331) {
                    if ($87 >>> 0 < $89 >>> 0) {
                      break;
                    }
                    HEAP32[$87 + 12 >> 2] = $71;
                    HEAP32[$fd329 >> 2] = $71;
                    HEAP32[$add_ptr4_sum$s2 + ($newbase$s2 + 2)] = $87;
                    HEAP32[$add_ptr4_sum$s2 + ($newbase$s2 + 3)] = $T_0;
                    HEAP32[$add_ptr4_sum$s2 + ($newbase$s2 + 6)] = 0;
                    break $if_then$$if_else$30;
                  }
                } while (0);
                _abort();
                throw "Reached an unreachable!";
              } else {
                var $arrayidx310 = ($K290_0 >>> 31 << 2) + $T_0 + 16 | 0;
                var $81 = HEAPU32[$arrayidx310 >> 2];
                if (($81 | 0) == 0) {
                  if ($arrayidx310 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                    HEAP32[$arrayidx310 >> 2] = $71;
                    HEAP32[$add_ptr4_sum$s2 + ($newbase$s2 + 6)] = $T_0;
                    HEAP32[$add_ptr4_sum$s2 + ($newbase$s2 + 3)] = $71;
                    HEAP32[$add_ptr4_sum$s2 + ($newbase$s2 + 2)] = $71;
                    break $if_then$$if_else$30;
                  }
                  _abort();
                  throw "Reached an unreachable!";
                } else {
                  var $K290_0 = $K290_0 << 1;
                  var $T_0 = $81;
                }
              }
            }
          }
        }
      }
    }
  } while (0);
  return $newbase + ($cond | 8) | 0;
  return null;
}

_prepend_alloc["X"] = 1;

function _add_segment($tbase, $tsize) {
  var $add_ptr14$s2;
  var $0$s2;
  var $0 = HEAPU32[__gm_ + 24 >> 2], $0$s2 = $0 >> 2;
  var $1 = $0;
  var $call = _segment_holding($1);
  var $2 = HEAP32[$call >> 2];
  var $3 = HEAP32[$call + 4 >> 2];
  var $add_ptr = $2 + $3 | 0;
  var $4 = $2 + ($3 - 39) | 0;
  if (($4 & 7 | 0) == 0) {
    var $cond = 0;
  } else {
    var $cond = -$4 & 7;
  }
  var $cond;
  var $add_ptr7 = $2 + ($3 - 47) + $cond | 0;
  var $cond13 = $add_ptr7 >>> 0 < ($0 + 16 | 0) >>> 0 ? $1 : $add_ptr7;
  var $add_ptr14 = $cond13 + 8 | 0, $add_ptr14$s2 = $add_ptr14 >> 2;
  var $7 = $add_ptr14;
  var $8 = $tbase;
  var $sub16 = $tsize - 40 | 0;
  _init_top($8, $sub16);
  var $9 = $cond13 + 4 | 0;
  HEAP32[$9 >> 2] = 27;
  HEAP32[$add_ptr14$s2] = HEAP32[__gm_ + 444 >> 2];
  HEAP32[$add_ptr14$s2 + 1] = HEAP32[__gm_ + 448 >> 2];
  HEAP32[$add_ptr14$s2 + 2] = HEAP32[__gm_ + 452 >> 2];
  HEAP32[$add_ptr14$s2 + 3] = HEAP32[__gm_ + 456 >> 2];
  HEAP32[__gm_ + 444 >> 2] = $tbase;
  HEAP32[__gm_ + 448 >> 2] = $tsize;
  HEAP32[__gm_ + 456 >> 2] = 0;
  HEAP32[__gm_ + 452 >> 2] = $7;
  var $10 = $cond13 + 28 | 0;
  HEAP32[$10 >> 2] = 7;
  var $cmp2711 = ($cond13 + 32 | 0) >>> 0 < $add_ptr >>> 0;
  $if_then$$for_end$134 : do {
    if ($cmp2711) {
      var $add_ptr2412 = $10;
      while (1) {
        var $add_ptr2412;
        var $12 = $add_ptr2412 + 4 | 0;
        HEAP32[$12 >> 2] = 7;
        if (($add_ptr2412 + 8 | 0) >>> 0 >= $add_ptr >>> 0) {
          break $if_then$$for_end$134;
        }
        var $add_ptr2412 = $12;
      }
    }
  } while (0);
  var $cmp28 = ($cond13 | 0) == ($1 | 0);
  $if_end165$$if_then29$138 : do {
    if (!$cmp28) {
      var $sub_ptr_sub = $cond13 - $0 | 0;
      var $add_ptr30 = $1 + $sub_ptr_sub | 0;
      var $15 = $sub_ptr_sub + ($1 + 4) | 0;
      var $and32 = HEAP32[$15 >> 2] & -2;
      HEAP32[$15 >> 2] = $and32;
      var $or33 = $sub_ptr_sub | 1;
      HEAP32[$0$s2 + 1] = $or33;
      var $prev_foot = $add_ptr30;
      HEAP32[$prev_foot >> 2] = $sub_ptr_sub;
      if ($sub_ptr_sub >>> 0 < 256) {
        var $shl = $sub_ptr_sub >>> 2 & 1073741822;
        var $18 = ($shl << 2) + __gm_ + 40 | 0;
        var $19 = HEAPU32[__gm_ >> 2];
        var $shl39 = 1 << ($sub_ptr_sub >>> 3);
        var $tobool = ($19 & $shl39 | 0) == 0;
        do {
          if ($tobool) {
            var $or44 = $19 | $shl39;
            HEAP32[__gm_ >> 2] = $or44;
            var $F_0 = $18;
            var $_pre_phi = ($shl + 2 << 2) + __gm_ + 40 | 0;
          } else {
            var $20 = ($shl + 2 << 2) + __gm_ + 40 | 0;
            var $21 = HEAPU32[$20 >> 2];
            if ($21 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
              var $F_0 = $21;
              var $_pre_phi = $20;
              break;
            }
            _abort();
            throw "Reached an unreachable!";
          }
        } while (0);
        var $_pre_phi;
        var $F_0;
        HEAP32[$_pre_phi >> 2] = $0;
        HEAP32[$F_0 + 12 >> 2] = $0;
        HEAP32[$0$s2 + 2] = $F_0;
        HEAP32[$0$s2 + 3] = $18;
      } else {
        var $24 = $0;
        var $shr58 = $sub_ptr_sub >>> 8;
        var $cmp59 = ($shr58 | 0) == 0;
        do {
          if ($cmp59) {
            var $I57_0 = 0;
          } else {
            if ($sub_ptr_sub >>> 0 > 16777215) {
              var $I57_0 = 31;
              break;
            }
            var $and69 = ($shr58 + 1048320 | 0) >>> 16 & 8;
            var $shl70 = $shr58 << $and69;
            var $and73 = ($shl70 + 520192 | 0) >>> 16 & 4;
            var $shl75 = $shl70 << $and73;
            var $and78 = ($shl75 + 245760 | 0) >>> 16 & 2;
            var $add83 = 14 - ($and73 | $and69 | $and78) + ($shl75 << $and78 >>> 15) | 0;
            var $I57_0 = $sub_ptr_sub >>> (($add83 + 7 | 0) >>> 0) & 1 | $add83 << 1;
          }
        } while (0);
        var $I57_0;
        var $arrayidx91 = ($I57_0 << 2) + __gm_ + 304 | 0;
        HEAP32[$0$s2 + 7] = $I57_0;
        HEAP32[$0$s2 + 5] = 0;
        HEAP32[$0$s2 + 4] = 0;
        var $26 = HEAP32[__gm_ + 4 >> 2];
        var $shl95 = 1 << $I57_0;
        if (($26 & $shl95 | 0) == 0) {
          var $or101 = $26 | $shl95;
          HEAP32[__gm_ + 4 >> 2] = $or101;
          HEAP32[$arrayidx91 >> 2] = $24;
          HEAP32[$0$s2 + 6] = $arrayidx91;
          HEAP32[$0$s2 + 3] = $0;
          HEAP32[$0$s2 + 2] = $0;
        } else {
          if (($I57_0 | 0) == 31) {
            var $cond115 = 0;
          } else {
            var $cond115 = 25 - ($I57_0 >>> 1) | 0;
          }
          var $cond115;
          var $K105_0 = $sub_ptr_sub << $cond115;
          var $T_0 = HEAP32[$arrayidx91 >> 2];
          while (1) {
            var $T_0;
            var $K105_0;
            if ((HEAP32[$T_0 + 4 >> 2] & -8 | 0) == ($sub_ptr_sub | 0)) {
              var $fd145 = $T_0 + 8 | 0;
              var $32 = HEAPU32[$fd145 >> 2];
              var $34 = HEAPU32[__gm_ + 16 >> 2];
              var $cmp147 = $T_0 >>> 0 < $34 >>> 0;
              do {
                if (!$cmp147) {
                  if ($32 >>> 0 < $34 >>> 0) {
                    break;
                  }
                  HEAP32[$32 + 12 >> 2] = $24;
                  HEAP32[$fd145 >> 2] = $24;
                  HEAP32[$0$s2 + 2] = $32;
                  HEAP32[$0$s2 + 3] = $T_0;
                  HEAP32[$0$s2 + 6] = 0;
                  break $if_end165$$if_then29$138;
                }
              } while (0);
              _abort();
              throw "Reached an unreachable!";
            } else {
              var $arrayidx126 = ($K105_0 >>> 31 << 2) + $T_0 + 16 | 0;
              var $29 = HEAPU32[$arrayidx126 >> 2];
              if (($29 | 0) == 0) {
                if ($arrayidx126 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                  HEAP32[$arrayidx126 >> 2] = $24;
                  HEAP32[$0$s2 + 6] = $T_0;
                  HEAP32[$0$s2 + 3] = $0;
                  HEAP32[$0$s2 + 2] = $0;
                  break $if_end165$$if_then29$138;
                }
                _abort();
                throw "Reached an unreachable!";
              } else {
                var $K105_0 = $K105_0 << 1;
                var $T_0 = $29;
              }
            }
          }
        }
      }
    }
  } while (0);
  return;
  return;
}

_add_segment["X"] = 1;

var ERRNO_CODES = {
  E2BIG: 7,
  EACCES: 13,
  EADDRINUSE: 98,
  EADDRNOTAVAIL: 99,
  EAFNOSUPPORT: 97,
  EAGAIN: 11,
  EALREADY: 114,
  EBADF: 9,
  EBADMSG: 74,
  EBUSY: 16,
  ECANCELED: 125,
  ECHILD: 10,
  ECONNABORTED: 103,
  ECONNREFUSED: 111,
  ECONNRESET: 104,
  EDEADLK: 35,
  EDESTADDRREQ: 89,
  EDOM: 33,
  EDQUOT: 122,
  EEXIST: 17,
  EFAULT: 14,
  EFBIG: 27,
  EHOSTUNREACH: 113,
  EIDRM: 43,
  EILSEQ: 84,
  EINPROGRESS: 115,
  EINTR: 4,
  EINVAL: 22,
  EIO: 5,
  EISCONN: 106,
  EISDIR: 21,
  ELOOP: 40,
  EMFILE: 24,
  EMLINK: 31,
  EMSGSIZE: 90,
  EMULTIHOP: 72,
  ENAMETOOLONG: 36,
  ENETDOWN: 100,
  ENETRESET: 102,
  ENETUNREACH: 101,
  ENFILE: 23,
  ENOBUFS: 105,
  ENODATA: 61,
  ENODEV: 19,
  ENOENT: 2,
  ENOEXEC: 8,
  ENOLCK: 37,
  ENOLINK: 67,
  ENOMEM: 12,
  ENOMSG: 42,
  ENOPROTOOPT: 92,
  ENOSPC: 28,
  ENOSR: 63,
  ENOSTR: 60,
  ENOSYS: 38,
  ENOTCONN: 107,
  ENOTDIR: 20,
  ENOTEMPTY: 39,
  ENOTRECOVERABLE: 131,
  ENOTSOCK: 88,
  ENOTSUP: 95,
  ENOTTY: 25,
  ENXIO: 6,
  EOVERFLOW: 75,
  EOWNERDEAD: 130,
  EPERM: 1,
  EPIPE: 32,
  EPROTO: 71,
  EPROTONOSUPPORT: 93,
  EPROTOTYPE: 91,
  ERANGE: 34,
  EROFS: 30,
  ESPIPE: 29,
  ESRCH: 3,
  ESTALE: 116,
  ETIME: 62,
  ETIMEDOUT: 110,
  ETXTBSY: 26,
  EWOULDBLOCK: 11,
  EXDEV: 18
};

function ___setErrNo(value) {
  if (!___setErrNo.ret) ___setErrNo.ret = allocate([ 0 ], "i32", ALLOC_STATIC);
  HEAP32[___setErrNo.ret >> 2] = value;
  return value;
}

var _stdin = 0;

var _stdout = 0;

var _stderr = 0;

var __impure_ptr = 0;

var FS = {
  currentPath: "/",
  nextInode: 2,
  streams: [ null ],
  ignorePermissions: true,
  absolutePath: (function(relative, base) {
    if (typeof relative !== "string") return null;
    if (base === undefined) base = FS.currentPath;
    if (relative && relative[0] == "/") base = "";
    var full = base + "/" + relative;
    var parts = full.split("/").reverse();
    var absolute = [ "" ];
    while (parts.length) {
      var part = parts.pop();
      if (part == "" || part == ".") {} else if (part == "..") {
        if (absolute.length > 1) absolute.pop();
      } else {
        absolute.push(part);
      }
    }
    return absolute.length == 1 ? "/" : absolute.join("/");
  }),
  analyzePath: (function(path, dontResolveLastLink, linksVisited) {
    var ret = {
      isRoot: false,
      exists: false,
      error: 0,
      name: null,
      path: null,
      object: null,
      parentExists: false,
      parentPath: null,
      parentObject: null
    };
    path = FS.absolutePath(path);
    if (path == "/") {
      ret.isRoot = true;
      ret.exists = ret.parentExists = true;
      ret.name = "/";
      ret.path = ret.parentPath = "/";
      ret.object = ret.parentObject = FS.root;
    } else if (path !== null) {
      linksVisited = linksVisited || 0;
      path = path.slice(1).split("/");
      var current = FS.root;
      var traversed = [ "" ];
      while (path.length) {
        if (path.length == 1 && current.isFolder) {
          ret.parentExists = true;
          ret.parentPath = traversed.length == 1 ? "/" : traversed.join("/");
          ret.parentObject = current;
          ret.name = path[0];
        }
        var target = path.shift();
        if (!current.isFolder) {
          ret.error = ERRNO_CODES.ENOTDIR;
          break;
        } else if (!current.read) {
          ret.error = ERRNO_CODES.EACCES;
          break;
        } else if (!current.contents.hasOwnProperty(target)) {
          ret.error = ERRNO_CODES.ENOENT;
          break;
        }
        current = current.contents[target];
        if (current.link && !(dontResolveLastLink && path.length == 0)) {
          if (linksVisited > 40) {
            ret.error = ERRNO_CODES.ELOOP;
            break;
          }
          var link = FS.absolutePath(current.link, traversed.join("/"));
          return FS.analyzePath([ link ].concat(path).join("/"), dontResolveLastLink, linksVisited + 1);
        }
        traversed.push(target);
        if (path.length == 0) {
          ret.exists = true;
          ret.path = traversed.join("/");
          ret.object = current;
        }
      }
      return ret;
    }
    return ret;
  }),
  findObject: (function(path, dontResolveLastLink) {
    FS.ensureRoot();
    var ret = FS.analyzePath(path, dontResolveLastLink);
    if (ret.exists) {
      return ret.object;
    } else {
      ___setErrNo(ret.error);
      return null;
    }
  }),
  createObject: (function(parent, name, properties, canRead, canWrite) {
    if (!parent) parent = "/";
    if (typeof parent === "string") parent = FS.findObject(parent);
    if (!parent) {
      ___setErrNo(ERRNO_CODES.EACCES);
      throw new Error("Parent path must exist.");
    }
    if (!parent.isFolder) {
      ___setErrNo(ERRNO_CODES.ENOTDIR);
      throw new Error("Parent must be a folder.");
    }
    if (!parent.write && !FS.ignorePermissions) {
      ___setErrNo(ERRNO_CODES.EACCES);
      throw new Error("Parent folder must be writeable.");
    }
    if (!name || name == "." || name == "..") {
      ___setErrNo(ERRNO_CODES.ENOENT);
      throw new Error("Name must not be empty.");
    }
    if (parent.contents.hasOwnProperty(name)) {
      ___setErrNo(ERRNO_CODES.EEXIST);
      throw new Error("Can't overwrite object.");
    }
    parent.contents[name] = {
      read: canRead === undefined ? true : canRead,
      write: canWrite === undefined ? false : canWrite,
      timestamp: Date.now(),
      inodeNumber: FS.nextInode++
    };
    for (var key in properties) {
      if (properties.hasOwnProperty(key)) {
        parent.contents[name][key] = properties[key];
      }
    }
    return parent.contents[name];
  }),
  createFolder: (function(parent, name, canRead, canWrite) {
    var properties = {
      isFolder: true,
      isDevice: false,
      contents: {}
    };
    return FS.createObject(parent, name, properties, canRead, canWrite);
  }),
  createPath: (function(parent, path, canRead, canWrite) {
    var current = FS.findObject(parent);
    if (current === null) throw new Error("Invalid parent.");
    path = path.split("/").reverse();
    while (path.length) {
      var part = path.pop();
      if (!part) continue;
      if (!current.contents.hasOwnProperty(part)) {
        FS.createFolder(current, part, canRead, canWrite);
      }
      current = current.contents[part];
    }
    return current;
  }),
  createFile: (function(parent, name, properties, canRead, canWrite) {
    properties.isFolder = false;
    return FS.createObject(parent, name, properties, canRead, canWrite);
  }),
  createDataFile: (function(parent, name, data, canRead, canWrite) {
    if (typeof data === "string") {
      var dataArray = [];
      for (var i = 0; i < data.length; i++) dataArray.push(data.charCodeAt(i));
      data = dataArray;
    }
    var properties = {
      isDevice: false,
      contents: data
    };
    return FS.createFile(parent, name, properties, canRead, canWrite);
  }),
  createLazyFile: (function(parent, name, url, canRead, canWrite) {
    var properties = {
      isDevice: false,
      url: url
    };
    return FS.createFile(parent, name, properties, canRead, canWrite);
  }),
  createLink: (function(parent, name, target, canRead, canWrite) {
    var properties = {
      isDevice: false,
      link: target
    };
    return FS.createFile(parent, name, properties, canRead, canWrite);
  }),
  createDevice: (function(parent, name, input, output) {
    if (!(input || output)) {
      throw new Error("A device must have at least one callback defined.");
    }
    var ops = {
      isDevice: true,
      input: input,
      output: output
    };
    return FS.createFile(parent, name, ops, Boolean(input), Boolean(output));
  }),
  forceLoadFile: (function(obj) {
    if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
    var success = true;
    if (typeof XMLHttpRequest !== "undefined") {
      var xhr = new XMLHttpRequest;
      xhr.open("GET", obj.url, false);
      if (typeof Uint8Array != "undefined") xhr.responseType = "arraybuffer";
      if (xhr.overrideMimeType) {
        xhr.overrideMimeType("text/plain; charset=x-user-defined");
      }
      xhr.send(null);
      if (xhr.status != 200 && xhr.status != 0) success = false;
      if (xhr.response !== undefined) {
        obj.contents = new Uint8Array(xhr.response || []);
      } else {
        obj.contents = intArrayFromString(xhr.responseText || "", true);
      }
    } else if (typeof read !== "undefined") {
      try {
        obj.contents = intArrayFromString(read(obj.url), true);
      } catch (e) {
        success = false;
      }
    } else {
      throw new Error("Cannot load without read() or XMLHttpRequest.");
    }
    if (!success) ___setErrNo(ERRNO_CODES.EIO);
    return success;
  }),
  ensureRoot: (function() {
    if (FS.root) return;
    FS.root = {
      read: true,
      write: true,
      isFolder: true,
      isDevice: false,
      timestamp: Date.now(),
      inodeNumber: 1,
      contents: {}
    };
  }),
  init: (function(input, output, error) {
    assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
    FS.init.initialized = true;
    FS.ensureRoot();
    if (!input) input = (function() {
      if (!input.cache || !input.cache.length) {
        var result;
        if (typeof window != "undefined" && typeof window.prompt == "function") {
          result = window.prompt("Input: ");
        } else if (typeof readline == "function") {
          result = readline();
        }
        if (!result) result = "";
        input.cache = intArrayFromString(result + "\n", true);
      }
      return input.cache.shift();
    });
    if (!output) output = (function(val) {
      if (val === null || val === "\n".charCodeAt(0)) {
        output.printer(output.buffer.join(""));
        output.buffer = [];
      } else {
        output.buffer.push(String.fromCharCode(val));
      }
    });
    if (!output.printer) output.printer = print;
    if (!output.buffer) output.buffer = [];
    if (!error) error = output;
    FS.createFolder("/", "tmp", true, true);
    var devFolder = FS.createFolder("/", "dev", true, true);
    var stdin = FS.createDevice(devFolder, "stdin", input);
    var stdout = FS.createDevice(devFolder, "stdout", null, output);
    var stderr = FS.createDevice(devFolder, "stderr", null, error);
    FS.createDevice(devFolder, "tty", input, output);
    FS.streams[1] = {
      path: "/dev/stdin",
      object: stdin,
      position: 0,
      isRead: true,
      isWrite: false,
      isAppend: false,
      error: false,
      eof: false,
      ungotten: []
    };
    FS.streams[2] = {
      path: "/dev/stdout",
      object: stdout,
      position: 0,
      isRead: false,
      isWrite: true,
      isAppend: false,
      error: false,
      eof: false,
      ungotten: []
    };
    FS.streams[3] = {
      path: "/dev/stderr",
      object: stderr,
      position: 0,
      isRead: false,
      isWrite: true,
      isAppend: false,
      error: false,
      eof: false,
      ungotten: []
    };
    _stdin = allocate([ 1 ], "void*", ALLOC_STATIC);
    _stdout = allocate([ 2 ], "void*", ALLOC_STATIC);
    _stderr = allocate([ 3 ], "void*", ALLOC_STATIC);
    FS.createPath("/", "dev/shm/tmp", true, true);
    FS.streams[_stdin] = FS.streams[1];
    FS.streams[_stdout] = FS.streams[2];
    FS.streams[_stderr] = FS.streams[3];
    __impure_ptr = allocate([ allocate([ 0, 0, 0, 0, _stdin, 0, 0, 0, _stdout, 0, 0, 0, _stderr, 0, 0, 0 ], "void*", ALLOC_STATIC) ], "void*", ALLOC_STATIC);
  }),
  quit: (function() {
    if (!FS.init.initialized) return;
    if (FS.streams[2].object.output.buffer.length > 0) FS.streams[2].object.output("\n".charCodeAt(0));
    if (FS.streams[3].object.output.buffer.length > 0) FS.streams[3].object.output("\n".charCodeAt(0));
  })
};

function _pread(fildes, buf, nbyte, offset) {
  var stream = FS.streams[fildes];
  if (!stream || stream.object.isDevice) {
    ___setErrNo(ERRNO_CODES.EBADF);
    return -1;
  } else if (!stream.isRead) {
    ___setErrNo(ERRNO_CODES.EACCES);
    return -1;
  } else if (stream.object.isFolder) {
    ___setErrNo(ERRNO_CODES.EISDIR);
    return -1;
  } else if (nbyte < 0 || offset < 0) {
    ___setErrNo(ERRNO_CODES.EINVAL);
    return -1;
  } else {
    var bytesRead = 0;
    while (stream.ungotten.length && nbyte > 0) {
      HEAP8[buf++] = stream.ungotten.pop();
      nbyte--;
      bytesRead++;
    }
    var contents = stream.object.contents;
    var size = Math.min(contents.length - offset, nbyte);
    for (var i = 0; i < size; i++) {
      HEAP8[buf + i] = contents[offset + i];
      bytesRead++;
    }
    return bytesRead;
  }
}

function _read(fildes, buf, nbyte) {
  var stream = FS.streams[fildes];
  if (!stream) {
    ___setErrNo(ERRNO_CODES.EBADF);
    return -1;
  } else if (!stream.isRead) {
    ___setErrNo(ERRNO_CODES.EACCES);
    return -1;
  } else if (nbyte < 0) {
    ___setErrNo(ERRNO_CODES.EINVAL);
    return -1;
  } else {
    var bytesRead;
    if (stream.object.isDevice) {
      if (stream.object.input) {
        bytesRead = 0;
        while (stream.ungotten.length && nbyte > 0) {
          HEAP8[buf++] = stream.ungotten.pop();
          nbyte--;
          bytesRead++;
        }
        for (var i = 0; i < nbyte; i++) {
          try {
            var result = stream.object.input();
          } catch (e) {
            ___setErrNo(ERRNO_CODES.EIO);
            return -1;
          }
          if (result === null || result === undefined) break;
          bytesRead++;
          HEAP8[buf + i] = result;
        }
        return bytesRead;
      } else {
        ___setErrNo(ERRNO_CODES.ENXIO);
        return -1;
      }
    } else {
      var ungotSize = stream.ungotten.length;
      bytesRead = _pread(fildes, buf, nbyte, stream.position);
      if (bytesRead != -1) {
        stream.position += stream.ungotten.length - ungotSize + bytesRead;
      }
      return bytesRead;
    }
  }
}

function _fread(ptr, size, nitems, stream) {
  var bytesToRead = nitems * size;
  if (bytesToRead == 0) return 0;
  var bytesRead = _read(stream, ptr, bytesToRead);
  var streamObj = FS.streams[stream];
  if (bytesRead == -1) {
    if (streamObj) streamObj.error = true;
    return -1;
  } else {
    if (bytesRead < bytesToRead) streamObj.eof = true;
    return Math.floor(bytesRead / size);
  }
}

function _ferror(stream) {
  return Number(stream in FS.streams && FS.streams[stream].error);
}

function _feof(stream) {
  return Number(stream in FS.streams && FS.streams[stream].eof);
}

function ___assert_func(filename, line, func, condition) {
  throw "Assertion failed: " + Pointer_stringify(condition) + ", at: " + [ Pointer_stringify(filename), line, Pointer_stringify(func) ];
}

function _pwrite(fildes, buf, nbyte, offset) {
  var stream = FS.streams[fildes];
  if (!stream || stream.object.isDevice) {
    ___setErrNo(ERRNO_CODES.EBADF);
    return -1;
  } else if (!stream.isWrite) {
    ___setErrNo(ERRNO_CODES.EACCES);
    return -1;
  } else if (stream.object.isFolder) {
    ___setErrNo(ERRNO_CODES.EISDIR);
    return -1;
  } else if (nbyte < 0 || offset < 0) {
    ___setErrNo(ERRNO_CODES.EINVAL);
    return -1;
  } else {
    var contents = stream.object.contents;
    while (contents.length < offset) contents.push(0);
    for (var i = 0; i < nbyte; i++) {
      contents[offset + i] = HEAPU8[buf + i];
    }
    stream.object.timestamp = Date.now();
    return i;
  }
}

function _write(fildes, buf, nbyte) {
  var stream = FS.streams[fildes];
  if (!stream) {
    ___setErrNo(ERRNO_CODES.EBADF);
    return -1;
  } else if (!stream.isWrite) {
    ___setErrNo(ERRNO_CODES.EACCES);
    return -1;
  } else if (nbyte < 0) {
    ___setErrNo(ERRNO_CODES.EINVAL);
    return -1;
  } else {
    if (stream.object.isDevice) {
      if (stream.object.output) {
        for (var i = 0; i < nbyte; i++) {
          try {
            stream.object.output(HEAP8[buf + i]);
          } catch (e) {
            ___setErrNo(ERRNO_CODES.EIO);
            return -1;
          }
        }
        stream.object.timestamp = Date.now();
        return i;
      } else {
        ___setErrNo(ERRNO_CODES.ENXIO);
        return -1;
      }
    } else {
      var bytesWritten = _pwrite(fildes, buf, nbyte, stream.position);
      if (bytesWritten != -1) stream.position += bytesWritten;
      return bytesWritten;
    }
  }
}

function _fwrite(ptr, size, nitems, stream) {
  var bytesToWrite = nitems * size;
  if (bytesToWrite == 0) return 0;
  var bytesWritten = _write(stream, ptr, bytesToWrite);
  if (bytesWritten == -1) {
    if (FS.streams[stream]) FS.streams[stream].error = true;
    return -1;
  } else {
    return Math.floor(bytesWritten / size);
  }
}

function _strncmp(px, py, n) {
  var i = 0;
  while (i < n) {
    var x = HEAP8[px + i];
    var y = HEAP8[py + i];
    if (x == y && x == 0) return 0;
    if (x == 0) return -1;
    if (y == 0) return 1;
    if (x == y) {
      i++;
      continue;
    } else {
      return x > y ? 1 : -1;
    }
  }
  return 0;
}

function _strcmp(px, py) {
  return _strncmp(px, py, TOTAL_MEMORY);
}

function _memset(ptr, value, num, align) {
  if (num >= 20) {
    var stop = ptr + num;
    while (ptr % 4) {
      HEAP8[ptr++] = value;
    }
    if (value < 0) value += 256;
    var ptr4 = ptr >> 2, stop4 = stop >> 2, value4 = value | value << 8 | value << 16 | value << 24;
    while (ptr4 < stop4) {
      HEAP32[ptr4++] = value4;
    }
    ptr = ptr4 << 2;
    while (ptr < stop) {
      HEAP8[ptr++] = value;
    }
  } else {
    while (num--) {
      HEAP8[ptr++] = value;
    }
  }
}

var _llvm_memset_p0i8_i32 = _memset;

function _memcpy(dest, src, num, align) {
  if (num >= 20 && src % 2 == dest % 2) {
    if (src % 4 == dest % 4) {
      var stop = src + num;
      while (src % 4) {
        HEAP8[dest++] = HEAP8[src++];
      }
      var src4 = src >> 2, dest4 = dest >> 2, stop4 = stop >> 2;
      while (src4 < stop4) {
        HEAP32[dest4++] = HEAP32[src4++];
      }
      src = src4 << 2;
      dest = dest4 << 2;
      while (src < stop) {
        HEAP8[dest++] = HEAP8[src++];
      }
    } else {
      var stop = src + num;
      if (src % 2) {
        HEAP8[dest++] = HEAP8[src++];
      }
      var src2 = src >> 1, dest2 = dest >> 1, stop2 = stop >> 1;
      while (src2 < stop2) {
        HEAP16[dest2++] = HEAP16[src2++];
      }
      src = src2 << 1;
      dest = dest2 << 1;
      if (src < stop) {
        HEAP8[dest++] = HEAP8[src++];
      }
    }
  } else {
    while (num--) {
      HEAP8[dest++] = HEAP8[src++];
    }
  }
}

var _llvm_memcpy_p0i8_p0i8_i32 = _memcpy;

function _abort(code) {
  ABORT = true;
  throw "ABORT: " + code + ", at " + (new Error).stack;
}

function _sysconf(name) {
  switch (name) {
   case 8:
    return PAGE_SIZE;
   case 54:
   case 56:
   case 21:
   case 61:
   case 63:
   case 22:
   case 67:
   case 23:
   case 24:
   case 25:
   case 26:
   case 27:
   case 69:
   case 28:
   case 101:
   case 70:
   case 71:
   case 29:
   case 30:
   case 199:
   case 75:
   case 76:
   case 32:
   case 43:
   case 44:
   case 80:
   case 46:
   case 47:
   case 45:
   case 48:
   case 49:
   case 42:
   case 82:
   case 33:
   case 7:
   case 108:
   case 109:
   case 107:
   case 112:
   case 119:
   case 121:
    return 200809;
   case 13:
   case 104:
   case 94:
   case 95:
   case 34:
   case 35:
   case 77:
   case 81:
   case 83:
   case 84:
   case 85:
   case 86:
   case 87:
   case 88:
   case 89:
   case 90:
   case 91:
   case 94:
   case 95:
   case 110:
   case 111:
   case 113:
   case 114:
   case 115:
   case 116:
   case 117:
   case 118:
   case 120:
   case 40:
   case 16:
   case 79:
   case 19:
    return -1;
   case 92:
   case 93:
   case 5:
   case 72:
   case 6:
   case 74:
   case 92:
   case 93:
   case 96:
   case 97:
   case 98:
   case 99:
   case 102:
   case 103:
   case 105:
    return 1;
   case 38:
   case 66:
   case 50:
   case 51:
   case 4:
    return 1024;
   case 15:
   case 64:
   case 41:
    return 32;
   case 55:
   case 37:
   case 17:
    return 2147483647;
   case 18:
   case 1:
    return 47839;
   case 59:
   case 57:
    return 99;
   case 68:
   case 58:
    return 2048;
   case 0:
    return 2097152;
   case 3:
    return 65536;
   case 14:
    return 32768;
   case 73:
    return 32767;
   case 39:
    return 16384;
   case 60:
    return 1e3;
   case 106:
    return 700;
   case 52:
    return 256;
   case 62:
    return 255;
   case 2:
    return 100;
   case 65:
    return 64;
   case 36:
    return 20;
   case 100:
    return 16;
   case 20:
    return 6;
   case 53:
    return 4;
  }
  ___setErrNo(ERRNO_CODES.EINVAL);
  return -1;
}

function _time(ptr) {
  var ret = Math.floor(Date.now() / 1e3);
  if (ptr) {
    HEAP32[ptr >> 2] = ret;
  }
  return ret;
}

function ___errno_location() {
  return ___setErrNo.ret;
}

var ___errno = ___errno_location;

function _sbrk(bytes) {
  var self = _sbrk;
  if (!self.called) {
    STATICTOP = alignMemoryPage(STATICTOP);
    self.called = true;
  }
  var ret = STATICTOP;
  if (bytes != 0) Runtime.staticAlloc(bytes);
  return ret;
}

function _llvm_bswap_i32(x) {
  x = unSign(x, 32);
  var bytes = [];
  for (var i = 0; i < 4; i++) {
    bytes[i] = x & 255;
    x >>= 8;
  }
  var ret = 0;
  for (i = 0; i < 4; i++) {
    ret <<= 8;
    ret += bytes[i];
  }
  return ret;
}

__ATINIT__.unshift({
  func: (function() {
    FS.ignorePermissions = false;
    if (!FS.init.initialized) FS.init();
  })
});

__ATEXIT__.push({
  func: (function() {
    FS.quit();
  })
});

___setErrNo(0);

Module.callMain = function callMain(args) {
  var argc = args.length + 1;
  function pad() {
    for (var i = 0; i < 4 - 1; i++) {
      argv.push(0);
    }
  }
  var argv = [ allocate(intArrayFromString("/bin/this.program"), "i8", ALLOC_STATIC) ];
  pad();
  for (var i = 0; i < argc - 1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), "i8", ALLOC_STATIC));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, "i32", ALLOC_STATIC);
  return _main(argc, argv, 0);
};

var __impure_ptr;

var _configuration_table;

var _inflate_order;

var _fixedtables_lenfix;

var _fixedtables_distfix;

var _static_l_desc;

var _static_d_desc;

var _static_bl_desc;

var _static_ltree;

var _static_dtree;

var _extra_lbits;

var _base_length;

var _extra_dbits;

var _base_dist;

var _extra_blbits;

var _crc_table;

var _inflate_table_lbase;

var _inflate_table_lext;

var _inflate_table_dbase;

var _inflate_table_dext;

var __gm_;

var _mparams;

STRING_TABLE.__str1 = allocate([ 122, 112, 105, 112, 101, 46, 99, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.___func___def = allocate([ 100, 101, 102, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str2 = allocate([ 114, 101, 116, 32, 33, 61, 32, 90, 95, 83, 84, 82, 69, 65, 77, 95, 69, 82, 82, 79, 82, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str3 = allocate([ 115, 116, 114, 109, 46, 97, 118, 97, 105, 108, 95, 105, 110, 32, 61, 61, 32, 48, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str4 = allocate([ 114, 101, 116, 32, 61, 61, 32, 90, 95, 83, 84, 82, 69, 65, 77, 95, 69, 78, 68, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.___func___inf = allocate([ 105, 110, 102, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str5 = allocate([ 122, 112, 105, 112, 101, 58, 32, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str6 = allocate([ 101, 114, 114, 111, 114, 32, 114, 101, 97, 100, 105, 110, 103, 32, 115, 116, 100, 105, 110, 10, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str7 = allocate([ 101, 114, 114, 111, 114, 32, 119, 114, 105, 116, 105, 110, 103, 32, 115, 116, 100, 111, 117, 116, 10, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str8 = allocate([ 105, 110, 118, 97, 108, 105, 100, 32, 99, 111, 109, 112, 114, 101, 115, 115, 105, 111, 110, 32, 108, 101, 118, 101, 108, 10, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str9 = allocate([ 105, 110, 118, 97, 108, 105, 100, 32, 111, 114, 32, 105, 110, 99, 111, 109, 112, 108, 101, 116, 101, 32, 100, 101, 102, 108, 97, 116, 101, 32, 100, 97, 116, 97, 10, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str10 = allocate([ 111, 117, 116, 32, 111, 102, 32, 109, 101, 109, 111, 114, 121, 10, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str11 = allocate([ 122, 108, 105, 98, 32, 118, 101, 114, 115, 105, 111, 110, 32, 109, 105, 115, 109, 97, 116, 99, 104, 33, 10, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str12 = allocate([ 45, 100, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str13 = allocate([ 122, 112, 105, 112, 101, 32, 117, 115, 97, 103, 101, 58, 32, 122, 112, 105, 112, 101, 32, 91, 45, 100, 93, 32, 60, 32, 115, 111, 117, 114, 99, 101, 32, 62, 32, 100, 101, 115, 116, 10, 0 ], "i8", ALLOC_STATIC);

_configuration_table = allocate([ 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 4, 0, 4, 0, 8, 0, 4, 0, 8, 0, 0, 0, 4, 0, 5, 0, 16, 0, 8, 0, 8, 0, 0, 0, 4, 0, 6, 0, 32, 0, 32, 0, 8, 0, 0, 0, 4, 0, 4, 0, 16, 0, 16, 0, 10, 0, 0, 0, 8, 0, 16, 0, 32, 0, 32, 0, 10, 0, 0, 0, 8, 0, 16, 0, 128, 0, 128, 0, 10, 0, 0, 0, 8, 0, 32, 0, 128, 0, 256, 0, 10, 0, 0, 0, 32, 0, 128, 0, 258, 0, 1024, 0, 10, 0, 0, 0, 32, 0, 258, 0, 258, 0, 4096, 0, 10, 0, 0, 0 ], [ "i16", 0, "i16", 0, "i16", 0, "i16", 0, "*", 0, 0, 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "*", 0, 0, 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "*", 0, 0, 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "*", 0, 0, 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "*", 0, 0, 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "*", 0, 0, 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "*", 0, 0, 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "*", 0, 0, 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "*", 0, 0, 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "*", 0, 0, 0 ], ALLOC_STATIC);

_inflate_order = allocate([ 16, 0, 17, 0, 18, 0, 0, 0, 8, 0, 7, 0, 9, 0, 6, 0, 10, 0, 5, 0, 11, 0, 4, 0, 12, 0, 3, 0, 13, 0, 2, 0, 14, 0, 1, 0, 15, 0 ], [ "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0 ], ALLOC_STATIC);

STRING_TABLE.__str115 = allocate([ 105, 110, 99, 111, 114, 114, 101, 99, 116, 32, 104, 101, 97, 100, 101, 114, 32, 99, 104, 101, 99, 107, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str216 = allocate([ 117, 110, 107, 110, 111, 119, 110, 32, 99, 111, 109, 112, 114, 101, 115, 115, 105, 111, 110, 32, 109, 101, 116, 104, 111, 100, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str317 = allocate([ 105, 110, 118, 97, 108, 105, 100, 32, 119, 105, 110, 100, 111, 119, 32, 115, 105, 122, 101, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str418 = allocate([ 117, 110, 107, 110, 111, 119, 110, 32, 104, 101, 97, 100, 101, 114, 32, 102, 108, 97, 103, 115, 32, 115, 101, 116, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str519 = allocate([ 104, 101, 97, 100, 101, 114, 32, 99, 114, 99, 32, 109, 105, 115, 109, 97, 116, 99, 104, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str620 = allocate([ 105, 110, 118, 97, 108, 105, 100, 32, 98, 108, 111, 99, 107, 32, 116, 121, 112, 101, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str721 = allocate([ 105, 110, 118, 97, 108, 105, 100, 32, 115, 116, 111, 114, 101, 100, 32, 98, 108, 111, 99, 107, 32, 108, 101, 110, 103, 116, 104, 115, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str822 = allocate([ 116, 111, 111, 32, 109, 97, 110, 121, 32, 108, 101, 110, 103, 116, 104, 32, 111, 114, 32, 100, 105, 115, 116, 97, 110, 99, 101, 32, 115, 121, 109, 98, 111, 108, 115, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str923 = allocate([ 105, 110, 118, 97, 108, 105, 100, 32, 99, 111, 100, 101, 32, 108, 101, 110, 103, 116, 104, 115, 32, 115, 101, 116, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str1024 = allocate([ 105, 110, 118, 97, 108, 105, 100, 32, 98, 105, 116, 32, 108, 101, 110, 103, 116, 104, 32, 114, 101, 112, 101, 97, 116, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str1125 = allocate([ 105, 110, 118, 97, 108, 105, 100, 32, 99, 111, 100, 101, 32, 45, 45, 32, 109, 105, 115, 115, 105, 110, 103, 32, 101, 110, 100, 45, 111, 102, 45, 98, 108, 111, 99, 107, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str1226 = allocate([ 105, 110, 118, 97, 108, 105, 100, 32, 108, 105, 116, 101, 114, 97, 108, 47, 108, 101, 110, 103, 116, 104, 115, 32, 115, 101, 116, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str1327 = allocate([ 105, 110, 118, 97, 108, 105, 100, 32, 100, 105, 115, 116, 97, 110, 99, 101, 115, 32, 115, 101, 116, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str17 = allocate([ 105, 110, 99, 111, 114, 114, 101, 99, 116, 32, 100, 97, 116, 97, 32, 99, 104, 101, 99, 107, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str18 = allocate([ 105, 110, 99, 111, 114, 114, 101, 99, 116, 32, 108, 101, 110, 103, 116, 104, 32, 99, 104, 101, 99, 107, 0 ], "i8", ALLOC_STATIC);

_fixedtables_lenfix = allocate([ 96, 7, 0, 0, 0, 8, 80, 0, 0, 8, 16, 0, 20, 8, 115, 0, 18, 7, 31, 0, 0, 8, 112, 0, 0, 8, 48, 0, 0, 9, 192, 0, 16, 7, 10, 0, 0, 8, 96, 0, 0, 8, 32, 0, 0, 9, 160, 0, 0, 8, 0, 0, 0, 8, 128, 0, 0, 8, 64, 0, 0, 9, 224, 0, 16, 7, 6, 0, 0, 8, 88, 0, 0, 8, 24, 0, 0, 9, 144, 0, 19, 7, 59, 0, 0, 8, 120, 0, 0, 8, 56, 0, 0, 9, 208, 0, 17, 7, 17, 0, 0, 8, 104, 0, 0, 8, 40, 0, 0, 9, 176, 0, 0, 8, 8, 0, 0, 8, 136, 0, 0, 8, 72, 0, 0, 9, 240, 0, 16, 7, 4, 0, 0, 8, 84, 0, 0, 8, 20, 0, 21, 8, 227, 0, 19, 7, 43, 0, 0, 8, 116, 0, 0, 8, 52, 0, 0, 9, 200, 0, 17, 7, 13, 0, 0, 8, 100, 0, 0, 8, 36, 0, 0, 9, 168, 0, 0, 8, 4, 0, 0, 8, 132, 0, 0, 8, 68, 0, 0, 9, 232, 0, 16, 7, 8, 0, 0, 8, 92, 0, 0, 8, 28, 0, 0, 9, 152, 0, 20, 7, 83, 0, 0, 8, 124, 0, 0, 8, 60, 0, 0, 9, 216, 0, 18, 7, 23, 0, 0, 8, 108, 0, 0, 8, 44, 0, 0, 9, 184, 0, 0, 8, 12, 0, 0, 8, 140, 0, 0, 8, 76, 0, 0, 9, 248, 0, 16, 7, 3, 0, 0, 8, 82, 0, 0, 8, 18, 0, 21, 8, 163, 0, 19, 7, 35, 0, 0, 8, 114, 0, 0, 8, 50, 0, 0, 9, 196, 0, 17, 7, 11, 0, 0, 8, 98, 0, 0, 8, 34, 0, 0, 9, 164, 0, 0, 8, 2, 0, 0, 8, 130, 0, 0, 8, 66, 0, 0, 9, 228, 0, 16, 7, 7, 0, 0, 8, 90, 0, 0, 8, 26, 0, 0, 9, 148, 0, 20, 7, 67, 0, 0, 8, 122, 0, 0, 8, 58, 0, 0, 9, 212, 0, 18, 7, 19, 0, 0, 8, 106, 0, 0, 8, 42, 0, 0, 9, 180, 0, 0, 8, 10, 0, 0, 8, 138, 0, 0, 8, 74, 0, 0, 9, 244, 0, 16, 7, 5, 0, 0, 8, 86, 0, 0, 8, 22, 0, 64, 8, 0, 0, 19, 7, 51, 0, 0, 8, 118, 0, 0, 8, 54, 0, 0, 9, 204, 0, 17, 7, 15, 0, 0, 8, 102, 0, 0, 8, 38, 0, 0, 9, 172, 0, 0, 8, 6, 0, 0, 8, 134, 0, 0, 8, 70, 0, 0, 9, 236, 0, 16, 7, 9, 0, 0, 8, 94, 0, 0, 8, 30, 0, 0, 9, 156, 0, 20, 7, 99, 0, 0, 8, 126, 0, 0, 8, 62, 0, 0, 9, 220, 0, 18, 7, 27, 0, 0, 8, 110, 0, 0, 8, 46, 0, 0, 9, 188, 0, 0, 8, 14, 0, 0, 8, 142, 0, 0, 8, 78, 0, 0, 9, 252, 0, 96, 7, 0, 0, 0, 8, 81, 0, 0, 8, 17, 0, 21, 8, 131, 0, 18, 7, 31, 0, 0, 8, 113, 0, 0, 8, 49, 0, 0, 9, 194, 0, 16, 7, 10, 0, 0, 8, 97, 0, 0, 8, 33, 0, 0, 9, 162, 0, 0, 8, 1, 0, 0, 8, 129, 0, 0, 8, 65, 0, 0, 9, 226, 0, 16, 7, 6, 0, 0, 8, 89, 0, 0, 8, 25, 0, 0, 9, 146, 0, 19, 7, 59, 0, 0, 8, 121, 0, 0, 8, 57, 0, 0, 9, 210, 0, 17, 7, 17, 0, 0, 8, 105, 0, 0, 8, 41, 0, 0, 9, 178, 0, 0, 8, 9, 0, 0, 8, 137, 0, 0, 8, 73, 0, 0, 9, 242, 0, 16, 7, 4, 0, 0, 8, 85, 0, 0, 8, 21, 0, 16, 8, 258, 0, 19, 7, 43, 0, 0, 8, 117, 0, 0, 8, 53, 0, 0, 9, 202, 0, 17, 7, 13, 0, 0, 8, 101, 0, 0, 8, 37, 0, 0, 9, 170, 0, 0, 8, 5, 0, 0, 8, 133, 0, 0, 8, 69, 0, 0, 9, 234, 0, 16, 7, 8, 0, 0, 8, 93, 0, 0, 8, 29, 0, 0, 9, 154, 0, 20, 7, 83, 0, 0, 8, 125, 0, 0, 8, 61, 0, 0, 9, 218, 0, 18, 7, 23, 0, 0, 8, 109, 0, 0, 8, 45, 0, 0, 9, 186, 0, 0, 8, 13, 0, 0, 8, 141, 0, 0, 8, 77, 0, 0, 9, 250, 0, 16, 7, 3, 0, 0, 8, 83, 0, 0, 8, 19, 0, 21, 8, 195, 0, 19, 7, 35, 0, 0, 8, 115, 0, 0, 8, 51, 0, 0, 9, 198, 0, 17, 7, 11, 0, 0, 8, 99, 0, 0, 8, 35, 0, 0, 9, 166, 0, 0, 8, 3, 0, 0, 8, 131, 0, 0, 8, 67, 0, 0, 9, 230, 0, 16, 7, 7, 0, 0, 8, 91, 0, 0, 8, 27, 0, 0, 9, 150, 0, 20, 7, 67, 0, 0, 8, 123, 0, 0, 8, 59, 0, 0, 9, 214, 0, 18, 7, 19, 0, 0, 8, 107, 0, 0, 8, 43, 0, 0, 9, 182, 0, 0, 8, 11, 0, 0, 8, 139, 0, 0, 8, 75, 0, 0, 9, 246, 0, 16, 7, 5, 0, 0, 8, 87, 0, 0, 8, 23, 0, 64, 8, 0, 0, 19, 7, 51, 0, 0, 8, 119, 0, 0, 8, 55, 0, 0, 9, 206, 0, 17, 7, 15, 0, 0, 8, 103, 0, 0, 8, 39, 0, 0, 9, 174, 0, 0, 8, 7, 0, 0, 8, 135, 0, 0, 8, 71, 0, 0, 9, 238, 0, 16, 7, 9, 0, 0, 8, 95, 0, 0, 8, 31, 0, 0, 9, 158, 0, 20, 7, 99, 0, 0, 8, 127, 0, 0, 8, 63, 0, 0, 9, 222, 0, 18, 7, 27, 0, 0, 8, 111, 0, 0, 8, 47, 0, 0, 9, 190, 0, 0, 8, 15, 0, 0, 8, 143, 0, 0, 8, 79, 0, 0, 9, 254, 0, 96, 7, 0, 0, 0, 8, 80, 0, 0, 8, 16, 0, 20, 8, 115, 0, 18, 7, 31, 0, 0, 8, 112, 0, 0, 8, 48, 0, 0, 9, 193, 0, 16, 7, 10, 0, 0, 8, 96, 0, 0, 8, 32, 0, 0, 9, 161, 0, 0, 8, 0, 0, 0, 8, 128, 0, 0, 8, 64, 0, 0, 9, 225, 0, 16, 7, 6, 0, 0, 8, 88, 0, 0, 8, 24, 0, 0, 9, 145, 0, 19, 7, 59, 0, 0, 8, 120, 0, 0, 8, 56, 0, 0, 9, 209, 0, 17, 7, 17, 0, 0, 8, 104, 0, 0, 8, 40, 0, 0, 9, 177, 0, 0, 8, 8, 0, 0, 8, 136, 0, 0, 8, 72, 0, 0, 9, 241, 0, 16, 7, 4, 0, 0, 8, 84, 0, 0, 8, 20, 0, 21, 8, 227, 0, 19, 7, 43, 0, 0, 8, 116, 0, 0, 8, 52, 0, 0, 9, 201, 0, 17, 7, 13, 0, 0, 8, 100, 0, 0, 8, 36, 0, 0, 9, 169, 0, 0, 8, 4, 0, 0, 8, 132, 0, 0, 8, 68, 0, 0, 9, 233, 0, 16, 7, 8, 0, 0, 8, 92, 0, 0, 8, 28, 0, 0, 9, 153, 0, 20, 7, 83, 0, 0, 8, 124, 0, 0, 8, 60, 0, 0, 9, 217, 0, 18, 7, 23, 0, 0, 8, 108, 0, 0, 8, 44, 0, 0, 9, 185, 0, 0, 8, 12, 0, 0, 8, 140, 0, 0, 8, 76, 0, 0, 9, 249, 0, 16, 7, 3, 0, 0, 8, 82, 0, 0, 8, 18, 0, 21, 8, 163, 0, 19, 7, 35, 0, 0, 8, 114, 0, 0, 8, 50, 0, 0, 9, 197, 0, 17, 7, 11, 0, 0, 8, 98, 0, 0, 8, 34, 0, 0, 9, 165, 0, 0, 8, 2, 0, 0, 8, 130, 0, 0, 8, 66, 0, 0, 9, 229, 0, 16, 7, 7, 0, 0, 8, 90, 0, 0, 8, 26, 0, 0, 9, 149, 0, 20, 7, 67, 0, 0, 8, 122, 0, 0, 8, 58, 0, 0, 9, 213, 0, 18, 7, 19, 0, 0, 8, 106, 0, 0, 8, 42, 0, 0, 9, 181, 0, 0, 8, 10, 0, 0, 8, 138, 0, 0, 8, 74, 0, 0, 9, 245, 0, 16, 7, 5, 0, 0, 8, 86, 0, 0, 8, 22, 0, 64, 8, 0, 0, 19, 7, 51, 0, 0, 8, 118, 0, 0, 8, 54, 0, 0, 9, 205, 0, 17, 7, 15, 0, 0, 8, 102, 0, 0, 8, 38, 0, 0, 9, 173, 0, 0, 8, 6, 0, 0, 8, 134, 0, 0, 8, 70, 0, 0, 9, 237, 0, 16, 7, 9, 0, 0, 8, 94, 0, 0, 8, 30, 0, 0, 9, 157, 0, 20, 7, 99, 0, 0, 8, 126, 0, 0, 8, 62, 0, 0, 9, 221, 0, 18, 7, 27, 0, 0, 8, 110, 0, 0, 8, 46, 0, 0, 9, 189, 0, 0, 8, 14, 0, 0, 8, 142, 0, 0, 8, 78, 0, 0, 9, 253, 0, 96, 7, 0, 0, 0, 8, 81, 0, 0, 8, 17, 0, 21, 8, 131, 0, 18, 7, 31, 0, 0, 8, 113, 0, 0, 8, 49, 0, 0, 9, 195, 0, 16, 7, 10, 0, 0, 8, 97, 0, 0, 8, 33, 0, 0, 9, 163, 0, 0, 8, 1, 0, 0, 8, 129, 0, 0, 8, 65, 0, 0, 9, 227, 0, 16, 7, 6, 0, 0, 8, 89, 0, 0, 8, 25, 0, 0, 9, 147, 0, 19, 7, 59, 0, 0, 8, 121, 0, 0, 8, 57, 0, 0, 9, 211, 0, 17, 7, 17, 0, 0, 8, 105, 0, 0, 8, 41, 0, 0, 9, 179, 0, 0, 8, 9, 0, 0, 8, 137, 0, 0, 8, 73, 0, 0, 9, 243, 0, 16, 7, 4, 0, 0, 8, 85, 0, 0, 8, 21, 0, 16, 8, 258, 0, 19, 7, 43, 0, 0, 8, 117, 0, 0, 8, 53, 0, 0, 9, 203, 0, 17, 7, 13, 0, 0, 8, 101, 0, 0, 8, 37, 0, 0, 9, 171, 0, 0, 8, 5, 0, 0, 8, 133, 0, 0, 8, 69, 0, 0, 9, 235, 0, 16, 7, 8, 0, 0, 8, 93, 0, 0, 8, 29, 0, 0, 9, 155, 0, 20, 7, 83, 0, 0, 8, 125, 0, 0, 8, 61, 0, 0, 9, 219, 0, 18, 7, 23, 0, 0, 8, 109, 0, 0, 8, 45, 0, 0, 9, 187, 0, 0, 8, 13, 0, 0, 8, 141, 0, 0, 8, 77, 0, 0, 9, 251, 0, 16, 7, 3, 0, 0, 8, 83, 0, 0, 8, 19, 0, 21, 8, 195, 0, 19, 7, 35, 0, 0, 8, 115, 0, 0, 8, 51, 0, 0, 9, 199, 0, 17, 7, 11, 0, 0, 8, 99, 0, 0, 8, 35, 0, 0, 9, 167, 0, 0, 8, 3, 0, 0, 8, 131, 0, 0, 8, 67, 0, 0, 9, 231, 0, 16, 7, 7, 0, 0, 8, 91, 0, 0, 8, 27, 0, 0, 9, 151, 0, 20, 7, 67, 0, 0, 8, 123, 0, 0, 8, 59, 0, 0, 9, 215, 0, 18, 7, 19, 0, 0, 8, 107, 0, 0, 8, 43, 0, 0, 9, 183, 0, 0, 8, 11, 0, 0, 8, 139, 0, 0, 8, 75, 0, 0, 9, 247, 0, 16, 7, 5, 0, 0, 8, 87, 0, 0, 8, 23, 0, 64, 8, 0, 0, 19, 7, 51, 0, 0, 8, 119, 0, 0, 8, 55, 0, 0, 9, 207, 0, 17, 7, 15, 0, 0, 8, 103, 0, 0, 8, 39, 0, 0, 9, 175, 0, 0, 8, 7, 0, 0, 8, 135, 0, 0, 8, 71, 0, 0, 9, 239, 0, 16, 7, 9, 0, 0, 8, 95, 0, 0, 8, 31, 0, 0, 9, 159, 0, 20, 7, 99, 0, 0, 8, 127, 0, 0, 8, 63, 0, 0, 9, 223, 0, 18, 7, 27, 0, 0, 8, 111, 0, 0, 8, 47, 0, 0, 9, 191, 0, 0, 8, 15, 0, 0, 8, 143, 0, 0, 8, 79, 0, 0, 9, 255, 0 ], [ "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0 ], ALLOC_STATIC);

_fixedtables_distfix = allocate([ 16, 5, 1, 0, 23, 5, 257, 0, 19, 5, 17, 0, 27, 5, 4097, 0, 17, 5, 5, 0, 25, 5, 1025, 0, 21, 5, 65, 0, 29, 5, 16385, 0, 16, 5, 3, 0, 24, 5, 513, 0, 20, 5, 33, 0, 28, 5, 8193, 0, 18, 5, 9, 0, 26, 5, 2049, 0, 22, 5, 129, 0, 64, 5, 0, 0, 16, 5, 2, 0, 23, 5, 385, 0, 19, 5, 25, 0, 27, 5, 6145, 0, 17, 5, 7, 0, 25, 5, 1537, 0, 21, 5, 97, 0, 29, 5, 24577, 0, 16, 5, 4, 0, 24, 5, 769, 0, 20, 5, 49, 0, 28, 5, 12289, 0, 18, 5, 13, 0, 26, 5, 3073, 0, 22, 5, 193, 0, 64, 5, 0, 0 ], [ "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0, "i8", "i8", "i16", 0 ], ALLOC_STATIC);

STRING_TABLE.__dist_code = allocate([ 0, 1, 2, 3, 4, 4, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 16, 17, 18, 18, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29 ], "i8", ALLOC_STATIC);

STRING_TABLE.__length_code = allocate([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28 ], "i8", ALLOC_STATIC);

_static_l_desc = allocate([ 0, 0, 0, 0, 0, 0, 0, 0, 257, 0, 0, 0, 286, 0, 0, 0, 15, 0, 0, 0 ], [ "*", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

_static_d_desc = allocate([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0, 15, 0, 0, 0 ], [ "*", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

_static_bl_desc = allocate([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 7, 0, 0, 0 ], [ "*", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

_static_ltree = allocate([ 12, 0, 8, 0, 140, 0, 8, 0, 76, 0, 8, 0, 204, 0, 8, 0, 44, 0, 8, 0, 172, 0, 8, 0, 108, 0, 8, 0, 236, 0, 8, 0, 28, 0, 8, 0, 156, 0, 8, 0, 92, 0, 8, 0, 220, 0, 8, 0, 60, 0, 8, 0, 188, 0, 8, 0, 124, 0, 8, 0, 252, 0, 8, 0, 2, 0, 8, 0, 130, 0, 8, 0, 66, 0, 8, 0, 194, 0, 8, 0, 34, 0, 8, 0, 162, 0, 8, 0, 98, 0, 8, 0, 226, 0, 8, 0, 18, 0, 8, 0, 146, 0, 8, 0, 82, 0, 8, 0, 210, 0, 8, 0, 50, 0, 8, 0, 178, 0, 8, 0, 114, 0, 8, 0, 242, 0, 8, 0, 10, 0, 8, 0, 138, 0, 8, 0, 74, 0, 8, 0, 202, 0, 8, 0, 42, 0, 8, 0, 170, 0, 8, 0, 106, 0, 8, 0, 234, 0, 8, 0, 26, 0, 8, 0, 154, 0, 8, 0, 90, 0, 8, 0, 218, 0, 8, 0, 58, 0, 8, 0, 186, 0, 8, 0, 122, 0, 8, 0, 250, 0, 8, 0, 6, 0, 8, 0, 134, 0, 8, 0, 70, 0, 8, 0, 198, 0, 8, 0, 38, 0, 8, 0, 166, 0, 8, 0, 102, 0, 8, 0, 230, 0, 8, 0, 22, 0, 8, 0, 150, 0, 8, 0, 86, 0, 8, 0, 214, 0, 8, 0, 54, 0, 8, 0, 182, 0, 8, 0, 118, 0, 8, 0, 246, 0, 8, 0, 14, 0, 8, 0, 142, 0, 8, 0, 78, 0, 8, 0, 206, 0, 8, 0, 46, 0, 8, 0, 174, 0, 8, 0, 110, 0, 8, 0, 238, 0, 8, 0, 30, 0, 8, 0, 158, 0, 8, 0, 94, 0, 8, 0, 222, 0, 8, 0, 62, 0, 8, 0, 190, 0, 8, 0, 126, 0, 8, 0, 254, 0, 8, 0, 1, 0, 8, 0, 129, 0, 8, 0, 65, 0, 8, 0, 193, 0, 8, 0, 33, 0, 8, 0, 161, 0, 8, 0, 97, 0, 8, 0, 225, 0, 8, 0, 17, 0, 8, 0, 145, 0, 8, 0, 81, 0, 8, 0, 209, 0, 8, 0, 49, 0, 8, 0, 177, 0, 8, 0, 113, 0, 8, 0, 241, 0, 8, 0, 9, 0, 8, 0, 137, 0, 8, 0, 73, 0, 8, 0, 201, 0, 8, 0, 41, 0, 8, 0, 169, 0, 8, 0, 105, 0, 8, 0, 233, 0, 8, 0, 25, 0, 8, 0, 153, 0, 8, 0, 89, 0, 8, 0, 217, 0, 8, 0, 57, 0, 8, 0, 185, 0, 8, 0, 121, 0, 8, 0, 249, 0, 8, 0, 5, 0, 8, 0, 133, 0, 8, 0, 69, 0, 8, 0, 197, 0, 8, 0, 37, 0, 8, 0, 165, 0, 8, 0, 101, 0, 8, 0, 229, 0, 8, 0, 21, 0, 8, 0, 149, 0, 8, 0, 85, 0, 8, 0, 213, 0, 8, 0, 53, 0, 8, 0, 181, 0, 8, 0, 117, 0, 8, 0, 245, 0, 8, 0, 13, 0, 8, 0, 141, 0, 8, 0, 77, 0, 8, 0, 205, 0, 8, 0, 45, 0, 8, 0, 173, 0, 8, 0, 109, 0, 8, 0, 237, 0, 8, 0, 29, 0, 8, 0, 157, 0, 8, 0, 93, 0, 8, 0, 221, 0, 8, 0, 61, 0, 8, 0, 189, 0, 8, 0, 125, 0, 8, 0, 253, 0, 8, 0, 19, 0, 9, 0, 275, 0, 9, 0, 147, 0, 9, 0, 403, 0, 9, 0, 83, 0, 9, 0, 339, 0, 9, 0, 211, 0, 9, 0, 467, 0, 9, 0, 51, 0, 9, 0, 307, 0, 9, 0, 179, 0, 9, 0, 435, 0, 9, 0, 115, 0, 9, 0, 371, 0, 9, 0, 243, 0, 9, 0, 499, 0, 9, 0, 11, 0, 9, 0, 267, 0, 9, 0, 139, 0, 9, 0, 395, 0, 9, 0, 75, 0, 9, 0, 331, 0, 9, 0, 203, 0, 9, 0, 459, 0, 9, 0, 43, 0, 9, 0, 299, 0, 9, 0, 171, 0, 9, 0, 427, 0, 9, 0, 107, 0, 9, 0, 363, 0, 9, 0, 235, 0, 9, 0, 491, 0, 9, 0, 27, 0, 9, 0, 283, 0, 9, 0, 155, 0, 9, 0, 411, 0, 9, 0, 91, 0, 9, 0, 347, 0, 9, 0, 219, 0, 9, 0, 475, 0, 9, 0, 59, 0, 9, 0, 315, 0, 9, 0, 187, 0, 9, 0, 443, 0, 9, 0, 123, 0, 9, 0, 379, 0, 9, 0, 251, 0, 9, 0, 507, 0, 9, 0, 7, 0, 9, 0, 263, 0, 9, 0, 135, 0, 9, 0, 391, 0, 9, 0, 71, 0, 9, 0, 327, 0, 9, 0, 199, 0, 9, 0, 455, 0, 9, 0, 39, 0, 9, 0, 295, 0, 9, 0, 167, 0, 9, 0, 423, 0, 9, 0, 103, 0, 9, 0, 359, 0, 9, 0, 231, 0, 9, 0, 487, 0, 9, 0, 23, 0, 9, 0, 279, 0, 9, 0, 151, 0, 9, 0, 407, 0, 9, 0, 87, 0, 9, 0, 343, 0, 9, 0, 215, 0, 9, 0, 471, 0, 9, 0, 55, 0, 9, 0, 311, 0, 9, 0, 183, 0, 9, 0, 439, 0, 9, 0, 119, 0, 9, 0, 375, 0, 9, 0, 247, 0, 9, 0, 503, 0, 9, 0, 15, 0, 9, 0, 271, 0, 9, 0, 143, 0, 9, 0, 399, 0, 9, 0, 79, 0, 9, 0, 335, 0, 9, 0, 207, 0, 9, 0, 463, 0, 9, 0, 47, 0, 9, 0, 303, 0, 9, 0, 175, 0, 9, 0, 431, 0, 9, 0, 111, 0, 9, 0, 367, 0, 9, 0, 239, 0, 9, 0, 495, 0, 9, 0, 31, 0, 9, 0, 287, 0, 9, 0, 159, 0, 9, 0, 415, 0, 9, 0, 95, 0, 9, 0, 351, 0, 9, 0, 223, 0, 9, 0, 479, 0, 9, 0, 63, 0, 9, 0, 319, 0, 9, 0, 191, 0, 9, 0, 447, 0, 9, 0, 127, 0, 9, 0, 383, 0, 9, 0, 255, 0, 9, 0, 511, 0, 9, 0, 0, 0, 7, 0, 64, 0, 7, 0, 32, 0, 7, 0, 96, 0, 7, 0, 16, 0, 7, 0, 80, 0, 7, 0, 48, 0, 7, 0, 112, 0, 7, 0, 8, 0, 7, 0, 72, 0, 7, 0, 40, 0, 7, 0, 104, 0, 7, 0, 24, 0, 7, 0, 88, 0, 7, 0, 56, 0, 7, 0, 120, 0, 7, 0, 4, 0, 7, 0, 68, 0, 7, 0, 36, 0, 7, 0, 100, 0, 7, 0, 20, 0, 7, 0, 84, 0, 7, 0, 52, 0, 7, 0, 116, 0, 7, 0, 3, 0, 8, 0, 131, 0, 8, 0, 67, 0, 8, 0, 195, 0, 8, 0, 35, 0, 8, 0, 163, 0, 8, 0, 99, 0, 8, 0, 227, 0, 8, 0 ], [ "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0 ], ALLOC_STATIC);

_static_dtree = allocate([ 0, 0, 5, 0, 16, 0, 5, 0, 8, 0, 5, 0, 24, 0, 5, 0, 4, 0, 5, 0, 20, 0, 5, 0, 12, 0, 5, 0, 28, 0, 5, 0, 2, 0, 5, 0, 18, 0, 5, 0, 10, 0, 5, 0, 26, 0, 5, 0, 6, 0, 5, 0, 22, 0, 5, 0, 14, 0, 5, 0, 30, 0, 5, 0, 1, 0, 5, 0, 17, 0, 5, 0, 9, 0, 5, 0, 25, 0, 5, 0, 5, 0, 5, 0, 21, 0, 5, 0, 13, 0, 5, 0, 29, 0, 5, 0, 3, 0, 5, 0, 19, 0, 5, 0, 11, 0, 5, 0, 27, 0, 5, 0, 7, 0, 5, 0, 23, 0, 5, 0 ], [ "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0 ], ALLOC_STATIC);

_extra_lbits = allocate([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

_base_length = allocate([ 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 6, 0, 0, 0, 7, 0, 0, 0, 8, 0, 0, 0, 10, 0, 0, 0, 12, 0, 0, 0, 14, 0, 0, 0, 16, 0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 28, 0, 0, 0, 32, 0, 0, 0, 40, 0, 0, 0, 48, 0, 0, 0, 56, 0, 0, 0, 64, 0, 0, 0, 80, 0, 0, 0, 96, 0, 0, 0, 112, 0, 0, 0, 128, 0, 0, 0, 160, 0, 0, 0, 192, 0, 0, 0, 224, 0, 0, 0, 0, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

_extra_dbits = allocate([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 7, 0, 0, 0, 7, 0, 0, 0, 8, 0, 0, 0, 8, 0, 0, 0, 9, 0, 0, 0, 9, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 11, 0, 0, 0, 11, 0, 0, 0, 12, 0, 0, 0, 12, 0, 0, 0, 13, 0, 0, 0, 13, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

_base_dist = allocate([ 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 6, 0, 0, 0, 8, 0, 0, 0, 12, 0, 0, 0, 16, 0, 0, 0, 24, 0, 0, 0, 32, 0, 0, 0, 48, 0, 0, 0, 64, 0, 0, 0, 96, 0, 0, 0, 128, 0, 0, 0, 192, 0, 0, 0, 256, 0, 0, 0, 384, 0, 0, 0, 512, 0, 0, 0, 768, 0, 0, 0, 1024, 0, 0, 0, 1536, 0, 0, 0, 2048, 0, 0, 0, 3072, 0, 0, 0, 4096, 0, 0, 0, 6144, 0, 0, 0, 8192, 0, 0, 0, 12288, 0, 0, 0, 16384, 0, 0, 0, 24576, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

STRING_TABLE._bl_order = allocate([ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ], "i8", ALLOC_STATIC);

_extra_blbits = allocate([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 7, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

_crc_table = allocate([ 0, 0, 0, 0, 1996959894, 0, 0, 0, -301047508, 0, 0, 0, -1727442502, 0, 0, 0, 124634137, 0, 0, 0, 1886057615, 0, 0, 0, -379345611, 0, 0, 0, -1637575261, 0, 0, 0, 249268274, 0, 0, 0, 2044508324, 0, 0, 0, -522852066, 0, 0, 0, -1747789432, 0, 0, 0, 162941995, 0, 0, 0, 2125561021, 0, 0, 0, -407360249, 0, 0, 0, -1866523247, 0, 0, 0, 498536548, 0, 0, 0, 1789927666, 0, 0, 0, -205950648, 0, 0, 0, -2067906082, 0, 0, 0, 450548861, 0, 0, 0, 1843258603, 0, 0, 0, -187386543, 0, 0, 0, -2083289657, 0, 0, 0, 325883990, 0, 0, 0, 1684777152, 0, 0, 0, -43845254, 0, 0, 0, -1973040660, 0, 0, 0, 335633487, 0, 0, 0, 1661365465, 0, 0, 0, -99664541, 0, 0, 0, -1928851979, 0, 0, 0, 997073096, 0, 0, 0, 1281953886, 0, 0, 0, -715111964, 0, 0, 0, -1570279054, 0, 0, 0, 1006888145, 0, 0, 0, 1258607687, 0, 0, 0, -770865667, 0, 0, 0, -1526024853, 0, 0, 0, 901097722, 0, 0, 0, 1119000684, 0, 0, 0, -608450090, 0, 0, 0, -1396901568, 0, 0, 0, 853044451, 0, 0, 0, 1172266101, 0, 0, 0, -589951537, 0, 0, 0, -1412350631, 0, 0, 0, 651767980, 0, 0, 0, 1373503546, 0, 0, 0, -925412992, 0, 0, 0, -1076862698, 0, 0, 0, 565507253, 0, 0, 0, 1454621731, 0, 0, 0, -809855591, 0, 0, 0, -1195530993, 0, 0, 0, 671266974, 0, 0, 0, 1594198024, 0, 0, 0, -972236366, 0, 0, 0, -1324619484, 0, 0, 0, 795835527, 0, 0, 0, 1483230225, 0, 0, 0, -1050600021, 0, 0, 0, -1234817731, 0, 0, 0, 1994146192, 0, 0, 0, 31158534, 0, 0, 0, -1731059524, 0, 0, 0, -271249366, 0, 0, 0, 1907459465, 0, 0, 0, 112637215, 0, 0, 0, -1614814043, 0, 0, 0, -390540237, 0, 0, 0, 2013776290, 0, 0, 0, 251722036, 0, 0, 0, -1777751922, 0, 0, 0, -519137256, 0, 0, 0, 2137656763, 0, 0, 0, 141376813, 0, 0, 0, -1855689577, 0, 0, 0, -429695999, 0, 0, 0, 1802195444, 0, 0, 0, 476864866, 0, 0, 0, -2056965928, 0, 0, 0, -228458418, 0, 0, 0, 1812370925, 0, 0, 0, 453092731, 0, 0, 0, -2113342271, 0, 0, 0, -183516073, 0, 0, 0, 1706088902, 0, 0, 0, 314042704, 0, 0, 0, -1950435094, 0, 0, 0, -54949764, 0, 0, 0, 1658658271, 0, 0, 0, 366619977, 0, 0, 0, -1932296973, 0, 0, 0, -69972891, 0, 0, 0, 1303535960, 0, 0, 0, 984961486, 0, 0, 0, -1547960204, 0, 0, 0, -725929758, 0, 0, 0, 1256170817, 0, 0, 0, 1037604311, 0, 0, 0, -1529756563, 0, 0, 0, -740887301, 0, 0, 0, 1131014506, 0, 0, 0, 879679996, 0, 0, 0, -1385723834, 0, 0, 0, -631195440, 0, 0, 0, 1141124467, 0, 0, 0, 855842277, 0, 0, 0, -1442165665, 0, 0, 0, -586318647, 0, 0, 0, 1342533948, 0, 0, 0, 654459306, 0, 0, 0, -1106571248, 0, 0, 0, -921952122, 0, 0, 0, 1466479909, 0, 0, 0, 544179635, 0, 0, 0, -1184443383, 0, 0, 0, -832445281, 0, 0, 0, 1591671054, 0, 0, 0, 702138776, 0, 0, 0, -1328506846, 0, 0, 0, -942167884, 0, 0, 0, 1504918807, 0, 0, 0, 783551873, 0, 0, 0, -1212326853, 0, 0, 0, -1061524307, 0, 0, 0, -306674912, 0, 0, 0, -1698712650, 0, 0, 0, 62317068, 0, 0, 0, 1957810842, 0, 0, 0, -355121351, 0, 0, 0, -1647151185, 0, 0, 0, 81470997, 0, 0, 0, 1943803523, 0, 0, 0, -480048366, 0, 0, 0, -1805370492, 0, 0, 0, 225274430, 0, 0, 0, 2053790376, 0, 0, 0, -468791541, 0, 0, 0, -1828061283, 0, 0, 0, 167816743, 0, 0, 0, 2097651377, 0, 0, 0, -267414716, 0, 0, 0, -2029476910, 0, 0, 0, 503444072, 0, 0, 0, 1762050814, 0, 0, 0, -144550051, 0, 0, 0, -2140837941, 0, 0, 0, 426522225, 0, 0, 0, 1852507879, 0, 0, 0, -19653770, 0, 0, 0, -1982649376, 0, 0, 0, 282753626, 0, 0, 0, 1742555852, 0, 0, 0, -105259153, 0, 0, 0, -1900089351, 0, 0, 0, 397917763, 0, 0, 0, 1622183637, 0, 0, 0, -690576408, 0, 0, 0, -1580100738, 0, 0, 0, 953729732, 0, 0, 0, 1340076626, 0, 0, 0, -776247311, 0, 0, 0, -1497606297, 0, 0, 0, 1068828381, 0, 0, 0, 1219638859, 0, 0, 0, -670225446, 0, 0, 0, -1358292148, 0, 0, 0, 906185462, 0, 0, 0, 1090812512, 0, 0, 0, -547295293, 0, 0, 0, -1469587627, 0, 0, 0, 829329135, 0, 0, 0, 1181335161, 0, 0, 0, -882789492, 0, 0, 0, -1134132454, 0, 0, 0, 628085408, 0, 0, 0, 1382605366, 0, 0, 0, -871598187, 0, 0, 0, -1156888829, 0, 0, 0, 570562233, 0, 0, 0, 1426400815, 0, 0, 0, -977650754, 0, 0, 0, -1296233688, 0, 0, 0, 733239954, 0, 0, 0, 1555261956, 0, 0, 0, -1026031705, 0, 0, 0, -1244606671, 0, 0, 0, 752459403, 0, 0, 0, 1541320221, 0, 0, 0, -1687895376, 0, 0, 0, -328994266, 0, 0, 0, 1969922972, 0, 0, 0, 40735498, 0, 0, 0, -1677130071, 0, 0, 0, -351390145, 0, 0, 0, 1913087877, 0, 0, 0, 83908371, 0, 0, 0, -1782625662, 0, 0, 0, -491226604, 0, 0, 0, 2075208622, 0, 0, 0, 213261112, 0, 0, 0, -1831694693, 0, 0, 0, -438977011, 0, 0, 0, 2094854071, 0, 0, 0, 198958881, 0, 0, 0, -2032938284, 0, 0, 0, -237706686, 0, 0, 0, 1759359992, 0, 0, 0, 534414190, 0, 0, 0, -2118248755, 0, 0, 0, -155638181, 0, 0, 0, 1873836001, 0, 0, 0, 414664567, 0, 0, 0, -2012718362, 0, 0, 0, -15766928, 0, 0, 0, 1711684554, 0, 0, 0, 285281116, 0, 0, 0, -1889165569, 0, 0, 0, -127750551, 0, 0, 0, 1634467795, 0, 0, 0, 376229701, 0, 0, 0, -1609899400, 0, 0, 0, -686959890, 0, 0, 0, 1308918612, 0, 0, 0, 956543938, 0, 0, 0, -1486412191, 0, 0, 0, -799009033, 0, 0, 0, 1231636301, 0, 0, 0, 1047427035, 0, 0, 0, -1362007478, 0, 0, 0, -640263460, 0, 0, 0, 1088359270, 0, 0, 0, 936918e3, 0, 0, 0, -1447252397, 0, 0, 0, -558129467, 0, 0, 0, 1202900863, 0, 0, 0, 817233897, 0, 0, 0, -1111625188, 0, 0, 0, -893730166, 0, 0, 0, 1404277552, 0, 0, 0, 615818150, 0, 0, 0, -1160759803, 0, 0, 0, -841546093, 0, 0, 0, 1423857449, 0, 0, 0, 601450431, 0, 0, 0, -1285129682, 0, 0, 0, -1000256840, 0, 0, 0, 1567103746, 0, 0, 0, 711928724, 0, 0, 0, -1274298825, 0, 0, 0, -1022587231, 0, 0, 0, 1510334235, 0, 0, 0, 755167117, 0, 0, 0, 0, 0, 0, 0, 421212481, 0, 0, 0, 842424962, 0, 0, 0, 724390851, 0, 0, 0, 1684849924, 0, 0, 0, 2105013317, 0, 0, 0, 1448781702, 0, 0, 0, 1329698503, 0, 0, 0, -925267448, 0, 0, 0, -775767223, 0, 0, 0, -84940662, 0, 0, 0, -470492725, 0, 0, 0, -1397403892, 0, 0, 0, -1246855603, 0, 0, 0, -1635570290, 0, 0, 0, -2020074289, 0, 0, 0, 1254232657, 0, 0, 0, 1406739216, 0, 0, 0, 2029285587, 0, 0, 0, 1643069842, 0, 0, 0, 783210325, 0, 0, 0, 934667796, 0, 0, 0, 479770071, 0, 0, 0, 92505238, 0, 0, 0, -2112120743, 0, 0, 0, -1694455528, 0, 0, 0, -1339163941, 0, 0, 0, -1456026726, 0, 0, 0, -428384931, 0, 0, 0, -9671652, 0, 0, 0, -733921313, 0, 0, 0, -849736034, 0, 0, 0, -1786501982, 0, 0, 0, -1935731229, 0, 0, 0, -1481488864, 0, 0, 0, -1096190111, 0, 0, 0, -236396122, 0, 0, 0, -386674457, 0, 0, 0, -1008827612, 0, 0, 0, -624577947, 0, 0, 0, 1566420650, 0, 0, 0, 1145479147, 0, 0, 0, 1869335592, 0, 0, 0, 1987116393, 0, 0, 0, 959540142, 0, 0, 0, 539646703, 0, 0, 0, 185010476, 0, 0, 0, 303839341, 0, 0, 0, -549046541, 0, 0, 0, -966981710, 0, 0, 0, -311405455, 0, 0, 0, -194288336, 0, 0, 0, -1154812937, 0, 0, 0, -1573797194, 0, 0, 0, -1994616459, 0, 0, 0, -1878548428, 0, 0, 0, 396344571, 0, 0, 0, 243568058, 0, 0, 0, 631889529, 0, 0, 0, 1018359608, 0, 0, 0, 1945336319, 0, 0, 0, 1793607870, 0, 0, 0, 1103436669, 0, 0, 0, 1490954812, 0, 0, 0, -260485371, 0, 0, 0, -379421116, 0, 0, 0, -1034998393, 0, 0, 0, -615244602, 0, 0, 0, -1810527743, 0, 0, 0, -1928414400, 0, 0, 0, -1507596157, 0, 0, 0, -1086793278, 0, 0, 0, 950060301, 0, 0, 0, 565965900, 0, 0, 0, 177645455, 0, 0, 0, 328046286, 0, 0, 0, 1556873225, 0, 0, 0, 1171730760, 0, 0, 0, 1861902987, 0, 0, 0, 2011255754, 0, 0, 0, -1162125996, 0, 0, 0, -1549767659, 0, 0, 0, -2004009002, 0, 0, 0, -1852436841, 0, 0, 0, -556296112, 0, 0, 0, -942888687, 0, 0, 0, -320734510, 0, 0, 0, -168113261, 0, 0, 0, 1919080284, 0, 0, 0, 1803150877, 0, 0, 0, 1079293406, 0, 0, 0, 1498383519, 0, 0, 0, 370020952, 0, 0, 0, 253043481, 0, 0, 0, 607678682, 0, 0, 0, 1025720731, 0, 0, 0, 1711106983, 0, 0, 0, 2095471334, 0, 0, 0, 1472923941, 0, 0, 0, 1322268772, 0, 0, 0, 26324643, 0, 0, 0, 411738082, 0, 0, 0, 866634785, 0, 0, 0, 717028704, 0, 0, 0, -1390091857, 0, 0, 0, -1270886162, 0, 0, 0, -1626176723, 0, 0, 0, -2046184852, 0, 0, 0, -918018901, 0, 0, 0, -799861270, 0, 0, 0, -75610583, 0, 0, 0, -496666776, 0, 0, 0, 792689142, 0, 0, 0, 908347575, 0, 0, 0, 487136116, 0, 0, 0, 68299317, 0, 0, 0, 1263779058, 0, 0, 0, 1380486579, 0, 0, 0, 2036719216, 0, 0, 0, 1618931505, 0, 0, 0, -404294658, 0, 0, 0, -16923969, 0, 0, 0, -707751556, 0, 0, 0, -859070403, 0, 0, 0, -2088093958, 0, 0, 0, -1701771333, 0, 0, 0, -1313057672, 0, 0, 0, -1465424583, 0, 0, 0, 998479947, 0, 0, 0, 580430090, 0, 0, 0, 162921161, 0, 0, 0, 279890824, 0, 0, 0, 1609522511, 0, 0, 0, 1190423566, 0, 0, 0, 1842954189, 0, 0, 0, 1958874764, 0, 0, 0, -212200893, 0, 0, 0, -364829950, 0, 0, 0, -1049857855, 0, 0, 0, -663273088, 0, 0, 0, -1758013625, 0, 0, 0, -1909594618, 0, 0, 0, -1526680123, 0, 0, 0, -1139047292, 0, 0, 0, 1900120602, 0, 0, 0, 1750776667, 0, 0, 0, 1131931800, 0, 0, 0, 1517083097, 0, 0, 0, 355290910, 0, 0, 0, 204897887, 0, 0, 0, 656092572, 0, 0, 0, 1040194781, 0, 0, 0, -1181220846, 0, 0, 0, -1602014893, 0, 0, 0, -1951505776, 0, 0, 0, -1833610287, 0, 0, 0, -571161322, 0, 0, 0, -990907305, 0, 0, 0, -272455788, 0, 0, 0, -153512235, 0, 0, 0, -1375224599, 0, 0, 0, -1222865496, 0, 0, 0, -1674453397, 0, 0, 0, -2060783830, 0, 0, 0, -898926099, 0, 0, 0, -747616084, 0, 0, 0, -128115857, 0, 0, 0, -515495378, 0, 0, 0, 1725839073, 0, 0, 0, 2143618976, 0, 0, 0, 1424512099, 0, 0, 0, 1307796770, 0, 0, 0, 45282277, 0, 0, 0, 464110244, 0, 0, 0, 813994343, 0, 0, 0, 698327078, 0, 0, 0, -456806728, 0, 0, 0, -35741703, 0, 0, 0, -688665542, 0, 0, 0, -806814341, 0, 0, 0, -2136380484, 0, 0, 0, -1716364547, 0, 0, 0, -1298200258, 0, 0, 0, -1417398145, 0, 0, 0, 740041904, 0, 0, 0, 889656817, 0, 0, 0, 506086962, 0, 0, 0, 120682355, 0, 0, 0, 1215357364, 0, 0, 0, 1366020341, 0, 0, 0, 2051441462, 0, 0, 0, 1667084919, 0, 0, 0, -872753330, 0, 0, 0, -756947441, 0, 0, 0, -104024628, 0, 0, 0, -522746739, 0, 0, 0, -1349119414, 0, 0, 0, -1232264437, 0, 0, 0, -1650429752, 0, 0, 0, -2068102775, 0, 0, 0, 52649286, 0, 0, 0, 439905287, 0, 0, 0, 823476164, 0, 0, 0, 672009861, 0, 0, 0, 1733269570, 0, 0, 0, 2119477507, 0, 0, 0, 1434057408, 0, 0, 0, 1281543041, 0, 0, 0, -2126985953, 0, 0, 0, -1742474146, 0, 0, 0, -1290885219, 0, 0, 0, -1441425700, 0, 0, 0, -447479781, 0, 0, 0, -61918886, 0, 0, 0, -681418087, 0, 0, 0, -830909480, 0, 0, 0, 1239502615, 0, 0, 0, 1358593622, 0, 0, 0, 2077699477, 0, 0, 0, 1657543892, 0, 0, 0, 764250643, 0, 0, 0, 882293586, 0, 0, 0, 532408465, 0, 0, 0, 111204816, 0, 0, 0, 1585378284, 0, 0, 0, 1197851309, 0, 0, 0, 1816695150, 0, 0, 0, 1968414767, 0, 0, 0, 974272232, 0, 0, 0, 587794345, 0, 0, 0, 136598634, 0, 0, 0, 289367339, 0, 0, 0, -1767409180, 0, 0, 0, -1883486043, 0, 0, 0, -1533994138, 0, 0, 0, -1115018713, 0, 0, 0, -221528864, 0, 0, 0, -338653791, 0, 0, 0, -1057104286, 0, 0, 0, -639176925, 0, 0, 0, 347922877, 0, 0, 0, 229101820, 0, 0, 0, 646611775, 0, 0, 0, 1066513022, 0, 0, 0, 1892689081, 0, 0, 0, 1774917112, 0, 0, 0, 1122387515, 0, 0, 0, 1543337850, 0, 0, 0, -597333067, 0, 0, 0, -981574924, 0, 0, 0, -296548041, 0, 0, 0, -146261898, 0, 0, 0, -1207325007, 0, 0, 0, -1592614928, 0, 0, 0, -1975530445, 0, 0, 0, -1826292366, 0, 0, 0, 0, 0, 0, 0, 29518391, 0, 0, 0, 59036782, 0, 0, 0, 38190681, 0, 0, 0, 118073564, 0, 0, 0, 114017003, 0, 0, 0, 76381362, 0, 0, 0, 89069189, 0, 0, 0, 236147128, 0, 0, 0, 265370511, 0, 0, 0, 228034006, 0, 0, 0, 206958561, 0, 0, 0, 152762724, 0, 0, 0, 148411219, 0, 0, 0, 178138378, 0, 0, 0, 190596925, 0, 0, 0, 472294256, 0, 0, 0, 501532999, 0, 0, 0, 530741022, 0, 0, 0, 509615401, 0, 0, 0, 456068012, 0, 0, 0, 451764635, 0, 0, 0, 413917122, 0, 0, 0, 426358261, 0, 0, 0, 305525448, 0, 0, 0, 334993663, 0, 0, 0, 296822438, 0, 0, 0, 275991697, 0, 0, 0, 356276756, 0, 0, 0, 352202787, 0, 0, 0, 381193850, 0, 0, 0, 393929805, 0, 0, 0, 944588512, 0, 0, 0, 965684439, 0, 0, 0, 1003065998, 0, 0, 0, 973863097, 0, 0, 0, 1061482044, 0, 0, 0, 1049003019, 0, 0, 0, 1019230802, 0, 0, 0, 1023561829, 0, 0, 0, 912136024, 0, 0, 0, 933002607, 0, 0, 0, 903529270, 0, 0, 0, 874031361, 0, 0, 0, 827834244, 0, 0, 0, 815125939, 0, 0, 0, 852716522, 0, 0, 0, 856752605, 0, 0, 0, 611050896, 0, 0, 0, 631869351, 0, 0, 0, 669987326, 0, 0, 0, 640506825, 0, 0, 0, 593644876, 0, 0, 0, 580921211, 0, 0, 0, 551983394, 0, 0, 0, 556069653, 0, 0, 0, 712553512, 0, 0, 0, 733666847, 0, 0, 0, 704405574, 0, 0, 0, 675154545, 0, 0, 0, 762387700, 0, 0, 0, 749958851, 0, 0, 0, 787859610, 0, 0, 0, 792175277, 0, 0, 0, 1889177024, 0, 0, 0, 1901651959, 0, 0, 0, 1931368878, 0, 0, 0, 1927033753, 0, 0, 0, 2006131996, 0, 0, 0, 1985040171, 0, 0, 0, 1947726194, 0, 0, 0, 1976933189, 0, 0, 0, 2122964088, 0, 0, 0, 2135668303, 0, 0, 0, 2098006038, 0, 0, 0, 2093965857, 0, 0, 0, 2038461604, 0, 0, 0, 2017599123, 0, 0, 0, 2047123658, 0, 0, 0, 2076625661, 0, 0, 0, 1824272048, 0, 0, 0, 1836991623, 0, 0, 0, 1866005214, 0, 0, 0, 1861914857, 0, 0, 0, 1807058540, 0, 0, 0, 1786244187, 0, 0, 0, 1748062722, 0, 0, 0, 1777547317, 0, 0, 0, 1655668488, 0, 0, 0, 1668093247, 0, 0, 0, 1630251878, 0, 0, 0, 1625932113, 0, 0, 0, 1705433044, 0, 0, 0, 1684323811, 0, 0, 0, 1713505210, 0, 0, 0, 1742760333, 0, 0, 0, 1222101792, 0, 0, 0, 1226154263, 0, 0, 0, 1263738702, 0, 0, 0, 1251046777, 0, 0, 0, 1339974652, 0, 0, 0, 1310460363, 0, 0, 0, 1281013650, 0, 0, 0, 1301863845, 0, 0, 0, 1187289752, 0, 0, 0, 1191637167, 0, 0, 0, 1161842422, 0, 0, 0, 1149379777, 0, 0, 0, 1103966788, 0, 0, 0, 1074747507, 0, 0, 0, 1112139306, 0, 0, 0, 1133218845, 0, 0, 0, 1425107024, 0, 0, 0, 1429406311, 0, 0, 0, 1467333694, 0, 0, 0, 1454888457, 0, 0, 0, 1408811148, 0, 0, 0, 1379576507, 0, 0, 0, 1350309090, 0, 0, 0, 1371438805, 0, 0, 0, 1524775400, 0, 0, 0, 1528845279, 0, 0, 0, 1499917702, 0, 0, 0, 1487177649, 0, 0, 0, 1575719220, 0, 0, 0, 1546255107, 0, 0, 0, 1584350554, 0, 0, 0, 1605185389, 0, 0, 0, -516613248, 0, 0, 0, -520654409, 0, 0, 0, -491663378, 0, 0, 0, -478960167, 0, 0, 0, -432229540, 0, 0, 0, -402728597, 0, 0, 0, -440899790, 0, 0, 0, -461763323, 0, 0, 0, -282703304, 0, 0, 0, -287039473, 0, 0, 0, -324886954, 0, 0, 0, -312413087, 0, 0, 0, -399514908, 0, 0, 0, -370308909, 0, 0, 0, -341100918, 0, 0, 0, -362193731, 0, 0, 0, -49039120, 0, 0, 0, -53357881, 0, 0, 0, -23630690, 0, 0, 0, -11204951, 0, 0, 0, -98955220, 0, 0, 0, -69699045, 0, 0, 0, -107035582, 0, 0, 0, -128143755, 0, 0, 0, -218044088, 0, 0, 0, -222133377, 0, 0, 0, -259769050, 0, 0, 0, -247048431, 0, 0, 0, -200719980, 0, 0, 0, -171234397, 0, 0, 0, -141715974, 0, 0, 0, -162529331, 0, 0, 0, -646423200, 0, 0, 0, -658884777, 0, 0, 0, -620984050, 0, 0, 0, -616635591, 0, 0, 0, -562956868, 0, 0, 0, -541876341, 0, 0, 0, -571137582, 0, 0, 0, -600355867, 0, 0, 0, -680850216, 0, 0, 0, -693541137, 0, 0, 0, -722478922, 0, 0, 0, -718425471, 0, 0, 0, -798841852, 0, 0, 0, -777990605, 0, 0, 0, -739872662, 0, 0, 0, -769385891, 0, 0, 0, -983630320, 0, 0, 0, -996371417, 0, 0, 0, -958780802, 0, 0, 0, -954711991, 0, 0, 0, -1034463540, 0, 0, 0, -1013629701, 0, 0, 0, -1043103070, 0, 0, 0, -1072568171, 0, 0, 0, -884101208, 0, 0, 0, -896547425, 0, 0, 0, -926319674, 0, 0, 0, -922021391, 0, 0, 0, -867956876, 0, 0, 0, -846828221, 0, 0, 0, -809446630, 0, 0, 0, -838682323, 0, 0, 0, -1850763712, 0, 0, 0, -1871840137, 0, 0, 0, -1842658770, 0, 0, 0, -1813436391, 0, 0, 0, -1767489892, 0, 0, 0, -1755032405, 0, 0, 0, -1792873742, 0, 0, 0, -1797226299, 0, 0, 0, -1615017992, 0, 0, 0, -1635865137, 0, 0, 0, -1674046570, 0, 0, 0, -1644529247, 0, 0, 0, -1732939996, 0, 0, 0, -1720253165, 0, 0, 0, -1691239606, 0, 0, 0, -1695297155, 0, 0, 0, -1920387792, 0, 0, 0, -1941217529, 0, 0, 0, -1911692962, 0, 0, 0, -1882223767, 0, 0, 0, -1971282452, 0, 0, 0, -1958545445, 0, 0, 0, -1996207742, 0, 0, 0, -2000280651, 0, 0, 0, -2087033720, 0, 0, 0, -2108158273, 0, 0, 0, -2145472282, 0, 0, 0, -2116232495, 0, 0, 0, -2070688684, 0, 0, 0, -2058246557, 0, 0, 0, -2028529606, 0, 0, 0, -2032831987, 0, 0, 0, -1444753248, 0, 0, 0, -1474250089, 0, 0, 0, -1436154674, 0, 0, 0, -1415287047, 0, 0, 0, -1360299908, 0, 0, 0, -1356262837, 0, 0, 0, -1385190382, 0, 0, 0, -1397897691, 0, 0, 0, -1477345e3, 0, 0, 0, -1506546897, 0, 0, 0, -1535814282, 0, 0, 0, -1514717375, 0, 0, 0, -1594349116, 0, 0, 0, -1590017037, 0, 0, 0, -1552089686, 0, 0, 0, -1564567651, 0, 0, 0, -1245416496, 0, 0, 0, -1274668569, 0, 0, 0, -1237276738, 0, 0, 0, -1216164471, 0, 0, 0, -1295131892, 0, 0, 0, -1290817221, 0, 0, 0, -1320611998, 0, 0, 0, -1333041835, 0, 0, 0, -1143528856, 0, 0, 0, -1173010337, 0, 0, 0, -1202457082, 0, 0, 0, -1181639631, 0, 0, 0, -1126266188, 0, 0, 0, -1122180989, 0, 0, 0, -1084596518, 0, 0, 0, -1097321235, 0, 0, 0, 0, 0, 0, 0, -1195612315, 0, 0, 0, -1442199413, 0, 0, 0, 313896942, 0, 0, 0, -1889364137, 0, 0, 0, 937357362, 0, 0, 0, 627793884, 0, 0, 0, -1646839623, 0, 0, 0, -978048785, 0, 0, 0, 2097696650, 0, 0, 0, 1874714724, 0, 0, 0, -687765759, 0, 0, 0, 1255587768, 0, 0, 0, -227878691, 0, 0, 0, -522225869, 0, 0, 0, 1482887254, 0, 0, 0, 1343838111, 0, 0, 0, -391827206, 0, 0, 0, -99573996, 0, 0, 0, 1118632049, 0, 0, 0, -545537848, 0, 0, 0, 1741137837, 0, 0, 0, 1970407491, 0, 0, 0, -842109146, 0, 0, 0, -1783791760, 0, 0, 0, 756094997, 0, 0, 0, 1067759611, 0, 0, 0, -2028416866, 0, 0, 0, 449832999, 0, 0, 0, -1569484990, 0, 0, 0, -1329192788, 0, 0, 0, 142231497, 0, 0, 0, -1607291074, 0, 0, 0, 412010587, 0, 0, 0, 171665333, 0, 0, 0, -1299775280, 0, 0, 0, 793786473, 0, 0, 0, -1746116852, 0, 0, 0, -2057703198, 0, 0, 0, 1038456711, 0, 0, 0, 1703315409, 0, 0, 0, -583343948, 0, 0, 0, -812691622, 0, 0, 0, 1999841343, 0, 0, 0, -354152314, 0, 0, 0, 1381529571, 0, 0, 0, 1089329165, 0, 0, 0, -128860312, 0, 0, 0, -265553759, 0, 0, 0, 1217896388, 0, 0, 0, 1512189994, 0, 0, 0, -492939441, 0, 0, 0, 2135519222, 0, 0, 0, -940242797, 0, 0, 0, -717183107, 0, 0, 0, 1845280792, 0, 0, 0, 899665998, 0, 0, 0, -1927039189, 0, 0, 0, -1617553211, 0, 0, 0, 657096608, 0, 0, 0, -1157806311, 0, 0, 0, 37822588, 0, 0, 0, 284462994, 0, 0, 0, -1471616777, 0, 0, 0, -1693165507, 0, 0, 0, 598228824, 0, 0, 0, 824021174, 0, 0, 0, -1985873965, 0, 0, 0, 343330666, 0, 0, 0, -1396004849, 0, 0, 0, -1098971167, 0, 0, 0, 113467524, 0, 0, 0, 1587572946, 0, 0, 0, -434366537, 0, 0, 0, -190203815, 0, 0, 0, 1276501820, 0, 0, 0, -775755899, 0, 0, 0, 1769898208, 0, 0, 0, 2076913422, 0, 0, 0, -1015592853, 0, 0, 0, -888336478, 0, 0, 0, 1941006535, 0, 0, 0, 1627703081, 0, 0, 0, -642211764, 0, 0, 0, 1148164341, 0, 0, 0, -53215344, 0, 0, 0, -295284610, 0, 0, 0, 1457141531, 0, 0, 0, 247015245, 0, 0, 0, -1241169880, 0, 0, 0, -1531908154, 0, 0, 0, 470583459, 0, 0, 0, -2116308966, 0, 0, 0, 963106687, 0, 0, 0, 735213713, 0, 0, 0, -1821499404, 0, 0, 0, 992409347, 0, 0, 0, -2087022490, 0, 0, 0, -1859174520, 0, 0, 0, 697522413, 0, 0, 0, -1270587308, 0, 0, 0, 217581361, 0, 0, 0, 508405983, 0, 0, 0, -1494102086, 0, 0, 0, -23928852, 0, 0, 0, 1177467017, 0, 0, 0, 1419450215, 0, 0, 0, -332959742, 0, 0, 0, 1911572667, 0, 0, 0, -917753890, 0, 0, 0, -604405712, 0, 0, 0, 1665525589, 0, 0, 0, 1799331996, 0, 0, 0, -746338311, 0, 0, 0, -1053399017, 0, 0, 0, 2039091058, 0, 0, 0, -463652917, 0, 0, 0, 1558270126, 0, 0, 0, 1314193216, 0, 0, 0, -152528859, 0, 0, 0, -1366587277, 0, 0, 0, 372764438, 0, 0, 0, 75645176, 0, 0, 0, -1136777315, 0, 0, 0, 568925988, 0, 0, 0, -1722451903, 0, 0, 0, -1948198993, 0, 0, 0, 861712586, 0, 0, 0, -312887749, 0, 0, 0, 1441124702, 0, 0, 0, 1196457648, 0, 0, 0, -1304107, 0, 0, 0, 1648042348, 0, 0, 0, -628668919, 0, 0, 0, -936187417, 0, 0, 0, 1888390786, 0, 0, 0, 686661332, 0, 0, 0, -1873675855, 0, 0, 0, -2098964897, 0, 0, 0, 978858298, 0, 0, 0, -1483798141, 0, 0, 0, 523464422, 0, 0, 0, 226935048, 0, 0, 0, -1254447507, 0, 0, 0, -1119821404, 0, 0, 0, 100435649, 0, 0, 0, 390670639, 0, 0, 0, -1342878134, 0, 0, 0, 841119475, 0, 0, 0, -1969352298, 0, 0, 0, -1741963656, 0, 0, 0, 546822429, 0, 0, 0, 2029308235, 0, 0, 0, -1068978642, 0, 0, 0, -755170880, 0, 0, 0, 1782671013, 0, 0, 0, -141140452, 0, 0, 0, 1328167289, 0, 0, 0, 1570739863, 0, 0, 0, -450629134, 0, 0, 0, 1298864389, 0, 0, 0, -170426784, 0, 0, 0, -412954226, 0, 0, 0, 1608431339, 0, 0, 0, -1039561134, 0, 0, 0, 2058742071, 0, 0, 0, 1744848601, 0, 0, 0, -792976964, 0, 0, 0, -1998638614, 0, 0, 0, 811816591, 0, 0, 0, 584513889, 0, 0, 0, -1704288764, 0, 0, 0, 129869501, 0, 0, 0, -1090403880, 0, 0, 0, -1380684234, 0, 0, 0, 352848211, 0, 0, 0, 494030490, 0, 0, 0, -1513215489, 0, 0, 0, -1216641519, 0, 0, 0, 264757620, 0, 0, 0, -1844389427, 0, 0, 0, 715964072, 0, 0, 0, 941166918, 0, 0, 0, -2136639965, 0, 0, 0, -658086283, 0, 0, 0, 1618608400, 0, 0, 0, 1926213374, 0, 0, 0, -898381413, 0, 0, 0, 1470427426, 0, 0, 0, -283601337, 0, 0, 0, -38979159, 0, 0, 0, 1158766284, 0, 0, 0, 1984818694, 0, 0, 0, -823031453, 0, 0, 0, -599513459, 0, 0, 0, 1693991400, 0, 0, 0, -114329263, 0, 0, 0, 1100160564, 0, 0, 0, 1395044826, 0, 0, 0, -342174017, 0, 0, 0, -1275476247, 0, 0, 0, 189112716, 0, 0, 0, 435162722, 0, 0, 0, -1588827897, 0, 0, 0, 1016811966, 0, 0, 0, -2077804837, 0, 0, 0, -1768777419, 0, 0, 0, 774831696, 0, 0, 0, 643086745, 0, 0, 0, -1628905732, 0, 0, 0, -1940033262, 0, 0, 0, 887166583, 0, 0, 0, -1456066866, 0, 0, 0, 294275499, 0, 0, 0, 54519365, 0, 0, 0, -1149009632, 0, 0, 0, -471821962, 0, 0, 0, 1532818963, 0, 0, 0, 1240029693, 0, 0, 0, -246071656, 0, 0, 0, 1820460577, 0, 0, 0, -734109372, 0, 0, 0, -963916118, 0, 0, 0, 2117577167, 0, 0, 0, -696303304, 0, 0, 0, 1858283101, 0, 0, 0, 2088143283, 0, 0, 0, -993333546, 0, 0, 0, 1495127663, 0, 0, 0, -509497078, 0, 0, 0, -216785180, 0, 0, 0, 1269332353, 0, 0, 0, 332098007, 0, 0, 0, -1418260814, 0, 0, 0, -1178427044, 0, 0, 0, 25085497, 0, 0, 0, -1666580864, 0, 0, 0, 605395429, 0, 0, 0, 916469259, 0, 0, 0, -1910746770, 0, 0, 0, -2040129881, 0, 0, 0, 1054503362, 0, 0, 0, 745528876, 0, 0, 0, -1798063799, 0, 0, 0, 151290352, 0, 0, 0, -1313282411, 0, 0, 0, -1559410309, 0, 0, 0, 464596510, 0, 0, 0, 1137851976, 0, 0, 0, -76654291, 0, 0, 0, -371460413, 0, 0, 0, 1365741990, 0, 0, 0, -860837601, 0, 0, 0, 1946996346, 0, 0, 0, 1723425172, 0, 0, 0, -570095887, 0, 0, 0, 0, 0, 0, 0, -1775237257, 0, 0, 0, 744558318, 0, 0, 0, -1169094247, 0, 0, 0, 432303367, 0, 0, 0, -1879807376, 0, 0, 0, 900031465, 0, 0, 0, -1550490466, 0, 0, 0, 847829774, 0, 0, 0, -1531388807, 0, 0, 0, 518641120, 0, 0, 0, -1998990697, 0, 0, 0, 726447625, 0, 0, 0, -1115901570, 0, 0, 0, 120436967, 0, 0, 0, -1860321392, 0, 0, 0, 1678817053, 0, 0, 0, -232738710, 0, 0, 0, 1215412723, 0, 0, 0, -566116732, 0, 0, 0, 2111101466, 0, 0, 0, -337322643, 0, 0, 0, 1370871028, 0, 0, 0, -947530877, 0, 0, 0, 1452829715, 0, 0, 0, -1062704284, 0, 0, 0, 2063164157, 0, 0, 0, -322345590, 0, 0, 0, 1331429652, 0, 0, 0, -647231901, 0, 0, 0, 1664946170, 0, 0, 0, -183695219, 0, 0, 0, -937398725, 0, 0, 0, 1578133836, 0, 0, 0, -465477419, 0, 0, 0, 1920034722, 0, 0, 0, -773586116, 0, 0, 0, 1205077067, 0, 0, 0, -41611822, 0, 0, 0, 1807026853, 0, 0, 0, -89606859, 0, 0, 0, 1821946434, 0, 0, 0, -691422245, 0, 0, 0, 1090108588, 0, 0, 0, -479406030, 0, 0, 0, 1969020741, 0, 0, 0, -821176612, 0, 0, 0, 1497223595, 0, 0, 0, -1406084826, 0, 0, 0, 973135441, 0, 0, 0, -2142119992, 0, 0, 0, 375509183, 0, 0, 0, -1242254303, 0, 0, 0, 600093526, 0, 0, 0, -1718240561, 0, 0, 0, 262520248, 0, 0, 0, -1632107992, 0, 0, 0, 143131999, 0, 0, 0, -1294398266, 0, 0, 0, 619252657, 0, 0, 0, -2021888209, 0, 0, 0, 290220120, 0, 0, 0, -1424137791, 0, 0, 0, 1026385590, 0, 0, 0, -1874731914, 0, 0, 0, 108124929, 0, 0, 0, -1138699624, 0, 0, 0, 705746415, 0, 0, 0, -1987726991, 0, 0, 0, 532002310, 0, 0, 0, -1511735393, 0, 0, 0, 869578984, 0, 0, 0, -1563883656, 0, 0, 0, 888733711, 0, 0, 0, -1901590122, 0, 0, 0, 412618465, 0, 0, 0, -1156748673, 0, 0, 0, 759000328, 0, 0, 0, -1754504047, 0, 0, 0, 22832102, 0, 0, 0, -195990677, 0, 0, 0, 1650551836, 0, 0, 0, -667916923, 0, 0, 0, 1308648178, 0, 0, 0, -309000596, 0, 0, 0, 2074411291, 0, 0, 0, -1040971646, 0, 0, 0, 1472466933, 0, 0, 0, -958812059, 0, 0, 0, 1357494034, 0, 0, 0, -356991349, 0, 0, 0, 2089335292, 0, 0, 0, -551690910, 0, 0, 0, 1227741717, 0, 0, 0, -209923188, 0, 0, 0, 1699534075, 0, 0, 0, 1482797645, 0, 0, 0, -833505990, 0, 0, 0, 1946205347, 0, 0, 0, -500122668, 0, 0, 0, 1101389642, 0, 0, 0, -678045635, 0, 0, 0, 1841615268, 0, 0, 0, -67840301, 0, 0, 0, 1793681731, 0, 0, 0, -52859340, 0, 0, 0, 1183344557, 0, 0, 0, -793222950, 0, 0, 0, 1932330052, 0, 0, 0, -451083469, 0, 0, 0, 1598818986, 0, 0, 0, -914616867, 0, 0, 0, 1014039888, 0, 0, 0, -1438580185, 0, 0, 0, 269487038, 0, 0, 0, -2044719927, 0, 0, 0, 632645719, 0, 0, 0, -1283100896, 0, 0, 0, 164914873, 0, 0, 0, -1612422706, 0, 0, 0, 251256414, 0, 0, 0, -1731602135, 0, 0, 0, 580440240, 0, 0, 0, -1264003129, 0, 0, 0, 389919577, 0, 0, 0, -2129808338, 0, 0, 0, 995933623, 0, 0, 0, -1385383232, 0, 0, 0, 545503469, 0, 0, 0, -1229733990, 0, 0, 0, 216184323, 0, 0, 0, -1697468044, 0, 0, 0, 961009130, 0, 0, 0, -1351101795, 0, 0, 0, 354867972, 0, 0, 0, -2095653773, 0, 0, 0, 302736355, 0, 0, 0, -2076482412, 0, 0, 0, 1047162125, 0, 0, 0, -1470469510, 0, 0, 0, 198119140, 0, 0, 0, -1644230253, 0, 0, 0, 665714698, 0, 0, 0, -1315043459, 0, 0, 0, 1150488560, 0, 0, 0, -761067385, 0, 0, 0, 1760690462, 0, 0, 0, -20838807, 0, 0, 0, 1566008055, 0, 0, 0, -882416256, 0, 0, 0, 1899392025, 0, 0, 0, -419009682, 0, 0, 0, 1981535486, 0, 0, 0, -533998711, 0, 0, 0, 1518000656, 0, 0, 0, -867508889, 0, 0, 0, 1876933113, 0, 0, 0, -101728626, 0, 0, 0, 1136572183, 0, 0, 0, -712069024, 0, 0, 0, -391915818, 0, 0, 0, 2123616673, 0, 0, 0, -993863624, 0, 0, 0, 1391648591, 0, 0, 0, -244859951, 0, 0, 0, 1733803174, 0, 0, 0, -586762945, 0, 0, 0, 1261875784, 0, 0, 0, -634712616, 0, 0, 0, 1276840623, 0, 0, 0, -162921674, 0, 0, 0, 1618609217, 0, 0, 0, -1007722273, 0, 0, 0, 1440704424, 0, 0, 0, -275878351, 0, 0, 0, 2042521926, 0, 0, 0, -1934401077, 0, 0, 0, 444819132, 0, 0, 0, -1596821723, 0, 0, 0, 920807506, 0, 0, 0, -1787360052, 0, 0, 0, 54987707, 0, 0, 0, -1189739998, 0, 0, 0, 791020885, 0, 0, 0, -1103381819, 0, 0, 0, 671858098, 0, 0, 0, -1839549397, 0, 0, 0, 74101596, 0, 0, 0, -1476405310, 0, 0, 0, 835702965, 0, 0, 0, -1952523988, 0, 0, 0, 497999451, 0, 0, 0, -1329437541, 0, 0, 0, 653419500, 0, 0, 0, -1667011979, 0, 0, 0, 177433858, 0, 0, 0, -1459222116, 0, 0, 0, 1060507371, 0, 0, 0, -2056845454, 0, 0, 0, 324468741, 0, 0, 0, -2109030507, 0, 0, 0, 343587042, 0, 0, 0, -1372868229, 0, 0, 0, 941340172, 0, 0, 0, -1685138798, 0, 0, 0, 230610405, 0, 0, 0, -1209017220, 0, 0, 0, 568318731, 0, 0, 0, -724380794, 0, 0, 0, 1122161905, 0, 0, 0, -122430104, 0, 0, 0, 1854134815, 0, 0, 0, -854147455, 0, 0, 0, 1529264630, 0, 0, 0, -512249745, 0, 0, 0, 2001188632, 0, 0, 0, -430307192, 0, 0, 0, 1885999103, 0, 0, 0, -902101402, 0, 0, 0, 1544225041, 0, 0, 0, -6396529, 0, 0, 0, 1773036280, 0, 0, 0, -738235551, 0, 0, 0, 1171221526, 0, 0, 0, 2028079776, 0, 0, 0, -288223785, 0, 0, 0, 1417872462, 0, 0, 0, -1028455623, 0, 0, 0, 1629906855, 0, 0, 0, -149528368, 0, 0, 0, 1296525641, 0, 0, 0, -612929986, 0, 0, 0, 1248514478, 0, 0, 0, -598026535, 0, 0, 0, 1712054080, 0, 0, 0, -264513481, 0, 0, 0, 1403960489, 0, 0, 0, -979452962, 0, 0, 0, 2144318023, 0, 0, 0, -369117904, 0, 0, 0, 485670333, 0, 0, 0, -1966949686, 0, 0, 0, 814986067, 0, 0, 0, -1499220956, 0, 0, 0, 87478458, 0, 0, 0, -1828268083, 0, 0, 0, 693624404, 0, 0, 0, -1083713245, 0, 0, 0, 779773619, 0, 0, 0, -1203084860, 0, 0, 0, 35350621, 0, 0, 0, -1809092822, 0, 0, 0, 935201716, 0, 0, 0, -1584526141, 0, 0, 0, 467600730, 0, 0, 0, -1913716179, 0, 0, 0, 0, 0, 0, 0, 1093737241, 0, 0, 0, -2107492814, 0, 0, 0, -1017959125, 0, 0, 0, 80047204, 0, 0, 0, 1173649277, 0, 0, 0, -2035852714, 0, 0, 0, -946454193, 0, 0, 0, 143317448, 0, 0, 0, 1237041873, 0, 0, 0, -1964445702, 0, 0, 0, -874908445, 0, 0, 0, 206550444, 0, 0, 0, 1300147893, 0, 0, 0, -1909619810, 0, 0, 0, -820209529, 0, 0, 0, 1360183882, 0, 0, 0, 270784851, 0, 0, 0, -747572104, 0, 0, 0, -1841172639, 0, 0, 0, 1440198190, 0, 0, 0, 350663991, 0, 0, 0, -675964900, 0, 0, 0, -1769700603, 0, 0, 0, 1503140738, 0, 0, 0, 413728923, 0, 0, 0, -604361296, 0, 0, 0, -1697958231, 0, 0, 0, 1566406630, 0, 0, 0, 476867839, 0, 0, 0, -549502508, 0, 0, 0, -1643226419, 0, 0, 0, -1574665067, 0, 0, 0, -485122164, 0, 0, 0, 541504167, 0, 0, 0, 1635232190, 0, 0, 0, -1495144207, 0, 0, 0, -405736472, 0, 0, 0, 612622019, 0, 0, 0, 1706214874, 0, 0, 0, -1431413411, 0, 0, 0, -341883324, 0, 0, 0, 684485487, 0, 0, 0, 1778217078, 0, 0, 0, -1368706759, 0, 0, 0, -279303648, 0, 0, 0, 738789131, 0, 0, 0, 1832393746, 0, 0, 0, -214546721, 0, 0, 0, -1308140090, 0, 0, 0, 1901359341, 0, 0, 0, 811953140, 0, 0, 0, -135058757, 0, 0, 0, -1228787294, 0, 0, 0, 1972444297, 0, 0, 0, 882902928, 0, 0, 0, -71524585, 0, 0, 0, -1165130738, 0, 0, 0, 2044635429, 0, 0, 0, 955232828, 0, 0, 0, -8785037, 0, 0, 0, -1102518166, 0, 0, 0, 2098971969, 0, 0, 0, 1009442392, 0, 0, 0, 89094640, 0, 0, 0, 1149133545, 0, 0, 0, -2027073598, 0, 0, 0, -971221797, 0, 0, 0, 25826708, 0, 0, 0, 1086000781, 0, 0, 0, -2081938522, 0, 0, 0, -1025951553, 0, 0, 0, 231055416, 0, 0, 0, 1291107105, 0, 0, 0, -1884842486, 0, 0, 0, -828994285, 0, 0, 0, 151047260, 0, 0, 0, 1211225925, 0, 0, 0, -1956447634, 0, 0, 0, -900472457, 0, 0, 0, 1415429050, 0, 0, 0, 359440547, 0, 0, 0, -700478072, 0, 0, 0, -1760651631, 0, 0, 0, 1352194014, 0, 0, 0, 296340679, 0, 0, 0, -755310100, 0, 0, 0, -1815348491, 0, 0, 0, 1557619314, 0, 0, 0, 501643627, 0, 0, 0, -558541760, 0, 0, 0, -1618718887, 0, 0, 0, 1477578262, 0, 0, 0, 421729551, 0, 0, 0, -630179804, 0, 0, 0, -1690229955, 0, 0, 0, -1486095003, 0, 0, 0, -430250372, 0, 0, 0, 621398871, 0, 0, 0, 1681444942, 0, 0, 0, -1548840703, 0, 0, 0, -492860904, 0, 0, 0, 567060275, 0, 0, 0, 1627241514, 0, 0, 0, -1344199507, 0, 0, 0, -288342092, 0, 0, 0, 763564703, 0, 0, 0, 1823607174, 0, 0, 0, -1423685431, 0, 0, 0, -367701040, 0, 0, 0, 692485883, 0, 0, 0, 1752655330, 0, 0, 0, -159826129, 0, 0, 0, -1220008906, 0, 0, 0, 1947928861, 0, 0, 0, 891949572, 0, 0, 0, -222538933, 0, 0, 0, -1282586542, 0, 0, 0, 1893623161, 0, 0, 0, 837779040, 0, 0, 0, -17570073, 0, 0, 0, -1077740034, 0, 0, 0, 2089930965, 0, 0, 0, 1033948108, 0, 0, 0, -97088893, 0, 0, 0, -1157131878, 0, 0, 0, 2018819249, 0, 0, 0, 962963368, 0, 0, 0, 1268286267, 0, 0, 0, 178886690, 0, 0, 0, -906316535, 0, 0, 0, -1999917552, 0, 0, 0, 1331556191, 0, 0, 0, 242021446, 0, 0, 0, -851453587, 0, 0, 0, -1945189772, 0, 0, 0, 1125276403, 0, 0, 0, 35865066, 0, 0, 0, -1049596735, 0, 0, 0, -2143193128, 0, 0, 0, 1205286551, 0, 0, 0, 115748238, 0, 0, 0, -977993563, 0, 0, 0, -2071716932, 0, 0, 0, 445268337, 0, 0, 0, 1539005032, 0, 0, 0, -1729595581, 0, 0, 0, -640062374, 0, 0, 0, 508505365, 0, 0, 0, 1602106892, 0, 0, 0, -1674765529, 0, 0, 0, -585367490, 0, 0, 0, 302028985, 0, 0, 0, 1395753888, 0, 0, 0, -1872580981, 0, 0, 0, -783043182, 0, 0, 0, 382072029, 0, 0, 0, 1475669956, 0, 0, 0, -1800944913, 0, 0, 0, -711534090, 0, 0, 0, -373553234, 0, 0, 0, -1467147081, 0, 0, 0, 1809723804, 0, 0, 0, 720317061, 0, 0, 0, -310809654, 0, 0, 0, -1404538669, 0, 0, 0, 1864064504, 0, 0, 0, 774522593, 0, 0, 0, -516497818, 0, 0, 0, -1610103425, 0, 0, 0, 1666508884, 0, 0, 0, 577106765, 0, 0, 0, -437014014, 0, 0, 0, -1530746597, 0, 0, 0, 1737589808, 0, 0, 0, 648060713, 0, 0, 0, -1196505628, 0, 0, 0, -106963203, 0, 0, 0, 986510294, 0, 0, 0, 2080237775, 0, 0, 0, -1133794944, 0, 0, 0, -44387687, 0, 0, 0, 1040818098, 0, 0, 0, 2134410411, 0, 0, 0, -1339810772, 0, 0, 0, -250280139, 0, 0, 0, 843459102, 0, 0, 0, 1937191175, 0, 0, 0, -1260294072, 0, 0, 0, -170890415, 0, 0, 0, 914572922, 0, 0, 0, 2008178019, 0, 0, 0, 1322777291, 0, 0, 0, 266789330, 0, 0, 0, -860500743, 0, 0, 0, -1920673824, 0, 0, 0, 1242732207, 0, 0, 0, 186879414, 0, 0, 0, -932142947, 0, 0, 0, -1992180860, 0, 0, 0, 1180508931, 0, 0, 0, 124532762, 0, 0, 0, -1002498767, 0, 0, 0, -2062676440, 0, 0, 0, 1117278055, 0, 0, 0, 61428862, 0, 0, 0, -1057326763, 0, 0, 0, -2117377460, 0, 0, 0, 533018753, 0, 0, 0, 1593058200, 0, 0, 0, -1649996109, 0, 0, 0, -594143830, 0, 0, 0, 453006565, 0, 0, 0, 1513181180, 0, 0, 0, -1721605417, 0, 0, 0, -665617970, 0, 0, 0, 391110985, 0, 0, 0, 1451162192, 0, 0, 0, -1792157829, 0, 0, 0, -736310174, 0, 0, 0, 327847213, 0, 0, 0, 1388025396, 0, 0, 0, -1847018721, 0, 0, 0, -791044090, 0, 0, 0, -319586722, 0, 0, 0, -1379769017, 0, 0, 0, 1855015020, 0, 0, 0, 799036277, 0, 0, 0, -399109574, 0, 0, 0, -1459156701, 0, 0, 0, 1783899144, 0, 0, 0, 728055569, 0, 0, 0, -461789290, 0, 0, 0, -1521959793, 0, 0, 0, 1713082788, 0, 0, 0, 657099453, 0, 0, 0, -524497934, 0, 0, 0, -1584541461, 0, 0, 0, 1658781120, 0, 0, 0, 602924761, 0, 0, 0, -1109279724, 0, 0, 0, -53434611, 0, 0, 0, 1065585190, 0, 0, 0, 2125631807, 0, 0, 0, -1188769680, 0, 0, 0, -132789399, 0, 0, 0, 994502210, 0, 0, 0, 2054683995, 0, 0, 0, -1251252772, 0, 0, 0, -195395899, 0, 0, 0, 923358190, 0, 0, 0, 1983400183, 0, 0, 0, -1313994312, 0, 0, 0, -258010463, 0, 0, 0, 869023626, 0, 0, 0, 1929192595, 0, 0, 0, 0, 0, 0, 0, 929743361, 0, 0, 0, 1859421187, 0, 0, 0, 1505641986, 0, 0, 0, -592967417, 0, 0, 0, -339555578, 0, 0, 0, -1300460284, 0, 0, 0, -2062135547, 0, 0, 0, -1202646258, 0, 0, 0, -1891905265, 0, 0, 0, -695888115, 0, 0, 0, -504408820, 0, 0, 0, 1694046729, 0, 0, 0, 1402198024, 0, 0, 0, 170761738, 0, 0, 0, 1028086795, 0, 0, 0, 1889740316, 0, 0, 0, 1204413469, 0, 0, 0, 511156767, 0, 0, 0, 689791006, 0, 0, 0, -1408553189, 0, 0, 0, -1688081126, 0, 0, 0, -1025529064, 0, 0, 0, -172660455, 0, 0, 0, -923650798, 0, 0, 0, -6752493, 0, 0, 0, -1507413743, 0, 0, 0, -1857260784, 0, 0, 0, 341457941, 0, 0, 0, 590413332, 0, 0, 0, 2056173590, 0, 0, 0, 1306819095, 0, 0, 0, -532263624, 0, 0, 0, -684945607, 0, 0, 0, -1902982853, 0, 0, 0, -1174926534, 0, 0, 0, 1022247999, 0, 0, 0, 193234494, 0, 0, 0, 1379582012, 0, 0, 0, 1699742269, 0, 0, 0, 1477926454, 0, 0, 0, 1870502967, 0, 0, 0, 918805045, 0, 0, 0, 27858996, 0, 0, 0, -2067835087, 0, 0, 0, -1277848272, 0, 0, 0, -362032334, 0, 0, 0, -587132621, 0, 0, 0, -1864013020, 0, 0, 0, -1483757275, 0, 0, 0, -30281945, 0, 0, 0, -916771546, 0, 0, 0, 1280139811, 0, 0, 0, 2066194466, 0, 0, 0, 580511264, 0, 0, 0, 368256033, 0, 0, 0, 682915882, 0, 0, 0, 534690347, 0, 0, 0, 1180761129, 0, 0, 0, 1896496680, 0, 0, 0, -199462611, 0, 0, 0, -1015631060, 0, 0, 0, -1698106066, 0, 0, 0, -1381877969, 0, 0, 0, -1064461712, 0, 0, 0, -135833487, 0, 0, 0, -1369891213, 0, 0, 0, -1724654478, 0, 0, 0, 472224631, 0, 0, 0, 726618486, 0, 0, 0, 1928402804, 0, 0, 0, 1167840629, 0, 0, 0, 2027719038, 0, 0, 0, 1337346943, 0, 0, 0, 369626493, 0, 0, 0, 560123772, 0, 0, 0, -1535868807, 0, 0, 0, -1826733448, 0, 0, 0, -895482758, 0, 0, 0, -37042565, 0, 0, 0, -1339114388, 0, 0, 0, -2025554323, 0, 0, 0, -554026897, 0, 0, 0, -376374674, 0, 0, 0, 1820767595, 0, 0, 0, 1542223722, 0, 0, 0, 38941032, 0, 0, 0, 892924777, 0, 0, 0, 142585698, 0, 0, 0, 1058368867, 0, 0, 0, 1722493793, 0, 0, 0, 1371662688, 0, 0, 0, -724064667, 0, 0, 0, -474127260, 0, 0, 0, -1174199706, 0, 0, 0, -1922441113, 0, 0, 0, 550229832, 0, 0, 0, 396432713, 0, 0, 0, 1310675787, 0, 0, 0, 2037748042, 0, 0, 0, -60563889, 0, 0, 0, -888595378, 0, 0, 0, -1833477556, 0, 0, 0, -1512204211, 0, 0, 0, -1734687674, 0, 0, 0, -1343224249, 0, 0, 0, -162643899, 0, 0, 0, -1054571964, 0, 0, 0, 1144180033, 0, 0, 0, 1935150912, 0, 0, 0, 719735106, 0, 0, 0, 495749955, 0, 0, 0, 1349054804, 0, 0, 0, 1728197461, 0, 0, 0, 1052538199, 0, 0, 0, 165066582, 0, 0, 0, -1933510573, 0, 0, 0, -1146471854, 0, 0, 0, -501973936, 0, 0, 0, -713114031, 0, 0, 0, -398859686, 0, 0, 0, -548200357, 0, 0, 0, -2031262119, 0, 0, 0, -1316510632, 0, 0, 0, 881978205, 0, 0, 0, 66791772, 0, 0, 0, 1514499934, 0, 0, 0, 1831841119, 0, 0, 0, -2145700383, 0, 0, 0, -1217267744, 0, 0, 0, -288378398, 0, 0, 0, -643468317, 0, 0, 0, 1555250406, 0, 0, 0, 1809448679, 0, 0, 0, 845658341, 0, 0, 0, 84769508, 0, 0, 0, 944383727, 0, 0, 0, 253813998, 0, 0, 0, 1453236972, 0, 0, 0, 1643405549, 0, 0, 0, -454938648, 0, 0, 0, -746000919, 0, 0, 0, -1976128533, 0, 0, 0, -1118017046, 0, 0, 0, -256371715, 0, 0, 0, -942484996, 0, 0, 0, -1637050370, 0, 0, 0, -1459202561, 0, 0, 0, 739252986, 0, 0, 0, 461035771, 0, 0, 0, 1120182009, 0, 0, 0, 1974361336, 0, 0, 0, 1223229683, 0, 0, 0, 2139341554, 0, 0, 0, 641565936, 0, 0, 0, 290932465, 0, 0, 0, -1807676940, 0, 0, 0, -1557410827, 0, 0, 0, -90862089, 0, 0, 0, -838905866, 0, 0, 0, 1616738521, 0, 0, 0, 1463270104, 0, 0, 0, 243924186, 0, 0, 0, 971194075, 0, 0, 0, -1124765218, 0, 0, 0, -1952468001, 0, 0, 0, -769526307, 0, 0, 0, -448055332, 0, 0, 0, -670274601, 0, 0, 0, -278484522, 0, 0, 0, -1227296812, 0, 0, 0, -2119029291, 0, 0, 0, 77882064, 0, 0, 0, 869179601, 0, 0, 0, 1785784019, 0, 0, 0, 1561994450, 0, 0, 0, 285105861, 0, 0, 0, 664050884, 0, 0, 0, 2116737734, 0, 0, 0, 1228937415, 0, 0, 0, -866756670, 0, 0, 0, -79915581, 0, 0, 0, -1568484415, 0, 0, 0, -1779953216, 0, 0, 0, -1464906293, 0, 0, 0, -1614442550, 0, 0, 0, -964965944, 0, 0, 0, -250541111, 0, 0, 0, 1946633420, 0, 0, 0, 1131251405, 0, 0, 0, 450085071, 0, 0, 0, 767099598, 0, 0, 0, 1083617169, 0, 0, 0, 2013031824, 0, 0, 0, 776088466, 0, 0, 0, 422111635, 0, 0, 0, -1673615722, 0, 0, 0, -1420532585, 0, 0, 0, -219536747, 0, 0, 0, -981409644, 0, 0, 0, -121127777, 0, 0, 0, -810713442, 0, 0, 0, -1777125220, 0, 0, 0, -1585841507, 0, 0, 0, 611300760, 0, 0, 0, 319125401, 0, 0, 0, 1253781915, 0, 0, 0, 2110911386, 0, 0, 0, 808814989, 0, 0, 0, 123685772, 0, 0, 0, 1591807374, 0, 0, 0, 1770770319, 0, 0, 0, -325222262, 0, 0, 0, -604552565, 0, 0, 0, -2109143927, 0, 0, 0, -1255946616, 0, 0, 0, -2006672765, 0, 0, 0, -1089578878, 0, 0, 0, -424665472, 0, 0, 0, -774185855, 0, 0, 0, 1422693252, 0, 0, 0, 1671844229, 0, 0, 0, 974657415, 0, 0, 0, 225629574, 0, 0, 0, -1596923223, 0, 0, 0, -1749409624, 0, 0, 0, -838572374, 0, 0, 0, -110189397, 0, 0, 0, 2088299438, 0, 0, 0, 1259481519, 0, 0, 0, 313290669, 0, 0, 0, 633777580, 0, 0, 0, 411169191, 0, 0, 0, 803943334, 0, 0, 0, 1985312164, 0, 0, 0, 1094694821, 0, 0, 0, -1003882336, 0, 0, 0, -213697887, 0, 0, 0, -1426228061, 0, 0, 0, -1650999646, 0, 0, 0, -797719371, 0, 0, 0, -417790284, 0, 0, 0, -1096335178, 0, 0, 0, -1983020361, 0, 0, 0, 215731634, 0, 0, 0, 1001459635, 0, 0, 0, 1645169073, 0, 0, 0, 1432718256, 0, 0, 0, 1747113915, 0, 0, 0, 1598559674, 0, 0, 0, 116806584, 0, 0, 0, 832344505, 0, 0, 0, -1265967428, 0, 0, 0, -2082464579, 0, 0, 0, -631350593, 0, 0, 0, -315320130, 0, 0, 0, 0, 0, 0, 0, 1701297336, 0, 0, 0, -1949824598, 0, 0, 0, -290474734, 0, 0, 0, 1469538959, 0, 0, 0, 854646327, 0, 0, 0, -597726427, 0, 0, 0, -1187457123, 0, 0, 0, -282544955, 0, 0, 0, -1974531971, 0, 0, 0, 1692450159, 0, 0, 0, 25625047, 0, 0, 0, -1195387318, 0, 0, 0, -573019406, 0, 0, 0, 863494112, 0, 0, 0, 1443914584, 0, 0, 0, -1621681840, 0, 0, 0, -97475096, 0, 0, 0, 345968890, 0, 0, 0, 1912122434, 0, 0, 0, -926909473, 0, 0, 0, -1381513369, 0, 0, 0, 1124627061, 0, 0, 0, 644861645, 0, 0, 0, 1887415701, 0, 0, 0, 353898797, 0, 0, 0, -71850945, 0, 0, 0, -1630529401, 0, 0, 0, 669568794, 0, 0, 0, 1116697506, 0, 0, 0, -1407138128, 0, 0, 0, -918062584, 0, 0, 0, 1051669152, 0, 0, 0, 1539870232, 0, 0, 0, -1251525878, 0, 0, 0, -805271630, 0, 0, 0, 1765298223, 0, 0, 0, 207613079, 0, 0, 0, -487564923, 0, 0, 0, -2020088515, 0, 0, 0, -779647387, 0, 0, 0, -1260373283, 0, 0, 0, 1515163599, 0, 0, 0, 1059599223, 0, 0, 0, -2045713174, 0, 0, 0, -478717870, 0, 0, 0, 232320320, 0, 0, 0, 1757368824, 0, 0, 0, -1577571344, 0, 0, 0, -996174008, 0, 0, 0, 707797594, 0, 0, 0, 1331142370, 0, 0, 0, -160478849, 0, 0, 0, -1828129337, 0, 0, 0, 2108113109, 0, 0, 0, 415300717, 0, 0, 0, 1322295093, 0, 0, 0, 733422477, 0, 0, 0, -988244321, 0, 0, 0, -1602278873, 0, 0, 0, 424148410, 0, 0, 0, 2082488578, 0, 0, 0, -1836059632, 0, 0, 0, -135771992, 0, 0, 0, 1029182619, 0, 0, 0, 1480566819, 0, 0, 0, -1232069327, 0, 0, 0, -738745975, 0, 0, 0, 1791981076, 0, 0, 0, 262720172, 0, 0, 0, -519602242, 0, 0, 0, -2074033402, 0, 0, 0, -764370850, 0, 0, 0, -1223222042, 0, 0, 0, 1505274356, 0, 0, 0, 1021252940, 0, 0, 0, -2048408879, 0, 0, 0, -528449943, 0, 0, 0, 238013307, 0, 0, 0, 1799911363, 0, 0, 0, -1576071733, 0, 0, 0, -949440141, 0, 0, 0, 700908641, 0, 0, 0, 1285601497, 0, 0, 0, -174559420, 0, 0, 0, -1862282244, 0, 0, 0, 2119198446, 0, 0, 0, 456645206, 0, 0, 0, 1294448910, 0, 0, 0, 675284406, 0, 0, 0, -957370204, 0, 0, 0, -1551365092, 0, 0, 0, 447798145, 0, 0, 0, 2144823097, 0, 0, 0, -1854352853, 0, 0, 0, -199266669, 0, 0, 0, 66528827, 0, 0, 0, 1720752771, 0, 0, 0, -2009124975, 0, 0, 0, -312962263, 0, 0, 0, 1415595188, 0, 0, 0, 822605836, 0, 0, 0, -542618338, 0, 0, 0, -1160777306, 0, 0, 0, -320892162, 0, 0, 0, -1984418234, 0, 0, 0, 1729600340, 0, 0, 0, 40904684, 0, 0, 0, -1152847759, 0, 0, 0, -567325495, 0, 0, 0, 813758939, 0, 0, 0, 1441219939, 0, 0, 0, -1667219605, 0, 0, 0, -104365101, 0, 0, 0, 392705729, 0, 0, 0, 1913621113, 0, 0, 0, -885563932, 0, 0, 0, -1370431140, 0, 0, 0, 1090475086, 0, 0, 0, 630778102, 0, 0, 0, 1938328494, 0, 0, 0, 384775958, 0, 0, 0, -129990140, 0, 0, 0, -1658372420, 0, 0, 0, 606071073, 0, 0, 0, 1098405273, 0, 0, 0, -1344806773, 0, 0, 0, -894411725, 0, 0, 0, 1001806317, 0, 0, 0, 1590814037, 0, 0, 0, -1333899193, 0, 0, 0, -719721217, 0, 0, 0, 1814117218, 0, 0, 0, 155617242, 0, 0, 0, -404147512, 0, 0, 0, -2104586640, 0, 0, 0, -727782104, 0, 0, 0, -1309060720, 0, 0, 0, 1599530114, 0, 0, 0, 976312378, 0, 0, 0, -2096525401, 0, 0, 0, -428985569, 0, 0, 0, 146900493, 0, 0, 0, 1839610549, 0, 0, 0, -1528741699, 0, 0, 0, -1048118267, 0, 0, 0, 791234839, 0, 0, 0, 1246688687, 0, 0, 0, -210361806, 0, 0, 0, -1777230198, 0, 0, 0, 2025728920, 0, 0, 0, 500799264, 0, 0, 0, 1271526520, 0, 0, 0, 783173824, 0, 0, 0, -1073611310, 0, 0, 0, -1520025238, 0, 0, 0, 475961079, 0, 0, 0, 2033789519, 0, 0, 0, -1751736483, 0, 0, 0, -219077659, 0, 0, 0, 85551949, 0, 0, 0, 1618925557, 0, 0, 0, -1898880281, 0, 0, 0, -340337057, 0, 0, 0, 1385040322, 0, 0, 0, 938063226, 0, 0, 0, -649723800, 0, 0, 0, -1138639664, 0, 0, 0, -365830264, 0, 0, 0, -1890163920, 0, 0, 0, 1643763234, 0, 0, 0, 77490842, 0, 0, 0, -1113146105, 0, 0, 0, -658439745, 0, 0, 0, 913224877, 0, 0, 0, 1393100821, 0, 0, 0, -1706135011, 0, 0, 0, -14037339, 0, 0, 0, 294026167, 0, 0, 0, 1960953615, 0, 0, 0, -841412462, 0, 0, 0, -1463899094, 0, 0, 0, 1175525688, 0, 0, 0, 594978176, 0, 0, 0, 1969669848, 0, 0, 0, 268532320, 0, 0, 0, -22098062, 0, 0, 0, -1681296438, 0, 0, 0, 586261591, 0, 0, 0, 1201019119, 0, 0, 0, -1455837699, 0, 0, 0, -866250427, 0, 0, 0, 116280694, 0, 0, 0, 1669984718, 0, 0, 0, -1926871844, 0, 0, 0, -398329756, 0, 0, 0, 1366896633, 0, 0, 0, 874419009, 0, 0, 0, -625924525, 0, 0, 0, -1076454677, 0, 0, 0, -372835917, 0, 0, 0, -1935588085, 0, 0, 0, 1645146137, 0, 0, 0, 124341409, 0, 0, 0, -1101948100, 0, 0, 0, -617207932, 0, 0, 0, 899256982, 0, 0, 0, 1358835246, 0, 0, 0, -1715907546, 0, 0, 0, -52500322, 0, 0, 0, 309419404, 0, 0, 0, 1997988148, 0, 0, 0, -835832151, 0, 0, 0, -1421243887, 0, 0, 0, 1172717315, 0, 0, 0, 545358779, 0, 0, 0, 1989271779, 0, 0, 0, 334912603, 0, 0, 0, -44439223, 0, 0, 0, -1740745231, 0, 0, 0, 554074732, 0, 0, 0, 1147223764, 0, 0, 0, -1429304378, 0, 0, 0, -810993794, 0, 0, 0, 943816662, 0, 0, 0, 1562821486, 0, 0, 0, -1282836868, 0, 0, 0, -688993596, 0, 0, 0, 1876303193, 0, 0, 0, 179413473, 0, 0, 0, -467790605, 0, 0, 0, -2122733493, 0, 0, 0, -680932589, 0, 0, 0, -1307674709, 0, 0, 0, 1554105017, 0, 0, 0, 969309697, 0, 0, 0, -2130794084, 0, 0, 0, -442952412, 0, 0, 0, 188129334, 0, 0, 0, 1850809486, 0, 0, 0, -1491704186, 0, 0, 0, -1032725954, 0, 0, 0, 752774956, 0, 0, 0, 1236915092, 0, 0, 0, -259980279, 0, 0, 0, -1780041551, 0, 0, 0, 2068385187, 0, 0, 0, 506376475, 0, 0, 0, 1212076611, 0, 0, 0, 760835835, 0, 0, 0, -1007232023, 0, 0, 0, -1500420271, 0, 0, 0, 531214540, 0, 0, 0, 2060323956, 0, 0, 0, -1805534874, 0, 0, 0, -251263522, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

_inflate_table_lbase = allocate([ 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 13, 0, 15, 0, 17, 0, 19, 0, 23, 0, 27, 0, 31, 0, 35, 0, 43, 0, 51, 0, 59, 0, 67, 0, 83, 0, 99, 0, 115, 0, 131, 0, 163, 0, 195, 0, 227, 0, 258, 0, 0, 0, 0, 0 ], [ "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0 ], ALLOC_STATIC);

_inflate_table_lext = allocate([ 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 17, 0, 17, 0, 17, 0, 17, 0, 18, 0, 18, 0, 18, 0, 18, 0, 19, 0, 19, 0, 19, 0, 19, 0, 20, 0, 20, 0, 20, 0, 20, 0, 21, 0, 21, 0, 21, 0, 21, 0, 16, 0, 73, 0, 195, 0 ], [ "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0 ], ALLOC_STATIC);

_inflate_table_dbase = allocate([ 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 7, 0, 9, 0, 13, 0, 17, 0, 25, 0, 33, 0, 49, 0, 65, 0, 97, 0, 129, 0, 193, 0, 257, 0, 385, 0, 513, 0, 769, 0, 1025, 0, 1537, 0, 2049, 0, 3073, 0, 4097, 0, 6145, 0, 8193, 0, 12289, 0, 16385, 0, 24577, 0, 0, 0, 0, 0 ], [ "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0 ], ALLOC_STATIC);

_inflate_table_dext = allocate([ 16, 0, 16, 0, 16, 0, 16, 0, 17, 0, 17, 0, 18, 0, 18, 0, 19, 0, 19, 0, 20, 0, 20, 0, 21, 0, 21, 0, 22, 0, 22, 0, 23, 0, 23, 0, 24, 0, 24, 0, 25, 0, 25, 0, 26, 0, 26, 0, 27, 0, 27, 0, 28, 0, 28, 0, 29, 0, 29, 0, 64, 0, 64, 0 ], [ "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0, "i16", 0 ], ALLOC_STATIC);

STRING_TABLE.__str53 = allocate([ 105, 110, 118, 97, 108, 105, 100, 32, 100, 105, 115, 116, 97, 110, 99, 101, 32, 116, 111, 111, 32, 102, 97, 114, 32, 98, 97, 99, 107, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str154 = allocate([ 105, 110, 118, 97, 108, 105, 100, 32, 100, 105, 115, 116, 97, 110, 99, 101, 32, 99, 111, 100, 101, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str255 = allocate([ 105, 110, 118, 97, 108, 105, 100, 32, 108, 105, 116, 101, 114, 97, 108, 47, 108, 101, 110, 103, 116, 104, 32, 99, 111, 100, 101, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str462 = allocate([ 115, 116, 114, 101, 97, 109, 32, 101, 114, 114, 111, 114, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str664 = allocate([ 105, 110, 115, 117, 102, 102, 105, 99, 105, 101, 110, 116, 32, 109, 101, 109, 111, 114, 121, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str765 = allocate([ 98, 117, 102, 102, 101, 114, 32, 101, 114, 114, 111, 114, 0 ], "i8", ALLOC_STATIC);

__gm_ = allocate(468, [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

_mparams = allocate(24, "i32", ALLOC_STATIC);

HEAP32[_static_l_desc >> 2] = _static_ltree | 0;

HEAP32[_static_l_desc + 4 >> 2] = _extra_lbits | 0;

HEAP32[_static_d_desc >> 2] = _static_dtree | 0;

HEAP32[_static_d_desc + 4 >> 2] = _extra_dbits | 0;

HEAP32[_static_bl_desc + 4 >> 2] = _extra_blbits | 0;

FUNCTION_TABLE = [ 0, 0, _zcalloc, 0, _zcfree, 0, _deflate_stored, 0, _deflate_fast, 0, _deflate_slow, 0 ];

Module["FUNCTION_TABLE"] = FUNCTION_TABLE;
