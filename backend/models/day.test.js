"use strict";
const Day = require("./day.js")
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
const testPlaceId = 1;

/************************************** Get day by id*/
describe('Day.get', () => {
  test('not found if no such day', async () => {
    try {
      await Day.get(100);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestError);
    }
  });


  test('returns a day with places when the ID is valid', async () => {
    const expectedDay = {
      id: 1,
      name: '03-23',
      trip_id: 1,
      places: [
      ],
    };

    const day = await Day.get(testDayId);

    expect(day).toEqual(expectedDay);
  });

  test('returns a day without places when there are no associated places', async () => {

    const expectedDay = {
      id: testDayId,
      name: '03-23',
      trip_id: testTripId,
      places: [],
    };

    const day = await Day.get(testDayId);

    expect(day).toEqual(expectedDay);
  });


  test('throws an error when the ID is not a number', async () => {
    try {
      await Day.get('invalid_id');
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestError);
      expect(err.message).toBe('Error getting day: error: invalid input syntax for type integer: \"invalid_id\"');
    }
  });

});

/************************************** Create day*/
describe('Day.create', () => {
  test('creates new day from valid data', async () => {
    const day = await Day.create({
      "name": "04-22"
    }, 1);
    expect(day).toHaveProperty("id");
    expect(day.id).toEqual(2);
    expect(day.name).toEqual("04-22");
  });


  test('error when data is not valid', async () => {
    try {
      const day = await Day.create({
        "location_name": "Paris"
      }, 1);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestError);
    }
  });

});

/************************************** Delete day by id*/
describe('Day.delete', () => {
  test('deletes a dayif ID is valid', async () => {
    const day = await Day.delete("03-23", 1);
    try {
      await Day.get(1);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestError);
    }
  });

});

/************************************** Add place to day*/
describe('Day.addPlace', () => {
  test('adds a new place to day', async () => {
    const place = await Day.addPlace(1, {
      "id": "2Lmp6i0Y_gQp1qPAmdtNTg",
      "time_to_visit": 3,
      "time_of_day": "09:30 AM"
    });
    expect(place.time_to_visit).toEqual('3');
  });


});

/************************************** Edit place in a day*/
describe('Day.editPlace', () => {
  test('edits an existing place in a day', async () => {
    const addPlace = await Day.addPlace(1, {
      "id": "2Lmp6i0Y_gQp1qPAmdtNTg",
      "time_to_visit": 3,
      "time_of_day": "09:30 AM"
    });
    const editPlace = await Day.editPlace(1, {
      "id": "2Lmp6i0Y_gQp1qPAmdtNTg",
      "time_to_visit": 2.5,
      "time_of_day": "09:00 AM"
    });
    expect(editPlace.time_to_visit).toEqual('2.5');
  });


});

/************************************** Delete place from day*/
describe('Day.deletePlace', () => {
  test('deletes a place from day', async () => {
    const addPlace = await Day.addPlace(1, {
      "id": "2Lmp6i0Y_gQp1qPAmdtNTg",
      "time_to_visit": 3,
      "time_of_day": "09:30 AM"
    });
    const place = await Day.deletePlace(1, "2Lmp6i0Y_gQp1qPAmdtNTg");

    const day = await Day.get(1);
    expect(day.places).toEqual([])
  });

});