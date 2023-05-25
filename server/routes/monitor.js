const express = require('express');
const router = express.Router();

function Router(services) {
  // const { opentok, state } = services;
  // router.all('/archive', async function (req, res, next) {
  //   try {
  //     console.log(JSON.stringify(req.body, null, 2));
  //     const sessionId = req.body.sessionId ?? null;
  //     const status = req.body.status ?? null;
  //     if (!sessionId || !status) return res.sendStatus(200);
  //     const room = await state.getRoomByRecorderSessionId(sessionId);
  //     if (!room) return res.sendStatus(200);
  //     await opentok.sendSignal(room.sessionId, `recorder:${status}`);
  //     res.sendStatus(200);
  //   } catch (e) {
  //     next(e)
  //   }
  // });

  router.all('/*', async function (req, res, next) {
    try {
      console.log(JSON.stringify(req.body, null, 2));
      res.sendStatus(200);
    } catch (e) {
      next(e)
    }
  });

  return router;
}

module.exports = Router