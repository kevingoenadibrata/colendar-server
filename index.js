const express = require("express");
const cors = require("cors");
const http = require("http");
const { json, urlencoded } = require("body-parser");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const { Server } = require("socket.io");
const { Room, rooms } = require("./Classes/Room");
const { initiateSocket } = require("./socket");
const { SECRET } = require("./common/constants");
const { getRoomCode } = require("./common/helpers");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.options("*", cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("This is the server");
});

app.post("/token", (req, res) => {
  const providedToken = req.body.token;
  const providedInitials = req.body.initials;
  let user;

  try {
    user = jwt.verify(providedToken, SECRET);
    user.initials = providedInitials;
  } catch (e) {
    console.log(e);
    user = { id: uuid(), initials: providedInitials };
  }

  const token = jwt.sign(user, SECRET);
  res.send({ token, initials: user.initials, id: user.id, ok: true });
});

app.post("/user", (req, res) => {
  const providedToken = req.body.token;
  let user;
  try {
    user = jwt.verify(providedToken, SECRET);
    res.send({ ...user, ok: true });
  } catch (e) {
    res.send({ error: e });
  }
});

app.post("/join/:id", (req, res) => {
  const token = req.body.token;
  let user;

  try {
    user = jwt.verify(token, SECRET);
  } catch (e) {
    res.send({ error: e });
    return;
  }

  if (rooms[req.params.id]) {
    if (rooms[req.params.id].addMember(user.id, user.initials) !== -1) {
      res.send({
        roomcode: req.params.id,
        user: user,
        ok: true,
      });
    } else {
      res.send({ error: "Room is Full" });
    }
  } else {
    res.send({ error: "Room ID is Invalid" });
  }
});

app.post("/rooms", (req, res) => {
  const roomid = getRoomCode();
  rooms[roomid] = new Room(roomid);
  res.send({ roomcode: roomid, ok: true });
});

app.get("/rooms/:id", (req, res) => {
  const roomid = req.params.id;

  if (rooms[roomid]) {
    res.send({
      id: rooms[roomid].name,
      occupied: rooms[roomid].getMembers().length,
      ok: true,
    });
  } else {
    res.status(404).send({ error: "Room ID is Invalid" });
  }
});

initiateSocket(io);

server.listen(process.env.PORT || 3001, () => {
  console.log("listening on *:process.env.PORT");
});
