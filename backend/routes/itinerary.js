const express = require('express');
const router = express.Router();

router.post('/itineraries', async (req, res) => {
    try {
        const { title, startDate, endDate, userId } = req.body;

        const result = await pool.query(
            'INSERT INTO itineraries (title, start_date, end_date, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, startDate, endDate, userId]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating itinerary' });
    }
})

router.get('/itineraries/:id', async (req, res) => {
    try {
        const itineraryId = req.params.id;

        const result = await pool.query(
            'SELECT * FROM itineraries WHERE id = $1',
            [itineraryId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching itinerary' });
    }
});