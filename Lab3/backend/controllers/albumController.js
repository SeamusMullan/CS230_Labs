const mysql = require('mysql');

// Create MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to database
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database in album controller');
    }
});

// Get all albums
exports.getAllAlbums = (req, res) => {
    connection.query('SELECT * FROM Albums', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
};

// Get album by ID
exports.getAlbumById = (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM Albums WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Album not found' });
        }
        
        res.json(results[0]);
    });
};

// Create new album
exports.createAlbum = (req, res) => {
    const { name, artist, releaseYear, numListens } = req.body;
    const songs = req.body.songs || [];
    
    connection.query(
        'INSERT INTO Albums (name, artist, release_year, num_listens, songs) VALUES (?, ?, ?, ?, ?)',
        [name, artist, releaseYear, numListens, JSON.stringify(songs)],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            connection.query('SELECT * FROM Albums WHERE id = ?', [result.insertId], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(201).json(results[0]);
            });
        }
    );
};

// Update album
exports.updateAlbum = (req, res) => {
    const { id } = req.params;
    const { name, artist, releaseYear, numListens } = req.body;
    const songs = req.body.songs || [];
    
    connection.query(
        'UPDATE Albums SET name = ?, artist = ?, release_year = ?, num_listens = ?, songs = ? WHERE id = ?',
        [name, artist, releaseYear, numListens, JSON.stringify(songs), id],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Album not found' });
            }
            
            connection.query('SELECT * FROM Albums WHERE id = ?', [id], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.json(results[0]);
            });
        }
    );
};

// Delete album
exports.deleteAlbum = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM Albums WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Album not found' });
        }
        
        res.json({ message: 'Album deleted successfully' });
    });
};
