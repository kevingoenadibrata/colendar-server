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

  get members() {
    return this.members.filter((item) => item.isOccupied);
  }
}
