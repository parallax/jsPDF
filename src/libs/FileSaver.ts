/**
 * @license
 * FileSaver.js
 * A saveAs() FileSaver implementation.
 *
 * By Eli Grey, http://eligrey.com
 *
 * License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
 * source  : http://purl.eligrey.com/github/FileSaver.js
 */

import { globalObject } from "./globalObject.js";

// Loose view of the global for feature-detection of non-standard members
// (saveAs, webkitURL, safari, msSaveOrOpenBlob hosts).
const _global = globalObject as unknown as Record<string, unknown> & {
  URL?: typeof URL;
  webkitURL?: typeof URL;
  HTMLElement?: typeof HTMLElement;
  saveAs?: unknown;
  safari?: unknown;
};
import { console } from "./console.js";

interface BomOptions {
  autoBom: boolean;
}

type SaveAsOptions = BomOptions | boolean;

type SaveAsFunction = (
  blob: Blob | string,
  name?: string,
  opts?: SaveAsOptions,
  popup?: Window | null
) => void;

function bom(blob: Blob, opts?: SaveAsOptions): Blob {
  if (typeof opts === "undefined") opts = { autoBom: false };
  else if (typeof opts !== "object") {
    console.warn("Deprecated: Expected third argument to be a object");
    opts = { autoBom: !opts };
  }

  // prepend BOM for UTF-8 XML and text/* types (including HTML)
  // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
  if (
    opts.autoBom &&
    /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(
      blob.type
    )
  ) {
    return new Blob([String.fromCharCode(0xfeff), blob], { type: blob.type });
  }
  return blob;
}

function download(url: string, name?: string, opts?: SaveAsOptions) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.onload = function () {
    saveAs(xhr.response, name, opts);
  };
  xhr.onerror = function () {
    console.error("could not download file");
  };
  xhr.send();
}

function corsEnabled(url: string): boolean {
  var xhr = new XMLHttpRequest();
  // use sync to avoid popup blocker
  xhr.open("HEAD", url, false);
  try {
    xhr.send();
  } catch (e) {}
  return xhr.status >= 200 && xhr.status <= 299;
}

// `a.click()` doesn't work for all browsers (#465)
function click(node: HTMLElement, _unused?: unknown) {
  try {
    node.dispatchEvent(new MouseEvent("click"));
  } catch (e) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent(
      "click",
      true,
      true,
      window,
      0,
      0,
      0,
      80,
      20,
      false,
      false,
      false,
      false,
      0,
      null
    );
    node.dispatchEvent(evt);
  }
}

var saveAs: SaveAsFunction =
  // a host-provided implementation wins (also how the worker shim injects one)
  (_global.saveAs as SaveAsFunction | undefined) ||
  // probably in some web worker
  (typeof window !== "object" || (window as unknown) !== (_global as unknown)
    ? function saveAs() {
        /* noop */
      }
    : // Use download attribute first if possible (#193 Lumia mobile) unless this is a native app
      typeof HTMLAnchorElement !== "undefined" &&
        "download" in HTMLAnchorElement.prototype
      ? function saveAs(
          blob: Blob | string,
          name?: string,
          opts?: SaveAsOptions
        ) {
          // The original code assumes some URL implementation exists in any
          // environment that reaches this branch.
          var URL = (_global.URL || _global.webkitURL)!;
          var a = document.createElement("a");
          // `name` is only present on File instances, but the original code
          // probes every Blob for it; string blobs simply yield undefined.
          name = name || (blob as File).name || "download";

          a.download = name;
          a.rel = "noopener"; // tabnabbing

          // TODO: detect chrome extensions & packaged apps
          // a.target = '_blank'

          if (typeof blob === "string") {
            // Support regular links
            a.href = blob;
            if (a.origin !== location.origin) {
              corsEnabled(a.href)
                ? download(blob, name, opts)
                : click(a, (a.target = "_blank"));
            } else {
              click(a);
            }
          } else {
            // Support blobs
            a.href = URL.createObjectURL(blob);
            setTimeout(function () {
              URL.revokeObjectURL(a.href);
            }, 4e4); // 40s
            setTimeout(function () {
              click(a);
            }, 0);
          }
        }
      : // Use msSaveOrOpenBlob as a second approach
        "msSaveOrOpenBlob" in navigator
        ? function saveAs(
            blob: Blob | string,
            name?: string,
            opts?: SaveAsOptions
          ) {
            // `name` is only present on File instances (see above).
            name = name || (blob as File).name || "download";

            if (typeof blob === "string") {
              if (corsEnabled(blob)) {
                download(blob, name, opts);
              } else {
                var a = document.createElement("a");
                a.href = blob;
                a.target = "_blank";
                setTimeout(function () {
                  click(a);
                });
              }
            } else {
              // msSaveOrOpenBlob is an IE-only, nonstandard API absent from the
              // DOM lib typings.
              (
                navigator as unknown as {
                  msSaveOrOpenBlob: (blob: Blob, name: string) => void;
                }
              ).msSaveOrOpenBlob(bom(blob, opts), name);
            }
          }
        : // Fallback to using FileReader and a popup
          function saveAs(
            blob: Blob | string,
            name?: string,
            opts?: SaveAsOptions,
            popup?: Window | null
          ) {
            // Open a popup immediately do go around popup blocker
            // Mostly only available on user interaction and the fileReader is async so...
            popup = popup || open("", "_blank");
            if (popup) {
              popup.document.title = popup.document.body.innerText =
                "downloading...";
            }

            if (typeof blob === "string") return download(blob, name, opts);

            var force = blob.type === "application/octet-stream";
            var isSafari =
              // RegExp.prototype.test stringifies its argument; Safari's native-code
              // constructor toString is what the sniff relies on.
              /constructor/i.test(String(_global.HTMLElement)) ||
              _global.safari;
            var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

            if (
              (isChromeIOS || (force && isSafari)) &&
              typeof FileReader === "object"
            ) {
              // Safari doesn't allow downloading of blob URLs
              // The `typeof FileReader === "object"` guard above narrows the
              // constructor's declared function type away, so restore it.
              var reader = new (
                FileReader as unknown as {
                  new (): FileReader;
                }
              )();
              reader.onloadend = function () {
                // readAsDataURL always produces a string result.
                var url = reader.result as string;
                url = isChromeIOS
                  ? url
                  : url.replace(/^data:[^;]*;/, "data:attachment/file;");
                if (popup) popup.location.href = url;
                else location.href = url;
                popup = null; // reverse-tabnabbing #460
              };
              reader.readAsDataURL(blob);
            } else {
              // The original code assumes some URL implementation exists in
              // any environment that reaches this branch.
              var URL = (_global.URL || _global.webkitURL)!;
              var url = URL.createObjectURL(blob);
              if (popup) popup.location = url;
              else location.href = url;
              popup = null; // reverse-tabnabbing #460
              setTimeout(function () {
                URL.revokeObjectURL(url);
              }, 4e4); // 40s
            }
          });

export { saveAs };
