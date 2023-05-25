
// CONFIG

/** */
const jwt = require('jsonwebtoken');
const axios = require('axios');
const OpenTok = require('opentok');

const APP_URL = process.env.APP_URL;
const opentok = new OpenTok(process.env.OT_API_KEY, process.env.OT_API_SECRET);

/** */
const createSession = async function () {
  const options = {
    mediaMode: "routed"
  };

  return new Promise((resolve, reject) => {
    opentok.createSession(options, function (err, session) {
      if (err) return reject(err);
      resolve(session);
    });
  });
}

const generateJwt = function (expire = 300) {
  var currentTime = Math.floor(new Date() / 1000);
  var token = jwt.sign({
    iss: process.env.OT_API_KEY,
    ist: 'project',
    iat: currentTime,
    exp: currentTime + expire
  }, process.env.OT_API_SECRET);
  return token;
};

const generateToken = function (sessionId, options) {
  const token = opentok.generateToken(sessionId, options);
  return token;
};

const sendSignal = async function (sessionId, type) {
  try {
    const data = { type, data: '' };
    opentok.signal(sessionId, null, data, function (err) {
      if (err) {
        return Promise.resolve(false);
      } else {
        return Promise.resolve(true);
      }
    });
  } catch (err) {
    throw `send Signal - ${ err.message || 'failed'}`;
  }
}
  
const listRenders = async function(params) {
  try {
    const url = `https://api.opentok.com/v2/project/${process.env.OT_API_KEY}/render`;
    const jwt = generateJwt();
    const headers = {
      'Content-Type': 'application/json',
      'X-OPENTOK-AUTH': jwt
    };
    const { data } = await axios.get(url, { headers, params });
    return data;
  } catch (error) {
    console.log(error.message);
    throw error.message;
  }
}

const getRender = async function(renderId) {
  try {
    const url = `https://api.opentok.com/v2/project/${process.env.OT_API_KEY}/render/${renderId}`;
    const jwt = generateJwt();
    const headers = {
      'Content-Type': 'application/json',
      'X-OPENTOK-AUTH': jwt
    };
    const { data } = await axios.get(url, { headers });
    return data;
  } catch (error) {
    console.log(error.message);
    throw error.message;
  }
}

const startRender = async function(sessionId, renderOptions) {
  try {
    var token = opentok.generateToken(sessionId, {
      role: 'moderator', 
      data: JSON.stringify({ type: 'EC' }),
    });
    const options = {
      sessionId,
      token,
      properties: { name: `EC Sample APP @ ${(new Date()).toISOString()}` },
      maxDuration: 1800,
      resolution: '1280x720',
      statusCallbackUrl: `${APP_URL}/monitor/ec`,
      ...renderOptions,
    };
    
    const url = `https://api.opentok.com/v2/project/${process.env.OT_API_KEY}/render`;
    const jwt = generateJwt();
    const headers = {
      'Content-Type': 'application/json',
      'X-OPENTOK-AUTH': jwt
    };
    const { data } = await axios.post(url, options, { headers });
    return data;
  } catch (error) {
    console.log(error.message);
    throw error.message;
  }
}

const stopRender = async function(renderId) {
  try {
    console.log('stopRender!!');
    const url = `https://api.opentok.com/v2/project/${process.env.OT_API_KEY}/render/${renderId}`;
    const jwt = generateJwt();
    const headers = {
      'Content-Type': 'application/json',
      'X-OPENTOK-AUTH': jwt
    };
    await axios.delete(url, { headers });
    return true;
  } catch (error) {
    console.log(error.message);
    throw error.message;
  }
};

const startRecorder = async function(sessionId, archiveOptions) {
  const options = {
    name: `Archive Sample App @ ${(new Date()).toISOString()}`,
    hasAudio: true,
    hasVideo: true,
    outputMode: 'composed',
    ...archiveOptions
  };
  return new Promise((resolve, reject) => {
    opentok.startArchive(sessionId, options, function (err, archive) {
      if (err) return reject(err);
      resolve(archive);
    });
  });
}

const stopRecorder = async function(archiveId) {
  return new Promise((resolve, reject) => {
    opentok.stopArchive(archiveId, function (err, archive) {
      if (err) return reject(err);
      resolve(true);
    });
  });
}

module.exports = {
  ...opentok,
  generateToken,
  generateJwt,
  createSession,
  listRenders,
  getRender,
  startRender,
  stopRender,
  sendSignal,
  startRecorder,
  stopRecorder,
};

// module.exports = () => ({
//   createSession () {},
// });
