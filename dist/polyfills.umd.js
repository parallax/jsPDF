/** @license
 *
 * jsPDF - PDF Document creation from JavaScript
 * Version 2.2.0 Built on 2021-01-01T09:09:48.427Z
 *                      CommitID 00000000
 *
 * Copyright (c) 2010-2020 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
 *               2015-2020 yWorks GmbH, http://www.yworks.com
 *               2015-2020 Lukas Holländer <lukas.hollaender@yworks.com>, https://github.com/HackbrettXXX
 *               2016-2018 Aras Abbasi <aras.abbasi@gmail.com>
 *               2010 Aaron Spike, https://github.com/acspike
 *               2012 Willow Systems Corporation, willow-systems.com
 *               2012 Pablo Hess, https://github.com/pablohess
 *               2012 Florian Jenett, https://github.com/fjenett
 *               2013 Warren Weckesser, https://github.com/warrenweckesser
 *               2013 Youssef Beddad, https://github.com/lifof
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2013 Stefan Slonevskiy, https://github.com/stefslon
 *               2013 Jeremy Morel, https://github.com/jmorel
 *               2013 Christoph Hartmann, https://github.com/chris-rock
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Makes, https://github.com/dollaruw
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 Steven Spungin, https://github.com/Flamenco
 *               2014 Kenneth Glassey, https://github.com/Gavvers
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Contributor(s):
 *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
 *    kim3er, mfo, alnorth, Flamenco
 */

