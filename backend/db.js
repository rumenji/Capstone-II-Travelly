require('dotenv').config()

const { Client } = require('pg');
const DB_URI = (process.env.NODE_ENV === "test")
? process.env.PG_TEST_DATABASE
: process.env.PG_DATABASE;

const client = new Client(DB_URI);
client.connect();

module.exports = client; 