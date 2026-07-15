/**
 * @author shaozilee
 *
 * Bmp format decoder,support 1bit 4bit 8bit 24bit bmp
 *
 */

import { console } from "./console.js";

interface PaletteEntry {
  red: number;
  green: number;
  blue: number;
  quad: number;
}

class BmpDecoder {
  declare pos: number;
  declare buffer: Uint8Array;
  declare datav: DataView;
  declare is_with_alpha: boolean;
  declare bottom_up: boolean;
  declare flag: string;
  declare fileSize: number;
  declare reserved: number;
  declare offset: number;
  declare headerSize: number;
  declare width: number;
  declare height: number;
  declare planes: number;
  declare bitPP: number;
  declare compress: number;
  declare rawSize: number;
  declare hr: number;
  declare vr: number;
  declare colors: number;
  declare importantColors: number;
  declare palette: PaletteEntry[];
  declare data: Uint8Array;

  constructor(buffer: Uint8Array, is_with_alpha?: boolean) {
    this.pos = 0;
    this.buffer = buffer;
    this.datav = new DataView(buffer.buffer);
    this.is_with_alpha = !!is_with_alpha;
    this.bottom_up = true;
    this.flag =
      String.fromCharCode(this.buffer[0]) + String.fromCharCode(this.buffer[1]);
    this.pos += 2;
    if (["BM", "BA", "CI", "CP", "IC", "PT"].indexOf(this.flag) === -1)
      throw new Error("Invalid BMP File");
    this.parseHeader();
    this.parseBGR();
  }

