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
            RETURNING id, name;  
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
        WHERE tp.day_id = $1
        ORDER BY tp.time_of_day ASC`;
        
        try {
            const resultDay = await db.query(sqlQueryDay, [id]);
            const day = resultDay.rows[0];
            if (!day) throw new NotFoundError(`No day: ${id}`);

            const resultPlaces = await db.query(sqlQueryPlaces, [id]);
            
            resultPlaces.rows[0] ? day.places = resultPlaces.rows : day.places = [];
            return day;
        } catch (error) {
            // Handle potential errors (e.g., unique constraint violations)
            throw new BadRequestError(`Error getting day: ${error}`, 400); 
        }   
    }

    /** Delete day by ID
     * => {id}
    */
    static async delete(name, tripId) {
        const sqlQueryDeleteDay = `
        DELETE FROM days
        WHERE trip_id = $2 AND name = $1`;

        
        try {
            const resultDay = await db.query(sqlQueryDeleteDay, [name, tripId]);
            return resultDay;
        } catch (error) {
            // Handle potential errors (e.g., unique constraint violations)
            throw new BadRequestError(`Error deleting day: ${error}`, 400); 
        }   
    }

    /**Save places to days or updates if exists
     * It first deletes all places from the database to make sure there aren't places that are left over
     * 
     * expects {dayId, places:[{id, time_of_day, time_to_visit}, ...]}
     */
    static async addPlace(dayId, place){
        try{
            const sqlQueryAdd = `
            INSERT INTO trips_places (day_id, place_id, time_of_day, time_to_visit)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (day_id, place_id) DO UPDATE
            SET time_of_day=$3, time_to_visit=$4
            RETURNING place_id;
            `
            const sqlQueryPlace = `
                SELECT p.id, p.name, p.address, p.loc_long, p.loc_lat, p.category, tp.time_to_visit, tp.time_of_day
                FROM places p
                JOIN trips_places tp
                ON tp.place_id = p.id
                WHERE tp.day_id = $1 AND p.id = $2`;

            const resultAddPlace = await db.query(sqlQueryAdd, [dayId, place.id, place.time_of_day, place.time_to_visit])
            const resultPlace = await db.query(sqlQueryPlace, [dayId, resultAddPlace.rows[0].place_id]);
            
            return resultPlace.rows[0]
        } catch (error) {
            throw new BadRequestError(`Error adding places to day: ${error}`, 400);
        }
    };

    static async editPlace(dayId, place){
        try{
            const sqlQueryEdit = `
            UPDATE trips_places
            SET time_of_day=$3, time_to_visit=$4
            WHERE day_id=$1 AND place_id=$2
            RETURNING place_id, time_of_day, time_to_visit;
            `

            const resultPlace = await db.query(sqlQueryEdit, [dayId, place.id, place.time_of_day, place.time_to_visit])
            return resultPlace.rows[0]
        } catch (error) {
            throw new BadRequestError(`Error editing places to day: ${error}`, 400);
        }
    };

    // /**Deletes relationship for places if no longer exists in a day after updating days 
    //  * Expects the dayId, and an array of places IDs
    // */
    static async deletePlace(dayId, placeId){
        const sqlQuery = `
        DELETE FROM trips_places
        WHERE day_id=$1 AND place_id=$2
        RETURNING place_id;`
        const response = await db.query(sqlQuery, [dayId, placeId])
        return response.rows[0]
    }
}

module.exports = Day;