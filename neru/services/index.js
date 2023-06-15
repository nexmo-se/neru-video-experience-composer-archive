const OT_API_KEY = process.env.OT_API_KEY;
const OT_API_SECRET = process.env.OT_API_SECRET;
if (!OT_API_KEY || !OT_API_SECRET) {
  console.log('You must specify OT_API_KEY and OT_API_SECRET environment variables');
  process.exit(1);
}

const PORT = process.env.PORT || 3002;

/** */
const { neru } = require("neru-alpha");
const opentok = require("./opentok");
const state = require("./state")(neru);

const appUrl = process.env.APP_URL; // neru.getAppUrl();

/** */
const start = async (app) => {
  try {
    console.log('[start] -');

    app.set('appUrl', appUrl);
    
    // // only for resetting
    // await state.delRooms();

    app.listen(PORT, function () {
      console.log(`[start] - listening on ${PORT} `);
    });

  } catch (e) {
    console.log('[start] - error', e);
    process.exit(1);
  }
};

module.exports = {
  start,
  opentok,
  state,
  appUrl,
};
