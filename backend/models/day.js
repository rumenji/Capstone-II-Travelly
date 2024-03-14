const db = require('../db');
const { BadRequestError, NotFoundError } = require("../expressError");

class Day {
    /**Creates days on trip save
     * expects {name: string, trip_id}
     * => {id, name, trip_id}
     */
    static async create({name}, trip_id) {
        const sqlQuery = `
            INSERT INTO days (name, trip_id) 
            VALUES ($1, $2) 
            RETURNING id, name, trip_id;  
        `;

        try {
            const result = await db.query(sqlQuery, [name, trip_id]);
            const newDay = result.rows[0];
            return newDay;
        } catch (error) {
            // Handle potential errors (e.g., unique constraint violations)
            throw new BadRequestError(`Error saving day: ${error}`, 400); 
        }
    }

    /** Get day by ID
     * => {id, name, trip_id, places: [{id, name, address, loc_long, loc_lat, category, time_to_visit, time_of_day}, ...]}
    */
    static async get(id) {
        const sqlQueryDay = `
        SELECT id,
                name,
                trip_id
        FROM days
        WHERE id = $1`;

        const sqlQueryPlaces = `
        SELECT p.id, p.name, p.address, p.loc_long, p.loc_lat, p.category, tp.time_to_visit, tp.time_of_day
        FROM places p
        JOIN trips_places tp
        ON tp.place_id = p.id
        WHERE tp.day_id = $1`;
        
        try {
            const resultDay = await db.query(sqlQueryDay, [id]);
            const day = resultDay.rows[0];
            if (!day) throw new NotFoundError(`No day: ${id}`);

            const resultPlaces = await db.query(sqlQueryPlaces, [id]);

            day.places = [resultPlaces.rows[0]]
            return day;
        } catch (error) {
            // Handle potential errors (e.g., unique constraint violations)
            throw new BadRequestError(`Error getting day: ${error}`, 400); 
        }   
    }

    /**Save places to days or updates if exists
     * It first deletes all places from the database to make sure there aren't places that are left over
     * 
     * expects {dayId, places:[{id, time_of_day, time_to_visit}, ...]}
     */
    static async addPlaces(dayId, {places}){
        try{
            const sqlQueryDelete = `DELETE FROM trips_places
            WHERE day_id=$1`;

            const sqlQueryAdd = `
            INSERT INTO trips_places (day_id, place_id, time_of_day, time_to_visit)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (day_id, place_id) DO UPDATE
            SET time_of_day=$3, time_to_visit=$4;
            `

            await db.query(sqlQueryDelete, [dayId]);

            places.map(async place => await db.query(sqlQueryAdd, [dayId, place.id, place.time_of_day, place.time_to_visit]))
        } catch (error) {
            throw new BadRequestError(`Error adding places to day: ${error}`, 400);
        }
    };

    // /**Deletes relationship for places if no longer exists in a day after updating days 
    //  * Expects the dayId, and an array of places IDs
    // */
    // static async deletePlaces(dayId, placeIds){
    //     const sqlQuery = `
    //     DELETE FROM trips_places
    //     WHERE day_id=$1 AND place_id != ALL($2);`
    //     await db.query(sqlQuery, [dayId, placeIds])

    // }
}

module.exports = Day;