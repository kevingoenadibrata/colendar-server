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

  clearMarkings(index) {
    for (let key in this.calendar) {
      this.calendar[key][index] = 0;
    }
  }

  clearCalendar() {
    this.calendar = {};
  }

  getCalendar() {
    return this.calendar;
  }

  addMember(id, name) {
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].id === id) {
        this.members[i].name = name;
        this.members[i].isOccupied = true;
        this.members[i].isActive = true;
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

  exitMember(id) {
    console.log(id);
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].id === id) {
        this.members[i].isActive = false;
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
    return this.members.filter((item) => item.isOccupied && item.isActive);
  }
}

module.exports = { rooms, Room };
