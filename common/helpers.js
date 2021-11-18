const { customAlphabet } = require("nanoid");
const { rooms } = require("../Classes/Room");

const shortuuid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 8);

const getRoomCode = () => {
  let pass = false;
  let roomid = "";
  while (!pass) {
    roomid = shortuuid();
    console.log(roomid);
    if (!rooms[roomid]) {
      pass = true;
    }
  }
  return roomid;
};

module.exports = { getRoomCode };
