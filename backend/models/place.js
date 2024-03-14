const db = require('../db');
const { BadRequestError, NotFoundError } = require("../expressError");

class Place {

    static async create({id, name, category, address, position}) {
        
        const loc_lat = position.lat;
        const loc_long = position.lon;
        
        const sqlQuery = `
            INSERT INTO places (id, name, address, loc_long, loc_lat, category) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING id, name;  
        `;

        try {
            const result = await db.query(sqlQuery, [id, name, address, loc_long, loc_lat, category]);
            const newTrip = result.rows[0];
            return newTrip;
        } catch (error) {
            // Handle potential errors (e.g., unique constraint violations)
            throw new BadRequestError(`Error saving place: ${error}`, 400); 
        }
    }


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