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
    const dropTherapists = `DROP TABLE IF EXISTS Therapists`;
    const dropClients = `DROP TABLE IF EXISTS Clients`;
    const dropSessions = `DROP TABLE IF EXISTS Sessions`;

    // Create Therapists table
    const createTherapistsTable = `
        CREATE TABLE IF NOT EXISTS Therapists (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255),
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            location VARCHAR(255),
            experience_years INT,
            taking_new_clients BOOLEAN DEFAULT TRUE
        )
    `;

    // Create Clients table
    const createClientsTable = `
        CREATE TABLE IF NOT EXISTS Clients (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(20),
            appointment_regularity VARCHAR(255),
            preferred_therapist INT,
            FOREIGN KEY (preferred_therapist) REFERENCES Therapists(id) ON DELETE SET NULL
        )
    `;

    // Create Sessions table
    const createSessionsTable = `
        CREATE TABLE IF NOT EXISTS Sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            client_id INT NOT NULL,
            therapist_id INT NOT NULL,
            notes TEXT,
            session_date DATETIME NOT NULL,
            length_minutes INT NOT NULL,
            FOREIGN KEY (client_id) REFERENCES Clients(id) ON DELETE CASCADE,
            FOREIGN KEY (therapist_id) REFERENCES Therapists(id) ON DELETE CASCADE
        )
    `;

    connection.query(dropTherapists, (err) => {
        if (err) {
            console.error("Error dropping Therapists table:", err);
            return;
        }
        console.log('Dropped Therapists table');
    });

    connection.query(dropClients, (err) => {
        if (err) {
            console.error("Error dropping Clients table:", err);
            return;
        }
        console.log('Dropped Clients table');
    });

    connection.query(dropSessions, (err) => {
        if (err) {
            console.error("Error dropping Sessions table:", err);
            return;
        }
        console.log('Dropped Sessions table');
    });

    // Execute queries
    connection.query(createTherapistsTable, (err) => {
        if (err) {
            console.error('Error creating Therapists table:', err);
            return;
        }
        console.log('Therapists table created or already exists');
    });

    connection.query(createClientsTable, (err) => {
        if (err) {
            console.error('Error creating Clients table:', err);
            return;
        }
        console.log('Clients table created or already exists');
    });

    connection.query(createSessionsTable, (err) => {
        if (err) {
            console.error('Error creating Sessions table:', err);
            return;
        }
        console.log('Sessions table created or already exists');

    });

    // Close connection after all tables are created
    connection.end();

}
