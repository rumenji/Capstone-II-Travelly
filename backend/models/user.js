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

    /* register new user -- accepts {username, password, first_name, last_name}
     *  returns {username, password, first_name, last_name}
    */

    static async register({username, password, first_name, last_name, email}) {
        const duplicateCheckUsername = await db.query(
            `SELECT username
             FROM users
             WHERE username = $1`,
          [username],
      );

      const duplicateCheckEmail = await db.query(
        `SELECT username
         FROM users
         WHERE email = $1`,
      [email],
  );
  
      if (duplicateCheckUsername.rows[0]) {
        throw new BadRequestError(`Duplicate username: ${username}`);
      }

      if (duplicateCheckEmail.rows[0]) {
        throw new BadRequestError(`Duplicate email: ${email}`);
      }
  
        const hashedPassword = await bcrypt.hash(password, +BCRYPT_WORK_FACTOR);

        const sqlQuery = `
            INSERT INTO users (username, password, first_name, last_name, email, join_at, last_login_at) 
            VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp) 
            RETURNING username, first_name, last_name, email;
        `;

        
        const result = await db.query(sqlQuery, [username, hashedPassword, first_name, last_name, email]);
        const newUser = result.rows[0];
        return newUser;
    }

    /**Update user information - expects new password {username, password, first_name, last_name, email} 
     * if no new password - doesn't update the password in the database
     */
    static async update({username, password, first_name, last_name, email}) {
        const sqlQuerywoPassword = `UPDATE users
        SET first_name= $1, last_name=$2, email=$3
        WHERE username = $4
        RETURNING first_name, last_name, email
        `

        
        const result = await db.query(sqlQuerywoPassword, [first_name, last_name, email, username]);
        return result.rows[0]
        

    }

    /**Update user password - expects new password {username, password, current_password} 
     */
    static async updatePassword({username, password, current_password}) {
        const sqlQuerywPassword = `UPDATE users
                        SET password=$1
                        WHERE username = $2`

       
        const hashedPassword = await bcrypt.hash(password, +BCRYPT_WORK_FACTOR);
        await db.query(sqlQuerywPassword, [hashedPassword, username]);
        return {message: "Password updated"}

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

    /**Return upcoming trips for username
     * accepts {username}
     * returns [{location_name, loc_long, loc_lat, from_date, to_date, user_username}]
     */
    static async trips(username, searchPastTrips){
        let timeRange;
        searchPastTrips === 'past' ? timeRange = 'trips.to_date < CURRENT_DATE' : timeRange = '(trips.from_date >= CURRENT_DATE OR CURRENT_DATE BETWEEN trips.from_date AND trips.to_date)';
       
        const sqlQuery = `SELECT 
                                trips.id,
                                trips.name, 
                                trips.from_date, 
                                trips.to_date,
                                trips.location_name, 
                                trips.loc_long, 
                                trips.loc_lat,
                                json_agg(json_build_object('id', days.id,'name', days.name) ORDER BY days.name) AS days
                          FROM 
                              trips
                          LEFT JOIN 
                              days ON trips.id = days.trip_id
                          WHERE trips.user_username = $1 AND ${timeRange}
                          GROUP BY 
                              trips.id
                          ORDER BY 
                              trips.from_date;`
    
        try{
            const result = await db.query(sqlQuery, [username]);
            
            if (!result.rows) {
                throw new NotFoundError(`No trips for user: ${username}`, 200);
              }
              return result.rows;
        } catch (error) {
            throw new BadRequestError(`Couldn't fetch trips: ${error}`, 400);
        }
    }
}

module.exports = User; 