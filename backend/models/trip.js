const db = require('../db');
const { BadRequestError, NotFoundError } = require("../expressError");
const { getDaysToAdd, getDaysToDelete } = require("../helpers/dateRange");
const Day = require("./day");

class Trip {
    /**Creates trips - expects {name, location_name, loc_long, loc_lat, from_date, to_date, username}
     * => id
     */
    static async create({ name, location_name, loc_long, loc_lat, from_date, to_date, username }) {
        const sqlQuery = `
            INSERT INTO trips (name, location_name, loc_long, loc_lat, from_date, to_date, user_username) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id;  
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
    /**Gets a trip by ID - expects ID
     * => { trip: {id, name, location_name, loc_long, loc_lat, from_date, to_date, user_username, days: [{id, name},...]}}
     */
    static async get(id) {

        const sqlQueryTrip = `
        SELECT trips.id,
                trips.name,
                trips.location_name, 
                trips.loc_long, 
                trips.loc_lat, 
                trips.from_date, 
                trips.to_date,
                trips.user_username,
                json_agg(json_build_object('id', days.id,'name', days.name) ORDER BY TO_DATE(days.name, 'MM-DD')) AS days
        FROM trips
        LEFT JOIN 
                days ON trips.id = days.trip_id
        WHERE trips.id = $1
        GROUP BY 
                trips.id
        ORDER BY 
            trips.from_date;
        `;


        try {
            const tripResult = await db.query(sqlQueryTrip, [id]);
            const trip = tripResult.rows[0];
            if (!trip) throw new NotFoundError(`No trip: ${id}`);

            return trip;
        } catch (error) {
            // Handle potential errors (e.g., unique constraint violations)
            throw new BadRequestError(`Error getting trip: ${error}`, 400);
        }
    };

    /**Edit trip - expects {{name, from_date, to_date}, tripId}
     * => { editedTrip: {id, name, location_name, loc_long, loc_lat, from_date, to_date, user_username, days: [{id, name},...]}}
     */
    static async edit({ name, from_date, to_date }, tripId) {
        const sqlQuery = `
            UPDATE trips 
            SET name = $1, from_date = $2, to_date = $3
            WHERE id = $4
            RETURNING id;  
        `;

        const daysSqlQuery = `
                SELECT name
                FROM days
                WHERE trip_id = $1
                `;

        try {
            const trip = await db.query(sqlQuery, [name, from_date, to_date, tripId])
            //Get the current days of the trip
            const existingDaysResult = await db.query(daysSqlQuery, [tripId]);
            const existingDays = existingDaysResult.rows.map(row => row.name);
            //Get the days that need to be added after the edit
            const daysToAdd = getDaysToAdd(from_date, to_date, existingDays);
            //Get the days that need to be deleted after the edit
            const daysToDelete = getDaysToDelete(from_date, to_date, existingDays);
            daysToDelete.length > 0 && daysToDelete.map(day => Day.delete(day, tripId));
            daysToAdd.length > 0 && daysToAdd.map(day => Day.create({ name: day }, tripId));
            const editedTripId = trip.rows[0].id;
            return editedTripId;
        } catch (error) {
            // Handle potential errors (e.g., unique constraint violations)
            throw new BadRequestError(`Error saving trip: ${error}`, 400);
        }
    }
    /**Deletes a trip by ID */
    static async delete(id) {
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