const express = require("express");
const createHttpError = require("http-errors");
const router = express.Router();

function Router(services) {
  const { opentok, roomService } = services;

  router.post("/:roomId/token", async function (req, res, next) {
    try {
      let { roomId } = req.params;
      let { role, username } = req.body;
      let room = await roomService.getRoomById(roomId);
      if (!room) throw new createHttpError(404);
      let token = opentok.generateToken(room.sessionId, role, { username });
      return res.json({ ...room, token });
    } catch (e) {
      next(e);
    }
  });

  // router.post("/create", async function (req, res, next) {
  //   try {
  //     let { roomId } = req.body;
  //     let room = await roomService.getRoomById(roomId);
  //     if (!room) {
  //       const session = await opentok.createSession();
  //       room = await roomService.addRoom(roomId, {...session, apiKey: process.env.OT_API_KEY});
  //     }
  //     return res.json(room);
  //   } catch (e) {
  //     next(e);
  //   }
  // });
  
  router.post("/init", async function (req, res, next) {
    try {
      // // for testing
      if (process.env.TESTING_ROOMS) {
        let arr = JSON.parse(process.env.TESTING_ROOMS);
        if (arr.length) roomService.initRooms(arr);
      }
      let data = await roomService.listRooms();
      return res.json(data);
    } catch (e) {
      console.log(e.message);
      next(e);
    }
  });

  router.get("/list", async function (req, res, next) {
    try {
      let data = await roomService.listRooms();
      return res.json(data);
    } catch (e) {
      console.log(e.message);
      next(e);
    }
  });

  router.post("/:roomId/signal", async function (req, res, next) {
    try {
      let { roomId } = req.params;
      let room = await roomService.getRoomById(roomId);
      if (!room) throw new createHttpError(404);

      await opentok.sendSignal(room.sessionId, req.body.type || "test", req.body.data || {});

      res.json({ msg: "signal sent" });
    } catch (e) {
      next(e);
    }
  });

  router.post("/:roomId/archive/start", async function (req, res, next) {
    try {
      let { roomId } = req.params;
      let room = await roomService.getRoomById(roomId);
      if (!room) throw new createHttpError(404);
      
      let archive = await opentok.startArchive(room.sessionId);

      await roomService.updateRoom(room.id, {
        archiveId: archive.id
      });

      await opentok.sendSignal(room.sessionId, `archive`, {
        status: archive.status, 
        archiveId: archive.id
      });

      res.json(archive);
    } catch(e) {
      next(e);
    }
  });
  
  router.post("/:roomId/archive/stop", async function (req, res, next) {
    try {
      let { roomId } = req.params;
      let room = await roomService.getRoomById(roomId);
      if (!room) throw new createHttpError(404);

      try {
        if (room.archiveId) {
          await opentok.stopArchive(room.archiveId);
        }
      } catch (error) {}
      
      try {
        await roomService.updateRoom(room.id, {
          archiveId: null
        });
      } catch (error) {}

      try {
        await opentok.sendSignal(room.sessionId, `archive`, {
          status: "stopped"
        });
      } catch (error) {}

      res.json({ msg: "stopped" });
    } catch(e) {
      next(e);
    }
  });

  router.get("/:roomId/info", async function (req, res, next) {
    try {
      let { roomId } = req.params;
      let room = await roomService.getRoomById(roomId);
      if (!room) throw new createHttpError(404);
      if (room.archiveId) {
        let archive = await opentok.getArchive(room.archiveId);
        return res.json({...room, archive});
      }
      return res.json(room);
    } catch (e) {
      next(e);
    }
  });

  return router;
}

module.exports = Router;
