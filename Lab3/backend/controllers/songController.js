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
        console.log('Connected to MySQL database in song controller');
    }
});

// Get all songs
exports.getAllSongs = (req, res) => {
    connection.query('SELECT * FROM Songs', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
};

// Get song by ID
exports.getSongById = (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM Songs WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Song not found' });
        }
        
        res.json(results[0]);
    });
};

// Create new song
exports.createSong = (req, res) => {
    const { name, artist, releaseYear } = req.body;
    const album = req.body.album || {};
    
    connection.query(
        'INSERT INTO Songs (name, artist, release_year, album) VALUES (?, ?, ?, ?)',
        [name, artist, releaseYear, JSON.stringify(album)],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            connection.query('SELECT * FROM Songs WHERE id = ?', [result.insertId], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(201).json(results[0]);
            });
        }
    );
};

// Update song
exports.updateSong = (req, res) => {
    const { id } = req.params;
    const { name, artist, releaseYear } = req.body;
    const album = req.body.album || {};
    
    connection.query(
        'UPDATE Songs SET name = ?, artist = ?, release_year = ?, album = ? WHERE id = ?',
        [name, artist, releaseYear, JSON.stringify(album), id],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Song not found' });
            }
            
            connection.query('SELECT * FROM Songs WHERE id = ?', [id], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.json(results[0]);
            });
        }
    );
};

// Delete song
exports.deleteSong = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM Songs WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Song not found' });
        }
        
        res.json({ message: 'Song deleted successfully' });
    });
};
