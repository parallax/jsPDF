/************************************************
 * Title : custom font                          *
 * Start Data : 2017. 01. 22.                   *
 * Comment : TEXT API                           *
 ************************************************/

/******************************
 * jsPDF extension API Design *
 * ****************************/
(function(jsPDF){
    "use strict";
    var PLUS = '+'.charCodeAt(0)
    var SLASH = '/'.charCodeAt(0)
    var NUMBER = '0'.charCodeAt(0)
    var LOWER = 'a'.charCodeAt(0)
    var UPPER = 'A'.charCodeAt(0)
    var PLUS_URL_SAFE = '-'.charCodeAt(0)
    var SLASH_URL_SAFE = '_'.charCodeAt(0)

    /*****************************************************************/
    /* function : b64ToByteArray                                     */
    /* comment : Base64 encoded TTF file contents (b64) are decoded  */
    /*     by Byte array and stored.                                 */
    /*****************************************************************/
    var b64ToByteArray = function(b64) {
        var i, j, l, tmp, placeHolders, arr
        if (b64.length % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4')
        }
        // the number of equal signs (place holders)
        // if there are two placeholders, than the two characters before it
        // represent one byte
        // if there is only one, then the three characters before it represent 2 bytes
        // this is just a cheap hack to not do indexOf twice
        var len = b64.length
        placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0
            // base64 is 4/3 + up to two characters of the original data
        arr = new Uint8Array(b64.length * 3 / 4 - placeHolders)
            // if there are placeholders, only get up to the last complete 4 chars
        l = placeHolders > 0 ? b64.length - 4 : b64.length
        var L = 0

        function push(v) {
            arr[L++] = v
        }
        for (i = 0, j = 0; i < l; i += 4, j += 3) {
            tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
            push((tmp & 0xFF0000) >> 16)
            push((tmp & 0xFF00) >> 8)
            push(tmp & 0xFF)
        }
        if (placeHolders === 2) {
            tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
            push(tmp & 0xFF)
        }
        else if (placeHolders === 1) {
            tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
            push((tmp >> 8) & 0xFF)
            push(tmp & 0xFF)
        }
        return arr
    }

    /***************************************************************/
    /* function : decode                                           */
    /* comment : Change the base64 encoded font's content to match */
    /*   the base64 index value.                                   */
    /***************************************************************/
    var decode = function(elt) {
        var code = elt.charCodeAt(0)
        if (code === PLUS || code === PLUS_URL_SAFE) return 62 // '+'
        if (code === SLASH || code === SLASH_URL_SAFE) return 63 // '/'
        if (code < NUMBER) return -1 //no match
        if (code < NUMBER + 10) return code - NUMBER + 26 + 26
        if (code < UPPER + 26) return code - UPPER
        if (code < LOWER + 26) return code - LOWER + 26
    }

    jsPDF.API.TTFFont = (function () {
        /************************************************************************/
        /* function : open                                                       */
        /* comment : Decode the encoded ttf content and create a TTFFont object. */
        /************************************************************************/
        TTFFont.open = function (filename, name, vfs, encoding) {
            var contents;
            contents = b64ToByteArray(vfs);
            return new TTFFont(contents, name, encoding);
        };
        /***************************************************************/
        /* function : TTFFont gernerator                               */
        /* comment : Decode TTF contents are parsed, Data,             */
        /* Subset object is created, and registerTTF function is called.*/
        /***************************************************************/
        function TTFFont(rawData, name, encoding) {
            var data, i, numFonts, offset, offsets, version, _i, _j, _len;
            this.rawData = rawData;
            data = this.contents = new Data(rawData);
            this.contents.pos = 4;
            if (data.readString(4) === 'ttcf') {
                if (!name) {
                    throw new Error("Must specify a font name for TTC files.");
                }
                offsets = [];
                throw new Error("Font " + name + " not found in TTC file.");
            }
            else {
                data.pos = 0;
                this.parse();
                this.subset = new Subset(this);
                this.registerTTF();
            }
        }
        /********************************************************/
        /* function : parse                                     */
        /* comment : TTF Parses the file contents by each table.*/
        /********************************************************/
        TTFFont.prototype.parse = function () {
            this.directory = new Directory(this.contents);
            this.head = new HeadTable(this);
            this.name = new NameTable(this);
            this.cmap = new CmapTable(this);
            this.hhea = new HheaTable(this);
            this.maxp = new MaxpTable(this);
            this.hmtx = new HmtxTable(this);
            this.post = new PostTable(this);
            this.os2 = new OS2Table(this);
            this.loca = new LocaTable(this);
            this.glyf = new GlyfTable(this);
            this.ascender = (this.os2.exists && this.os2.ascender) || this.hhea.ascender;
            this.decender = (this.os2.exists && this.os2.decender) || this.hhea.decender;
            this.lineGap = (this.os2.exists && this.os2.lineGap) || this.hhea.lineGap;
            return this.bbox = [this.head.xMin, this.head.yMin, this.head.xMax, this.head.yMax];
        };
        /***************************************************************/
        /* function : registerTTF                                      */
        /* comment : Get the value to assign pdf font descriptors.     */
        /***************************************************************/
        TTFFont.prototype.registerTTF = function () {
            var e, hi, low, raw, _ref;
            this.scaleFactor = 1000.0 / this.head.unitsPerEm;
            this.bbox = (function () {
                var _i, _len, _ref, _results;
                _ref = this.bbox;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    e = _ref[_i];
                    _results.push(Math.round(e * this.scaleFactor));
                }
                return _results;
            }).call(this);
            this.stemV = 0;
            if (this.post.exists) {
                raw = this.post.italic_angle;
                hi = raw >> 16;
                low = raw & 0xFF;
                if (hi & 0x8000 !== 0) {
                    hi = -((hi ^ 0xFFFF) + 1);
                }
                this.italicAngle = +("" + hi + "." + low);
            }
            else {
                this.italicAngle = 0;
            }
            this.ascender = Math.round(this.ascender * this.scaleFactor);
            this.decender = Math.round(this.decender * this.scaleFactor);
            this.lineGap = Math.round(this.lineGap * this.scaleFactor);
            this.capHeight = (this.os2.exists && this.os2.capHeight) || this.ascender;
            this.xHeight = (this.os2.exists && this.os2.xHeight) || 0;
            this.familyClass = (this.os2.exists && this.os2.familyClass || 0) >> 8;
            this.isSerif = (_ref = this.familyClass) === 1 || _ref === 2 || _ref === 3 || _ref === 4 || _ref === 5 || _ref === 7;
            this.isScript = this.familyClass === 10;
            this.flags = 0;
            if (this.post.isFixedPitch) {
                this.flags |= 1 << 0;
            }
            if (this.isSerif) {
                this.flags |= 1 << 1;
            }
            if (this.isScript) {
                this.flags |= 1 << 3;
            }
            if (this.italicAngle !== 0) {
                this.flags |= 1 << 6;
            }
            this.flags |= 1 << 5;
            if (!this.cmap.unicode) {
                throw new Error('No unicode cmap for font');
            }
        };
        TTFFont.prototype.characterToGlyph = function (character) {
            var _ref;
            return ((_ref = this.cmap.unicode) != null ? _ref.codeMap[character] : void 0) || 0;
        };
        TTFFont.prototype.widthOfGlyph = function (glyph) {
            var scale;
            scale = 1000.0 / this.head.unitsPerEm;
            return this.hmtx.forGlyph(glyph).advance * scale;
        };
        TTFFont.prototype.widthOfString = function (string, size, charSpace) {
            var charCode, i, scale, width, _i, _ref, charSpace;
            string = '' + string;
            width = 0;
            for (i = _i = 0, _ref = string.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                charCode = string.charCodeAt(i);
                width += (this.widthOfGlyph(this.characterToGlyph(charCode)) + charSpace * (1000/ size)) || 0;
            }
            scale = size / 1000;
            return width * scale;
        };
        TTFFont.prototype.lineHeight = function (size, includeGap) {
            var gap;
            if (includeGap == null) {
                includeGap = false;
            }
            gap = includeGap ? this.lineGap : 0;
            return (this.ascender + gap - this.decender) / 1000 * size;
        };
        return TTFFont;
    })();

    /************************************************************************************************/
    /* function : Data                                                                              */
    /* comment : The ttf data decoded and stored in an array is read and written to the Data object.*/
    /************************************************************************************************/
    var Data = (function () {
        function Data(data) {
            this.data = data != null ? data : [];
            this.pos = 0;
            this.length = this.data.length;
        }
        Data.prototype.readByte = function () {
            return this.data[this.pos++];
        };
        Data.prototype.writeByte = function (byte) {
            return this.data[this.pos++] = byte;
        };
        Data.prototype.readUInt32 = function () {
            var b1, b2, b3, b4;
            b1 = this.readByte() * 0x1000000;
            b2 = this.readByte() << 16;
            b3 = this.readByte() << 8;
            b4 = this.readByte();
            return b1 + b2 + b3 + b4;
        };
        Data.prototype.writeUInt32 = function (val) {
            this.writeByte((val >>> 24) & 0xff);
            this.writeByte((val >> 16) & 0xff);
            this.writeByte((val >> 8) & 0xff);
            return this.writeByte(val & 0xff);
        };
        Data.prototype.readInt32 = function () {
            var int;
            int = this.readUInt32();
            if (int >= 0x80000000) {
                return int - 0x100000000;
            }
            else {
                return int;
            }
        };
        Data.prototype.writeInt32 = function (val) {
            if (val < 0) {
                val += 0x100000000;
            }
            return this.writeUInt32(val);
        };
        Data.prototype.readUInt16 = function () {
            var b1, b2;
            b1 = this.readByte() << 8;
            b2 = this.readByte();
            return b1 | b2;
        };
        Data.prototype.writeUInt16 = function (val) {
            this.writeByte((val >> 8) & 0xff);
            return this.writeByte(val & 0xff);
        };
        Data.prototype.readInt16 = function () {
            var int;
            int = this.readUInt16();
            if (int >= 0x8000) {
                return int - 0x10000;
            }
            else {
                return int;
            }
        };
        Data.prototype.writeInt16 = function (val) {
            if (val < 0) {
                val += 0x10000;
            }
            return this.writeUInt16(val);
        };
        Data.prototype.readString = function (length) {
            var i, ret, _i;
            ret = [];
            for (i = _i = 0; 0 <= length ? _i < length : _i > length; i = 0 <= length ? ++_i : --_i) {
                ret[i] = String.fromCharCode(this.readByte());
            }
            return ret.join('');
        };
        Data.prototype.writeString = function (val) {
            var i, _i, _ref, _results;
            _results = [];
            for (i = _i = 0, _ref = val.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                _results.push(this.writeByte(val.charCodeAt(i)));
            }
            return _results;
        };
        /*Data.prototype.stringAt = function (pos, length) {
            this.pos = pos;
            return this.readString(length);
        };*/
        Data.prototype.readShort = function () {
            return this.readInt16();
        };
        Data.prototype.writeShort = function (val) {
            return this.writeInt16(val);
        };
        Data.prototype.readLongLong = function () {
            var b1, b2, b3, b4, b5, b6, b7, b8;
            b1 = this.readByte();
            b2 = this.readByte();
            b3 = this.readByte();
            b4 = this.readByte();
            b5 = this.readByte();
            b6 = this.readByte();
            b7 = this.readByte();
            b8 = this.readByte();
            if (b1 & 0x80) {
                return ((b1 ^ 0xff) * 0x100000000000000 + (b2 ^ 0xff) * 0x1000000000000 + (b3 ^ 0xff) * 0x10000000000 + (b4 ^ 0xff) * 0x100000000 + (b5 ^ 0xff) * 0x1000000 + (b6 ^ 0xff) * 0x10000 + (b7 ^ 0xff) * 0x100 + (b8 ^ 0xff) + 1) * -1;
            }
            return b1 * 0x100000000000000 + b2 * 0x1000000000000 + b3 * 0x10000000000 + b4 * 0x100000000 + b5 * 0x1000000 + b6 * 0x10000 + b7 * 0x100 + b8;
        };
        /*Data.prototype.writeLongLong = function (val) {
            var high, low;
            high = Math.floor(val / 0x100000000);
            low = val & 0xffffffff;
            this.writeByte((high >> 24) & 0xff);
            this.writeByte((high >> 16) & 0xff);
            this.writeByte((high >> 8) & 0xff);
            this.writeByte(high & 0xff);
            this.writeByte((low >> 24) & 0xff);
            this.writeByte((low >> 16) & 0xff);
            this.writeByte((low >> 8) & 0xff);
            return this.writeByte(low & 0xff);
        };*/
        Data.prototype.readInt = function () {
            return this.readInt32();
        };
        Data.prototype.writeInt = function (val) {
            return this.writeInt32(val);
        };
        /*Data.prototype.slice = function (start, end) {
            return this.data.slice(start, end);
        };*/
        Data.prototype.read = function (bytes) {
            var buf, i, _i;
            buf = [];
            for (i = _i = 0; 0 <= bytes ? _i < bytes : _i > bytes; i = 0 <= bytes ? ++_i : --_i) {
                buf.push(this.readByte());
            }
            return buf;
        };
        Data.prototype.write = function (bytes) {
            var byte, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = bytes.length; _i < _len; _i++) {
                byte = bytes[_i];
                _results.push(this.writeByte(byte));
            }
            return _results;
        };
        return Data;
    })();

    var Directory = (function () {
        var checksum;

        /*****************************************************************************************************/
        /* function : Directory generator                                                                    */
        /* comment : Initialize the offset, tag, length, and checksum for each table for the font to be used.*/
        /*****************************************************************************************************/
        function Directory(data) {
            var entry, i, _i, _ref;
            this.scalarType = data.readInt();
            this.tableCount = data.readShort();
            this.searchRange = data.readShort();
            this.entrySelector = data.readShort();
            this.rangeShift = data.readShort();
            this.tables = {};
            for (i = _i = 0, _ref = this.tableCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                entry = {
                    tag: data.readString(4)
                    , checksum: data.readInt()
                    , offset: data.readInt()
                    , length: data.readInt()
                };
                this.tables[entry.tag] = entry;
            }
        }
        /********************************************************************************************************/
        /* function : encode                                                                                    */
        /* comment : It encodes and stores the font table object and information used for the directory object. */
        /********************************************************************************************************/
        Directory.prototype.encode = function (tables) {
            var adjustment, directory, directoryLength, entrySelector, headOffset, log2, offset, rangeShift, searchRange, sum, table, tableCount, tableData, tag;
            tableCount = Object.keys(tables).length;
            log2 = Math.log(2);
            searchRange = Math.floor(Math.log(tableCount) / log2) * 16;
            entrySelector = Math.floor(searchRange / log2);
            rangeShift = tableCount * 16 - searchRange;
            directory = new Data;
            directory.writeInt(this.scalarType);
            directory.writeShort(tableCount);
            directory.writeShort(searchRange);
            directory.writeShort(entrySelector);
            directory.writeShort(rangeShift);
            directoryLength = tableCount * 16;
            offset = directory.pos + directoryLength;
            headOffset = null;
            tableData = [];
            for (tag in tables) {
                table = tables[tag];
                directory.writeString(tag);
                directory.writeInt(checksum(table));
                directory.writeInt(offset);
                directory.writeInt(table.length);
                tableData = tableData.concat(table);
                if (tag === 'head') {
                    headOffset = offset;
                }
                offset += table.length;
                while (offset % 4) {
                    tableData.push(0);
                    offset++;
                }
            }
            directory.write(tableData);
            sum = checksum(directory.data);
            adjustment = 0xB1B0AFBA - sum;
            directory.pos = headOffset + 8;
            directory.writeUInt32(adjustment);
            return directory.data;
        };
        /***************************************************************/
        /* function : checksum                                         */
        /* comment : Duplicate the table for the tag.                  */
        /***************************************************************/
        checksum = function (data) {
            var i, sum, tmp, _i, _ref;
            data = __slice.call(data);
            while (data.length % 4) {
                data.push(0);
            }
            tmp = new Data(data);
            sum = 0;
            for (i = _i = 0, _ref = data.length; _i < _ref; i = _i += 4) {
                sum += tmp.readUInt32();
            }
            return sum & 0xFFFFFFFF;
        };
        return Directory;
    })();

    var Table, __hasProp = {}.hasOwnProperty
        , __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key)) child[key] = parent[key];
            }

            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
    };;

    /***************************************************************/
    /* function : Table                                            */
    /* comment : Save info for each table, and parse the table.    */
    /***************************************************************/
    Table = (function () {
        function Table(file) {
            var info;
            this.file = file;
            info = this.file.directory.tables[this.tag];
            this.exists = !!info;
            if (info) {
                this.offset = info.offset, this.length = info.length;
                this.parse(this.file.contents);
            }
        }
        Table.prototype.parse = function () {};
        Table.prototype.encode = function () {};
        Table.prototype.raw = function () {
            if (!this.exists) {
                return null;
            }
            this.file.contents.pos = this.offset;
            return this.file.contents.read(this.length);
        };
        return Table;
    })();

    var HeadTable = (function (_super) {
        __extends(HeadTable, _super);

        function HeadTable() {
            return HeadTable.__super__.constructor.apply(this, arguments);
        }
        HeadTable.prototype.tag = 'head';
        HeadTable.prototype.parse = function (data) {
            data.pos = this.offset;
            this.version = data.readInt();
            this.revision = data.readInt();
            this.checkSumAdjustment = data.readInt();
            this.magicNumber = data.readInt();
            this.flags = data.readShort();
            this.unitsPerEm = data.readShort();
            this.created = data.readLongLong();
            this.modified = data.readLongLong();
            this.xMin = data.readShort();
            this.yMin = data.readShort();
            this.xMax = data.readShort();
            this.yMax = data.readShort();
            this.macStyle = data.readShort();
            this.lowestRecPPEM = data.readShort();
            this.fontDirectionHint = data.readShort();
            this.indexToLocFormat = data.readShort();
            return this.glyphDataFormat = data.readShort();
        };
        /*HeadTable.prototype.encode = function (loca) {
            var table;
            table = new Data;
            table.writeInt(this.version);
            table.writeInt(this.revision);
            table.writeInt(this.checkSumAdjustment);
            table.writeInt(this.magicNumber);
            table.writeShort(this.flags);
            table.writeShort(this.unitsPerEm);
            table.writeLongLong(this.created);
            table.writeLongLong(this.modified);
            table.writeShort(this.xMin);
            table.writeShort(this.yMin);
            table.writeShort(this.xMax);
            table.writeShort(this.yMax);
            table.writeShort(this.macStyle);
            table.writeShort(this.lowestRecPPEM);
            table.writeShort(this.fontDirectionHint);
            table.writeShort(loca.type);
            table.writeShort(this.glyphDataFormat);
            return table.data;
        };*/
        return HeadTable;
    })(Table);

    /************************************************************************************/
    /* function : CmapEntry                                                             */
    /* comment : Cmap Initializes and encodes object information (required by pdf spec).*/
    /************************************************************************************/
    var CmapEntry = (function () {
        function CmapEntry(data, offset) {
            var code, count, endCode, glyphId, glyphIds, i, idDelta, idRangeOffset, index, saveOffset, segCount, segCountX2, start, startCode, tail, _i, _j, _k, _len;
            this.platformID = data.readUInt16();
            this.encodingID = data.readShort();
            this.offset = offset + data.readInt();
            saveOffset = data.pos;
            data.pos = this.offset;
            this.format = data.readUInt16();
            this.length = data.readUInt16();
            this.language = data.readUInt16();
            this.isUnicode = (this.platformID === 3 && this.encodingID === 1 && this.format === 4) || this.platformID === 0 && this.format === 4;
            this.codeMap = {};
            switch (this.format) {
            case 0:
                for (i = _i = 0; _i < 256; i = ++_i) {
                    this.codeMap[i] = data.readByte();
                }
                break;
            case 4:
                segCountX2 = data.readUInt16();
                segCount = segCountX2 / 2;
                data.pos += 6;
                endCode = (function () {
                    var _j, _results;
                    _results = [];
                    for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
                        _results.push(data.readUInt16());
                    }
                    return _results;
                })();
                data.pos += 2;
                startCode = (function () {
                    var _j, _results;
                    _results = [];
                    for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
                        _results.push(data.readUInt16());
                    }
                    return _results;
                })();
                idDelta = (function () {
                    var _j, _results;
                    _results = [];
                    for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
                        _results.push(data.readUInt16());
                    }
                    return _results;
                })();
                idRangeOffset = (function () {
                    var _j, _results;
                    _results = [];
                    for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
                        _results.push(data.readUInt16());
                    }
                    return _results;
                })();
                count = (this.length - data.pos + this.offset) / 2;
                glyphIds = (function () {
                    var _j, _results;
                    _results = [];
                    for (i = _j = 0; 0 <= count ? _j < count : _j > count; i = 0 <= count ? ++_j : --_j) {
                        _results.push(data.readUInt16());
                    }
                    return _results;
                })();
                for (i = _j = 0, _len = endCode.length; _j < _len; i = ++_j) {
                    tail = endCode[i];
                    start = startCode[i];
                    for (code = _k = start; start <= tail ? _k <= tail : _k >= tail; code = start <= tail ? ++_k : --_k) {
                        if (idRangeOffset[i] === 0) {
                            glyphId = code + idDelta[i];
                        }
                        else {
                            index = idRangeOffset[i] / 2 + (code - start) - (segCount - i);
                            glyphId = glyphIds[index] || 0;
                            if (glyphId !== 0) {
                                glyphId += idDelta[i];
                            }
                        }
                        this.codeMap[code] = glyphId & 0xFFFF;
                    }
                }
            }
            data.pos = saveOffset;
        }
        CmapEntry.encode = function (charmap, encoding) {
            var charMap, code, codeMap, codes, delta, deltas, diff, endCode, endCodes, entrySelector, glyphIDs, i, id, indexes, last, map, nextID, offset, old, rangeOffsets, rangeShift, result, searchRange, segCount, segCountX2, startCode, startCodes, startGlyph, subtable, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _m, _n, _name, _o, _p, _q;
            subtable = new Data;
            codes = Object.keys(charmap).sort(function (a, b) {
                return a - b;
            });
            switch (encoding) {
            case 'macroman':
                id = 0;
                indexes = (function () {
                    var _i, _results;
                    _results = [];
                    for (i = _i = 0; _i < 256; i = ++_i) {
                        _results.push(0);
                    }
                    return _results;
                })();
                map = {
                    0: 0
                };
                codeMap = {};
                for (_i = 0, _len = codes.length; _i < _len; _i++) {
                    code = codes[_i];
                    if (map[_name = charmap[code]] == null) {
                        map[_name] = ++id;
                    }
                    codeMap[code] = {
                        old: charmap[code]
                        , "new": map[charmap[code]]
                    };
                    indexes[code] = map[charmap[code]];
                }
                subtable.writeUInt16(1);
                subtable.writeUInt16(0);
                subtable.writeUInt32(12);
                subtable.writeUInt16(0);
                subtable.writeUInt16(262);
                subtable.writeUInt16(0);
                subtable.write(indexes);
                return result = {
                    charMap: codeMap
                    , subtable: subtable.data
                    , maxGlyphID: id + 1
                };
            case 'unicode':
                startCodes = [];
                endCodes = [];
                nextID = 0;
                map = {};
                charMap = {};
                last = diff = null;
                for (_j = 0, _len1 = codes.length; _j < _len1; _j++) {
                    code = codes[_j];
                    old = charmap[code];
                    if (map[old] == null) {
                        map[old] = ++nextID;
                    }
                    charMap[code] = {
                        old: old
                        , "new": map[old]
                    };
                    delta = map[old] - code;
                    if ((last == null) || delta !== diff) {
                        if (last) {
                            endCodes.push(last);
                        }
                        startCodes.push(code);
                        diff = delta;
                    }
                    last = code;
                }
                if (last) {
                    endCodes.push(last);
                }
                endCodes.push(0xFFFF);
                startCodes.push(0xFFFF);
                segCount = startCodes.length;
                segCountX2 = segCount * 2;
                searchRange = 2 * Math.pow(Math.log(segCount) / Math.LN2, 2);
                entrySelector = Math.log(searchRange / 2) / Math.LN2;
                rangeShift = 2 * segCount - searchRange;
                deltas = [];
                rangeOffsets = [];
                glyphIDs = [];
                for (i = _k = 0, _len2 = startCodes.length; _k < _len2; i = ++_k) {
                    startCode = startCodes[i];
                    endCode = endCodes[i];
                    if (startCode === 0xFFFF) {
                        deltas.push(0);
                        rangeOffsets.push(0);
                        break;
                    }
                    startGlyph = charMap[startCode]["new"];
                    if (startCode - startGlyph >= 0x8000) {
                        deltas.push(0);
                        rangeOffsets.push(2 * (glyphIDs.length + segCount - i));
                        for (code = _l = startCode; startCode <= endCode ? _l <= endCode : _l >= endCode; code = startCode <= endCode ? ++_l : --_l) {
                            glyphIDs.push(charMap[code]["new"]);
                        }
                    }
                    else {
                        deltas.push(startGlyph - startCode);
                        rangeOffsets.push(0);
                    }
                }
                subtable.writeUInt16(3);
                subtable.writeUInt16(1);
                subtable.writeUInt32(12);
                subtable.writeUInt16(4);
                subtable.writeUInt16(16 + segCount * 8 + glyphIDs.length * 2);
                subtable.writeUInt16(0);
                subtable.writeUInt16(segCountX2);
                subtable.writeUInt16(searchRange);
                subtable.writeUInt16(entrySelector);
                subtable.writeUInt16(rangeShift);
                for (_m = 0, _len3 = endCodes.length; _m < _len3; _m++) {
                    code = endCodes[_m];
                    subtable.writeUInt16(code);
                }
                subtable.writeUInt16(0);
                for (_n = 0, _len4 = startCodes.length; _n < _len4; _n++) {
                    code = startCodes[_n];
                    subtable.writeUInt16(code);
                }
                for (_o = 0, _len5 = deltas.length; _o < _len5; _o++) {
                    delta = deltas[_o];
                    subtable.writeUInt16(delta);
                }
                for (_p = 0, _len6 = rangeOffsets.length; _p < _len6; _p++) {
                    offset = rangeOffsets[_p];
                    subtable.writeUInt16(offset);
                }
                for (_q = 0, _len7 = glyphIDs.length; _q < _len7; _q++) {
                    id = glyphIDs[_q];
                    subtable.writeUInt16(id);
                }
                return result = {
                    charMap: charMap
                    , subtable: subtable.data
                    , maxGlyphID: nextID + 1
                };
            }
        };
        return CmapEntry;
    })();

    var CmapTable = (function (_super) {
        __extends(CmapTable, _super);

        function CmapTable() {
            return CmapTable.__super__.constructor.apply(this, arguments);
        }
        CmapTable.prototype.tag = 'cmap';
        CmapTable.prototype.parse = function (data) {
            var entry, i, tableCount, _i;
            data.pos = this.offset;
            this.version = data.readUInt16();
            tableCount = data.readUInt16();
            this.tables = [];
            this.unicode = null;
            for (i = _i = 0; 0 <= tableCount ? _i < tableCount : _i > tableCount; i = 0 <= tableCount ? ++_i : --_i) {
                entry = new CmapEntry(data, this.offset);
                this.tables.push(entry);
                if (entry.isUnicode) {
                    if (this.unicode == null) {
                        this.unicode = entry;
                    }
                }
            }
            return true;
        };
        /*************************************************************************/
        /* function : encode                                                     */
        /* comment : Encode the cmap table corresponding to the input character. */
        /*************************************************************************/
        CmapTable.encode = function (charmap, encoding) {
            var result, table;
            if (encoding == null) {
                encoding = 'macroman';
            }
            result = CmapEntry.encode(charmap, encoding);
            table = new Data;
            table.writeUInt16(0);
            table.writeUInt16(1);
            result.table = table.data.concat(result.subtable);
            return result;
        };
        return CmapTable;
    })(Table);

    var HheaTable = (function (_super) {
        __extends(HheaTable, _super);

        function HheaTable() {
            return HheaTable.__super__.constructor.apply(this, arguments);
        }
        HheaTable.prototype.tag = 'hhea';
        HheaTable.prototype.parse = function (data) {
            data.pos = this.offset;
            this.version = data.readInt();
            this.ascender = data.readShort();
            this.decender = data.readShort();
            this.lineGap = data.readShort();
            this.advanceWidthMax = data.readShort();
            this.minLeftSideBearing = data.readShort();
            this.minRightSideBearing = data.readShort();
            this.xMaxExtent = data.readShort();
            this.caretSlopeRise = data.readShort();
            this.caretSlopeRun = data.readShort();
            this.caretOffset = data.readShort();
            data.pos += 4 * 2;
            this.metricDataFormat = data.readShort();
            return this.numberOfMetrics = data.readUInt16();
        };
        /*HheaTable.prototype.encode = function (ids) {
            var i, table, _i, _ref;
            table = new Data;
            table.writeInt(this.version);
            table.writeShort(this.ascender);
            table.writeShort(this.decender);
            table.writeShort(this.lineGap);
            table.writeShort(this.advanceWidthMax);
            table.writeShort(this.minLeftSideBearing);
            table.writeShort(this.minRightSideBearing);
            table.writeShort(this.xMaxExtent);
            table.writeShort(this.caretSlopeRise);
            table.writeShort(this.caretSlopeRun);
            table.writeShort(this.caretOffset);
            for (i = _i = 0, _ref = 4 * 2; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                table.writeByte(0);
            }
            table.writeShort(this.metricDataFormat);
            table.writeUInt16(ids.length);
            return table.data;
        };*/
        return HheaTable;
    })(Table);

    var OS2Table = (function (_super) {
        __extends(OS2Table, _super);

        function OS2Table() {
            return OS2Table.__super__.constructor.apply(this, arguments);
        }
        OS2Table.prototype.tag = 'OS/2';
        OS2Table.prototype.parse = function (data) {
            var i;
            data.pos = this.offset;
            this.version = data.readUInt16();
            this.averageCharWidth = data.readShort();
            this.weightClass = data.readUInt16();
            this.widthClass = data.readUInt16();
            this.type = data.readShort();
            this.ySubscriptXSize = data.readShort();
            this.ySubscriptYSize = data.readShort();
            this.ySubscriptXOffset = data.readShort();
            this.ySubscriptYOffset = data.readShort();
            this.ySuperscriptXSize = data.readShort();
            this.ySuperscriptYSize = data.readShort();
            this.ySuperscriptXOffset = data.readShort();
            this.ySuperscriptYOffset = data.readShort();
            this.yStrikeoutSize = data.readShort();
            this.yStrikeoutPosition = data.readShort();
            this.familyClass = data.readShort();
            this.panose = (function () {
                var _i, _results;
                _results = [];
                for (i = _i = 0; _i < 10; i = ++_i) {
                    _results.push(data.readByte());
                }
                return _results;
            })();
            this.charRange = (function () {
                var _i, _results;
                _results = [];
                for (i = _i = 0; _i < 4; i = ++_i) {
                    _results.push(data.readInt());
                }
                return _results;
            })();
            this.vendorID = data.readString(4);
            this.selection = data.readShort();
            this.firstCharIndex = data.readShort();
            this.lastCharIndex = data.readShort();
            if (this.version > 0) {
                this.ascent = data.readShort();
                this.descent = data.readShort();
                this.lineGap = data.readShort();
                this.winAscent = data.readShort();
                this.winDescent = data.readShort();
                this.codePageRange = (function () {
                    var _i, _results;
                    _results = [];
                    for (i = _i = 0; _i < 2; i = ++_i) {
                        _results.push(data.readInt());
                    }
                    return _results;
                })();
                if (this.version > 1) {
                    this.xHeight = data.readShort();
                    this.capHeight = data.readShort();
                    this.defaultChar = data.readShort();
                    this.breakChar = data.readShort();
                    return this.maxContext = data.readShort();
                }
            }
        };
        /*OS2Table.prototype.encode = function () {
            return this.raw();
        };*/
        return OS2Table;
    })(Table);

    var PostTable = (function (_super) {
        var POSTSCRIPT_GLYPHS;
        __extends(PostTable, _super);

        function PostTable() {
            return PostTable.__super__.constructor.apply(this, arguments);
        }
        PostTable.prototype.tag = 'post';
        PostTable.prototype.parse = function (data) {
            var i, length, numberOfGlyphs, _i, _results;
            data.pos = this.offset;
            this.format = data.readInt();
            this.italicAngle = data.readInt();
            this.underlinePosition = data.readShort();
            this.underlineThickness = data.readShort();
            this.isFixedPitch = data.readInt();
            this.minMemType42 = data.readInt();
            this.maxMemType42 = data.readInt();
            this.minMemType1 = data.readInt();
            this.maxMemType1 = data.readInt();
            switch (this.format) {
            case 0x00010000:
                break;
            case 0x00020000:
                numberOfGlyphs = data.readUInt16();
                this.glyphNameIndex = [];
                for (i = _i = 0; 0 <= numberOfGlyphs ? _i < numberOfGlyphs : _i > numberOfGlyphs; i = 0 <= numberOfGlyphs ? ++_i : --_i) {
                    this.glyphNameIndex.push(data.readUInt16());
                }
                this.names = [];
                _results = [];
                while (data.pos < this.offset + this.length) {
                    length = data.readByte();
                    _results.push(this.names.push(data.readString(length)));
                }
                return _results;
                break;
            case 0x00025000:
                numberOfGlyphs = data.readUInt16();
                return this.offsets = data.read(numberOfGlyphs);
            case 0x00030000:
                break;
            case 0x00040000:
                return this.map = (function () {
                    var _j, _ref, _results1;
                    _results1 = [];
                    for (i = _j = 0, _ref = this.file.maxp.numGlyphs; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
                        _results1.push(data.readUInt32());
                    }
                    return _results1;
                }).call(this);
            }
        };
        /*PostTable.prototype.glyphFor = function (code) {
            var index;
            switch (this.format) {
            case 0x00010000:
                return POSTSCRIPT_GLYPHS[code] || '.notdef';
            case 0x00020000:
                index = this.glyphNameIndex[code];
                if (index <= 257) {
                    return POSTSCRIPT_GLYPHS[index];
                }
                else {
                    return this.names[index - 258] || '.notdef';
                }
                break;
            case 0x00025000:
                return POSTSCRIPT_GLYPHS[code + this.offsets[code]] || '.notdef';
            case 0x00030000:
                return '.notdef';
            case 0x00040000:
                return this.map[code] || 0xFFFF;
            }
        };*/
        /*PostTable.prototype.encode = function (mapping) {
            var id, index, indexes, position, post, raw, string, strings, table, _i, _j, _k, _len, _len1, _len2;
            if (!this.exists) {
                return null;
            }
            raw = this.raw();
            if (this.format === 0x00030000) {
                return raw;
            }
            table = new Data(raw.slice(0, 32));
            table.writeUInt32(0x00020000);
            table.pos = 32;
            indexes = [];
            strings = [];
            for (_i = 0, _len = mapping.length; _i < _len; _i++) {
                id = mapping[_i];
                post = this.glyphFor(id);
                position = POSTSCRIPT_GLYPHS.indexOf(post);
                if (position !== -1) {
                    indexes.push(position);
                }
                else {
                    indexes.push(257 + strings.length);
                    strings.push(post);
                }
            }
            table.writeUInt16(Object.keys(mapping).length);
            for (_j = 0, _len1 = indexes.length; _j < _len1; _j++) {
                index = indexes[_j];
                table.writeUInt16(index);
            }
            for (_k = 0, _len2 = strings.length; _k < _len2; _k++) {
                string = strings[_k];
                table.writeByte(string.length);
                table.writeString(string);
            }
            return table.data;
        };*/
        POSTSCRIPT_GLYPHS = '.notdef .null nonmarkingreturn space exclam quotedbl numbersign dollar percent\nampersand quotesingle parenleft parenright asterisk plus comma hyphen period slash\nzero one two three four five six seven eight nine colon semicolon less equal greater\nquestion at A B C D E F G H I J K L M N O P Q R S T U V W X Y Z\nbracketleft backslash bracketright asciicircum underscore grave\na b c d e f g h i j k l m n o p q r s t u v w x y z\nbraceleft bar braceright asciitilde Adieresis Aring Ccedilla Eacute Ntilde Odieresis\nUdieresis aacute agrave acircumflex adieresis atilde aring ccedilla eacute egrave\necircumflex edieresis iacute igrave icircumflex idieresis ntilde oacute ograve\nocircumflex odieresis otilde uacute ugrave ucircumflex udieresis dagger degree cent\nsterling section bullet paragraph germandbls registered copyright trademark acute\ndieresis notequal AE Oslash infinity plusminus lessequal greaterequal yen mu\npartialdiff summation product pi integral ordfeminine ordmasculine Omega ae oslash\nquestiondown exclamdown logicalnot radical florin approxequal Delta guillemotleft\nguillemotright ellipsis nonbreakingspace Agrave Atilde Otilde OE oe endash emdash\nquotedblleft quotedblright quoteleft quoteright divide lozenge ydieresis Ydieresis\nfraction currency guilsinglleft guilsinglright fi fl daggerdbl periodcentered\nquotesinglbase quotedblbase perthousand Acircumflex Ecircumflex Aacute Edieresis\nEgrave Iacute Icircumflex Idieresis Igrave Oacute Ocircumflex apple Ograve Uacute\nUcircumflex Ugrave dotlessi circumflex tilde macron breve dotaccent ring cedilla\nhungarumlaut ogonek caron Lslash lslash Scaron scaron Zcaron zcaron brokenbar Eth\neth Yacute yacute Thorn thorn minus multiply onesuperior twosuperior threesuperior\nonehalf onequarter threequarters franc Gbreve gbreve Idotaccent Scedilla scedilla\nCacute cacute Ccaron ccaron dcroat'.split(/\s+/g);
        return PostTable;
    })(Table);

    /*********************************************************************************************************/
    /* function : NameEntry                                                                                  */
    /* comment : Store copyright information, platformID, encodingID, and languageID in the NameEntry object.*/
    /*********************************************************************************************************/
    var NameEntry = (function () {
        function NameEntry(raw, entry) {
            this.raw = raw;
            this.length = raw.length;
            this.platformID = entry.platformID;
            this.encodingID = entry.encodingID;
            this.languageID = entry.languageID;
        }
        return NameEntry;
    })();

    var NameTable = (function (_super) {
        var subsetTag;
        __extends(NameTable, _super);

        function NameTable() {
            return NameTable.__super__.constructor.apply(this, arguments);
        }
        NameTable.prototype.tag = 'name';
        NameTable.prototype.parse = function (data) {
            var count, entries, entry, format, i, name, stringOffset, strings, text, _i, _j, _len, _name;
            data.pos = this.offset;
            format = data.readShort();
            count = data.readShort();
            stringOffset = data.readShort();
            entries = [];
            for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
                entries.push({
                    platformID: data.readShort()
                    , encodingID: data.readShort()
                    , languageID: data.readShort()
                    , nameID: data.readShort()
                    , length: data.readShort()
                    , offset: this.offset + stringOffset + data.readShort()
                });
            }
            strings = {};
            for (i = _j = 0, _len = entries.length; _j < _len; i = ++_j) {
                entry = entries[i];
                data.pos = entry.offset;
                text = data.readString(entry.length);
                name = new NameEntry(text, entry);
                if (strings[_name = entry.nameID] == null) {
                    strings[_name] = [];
                }
                strings[entry.nameID].push(name);
            }
            this.strings = strings;
            this.copyright = strings[0];
            this.fontFamily = strings[1];
            this.fontSubfamily = strings[2];
            this.uniqueSubfamily = strings[3];
            this.fontName = strings[4];
            this.version = strings[5];
            this.postscriptName = strings[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g, "");
            this.trademark = strings[7];
            this.manufacturer = strings[8];
            this.designer = strings[9];
            this.description = strings[10];
            this.vendorUrl = strings[11];
            this.designerUrl = strings[12];
            this.license = strings[13];
            this.licenseUrl = strings[14];
            this.preferredFamily = strings[15];
            this.preferredSubfamily = strings[17];
            this.compatibleFull = strings[18];
            return this.sampleText = strings[19];
        };
        subsetTag = "AAAAAA";
        /*NameTable.prototype.encode = function () {
            var id, list, nameID, nameTable, postscriptName, strCount, strTable, string, strings, table, val, _i, _len, _ref;
            strings = {};
            _ref = this.strings;
            for (id in _ref) {
                val = _ref[id];
                strings[id] = val;
            }
            postscriptName = new NameEntry("" + subsetTag + "+" + this.postscriptName, {
                platformID: 1
                , encodingID: 0
                , languageID: 0
            });
            strings[6] = [postscriptName];
            subsetTag = successorOf(subsetTag);
            strCount = 0;
            for (id in strings) {
                list = strings[id];
                if (list != null) {
                    strCount += list.length;
                }
            }
            table = new Data;
            strTable = new Data;
            table.writeShort(0);
            table.writeShort(strCount);
            table.writeShort(6 + 12 * strCount);
            for (nameID in strings) {
                list = strings[nameID];
                if (list != null) {
                    for (_i = 0, _len = list.length; _i < _len; _i++) {
                        string = list[_i];
                        table.writeShort(string.platformID);
                        table.writeShort(string.encodingID);
                        table.writeShort(string.languageID);
                        table.writeShort(nameID);
                        table.writeShort(string.length);
                        table.writeShort(strTable.pos);
                        strTable.writeString(string.raw);
                    }
                }
            }
            return nameTable = {
                postscriptName: postscriptName.raw
                , table: table.data.concat(strTable.data)
            };
        };*/
        return NameTable;
    })(Table);

    var MaxpTable = (function (_super) {
        __extends(MaxpTable, _super);

        function MaxpTable() {
            return MaxpTable.__super__.constructor.apply(this, arguments);
        }
        MaxpTable.prototype.tag = 'maxp';
        MaxpTable.prototype.parse = function (data) {
            data.pos = this.offset;
            this.version = data.readInt();
            this.numGlyphs = data.readUInt16();
            this.maxPoints = data.readUInt16();
            this.maxContours = data.readUInt16();
            this.maxCompositePoints = data.readUInt16();
            this.maxComponentContours = data.readUInt16();
            this.maxZones = data.readUInt16();
            this.maxTwilightPoints = data.readUInt16();
            this.maxStorage = data.readUInt16();
            this.maxFunctionDefs = data.readUInt16();
            this.maxInstructionDefs = data.readUInt16();
            this.maxStackElements = data.readUInt16();
            this.maxSizeOfInstructions = data.readUInt16();
            this.maxComponentElements = data.readUInt16();
            return this.maxComponentDepth = data.readUInt16();
        };
        /*MaxpTable.prototype.encode = function (ids) {
            var table;
            table = new Data;
            table.writeInt(this.version);
            table.writeUInt16(ids.length);
            table.writeUInt16(this.maxPoints);
            table.writeUInt16(this.maxContours);
            table.writeUInt16(this.maxCompositePoints);
            table.writeUInt16(this.maxComponentContours);
            table.writeUInt16(this.maxZones);
            table.writeUInt16(this.maxTwilightPoints);
            table.writeUInt16(this.maxStorage);
            table.writeUInt16(this.maxFunctionDefs);
            table.writeUInt16(this.maxInstructionDefs);
            table.writeUInt16(this.maxStackElements);
            table.writeUInt16(this.maxSizeOfInstructions);
            table.writeUInt16(this.maxComponentElements);
            table.writeUInt16(this.maxComponentDepth);
            return table.data;
        };*/
        return MaxpTable;
    })(Table);

    var HmtxTable = (function (_super) {
        __extends(HmtxTable, _super);

        function HmtxTable() {
            return HmtxTable.__super__.constructor.apply(this, arguments);
        }
        HmtxTable.prototype.tag = 'hmtx';
        HmtxTable.prototype.parse = function (data) {
            var i, last, lsbCount, m, _i, _j, _ref, _results;
            data.pos = this.offset;
            this.metrics = [];
            for (i = _i = 0, _ref = this.file.hhea.numberOfMetrics; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                this.metrics.push({
                    advance: data.readUInt16()
                    , lsb: data.readInt16()
                });
            }
            lsbCount = this.file.maxp.numGlyphs - this.file.hhea.numberOfMetrics;
            this.leftSideBearings = (function () {
                var _j, _results;
                _results = [];
                for (i = _j = 0; 0 <= lsbCount ? _j < lsbCount : _j > lsbCount; i = 0 <= lsbCount ? ++_j : --_j) {
                    _results.push(data.readInt16());
                }
                return _results;
            })();
            this.widths = (function () {
                var _j, _len, _ref1, _results;
                _ref1 = this.metrics;
                _results = [];
                for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
                    m = _ref1[_j];
                    _results.push(m.advance);
                }
                return _results;
            }).call(this);
            last = this.widths[this.widths.length - 1];
            _results = [];
            for (i = _j = 0; 0 <= lsbCount ? _j < lsbCount : _j > lsbCount; i = 0 <= lsbCount ? ++_j : --_j) {
                _results.push(this.widths.push(last));
            }
            return _results;
        };
        /***************************************************************/
        /* function : forGlyph                                         */
        /* comment : Returns the advance width and lsb for this glyph. */
        /***************************************************************/
        HmtxTable.prototype.forGlyph = function (id) {
            var metrics;
            if (id in this.metrics) {
                return this.metrics[id];
            }
            return metrics = {
                advance: this.metrics[this.metrics.length - 1].advance
                , lsb: this.leftSideBearings[id - this.metrics.length]
            };
        };
        /*HmtxTable.prototype.encode = function (mapping) {
            var id, metric, table, _i, _len;
            table = new Data;
            for (_i = 0, _len = mapping.length; _i < _len; _i++) {
                id = mapping[_i];
                metric = this.forGlyph(id);
                table.writeUInt16(metric.advance);
                table.writeUInt16(metric.lsb);
            }
            return table.data;
        };*/
        return HmtxTable;
    })(Table);

    var __slice = [].slice;

    var GlyfTable = (function (_super) {
        __extends(GlyfTable, _super);

        function GlyfTable() {
            return GlyfTable.__super__.constructor.apply(this, arguments);
        }
        GlyfTable.prototype.tag = 'glyf';
        GlyfTable.prototype.parse = function (data) {
            return this.cache = {};
        };
        GlyfTable.prototype.glyphFor = function (id) {
            id = id;
            var data, index, length, loca, numberOfContours, raw, xMax, xMin, yMax, yMin;
            if (id in this.cache) {
                return this.cache[id];
            }
            loca = this.file.loca;
            data = this.file.contents;
            index = loca.indexOf(id);
            length = loca.lengthOf(id);
            if (length === 0) {
                return this.cache[id] = null;
            }
            data.pos = this.offset + index;
            raw = new Data(data.read(length));
            numberOfContours = raw.readShort();
            xMin = raw.readShort();
            yMin = raw.readShort();
            xMax = raw.readShort();
            yMax = raw.readShort();
            if (numberOfContours === -1) {
                this.cache[id] = new CompoundGlyph(raw, xMin, yMin, xMax, yMax);
            }
            else {
                this.cache[id] = new SimpleGlyph(raw, numberOfContours, xMin, yMin, xMax, yMax);
            }
            return this.cache[id];
        };
        GlyfTable.prototype.encode = function (glyphs, mapping, old2new) {
            var glyph, id, offsets, table, _i, _len;
            table = [];
            offsets = [];
            for (_i = 0, _len = mapping.length; _i < _len; _i++) {
                id = mapping[_i];
                glyph = glyphs[id];
                offsets.push(table.length);
                if (glyph) {
                    table = table.concat(glyph.encode(old2new));
                }
            }
            offsets.push(table.length);
            return {
                table: table
                , offsets: offsets
            };
        };
        return GlyfTable;
    })(Table);

    var SimpleGlyph = (function () {
        /**************************************************************************/
        /* function : SimpleGlyph                                                 */
        /* comment : Stores raw, xMin, yMin, xMax, and yMax values for this glyph.*/
        /**************************************************************************/
        function SimpleGlyph(raw, numberOfContours, xMin, yMin, xMax, yMax) {
            this.raw = raw;
            this.numberOfContours = numberOfContours;
            this.xMin = xMin;
            this.yMin = yMin;
            this.xMax = xMax;
            this.yMax = yMax;
            this.compound = false;
        }
        SimpleGlyph.prototype.encode = function () {
            return this.raw.data;
        };
        return SimpleGlyph;
    })();

    var CompoundGlyph = (function () {
        var ARG_1_AND_2_ARE_WORDS, MORE_COMPONENTS, WE_HAVE_AN_X_AND_Y_SCALE, WE_HAVE_A_SCALE, WE_HAVE_A_TWO_BY_TWO, WE_HAVE_INSTRUCTIONS;
        ARG_1_AND_2_ARE_WORDS = 0x0001;
        WE_HAVE_A_SCALE = 0x0008;
        MORE_COMPONENTS = 0x0020;
        WE_HAVE_AN_X_AND_Y_SCALE = 0x0040;
        WE_HAVE_A_TWO_BY_TWO = 0x0080;
        WE_HAVE_INSTRUCTIONS = 0x0100;

        /********************************************************************************************************************/
        /* function : CompoundGlypg generator                                                                               */
        /* comment : It stores raw, xMin, yMin, xMax, yMax, glyph id, and glyph offset for the corresponding compound glyph.*/
        /********************************************************************************************************************/
        function CompoundGlyph(raw, xMin, yMin, xMax, yMax) {
            var data, flags;
            this.raw = raw;
            this.xMin = xMin;
            this.yMin = yMin;
            this.xMax = xMax;
            this.yMax = yMax;
            this.compound = true;
            this.glyphIDs = [];
            this.glyphOffsets = [];
            data = this.raw;
            while (true) {
                flags = data.readShort();
                this.glyphOffsets.push(data.pos);
                this.glyphIDs.push(data.readShort());
                if (!(flags & MORE_COMPONENTS)) {
                    break;
                }
                if (flags & ARG_1_AND_2_ARE_WORDS) {
                    data.pos += 4;
                }
                else {
                    data.pos += 2;
                }
                if (flags & WE_HAVE_A_TWO_BY_TWO) {
                    data.pos += 8;
                }
                else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
                    data.pos += 4;
                }
                else if (flags & WE_HAVE_A_SCALE) {
                    data.pos += 2;
                }
            }
        }
        /****************************************************************************************************************/
        /* function : CompoundGlypg encode                                                                              */
        /* comment : After creating a table for the characters you typed, you call directory.encode to encode the table.*/
        /****************************************************************************************************************/
        CompoundGlyph.prototype.encode = function (mapping) {
            var i, id, result, _i, _len, _ref;
            result = new Data(__slice.call(this.raw.data));
            _ref = this.glyphIDs;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                id = _ref[i];
                result.pos = this.glyphOffsets[i];
            }
            return result.data;
        };
        return CompoundGlyph;
    })();

    var LocaTable = (function (_super) {
        __extends(LocaTable, _super);

        function LocaTable() {
            return LocaTable.__super__.constructor.apply(this, arguments);
        }
        LocaTable.prototype.tag = 'loca';
        LocaTable.prototype.parse = function (data) {
            var format, i;
            data.pos = this.offset;
            format = this.file.head.indexToLocFormat;
            if (format === 0) {
                return this.offsets = (function () {
                    var _i, _ref, _results;
                    _results = [];
                    for (i = _i = 0, _ref = this.length; _i < _ref; i = _i += 2) {
                        _results.push(data.readUInt16() * 2);
                    }
                    return _results;
                }).call(this);
            }
            else {
                return this.offsets = (function () {
                    var _i, _ref, _results;
                    _results = [];
                    for (i = _i = 0, _ref = this.length; _i < _ref; i = _i += 4) {
                        _results.push(data.readUInt32());
                    }
                    return _results;
                }).call(this);
            }
        };
        LocaTable.prototype.indexOf = function (id) {
            return this.offsets[id];
        };
        LocaTable.prototype.lengthOf = function (id) {
            return this.offsets[id + 1] - this.offsets[id];
        };
        LocaTable.prototype.encode = function (offsets, activeGlyphs) {
            var LocaTable = new Uint32Array(this.offsets.length);
            var glyfPtr = 0;
            var listGlyf = 0;
            for (var k = 0; k < LocaTable.length; ++k) {
                LocaTable[k] = glyfPtr;
                if (listGlyf < activeGlyphs.length && activeGlyphs[listGlyf] == k) {
                    ++listGlyf;
                    LocaTable[k] = glyfPtr;
                    var start = this.offsets[k];
                    var len = this.offsets[k + 1] - start;
                    if (len > 0) {
                        glyfPtr += len;
                    }
                }
            }
            var newLocaTable = new Array(LocaTable.length * 4);
            for (var j = 0; j < LocaTable.length; ++j) {
                newLocaTable[4 * j + 3] = (LocaTable[j] & 0x000000ff);
                newLocaTable[4 * j + 2] = (LocaTable[j] & 0x0000ff00) >> 8;
                newLocaTable[4 * j + 1] = (LocaTable[j] & 0x00ff0000) >> 16;
                newLocaTable[4 * j] = (LocaTable[j] & 0xff000000) >> 24;
            }
            return newLocaTable;
        };
        return LocaTable;
    })(Table);

    /************************************************************************************/
    /* function : invert                                                                */
    /* comment : Change the object's (key: value) to create an object with (value: key).*/
    /************************************************************************************/
    var invert = function (object) {
        var key, ret, val;
        ret = {};
        for (key in object) {
            val = object[key];
            ret[val] = key;
        }
        return ret;
    };

    /*var successorOf = function (input) {
        var added, alphabet, carry, i, index, isUpperCase, last, length, next, result;
        alphabet = 'abcdefghijklmnopqrstuvwxyz';
        length = alphabet.length;
        result = input;
        i = input.length;
        while (i >= 0) {
            last = input.charAt(--i);
            if (isNaN(last)) {
                index = alphabet.indexOf(last.toLowerCase());
                if (index === -1) {
                    next = last;
                    carry = true;
                }
                else {
                    next = alphabet.charAt((index + 1) % length);
                    isUpperCase = last === last.toUpperCase();
                    if (isUpperCase) {
                        next = next.toUpperCase();
                    }
                    carry = index + 1 >= length;
                    if (carry && i === 0) {
                        added = isUpperCase ? 'A' : 'a';
                        result = added + next + result.slice(1);
                        break;
                    }
                }
            }
            else {
                next = +last + 1;
                carry = next > 9;
                if (carry) {
                    next = 0;
                }
                if (carry && i === 0) {
                    result = '1' + next + result.slice(1);
                    break;
                }
            }
            result = result.slice(0, i) + next + result.slice(i + 1);
            if (!carry) {
                break;
            }
        }
        return result;
    };*/

    var Subset = (function () {
        function Subset(font) {
            this.font = font;
            this.subset = {};
            this.unicodes = {};
            this.next = 33;
        }
        /*Subset.prototype.use = function (character) {
            var i, _i, _ref;
            if (typeof character === 'string') {
                for (i = _i = 0, _ref = character.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    this.use(character.charCodeAt(i));
                }
                return;
            }
            if (!this.unicodes[character]) {
                this.subset[this.next] = character;
                return this.unicodes[character] = this.next++;
            }
        };*/
        /*Subset.prototype.encodeText = function (text) {
            var char, i, string, _i, _ref;
            string = '';
            for (i = _i = 0, _ref = text.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                char = this.unicodes[text.charCodeAt(i)];
                string += String.fromCharCode(char);
            }
            return string;
        };*/
        /***************************************************************/
        /* function : generateCmap                                     */
        /* comment : Returns the unicode cmap for this font.         */
        /***************************************************************/
        Subset.prototype.generateCmap = function () {
            var mapping, roman, unicode, unicodeCmap, _ref;
            unicodeCmap = this.font.cmap.tables[0].codeMap;
            mapping = {};
            _ref = this.subset;
            for (roman in _ref) {
                unicode = _ref[roman];
                mapping[roman] = unicodeCmap[unicode];
            }
            return mapping;
        };
        /*Subset.prototype.glyphIDs = function () {
            var ret, roman, unicode, unicodeCmap, val, _ref;
            unicodeCmap = this.font.cmap.tables[0].codeMap;
            ret = [0];
            _ref = this.subset;
            for (roman in _ref) {
                unicode = _ref[roman];
                val = unicodeCmap[unicode];
                if ((val != null) && __indexOf.call(ret, val) < 0) {
                    ret.push(val);
                }
            }
            return ret.sort();
        };*/
        /******************************************************************/
        /* function : glyphsFor                                           */
        /* comment : Returns simple glyph objects for the input character.*/
        /******************************************************************/
        Subset.prototype.glyphsFor = function (glyphIDs) {
            var additionalIDs, glyph, glyphs, id, _i, _len, _ref;
            glyphs = {};
            for (_i = 0, _len = glyphIDs.length; _i < _len; _i++) {
                id = glyphIDs[_i];
                glyphs[id] = this.font.glyf.glyphFor(id);
            }
            additionalIDs = [];
            for (id in glyphs) {
                glyph = glyphs[id];
                if (glyph != null ? glyph.compound : void 0) {
                    additionalIDs.push.apply(additionalIDs, glyph.glyphIDs);
                }
            }
            if (additionalIDs.length > 0) {
                _ref = this.glyphsFor(additionalIDs);
                for (id in _ref) {
                    glyph = _ref[id];
                    glyphs[id] = glyph;
                }
            }
            return glyphs;
        };
        /***************************************************************/
        /* function : encode                                           */
        /* comment : Encode various tables for the characters you use. */
        /***************************************************************/
        Subset.prototype.encode = function (glyID) {
            var cmap, code, glyf, glyphs, id, ids, loca, name, new2old, newIDs, nextGlyphID, old2new, oldID, oldIDs, tables, _ref, _ref1;
            cmap = CmapTable.encode(this.generateCmap(), 'unicode');
            glyphs = this.glyphsFor(glyID);
            old2new = {
                0: 0
            };
            _ref = cmap.charMap;
            for (code in _ref) {
                ids = _ref[code];
                old2new[ids.old] = ids["new"];
            }
            nextGlyphID = cmap.maxGlyphID;
            for (oldID in glyphs) {
                if (!(oldID in old2new)) {
                    old2new[oldID] = nextGlyphID++;
                }
            }
            new2old = invert(old2new);
            newIDs = Object.keys(new2old).sort(function (a, b) {
                return a - b;
            });
            oldIDs = (function () {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = newIDs.length; _i < _len; _i++) {
                    id = newIDs[_i];
                    _results.push(new2old[id]);
                }
                return _results;
            })();
            glyf = this.font.glyf.encode(glyphs, oldIDs, old2new);
            loca = this.font.loca.encode(glyf.offsets, oldIDs);
            tables = {
                cmap: this.font.cmap.raw()
                , glyf: glyf.table
                , loca: loca
                , hmtx: this.font.hmtx.raw()
                , hhea: this.font.hhea.raw()
                , maxp: this.font.maxp.raw()
                , post: this.font.post.raw()
                , name: this.font.name.raw()
                , head: this.font.head.raw()
            };
            if (this.font.os2.exists) {
                tables['OS/2'] = this.font.os2.raw();
            }
            return this.font.directory.encode(tables);
        };
        return Subset;
    })();

    jsPDF.API.PDFObject = (function () {
        var pad, swapBytes;

        function PDFObject() {}
        pad = function (str, length) {
            return (Array(length + 1).join('0') + str).slice(-length);
        };
        /*****************************************************************************/
        /* function : convert                                                        */
        /* comment :Converts pdf tag's / FontBBox and array values in / W to strings */
        /*****************************************************************************/
        PDFObject.convert = function (object) {
            var e, items, key, out, val;
            if (Array.isArray(object)) {
                items = ((function () {
                    var _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = object.length; _i < _len; _i++) {
                        e = object[_i];
                        _results.push(PDFObject.convert(e));
                    }
                    return _results;
                })()).join(' ');
                return '[' + items + ']';
            }
            else if (typeof object === 'string') {
                return '/' + object;
            }
            else if (object != null ? object.isString : void 0) {
                return '(' + object + ')';
            }
            else if (object instanceof Date) {
                return '(D:' + pad(object.getUTCFullYear(), 4) + pad(object.getUTCMonth(), 2) + pad(object.getUTCDate(), 2) + pad(object.getUTCHours(), 2) + pad(object.getUTCMinutes(), 2) + pad(object.getUTCSeconds(), 2) + 'Z)';
            }
            else if ({}.toString.call(object) === '[object Object]') {
                out = ['<<'];
                for (key in object) {
                    val = object[key];
                    out.push('/' + key + ' ' + PDFObject.convert(val));
                }
                out.push('>>');
                return out.join('\n');
            }
            else {
                return '' + object;
            }
        };
        return PDFObject;
    })();
})(jsPDF);
