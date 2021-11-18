const { rooms } = require("./Classes/Room");

const roomIdDictionary = {};
const userIdDictionary = {};

const initiateSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("join", (roomcode, id) => {
      socket.join(roomcode);

      //broadcast guests list
      socket.emit("getGuests", rooms[roomcode].getMembers());
      socket.in(roomcode).emit("getGuests", rooms[roomcode].getMembers());

      //update calendar on user
      socket.emit("updateCalendar", rooms[roomcode].getCalendar());

      roomIdDictionary[socket.id] = roomcode;
      userIdDictionary[socket.id] = id;
    });

    socket.on("setIcon", (date, icon, index) => {
      let roomcode = roomIdDictionary[socket.id];
      rooms[roomcode].setCalendarIcon(date, icon, index);
      socket.in(roomcode).emit("updateCalendar", rooms[roomcode].getCalendar());
    });

    socket.on("disconnect", (id) => {
      const roomcode = roomIdDictionary[socket.id];
      console.log("disconnect!");
      if (rooms[roomcode]) {
        rooms[roomcode].exitMember(userIdDictionary[socket.id]);
        socket.in(roomcode).emit("getGuests", rooms[roomcode].getMembers());
        console.log(rooms[roomcode]);
      }
    });

    socket.on("moveMouse", (userid, x, y) => {
      const roomcode = roomIdDictionary[socket.id];
      socket.in(roomcode).emit("updateMouse", userid, x, y);
    });
  });
};

module.exports = { initiateSocket };
