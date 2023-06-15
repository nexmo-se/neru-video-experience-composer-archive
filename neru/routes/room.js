const express = require('express');
const router = express.Router();

function Router(services) {
  const { opentok, state, appUrl } = services;

  /** */
  router.get('/:roomId', async function (req, res, next) {
    try {
      let { roomId } = req.params;
      let room = await state.getRoomById(roomId);
      if (!room) throw 'Not found room';
      res.json(room);
    } catch (e) {
      next(e);
    }
  });

  router.get('/:roomId/token', async function (req, res, next) {
    try {
      let { roomId } = req.params;
      let room = await state.getRoomById(roomId);
      // if (!room) throw 'Not found room';
      if (!room) {
        const session = await opentok.createSession();
        console.log(`[router] - ${req.path} opentok.createSession`, session.sessionId);
        room = await state.addRoom(roomId, { sessionId: session.sessionId });
      }
      let token = opentok.generateToken(room.sessionId, { role: 'moderator' });
      res.json({
        ...room,
        apiKey: process.env.OT_API_KEY,
        sessionId: room.sessionId,
        token: token
      });
    } catch (e) {
      next(e);
    }
  });

  // create another session[recorderSessionId] for archiving
  router.all('/:roomId/recorder/start', async function (req, res, next) {
    try {
      let { roomId } = req.params;
      let room = await state.getRoomById(roomId);
      if (!room) throw 'Not found room';

      if (!room.recorderSessionId) {
        const session = await opentok.createSession();
        console.log(`[router] - ${req.path} opentok.createSession for RECORD`, session.sessionId);
        room = await state.updateRoomById(roomId, { recorderSessionId: session.sessionId });
      }
      let sessionId = room.recorderSessionId;
      let resolution = req.body.resolution ?? '1280x720';
      let maxDuration = req.body.maxDuration ?? '1800'; // TODO: set a timer to stop recording
      // start EC render
      let url = `${appUrl}/video-room?room=${roomId}&ec=1&_v=${Date.now()}`;
      let renderOptions = {
        url,
        maxDuration: maxDuration,
        resolution: resolution,
        statusCallbackUrl: `${appUrl}/monitor/ec/recorder`
      };
      if (req.body.name) renderOptions.properties = { name: req.body.name };
      let render = await opentok.startRender(sessionId, renderOptions);
      room = await state.updateRoomById(roomId, { render });
      // start Recorder / Achive API
      let archiveOptions = {
        resolution: resolution,
      };
      let archive = await opentok.startRecorder(sessionId, archiveOptions);
      // 
      room = await state.updateRoomById(roomId, { archive });
      await opentok.sendSignal(room.sessionId, `recorder:started`);
      return res.json(room);
    } catch (e) {
      next(e);
    }
  });
  
  router.all('/:roomId/recorder/stop', async function (req, res, next) {
    try {
      let { roomId } = req.params;
      let room = await state.getRoomById(roomId);
      if (!room) throw 'Not found room';
      if (room.render) {
        await opentok.stopRender(room.render.id);
        room = await state.updateRoomById(roomId, { render: null });
      }
      if (room.archive) {
        await opentok.stopRecorder(room.archive.id);
        room = await state.updateRoomById(roomId, { archive: null });
      }
      room = await state.updateRoomById(roomId, { isRecording: false });
      await opentok.sendSignal(room.sessionId, `recorder:stopped`);
      return res.json({room});
    } catch (e) {
      next(e);
    }
  });

  return router;
}

module.exports = Router;
