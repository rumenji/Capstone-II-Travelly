/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken");
require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY;
const { UnauthorizedError } = require("../expressError");

/** Middleware: Authenticate user. */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (error) {
    return next();
  }
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (error) {
    return next(error);
  }
}


/** Middleware: Requires correct username. */

function ensureCorrectUser(req, res, next) {
  try {
    const user = res.locals.user;
    // console.log('User:', user.username)
    // console.log('Req params:', req.params.username)
    if (!(user && user.username === req.params.username)) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (error) {
    return next(error);
  }
}

function ensureCorrectUserUpdate(req, res, next) {
  try {
    const user = res.locals.user;
    if (!(user && user.username === req.body.username)) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (error) {
    return next(error);
  }
}
// end

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  ensureCorrectUserUpdate
};
