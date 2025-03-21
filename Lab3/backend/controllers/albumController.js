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

// Get all albums with artist details and songs
exports.getAllAlbums = (req, res) => {
    const query = `
        SELECT a.*, art.name as artist_name
        FROM Albums a
        LEFT JOIN Artists art ON a.artist_id = art.id
    `;
    
    connection.query(query, (err, albums) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Get songs for each album
        const albumsWithSongs = albums.map(album => {
            return new Promise((resolve) => {
                connection.query(
                    `SELECT s.*, art.name as artist_name 
                     FROM Songs s 
                     LEFT JOIN Artists art ON s.artist_id = art.id
                     WHERE s.album_id = ?`, 
                    [album.id], 
                    (err, songs) => {
                        if (err) {
                            console.error('Error getting songs:', err);
                            album.songs = [];
                        } else {
                            album.songs = songs;
                        }
                        resolve(album);
                    }
                );
            });
        });

        Promise.all(albumsWithSongs).then(completeAlbums => {
            res.json(completeAlbums);
        });
    });
};

// Get album by ID
exports.getAlbumById = (req, res) => {
    const { id } = req.params;
    
    const query = `
        SELECT a.*, art.name as artist_name
        FROM Albums a
        LEFT JOIN Artists art ON a.artist_id = art.id
        WHERE a.id = ?
    `;
    
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Album not found' });
        }
        
        const album = results[0];
        
        // Get songs for this album
        connection.query(
            `SELECT s.*, art.name as artist_name 
             FROM Songs s 
             LEFT JOIN Artists art ON s.artist_id = art.id
             WHERE s.album_id = ?`, 
            [id], 
            (err, songs) => {
                if (err) {
                    console.error('Error getting songs:', err);
                    album.songs = [];
                } else {
                    album.songs = songs;
                }
                
                res.json(album);
            }
        );
    });
};

// Create new album
exports.createAlbum = (req, res) => {
    const { name, artist, releaseYear, numListens, songs } = req.body;
    
    // First check if the artist exists or create a new one
    connection.query('SELECT * FROM Artists WHERE name = ?', [artist], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        let artistId;
        
        if (results.length > 0) {
            // Artist exists, use the existing ID
            artistId = results[0].id;
            createAlbumWithArtist(artistId);
        } else if (req.body.artistId) {
            // Use provided artist ID
            artistId = req.body.artistId;
            createAlbumWithArtist(artistId);
        } else {
            // Artist doesn't exist, create a new one
            connection.query(
                'INSERT INTO Artists (name, monthly_listeners, genre) VALUES (?, ?, ?)',
                [artist, 0, 'Unknown'],
                (err, result) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    
                    artistId = result.insertId;
                    createAlbumWithArtist(artistId);
                }
            );
        }
    });
    
    function createAlbumWithArtist(artistId) {
        connection.query(
            'INSERT INTO Albums (name, artist_id, release_year, num_listens) VALUES (?, ?, ?, ?)',
            [name, artistId, releaseYear, numListens],
            (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                
                const albumId = result.insertId;
                
                // Add songs if provided
                if (songs && Array.isArray(songs) && songs.length > 0) {
                    const songPromises = songs.map(song => {
                        return new Promise((resolve) => {
                            // Check if song exists by ID
                            if (song.id) {
                                // Update existing song to associate with this album
                                connection.query(
                                    'UPDATE Songs SET album_id = ? WHERE id = ?',
                                    [albumId, song.id],
                                    (err) => {
                                        if (err) {
                                            console.error('Error updating song:', err);
                                        }
                                        resolve();
                                    }
                                );
                            } else {
                                // Create new song
                                connection.query(
                                    'INSERT INTO Songs (name, artist_id, album_id, release_year) VALUES (?, ?, ?, ?)',
                                    [song.name, song.artist_id || artistId, albumId, releaseYear],
                                    (err) => {
                                        if (err) {
                                            console.error('Error adding song:', err);
                                        }
                                        resolve();
                                    }
                                );
                            }
                        });
                    });
                    
                    Promise.all(songPromises).then(() => {
                        getAlbumWithSongs(albumId);
                    });
                } else {
                    getAlbumWithSongs(albumId);
                }
            }
        );
    }
    
    function getAlbumWithSongs(albumId) {
        const query = `
            SELECT a.*, art.name as artist_name
            FROM Albums a
            LEFT JOIN Artists art ON a.artist_id = art.id
            WHERE a.id = ?
        `;
        
        connection.query(query, [albumId], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            const album = results[0];
            
            // Get songs for this album
            connection.query(
                `SELECT s.*, art.name as artist_name 
                 FROM Songs s 
                 LEFT JOIN Artists art ON s.artist_id = art.id
                 WHERE s.album_id = ?`, 
                [albumId], 
                (err, songs) => {
                    if (err) {
                        console.error('Error getting songs:', err);
                        album.songs = [];
                    } else {
                        album.songs = songs;
                    }
                    
                    res.status(201).json(album);
                }
            );
        });
    }
};

