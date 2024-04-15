const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

exports.seed = async function(knex) {
  // Deletes ALL existing entries - adjust if needed
  await knex('users').del()

  const saltRounds = 10;

  const hashedPasswords = await Promise.all([
    bcrypt.hash('testtest', saltRounds),
    bcrypt.hash('testtest', saltRounds)
  ]);

  await knex('users').insert([
    { username: 'user1', password_hash: hashedPasswords[0] },
    { username: 'user2', password_hash: hashedPasswords[1] }
  ]);
};