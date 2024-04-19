"use strict";

const request = require("supertest");
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** Get /places */
describe('GET /places/:id', () => {
    it('should return a place by id', async () => {
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
        const response = await request(app).get("/places/2Lmp6i0Y_gQp1qPAmdtNTg")
            .set('Authorization', `Bearer ${u1Token}`)
            .expect(200)
        expect(response.body).toHaveProperty('place')
        expect(response.body.place).toEqual(expectedPlace)
    })

    it('should throw an error if a day does not exist', async () => {
        const response = await request(app).get("/places/100")
            .set('Authorization', `Bearer ${u1Token}`)
            .expect(400)

    })

});

/************************************** POST places to database */
describe('POST /places', () => {
    it('should respond with 400 Bad Request if the request body is invalid', async () => {
        const invalidRequestBody = {};

        await request(app)
            .post('/places')
            .set('Authorization', `Bearer ${u1Token}`)
            .send(invalidRequestBody)
            .expect(400);
    });

    it('should add a new place to database', async () => {
        const validRequestBody = {
            "id": "Qwa-GDb_6wSmxtGFf7AHww",
            "name": "Tour Eiffel",
            "category": [
                "bus stop",
                "public transport stop"
            ],
            "address": "Avenue de Tourville, 75007 Paris",
            "position": {
                "lat": 48.854,
                "lon": 2.3129
            }
        }

        const response = await request(app)
            .post('/places')
            .set('Authorization', `Bearer ${u1Token}`)
            .send(validRequestBody)

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toEqual("Tour Eiffel");
    });

});


/************************************** Search places from database */
describe('POST /places/search', () => {
    it('finds an existing place', async () => {
        const requestBody = { query: "Eiffel Tower", trip_id: "1" }
        const response = await request(app)
            .post("/places/search")
            .set('Authorization', `Bearer ${u1Token}`)
            .send(requestBody)
            .expect(200)
        expect(response.body).toEqual(expect.any(Array))
    })
})