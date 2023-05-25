const express = require('express');
const router = express.Router();

const roomRouter = require('./room');
const archiveRouter = require('./archive');

const monitorRouter = require('./monitor');
const ecRouter = require('./ec');

function Router(services) {
  const { opentok, state } = services;
  /** */
  router.use('/monitor/', monitorRouter(services));
  router.use('/api/archive/', archiveRouter(services));
  router.use('/api/ec/', ecRouter(services));

  router.use('/api/room', roomRouter(services));

  /** */
  router.all('/', async function (req, res, next) {
    res.json({});
  });

  return router;
}

module.exports = Router;
