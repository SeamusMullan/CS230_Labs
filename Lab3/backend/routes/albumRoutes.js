const express = require('express');
const mysql = require('mysql');

const router = express.Router();

// Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // port: process.env.DB_PORT,
});

// Connect to database
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// GET all albums
router.get('/', (req, res) => {
    db.query('SELECT * FROM Albums', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// GET album by id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Albums WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Album not found' });
        }
        
        res.json(results[0]);
    });
});

// POST new album
router.post('/', (req, res) => {
    const { title, artist, year, genre } = req.body;
    db.query(
        'INSERT INTO Albums (title, artist, year, genre) VALUES (?, ?, ?, ?)',
        [title, artist, year, genre],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            db.query('SELECT * FROM Albums WHERE id = ?', [result.insertId], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(201).json(results[0]);
            });
        }
    );
});

module.exports = router;