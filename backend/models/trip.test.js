"use strict";
const Trip = require("./trip.js")
const {
    BadRequestError
} = require("../expressError");
const db = require("../db.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

const testDayId = 1;
const testTripId = 1;
/************************************** Get trip by id*/
describe('Trip.get', () => {
    test('not found if no such trip', async () => {
        try {
            await Trip.get(100);
            fail();
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestError);
        }
    });


    test('returns a trip with days if ID is valid', async () => {
        const expectedTrip = {
            id: 1,
            name: 'Trip to Paris',
            location_name: "Paris",
            loc_lat: "48.8566",
            loc_long: "2.3522",
            from_date: expect.any(Date),
            to_date: expect.any(Date),
            user_username: "u1",
            days: [{
                id: 1,
                name: "03-23",
            },

            ],
        };

        const trip = await Trip.get(testTripId);

        expect(trip).toEqual(expectedTrip);
    });

    test('throws an error when the ID is not a number', async () => {
        try {
            await Trip.get('invalid_id');
            fail();
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestError);
            expect(err.message).toBe('Error getting trip: error: invalid input syntax for type integer: \"invalid_id\"');
        }
    });

});

/************************************** Create trip*/
describe('Trip.create', () => {
    test('creates new trip from valid data', async () => {
        const trip = await Trip.create({
            "name": "Trip to Paris Second",
            "location_name": "Paris",
            "loc_long": "2.3522",
            "loc_lat": "48.8566",
            "from_date": "2024-07-12",
            "to_date": "2024-07-19",
            "username": "u2"
        });
        expect(trip).toHaveProperty("id");
        expect(trip.id).toEqual(2);
    });


    test('error when data is not valid', async () => {
        try {
            const trip = await Trip.create({
                "name": "Trip to Paris Second",
                "location_name": "Paris",
                "loc_long": "2.3522",
                "loc_lat": "48.8566",
                "from_date": "2024-07-12",
                "to_date": "2024-07-19"
            });
            fail();
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestError);
        }
    });

});

/************************************** Edit trip*/
describe('Trip.edit', () => {
    test('edits a trip with valid data', async () => {
        const trip = await Trip.edit({
            "name": "Trip to Paris Edited",
            "from_date": "2024-07-13",
            "to_date": "2024-07-20"
        }, 1);

        const editedTrip = await Trip.get(1);
        expect(editedTrip.name).toEqual("Trip to Paris Edited")
        expect(editedTrip.from_date).toEqual(expect.any(Date))
        expect(editedTrip.to_date).toEqual(expect.any(Date))
        expect(editedTrip.days).toEqual([{
            "id": 2,
            "name": "07-13",
        },
        {
            "id": 3,
            "name": "07-14",
        },
        {
            "id": 4,
            "name": "07-15",
        },
        {
            "id": 5,
            "name": "07-16",
        },
        {
            "id": 6,
            "name": "07-17",
        },
        {
            "id": 7,
            "name": "07-18",
        },
        {
            "id": 8,
            "name": "07-19",
        },
        {
            "id": 9,
            "name": "07-20",
        }])
    });


    test('error when data is not valid', async () => {
        try {
            const trip = await Trip.edit({
                "trip_name": "Trip to Paris Edited",
                "from_date": "2024-07-13",
                "to_date": "2024-07-20"
            }, 1);
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

});

/************************************** Delete trip by id*/
describe('Trip.delete', () => {
    test('deletes a trip if ID is valid', async () => {
        const trip = await Trip.delete(testTripId);
        try {
            await Trip.get(testTripId);
            fail();
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestError);
        }
    });

});