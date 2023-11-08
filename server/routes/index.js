const express = require("express");
const router = express.Router();

const handleAuth = require("../handler/handleAuth");
const monitorRouter = require("./monitor");
const archiveRouter = require("./archive");
const renderRouter = require("./render");
const roomRouter = require("./room");
const recorderRouter = require("./recorder");

function Router(services) {

  /** */
  router.use("/monitor/", monitorRouter(services));
  /** */
  router.use("/api/archive/", handleAuth, archiveRouter(services));
  router.use("/api/render/", handleAuth, renderRouter(services)); 
  router.use("/api/room/", handleAuth, roomRouter(services));
  router.use("/api/recorder/", handleAuth, recorderRouter(services)); // customize recording


  router.use("/api/*", function (req, res, next) {
    return res.sendStatus(200);
  });

  return router;
}

module.exports = Router;
