const express = require("express");
const router = express.Router();
const Day = require("../models/day");
const Trip = require("../models/trip");
const Place = require("../models/place");
const { axiosFindPlace } = require("../helpers/axios");
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../expressError");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");
const tripNewSchema = require("../schemas/tripNew");

/**Add places to the local database
 * Expects {id, name, category: [string, ...], address, position: {lat, lon}}
 */
router.post('/', ensureLoggedIn, async function (req, res, next) {
    try {
        const existingPlace = await Place.get(req.body.id);
        if (existingPlace) return res.status(201).json(existingPlace);
        const place = await Place.create(req.body);
        console.log('duplicated')
        return res.status(201).json(place);
    } catch (error) {
        return next(error);
    }
})

/**Search for a place
 * accepts {query, trip_id}
 * uses axiosFindPlace helper to issue the query -
 * passing URL encoded string, trip lon and lat for search bias
 * returns array of found places
 */
router.post("/search", ensureLoggedIn, async function (req, res, next) {
    try{
    // Gets trip by id 
    const trip = await Trip.get(+req.body.trip_id);
    // Encodes search query for URL format
    const urlQuery = encodeURIComponent(req.body.query);
    // Calls the helper to send request to the TomTom API
    // The trip cooridnates are used to create geoBias - suggests places near the location
    const placesList = await axiosFindPlace(urlQuery, trip.loc_long, trip.loc_lat)

    return res.json(placesList);
    } catch (error) {
        return next(error);
    }
})

/* Get a place by ID
* => {place: {id, name, address, loc_long, loc_lat, category: [string, ...]}}
*/
router.get('/:id', ensureLoggedIn, async function (req, res, next) {
    try {
        const place = await Place.get(req.params.id)
        
        return res.json({place});
    } catch (error) {
        return next(error);
    }
});

module.exports = router;