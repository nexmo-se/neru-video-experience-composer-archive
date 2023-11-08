const express = require("express");
const createHttpError = require("http-errors")
const router = express.Router();

function Router(services) {
  const { opentok, roomService, APP_URL } = services;

  // create a new session for recording if non-exist
  router.post("/start/:roomId", async function (req, res, next) {
    try {
      let { roomId } = req.params;
      let room = await roomService.getRoomById(roomId);
      if (!room) throw new createHttpError(400);

      // 1. create a new session
      let recorderSessionId = room.recorderSessionId || null;
      if (!recorderSessionId) {
        const session = await opentok.createSession();
        recorderSessionId = session.sessionId;
        await roomService.updateRoom(room.id, { recorderSessionId });
      }

      // . inform others
      await opentok.sendSignal(room.sessionId, `recorder`, {
        status: "starting",
        recorderSessionId,
      });

      // 2. publish an Experience Composer stream to the new session
      let url = `${APP_URL}/viewing-room/${room.id}?ec=${Date.now()}`;
      let render = await opentok.startRender(recorderSessionId, url);
      if (!render) throw new createHttpError(500);

      await roomService.updateRoom(room.id, {
        recorderRenderId: render.id,
      });

      // . inform others
      await opentok.sendSignal(room.sessionId, `recorder`, {
        status: render.status,
        recorderSessionId,
        url
      });

      room = await roomService.getRoomById(roomId);
      return res.json(room);

    } catch (e) {
      next(e);
    }
  });
  
  router.post("/stop/:roomId", async function (req, res, next) {
    try {
      let { roomId } = req.params;
      let room = await roomService.getRoomById(roomId);
      if (!room) throw new createHttpError(400);

      // 0. 
      await roomService.updateRoom(room.id, {
        recorderRenderId: null,
        recorderArchiveId: null,
      });

      // 1. stop archiving
      if (room.recorderArchiveId) {
        try {
          await opentok.stopArchive(room.recorderArchiveId);
        } catch (error) {
          console.log(error.message);
        }
      }

      // 2. stop the Experience Composer
      if (room.recorderRenderId) {
        try {
          await opentok.stopRender(room.recorderRenderId);
        } catch (error) {
          console.log(error.message);
        }
      }

      // 3. inform others
      await opentok.sendSignal(room.sessionId, `recorder`, {
        status: "stopped",
        recorderSessionId: room.recorderSessionId,
      });

      room = await roomService.getRoomById(roomId);
      return res.json(room);

    } catch (e) {
      next(e);
    }
  });

  return router;
}

module.exports = Router;
