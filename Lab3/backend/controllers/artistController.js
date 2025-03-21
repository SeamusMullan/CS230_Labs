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
    // Basic query to get artists
    connection.query('SELECT * FROM Artists', (err, artists) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // For each artist, get their albums and songs
        const artistsWithDetails = artists.map(artist => {
            return new Promise((resolve) => {
                // Get albums for this artist
                connection.query('SELECT * FROM Albums WHERE artist_id = ?', [artist.id], (err, albums) => {
                    if (err) {
                        console.error('Error getting albums:', err);
                        artist.albums = [];
                    } else {
                        artist.albums = albums;
                    }

                    // Get songs for this artist
                    connection.query('SELECT * FROM Songs WHERE artist_id = ?', [artist.id], (err, songs) => {
                        if (err) {
                            console.error('Error getting songs:', err);
                            artist.songs = [];
                        } else {
                            artist.songs = songs;
                        }
                        resolve(artist);
                    });
                });
            });
        });

        Promise.all(artistsWithDetails).then(completeArtists => {
            res.json(completeArtists);
        });
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
        
        const artist = results[0];
        
        // Get albums for this artist
        connection.query('SELECT * FROM Albums WHERE artist_id = ?', [id], (err, albums) => {
            if (err) {
                console.error('Error getting albums:', err);
                artist.albums = [];
            } else {
                artist.albums = albums;
            }

            // Get songs for this artist
            connection.query('SELECT * FROM Songs WHERE artist_id = ?', [id], (err, songs) => {
                if (err) {
                    console.error('Error getting songs:', err);
                    artist.songs = [];
                } else {
                    artist.songs = songs;
                }
                
                res.json(artist);
            });
        });
    });
};

// Create new artist
exports.createArtist = (req, res) => {
    const { name, monthlyListeners, genre, albums, songs } = req.body;
    
    connection.query(
        'INSERT INTO Artists (name, monthly_listeners, genre) VALUES (?, ?, ?)',
        [name, monthlyListeners, genre],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            const artistId = result.insertId;
            
            // Add albums if provided
            const albumPromises = [];
            if (albums && albums.length > 0) {
                albums.forEach(album => {
                    albumPromises.push(new Promise((resolve) => {
                        connection.query(
                            'INSERT INTO Albums (name, artist_id, release_year, num_listens) VALUES (?, ?, ?, ?)',
                            [album.name, artistId, album.releaseYear || new Date().getFullYear(), album.numListens || 0],
                            (err, albumResult) => {
                                if (err) {
                                    console.error('Error adding album:', err);
                                    resolve(null);
                                } else {
                                    resolve({
                                        id: albumResult.insertId,
                                        name: album.name
                                    });
                                }
                            }
                        );
                    }));
                });
            }
            
            Promise.all(albumPromises).then(createdAlbums => {
                // Add songs if provided
                const songPromises = [];
                if (songs && songs.length > 0) {
                    songs.forEach(song => {
                        // Find album if specified
                        let albumId = null;
                        if (song.album) {
                            const matchingAlbum = createdAlbums.find(a => a && a.name === song.album);
                            if (matchingAlbum) {
                                albumId = matchingAlbum.id;
                            }
                        }
                        
                        songPromises.push(new Promise((resolve) => {
                            connection.query(
                                'INSERT INTO Songs (name, artist_id, album_id, release_year) VALUES (?, ?, ?, ?)',
                                [song.name, artistId, albumId, song.releaseYear || new Date().getFullYear()],
                                (err) => {
                                    if (err) {
                                        console.error('Error adding song:', err);
                                    }
                                    resolve();
                                }
                            );
                        }));
                    });
                }
                
                Promise.all(songPromises).then(() => {
                    // Return the created artist with its relationships
                    connection.query('SELECT * FROM Artists WHERE id = ?', [artistId], (err, results) => {
                        if (err) {
                            console.error('Database error:', err);
                            return res.status(500).json({ error: 'Internal server error' });
                        }
                        
                        const createdArtist = results[0];
                        
                        // Get the albums
                        connection.query('SELECT * FROM Albums WHERE artist_id = ?', [artistId], (err, albums) => {
                            if (err) {
                                console.error('Error getting albums:', err);
                                createdArtist.albums = [];
                            } else {
                                createdArtist.albums = albums;
                            }
                            
                            // Get the songs
                            connection.query('SELECT * FROM Songs WHERE artist_id = ?', [artistId], (err, songs) => {
                                if (err) {
                                    console.error('Error getting songs:', err);
                                    createdArtist.songs = [];
                                } else {
                                    createdArtist.songs = songs;
                                }
                                
                                res.status(201).json(createdArtist);
                            });
                        });
                    });
                });
            });
        }
    );
};

// Update artist
exports.updateArtist = (req, res) => {
    const { id } = req.params;
    const { name, monthlyListeners, genre } = req.body;
    
    connection.query(
        'UPDATE Artists SET name = ?, monthly_listeners = ?, genre = ? WHERE id = ?',
        [name, monthlyListeners, genre, id],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Artist not found' });
            }
            
            // Update album and song artist references if the artist name changed
            if (name) {
                connection.query(
                    'UPDATE Albums SET artist = ? WHERE artist_id = ?',
                    [name, id],
                    (err) => {
                        if (err) {
                            console.error('Error updating album artist references:', err);
                        }
                    }
                );
                
                connection.query(
                    'UPDATE Songs SET artist = ? WHERE artist_id = ?',
                    [name, id],
                    (err) => {
                        if (err) {
                            console.error('Error updating song artist references:', err);
                        }
                    }
                );
            }
            
            connection.query('SELECT * FROM Artists WHERE id = ?', [id], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                
                const updatedArtist = results[0];
                
                // Get the albums
                connection.query('SELECT * FROM Albums WHERE artist_id = ?', [id], (err, albums) => {
                    if (err) {
                        console.error('Error getting albums:', err);
                        updatedArtist.albums = [];
                    } else {
                        updatedArtist.albums = albums;
                    }
                    
                    // Get the songs
                    connection.query('SELECT * FROM Songs WHERE artist_id = ?', [id], (err, songs) => {
                        if (err) {
                            console.error('Error getting songs:', err);
                            updatedArtist.songs = [];
                        } else {
                            updatedArtist.songs = songs;
                        }
                        
                        res.json(updatedArtist);
                    });
                });
            });
        }
    );
};

// Delete artist
exports.deleteArtist = (req, res) => {
    const { id } = req.params;
    
    // With ON DELETE CASCADE in the schema, we can just delete the artist
    // and MySQL will automatically remove related albums and songs
    connection.query('DELETE FROM Artists WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Artist not found' });
        }
        
        res.json({ message: 'Artist and all related records deleted successfully' });
    });
};
