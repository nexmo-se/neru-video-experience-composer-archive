const createHttpError = require("http-errors");

function Handler(req, res, next) {
  try {
    const authHeader = req.header("authorization");
    if (!authHeader) throw new createHttpError(401, "Authorization Required");

    const [type, token] = authHeader.split(" ");
    if (!verify(token)) throw new createHttpError(401);
    // console.log("Authorization Type", type.toLowerCase())

    next();

  } catch (e) {
    if (e instanceof createHttpError.HttpError) next(e);
    else {
      next(new createHttpError(401, "Failed to authorize"));
    }
  }
}

function verify(token) {
  return (token == Buffer.from(`${expectedUsername}:${expectedPassword}`).toString("base64"));
}

const expectedUsername = "abc";
const expectedPassword = "123";

module.exports = Handler;
