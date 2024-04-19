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

/************************************** Get /days */
describe('GET /days/:id', () => {
    it('should return a day by id', async () => {
        const response = await request(app).get("/days/1")
            .set('Authorization', `Bearer ${u1Token}`)
            .expect(200)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toEqual({ "id": 1, "name": "02-12", "places": [], "trip_id": 1 })
    })

    it('should throw an error if a day does not exist', async () => {
        const response = await request(app).get("/days/100")
            .set('Authorization', `Bearer ${u1Token}`)
            .expect(400)

    })

});

/************************************** POST places to /days */
describe('POST /days', () => {
    it('should respond with 400 Bad Request if the request body is invalid', async () => {
        const invalidRequestBody = {};

        await request(app)
            .post('/days/1')
            .set('Authorization', `Bearer ${u1Token}`)
            .send(invalidRequestBody)
            .expect(400);
    });

    it('should add a new place to associated days', async () => {
        const validRequestBody = { id: "2Lmp6i0Y_gQp1qPAmdtNTg", time_of_day: "09:00 AM", time_to_visit: 3 }

        const response = await request(app)
            .post('/days/1')
            .set('Authorization', `Bearer ${u1Token}`)
            .send(validRequestBody)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.time_to_visit).toEqual("3");
    });

});



/************************************** Edit places in /days */
describe('PUT /days/:id', () => {
    it('edit a place to day by id', async () => {
        const validRequestBody = { id: "2Lmp6i0Y_gQp1qPAmdtNTg", time_of_day: "09:00 AM", time_to_visit: 3 };
        const response = await request(app)
            .post('/days/1')
            .set('Authorization', `Bearer ${u1Token}`)
            .send(validRequestBody)
        const editedRequestBody = { id: "2Lmp6i0Y_gQp1qPAmdtNTg", time_of_day: "08:00 AM", time_to_visit: 5 };
        const responseEdited = await request(app)
            .put("/days/1")
            .set('Authorization', `Bearer ${u1Token}`)
            .send(editedRequestBody)
            .expect(201)
        expect(responseEdited.body.time_of_day).toEqual("08:00:00")
        expect(responseEdited.body.time_to_visit).toEqual('5')
    })

});

/************************************** Delete places from /days */
describe('DELETE /days/:id/:placeId', () => {
    it('delete a place from day', async () => {
        const validRequestBody = { id: "2Lmp6i0Y_gQp1qPAmdtNTg", time_of_day: "09:00 AM", time_to_visit: 3 };
        const responseAddPlace = await request(app)
            .post('/days/1')
            .set('Authorization', `Bearer ${u1Token}`)
            .send(validRequestBody)

        const response = await request(app)
            .delete("/days/1/2Lmp6i0Y_gQp1qPAmdtNTg")
            .set('Authorization', `Bearer ${u1Token}`)
            .expect(200)
        expect(response.body).toEqual({ "place_id": "2Lmp6i0Y_gQp1qPAmdtNTg" })
    })
})