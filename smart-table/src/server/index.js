const port = 3000
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require("socket.io")(server, {
    cors: {
        origin: '* ',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    }
})


/* app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
 */

io.on('connection', (socket) => {
    console.log('a user connected')
})

io.sockets.on('connection', function (socket) {
    console.log(socket.id)

    socket.on('change-page', (data) => {
        io.sockets.emit('show-next-page', data )
    })

})
server.listen(3000, () => {
    console.log(`Приложение запущенно на - http://localhost:${port}/`)
})
