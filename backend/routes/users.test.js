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
/************************************** GET /users */

describe('GET /', () => {
  it('should return a users by username', async () => {
    const response = await request(app).get('/users/u1').set('authorization', u1Token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('user');
  });

  it('should return 401 if not logged in', async () => { 
    const response = await request(app).get('/users'); 
    expect(response.statusCode).toBe(401); 
});
});

/************************************** GET /users/:username */
describe('GET /:username', () => {
    it('should return user details', async () => {
      const response = await request(app).get('/users/u1').set('authorization', u1Token);
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('username', 'u1');
    });
  
    it('should return 404 if the user is not found', async () => {
        const response = await request(app).get('/users/nonexistent-user').set('authorization', u1Token); 
        expect(response.statusCode).toBe(401); 
    });

    it('should return 401 if accessing another user details', async () => {
        const response = await request(app).get('/users/u2').set('authorization', u1Token); 
        expect(response.statusCode).toBe(401); 
    }); 
  });


/************************************** GET /users/:username/trips */
  describe('GET /:username/trips', () => {
    it('should return user trips', async () => {
    
      const response = await request(app).get('/users/u1/trips').set('authorization', u1Token);
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('trips');
      expect(response.body).toEqual({
        "trips": [
         {
           "days": [
            {
               "id": expect.any(Number),
              "name": expect.any(String),
             },
           ],
           "from_date": "2025-02-12T05:00:00.000Z",
           "id": 1,
           "loc_lat": "48.8566",
           "loc_long": "2.3522",
           "location_name": "Paris",
           "name": "Trip to Paris 4",
           "to_date": "2025-02-19T05:00:00.000Z",
         },
        ],
      });
    });

    
        it('should return an empty trips array if the user has no trips', async () => {
          const response = await request(app).get('/users/u2/trips').set('authorization', u2Token);
      
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual({ trips: [] }); 
        });

    it('should return 401 if the user is not found', async () => {
        const response = await request(app).get('/users/nonexistent-user/trips').set('authorization', u1Token); 
        expect(response.statusCode).toBe(401); 
    });

    it('should return 401 if the user is not the authorized user', async () => {
      const response = await request(app).get('/users/u2/trips').set('authorization', u1Token); 
      expect(response.statusCode).toBe(401); 
  });
  });