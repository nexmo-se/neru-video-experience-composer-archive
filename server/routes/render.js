const express = require("express");
const createHttpError = require("http-errors");
const router = express.Router();

/** */
function Router(services) {
  const { opentok, APP_URL } = services;
  
  router.get("/history(/:sessionId)?", async function (req, res, next) {
    try {
      let sessionId = req.params.sessionId || null;
      let items = await opentok.listRenders({ sessionId });
      return res.json(items);
    } catch (e) {
      next(e);
    }
  });
  
  router.get("/get/:renderId", async function (req, res, next) {
    try {
      let { renderId } = req.params;
      if (!renderId) throw new createHttpError(400, "empty params or body");
      let render = await opentok.getRender(renderId);
      res.json(render);
    } catch (e) {
      next(e);
    }
  });
  
  router.post("/start/:sessionId", async function (req, res, next) {
    try {
      let { sessionId } = req.params;
      if (!sessionId || !req.body.url) throw new createHttpError(400, "empty params or body");
      let render = await opentok.startRender(sessionId, req.body.url, req.body);
      res.json(render);
    } catch (e) {
      next(e);
    }
  });
  
  router.post("/stop/:renderId", async function (req, res, next) {
    try {
      let { renderId } = req.params;
      if (!renderId) throw new createHttpError(400, "empty params or body");
      await opentok.stopRender(renderId);
      
      res.json({ msg: "stopped" });
    } catch (e) {
      next(e);
    }
  });

  return router;
}

module.exports = Router;
