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
/************************************** POST /trips */
describe('POST /trips', () => {
    it('should respond with 400 Bad Request if the request body is invalid', async () => {
        const invalidRequestBody = {};
    
        await request(app)
          .post('/trips')
          .set('Authorization', `Bearer ${u1Token}`) 
          .send(invalidRequestBody)
          .expect(400);
      });
    
      it('should create a new trip and associated days', async () => {
        const validRequestBody = {
            "name": "Trip to Paris 4",
            "location_name": "Paris",
            "loc_long": "2.3522",
            "loc_lat": "48.8566",
            "from_date": "2024-02-12",
            "to_date": "2024-02-19",
            "username": "u1"
        };
    
        const response = await request(app)
          .post('/trips')
          .set('Authorization', `Bearer ${u1Token}`) 
          .send(validRequestBody)
          .expect(201);
    
          expect(response.body).toHaveProperty('id');
      });
    
    });

/************************************** Get /trips */
describe('GET /trips/:id', () => {
  it('should return a trip by id', async () => {
    const response = await request(app).get("/trips/1")
                      .set('Authorization', `Bearer ${u1Token}`)
                      .expect(200)
    expect(response.body).toHaveProperty('trip')
  })

  it('should throw an error if a trip does not exist', async () => {
    const response = await request(app).get("/trips/100")
                        .set('Authorization', `Bearer ${u1Token}`)
                        .expect(400)
    
  })

});

/************************************** Edit /trips */
describe('PUT /trips/:id', () => {
  it('edit a trip by id', async () => {
    const validRequestBody = {
      "name": "Trip to Paris Edited",
      "from_date": "2024-02-13",
      "to_date": "2024-02-20"
  };
    const response = await request(app)
                          .put("/trips/1")
                          .set('Authorization', `Bearer ${u1Token}`)
                          .send(validRequestBody)
                          .expect(200)
    expect(response.body).toHaveProperty('editedTrip')
    expect(response.body.editedTrip.name).toEqual('Trip to Paris Edited')
    expect(response.body.editedTrip.from_date).toEqual('2024-02-13T05:00:00.000Z')
    expect(response.body.editedTrip.to_date).toEqual('2024-02-20T05:00:00.000Z')
  })

});

/************************************** Delete /trips */
describe('DELETE /trips/:id', () => {
  it('delete a trip by id', async () => {
    const response = await request(app)
                            .delete("/trips/1")
                            .set('Authorization', `Bearer ${u1Token}`)
                            .expect(200)
    expect(response.body.message).toEqual("Trip deleted!")
  })
})