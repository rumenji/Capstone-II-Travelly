const express = require("express");
const cors = require("cors");
const { authenticateJWT } = require("./middleware/auth");

const { NotFoundError } = require("./expressError");
const app = express();

// allow both form-encoded and json body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'https://travelly-frontend.onrender.com'
  // origin: 'http://127.0.0.1:3000'
};

app.use(cors(corsOptions));

// get auth token for all routes
app.use(authenticateJWT);

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const tripRoutes = require("./routes/trips");
const dayRoutes = require("./routes/days");
const placeRoutes = require("./routes/places");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/trips", tripRoutes);
app.use("/days", dayRoutes);
app.use("/places", placeRoutes);

/** 404 handler */

app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** general error handler */

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  if (process.env.NODE_ENV != "test") console.error(err.stack);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;