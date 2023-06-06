const express = require('express');
const router = express.Router();

/** */
function Router(services) {
  const { opentok, appUrl } = services;
  
  router.get('/history(/:sessionId)?', async function (req, res, next) {
    var { sessionId } = req.params;
    var page = req.query.page || 1;
    var pageSize = 20;
    var data = [];
    try {
      var totalCount = 0;
      var offset = 0;
      do {
        offset = (page - 1) * pageSize;
        let { items, count } = await opentok.listRenders({ offset, count: pageSize });
        if (count < 1) break;
        totalCount = count;
        if (items && sessionId) items = items.filter(i => (i.sessionId === sessionId));
        if (items && items.length) data = data.concat(items);
        page ++;
      // } while (totalCount >= offset + pageSize);
      } while (false);
      
      return res.json(data);
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
