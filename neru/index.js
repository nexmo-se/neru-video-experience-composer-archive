require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('morgan');

const services = require('./services');
const indexRouter = require('./routes');

const app = express();

app.use(logger('dev', { skip: (req) => {
  const p = req.originalUrl.split('/');
  return (p && p.length)
    ? ['_', 'static', 'favicon.ico', 'manifest.json', 'images'].includes(`${p[1]}`) 
      || '/room/token' === `/${p[2]}/${p[4]}`
    : false;
}}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/build'));

app.get("/_/health", async (req, res) => {
  res.sendStatus(200);
});

app.use('/', indexRouter(services));

app.all('*', async function (req, res, next) {
  res.sendFile((__dirname + '/build/index.html'));
});

app.use(function (req, res, next) {
  console.log('Not Found', req.path);
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  console.log('Error', err);
  let error = app.get('env') === 'development' ? { err } : { err: 'Something is wrong' };
  res.status(err.status || 500);
  res.json(error);
});

services.start(app);