/**
 * Copyright (c) 2014-2020 Denis Pushkarev
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";require("../../modules/es.object.to-string"),require("../../modules/es.string.iterator"),require("../../modules/web.dom-collections.iterator"),require("../../modules/es.promise"),require("../../modules/es.promise.all-settled"),require("../../modules/es.promise.finally");var e=require("../../internals/path");module.exports=e.Promise,require("../../modules/es.array.map");var t=require("../../internals/entry-unbind");module.exports=t("Array","map"),require("../../modules/es.array.is-array");var r=require("../../internals/path");module.exports=r.Array.isArray,require("../../modules/es.array.reduce");var o=require("../../internals/entry-unbind");module.exports=o("Array","reduce"),require("../../modules/es.array.for-each");var n=require("../../internals/entry-unbind");module.exports=n("Array","forEach"),require("../../modules/es.array.find");var i=require("../../internals/entry-unbind");module.exports=i("Array","find"),require("../../modules/es.object.create");var a=require("../../internals/path").Object;module.exports=function(e,t){return a.create(e,t)},require("../../modules/es.object.keys");var s=require("../../internals/path");module.exports=s.Object.keys,require("../../modules/es.object.values");var u=require("../../internals/path");module.exports=u.Object.values,require("../../modules/es.object.assign");var l=require("../../internals/path");module.exports=l.Object.assign,require("../../modules/es.string.trim");var c=require("../../internals/entry-unbind");module.exports=c("String","trim"),require("../../modules/es.string.trim-start");var d=require("../../internals/entry-unbind");module.exports=d("String","trimLeft"),require("../../modules/es.string.trim-end");var f=require("../../internals/entry-unbind");module.exports=f("String","trimRight"),require("../../modules/es.number.is-integer");var p=require("../../internals/path");module.exports=p.Number.isInteger,require("../../modules/es.typed-array.uint8-array"),require("./methods");var y=require("../../internals/global");module.exports=y.Uint8Array,require("../../modules/es.typed-array.reduce");var b=function(){return"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this}(),h=b.BlobBuilder||b.WebKitBlobBuilder||b.MSBlobBuilder||b.MozBlobBuilder;
/**
   * @license
   * Blob.js
   * A Blob, File, FileReader & URL implementation.
   * 2018-08-09
   *
   * By Eli Grey, http://eligrey.com
   * By Jimmy Wärting, https://github.com/jimmywarting
   * License: MIT
   *   See https://github.com/eligrey/Blob.js/blob/master/LICENSE.md
   */b.URL=b.URL||b.webkitURL||function(e,t){return(t=document.createElement("a")).href=e,t};var m=b.Blob,v=URL.createObjectURL,g=URL.revokeObjectURL,A=b.Symbol&&b.Symbol.toStringTag,q=!1,w=!1,j=!!b.ArrayBuffer,B=h&&h.prototype.append&&h.prototype.getBlob;try{q=2===new Blob(["ä"]).size,w=2===new Blob([new Uint8Array([1,2])]).size}catch(e){}function L(e){return e.map((function(e){if(e.buffer instanceof ArrayBuffer){var t=e.buffer;if(e.byteLength!==t.byteLength){var r=new Uint8Array(e.byteLength);r.set(new Uint8Array(t,e.byteOffset,e.byteLength)),t=r.buffer}return t}return e}))}function R(e,t){t=t||{};var r=new h;return L(e).forEach((function(e){r.append(e)})),t.type?r.getBlob(t.type):r.getBlob()}function O(e,t){return new m(L(e),t||{})}if(b.Blob&&(R.prototype=Blob.prototype,O.prototype=Blob.prototype),A)try{File.prototype[A]="File",Blob.prototype[A]="Blob",FileReader.prototype[A]="FileReader"}catch(e){}function x(){var e=!!b.ActiveXObject||"-ms-scroll-limit"in document.documentElement.style&&"-ms-ime-align"in document.documentElement.style,t=b.XMLHttpRequest&&b.XMLHttpRequest.prototype.send;e&&t&&(XMLHttpRequest.prototype.send=function(e){e instanceof Blob?(this.setRequestHeader("Content-Type",e.type),t.call(this,e)):t.call(this,e)});try{new File([],"")}catch(e){try{var r=new Function('class File extends Blob {constructor(chunks, name, opts) {opts = opts || {};super(chunks, opts || {});this.name = name;this.lastModifiedDate = opts.lastModified ? new Date(opts.lastModified) : new Date;this.lastModified = +this.lastModifiedDate;}};return new File([], ""), File')();b.File=r}catch(e){r=function(e,t,r){var o=new Blob(e,r),n=r&&void 0!==r.lastModified?new Date(r.lastModified):new Date;return o.name=t,o.lastModifiedDate=n,o.lastModified=+n,o.toString=function(){return"[object File]"},A&&(o[A]="File"),o};b.File=r}}}q?(x(),b.Blob=w?b.Blob:O):B?(x(),b.Blob=R):function(){function e(e){for(var t=[],r=0;r<e.length;r++){var o=e.charCodeAt(r);o<128?t.push(o):o<2048?t.push(192|o>>6,128|63&o):o<55296||o>=57344?t.push(224|o>>12,128|o>>6&63,128|63&o):(r++,o=65536+((1023&o)<<10|1023&e.charCodeAt(r)),t.push(240|o>>18,128|o>>12&63,128|o>>6&63,128|63&o))}return t}function t(e){var t,r,o,n,i,a;for(t="",o=e.length,r=0;r<o;)switch((n=e[r++])>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:t+=String.fromCharCode(n);break;case 12:case 13:i=e[r++],t+=String.fromCharCode((31&n)<<6|63&i);break;case 14:i=e[r++],a=e[r++],t+=String.fromCharCode((15&n)<<12|(63&i)<<6|(63&a)<<0)}return t}function r(e){for(var t=new Array(e.byteLength),r=new Uint8Array(e),o=t.length;o--;)t[o]=r[o];return t}function o(e){for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",r=[],o=0;o<e.length;o+=3){var n=e[o],i=o+1<e.length,a=i?e[o+1]:0,s=o+2<e.length,u=s?e[o+2]:0,l=n>>2,c=(3&n)<<4|a>>4,d=(15&a)<<2|u>>6,f=63&u;s||(f=64,i||(d=64)),r.push(t[l],t[c],t[d],t[f])}return r.join("")}var n=Object.create||function(e){function t(){}return t.prototype=e,new t};if(j)var i=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],a=ArrayBuffer.isView||function(e){return e&&i.indexOf(Object.prototype.toString.call(e))>-1};function s(t,o){for(var n=0,i=(t=t||[]).length;n<i;n++){var u=t[n];u instanceof s?t[n]=u._buffer:"string"==typeof u?t[n]=e(u):j&&(ArrayBuffer.prototype.isPrototypeOf(u)||a(u))?t[n]=r(u):j&&((l=u)&&DataView.prototype.isPrototypeOf(l))?t[n]=r(u.buffer):t[n]=e(String(u))}var l;this._buffer=[].concat.apply([],t),this.size=this._buffer.length,this.type=o&&o.type||""}function u(e,t,r){r=r||{};var o=s.call(this,e,r)||this;return o.name=t,o.lastModifiedDate=r.lastModified?new Date(r.lastModified):new Date,o.lastModified=+o.lastModifiedDate,o}if(s.prototype.slice=function(e,t,r){return new s([this._buffer.slice(e||0,t||this._buffer.length)],{type:r})},s.prototype.toString=function(){return"[object Blob]"},u.prototype=n(s.prototype),u.prototype.constructor=u,Object.setPrototypeOf)Object.setPrototypeOf(u,s);else try{u.__proto__=s}catch(e){}function l(){if(!(this instanceof l))throw new TypeError("Failed to construct 'FileReader': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");var e=document.createDocumentFragment();this.addEventListener=e.addEventListener,this.dispatchEvent=function(t){var r=this["on"+t.type];"function"==typeof r&&r(t),e.dispatchEvent(t)},this.removeEventListener=e.removeEventListener}function c(e,t,r){if(!(t instanceof s))throw new TypeError("Failed to execute '"+r+"' on 'FileReader': parameter 1 is not of type 'Blob'.");e.result="",setTimeout((function(){this.readyState=l.LOADING,e.dispatchEvent(new Event("load")),e.dispatchEvent(new Event("loadend"))}))}u.prototype.toString=function(){return"[object File]"},l.EMPTY=0,l.LOADING=1,l.DONE=2,l.prototype.error=null,l.prototype.onabort=null,l.prototype.onerror=null,l.prototype.onload=null,l.prototype.onloadend=null,l.prototype.onloadstart=null,l.prototype.onprogress=null,l.prototype.readAsDataURL=function(e){c(this,e,"readAsDataURL"),this.result="data:"+e.type+";base64,"+o(e._buffer)},l.prototype.readAsText=function(e){c(this,e,"readAsText"),this.result=t(e._buffer)},l.prototype.readAsArrayBuffer=function(e){c(this,e,"readAsText"),this.result=e._buffer.slice()},l.prototype.abort=function(){},URL.createObjectURL=function(e){return e instanceof s?"data:"+e.type+";base64,"+o(e._buffer):v.call(URL,e)},URL.revokeObjectURL=function(e){g&&g.call(URL,e)};var d=b.XMLHttpRequest&&b.XMLHttpRequest.prototype.send;d&&(XMLHttpRequest.prototype.send=function(e){e instanceof s?(this.setRequestHeader("Content-Type",e.type),d.call(this,t(e._buffer))):d.call(this,e)}),b.FileReader=l,b.File=u,b.Blob=s}();var M="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";void 0===b.btoa&&(b.btoa=function(e){var t,r,o,n,i,a=0,s=0,u="",l=[];if(!e)return e;do{t=(i=e.charCodeAt(a++)<<16|e.charCodeAt(a++)<<8|e.charCodeAt(a++))>>18&63,r=i>>12&63,o=i>>6&63,n=63&i,l[s++]=M.charAt(t)+M.charAt(r)+M.charAt(o)+M.charAt(n)}while(a<e.length);u=l.join("");var c=e.length%3;return(c?u.slice(0,c-3):u)+"===".slice(c||3)}),void 0===b.atob&&(b.atob=function(e){var t,r,o,n,i,a,s=0,u=0,l=[];if(!e)return e;e+="";do{t=(a=M.indexOf(e.charAt(s++))<<18|M.indexOf(e.charAt(s++))<<12|(n=M.indexOf(e.charAt(s++)))<<6|(i=M.indexOf(e.charAt(s++))))>>16&255,r=a>>8&255,o=255&a,l[u++]=64==n?String.fromCharCode(t):64==i?String.fromCharCode(t,r):String.fromCharCode(t,r,o)}while(s<e.length);return l.join("")})}));
