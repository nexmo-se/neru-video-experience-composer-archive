
// CONFIG

/** */
const jwt = require("jsonwebtoken");
const axios = require("axios");
const OpenTok = require("opentok");

const APP_URL = process.env.APP_URL;
const OT_API_KEY = process.env.OT_API_KEY;
const OT_API_SECRET = process.env.OT_API_SECRET;
const OT_API_RENDER = `https://api.opentok.com/v2/project/${OT_API_KEY}/render`;

const opentok = new OpenTok(OT_API_KEY, OT_API_SECRET);

/** */
const createSession = async function () {
  const options = {
    mediaMode: "routed"
  };

  return new Promise((resolve, reject) => {
    opentok.createSession(options, function (err, session) {
      const { sessionId, archiveMode, mediaMode } = session;
      console.log("opentok.createSession", { sessionId, archiveMode, mediaMode });
      if (err) return reject(err);
      resolve({ sessionId, archiveMode, mediaMode });
    });
  });
};

const generateJwt = function (expire = 300) {
  var currentTime = Math.floor(new Date() / 1000);
  var token = jwt.sign({
    iss: process.env.OT_API_KEY,
    ist: "project",
    iat: currentTime,
    exp: currentTime + expire
  }, process.env.OT_API_SECRET);
  return token;
};

const generateToken = function (sessionId, role = "subscriber", data = {}) {
  const token = opentok.generateToken(sessionId, { 
      role,
      data: JSON.stringify(data),
    }
  );
  return token;
};

const sendSignal = async function (sessionId, type = "chat", data = {}) {
  return new Promise((resolve, reject) => {
    opentok.signal(sessionId, null, {
      type, 
      data: JSON.stringify(data)
    }, function (err) {
      if (err) {
        console.log("signal", err.message);
        return reject(err);
      }
      return resolve();
    });
  });
};

// options = { count, offset - (optional), sessionId - (optional)}
const listRenders = async function(options) {
  try {
    const headers = {
      "Content-Type": "application/json",
      "X-OPENTOK-AUTH ": generateJwt()
    };

    let { offset, count, sessionId } = options;
    count = (count > 10 || count < 1)? 10 : count;
    const params = new URLSearchParams();
    if (offset) params.append('offset', offset)
    if (count) params.append('count', count);

    const { data } = await axios.get(OT_API_RENDER, { headers, params });
    const { items } = data;
    if (sessionId && items.length) {
      return items.filter((item) => item.sessionId == sessionId)
    }
    return items;
  } catch (e) {
    console.log(e.message);
    throw new Error("Failed to list Renders")
  }
  // return new Promise((resolve, reject) => {
  //   opentok.listRenders(options, function (err, { items }) {
  //     if (err) {
  //       console.log("listRenders", err.message);
  //       return reject(err);
  //     }
  //     resolve(items);
  //   });
  // });
};

const getRender = async function(renderId) {
  return new Promise((resolve, reject) => {
    opentok.getRender(renderId, function (err, render) {
      if (err) {
        console.log("getRender", err.message);
        return reject(err);
      }
      resolve(render);
    });
  });
};

const startRender = async function(sessionId, url, options = {}) {
  var token = generateToken(sessionId, "moderator", {
    type: "EC",
    username: "EC"
  });

  return new Promise((resolve, reject) => {
    opentok.startRender({
      sessionId,
      token,
      url,
      ...{
        maxDuration: options.maxDuration || 1800,
        resolution: options.resolution || "1280x720",
        properties: {
          name: options.name || `Experience Composer Sample App ${Date.now()}`
        },
        statusCallbackUrl: options.callbackUrl || `${APP_URL}/monitor/ec/recorder`,
      }
    }, function (err, render) {
      if (err) {
        console.log("startRender", err.message);
        return reject(err);
      }
      resolve(render);
    });
  });
};

const stopRender = async function(renderId) {
  return new Promise((resolve, reject) => {
    opentok.stopRender(renderId, function (err, render) {
      if (err) {
        console.log("stopRender", err.message);
        return reject(err);
      }
      resolve(render);
    });
  });
};

const listArchives =  async function (options) {
  return new Promise((resolve, reject) => {
    opentok.listArchives(options, function (err, archives) {
      if (err) {
        console.log("listArchives", err.message);
        return reject(err);
      }
      resolve(archives);
    });
  });
};

const getArchive = async function(archiveId) {
  return new Promise((resolve, reject) => {
    opentok.getArchive(archiveId, function (err, archive) {
      if (err) {
        console.log("getArchive", err.message);
        return reject(err);
      }
      resolve(archive);
    });
  });
};

const startArchive = async function(sessionId, options = {}) {
  return new Promise((resolve, reject) => {
    opentok.startArchive(sessionId, {
      name: `Archive Sample App ${Date.now()}`,
      hasAudio: true,
      hasVideo: true,
      outputMode: "composed",
      ...options
    }, function (err, archive) {
      if (err) {
        console.log("startArchive", err.message);
        return reject(err);
      }
      resolve(archive);
    });
  });
};

const stopArchive = async function(archiveId) {
  return new Promise((resolve, reject) => {
    opentok.stopArchive(archiveId, function (err, archive) {
      if (err) {
        console.log("stopArchive", err.message);
        return reject(err);
      }
      resolve(archive);
    });
  });
};

const deleteArchive = async function(archiveId) {
  return new Promise((resolve, reject) => {
    opentok.deleteArchive(archiveId, function (err) {
      if (err) {
        console.log("deleteArchive", err.message);
        return reject(err);
      }
      resolve();
    });
  });
};

module.exports = {
  generateToken,
  generateJwt,
  createSession,
  sendSignal,
  listRenders,
  getRender,
  startRender,
  stopRender,
  listArchives,
  getArchive,
  startArchive,
  stopArchive,
  deleteArchive,
};

// module.exports = () => ({
//   x () {},
// });
