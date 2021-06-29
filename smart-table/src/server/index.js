const isDevelopment = process.env.NODE_NODE_ENV === "development";
const history = require("connect-history-api-fallback");
const path = require("path");
const fs = require('fs');
const port = process.env.NODE_PORT || 9090;
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const multer = require('multer');

const configFile = path.join(__dirname, 'data/config.json');

const io = require("socket.io")(server, {
  cors: {
    origin: "* ",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});


io.on("connection", (socket) => {
  // console.log("a user connected");
});

io.sockets.on("connection", function (socket) {
  socket.on("change-page", (data) => {
    io.sockets.emit("show-next-page", data);
  });
});


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(multer().array());

if (!isDevelopment) {
  app.use(history());
  app.use(express.static(path.join(__dirname, "./../../dist")));
}

app.get('/api/get-config', (req, res) => {

  fs.readFile(configFile, 'utf-8', (err, data) => {
    if (err) return res.status(501);
    res.json(JSON.parse(data));
  });
});

app.put('/api/update-config', (req, res) => {
  console.log(req.body);

  fs.writeFile(configFile, JSON.stringify(req.body), (err) => {
    if (err) return res.status(501);
    res.json({ result: true });
  });

});


server.listen(port, () => {
  console.log(`Приложение запущенно на - http://localhost:${port}/`);
});
