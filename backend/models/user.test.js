const Day = require("./day.js");
const User = require("./user.js");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
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

/************************************** authenticate */

describe("authenticate", function () {
    test("works", async function () {
      const user = await User.authenticate("u1", "password1");
      expect(user).toEqual({
        username: "u1"
      });
    });
  
    test("unauth if no such user", async function () {
      try {
        await User.authenticate("nope", "password");
        fail();
      } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      }
    });
  
    test("unauth if wrong password", async function () {
      try {
        await User.authenticate("c1", "wrong");
        fail();
      } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      }
    });
  });

  /************************************** register */

  describe("register", function () {
    const newUser = {
      username: "new",
      first_name: "Test",
      last_name: "Tester",
      email: "test@test.com"
    };
  
    test("works", async function () {
      let user = await User.register({
        ...newUser,
        password: "password",
      });
      expect(user).toEqual({first_name: "Test",
      last_name: "Tester",
      email: "test@test.com",
      username: "new"}
      );
      const found = await db.query("SELECT * FROM users WHERE username = 'new'");
      expect(found.rows.length).toEqual(1);
      expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });
  
  
    test("bad request with dup data", async function () {
      try {
        await User.register({
          ...newUser,
          password: "password",
        });
        await User.register({
          ...newUser,
          password: "password",
        });
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  });

  /************************************** get */

describe("get user", function () {
    test("works", async function () {
      let user = await User.get("u1");
      expect(user).toEqual({
        username: "u1",
        first_name: "U1F",
        last_name: "U1L",
        email: "u1@email.com",
        join_at: expect.any(Date),
        last_login_at: expect.any(Date),
      });
    });
  
    test("not found if no such user", async function () {
      try {
        await User.get("nope");
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  });

  /************************************** update */

describe("update", function () {
    const updateData = {
        username: "u1",
      first_name: "NewF",
      last_name: "NewF",
      email: "new@email.com"
    };
  
    test("works", async function () {
      const user = await User.update(updateData);
      expect(user).toEqual({first_name: "NewF",
      last_name: "NewF",
      email: "new@email.com"});
    });
  
    test("works: set password", async function () {
      const user = await User.updatePassword({username: "u1", password: "newPass"});
      expect(user).toEqual({message: "Password updated"});

      const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
      expect(found.rows.length).toEqual(1);
      expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });
  
    test("not found if no such user", async function () {
      try {
        await User.update({username: "nope",
          first_name: "test",
        });
        
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  
    test("bad request if no data", async function () {
      try {
        await User.update({username: "c1"});
        
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  });

/************************************** Get trips by username*/
describe('User.trips', () => {
    test('get future trips for user', async () => {
        
          const trips = await User.trips('u1');
          expect(trips).toEqual([{
            "days": [
              {
                "id": 1,
                "name": "03-23",
              },
            ],
            "from_date": expect.any(Date),
            "id": 1,
            "loc_lat": "48.8566",
            "loc_long": "2.3522",
            "location_name": "Paris",
            "name": "Trip to Paris",
            "to_date": expect.any(Date),
          },]);

      });

      test('get past trips for user', async () => {
        const trips = await User.trips('u1', 'past');
        expect(trips).toEqual([]);

    });
    })