const Router = require("express").Router;
const User = require("../models/user");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

const router = new Router();

/** get detail of users.
*
* => {user: {username, first_name, last_name, email, join_at, last_login_at}}
*
**/

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** get trips for user
 *
 * => {trips: [{location_name, loc_long, loc_lat, from_date, to_date}, ...]}
 *
 **/

router.get("/:username/trips", ensureCorrectUser, async function (req, res, next) {
  try {
    const searchPastTrips = req.query.q || null;
    const trips = await User.trips(req.params.username, searchPastTrips);
    return res.json({ trips });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
