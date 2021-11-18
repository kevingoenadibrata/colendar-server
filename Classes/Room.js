const rooms = {};
class Room {
  constructor(name) {
    this.name = name;
    this.members = [
      { name: "", id: "", index: 0, isOccupied: false, isActive: false },
      { name: "", id: "", index: 1, isOccupied: false, isActive: false },
      { name: "", id: "", index: 2, isOccupied: false, isActive: false },
      { name: "", id: "", index: 3, isOccupied: false, isActive: false },
      { name: "", id: "", index: 4, isOccupied: false, isActive: false },
      { name: "", id: "", index: 5, isOccupied: false, isActive: false },
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
    console.log(id);
    console.log(this.members);
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].id === id) {
        this.members[i].name = name;
        this.members[i].isOccupied = true;
        this.members[i].isActive = true;
        console.log(this.members[i]);
        return i;
      }
    }

    for (let i = 0; i < this.members.length; i++) {
      if (!this.members[i].isOccupied) {
        this.members[i].name = name;
        this.members[i].id = id;
        this.members[i].isOccupied = true;
        this.members[i].isActive = true;
        return i;
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

  checkMember(id) {
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].id === id && this.members[i].isOccupied) {
        return true;
      }
    }
    return false;
  }

  getMembers() {
    return this.members.filter((item) => item.isOccupied);
  }
}

module.exports = { rooms, Room };