  parseHeader(): void {
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
      const len = this.colors === 0 ? 1 << this.bitPP : this.colors;
      this.palette = new Array(len);
      for (let i = 0; i < len; i++) {
        const blue = this.datav.getUint8(this.pos++);
        const green = this.datav.getUint8(this.pos++);
        const red = this.datav.getUint8(this.pos++);
        const quad = this.datav.getUint8(this.pos++);
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
  }

  parseBGR(): void {
    this.pos = this.offset;
    const bitn = "bit" + this.bitPP;
    const len = this.width * this.height * 4;

    if (len > 512 * 1024 * 1024) {
      throw new Error("Image dimensions exceed 512MB, which is too large.");
    }

    this.data = new Uint8Array(len);

    try {
      // Dispatch by bit depth ("bit1" ... "bit32"); unknown depths throw and
      // are reported below, matching the original dynamic-lookup behavior.
      ((this as unknown) as Record<string, () => void>)[bitn]();
    } catch (e) {
      console.log("bit decode error:" + e);
    }
  }

  bit1(): void {
    const xlen = Math.ceil(this.width / 8);
    const mode = xlen % 4;
    let y;
    for (y = this.height - 1; y >= 0; y--) {
      const line = this.bottom_up ? y : this.height - 1 - y;
      for (let x = 0; x < xlen; x++) {
        const b = this.datav.getUint8(this.pos++);
        const location = line * this.width * 4 + x * 8 * 4;
        for (let i = 0; i < 8; i++) {
          if (x * 8 + i < this.width) {
            const rgb = this.palette[(b >> (7 - i)) & 0x1];
            this.data[location + i * 4] = rgb.blue;
            this.data[location + i * 4 + 1] = rgb.green;
            this.data[location + i * 4 + 2] = rgb.red;
            this.data[location + i * 4 + 3] = 0xff;
          } else {
            break;
          }
        }
      }

      if (mode !== 0) {
        this.pos += 4 - mode;
      }
    }
  }

  bit4(): void {
    const xlen = Math.ceil(this.width / 2);
    const mode = xlen % 4;
    for (let y = this.height - 1; y >= 0; y--) {
      const line = this.bottom_up ? y : this.height - 1 - y;
      for (let x = 0; x < xlen; x++) {
        const b = this.datav.getUint8(this.pos++);
        const location = line * this.width * 4 + x * 2 * 4;

        const before = b >> 4;
        const after = b & 0x0f;

        let rgb = this.palette[before];
        this.data[location] = rgb.blue;
        this.data[location + 1] = rgb.green;
        this.data[location + 2] = rgb.red;
        this.data[location + 3] = 0xff;

        if (x * 2 + 1 >= this.width) break;

        rgb = this.palette[after];
        this.data[location + 4] = rgb.blue;
        this.data[location + 4 + 1] = rgb.green;
        this.data[location + 4 + 2] = rgb.red;
        this.data[location + 4 + 3] = 0xff;
      }

      if (mode !== 0) {
        this.pos += 4 - mode;
      }
    }
  }

  bit8(): void {
    const mode = this.width % 4;
    for (let y = this.height - 1; y >= 0; y--) {
      const line = this.bottom_up ? y : this.height - 1 - y;
      for (let x = 0; x < this.width; x++) {
        const b = this.datav.getUint8(this.pos++);
        const location = line * this.width * 4 + x * 4;
        if (b < this.palette.length) {
          const rgb = this.palette[b];
          this.data[location] = rgb.red;
          this.data[location + 1] = rgb.green;
          this.data[location + 2] = rgb.blue;
          this.data[location + 3] = 0xff;
        } else {
          this.data[location] = 0xff;
          this.data[location + 1] = 0xff;
          this.data[location + 2] = 0xff;
          this.data[location + 3] = 0xff;
        }
      }
      if (mode !== 0) {
        this.pos += 4 - mode;
      }
    }
  }

  bit15(): void {
    const dif_w = this.width % 3;
    const _11111 = parseInt("11111", 2),
      _1_5 = _11111;
    for (let y = this.height - 1; y >= 0; y--) {
      const line = this.bottom_up ? y : this.height - 1 - y;
      for (let x = 0; x < this.width; x++) {
        const B = this.datav.getUint16(this.pos, true);
        this.pos += 2;
        const blue = (((B & _1_5) / _1_5) * 255) | 0;
        const green = ((((B >> 5) & _1_5) / _1_5) * 255) | 0;
        const red = ((((B >> 10) & _1_5) / _1_5) * 255) | 0;
        const alpha = B >> 15 ? 0xff : 0x00;

        const location = line * this.width * 4 + x * 4;
        this.data[location] = red;
        this.data[location + 1] = green;
        this.data[location + 2] = blue;
        this.data[location + 3] = alpha;
      }
      //skip extra bytes
      this.pos += dif_w;
    }
  }

  bit16(): void {
    const dif_w = this.width % 3;
    const _11111 = parseInt("11111", 2),
      _1_5 = _11111;
    const _111111 = parseInt("111111", 2),
      _1_6 = _111111;
    for (let y = this.height - 1; y >= 0; y--) {
      const line = this.bottom_up ? y : this.height - 1 - y;
      for (let x = 0; x < this.width; x++) {
        const B = this.datav.getUint16(this.pos, true);
        this.pos += 2;
        const alpha = 0xff;
        const blue = (((B & _1_5) / _1_5) * 255) | 0;
        const green = ((((B >> 5) & _1_6) / _1_6) * 255) | 0;
        const red = (((B >> 11) / _1_5) * 255) | 0;

        const location = line * this.width * 4 + x * 4;
        this.data[location] = red;
        this.data[location + 1] = green;
        this.data[location + 2] = blue;
        this.data[location + 3] = alpha;
      }
      //skip extra bytes
      this.pos += dif_w;
    }
  }

  bit24(): void {
    //when height > 0
    for (let y = this.height - 1; y >= 0; y--) {
      const line = this.bottom_up ? y : this.height - 1 - y;
      for (let x = 0; x < this.width; x++) {
        const blue = this.datav.getUint8(this.pos++);
        const green = this.datav.getUint8(this.pos++);
        const red = this.datav.getUint8(this.pos++);
        const location = line * this.width * 4 + x * 4;
        this.data[location] = red;
        this.data[location + 1] = green;
        this.data[location + 2] = blue;
        this.data[location + 3] = 0xff;
      }
      //skip extra bytes
      this.pos += this.width % 4;
    }
  }

  /**
   * add 32bit decode func
   * @author soubok
   */
  bit32(): void {
    //when height > 0
    for (let y = this.height - 1; y >= 0; y--) {
      const line = this.bottom_up ? y : this.height - 1 - y;
      for (let x = 0; x < this.width; x++) {
        const blue = this.datav.getUint8(this.pos++);
        const green = this.datav.getUint8(this.pos++);
        const red = this.datav.getUint8(this.pos++);
        const alpha = this.datav.getUint8(this.pos++);
        const location = line * this.width * 4 + x * 4;
        this.data[location] = red;
        this.data[location + 1] = green;
        this.data[location + 2] = blue;
        this.data[location + 3] = alpha;
      }
      //skip extra bytes
      //this.pos += (this.width % 4);
    }
  }

  getData(): Uint8Array {
    return this.data;
  }
}

export { BmpDecoder };
