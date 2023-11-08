const dotenv = require("dotenv");
dotenv.config({path: process.env.NODE_ENV? `.env.${process.env.NODE_ENV}`: "./.env"});

const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const createError = require("http-errors");

const services = require("./services");
const indexRouter = require("./routes");

const app = express();

app.use(logger("tiny", { skip: (req) => {
  const p = req.originalUrl.split("/");
  return (p && p.length)
    ? ["_", "static", "favicon.ico", "manifest.json", "images"].includes(`${p[1]}`) 
      || "/room/token" === `/${p[2]}/${p[4]}`
    : false;
}}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/build"));

app.get("/_/health", async (req, res) => {
  res.sendStatus(200);
});

app.use("/", indexRouter(services));

app.all('*', async function (req, res, next) {
  return res.sendFile((__dirname + '/build/index.html'));
});

app.use(function (req, res, next) {
  next(new createError(404, "Are you lost? " + req.originalUrl));
});

app.use(function (err, req, res, next) {
  if (app.get("env") === "development" || process.env.DEBUG) console.log(err);
  const code = err.statusCode || err.status || 500;
  const detail = err.message || (typeof err === "string"? err : "Something went wrong");
  res.status(code).json({ error: { detail, code } });
});

const PORT = process.env.NERU_APP_PORT || 3000;
app.listen(PORT, function () {
  console.log(`App listening on ${PORT}`);
});
