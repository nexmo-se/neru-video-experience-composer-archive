const express = require("express");
const router = express.Router();

function Router(services) {
  const { opentok, roomService } = services;

  router.all("/ec/recorder", async function (req, res, next) {
    try {
      console.log(JSON.stringify(req.body));

      let { id, status } = req.body;
      let room = await roomService.getRoomByRecorderRenderId(id);
      if (room) {
        if ("stopped" === status || "failed" === status) {
          await onRecorderRenderStopped(roomService, opentok, room);
        }
        else if ("started" === status) {
          await onRecorderRenderStarted(roomService, opentok, room);
        }
      }

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  });

  router.all("*", async function (req, res, next) {
    try {
      console.log(JSON.stringify(req.body));
      
      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  });

  return router;
}

const onRecorderRenderStopped = async (roomService, opentok, room) => {
  if (room.recorderArchiveId) {
    try {
      await opentok.stopArchive(room.recorderArchiveId);
    } catch (error) {
      console.log(error.message);
    }
  }

  await roomService.updateRoom(room.id, {
    recorderRenderId: null,
    recorderArchiveId: null,
  });

  try {
    await opentok.sendSignal(room.sessionId, `recorder`, {
      status: "stopped",
      recorderSessionId: room.recorderSessionId,
    });
  } catch (error) {
    console.log(error.message);
  }
}

const onRecorderRenderStarted = async (roomService, opentok, room) => {
  try {
    let archive = await opentok.startArchive(room.recorderSessionId, {
      resolution: "1280x720"
    });

    await roomService.updateRoom(room.id, {
      recorderArchiveId: archive.id,
    });

    try {
      await opentok.sendSignal(room.sessionId, `recorder`, {
        status: "started",
        recorderSessionId: room.recorderSessionId,
      });
    } catch (error) {
      console.log(error.message);
    }
  } catch (error) {
    console.log(error.message);
    try {
      await opentok.stopRender(room.recorderRenderId);
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = Router;
