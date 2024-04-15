"use strict";

const request = require("supertest");
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token
  } = require("./_testCommon");
  
  beforeAll(commonBeforeAll);
  beforeEach(commonBeforeEach);
  afterEach(commonAfterEach);
  afterAll(commonAfterAll);
/************************************** POST /auth/register */

describe("POST /auth/register", function () {
    it('should register a new user', async () => {
        const userData = {
            username: 'testuser1',
            password: 'password123',
            first_name: 'Test',
            last_name: 'User',
            email: 'testuser1@email.com'
        };
    
        const response = await request(app)
            .post('/auth/register') // assuming your register route
            .send(userData)
            .expect(201); // Assuming a 201 status code for success
    
        expect(response.body).toHaveProperty('token');
        expect(response.body.token).toEqual(
            expect.any(String)
          );
        // Add more expectations as needed for other returned fields
    });

    it('should return a 400 error for missing fields', async () => {
        const userData = {
            username: 'testuser2',
            // Missing password, first_name, last_name, and email
        };
    
        const response = await request(app)
            .post('/auth/register')
            .send(userData)
            .expect(400); // Expecting a BadRequestError
    
        expect(response.body.message).toEqual(["instance requires property \"first_name\"", 
                                                "instance requires property \"last_name\"", 
                                                "instance requires property \"password\"", 
                                                "instance requires property \"email\""]);
    });

    it('should return a 400 error for passwords shorter than 5 characters', async () => {
        const userData = {
            username: 'testuser3',
            password: '1234', // Short password
            first_name: 'Test',
            last_name: 'User',
            email: 'testuser3@email.com'
        };
    
        const response = await request(app)
            .post('/auth/register')
            .send(userData)
            .expect(400);
    
        expect(response.body.message).toEqual(["instance.password does not meet minimum length of 5"]);
    });

    it('should return a 400 error for invalid request data', async () => {
        const userData = {
            username: 123, // Invalid data type for username
            password: 'password123',
            first_name: 'Test',
            last_name: 'User',
            email: 'testuser4@email.com'
        };
    
        const response = await request(app)
            .post('/auth/register')
            .send(userData)
            .expect(400);
    
        expect(response.body.message).toContain('instance.username is not of a type(s) string');
    });

    it('should return a 400 error for duplicate email', async () => {
        const userData = {
                username: "u13",
                first_name: "U1F",
                last_name: "U1L",
                email: "user1@user.com",
                password: "password1"
        }
        const response = await request(app).post('/auth/register').send(userData).expect(400);
        expect(response.body.message).toBe('Duplicate email: user1@user.com');
    });

    it('should return a 400 error for duplicate username', async () => {
        const userData = {
                username: "u1",
                first_name: "U1F",
                last_name: "U1L",
                email: "user13@user.com",
                password: "password1"
        }
        const response = await request(app).post('/auth/register').send(userData).expect(400);
        expect(response.body.message).toBe('Duplicate username: u1');
    });
  });

/************************************** POST /auth/update */

describe("PUT /auth/update", function () {
    it('should update user information with correct data', async () => {
        const userData = {
            username: 'u1', // Username of the existing test user
            current_password: 'password1', 
            first_name: 'NewFirst', // New values for update
            last_name: 'NewLast',
            email: 'updated@email.com'
        };
    
        const response = await request(app)
            .put('/auth/update')
            .set('Authorization', `Bearer ${u1Token}`) // Set the token in request header
            .send(userData)
            .expect(201); 
    
        expect(response.body.updateUser.first_name).toBe('NewFirst');
        expect(response.body.updateUser.last_name).toBe('NewLast');
        expect(response.body.updateUser.email).toBe('updated@email.com');
       
    });

    it('should return a 401 error for incorrect current password', async () => {
        const userData = {
            username: 'u1', // Username of the existing test user
            current_password: 'password2', 
            first_name: 'NewFirst', // New values for update
            last_name: 'NewLast',
            email: 'updated@email.com'
        };
    
        const response = await request(app)
            .put('/auth/update')
            .set('Authorization', `Bearer ${u1Token}`) 
            .send(userData)
            .expect(401); 
    
        expect(response.body.message).toBe('Invalid username/password'); 
    });

    it('should return a 400 error for invalid request data', async () => {
    
        
        const userData = {
                username: 'u1', // Username of the existing test user
                current_password: 'password1', 
                first_name: 123, 
                last_name: 'NewLast',
                email: 'updated@email.com'
        };
    
        const response = await request(app)
            .put('/auth/update')
            .set('Authorization', `Bearer ${u1Token}`) 
            .send(userData)
            .expect(400); 
    
        expect(response.body.message).toEqual(["instance.first_name is not of a type(s) string"]);
    });
});

/************************************** POST /auth/update-password */

describe("PUT /auth/update-password", function () {
    it('should update the user password and allow login with the new credentials', async () => {
        const userData = {
            username: 'u1', 
            current_password: 'password1',
            password: 'newPassword123' // New password 
        };
    
        const response = await request(app)
            .put('/auth/update-password')
            .set('Authorization', `Bearer ${u1Token}`) 
            .send(userData)
            .expect(201); 
    
        expect(response.body.message).toBe('success'); 
    
        const loginData = {
            username: 'u1',
            password: 'newPassword123'
        };
    
        const loginResponse = await request(app)
            .post('/auth/login') // Assuming '/login' is your login route
            .send(loginData)
            .expect(200); 
    
        expect(loginResponse.body).toHaveProperty('token');
    });

    it('should return a 401 error for incorrect current password', async () => {
        const userData = {
            username: 'u1', 
            current_password: 'wrongPassword', // Incorrect password
            password: 'newPassword123'  
        };
    
        const response = await request(app)
            .put('/auth/update-password')
            .set('Authorization', `Bearer ${u1Token}`) 
            .send(userData)
            .expect(401); 
    
        expect(response.body.message).toBe('Invalid username/password'); 
    });

    it('should return a 400 error for invalid new password - too short', async () => {
        const userData = {
            username: 'u1', 
            current_password: 'password1',
            password: '123' // Invalid - too short, etc.  
        };
     
       const response = await request(app)
            .put('/auth/update-password')
            .set('Authorization', `Bearer ${u1Token}`) 
            .send(userData)
            .expect(400); 
    
            expect(response.body.message).toEqual(["instance.password does not meet minimum length of 5"]);
    });

    it('should return a 401 error for invalid or missing token', async () => {
        const userData = {
            username: 'u1',
            current_password: 'password1',
            password: 'newstrongpassword'
        };
    
        const response = await request(app)
            .put('/auth/update-password')
            // .set('Authorization', `Bearer ${u1Token}`) Intentionally omitting or providing an invalid token
            .send(userData)
            .expect(401);
    
        expect(response.body.message).toBe('Unauthorized'); 
    });

    it('should return a 401 error for different username in body vs token', async () => {
        const userData = {
            username: 'differentuser', // Different username than the one the token is for
            current_password: 'password1',
            password: 'newstrongpassword'
        };
    
        const response = await request(app)
            .put('/auth/update-password')
            .set('Authorization', `Bearer ${u1Token}`)
            .send(userData)
            .expect(401);

        expect(response.body.message).toBe('Unauthorized');
        });
})