const express = require('express');
const { Pool } = require('pg');

const router = express.Router();

// Create a PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// GET all songs
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Songs');
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET song by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM Songs WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Song not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST new song
router.post('/', async (req, res) => {
    try {
        const { title, artist, year, genre } = req.body;
        const result = await pool.query(
            'INSERT INTO songs (title, artist, year, genre) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, artist, year, genre]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;