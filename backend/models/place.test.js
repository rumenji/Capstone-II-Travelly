"use strict";
const Place = require("./place.js")
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

/************************************** Create place*/
describe('Place.create', () => {
    test('creates new place from valid data', async () => {
        const place = await Place.create({
            "id": "UJZW7Wi6XKM0aKf5pDGG9A",
            "name": "Tour Eiffel",
            "category": [
                "coach parking area",
                "open parking area"
            ],
            "address": "Avenue Joseph Bouvard, 75007 Paris",
            "position": {
                "lat": 48.856516,
                "lon": 2.298103
            }
        });
        expect(place).toHaveProperty("id");
        expect(place.id).toEqual("UJZW7Wi6XKM0aKf5pDGG9A");
        expect(place.name).toEqual("Tour Eiffel");
      });
      
      test("doesn't create a new place if duplicate", async () => {
        try{
        const place = await Place.create({
            "id": "2Lmp6i0Y_gQp1qPAmdtNTg",
            "name": "Eiffel Tower",
            "category": [
                "important tourist attraction",
                "tower"
            ],
            "address": "Avenue Gustave Eiffel, 75007 Paris",
            "position": {
                "lat": 48.858844,
                "lon": 2.294351
            }
    });
} catch (err) {
   
    expect(err).toBeInstanceOf(BadRequestError);
}
      });
   
      test('error when data is not valid', async () => {
        try {
            const place = await Place.create({
                "location_name": "Paris"
            });
          fail();
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestError);
        }
      });
  
  });

  /************************************** Get place by id*/
describe('Place.get', () => {
    test('not found if no such place', async () => {
        try {
          await Place.get(100);
          fail();
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestError);
        }
      });

   
test('returns a place when the ID is valid', async () => {
    const expectedPlace = {
        "id": "2Lmp6i0Y_gQp1qPAmdtNTg",
        "name": "Eiffel Tower",
        "category": [
            "important tourist attraction",
            "tower"
        ],
        "address": "Avenue Gustave Eiffel, 75007 Paris",
        "loc_lat": "48.858844",
        "loc_long": "2.294351"
};
  
    const place = await Place.get("2Lmp6i0Y_gQp1qPAmdtNTg");
  
    expect(place).toEqual(expectedPlace);
  });
});