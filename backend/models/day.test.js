"use strict";
const Day = require("./day.js")
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
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

      // Test case 1: The day is returned with places when the ID is valid
test('returns a day with places when the ID is valid', async () => {
    // Before this test, insert a day and places into the database
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
  
  // Test case 2: The day is returned without places when there are no associated places
  test('returns a day without places when there are no associated places', async () => {
    // Before this test, insert a day without any places into the database
    const expectedDay = {
      id: testDayId,
      name: '03-23',
      trip_id: testTripId,
      places: [],
    };
  
    const day = await Day.get(testDayId);
  
    expect(day).toEqual(expectedDay);
  });
  
  // Test case 3: An error is thrown when the ID is not a number
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