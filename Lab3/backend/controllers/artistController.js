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
        console.log('Connected to MySQL database in artist controller');
    }
});

// Get all artists
exports.getAllArtists = (req, res) => {
    connection.query('SELECT * FROM Artists', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
};

// Get artist by ID
exports.getArtistById = (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM Artists WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Artist not found' });
        }
        
        res.json(results[0]);
    });
};

// Create new artist
exports.createArtist = (req, res) => {
    const { name, monthlyListeners, genre } = req.body;
    const albums = req.body.albums || [];
    const songs = req.body.songs || [];
    
    connection.query(
        'INSERT INTO Artists (name, monthly_listeners, genre, albums, songs) VALUES (?, ?, ?, ?, ?)',
        [name, monthlyListeners, genre, JSON.stringify(albums), JSON.stringify(songs)],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            connection.query('SELECT * FROM Artists WHERE id = ?', [result.insertId], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(201).json(results[0]);
            });
        }
    );
};

// Update artist
exports.updateArtist = (req, res) => {
    const { id } = req.params;
    const { name, monthlyListeners, genre } = req.body;
    const albums = req.body.albums || [];
    const songs = req.body.songs || [];
    
    connection.query(
        'UPDATE Artists SET name = ?, monthly_listeners = ?, genre = ?, albums = ?, songs = ? WHERE id = ?',
        [name, monthlyListeners, genre, JSON.stringify(albums), JSON.stringify(songs), id],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Artist not found' });
            }
            
            connection.query('SELECT * FROM Artists WHERE id = ?', [id], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.json(results[0]);
            });
        }
    );
};

// Delete artist
exports.deleteArtist = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM Artists WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Artist not found' });
        }
        
        res.json({ message: 'Artist deleted successfully' });
    });
};
