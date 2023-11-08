const express = require("express");
const createHttpError = require("http-errors");
const router = express.Router();

/** */
function Router(services) {
  const { opentok, roomService } = services;

  router.get("/history(/:sessionId)?", async function (req, res, next) {
    try {
      let sessionId = req.params.sessionId || null;
      let items = await opentok.listArchives({ sessionId });
      return res.json(items);
    } catch(e) {
      next(e);
    }
  });

  router.get("/get/:archiveId", async function (req, res, next) {
    try {
      let { archiveId } = req.params;
      if (!archiveId) throw new createHttpError(400, "empty params or body");
      let archive = await opentok.getArchive(archiveId);
      res.json(archive);
    } catch(e) {
      next(e);
    }
  });
  
  router.post("/start/:sessionId", async function (req, res, next) {
    try {
      let { sessionId } = req.params;
      if (!sessionId) throw new createHttpError(400, "empty params or body");
      
      let archive = await opentok.startArchive(sessionId);

      if (sessionId) await opentok.sendSignal(sessionId, `archive`, {
        status: archive.status, 
        archiveId: archive.id
      });

      res.json(archive);
    } catch(e) {
      next(e);
    }
  });
  
  router.post("/stop/:archiveId", async function (req, res, next) {
    try {
      let { archiveId } = req.params;
      if (!archiveId) throw new createHttpError(400, "empty params or body");
      let { sessionId } = req.body;

      try {
        await opentok.stopArchive(archiveId);
      } catch (error) {}

      try {
        if (sessionId) await opentok.sendSignal(sessionId, `archive`, {
          status: "stopped"
        });
      } catch (error) {}

      res.json({ msg: "stopped" });
    } catch(e) {
      next(e);
    }
  });
  
  router.post("/delete/:archiveId", async function (req, res, next) {
    try {
      let { archiveId } = req.params;
      if (!archiveId) throw new createHttpError(400, "empty params or body");
      await opentok.deleteArchive(archiveId);
      
      res.json({ msg: "deleted" });
    } catch(e) {
      next(e);
    }
  });

  return router;
}

module.exports = Router;
