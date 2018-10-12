'use strict'

/**
 * The reference server collects and saves reference PDFs for the tests.
 */
const http = require('http')
const PORT = 9090
const fs = require('fs')


function cleanUpUnicode(value) {
    var i = 0;
    var byteArray = [];
	var StringFromCharCode = String.fromCharCode;
    for (i = 0; i < value.length; i += 1) {
      byteArray.push(StringFromCharCode(value.charCodeAt(i) & 0xff))
    }
	return byteArray.join("");
}

// Create a server
const server = http.createServer((request, response) => {
  console.log(request.url)

  const wstream = fs.createWriteStream('./' + request.url, {flags: 'w'})
  console.log('Creating reference PDF ' + request.url + '.')
  request.on('data', (chunk) => {
    //console.log(chunk.length)
    wstream.write(chunk, 'ascii');
  })
  request.on('end', () => {
    wstream.end()
  })
  response.end('Test has sent reference PDF for ' + request.url)
})

// Lets start our server
server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`)
})
