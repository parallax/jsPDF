/*
Copyright (c) 2010-2018 James Hall, https://github.com/MrRio/jsPDF

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

"use strict";

/**
 * The reference server collects and saves reference PDFs for the tests.
 */
const http = require("http");
const PORT = 9090;
const fs = require("fs");

// Create a server
const server = http.createServer((request, response) => {
  console.log(request.url);

  const wstream = fs.createWriteStream("./" + request.url);
  console.log("🙌 Creating reference PDF " + request.url + ".");
  request.on("data", chunk => {
    console.log(chunk.length);
    wstream.write(chunk);
  });
  request.on("end", () => {
    wstream.end();
    console.log("ok");
  });
  response.end("Test has sent reference PDF for " + request.url);
});

// Lets start our server
server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
