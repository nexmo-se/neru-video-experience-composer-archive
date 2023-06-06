const rooms = new Map();

// const STATE_HASH_TABLE_ROOMS = 'rooms';

/**
 * 
 */
module.exports = () => ({
  async delRooms () {
    return;
  },
  async initRooms (arr) {
    arr.forEach((data, index) => {
      let id = `room-${index}`;
      rooms.set(id, { 
        id, 
        ...data, 
      });
    });
  },

  async getRoomById(id) {
    return rooms.get(id);
  },

  async addRoom(id, data) {
    let room = await this.getRoomById(id);
    if (room) return room;
    rooms.set(id, { id, ...data });
    return await this.getRoomById(id);
  },

  async updateRoomById(id, data) {
    let room = await this.getRoomById(id);
    if (!room) return null;
    rooms.set(id, { ...room, ...data });
    return await this.getRoomById(id);
  },

  async getRoomBySessionId(sessionId) {
    for (const [id, room] of rooms.entries()) {
      if (room.sessionId == sessionId) return room; 
    }
    return null;
  },

  async getRoomByRecorderSessionId(sessionId) {
    for (const [id, room] of rooms.entries()) {
      if (room.recorderSessionId == sessionId) return room; 
    }
    return null;
  },

});
