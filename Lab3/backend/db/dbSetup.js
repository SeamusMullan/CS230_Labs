const mysql = require('mysql');
require('dotenv').config({ path: '../.env' });

// Create connection for database setup
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');

    // Create tables
    createTables();
});

// Create all necessary tables
function createTables() {

    // if any table exists, drop it first
    const dropSongs = `DROP TABLE IF EXISTS Songs`;
    const dropAlbums = `DROP TABLE IF EXISTS Albums`;
    const dropArtists = `DROP TABLE IF EXISTS Artists`; 

    // Create Artists table
    const createArtistsTable = `
        CREATE TABLE IF NOT EXISTS Artists (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            monthly_listeners INT,
            genre VARCHAR(100)
        )
    `;
    
    // Create Albums table
    const createAlbumsTable = `
        CREATE TABLE IF NOT EXISTS Albums (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            artist_id INT,
            release_year YEAR,
            num_listens INT,
            FOREIGN KEY (artist_id) REFERENCES Artists(id) ON DELETE CASCADE
        )
    `;
    
    // Create Songs table
    const createSongsTable = `
        CREATE TABLE IF NOT EXISTS Songs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            artist_id INT,
            album_id INT,
            release_year YEAR,
            FOREIGN KEY (artist_id) REFERENCES Artists(id) ON DELETE CASCADE,
            FOREIGN KEY (album_id) REFERENCES Albums(id) ON DELETE CASCADE
        )
    `;

    connection.query(dropSongs, (err) => {
        if (err) {
            console.error("Error Deleting Existing Table 'Songs':", err);
            return;
        }
        console.log('Deleted Existing Tables for Songs');
    });

    connection.query(dropAlbums, (err) => {
        if (err) {
            console.error("Error Deleting Existing Table 'Albums':", err);
            return;
        }
        console.log('Deleted Existing Tables for Albums');
    });

    connection.query(dropArtists, (err) => {
        if (err) {
            console.error("Error Deleting Existing Table 'Artists':", err);
            return;
        }
        console.log('Deleted Existing Tables for Artists');
    });
    
    // Execute queries
    connection.query(createArtistsTable, (err) => {
        if (err) {
            console.error('Error creating Artists table:', err);
            return;
        }
        console.log('Artists table created or already exists');
        
        connection.query(createAlbumsTable, (err) => {
            if (err) {
                console.error('Error creating Albums table:', err);
                return;
            }
            console.log('Albums table created or already exists');
            
            connection.query(createSongsTable, (err) => {
                if (err) {
                    console.error('Error creating Songs table:', err);
                    return;
                }
                console.log('Songs table created or already exists');
                
                // Close connection after all tables are created
                connection.end();
            });
        });
    });
}
