const express = require("express");
const router = express.Router();

function Router(services) {
  const { opentok, roomService } = services;

  router.all("/:roomId/token", async function (req, res, next) {
    try {
      let { roomId } = req.params;
      let { role, username } = req.body;
      let room = await roomService.getRoomById(roomId);
      if (!room) throw new createHttpError(400);
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

  router.all("/list", async function (req, res, next) {
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
      if (!room) throw new createHttpError(400);

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
      if (!room) throw new createHttpError(400);
      
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
  
  router.all("/:roomId/archive/stop", async function (req, res, next) {
    try {
      let { roomId } = req.params;
      let room = await roomService.getRoomById(roomId);
      if (!room) throw new createHttpError(400);

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

  router.all("/:roomId/info", async function (req, res, next) {
    try {
      let { roomId } = req.params;
      let room = await roomService.getRoomById(roomId);
      if (!room) throw new createHttpError(400);
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
