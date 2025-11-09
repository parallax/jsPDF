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

import { globalObject as _global } from "./globalObject.js";
import { console } from "./console.js";

interface SaveAsOptions {
  autoBom?: boolean;
}

function bom(blob: Blob, opts?: SaveAsOptions | boolean): Blob {
  let options: SaveAsOptions;
  if (typeof opts === "undefined") {
    options = { autoBom: false };
  } else if (typeof opts !== "object") {
    console.warn("Deprecated: Expected third argument to be a object");
    options = { autoBom: !opts };
  } else {
    options = opts;
  }

  // prepend BOM for UTF-8 XML and text/* types (including HTML)
  // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
  if (
    options.autoBom &&
    /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(
      blob.type
    )
  ) {
    return new Blob([String.fromCharCode(0xfeff), blob], { type: blob.type });
  }
  return blob;
}

function download(url: string, name: string, opts?: SaveAsOptions): void {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.onload = function() {
    saveAs(xhr.response, name, opts);
  };
  xhr.onerror = function() {
    console.error("could not download file");
  };
  xhr.send();
}

function corsEnabled(url: string): boolean {
  const xhr = new XMLHttpRequest();
  // use sync to avoid popup blocker
  xhr.open("HEAD", url, false);
  try {
    xhr.send();
  } catch (e) {}
  return xhr.status >= 200 && xhr.status <= 299;
}

// `a.click()` doesn't work for all browsers (#465)
function click(node: HTMLAnchorElement): void {
  try {
    node.dispatchEvent(new MouseEvent("click"));
  } catch (e) {
    const evt = document.createEvent("MouseEvents");
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

type SaveAsFunction = (blob: Blob | string, name?: string, opts?: SaveAsOptions, popup?: Window | null) => void;

const saveAs: SaveAsFunction =
  _global.saveAs ||
  // probably in some web worker
  (typeof window !== "object" || window !== _global
    ? function saveAs(): void {
        /* noop */
      }
    : // Use download attribute first if possible (#193 Lumia mobile) unless this is a native app
    typeof HTMLAnchorElement !== "undefined" &&
      "download" in HTMLAnchorElement.prototype
    ? function saveAs(blob: Blob | string, name?: string, opts?: SaveAsOptions): void {
        const URL = _global.URL || _global.webkitURL;
        const a = document.createElement("a");
        name = name || (blob as any).name || "download";

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
              : click(a as any);
          } else {
            click(a);
          }
        } else {
          // Support blobs
          a.href = URL.createObjectURL(blob);
          setTimeout(function() {
            URL.revokeObjectURL(a.href);
          }, 4e4); // 40s
          setTimeout(function() {
            click(a);
          }, 0);
        }
      }
    : // Use msSaveOrOpenBlob as a second approach
    "msSaveOrOpenBlob" in navigator
    ? function saveAs(blob: Blob | string, name?: string, opts?: SaveAsOptions): void {
        name = name || (blob as any).name || "download";

        if (typeof blob === "string") {
          if (corsEnabled(blob)) {
            download(blob, name, opts);
          } else {
            const a = document.createElement("a");
            a.href = blob;
            a.target = "_blank";
            setTimeout(function() {
              click(a);
            });
          }
        } else {
          (navigator as any).msSaveOrOpenBlob(bom(blob, opts), name);
        }
      }
    : // Fallback to using FileReader and a popup
      function saveAs(blob: Blob | string, name?: string, opts?: SaveAsOptions, popup?: Window | null): void {
        // Open a popup immediately do go around popup blocker
        // Mostly only available on user interaction and the fileReader is async so...
        popup = popup || open("", "_blank");
        if (popup) {
          popup.document.title = popup.document.body.innerText =
            "downloading...";
        }

        if (typeof blob === "string") return download(blob, name, opts);

        const force = blob.type === "application/octet-stream";
        const isSafari =
          /constructor/i.test((_global as any).HTMLElement) || (_global as any).safari;
        const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

        if (
          (isChromeIOS || (force && isSafari)) &&
          typeof FileReader === "object"
        ) {
          // Safari doesn't allow downloading of blob URLs
          const reader = new FileReader();
          reader.onloadend = function() {
            let url = reader.result as string;
            url = isChromeIOS
              ? url
              : url.replace(/^data:[^;]*;/, "data:attachment/file;");
            if (popup) popup.location.href = url;
            else (location as any) = url;
            popup = null; // reverse-tabnabbing #460
          };
          reader.readAsDataURL(blob);
        } else {
          const URL = _global.URL || _global.webkitURL;
          const url = URL.createObjectURL(blob);
          if (popup) (popup.location as any) = url;
          else location.href = url;
          popup = null; // reverse-tabnabbing #460
          setTimeout(function() {
            URL.revokeObjectURL(url);
          }, 4e4); // 40s
        }
      });

export { saveAs };
