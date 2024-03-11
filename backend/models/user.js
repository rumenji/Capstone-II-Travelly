/** User class */
const db = require('../db'); // Database connection module
const bcrypt = require("bcrypt");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
  } = require("../expressError");
require('dotenv').config()
const BCRYPT_WORK_FACTOR = process.env.BCRYPT_WORK_FACTOR;

/** User of the site. */

class User {

    /* register new user -- accepts {username, password, firstName, lastName}
     *  returns {username, password, firstName, lastName}
    */

    static async register({username, password, first_name, last_name, email}) {
        const duplicateCheck = await db.query(
            `SELECT username
             FROM users
             WHERE username = $1`,
          [username],
      );
  
      if (duplicateCheck.rows[0]) {
        throw new BadRequestError(`Duplicate username: ${username}`);
      }
  
        const hashedPassword = await bcrypt.hash(password, +BCRYPT_WORK_FACTOR);

        const sqlQuery = `
            INSERT INTO users (username, password, first_name, last_name, email, join_at, last_login_at) 
            VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp) 
            RETURNING username, password, first_name, last_name, email;
        `;

        
        const result = await db.query(sqlQuery, [username, hashedPassword, first_name, last_name, email]);
        const newUser = result.rows[0];
        return newUser;
    }

    /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const sqlQuery = "SELECT username, password FROM users WHERE username = $1";
    const result = await db.query(
        sqlQuery,
        [username]);
    const user = result.rows[0];

    if (user) {
        // compare hashed password to a new hash from password
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid === true) {
          delete user.password;
          return user;
        }
      }
  
      throw new UnauthorizedError("Invalid username/password");
  }

    /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const sqlQuery = `UPDATE users
    SET last_login_at = current_timestamp
    WHERE username = $1
    RETURNING username`;

    const result = await db.query(
        sqlQuery,
        [username]);

    if (!result.rows[0]) {
      throw new NotFoundError(`No such user: ${username}`, 404);
    }
  }

    /** All: basic info on all users:
   * [{username, first_name, last_name, email, join_at, last_login_at}, ...] */
    static async findAll() {
        const sqlQuery = `SELECT username, first_name, last_name, email, join_at, last_login_at
                            FROM users
                            ORDER BY username`;

        try {
            const result = await db.query(sqlQuery);
            if(result.rows.length === 0) {
                throw new NotFoundError(`No users found!`, 200);
            }

            return result.rows;
        } catch (error) {
            throw new BadRequestError(`Couldn't fetch users: ${error}`, 400);
        }
    }

    /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          email,
   *          join_at,
   *          last_login_at } */
    static async get(username) {
        const sqlQuery = `
            SELECT username, first_name, last_name, email, join_at, last_login_at
            FROM users 
            WHERE username = $1; 
        `;

        try {
            const result = await db.query(sqlQuery, [username]);
            if (!result.rows[0]) {
                throw new NotFoundError(`No such user: ${username}`, 404);
              }
          
              return result.rows[0];
            
        } catch (error) {
            throw new BadRequestError(`Couldn't fetch user: ${error}`, 400);
        }
    }

    /**Return trips for username
     * accepts {username}
     * returns [{location_name, loc_long, loc_lat, from_date, to_date, user_username}]
     */
    static async trips(username){
        const sqlQuery = `SELECT id,
                                 name,
                                 location_name, 
                                 loc_long, 
                                 loc_lat, 
                                 from_date, 
                                 to_date
                            FROM trips
                            WHERE user_username = $1`
        try{
            const result = await db.query(sqlQuery, [username]);
            if (!result.rows[0]) {
                throw new NotFoundError(`No trips for user: ${username}`, 200);
              }
              return result.rows[0];
        } catch (error) {
            throw new BadRequestError(`Couldn't fetch trips: ${error}`, 400);
        }
    }
}

module.exports = User; 