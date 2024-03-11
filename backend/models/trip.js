const db = require('../db');
const { BadRequestError, NotFoundError } = require("../expressError");

class Trip {

    static async create({name, location_name, loc_long, loc_lat, from_date, to_date, username}) {
        const sqlQuery = `
            INSERT INTO trips (name, location_name, loc_long, loc_lat, from_date, to_date, user_username) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id, name;  
        `;

        try {
            const result = await db.query(sqlQuery, [name, location_name, loc_long, loc_lat, from_date, to_date, username]);
            const newTrip = result.rows[0];
            return newTrip;
        } catch (error) {
            // Handle potential errors (e.g., unique constraint violations)
            throw new BadRequestError(`Error saving trip: ${error}`, 400); 
        }
    }

    // static async getAll({username}){
    //     const sqlQuery = `
    //     SELECT name, location_name, loc_long, loc_lat, from_date, to_date, user_username
    //     FROM trips
    //     WHERE username = $1`;

    //     try {
    //         const result = await db.query(sqlQuery, [username]);
    //         const trip = result.rows[0];
    //         return trip;
    //     } catch (error) {
    //     // Handle potential errors (e.g., unique constraint violations)
    //     throw new BadRequestError(`Error getting trips: ${error}`, 400); 
    //     }
    // }

    static async get(id) {
        
        const sqlQuery = `
        SELECT id,
                name,
                location_name, 
                loc_long, 
                loc_lat, 
                from_date, 
                to_date
        FROM trips
        WHERE id = $1`;
        
        try {
            const result = await db.query(sqlQuery, [id]);
            const trip = result.rows[0];
            if (!trip) throw new NotFoundError(`No trip: ${id}`);
            return trip;
        } catch (error) {
            // Handle potential errors (e.g., unique constraint violations)
            throw new BadRequestError(`Error getting trip: ${error}`, 400); 
        }   
    }
}

module.exports = Trip;