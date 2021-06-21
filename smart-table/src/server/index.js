const isDevelopment = process.env.NODE_NODE_ENV === 'development'
console.log(isDevelopment)
const history = require('connect-history-api-fallback')
const path = require('path')
const port = process.env.NODE_PORT || 9090
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '* ',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
})


console.log(process.env.NODE_PORT, process.env.NODE_ENV)
io.on('connection', socket => {
  console.log('a user connected')
})

io.sockets.on('connection', function (socket) {
  socket.on('change-page', data => {
    io.sockets.emit('show-next-page', data)
  })
})

if (!isDevelopment) {
  app.use(history())
  app.use(express.static(path.join(__dirname, './../../dist')))
}

server.listen(port, () => {
  console.log(`Приложение запущенно на - http://localhost:${port}/`)
})
