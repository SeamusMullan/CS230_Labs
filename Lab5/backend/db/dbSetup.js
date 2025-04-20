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

    // Drop existing tables first (in reverse order of creation if foreign keys exist)
    const dropJourneyPlans = `DROP TABLE IF EXISTS JourneyPlans`;
    const dropTravelLogs = `DROP TABLE IF EXISTS TravelLogs`;
    const dropUsers = `DROP TABLE IF EXISTS Users`;
    // Drop old tables if they might exist from previous state
    const dropSessions = `DROP TABLE IF EXISTS Sessions`;
    const dropClients = `DROP TABLE IF EXISTS Clients`;
    const dropTherapists = `DROP TABLE IF EXISTS Therapists`;

    // Create Users table
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL, -- Increased length for bcrypt hash
            email VARCHAR(100) NOT NULL UNIQUE,
            address VARCHAR(255)
            -- Note: travel logs and journey plans are linked via foreign keys in their respective tables, not stored as arrays here.
        )
    `;

    // Create TravelLogs table
    const createTravelLogsTable = `
        CREATE TABLE IF NOT EXISTS TravelLogs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            post_date DATE NOT NULL,
            tags TEXT, -- Storing JSON array as string
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
        )
    `;

    // Create JourneyPlans table
    const createJourneyPlansTable = `
        CREATE TABLE IF NOT EXISTS JourneyPlans (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            locations TEXT, -- Storing JSON array as string
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            activities TEXT, -- Storing JSON array as string
            description TEXT,
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
        )
    `;

    // Execute drop queries
    connection.query(dropSessions, (err) => {
        if (err) console.error("Error Dropping Table 'Sessions':", err);
        else console.log("Dropped Table 'Sessions' (if existed)");

        connection.query(dropClients, (err) => {
            if (err) console.error("Error Dropping Table 'Clients':", err);
            else console.log("Dropped Table 'Clients' (if existed)");

            connection.query(dropTherapists, (err) => {
                if (err) console.error("Error Dropping Table 'Therapists':", err);
                else console.log("Dropped Table 'Therapists' (if existed)");

                connection.query(dropJourneyPlans, (err) => {
                    if (err) console.error("Error Dropping Table 'JourneyPlans':", err);
                    else console.log("Dropped Table 'JourneyPlans' (if existed)");

                    connection.query(dropTravelLogs, (err) => {
                        if (err) console.error("Error Dropping Table 'TravelLogs':", err);
                        else console.log("Dropped Table 'TravelLogs' (if existed)");

                        connection.query(dropUsers, (err) => {
                            if (err) console.error("Error Dropping Table 'Users':", err);
                            else console.log("Dropped Table 'Users' (if existed)");

                            // Execute create queries
                            connection.query(createUsersTable, (err) => {
                                if (err) {
                                    console.error('Error creating Users table:', err);
                                    connection.end(); // Close connection on critical error
                                    return;
                                }
                                console.log('Users table created or already exists');

                                connection.query(createTravelLogsTable, (err) => {
                                    if (err) {
                                        console.error('Error creating TravelLogs table:', err);
                                        connection.end(); // Close connection on critical error
                                        return;
                                    }
                                    console.log('TravelLogs table created or already exists');

                                    connection.query(createJourneyPlansTable, (err) => {
                                        if (err) {
                                            console.error('Error creating JourneyPlans table:', err);
                                        } else {
                                            console.log('JourneyPlans table created or already exists');
                                        }
                                        // Close connection after all tables are attempted
                                        connection.end();
                                        console.log('Database setup complete. Connection closed.');
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}