// Update album
exports.updateAlbum = (req, res) => {
    const { id } = req.params;
    const { name, artist, releaseYear, numListens, songs } = req.body;
    
    // Check if artist exists or create new one
    function updateAlbumRecord(artistId) {
        connection.query(
            'UPDATE Albums SET name = ?, artist_id = ?, release_year = ?, num_listens = ? WHERE id = ?',
            [name, artistId, releaseYear, numListens, id],
            (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Album not found' });
                }
                
                // Update song associations if provided
                if (songs && Array.isArray(songs) && songs.length > 0) {
                    // First, get existing songs for this album to find which ones need to be removed
                    connection.query('SELECT id FROM Songs WHERE album_id = ?', [id], (err, existingSongs) => {
                        if (err) {
                            console.error('Error getting existing songs:', err);
                        } else {
                            // Identify song IDs that are in the database but not in the request
                            const existingIds = existingSongs.map(s => s.id);
                            const requestIds = songs.filter(s => s.id).map(s => s.id);
                            
                            // Remove album association from songs not in the updated list
                            const songsToRemove = existingIds.filter(existingId => !requestIds.includes(existingId));
                            
                            if (songsToRemove.length > 0) {
                                connection.query(
                                    'UPDATE Songs SET album_id = NULL WHERE id IN (?)',
                                    [songsToRemove],
                                    (err) => {
                                        if (err) {
                                            console.error('Error removing song associations:', err);
                                        }
                                    }
                                );
                            }
                        }
                        
                        // Process the songs in the request
                        const songPromises = songs.map(song => {
                            return new Promise((resolve) => {
                                if (song.id) {
                                    // Update existing song to associate with this album
                                    connection.query(
                                        'UPDATE Songs SET album_id = ? WHERE id = ?',
                                        [id, song.id],
                                        (err) => {
                                            if (err) {
                                                console.error('Error updating song:', err);
                                            }
                                            resolve();
                                        }
                                    );
                                } else {
                                    // Create new song
                                    connection.query(
                                        'INSERT INTO Songs (name, artist_id, album_id, release_year) VALUES (?, ?, ?, ?)',
                                        [song.name, song.artist_id || artistId, id, releaseYear],
                                        (err) => {
                                            if (err) {
                                                console.error('Error adding song:', err);
                                            }
                                            resolve();
                                        }
                                    );
                                }
                            });
                        });
                        
                        Promise.all(songPromises).then(() => {
                            // Get updated album with all songs
                            getUpdatedAlbum();
                        });
                    });
                } else {
                    getUpdatedAlbum();
                }
                
                function getUpdatedAlbum() {
                    // Get the updated album with songs
                    const query = `
                        SELECT a.*, art.name as artist_name
                        FROM Albums a
                        LEFT JOIN Artists art ON a.artist_id = art.id
                        WHERE a.id = ?
                    `;
                    
                    connection.query(query, [id], (err, results) => {
                        if (err) {
                            console.error('Database error:', err);
                            return res.status(500).json({ error: 'Internal server error' });
                        }
                        
                        const album = results[0];
                        
                        // Get songs for this album
                        connection.query(
                            `SELECT s.*, art.name as artist_name 
                             FROM Songs s 
                             LEFT JOIN Artists art ON s.artist_id = art.id
                             WHERE s.album_id = ?`, 
                            [id], 
                            (err, songs) => {
                                if (err) {
                                    console.error('Error getting songs:', err);
                                    album.songs = [];
                                } else {
                                    album.songs = songs;
                                }
                                
                                res.json(album);
                            }
                        );
                    });
                }
            }
        );
    }
    
    // If artistId is directly provided, use it
    if (req.body.artistId) {
        updateAlbumRecord(req.body.artistId);
    } 
    // Otherwise lookup by name
    else if (artist) {
        connection.query('SELECT * FROM Artists WHERE name = ?', [artist], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            if (results.length > 0) {
                // Artist exists, use the existing ID
                updateAlbumRecord(results[0].id);
            } else {
                // Artist doesn't exist, create a new one
                connection.query(
                    'INSERT INTO Artists (name, monthly_listeners, genre) VALUES (?, ?, ?)',
                    [artist, 0, 'Unknown'],
                    (err, result) => {
                        if (err) {
                            console.error('Database error:', err);
                            return res.status(500).json({ error: 'Internal server error' });
                        }
                        
                        updateAlbumRecord(result.insertId);
                    }
                );
            }
        });
    } else {
        // No artist info provided, just update the album
        connection.query(
            'UPDATE Albums SET name = ?, release_year = ?, num_listens = ? WHERE id = ?',
            [name, releaseYear, numListens, id],
            (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Album not found' });
                }
                
                // Get the updated album
                connection.query('SELECT * FROM Albums WHERE id = ?', [id], (err, results) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    res.json(results[0]);
                });
            }
        );
    }
};

// Delete album
exports.deleteAlbum = (req, res) => {
    const { id } = req.params;
    
    // With ON DELETE CASCADE in the schema, we can just delete the album
    // and MySQL will automatically remove related songs
    connection.query('DELETE FROM Albums WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Album not found' });
        }
        
        res.json({ message: 'Album and all related songs deleted successfully' });
    });
};
