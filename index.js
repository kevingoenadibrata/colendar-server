const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("This is the server");
});

class Room {
  constructor(name) {
    this.name = name;
    this.members = [
      { name: "", id: "", index: 0, isOccupied: false },
      { name: "", id: "", index: 1, isOccupied: false },
      { name: "", id: "", index: 2, isOccupied: false },
      { name: "", id: "", index: 3, isOccupied: false },
      { name: "", id: "", index: 4, isOccupied: false },
      { name: "", id: "", index: 5, isOccupied: false },
    ];
    this.calendar = {};
  }

  setCalendarIcon(date, icon, index) {
    if (!this.calendar[date]) {
      this.calendar[date] = [0, 0, 0, 0, 0, 0];
    }
    this.calendar[date][index] = icon;
  }

  getCalendar() {
    return this.calendar;
  }

  addMember(id, name) {
    for (let i = 0; i < this.members.length; i++) {
      if (!this.members[i].isOccupied) {
        this.members[i].name = name;
        this.members[i].id = id;
        this.members[i].isOccupied = true;
        return this.members[i].index;
      }
    }
    return -1;
  }

  removeMember(id) {
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].id === id) {
        this.members[i].isOccupied = false;
      }
    }
  }

  setName(index, name) {
    this.members[index].name = name;
  }

  getMembers() {
    return this.members.filter((item) => item.isOccupied);
  }
}

const rooms = {};

io.on("connection", (socket) => {
  console.log("a user connected");
  if (!rooms["testroom"]) {
    rooms["testroom"] = new Room("testroom");
  }

  let addMemberResponse = rooms["testroom"].addMember(socket.id, "");
  if (addMemberResponse === -1) {
    return;
  }
  socket.join("testroom");

  socket.on("hello", () => {
    socket.emit("getGuests", rooms["testroom"].getMembers());
    socket.in("testroom").emit("getGuests", rooms["testroom"].getMembers());
  });

  socket.on("setname", (name, index) => {
    rooms["testroom"].setName(index, name);
    socket.emit("getGuests", rooms["testroom"].getMembers());
    socket.in("testroom").emit("getGuests", rooms["testroom"].getMembers());
  });

  socket.on("setIcon", (date, icon, index) => {
    rooms["testroom"].setCalendarIcon(date, icon, index);
    socket
      .in("testroom")
      .emit("updateCalendar", rooms["testroom"].getCalendar());
  });

  socket.on("disconnect", () => {
    rooms["testroom"].removeMember(socket.id);
    socket.in("testroom").emit("getGuests", rooms["testroom"].getMembers());
  });

  socket.on("moveMouse", (index, x, y) => {
    socket.in("testroom").emit("updateMouse", index, x, y);
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
