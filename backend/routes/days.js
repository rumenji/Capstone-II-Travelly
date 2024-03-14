const express = require("express");
const router = express.Router();
const jsonschema = require("jsonschema");
const Trip = require("../models/trip");
const Day = require("../models/day");
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../expressError");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");
const tripNewSchema = require("../schemas/tripNew");
const dayNewSchema = require("../schemas/dayNew");
const { dateRange } = require("../helpers/dateRange");

/**Gets day by ID
 * Checks if user is logged in and matches the trip owner
 * => {id, name, trip_id, places: [{id, name, address, loc_long, loc_lat, category}, ...]}
 */
router.get('/:id', ensureLoggedIn, async function (req, res, next) {
    try {
        const day = await Day.get(req.params.id)
        // Checking if the trip the day is part of has a user that matches the logged in user
        const trip = await Trip.get(day.trip_id)
        if(trip.user_username !== res.locals.user.username){
            throw new UnauthorizedError("Unauthorized!")
        }
        return res.json(day);
    } catch (error) {
        return next(error);
    }
});

/**Saves places to days
 * Checks if user is logged in and matches the trip owner
 * expects {places:[{id, time_of_day, time_to_visit}, ...]}
 * => {id, name, trip_id, places: [{id, name, address, loc_long, loc_lat, category}, ...]
 */
router.post('/:id', ensureLoggedIn, async function (req, res, next){
    try{
        const dayId = req.params.id;
        const day = await Day.get(dayId);
        // Checking if the trip the day is part of has a user that matches the logged in user
        const trip = await Trip.get(day.trip_id)
        if(trip.user_username !== res.locals.user.username){
            throw new UnauthorizedError("Unauthorized!")
        };

        const result = await Day.addPlaces(dayId, req.body);
        const dayUpdated = await Day.get(dayId);
        // const placesRemoved = day.places.filter(originalPlace => !dayUpdated.places.some(updatedPlace => updatedPlace.id === originalPlace.id));
        
        // const removePlaces = await Day.deletePlaces(dayId);
        return res.status(201).json(dayUpdated);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;