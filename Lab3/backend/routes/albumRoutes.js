const express = require('express');
const { Client } = require('pg');

const router = express.Router();

// Function to create a new database client
function createClient() {
    return new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
}

// GET all albums
router.get('/', async (req, res) => {
    const client = createClient();
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM albums');
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.end();
    }
});

// GET album by id
router.get('/:id', async (req, res) => {
    const client = createClient();
    try {
        await client.connect();
        const { id } = req.params;
        const result = await client.query('SELECT * FROM albums WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Album not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.end();
    }
});

// POST new album
router.post('/', async (req, res) => {
    const client = createClient();
    try {
        await client.connect();
        const { title, artist, year, genre } = req.body;
        const result = await client.query(
            'INSERT INTO albums (title, artist, year, genre) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, artist, year, genre]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.end();
    }
});

module.exports = router;