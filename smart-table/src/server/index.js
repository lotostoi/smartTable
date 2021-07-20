const isDevelopment = process.env.NODE_NODE_ENV === "development";
const history = require("connect-history-api-fallback");
const path = require("path");
const fs = require("fs");
const port = process.env.NODE_PORT || 9090;
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const TOKEN_SECRET_KEY  = require('./src/config/secret-key')
const auth = require('./src/routes/auth')
const jwt = require("jsonwebtoken");

const projectRouter = require("./src/routes/projects");

const connectToMongoDb = require("./src/lib/connect-db");
const configDb = require("./src/config/db");

const configFile = path.join(__dirname, "data/config.json");

const io = require("socket.io")(server, {
  cors: {
    origin: "* ",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {});

io.sockets.on("connection", function (socket) {
  socket.on("change-page", (data) => {
    io.sockets.emit("show-next-page", data);
  });
});



app.use(express.urlencoded({ extended: false }));
app.use(express.json());



app.use("**", (req, res, next) => {
  req.updateContent = () => io.sockets.emit("update-content");
  next();
});

if (!isDevelopment) {
  app.use(history());
  app.use(express.static(path.join(__dirname, "./../../dist")));
}


const mustBeAuthorizationRestApi = (req, res, next) => {
  if (req.params.token) {
    jwt.verify(req.params.token, TOKEN_SECRET_KEY, (err, data) => {
      if (err) return next()
      delete data.password
      req.user = data
      next()
    })
  } else {
    next()
  }
}


app.use('*/:token', mustBeAuthorizationRestApi)
app.use(auth)


app.get("/api/files/:img", (req, res) => {
  res.sendFile(path.join(__dirname, "files", req.params.img));
});

app.use("/", projectRouter);

app.get("/api/get-config", (req, res) => {
  fs.readFile(configFile, "utf-8", (err, data) => {
    if (err) return res.status(501);
    res.json(JSON.parse(data));
  });
});

app.put("/api/update-config", (req, res) => {
  fs.writeFile(configFile, JSON.stringify(req.body), (err) => {
    if (err) return res.status(501);
    io.sockets.emit("update-config", req.body);
    res.json({ result: true });
  });
});

connectToMongoDb(configDb, () =>
  server.listen(port, () => {
    console.log(`Приложение запущенно на - http://localhost:${port}/`);
  })
);
