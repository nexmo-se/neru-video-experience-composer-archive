
const TABLE_NAME_ROOMS = "rooms";

/**
 * // [{ id, name, sessionId, recorderSessionId }]
 */

class RoomServiceVcr {
  constructor(store) {
    this.state = store;
  }

  async listRooms () {
    try {
      const items = await this.state.hvals(TABLE_NAME_ROOMS);
      items.forEach((i, k) => items[k] = JSON.parse(i));
      return items;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  async delRooms () {
    return await this.state.delete(TABLE_NAME_ROOMS);
  }

  async initRooms (arr) {
    arr.filter(async (room, index) => {
      let id = `room-${index}`;
      await this.state.hset(TABLE_NAME_ROOMS, {
        [id]: JSON.stringify({ id, ...room }) 
      });
    });
  }

  async getRoomById(id) {
    try {
      let str = await this.state.hget(TABLE_NAME_ROOMS, id);
      return str? JSON.parse(str) : null;
    } catch (e) {
      return null;
    }
  }

  async addRoom(id, data) {
    try {
      let room = await this.getRoomById(id);
      if (room) return room;
      await this.state.hset(TABLE_NAME_ROOMS, {
        [id]: JSON.stringify({ id, ...room, ...data }) 
      });
      return await this.getRoomById(id);
    } catch (e) {
      return null;
    }
  }

  async updateRoom(id, data) {
    try {
      let room = await this.getRoomById(id);
      if (!room) return null;
      await this.state.hset(TABLE_NAME_ROOMS, {
        [id]: JSON.stringify({ id, ...room, ...data }) 
      });
      return await this.getRoomById(id);
    } catch (e) {
      return null;
    }
  }

  async getRoomByRecorderSessionId(sessionId) {
    try {
      const items = await this.listRooms();
      for (const room of items) {
        if (room && room.recorderSessionId == sessionId) return room;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async getRoomByRecorderRenderId(renderId) {
    try {
      const items = await this.listRooms();
      for (const room of items) {
        if (room && room.recorderRenderId == renderId) return room;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

}

module.exports = RoomServiceVcr;

