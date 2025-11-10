/** @license
 *
 * jsPDF - PDF Document creation from JavaScript
 * Version 3.0.3 Built on 2025-11-10T11:58:39.163Z
 *                      CommitID e7835bc9b7
 *
 * Copyright (c) 2010-2025 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
 *               2015-2025 yWorks GmbH, http://www.yworks.com
 *               2015-2025 Lukas Holländer <lukas.hollaender@yworks.com>, https://github.com/HackbrettXXX
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

import"core-js/es/promise";import"core-js/es/array/map";import"core-js/es/array/is-array";import"core-js/es/array/reduce";import"core-js/es/array/for-each";import"core-js/es/array/find";import"core-js/es/object/create";import"core-js/es/object/keys";import"core-js/es/object/values";import"core-js/es/object/assign";import"core-js/es/string/trim";import"core-js/es/string/trim-left";import"core-js/es/string/trim-right";import"core-js/es/number/is-integer";import"core-js/es/typed-array/uint8-array";import"core-js/es/typed-array/reduce";const e=function(){return"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this}();let t=e.BlobBuilder||e.WebKitBlobBuilder||e.MSBlobBuilder||e.MozBlobBuilder;e.URL=e.URL||e.webkitURL||function(e,t){return(t=document.createElement("a")).href=e,t};let r=e.Blob,o=URL.createObjectURL,n=URL.revokeObjectURL,i=e.Symbol&&e.Symbol.toStringTag,a=!1,s=!1,l=!!e.ArrayBuffer,c=t&&t.prototype.append&&t.prototype.getBlob;try{a=2===new Blob(["ä"]).size,s=2===new Blob([new Uint8Array([1,2])]).size}catch(y){}function f(e){return e.map(function(e){if(e.buffer instanceof ArrayBuffer){let t=e.buffer;if(e.byteLength!==t.byteLength){let r=new Uint8Array(e.byteLength);r.set(new Uint8Array(t,e.byteOffset,e.byteLength)),t=r.buffer}return t}return e})}function p(e,r){r=r||{};let o=new t;return f(e).forEach(function(e){o.append(e)}),r.type?o.getBlob(r.type):o.getBlob()}function u(e,t){return new r(f(e),t||{})}if(e.Blob&&(p.prototype=Blob.prototype,u.prototype=Blob.prototype),i)try{File.prototype[i]="File",Blob.prototype[i]="Blob",FileReader.prototype[i]="FileReader"}catch(y){}function d(){try{new File([],"")}catch(y){try{let t=new Function('class File extends Blob {constructor(chunks, name, opts) {opts = opts || {};super(chunks, opts || {});this.name = name;this.lastModifiedDate = opts.lastModified ? new Date(opts.lastModified) : new Date;this.lastModified = +this.lastModifiedDate;}};return new File([], ""), File')();e.File=t}catch(y){let r=function(e,t,r){let o=new Blob(e,r),n=r&&void 0!==r.lastModified?new Date(r.lastModified):new Date;return o.name=t,o.lastModifiedDate=n,o.lastModified=+n,o.toString=function(){return"[object File]"},i&&(o[i]="File"),o};e.File=r}}}a?(d(),e.Blob=s?e.Blob:u):c?(d(),e.Blob=p):function(){function t(e){let t=[];for(let r=0;r<e.length;r++){let o=e.charCodeAt(r);o<128?t.push(o):o<2048?t.push(192|o>>6,128|63&o):o<55296||o>=57344?t.push(224|o>>12,128|o>>6&63,128|63&o):(r++,o=65536+((1023&o)<<10|1023&e.charCodeAt(r)),t.push(240|o>>18,128|o>>12&63,128|o>>6&63,128|63&o))}return t}function r(e){let t,r,o,n,i,a;for(t="",o=e.length,r=0;r<o;)switch(n=e[r++],n>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:t+=String.fromCharCode(n);break;case 12:case 13:i=e[r++],t+=String.fromCharCode((31&n)<<6|63&i);break;case 14:i=e[r++],a=e[r++],t+=String.fromCharCode((15&n)<<12|(63&i)<<6|63&a)}return t}function i(e){return e&&DataView.prototype.isPrototypeOf(e)}function a(e){let t=new Array(e.byteLength),r=new Uint8Array(e),o=t.length;for(;o--;)t[o]=r[o];return t}function s(e){let t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",r=[];for(let o=0;o<e.length;o+=3){let n=e[o],i=o+1<e.length,a=i?e[o+1]:0,s=o+2<e.length,l=s?e[o+2]:0,c=n>>2,f=(3&n)<<4|a>>4,p=(15&a)<<2|l>>6,u=63&l;s||(u=64,i||(p=64)),r.push(t[c],t[f],t[p],t[u])}return r.join("")}let c=Object.create||function(e){function t(){}return t.prototype=e,new t};function f(e,r){for(let o=0,n=(e=e||[]).length;o<n;o++){let r=e[o];r instanceof f?e[o]=r._buffer:"string"==typeof r?e[o]=t(r):l&&(ArrayBuffer.prototype.isPrototypeOf(r)||isArrayBufferView(r))?e[o]=a(r):l&&i(r)?e[o]=a(r.buffer):e[o]=t(String(r))}this._buffer=[].concat.apply([],e),this.size=this._buffer.length,this.type=r&&r.type||""}function p(e,t,r){r=r||{};let o=f.call(this,e,r)||this;return o.name=t,o.lastModifiedDate=r.lastModified?new Date(r.lastModified):new Date,o.lastModified=+o.lastModifiedDate,o}if(f.prototype.slice=function(e,t,r){return new f([this._buffer.slice(e||0,t||this._buffer.length)],{type:r})},f.prototype.toString=function(){return"[object Blob]"},p.prototype=c(f.prototype),p.prototype.constructor=p,Object.setPrototypeOf)Object.setPrototypeOf(p,f);else try{p.__proto__=f}catch(y){}function u(){if(!(this instanceof u))throw new TypeError("Failed to construct 'FileReader': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");let e=document.createDocumentFragment();this.addEventListener=e.addEventListener,this.dispatchEvent=function(t){let r=this["on"+t.type];"function"==typeof r&&r(t),e.dispatchEvent(t)},this.removeEventListener=e.removeEventListener}function d(e,t,r){if(!(t instanceof f))throw new TypeError("Failed to execute '"+r+"' on 'FileReader': parameter 1 is not of type 'Blob'.");e.result="",setTimeout(function(){this.readyState=u.LOADING,e.dispatchEvent(new Event("load")),e.dispatchEvent(new Event("loadend"))})}p.prototype.toString=function(){return"[object File]"},u.EMPTY=0,u.LOADING=1,u.DONE=2,u.prototype.error=null,u.prototype.onabort=null,u.prototype.onerror=null,u.prototype.onload=null,u.prototype.onloadend=null,u.prototype.onloadstart=null,u.prototype.onprogress=null,u.prototype.readAsDataURL=function(e){d(this,e,"readAsDataURL"),this.result="data:"+e.type+";base64,"+s(e._buffer)},u.prototype.readAsText=function(e){d(this,e,"readAsText"),this.result=r(e._buffer)},u.prototype.readAsArrayBuffer=function(e){d(this,e,"readAsText"),this.result=e._buffer.slice()},u.prototype.abort=function(){},URL.createObjectURL=function(e){return e instanceof f?"data:"+e.type+";base64,"+s(e._buffer):o.call(URL,e)},URL.revokeObjectURL=function(e){n&&n.call(URL,e)};let h=e.XMLHttpRequest&&e.XMLHttpRequest.prototype.send;h&&(XMLHttpRequest.prototype.send=function(e){e instanceof f?(this.setRequestHeader("Content-Type",e.type),h.call(this,r(e._buffer))):h.call(this,e)}),e.FileReader=u,e.File=p,e.Blob=f}();let h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";void 0===e.btoa&&(e.btoa=function(e){let t,r,o,n,i,a,s,l,c=0,f=0,p="",u=[];if(!e)return e;do{t=e.charCodeAt(c++),r=e.charCodeAt(c++),o=e.charCodeAt(c++),l=t<<16|r<<8|o,n=l>>18&63,i=l>>12&63,a=l>>6&63,s=63&l,u[f++]=h.charAt(n)+h.charAt(i)+h.charAt(a)+h.charAt(s)}while(c<e.length);p=u.join("");let d=e.length%3;return(d?p.slice(0,d-3):p)+"===".slice(d||3)}),void 0===e.atob&&(e.atob=function(e){let t,r,o,n,i,a,s,l,c=0,f=0,p="",u=[];if(!e)return e;e+="";do{n=h.indexOf(e.charAt(c++)),i=h.indexOf(e.charAt(c++)),a=h.indexOf(e.charAt(c++)),s=h.indexOf(e.charAt(c++)),l=n<<18|i<<12|a<<6|s,t=l>>16&255,r=l>>8&255,o=255&l,u[f++]=64==a?String.fromCharCode(t):64==s?String.fromCharCode(t,r):String.fromCharCode(t,r,o)}while(c<e.length);return p=u.join(""),p});
