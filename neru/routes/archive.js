const express = require('express');
const router = express.Router();

/** */
function Router(services) {
  const { opentok } = services;

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
        let { archives: items, count } = await opentok.listArchives({ offset, count: pageSize });
        if (count < 1) break;
        totalCount = count;
        if (items && sessionId) items = items.filter(i => (i.sessionId === sessionId));
        if (items && items.length) data = data.concat(items);
        page ++;
        // } while (totalCount >= offset + pageSize);
      } while (false);
      
      return res.json(data);
    } catch(e) {
      next(e);
    }
  });
  
  router.get('/download/:archiveId', function (req, res, next) {
    var { archiveId } = req.params;
    if (!archiveId) return res.send(500, 'empty params archiveId');
    try {
      opentok.getArchive(archiveId, function (err, archive) {
        if (err) {
          let errMsg = `[${req.path}] getArchive ${err.message} ${archiveId}`;
          return res.status(500).send(errMsg);
        }
        return res.redirect(archive.url);
      });
    } catch(e) {
      next(e);
    }
  });
  
  router.post('/start/:sessionId', function (req, res, next) {
    let { sessionId } = req.params;
    if (!sessionId) return res.status(500).send('empty params');
    let archiveOptions = {};
    try {
      opentok.startArchive(sessionId, archiveOptions, function (err, archive) {
        if (err) {
          let errMsg = `[${req.path}] startArchive ${err.message} ${sessionId}`;
          return res.status(500).send(errMsg);
        }
        return res.json(archive);
      });
    } catch(e) {
      next(e);
    }
  });
  
  router.get('/stop/:archiveId', function (req, res, next) {
    var { archiveId } = req.params;
    if (!archiveId) return res.send(500, 'empty params archiveId');
    try {
      opentok.stopArchive(archiveId, function (err, archive) {
        if (err) {
          let errMsg = `[${req.path}] stopArchive ${err.message} ${archiveId}`;
          return res.status(500).send(errMsg);
        }
        return res.json(archive);
      });
    } catch(e) {
      next(e);
    }
  });
  
  router.delete('/delete/:archiveId', function (req, res, next) {
    var { archiveId } = req.params;
    if (!archiveId) return res.send(500, 'empty params archiveId');
    try {
      opentok.deleteArchive(archiveId, function (err) {
        if (err) {
          let errMsg = `[${req.path}] deleteArchive ${err.message} ${archiveId}`;
          return res.status(500).send(errMsg);
        }
        return res.json({});
      });
    } catch(e) {
      next(e);
    }
  });

  return router;
}

module.exports = Router;
