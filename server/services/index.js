const OT_API_KEY = process.env.OT_API_KEY;
const OT_API_SECRET = process.env.OT_API_SECRET;
if (!OT_API_KEY || !OT_API_SECRET) {
  console.log("You must specify OT_API_KEY and OT_API_SECRET environment variables");
  process.exit(0);
}

const opentok = require("./opentok");

/** run in VCR */
const { neru } = require("neru-alpha");
const store = neru.getInstanceState();
const RoomService = require("./RoomServiceVcr");
const roomService = new RoomService(store);

/** -- OR -- run in thelocal */
// const RoomServiceLocal = require("./RoomServiceLocal");
// const roomService = new RoomServiceLocal(new Map());

module.exports = {
  opentok,
  roomService,
  APP_URL: neru.getAppUrl(), // run in VCR
  // APP_URL: process.env.APP_URL, // run in local
};
