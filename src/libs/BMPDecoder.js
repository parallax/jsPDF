/**
 * @author shaozilee
 *
 * Bmp format decoder,support 1bit 4bit 8bit 24bit bmp
 *
 */

function BmpDecoder(buffer, is_with_alpha) {
  this.pos = 0;
  this.buffer = buffer;
  this.datav = new DataView(buffer.buffer);
  this.is_with_alpha = !!is_with_alpha;
  this.bottom_up = true;
  this.flag = String.fromCharCode(this.buffer[0]) + String.fromCharCode(this.buffer[1]);
  this.pos += 2;
  if (["BM", "BA", "CI", "CP", "IC", "PT"].indexOf(this.flag) === -1) throw new Error("Invalid BMP File");
  this.parseHeader();
  this.parseBGR();
}

BmpDecoder.prototype.parseHeader = function () {
  this.fileSize = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.reserved = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.offset = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.headerSize = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.width = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.height = this.datav.getInt32(this.pos, true);
  this.pos += 4;
  this.planes = this.datav.getUint16(this.pos, true);
  this.pos += 2;
  this.bitPP = this.datav.getUint16(this.pos, true);
  this.pos += 2;
  this.compress = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.rawSize = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.hr = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.vr = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.colors = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.importantColors = this.datav.getUint32(this.pos, true);
  this.pos += 4;

  if (this.bitPP === 16 && this.is_with_alpha) {
    this.bitPP = 15;
  }
  if (this.bitPP < 15) {
    var len = this.colors === 0 ? 1 << this.bitPP : this.colors;
    this.palette = new Array(len);
    for (var i = 0; i < len; i++) {
      var blue = this.datav.getUint8(this.pos++, true);
      var green = this.datav.getUint8(this.pos++, true);
      var red = this.datav.getUint8(this.pos++, true);
      var quad = this.datav.getUint8(this.pos++, true);
      this.palette[i] = {
        red: red,
        green: green,
        blue: blue,
        quad: quad
      };
    }
  }
  if (this.height < 0) {
    this.height *= -1;
    this.bottom_up = false;
  }
};

BmpDecoder.prototype.parseBGR = function () {
  this.pos = this.offset;
  try {
    var bitn = "bit" + this.bitPP;
    var len = this.width * this.height * 4;
    this.data = new Uint8Array(len);

    this[bitn]();
  } catch (e) {
    console.log("bit decode error:" + e);
  }
};

BmpDecoder.prototype.bit1 = function () {
  var xlen = Math.ceil(this.width / 8);
  var mode = xlen % 4;
  var y;
  for (y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y
    for (var x = 0; x < xlen; x++) {
      var b = this.datav.getUint8(this.pos++, true);
      var location = line * this.width * 4 + x * 8 * 4;
      for (var i = 0; i < 8; i++) {
        if (x * 8 + i < this.width) {
          var rgb = this.palette[((b >> (7 - i)) & 0x1)];
          this.data[location + i * 4] = rgb.blue;
          this.data[location + i * 4 + 1] = rgb.green;
          this.data[location + i * 4 + 2] = rgb.red;
          this.data[location + i * 4 + 3] = 0xFF;
        } else {
          break;
        }
      }
    }

    if (mode !== 0) {
      this.pos += (4 - mode);
    }
  }
};

BmpDecoder.prototype.bit4 = function () {
  var xlen = Math.ceil(this.width / 2);
  var mode = xlen % 4;
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < xlen; x++) {
      var b = this.datav.getUint8(this.pos++, true);
      var location = line * this.width * 4 + x * 2 * 4;

      var before = b >> 4;
      var after = b & 0x0F;

      var rgb = this.palette[before];
      this.data[location] = rgb.blue;
      this.data[location + 1] = rgb.green;
      this.data[location + 2] = rgb.red;
      this.data[location + 3] = 0xFF;

      if (x * 2 + 1 >= this.width) break;

      rgb = this.palette[after];
      this.data[location + 4] = rgb.blue;
      this.data[location + 4 + 1] = rgb.green;
      this.data[location + 4 + 2] = rgb.red;
      this.data[location + 4 + 3] = 0xFF;
    }

    if (mode !== 0) {
      this.pos += (4 - mode);
    }
  }
};

