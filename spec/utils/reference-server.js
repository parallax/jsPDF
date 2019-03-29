/* eslint-disable no-console */
'use strict'

/**
 * The reference server collects and saves reference PDFs for the tests.
 */
const http = require('http')
const PORT = 9090
const fs = require('fs')

// Create a server
const server = http.createServer((request, response) => {
  console.log(request.url)

  const wstream = fs.createWriteStream('./' + request.url, { flags: 'w' })
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
