const bcrypt = require("bcrypt");
const db = require("../db.js");
require('dotenv').config()
const BCRYPT_WORK_FACTOR = process.env.BCRYPT_WORK_FACTOR;


async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM trips");
  await db.query("ALTER SEQUENCE trips_id_seq RESTART WITH 1");
  await db.query("DELETE FROM days");
  await db.query("ALTER SEQUENCE days_id_seq RESTART WITH 1");
  await db.query("DELETE FROM places");
  // await db.query("ALTER SEQUENCE places_id_seq RESTART WITH 1");

  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email, join_at, last_login_at)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com', current_timestamp, current_timestamp),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com', current_timestamp, current_timestamp)
        RETURNING username`,
      [
        await bcrypt.hash("password1", +BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", +BCRYPT_WORK_FACTOR),
      ]);

  const testTrip = await db.query(
    `INSERT INTO trips (name, location_name, loc_long, loc_lat, from_date, to_date, user_username) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id;`, ["Trip to Paris", "Paris","2.3522","48.8566","2025-02-12","2025-02-19","u1"]
  )
  
 
  const testDay = await db.query(`INSERT INTO days (name, trip_id) 
  VALUES ($1, $2) 
  RETURNING id, name; `, ["03-23", 1 ])
  
    }
  

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
};