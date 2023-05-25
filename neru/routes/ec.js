const express = require('express');
const router = express.Router();

/** */
function Router(services) {
  const { opentok, appUrl } = services;
  
  router.get('/history', async function (req, res, next) {
    try {
      var page = req.query.page || 1;
      var offset = (page - 1) * 5;
      let { items, count } = await opentok.listRenders({ offset: offset, count: 5 });
      return res.json({
        items: items,
        showPrevious: page > 1 ? ('/history?page=' + (page - 1)) : null,
        showNext: (count > offset + 5) ? ('/history?page=' + (page + 1)) : null
      });
    } catch (e) {
      next(e)
    }
  });
  
  router.get('/get/:renderId', async function (req, res, next) {
    try {
      var { renderId } = req.params;
      if (!renderId) return res.status(500).send( 'empty params renderId');
      let render = await opentok.getRender(renderId);
      res.json(render);
    } catch (e) {
      next(e)
    }
  });
  
  router.post('/start/:sessionId', async function (req, res, next) {
    try {
      let { sessionId } = req.params;
      let { url } = req.body;
      if (!url || !sessionId) return res.status(500).send('empty params');
      let renderOptions = {
        url,
        maxDuration: req.body.maxDuration ?? 1800,
        resolution: req.body.resolution ?? '1280x720',
        statusCallbackUrl: `${appUrl}/monitor/ec`
      };
      if (req.body.name) renderOptions.properties = { name: req.body.name };
      let render = await opentok.startRender(sessionId, renderOptions);
      res.json(render);
    } catch (e) {
      next(e)
    }
  });
  
  router.get('/stop/:renderId', async function (req, res, next) {
    try {
      var { renderId } = req.params;
      if (!renderId) return res.status(500).send('empty params renderId');
      await opentok.stopRender(renderId);
      res.json({});
    } catch (e) {
      next(e)
    }
  });

  return router;
}

module.exports = Router;