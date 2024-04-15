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
    
      // Add more test cases as needed
    });