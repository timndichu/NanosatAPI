"use strict";

const express = require("express");
const { Server } = require("ws");

const PORT = process.env.PORT || 3000;
const INDEX = "/index.html";

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

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
  ws.send("something");
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
