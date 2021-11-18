const { rooms } = require("./Classes/Room");

const roomIdDictionary = {};

const initiateSocket = (io) => {
  console.log(io);
  io.on("connection", (socket) => {
    socket.on("join", (roomcode) => {
      socket.join(roomcode);

      //broadcast guests list
      socket.emit("getGuests", rooms[roomcode].getMembers());
      socket.in(roomcode).emit("getGuests", rooms[roomcode].getMembers());

      //update calendar on user
      socket.emit("updateCalendar", rooms[roomcode].getCalendar());

      roomIdDictionary[socket.id] = roomcode;
    });

    socket.on("setIcon", (date, icon, index) => {
      let roomcode = roomIdDictionary[socket.id];
      rooms[roomcode].setCalendarIcon(date, icon, index);
      socket.in(roomcode).emit("updateCalendar", rooms[roomcode].getCalendar());
    });

    socket.on("disconnect", () => {
      const roomcode = roomIdDictionary[socket.id];
      if (rooms[roomcode]) {
        rooms[roomcode].removeMember(socket.id);
        socket.in(roomcode).emit("getGuests", rooms[roomcode].getMembers());
      }
    });

    socket.on("moveMouse", (userid, x, y) => {
      const roomcode = roomIdDictionary[socket.id];
      socket.in(roomcode).emit("updateMouse", userid, x, y);
    });
  });
};

module.exports = { initiateSocket };
