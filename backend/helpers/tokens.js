const jwt = require("jsonwebtoken");
require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY;

/** return signed JWT from user data. */

function createToken(user) {
  const payload = {
    username: user.username
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
