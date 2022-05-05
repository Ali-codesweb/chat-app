import express from "express";
import { createServer } from "http";
import cors from "cors";
import config from "config";
import { Server } from "socket.io";
import { log } from "./utils/logger";
import socket from "./utils/socket";
const port = config.get<number>("port");
const host = config.get<string>("host");
const corsOrigin = config.get<string>("corsOrigin");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
  
});

app.get("/", (req, res) => {
  res.send("server is up");
});

httpServer.listen(port, host, () => {
  log.info("Server is listening");
  log.info("http://" + host + ":" + port);
  socket({ io });
});
