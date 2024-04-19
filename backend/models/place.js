const db = require('../db');
const { BadRequestError, NotFoundError } = require("../expressError");

class Place {
    /**Saves a place that is added to a day to the database.
     * Checks if already saved - returns the place
     */
    static async create({ id, name, category, address, position }) {
        const sqlGetQuery = `
        SELECT id, name, address, loc_long, loc_lat, category
        FROM places
        WHERE id = $1`;

        const sqlQuery = `
            INSERT INTO places (id, name, address, loc_long, loc_lat, category) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING id, name;  
        `;

        try {
            const resultGet = await db.query(sqlGetQuery, [id]);
            const place = resultGet.rows[0];
            if (place) return place
            const loc_lat = position.lat;
            const loc_long = position.lon;
            const result = await db.query(sqlQuery, [id, name, address, loc_long, loc_lat, category]);
            const newPlace = result.rows[0];
            return newPlace;
        } catch (error) {
            // Handle potential errors (e.g., unique constraint violations)
            throw new BadRequestError(`Error saving place: ${error}`, 400);
        }
    }

    /**Gets place by ID from the database */
    static async get(id) {
        const sqlQuery = `
        SELECT id, name, address, loc_long, loc_lat, category
        FROM places
        WHERE id = $1`;

        try {
            const result = await db.query(sqlQuery, [id]);
            const place = result.rows[0];
            if (!place) throw new NotFoundError(`No place: ${id}`);

            return place;
        } catch (error) {
            // Handle potential errors (e.g., unique constraint violations)
            throw new BadRequestError(`Error getting place: ${error}`, 400);
        }
    }
}

module.exports = Place;