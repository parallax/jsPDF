/* eslint-disable no-console */
'use strict'

/**
 * The reference server collects and saves reference PDFs for the tests.
 */
const http = require('http')
const PORT = 9090
const fs = require('fs')
const logUtils = require('log-utils')
const chalk = require('chalk')

// Create a server
const server = http.createServer((request, response) => {
  const wstream = fs.createWriteStream(`./${request.url}`)

  wstream.on('error', () => {
    wstream.close()
    console.log(
        `${logUtils.timestamp} ${logUtils.error} ` +
        chalk.red(`Could not write to file '${request.url}'. Is it locked by another process?`)
    )
  })

  request.on('data', chunk => {
    wstream.write(chunk)
  })
  request.on('end', () => {
    wstream.end()
    console.log(logUtils.timestamp + ' ' + logUtils.ok(`Created reference '${request.url}'`))
  })
  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*'
  })
  response.end('Test has sent reference for ' + request.url)
})

// Lets start our server
server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`)
})
