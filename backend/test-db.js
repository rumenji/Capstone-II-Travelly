const db = require('./db');

db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Database connected. Current Time:', res.rows[0].now);
  }
});