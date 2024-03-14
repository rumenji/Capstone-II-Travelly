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


    static async get(id) {
        
        const sqlQueryTrip = `
        SELECT id,
                name,
                location_name, 
                loc_long, 
                loc_lat, 
                from_date, 
                to_date,
                user_username
        FROM trips
        WHERE id = $1`;
        
        const sqlQueryDays = `
        SELECT id, name
        FROM days
        WHERE trip_id=$1
        ORDER BY TO_DATE(name, 'MM-DD') ASC`;

        try {
            const tripResult = await db.query(sqlQueryTrip, [id]);
            const trip = tripResult.rows[0];
            if (!trip) throw new NotFoundError(`No trip: ${id}`);

            const daysResult = await db.query(sqlQueryDays, [id]);

            trip.days = daysResult.rows;

            return trip;
        } catch (error) {
            // Handle potential errors (e.g., unique constraint violations)
            throw new BadRequestError(`Error getting trip: ${error}`, 400); 
        }   
    };

    static async delete(id){
        try {
            const sqlQuery = `
            DELETE FROM trips
            WHERE id=$1;
            `
            await db.query(sqlQuery, [id]);
        } catch (error) {
            throw new BadRequestError(`Error deleting trip: ${error}`, 400);
        }
        
    }
}

module.exports = Trip;