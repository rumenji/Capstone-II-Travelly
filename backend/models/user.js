const db = require('../db'); // Your database connection module 

class User {
    static async register(username, password, firstName, lastName) {
        const sqlQuery = `
            INSERT INTO users (username, password, first_name, last_name) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, username;  
        `;

        try {
            const result = await db.query(sqlQuery, [username, password, firstName, lastName]);
            const newUser = result.rows[0];
            return newUser; 
        } catch (error) {
            // Handle potential errors (e.g., unique constraint violations)
            throw error; 
        }
    }

    static async findAll() {
        const sqlQuery = `SELECT id, username, first_name, last_name FROM users`;

        try {
            const result = await db.query(sqlQuery);
            return result.rows;
        } catch (error) {
            throw error; // Handle errors appropriately 
        }
    }

    static async findById(id) {
        const sqlQuery = `
            SELECT id, username, first_name, last_name 
            FROM users 
            WHERE id = $1; 
        `;

        try {
            const result = await db.query(sqlQuery, [id]);
            if (result.rows.length > 0) {
                return result.rows[0];  
            } else {
                return null; // Or throw a specific error if user is not found 
            }
            
        } catch (error) {
            throw error; // Handle errors
        }
    }
}

module.exports = User; 