BmpDecoder.prototype.bit8 = function () {
  var mode = this.width % 4;
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < this.width; x++) {
      var b = this.datav.getUint8(this.pos++, true);
      var location = line * this.width * 4 + x * 4;
      if (b < this.palette.length) {
        var rgb = this.palette[b];
        this.data[location] = rgb.red;
        this.data[location + 1] = rgb.green;
        this.data[location + 2] = rgb.blue;
        this.data[location + 3] = 0xFF;
      } else {
        this.data[location] = 0xFF;
        this.data[location + 1] = 0xFF;
        this.data[location + 2] = 0xFF;
        this.data[location + 3] = 0xFF;
      }
    }
    if (mode !== 0) {
      this.pos += (4 - mode);
    }
  }
};

BmpDecoder.prototype.bit15 = function () {
  var dif_w = this.width % 3;
  var _11111 = parseInt("11111", 2), _1_5 = _11111;
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < this.width; x++) {

      var B = this.datav.getUint16(this.pos, true);
      this.pos += 2;
      var blue = (B & _1_5) / _1_5 * 255 | 0;
      var green = (B >> 5 & _1_5) / _1_5 * 255 | 0;
      var red = (B >> 10 & _1_5) / _1_5 * 255 | 0;
      var alpha = (B >> 15) ? 0xFF : 0x00;

      var location = line * this.width * 4 + x * 4;
      this.data[location] = red;
      this.data[location + 1] = green;
      this.data[location + 2] = blue;
      this.data[location + 3] = alpha;
    }
    //skip extra bytes
    this.pos += dif_w;
  }
};

BmpDecoder.prototype.bit16 = function () {
  var dif_w = this.width % 3;
  var _11111 = parseInt("11111", 2), _1_5 = _11111;
  var _111111 = parseInt("111111", 2), _1_6 = _111111;
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < this.width; x++) {

      var B = this.datav.getUint16(this.pos, true);
      this.pos += 2;
      var alpha = 0xFF;
      var blue = (B & _1_5) / _1_5 * 255 | 0;
      var green = (B >> 5 & _1_6) / _1_6 * 255 | 0;
      var red = (B >> 11) / _1_5 * 255 | 0;

      var location = line * this.width * 4 + x * 4;
      this.data[location] = red;
      this.data[location + 1] = green;
      this.data[location + 2] = blue;
      this.data[location + 3] = alpha;
    }
    //skip extra bytes
    this.pos += dif_w;
  }
};

BmpDecoder.prototype.bit24 = function () {
  //when height > 0
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < this.width; x++) {
      var blue = this.datav.getUint8(this.pos++, true);
      var green = this.datav.getUint8(this.pos++, true);
      var red = this.datav.getUint8(this.pos++, true);
      var location = line * this.width * 4 + x * 4;
      this.data[location] = red;
      this.data[location + 1] = green;
      this.data[location + 2] = blue;
      this.data[location + 3] = 0xFF;
    }
    //skip extra bytes
    this.pos += (this.width % 4);
  }
};

/**
 * add 32bit decode func
 * @author soubok
 */
BmpDecoder.prototype.bit32 = function () {
  //when height > 0
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < this.width; x++) {
      var blue = this.datav.getUint8(this.pos++, true);
      var green = this.datav.getUint8(this.pos++, true);
      var red = this.datav.getUint8(this.pos++, true);
      var alpha = this.datav.getUint8(this.pos++, true);
      var location = line * this.width * 4 + x * 4;
      this.data[location] = red;
      this.data[location + 1] = green;
      this.data[location + 2] = blue;
      this.data[location + 3] = alpha;
    }
    //skip extra bytes
    //this.pos += (this.width % 4);
  }
};

BmpDecoder.prototype.getData = function () {
  return this.data;
};

// eslint-disable-next-line no-empty
try { exports.BmpDecoder = BmpDecoder; } catch (e) { }  // CommonJS.