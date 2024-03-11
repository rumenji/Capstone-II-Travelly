const express = require("express");
const router = express.Router();
const jsonschema = require("jsonschema");
const Trip = require("../models/trip")
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../expressError");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");
const tripNewSchema = require("../schemas/tripNew");

router.post('/', ensureLoggedIn, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, tripNewSchema);
        if (!validator.valid) {
        const errors = validator.errors.map(e => e.stack);
        throw new BadRequestError(errors);
        }

        const trip = await Trip.create(req.body)

        return res.status(201).json(trip);
    } catch (error) {
        return next(error);
    }
})

router.get('/:id', ensureLoggedIn, async function (req, res, next) {
    try {
        const trip = await Trip.get(req.params.id)

        return res.json({trip});
    } catch (error) {
        return next(error);
    }
});

module.exports = router;