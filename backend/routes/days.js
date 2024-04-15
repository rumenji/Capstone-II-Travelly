const express = require("express");
const router = express.Router();
const jsonschema = require("jsonschema");
const Trip = require("../models/trip");
const Day = require("../models/day");
const Place = require("../models/place");
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
 * expects {id, time_of_day, time_to_visit}
 * => {id, name, trip_id, places: [{id, name, address, loc_long, loc_lat, category}, ...]
 */
router.post('/:id', ensureLoggedIn, async function (req, res, next){
    try{
        const dayId = req.params.id;
        const day = await Day.get(dayId);
        // Checking if the trip day has a user that matches the logged in user
        const trip = await Trip.get(day.trip_id)
        if(trip.user_username !== res.locals.user.username){
            throw new UnauthorizedError("Unauthorized!")
        };

        const result = await Day.addPlace(dayId, req.body);
        
        return res.status(201).json(result);
    } catch (error) {
        return next(error);
    }
});

/**Edits places in days
 * Checks if user is logged in and matches the trip owner
 * expects {id, time_of_day, time_to_visit}
 * => {id, name, trip_id, places: [{id, name, address, loc_long, loc_lat, category}, ...]
 */
router.put('/:dayId', ensureLoggedIn, async function (req, res, next){
    try{
        const dayId = req.params.dayId;
        const day = await Day.get(dayId);
        // Checking if the trip day has a user that matches the logged in user
        const trip = await Trip.get(day.trip_id)
        if(trip.user_username !== res.locals.user.username){
            throw new UnauthorizedError("Unauthorized!")
        };

        const result = await Day.editPlace(dayId, req.body);
        
        return res.status(201).json(result);
    } catch (error) {
        return next(error);
    }
});

/**Delete places in days
 * Checks if user is logged in and matches the trip owner
 * expects {id}
 * => {id, name, trip_id, places: [{id, name, address, loc_long, loc_lat, category}, ...]
 */
router.delete('/:dayId/:placeId', ensureLoggedIn, async function (req, res, next){
    try{
        const dayId = req.params.dayId;
        const placeId = req.params.placeId;
        const day = await Day.get(dayId);
        // Checking if the trip day has a user that matches the logged in user
        const trip = await Trip.get(day.trip_id)
        if(trip.user_username !== res.locals.user.username){
            throw new UnauthorizedError("Unauthorized!")
        };
        const result = await Day.deletePlace(dayId, placeId);
        return res.json(result);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;