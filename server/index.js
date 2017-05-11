const config = require('./config')
const app = require('./app')

const PORT = process.env.PORT || config.port

// Why don't I need http createServer
app.listen(PORT, () => {
  console.log(`✅  The server is running at http://localhost:${PORT}!`)
})
app.on('error', onError)

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}