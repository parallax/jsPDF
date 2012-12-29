BlobBuilder.js
==============

BlobBuilder.js implements the W3C [`BlobBuilder`][1] interface in browsers that do
not natively support it.

Limitations
-----------

You can not append native blobs to a BlobBuilder.js `BlobBuilder` unless the script is in
a web worker thread, as the necessary `FileReaderSync` interface for reading native blobs
is limited to web worker threads only.

![Tracking image](//in.getclicky.com/212712ns.gif)

  [1]: http://www.w3.org/TR/file-writer-api/#the-blobbuilder-interface
