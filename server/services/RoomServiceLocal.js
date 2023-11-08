
const TABLE_NAME_ROOMS = "rooms";

/**
 * // [{ id, name, sessionId, recorderSessionId }]
 */

class RoomServiceLocal {
  constructor(store) {
    this.db = store;
  }

  async listRooms () {
    return Array.from(this.db.values());
  }

  async delRooms () {
    return this.db = new Map();
  }

  async initRooms (arr) {
    arr.forEach((data, index) => {
      let id = `room-${index}`;
      this.db.set(id, { id, ...data });
    });
  }

  async getRoomById(id) {
    return this.db.get(id);
  }

  async addRoom(id, data) {
    let room = await this.getRoomById(id);
    if (room) return room;
    this.db.set(id, { id, ...data });
    return await this.getRoomById(id);
  }

  async updateRoom(id, data) {
    let room = await this.getRoomById(id);
    if (!room) return null;
    this.db.set(id, { ...room, ...data });
    return await this.getRoomById(id);
  }

  async getRoomByRecorderSessionId(sessionId) {
    for (const room of this.db.values()) {
      if (room.recorderSessionId == sessionId) return room; 
    }
    return null;
  }

  async getRoomByRecorderRenderId(renderId) {
    for (const room of this.db.values()) {
      if (room.recorderRenderId == renderId) return room; 
    }
    return null;
  }
}

module.exports = RoomServiceLocal;
