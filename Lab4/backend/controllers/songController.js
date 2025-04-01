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
    // Join with artists and albums to get their names
    const query = `
        SELECT s.*, art.name as artist_name, alb.name as album_name
        FROM Songs s
        LEFT JOIN Artists art ON s.artist_id = art.id
        LEFT JOIN Albums alb ON s.album_id = alb.id
    `;
    
    connection.query(query, (err, results) => {
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
    
    // Join with artists and albums to get their names
    const query = `
        SELECT s.*, art.name as artist_name, alb.name as album_name
        FROM Songs s
        LEFT JOIN Artists art ON s.artist_id = art.id
        LEFT JOIN Albums alb ON s.album_id = alb.id
        WHERE s.id = ?
    `;
    
    connection.query(query, [id], (err, results) => {
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
    const { name, artist, album, releaseYear } = req.body;
    
    // Function to create a song with artist ID and album ID
    function createSongRecord(artistId, albumId) {
        connection.query(
            'INSERT INTO Songs (name, artist_id, album_id, release_year) VALUES (?, ?, ?, ?)',
            [name, artistId, albumId, releaseYear],
            (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                
                // Get the created song with artist and album details
                const query = `
                    SELECT s.*, art.name as artist_name, alb.name as album_name
                    FROM Songs s
                    LEFT JOIN Artists art ON s.artist_id = art.id
                    LEFT JOIN Albums alb ON s.album_id = alb.id
                    WHERE s.id = ?
                `;
                
                connection.query(query, [result.insertId], (err, results) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    res.status(201).json(results[0]);
                });
            }
        );
    }
    
    // If direct IDs are provided, use them
    if (req.body.artistId && req.body.albumId) {
        createSongRecord(req.body.artistId, req.body.albumId);
        return;
    }
    
    // Check if artist exists or create new
    function processArtist(callback) {
        if (req.body.artistId) {
            callback(req.body.artistId);
        } else if (artist) {
            connection.query('SELECT * FROM Artists WHERE name = ?', [artist], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                
                if (results.length > 0) {
                    // Artist exists
                    callback(results[0].id);
                } else {
                    // Create new artist
                    connection.query(
                        'INSERT INTO Artists (name, monthly_listeners, genre) VALUES (?, ?, ?)',
                        [artist, 0, 'Unknown'],
                        (err, result) => {
                            if (err) {
                                console.error('Database error:', err);
                                return res.status(500).json({ error: 'Internal server error' });
                            }
                            callback(result.insertId);
                        }
                    );
                }
            });
        } else {
            // No artist info
            callback(null);
        }
    }
    
    // Check if album exists or create new
    function processAlbum(artistId, callback) {
        if (req.body.albumId) {
            callback(req.body.albumId);
        } else if (album) {
            connection.query('SELECT * FROM Albums WHERE name = ? AND artist_id = ?', [album, artistId], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                
                if (results.length > 0) {
                    // Album exists
                    callback(results[0].id);
                } else {
                    // Create new album
                    connection.query(
                        'INSERT INTO Albums (name, artist_id, release_year, num_listens) VALUES (?, ?, ?, ?)',
                        [album, artistId, releaseYear, 0],
                        (err, result) => {
                            if (err) {
                                console.error('Database error:', err);
                                return res.status(500).json({ error: 'Internal server error' });
                            }
                            callback(result.insertId);
                        }
                    );
                }
            });
        } else {
            // No album info
            callback(null);
        }
    }
    
    processArtist(function(artistId) {
        processAlbum(artistId, function(albumId) {
            createSongRecord(artistId, albumId);
        });
    });
};

// Update song
exports.updateSong = (req, res) => {
    const { id } = req.params;
    const { name, artist, album, releaseYear } = req.body;
    
    // Function to update the song record
    function updateSongRecord(artistId, albumId) {
        connection.query(
            'UPDATE Songs SET name = ?, artist_id = ?, album_id = ?, release_year = ? WHERE id = ?',
            [name, artistId, albumId, releaseYear, id],
            (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Song not found' });
                }
                
                // Get the updated song with artist and album details
                const query = `
                    SELECT s.*, art.name as artist_name, alb.name as album_name
                    FROM Songs s
                    LEFT JOIN Artists art ON s.artist_id = art.id
                    LEFT JOIN Albums alb ON s.album_id = alb.id
                    WHERE s.id = ?
                `;
                
                connection.query(query, [id], (err, results) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    res.json(results[0]);
                });
            }
        );
    }
    
    // If direct IDs are provided, use them
    if (req.body.artistId !== undefined && req.body.albumId !== undefined) {
        updateSongRecord(req.body.artistId, req.body.albumId);
        return;
    }
    
    // Check if artist exists or create new
    function processArtist(callback) {
        if (req.body.artistId !== undefined) {
            callback(req.body.artistId);
        } else if (artist) {
            connection.query('SELECT * FROM Artists WHERE name = ?', [artist], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                
                if (results.length > 0) {
                    // Artist exists
                    callback(results[0].id);
                } else {
                    // Create new artist
                    connection.query(
                        'INSERT INTO Artists (name, monthly_listeners, genre) VALUES (?, ?, ?)',
                        [artist, 0, 'Unknown'],
                        (err, result) => {
                            if (err) {
                                console.error('Database error:', err);
                                return res.status(500).json({ error: 'Internal server error' });
                            }
                            callback(result.insertId);
                        }
                    );
                }
            });
        } else {
            // Get current artist_id
            connection.query('SELECT artist_id FROM Songs WHERE id = ?', [id], (err, results) => {
                if (err || results.length === 0) {
                    callback(null);
                } else {
                    callback(results[0].artist_id);
                }
            });
        }
    }
    
    // Check if album exists or create new
    function processAlbum(artistId, callback) {
        if (req.body.albumId !== undefined) {
            callback(req.body.albumId);
        } else if (album) {
            connection.query('SELECT * FROM Albums WHERE name = ? AND artist_id = ?', [album, artistId], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                
                if (results.length > 0) {
                    // Album exists
                    callback(results[0].id);
                } else {
                    // Create new album
                    connection.query(
                        'INSERT INTO Albums (name, artist_id, release_year, num_listens) VALUES (?, ?, ?, ?)',
                        [album, artistId, releaseYear, 0],
                        (err, result) => {
                            if (err) {
                                console.error('Database error:', err);
                                return res.status(500).json({ error: 'Internal server error' });
                            }
                            callback(result.insertId);
                        }
                    );
                }
            });
        } else {
            // Get current album_id
            connection.query('SELECT album_id FROM Songs WHERE id = ?', [id], (err, results) => {
                if (err || results.length === 0) {
                    callback(null);
                } else {
                    callback(results[0].album_id);
                }
            });
        }
    }
    
    processArtist(function(artistId) {
        processAlbum(artistId, function(albumId) {
            updateSongRecord(artistId, albumId);
        });
    });
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
