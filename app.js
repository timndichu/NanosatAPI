"use strict";

const express = require("express");
var WebSocketServer = require("ws").Server;

const app = express();
const bodyParser = require("body-parser");
const mainRoutes = require("./routes/main_routes");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const mongoose = require("mongoose");
const path = require("path");

const server = http.createServer(app);
var wss = new WebSocketServer({server: server});

app.use(helmet());
app.use(cors());
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Data Sanitization against NoSQL Injection Attacks
app.use(mongoSanitize());
// Data Sanitization against XSS attacks
app.use(xss());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "*"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.static(path.join(__dirname, "public")));

const heartbeat = (ws) => {
  ws.isAlive = true;
};
const ping = (ws) => {
  // do some stuff
  console.log("Hey still there?");
};

wss.on("connection", function connection(ws) {
  console.log("Client connected");
  ws.isAlive = true;
  ws.on("pong", () => {
    heartbeat(ws);
  });
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    wss.clients.forEach((client) => {
      client.send(message);
    });
  });
 
  ws.on("close", () => console.log("Client disconnected"));
});

setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping(() => {
      ping(ws);
    });
  });
}, 30000);

// const INDEX = "/index.html";
// app.use('/',(req, res) =>
// {
//   res.sendFile(INDEX, { root: __dirname })
// }
// );

app.use('/dashboard', mainRoutes);


// heroku api url:  https://nanosat.herokuapp.com/



const Port = process.env.PORT || 3001;

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.f33qdiz.mongodb.net/nanosat`, {useNewUrlParser: true, useUnifiedTopology: true}).then(result=> {

    console.log("Database connection successful");
 

server.listen(Port);
})
// mongoose.connect(`mongodb+srv://timndichu:Porshe911@cluster0.f33qdiz.mongodb.net/nanosat`, {useNewUrlParser: true, useUnifiedTopology: true}).then(result=> {

//     console.log("Database connection successful");
 

// app.listen(Port);
// })

// URL: https://nanosat.herokuapp.com/



