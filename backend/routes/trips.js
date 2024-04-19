const express = require("express");
const router = express.Router();
const jsonschema = require("jsonschema");
const Trip = require("../models/trip");
const Day = require("../models/day");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const {ensureLoggedIn} = require("../middleware/auth");
const tripNewSchema = require("../schemas/tripNew");
const { dateRange } = require("../helpers/dateRange");
const { axiosFindGeoCode } = require("../helpers/axios");

/**creates a new trip.
 * Required are name, location_name, from_date, to_date, username
 * automatically creates days in the date range
 * {name, location_name, loc_long, loc_lat, from_date, to_date, username}
 * => {id, name}
 **/
router.post('/', ensureLoggedIn, async function (req, res, next) {
    try {
        // Validates input based on the JSON schema validator
        const validator = jsonschema.validate(req.body, tripNewSchema);
        if (!validator.valid) {
        const errors = validator.errors.map(e => e.stack);
        throw new BadRequestError(errors);
        }
        // Creates the new trip
        const newTrip = await Trip.create(req.body)
        // Gets an array of the days in the range. Dates are in the format YYYY-MM-DD
        const dates = dateRange(req.body.from_date, req.body.to_date);
        // Creates a day for each day from the array as MM-DD
        await dates.map(async date => Day.create({name: date}, newTrip.id))
        
        const trip = await Trip.get(newTrip.id)
        return res.status(201).json(trip);
    } catch (error) {
        return next(error);
    }
});

/**get trip by ID from URL.
 * requires logged in user to match the user owner of the trip
 * => {trip: {id, name, location_name, loc_long, loc_lat, from_date, to_date, user_username, days: [{id, name}, ...]}}
 **/
router.get('/:id', ensureLoggedIn, async function (req, res, next) {
    try {
        // Gets the trip by ID - only requires user to be logged in for now
        const trip = await Trip.get(req.params.id)
        // Checks if the trip user matches the logged in user
        if(trip.user_username !== res.locals.user.username){
            throw new UnauthorizedError("Unauthorized!")
        }
        return res.json({trip});
    } catch (error) {
        return next(error);
    }
});

/**edit trip by ID from URL.
 * requires logged in user to match the user owner of the trip
 * => {trip: {id, name, location_name, loc_long, loc_lat, from_date, to_date, user_username, days: [{id, name}, ...]}}
 **/
router.put('/:id', ensureLoggedIn, async function (req, res, next) {
    try {
        // Gets the trip by ID - only requires user to be logged in for now
        const trip = await Trip.get(req.params.id)
        // Checks if the trip user matches the logged in user
        if(trip.user_username !== res.locals.user.username){
            throw new UnauthorizedError("Unauthorized!")
        }
        const editTripId = await Trip.edit(req.body, req.params.id)
        const editedTrip = await Trip.get(editTripId)
        return res.json({editedTrip});
    } catch (error) {
        return next(error);
    }
});

/*delete trup by ID 
requires logged in user to match the user owner of the trip*/
router.delete('/:id', ensureLoggedIn, async function (req, res, next) {
    try{
        const trip = await Trip.delete(req.params.id);
        return res.json({message: "Trip deleted!"});
    } catch (error) {
        return next(error);
    }
});

/**searches for locations when creating a new trip.
 * Expects a search query term
 * => [{id, name, position[lon, lat]}, ...]
 **/
router.post('/location-search', ensureLoggedIn, async function (req, res, next) {
    try {
        const urlQuery = encodeURIComponent(req.body.query);
        const locations = await axiosFindGeoCode(urlQuery)
        return res.status(200).json(locations);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;