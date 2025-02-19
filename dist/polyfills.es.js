/** @license
 *
 * jsPDF - PDF Document creation from JavaScript
 * Version 3.0.0 Built on 2025-02-19T09:26:58.792Z
 *                      CommitID 00000000
 *
 * Copyright (c) 2010-2021 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
 *               2015-2021 yWorks GmbH, http://www.yworks.com
 *               2015-2021 Lukas Holländer <lukas.hollaender@yworks.com>, https://github.com/HackbrettXXX
 *               2016-2018 Aras Abbasi <aras.abbasi@gmail.com>
 *               2010 Aaron Spike, https://github.com/acspike
 *               2012 Willow Systems Corporation, https://github.com/willowsystems
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

import"core-js/es/promise";import"core-js/es/array/map";import"core-js/es/array/is-array";import"core-js/es/array/reduce";import"core-js/es/array/for-each";import"core-js/es/array/find";import"core-js/es/object/create";import"core-js/es/object/keys";import"core-js/es/object/values";import"core-js/es/object/assign";import"core-js/es/string/trim";import"core-js/es/string/trim-left";import"core-js/es/string/trim-right";import"core-js/es/number/is-integer";import"core-js/es/typed-array/uint8-array";import"core-js/es/typed-array/reduce";var e=function(){return"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this}(),t=e.BlobBuilder||e.WebKitBlobBuilder||e.MSBlobBuilder||e.MozBlobBuilder;
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
 */e.URL=e.URL||e.webkitURL||function(e,t){return(t=document.createElement("a")).href=e,t};var r=e.Blob,o=URL.createObjectURL,n=URL.revokeObjectURL,i=e.Symbol&&e.Symbol.toStringTag,a=!1,s=!1,c=!!e.ArrayBuffer,f=t&&t.prototype.append&&t.prototype.getBlob;try{a=2===new Blob(["ä"]).size,s=2===new Blob([new Uint8Array([1,2])]).size}catch(e){}function p(e){return e.map((function(e){if(e.buffer instanceof ArrayBuffer){var t=e.buffer;if(e.byteLength!==t.byteLength){var r=new Uint8Array(e.byteLength);r.set(new Uint8Array(t,e.byteOffset,e.byteLength)),t=r.buffer}return t}return e}))}function l(e,r){r=r||{};var o=new t;return p(e).forEach((function(e){o.append(e)})),r.type?o.getBlob(r.type):o.getBlob()}function u(e,t){return new r(p(e),t||{})}if(e.Blob&&(l.prototype=Blob.prototype,u.prototype=Blob.prototype),i)try{File.prototype[i]="File",Blob.prototype[i]="Blob",FileReader.prototype[i]="FileReader"}catch(e){}function d(){try{new File([],"")}catch(r){try{var t=new Function('class File extends Blob {constructor(chunks, name, opts) {opts = opts || {};super(chunks, opts || {});this.name = name;this.lastModifiedDate = opts.lastModified ? new Date(opts.lastModified) : new Date;this.lastModified = +this.lastModifiedDate;}};return new File([], ""), File')();e.File=t}catch(r){t=function(e,t,r){var o=new Blob(e,r),n=r&&void 0!==r.lastModified?new Date(r.lastModified):new Date;return o.name=t,o.lastModifiedDate=n,o.lastModified=+n,o.toString=function(){return"[object File]"},i&&(o[i]="File"),o};e.File=t}}}a?(d(),e.Blob=s?e.Blob:u):f?(d(),e.Blob=l):function(){function t(e){for(var t=[],r=0;r<e.length;r++){var o=e.charCodeAt(r);o<128?t.push(o):o<2048?t.push(192|o>>6,128|63&o):o<55296||o>=57344?t.push(224|o>>12,128|o>>6&63,128|63&o):(r++,o=65536+((1023&o)<<10|1023&e.charCodeAt(r)),t.push(240|o>>18,128|o>>12&63,128|o>>6&63,128|63&o))}return t}function r(e){var t,r,o,n,i,a;for(t="",o=e.length,r=0;r<o;)switch((n=e[r++])>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:t+=String.fromCharCode(n);break;case 12:case 13:i=e[r++],t+=String.fromCharCode((31&n)<<6|63&i);break;case 14:i=e[r++],a=e[r++],t+=String.fromCharCode((15&n)<<12|(63&i)<<6|(63&a)<<0)}return t}function i(e){for(var t=new Array(e.byteLength),r=new Uint8Array(e),o=t.length;o--;)t[o]=r[o];return t}function a(e){for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",r=[],o=0;o<e.length;o+=3){var n=e[o],i=o+1<e.length,a=i?e[o+1]:0,s=o+2<e.length,c=s?e[o+2]:0,f=n>>2,p=(3&n)<<4|a>>4,l=(15&a)<<2|c>>6,u=63&c;s||(u=64,i||(l=64)),r.push(t[f],t[p],t[l],t[u])}return r.join("")}var s=Object.create||function(e){function t(){}return t.prototype=e,new t};if(c)var f=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],p=ArrayBuffer.isView||function(e){return e&&f.indexOf(Object.prototype.toString.call(e))>-1};function l(e,r){for(var o=0,n=(e=e||[]).length;o<n;o++){var a=e[o];a instanceof l?e[o]=a._buffer:"string"==typeof a?e[o]=t(a):c&&(ArrayBuffer.prototype.isPrototypeOf(a)||p(a))?e[o]=i(a):c&&((s=a)&&DataView.prototype.isPrototypeOf(s))?e[o]=i(a.buffer):e[o]=t(String(a))}var s;this._buffer=[].concat.apply([],e),this.size=this._buffer.length,this.type=r&&r.type||""}function u(e,t,r){r=r||{};var o=l.call(this,e,r)||this;return o.name=t,o.lastModifiedDate=r.lastModified?new Date(r.lastModified):new Date,o.lastModified=+o.lastModifiedDate,o}if(l.prototype.slice=function(e,t,r){return new l([this._buffer.slice(e||0,t||this._buffer.length)],{type:r})},l.prototype.toString=function(){return"[object Blob]"},u.prototype=s(l.prototype),u.prototype.constructor=u,Object.setPrototypeOf)Object.setPrototypeOf(u,l);else try{u.__proto__=l}catch(e){}function d(){if(!(this instanceof d))throw new TypeError("Failed to construct 'FileReader': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");var e=document.createDocumentFragment();this.addEventListener=e.addEventListener,this.dispatchEvent=function(t){var r=this["on"+t.type];"function"==typeof r&&r(t),e.dispatchEvent(t)},this.removeEventListener=e.removeEventListener}function y(e,t,r){if(!(t instanceof l))throw new TypeError("Failed to execute '"+r+"' on 'FileReader': parameter 1 is not of type 'Blob'.");e.result="",setTimeout((function(){this.readyState=d.LOADING,e.dispatchEvent(new Event("load")),e.dispatchEvent(new Event("loadend"))}))}u.prototype.toString=function(){return"[object File]"},d.EMPTY=0,d.LOADING=1,d.DONE=2,d.prototype.error=null,d.prototype.onabort=null,d.prototype.onerror=null,d.prototype.onload=null,d.prototype.onloadend=null,d.prototype.onloadstart=null,d.prototype.onprogress=null,d.prototype.readAsDataURL=function(e){y(this,e,"readAsDataURL"),this.result="data:"+e.type+";base64,"+a(e._buffer)},d.prototype.readAsText=function(e){y(this,e,"readAsText"),this.result=r(e._buffer)},d.prototype.readAsArrayBuffer=function(e){y(this,e,"readAsText"),this.result=e._buffer.slice()},d.prototype.abort=function(){},URL.createObjectURL=function(e){return e instanceof l?"data:"+e.type+";base64,"+a(e._buffer):o.call(URL,e)},URL.revokeObjectURL=function(e){n&&n.call(URL,e)};var h=e.XMLHttpRequest&&e.XMLHttpRequest.prototype.send;h&&(XMLHttpRequest.prototype.send=function(e){e instanceof l?(this.setRequestHeader("Content-Type",e.type),h.call(this,r(e._buffer))):h.call(this,e)}),e.FileReader=d,e.File=u,e.Blob=l}();var y="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";void 0===e.btoa&&(e.btoa=function(e){var t,r,o,n,i,a=0,s=0,c="",f=[];if(!e)return e;do{t=(i=e.charCodeAt(a++)<<16|e.charCodeAt(a++)<<8|e.charCodeAt(a++))>>18&63,r=i>>12&63,o=i>>6&63,n=63&i,f[s++]=y.charAt(t)+y.charAt(r)+y.charAt(o)+y.charAt(n)}while(a<e.length);c=f.join("");var p=e.length%3;return(p?c.slice(0,p-3):c)+"===".slice(p||3)}),void 0===e.atob&&(e.atob=function(e){var t,r,o,n,i,a,s=0,c=0,f=[];if(!e)return e;e+="";do{t=(a=y.indexOf(e.charAt(s++))<<18|y.indexOf(e.charAt(s++))<<12|(n=y.indexOf(e.charAt(s++)))<<6|(i=y.indexOf(e.charAt(s++))))>>16&255,r=a>>8&255,o=255&a,f[c++]=64==n?String.fromCharCode(t):64==i?String.fromCharCode(t,r):String.fromCharCode(t,r,o)}while(s<e.length);return f.join("")});
