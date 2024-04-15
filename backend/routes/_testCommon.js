"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Trip = require("../models/trip");
const Day = require("../models/day");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM trips");
  await db.query("ALTER SEQUENCE trips_id_seq RESTART WITH 1");

  await User.register({
    username: "u1",
    first_name: "U1F",
    last_name: "U1L",
    email: "user1@user.com",
    password: "password1"
  });
  await User.register({
    username: "u2",
    first_name: "U2F",
    last_name: "U2L",
    email: "user2@user.com",
    password: "password2"
  });
  await User.register({
    username: "u3",
    first_name: "U3F",
    last_name: "U3L",
    email: "user3@user.com",
    password: "password3"
  });


await Trip.create({
	name: "Trip to Paris 4",
	location_name: "Paris",
	loc_long: "2.3522",
	loc_lat: "48.8566",
	from_date: "2025-02-12",
	to_date: "2025-02-19",
	username: "u1"
});

await Day.create({
  name: "02-12"
}, 1)
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


const u1Token = createToken({ username: "u1" });
const u2Token = createToken({ username: "u2" });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
 
};
